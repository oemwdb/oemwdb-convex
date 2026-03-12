#!/usr/bin/env node
/**
 * Recover the canonical Land Rover wheel structure in Convex.
 *
 * Safe actions:
 * - Restore canonical parent wheel titles/metadata from Supabase `oem_wheels`
 * - Import missing Supabase `oem_wheel_variants` into Convex `oem_wheel_variants`
 *
 * Non-destructive:
 * - Does not delete or hide the workshop-imported part-number rows currently
 *   living in Convex `oem_wheels`
 * - Produces an unresolved report for those rows so they can be mapped later
 *
 * Usage:
 *   node scripts/recover-land-rover-wheel-variants.mjs
 *   node scripts/recover-land-rover-wheel-variants.mjs --apply
 */

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const APPLY = process.argv.includes("--apply");
const BRAND = "Land Rover";
const SUPABASE_BRAND_ID = "land-rover";
const CONVEX_URL = process.env.VITE_CONVEX_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!CONVEX_URL || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing VITE_CONVEX_URL, SUPABASE_URL, or SUPABASE_SERVICE_KEY in .env.local");
}

const convexBase = CONVEX_URL.replace(/\/$/, "");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function log(...args) {
  console.log(...args);
}

function readConvexTable(table, limit) {
  throw new Error(`Snapshot not loaded for ${table} (limit ${limit})`);
}

function createConvexSnapshotZip() {
  const exportPath = "/tmp/land-rover-wheel-recovery-convex-export.zip";
  execFileSync("npx", ["convex", "export", "--path", exportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 1024 * 1024 * 20,
  });
  return exportPath;
}

function readSnapshotTable(exportPath, table) {
  try {
    const stdout = execFileSync("unzip", ["-p", exportPath, `${table}/documents.jsonl`], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1024 * 1024 * 100,
    });
    return stdout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    const stderr = String(error.stderr ?? "");
    if (stderr.includes("filename not matched")) return [];
    throw error;
  }
}

