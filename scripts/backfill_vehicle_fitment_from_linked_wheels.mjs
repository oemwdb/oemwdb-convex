#!/usr/bin/env node

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

function isBlank(value) {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}

function formatDecimal(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Number.isInteger(num) ? String(num) : String(num).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function extractDiameters(raw) {
  const matches = String(raw ?? "").match(/\d{2}(?:\.\d+)?/g) ?? [];
  const values = new Set();
  for (const match of matches) {
    const num = Number(match);
    if (num >= 14 && num <= 24) values.add(`${formatDecimal(num)} inch`);
  }
  return [...values];
}

function extractWidths(raw) {
  const matches = String(raw ?? "").match(/\d{1,2}(?:\.\d+)?/g) ?? [];
  const values = new Set();
  for (const match of matches) {
    const num = Number(match);
    if (num >= 5 && num <= 13) values.add(`${num.toFixed(1)}J`);
  }
  return [...values];
}

function extractBoltPatterns(raw) {
  const values = new Set();
  const regex = /(\d)\s*x\s*(\d{3}(?:\.\d+)?)/gi;
  for (const match of String(raw ?? "").matchAll(regex)) {
    const lug = match[1];
    const size = formatDecimal(Number(match[2]));
    if (lug && size) values.add(`${lug} x ${size}`);
  }
  return [...values];
}

function extractCenterBores(raw) {
  const matches = String(raw ?? "").match(/\d{2}(?:\.\d+)?/g) ?? [];
  const values = new Set();
  for (const match of matches) {
    const num = Number(match);
    if (num >= 50 && num <= 85) values.add(`${formatDecimal(num)}mm`);
  }
  return [...values];
}

function collectSorted(values, sorter) {
  return [...values].sort(sorter);
}

function sortNumericLabels(a, b) {
  const aNum = Number.parseFloat(a);
  const bNum = Number.parseFloat(b);
  return aNum - bNum || a.localeCompare(b);
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Backfilling vehicle fitment specs from linked wheels...\n");
  const vehicles = await convexQuery("queries:vehiclesGetAllWithBrands", {});

  let updatedVehicles = 0;
  let updatedBoltPatterns = 0;
  let updatedCenterBores = 0;
  let updatedDiameters = 0;
  let updatedWidths = 0;

  for (const vehicle of vehicles || []) {
    const full = await convexQuery("queries:vehiclesGetByIdFull", { id: vehicle._id });
    const wheels = full?.wheels ?? [];
    if (wheels.length === 0) continue;

    const boltPatterns = new Set();
    const centerBores = new Set();
    const diameters = new Set();
    const widths = new Set();

    for (const wheel of wheels) {
      for (const value of extractBoltPatterns(wheel.text_bolt_patterns)) boltPatterns.add(value);
      for (const value of extractCenterBores(wheel.text_center_bores)) centerBores.add(value);
      for (const value of extractDiameters(wheel.text_diameters)) diameters.add(value);
      for (const value of extractWidths(wheel.text_widths)) widths.add(value);
    }

    const patch = { id: vehicle._id };
    let changed = false;

    if (isBlank(full?.text_bolt_patterns) && boltPatterns.size > 0) {
      patch.text_bolt_patterns = collectSorted(boltPatterns, sortNumericLabels).join(", ");
      updatedBoltPatterns++;
      changed = true;
    }
    if (isBlank(full?.text_center_bores) && centerBores.size > 0) {
      patch.text_center_bores = collectSorted(centerBores, sortNumericLabels).join(", ");
      updatedCenterBores++;
      changed = true;
    }
    if (isBlank(full?.text_diameters) && diameters.size > 0) {
      patch.text_diameters = collectSorted(diameters, sortNumericLabels).join(", ");
      updatedDiameters++;
      changed = true;
    }
    if (isBlank(full?.text_widths) && widths.size > 0) {
      patch.text_widths = collectSorted(widths, sortNumericLabels).join(", ");
      updatedWidths++;
      changed = true;
    }

    if (!changed) continue;
    await convexMutation("mutations:vehiclesUpdate", patch);
    updatedVehicles++;
  }

  console.log(
    JSON.stringify(
      {
        totalVehicles: vehicles.length,
        updatedVehicles,
        updatedBoltPatterns,
        updatedCenterBores,
        updatedDiameters,
        updatedWidths,
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
