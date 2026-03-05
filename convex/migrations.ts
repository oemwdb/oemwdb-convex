/**
 * One-time migration mutations for backfilling and data fixes.
 * Run via script (e.g. scripts/backfill-slugs.ts) using Convex HTTP API.
 */

import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal: patch a wheel's image URL field after storing the image in Convex storage.
 * Called from imageMigrations:migrateWheelImageFromUrl action.
 */
export const patchWheelImageUrl = internalMutation({
  args: {
    wheelId: v.id("oem_wheels"),
    field: v.string(),
    convexUrl: v.string(),
    imageSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, string> = { [args.field]: args.convexUrl };
    if (args.imageSource != null) patch.image_source = args.imageSource;
    await ctx.db.patch(args.wheelId, patch);
  },
});

const workshopRowValidator = v.object({
  source_id: v.optional(v.string()),
  title: v.optional(v.string()),
  brand: v.optional(v.string()),
  status: v.optional(v.string()),
  imported_at: v.optional(v.string()),
  data: v.string(),
});

/**
 * Insert one row into a workshop staging table. Used by import-csvs-to-workshop.ts.
 * Uses dynamic table name so all ws_* tables are supported without listing them.
 */
export const insertWorkshopRow = mutation({
  args: {
    table: v.string(),
    row: workshopRowValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert(args.table as any, args.row);
  },
});

/**
 * Backfill slug on oem_brands where slug is missing. Sets slug = id.
 * Returns count of documents updated.
 */
export const backfillBrandSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_brands").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

export const backfillVehicleSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_vehicles").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

export const backfillWheelSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_wheels").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

export const backfillEngineSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_engines").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const idVal = (doc as { id?: string }).id;
      const codeVal = doc.engine_code;
      const value =
        idVal != null && String(idVal).trim() !== ""
          ? String(idVal).trim()
          : codeVal != null && String(codeVal).trim() !== ""
            ? String(codeVal).trim()
            : null;
      if (value == null) continue;
      await ctx.db.patch(doc._id, { slug: value });
      updated += 1;
    }
    return { updated };
  },
});

// =============================================================================
// GET-OR-CREATE REFERENCE TABLES (for migrations / imports)
// =============================================================================

export const getOrCreateDiameter = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_diameters")
      .withIndex("by_diameter", (q) => q.eq("diameter", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_diameters", { diameter: args.value });
  },
});

export const getOrCreateWidth = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_widths")
      .withIndex("by_width", (q) => q.eq("width", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_widths", { width: args.value });
  },
});

export const getOrCreateOffset = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_offsets")
      .withIndex("by_offset", (q) => q.eq("offset", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_offsets", { offset: args.value });
  },
});

export const getOrCreateBoltPattern = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_bolt_patterns")
      .withIndex("by_bolt_pattern", (q) => q.eq("bolt_pattern", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_bolt_patterns", { bolt_pattern: args.value });
  },
});

export const getOrCreateColor = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_colors")
      .withIndex("by_color", (q) => q.eq("color", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_colors", { color: args.value });
  },
});

export const getOrCreatePartNumber = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_part_numbers")
      .withIndex("by_part_number", (q) => q.eq("part_number", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_part_numbers", { part_number: args.value });
  },
});

export const getOrCreateCenterBore = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oem_center_bores")
      .withIndex("by_center_bore", (q) => q.eq("center_bore", args.value))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("oem_center_bores", { center_bore: args.value });
  },
});

// =============================================================================
// PROMOTE WHEEL VARIANT (workshop → production)
// =============================================================================

