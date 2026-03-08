#!/usr/bin/env node
/**
 * Backfill empty wheel text_* from common modern measurements:
 * - Per-brand: most common diameter/width/bolt/center_bore among wheels that have data.
 * - Global fallback: most common across all wheels, or defaults (18, 8.5, 5x114.3, 66.1).
 *
 * Prereq: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_wheel_specs_common.mjs
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

function toPayload(obj) {
  if (obj == null) return {};
  return {
    diameter: obj.diameter ?? undefined,
    width: obj.width ?? undefined,
    boltPattern: obj.boltPattern ?? undefined,
    centerBore: obj.centerBore ?? undefined,
  };
}

const BATCH = 80;

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Common modern measurements backfill\n");
  console.log("1. Loading common specs per brand and global fallback…");
  const common = await convexQuery("queries:wheelsCommonSpecsByBrand", {});
  const byBrand = {};
  for (const [bid, bag] of Object.entries(common.byBrand ?? {})) {
    byBrand[bid] = toPayload(bag);
  }
  const global = toPayload(common.global);
  console.log("   Global fallback:", global);
  console.log("   Brands with common specs:", Object.keys(byBrand).length);

  console.log("\n2. Loading wheel ids with missing specs…");
  const ids = await convexQuery("queries:wheelsGetIdsWithMissingSpecs", {});
  console.log("   Found", ids.length, "wheels with at least one empty spec");

  if (ids.length === 0) {
    console.log("\nNothing to backfill.");
    return;
  }

  let totalUpdated = 0;
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    const { updated } = await convexMutation("mutations:backfillWheelSpecsFromCommonByBrand", {
      ids: chunk,
      byBrand,
      global,
    });
    totalUpdated += updated;
    if (updated > 0) {
      console.log("   Batch", Math.floor(i / BATCH) + 1, "updated", updated);
    }
  }
  console.log("\nTotal updated:", totalUpdated);
  console.log("\nDone. Run node scripts/audit_wheel_spec_data.mjs to verify.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
