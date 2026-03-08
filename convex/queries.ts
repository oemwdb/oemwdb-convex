/**
 * Convex queries for core domain tables with junction table lookups.
 * No *_ref fields. Use junction tables for many-to-many.
 */

import { query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// =============================================================================
// OEM BRANDS
// =============================================================================

export const brandsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const brandsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id looks like Convex _id, try db.get first
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_brands", args.id as Id<"oem_brands">);
        if (byConvexId) return byConvexId;
      }
      // 2. Try slug (URL param like "mini" or "mini-cooper")
      const bySlug = await ctx.db
        .query("oem_brands")
        .withIndex("by_slug", (q) => q.eq("slug", args.id))
        .first();
      if (bySlug) return bySlug;
      // 3. Try slug with hyphen-to-title case (e.g. "mini" -> "Mini")
      const titleCase = args.id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      const byTitle = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title", (q) => q.eq("brand_title", titleCase))
        .first();
      if (byTitle) return byTitle;
      // 4. Fall back to business id field
      return await ctx.db
        .query("oem_brands")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

export const brandsGetByTitle = query({
  args: { brandTitle: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title", (q) => q.eq("brand_title", args.brandTitle))
        .first();
    } catch {
      return null;
    }
  },
});

export const brandsGetAllWithCounts = query({
  args: {},
  handler: async (ctx) => {
    try {
      const brands = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const result = await Promise.all(
        brands.map(async (brand) => {
          const vehicleLinks = await ctx.db
            .query("j_vehicle_brand")
            .withIndex("by_brand", (q) => q.eq("brand_id", brand._id))
            .collect();
          const wheelLinks = await ctx.db
            .query("j_wheel_brand")
            .withIndex("by_brand", (q) => q.eq("brand_id", brand._id))
            .collect();
          return {
            ...brand,
            vehicleCount: vehicleLinks.length,
            wheelCount: wheelLinks.length,
          };
        })
      );
      return result;
    } catch {
      return [];
    }
  },
});

export const vehiclesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_vehicles")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const vehiclesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id is a Convex _id, db.get returns the doc (invalid id returns null)
      const byConvexId = await ctx.db.get(
        "oem_vehicles",
        args.id as Id<"oem_vehicles">
      );
      if (byConvexId) return byConvexId;
      // 2. Fall back to business id (slug) — id is optional on oem_vehicles
      const byBusinessId = await ctx.db
        .query("oem_vehicles")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      return byBusinessId ?? null;
    } catch {
      return null;
    }
  },
});

export const vehiclesGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    try {
      const vehicles = await ctx.db
        .query("oem_vehicles")
        .order("asc")
        .collect();
      const result = await Promise.all(
        vehicles.map(async (v) => {
          const [link, boltLinks, centerBoreLinks] = await Promise.all([
            ctx.db
              .query("j_vehicle_brand")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", v._id))
              .first(),
            ctx.db
              .query("j_vehicle_bolt_pattern")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", v._id))
              .collect(),
            ctx.db
              .query("j_vehicle_center_bore")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", v._id))
              .collect(),
          ]);
          const brand = link ? await ctx.db.get("oem_brands", link.brand_id) : null;
          const boltPattern = Array.from(
            new Set(
              boltLinks
                .map((entry) => (entry.bolt_pattern ?? "").trim())
                .filter(Boolean)
            )
          ).join(", ");
          const centerBore = Array.from(
            new Set(
              centerBoreLinks
                .map((entry) => (entry.center_bore ?? "").trim())
                .filter(Boolean)
            )
          ).join(", ");
          return {
            ...v,
            brand_name: (brand?.brand_title ?? v.text_brands ?? null) as string | null,
            brand_id: link?.brand_id ?? null,
            bolt_pattern: ((boltPattern || v.text_bolt_patterns) ?? null) as string | null,
            center_bore: ((centerBore || v.text_center_bores) ?? null) as string | null,
          };
        })
      );
      return result;
    } catch {
      return [];
    }
  },
});

export const vehiclesGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_vehicle_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
    } catch {
      return [];
    }
  },
});

export const vehicleVariantsGetByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const variants = await ctx.db
        .query("vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      return variants.sort(
        (a, b) => (a.year_from ?? 0) - (b.year_from ?? 0)
      );
    } catch {
      return [];
    }
  },
});

export const vehiclesGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_vehicles")),
  },
  handler: async (ctx, args) => {
    try {
      let vehicle = null;
      if (typeof args.id === "string") {
        // Try Convex _id first (format: alphanumeric, typically 32 chars)
        if (/^[a-z0-9]{20,}$/i.test(args.id)) {
          vehicle = await ctx.db.get("oem_vehicles", args.id as Id<"oem_vehicles">);
        }
        if (!vehicle) {
          vehicle = await ctx.db
            .query("oem_vehicles")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first();
        }
        if (!vehicle) {
          vehicle = await ctx.db
            .query("oem_vehicles")
            .filter((q) =>
              q.or(
                q.eq(q.field("vehicle_title"), args.id),
                q.eq(q.field("model_name"), args.id),
                q.eq(q.field("slug"), args.id)
              )
            )
            .first();
        }
      } else {
        vehicle = await ctx.db.get("oem_vehicles", args.id);
      }
      if (!vehicle) return null;

      const vehicleId = vehicle._id;
      const [variants, wheelLinks] = await Promise.all([
        ctx.db
          .query("vehicle_variants")
          .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
        ctx.db
          .query("j_wheel_vehicle")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
      ]);

      const wheelDocs = await Promise.all(
        wheelLinks.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );

      return {
        ...vehicle,
        brand: null,
        engine: null,
        variants: variants ?? [],
        wheels: wheelDocs.filter((w): w is NonNullable<typeof w> => w !== null),
      };
    } catch {
      return null;
    }
  },
});

// =============================================================================
// OEM ENGINES
// =============================================================================

export const enginesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_engines")
        .withIndex("by_engine_code")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const enginesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_engines")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

export const enginesGetByCode = query({
  args: { engineCode: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_engines")
        .withIndex("by_engine_code", (q) => q.eq("engine_code", args.engineCode))
        .first();
    } catch {
      return null;
    }
  },
});

export const vehiclesGetByEngine = query({
  args: { engineId: v.id("oem_engines") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_vehicle_engine")
        .withIndex("by_engine", (q) => q.eq("engine_id", args.engineId))
        .collect();
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((v) => ({ ...v, brand_name: null as string | null }));
    } catch {
      return [];
    }
  },
});

// =============================================================================
// OEM WHEELS
// =============================================================================

export const wheelsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_wheels")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

