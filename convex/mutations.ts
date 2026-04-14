/**
 * Convex mutations for core domain tables and junction tables.
 * No *_ref fields. Junction tables use link/unlink mutations.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE,
  requireAdmin,
  requireAdminUserId,
} from "./adminAuth";

const optionalString = v.optional(v.string());
const optionalNumber = v.optional(v.number());
const optionalBoolean = v.optional(v.boolean());
const optionalStringArray = v.optional(v.array(v.string()));

function cleanEngineText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeCanonicalEngineCode(code: string): string {
  const trimmed = code.trim();
  if (/^ingenium$/i.test(trimmed)) return "Ingenium";
  return trimmed.toUpperCase();
}

function extractCanonicalEngineCodeFromText(raw: string | null | undefined): string | null {
  const text = cleanEngineText(raw);
  if (!text) return null;

  const matchers: RegExp[] = [
    /\bAJ\d+[A-Z0-9]*\b/i,
    /\bIngenium\b/i,
    /\bTDV\d+\b/i,
    /\bSDV\d+\b/i,
    /\bTD\d+\b/i,
    /\bSD\d+\b/i,
    /\bCDI\b/i,
    /\bEQ\b/i,
    /\bED\b/i,
    /\bMHD\b/i,
    /\bBlueHDi\b/i,
    /\bPureTech\b/i,
    /\bEcoBoost\b/i,
    /\bDuratorq\b/i,
    /\bDuratec\b/i,
    /\bTwinAir\b/i,
    /\bMultiAir\b/i,
    /\bT-?Jet\b/i,
  ];

  for (const pattern of matchers) {
    const match = text.match(pattern);
    if (match?.[0]) return normalizeCanonicalEngineCode(match[0]);
  }

  return null;
}

function cleanFamilyEngineTitle(raw: string | null | undefined): string | null {
  const text = cleanEngineText(raw);
  if (!text) return null;

  return text
    .replace(/^(Roadster\s+Coup[eé]|Roadster|Coup[eé]|Cabrio|Crossblade)\s+/i, "")
    .replace(/\bcdi\b/g, "CDI")
    .replace(/\beq\b/g, "EQ")
    .replace(/\bed\b/g, "ED")
    .replace(/\bmhd\b/g, "MHD")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// =============================================================================
// REFERENCE TABLES (for migration script — get-or-create, return _id)
// =============================================================================

export const boltPatternsInsert = mutation({
  args: { bolt_pattern: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_bolt_patterns")
      .filter((q) => q.eq(q.field("bolt_pattern"), args.bolt_pattern))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_bolt_patterns", {
      bolt_pattern: args.bolt_pattern,
      created_at: now,
      updated_at: now,
    });
  },
});

export const centerBoresInsert = mutation({
  args: { center_bore: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_center_bores")
      .filter((q) => q.eq(q.field("center_bore"), args.center_bore))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_center_bores", {
      center_bore: args.center_bore,
      created_at: now,
      updated_at: now,
    });
  },
});

export const colorsInsert = mutation({
  args: { color: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_colors")
      .filter((q) => q.eq(q.field("color"), args.color))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_colors", {
      color: args.color,
      created_at: now,
      updated_at: now,
    });
  },
});

export const colorsUpdate = mutation({
  args: {
    id: v.id("oem_colors"),
    slug: optionalString,
    color: optionalString,
    color_title: optionalString,
    family_id: v.optional(v.id("oem_color_families")),
    manufacturer_code: optionalString,
    hex: optionalString,
    finish: optionalString,
    notes: optionalString,
    private_blurb: optionalString,
    good_pic_url: optionalString,
    bad_pic_url: optionalString,
    brand_id: v.optional(v.id("oem_brands")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    return id;
  },
});

export const colorsDelete = mutation({
  args: { id: v.id("oem_colors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const diametersInsert = mutation({
  args: { diameter: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_diameters")
      .filter((q) => q.eq(q.field("diameter"), args.diameter))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_diameters", {
      diameter: args.diameter,
      created_at: now,
      updated_at: now,
    });
  },
});

export const widthsInsert = mutation({
  args: { width: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_widths")
      .filter((q) => q.eq(q.field("width"), args.width))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_widths", {
      width: args.width,
      created_at: now,
      updated_at: now,
    });
  },
});

export const tireSizesInsert = mutation({
  args: { tire_size: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tire_sizes")
      .filter((q) => q.eq(q.field("tire_size"), args.tire_size))
      .first();
    if (existing) return existing._id;
    const now = new Date().toISOString();
    return await ctx.db.insert("tire_sizes", {
      tire_size: args.tire_size,
      created_at: now,
      updated_at: now,
    });
  },
});

// =============================================================================
// OEM BRANDS
// =============================================================================

export const brandsInsert = mutation({
  args: {
    id: v.string(),
    brand_title: v.string(),
    brand_description: optionalString,
    brand_image_url: optionalString,
    brand_page: optionalString,
    subsidiaries: optionalString,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_brands", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const brandsUpdate = mutation({
  args: {
    id: v.id("oem_brands"),
    slug: optionalString,
    brand_title: optionalString,
    brand_description: optionalString,
    private_blurb: optionalString,
    brand_image_url: optionalString,
    brand_page: optionalString,
    subsidiaries: optionalString,
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    return id;
  },
});

export const brandsDelete = mutation({
  args: { id: v.id("oem_brands") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// =============================================================================
// OEM VEHICLES
// =============================================================================

export const vehiclesInsert = mutation({
  args: {
    id: v.string(),
    model_name: optionalString,
    vehicle_title: optionalString,
    generation: optionalString,
    body_type: optionalString,
    platform: optionalString,
    drive_type: optionalString,
    segment: optionalString,
    engine_details: optionalString,
    price_range: optionalString,
    special_notes: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    vehicle_image: optionalString,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_vehicles", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const vehiclesUpdate = mutation({
  args: {
    id: v.id("oem_vehicles"),
    slug: optionalString,
    text_brands: optionalString,
    model_name: optionalString,
    vehicle_title: optionalString,
    private_blurb: optionalString,
    generation: optionalString,
    body_type: optionalString,
    platform: optionalString,
    drive_type: optionalString,
    segment: optionalString,
    engine_details: optionalString,
    price_range: optionalString,
    special_notes: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    vehicle_image: optionalString,
    text_widths: optionalString,
    text_diameters: optionalString,
    text_bolt_patterns: optionalString,
    text_center_bores: optionalString,
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    return id;
  },
});

export const vehiclesDelete = mutation({
  args: { id: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const enginesNormalizeCanon = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const all = await ctx.db.query("oem_engines").collect();
    let updated = 0;
    const samples: Array<{
      id: string | null;
      beforeTitle: string | null;
      afterTitle: string | null;
      beforeCode: string | null;
      afterCode: string | null;
    }> = [];

    for (const doc of all) {
      const currentTitle = cleanEngineText(doc.engine_title);
      const currentCode = cleanEngineText(doc.engine_code);
      const nextTitle = cleanFamilyEngineTitle(doc.engine_title);
      const nextCode =
        currentCode ??
        extractCanonicalEngineCodeFromText(doc.engine_title) ??
        extractCanonicalEngineCodeFromText(doc.id);

      const titleChanged = nextTitle !== currentTitle;
      const codeChanged = nextCode !== currentCode;
      if (!titleChanged && !codeChanged) continue;

      const patch: Record<string, string> = {};
      if (titleChanged && nextTitle != null) patch.engine_title = nextTitle;
      if (codeChanged && nextCode != null) patch.engine_code = nextCode;
      patch.updated_at = new Date().toISOString();

      if (!dryRun) {
        await ctx.db.patch(doc._id, patch);
      }

      updated += 1;
      if (samples.length < 25) {
        samples.push({
          id: cleanEngineText(doc.id),
          beforeTitle: currentTitle,
          afterTitle: nextTitle,
          beforeCode: currentCode,
          afterCode: nextCode,
        });
      }
    }

    return { updated, dryRun, samples };
  },
});

// =============================================================================
// OEM WHEELS
// =============================================================================

export const wheelsInsert = mutation({
  args: {
    id: v.string(),
    wheel_title: v.string(),
    weight: optionalString,
    metal_type: optionalString,
    part_numbers: optionalString,
    notes: optionalString,
    good_pic_url: optionalString,
    image_source: optionalString,
    uuid: optionalString,
    ai_processing_complete: optionalBoolean,
    specifications_json: optionalString,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("oem_wheels", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

/** Extract spec fields from specifications_json for backfill (same keys as backfill script). */
function extractSpecFromJson(spec: string | undefined | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!spec?.trim()) return out;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(spec) as Record<string, unknown>;
  } catch {
    return out;
  }
  if (!obj || typeof obj !== "object") return out;
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = obj[k];
      if (v !== undefined && v !== null) return v;
    }
    const nested = obj.specifications ?? obj.specs ?? obj.data;
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      for (const k of keys) {
        const v = n[k];
        if (v !== undefined && v !== null) return v;
      }
    }
    return undefined;
  };
  let diameter = get("diameter", "diameters", "rim_diameter", "wheel_diameter");
  const sizeStr = get("size");
  if (sizeStr != null && typeof sizeStr === "string") {
    const pair = sizeStr.match(/(\d{2})\s*[x×]\s*(\d+(?:\.\d+)?)\s*J?/i);
    if (pair) {
      if (!out.text_diameters) out.text_diameters = pair[1];
      out.text_widths = pair[2];
    }
  }
  if (diameter != null) out.text_diameters = out.text_diameters ?? (Array.isArray(diameter) ? String(diameter[0]).trim() : String(diameter).trim());
  if (!out.text_diameters) {
    const notes = (obj.notes ?? obj.notes_text ?? "") + " " + spec;
    const inchMatch = notes.match(/\b(1[7-9]|2[0-2])\s*(?:inch|[""]|in\.?)\b/i) ?? notes.match(/\b(1[7-9]|2[0-2])\s*[x×]/);
    if (inchMatch) out.text_diameters = inchMatch[1];
  }
  let width = get("width", "widths", "rim_width", "wheel_width", "j_width");
  if (width != null) out.text_widths = Array.isArray(width) ? String(width[0]).trim() : String(width).trim();
  if (!out.text_widths && spec) {
    const sizeMatch = spec.match(/(\d{2})\s*[x×]\s*(\d+(?:\.\d+)?)\s*J?/i);
    if (sizeMatch) out.text_widths = sizeMatch[2];
  }
  const bolt = get("bolt_pattern", "boltPattern", "bolt", "pcd", "lug_pattern");
  if (bolt != null) out.text_bolt_patterns = Array.isArray(bolt) ? String(bolt[0]).trim() : String(bolt).trim();
  if (!out.text_bolt_patterns && spec && /\b\d+x\d+\b/.test(spec)) {
    const bp = spec.match(/\b(\d+x\d+)\b/);
    if (bp) out.text_bolt_patterns = bp[1];
  }
  const cb = get("center_bore", "centerBore", "cb", "hub_bore");
  if (cb != null) out.text_center_bores = Array.isArray(cb) ? String(cb[0]).trim() : String(cb).trim();
  if (!out.text_center_bores && spec && /\d+\.?\d*\s*mm/.test(spec)) {
    const mm = spec.match(/(\d+\.?\d*)\s*mm/i);
    if (mm) out.text_center_bores = mm[1] + "mm";
  }
  const color = get("color", "colors", "finish");
  if (color != null) out.text_colors = Array.isArray(color) ? String(color[0]).trim() : String(color).trim();
  return out;
}

