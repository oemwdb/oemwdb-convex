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
