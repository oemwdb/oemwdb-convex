#!/usr/bin/env node
/**
 * Migrate junction data + ref tables from Supabase → Convex.
 * - j_vehicle_brand, j_wheel_brand, j_wheel_vehicle (from oem_vehicles/oem_wheels brand_ref/vehicle_ref)
 * - oem_bolt_patterns, oem_center_bores, oem_colors, oem_diameters, oem_widths (by value, get-or-create)
 * Uses existing Convex tables only. No new tables.
 * Storage: for wheel images use scripts/migrate_wheel_images_to_convex.ts.
 *
 * Prereqs: .env.local has SUPABASE_URL, SUPABASE_SERVICE_KEY, VITE_CONVEX_URL.
 * Run: node scripts/supabase_migrate_junctions_and_refs.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bclvqqnnyqgzoavgrkke.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}
if (!CONVEX_URL) {
  console.error("Missing VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const convexBase = CONVEX_URL.replace(/\/$/, "");

/** Fetch all rows from a Supabase table (PostgREST returns max 1000 per request by default). */
async function supabaseFetchAll(table, select = "*", pageSize = 1000) {
  const out = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return out;
}

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

function main() {
  return run();
}

async function run() {
  console.log("Supabase:", SUPABASE_URL);
  console.log("Convex:", CONVEX_URL);
  console.log("");

  const brandById = new Map();
  const brandBySlug = new Map();
  const brandByTitle = new Map();
  const vehicleById = new Map();
  const vehicleByTitle = new Map();
  const vehicleBySlug = new Map();
  const wheelById = new Map();
  const wheelByTitle = new Map();
  const wheelBySlug = new Map();
  function norm(s) {
    return (s && String(s).trim().toLowerCase().replace(/\s+/g, " ")) || "";
  }
  function slugifyLoose(s) {
    return (
      (s &&
        String(s)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")) ||
      ""
    );
  }

  console.log("1. Loading Convex brands, vehicles, wheels…");
  try {
    const [brands, vehicles, wheels] = await Promise.all([
      convexQuery("queries:brandsGetAll", {}),
      convexQuery("queries:vehiclesGetAllWithBrands", {}),
      convexQuery("queries:wheelsGetAllWithBrands", {}),
    ]);

    for (const b of brands || []) {
      const id = b.id ?? b._id;
      if (id) brandById.set(String(id), b._id);
      if (b.slug) brandBySlug.set(String(b.slug).toLowerCase(), b._id);
      if (b.brand_title) {
        brandByTitle.set(String(b.brand_title).toLowerCase(), b._id);
        brandBySlug.set(String(b.brand_title).toLowerCase().replace(/\s+/g, "-"), b._id);
      }
    }
    for (const v of vehicles || []) {
      const id = v.id ?? v._id;
      if (id) vehicleById.set(String(id), v._id);
      const title = v.vehicle_title ?? v.model_name ?? "";
      if (title) vehicleByTitle.set(norm(title), v._id);
      if (v.slug) vehicleBySlug.set(String(v.slug).toLowerCase(), v._id);
    }
    for (const w of wheels || []) {
      const id = w.id ?? w._id;
      if (id) wheelById.set(String(id), w._id);
      const title = w.wheel_title ?? "";
      if (title) wheelByTitle.set(norm(title), w._id);
      if (w.slug) wheelBySlug.set(String(w.slug).toLowerCase(), w._id);
    }
    console.log(`   Brands: ${(brands || []).length}, Vehicles: ${(vehicles || []).length}, Wheels: ${(wheels || []).length}`);
  } catch (e) {
    console.error("   Convex load failed:", e.message);
    process.exit(1);
  }

  let jvbOk = 0,
    jvbSkip = 0,
    jwbOk = 0,
    jwbSkip = 0,
    jwvOk = 0,
    jwvSkip = 0;

  // Supabase uses text_brands (string) not brand_ref; match by title/slug
  function textBrandsToConvexBrandId(textBrands) {
    if (!textBrands || typeof textBrands !== "string") return null;
    const s = String(textBrands).trim().toLowerCase();
    if (!s) return null;
    const slug = s.replace(/\s+/g, "-");
    return brandByTitle.get(s) || brandBySlug.get(slug) || brandBySlug.get(s) || brandById.get(slug) || null;
  }

  console.log("\n2. Fetching Supabase vehicles (for j_vehicle_brand)…");
  let supabaseVehicles;
  try {
    supabaseVehicles = await supabaseFetchAll("oem_vehicles", "id, vehicle_title, model_name, text_brands");
    console.log(`   Fetched ${supabaseVehicles.length} vehicles from Supabase`);
  } catch (veError) {
    console.error("   Supabase vehicles error:", veError.message);
    supabaseVehicles = null;
  }
  if (supabaseVehicles) {
    for (const row of supabaseVehicles || []) {
      const convexVehicleId =
        vehicleById.get(String(row.id)) ??
        vehicleBySlug.get(String(row.id || "").toLowerCase()) ??
        vehicleByTitle.get(norm(row.vehicle_title ?? row.model_name));
      if (!convexVehicleId) {
        jvbSkip++;
        continue;
      }
      const brandId = textBrandsToConvexBrandId(row.text_brands);
      if (!brandId) {
        jvbSkip++;
        continue;
      }
      try {
        await convexMutation("mutations:vehicleBrandLink", {
          vehicle_id: convexVehicleId,
          brand_id: brandId,
          vehicle_title: row.vehicle_title ?? row.model_name ?? "",
          brand_title: (row.text_brands && String(row.text_brands).trim()) || "",
        });
        jvbOk++;
      } catch (_) {
        jvbSkip++;
      }
    }
    console.log(`   j_vehicle_brand: ${jvbOk} linked, ${jvbSkip} skipped`);
  }

  console.log("\n3. Fetching Supabase wheels (for j_wheel_brand)…");
  let supabaseWheels;
  try {
    supabaseWheels = await supabaseFetchAll("oem_wheels", "id, wheel_title, text_brands");
    console.log(`   Fetched ${supabaseWheels.length} wheels from Supabase`);
  } catch (whError) {
    console.error("   Supabase wheels error:", whError.message);
    supabaseWheels = null;
  }
  if (supabaseWheels) {
    for (const row of supabaseWheels || []) {
      const convexWheelId =
        wheelById.get(String(row.id)) ??
        wheelBySlug.get(String(row.id || "").toLowerCase()) ??
        wheelByTitle.get(norm(row.wheel_title));
      if (!convexWheelId) {
        jwbSkip++;
        continue;
      }
      const brandId = textBrandsToConvexBrandId(row.text_brands);
      if (!brandId) continue;
      try {
        await convexMutation("mutations:wheelBrandLink", {
          wheel_id: convexWheelId,
          brand_id: brandId,
          wheel_title: row.wheel_title ?? "",
          brand_title: (row.text_brands && String(row.text_brands).trim()) || "",
        });
        jwbOk++;
      } catch (_) {}
    }
    console.log(`   j_wheel_brand: ${jwbOk} linked, ${jwbSkip} skipped`);
  }

  console.log("\n4. Fetching Supabase junction_wheels_vehicles (for j_wheel_vehicle)…");
  let supabaseWheelVehicles;
  try {
    supabaseWheelVehicles = await supabaseFetchAll(
      "junction_wheels_vehicles",
      "wheel_id, vehicle_id, wheel_title"
    );
    console.log(`   Fetched ${supabaseWheelVehicles.length} wheel/vehicle links from Supabase`);
  } catch (jwvError) {
    console.error("   Supabase wheel/vehicle junction error:", jwvError.message);
    supabaseWheelVehicles = null;
  }
  if (supabaseWheelVehicles) {
    for (const row of supabaseWheelVehicles || []) {
      const rawWheelId = String(row.wheel_id || "");
      const rawVehicleId = String(row.vehicle_id || "");
      const convexWheelId =
        wheelById.get(rawWheelId) ??
        wheelBySlug.get(rawWheelId.toLowerCase()) ??
        wheelBySlug.get(slugifyLoose(rawWheelId)) ??
        wheelByTitle.get(norm(row.wheel_title ?? rawWheelId));
      const convexVehicleId =
        vehicleById.get(rawVehicleId) ??
        vehicleBySlug.get(rawVehicleId.toLowerCase()) ??
        vehicleBySlug.get(slugifyLoose(rawVehicleId)) ??
        vehicleByTitle.get(norm(rawVehicleId));
      if (!convexWheelId || !convexVehicleId) {
        jwvSkip++;
        continue;
      }
      try {
        await convexMutation("mutations:wheelVehicleLink", {
          wheel_id: convexWheelId,
          vehicle_id: convexVehicleId,
        });
        jwvOk++;
      } catch (_) {
        jwvSkip++;
      }
    }
    console.log(`   j_wheel_vehicle: ${jwvOk} linked, ${jwvSkip} skipped`);
  }

  console.log("\n5. Ref tables: bolt_patterns, center_bores, colors, diameters, widths…");
  // Supabase ref tables use "id" as the value column
  const refTables = [
    ["oem_bolt_patterns", "mutations:boltPatternsInsert", (r) => ({ bolt_pattern: r.id ?? r.bolt_pattern })],
    ["oem_center_bores", "mutations:centerBoresInsert", (r) => ({ center_bore: r.id ?? r.center_bore })],
    ["oem_colors", "mutations:colorsInsert", (r) => ({ color: r.id ?? r.color })],
    ["oem_diameters", "mutations:diametersInsert", (r) => ({ diameter: r.id ?? r.diameter })],
    ["oem_widths", "mutations:widthsInsert", (r) => ({ width: r.id ?? r.width })],
  ];
  for (const [table, mutPath, payload] of refTables) {
    const { data: rows, error } = await supabase.from(table).select("*").limit(2000);
    if (error) {
      console.log(`   ${table}: Supabase error ${error.message}`);
      continue;
    }
    let ins = 0;
    for (const r of rows || []) {
      try {
        await convexMutation(mutPath, payload(r));
        ins++;
      } catch (_) {}
    }
    console.log(`   ${table}: ${ins} inserted (Supabase had ${(rows || []).length} rows)`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