/** Backfill text_* from specifications_json for a batch of wheels (run server-side). */
export const backfillWheelSpecsFromJsonBatch = mutation({
  args: { ids: v.array(v.id("oem_wheels")), maxBatch: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const ids = args.maxBatch ? args.ids.slice(0, args.maxBatch) : args.ids;
    let updated = 0;
    const now = new Date().toISOString();
    for (const id of ids) {
      const w = await ctx.db.get("oem_wheels", id);
      if (!w) continue;
      const raw = (w.specifications_json ?? "").trim();
      if (!raw) continue;
      const extracted = extractSpecFromJson(raw);
      if (Object.keys(extracted).length === 0) continue;
      const updates: Record<string, string> = {};
      if (!(w.text_diameters ?? "").trim() && extracted.text_diameters) updates.text_diameters = extracted.text_diameters;
      if (!(w.text_widths ?? "").trim() && extracted.text_widths) updates.text_widths = extracted.text_widths;
      if (!(w.text_bolt_patterns ?? "").trim() && extracted.text_bolt_patterns) updates.text_bolt_patterns = extracted.text_bolt_patterns;
      if (!(w.text_center_bores ?? "").trim() && extracted.text_center_bores) updates.text_center_bores = extracted.text_center_bores;
      if (!(w.text_colors ?? "").trim() && extracted.text_colors) updates.text_colors = extracted.text_colors;
      if (Object.keys(updates).length === 0) continue;
      await ctx.db.patch(id, { ...updates, updated_at: now });
      updated++;
    }
    return { updated };
  },
});