/** Split a spec string by common separators and return trimmed non-empty parts. */
function splitSpecValues(raw: string): string[] {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/[,;|\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Split diameter/width string that may be space-separated ("19 inch 20 inch") into parts. */
function splitSpecValuesWithSpaces(raw: string): string[] {
  const byComma = splitSpecValues(raw);
  const out: string[] = [];
  for (const part of byComma) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const spaceSplit = trimmed.split(/\s+(?=\d)/);
    for (const s of spaceSplit) {
      const t = s.trim();
      if (t) out.push(t);
    }
  }
  return out.length ? out : byComma;
}

/** Canonical diameter for filter display: "17 inch" / "17\"" -> "17", else strip " inch" and trim. */
function normalizeDiameterOption(v: string): string {
  const n = v.replace(/\s*inch\s*/gi, "").replace(/[""]/g, "").trim();
  const num = /^\d+(\.\d+)?$/.test(n) ? n : v.trim();
  return num || v.trim();
}

/** Canonical width for filter display: "8.5J" -> "8.5", "8" -> "8". */
function normalizeWidthOption(v: string): string {
  const n = v.replace(/\s*J\s*$/gi, "").trim();
  return /^\d+(\.\d+)?$/.test(n) ? n : v.trim();
}

/** Display diameter exactly as requested: "18 inch". */
function formatDiameterOption(v: string): string {
  const n = parseFloat(normalizeDiameterOption(v));
  return Number.isNaN(n) ? v.trim() : `${Number.isInteger(n) ? String(n) : String(n)} inch`;
}

/** Display width exactly as requested: "8.5J", "10.0J". */
function formatWidthOption(v: string): string {
  const n = parseFloat(normalizeWidthOption(v));
  return Number.isNaN(n) ? v.trim() : `${n.toFixed(1)}J`;
}

/** Valid rim diameter for filter: 14–24 inch only. */
function isValidDiameterOption(v: string): boolean {
  const n = parseFloat(normalizeDiameterOption(v));
  return !Number.isNaN(n) && n >= 14 && n <= 24;
}

/** Valid rim width for filter: 5–13 inch. */
function isValidWidthOption(v: string): boolean {
  const n = parseFloat(v);
  return !Number.isNaN(n) && n >= 5 && n <= 13;
}

/** Valid bolt pattern: 4x100, 5x112, 5x114.3, 6x139.7 etc. (lugs x PCD 80–160mm). */
function isValidBoltPatternOption(v: string): boolean {
  const normalized = v.replace(/×/g, "x").trim();
  const m = normalized.match(/^(\d)x(\d+(?:\.\d+)?)$/i);
  if (!m) return false;
  const lugs = parseInt(m[1], 10);
  const pcd = parseFloat(m[2]);
  return (lugs === 4 || lugs === 5 || lugs === 6 || lugs === 8) && pcd >= 80 && pcd <= 160;
}

/** Canonical bolt pattern for filter display: "5 x 112.0" -> "5x112". */
function normalizeBoltPatternOption(v: string): string {
  const compact = v.replace(/×/g, "x").replace(/\s+/g, "").trim().toLowerCase();
  const m = compact.match(/^(\d)x(\d+(?:\.\d+)?)$/);
  if (!m) return v.trim();
  const lugs = m[1];
  const pcdNum = parseFloat(m[2]);
  return `${lugs}x${Number.isInteger(pcdNum) ? String(pcdNum) : String(pcdNum)}`;
}

/** Display bolt pattern exactly as requested: "4 x 100". */
function formatBoltPatternOption(v: string): string {
  const normalized = normalizeBoltPatternOption(v);
  const m = normalized.match(/^(\d)x(\d+(?:\.\d+)?)$/i);
  if (!m) return v.trim();
  return `${m[1]} x ${m[2]}`;
}

/** Valid center bore for filter: 50–85mm. */
function isValidCenterBoreOption(v: string): boolean {
  const num = parseFloat(v.replace(/mm\s*$/i, "").trim());
  return !Number.isNaN(num) && num >= 50 && num <= 85;
}

/** Canonical center bore for filter display: "72.6 mm" -> "72.6mm". */
function normalizeCenterBoreOption(v: string): string {
  const num = parseFloat(v.replace(/mm\s*$/i, "").trim());
  if (Number.isNaN(num)) return v.trim();
  return `${num}mm`;
}

/** Canonical tire size for filter display: "245 / 40 r18" -> "245/40R18". */
function normalizeTireSizeOption(v: string): string {
  return v.replace(/\s+/g, "").toUpperCase().trim();
}

/** Valid tire size for filter: standard road and odd OEM sizes like 265/790R540. */
function isValidTireSizeOption(v: string): boolean {
  return /^\d{3}\/\d{2,3}R\d{2,3}$/i.test(normalizeTireSizeOption(v));
}

/** Normalize raw finish/color text into usable filter buckets. */
function normalizeColorOption(v: string): string | null {
  const s = v.trim().toLowerCase();
  if (!s || s === "unknown") return null;
  if (s.includes("black")) return "Black";
  if (s.includes("silver")) return "Silver";
  if (s.includes("chrome")) return "Chrome";
  if (
    s.includes("gunmetal") ||
    s.includes("anthracite") ||
    s.includes("graphite") ||
    s.includes("grey") ||
    s.includes("gray")
  ) return "Gunmetal";
  if (s.includes("white")) return "White";
  if (s.includes("bronze")) return "Bronze";
  if (s.includes("gold")) return "Gold";
  if (s.includes("red")) return "Red";
  if (s.includes("blue")) return "Blue";
  if (s.includes("green")) return "Green";
  if (s.includes("bi-colour") || s.includes("bi-color") || s.includes("bicolor")) return "Bi-Color";
  if (s.includes("machined") || s.includes("diamond turned") || s.includes("polished")) return "Machined";
  return null;
}

/** Collect distinct non-empty values from wheel text_* (comma/semicolon/newline/pipe split). */
function distinctFromWheelText(wheels: { text_diameters?: string | null; text_widths?: string | null; text_bolt_patterns?: string | null; text_center_bores?: string | null; text_colors?: string | null }[], key: "text_diameters" | "text_widths" | "text_bolt_patterns" | "text_center_bores" | "text_colors"): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w[key] ?? "").toString().trim();
    for (const v of splitSpecValues(raw)) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Normalized diameter options for filter: single values like "17", "18", "19" from raw text_diameters. */
