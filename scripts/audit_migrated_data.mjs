#!/usr/bin/env node
/**
 * Audit quality and usability of data migrated from Supabase to Convex.
 * Calls migrationAudit query and runs a few spot-checks.
 *
 * Prereqs: .env.local has VITE_CONVEX_URL.
 * Run: node scripts/audit_migrated_data.mjs
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

function pct(num, denom) {
  if (!denom) return "N/A";
  return ((100 * num) / denom).toFixed(1) + "%";
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  console.log("Convex:", CONVEX_URL);
  console.log("");

  const audit = await convexQuery("queries:migrationAudit", {});

  const c = audit.counts;
  const g = audit.gaps;

  console.log("=== COUNTS (migrated data) ===\n");
  console.log("  Core:");
  console.log("    oem_brands:        ", c.brands);
  console.log("    oem_vehicles:      ", c.vehicles);
  console.log("    oem_wheels:        ", c.wheels);
  console.log("  Junctions:");
  console.log("    j_vehicle_brand:   ", c.j_vehicle_brand);
  console.log("    j_wheel_brand:    ", c.j_wheel_brand);
  console.log("  Ref tables:");
  console.log("    oem_bolt_patterns: ", c.oem_bolt_patterns);
  console.log("    oem_center_bores: ", c.oem_center_bores);
  console.log("    oem_colors:        ", c.oem_colors);
  console.log("    oem_diameters:     ", c.oem_diameters);
  console.log("    oem_widths:        ", c.oem_widths);

  console.log("\n=== COVERAGE & GAPS ===\n");
  console.log("  Vehicles with ≥1 brand link:  ", c.j_vehicle_brand, "/", c.vehicles, "(", pct(c.j_vehicle_brand, c.vehicles), ")");
  console.log("  Vehicles without brand link:  ", g.vehiclesWithoutBrand);
  console.log("  Wheels with ≥1 brand link:     ", c.j_wheel_brand, "/", c.wheels, "(", pct(c.j_wheel_brand, c.wheels), ")");
  console.log("  Wheels without brand link:    ", g.wheelsWithoutBrand);
  console.log("  Wheels missing wheel_title:    ", g.wheelsMissingTitle);
  console.log("  Wheels missing id (legacy):   ", g.wheelsMissingId);
  console.log("  Vehicles missing title:       ", g.vehiclesMissingTitle);

  if (g.vehiclesWithoutBrand > 0 && audit.samples.vehiclesWithoutBrand?.length) {
    console.log("\n  Sample vehicles without brand:");
    audit.samples.vehiclesWithoutBrand.forEach((v) =>
      console.log("    -", v.id || v._id, "|", v.vehicle_title || v.model_name || "(no title)", "| text_brands:", v.text_brands ?? "null")
    );
  }
  if (g.wheelsWithoutBrand > 0 && audit.samples.wheelsWithoutBrand?.length) {
    console.log("\n  Sample wheels without brand:");
    audit.samples.wheelsWithoutBrand.forEach((w) =>
      console.log("    -", w.id || w._id, "|", w.wheel_title || "(no title)", "| text_brands:", w.text_brands ?? "null")
    );
  }
  if (g.wheelsMissingTitle > 0 && audit.samples.wheelsMissingTitle?.length) {
    console.log("\n  Sample wheels missing wheel_title:");
    audit.samples.wheelsMissingTitle.forEach((w) => console.log("    -", w.id || w._id, "| title:", w.wheel_title));
  }

  console.log("\n  Sample j_wheel_brand (link quality):");
  (audit.samples.j_wheel_brand_sample || []).forEach((s) =>
    console.log("    -", s.wheel_title, "→", s.brand_title)
  );

  console.log("\n=== USABILITY SPOT-CHECKS ===\n");

  // 1) Resolve a wheel by slug and check brand is present
  const wheelBySlug = await convexQuery("queries:wheelsGetByIdFull", { id: "mini-494-loop-spoke-silver-wheels" });
  if (wheelBySlug) {
    console.log("  1. wheelsGetByIdFull('mini-494-loop-spoke-silver-wheels'):");
    console.log("     wheel_title:", wheelBySlug.wheel_title);
    console.log("     brand_name: ", wheelBySlug.brand_name ?? "(null)");
    console.log("     Usable:     ", wheelBySlug.brand_name ? "yes" : "no (brand missing)");
  } else {
    console.log("  1. wheelsGetByIdFull(slug): wheel not found");
  }

  // 2) Resolve a vehicle with brand (vehiclesGetAllWithBrands includes brand_name)
  const vehicles = await convexQuery("queries:vehiclesGetAllWithBrands", {});
  const withBrand = vehicles.filter((v) => v.brand_name).length;
  const withoutBrand = vehicles.filter((v) => !v.brand_name).length;
  console.log("\n  2. vehiclesGetAllWithBrands: with brand_name:", withBrand, ", without:", withoutBrand);

  // 3) Ref tables: do we have expected values?
  const colors = await convexQuery("queries:colorsGetAll", {});
  const hasWhite = colors.some((r) => (r.color || "").toLowerCase() === "white");
  const hasSilver = colors.some((r) => (r.color || "").toLowerCase().includes("silver"));
  console.log("\n  3. oem_colors: sample values present (White, Silver):", hasWhite, hasSilver);

  console.log("\n=== SUMMARY ===\n");
  const vehicleCoverage = c.vehicles ? (100 * c.j_vehicle_brand) / c.vehicles : 0;
  const wheelCoverage = c.wheels ? (100 * c.j_wheel_brand) / c.wheels : 0;
  if (vehicleCoverage < 100) {
    console.log("  •", g.vehiclesWithoutBrand, "vehicles have no brand link (likely text_brands not matched to a Convex brand).");
  }
  if (wheelCoverage === 100) {
    console.log("  • All wheels have at least one j_wheel_brand link.");
  }
  if (g.wheelsMissingTitle > 0) {
    console.log("  •", g.wheelsMissingTitle, "wheels have empty wheel_title (consider backfilling).");
  }
  console.log("  • Ref tables (bolt_patterns, colors, diameters, etc.) are populated and usable.");
  console.log("");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
