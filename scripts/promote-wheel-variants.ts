/**
 * Promote ws_[brand]_wheel_variants workshop data into oem_wheel_variants and junctions.
 *
 * ENV: .env.local with VITE_CONVEX_URL
 * Run from project root: npx tsx scripts/promote-wheel-variants.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;
const required = [["VITE_CONVEX_URL", CONVEX_URL]] as const;
for (const [name, value] of required) {
  if (!value || String(value).trim() === "") {
    throw new Error(
      `Missing env: ${name}. Set in .env.local and run from project root.`
    );
  }
}

const BASE = CONVEX_URL.replace(/\/$/, "");

async function convexQuery(path: string, args: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const data = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
  if (data.status === "error") throw new Error(data.errorMessage ?? "Query failed");
  return data.value;
}

async function convexMutation(path: string, args: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${BASE}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const data = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
  if (data.status === "error") throw new Error(data.errorMessage ?? "Mutation failed");
  return data.value;
}

const WS_TABLES = [
  "ws_mercedes_wheel_variants",
  "ws_porsche_wheel_variants",
  "ws_audi_wheel_variants",
  "ws_vw_wheel_variants",
  "ws_lamborghini_wheel_variants",
  "ws_ferrari_wheel_variants",
  "ws_jaguar_wheel_variants",
  "ws_land_rover_wheel_variants",
  "ws_944racing_wheel_variants",
  "ws_alfa_romeo_wheel_variants",
  "ws_fiat_wheel_variants",
];

/** Group B: mercedes uses *_id (UUID) as the value for getOrCreate. Group A: others use raw fields (diameter, width, etc.). */
const GROUP_B_TABLE = "ws_mercedes_wheel_variants";

/** Map ws_mercedes_wheels.data.id (UUID) → oem_wheels._id for Group B variant promotion. */
type MercedesUuidToOemIdMap = Map<string, string>;

type WsRow = { _id: string; data: string; source_id?: string; title?: string; brand?: string; status?: string; imported_at?: string };
type CsvRow = Record<string, unknown> & {
  id?: string;
  wheel_id?: string;
  part_number?: string;
  diameter?: string;
  diameter_id?: string;
  width?: string;
  width_id?: string;
  offset?: string;
  offset_id?: string;
  bolt_pattern?: string;
  bolt_pattern_id?: string;
  center_bore?: string;
  center_bore_id?: string;
  color?: string;
  color_id?: string;
};

const BATCH_SIZE = 10;

function str(x: unknown): string | undefined {
  return x != null && String(x).trim() !== "" ? String(x).trim() : undefined;
}

/** Resolve measurement value: Group B uses *_id, Group A uses raw field. */
function meas(table: string, csvRow: CsvRow, rawKey: keyof CsvRow, idKey: keyof CsvRow): string | undefined {
  const isGroupB = table === GROUP_B_TABLE;
  return str(isGroupB ? csvRow[idKey] : csvRow[rawKey]) ?? str(csvRow[rawKey]) ?? str(csvRow[idKey]);
}