export const promoteWheelVariant = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    wheel_title: v.string(),
    slug: v.string(),
    variant_title: v.optional(v.string()),
    part_number: v.optional(v.string()),
    diameter_id: v.optional(v.id("oem_diameters")),
    diameter_value: v.optional(v.string()),
    width_id: v.optional(v.id("oem_widths")),
    width_value: v.optional(v.string()),
    offset_id: v.optional(v.id("oem_offsets")),
    offset_value: v.optional(v.string()),
    bolt_pattern_id: v.optional(v.id("oem_bolt_patterns")),
    bolt_pattern_value: v.optional(v.string()),
    center_bore_id: v.optional(v.id("oem_center_bores")),
    center_bore_value: v.optional(v.string()),
    color_id: v.optional(v.id("oem_colors")),
    color_value: v.optional(v.string()),
    part_number_id: v.optional(v.id("oem_part_numbers")),
  },
  handler: async (ctx, args) => {
    const variantTitle = args.variant_title ?? args.slug;
    const variantId = await ctx.db.insert("wheel_variants", {
      wheel_id: args.wheel_id,
      slug: args.slug,
      variant_title: args.variant_title,
    });

    if (args.diameter_id) {
      await ctx.db.insert("j_wheel_variant_diameter", {
        variant_id: variantId,
        diameter_id: args.diameter_id,
        variant_title: variantTitle,
        diameter: args.diameter_value ?? "",
      });
      const existingDiameter = await ctx.db
        .query("j_wheel_diameter")
        .withIndex("by_wheel_diameter", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("diameter_id", args.diameter_id)
        )
        .first();
      if (!existingDiameter) {
        await ctx.db.insert("j_wheel_diameter", {
          wheel_id: args.wheel_id,
          diameter_id: args.diameter_id,
          wheel_title: args.wheel_title,
          diameter: args.diameter_value ?? "",
        });
      }
    }
    if (args.width_id) {
      await ctx.db.insert("j_wheel_variant_width", {
        variant_id: variantId,
        width_id: args.width_id,
        variant_title: variantTitle,
        width: args.width_value ?? "",
      });
      const existingWidth = await ctx.db
        .query("j_wheel_width")
        .withIndex("by_wheel_width", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("width_id", args.width_id)
        )
        .first();
      if (!existingWidth) {
        await ctx.db.insert("j_wheel_width", {
          wheel_id: args.wheel_id,
          width_id: args.width_id,
          wheel_title: args.wheel_title,
          width: args.width_value ?? "",
        });
      }
    }
    if (args.offset_id) {
      await ctx.db.insert("j_wheel_variant_offset", {
        variant_id: variantId,
        offset_id: args.offset_id,
        variant_title: variantTitle,
        offset: args.offset_value ?? "",
      });
      const existingOffset = await ctx.db
        .query("j_wheel_offset")
        .withIndex("by_wheel_offset", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("offset_id", args.offset_id)
        )
        .first();
      if (!existingOffset) {
        await ctx.db.insert("j_wheel_offset", {
          wheel_id: args.wheel_id,
          offset_id: args.offset_id,
          wheel_title: args.wheel_title,
          offset: args.offset_value ?? "",
        });
      }
    }
    if (args.bolt_pattern_id) {
      await ctx.db.insert("j_wheel_variant_bolt_pattern", {
        variant_id: variantId,
        bolt_pattern_id: args.bolt_pattern_id,
        variant_title: variantTitle,
        bolt_pattern: args.bolt_pattern_value ?? "",
      });
      const existingBp = await ctx.db
        .query("j_wheel_bolt_pattern")
        .withIndex("by_wheel_bolt_pattern", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("bolt_pattern_id", args.bolt_pattern_id)
        )
        .first();
      if (!existingBp) {
        await ctx.db.insert("j_wheel_bolt_pattern", {
          wheel_id: args.wheel_id,
          bolt_pattern_id: args.bolt_pattern_id,
          wheel_title: args.wheel_title,
          bolt_pattern: args.bolt_pattern_value ?? "",
        });
      }
    }
    if (args.center_bore_id) {
      await ctx.db.insert("j_wheel_variant_center_bore", {
        variant_id: variantId,
        center_bore_id: args.center_bore_id,
        variant_title: variantTitle,
        center_bore: args.center_bore_value ?? "",
      });
      const existingCb = await ctx.db
        .query("j_wheel_center_bore")
        .withIndex("by_wheel_center_bore", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("center_bore_id", args.center_bore_id)
        )
        .first();
      if (!existingCb) {
        await ctx.db.insert("j_wheel_center_bore", {
          wheel_id: args.wheel_id,
          center_bore_id: args.center_bore_id,
          wheel_title: args.wheel_title,
          center_bore: args.center_bore_value ?? "",
        });
      }
    }
    if (args.color_id) {
      await ctx.db.insert("j_wheel_variant_color", {
        variant_id: variantId,
        color_id: args.color_id,
        variant_title: variantTitle,
        color: args.color_value ?? "",
      });
      const existingColor = await ctx.db
        .query("j_wheel_color")
        .withIndex("by_wheel_color", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("color_id", args.color_id)
        )
        .first();
      if (!existingColor) {
        await ctx.db.insert("j_wheel_color", {
          wheel_id: args.wheel_id,
          color_id: args.color_id,
          wheel_title: args.wheel_title,
          color: args.color_value ?? "",
        });
      }
    }
    if (args.part_number_id) {
      await ctx.db.insert("j_wheel_variant_part_number", {
        variant_id: variantId,
        part_number_id: args.part_number_id,
        variant_title: variantTitle,
        part_number: args.part_number ?? "",
      });
      const existingPn = await ctx.db
        .query("j_wheel_part_number")
        .withIndex("by_wheel_part_number", (q) =>
          q.eq("wheel_id", args.wheel_id).eq("part_number_id", args.part_number_id)
        )
        .first();
      if (!existingPn) {
        await ctx.db.insert("j_wheel_part_number", {
          wheel_id: args.wheel_id,
          part_number_id: args.part_number_id,
          wheel_title: args.wheel_title,
          part_number: args.part_number ?? "",
        });
      }
    }

    return variantId;
  },
});