function distinctDiametersNormalized(wheels: { text_diameters?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_diameters ?? "").toString().trim();
    for (const v of splitSpecValuesWithSpaces(raw)) {
      const n = normalizeDiameterOption(v);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
}

/** Normalized width options for filter: single values like "8", "8.5", "9". */
function distinctWidthsNormalized(wheels: { text_widths?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_widths ?? "").toString().trim();
    for (const v of splitSpecValuesWithSpaces(raw)) {
      const n = normalizeWidthOption(v);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
}

/** Normalized tire size options like "245/40R18". */
function distinctTireSizesNormalized(wheels: { text_tire_sizes?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_tire_sizes ?? "").toString().trim();
    for (const v of splitSpecValues(raw)) {
      const n = normalizeTireSizeOption(v);
      if (isValidTireSizeOption(n)) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Extract one spec string from parsed specifications_json (same keys as backfill script). */
function specFromJson(
  obj: Record<string, unknown> | null,
  kind: "diameter" | "width" | "bolt" | "centerBore" | "color"
): string[] {
  if (!obj || typeof obj !== "object") return [];
  const out: string[] = [];
  if (kind === "diameter") {
    const v = obj.diameter ?? obj.diameters ?? obj.size ?? obj.rim_diameter ?? obj.wheel_diameter;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "width") {
    const v = obj.width ?? obj.widths ?? obj.rim_width ?? obj.wheel_width ?? obj.j_width;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "bolt") {
    const v = obj.bolt_pattern ?? obj.boltPattern ?? obj.bolt ?? obj.pcd ?? obj.lug_pattern;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "centerBore") {
    const v = obj.center_bore ?? obj.centerBore ?? obj.cb ?? obj.hub_bore;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "color") {
    const v = obj.color ?? obj.colors ?? obj.finish;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  }
  return out.filter(Boolean);
}

/** Collect distinct non-empty values from vehicle text_* (comma-split). */
function distinctFromVehicleText(
  vehicles: { text_bolt_patterns?: string | null; text_center_bores?: string | null }[],
  key: "text_bolt_patterns" | "text_center_bores"
): string[] {
  const set = new Set<string>();
  for (const v of vehicles) {
    const raw = (v[key] ?? "").toString().trim();
    if (!raw) continue;
    for (const part of raw.split(",")) {
      const s = part.trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Filter options for wheels; from junction tables when present, else from wheel text_* fields. */
export const wheelsFilterOptions = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();

    // Brands: via j_wheel_brand -> oem_brands
    const wheelBrandLinks = await ctx.db.query("j_wheel_brand").collect();
    const brandIds = [
      ...new Set(wheelBrandLinks.map((link) => link.brand_id as Id<"oem_brands">)),
    ];
    const brandDocs = await Promise.all(
      brandIds.map((id) => ctx.db.get("oem_brands", id))
    );
    let brands = Array.from(
      new Set(
        brandDocs
          .filter((b): b is NonNullable<typeof b> => b !== null)
          .map((b) => (b.brand_title as string | undefined) ?? "")
          .filter((name) => name && name.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
    // Diameters: use all reference values in Convex, then supplement from wheel text/json
    const diameterDocs = await ctx.db.query("oem_diameters").collect();
    const diameterSetFromJunction = new Set<string>();
    for (const d of diameterDocs) {
      if (!d) continue;
      const raw = (d.diameter as string | undefined) ?? "";
      for (const part of splitSpecValuesWithSpaces(raw)) {
        const n = normalizeDiameterOption(part);
        if (n) diameterSetFromJunction.add(n);
      }
    }
    let diameters = diameterSetFromJunction.size > 0
      ? Array.from(diameterSetFromJunction).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b))
      : distinctDiametersNormalized(wheels);

    // Widths: use all reference values in Convex, then supplement from wheel text/json
    const widthDocs = await ctx.db.query("oem_widths").collect();
    const widthSetFromJunction = new Set<string>();
    for (const w of widthDocs) {
      if (!w) continue;
      const raw = (w.width as string | undefined) ?? "";
      for (const part of splitSpecValuesWithSpaces(raw)) {
        const n = normalizeWidthOption(part);
        if (n) widthSetFromJunction.add(n);
      }
    }
    let widths = widthSetFromJunction.size > 0
      ? Array.from(widthSetFromJunction).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b))
      : distinctWidthsNormalized(wheels);

    // Bolt patterns: use all reference values in Convex, then supplement from wheel text/json
    const boltPatternDocs = await ctx.db.query("oem_bolt_patterns").collect();
    let boltPatterns = Array.from(
      new Set(
        boltPatternDocs
          .filter((bp): bp is NonNullable<typeof bp> => bp !== null)
          .map((bp) => normalizeBoltPatternOption((bp.bolt_pattern as string | undefined) ?? ""))
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
    if (boltPatterns.length === 0) boltPatterns = distinctFromWheelText(wheels, "text_bolt_patterns");

    // Center bores: use all reference values in Convex, then supplement from wheel text/json
    const centerBoreDocs = await ctx.db.query("oem_center_bores").collect();
    let centerBores = Array.from(
      new Set(
        centerBoreDocs
          .filter((cb): cb is NonNullable<typeof cb> => cb !== null)
          .map((cb) => normalizeCenterBoreOption((cb.center_bore as string | undefined) ?? ""))
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => parseFloat(a) - parseFloat(b));
    if (centerBores.length === 0) centerBores = distinctFromWheelText(wheels, "text_center_bores");

    const tireSizeDocs = await ctx.db.query("tire_sizes").collect();
    let tireSizes = Array.from(
      new Set(
        tireSizeDocs
          .map((t) => normalizeTireSizeOption((t.tire_size as string | undefined) ?? ""))
          .filter((t) => isValidTireSizeOption(t))
      )
    ).sort((a, b) => a.localeCompare(b));
    if (tireSizes.length === 0) tireSizes = distinctTireSizesNormalized(wheels);

    let colors = [
      ...new Set(
        [
          ...distinctFromWheelText(wheels, "text_colors"),
          ...(await ctx.db.query("oem_colors").collect())
            .map((c) => (c.color as string | undefined) ?? "")
            .filter((c) => c.trim().length > 0 && c.trim().toLowerCase() !== "unknown"),
        ]
          .map((c) => normalizeColorOption(c))
          .filter((c): c is string => Boolean(c))
      ),
    ].sort((a, b) => a.localeCompare(b));

    // Fallback: derive options from specifications_json when text_* or junctions are empty
    const diameterSet = new Set(diameters);
    const widthSet = new Set(widths);
    const boltSet = new Set(boltPatterns);
    const centerBoreSet = new Set(centerBores);
    const tireSizeSet = new Set(tireSizes);
    const colorSet = new Set(colors);
    for (const w of wheels) {
      let obj: Record<string, unknown> | null = null;
      const raw = (w.specifications_json as string | undefined) ?? "";
      if (raw) {
        try {
          obj = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          // ignore
        }
      }
      for (const v of specFromJson(obj, "diameter")) {
        for (const part of splitSpecValuesWithSpaces(v)) {
          const n = normalizeDiameterOption(part);
          if (n) diameterSet.add(n);
        }
      }
      for (const v of specFromJson(obj, "width")) {
        for (const part of splitSpecValuesWithSpaces(v)) {
          const n = normalizeWidthOption(part);
          if (n) widthSet.add(n);
        }
      }
      for (const v of specFromJson(obj, "bolt")) boltSet.add(normalizeBoltPatternOption(v));
      for (const v of specFromJson(obj, "centerBore")) centerBoreSet.add(normalizeCenterBoreOption(v));
      const rawTireSizes = (w.text_tire_sizes as string | undefined) ?? "";
      for (const v of splitSpecValues(rawTireSizes)) {
        const normalized = normalizeTireSizeOption(v);
        if (isValidTireSizeOption(normalized)) tireSizeSet.add(normalized);
      }
      for (const v of specFromJson(obj, "color")) {
        const normalized = normalizeColorOption(v);
        if (normalized) colorSet.add(normalized);
      }
    }
    if (diameterSet.size > 0) diameters = Array.from(diameterSet).map((d) => normalizeDiameterOption(d)).filter(isValidDiameterOption);
    diameters = [...new Set(diameters)].sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));

    if (widthSet.size > 0) widths = Array.from(widthSet).map((w) => normalizeWidthOption(w)).filter(isValidWidthOption);
    widths = [...new Set(widths)].sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));

    if (boltSet.size > 0) boltPatterns = Array.from(boltSet).map((b) => normalizeBoltPatternOption(b)).filter(isValidBoltPatternOption);
    boltPatterns = [...new Set(boltPatterns)].sort((a, b) => a.localeCompare(b));

    if (centerBoreSet.size > 0) centerBores = Array.from(centerBoreSet).map((c) => normalizeCenterBoreOption(c)).filter(isValidCenterBoreOption);
    centerBores = [...new Set(centerBores)].sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));

    if (tireSizeSet.size > 0) tireSizes = Array.from(tireSizeSet).map((t) => normalizeTireSizeOption(t)).filter(isValidTireSizeOption);
    tireSizes = [...new Set(tireSizes)].sort((a, b) => a.localeCompare(b));

    if (colorSet.size > 0) colors = Array.from(colorSet).sort((a, b) => a.localeCompare(b));

    // Ensure filter is always filled: use common OEM options when no data
    const COMMON_DIAMETERS = ["17", "18", "19", "20", "21", "22"];
    const COMMON_WIDTHS = ["7", "7.5", "8", "8.5", "9", "9.5", "10"];
    const COMMON_BOLT = ["5x100", "5x108", "5x112", "5x114.3", "5x120"];
    const COMMON_CB = ["64.1", "66.1", "66.6", "72.6"];
    const COMMON_TIRE_SIZES = ["225/45R17", "235/40R18", "245/40R18", "255/35R19"];
    const COMMON_COLORS = ["Silver", "Black", "Gunmetal", "Chrome"];
    if (diameters.length === 0) diameters = COMMON_DIAMETERS;
    if (widths.length === 0) widths = COMMON_WIDTHS;
    if (boltPatterns.length === 0) boltPatterns = COMMON_BOLT;
    if (centerBores.length === 0) centerBores = COMMON_CB;
    if (tireSizes.length === 0) tireSizes = COMMON_TIRE_SIZES;
    if (colors.length === 0) colors = COMMON_COLORS;

    return {
      brands,
      diameters: diameters.map((d) => formatDiameterOption(d)),
      widths: widths.map((w) => formatWidthOption(w)),
      boltPatterns: boltPatterns.map((b) => formatBoltPatternOption(b)),
      centerBores,
      tireSizes,
      colors,
    };
  },
});

