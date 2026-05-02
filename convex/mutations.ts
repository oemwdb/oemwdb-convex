/**
 * Convex mutations for core domain tables and junction tables.
 * No *_ref fields. Junction tables use link/unlink mutations.
 */

import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import {
  DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE,
  requireAdmin,
  requireAdminUserId,
} from "./adminAuth";
import {
  buildMediaUrl,
  getResolvedNodeMetadata,
  refreshLinkedUrlsForStorageId,
} from "./bucketBrowserShared";
import { buildStoragePath, normalizePath } from "./storagePaths";

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
    platform_code: optionalString,
    drive_type: optionalString,
    segment: optionalString,
    engine_details: optionalString,
    price_range: optionalString,
    special_notes: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    good_pic_url: optionalString,
    bad_pic_url: optionalString,
    vehicle_length_mm: v.optional(v.number()),
    vehicle_width_mm: v.optional(v.number()),
    vehicle_height_mm: v.optional(v.number()),
    wheelbase_mm: v.optional(v.number()),
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
    platform_code: optionalString,
    drive_type: optionalString,
    segment: optionalString,
    engine_details: optionalString,
    price_range: optionalString,
    special_notes: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    good_pic_url: optionalString,
    bad_pic_url: optionalString,
    vehicle_length_mm: v.optional(v.number()),
    vehicle_width_mm: v.optional(v.number()),
    vehicle_height_mm: v.optional(v.number()),
    wheelbase_mm: v.optional(v.number()),
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

