#!/usr/bin/env node
/**
 * Phase 3: Backfill wheel text_* specs from (1) junction tables and (2) specifications_json.
 * Only sets a field when it is currently empty.
 *
 * Prereqs: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_wheel_specs.mjs
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

/** Parse "size" like "19x8.5" or "19x8.5\"" or "Front: 19x9.5\", Rear: 19x10.5\"" into diameter(s) and width(s). */
function parseSizeString(sizeStr) {
  if (sizeStr == null || typeof sizeStr !== "string") return { diameters: [], widths: [] };
  const diameters = new Set();
  const widths = new Set();
  // Match 18, 18.5, 19, 20, 21, 22 (inch) and 8, 8.5, 9, 9J, 10J etc
  const pairs = sizeStr.matchAll(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*J?/gi);
  for (const m of pairs) {
    diameters.add(m[1]);
    widths.add(m[2]);
  }
  // Standalone numbers that look like diameter (e.g. 19" or 18)
  const loneDiameter = sizeStr.match(/\b(\d{2})\s*[""]?\b/);
  if (loneDiameter) diameters.add(loneDiameter[1]);
  return {
    diameters: [...diameters],
    widths: [...widths],
  };
}

/** Get value from obj or nested obj.specifications / obj.specs / obj.data. */
function getSpecValue(obj, ...keys) {
  if (!obj || typeof obj !== "object") return undefined;
  const flat = { ...obj };
  const nested = obj.specifications ?? obj.specs ?? obj.data;
  const combined = nested && typeof nested === "object" ? { ...flat, ...nested } : flat;
  for (const key of keys) {
    const v = combined[key];
    if (v !== undefined && v !== null) return v;
    const lower = key.toLowerCase();
    const found = Object.keys(combined).find((k) => k.toLowerCase() === lower);
    if (found) return combined[found];
  }
  return undefined;
}

/** Extract spec strings from specifications_json (try common key names and nested objects). */
function extractFromSpecJson(spec) {
  if (!spec) return {};
  let obj;
  try {
    obj = typeof spec === "string" ? JSON.parse(spec) : spec;
  } catch {
    return {};
  }
  if (!obj || typeof obj !== "object") return {};
  const out = {};

  let diameter =
    getSpecValue(obj, "diameter", "diameters", "size", "rim_diameter", "wheel_diameter") ?? null;
  let width =
    getSpecValue(obj, "width", "widths", "rim_width", "wheel_width", "j_width") ?? null;

  const sizeStr = getSpecValue(obj, "size");
  if (sizeStr != null && typeof sizeStr === "string") {
    const { diameters: dArr, widths: wArr } = parseSizeString(sizeStr);
    if (dArr.length) out.text_diameters = [...new Set(dArr)].join(", ");
    if (wArr.length) out.text_widths = [...new Set(wArr)].join(", ");
  }
  if (diameter != null && !out.text_diameters) out.text_diameters = Array.isArray(diameter) ? diameter.map(String).join(", ") : String(diameter).trim();
  if (width != null && !out.text_widths) out.text_widths = Array.isArray(width) ? width.map(String).join(", ") : String(width).trim();

  const bolt =
    getSpecValue(obj, "bolt_pattern", "boltPattern", "bolt", "pcd", "lug_pattern");
  if (bolt != null) out.text_bolt_patterns = (Array.isArray(bolt) ? bolt.map(String).join(", ") : String(bolt)).trim();
  const centerBore =
    getSpecValue(obj, "center_bore", "centerBore", "cb", "hub_bore");
  if (centerBore != null) out.text_center_bores = (Array.isArray(centerBore) ? centerBore.map(String).join(", ") : String(centerBore)).trim();
  const color = getSpecValue(obj, "color", "colors", "finish");
  if (color != null) {
    const val = Array.isArray(color) ? color[0] : color;
    if (val != null) out.text_colors = String(val).trim();
  }
  const offset = getSpecValue(obj, "offset", "et", "wheel_offset");
  if (offset != null) out.text_offsets = String(offset).trim();
  const pn = getSpecValue(obj, "part_number", "partNumber", "part_numbers", "partNumbers", "pn");
  if (pn != null) {
    const val = Array.isArray(pn) ? pn.join(", ") : String(pn).trim();
    if (val) out.part_numbers = val;
  }
  return out;
}