async function convexMutation(path, args) {
  const res = await fetch(`${convexBase}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.errorMessage || `Convex mutation failed for ${path}`);
  }
  return json.value;
}

async function fetchSupabaseAll(builder) {
  const out = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await builder(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return out;
}

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function normalizeMaybe(value) {
  if (value == null) return undefined;
  const cleaned = String(value).replace(/\u00a0/g, " ").trim();
  if (!cleaned) return undefined;
  const squashed = cleaned.replace(/\s+/g, "");
  const lowered = cleaned.toLowerCase();
  if (
    squashed === "Notspecifiedinsource" ||
    lowered === "not specified in source" ||
    lowered === "notvisibleinsource" ||
    lowered === "not visible in source" ||
    lowered === "null"
  ) {
    return undefined;
  }
  return cleaned;
}

function normalizeToken(value) {
  return normalizeMaybe(value)?.toLowerCase().replace(/\s+/g, " ") ?? "";
}

function uniqueCompact(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const cleaned = normalizeMaybe(value)?.replace(/^[\s,/-]+/, "");
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function buildVariantTitle(variant) {
  const pieces = uniqueCompact([
    variant.part_number,
    variant.color_id,
    variant.color,
    variant.diameter_id,
    variant.width_id,
    variant.offset_id,
  ]);
  return pieces.join(" | ") || variant.id;
}

function uuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value ?? "")
  );
}

async function main() {
  log(`Mode: ${APPLY ? "apply" : "dry-run"}`);
  log("Creating a fresh Convex snapshot export...");
  const exportPath = createConvexSnapshotZip();

  log("Loading Convex tables from snapshot...");
  const [convexWheels, convexVariants, convexBrands] = await Promise.all([
    Promise.resolve(readSnapshotTable(exportPath, "oem_wheels")),
    Promise.resolve(readSnapshotTable(exportPath, "oem_wheel_variants")),
    Promise.resolve(readSnapshotTable(exportPath, "oem_brands")),
  ]);

  log("Loading Supabase Land Rover wheels and variants...");

  const [supabaseParents, supabaseVariants] = await Promise.all([
    fetchSupabaseAll((from, to) =>
      supabase
        .from("oem_wheels")
        .select(
          "id,wheel_title,part_numbers,good_pic_url,image_source,notes,text_diameters,text_widths,text_bolt_patterns,text_center_bores,text_colors,text_offsets"
        )
        .eq("text_brands", BRAND)
        .range(from, to)
    ),
    fetchSupabaseAll((from, to) =>
      supabase
        .from("oem_wheel_variants")
        .select(
          "id,wheel_id,brand_id,diameter_id,width_id,offset_id,bolt_pattern_id,center_bore_id,color,color_id,part_number,image,is_visible"
        )
        .eq("brand_id", SUPABASE_BRAND_ID)
        .range(from, to)
    ),
  ]);

  const convexWheelByBusinessId = new Map(
    convexWheels.filter((wheel) => !isBlank(wheel.id)).map((wheel) => [String(wheel.id), wheel])
  );
  const landRoverBrandIds = new Set(
    convexBrands
      .filter((brand) => normalizeToken(brand.brand_title) === normalizeToken(BRAND))
      .map((brand) => brand._id)
  );
  const convexVariantSlugSet = new Set(
    convexVariants.map((variant) => normalizeMaybe(variant.slug)).filter(Boolean)
  );

  const parentRestores = [];
  const parentMissing = [];
  const variantCreates = [];
  const variantMissingParents = [];
  const variantAlreadyPresent = [];

  for (const parent of supabaseParents) {
    const convexWheel = convexWheelByBusinessId.get(parent.id);
    if (!convexWheel) {
      parentMissing.push({ id: parent.id, wheel_title: parent.wheel_title });
      continue;
    }

    const update = { id: convexWheel._id };
    let changed = false;

    if (
      normalizeMaybe(convexWheel.wheel_title)?.startsWith("(junk) ") ||
      normalizeToken(convexWheel.wheel_title) !== normalizeToken(parent.wheel_title)
    ) {
      update.wheel_title = parent.wheel_title;
      changed = true;
    }

    for (const field of [
      "part_numbers",
      "good_pic_url",
      "image_source",
      "notes",
      "text_diameters",
      "text_widths",
      "text_bolt_patterns",
      "text_center_bores",
      "text_colors",
      "text_offsets",
    ]) {
      if (isBlank(convexWheel[field]) && !isBlank(parent[field])) {
        update[field] = parent[field];
        changed = true;
      }
    }

    if (changed) {
      parentRestores.push({
        businessId: parent.id,
        convexId: convexWheel._id,
        fromTitle: convexWheel.wheel_title ?? null,
        toTitle: update.wheel_title ?? convexWheel.wheel_title ?? null,
        fields: Object.keys(update).filter((key) => key !== "id"),
      });
      if (APPLY) {
        await convexMutation("mutations:wheelsUpdate", update);
      }
    }
  }

  const refCache = new Map();
  async function getOrCreate(kind, value) {
    const cleaned = normalizeMaybe(value);
    if (!cleaned) return undefined;
    const cacheKey = `${kind}:${cleaned}`;
    if (refCache.has(cacheKey)) return refCache.get(cacheKey);
    const result = await convexMutation(`migrations:${kind}`, { value: cleaned });
    refCache.set(cacheKey, result);
    return result;
  }

  for (const variant of supabaseVariants) {
    if (convexVariantSlugSet.has(variant.id)) {
      variantAlreadyPresent.push({ slug: variant.id, wheel_id: variant.wheel_id });
      continue;
    }

    const parentWheel = convexWheelByBusinessId.get(variant.wheel_id);
    if (!parentWheel) {
      variantMissingParents.push({
        variant_id: variant.id,
        wheel_id: variant.wheel_id,
        part_number: variant.part_number ?? null,
      });
      continue;
    }

    const diameterValue = normalizeMaybe(variant.diameter_id);
    const widthValue = normalizeMaybe(variant.width_id);
    const offsetValue = normalizeMaybe(variant.offset_id);
    const boltPatternValue = normalizeMaybe(variant.bolt_pattern_id);
    const centerBoreValue = normalizeMaybe(variant.center_bore_id);
    const colorValue = normalizeMaybe(variant.color_id) ?? normalizeMaybe(variant.color);

    const args = {
      wheel_id: parentWheel._id,
      wheel_title: parentWheel.wheel_title ?? parentWheel.id ?? variant.wheel_id,
      slug: variant.id,
      variant_title: buildVariantTitle(variant),
    };

    if (normalizeMaybe(variant.part_number)) {
      args.part_number = normalizeMaybe(variant.part_number);
      args.part_number_id = await getOrCreate("getOrCreatePartNumber", variant.part_number);
    }
    if (diameterValue) {
      args.diameter_value = diameterValue;
      args.diameter_id = await getOrCreate("getOrCreateDiameter", diameterValue);
    }
    if (widthValue) {
      args.width_value = widthValue;
      args.width_id = await getOrCreate("getOrCreateWidth", widthValue);
    }
    if (offsetValue) {
      args.offset_value = offsetValue;
      args.offset_id = await getOrCreate("getOrCreateOffset", offsetValue);
    }
    if (boltPatternValue) {
      args.bolt_pattern_value = boltPatternValue;
      args.bolt_pattern_id = await getOrCreate("getOrCreateBoltPattern", boltPatternValue);
    }
    if (centerBoreValue) {
      args.center_bore_value = centerBoreValue;
      args.center_bore_id = await getOrCreate("getOrCreateCenterBore", centerBoreValue);
    }
    if (colorValue) {
      args.color_value = colorValue;
      args.color_id = await getOrCreate("getOrCreateColor", colorValue);
    }

    variantCreates.push({
      slug: args.slug,
      parentWheelId: variant.wheel_id,
      parentConvexId: parentWheel._id,
      variantTitle: args.variant_title,
      partNumber: args.part_number ?? null,
    });

    if (APPLY) {
      await convexMutation("migrations:promoteWheelVariant", args);
    }
  }

  const unresolvedWorkshopRows = convexWheels.filter((wheel) => {
    if (!landRoverBrandIds.has(wheel.brand_id)) return false;
    if (!uuidLike(wheel.id)) return false;
    const title = normalizeMaybe(wheel.wheel_title);
    const partNumber = normalizeMaybe(wheel.part_numbers);
    return title && partNumber && title === partNumber;
  });

  const duplicateWorkshopPartNumbers = new Map();
  for (const row of unresolvedWorkshopRows) {
    const key = normalizeMaybe(row.part_numbers);
    if (!key) continue;
    if (!duplicateWorkshopPartNumbers.has(key)) duplicateWorkshopPartNumbers.set(key, []);
    duplicateWorkshopPartNumbers.get(key).push({
      convexId: row._id,
      businessId: row.id,
      title: row.wheel_title,
    });
  }

  const duplicateWorkshopSamples = [...duplicateWorkshopPartNumbers.entries()]
    .filter(([, rows]) => rows.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 25)
    .map(([partNumber, rows]) => ({ partNumber, rows }));

  const report = {
    mode: APPLY ? "apply" : "dry-run",
    brand: BRAND,
    supabase: {
      parents: supabaseParents.length,
      variants: supabaseVariants.length,
    },
    convexBefore: {
      parentRowsMatched: supabaseParents.filter((parent) => convexWheelByBusinessId.has(parent.id)).length,
      prefixedParentTitles: supabaseParents.filter((parent) =>
        normalizeMaybe(convexWheelByBusinessId.get(parent.id)?.wheel_title)?.startsWith("(junk) ")
      ).length,
      existingVariantRows: convexVariants.length,
    },
    actions: {
      parentRestores: parentRestores.length,
      parentMissing: parentMissing.length,
      variantCreates: variantCreates.length,
      variantAlreadyPresent: variantAlreadyPresent.length,
      variantMissingParents: variantMissingParents.length,
    },
    unresolvedWorkshop: {
      likelyVariantRows: unresolvedWorkshopRows.length,
      duplicatePartNumbers: duplicateWorkshopSamples.length,
      duplicateSamples: duplicateWorkshopSamples,
    },
    samples: {
      parentRestores: parentRestores.slice(0, 25),
      parentMissing: parentMissing.slice(0, 25),
      variantCreates: variantCreates.slice(0, 25),
      variantMissingParents: variantMissingParents.slice(0, 25),
    },
  };

  const reportPath = `/tmp/land-rover-wheel-recovery-${APPLY ? "apply" : "dry-run"}.json`;
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(JSON.stringify(report, null, 2));
  log(`\nReport written to ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
