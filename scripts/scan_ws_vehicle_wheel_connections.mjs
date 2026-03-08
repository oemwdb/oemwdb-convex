#!/usr/bin/env node
/**
 * Scan ws_*_junction_vehicles_wheels tables for vehicle–wheel connections.
 * Calls Convex getWsRows for each junction table and parses the `data` JSON.
 *
 * Prereqs: .env.local with VITE_CONVEX_URL. Convex backend must have
 * getWsRows updated to include the junction table names (see convex/queries.ts).
 * Run: node scripts/scan_ws_vehicle_wheel_connections.mjs
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const CONVEX_URL = (process.env.VITE_CONVEX_URL || "").replace(/\/$/, "");
if (!CONVEX_URL) {
  console.error("Missing VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

const WS_JUNCTION_TABLES = [
  "ws_944racing_junction_vehicles_wheels",
  "ws_alfa_romeo_junction_vehicles_wheels",
  "ws_audi_junction_vehicles_wheels",
  "ws_ferrari_junction_vehicles_wheels",
  "ws_fiat_junction_vehicles_wheels",
  "ws_jaguar_junction_vehicles_wheels",
  "ws_lamborghini_junction_vehicles_wheels",
  "ws_land_rover_junction_vehicles_wheels",
  "ws_mercedes_junction_vehicles_wheels",
  "ws_porsche_junction_vehicles_wheels",
  "ws_vw_junction_vehicles_wheels",
];

async function convexQuery(path, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Query failed");
  return json.value;
}

function parseData(data) {
  if (typeof data !== "string") return null;
  try {
    const p = JSON.parse(data);
    return p && typeof p === "object" ? p : null;
  } catch {
    return null;
  }
}

function getStr(parsed, ...keys) {
  for (const key of keys) {
    const v = parsed[key];
    if (typeof v === "string" && v.trim() && v !== "undefined") return v.trim();
    const lower = key.toLowerCase();
    const found = Object.keys(parsed).find((k) => k.toLowerCase() === lower);
    if (found) {
      const val = parsed[found];
      if (typeof val === "string" && val.trim() && val !== "undefined") return val.trim();
    }
  }
  return undefined;
}

function extract(parsed) {
  return {
    vehicleId: getStr(parsed, "vehicle_id", "vehicleId"),
    wheelId: getStr(parsed, "wheel_id", "wheelId"),
    vehicleTitle: getStr(parsed, "vehicle_title", "vehicleTitle", "vehicle"),
    wheelTitle: getStr(parsed, "wheel_title", "wheelTitle", "wheel"),
  };
}

async function main() {
  console.log("Scanning ws_*_junction_vehicles_wheels for vehicle–wheel connections...\n");

  const byBrand = {};
  const allConnections = [];
  let totalRows = 0;

  for (const table of WS_JUNCTION_TABLES) {
    const brand = table.replace("ws_", "").replace("_junction_vehicles_wheels", "").replace(/_/g, " ");
    let rows = [];
    try {
      rows = await convexQuery("queries:getWsRows", { table, limit: 20000 });
    } catch (e) {
      console.warn(`  ${table}: ${e.message}`);
      continue;
    }
    if (!Array.isArray(rows)) rows = [];
    totalRows += rows.length;
    byBrand[brand] = rows.length;

    for (const row of rows) {
      const data = row.data;
      const parsed = parseData(data);
      if (!parsed) continue;
      const { vehicleId, wheelId, vehicleTitle, wheelTitle } = extract(parsed);
      allConnections.push({
        brand,
        vehicleId,
        wheelId,
        vehicleTitle,
        wheelTitle,
        keys: Object.keys(parsed),
      });
    }
  }

  console.log("Summary by brand (rows in junction table):");
  console.log(
    Object.entries(byBrand)
      .sort((a, b) => b[1] - a[1])
      .map(([b, n]) => `  ${b}: ${n}`)
      .join("\n")
  );
  console.log(`\nTotal junction rows: ${totalRows}`);
  console.log(`Parsed connections (with at least one id/title): ${allConnections.length}\n`);

  if (allConnections.length > 0) {
    const sample = allConnections.slice(0, 15);
    console.log("Sample connections (first 15):");
    for (const c of sample) {
      console.log(
        `  [${c.brand}] vehicle: ${c.vehicleId ?? c.vehicleTitle ?? "—"} | wheel: ${c.wheelId ?? c.wheelTitle ?? "—"}`
      );
    }
    const withVehicle = allConnections.filter((c) => c.vehicleId || c.vehicleTitle);
    const withWheel = allConnections.filter((c) => c.wheelId || c.wheelTitle);
    console.log(`\nWith vehicle id/title: ${withVehicle.length}`);
    console.log(`With wheel id/title: ${withWheel.length}`);
    const keyCounts = {};
    for (const c of allConnections) {
      for (const k of c.keys) {
        keyCounts[k] = (keyCounts[k] || 0) + 1;
      }
    }
    console.log("\nKeys seen in data (frequency):");
    console.log(
      Object.entries(keyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([k, n]) => `  ${k}: ${n}`)
        .join("\n")
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