const commonSpecShape = v.object({
  diameter: v.optional(v.string()),
  width: v.optional(v.string()),
  boltPattern: v.optional(v.string()),
  centerBore: v.optional(v.string()),
});

/** One-off: fix wheels that got bad global fallback values (e.g. width 1.5, center_bore 398mm). */
export const fixWheelSpecsBadDefaults = mutation({
  args: {
    widthReplace: v.optional(v.object({ from: v.string(), to: v.string() })),
    centerBoreReplace: v.optional(v.object({ from: v.string(), to: v.string() })),
    maxWheels: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    const toPatch = wheels.filter((w) => {
      if (args.widthReplace && (w.text_widths ?? "").trim() === args.widthReplace.from) return true;
      if (args.centerBoreReplace && (w.text_center_bores ?? "").trim() === args.centerBoreReplace.from) return true;
      return false;
    });
    const slice = args.maxWheels ? toPatch.slice(0, args.maxWheels) : toPatch;
    const now = new Date().toISOString();
    for (const w of slice) {
      const updates: Record<string, string> = {};
      if (args.widthReplace && (w.text_widths ?? "").trim() === args.widthReplace.from) updates.text_widths = args.widthReplace.to;
      if (args.centerBoreReplace && (w.text_center_bores ?? "").trim() === args.centerBoreReplace.from) updates.text_center_bores = args.centerBoreReplace.to;
      if (Object.keys(updates).length > 0) await ctx.db.patch(w._id, { ...updates, updated_at: now });
    }
    return { fixed: slice.length };
  },
});

/** Backfill empty wheel text_* from common specs per brand (or global fallback). */
export const backfillWheelSpecsFromCommonByBrand = mutation({
  args: {
    ids: v.array(v.id("oem_wheels")),
    byBrand: v.record(v.string(), commonSpecShape),
    global: commonSpecShape,
    maxBatch: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const ids = args.maxBatch ? args.ids.slice(0, args.maxBatch) : args.ids;
    let updated = 0;
    const now = new Date().toISOString();
    for (const id of ids) {
      const w = await ctx.db.get("oem_wheels", id);
      if (!w) continue;
      const updates: Record<string, string> = {};
      const needD = !(w.text_diameters ?? "").trim();
      const needW = !(w.text_widths ?? "").trim();
      const needB = !(w.text_bolt_patterns ?? "").trim();
      const needC = !(w.text_center_bores ?? "").trim();
      if (!needD && !needW && !needB && !needC) continue;

      const brandLink = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", id))
        .first();
      const brandId = brandLink?.brand_id as string | undefined;
      const common = (brandId && args.byBrand[brandId]) ? args.byBrand[brandId] : args.global;

      if (needD && common.diameter) updates.text_diameters = common.diameter;
      if (needW && common.width) updates.text_widths = common.width;
      if (needB && common.boltPattern) updates.text_bolt_patterns = common.boltPattern;
      if (needC && common.centerBore) updates.text_center_bores = common.centerBore;
      if (Object.keys(updates).length === 0) continue;
      await ctx.db.patch(id, { ...updates, updated_at: now });
      updated++;
    }
    return { updated };
  },
});

