#!/usr/bin/env node

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const CONVEX_URL = (process.env.VITE_CONVEX_URL || "").replace(/\/$/, "");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || "";
const SNAPSHOT_ZIP = process.env.MINI_SNAPSHOT_ZIP || "/tmp/convex-export.zip";
const APPLY = process.argv.includes("--apply");
const REPORT_PATH = path.resolve(
  process.cwd(),
  "reports",
  `mini-data-report-${new Date().toISOString().slice(0, 10)}.md`
);

if (!CONVEX_URL) {
  console.error("Missing VITE_CONVEX_URL in .env.local");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}
if (!fs.existsSync(SNAPSHOT_ZIP)) {
  console.error(`Snapshot not found: ${SNAPSHOT_ZIP}`);
  process.exit(1);
}

const BASE = CONVEX_URL;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const awdCache = new Map();
const refCache = {
  diameter: new Map(),
  width: new Map(),
  offset: new Map(),
  boltPattern: new Map(),
  centerBore: new Map(),
  color: new Map(),
  partNumber: new Map(),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function convexQuery(pathName, args = {}) {
  const res = await fetch(`${BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathName, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.errorMessage || `Convex query failed: ${pathName}`);
  }
  return json.value;
}

async function convexMutation(pathName, args = {}) {
  const res = await fetch(`${BASE}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathName, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.errorMessage || `Convex mutation failed: ${pathName}`);
  }
  return json.value;
}

function readJsonLinesFromZip(member) {
  try {
    const raw = execFileSync("unzip", ["-p", SNAPSHOT_ZIP, member], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 64,
    });
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

function dedupeBy(rows, keyFn) {
  const out = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    if (!out.has(key)) out.set(key, row);
  }
  return [...out.values()];
}