export const landRoverVehicleDetailCardFitmentApply = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
    rows: v.array(v.object({
      vehicleId: v.id("oem_vehicles"),
      platformCode: optionalString,
      textBoltPatterns: optionalString,
      textCenterBores: optionalString,
      textDiameters: optionalString,
      textWidths: optionalString,
      privateBlurb: v.string(),
      boltPatterns: v.array(v.string()),
      centerBores: v.array(v.string()),
      diameters: v.array(v.string()),
      widths: v.array(v.string()),
    })),
    variants: v.array(v.object({
      variantId: v.id("oem_vehicle_variants"),
      privateBlurb: v.string(),
    })),
    variantBrandLinks: v.optional(v.array(v.object({
      variantId: v.id("oem_vehicle_variants"),
      brandId: v.id("oem_brands"),
      variantTitle: v.string(),
      brandTitle: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const now = new Date().toISOString();
    const clean = (value: unknown) => String(value ?? "").trim();
    const vehicleTitle = (vehicle: any) => clean(vehicle.vehicle_title) || clean(vehicle.id) || String(vehicle._id);

    async function ensureReference(
      table: "oem_bolt_patterns" | "oem_center_bores" | "oem_diameters" | "oem_widths",
      field: "bolt_pattern" | "center_bore" | "diameter" | "width",
      value: string,
    ) {
      const existing = await (ctx.db.query(table) as any)
        .filter((q: any) => q.eq(q.field(field), value))
        .first();
      if (existing) return { id: existing._id, created: false };
      if (dryRun) return { id: null, created: true };
      const id = await ctx.db.insert(table as any, { [field]: value, created_at: now, updated_at: now } as any);
      return { id, created: true };
    }

    async function ensureVehicleLink(
      table: "j_vehicle_bolt_pattern" | "j_vehicle_center_bore" | "j_vehicle_diameter" | "j_vehicle_width",
      index: "by_vehicle_bolt_pattern" | "by_vehicle_center_bore" | "by_vehicle_diameter" | "by_vehicle_width",
      vehicle: any,
      referenceIdField: "bolt_pattern_id" | "center_bore_id" | "diameter_id" | "width_id",
      valueField: "bolt_pattern" | "center_bore" | "diameter" | "width",
      referenceId: any,
      value: string,
    ) {
      if (!referenceId) {
        return { inserted: dryRun, existing: false, patched: false };
      }
      const existing = await (ctx.db.query(table) as any)
        .withIndex(index as any, (q: any) => q.eq("vehicle_id", vehicle._id).eq(referenceIdField, referenceId))
        .first();
      if (!existing) {
        if (!dryRun) {
          await ctx.db.insert(table as any, {
            vehicle_id: vehicle._id,
            [referenceIdField]: referenceId,
            vehicle_title: vehicleTitle(vehicle),
            [valueField]: value,
          } as any);
        }
        return { inserted: true, existing: false, patched: false };
      }
      const patch: Record<string, string> = {};
      if (existing.vehicle_title !== vehicleTitle(vehicle)) patch.vehicle_title = vehicleTitle(vehicle);
      if (existing[valueField] !== value) patch[valueField] = value;
      if (Object.keys(patch).length > 0 && !dryRun) {
        await ctx.db.patch(existing._id, patch);
      }
      return { inserted: false, existing: true, patched: Object.keys(patch).length > 0 };
    }

    let vehiclePatches = 0;
    let variantPatches = 0;
    let variantBrandLinksInserted = 0;
    let variantBrandLinksExisting = 0;
    let variantBrandLinksPatched = 0;
    let refsCreated = 0;
    let linksInserted = 0;
    let linksExisting = 0;
    let linksPatched = 0;

    for (const row of args.rows) {
      const vehicle = await ctx.db.get(row.vehicleId);
      if (!vehicle) throw new Error(`Vehicle not found: ${row.vehicleId}`);

      const directPatch: Record<string, string> = {
        private_blurb: row.privateBlurb,
        updated_at: now,
      };
      if (row.platformCode) directPatch.platform_code = row.platformCode;
      if (row.textBoltPatterns) directPatch.text_bolt_patterns = row.textBoltPatterns;
      if (row.textCenterBores) directPatch.text_center_bores = row.textCenterBores;
      if (row.textDiameters) directPatch.text_diameters = row.textDiameters;
      if (row.textWidths) directPatch.text_widths = row.textWidths;

      if (!dryRun) await ctx.db.patch(row.vehicleId, directPatch);
      vehiclePatches += 1;

      const linkSpecs = [
        {
          values: row.boltPatterns,
          refTable: "oem_bolt_patterns" as const,
          linkTable: "j_vehicle_bolt_pattern" as const,
          index: "by_vehicle_bolt_pattern" as const,
          refIdField: "bolt_pattern_id" as const,
          valueField: "bolt_pattern" as const,
        },
        {
          values: row.centerBores,
          refTable: "oem_center_bores" as const,
          linkTable: "j_vehicle_center_bore" as const,
          index: "by_vehicle_center_bore" as const,
          refIdField: "center_bore_id" as const,
          valueField: "center_bore" as const,
        },
        {
          values: row.diameters,
          refTable: "oem_diameters" as const,
          linkTable: "j_vehicle_diameter" as const,
          index: "by_vehicle_diameter" as const,
          refIdField: "diameter_id" as const,
          valueField: "diameter" as const,
        },
        {
          values: row.widths,
          refTable: "oem_widths" as const,
          linkTable: "j_vehicle_width" as const,
          index: "by_vehicle_width" as const,
          refIdField: "width_id" as const,
          valueField: "width" as const,
        },
      ];

      for (const spec of linkSpecs) {
        for (const rawValue of spec.values) {
          const value = clean(rawValue);
          if (!value) continue;
          const ref = await ensureReference(spec.refTable, spec.valueField, value);
          if (ref.created) refsCreated += 1;
          const linked = await ensureVehicleLink(
            spec.linkTable,
            spec.index,
            vehicle,
            spec.refIdField,
            spec.valueField,
            ref.id,
            value,
          );
          if (linked.inserted) linksInserted += 1;
          if (linked.existing) linksExisting += 1;
          if (linked.patched) linksPatched += 1;
        }
      }
    }

    for (const row of args.variants) {
      const variant = await ctx.db.get(row.variantId);
      if (!variant) throw new Error(`Vehicle variant not found: ${row.variantId}`);
      if (!dryRun) {
        await ctx.db.patch(row.variantId, { private_blurb: row.privateBlurb });
      }
      variantPatches += 1;
    }

    for (const row of args.variantBrandLinks ?? []) {
      const [variant, brand] = await Promise.all([
        ctx.db.get(row.variantId),
        ctx.db.get(row.brandId),
      ]);
      if (!variant) throw new Error(`Vehicle variant not found: ${row.variantId}`);
      if (!brand) throw new Error(`Brand not found: ${row.brandId}`);

      const existing = await ctx.db
        .query("j_oem_vehicle_variant_brand")
        .withIndex("by_oem_vehicle_variant_brand", (q) =>
          q.eq("variant_id", row.variantId).eq("brand_id", row.brandId),
        )
        .first();
      if (!existing) {
        if (!dryRun) {
          await ctx.db.insert("j_oem_vehicle_variant_brand", {
            variant_id: row.variantId,
            brand_id: row.brandId,
            variant_title: row.variantTitle || variant.variant_title || "",
            brand_title: row.brandTitle || brand.brand_title || "",
          });
        }
        variantBrandLinksInserted += 1;
      } else {
        const patch: Record<string, string> = {};
        const nextVariantTitle = row.variantTitle || variant.variant_title || "";
        const nextBrandTitle = row.brandTitle || brand.brand_title || "";
        if (existing.variant_title !== nextVariantTitle) patch.variant_title = nextVariantTitle;
        if (existing.brand_title !== nextBrandTitle) patch.brand_title = nextBrandTitle;
        if (Object.keys(patch).length > 0) {
          if (!dryRun) await ctx.db.patch(existing._id, patch);
          variantBrandLinksPatched += 1;
        } else {
          variantBrandLinksExisting += 1;
        }
      }
    }

    return {
      dryRun,
      vehiclePatches,
      variantPatches,
      variantBrandLinksInserted,
      variantBrandLinksExisting,
      variantBrandLinksPatched,
      refsCreated,
      linksInserted,
      linksExisting,
      linksPatched,
    };
  },
});

export const lamborghiniVehicleBackboneApply = mutation({
  args: {
    brandId: v.id("oem_brands"),
    date: v.string(),
    families: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();
    const cleanText = (value: unknown) => String(value ?? "").trim();
    const brand = await ctx.db.get(args.brandId);
    if (!brand || normalize(brand.brand_title) !== "lamborghini") {
      throw new Error("lamborghiniVehicleBackboneApply only accepts the Lamborghini brand row.");
    }

    const appendPrivateBlurb = (existing: unknown, marker: string, body: string) => {
      const prior = cleanText(existing);
      const next = `Last audited: ${args.date} | ${marker} | ${body}`;
      if (prior.includes(marker)) return prior;
      return prior ? `${prior}\n${next}` : next;
    };

    const findVehicle = async (seed: any) => {
      const aliases = new Set(
        [seed.businessId, seed.slug, ...(seed.aliases ?? [])].map((value) => normalize(value)).filter(Boolean),
      );
      const allVehicles = await ctx.db.query("oem_vehicles").collect();
      const scanned = allVehicles.find((row) => aliases.has(normalize(row.id)) || aliases.has(normalize(row.slug)));
      if (scanned) return scanned;
      for (const value of aliases) {
        const byId = await ctx.db
          .query("oem_vehicles")
          .withIndex("by_id_str", (q) => q.eq("id", value))
          .first();
        if (byId) return byId;
        const bySlug = await ctx.db
          .query("oem_vehicles")
          .withIndex("by_slug", (q) => q.eq("slug", value))
          .first();
        if (bySlug) return bySlug;
      }
      return null;
    };

    const familyResults: any[] = [];
    const variantResults: any[] = [];
    const vehicleIdsForMedia: string[] = [];

    for (const seed of args.families) {
      const existing = await findVehicle(seed);
      const privateBlurb = appendPrivateBlurb(
        existing?.private_blurb,
        "OEMV Lamborghini chassis backbone wave1",
        `platform_code=${seed.platformCode}; years=${seed.productionYears}; source-backed family row. ${seed.sourceNote} Sources: ${(seed.sourceUrls ?? []).join(" | ")}. Holds: exact fitment and wheel bridges require separate evidence.`,
      );
      const patch: any = {
        brand_id: args.brandId,
        id: seed.businessId,
        slug: seed.slug,
        vehicle_title: seed.title,
        model_name: seed.modelName,
        generation: seed.generation,
        body_type: seed.bodyType,
        platform: seed.platform,
        platform_code: seed.platformCode,
        drive_type: seed.driveType,
        segment: seed.segment,
        production_years: seed.productionYears,
        year_from: seed.yearFrom,
        year_to: seed.yearTo,
        is_visible: true,
        private_blurb: privateBlurb,
        updated_at: now,
      };

      let vehicleId;
      if (existing) {
        vehicleId = existing._id;
        await ctx.db.patch(vehicleId, patch);
      } else {
        vehicleId = await ctx.db.insert("oem_vehicles", { ...patch, created_at: now });
      }
      vehicleIdsForMedia.push(String(vehicleId));

      const existingBrandLink = await ctx.db
        .query("j_vehicle_brand")
        .withIndex("by_vehicle_brand", (q) => q.eq("vehicle_id", vehicleId).eq("brand_id", args.brandId))
        .first();
      if (!existingBrandLink) {
        await ctx.db.insert("j_vehicle_brand", {
          vehicle_id: vehicleId,
          brand_id: args.brandId,
          vehicle_title: seed.title,
          brand_title: brand.brand_title ?? "",
        });
      } else if (existingBrandLink.vehicle_title !== seed.title) {
        await ctx.db.patch(existingBrandLink._id, { vehicle_title: seed.title, brand_title: brand.brand_title ?? "" });
      }

      familyResults.push({
        action: existing ? "update_family" : "insert_family",
        seedBusinessId: seed.businessId,
        existingBusinessId: existing?.id ?? existing?.slug ?? null,
        vehicleId,
        title: seed.title,
        platformCode: seed.platformCode,
        variantsPlanned: (seed.variants ?? []).length,
        sourceUrls: seed.sourceUrls ?? [],
      });

      const siblingVariants = await ctx.db
        .query("oem_vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", vehicleId))
        .collect();

      for (const variant of seed.variants ?? []) {
        let existingVariant =
          (await ctx.db
            .query("oem_vehicle_variants")
            .withIndex("by_slug", (q) => q.eq("slug", variant.slug))
            .first()) ??
          siblingVariants.find((row) => normalize(row.variant_title) === normalize(variant.title)) ??
          null;

        const variantPrivateBlurb = appendPrivateBlurb(
          existingVariant?.private_blurb,
          "OEMV Lamborghini variant backbone wave1",
          `${seed.platformCode} child variant under ${seed.title}; years=${variant.yearFrom ?? "unknown"}-${variant.yearTo ?? "unknown"}; status=${variant.status}; ${variant.notes} Sources: ${(seed.sourceUrls ?? []).join(" | ")}.`,
        );
        const variantPatch: any = {
          vehicle_id: vehicleId,
          slug: variant.slug,
          variant_title: variant.title,
          trim_level: variant.trimLevel ?? variant.title,
          private_blurb: variantPrivateBlurb,
          year_from: variant.yearFrom,
          year_to: variant.yearTo,
          notes: variant.notes,
        };

        let variantId;
        if (existingVariant) {
          variantId = existingVariant._id;
          await ctx.db.patch(variantId, variantPatch);
        } else {
          variantId = await ctx.db.insert("oem_vehicle_variants", variantPatch);
        }

        const existingVariantBrand = await ctx.db
          .query("j_oem_vehicle_variant_brand")
          .withIndex("by_oem_vehicle_variant_brand", (q) =>
            q.eq("variant_id", variantId).eq("brand_id", args.brandId),
          )
          .first();
        if (!existingVariantBrand) {
          await ctx.db.insert("j_oem_vehicle_variant_brand", {
            variant_id: variantId,
            brand_id: args.brandId,
            variant_title: variant.title,
            brand_title: brand.brand_title ?? "",
          });
        } else if (existingVariantBrand.variant_title !== variant.title) {
          await ctx.db.patch(existingVariantBrand._id, {
            variant_title: variant.title,
            brand_title: brand.brand_title ?? "",
          });
        }

        variantResults.push({
          action: existingVariant ? "update_variant" : "insert_variant",
          familyBusinessId: seed.businessId,
          vehicleId,
          variantId,
          slug: variant.slug,
          title: variant.title,
          status: variant.status,
          years: [variant.yearFrom ?? null, variant.yearTo ?? null],
        });
      }
    }

    return { familyResults, variantResults, vehicleIdsForMedia };
  },
});