export const vehiclesFilterOptions = query({
  args: {},
  handler: async (ctx) => {
    const vehicleBrandLinks = await ctx.db.query("j_vehicle_brand").collect();
    const brandIds = [
      ...new Set(vehicleBrandLinks.map((link) => link.brand_id as Id<"oem_brands">)),
    ];
    const brandDocs = await Promise.all(
      brandIds.map((id) => ctx.db.get("oem_brands", id))
    );
    const brands = Array.from(
      new Set(
        brandDocs
          .filter((b): b is NonNullable<typeof b> => b !== null)
          .map((b) => (b.brand_title as string | undefined) ?? "")
          .filter((name) => name && name.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    const vehicles = await ctx.db.query("oem_vehicles").collect();

    const vehicleBoltLinks = await ctx.db.query("j_vehicle_bolt_pattern").collect();
    const boltIds = [
      ...new Set(
        vehicleBoltLinks.map(
          (link) => link.bolt_pattern_id as Id<"oem_bolt_patterns">
        )
      ),
    ];
    const boltDocs = await Promise.all(
      boltIds.map((id) => ctx.db.get("oem_bolt_patterns", id))
    );
    let boltPatterns = Array.from(
      new Set(
        boltDocs
          .filter((bp): bp is NonNullable<typeof bp> => bp !== null)
          .map((bp) => (bp.bolt_pattern as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
    if (boltPatterns.length === 0) {
      boltPatterns = distinctFromVehicleText(vehicles, "text_bolt_patterns");
    }

    const vehicleCenterBoreLinks = await ctx.db
      .query("j_vehicle_center_bore")
      .collect();
    const centerBoreIds = [
      ...new Set(
        vehicleCenterBoreLinks.map(
          (link) => link.center_bore_id as Id<"oem_center_bores">
        )
      ),
    ];
    const centerBoreDocs = await Promise.all(
      centerBoreIds.map((id) => ctx.db.get("oem_center_bores", id))
    );
    let centerBores = Array.from(
      new Set(
        centerBoreDocs
          .filter((cb): cb is NonNullable<typeof cb> => cb !== null)
          .map((cb) => (cb.center_bore as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => parseFloat(a) - parseFloat(b));
    if (centerBores.length === 0) {
      centerBores = distinctFromVehicleText(vehicles, "text_center_bores");
    }
    const productionYears = Array.from(
      new Set(
        vehicles
          .map((v) => (v.production_years as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return { brands, boltPatterns, centerBores, productionYears };
  },
});

export const wheelsGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    try {
      const wheels = await ctx.db
        .query("oem_wheels")
        .order("asc")
        .collect();
      const result = await Promise.all(
        wheels.map(async (w) => {
          const [link, diameterLinks, widthLinks, boltLinks, centerBoreLinks, tireSizeLinks, colorLinks] = await Promise.all([
            ctx.db
              .query("j_wheel_brand")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .first(),
            ctx.db
              .query("j_wheel_diameter")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
            ctx.db
              .query("j_wheel_width")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
            ctx.db
              .query("j_wheel_bolt_pattern")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
            ctx.db
              .query("j_wheel_center_bore")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
            ctx.db
              .query("j_wheel_tire_size")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
            ctx.db
              .query("j_wheel_color")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
              .collect(),
          ]);
          const brand = link ? await ctx.db.get("oem_brands", link.brand_id) : null;
          const diameter = Array.from(new Set(diameterLinks.map((entry) => (entry.diameter ?? "").trim()).filter(Boolean))).join(", ");
          const width = Array.from(new Set(widthLinks.map((entry) => (entry.width ?? "").trim()).filter(Boolean))).join(", ");
          const boltPattern = Array.from(new Set(boltLinks.map((entry) => (entry.bolt_pattern ?? "").trim()).filter(Boolean))).join(", ");
          const centerBore = Array.from(new Set(centerBoreLinks.map((entry) => (entry.center_bore ?? "").trim()).filter(Boolean))).join(", ");
          const tireSize = Array.from(new Set(tireSizeLinks.map((entry) => (entry.tire_size ?? "").trim()).filter(Boolean))).join(", ");
          const color = Array.from(new Set(colorLinks.map((entry) => (entry.color ?? "").trim()).filter(Boolean))).join(", ");
          return {
            ...w,
            brand_name: (brand?.brand_title ?? w.text_brands ?? null) as string | null,
            brand_id: link?.brand_id ?? null,
            diameter: ((diameter || w.text_diameters) ?? null) as string | null,
            width: ((width || w.text_widths) ?? null) as string | null,
            bolt_pattern: ((boltPattern || w.text_bolt_patterns) ?? null) as string | null,
            center_bore: ((centerBore || w.text_center_bores) ?? null) as string | null,
            tire_size: ((tireSize || w.text_tire_sizes) ?? null) as string | null,
            color: ((color || w.text_colors) ?? null) as string | null,
          };
        })
      );
      return result;
    } catch {
      return [];
    }
  },
});

/** Return wheel ids that have specifications_json (for server-side spec backfill). */
export const wheelsGetIdsWithSpecJson = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    return wheels.filter((w) => (w.specifications_json ?? "").trim().length > 0).map((w) => w._id);
  },
});

/** Audit: how many wheels have text_* or specifications_json populated (for filter backfill). */
export const wheelSpecDataAudit = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    let withTextDiameters = 0;
    let withTextWidths = 0;
    let withTextBolt = 0;
    let withTextCenterBore = 0;
    let withTextColors = 0;
    let withSpecJson = 0;
    const samples: string[] = [];
    const sampleTitles: string[] = [];
    for (const w of wheels) {
      if ((w.text_diameters ?? "").trim()) withTextDiameters++;
      if ((w.text_widths ?? "").trim()) withTextWidths++;
      if ((w.text_bolt_patterns ?? "").trim()) withTextBolt++;
      if ((w.text_center_bores ?? "").trim()) withTextCenterBore++;
      if ((w.text_colors ?? "").trim()) withTextColors++;
      const raw = (w.specifications_json ?? "").trim();
      if (raw) {
        withSpecJson++;
        if (samples.length < 3) samples.push(raw.slice(0, 400));
      }
      const title = (w.wheel_title ?? "").trim();
      if (title && sampleTitles.length < 8) sampleTitles.push(title);
    }
    return {
      total: wheels.length,
      withTextDiameters,
      withTextWidths,
      withTextBoltPatterns: withTextBolt,
      withTextCenterBores: withTextCenterBore,
      withTextColors,
      withSpecificationsJson: withSpecJson,
      sampleSpecJson: samples,
      sampleWheelTitles: sampleTitles,
    };
  },
});

/** Most common spec value in a list (mode); empty strings ignored. */
function mode(values: string[]): string | null {
  const trimmed = values.map((s) => s.trim()).filter((s) => s.length > 0);
  if (trimmed.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of trimmed) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      bestCount = c;
      best = v;
    }
  }
  return best;
}

/** Split spec string by comma/semicolon/newline and return non-empty parts. */
function specValues(raw: string | undefined | null): string[] {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/[,;|\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Common wheel specs per brand (from wheels that have data) + global fallback for filling empty wheels. */
export const wheelsCommonSpecsByBrand = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    const wheelBrandLinks = await ctx.db.query("j_wheel_brand").collect();
    const wheelToBrandIds = new Map<string, string[]>();
    for (const j of wheelBrandLinks) {
      const wid = j.wheel_id as string;
      if (!wheelToBrandIds.has(wid)) wheelToBrandIds.set(wid, []);
      wheelToBrandIds.get(wid)!.push(j.brand_id as string);
    }
    type SpecBag = { diameters: string[]; widths: string[]; boltPatterns: string[]; centerBores: string[] };
    const byBrand = new Map<string, SpecBag>();
    const global: SpecBag = { diameters: [], widths: [], boltPatterns: [], centerBores: [] };

    for (const w of wheels) {
      const wid = w._id as string;
      const diameters = specValues(w.text_diameters);
      const widths = specValues(w.text_widths);
      const boltPatterns = specValues(w.text_bolt_patterns);
      const centerBores = specValues(w.text_center_bores);
      if (diameters.length === 0 && widths.length === 0 && boltPatterns.length === 0 && centerBores.length === 0) continue;

      const brandIds = wheelToBrandIds.get(wid) ?? [];
      if (brandIds.length === 0) {
        global.diameters.push(...diameters);
        global.widths.push(...widths);
        global.boltPatterns.push(...boltPatterns);
        global.centerBores.push(...centerBores);
        continue;
      }
      for (const bid of brandIds) {
        let bag = byBrand.get(bid);
        if (!bag) {
          bag = { diameters: [], widths: [], boltPatterns: [], centerBores: [] };
          byBrand.set(bid, bag);
        }
        bag.diameters.push(...diameters);
        bag.widths.push(...widths);
        bag.boltPatterns.push(...boltPatterns);
        bag.centerBores.push(...centerBores);
      }
      global.diameters.push(...diameters);
      global.widths.push(...widths);
      global.boltPatterns.push(...boltPatterns);
      global.centerBores.push(...centerBores);
    }

    const saneWidth = (v: string | null): string | null => {
      if (!v) return null;
      const n = parseFloat(v.replace(/J$/i, ""));
      if (n >= 6 && n <= 12) return v;
      return null;
    };
    const saneCenterBore = (v: string | null): string | null => {
      if (!v) return null;
      const num = parseFloat(v.replace(/mm$/i, "").trim());
      if (num >= 50 && num <= 85) return v;
      return null;
    };

    const toResult = (bag: SpecBag, useDefaults: boolean) => {
      const diameter = mode(bag.diameters) ?? (useDefaults ? "18" : null);
      const widthRaw = mode(bag.widths) ?? (useDefaults ? "8.5" : null);
      const width = saneWidth(widthRaw) ?? (useDefaults ? "8.5" : null);
      const boltPattern = mode(bag.boltPatterns) ?? (useDefaults ? "5x114.3" : null);
      const centerBoreRaw = mode(bag.centerBores) ?? (useDefaults ? "66.1" : null);
      const centerBore = saneCenterBore(centerBoreRaw) ?? (useDefaults ? "66.1" : null);
      return { diameter, width, boltPattern, centerBore };
    };

    const byBrandResult: Record<string, { diameter: string | null; width: string | null; boltPattern: string | null; centerBore: string | null }> = {};
    for (const [bid, bag] of byBrand) byBrandResult[bid] = toResult(bag, false);
    const globalResult = toResult(global, true);

    return {
      byBrand: byBrandResult,
      global: globalResult,
    };
  },
});

/** Wheel ids that have at least one empty text_* spec (for common-spec backfill). */
export const wheelsGetIdsWithMissingSpecs = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    return wheels
      .filter(
        (w) =>
          !(w.text_diameters ?? "").trim() ||
          !(w.text_widths ?? "").trim() ||
          !(w.text_bolt_patterns ?? "").trim() ||
          !(w.text_center_bores ?? "").trim()
      )
      .map((w) => w._id);
  },
});

