/**
 * Convex mutations for core domain tables and junction tables.
 * No *_ref fields. Junction tables use link/unlink mutations.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const optionalString = v.optional(v.string());
const optionalNumber = v.optional(v.number());
const optionalBoolean = v.optional(v.boolean());
const optionalStringArray = v.optional(v.array(v.string()));

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
    wheel_count: optionalNumber,
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
    brand_title: optionalString,
    brand_description: optionalString,
    brand_image_url: optionalString,
    brand_page: optionalString,
    subsidiaries: optionalString,
    wheel_count: optionalNumber,
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
    brand_id: v.id("oem_brands"),
    vehicle_id_only: optionalString,
    model_name: optionalString,
    vehicle_title: optionalString,
    generation: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    vehicle_image: optionalString,
    oem_engine_id: v.optional(v.id("oem_engines")),
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
    brand_id: v.optional(v.id("oem_brands")),
    vehicle_id_only: optionalString,
    model_name: optionalString,
    vehicle_title: optionalString,
    generation: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    vehicle_image: optionalString,
    oem_engine_id: v.optional(v.id("oem_engines")),
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

// =============================================================================
// OEM WHEELS
// =============================================================================

export const wheelsInsert = mutation({
  args: {
    id: v.string(),
    brand_id: v.id("oem_brands"),
    wheel_title: v.string(),
    color: optionalString,
    wheel_offset: optionalString,
    weight: optionalString,
    metal_type: optionalString,
    part_numbers: optionalString,
    notes: optionalString,
    good_pic_url: optionalString,
    image_source: optionalString,
    uuid: optionalString,
    ai_processing_complete: optionalBoolean,
    design_style_tags: optionalStringArray,
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

export const wheelsUpdate = mutation({
  args: {
    id: v.id("oem_wheels"),
    brand_id: v.optional(v.id("oem_brands")),
    wheel_title: optionalString,
    color: optionalString,
    wheel_offset: optionalString,
    weight: optionalString,
    metal_type: optionalString,
    part_numbers: optionalString,
    notes: optionalString,
    good_pic_url: optionalString,
    image_source: optionalString,
    uuid: optionalString,
    ai_processing_complete: optionalBoolean,
    design_style_tags: optionalStringArray,
    specifications_json: optionalString,
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

export const wheelsDelete = mutation({
  args: { id: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
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
      .query("wheel_vehicles")
      .withIndex("by_wheel_vehicle", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("vehicle_id", args.vehicle_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_vehicles", args);
  },
});

export const wheelVehicleUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    vehicle_id: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_vehicles")
      .withIndex("by_wheel_vehicle", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("vehicle_id", args.vehicle_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_bolt_patterns
// =============================================================================

export const wheelBoltPatternLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_bolt_patterns")
      .withIndex("by_wheel_bolt_pattern", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("bolt_pattern_id", args.bolt_pattern_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_bolt_patterns", args);
  },
});

export const wheelBoltPatternUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_bolt_patterns")
      .withIndex("by_wheel_bolt_pattern", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("bolt_pattern_id", args.bolt_pattern_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_diameters
// =============================================================================

export const wheelDiameterLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_diameters")
      .withIndex("by_wheel_diameter", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("diameter_id", args.diameter_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_diameters", args);
  },
});

export const wheelDiameterUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_diameters")
      .withIndex("by_wheel_diameter", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("diameter_id", args.diameter_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_widths
// =============================================================================

export const wheelWidthLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_widths")
      .withIndex("by_wheel_width", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("width_id", args.width_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_widths", args);
  },
});

export const wheelWidthUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_widths")
      .withIndex("by_wheel_width", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("width_id", args.width_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_center_bores
// =============================================================================

export const wheelCenterBoreLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_center_bores")
      .withIndex("by_wheel_center_bore", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("center_bore_id", args.center_bore_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_center_bores", args);
  },
});

export const wheelCenterBoreUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_center_bores")
      .withIndex("by_wheel_center_bore", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("center_bore_id", args.center_bore_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_colors
// =============================================================================

export const wheelColorLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_colors")
      .withIndex("by_wheel_color", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("color_id", args.color_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_colors", args);
  },
});

export const wheelColorUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_colors")
      .withIndex("by_wheel_color", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("color_id", args.color_id)
      )
      .first();
    if (link) await ctx.db.delete(link._id);
    return link?._id ?? null;
  },
});

// =============================================================================
// JUNCTION TABLE: wheel_tire_sizes
// =============================================================================

export const wheelTireSizeLink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wheel_tire_sizes")
      .withIndex("by_wheel_tire_size", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("tire_size_id", args.tire_size_id)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("wheel_tire_sizes", args);
  },
});

export const wheelTireSizeUnlink = mutation({
  args: {
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("wheel_tire_sizes")
      .withIndex("by_wheel_tire_size", (q) =>
        q.eq("wheel_id", args.wheel_id).eq("tire_size_id", args.tire_size_id)
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
    comment_text: v.string(),
    tag: optionalString,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("vehicle_comments", {
      vehicle_id: args.vehicleId,
      user_id: args.userId,
      comment_text: args.comment_text,
      tag: args.tag ?? undefined,
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
      .withIndex("by_id", (q) => q.eq("id", args.brand_ref))
      .first();
    const vehicle = await ctx.db
      .query("oem_vehicles")
      .withIndex("by_id", (q) => q.eq("id", args.vehicle_ref))
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
        .withIndex("by_id", (q) => q.eq("id", brand_ref))
        .first();
      if (brand) {
        patch.brand_id = brand._id;
        patch.make = brand.brand_title;
      }
    }
    if (vehicle_ref) {
      const vehicle = await ctx.db
        .query("oem_vehicles")
        .withIndex("by_id", (q) => q.eq("id", vehicle_ref))
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