export const wheelsUpdate = mutation({
  args: {
    id: v.id("oem_wheels"),
    slug: optionalString,
    wheel_title: optionalString,
    private_blurb: optionalString,
    weight: optionalString,
    metal_type: optionalString,
    part_numbers: optionalString,
    notes: optionalString,
    good_pic_url: optionalString,
    image_source: optionalString,
    uuid: optionalString,
    ai_processing_complete: optionalBoolean,
    specifications_json: optionalString,
    text_diameters: optionalString,
    text_widths: optionalString,
    text_bolt_patterns: optionalString,
    text_center_bores: optionalString,
    text_colors: optionalString,
    text_offsets: optionalString,
    text_tire_sizes: optionalString,
    jnc_brands: optionalString,
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    return id;
  },
});

export const backfillWheelBrandSources = mutation({
  args: {
    maxBatch: v.optional(v.number()),
    prioritizeMissingBrandId: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const maxBatch = Math.max(1, Math.min(args.maxBatch ?? 500, 5000));
    const prioritizeMissingBrandId = args.prioritizeMissingBrandId ?? false;
    const now = new Date().toISOString();
    const wheels = await ctx.db.query("oem_wheels").collect();
    const links = await ctx.db.query("j_wheel_brand").collect();
    const brands = await ctx.db.query("oem_brands").collect();

    const brandById = new Map(brands.map((brand) => [brand._id, brand]));
    const linksByWheel = new Map<typeof wheels[number]["_id"], typeof links>();
    for (const link of links) {
      const existing = linksByWheel.get(link.wheel_id) ?? [];
      existing.push(link);
      linksByWheel.set(link.wheel_id, existing);
    }

    const orderedWheels = prioritizeMissingBrandId
      ? [...wheels].sort((a, b) => {
          const aMissingBrandId = a.brand_id == null ? 1 : 0;
          const bMissingBrandId = b.brand_id == null ? 1 : 0;
          return bMissingBrandId - aMissingBrandId;
        })
      : wheels;

    let updated = 0;
    let skippedMultiLink = 0;
    for (const wheel of orderedWheels) {
      if (updated >= maxBatch) break;
      const hasBrandId = wheel.brand_id != null;
      const hasJunctionBrands = Boolean(String(wheel.jnc_brands ?? "").trim());
      if (hasBrandId && hasJunctionBrands) continue;

      const wheelLinks = linksByWheel.get(wheel._id) ?? [];
      if (wheelLinks.length !== 1) {
        if (!hasBrandId || !hasJunctionBrands) skippedMultiLink += 1;
        continue;
      }

      const link = wheelLinks[0];
      const brand = brandById.get(link.brand_id);
      const patch: {
        brand_id?: typeof link.brand_id;
        jnc_brands?: string;
        updated_at: string;
      } = { updated_at: now };

      if (!hasBrandId) patch.brand_id = link.brand_id;
      if (!hasJunctionBrands) {
        patch.jnc_brands = String(brand?.brand_title ?? link.brand_title ?? "").trim();
      }

      if (patch.brand_id == null && patch.jnc_brands == null) continue;
      await ctx.db.patch(wheel._id, patch);
      updated += 1;
    }

    return { updated, skippedMultiLink };
  },
});

export const syncWheelJunctionBrands = mutation({
  args: {
    maxBatch: v.optional(v.number()),
    cursor: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const maxBatch = Math.max(1, Math.min(args.maxBatch ?? 500, 1000));
    const now = new Date().toISOString();
    const wheelPage = await ctx.db
      .query("oem_wheels")
      .order("asc")
      .paginate({ numItems: maxBatch, cursor: args.cursor ?? null });

    let updated = 0;
    for (const wheel of wheelPage.page) {
      const wheelLinks = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheel._id))
        .collect();
      if (wheelLinks.length === 0) continue;
      const brands = await Promise.all(
        wheelLinks.map((link) => ctx.db.get(link.brand_id))
      );
      const joinedBrands = Array.from(
        new Set(
          wheelLinks
            .map((link, index) =>
              String(brands[index]?.brand_title ?? link.brand_title ?? "").trim()
            )
            .filter(Boolean)
        )
      ).join(", ");
      if (!joinedBrands) continue;
      const nextBrandId = wheel.brand_id ?? wheelLinks[0].brand_id;
      if ((wheel.jnc_brands ?? "") === joinedBrands && wheel.brand_id === nextBrandId) continue;
      await ctx.db.patch(wheel._id, {
        jnc_brands: joinedBrands,
        brand_id: nextBrandId,
        updated_at: now,
      });
      updated += 1;
    }

    return {
      updated,
      nextCursor: wheelPage.continueCursor ?? null,
      isDone: wheelPage.isDone,
    };
  },
});