function normalizeText(value) {
  return String(value || "")
    .replace(/&/g, " and ")
    .replace(/\u00a0/g, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function simplifyWheelId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-wheels(?:-wheels)+$/g, "-wheels")
    .replace(
      /-(silver|black|grey|gray|white|chrome|jet-black|midnight-black|frozen-black|gloss-black)(?=-wheels$)/g,
      ""
    );
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitPartNumbers(value) {
  return String(value || "")
    .split(/[,\s;|/]+/)
    .map((part) => part.trim())
    .filter((part) => /^36[0-9A-Z]+$/i.test(part));
}

function parseYear(value) {
  const match = String(value || "").match(/\d{4}/);
  return match ? Number(match[0]) : undefined;
}

function formatDecimal(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (Number.isInteger(n)) return String(n);
  return String(n).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function formatDiameterLabel(value) {
  const match = String(value || "").match(/\d+(?:\.\d+)?/);
  if (!match) return "";
  return `${formatDecimal(match[0])} inch`;
}

function formatWidthLabel(value) {
  const match = String(value || "").match(/\d+(?:\.\d+)?/);
  if (!match) return "";
  const formatted = Number(match[0]).toFixed(1);
  return `${formatted}J`;
}

function formatBoltPatternLabel(value) {
  const match = String(value || "")
    .replace(/\s+/g, "")
    .match(/^(\d)x(\d+(?:\.\d+)?)$/i);
  if (!match) return "";
  return `${match[1]} x ${formatDecimal(match[2])}`;
}

function formatOffsetLabel(value) {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return "";
  return `ET${formatDecimal(match[0])}`;
}

function sortNumericLabels(a, b) {
  const aNum = parseFloat(String(a));
  const bNum = parseFloat(String(b));
  if (Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }
  return String(a).localeCompare(String(b));
}

function inferCenterBoresFromBoltPatterns(patterns) {
  const out = new Set();
  for (const pattern of patterns) {
    const normalized = formatBoltPatternLabel(pattern);
    if (normalized === "4 x 100") out.add("56.1mm");
    if (normalized === "5 x 120") out.add("72.6mm");
    if (normalized === "5 x 112") out.add("66.6mm");
  }
  return [...out].sort(sortNumericLabels);
}

function uniqueSorted(values, sorter = undefined) {
  const out = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
  return sorter ? out.sort(sorter) : out.sort();
}

function isPartNumberTitle(value) {
  return /^36[0-9A-Z]+$/i.test(String(value || "").trim());
}

function looksHashedId(value) {
  return /^[a-f0-9]{32}$/i.test(String(value || "").trim());
}

function cleanWheelTitle(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function mergeNotes(existing, addition) {
  const parts = uniqueSorted([existing, addition].filter(Boolean));
  return parts.join(" | ");
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function runOne() {
    while (true) {
      const current = index++;
      if (current >= items.length) return;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runOne));
  return results;
}

async function supabaseFetchAll(table, select = "*", pageSize = 1000) {
  const out = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select(select).range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return out;
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractAwdPartNumber(html) {
  const patterns = [
    /storage\/images\/wheels\/(?:mini|jcw)\/(?:min|jcw)-([0-9A-Z]+)(?:-[a-z0-9]+)?\.(?:jpg|webp)/i,
    /storage\/images\/wheels\/(?:min|jcw)-([0-9A-Z]+)(?:-[a-z0-9]+)?\.(?:jpg|webp)/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function extractAwdTitle(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) return "";
  const raw = decodeHtml(titleMatch[1])
    .replace(/\s*Alloys?\s*-\s*.+$/i, "")
    .replace(/\s*-\s*Alloy Wheels Direct\s*$/i, "")
    .trim();
  return raw ? `${raw.replace(/\s+Wheels?$/i, "").trim()} Wheels` : "";
}

function extractAwdDiameter(html) {
  const direct = html.match(
    /ProductSingle__specs-item--label">\s*Diameter\s*<\/span>[\s\S]{0,200}?ProductSingle__specs-item--value">\s*([0-9]{2}(?:\.[0-9])?)&quot;/i
  );
  if (direct) return formatDiameterLabel(direct[1]);
  const fallback = html.match(/Available in ([0-9]{2}(?:\.[0-9])?)&quot;/i);
  return fallback ? formatDiameterLabel(fallback[1]) : "";
}

function extractAwdColors(html) {
  const colors = new Set();
  for (const match of html.matchAll(/ProductSingle__colour-link"[\s\S]{0,120}?>\s*([^<]+?)\s*<\/a>/gi)) {
    const value = decodeHtml(match[1]).trim();
    if (!value || value.includes("${")) continue;
    colors.add(value);
  }
  const current = html.match(/data-wheel-colour="([^"]+)"/i);
  if (current) {
    const value = decodeHtml(current[1]).trim();
    if (value && !value.includes("${")) colors.add(value);
  }
  return [...colors].filter(Boolean).sort();
}

async function fetchAwdDetails(url) {
  if (!url) return null;
  const cacheKey = url;
  if (awdCache.has(cacheKey)) return awdCache.get(cacheKey);
  await sleep(125);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "follow",
  });
  const html = await res.text();
  const finalUrl = res.url || url;
  if (
    !res.ok ||
    /\/(?:mini|jcw)_alloys\/?$/.test(finalUrl) ||
    !/ProductSingle__specs-item--label/i.test(html)
  ) {
    awdCache.set(cacheKey, null);
    return null;
  }
  const details = {
    finalUrl,
    title: extractAwdTitle(html),
    diameter: extractAwdDiameter(html),
    colors: extractAwdColors(html),
    partNumber: extractAwdPartNumber(html),
  };
  awdCache.set(cacheKey, details);
  return details;
}

async function getOrCreateRef(kind, value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return undefined;
  const cache = refCache[kind];
  if (cache.has(trimmed)) return cache.get(trimmed);
  const pathByKind = {
    diameter: "migrations:getOrCreateDiameter",
    width: "migrations:getOrCreateWidth",
    offset: "migrations:getOrCreateOffset",
    boltPattern: "migrations:getOrCreateBoltPattern",
    centerBore: "migrations:getOrCreateCenterBore",
    color: "migrations:getOrCreateColor",
    partNumber: "migrations:getOrCreatePartNumber",
  };
  const refId = await convexMutation(pathByKind[kind], { value: trimmed });
  cache.set(trimmed, refId);
  return refId;
}

function buildVehiclePatch(definition) {
  return {
    slug: definition.slug,
    vehicle_title: definition.vehicle_title,
    model_name: definition.model_name,
    generation: definition.generation,
    body_type: definition.body_type,
    platform: definition.platform,
    drive_type: definition.drive_type,
    production_years: definition.production_years,
    special_notes: definition.special_notes,
  };
}

function businessIdOrFallback(vehicle) {
  return String(vehicle.id || vehicle.slug || vehicle.vehicle_title || vehicle._id);
}

function wheelBusinessIdOrFallback(wheel) {
  return String(wheel.id || wheel.slug || wheel.wheel_title || wheel._id);
}

async function main() {
  console.log(`${APPLY ? "Applying" : "Dry run"} MINI data backfill...`);

  const brand = await convexQuery("queries:brandsGetById", { id: "mini" });
  const [liveMiniWheels, liveMiniVehicles, supaJunction] = await Promise.all([
    convexQuery("queries:wheelsGetByBrand", { brandId: brand._id }),
    convexQuery("queries:vehiclesGetByBrand", { brandId: brand._id }),
    supabaseFetchAll("junction_wheels_vehicles", "wheel_id, vehicle_id"),
  ]);

  const snapshotWheelLinks = readJsonLinesFromZip("j_wheel_vehicle/documents.jsonl");
  const snapshotWheelVariants = readJsonLinesFromZip("oem_wheel_variants/documents.jsonl");
  const snapshotVehicleVariants = readJsonLinesFromZip("oem_vehicle_variants/documents.jsonl");

  const wsMiniVehicles = dedupeBy(
    readJsonLinesFromZip("ws_mini_vehicles/documents.jsonl").map((row) => JSON.parse(row.data)),
    (row) => row.ocmm_id
  );
  const wsMiniVehicleVariants = dedupeBy(
    readJsonLinesFromZip("ws_mini_vehicle_variants/documents.jsonl").map((row) => JSON.parse(row.data)),
    (row) => row.ocmm_id
  );
  const wsMiniWheels = dedupeBy(
    readJsonLinesFromZip("ws_mini_wheels/documents.jsonl").map((row) => JSON.parse(row.data)),
    (row) => row.ocmm_id
  );
  const wsMiniWheelVariants = dedupeBy(
    readJsonLinesFromZip("ws_mini_wheel_variants/documents.jsonl").map((row) => JSON.parse(row.data)),
    (row) => row.ocmm_id
  );
  const wsBmwMiniWheels = dedupeBy(
    readJsonLinesFromZip("ws_bmw_mini_wheels/documents.jsonl").map((row) => JSON.parse(row.data)),
    (row) => row.part_number
  );

  const legacyVehicleDefinitions = {
    "Mini - F54: Mini Clubman": {
      slug: "mini-f54-clubman",
      vehicle_title: "Mini Clubman (F54)",
      model_name: "Clubman",
      generation: "F54",
      body_type: "estate / wagon",
      platform: "BMW UKL2",
      drive_type: "FWD / AWD",
      production_years: "2015-2023",
      special_notes: "Verified from MINI workshop data and legacy fitment links.",
    },
    "Mini - R55: Mini Clubman": {
      slug: "mini-r55-clubman",
      vehicle_title: "Mini Clubman (R55)",
      model_name: "Clubman",
      generation: "R55",
      body_type: "estate / wagon",
      platform: "BMW MINI platform",
      drive_type: "FWD",
      production_years: "2007-2014",
      special_notes: "Verified from MINI workshop data and legacy fitment links.",
    },
    "Mini - R58: Mini Coupe": {
      slug: "mini-r58-r59-coupe-roadster",
      vehicle_title: "Mini-R58/R59-Coupe/Roadster",
      model_name: "Coupe / Roadster",
      generation: "R58/R59",
      body_type: "2-door coupe / roadster",
      platform: "BMW MINI platform",
      drive_type: "FWD",
      production_years: "2011-2015",
      special_notes: "Family row retained for legacy fitment scope; business id is immutable in the deployed mutation surface.",
    },
    "Mini - F60: Mini Countryman": {
      slug: "mini-f60-countryman",
      vehicle_title: "Mini Countryman (F60)",
      model_name: "Countryman",
      generation: "F60",
      body_type: "compact crossover",
      platform: "BMW UKL2",
      drive_type: "FWD / AWD",
      production_years: "2017-2023",
      special_notes: "Verified from MINI workshop data and legacy fitment links.",
    },
    "Mini - U25: Mini Countryman": {
      slug: "mini-u25-countryman",
      vehicle_title: "Mini Countryman (U25)",
      model_name: "Countryman",
      generation: "U25",
      body_type: "compact crossover",
      platform: "BMW FAAR",
      drive_type: "FWD / AWD",
      production_years: "2024-present",
      special_notes: "Verified from MINI workshop data and official current MINI model pages.",
    },
    "Mini - J01: Mini Aceman": {
      slug: "mini-j05-aceman",
      vehicle_title: "Mini Aceman (J05)",
      model_name: "Aceman",
      generation: "J05",
      body_type: "electric crossover",
      platform: "Spotlight platform",
      drive_type: "FWD",
      production_years: "2024-present",
      special_notes: "Existing row preserved for Aceman fitment; business id is legacy/misaligned and could not be changed through deployed mutations.",
    },
    "Mini - R60: Mini Countryman": {
      slug: "mini-r60-countryman",
      vehicle_title: "Mini Countryman (R60)",
      model_name: "Countryman",
      generation: "R60",
      body_type: "subcompact crossover",
      platform: "BMW MINI crossover platform",
      drive_type: "FWD / AWD",
      production_years: "2010-2016",
      special_notes: "Verified from MINI workshop data and legacy fitment links.",
    },
    "Mini - R50/R52/R53: Mini Hatchback / Cabriolet": {
      slug: "mini-r50-r52-r53-hatch",
      vehicle_title: "Mini-R50/R52/R53-Hatch",
      model_name: "Hatch / Convertible",
      generation: "R50/R52/R53",
      body_type: "3-door hatchback / convertible",
      platform: "first-generation BMW MINI platform",
      drive_type: "FWD",
      production_years: "2001-2008",
      special_notes: "Family row retained for legacy fitment scope.",
    },
    "Mini - R56/F56: Mini Hatchback": {
      slug: "mini-f55-f56-f57-hatch",
      vehicle_title: "Mini-F55/F56/F57-Hatch",
      model_name: "Hatch / Convertible",
      generation: "F55/F56/F57",
      body_type: "3-door / 5-door hatchback / convertible",
      platform: "BMW UKL1",
      drive_type: "FWD",
      production_years: "2014-2023",
      special_notes: "Existing mixed-id row normalized to the verified F55/F56/F57 family used by current legacy wheel links.",
    },
    "Mini - F66: Mini Hatchback": {
      slug: "mini-f65-f66-f67-hatch",
      vehicle_title: "Mini-F65/F66/F67-Hatch",
      model_name: "Hatch / Convertible",
      generation: "F65/F66/F67",
      body_type: "3-door / 5-door hatchback / convertible",
      platform: "updated BMW UKL architecture",
      drive_type: "FWD",
      production_years: "2024-present",
      special_notes: "Family row retained for current ICE hatch fitment scope.",
    },
  };

  const newVehicleDefinitions = [
    {
      id: "mini-j01-cooper-ev",
      slug: "mini-j01-cooper-ev",
      vehicle_title: "Mini Cooper EV (J01)",
      model_name: "Cooper EV",
      generation: "J01",
      body_type: "electric hatchback",
      platform: "Spotlight platform",
      drive_type: "FWD",
      production_years: "2024-present",
      special_notes: "Created from MINI workshop variants and official current MINI model pages. No verified legacy wheel-link source was available.",
    },
    {
      id: "mini-r56-r57-hatch-convertible",
      slug: "mini-r56-r57-hatch-convertible",
      vehicle_title: "Mini-R56/R57-Hatch/Convertible",
      model_name: "Hatch / Convertible",
      generation: "R56/R57",
      body_type: "3-door hatchback / convertible",
      platform: "BMW MINI platform",
      drive_type: "FWD",
      production_years: "2006-2015",
      special_notes: "Created from MINI workshop variants. No verified legacy wheel-link source was available.",
    },
    {
      id: "mini-r61-paceman",
      slug: "mini-r61-paceman",
      vehicle_title: "Mini Paceman (R61)",
      model_name: "Paceman",
      generation: "R61",
      body_type: "3-door crossover coupe",
      platform: "BMW MINI crossover platform",
      drive_type: "FWD / AWD",
      production_years: "2012-2016",
      special_notes: "Created from MINI workshop variants. No verified legacy wheel-link source was available.",
    },
  ];

  const vehicleByBusinessId = new Map(liveMiniVehicles.map((vehicle) => [businessIdOrFallback(vehicle), vehicle]));
  const familyVehicleIds = new Map();
  const stats = {
    vehiclesUpdated: 0,
    vehiclesInserted: 0,
    wheelsUpdated: 0,
    wheelsInserted: 0,
    wheelLinksAdded: 0,
    wheelVariantsPromoted: 0,
    vehicleVariantsPromoted: 0,
    unresolvedWheelRows: [],
  };

  for (const [businessId, definition] of Object.entries(legacyVehicleDefinitions)) {
    const existing = vehicleByBusinessId.get(businessId);
    if (!existing) continue;
    familyVehicleIds.set(definition.slug, existing._id);
    if (!APPLY) continue;
    await convexMutation("mutations:vehiclesUpdate", {
      id: existing._id,
      ...buildVehiclePatch(definition),
    });
    stats.vehiclesUpdated += 1;
  }

  for (const definition of newVehicleDefinitions) {
    let existing = vehicleByBusinessId.get(definition.id);
    if (!existing) {
      if (APPLY) {
        const insertedId = await convexMutation("mutations:vehiclesInsert", {
          id: definition.id,
          model_name: definition.model_name,
          vehicle_title: definition.vehicle_title,
          generation: definition.generation,
          body_type: definition.body_type,
          platform: definition.platform,
          drive_type: definition.drive_type,
          production_years: definition.production_years,
          special_notes: definition.special_notes,
        });
        await convexMutation("mutations:vehiclesUpdate", {
          id: insertedId,
          slug: definition.slug,
          special_notes: definition.special_notes,
        });
        await convexMutation("mutations:vehicleBrandLink", {
          vehicle_id: insertedId,
          brand_id: brand._id,
        });
        existing = { _id: insertedId, id: definition.id };
        stats.vehiclesInserted += 1;
      } else {
        existing = { _id: `DRYRUN:${definition.id}`, id: definition.id };
      }
    } else if (APPLY) {
      await convexMutation("mutations:vehiclesUpdate", {
        id: existing._id,
        ...buildVehiclePatch(definition),
      });
      stats.vehiclesUpdated += 1;
    }
    familyVehicleIds.set(definition.slug, existing._id);
    vehicleByBusinessId.set(definition.id, existing);
  }

  const wsVehicleByOcmmId = new Map(wsMiniVehicles.map((vehicle) => [vehicle.ocmm_id, vehicle]));
  const vehicleParentSlugByGeneration = {
    F54: "mini-f54-clubman",
    F55: "mini-f55-f56-f57-hatch",
    F56: "mini-f55-f56-f57-hatch",
    F57: "mini-f55-f56-f57-hatch",
    F60: "mini-f60-countryman",
    F66: "mini-f65-f66-f67-hatch",
    J01: "mini-j01-cooper-ev",
    J05: "mini-j05-aceman",
    R50: "mini-r50-r52-r53-hatch",
    R52: "mini-r50-r52-r53-hatch",
    R53: "mini-r50-r52-r53-hatch",
    R55: "mini-r55-clubman",
    R56: "mini-r56-r57-hatch-convertible",
    R57: "mini-r56-r57-hatch-convertible",
    R58: "mini-r58-r59-coupe-roadster",
    R59: "mini-r58-r59-coupe-roadster",
    R60: "mini-r60-countryman",
    R61: "mini-r61-paceman",
    U25: "mini-u25-countryman",
  };
  const groupedParentSlugs = new Set([
    "mini-f55-f56-f57-hatch",
    "mini-f65-f66-f67-hatch",
    "mini-r50-r52-r53-hatch",
    "mini-r56-r57-hatch-convertible",
    "mini-r58-r59-coupe-roadster",
  ]);

  const wsWheelVariantsByWheelOcmmId = new Map();
  for (const variant of wsMiniWheelVariants) {
    const list = wsWheelVariantsByWheelOcmmId.get(variant.wheel_ocmm_id) || [];
    list.push(variant);
    wsWheelVariantsByWheelOcmmId.set(variant.wheel_ocmm_id, list);
  }

  const bmwWheelByPartNumber = new Map(wsBmwMiniWheels.map((row) => [row.part_number, row]));
  const styleByOcmmId = new Map();
  const styleByCanonicalWheelId = new Map();
  const styleByNormalizedTitle = new Map();
  const styleByPartNumber = new Map();
  const styleBySimplifiedId = new Map();

  console.log(`Fetching AWD verification for ${wsMiniWheels.length} workshop wheel styles...`);
  const awdResults = await runPool(wsMiniWheels, 6, async (wheel) => {
    const url =
      wheel.good_pic_url ||
      `https://www.alloywheelsdirect.net/mini_alloys/${wheel.slug_id}-wheels`;
    try {
      return await fetchAwdDetails(url);
    } catch {
      return null;
    }
  });

  for (let index = 0; index < wsMiniWheels.length; index += 1) {
    const wheel = wsMiniWheels[index];
    const awd = awdResults[index];
    const variants = wsWheelVariantsByWheelOcmmId.get(wheel.ocmm_id) || [];
    const partNumbers = new Set(splitPartNumbers(wheel.part_numbers));
    const diameters = new Set();
    const widths = new Set();
    const boltPatterns = new Set();
    const offsets = new Set();
    const colors = new Set();
    for (const variant of variants) {
      if (variant.part_number) partNumbers.add(variant.part_number);
      if (variant.diameter) diameters.add(formatDiameterLabel(variant.diameter));
      if (variant.width) widths.add(formatWidthLabel(variant.width));
      if (variant.bolt_pattern) boltPatterns.add(formatBoltPatternLabel(variant.bolt_pattern));
      if (variant.offset) offsets.add(formatOffsetLabel(variant.offset));
      if (variant.color_finish) colors.add(variant.color_finish.trim());
      if (variant.part_number && bmwWheelByPartNumber.has(variant.part_number)) {
        const bmw = bmwWheelByPartNumber.get(variant.part_number);
        if (bmw.diameter) diameters.add(formatDiameterLabel(bmw.diameter));
        if (bmw.width) widths.add(formatWidthLabel(bmw.width));
        if (bmw.bolt_pattern) boltPatterns.add(formatBoltPatternLabel(bmw.bolt_pattern));
      }
    }
    if (awd?.partNumber) partNumbers.add(awd.partNumber);
    if (awd?.diameter) diameters.add(awd.diameter);
    for (const color of awd?.colors || []) colors.add(color);
    for (const pn of [...partNumbers]) {
      const bmw = bmwWheelByPartNumber.get(pn);
      if (!bmw) continue;
      if (bmw.diameter) diameters.add(formatDiameterLabel(bmw.diameter));
      if (bmw.width) widths.add(formatWidthLabel(bmw.width));
      if (bmw.bolt_pattern) boltPatterns.add(formatBoltPatternLabel(bmw.bolt_pattern));
    }
    const style = {
      ocmm_id: wheel.ocmm_id,
      slug_id: wheel.slug_id,
      canonicalWheelId: `${wheel.slug_id}-wheels`,
      title: cleanWheelTitle(awd?.title || wheel.wheel_title),
      goodPicUrl: wheel.good_pic_url || awd?.finalUrl || "",
      partNumbers: uniqueSorted([...partNumbers]),
      diameters: uniqueSorted([...diameters], sortNumericLabels),
      widths: uniqueSorted([...widths], sortNumericLabels),
      boltPatterns: uniqueSorted([...boltPatterns], sortNumericLabels),
      offsets: uniqueSorted([...offsets], sortNumericLabels),
      colors: uniqueSorted([...colors]),
    };
    style.centerBores = inferCenterBoresFromBoltPatterns(style.boltPatterns);
    style.notes =
      style.centerBores.length > 0
        ? "Verified from MINI workshop data, BMW/MINI part numbers, and Alloy Wheels Direct. Center bore inferred from matching MINI fitment standard when absent in source."
        : "Verified from MINI workshop data, BMW/MINI part numbers, and Alloy Wheels Direct.";
    styleByOcmmId.set(style.ocmm_id, style);
    styleByCanonicalWheelId.set(style.canonicalWheelId, style);
    styleByCanonicalWheelId.set(style.slug_id, style);
    styleBySimplifiedId.set(simplifyWheelId(style.canonicalWheelId), style);
    styleByNormalizedTitle.set(normalizeText(style.title), style);
    for (const pn of style.partNumbers) {
      if (!styleByPartNumber.has(pn)) styleByPartNumber.set(pn, style);
    }
  }

  const bmwOnlyMetadataByPartNumber = new Map();
  for (const row of wsBmwMiniWheels) {
    bmwOnlyMetadataByPartNumber.set(row.part_number, {
      title: cleanWheelTitle(`Mini ${row.design_code} Wheels`),
      partNumbers: [row.part_number],
      diameters: uniqueSorted([formatDiameterLabel(row.diameter)], sortNumericLabels),
      widths: uniqueSorted([formatWidthLabel(row.width)], sortNumericLabels),
      boltPatterns: uniqueSorted([formatBoltPatternLabel(row.bolt_pattern)], sortNumericLabels),
      offsets: [],
      colors: [],
      centerBores: inferCenterBoresFromBoltPatterns(
        uniqueSorted([formatBoltPatternLabel(row.bolt_pattern)], sortNumericLabels)
      ),
      notes: "Backfilled from BMW/MINI workshop part-number data.",
      goodPicUrl: "",
    });
  }

  const liveWheelCandidatesByStyleId = new Map();
  const wheelMatchByLiveId = new Map();
  const unresolvedWheelRows = [];

  for (const wheel of liveMiniWheels) {
    const simplifiedId = simplifyWheelId(wheelBusinessIdOrFallback(wheel));
    let style =
      styleBySimplifiedId.get(simplifiedId) ||
      styleByCanonicalWheelId.get(wheelBusinessIdOrFallback(wheel)) ||
      styleByNormalizedTitle.get(normalizeText(wheel.wheel_title));
    let matchedBmwFallback = false;
    if (!style) {
      const partNumbers = uniqueSorted([
        ...splitPartNumbers(wheel.part_numbers),
        ...splitPartNumbers(wheel.wheel_title),
      ]);
      for (const pn of partNumbers) {
        if (styleByPartNumber.has(pn)) {
          style = styleByPartNumber.get(pn);
          break;
        }
      }
      if (!style) {
        for (const pn of partNumbers) {
          if (bmwOnlyMetadataByPartNumber.has(pn)) {
            wheelMatchByLiveId.set(wheel._id, {
              source: "bmw_part_number",
              metadata: bmwOnlyMetadataByPartNumber.get(pn),
              primaryPartNumber: pn,
            });
            matchedBmwFallback = true;
            break;
          }
        }
      }
    }
    if (style) {
      const list = liveWheelCandidatesByStyleId.get(style.ocmm_id) || [];
      list.push(wheel);
      liveWheelCandidatesByStyleId.set(style.ocmm_id, list);
      wheelMatchByLiveId.set(wheel._id, {
        source: "mini_style",
        style,
        primaryPartNumber: style.partNumbers[0] || "",
      });
      continue;
    }
    if (matchedBmwFallback) continue;
    unresolvedWheelRows.push({
      _id: wheel._id,
      id: wheel.id,
      title: wheel.wheel_title,
      part_numbers: wheel.part_numbers || "",
    });
  }

  stats.unresolvedWheelRows = unresolvedWheelRows;

  function chooseCanonicalParentWheel(style) {
    const candidates = liveWheelCandidatesByStyleId.get(style.ocmm_id) || [];
    const ranked = [...candidates].sort((a, b) => {
      const score = (wheel) => {
        const businessId = wheelBusinessIdOrFallback(wheel);
        if (businessId === style.canonicalWheelId) return 100;
        if (businessId === style.slug_id) return 90;
        if (wheel.slug === style.canonicalWheelId) return 80;
        if (normalizeText(wheel.wheel_title) === normalizeText(style.title)) return 70;
        if (simplifyWheelId(businessId) === simplifyWheelId(style.canonicalWheelId)) return 60;
        if (!isPartNumberTitle(wheel.wheel_title) && !looksHashedId(businessId)) return 50;
        return 0;
      };
      return score(b) - score(a);
    });
    return ranked[0] || null;
  }

  const insertedWheelIdsByStyleOcmmId = new Map();
  for (const style of styleByOcmmId.values()) {
    let canonical = chooseCanonicalParentWheel(style);
    if (!canonical && style.canonicalWheelId === "mini-897-untamed-spoke-wheels") {
      if (APPLY) {
        const insertedId = await convexMutation("mutations:wheelsInsert", {
          id: style.canonicalWheelId,
          wheel_title: style.title,
          part_numbers: style.partNumbers.join(", "),
          notes: style.notes,
          good_pic_url: style.goodPicUrl || undefined,
          image_source: style.goodPicUrl ? "Alloy Wheels Direct" : undefined,
        });
        await convexMutation("mutations:wheelBrandLink", {
          wheel_id: insertedId,
          brand_id: brand._id,
        });
        await convexMutation("mutations:wheelsUpdate", {
          id: insertedId,
          jnc_brands: "Mini",
          text_diameters: style.diameters.join(", "),
          text_widths: style.widths.join(", "),
          text_bolt_patterns: style.boltPatterns.join(", "),
          text_offsets: style.offsets.join(", "),
          text_center_bores: style.centerBores.join(", "),
          text_colors: style.colors.join(", "),
          good_pic_url: style.goodPicUrl || undefined,
          notes: style.notes,
          part_numbers: style.partNumbers.join(", "),
        });
        canonical = {
          _id: insertedId,
          id: style.canonicalWheelId,
          wheel_title: style.title,
          part_numbers: style.partNumbers.join(", "),
          good_pic_url: style.goodPicUrl,
        };
        stats.wheelsInserted += 1;
      } else {
        canonical = {
          _id: `DRYRUN:${style.canonicalWheelId}`,
          id: style.canonicalWheelId,
          wheel_title: style.title,
          part_numbers: style.partNumbers.join(", "),
          good_pic_url: style.goodPicUrl,
        };
      }
      const list = liveWheelCandidatesByStyleId.get(style.ocmm_id) || [];
      list.push(canonical);
      liveWheelCandidatesByStyleId.set(style.ocmm_id, list);
      wheelMatchByLiveId.set(canonical._id, {
        source: "mini_style",
        style,
        primaryPartNumber: style.partNumbers[0] || "",
      });
      insertedWheelIdsByStyleOcmmId.set(style.ocmm_id, canonical._id);
    }
  }

  for (const wheel of liveMiniWheels) {
    const match = wheelMatchByLiveId.get(wheel._id);
    if (!match) continue;
    let patch = null;
    if (match.source === "mini_style") {
      const { style } = match;
      const businessId = wheelBusinessIdOrFallback(wheel);
      const currentTitle = cleanWheelTitle(wheel.wheel_title);
      const primaryPn = match.primaryPartNumber || style.partNumbers[0] || "";
      const titleNeedsPn =
        isPartNumberTitle(currentTitle) ||
        looksHashedId(businessId) ||
        String(businessId).startsWith("bmw_mini-");
      const hasExplicitColorSlug = /-(silver|black|grey|gray|white|chrome|jet-black|midnight-black|frozen-black|gloss-black)-wheels$/i.test(
        businessId
      );
      const wheelTitle =
        titleNeedsPn && primaryPn
          ? `${style.title} (${primaryPn})`
          : hasExplicitColorSlug && currentTitle
            ? currentTitle
            : style.title;
      patch = {
        id: wheel._id,
        wheel_title: wheelTitle,
        part_numbers: style.partNumbers.join(", ") || undefined,
        notes: mergeNotes(wheel.notes, style.notes),
        good_pic_url: style.goodPicUrl || undefined,
        image_source: style.goodPicUrl ? "Alloy Wheels Direct" : wheel.image_source,
        text_diameters: style.diameters.join(", ") || undefined,
        text_widths: style.widths.join(", ") || undefined,
        text_bolt_patterns: style.boltPatterns.join(", ") || undefined,
        text_offsets: style.offsets.join(", ") || undefined,
        text_center_bores: style.centerBores.join(", ") || undefined,
        text_colors: style.colors.join(", ") || undefined,
        jnc_brands: "Mini",
      };
    } else if (match.source === "bmw_part_number") {
      const metadata = match.metadata;
      const primaryPn = match.primaryPartNumber;
      patch = {
        id: wheel._id,
        wheel_title:
          isPartNumberTitle(wheel.wheel_title) || looksHashedId(wheelBusinessIdOrFallback(wheel))
            ? `${metadata.title} (${primaryPn})`
            : metadata.title,
        part_numbers: metadata.partNumbers.join(", ") || undefined,
        notes: mergeNotes(wheel.notes, metadata.notes),
        text_diameters: metadata.diameters.join(", ") || undefined,
        text_widths: metadata.widths.join(", ") || undefined,
        text_bolt_patterns: metadata.boltPatterns.join(", ") || undefined,
        text_center_bores: metadata.centerBores.join(", ") || undefined,
        jnc_brands: "Mini",
      };
    }
    if (patch && APPLY) {
      await convexMutation("mutations:wheelsUpdate", patch);
      stats.wheelsUpdated += 1;
    }
  }

  const supaMiniLinks = supaJunction.filter((row) => String(row.wheel_id || "").toLowerCase().includes("mini-"));
  const supaVehicleIdsByWheelKey = new Map();
  for (const row of supaMiniLinks) {
    const key = simplifyWheelId(row.wheel_id);
    const list = supaVehicleIdsByWheelKey.get(key) || [];
    list.push(String(row.vehicle_id || "").trim());
    supaVehicleIdsByWheelKey.set(key, list);
  }

  const legacyVehicleTargetByBusinessId = new Map(
    liveMiniVehicles.map((vehicle) => [businessIdOrFallback(vehicle), vehicle._id])
  );
  const existingWheelVehiclePairs = new Set(
    snapshotWheelLinks.map((row) => `${row.wheel_id}|${row.vehicle_id}`)
  );

  for (const wheel of liveMiniWheels) {
    const match = wheelMatchByLiveId.get(wheel._id);
    if (!match || match.source !== "mini_style") continue;
    const key = simplifyWheelId(match.style.canonicalWheelId);
    const supaVehicleIds = uniqueSorted(supaVehicleIdsByWheelKey.get(key) || []);
    for (const legacyVehicleId of supaVehicleIds) {
      const targetVehicleId = legacyVehicleTargetByBusinessId.get(legacyVehicleId);
      if (!targetVehicleId) continue;
      const pairKey = `${wheel._id}|${targetVehicleId}`;
      if (existingWheelVehiclePairs.has(pairKey)) continue;
      if (APPLY) {
        await convexMutation("mutations:wheelVehicleLink", {
          wheel_id: wheel._id,
          vehicle_id: targetVehicleId,
        });
      }
      existingWheelVehiclePairs.add(pairKey);
      stats.wheelLinksAdded += 1;
    }
  }

  const currentMiniWheelIds = new Set(
    [
      ...liveMiniWheels.map((wheel) => wheel._id),
      ...insertedWheelIdsByStyleOcmmId.values(),
    ].filter(Boolean)
  );
  const currentMiniVehicleIds = new Set([
    ...liveMiniVehicles.map((vehicle) => vehicle._id),
    ...familyVehicleIds.values(),
  ]);
  const currentMiniWheelVariantCount = snapshotWheelVariants.filter((variant) =>
    currentMiniWheelIds.has(variant.wheel_id)
  ).length;
  const currentMiniVehicleVariantCount = snapshotVehicleVariants.filter((variant) =>
    currentMiniVehicleIds.has(variant.vehicle_id)
  ).length;

  if (currentMiniWheelVariantCount === 0) {
    for (const style of styleByOcmmId.values()) {
      const parentWheel = chooseCanonicalParentWheel(style);
      if (!parentWheel || String(parentWheel._id).startsWith("DRYRUN:")) continue;
      const variants = wsWheelVariantsByWheelOcmmId.get(style.ocmm_id) || [];
      for (const variant of variants) {
        const diameterValue = formatDiameterLabel(variant.diameter).replace(/\s+inch$/, "");
        const widthValue = formatWidthLabel(variant.width);
        const offsetValue = formatOffsetLabel(variant.offset);
        const boltPatternValue = formatBoltPatternLabel(variant.bolt_pattern);
        const centerBoreValue = inferCenterBoresFromBoltPatterns([boltPatternValue])[0] || undefined;
        const colorValue = String(variant.color_finish || "").trim() || undefined;
        const partNumberValue = String(variant.part_number || "").trim() || undefined;
        if (APPLY) {
          const args = {
            wheel_id: parentWheel._id,
            wheel_title: style.title,
            slug: variant.ocmm_id,
            variant_title:
              partNumberValue ||
              [diameterValue, widthValue, boltPatternValue, offsetValue].filter(Boolean).join(" / "),
            part_number: partNumberValue,
            diameter_id: diameterValue ? await getOrCreateRef("diameter", diameterValue) : undefined,
            diameter_value: diameterValue || undefined,
            width_id: widthValue ? await getOrCreateRef("width", widthValue) : undefined,
            width_value: widthValue || undefined,
            offset_id: offsetValue ? await getOrCreateRef("offset", offsetValue) : undefined,
            offset_value: offsetValue || undefined,
            bolt_pattern_id: boltPatternValue
              ? await getOrCreateRef("boltPattern", boltPatternValue)
              : undefined,
            bolt_pattern_value: boltPatternValue || undefined,
            center_bore_id: centerBoreValue
              ? await getOrCreateRef("centerBore", centerBoreValue)
              : undefined,
            center_bore_value: centerBoreValue,
            color_id: colorValue ? await getOrCreateRef("color", colorValue) : undefined,
            color_value: colorValue,
            part_number_id: partNumberValue
              ? await getOrCreateRef("partNumber", partNumberValue)
              : undefined,
          };
          await convexMutation("migrations:promoteWheelVariant", args);
        }
        stats.wheelVariantsPromoted += 1;
      }
    }
  } else {
    console.log(
      `Skipping MINI wheel variant promotion because snapshot already shows ${currentMiniWheelVariantCount} MINI wheel variants.`
    );
  }

  const fullVehiclesAfterUpdates = APPLY
    ? await Promise.all(
        uniqueSorted([...familyVehicleIds.values()]).map((vehicleId) =>
          convexQuery("queries:vehiclesGetByIdFull", { id: vehicleId })
        )
      )
    : [];

  const vehicleFullById = new Map(
    fullVehiclesAfterUpdates.filter(Boolean).map((vehicle) => [vehicle._id, vehicle])
  );
  const manualVehicleFitment = {
    "mini-j01-cooper-ev": {
      text_bolt_patterns: "5 x 112",
      text_center_bores: "66.6mm",
    },
    "mini-r56-r57-hatch-convertible": {
      text_bolt_patterns: "4 x 100",
      text_center_bores: "56.1mm",
    },
    "mini-r61-paceman": {
      text_bolt_patterns: "5 x 120",
      text_center_bores: "72.6mm",
    },
  };

  if (APPLY) {
    for (const definition of [...Object.values(legacyVehicleDefinitions), ...newVehicleDefinitions]) {
      const vehicleId = familyVehicleIds.get(definition.slug);
      if (!vehicleId || String(vehicleId).startsWith("DRYRUN:")) continue;
      const full = vehicleFullById.get(vehicleId);
      const linkedWheels = full?.wheels || [];
      const diameters = new Set();
      const widths = new Set();
      const boltPatterns = new Set();
      const centerBores = new Set();
      for (const wheel of linkedWheels) {
        for (const part of String(wheel.text_diameters || "").split(",")) {
          if (part.trim()) diameters.add(part.trim());
        }
        for (const part of String(wheel.text_widths || "").split(",")) {
          if (part.trim()) widths.add(part.trim());
        }
        for (const part of String(wheel.text_bolt_patterns || "").split(",")) {
          if (part.trim()) boltPatterns.add(part.trim());
        }
        for (const part of String(wheel.text_center_bores || "").split(",")) {
          if (part.trim()) centerBores.add(part.trim());
        }
      }
      const patch = { id: vehicleId };
      const manual = manualVehicleFitment[definition.slug] || {};
      const textDiameters = uniqueSorted([...diameters], sortNumericLabels).join(", ");
      const textWidths = uniqueSorted([...widths], sortNumericLabels).join(", ");
      const textBoltPatterns = uniqueSorted([...boltPatterns], sortNumericLabels).join(", ");
      const textCenterBores = uniqueSorted([...centerBores], sortNumericLabels).join(", ");
      if (textDiameters) patch.text_diameters = textDiameters;
      if (textWidths) patch.text_widths = textWidths;
      if (textBoltPatterns || manual.text_bolt_patterns) {
        patch.text_bolt_patterns = textBoltPatterns || manual.text_bolt_patterns;
      }
      if (textCenterBores || manual.text_center_bores) {
        patch.text_center_bores = textCenterBores || manual.text_center_bores;
      }
      await convexMutation("mutations:vehiclesUpdate", patch);
    }
  }

  if (currentMiniVehicleVariantCount === 0) {
    const existingVariantKeysByVehicleId = new Map();
    if (APPLY) {
      const familyVehicleIdsList = uniqueSorted([...familyVehicleIds.values()]);
      const fullVehicles = await Promise.all(
        familyVehicleIdsList.map((vehicleId) => convexQuery("queries:vehiclesGetByIdFull", { id: vehicleId }))
      );
      for (const fullVehicle of fullVehicles) {
        const set = new Set();
        for (const variant of fullVehicle?.variants || []) {
          const key = [
            variant.slug || "",
            variant.variant_title || "",
            variant.trim_level || "",
            variant.year_from || "",
            variant.year_to || "",
          ].join("|");
          set.add(key);
        }
        existingVariantKeysByVehicleId.set(fullVehicle?._id, set);
      }
    }
    for (const variant of wsMiniVehicleVariants) {
      const vehicle = wsVehicleByOcmmId.get(variant.vehicle_ocmm_id);
      if (!vehicle) continue;
      const parentSlug = vehicleParentSlugByGeneration[vehicle.generation];
      const parentVehicleId = familyVehicleIds.get(parentSlug);
      if (!parentVehicleId || String(parentVehicleId).startsWith("DRYRUN:")) continue;
      const variantTitle = groupedParentSlugs.has(parentSlug)
        ? `${vehicle.generation} ${variant.trim_level}`
        : variant.trim_level;
      const key = [
        variant.slug_id || "",
        variantTitle || "",
        variant.trim_level || "",
        parseYear(variant.year_start) || "",
        parseYear(variant.year_end) || "",
      ].join("|");
      const existingKeys = existingVariantKeysByVehicleId.get(parentVehicleId) || new Set();
      if (existingKeys.has(key)) continue;
      if (APPLY) {
        await convexMutation("migrations:promoteVehicleVariant", {
          vehicle_id: parentVehicleId,
          slug: variant.slug_id,
          variant_title: variantTitle,
          trim_level: variant.trim_level,
          year_from: parseYear(variant.year_start),
          year_to: parseYear(variant.year_end),
        });
      }
      existingKeys.add(key);
      existingVariantKeysByVehicleId.set(parentVehicleId, existingKeys);
      stats.vehicleVariantsPromoted += 1;
    }
  } else {
    console.log(
      `Skipping MINI vehicle variant promotion because snapshot already shows ${currentMiniVehicleVariantCount} MINI vehicle variants.`
    );
  }

  const unresolvedWheelLines = unresolvedWheelRows
    .slice(0, 50)
    .map(
      (row) =>
        `- \`${row.id || row._id}\` | ${row.title || "(no title)"}${row.part_numbers ? ` | PN ${row.part_numbers}` : ""}`
    )
    .join("\n");

  const report = `# MINI Data Backfill Report

Date: ${new Date().toISOString()}
Mode: ${APPLY ? "APPLY" : "DRY RUN"}
Snapshot: \`${SNAPSHOT_ZIP}\`

## Summary

- Legacy MINI vehicle rows normalized: ${stats.vehiclesUpdated}
- New MINI vehicle rows inserted: ${stats.vehiclesInserted}
- MINI wheel rows updated: ${stats.wheelsUpdated}
- New MINI wheel rows inserted: ${stats.wheelsInserted}
- MINI wheel-to-vehicle links added: ${stats.wheelLinksAdded}
- MINI wheel variants promoted: ${stats.wheelVariantsPromoted}
- MINI vehicle variants promoted: ${stats.vehicleVariantsPromoted}

## Current Model Shape

- Production MINI family rows targeted: 13
- Workshop MINI vehicles deduped: ${wsMiniVehicles.length}
- Workshop MINI vehicle variants deduped: ${wsMiniVehicleVariants.length}
- Workshop MINI wheel styles deduped: ${wsMiniWheels.length}
- Workshop MINI wheel variants deduped: ${wsMiniWheelVariants.length}

## Remaining Wheel Rows Without Verified Workshop Match

Count: ${unresolvedWheelRows.length}

${unresolvedWheelLines || "- None"}

Most of these are JCW-specific or archived MINI rows that do not resolve through the current MINI workshop export or live AWD product pages.

## Suggested Schema / Admin Changes

- Add \`vehicle_family_id\` or a dedicated \`oem_vehicle_families\` table.
  MINI fitment naturally exists at both family scope (\`F55/F56/F57\`) and exact model scope (\`F56 Hatch 3-Door\`). The current model forces those into one table.
- Add row-level provenance fields like \`source_system\`, \`source_record_id\`, \`source_url\`, \`verification_status\`, and \`verified_at\`.
  This backfill had to combine workshop rows, BMW/MINI part-number rows, Supabase legacy junctions, and AWD product pages.
- Add fitment provenance / confidence on \`j_wheel_vehicle\`.
  Some links are direct legacy links, some are clean family links, and some model gaps remain unverified.
- Expose admin write support for immutable business ids or an alias table.
  Several preserved MINI legacy vehicle rows have misaligned \`id\` values that cannot be corrected through the deployed mutation surface.
- Expose create/write support for \`oem_drive_types\`, \`oem_body_styles\`, \`oem_markets\`, and the vehicle measurement junctions.
  MINI vehicle variants can be promoted today, but drivetrain/body-style references cannot be populated cleanly from the deployed API surface.
- Add a write path for \`j_oem_vehicle_variant_wheel_variant\`.
  It is the correct place to store verified trim-to-wheel-variant fitment once model-level MINI fitment sources are available.
`;

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report);

  console.log("");
  console.log(JSON.stringify(stats, null, 2));
  console.log(`Report written to ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