export const lamborghiniVehicleDuplicateCleanup = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const normalizeKey = (value: unknown) =>
      String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
    const appendNote = (existing: unknown, note: string) => {
      const prior = String(existing ?? "").trim();
      if (prior.includes("OEMV Lamborghini duplicate cleanup wave1")) return prior;
      const line = `Last audited: ${args.date} | OEMV Lamborghini duplicate cleanup wave1 | ${note}`;
      return prior ? `${prior}\n${line}` : line;
    };

    const pairs = [
      {
        oldId: "jn7e0c4kzzk1w7pq0vrkxjcsfh820082",
        newId: "jn7ae3nfskq6zvam5eh9dnkc5185ramq",
        title: "Lamborghini - L539 - Aventador",
      },
      {
        oldId: "jn7c22xz5pdmz77g7yk9jb364d821d7y",
        newId: "jn7azfzg4ejd18krkwmz17j42d85rjze",
        title: "Lamborghini - LB724 - Huracan",
      },
      {
        oldId: "jn7bhhzca9fsx6q19a7g4gv8g9821448",
        newId: "jn77j47z9wypba413bd6t7cp8n85s2kh",
        title: "Lamborghini - LB744 - Revuelto",
      },
      {
        oldId: "jn77th6w0zp1qeg6phkzvnz57x821m9d",
        newId: "jn73ans6h5fzwrqg0w0v0bvj9185r6n2",
        title: "Lamborghini - LB634 - Temerario",
      },
    ] as const;

    const vehicleJunctionTables = [
      "j_vehicle_engine",
      "j_vehicle_body_style",
      "j_vehicle_drive_type",
      "j_vehicle_market",
      "j_vehicle_bolt_pattern",
      "j_vehicle_center_bore",
      "j_vehicle_diameter",
      "j_vehicle_width",
      "j_vehicle_offset",
      "j_vehicle_tire_size",
      "j_vehicle_part_number",
      "j_vehicle_model_year",
      "j_wheel_vehicle",
    ];

    const results: any[] = [];

    for (const pair of pairs) {
      const oldVehicleId = pair.oldId as Id<"oem_vehicles">;
      const newVehicleId = pair.newId as Id<"oem_vehicles">;
      const oldVehicle = await ctx.db.get(oldVehicleId);
      const newVehicle = await ctx.db.get(newVehicleId);
      if (!oldVehicle || !newVehicle) {
        results.push({ ...pair, status: "missing_row" });
        continue;
      }

      const directPatch: any = {
        private_blurb: appendNote(
          newVehicle.private_blurb,
          `Merged stale duplicate shell ${pair.oldId} into canonical chassis-coded row ${pair.newId}; media/junction ownership moved where present.`,
        ),
        updated_at: now,
      };
      for (const field of ["good_pic_url", "bad_pic_url", "vehicle_image"]) {
        if (!newVehicle[field] && oldVehicle[field]) directPatch[field] = oldVehicle[field];
      }
      await ctx.db.patch(newVehicleId, directPatch);

      let movedImages = 0;
      const imageRows = await ctx.db
        .query("oem_vehicle_images")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", oldVehicleId))
        .collect();
      for (const row of imageRows.filter((row: any) => String(row.vehicle_id) === pair.oldId)) {
        await ctx.db.patch(row._id, { vehicle_id: newVehicleId });
        movedImages += 1;
      }

      let movedFiles = 0;
      const fileRows = await ctx.db
        .query("oem_file_storage")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", oldVehicleId))
        .collect();
      for (const row of fileRows.filter(
        (row: any) => String(row.vehicle_id) === pair.oldId || String(row.owner_id) === pair.oldId,
      )) {
        const patch: any = {};
        if (String((row as any).vehicle_id) === pair.oldId) patch.vehicle_id = newVehicleId;
        if (String((row as any).owner_id) === pair.oldId) patch.owner_id = newVehicleId;
        await ctx.db.patch(row._id, patch);
        movedFiles += 1;
      }

      let movedJunctions = 0;
      for (const table of vehicleJunctionTables) {
        try {
          const rows = await (ctx.db.query(table as any) as any)
            .withIndex("by_vehicle" as any, (q: any) => q.eq("vehicle_id", oldVehicleId))
            .collect();
          for (const row of rows) {
            await ctx.db.patch(row._id, {
              vehicle_id: newVehicleId,
              ...(Object.prototype.hasOwnProperty.call(row, "vehicle_title") ? { vehicle_title: pair.title } : {}),
            });
            movedJunctions += 1;
          }
        } catch {
          // Table is absent on some local schema revisions.
        }
      }

      const existingNewVariants = await ctx.db
        .query("oem_vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", newVehicleId))
        .collect();
      const existingVariantKeys = new Set(existingNewVariants.map((row) => normalizeKey(row.variant_title)));
      let movedVariants = 0;
      let deletedVariants = 0;
      const oldVariants = await ctx.db
        .query("oem_vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", oldVehicleId))
        .collect();
      for (const variant of oldVariants) {
        const key = normalizeKey(variant.variant_title);
        const keepCatchall = key === "all";
        const duplicate =
          existingVariantKeys.has(key) ||
          (pair.title.includes("Aventador") && key === "aventadorlp770svj");
        if (keepCatchall || !duplicate) {
          await ctx.db.patch(variant._id, { vehicle_id: newVehicleId });
          existingVariantKeys.add(key);
          movedVariants += 1;
          continue;
        }

        const brandLinks = await ctx.db
          .query("j_oem_vehicle_variant_brand")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect();
        for (const link of brandLinks) await ctx.db.delete(link._id);
        await ctx.db.delete(variant._id);
        deletedVariants += 1;
      }

      const brandLinks = await ctx.db
        .query("j_vehicle_brand")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", oldVehicleId))
        .collect();
      for (const link of brandLinks) await ctx.db.delete(link._id);
      await ctx.db.delete(oldVehicleId);

      results.push({
        ...pair,
        status: "merged",
        movedImages,
        movedFiles,
        movedJunctions,
        movedVariants,
        deletedVariants,
      });
    }

    return { results };
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
    text_vehicles: optionalString,
    style_number: optionalString,
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