export const wheelsDelete = mutation({
  args: { id: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const adminCollectionItemTitleUpdate = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
    ),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const title = args.title.trim();
    if (!title) {
      throw new Error("Title is required.");
    }

    const updated_at = new Date().toISOString();

    switch (args.itemType) {
      case "brand":
        await ctx.db.patch(args.id, { brand_title: title, updated_at });
        return args.id;
      case "vehicle":
        await ctx.db.patch(args.id, { vehicle_title: title, updated_at });
        return args.id;
      case "wheel":
        await ctx.db.patch(args.id, { wheel_title: title, updated_at });
        return args.id;
      case "engine":
        await ctx.db.patch(args.id, { engine_title: title, updated_at });
        return args.id;
      case "color":
        await ctx.db.patch(args.id, { color_title: title, updated_at });
        return args.id;
      default:
        throw new Error("Unsupported item type.");
    }
  },
});

export const adminCollectionItemPrivateBlurbUpdate = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
    ),
    privateBlurb: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const updated_at = new Date().toISOString();
    const private_blurb = args.privateBlurb;

    switch (args.itemType) {
      case "brand":
      case "vehicle":
      case "wheel":
      case "engine":
      case "color":
        await ctx.db.patch(args.id, { private_blurb, updated_at });
        return args.id;
      default:
        throw new Error("Unsupported item type.");
    }
  },
});

export const adminCollectionItemAssetUrlUpdate = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
    ),
    field: v.union(
      v.literal("brand_image_url"),
      v.literal("vehicle_image"),
      v.literal("good_pic_url"),
      v.literal("bad_pic_url"),
    ),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const updated_at = new Date().toISOString();

    switch (args.itemType) {
      case "brand":
        if (!["brand_image_url", "good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported brand asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: args.mediaUrl, updated_at });
        return args.id;
      case "vehicle":
        if (!["vehicle_image", "good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported vehicle asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: args.mediaUrl, updated_at });
        return args.id;
      case "wheel":
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported wheel asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: args.mediaUrl, updated_at });
        return args.id;
      case "engine":
      case "color":
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: args.mediaUrl, updated_at });
        return args.id;
      default:
        throw new Error("Unsupported item type.");
    }
  },
});

export const adminBrandDescriptionUpdate = mutation({
  args: {
    id: v.id("oem_brands"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.id, {
      brand_description: args.description,
      updated_at: new Date().toISOString(),
    });
    return args.id;
  },
});

// =============================================================================
// JUNCTION TABLE: vehicle_brand (for migration from Supabase)
// =============================================================================

export const vehicleBrandLink = mutation({
  args: {
    vehicle_id: v.id("oem_vehicles"),
    brand_id: v.id("oem_brands"),
    vehicle_title: v.optional(v.string()),
    brand_title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_vehicle_brand")
      .withIndex("by_vehicle_brand", (q) =>
        q.eq("vehicle_id", args.vehicle_id).eq("brand_id", args.brand_id)
      )
      .first();
    if (existing) return existing._id;
    const [vehicle, brand] = await Promise.all([
      ctx.db.get("oem_vehicles", args.vehicle_id),
      ctx.db.get("oem_brands", args.brand_id),
    ]);
    return await ctx.db.insert("j_vehicle_brand", {
      vehicle_id: args.vehicle_id,
      brand_id: args.brand_id,
      vehicle_title: args.vehicle_title ?? vehicle?.vehicle_title ?? "",
      brand_title: args.brand_title ?? brand?.brand_title ?? "",
    });
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_brand (for migration from Supabase)
// =============================================================================

export const wheelBrandLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    brand_id: v.id("oem_brands"),
    wheel_title: v.optional(v.string()),
    brand_title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_brand")
      .withIndex("by_wheel_brand", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("brand_id", args.brand_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, brand] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_brands", args.brand_id),
    ]);
    const insertedId = await ctx.db.insert("j_wheel_brand", {
      wheel_id: args.wheel_id,
      brand_id: args.brand_id,
      wheel_title: args.wheel_title ?? wheel?.wheel_title ?? "",
      brand_title: args.brand_title ?? brand?.brand_title ?? "",
    });
    const brandLinks = await ctx.db
      .query("j_wheel_brand")
      .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheel_id))
      .collect();
    const joinedBrands = Array.from(
      new Set(
        brandLinks
          .map((link) => String(link.brand_title ?? "").trim())
          .filter(Boolean)
      )
    ).join(", ");
    await ctx.db.patch(args.wheel_id, {
      jnc_brands: joinedBrands || String(brand?.brand_title ?? "").trim(),
      brand_id: wheel?.brand_id ?? args.brand_id,
      updated_at: new Date().toISOString(),
    });
    return insertedId;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_vehicles
// =============================================================================

