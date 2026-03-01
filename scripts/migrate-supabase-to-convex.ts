/**
 * Migration script: Supabase → Convex
 *
 * Uses ONLY:
 * - @supabase/supabase-js for Supabase reads
 * - dotenv for env vars
 * - Native fetch() for ALL Convex calls (no Convex SDK)
 *
 * Convex HTTP API:
 *   Query:  POST ${CONVEX_URL}/api/query   body: { path, args, format: "json" }
 *   Mutation: POST ${CONVEX_URL}/api/mutation body: { path, args, format: "json" }
 *   Response: { status: "success", value } or { status: "error", errorMessage }
 *
 * Prerequisites: npm install @supabase/supabase-js dotenv
 * Run from project root: npx tsx scripts/migrate-supabase-to-convex.ts
 * Use --force to upsert (update if exists, else insert) instead of skipping existing.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const CONVEX_URL = process.env.VITE_CONVEX_URL!;

const required = [
  ["SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_KEY", SUPABASE_KEY],
  ["VITE_CONVEX_URL", CONVEX_URL],
] as const;
for (const [name, value] of required) {
  if (!value || String(value).trim() === "") {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local and run from project root.`
    );
  }
}

const FORCE = process.argv.includes("--force");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: "public" },
  global: { headers: { apikey: SUPABASE_KEY } },
});

// --- Convex HTTP API (native fetch only, no SDK) ---

type ConvexSuccess = { status: "success"; value: unknown };
type ConvexError = { status: "error"; errorMessage: string; errorData?: unknown };

async function convexQuery(
  path: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  let json: ConvexSuccess | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess | ConvexError;
  } catch {
    throw new Error(
      `Convex query failed: HTTP ${res.status}, body: ${text.slice(0, 500)}`
    );
  }
  if (json.status !== "success") {
    throw new Error(
      `Convex query ${path}: ${json.errorMessage ?? "unknown error"}`
    );
  }
  return json.value;
}

async function convexMutation(
  path: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/mutation`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  let json: ConvexSuccess | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess | ConvexError;
  } catch {
    throw new Error(
      `Convex mutation failed: HTTP ${res.status}, body: ${text.slice(0, 500)}`
    );
  }
  if (json.status !== "success") {
    throw new Error(
      `Convex mutation ${path}: ${json.errorMessage ?? "unknown error"}`
    );
  }
  return json.value;
}

// --- Helpers for Supabase ref fields (id, value, or array of same) ---

function extractRefValues(ref: unknown): string[] {
  if (ref == null) return [];
  if (Array.isArray(ref)) {
    return ref
      .map((x) =>
        typeof x === "string"
          ? x
          : (x as { id?: string; value?: string })?.id ??
            (x as { value?: string })?.value
      )
      .filter(Boolean) as string[];
  }
  if (typeof ref === "string") return [ref];
  return [];
}

function extractFirstRefValue(ref: unknown): string | null {
  const vals = extractRefValues(ref);
  return vals[0] ?? null;
}

/** Parse plain-text fields (e.g. "18, 19" or "5x112") into trimmed non-empty strings. */
function parseTextField(val: unknown): string[] {
  if (val == null) return [];
  if (Array.isArray(val)) {
    return val.flatMap((x) => parseTextField(x));
  }
  const s = String(val).trim();
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Slugify id for prefix matching: lowercase, spaces/colons → hyphens, collapse hyphens. */
function slugifyId(id: string): string {
  return id
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/:/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve brand_id from vehicle id by trying progressively longer hyphen-prefixes. */
function resolveBrandFromVehicleId(
  vehicleId: string,
  brandIdMap: Map<string, string>
): string | null {
  const slug = slugifyId(vehicleId);
  const parts = slug.split("-").filter(Boolean);
  for (let len = 1; len <= parts.length; len++) {
    const prefix = parts.slice(0, len).join("-");
    const id = brandIdMap.get(prefix);
    if (id) return id;
  }
  return null;
}

// --- 1. Fetch from Supabase ---

async function fetchSupabase() {
  console.log("[1/6] Fetching from Supabase...");
  const [
    brandsRes,
    vehiclesRes,
    wheelsRes,
    boltPatternsRes,
    centerBoresRes,
    colorsRes,
    diametersRes,
    widthsRes,
    tireSizesRes,
  ] = await Promise.all([
    supabase.from("oem_brands").select("*"),
    supabase.from("oem_vehicles").select("*"),
    supabase.from("oem_wheels").select("*"),
    supabase.from("oem_bolt_patterns").select("*"),
    supabase.from("oem_center_bores").select("*"),
    supabase.from("oem_colors").select("*"),
    supabase.from("oem_diameters").select("*"),
    supabase.from("oem_widths").select("*"),
    supabase.from("tire_sizes").select("*"),
  ]);

  const brands = brandsRes.data ?? [];
  const vehicles = vehiclesRes.data ?? [];
  const wheels = wheelsRes.data ?? [];
  const boltPatterns = boltPatternsRes.data ?? [];
  const centerBores = centerBoresRes.data ?? [];
  const colors = colorsRes.data ?? [];
  const diameters = diametersRes.data ?? [];
  const widths = widthsRes.data ?? [];
  const tireSizes = tireSizesRes.data ?? [];

  if (brandsRes.error) throw new Error(`Supabase oem_brands: ${brandsRes.error.message}`);
  if (vehiclesRes.error) throw new Error(`Supabase oem_vehicles: ${vehiclesRes.error.message}`);
  if (wheelsRes.error) throw new Error(`Supabase oem_wheels: ${wheelsRes.error.message}`);

  console.log(
    `  Brands: ${brands.length}, Vehicles: ${vehicles.length}, Wheels: ${wheels.length}, ` +
      `Bolt: ${boltPatterns.length}, CenterBore: ${centerBores.length}, Colors: ${colors.length}, ` +
      `Diameters: ${diameters.length}, Widths: ${widths.length}, Tire sizes: ${tireSizes.length}`
  );
  // Debug: full first vehicle and first wheel to see structure
  if (vehicles.length > 0) {
    console.log(
      "[debug] vehicle[0] full:",
      JSON.stringify(vehicles[0], null, 2)
    );
  }
  if (wheels.length > 0) {
    console.log(
      "[debug] wheel[0] full:",
      JSON.stringify(wheels[0], null, 2)
    );
  }
  return {
    brands: brands as Record<string, unknown>[],
    vehicles: vehicles as Record<string, unknown>[],
    wheels: wheels as Record<string, unknown>[],
    boltPatterns: boltPatterns as Record<string, unknown>[],
    centerBores: centerBores as Record<string, unknown>[],
    colors: colors as Record<string, unknown>[],
    diameters: diameters as Record<string, unknown>[],
    widths: widths as Record<string, unknown>[],
    tireSizes: tireSizes as Record<string, unknown>[],
  };
}

// --- 2. Reference tables (get-or-create via mutations) ---

async function migrateRefTable(
  name: string,
  values: string[],
  fieldName: string,
  mutationPath: string
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(values)].filter(Boolean);
  for (const v of unique) {
    const id = (await convexMutation(mutationPath, { [fieldName]: v })) as string;
    map.set(v, id);
  }
  console.log(`  ${name}: ${unique.length} unique values`);
  return map;
}

async function migrateReferenceTables(
  data: Awaited<ReturnType<typeof fetchSupabase>>
) {
  console.log("[2/6] Migrating reference tables (get-or-create)...");
  // Parse text_* from vehicle rows (and wheels for color/tire_size)
  const fromVehicles = {
    bolt: data.vehicles.flatMap((v) => parseTextField(v.text_bolt_patterns)),
    centerBore: data.vehicles.flatMap((v) => parseTextField(v.text_center_bores)),
    diameter: data.vehicles.flatMap((v) => parseTextField(v.text_diameters)),
    width: data.vehicles.flatMap((v) => parseTextField(v.text_widths)),
  };
  const fromWheels = {
    color: data.wheels.flatMap((w) =>
      parseTextField((w as Record<string, unknown>).text_colors).length
        ? parseTextField((w as Record<string, unknown>).text_colors)
        : extractRefValues(w.color_ref)
    ),
    tireSize: data.wheels.flatMap((w) =>
      parseTextField((w as Record<string, unknown>).text_tire_sizes).length
        ? parseTextField((w as Record<string, unknown>).text_tire_sizes)
        : extractRefValues(w.tire_size_ref)
    ),
  };
  const boltValues = [
    ...fromVehicles.bolt,
    ...data.wheels.flatMap((w) => parseTextField((w as Record<string, unknown>).text_bolt_patterns)),
  ].filter(Boolean);
  const centerBoreValues = [
    ...fromVehicles.centerBore,
    ...data.wheels.flatMap((w) => parseTextField((w as Record<string, unknown>).text_center_bores)),
  ].filter(Boolean);
  const colorValues = [
    ...fromWheels.color,
    ...data.colors.map((r) => String(r.color ?? "")),
  ].filter(Boolean);
  const diameterValues = [
    ...fromVehicles.diameter,
    ...data.wheels.flatMap((w) => parseTextField((w as Record<string, unknown>).text_diameters)),
  ].filter(Boolean);
  const widthValues = [
    ...fromVehicles.width,
    ...data.wheels.flatMap((w) => parseTextField((w as Record<string, unknown>).text_widths)),
  ].filter(Boolean);
  const tireSizeValues = [
    ...fromWheels.tireSize,
    ...data.tireSizes.map((r) => String(r.tire_size ?? "")),
  ].filter(Boolean);

  const [boltMap, centerBoreMap, colorMap, diameterMap, widthMap, tireSizeMap] =
    await Promise.all([
      migrateRefTable(
        "oem_bolt_patterns",
        boltValues,
        "bolt_pattern",
        "mutations:boltPatternsInsert"
      ),
      migrateRefTable(
        "oem_center_bores",
        centerBoreValues,
        "center_bore",
        "mutations:centerBoresInsert"
      ),
      migrateRefTable(
        "oem_colors",
        colorValues,
        "color",
        "mutations:colorsInsert"
      ),
      migrateRefTable(
        "oem_diameters",
        diameterValues,
        "diameter",
        "mutations:diametersInsert"
      ),
      migrateRefTable(
        "oem_widths",
        widthValues,
        "width",
        "mutations:widthsInsert"
      ),
      migrateRefTable(
        "tire_sizes",
        tireSizeValues,
        "tire_size",
        "mutations:tireSizesInsert"
      ),
    ]);
  return {
    boltPattern: boltMap,
    centerBore: centerBoreMap,
    color: colorMap,
    diameter: diameterMap,
    width: widthMap,
    tireSize: tireSizeMap,
  };
}

// --- 3. Brands ---

async function migrateBrands(
  brands: Record<string, unknown>[],
  existingBrandIds: Set<string>,
  brandIdMap: Map<string, string>,
  force: boolean
) {
  console.log("[3/6] Migrating brands..." + (force ? " (--force: upsert)" : ""));
  let inserted = 0;
  let updated = 0;
  for (const b of brands) {
    const id = String(b.id ?? "").trim().toLowerCase();
    if (!id) continue;
    const brand_title = String(b.brand_title ?? "").trim();
    const payload = {
      brand_title,
      brand_description: (b.brand_description as string) ?? undefined,
      brand_image_url: (b.brand_image_url as string) ?? undefined,
      brand_page: (b.brand_page as string) ?? undefined,
      subsidiaries: (b.subsidiaries as string) ?? undefined,
      wheel_count:
        typeof b.wheel_count === "number" ? b.wheel_count : undefined,
    };
    const existing = (await convexQuery("queries:brandsGetById", {
      id,
    })) as { _id: string; brand_title?: string } | null;
    if (existing) {
      if (!force) {
        brandIdMap.set(id, existing._id);
        if (existing.brand_title)
          brandIdMap.set(existing.brand_title.toLowerCase(), existing._id);
        continue;
      }
      await convexMutation("mutations:brandsUpdate", {
        id: existing._id,
        ...payload,
      });
      brandIdMap.set(id, existing._id);
      if (brand_title) brandIdMap.set(brand_title.toLowerCase(), existing._id);
      updated++;
    } else {
      const _id = (await convexMutation("mutations:brandsInsert", {
        id,
        ...payload,
      })) as string;
      brandIdMap.set(id, _id);
      if (brand_title) brandIdMap.set(brand_title.toLowerCase(), _id);
      existingBrandIds.add(id);
      inserted++;
    }
  }
  console.log(
    `  [3/6] Brands: ${inserted} inserted` +
      (force && updated > 0 ? `, ${updated} updated` : "") +
      ` (${brandIdMap.size} total in map)`
  );
}

// --- 4. Vehicles ---

async function migrateVehicles(
  vehicles: Record<string, unknown>[],
  brandIdMap: Map<string, string>,
  existingVehicleIds: Set<string>,
  force: boolean
) {
  console.log("[4/6] Migrating vehicles..." + (force ? " (--force: upsert)" : ""));
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  for (const v of vehicles) {
    const id = String(v.id ?? "").trim();
    if (!id) continue;
    let brand_id: string | null =
      (() => {
        const brandName = String(v.text_brands ?? "").trim();
        if (brandName) return brandIdMap.get(brandName.toLowerCase()) ?? null;
        return null;
      })();
    if (!brand_id) {
      brand_id = resolveBrandFromVehicleId(id, brandIdMap);
    }
    if (!brand_id) {
      console.warn(
        `  Skip vehicle ${id}: brand not found (text_brands empty, no id prefix match)`
      );
      continue;
    }
    const payload = {
      brand_id,
      vehicle_id_only: (v.vehicle_id_only as string) ?? undefined,
      model_name: (v.model_name as string) ?? undefined,
      vehicle_title: (v.vehicle_title as string) ?? undefined,
      generation: (v.generation as string) ?? undefined,
      production_years: (v.production_years as string) ?? undefined,
      production_stats: (v.production_stats as string) ?? undefined,
      vehicle_image: (v.vehicle_image as string) ?? undefined,
    };
    const existing = (await convexQuery("queries:vehiclesGetById", {
      id,
    })) as { _id: string } | null;
    if (existing) {
      if (!force) {
        skipped++;
        existingVehicleIds.add(id);
        continue;
      }
      await convexMutation("mutations:vehiclesUpdate", {
        id: existing._id,
        ...payload,
      });
      existingVehicleIds.add(id);
      updated++;
    } else {
      await convexMutation("mutations:vehiclesInsert", {
        id,
        ...payload,
      });
      existingVehicleIds.add(id);
      inserted++;
    }
  }
  console.log(
    `  [4/6] Vehicles: ${inserted} inserted` +
      (force && updated > 0 ? `, ${updated} updated` : "") +
      (skipped > 0 ? `, ${skipped} skipped (existing)` : "")
  );
}

async function buildVehicleIdMap(): Promise<Map<string, string>> {
  const vehicles = (await convexQuery("queries:vehiclesGetAll")) as {
    id: string;
    _id: string;
  }[];
  const map = new Map<string, string>();
  for (const v of vehicles) map.set(String(v.id), v._id);
  return map;
}

// --- 5. Wheels + junction links ---

async function migrateWheelsAndJunctions(
  wheels: Record<string, unknown>[],
  brandIdMap: Map<string, string>,
  refMaps: Awaited<ReturnType<typeof migrateReferenceTables>>,
  existingWheelIds: Set<string>,
  vehicleIdToConvexId: Map<string, string>,
  force: boolean
) {
  console.log(
    "[5/6] Migrating wheels and junction tables..." +
      (force ? " (--force: upsert)" : "")
  );
  let wheelsInserted = 0;
  let wheelsUpdated = 0;
  let wheelsSkipped = 0;
  for (const w of wheels) {
    const id = String(w.id ?? "").trim();
    if (!id) continue;
    const brandName = String((w as Record<string, unknown>).text_brands ?? "").trim();
    const brand_id = brandIdMap.get(brandName.toLowerCase());
    if (!brand_id) {
      console.warn(
        `  Skip wheel ${id}: brand not found for text_brands "${brandName}"`
      );
      continue;
    }
    const wheelPayload = {
      brand_id,
      wheel_title: String(w.wheel_title ?? ""),
      color: (w.color as string) ?? undefined,
      wheel_offset: (w.wheel_offset as string) ?? undefined,
      weight: (w.weight as string) ?? undefined,
      metal_type: (w.metal_type as string) ?? undefined,
      part_numbers: (w.part_numbers as string) ?? undefined,
      notes: (w.notes as string) ?? undefined,
      good_pic_url: (w.good_pic_url as string) ?? undefined,
      image_source: (w.image_source as string) ?? undefined,
      uuid: (w.uuid as string) ?? undefined,
      ai_processing_complete:
        typeof w.ai_processing_complete === "boolean"
          ? w.ai_processing_complete
          : undefined,
      design_style_tags: Array.isArray(w.design_style_ref)
        ? (w.design_style_ref as string[])
        : undefined,
      specifications_json:
        typeof w.specifications === "object" && w.specifications != null
          ? JSON.stringify(w.specifications)
          : undefined,
    };
    const existing = (await convexQuery("queries:wheelsGetById", {
      id,
    })) as { _id: string } | null;
    let wheelId: string;
    if (existing) {
      if (!force) {
        wheelsSkipped++;
        existingWheelIds.add(id);
        continue;
      }
      await convexMutation("mutations:wheelsUpdate", {
        id: existing._id,
        ...wheelPayload,
      });
      wheelId = existing._id;
      existingWheelIds.add(id);
      wheelsUpdated++;
    } else {
      wheelId = (await convexMutation("mutations:wheelsInsert", {
        id,
        ...wheelPayload,
      })) as string;
      existingWheelIds.add(id);
      wheelsInserted++;
    }

    const wRec = w as Record<string, unknown>;
    const wheelVehicleRefs =
      parseTextField(wRec.text_vehicles).length > 0
        ? parseTextField(wRec.text_vehicles)
        : extractRefValues(w.vehicle_ref);
    for (const vid of wheelVehicleRefs) {
      const vehicleConvexId = vehicleIdToConvexId.get(vid.trim());
      if (vehicleConvexId)
        await convexMutation("mutations:wheelVehicleLink", {
          wheel_id: wheelId,
          vehicle_id: vehicleConvexId,
        });
    }
    const wheelBolt =
      parseTextField(wRec.text_bolt_patterns).length > 0
        ? parseTextField(wRec.text_bolt_patterns)
        : extractRefValues(w.bolt_pattern_ref);
    for (const bp of wheelBolt) {
      const boltId = refMaps.boltPattern.get(bp);
      if (boltId)
        await convexMutation("mutations:wheelBoltPatternLink", {
          wheel_id: wheelId,
          bolt_pattern_id: boltId,
        });
    }
    const wheelDiam =
      parseTextField(wRec.text_diameters).length > 0
        ? parseTextField(wRec.text_diameters)
        : extractRefValues(w.diameter_ref);
    for (const d of wheelDiam) {
      const diamId = refMaps.diameter.get(d);
      if (diamId)
        await convexMutation("mutations:wheelDiameterLink", {
          wheel_id: wheelId,
          diameter_id: diamId,
        });
    }
    const wheelWidth =
      parseTextField(wRec.text_widths).length > 0
        ? parseTextField(wRec.text_widths)
        : extractRefValues(w.width_ref);
    for (const ww of wheelWidth) {
      const widthId = refMaps.width.get(ww);
      if (widthId)
        await convexMutation("mutations:wheelWidthLink", {
          wheel_id: wheelId,
          width_id: widthId,
        });
    }
    const wheelCb =
      parseTextField(wRec.text_center_bores).length > 0
        ? parseTextField(wRec.text_center_bores)
        : extractRefValues(w.center_bore_ref);
    for (const cb of wheelCb) {
      const cbId = refMaps.centerBore.get(cb);
      if (cbId)
        await convexMutation("mutations:wheelCenterBoreLink", {
          wheel_id: wheelId,
          center_bore_id: cbId,
        });
    }
    const wheelColor =
      parseTextField(wRec.text_colors).length > 0
        ? parseTextField(wRec.text_colors)
        : extractRefValues(w.color_ref);
    for (const c of wheelColor) {
      const colorId = refMaps.color.get(c);
      if (colorId)
        await convexMutation("mutations:wheelColorLink", {
          wheel_id: wheelId,
          color_id: colorId,
        });
    }
    const wheelTire =
      parseTextField(wRec.text_tire_sizes).length > 0
        ? parseTextField(wRec.text_tire_sizes)
        : extractRefValues(w.tire_size_ref);
    for (const ts of wheelTire) {
      const tsId = refMaps.tireSize.get(ts);
      if (tsId)
        await convexMutation("mutations:wheelTireSizeLink", {
          wheel_id: wheelId,
          tire_size_id: tsId,
        });
    }
  }
  console.log(
    `  [5/6] Wheels: ${wheelsInserted} inserted` +
      (force && wheelsUpdated > 0 ? `, ${wheelsUpdated} updated` : "") +
      (wheelsSkipped > 0 ? `, ${wheelsSkipped} skipped (existing)` : "")
  );
}

// --- Main ---

async function main() {
  console.log("Supabase → Convex migration");
  console.log("CONVEX_URL:", CONVEX_URL);
  if (FORCE) console.log("--force: upsert (update if exists, else insert)");
  console.log("");

  const data = await fetchSupabase();

  let existingBrandIds: Set<string>;
  let existingVehicleIds: Set<string>;
  let existingWheelIds: Set<string>;
  try {
    const brands = (await convexQuery("queries:brandsGetAll")) as {
      id?: string;
      _id: string;
    }[];
    existingBrandIds = new Set(
      brands.map((b) => String(b.id ?? b._id).toLowerCase())
    );
    const vehicles = (await convexQuery("queries:vehiclesGetAll")) as {
      id: string;
    }[];
    existingVehicleIds = new Set(vehicles.map((v) => String(v.id)));
    const wheels = (await convexQuery("queries:wheelsGetAll")) as {
      id: string;
    }[];
    existingWheelIds = new Set(wheels.map((w) => String(w.id)));
  } catch (err) {
    const e = err as Error;
    console.error("Convex connectivity check failed:", e.message);
    throw err;
  }

  const brandIdMap = new Map<string, string>();
  const refMaps = await migrateReferenceTables(data);
  await migrateBrands(data.brands, existingBrandIds, brandIdMap, FORCE);
  await migrateVehicles(data.vehicles, brandIdMap, existingVehicleIds, FORCE);
  const vehicleIdMap = await buildVehicleIdMap();
  await migrateWheelsAndJunctions(
    data.wheels,
    brandIdMap,
    refMaps,
    existingWheelIds,
    vehicleIdMap,
    FORCE
  );

  console.log("[6/6] Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