export const wheelVariantsUpdate = mutation({
  args: {
    id: v.id("oem_wheel_variants"),
    wheel_id: v.optional(v.id("oem_wheels")),
    brand_id: v.optional(v.id("oem_brands")),
    slug: optionalString,
    variant_title: optionalString,
    private_blurb: optionalString,
    wheel_title: optionalString,
    weight: optionalString,
    spoke_count: optionalNumber,
    load_rating: optionalNumber,
    metal_type: optionalString,
    part_numbers: optionalString,
    hollander_number: optionalString,
    diameter: optionalString,
    width: optionalString,
    bolt_pattern: optionalString,
    center_bore: optionalString,
    offset: optionalString,
    finish: optionalString,
    notes: optionalString,
    good_pic_url: optionalString,
    bad_pic_url: optionalString,
    year_from: v.optional(v.number()),
    year_to: v.optional(v.number()),
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

export const syncWheelParentCoreSpecs = mutation({
  args: {
    wheelId: v.id("oem_wheels"),
    wheelTitle: v.string(),
    diameters: v.array(v.string()),
    widths: v.array(v.string()),
    boltPatterns: v.array(v.string()),
    centerBores: v.optional(v.array(v.string())),
    offsets: v.optional(v.array(v.string())),
    partNumbers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const cleanValues = (values: string[]) =>
      [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );

    const sync = async (
      refTable: any,
      refIndex: string,
      refField: string,
      linkTable: any,
      linkIndex: string,
      linkRefField: string,
      textField: string,
      values: string[]
    ) => {
      const existingLinks = await (ctx.db.query(linkTable) as any)
        .withIndex("by_wheel", (q: any) => q.eq("wheel_id", args.wheelId))
        .collect();
      for (const row of existingLinks) {
        await ctx.db.delete(row._id);
      }

      for (const value of cleanValues(values)) {
        let ref = await (ctx.db.query(refTable) as any)
          .withIndex(refIndex, (q: any) => q.eq(refField, value))
          .first();
        if (!ref) {
          const insertedId = await ctx.db.insert(refTable, { [refField]: value, created_at: now, updated_at: now });
          ref = await ctx.db.get(insertedId);
        }
        if (!ref) continue;
        await ctx.db.insert(linkTable, {
          wheel_id: args.wheelId,
          [linkRefField]: ref._id,
          wheel_title: args.wheelTitle,
          [textField]: value,
        });
      }
    };

    const diameters = cleanValues(args.diameters);
    const widths = cleanValues(args.widths);
    const boltPatterns = cleanValues(args.boltPatterns);
    const centerBores = args.centerBores === undefined ? null : cleanValues(args.centerBores);
    const offsets = args.offsets === undefined ? null : cleanValues(args.offsets);
    const partNumbers = cleanValues(args.partNumbers);

    await sync("oem_diameters", "by_diameter", "diameter", "j_wheel_diameter", "by_wheel_diameter", "diameter_id", "diameter", diameters);
    await sync("oem_widths", "by_width", "width", "j_wheel_width", "by_wheel_width", "width_id", "width", widths);
    await sync("oem_bolt_patterns", "by_bolt_pattern", "bolt_pattern", "j_wheel_bolt_pattern", "by_wheel_bolt_pattern", "bolt_pattern_id", "bolt_pattern", boltPatterns);
    if (centerBores) {
      await sync("oem_center_bores", "by_center_bore", "center_bore", "j_wheel_center_bore", "by_wheel_center_bore", "center_bore_id", "center_bore", centerBores);
    }
    if (offsets) {
      await sync("oem_offsets", "by_offset", "offset", "j_wheel_offset", "by_wheel_offset", "offset_id", "offset", offsets);
    }
    await sync("oem_part_numbers", "by_part_number", "part_number", "j_wheel_part_number", "by_wheel_part_number", "part_number_id", "part_number", partNumbers);

    await ctx.db.patch(args.wheelId, {
      text_diameters: diameters.join(", "),
      text_widths: widths.join(", "),
      text_bolt_patterns: boltPatterns.join(", "),
      ...(centerBores ? { text_center_bores: centerBores.join(", ") } : {}),
      ...(offsets ? { text_offsets: offsets.join(", ") } : {}),
      part_numbers: partNumbers.join(", "),
      updated_at: now,
    });

    return {
      wheelId: args.wheelId,
      diameters: diameters.length,
      widths: widths.length,
      boltPatterns: boltPatterns.length,
      centerBores: centerBores?.length ?? null,
      offsets: offsets?.length ?? null,
      partNumbers: partNumbers.length,
    };
  },
});

export const syncWheelVariantCoreSpecs = mutation({
  args: {
    variantId: v.id("oem_wheel_variants"),
    variantTitle: v.string(),
    diameters: v.optional(v.array(v.string())),
    widths: v.optional(v.array(v.string())),
    boltPatterns: v.optional(v.array(v.string())),
    centerBores: v.optional(v.array(v.string())),
    offsets: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
    partNumbers: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const cleanValues = (values: string[] | undefined) =>
      values === undefined
        ? null
        : [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))].sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
          );

    const sync = async (
      refTable: any,
      refIndex: string,
      refField: string,
      linkTable: any,
      linkRefField: string,
      textField: string,
      values: string[] | null
    ) => {
      if (values === null) return null;
      const existingLinks = await (ctx.db.query(linkTable) as any)
        .withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", args.variantId))
        .collect();
      for (const row of existingLinks) {
        await ctx.db.delete(row._id);
      }

      for (const value of values) {
        let ref = await (ctx.db.query(refTable) as any)
          .withIndex(refIndex, (q: any) => q.eq(refField, value))
          .first();
        if (!ref) {
          const insertedId = await ctx.db.insert(refTable, { [refField]: value, created_at: now, updated_at: now });
          ref = await ctx.db.get(insertedId);
        }
        if (!ref) continue;
        await ctx.db.insert(linkTable, {
          variant_id: args.variantId,
          [linkRefField]: ref._id,
          variant_title: args.variantTitle,
          [textField]: value,
        });
      }
      return values.length;
    };

    const diameters = cleanValues(args.diameters);
    const widths = cleanValues(args.widths);
    const boltPatterns = cleanValues(args.boltPatterns);
    const centerBores = cleanValues(args.centerBores);
    const offsets = cleanValues(args.offsets);
    const colors = cleanValues(args.colors);
    const materials = cleanValues(args.materials);
    const partNumbers = cleanValues(args.partNumbers);

    const counts = {
      diameters: await sync("oem_diameters", "by_diameter", "diameter", "j_oem_wheel_variant_diameter", "diameter_id", "diameter", diameters),
      widths: await sync("oem_widths", "by_width", "width", "j_oem_wheel_variant_width", "width_id", "width", widths),
      boltPatterns: await sync("oem_bolt_patterns", "by_bolt_pattern", "bolt_pattern", "j_oem_wheel_variant_bolt_pattern", "bolt_pattern_id", "bolt_pattern", boltPatterns),
      centerBores: await sync("oem_center_bores", "by_center_bore", "center_bore", "j_oem_wheel_variant_center_bore", "center_bore_id", "center_bore", centerBores),
      offsets: await sync("oem_offsets", "by_offset", "offset", "j_oem_wheel_variant_offset", "offset_id", "offset", offsets),
      colors: await sync("oem_colors", "by_color", "color", "j_oem_wheel_variant_color", "color_id", "color", colors),
      materials: await sync("oem_materials", "by_material", "material", "j_oem_wheel_variant_material", "material_id", "material", materials),
      partNumbers: await sync("oem_part_numbers", "by_part_number", "part_number", "j_oem_wheel_variant_part_number", "part_number_id", "part_number", partNumbers),
    };

    return { variantId: args.variantId, ...counts };
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
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
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
      case "vehicle_variant":
      case "wheel_variant":
        await ctx.db.patch(args.id, { private_blurb, updated_at });
        return args.id;
      default:
        throw new Error("Unsupported item type.");
    }
  },
});