/** Paginated wheels list to avoid pulling the full table (saves database bandwidth). */
export const wheelsListPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("oem_wheels")
      .order("asc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      result.page.map(async (w) => {
        const [link, diameterLinks, widthLinks, boltLinks, centerBoreLinks, tireSizeLinks, colorLinks] = await Promise.all([
          ctx.db
            .query("j_wheel_brand")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .first(),
          ctx.db
            .query("j_wheel_diameter")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
          ctx.db
            .query("j_wheel_width")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
          ctx.db
            .query("j_wheel_bolt_pattern")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
          ctx.db
            .query("j_wheel_center_bore")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
          ctx.db
            .query("j_wheel_tire_size")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
          ctx.db
            .query("j_wheel_color")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
            .collect(),
        ]);
        const brand = link ? await ctx.db.get("oem_brands", link.brand_id) : null;
        const diameter = Array.from(new Set(diameterLinks.map((entry) => (entry.diameter ?? "").trim()).filter(Boolean))).join(", ");
        const width = Array.from(new Set(widthLinks.map((entry) => (entry.width ?? "").trim()).filter(Boolean))).join(", ");
        const boltPattern = Array.from(new Set(boltLinks.map((entry) => (entry.bolt_pattern ?? "").trim()).filter(Boolean))).join(", ");
        const centerBore = Array.from(new Set(centerBoreLinks.map((entry) => (entry.center_bore ?? "").trim()).filter(Boolean))).join(", ");
        const tireSize = Array.from(new Set(tireSizeLinks.map((entry) => (entry.tire_size ?? "").trim()).filter(Boolean))).join(", ");
        const color = Array.from(new Set(colorLinks.map((entry) => (entry.color ?? "").trim()).filter(Boolean))).join(", ");
        return {
          ...w,
          brand_name: (brand?.brand_title ?? w.text_brands ?? null) as string | null,
          brand_id: link?.brand_id ?? null,
          diameter: ((diameter || w.text_diameters) ?? null) as string | null,
          width: ((width || w.text_widths) ?? null) as string | null,
          bolt_pattern: ((boltPattern || w.text_bolt_patterns) ?? null) as string | null,
          center_bore: ((centerBore || w.text_center_bores) ?? null) as string | null,
          tire_size: ((tireSize || w.text_tire_sizes) ?? null) as string | null,
          color: ((color || w.text_colors) ?? null) as string | null,
        };
      })
    );
    return {
      ...result,
      page,
    };
  },
});

export const wheelsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id looks like Convex _id, try db.get first
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_wheels", args.id as Id<"oem_wheels">);
        if (byConvexId) return byConvexId;
      }
      // 2. Fall back to business id field
      return await ctx.db
        .query("oem_wheels")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

/** Finds oem_wheels where the optional id (business/slug) field equals arg. Returns the doc or null. */
export const wheelsGetByOldId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_wheels")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

/** Finds the first oem_wheel where wheel_title equals the given title. Used to map ws_mercedes_wheels (title) to oem_wheels._id. */
export const wheelsGetByTitle = query({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    try {
      const t = args.title.trim();
      if (!t) return null;
      return await ctx.db
        .query("oem_wheels")
        .withIndex("by_wheel_title", (q) => q.eq("wheel_title", t))
        .first();
    } catch {
      return null;
    }
  },
});

export const wheelsGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const wheelsGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_wheels")),
  },
  handler: async (ctx, args) => {
    try {
      let wheel = null;
      if (typeof args.id === "string") {
        // 1. Try Convex _id first (alphanumeric, typically 20+ chars)
        if (/^[a-z0-9]{20,}$/i.test(args.id)) {
          wheel = await ctx.db.get("oem_wheels", args.id as Id<"oem_wheels">);
        }
        // 2. Try business id field
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first();
        }
        // 3. Try slug, wheel_title (for URL slugs like "mini-494-loop-spoke-silver-wheels")
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .filter((q) =>
              q.or(
                q.eq(q.field("slug"), args.id),
                q.eq(q.field("wheel_title"), args.id)
              )
            )
            .first();
        }
        // 4. Try by_slug index for direct slug lookup on oem_wheels
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .withIndex("by_slug", (q) => q.eq("slug", args.id))
            .first();
        }
        // 5. Try wheel_variants.by_slug (slug may live on variant)
        if (!wheel) {
          const variant = await ctx.db
            .query("wheel_variants")
            .withIndex("by_slug", (q) => q.eq("slug", args.id))
            .first();
          if (variant) {
            const parentWheel = await ctx.db.get("oem_wheels", variant.wheel_id);
            if (parentWheel) wheel = parentWheel;
          }
        }
      } else {
        wheel = await ctx.db.get("oem_wheels", args.id);
      }
      if (!wheel) return null;

      const wheelId = wheel._id;
      const [vehicleLinks, brandLink] = await Promise.all([
        ctx.db
          .query("j_wheel_vehicle")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
          .collect(),
        ctx.db
          .query("j_wheel_brand")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
          .first(),
      ]);

      const brand = brandLink
        ? await ctx.db.get("oem_brands", brandLink.brand_id)
        : null;

      const mapVehicleWithBrand = async (vehicleId: Id<"oem_vehicles">) => {
        const v = await ctx.db.get("oem_vehicles", vehicleId);
        if (!v) return null;
        const vBrand = await ctx.db
          .query("j_vehicle_brand")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", v._id))
          .first();
        const brandDoc = vBrand
          ? await ctx.db.get("oem_brands", vBrand.brand_id)
          : null;
        return {
          ...v,
          brand_name: brandDoc?.brand_title ?? v.text_brands ?? null,
        };
      };

      const vehicleDocs = await Promise.all(
        vehicleLinks.map((j) => mapVehicleWithBrand(j.vehicle_id))
      );

      const vehicles = vehicleDocs.filter((v): v is NonNullable<typeof v> => v !== null);

      return {
        ...wheel,
        id: wheel.id ?? String(wheel._id),
        wheel_name: wheel.wheel_title ?? "",
        brand_name: brand?.brand_title ?? wheel.text_brands ?? null,
        diameter: (wheel.text_diameters ?? null) as string | null,
        width: (wheel.text_widths ?? null) as string | null,
        bolt_pattern: (wheel.text_bolt_patterns ?? null) as string | null,
        center_bore: (wheel.text_center_bores ?? null) as string | null,
        tire_size: (wheel.text_tire_sizes ?? null) as string | null,
        color: ((wheel.color as string | undefined) ?? wheel.text_colors ?? null) as string | null,
        brand,
        vehicles,
        bolt_patterns: [],
        diameters: [],
        widths: [],
        center_bores: [],
        colors: [],
        tire_sizes: [],
      };
    } catch {
      return null;
    }
  },
});

// =============================================================================
// JUNCTION TABLE QUERIES (many-to-many lookups)
// =============================================================================

export const getVehiclesByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_vehicle")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
        .collect();
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
    } catch {
      return [];
    }
  },
});

export const getWheelsByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_vehicle")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const getWheelsByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

// =============================================================================
// GLOBAL SEARCH (text filter in handler; no index for substring match)
// =============================================================================

function normalizeSearchTerm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchesSearch(text: string | undefined | null, query: string): boolean {
  if (!text) return false;
  return normalizeSearchTerm(text).includes(normalizeSearchTerm(query));
}

export const globalSearchBrands = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const q = normalizeSearchTerm(args.query);
      return all
        .filter(
          (b) =>
            matchesSearch(b.brand_title, args.query) ||
            matchesSearch(b.brand_description, args.query) ||
            matchesSearch(b.subsidiaries, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

export const globalSearchVehicles = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db.query("oem_vehicles").order("asc").collect();
      return all
        .filter(
          (v) =>
            matchesSearch(v.vehicle_title, args.query) ||
            matchesSearch(v.model_name, args.query) ||
            matchesSearch(v.generation, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

export const globalSearchWheels = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db.query("oem_wheels").order("asc").collect();
      return all
        .filter(
          (w) =>
            matchesSearch(w.wheel_title, args.query) ||
            matchesSearch(w.notes, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

// =============================================================================
// DASHBOARD METRICS
// =============================================================================

export const dashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [brands, vehicles, wheels] = await Promise.all([
        ctx.db.query("oem_brands").collect(),
        ctx.db.query("oem_vehicles").collect(),
        ctx.db.query("oem_wheels").collect(),
      ]);
      return {
        totalBrands: brands.length,
        totalVehicles: vehicles.length,
        totalWheels: wheels.length,
      };
    } catch {
      return { totalBrands: 0, totalVehicles: 0, totalWheels: 0 };
    }
  },
});

export const wheelsByBrandDistribution = query({
  args: {},
  handler: async (ctx) => {
    try {
      const brands = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const wheelLinks = await ctx.db.query("j_wheel_brand").collect();
      const vehicleLinks = await ctx.db.query("j_vehicle_brand").collect();
      const wheelCountByBrand = new Map<string, number>();
      const vehicleCountByBrand = new Map<string, number>();
      for (const b of brands) {
        wheelCountByBrand.set(b._id, 0);
        vehicleCountByBrand.set(b._id, 0);
      }
      for (const j of wheelLinks) {
        wheelCountByBrand.set(
          j.brand_id,
          (wheelCountByBrand.get(j.brand_id) ?? 0) + 1
        );
      }
      for (const j of vehicleLinks) {
        vehicleCountByBrand.set(
          j.brand_id,
          (vehicleCountByBrand.get(j.brand_id) ?? 0) + 1
        );
      }
      const distribution = brands
        .map((b) => ({
          brand: b.brand_title,
          wheels: wheelCountByBrand.get(b._id) ?? 0,
          vehicles: vehicleCountByBrand.get(b._id) ?? 0,
        }))
        .sort((a, b) => b.wheels - a.wheels)
        .slice(0, 10);
      return distribution;
    } catch {
      return [];
    }
  },
});

export const boltPatternDistribution = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [links, patternDocs] = await Promise.all([
        ctx.db.query("j_wheel_bolt_pattern").collect(),
        ctx.db.query("oem_bolt_patterns").collect(),
      ]);
      const patternById = new Map(
        patternDocs.map((p) => [p._id, p.bolt_pattern])
      );
      const patternCounts = new Map<string, number>();
      for (const link of links) {
        const pattern = patternById.get(link.bolt_pattern_id) ?? "Unknown";
        patternCounts.set(pattern, (patternCounts.get(pattern) ?? 0) + 1);
      }
      return Array.from(patternCounts.entries())
        .map(([pattern, count]) => ({ pattern, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    } catch {
      return [];
    }
  },
});

// =============================================================================
// SAVED ITEMS (by user)
// =============================================================================

export const savedBrandsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_brands")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const brands = await Promise.all(
        links.map((l) => ctx.db.get("oem_brands", l.brand_id))
      );
      return brands.filter((b): b is NonNullable<typeof b> => b !== null);
    } catch {
      return [];
    }
  },
});

