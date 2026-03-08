#!/usr/bin/env node
/**
 * Phase 2: Backfill j_vehicle_brand for vehicles that don't have a brand link.
 * Infers brand from vehicle_title or model_name (e.g. "Mercedes-Benz - C126…" → Mercedes-Benz),
 * resolves to Convex brand, calls vehicleBrandLink and optionally sets text_brands on the vehicle.
 *
 * Prereqs: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/backfill_vehicle_brand_links.mjs
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

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

/** Infer brand from vehicle title/model. Returns brand title string or null. */
function inferBrandFromTitle(title, brandTitles) {
  if (!title || !title.trim()) return null;
  const t = title.trim();
  if (t.includes(" - ")) {
    const before = t.split(" - ")[0].trim();
    const match = brandTitles.find((b) => normalize(b) === normalize(before));
    if (match) return match;
  }
  for (const brandTitle of brandTitles) {
    if (brandTitle && normalize(t).startsWith(normalize(brandTitle))) return brandTitle;
  }
  return null;
}

/** Infer brand doc from vehicle id (e.g. "mercedes-benz-c126-..." or "Mercedes-Benz - C126: ..." → brand doc). */
function inferBrandFromId(vehicleId, brandBySlug) {
  if (!vehicleId || typeof vehicleId !== "string") return null;
  const slugLike = vehicleId
    .toLowerCase()
    .replace(/\s*:\s*/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "-");
  const parts = slugLike.split("-").filter(Boolean);
  for (let n = Math.min(parts.length, 3); n >= 1; n--) {
    const slug = parts.slice(0, n).join("-");
    const b = brandBySlug.get(slug);
    if (b) return b;
  }
  return null;
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Phase 2: Vehicle–brand links backfill\n");

  const [brands, vehicles] = await Promise.all([
    convexQuery("queries:brandsGetAll", {}),
    convexQuery("queries:vehiclesGetAllWithBrands", {}),
  ]);

  const brandByTitle = new Map();
  const brandBySlug = new Map();
  const brandTitles = [];
  for (const b of brands || []) {
    if (b.brand_title) {
      brandByTitle.set(normalize(b.brand_title), b);
      brandTitles.push(b.brand_title);
    }
    const slug = (b.slug || b.id || "").toString().toLowerCase().replace(/\s+/g, "-");
    if (slug) brandBySlug.set(slug, b);
  }
  brandTitles.sort((a, b) => (b?.length ?? 0) - (a?.length ?? 0));

  const withoutBrand = (vehicles || []).filter((v) => !v.brand_name && !v.brand_id);
  console.log("Vehicles without brand link:", withoutBrand.length);

  let linked = 0;
  let skipped = 0;
  for (const v of withoutBrand) {
    const title = (v.vehicle_title || v.model_name || "").trim();
    const inferredTitle = inferBrandFromTitle(title, brandTitles);
    let brandDoc = inferredTitle ? brandByTitle.get(normalize(inferredTitle)) : null;
    if (!brandDoc) brandDoc = inferBrandFromId(v.id, brandBySlug);
    if (!brandDoc && inferredTitle) {
      brandDoc = brands.find((b) => normalize(b.brand_title) === normalize(inferredTitle)) ?? null;
    }
    if (!brandDoc) {
      skipped++;
      if (skipped <= 5) console.log("  Skip (no match):", title?.slice(0, 60));
      continue;
    }
    try {
      await convexMutation("mutations:vehicleBrandLink", {
        vehicle_id: v._id,
        brand_id: brandDoc._id,
        vehicle_title: v.vehicle_title || v.model_name || "",
        brand_title: brandDoc.brand_title || "",
      });
      await convexMutation("mutations:vehiclesUpdate", {
        id: v._id,
        text_brands: brandDoc.brand_title ?? undefined,
      });
      linked++;
    } catch (e) {
      skipped++;
      if (skipped <= 5) console.error("  Error:", v._id, e.message);
    }
  }

  console.log("\nLinked:", linked, "| Skipped:", skipped);
  console.log("Done. Re-run node scripts/generate_data_audit_todo.mjs to verify.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