async function processRow(
  table: string,
  row: WsRow,
  stats: { promoted: number; skipped: number; errors: string[] },
  mercedesUuidToOemId?: MercedesUuidToOemIdMap
): Promise<void> {
  let csvRow: CsvRow;
  try {
    csvRow = JSON.parse(row.data) as CsvRow;
  } catch {
    stats.errors.push(`${table} ${row._id}: invalid JSON in data`);
    stats.skipped++;
    return;
  }

  const wheelIdRaw = csvRow.wheel_id;
  if (wheelIdRaw == null || String(wheelIdRaw).trim() === "") {
    stats.skipped++;
    return;
  }

  const wheelIdStr = String(wheelIdRaw).trim();
  let wheel: { _id: string; wheel_title?: string; id?: string };

  if (table === GROUP_B_TABLE && mercedesUuidToOemId?.has(wheelIdStr)) {
    const oemId = mercedesUuidToOemId.get(wheelIdStr)!;
    try {
      const w = await convexQuery("queries:wheelsGetByIdFull", { id: oemId });
      if (w == null) {
        stats.errors.push(`${table} ${row._id}: wheelsGetByIdFull(${oemId}) returned null`);
        stats.skipped++;
        return;
      }
      wheel = w as { _id: string; wheel_title?: string; id?: string };
    } catch (e) {
      stats.errors.push(`${table} ${row._id}: wheelsGetByIdFull failed - ${(e as Error).message}`);
      stats.skipped++;
      return;
    }
  } else {
    try {
      const w = await convexQuery("queries:wheelsGetByOldId", { id: wheelIdStr });
      if (w == null) {
        if (table === GROUP_B_TABLE) {
          console.log(`mercedes wheel_id not in UUID map (missing in ws_mercedes_wheels or no oem match): ${wheelIdStr}`);
        } else {
          console.log(`wheel not found: ${csvRow.wheel_id}`);
        }
        stats.skipped++;
        return;
      }
      wheel = w as { _id: string; wheel_title?: string; id?: string };
    } catch (e) {
      stats.errors.push(`${table} ${row._id}: wheelsGetByOldId failed - ${(e as Error).message}`);
      stats.skipped++;
      return;
    }
  }

  let diamId: string | undefined;
  let widId: string | undefined;
  let offId: string | undefined;
  let bpId: string | undefined;
  let cbId: string | undefined;
  let colId: string | undefined;
  let pnId: string | undefined;

  const diamVal = meas(table, csvRow, "diameter", "diameter_id");
  const widthVal = meas(table, csvRow, "width", "width_id");
  const offsetVal = meas(table, csvRow, "offset", "offset_id");
  const bpVal = meas(table, csvRow, "bolt_pattern", "bolt_pattern_id");
  const centerBoreVal = table === GROUP_B_TABLE
    ? (str(csvRow.center_bore) ?? str(csvRow.center_bore_id))
    : str(csvRow.center_bore);
  const colorVal = meas(table, csvRow, "color", "color_id");
  const partNumVal = str(csvRow.part_number);

  try {
    if (diamVal) diamId = (await convexMutation("migrations:getOrCreateDiameter", { value: diamVal })) as string;
    if (widthVal) widId = (await convexMutation("migrations:getOrCreateWidth", { value: widthVal })) as string;
    if (offsetVal) offId = (await convexMutation("migrations:getOrCreateOffset", { value: offsetVal })) as string;
    if (bpVal) bpId = (await convexMutation("migrations:getOrCreateBoltPattern", { value: bpVal })) as string;
    if (centerBoreVal) cbId = (await convexMutation("migrations:getOrCreateCenterBore", { value: centerBoreVal })) as string;
    if (colorVal) colId = (await convexMutation("migrations:getOrCreateColor", { value: colorVal })) as string;
    if (partNumVal) pnId = (await convexMutation("migrations:getOrCreatePartNumber", { value: partNumVal })) as string;
  } catch (e) {
    stats.errors.push(`${table} ${row._id}: getOrCreate refs - ${(e as Error).message}`);
    stats.skipped++;
    return;
  }

  const promoteArgs: Record<string, unknown> = {
    wheel_id: wheel._id,
    wheel_title: wheel.wheel_title ?? wheel.id ?? "",
    slug: csvRow.id != null ? String(csvRow.id) : row._id,
  };
  if (partNumVal ?? (csvRow.id != null ? String(csvRow.id) : undefined)) promoteArgs.variant_title = partNumVal ?? (csvRow.id != null ? String(csvRow.id) : undefined);
  if (partNumVal) promoteArgs.part_number = partNumVal;
  if (diamId) { promoteArgs.diameter_id = diamId; promoteArgs.diameter_value = diamVal; }
  if (widId) { promoteArgs.width_id = widId; promoteArgs.width_value = widthVal; }
  if (offId) { promoteArgs.offset_id = offId; promoteArgs.offset_value = offsetVal; }
  if (bpId) { promoteArgs.bolt_pattern_id = bpId; promoteArgs.bolt_pattern_value = bpVal; }
  if (cbId) { promoteArgs.center_bore_id = cbId; promoteArgs.center_bore_value = centerBoreVal; }
  if (colId) { promoteArgs.color_id = colId; promoteArgs.color_value = colorVal; }
  if (pnId) promoteArgs.part_number_id = pnId;

  try {
    await convexMutation("migrations:promoteWheelVariant", promoteArgs);
    stats.promoted++;
  } catch (e) {
    stats.errors.push(`${table} ${row._id}: promoteWheelVariant - ${(e as Error).message}`);
    stats.skipped++;
  }
}

