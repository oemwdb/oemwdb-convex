#!/usr/bin/env node
/**
 * Migrate wheels that exist in Supabase but not in Convex into Convex oem_wheels.
 * Run this before or after the junction script so Convex has all wheels; then
 * run supabase_migrate_junctions_and_refs.mjs to link brands (with pagination it will see all Supabase wheels).
 *
 * Prereqs: .env.local has SUPABASE_URL, SUPABASE_SERVICE_KEY, VITE_CONVEX_URL.
 * Run: node scripts/supabase_migrate_missing_wheels.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bclvqqnnyqgzoavgrkke.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!SUPABASE_SERVICE_KEY || !CONVEX_URL) {
  console.error("Missing SUPABASE_SERVICE_KEY or VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const convexBase = CONVEX_URL.replace(/\/$/, "");

async function convexQuery(path, args = {}) {
  const res = await fetch(`${convexBase}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex query failed");
  return json.value;
}

async function convexMutation(path, args = {}) {
  const res = await fetch(`${convexBase}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex mutation failed");
  return json.value;
}

async function supabaseFetchAll(table, select = "*", pageSize = 1000) {
  const out = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select(select).range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return out;
}

async function run() {
  console.log("Supabase:", SUPABASE_URL);
  console.log("Convex:", CONVEX_URL);
  console.log("");

  console.log("1. Loading Convex wheel ids…");
  const convexWheels = await convexQuery("queries:wheelsGetAllWithBrands", {});
  const convexIds = new Set((convexWheels || []).map((w) => String(w.id ?? w._id)));
  console.log(`   Convex has ${convexIds.size} wheels`);

  console.log("2. Fetching all Supabase wheels (paginated)…");
  const supabaseWheels = await supabaseFetchAll(
    "oem_wheels",
    "id, wheel_title, weight, metal_type, part_numbers, notes, good_pic_url, image_source, uuid, ai_processing_complete, specifications"
  );
  console.log(`   Supabase has ${supabaseWheels.length} wheels`);

  const missing = supabaseWheels.filter((w) => !convexIds.has(String(w.id)));
  console.log(`   Missing in Convex: ${missing.length} wheels`);

  if (missing.length === 0) {
    console.log("\nDone. No missing wheels to migrate.");
    return;
  }

  console.log("\n3. Inserting missing wheels into Convex…");
  let ok = 0;
  let err = 0;
  for (const row of missing) {
    try {
      const spec =
        row.specifications != null
          ? typeof row.specifications === "string"
            ? row.specifications
            : JSON.stringify(row.specifications)
          : undefined;
      await convexMutation("mutations:wheelsInsert", {
        id: String(row.id),
        wheel_title: row.wheel_title ?? String(row.id),
        weight: row.weight ?? undefined,
        metal_type: row.metal_type ?? undefined,
        part_numbers: row.part_numbers ?? undefined,
        notes: row.notes ?? undefined,
        good_pic_url: row.good_pic_url ?? undefined,
        image_source: row.image_source ?? undefined,
        uuid: row.uuid ?? undefined,
        ai_processing_complete: row.ai_processing_complete ?? undefined,
        specifications_json: spec,
      });
      ok++;
    } catch (e) {
      err++;
      if (err <= 3) console.error(`   Error inserting ${row.id}:`, e.message);
    }
  }
  console.log(`   Inserted: ${ok}, errors: ${err}`);
  console.log("\nDone. Run node scripts/supabase_migrate_junctions_and_refs.mjs to link brands for all wheels.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