/** Extract diameter/width from wheel_title (e.g. "19\" Style", "18 Inch", "20x9J"). */
function extractFromWheelTitle(title) {
  if (!title || typeof title !== "string") return {};
  const out = {};
  const t = title.trim();
  // "19\"", "19''", "19 inch", "18 Inch", "18-inch", "18 in.", "20x9", "20x9J", or leading "18 " / "19 "
  const diameterMatch =
    t.match(/\b(1[7-9]|2[0-2])\s*(?:[""]|''|inch|in\.?|-)\b/i) ??
    t.match(/\b(1[7-9]|2[0-2])\s*[x×]/i) ??
    t.match(/^(1[7-9]|2[0-2])\s+/) ??
    t.match(/\s(1[7-9]|2[0-2])\s*[""]/);
  if (diameterMatch) out.text_diameters = diameterMatch[1];
  const sizeMatch = t.match(/(\d{2})\s*[x×]\s*(\d+(?:\.\d+)?)\s*J?/i);
  if (sizeMatch) {
    if (!out.text_diameters) out.text_diameters = sizeMatch[1];
    out.text_widths = sizeMatch[2];
  }
  return out;
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Phase 3: Wheel text_* specs backfill\n");

  const [wheels, junctionSpecs] = await Promise.all([
    convexQuery("queries:wheelsGetAllWithBrands", {}),
    convexQuery("queries:wheelsGetJunctionSpecsForBackfill", {}),
  ]);

  const wheelById = new Map((wheels || []).map((w) => [w._id, w]));

  let fromJunction = 0;
  let fromJson = 0;

  console.log("1. Backfilling from junction tables…");
  for (const row of junctionSpecs || []) {
    const w = wheelById.get(row.wheel_id);
    if (!w) continue;
    const updates = {};
    if (isEmpty(w.text_diameters) && row.text_diameters) updates.text_diameters = row.text_diameters;
    if (isEmpty(w.text_widths) && row.text_widths) updates.text_widths = row.text_widths;
    if (isEmpty(w.text_bolt_patterns) && row.text_bolt_patterns) updates.text_bolt_patterns = row.text_bolt_patterns;
    if (isEmpty(w.text_center_bores) && row.text_center_bores) updates.text_center_bores = row.text_center_bores;
    if (isEmpty(w.text_colors) && row.text_colors) updates.text_colors = row.text_colors;
    if (Object.keys(updates).length === 0) continue;
    try {
      await convexMutation("mutations:wheelsUpdate", { id: row.wheel_id, ...updates });
      fromJunction++;
    } catch (e) {
      console.error("   Error wheel", row.wheel_id, e.message);
    }
  }
  console.log("   Updated:", fromJunction, "wheels");

  console.log("\n2. Backfilling from specifications_json and wheel_title…");
  for (const w of wheels || []) {
    let extracted = extractFromSpecJson(w.specifications_json);
    const fromTitle = extractFromWheelTitle(w.wheel_title);
    if (fromTitle.text_diameters && !extracted.text_diameters) extracted = { ...extracted, text_diameters: fromTitle.text_diameters };
    if (fromTitle.text_widths && !extracted.text_widths) extracted = { ...extracted, text_widths: fromTitle.text_widths };
    if (Object.keys(extracted).length === 0) continue;
    const updates = {};
    if (isEmpty(w.text_diameters) && extracted.text_diameters) updates.text_diameters = extracted.text_diameters;
    if (isEmpty(w.text_widths) && extracted.text_widths) updates.text_widths = extracted.text_widths;
    if (isEmpty(w.text_bolt_patterns) && extracted.text_bolt_patterns) updates.text_bolt_patterns = extracted.text_bolt_patterns;
    if (isEmpty(w.text_center_bores) && extracted.text_center_bores) updates.text_center_bores = extracted.text_center_bores;
    if (isEmpty(w.text_colors) && extracted.text_colors) updates.text_colors = extracted.text_colors;
    if (isEmpty(w.text_offsets) && extracted.text_offsets) updates.text_offsets = extracted.text_offsets;
    if (isEmpty(w.part_numbers) && extracted.part_numbers) updates.part_numbers = extracted.part_numbers;
    if (Object.keys(updates).length === 0) continue;
    try {
      await convexMutation("mutations:wheelsUpdate", { id: w._id, ...updates });
      fromJson++;
    } catch (e) {
      console.error("   Error wheel", w._id, e.message);
    }
  }
  console.log("   Updated:", fromJson, "wheels");

  console.log("\nDone. Re-run node scripts/generate_data_audit_todo.mjs to verify.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