/** Build UUID → oem_wheels._id for Mercedes: ws_mercedes_wheels.data.id (UUID) → oem_wheels._id by matching data.title via wheelsGetByTitle. */
async function buildMercedesUuidToOemIdMap(): Promise<MercedesUuidToOemIdMap> {
  const map = new Map<string, string>();
  let wsRows: WsRow[];
  try {
    wsRows = (await convexQuery("queries:getWsRows", {
      table: "ws_mercedes_wheels",
      limit: 20_000,
    })) as WsRow[];
  } catch (e) {
    console.warn("buildMercedesUuidToOemIdMap: getWsRows(ws_mercedes_wheels) failed:", (e as Error).message);
    return map;
  }
  if (!Array.isArray(wsRows) || wsRows.length === 0) return map;

  const titleToOemId = new Map<string, string>();
  const uniqueTitles = new Set<string>();
  for (const row of wsRows) {
    let data: { id?: string; title?: string };
    try {
      data = JSON.parse(row.data) as { id?: string; title?: string };
    } catch {
      continue;
    }
    const title = data.title != null ? String(data.title).trim() : "";
    if (title) uniqueTitles.add(title);
  }

  for (const title of uniqueTitles) {
    try {
      const wheel = await convexQuery("queries:wheelsGetByTitle", { title });
      if (wheel != null && typeof (wheel as { _id?: string })._id === "string") {
        titleToOemId.set(title, (wheel as { _id: string })._id);
      }
    } catch {
      // skip this title
    }
  }

  for (const row of wsRows) {
    let data: { id?: string; title?: string };
    try {
      data = JSON.parse(row.data) as { id?: string; title?: string };
    } catch {
      continue;
    }
    const uuid = data.id != null ? String(data.id).trim() : "";
    const title = data.title != null ? String(data.title).trim() : "";
    const oemId = title ? titleToOemId.get(title) : undefined;
    if (uuid && oemId) map.set(uuid, oemId);
  }
  console.log(`Mercedes UUID→oem_wheel map: ${map.size} entries (from ${wsRows.length} ws_mercedes_wheels, ${uniqueTitles.size} unique titles)`);
  return map;
}

async function main() {
  let totalPromoted = 0;
  let totalSkipped = 0;
  const allErrors: string[] = [];

  let mercedesUuidToOemId: MercedesUuidToOemIdMap | undefined;
  if (WS_TABLES.includes(GROUP_B_TABLE)) {
    mercedesUuidToOemId = await buildMercedesUuidToOemIdMap();
  }

  for (const table of WS_TABLES) {
    const stats = { promoted: 0, skipped: 0, errors: [] as string[] };
    let rows: WsRow[];
    try {
      rows = (await convexQuery("queries:getWsRows", { table })) as WsRow[];
    } catch (e) {
      console.error(`${table}: getWsRows failed - ${(e as Error).message}`);
      allErrors.push(`${table}: getWsRows - ${(e as Error).message}`);
      continue;
    }

    if (!Array.isArray(rows)) rows = [];
    console.log(`Processing ${table}: ${rows.length} rows`);

    const uuidMap = table === GROUP_B_TABLE ? mercedesUuidToOemId : undefined;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((row) => processRow(table, row, stats, uuidMap)));
    }

    totalPromoted += stats.promoted;
    totalSkipped += stats.skipped;
    allErrors.push(...stats.errors);
    console.log(`Done ${table}: promoted ${stats.promoted}, skipped ${stats.skipped}, errors ${stats.errors.length}`);
  }

  console.log("\n--- Summary ---");
  console.log(`Total promoted: ${totalPromoted}`);
  console.log(`Total skipped: ${totalSkipped}`);
  console.log(`Total errors: ${allErrors.length}`);
  if (allErrors.length > 0) {
    console.log("\nErrors:");
    allErrors.forEach((e) => console.log("  ", e));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