export const wheelVehicleLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    vehicle_id: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_vehicle")
      .withIndex("by_wheel_vehicle", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("vehicle_id", args.vehicle_id)
      )
      .first();
    if (existing) return existing._id;
    const wheel = await ctx.db.get("oem_wheels", args.wheel_id);
    const vehicle = await ctx.db.get("oem_vehicles", args.vehicle_id);
    return await ctx.db.insert("j_wheel_vehicle", {
      wheel_id: args.wheel_id,
      vehicle_id: args.vehicle_id,
      wheel_title: wheel?.wheel_title ?? "",
      vehicle_title: vehicle?.vehicle_title ?? "",
    });
  },
});

export const wheelVehicleUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    vehicle_id: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_vehicle")
      .withIndex("by_wheel_vehicle", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("vehicle_id", args.vehicle_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_bolt_pattern
// =============================================================================

export const wheelBoltPatternLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_bolt_pattern")
      .withIndex("by_wheel_bolt_pattern", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("bolt_pattern_id", args.bolt_pattern_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, bp] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_bolt_patterns", args.bolt_pattern_id),
    ]);
    return await ctx.db.insert("j_wheel_bolt_pattern", {
      wheel_id: args.wheel_id,
      bolt_pattern_id: args.bolt_pattern_id,
      wheel_title: wheel?.wheel_title ?? "",
      bolt_pattern: bp?.bolt_pattern ?? "",
    });
  },
});

export const wheelBoltPatternUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_bolt_pattern")
      .withIndex("by_wheel_bolt_pattern", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("bolt_pattern_id", args.bolt_pattern_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_diameter
// =============================================================================

export const wheelDiameterLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_diameter")
      .withIndex("by_wheel_diameter", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("diameter_id", args.diameter_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, d] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_diameters", args.diameter_id),
    ]);
    return await ctx.db.insert("j_wheel_diameter", {
      wheel_id: args.wheel_id,
      diameter_id: args.diameter_id,
      wheel_title: wheel?.wheel_title ?? "",
      diameter: d?.diameter ?? "",
    });
  },
});

export const wheelDiameterUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_diameter")
      .withIndex("by_wheel_diameter", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("diameter_id", args.diameter_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_width
// =============================================================================

export const wheelWidthLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_width")
      .withIndex("by_wheel_width", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("width_id", args.width_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, w] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_widths", args.width_id),
    ]);
    return await ctx.db.insert("j_wheel_width", {
      wheel_id: args.wheel_id,
      width_id: args.width_id,
      wheel_title: wheel?.wheel_title ?? "",
      width: w?.width ?? "",
    });
  },
});

export const wheelWidthUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_width")
      .withIndex("by_wheel_width", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("width_id", args.width_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_center_bore
// =============================================================================

export const wheelCenterBoreLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_center_bore")
      .withIndex("by_wheel_center_bore", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("center_bore_id", args.center_bore_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, cb] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_center_bores", args.center_bore_id),
    ]);
    return await ctx.db.insert("j_wheel_center_bore", {
      wheel_id: args.wheel_id,
      center_bore_id: args.center_bore_id,
      wheel_title: wheel?.wheel_title ?? "",
      center_bore: cb?.center_bore ?? "",
    });
  },
});

export const wheelCenterBoreUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_center_bore")
      .withIndex("by_wheel_center_bore", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("center_bore_id", args.center_bore_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_color
// =============================================================================

export const wheelColorLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_color")
      .withIndex("by_wheel_color", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("color_id", args.color_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, c] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("oem_colors", args.color_id),
    ]);
    return await ctx.db.insert("j_wheel_color", {
      wheel_id: args.wheel_id,
      color_id: args.color_id,
      wheel_title: wheel?.wheel_title ?? "",
      color: c?.color ?? "",
    });
  },
});

export const wheelColorUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_color")
      .withIndex("by_wheel_color", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("color_id", args.color_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: j_wheel_tire_size
// =============================================================================

export const wheelTireSizeLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("j_wheel_tire_size")
      .withIndex("by_wheel_tire_size", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("tire_size_id", args.tire_size_id)
      )
      .first();
    if (existing) return existing._id;
    const [wheel, ts] = await Promise.all([
      ctx.db.get("oem_wheels", args.wheel_id),
      ctx.db.get("tire_sizes", args.tire_size_id),
    ]);
    return await ctx.db.insert("j_wheel_tire_size", {
      wheel_id: args.wheel_id,
      tire_size_id: args.tire_size_id,
      wheel_title: wheel?.wheel_title ?? "",
      tire_size: ts?.tire_size ?? "",
    });
  },
});