type CollectionAssetImageType = "brand" | "good" | "bad" | "source";

function fieldToCollectionAssetImageType(field: "brand_image_url" | "good_pic_url" | "bad_pic_url"): CollectionAssetImageType {
  if (field === "brand_image_url") return "brand";
  if (field === "good_pic_url") return "good";
  return "bad";
}

function imageTypeToCollectionAssetField(imageType: CollectionAssetImageType) {
  if (imageType === "brand") return "brand_image_url" as const;
  if (imageType === "good") return "good_pic_url" as const;
  if (imageType === "source") return null;
  return "bad_pic_url" as const;
}

function normalizeAssetUrl(value: unknown) {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function compareAssetImageRows(
  a: { is_primary?: boolean; sort_order?: number; created_at?: string },
  b: { is_primary?: boolean; sort_order?: number; created_at?: string },
) {
  const primaryCompare = Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary));
  if (primaryCompare !== 0) return primaryCompare;

  const aSort = typeof a.sort_order === "number" ? a.sort_order : Number.MAX_SAFE_INTEGER;
  const bSort = typeof b.sort_order === "number" ? b.sort_order : Number.MAX_SAFE_INTEGER;
  if (aSort !== bSort) return aSort - bSort;

  const aCreatedAt = Date.parse(a.created_at ?? "") || 0;
  const bCreatedAt = Date.parse(b.created_at ?? "") || 0;
  return bCreatedAt - aCreatedAt;
}

async function patchCollectionAssetField(
  ctx: any,
  itemType: string,
  id: any,
  field: "brand_image_url" | "good_pic_url" | "bad_pic_url",
  mediaUrl: string,
  updated_at: string,
) {
  switch (itemType) {
    case "brand":
      if (!["brand_image_url", "good_pic_url", "bad_pic_url"].includes(field)) {
        throw new Error("Unsupported brand asset field.");
      }
      await ctx.db.patch(id, { [field]: mediaUrl, updated_at });
      return;
    case "vehicle":
    case "wheel":
    case "engine":
    case "color":
    case "vehicle_variant":
    case "wheel_variant":
      if (!["good_pic_url", "bad_pic_url"].includes(field)) {
        throw new Error("Unsupported asset field.");
      }
      await ctx.db.patch(id, { [field]: mediaUrl, updated_at });
      return;
    default:
      throw new Error("Unsupported item type.");
  }
}

async function getCollectionAssetRows(ctx: any, itemType: string, id: any, imageType: CollectionAssetImageType) {
  switch (itemType) {
    case "brand":
      return await ctx.db
        .query("oem_brand_images")
        .withIndex("by_brand_type", (q: any) => q.eq("brand_id", id).eq("image_type", imageType))
        .collect();
    case "vehicle":
      return await ctx.db
        .query("oem_vehicle_images")
        .withIndex("by_vehicle_type", (q: any) => q.eq("vehicle_id", id).eq("image_type", imageType))
        .collect();
    case "wheel":
      return await ctx.db
        .query("oem_wheel_images")
        .withIndex("by_wheel_type", (q: any) => q.eq("wheel_id", id).eq("image_type", imageType))
        .collect();
    case "wheel_variant":
      return await ctx.db
        .query("oem_wheel_variant_images")
        .withIndex("by_variant_type", (q: any) => q.eq("variant_id", id).eq("image_type", imageType))
        .collect();
    default:
      return [];
  }
}

function sanitizeRenamedAssetFileName(rawName: string, currentName: string) {
  const currentExtension = currentName.match(/\.[a-z0-9]{1,12}$/i)?.[0] ?? "";
  const withoutDirectories = rawName
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .replace(/[.-]+$/g, "");

  if (!withoutDirectories) {
    throw new Error("File name cannot be empty.");
  }

  return /\.[a-z0-9]{1,12}$/i.test(withoutDirectories) || !currentExtension
    ? withoutDirectories
    : `${withoutDirectories}${currentExtension}`;
}