export const savedVehiclesGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_vehicles")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const vehicles = await Promise.all(
        links.map((l) => ctx.db.get("oem_vehicles", l.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
    } catch {
      return [];
    }
  },
});

export const savedWheelsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_wheels")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const wheels = await Promise.all(
        links.map((l) => ctx.db.get("oem_wheels", l.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const savedBrandCheck = query({
  args: {
    userId: v.string(),
    brandId: v.id("oem_brands"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_brands")
        .withIndex("by_user_brand", (q) =>
          q.eq("user_id", args.userId).eq("brand_id", args.brandId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

export const savedVehicleCheck = query({
  args: {
    userId: v.string(),
    vehicleId: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_vehicles")
        .withIndex("by_user_vehicle", (q) =>
          q.eq("user_id", args.userId).eq("vehicle_id", args.vehicleId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

export const savedWheelCheck = query({
  args: {
    userId: v.string(),
    wheelId: v.id("oem_wheels"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_wheels")
        .withIndex("by_user_wheel", (q) =>
          q.eq("user_id", args.userId).eq("wheel_id", args.wheelId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

// =============================================================================
// USER CONTENT (comments)
// =============================================================================

export const userCommentsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("vehicle_comments")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const withVehicle = await Promise.all(
        comments.map(async (c) => {
          const vehicle = await ctx.db.get("oem_vehicles", c.vehicle_id);
          return {
            _id: c._id,
            id: c._id,
            comment_text: c.comment_text,
            created_at: c.created_at,
            updated_at: c.updated_at,
            vehicle_id: c.vehicle_id,
            oem_vehicles: vehicle
              ? {
                id: vehicle.id,
                model_name: vehicle.model_name ?? null,
                chassis_code: vehicle.generation ?? null,
                hero_image_url: vehicle.vehicle_image ?? null,
                brand_refs: null as unknown,
              }
              : null,
          };
        })
      );
      return withVehicle.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const vehicleCommentsGetByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("vehicle_comments")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const wheelCommentsGetByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("wheel_comments")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const brandCommentsGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("brand_comments")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

// =============================================================================
// USER CONTENT (listings)
// =============================================================================

export const userListingsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      /*
      const listings = await ctx.db
        .query("market_listings")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      return listings
        .filter((l) => l.status === "active")
        .sort((a, b) => {
          const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return tB - tA;
        });
      */
      return [];
    } catch {
      return [];
    }
  },
});

// =============================================================================
// PUBLIC PROFILE
// =============================================================================

export const profileGetByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();
    } catch {
      return null;
    }
  },
});

export const profilesList = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      const all = await ctx.db.query("profiles").collect();
      const sorted = all.sort((a, b) => {
        const aT = (a.created_at ?? "").localeCompare(b.created_at ?? "");
        return -aT;
      });
      if (!args.search?.trim()) return sorted;
      const searchLower = args.search.trim().toLowerCase();
      return sorted.filter(
        (p) =>
          (p.username ?? "").toLowerCase().includes(searchLower) ||
          ((p.display_name ?? "") as string).toLowerCase().includes(searchLower)
      );
    } catch {
      return [];
    }
  },
});

// =============================================================================
// REGISTERED VEHICLES (by user)
// =============================================================================

export const registeredVehiclesGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const rows = await ctx.db
        .query("user_registered_vehicles")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const result = await Promise.all(
        rows.map(async (r) => {
          const brand = r.brand_id ? await ctx.db.get("oem_brands", r.brand_id) : null;
          const vehicle = r.linked_oem_vehicle_id
            ? await ctx.db.get("oem_vehicles", r.linked_oem_vehicle_id)
            : null;
          return {
            ...r,
            brand_ref: brand?.id ?? "",
            vehicle_ref: vehicle?.id ?? "",
          };
        })
      );
      return result.sort((a, b) => {
        const tA = new Date(a.created_at).getTime();
        const tB = new Date(b.created_at).getTime();
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

// =============================================================================
// COLLECTION FILTER OPTIONS (for admin collection search)
// =============================================================================

export const collectionFilterOptions = query({
  args: { collectionType: v.union(v.literal("brands"), v.literal("vehicles"), v.literal("wheels")) },
  handler: async (ctx, args) => {
    try {
      if (args.collectionType === "wheels") {
        const [brands, diameters, boltPatterns] = await Promise.all([
          ctx.db.query("oem_brands").withIndex("by_brand_title").order("asc").collect(),
          ctx.db.query("oem_diameters").collect(),
          ctx.db.query("oem_bolt_patterns").collect(),
        ]);
        return {
          Brand: brands.map((b) => b.brand_title).filter(Boolean).sort(),
          Diameter: diameters.map((d) => d.diameter).filter(Boolean).sort(),
          BoltPattern: boltPatterns.map((p) => p.bolt_pattern).filter(Boolean).sort(),
        };
      }
      return {} as Record<string, string[]>;
    } catch {
      return {} as Record<string, string[]>;
    }
  },
});

// =============================================================================
// DATABASE RECORD (generic get-by-id for record editor)
// =============================================================================

export const databaseRecordGet = query({
  args: { tableName: v.string(), recordId: v.string() },
  handler: async (ctx, args) => {
    if (!args.tableName || !args.recordId) return null;
    try {
      if (args.tableName === "oem_brands") {
        if (/^[a-z0-9]{20,}$/i.test(args.recordId)) {
          const byConvexId = await ctx.db.get("oem_brands", args.recordId as Id<"oem_brands">);
          if (byConvexId) return byConvexId;
        }
        return await ctx.db
          .query("oem_brands")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      if (args.tableName === "oem_vehicles") {
        const byConvexId = await ctx.db.get("oem_vehicles", args.recordId as Id<"oem_vehicles">);
        if (byConvexId) return byConvexId;
        return await ctx.db
          .query("oem_vehicles")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      if (args.tableName === "oem_wheels") {
        const byConvexId = await ctx.db.get("oem_wheels", args.recordId as Id<"oem_wheels">);
        if (byConvexId) return byConvexId;
        return await ctx.db
          .query("oem_wheels")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      return null;
    } catch {
      return null;
    }
  },
});

// =============================================================================
// USER TABLE PREFERENCES (column order)
// =============================================================================

export const userTablePreferencesGetByUserAndTable = query({
  args: { userId: v.string(), tableName: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("user_table_preferences")
        .withIndex("by_user_table", (q) =>
          q.eq("user_id", args.userId).eq("table_name", args.tableName)
        )
        .first();
    } catch {
      return null;
    }
  },
});

// =============================================================================
// REFERENCE / LOOKUP TABLES
// =============================================================================

export const boltPatternsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_bolt_patterns").collect();
    } catch {
      return [];
    }
  },
});

export const centerBoresGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_center_bores").collect();
    } catch {
      return [];
    }
  },
});

export const colorsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_colors").collect();
    } catch {
      return [];
    }
  },
});

export const diametersGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_diameters").collect();
    } catch {
      return [];
    }
  },
});

export const widthsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_widths").collect();
    } catch {
      return [];
    }
  },
});

export const tireSizesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("tire_sizes").collect();
    } catch {
      return [];
    }
  },
});

// =============================================================================
// WORKSHOP (ws_*) TABLES — read rows by table name for migration scripts
// =============================================================================

