#!/usr/bin/env node
/**
 * Backfill vehicle production_years from id when id contains a year range
 * (e.g. "jaguar-f-type-x152-2013-2024" → "2013-2024").
 *
 * Prereqs: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_vehicle_production_years.mjs
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

/** Parse id for trailing year range (e.g. "...-2013-2024" or "...-2018-2025"). Returns "YYYY-YYYY" or null. */
function parseYearsFromId(id) {
  if (!id || typeof id !== "string") return null;
  const parts = id.split("-").filter(Boolean);
  const years = parts.filter((p) => /^\d{4}$/.test(p) && parseInt(p, 10) >= 1950 && parseInt(p, 10) <= 2030);
  if (years.length >= 2) {
    const sorted = [...years].map((y) => parseInt(y, 10)).sort((a, b) => a - b);
    return `${sorted[0]}-${sorted[sorted.length - 1]}`;
  }
  if (years.length === 1) return years[0];
  return null;
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Backfill vehicle production_years from id\n");

  const vehicles = await convexQuery("queries:vehiclesGetAllWithBrands", {});
  let updated = 0;
  for (const v of vehicles || []) {
    if (!isEmpty(v.production_years)) continue;
    const years = parseYearsFromId(v.id);
    if (!years) continue;
    try {
      await convexMutation("mutations:vehiclesUpdate", { id: v._id, production_years: years });
      updated++;
    } catch (e) {
      console.error("   Error", v._id, e.message);
    }
  }
  console.log("Updated:", updated, "vehicles");
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
