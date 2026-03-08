#!/usr/bin/env node
/**
 * Inspect Supabase project bclvqqnnyqgzoavgrkke: list tables and row counts.
 *
 * Prerequisites:
 *   Add to .env.local:
 *     SUPABASE_URL=https://bclvqqnnyqgzoavgrkke.supabase.co
 *     SUPABASE_SERVICE_KEY=<your-service-role-key>
 *
 * Run: npx dotenv -e .env.local -- node scripts/supabase_inspect_tables.mjs
 *   (or: node --env-file=.env.local scripts/supabase_inspect_tables.mjs  # Node 20+)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bclvqqnnyqgzoavgrkke.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_SERVICE_KEY. Add to .env.local:\n  SUPABASE_URL=https://bclvqqnnyqgzoavgrkke.supabase.co\n  SUPABASE_SERVICE_KEY=<your-service-role-key>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const KNOWN_TABLES = [
    "oem_brands",
    "oem_vehicles",
    "oem_wheels",
    "oem_engines",
    "vehicle_variants",
    "wheel_variants",
    "oem_bolt_patterns",
    "oem_center_bores",
    "oem_colors",
    "oem_diameters",
    "oem_widths",
    "oem_offsets",
    "profiles",
    "saved_brands",
    "saved_vehicles",
    "saved_wheels",
    "user_registered_vehicles",
    "vehicle_comments",
    "user_roles",
    "user_table_preferences",
    "admin_logs",
    "market_listings",
  ];

async function getRowCount(tableName) {
  const { data, error } = await supabase.from(tableName).select("*", { count: "exact", head: false }).range(0, 9999);
  if (error) return { error: error.message };
  const n = Array.isArray(data) ? data.length : 0;
  return { count: n };
}

async function main() {
  console.log("Connecting to Supabase:", SUPABASE_URL);
  console.log("");

  console.log(`Checking ${KNOWN_TABLES.length} table(s)...\n`);

  const tableNames = KNOWN_TABLES;

  const results = [];
  for (const name of tableNames) {
    const { count, error } = await getRowCount(name);
    if (error) {
      results.push({ table: name, count: "—", error });
    } else {
      results.push({ table: name, count, error: null });
    }
  }

  results.sort((a, b) => a.table.localeCompare(b.table));

  console.log("Table                    | Rows    | Status");
  console.log("-------------------------|---------|--------");
  for (const r of results) {
    const countStr = r.error ? "—" : String(r.count).padStart(6);
    const status = r.error ? r.error.slice(0, 30) : "ok";
    console.log(`${r.table.padEnd(24)} | ${countStr} | ${status}`);
  }

  const totalRows = results.reduce((sum, r) => (r.error ? sum : sum + (r.count || 0)), 0);
  console.log("");
  console.log(`Total rows across tables: ${totalRows}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
