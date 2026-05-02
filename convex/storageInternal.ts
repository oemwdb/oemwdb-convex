import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/**
 * Record a file mapping in the virtual file system.
 */
export const recordFile = internalMutation({
    args: {
        path: v.string(),
        storageId: v.string(),
        contentType: v.optional(v.string()),
        brand_id: v.optional(v.id("oem_brands")),
        wheel_id: v.optional(v.id("oem_wheels")),
        variant_id: v.optional(v.id("oem_wheel_variants")),
        vehicle_id: v.optional(v.id("oem_vehicles")),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("oem_file_storage")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        }

        return await ctx.db.insert("oem_file_storage", args);
    },
});

export const recordVehicleImageRow = internalMutation({
    args: {
        vehicle_id: v.id("oem_vehicles"),
        storage_id: v.optional(v.string()),
        file_storage_id: v.optional(v.id("oem_file_storage")),
        url: v.string(),
        image_type: v.string(),
        role: v.optional(v.string()),
        visibility: v.optional(v.string()),
        sort_order: v.optional(v.number()),
        is_primary: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("oem_vehicle_images")
            .withIndex("by_vehicle_type", (q) =>
                q.eq("vehicle_id", args.vehicle_id).eq("image_type", args.image_type)
            )
            .first();

        const patch = {
            storage_id: args.storage_id,
            file_storage_id: args.file_storage_id,
            url: args.url,
            image_type: args.image_type,
            role: args.role,
            visibility: args.visibility,
            sort_order: args.sort_order,
            is_primary: args.is_primary,
        };

        if (existing) {
            await ctx.db.patch(existing._id, patch);
            return existing._id;
        }

        return await ctx.db.insert("oem_vehicle_images", {
            vehicle_id: args.vehicle_id,
            ...patch,
            created_at: new Date().toISOString(),
        });
    },
});

/**
 * Retrieve a file record by its virtual path.
 */
export const getFileByPath = internalQuery({
    args: { path: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("oem_file_storage")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();
    },
});

/**
 * Internal: update a brand's image URLs to the new virtual path.
 */
export const updateBrandImageUrl = internalMutation({
    args: {
        brandId: v.id("oem_brands"),
        field: v.union(v.literal("brand_image_url"), v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.brandId, {
            [args.field]: args.mediaUrl,
        });
    },
});

/**
 * Internal: update a wheel's image URLs to the new virtual path.
 */
export const updateWheelImageUrl = internalMutation({
    args: {
        wheelId: v.id("oem_wheels"),
        field: v.union(v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.wheelId, {
            [args.field]: args.mediaUrl,
        });
    },
});

/**
 * Internal: update a vehicle's image URLs to the new virtual path.
 */
export const updateVehicleImageUrl = internalMutation({
    args: {
        vehicleId: v.id("oem_vehicles"),
        field: v.union(v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.vehicleId, {
            [args.field]: args.mediaUrl,
        });
    },
});
