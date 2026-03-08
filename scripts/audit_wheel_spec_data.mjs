#!/usr/bin/env node
/**
 * Call wheelSpecDataAudit and print counts + sample specifications_json.
 * Prereq: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/audit_wheel_spec_data.mjs
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

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }
  const audit = await convexQuery("queries:wheelSpecDataAudit", {});
  console.log("Wheel spec data audit:\n");
  console.log("  Total wheels:", audit.total);
  console.log("  With text_diameters:", audit.withTextDiameters);
  console.log("  With text_widths:", audit.withTextWidths);
  console.log("  With text_bolt_patterns:", audit.withTextBoltPatterns);
  console.log("  With text_center_bores:", audit.withTextCenterBores);
  console.log("  With text_colors:", audit.withTextColors);
  console.log("  With specifications_json:", audit.withSpecificationsJson);
  if (audit.sampleSpecJson?.length) {
    console.log("\nSample specifications_json (first 400 chars each):");
    audit.sampleSpecJson.forEach((s, i) => console.log(`  [${i + 1}]`, s));
  }
  if (audit.sampleWheelTitles?.length) {
    console.log("\nSample wheel_title:");
    audit.sampleWheelTitles.forEach((s, i) => console.log(`  [${i + 1}]`, s));
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