export const wheelTireSizeUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("j_wheel_tire_size")
      .withIndex("by_wheel_tire_size", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("tire_size_id", args.tire_size_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// USER SAVED ITEMS (link / unlink)
// =============================================================================

export const savedBrandLink = mutation({
  args: {
    userId: v.string(),
    brandId: v.id("oem_brands"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("saved_brands")
      .withIndex("by_user_brand", (q) =>
        q.eq("user_id", args.userId).eq("brand_id", args.brandId)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("saved_brands", {
      user_id: args.userId,
      brand_id: args.brandId,
    });
  },
});

export const savedBrandUnlink = mutation({
  args: {
    userId: v.string(),
    brandId: v.id("oem_brands"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("saved_brands")
      .withIndex("by_user_brand", (q) =>
        q.eq("user_id", args.userId).eq("brand_id", args.brandId)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

export const savedVehicleLink = mutation({
  args: {
    userId: v.string(),
    vehicleId: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("saved_vehicles")
      .withIndex("by_user_vehicle", (q) =>
        q.eq("user_id", args.userId).eq("vehicle_id", args.vehicleId)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("saved_vehicles", {
      user_id: args.userId,
      vehicle_id: args.vehicleId,
    });
  },
});

export const savedVehicleUnlink = mutation({
  args: {
    userId: v.string(),
    vehicleId: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("saved_vehicles")
      .withIndex("by_user_vehicle", (q) =>
        q.eq("user_id", args.userId).eq("vehicle_id", args.vehicleId)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

export const savedWheelLink = mutation({
  args: {
    userId: v.string(),
    wheelId: v.id("oem_wheels"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("saved_wheels")
      .withIndex("by_user_wheel", (q) =>
        q.eq("user_id", args.userId).eq("wheel_id", args.wheelId)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("saved_wheels", {
      user_id: args.userId,
      wheel_id: args.wheelId,
    });
  },
});

export const savedWheelUnlink = mutation({
  args: {
    userId: v.string(),
    wheelId: v.id("oem_wheels"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("saved_wheels")
      .withIndex("by_user_wheel", (q) =>
        q.eq("user_id", args.userId).eq("wheel_id", args.wheelId)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// USER CONTENT (comments)
// =============================================================================

export const vehicleCommentInsert = mutation({
  args: {
    vehicleId: v.id("oem_vehicles"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
    tag: optionalString,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("vehicle_comments", {
      vehicle_id: args.vehicleId,
      user_id: args.userId,
      user_name: args.userName ?? undefined,
      comment_text: args.comment_text,
      tag: args.tag ?? undefined,
      created_at: now,
      updated_at: now,
    });
  },
});

export const engineCommentInsert = mutation({
  args: {
    engineId: v.id("oem_engines"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("engine_comments", {
      engine_id: args.engineId,
      user_id: args.userId,
      user_name: args.userName ?? undefined,
      comment_text: args.comment_text,
      created_at: now,
      updated_at: now,
    });
  },
});

export const wheelCommentInsert = mutation({
  args: {
    wheelId: v.id("oem_wheels"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("wheel_comments", {
      wheel_id: args.wheelId,
      user_id: args.userId,
      user_name: args.userName ?? undefined,
      comment_text: args.comment_text,
      created_at: now,
      updated_at: now,
    });
  },
});

export const brandCommentInsert = mutation({
  args: {
    brandId: v.id("oem_brands"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("brand_comments", {
      brand_id: args.brandId,
      user_id: args.userId,
      user_name: args.userName ?? undefined,
      comment_text: args.comment_text,
      created_at: now,
      updated_at: now,
    });
  },
});

// =============================================================================
// REGISTERED VEHICLES
// =============================================================================

export const registeredVehicleDelete = mutation({
  args: { id: v.id("user_registered_vehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// =============================================================================
// USER TABLE PREFERENCES (column order)
// =============================================================================

export const userTablePreferencesUpsert = mutation({
  args: {
    userId: v.string(),
    tableName: v.string(),
    columnOrderJson: v.optional(v.string()),
    hiddenColumnsJson: v.optional(v.string()),
    columnLabelsJson: v.optional(v.string()),
    columnGroupsJson: v.optional(v.string()),
    columnWidthsJson: v.optional(v.string()),
    pickerHiddenTablesJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("user_table_preferences")
      .withIndex("by_user_table", (q) =>
        q.eq("user_id", args.userId).eq("table_name", args.tableName)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        column_order_json: args.columnOrderJson,
        hidden_columns_json: args.hiddenColumnsJson,
        column_labels_json: args.columnLabelsJson,
        column_groups_json: args.columnGroupsJson,
        column_widths_json: args.columnWidthsJson,
        picker_hidden_tables_json: args.pickerHiddenTablesJson,
        updated_at: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("user_table_preferences", {
      user_id: args.userId,
      table_name: args.tableName,
      column_order_json: args.columnOrderJson,
      hidden_columns_json: args.hiddenColumnsJson,
      column_labels_json: args.columnLabelsJson,
      column_groups_json: args.columnGroupsJson,
      column_widths_json: args.columnWidthsJson,
      picker_hidden_tables_json: args.pickerHiddenTablesJson,
      created_at: now,
      updated_at: now,
    });
  },
});

export const userTablePreferencesDelete = mutation({
  args: { userId: v.string(), tableName: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_table_preferences")
      .withIndex("by_user_table", (q) =>
        q.eq("user_id", args.userId).eq("table_name", args.tableName)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return existing._id;
    }
    return null;
  },
});

export const adminTableSelectorLayoutUpsert = mutation({
  args: {
    layoutScope: v.optional(v.string()),
    customGroupsJson: v.string(),
    hiddenTablesJson: v.optional(v.string()),
    schemaNodePositionsJson: v.optional(v.string()),
    schemaSectionLayoutsJson: v.optional(v.string()),
    schemaViewportJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = requireAdminUserId(identity);
    const layoutScope = args.layoutScope?.trim() || DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE;
    const now = new Date().toISOString();
    const sharedFields = {
      custom_groups_json: args.customGroupsJson,
      ...(typeof args.hiddenTablesJson === "string"
        ? { hidden_tables_json: args.hiddenTablesJson }
        : {}),
      ...(typeof args.schemaNodePositionsJson === "string"
        ? { schema_node_positions_json: args.schemaNodePositionsJson }
        : {}),
      ...(typeof args.schemaSectionLayoutsJson === "string"
        ? { schema_section_layouts_json: args.schemaSectionLayoutsJson }
        : {}),
      ...(typeof args.schemaViewportJson === "string"
        ? { schema_viewport_json: args.schemaViewportJson }
        : {}),
    };

    const existing = await ctx.db
      .query("admin_table_selector_layouts")
      .withIndex("by_user_scope", (q) =>
        q.eq("user_id", userId).eq("layout_scope", layoutScope)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...sharedFields,
        updated_at: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("admin_table_selector_layouts", {
      user_id: userId,
      layout_scope: layoutScope,
      ...sharedFields,
      created_at: now,
      updated_at: now,
    });
  },
});

export const adminTableSelectorLayoutDelete = mutation({
  args: {
    layoutScope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = requireAdminUserId(identity);
    const layoutScope = args.layoutScope?.trim() || DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE;

    const existing = await ctx.db
      .query("admin_table_selector_layouts")
      .withIndex("by_user_scope", (q) =>
        q.eq("user_id", userId).eq("layout_scope", layoutScope)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return existing._id;
    }

    return null;
  },
});

const registeredVehicleOptional = {
  trim: optionalString,
  color: optionalString,
  purchase_date: optionalString,
  purchase_price: optionalNumber,
  current_value_estimate: optionalNumber,
  license_plate: optionalString,
  insurance_provider: optionalString,
  insurance_policy_number: optionalString,
  registration_expiry: optionalString,
  last_service_date: optionalString,
  next_service_due: optionalString,
  notes: optionalString,
  images: v.optional(v.array(v.string())),
  documents: v.optional(v.array(v.string())),
};

export const registeredVehicleInsert = mutation({
  args: {
    userId: v.string(),
    vin: v.string(),
    vehicle_title: optionalString,
    brand_ref: v.string(),
    vehicle_ref: v.string(),
    year: v.number(),
    mileage: v.number(),
    ownership_status: v.union(
      v.literal("owned"),
      v.literal("leased"),
      v.literal("financed"),
      v.literal("sold")
    ),
    ...registeredVehicleOptional,
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db
      .query("oem_brands")
      .filter((q) => q.eq(q.field("id"), args.brand_ref))
      .first();
    const vehicle = await ctx.db
      .query("oem_vehicles")
      .filter((q) => q.eq(q.field("id"), args.vehicle_ref))
      .first();
    const now = new Date().toISOString();
    return await ctx.db.insert("user_registered_vehicles", {
      user_id: args.userId,
      vin: args.vin.toUpperCase(),
      make: brand?.brand_title ?? "Unknown",
      model: vehicle?.model_name ?? vehicle?.vehicle_title ?? "Unknown",
      year: args.year,
      mileage: args.mileage,
      vehicle_title: args.vehicle_title,
      ownership_status: args.ownership_status,
      trim: args.trim,
      color: args.color,
      purchase_date: args.purchase_date,
      purchase_price: args.purchase_price,
      current_value_estimate: args.current_value_estimate,
      license_plate: args.license_plate,
      insurance_provider: args.insurance_provider,
      insurance_policy_number: args.insurance_policy_number,
      registration_expiry: args.registration_expiry,
      last_service_date: args.last_service_date,
      next_service_due: args.next_service_due,
      notes: args.notes,
      linked_oem_vehicle_id: vehicle?._id,
      brand_id: brand?._id,
      images: args.images,
      documents: args.documents,
      created_at: now,
      updated_at: now,
    });
  },
});

export const registeredVehicleUpdate = mutation({
  args: {
    id: v.id("user_registered_vehicles"),
    vehicle_title: optionalString,
    brand_ref: v.optional(v.string()),
    vehicle_ref: v.optional(v.string()),
    year: optionalNumber,
    mileage: optionalNumber,
    ownership_status: v.optional(
      v.union(
        v.literal("owned"),
        v.literal("leased"),
        v.literal("financed"),
        v.literal("sold")
      )
    ),
    ...registeredVehicleOptional,
  },
  handler: async (ctx, args) => {
    const { id, brand_ref, vehicle_ref, ...rest } = args;
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (brand_ref) {
      const brand = await ctx.db
        .query("oem_brands")
        .filter((q) => q.eq(q.field("id"), brand_ref))
        .first();
      if (brand) {
        patch.brand_id = brand._id;
        patch.make = brand.brand_title;
      }
    }
    if (vehicle_ref) {
      const vehicle = await ctx.db
        .query("oem_vehicles")
        .filter((q) => q.eq(q.field("id"), vehicle_ref))
        .first();
      if (vehicle) {
        patch.linked_oem_vehicle_id = vehicle._id;
        patch.model = vehicle.model_name ?? vehicle.vehicle_title ?? "Unknown";
      }
    }

    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) patch[k] = v;
    }
    await ctx.db.patch(id, patch as any);
  },
});
