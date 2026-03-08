#!/usr/bin/env node
/**
 * Backfill wheel text_* from specifications_json using Convex server-side mutation.
 * Prereq: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_wheel_specs_convex.mjs
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

const BATCH = 50;

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }
  console.log("Fetching wheel ids with specifications_json…");
  const ids = await convexQuery("queries:wheelsGetIdsWithSpecJson", {});
  console.log("  Found", ids.length, "wheels with specifications_json");
  if (ids.length === 0) {
    console.log("Nothing to backfill.");
    return;
  }
  let totalUpdated = 0;
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    const { updated } = await convexMutation("mutations:backfillWheelSpecsFromJsonBatch", {
      ids: chunk,
    });
    totalUpdated += updated;
    if (updated > 0) console.log("  Batch", Math.floor(i / BATCH) + 1, "updated", updated);
  }
  console.log("\nTotal updated:", totalUpdated);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