function mediaPathFromUrl(mediaUrl: string) {
  const marker = "/api/media/";
  const markerIndex = mediaUrl.indexOf(marker);
  if (markerIndex < 0) return null;

  const withoutQuery = mediaUrl.slice(markerIndex + marker.length).split(/[?#]/, 1)[0] ?? "";
  try {
    return normalizePath(decodeURIComponent(withoutQuery));
  } catch {
    return normalizePath(withoutQuery);
  }
}

async function resolveCollectionAssetFileRow(
  ctx: any,
  args: {
    fileStorageId?: Id<"oem_file_storage">;
    storageId?: string;
    mediaUrl: string;
  },
  target?: any,
) {
  if (args.fileStorageId) {
    const file = await ctx.db.get(args.fileStorageId);
    if (file) return file;
  }

  if (target?.file_storage_id) {
    const file = await ctx.db.get(target.file_storage_id);
    if (file) return file;
  }

  const storageId = args.storageId ?? target?.storage_id;
  if (storageId) {
    const file = await ctx.db
      .query("oem_file_storage")
      .withIndex("by_storage_id", (q: any) => q.eq("storageId", storageId))
      .first();
    if (file) return file;
  }

  const mediaPath = mediaPathFromUrl(args.mediaUrl);
  if (!mediaPath) return null;

  return await ctx.db
    .query("oem_file_storage")
    .withIndex("by_path", (q: any) => q.eq("path", mediaPath))
    .first();
}

async function insertCollectionAssetRow(
  ctx: any,
  itemType: string,
  id: any,
  imageType: CollectionAssetImageType,
  mediaUrl: string,
  storageId: string | undefined,
  fileStorageId: string | undefined,
  isPrimary: boolean,
) {
  const now = new Date().toISOString();
  const base = {
    storage_id: storageId,
    file_storage_id: fileStorageId,
    url: mediaUrl,
    image_type: imageType,
    role: imageType,
    visibility: "public",
    sort_order: 0,
    is_primary: isPrimary,
    created_at: now,
  };

  switch (itemType) {
    case "brand":
      return await ctx.db.insert("oem_brand_images", { brand_id: id, ...base });
    case "vehicle":
      return await ctx.db.insert("oem_vehicle_images", { vehicle_id: id, ...base });
    case "wheel":
      return await ctx.db.insert("oem_wheel_images", { wheel_id: id, ...base });
    case "wheel_variant":
      return await ctx.db.insert("oem_wheel_variant_images", { variant_id: id, ...base });
    default:
      return null;
  }
}

async function selectCollectionAssetRow(
  ctx: any,
  itemType: string,
  id: any,
  imageType: CollectionAssetImageType,
  args: {
    imageId?: string;
    mediaUrl: string;
    storageId?: string;
    fileStorageId?: string;
  },
) {
  const rows = await getCollectionAssetRows(ctx, itemType, id, imageType);
  let selected =
    rows.find((row: any) => String(row._id) === args.imageId) ??
    rows.find((row: any) => normalizeAssetUrl(row.url) === args.mediaUrl);

  for (const row of rows) {
    if (selected && row._id === selected._id) continue;
    if (row.is_primary) await ctx.db.patch(row._id, { is_primary: false });
  }

  if (selected) {
    await ctx.db.patch(selected._id, {
      url: args.mediaUrl,
      storage_id: args.storageId ?? selected.storage_id,
      file_storage_id: args.fileStorageId ?? selected.file_storage_id,
      image_type: imageType,
      role: imageType,
      visibility: selected.visibility ?? "public",
      sort_order: 0,
      is_primary: true,
    });
    return selected._id;
  }

  return await insertCollectionAssetRow(
    ctx,
    itemType,
    id,
    imageType,
    args.mediaUrl,
    args.storageId,
    args.fileStorageId,
    true,
  );
}

export const upsertWheelImageRow = mutation({
  args: {
    wheelId: v.id("oem_wheels"),
    imageType: v.optional(v.string()),
    url: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
    role: v.optional(v.string()),
    visibility: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isPrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const normalizedType = String(args.imageType ?? args.role ?? "good").trim().toLowerCase();
    const imageType: CollectionAssetImageType =
      normalizedType === "bad" ? "bad" : normalizedType === "source" ? "source" : "good";
    const mediaUrl = normalizeAssetUrl(args.url);
    if (!mediaUrl) throw new Error("Wheel image URL cannot be empty.");

    const field = imageTypeToCollectionAssetField(imageType);
    if (field) {
      await patchCollectionAssetField(ctx, "wheel", args.wheelId, field, mediaUrl, new Date().toISOString());
    }

    return await selectCollectionAssetRow(ctx, "wheel", args.wheelId, imageType, {
      mediaUrl,
      storageId: args.storageId,
      fileStorageId: args.fileStorageId,
    });
  },
});

export const upsertCollectionSourceImageRow = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_wheel_variants"),
    ),
    mediaUrl: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Source image URL cannot be empty.");

    const existingRows = await getCollectionAssetRows(ctx, args.itemType, args.id, "source");
    const existing =
      (args.fileStorageId
        ? existingRows.find((row: any) => String(row.file_storage_id ?? "") === String(args.fileStorageId))
        : null) ??
      (args.storageId ? existingRows.find((row: any) => String(row.storage_id ?? "") === args.storageId) : null) ??
      existingRows.find((row: any) => normalizeAssetUrl(row.url) === mediaUrl) ??
      null;

    const patch = {
      url: mediaUrl,
      storage_id: args.storageId ?? existing?.storage_id,
      file_storage_id: args.fileStorageId ?? existing?.file_storage_id,
      image_type: "source",
      role: "source",
      visibility: "public",
      sort_order:
        args.sortOrder ??
        (typeof existing?.sort_order === "number"
          ? existing.sort_order
          : existingRows.reduce((max: number, row: any) => Math.max(max, row.sort_order ?? -1), -1) + 1),
      is_primary: false,
      created_at: existing?.created_at ?? new Date().toISOString(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await insertCollectionAssetRow(
      ctx,
      args.itemType,
      args.id,
      "source",
      mediaUrl,
      args.storageId,
      args.fileStorageId,
      false,
    );
  },
});

export const appendCollectionPrivateBlurbNote = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_wheel_variants"),
    ),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedNote = args.note.trim();
    if (!trimmedNote) return args.id;

    const current = await ctx.db.get(args.id as any);
    if (!current) throw new Error(`Item not found: ${args.itemType} ${args.id}`);
    const existing = String((current as any).private_blurb ?? "").trim();
    const private_blurb = existing
      ? existing.includes(trimmedNote)
        ? existing
        : `${existing} | ${trimmedNote}`
      : trimmedNote;

    await ctx.db.patch(args.id as any, {
      private_blurb,
      updated_at: new Date().toISOString(),
    });
    return args.id;
  },
});

