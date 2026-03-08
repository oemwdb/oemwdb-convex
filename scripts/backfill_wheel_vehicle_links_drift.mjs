#!/usr/bin/env node
/**
 * Backfill j_wheel_vehicle for Convex wheels that have 0 links but whose
 * "alternate" Supabase wheel_id (e.g. mini-r99-double-spoke-wheels vs
 * mini-r99-double-spoke-wheels-wheels) has junction_wheels_vehicles rows.
 *
 * Prereqs: .env.local has SUPABASE_URL, SUPABASE_SERVICE_KEY, VITE_CONVEX_URL.
 * Run: node scripts/backfill_wheel_vehicle_links_drift.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.SUPABASE_URL || "https://bclvqqnnyqgzoavgrkke.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}
if (!CONVEX_URL) {
  console.error("Missing VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const convexBase = CONVEX_URL.replace(/\/$/, "");

async function convexQuery(path, args = {}) {
  const res = await fetch(`${convexBase}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex query failed");
  return json.value;
}

async function convexMutation(path, args = {}) {
  const res = await fetch(`${convexBase}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex mutation failed");
  return json.value;
}

function norm(s) {
  return (s && String(s).trim().toLowerCase().replace(/\s+/g, " ")) || "";
}

function slugifyLoose(s) {
  return (
    (s &&
      String(s)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")) ||
    ""
  );
}

/** Normalize wheel id for grouping: strip duplicate -wheels suffix and optional color. */
function simplifyWheelId(id) {
  return String(id || "")
    .toLowerCase()
    .replace(/-wheels(?:-wheels)+$/g, "-wheels")
    .replace(/-(silver|black|grey|gray|white|chrome|jet-black|midnight-black|frozen-black|gloss-black)(?=-wheels$)/g, "")
    .trim();
}

async function supabaseFetchAll(table, select = "*", pageSize = 1000) {
  const out = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select(select).range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return out;
}

async function run() {
  console.log("Backfilling j_wheel_vehicle for wheels with ID drift (e.g. -wheels-wheels vs -wheels)...\n");

  const [convexWheels, convexVehicles, supaJunction] = await Promise.all([
    convexQuery("queries:wheelsGetAllWithBrands", {}),
    convexQuery("queries:vehiclesGetAllWithBrands", {}),
    supabaseFetchAll("junction_wheels_vehicles", "wheel_id, vehicle_id"),
  ]);

  const vehicleById = new Map();
  const vehicleBySlug = new Map();
  const vehicleByTitle = new Map();
  for (const v of convexVehicles || []) {
    const id = v.id ?? v._id;
    if (id) vehicleById.set(String(id), v._id);
    const title = v.vehicle_title ?? v.model_name ?? "";
    if (title) vehicleByTitle.set(norm(title), v._id);
    if (v.slug) vehicleBySlug.set(String(v.slug).toLowerCase(), v._id);
  }

  const wheelById = new Map();
  const wheelBySlug = new Map();
  const wheelByTitle = new Map();
  for (const w of convexWheels || []) {
    const id = w.id ?? w._id;
    if (id) wheelById.set(String(id), w._id);
    const title = w.wheel_title ?? "";
    if (title) wheelByTitle.set(norm(title), w._id);
    if (w.slug) wheelBySlug.set(String(w.slug).toLowerCase(), w._id);
  }

  function resolveVehicle(rawVehicleId) {
    const s = String(rawVehicleId || "").trim();
    return (
      vehicleById.get(s) ??
      vehicleBySlug.get(s.toLowerCase()) ??
      vehicleBySlug.get(slugifyLoose(s)) ??
      vehicleByTitle.get(norm(s)) ??
      null
    );
  }

  // Supabase junction: wheel_id -> list of vehicle_id
  const supaLinksByWheelId = new Map();
  for (const row of supaJunction || []) {
    const wid = String(row.wheel_id || "");
    if (!supaLinksByWheelId.has(wid)) supaLinksByWheelId.set(wid, []);
    supaLinksByWheelId.get(wid).push(row.vehicle_id);
  }

  // Convex Mini wheels with 0 vehicle links
  const miniWheels = (convexWheels || []).filter(
    (w) => (w.brand_name || w.text_brands || "").toLowerCase() === "mini"
  );

  const toBackfill = [];
  for (const wheel of miniWheels) {
    const full = await convexQuery("queries:wheelsGetByIdFull", { id: wheel._id });
    const currentCount = full?.vehicles?.length ?? 0;
    if (currentCount > 0) continue;

    const convexWheelId = wheel._id;
    const convexId = wheel.id ?? wheel.slug ?? "";

    // Alternate Supabase wheel_ids that might have links: same simplified id, or known variant
    const simpleKey = simplifyWheelId(convexId);
    const candidates = new Set();
    candidates.add(convexId);
    if (convexId.endsWith("-wheels-wheels")) {
      candidates.add(convexId.replace(/-wheels-wheels$/, "-wheels"));
    }
    if (simpleKey && simpleKey !== convexId.toLowerCase()) {
      // All Supabase wheel ids that simplify to same key (we'll check supaLinksByWheelId)
      for (const [supaWheelId] of supaLinksByWheelId) {
        if (simplifyWheelId(supaWheelId) === simpleKey) candidates.add(supaWheelId);
      }
    }

    const vehicleIdsFromSupabase = new Set();
    for (const supaWheelId of candidates) {
      const list = supaLinksByWheelId.get(supaWheelId) || [];
      list.forEach((vid) => vehicleIdsFromSupabase.add(vid));
    }

    const convexVehicleIds = [];
    for (const vid of vehicleIdsFromSupabase) {
      const cv = resolveVehicle(vid);
      if (cv) convexVehicleIds.push(cv);
    }

    if (convexVehicleIds.length > 0) {
      toBackfill.push({
        convexWheelId,
        wheelTitle: wheel.wheel_title,
        convexId,
        convexVehicleIds,
      });
    }
  }

  console.log(`Found ${toBackfill.length} Mini wheels with 0 links but recoverable from Supabase junction.\n`);

  let linked = 0;
  let skipped = 0;
  for (const { convexWheelId, wheelTitle, convexId, convexVehicleIds } of toBackfill) {
    for (const vehicleId of convexVehicleIds) {
      try {
        await convexMutation("mutations:wheelVehicleLink", {
          wheel_id: convexWheelId,
          vehicle_id: vehicleId,
        });
        linked++;
      } catch (e) {
        if (e.message?.includes("already") || e.message?.toLowerCase().includes("duplicate")) {
          skipped++;
        } else {
          console.error(`  ${convexId} -> vehicle ${vehicleId}: ${e.message}`);
        }
      }
    }
    console.log(`  ${wheelTitle}: +${convexVehicleIds.length} links`);
  }

  console.log(`\nDone. ${linked} new links created, ${skipped} already existed.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
