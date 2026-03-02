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
    brand_title: optionalString,
    brand_description: optionalString,
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
    model_name: optionalString,
    vehicle_title: optionalString,
    generation: optionalString,
    production_years: optionalString,
    production_stats: optionalString,
    vehicle_image: optionalString,
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

export const wheelsUpdate = mutation({
  args: {
    id: v.id("oem_wheels"),
    wheel_title: optionalString,
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

// =============================================================================
// USER TABLE PREFERENCES (column order)
// =============================================================================

export const userTablePreferencesUpsert = mutation({
  args: {
    userId: v.string(),
    tableName: v.string(),
    columnOrderJson: v.string(),
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
        updated_at: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("user_table_preferences", {
      user_id: args.userId,
      table_name: args.tableName,
      column_order_json: args.columnOrderJson,
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