/** Returns up to `limit` rows from a workshop table. Used by promote-wheel-variants.ts. */
export const getWsRows = query({
  args: {
    table: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit ?? 1000;
      type WsRow = { _id: string; source_id?: string; title?: string; brand?: string; status?: string; imported_at?: string; data: string };
      let rows: WsRow[] = [];
      switch (args.table) {
        case "ws_mercedes_wheels":
          rows = (await ctx.db.query("ws_mercedes_wheels").collect()) as WsRow[];
          break;
        case "ws_mercedes_wheel_variants":
          rows = (await ctx.db.query("ws_mercedes_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_porsche_wheel_variants":
          rows = (await ctx.db.query("ws_porsche_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_audi_wheel_variants":
          rows = (await ctx.db.query("ws_audi_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_vw_wheel_variants":
          rows = (await ctx.db.query("ws_vw_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_lamborghini_wheel_variants":
          rows = (await ctx.db.query("ws_lamborghini_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_ferrari_wheel_variants":
          rows = (await ctx.db.query("ws_ferrari_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_jaguar_wheel_variants":
          rows = (await ctx.db.query("ws_jaguar_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_land_rover_wheel_variants":
          rows = (await ctx.db.query("ws_land_rover_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_944racing_wheel_variants":
          rows = (await ctx.db.query("ws_944racing_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_wheel_variants":
          rows = (await ctx.db.query("ws_alfa_romeo_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_fiat_wheel_variants":
          rows = (await ctx.db.query("ws_fiat_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_944racing_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_944racing_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_alfa_romeo_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_audi_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_audi_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_ferrari_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_ferrari_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_fiat_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_fiat_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_jaguar_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_jaguar_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_lamborghini_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_lamborghini_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_land_rover_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_land_rover_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_mercedes_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_mercedes_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_porsche_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_porsche_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_vw_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_vw_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        default:
          return [];
      }
      return rows.slice(0, limit);
    } catch {
      return [];
    }
  },
});

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
] as const;

function parseWsJunctionData(data: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function extractVehicleWheelFromParsed(
  parsed: Record<string, unknown>
): { vehicleId?: string; wheelId?: string; vehicleTitle?: string; wheelTitle?: string } {
  const getStr = (...keys: string[]): string | undefined => {
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
  };
  return {
    vehicleId: getStr("vehicle_id", "vehicleId"),
    wheelId: getStr("wheel_id", "wheelId"),
    vehicleTitle: getStr("vehicle_title", "vehicleTitle", "vehicle"),
    wheelTitle: getStr("wheel_title", "wheelTitle", "wheel"),
  };
}

/** Scan all ws_*_junction_vehicles_wheels tables and return vehicle–wheel connections from the `data` JSON. */
export const getWsVehicleWheelConnections = query({
  args: {},
  handler: async (ctx) => {
    const connections: {
      brand: string;
      vehicleId?: string;
      wheelId?: string;
      vehicleTitle?: string;
      wheelTitle?: string;
      raw?: Record<string, unknown>;
    }[] = [];
    const byBrand: Record<string, number> = {};

    type Row = { _id: string; data: string };
    const tables: { table: typeof WS_JUNCTION_TABLES[number]; brand: string }[] = [
      { table: "ws_944racing_junction_vehicles_wheels", brand: "944racing" },
      { table: "ws_alfa_romeo_junction_vehicles_wheels", brand: "alfa romeo" },
      { table: "ws_audi_junction_vehicles_wheels", brand: "audi" },
      { table: "ws_ferrari_junction_vehicles_wheels", brand: "ferrari" },
      { table: "ws_fiat_junction_vehicles_wheels", brand: "fiat" },
      { table: "ws_jaguar_junction_vehicles_wheels", brand: "jaguar" },
      { table: "ws_lamborghini_junction_vehicles_wheels", brand: "lamborghini" },
      { table: "ws_land_rover_junction_vehicles_wheels", brand: "land rover" },
      { table: "ws_mercedes_junction_vehicles_wheels", brand: "mercedes" },
      { table: "ws_porsche_junction_vehicles_wheels", brand: "porsche" },
      { table: "ws_vw_junction_vehicles_wheels", brand: "vw" },
    ];

    for (const { table, brand } of tables) {
      let rows: Row[] = [];
      try {
        switch (table) {
          case "ws_944racing_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_944racing_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_alfa_romeo_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_alfa_romeo_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_audi_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_audi_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_ferrari_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_ferrari_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_fiat_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_fiat_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_jaguar_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_jaguar_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_lamborghini_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_lamborghini_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_land_rover_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_land_rover_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_mercedes_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_mercedes_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_porsche_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_porsche_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_vw_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_vw_junction_vehicles_wheels").collect()) as Row[];
            break;
        }
      } catch {
        continue;
      }
      for (const row of rows) {
        const parsed = parseWsJunctionData(row.data);
        if (!parsed) continue;
        const { vehicleId, wheelId, vehicleTitle, wheelTitle } = extractVehicleWheelFromParsed(parsed);
        if (vehicleId || wheelId || vehicleTitle || wheelTitle) {
          connections.push({
            brand,
            vehicleId,
            wheelId,
            vehicleTitle,
            wheelTitle,
            raw: Object.keys(parsed).length <= 10 ? parsed : undefined,
          });
        } else {
          connections.push({ brand, raw: Object.keys(parsed).length <= 10 ? parsed : undefined });
        }
      }
      if (rows.length > 0) byBrand[brand] = (byBrand[brand] ?? 0) + rows.length;
    }

    return {
      total: connections.length,
      byBrand: Object.fromEntries(Object.entries(byBrand).sort((a, b) => b[1] - a[1])),
      connections,
    };
  },
});

// =============================================================================
// MIGRATION AUDIT (data quality after Supabase → Convex migration)
// =============================================================================

export const migrationAudit = query({
  args: {},
  handler: async (ctx) => {
    const [
      brands,
      vehicles,
      wheels,
      jvb,
      jwb,
      boltPatterns,
      centerBores,
      colors,
      diameters,
      widths,
    ] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("j_vehicle_brand").collect(),
      ctx.db.query("j_wheel_brand").collect(),
      ctx.db.query("oem_bolt_patterns").collect(),
      ctx.db.query("oem_center_bores").collect(),
      ctx.db.query("oem_colors").collect(),
      ctx.db.query("oem_diameters").collect(),
      ctx.db.query("oem_widths").collect(),
    ]);

    const vehicleIdsWithBrand = new Set(jvb.map((l) => l.vehicle_id));
    const wheelIdsWithBrand = new Set(jwb.map((l) => l.wheel_id));

    const vehiclesWithoutBrand = vehicles.filter((v) => !vehicleIdsWithBrand.has(v._id));
    const wheelsWithoutBrand = wheels.filter((w) => !wheelIdsWithBrand.has(w._id));

    const wheelsMissingTitle = wheels.filter((w) => !w.wheel_title?.trim());
    const wheelsMissingId = wheels.filter((w) => !w.id?.trim());
    const vehiclesMissingTitle = vehicles.filter((v) => !(v.vehicle_title?.trim() || v.model_name?.trim()));

    return {
      counts: {
        brands: brands.length,
        vehicles: vehicles.length,
        wheels: wheels.length,
        j_vehicle_brand: jvb.length,
        j_wheel_brand: jwb.length,
        oem_bolt_patterns: boltPatterns.length,
        oem_center_bores: centerBores.length,
        oem_colors: colors.length,
        oem_diameters: diameters.length,
        oem_widths: widths.length,
      },
      gaps: {
        vehiclesWithoutBrand: vehiclesWithoutBrand.length,
        wheelsWithoutBrand: wheelsWithoutBrand.length,
        wheelsMissingTitle: wheelsMissingTitle.length,
        wheelsMissingId: wheelsMissingId.length,
        vehiclesMissingTitle: vehiclesMissingTitle.length,
      },
      samples: {
        vehiclesWithoutBrand: vehiclesWithoutBrand.slice(0, 5).map((v) => ({
          _id: v._id,
          id: v.id,
          vehicle_title: v.vehicle_title,
          model_name: v.model_name,
          text_brands: v.text_brands,
        })),
        wheelsWithoutBrand: wheelsWithoutBrand.slice(0, 5).map((w) => ({
          _id: w._id,
          id: w.id,
          wheel_title: w.wheel_title,
          text_brands: w.text_brands,
        })),
        wheelsMissingTitle: wheelsMissingTitle.slice(0, 5).map((w) => ({
          _id: w._id,
          id: w.id,
          wheel_title: w.wheel_title,
        })),
        j_wheel_brand_sample: jwb.slice(0, 3).map((l) => ({
          wheel_id: l.wheel_id,
          brand_id: l.brand_id,
          wheel_title: l.wheel_title,
          brand_title: l.brand_title,
        })),
      },
    };
  },
});

// =============================================================================
// WHEEL SPECS FOR BACKFILL (Phase 3 — aggregate from junction tables)
// =============================================================================

export const wheelsGetJunctionSpecsForBackfill = query({
  args: {},
  handler: async (ctx) => {
    const [diameters, widths, boltPatterns, centerBores, colors] = await Promise.all([
      ctx.db.query("j_wheel_diameter").collect(),
      ctx.db.query("j_wheel_width").collect(),
      ctx.db.query("j_wheel_bolt_pattern").collect(),
      ctx.db.query("j_wheel_center_bore").collect(),
      ctx.db.query("j_wheel_color").collect(),
    ]);
    const byWheel = new Map<
      string,
      { text_diameters: string[]; text_widths: string[]; text_bolt_patterns: string[]; text_center_bores: string[]; text_colors: string[] }
    >();
    function add(id: string, key: "text_diameters" | "text_widths" | "text_bolt_patterns" | "text_center_bores" | "text_colors", value: string) {
      if (!value?.trim()) return;
      let m = byWheel.get(id);
      if (!m) {
        m = { text_diameters: [], text_widths: [], text_bolt_patterns: [], text_center_bores: [], text_colors: [] };
        byWheel.set(id, m);
      }
      const arr = m[key];
      if (!arr.includes(value.trim())) arr.push(value.trim());
    }
    for (const r of diameters) add(r.wheel_id, "text_diameters", r.diameter);
    for (const r of widths) add(r.wheel_id, "text_widths", r.width);
    for (const r of boltPatterns) add(r.wheel_id, "text_bolt_patterns", r.bolt_pattern);
    for (const r of centerBores) add(r.wheel_id, "text_center_bores", r.center_bore);
    for (const r of colors) add(r.wheel_id, "text_colors", r.color);
    return Array.from(byWheel.entries()).map(([wheel_id, m]) => ({
      wheel_id: wheel_id as Id<"oem_wheels">,
      text_diameters: m.text_diameters.length ? m.text_diameters.join(", ") : undefined,
      text_widths: m.text_widths.length ? m.text_widths.join(", ") : undefined,
      text_bolt_patterns: m.text_bolt_patterns.length ? m.text_bolt_patterns.join(", ") : undefined,
      text_center_bores: m.text_center_bores.length ? m.text_center_bores.join(", ") : undefined,
      text_colors: m.text_colors.length ? m.text_colors.join(", ") : undefined,
    }));
  },
});

// =============================================================================
// FULL DATA AUDIT — every cell we need per entity (for to-do list)
// =============================================================================

const BRAND_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "brand_title", label: "Brand title", required: true },
  { key: "brand_description", label: "Description", required: false },
  { key: "brand_image_url", label: "Brand image URL", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "country_of_origin", label: "Country of origin", required: false },
  { key: "founded_year", label: "Founded year", required: false },
] as const;

const VEHICLE_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "vehicle_title", label: "Vehicle title", required: true },
  { key: "model_name", label: "Model name", required: false },
  { key: "generation", label: "Generation", required: false },
  { key: "production_years", label: "Production years", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "vehicle_image", label: "Vehicle image", required: false },
  { key: "text_brands", label: "Text brands (or j_vehicle_brand)", required: false },
] as const;

const WHEEL_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "wheel_title", label: "Wheel title", required: true },
  { key: "part_numbers", label: "Part numbers", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "bad_pic_url", label: "Bad pic URL", required: false },
  { key: "weight", label: "Weight", required: false },
  { key: "metal_type", label: "Metal type", required: false },
  { key: "color", label: "Color", required: false },
  { key: "wheel_offset", label: "Offset", required: false },
  { key: "text_brands", label: "Text brands (or j_wheel_brand)", required: false },
  { key: "text_diameters", label: "Text diameters", required: false },
  { key: "text_widths", label: "Text widths", required: false },
  { key: "text_bolt_patterns", label: "Text bolt patterns", required: false },
  { key: "text_center_bores", label: "Text center bores", required: false },
  { key: "text_colors", label: "Text colors", required: false },
  { key: "notes", label: "Notes", required: false },
] as const;

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (typeof v === "number") return Number.isNaN(v);
  return false;
}

export const fullDataAudit = query({
  args: {},
  handler: async (ctx) => {
    const [brands, vehicles, wheels, jvb, jwb] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("j_vehicle_brand").collect(),
      ctx.db.query("j_wheel_brand").collect(),
    ]);

    const vehicleHasBrand = new Set(jvb.map((l) => l.vehicle_id));
    const wheelHasBrand = new Set(jwb.map((l) => l.wheel_id));

    const brandRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of BRAND_FIELDS) {
      const missing = brands.filter((b) => isEmpty((b as Record<string, unknown>)[f.key]));
      brandRows.push({
        field: f.key,
        label: f.label,
        required: f.required,
        total: brands.length,
        missing: missing.length,
        sampleIds: missing.slice(0, 15).map((b) => (b.id ?? b._id) as string),
      });
    }

    const vehicleRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of VEHICLE_FIELDS) {
      if (f.key === "text_brands") {
        const missing = vehicles.filter((v) => !vehicleHasBrand.has(v._id) && isEmpty((v as Record<string, unknown>).text_brands));
        vehicleRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: vehicles.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((v) => (v.id ?? v._id) as string),
        });
      } else {
        const missing = vehicles.filter((v) => isEmpty((v as Record<string, unknown>)[f.key]));
        vehicleRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: vehicles.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((v) => (v.id ?? v._id) as string),
        });
      }
    }

    const wheelRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of WHEEL_FIELDS) {
      if (f.key === "text_brands") {
        const missing = wheels.filter((w) => !wheelHasBrand.has(w._id) && isEmpty((w as Record<string, unknown>).text_brands));
        wheelRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: wheels.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((w) => (w.id ?? w._id) as string),
        });
      } else {
        const missing = wheels.filter((w) => isEmpty((w as Record<string, unknown>)[f.key]));
        wheelRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: wheels.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((w) => (w.id ?? w._id) as string),
        });
      }
    }

    // Per-record missing fields (for to-do: first 50 brands, 50 vehicles, 100 wheels with any missing required or any missing field)
    const brandTodo = brands
      .map((b) => {
        const missing = BRAND_FIELDS.filter((f) => isEmpty((b as Record<string, unknown>)[f.key])).map((f) => f.key);
        return { id: (b.id ?? b._id) as string, title: b.brand_title ?? b.id ?? String(b._id), missing };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 200);

    const vehicleTodo = vehicles
      .map((v) => {
        const hasBrand = vehicleHasBrand.has(v._id) || !isEmpty((v as Record<string, unknown>).text_brands);
        const missing = VEHICLE_FIELDS.filter((f) => {
          if (f.key === "text_brands") return !hasBrand;
          return isEmpty((v as Record<string, unknown>)[f.key]);
        }).map((f) => f.key);
        return {
          id: (v.id ?? v._id) as string,
          title: v.vehicle_title ?? v.model_name ?? v.id ?? String(v._id),
          missing,
        };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 200);

    const wheelTodo = wheels
      .map((w) => {
        const hasBrand = wheelHasBrand.has(w._id) || !isEmpty((w as Record<string, unknown>).text_brands);
        const missing = WHEEL_FIELDS.filter((f) => {
          if (f.key === "text_brands") return !hasBrand;
          return isEmpty((w as Record<string, unknown>)[f.key]);
        }).map((f) => f.key);
        return {
          id: (w.id ?? w._id) as string,
          title: (w.wheel_title ?? w.id ?? String(w._id)) as string,
          missing,
        };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 300);

    return {
      byTable: {
        oem_brands: { total: brands.length, fields: brandRows },
        oem_vehicles: { total: vehicles.length, fields: vehicleRows },
        oem_wheels: { total: wheels.length, fields: wheelRows },
      },
      todo: {
        brands: brandTodo,
        vehicles: vehicleTodo,
        wheels: wheelTodo,
      },
      totalWithMissing: {
        brands: brands.filter((b) => BRAND_FIELDS.some((f) => isEmpty((b as Record<string, unknown>)[f.key]))).length,
        vehicles: vehicles.filter((v) => {
          const hasBrand = vehicleHasBrand.has(v._id) || !isEmpty((v as Record<string, unknown>).text_brands);
          return VEHICLE_FIELDS.some((f) => {
            if (f.key === "text_brands") return !hasBrand;
            return isEmpty((v as Record<string, unknown>)[f.key]);
          });
        }).length,
        wheels: wheels.filter((w) => {
          const hasBrand = wheelHasBrand.has(w._id) || !isEmpty((w as Record<string, unknown>).text_brands);
          return WHEEL_FIELDS.some((f) => {
            if (f.key === "text_brands") return !hasBrand;
            return isEmpty((w as Record<string, unknown>)[f.key]);
          });
        }).length,
      },
      fieldDefinitions: {
        brands: BRAND_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
        vehicles: VEHICLE_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
        wheels: WHEEL_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
      },
    };
  },
});
