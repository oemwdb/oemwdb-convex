/**
 * Import CSVs from scraping output into Convex workshop staging tables.
 *
 * Uses: dotenv, fs, path, native fetch for Convex HTTP API.
 * Run from project root: npx tsx scripts/import-csvs-to-workshop.ts
 *
 * Reads: ~/oemwdb/scraping/data/output/*.csv
 * Maps: oem_* → ws_* (jlr→jaguar, orf_audi→audi, orf_vw→vw)
 * Skips: oem_porsche_wheel_variants_merged.csv
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import os from "os";

const CONVEX_URL = process.env.VITE_CONVEX_URL!;
const OUTPUT_DIR = path.join(os.homedir(), "oemwdb", "scraping", "data", "output");

const required = [["VITE_CONVEX_URL", CONVEX_URL]] as const;
for (const [name, value] of required) {
  if (!value || String(value).trim() === "") {
    throw new Error(
      `Missing env: ${name}. Set in .env.local and run from project root.`
    );
  }
}

type ConvexSuccess = { status: "success"; value: unknown };
type ConvexError = {
  status: "error";
  errorMessage?: string;
  errorData?: unknown;
};

/** Full error payload for logging (includes raw response body). */
type ConvexMutationErrorPayload = {
  path: string;
  httpStatus: number;
  errorMessage?: string;
  errorData?: unknown;
  fullBody: string;
};

async function convexMutation(
  pathName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/mutation`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathName, args, format: "json" }),
  });
  const text = await res.text();
  let json: ConvexSuccess | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess | ConvexError;
  } catch {
    const payload: ConvexMutationErrorPayload = {
      path: pathName,
      httpStatus: res.status,
      fullBody: text,
    };
    throw Object.assign(new Error(`Convex mutation failed: HTTP ${res.status}`), {
      payload,
    });
  }
  if (json.status !== "success") {
    const err = json as ConvexError;
    const payload: ConvexMutationErrorPayload = {
      path: pathName,
      httpStatus: res.status,
      errorMessage: err.errorMessage,
      errorData: err.errorData,
      fullBody: text,
    };
    const e = Object.assign(
      new Error(err.errorMessage ?? "Unknown Convex error"),
      { payload }
    );
    throw e;
  }
  return json.value;
}

/** Parse a single CSV line (handles quoted fields with commas). */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let s = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            s += '"';
            i += 2;
          } else {
            i++;
            break;
          }
        } else {
          s += line[i];
          i++;
        }
      }
      out.push(s);
      if (line[i] === ",") i++;
    } else {
      const comma = line.indexOf(",", i);
      if (comma === -1) {
        out.push(line.slice(i).replace(/^"|"$/g, "").trim());
        break;
      }
      out.push(line.slice(i, comma).trim());
      i = comma + 1;
    }
  }
  return out;
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

/** Map CSV filename to ws_ table name. Returns null to skip. */
function filenameToTable(filename: string): string | null {
  const base = filename.replace(/\.csv$/i, "");
  if (base === "oem_porsche_wheel_variants_merged") return null;
  if (!base.startsWith("oem_")) return null;
  let table = "ws_" + base.slice(4);
  if (table.startsWith("ws_jlr_")) table = "ws_jaguar_" + table.slice(7);
  else if (table.startsWith("ws_orf_audi_")) table = "ws_audi_" + table.slice(12);
  else if (table.startsWith("ws_orf_vw_")) table = "ws_vw_" + table.slice(10);
  return table;
}

/** Infer brand from table name for fallback (e.g. ws_mercedes_wheels → mercedes). */
function brandFromTable(table: string): string {
  const m = table.match(/^ws_([a-z0-9_]+)_/);
  return m ? m[1].replace(/_/g, " ") : "";
}

/** Build workshop row from CSV row and table. */
function rowToWorkshop(
  csvRow: Record<string, string>,
  table: string
): { source_id?: string; title?: string; brand?: string; status: string; imported_at: string; data: string } {
  const keys = Object.keys(csvRow);
  const firstCol = keys[0];
  const source_id = csvRow.id ?? csvRow[firstCol] ?? undefined;
  const title =
    csvRow.title ?? csvRow.name ?? csvRow.model ?? (firstCol ? csvRow[firstCol] : undefined) ?? "";
  const brand =
    csvRow.brand ?? csvRow.brand_id ?? (brandFromTable(table) || undefined);
  return {
    source_id: source_id?.trim() || undefined,
    title: title?.trim() || undefined,
    brand: brand?.trim() || undefined,
    status: "raw",
    imported_at: new Date().toISOString(),
    data: JSON.stringify(csvRow),
  };
}

const BATCH_SIZE = 50;

const MUTATION_PATH = "migrations:insertWorkshopRow";

async function processFile(
  filePath: string,
  table: string
): Promise<{ inserted: number; errors: string[]; firstErrorPayload?: ConvexMutationErrorPayload }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows = parseCsv(content);
  const errors: string[] = [];
  let inserted = 0;
  let firstErrorPayload: ConvexMutationErrorPayload | undefined;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (csvRow) => {
        const row = rowToWorkshop(csvRow, table);
        try {
          await convexMutation(MUTATION_PATH, { table, row });
          return { ok: true as const };
        } catch (e) {
          const err = e as Error & { payload?: ConvexMutationErrorPayload };
          return {
            ok: false as const,
            err: err.message,
            payload: err.payload,
          };
        }
      })
    );
    for (const r of results) {
      if (r.ok) inserted++;
      else {
        errors.push(r.err);
        if (r.payload && !firstErrorPayload) firstErrorPayload = r.payload;
      }
    }
  }
  return { inserted, errors, firstErrorPayload };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error("Output dir not found:", OUTPUT_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".csv"));
  console.log(`Found ${files.length} CSV(s) in ${OUTPUT_DIR}\n`);
  for (const filename of files.sort()) {
    const table = filenameToTable(filename);
    if (table === null) {
      console.log(`${filename} → skip (excluded)`);
      continue;
    }
    const filePath = path.join(OUTPUT_DIR, filename);
    try {
      const { inserted, errors, firstErrorPayload } = await processFile(filePath, table);
      if (firstErrorPayload) {
        console.error(`\n[First error for ${filename} — full Convex response body:]`);
        console.error(firstErrorPayload.fullBody);
        console.error(`[path: ${firstErrorPayload.path}, httpStatus: ${firstErrorPayload.httpStatus}]\n`);
      }
      const errStr = errors.length ? `, ${errors.length} error(s): ${errors.slice(0, 2).join("; ")}` : "";
      console.log(`${filename} → ${table}, inserted: ${inserted}${errStr}`);
    } catch (e) {
      console.log(`${filename} → ${table}, error: ${e}`);
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