export const clearWheelGoodPicByUrl = mutation({
  args: {
    wheelId: v.id("oem_wheels"),
    mediaUrl: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wheel = await ctx.db.get(args.wheelId);
    if (!wheel) throw new Error(`Wheel not found: ${args.wheelId}`);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("mediaUrl is required.");

    const rows = await ctx.db
      .query("oem_wheel_images")
      .withIndex("by_wheel_type", (q: any) => q.eq("wheel_id", args.wheelId).eq("image_type", "good"))
      .collect();
    let deletedRows = 0;
    for (const row of rows) {
      if (normalizeAssetUrl(row.url) === mediaUrl) {
        await ctx.db.delete(row._id);
        deletedRows += 1;
      }
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (normalizeAssetUrl(wheel.good_pic_url) === mediaUrl) patch.good_pic_url = "";
    if (args.note?.trim()) {
      const existing = String(wheel.private_blurb ?? "").trim();
      patch.private_blurb = existing && !existing.includes(args.note.trim()) ? `${existing} | ${args.note.trim()}` : existing || args.note.trim();
    }
    await ctx.db.patch(args.wheelId, patch);

    return {
      wheelId: args.wheelId,
      clearedDirectGoodPic: Object.prototype.hasOwnProperty.call(patch, "good_pic_url"),
      deletedRows,
    };
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
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    field: v.union(
      v.literal("brand_image_url"),
      v.literal("good_pic_url"),
      v.literal("bad_pic_url"),
    ),
    mediaUrl: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const updated_at = new Date().toISOString();
    const imageType = fieldToCollectionAssetImageType(args.field);
    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Asset URL cannot be empty.");

    await patchCollectionAssetField(ctx, args.itemType, args.id, args.field, mediaUrl, updated_at);
    await selectCollectionAssetRow(ctx, args.itemType, args.id, imageType, {
      mediaUrl,
      storageId: args.storageId,
      fileStorageId: args.fileStorageId,
    });

    return args.id;
  },
});

export const adminCollectionItemAssetImageAdd = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_wheel_variants"),
    ),
    imageType: v.literal("source"),
    mediaUrl: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Asset URL cannot be empty.");

    const imageId = await insertCollectionAssetRow(
      ctx,
      args.itemType,
      args.id,
      args.imageType,
      mediaUrl,
      args.storageId,
      args.fileStorageId,
      false,
    );

    if (!imageId) throw new Error("Source images are not supported for this item type.");

    return { imageId, mediaUrl };
  },
});

export const adminCollectionItemAssetImageSelect = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    imageType: v.union(v.literal("brand"), v.literal("good"), v.literal("bad")),
    imageId: v.optional(v.string()),
    mediaUrl: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Asset URL cannot be empty.");

    const updated_at = new Date().toISOString();
    const field = imageTypeToCollectionAssetField(args.imageType);
    if (!field) throw new Error("Source images cannot be selected as a primary asset.");
    await patchCollectionAssetField(ctx, args.itemType, args.id, field, mediaUrl, updated_at);
    const imageId = await selectCollectionAssetRow(ctx, args.itemType, args.id, args.imageType, {
      imageId: args.imageId,
      mediaUrl,
      storageId: args.storageId,
      fileStorageId: args.fileStorageId,
    });

    return { imageId, mediaUrl };
  },
});

export const adminCollectionItemAssetImageDelete = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    imageType: v.union(v.literal("brand"), v.literal("good"), v.literal("bad"), v.literal("source")),
    imageId: v.optional(v.string()),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Asset URL cannot be empty.");

    const updated_at = new Date().toISOString();
    const rows = await getCollectionAssetRows(ctx, args.itemType, args.id, args.imageType);
    const target =
      rows.find((row: any) => String(row._id) === args.imageId) ??
      rows.find((row: any) => normalizeAssetUrl(row.url) === mediaUrl);
    const wasPrimary = Boolean(target?.is_primary) || target == null;

    if (target) await ctx.db.delete(target._id);

    const field = imageTypeToCollectionAssetField(args.imageType);
    if (!field) {
      return { deleted: Boolean(target), nextUrl: null };
    }

    if (!wasPrimary) {
      return { deleted: Boolean(target), nextUrl: null };
    }

    const remainingRows = (await getCollectionAssetRows(ctx, args.itemType, args.id, args.imageType))
      .filter((row: any) => normalizeAssetUrl(row.url))
      .sort(compareAssetImageRows);
    const next = remainingRows[0] ?? null;

    for (const row of remainingRows) {
      await ctx.db.patch(row._id, { is_primary: next ? row._id === next._id : false });
    }

    const nextUrl = normalizeAssetUrl(next?.url) ?? "";
    await patchCollectionAssetField(ctx, args.itemType, args.id, field, nextUrl, updated_at);

    return { deleted: Boolean(target), nextUrl: nextUrl || null };
  },
});

export const adminCollectionItemAssetImageRename = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    imageType: v.union(v.literal("brand"), v.literal("good"), v.literal("bad"), v.literal("source")),
    imageId: v.optional(v.string()),
    mediaUrl: v.string(),
    storageId: v.optional(v.string()),
    fileStorageId: v.optional(v.id("oem_file_storage")),
    newFileName: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Asset URL cannot be empty.");

    const rows = await getCollectionAssetRows(ctx, args.itemType, args.id, args.imageType);
    const target =
      rows.find((row: any) => String(row._id) === args.imageId) ??
      rows.find((row: any) => normalizeAssetUrl(row.url) === mediaUrl) ??
      null;

    const file = await resolveCollectionAssetFileRow(ctx, { ...args, mediaUrl }, target);
    if (!file) {
      throw new Error("This asset is not backed by a stored file, so it cannot be renamed here.");
    }

    const storageId = file.storageId ?? args.storageId ?? target?.storage_id;
    if (!storageId) {
      throw new Error("Stored file is missing its storage id.");
    }

    const metadata = getResolvedNodeMetadata(file);
    const nextName = sanitizeRenamedAssetFileName(args.newFileName, metadata.name);
    if (nextName === metadata.name) {
      return { mediaUrl, fileName: metadata.name, renamed: false };
    }

    const nextRelativePath = metadata.parentPath ? `${metadata.parentPath}/${nextName}` : nextName;
    const nextPath = buildStoragePath(metadata.namespace, nextRelativePath);
    const existingDestination = await ctx.db
      .query("oem_file_storage")
      .withIndex("by_path", (q: any) => q.eq("path", nextPath))
      .first();
    if (existingDestination && existingDestination._id !== file._id) {
      throw new Error("A file already exists with that name.");
    }

    await ctx.db.patch(file._id, {
      path: nextPath,
      namespace: metadata.namespace,
      relative_path: nextRelativePath,
      name: nextName,
      parent_path: metadata.parentPath,
      node_type: "file",
    });

    const nextMediaUrl = buildMediaUrl(nextPath, await ctx.storage.getUrl(storageId));
    if (!nextMediaUrl) throw new Error("Failed to build the renamed asset URL.");

    if (target) {
      await ctx.db.patch(target._id, {
        url: nextMediaUrl,
        storage_id: storageId,
        file_storage_id: file._id,
      });
    }

    await refreshLinkedUrlsForStorageId(ctx, storageId, nextMediaUrl);

    const directField = imageTypeToCollectionAssetField(args.imageType);
    if (directField) {
      const currentItem = await ctx.db.get(args.id as any);
      if (normalizeAssetUrl((currentItem as any)?.[directField]) === mediaUrl) {
        await patchCollectionAssetField(ctx, args.itemType, args.id, directField, nextMediaUrl, new Date().toISOString());
      }
    }

    return { mediaUrl: nextMediaUrl, fileName: nextName, renamed: true };
  },
});

