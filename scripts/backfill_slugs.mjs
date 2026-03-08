#!/usr/bin/env node
/**
 * Phase 1 backfill: set slug = id for brands, vehicles, wheels where slug is empty;
 * fix 2 vehicles missing vehicle_title.
 *
 * Prereqs: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_slugs.mjs
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const CONVEX_URL = (process.env.VITE_CONVEX_URL || "").replace(/\/$/, "");

async function convexQuery(path, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex query failed");
  return json.value;
}

async function convexMutation(path, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex mutation failed");
  return json.value;
}

function isEmpty(v) {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Phase 1 backfill: slugs + 2 vehicle titles\n");

  const [brands, vehicles, wheels] = await Promise.all([
    convexQuery("queries:brandsGetAll", {}),
    convexQuery("queries:vehiclesGetAllWithBrands", {}),
    convexQuery("queries:wheelsGetAllWithBrands", {}),
  ]);

  let brandsOk = 0,
    vehiclesOk = 0,
    wheelsOk = 0,
    vehicleTitlesOk = 0;

  console.log("1. Brands: backfill slug = id where empty…");
  for (const b of brands || []) {
    if (isEmpty(b.slug) && (b.id || b._id)) {
      const slug = String(b.id ?? b._id);
      try {
        await convexMutation("mutations:brandsUpdate", { id: b._id, slug });
        brandsOk++;
      } catch (e) {
        console.error("   Error brand", b._id, e.message);
      }
    }
  }
  console.log("   Updated:", brandsOk);

  console.log("\n2. Vehicles: backfill slug = id where empty; fix missing vehicle_title…");
  for (const v of vehicles || []) {
    const updates = {};
    if (isEmpty(v.slug) && (v.id || v._id)) {
      updates.slug = String(v.id ?? v._id);
    }
    if (isEmpty(v.vehicle_title) && (v.model_name || v.id || v._id)) {
      updates.vehicle_title = (v.model_name || String(v.id ?? v._id).replace(/-/g, " ")).trim();
    }
    if (Object.keys(updates).length > 0) {
      try {
        await convexMutation("mutations:vehiclesUpdate", { id: v._id, ...updates });
        if (updates.slug) vehiclesOk++;
        if (updates.vehicle_title) vehicleTitlesOk++;
      } catch (e) {
        console.error("   Error vehicle", v._id, e.message);
      }
    }
  }
  console.log("   Slug updated:", vehiclesOk, "| vehicle_title fixed:", vehicleTitlesOk);

  console.log("\n3. Wheels: backfill slug = id where empty…");
  for (const w of wheels || []) {
    if (isEmpty(w.slug) && (w.id || w._id)) {
      const slug = String(w.id ?? w._id);
      try {
        await convexMutation("mutations:wheelsUpdate", { id: w._id, slug });
        wheelsOk++;
      } catch (e) {
        console.error("   Error wheel", w._id, e.message);
      }
    }
  }
  console.log("   Updated:", wheelsOk);

  console.log("\nDone. Re-run node scripts/generate_data_audit_todo.mjs to verify.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