export const adminCollectionItemGoodPicDemoteToBad = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const mediaUrl = normalizeAssetUrl(args.mediaUrl);
    if (!mediaUrl) throw new Error("Good pic URL cannot be empty.");

    const updated_at = new Date().toISOString();
    const goodRows = await getCollectionAssetRows(ctx, args.itemType, args.id, "good");
    const badRows = await getCollectionAssetRows(ctx, args.itemType, args.id, "bad");
    const existingBad = badRows.find((row: any) => normalizeAssetUrl(row.url) === mediaUrl);
    const goodRow =
      goodRows.find((row: any) => normalizeAssetUrl(row.url) === mediaUrl) ??
      goodRows.find((row: any) => row.is_primary);

    for (const row of badRows) {
      if (existingBad && row._id === existingBad._id) continue;
      if (row.is_primary) await ctx.db.patch(row._id, { is_primary: false });
    }

    if (existingBad) {
      await ctx.db.patch(existingBad._id, {
        image_type: "bad",
        role: "bad",
        visibility: existingBad.visibility ?? "public",
        sort_order: 0,
        is_primary: true,
      });
      if (goodRow) await ctx.db.delete(goodRow._id);
    } else if (goodRow) {
      await ctx.db.patch(goodRow._id, {
        image_type: "bad",
        role: "bad",
        visibility: goodRow.visibility ?? "public",
        sort_order: 0,
        is_primary: true,
      });
    } else {
      await insertCollectionAssetRow(ctx, args.itemType, args.id, "bad", mediaUrl, undefined, undefined, true);
    }

    for (const row of goodRows) {
      if (goodRow && row._id === goodRow._id) continue;
      if (row.is_primary) await ctx.db.patch(row._id, { is_primary: false });
    }

    await patchCollectionAssetField(ctx, args.itemType, args.id, "good_pic_url", "", updated_at);
    await patchCollectionAssetField(ctx, args.itemType, args.id, "bad_pic_url", mediaUrl, updated_at);

    return { mediaUrl };
  },
});

export const adminCollectionItemAssetUrlClear = mutation({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
    field: v.union(
      v.literal("brand_image_url"),
      v.literal("good_pic_url"),
      v.literal("bad_pic_url"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const updated_at = new Date().toISOString();
    const imageType =
      args.field === "brand_image_url"
        ? "brand"
        : args.field === "good_pic_url"
          ? "good"
          : "bad";

    switch (args.itemType) {
      case "brand": {
        if (!["brand_image_url", "good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported brand asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: "", updated_at });
        const rows = await ctx.db
          .query("oem_brand_images")
          .withIndex("by_brand_type", (q) => q.eq("brand_id", args.id as any).eq("image_type", imageType))
          .collect();
        for (const row of rows) await ctx.db.delete(row._id);
        return { cleared: rows.length + 1 };
      }
      case "vehicle": {
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported vehicle asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: "", updated_at });
        const rows = await ctx.db
          .query("oem_vehicle_images")
          .withIndex("by_vehicle_type", (q) => q.eq("vehicle_id", args.id as any).eq("image_type", imageType))
          .collect();
        for (const row of rows) await ctx.db.delete(row._id);
        return { cleared: rows.length + 1 };
      }
      case "wheel": {
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported wheel asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: "", updated_at });
        const rows = await ctx.db
          .query("oem_wheel_images")
          .withIndex("by_wheel_type", (q) => q.eq("wheel_id", args.id as any).eq("image_type", imageType))
          .collect();
        for (const row of rows) await ctx.db.delete(row._id);
        return { cleared: rows.length + 1 };
      }
      case "wheel_variant": {
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported wheel variant asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: "", updated_at });
        const rows = await ctx.db
          .query("oem_wheel_variant_images")
          .withIndex("by_variant_type", (q) => q.eq("variant_id", args.id as any).eq("image_type", imageType))
          .collect();
        for (const row of rows) await ctx.db.delete(row._id);
        return { cleared: rows.length + 1 };
      }
      case "engine":
      case "color":
      case "vehicle_variant":
        if (!["good_pic_url", "bad_pic_url"].includes(args.field)) {
          throw new Error("Unsupported asset field.");
        }
        await ctx.db.patch(args.id, { [args.field]: "", updated_at });
        return { cleared: 1 };
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

export const wheelVehicleLinkMirrorRepair = mutation({
  args: {
    link_id: v.id("j_wheel_vehicle"),
    delete_if_orphan: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.link_id);
    if (!link) return { linkId: args.link_id, missingLink: true, deleted: false, updated: false };

    const [wheel, vehicle] = await Promise.all([
      ctx.db.get(link.wheel_id),
      ctx.db.get(link.vehicle_id),
    ]);

    if (!wheel || !vehicle) {
      if (args.delete_if_orphan) {
        await ctx.db.delete(link._id);
        return {
          linkId: link._id,
          missingWheel: !wheel,
          missingVehicle: !vehicle,
          deleted: true,
          updated: false,
        };
      }
      return {
        linkId: link._id,
        missingWheel: !wheel,
        missingVehicle: !vehicle,
        deleted: false,
        updated: false,
      };
    }

    const next = {
      wheel_title: wheel.wheel_title ?? "",
      vehicle_title: vehicle.vehicle_title ?? "",
    };
    const needsPatch = link.wheel_title !== next.wheel_title || link.vehicle_title !== next.vehicle_title;
    if (needsPatch) await ctx.db.patch(link._id, next);

    return {
      linkId: link._id,
      deleted: false,
      updated: needsPatch,
      before: {
        wheel_title: link.wheel_title,
        vehicle_title: link.vehicle_title,
      },
      after: next,
    };
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

export const vehicleVariantCommentInsert = mutation({
  args: {
    vehicleVariantId: v.id("oem_vehicle_variants"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("vehicle_variant_comments", {
      vehicle_variant_id: args.vehicleVariantId,
      user_id: args.userId,
      user_name: args.userName ?? undefined,
      comment_text: args.comment_text,
      created_at: now,
      updated_at: now,
    });
  },
});

export const wheelVariantCommentInsert = mutation({
  args: {
    wheelVariantId: v.id("oem_wheel_variants"),
    userId: v.string(),
    userName: optionalString,
    comment_text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("wheel_variant_comments", {
      wheel_variant_id: args.wheelVariantId,
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
