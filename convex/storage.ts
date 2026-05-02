"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Migration helper: Move an existing storageId to a virtual path.
 */
export const moveStorageIdToPath = action({
    args: {
        storageId: v.string(),
        virtualPath: v.string(),
        contentType: v.optional(v.string()),
        brandId: v.optional(v.id("oem_brands")),
        wheelId: v.optional(v.id("oem_wheels")),
        vehicleId: v.optional(v.id("oem_vehicles")),
        role: v.optional(v.string()),
        visibility: v.optional(v.string()),
        sortOrder: v.optional(v.number()),
        isPrimary: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // 1. Record the mapping
        const fileStorageId = await ctx.runMutation(internal.storageInternal.recordFile, {
            path: args.virtualPath,
            storageId: args.storageId,
            contentType: args.contentType,
            brand_id: args.brandId,
            wheel_id: args.wheelId,
            vehicle_id: args.vehicleId,
        });

        // 2. Construct the new media URL
        const convexSiteUrl = process.env.CONVEX_SITE_URL || "";
        const storedUrl = await ctx.storage.getUrl(args.storageId);
        const mediaUrl = buildMediaUrl(convexSiteUrl, args.virtualPath, storedUrl);

        if (!mediaUrl) {
            throw new Error("Failed to build a moved asset media URL");
        }

        if (args.vehicleId && args.role && args.visibility) {
            await ctx.runMutation(internal.storageInternal.recordVehicleImageRow, {
                vehicle_id: args.vehicleId,
                storage_id: args.storageId,
                file_storage_id: fileStorageId,
                url: mediaUrl,
                image_type: args.role,
                role: args.role,
                visibility: args.visibility,
                sort_order: args.sortOrder,
                is_primary: args.isPrimary,
            });
        }

        return { mediaUrl, fileStorageId };
    },
});

/**
 * Public action to update a brand's image URL.
 */
export const updateBrandImageUrlAction = action({
    args: {
        brandId: v.id("oem_brands"),
        field: v.union(v.literal("brand_image_url"), v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.runMutation(internal.storageInternal.updateBrandImageUrl, args);
    },
});

/**
 * Public action to update a wheel's image URL.
 */
export const updateWheelImageUrlAction = action({
    args: {
        wheelId: v.id("oem_wheels"),
        field: v.union(v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.runMutation(internal.storageInternal.updateWheelImageUrl, args);
    },
});

/**
 * Public action to update a vehicle's image URL.
 */
export const updateVehicleImageUrlAction = action({
    args: {
        vehicleId: v.id("oem_vehicles"),
        field: v.union(v.literal("good_pic_url"), v.literal("bad_pic_url")),
        mediaUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.runMutation(internal.storageInternal.updateVehicleImageUrl, args);
    },
});

function sanitizeFileName(fileName: string) {
    return fileName
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "upload";
}

function buildMediaUrl(convexSiteUrl: string, virtualPath: string, storedUrl: string | null) {
    return convexSiteUrl
        ? `${convexSiteUrl}/api/media/${virtualPath}`
        : storedUrl;
}

/**
 * Upload a wheel asset directly to Convex storage, register a virtual path,
 * and patch the wheel's good/bad image URL.
 */
export const uploadWheelAsset = action({
    args: {
        wheelId: v.id("oem_wheels"),
        field: v.union(v.literal("good_pic_url"), v.literal("bad_pic_url")),
        fileBase64: v.string(),
        fileName: v.string(),
        contentType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const binaryString = atob(args.fileBase64);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], {
            type: args.contentType || "application/octet-stream",
        });

        const storageId = await ctx.storage.store(blob);
        const safeName = sanitizeFileName(args.fileName);
        const role = args.field === "good_pic_url" ? "good" : "bad";
        const virtualPath = `wheels/${args.wheelId}/${role}/public/${Date.now()}-${safeName}`;

        const fileStorageId = await ctx.runMutation(internal.storageInternal.recordFile, {
            path: virtualPath,
            storageId,
            contentType: args.contentType,
            wheel_id: args.wheelId,
        });

        const convexSiteUrl = process.env.CONVEX_SITE_URL || "";
        const storedUrl = await ctx.storage.getUrl(storageId);
        const mediaUrl = convexSiteUrl
            ? `${convexSiteUrl}/api/media/${virtualPath}`
            : storedUrl;

        if (!mediaUrl) {
            throw new Error("Failed to build a wheel asset URL");
        }

        await ctx.runMutation(internal.storageInternal.updateWheelImageUrl, {
            wheelId: args.wheelId,
            field: args.field,
            mediaUrl,
        });

        return { mediaUrl, virtualPath, storageId, fileStorageId };
    },
});

/**
 * Upload a shared/static asset to Convex storage and register a virtual path.
 */
export const uploadSharedAsset = action({
    args: {
        fileBase64: v.string(),
        fileName: v.string(),
        virtualPath: v.string(),
        contentType: v.optional(v.string()),
        brandId: v.optional(v.id("oem_brands")),
        wheelId: v.optional(v.id("oem_wheels")),
        wheelVariantId: v.optional(v.id("oem_wheel_variants")),
        vehicleId: v.optional(v.id("oem_vehicles")),
    },
    handler: async (ctx, args) => {
        const binaryString = atob(args.fileBase64);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], {
            type: args.contentType || "application/octet-stream",
        });

        const storageId = await ctx.storage.store(blob);
        const safeName = sanitizeFileName(args.fileName);
        const normalizedVirtualPath = args.virtualPath.trim() || `shared/${Date.now()}-${safeName}`;

        const fileStorageId = await ctx.runMutation(internal.storageInternal.recordFile, {
            path: normalizedVirtualPath,
            storageId,
            contentType: args.contentType,
            brand_id: args.brandId,
            wheel_id: args.wheelId,
            variant_id: args.wheelVariantId,
            vehicle_id: args.vehicleId,
        });

        const convexSiteUrl = process.env.CONVEX_SITE_URL || "";
        const storedUrl = await ctx.storage.getUrl(storageId);
        const mediaUrl = buildMediaUrl(convexSiteUrl, normalizedVirtualPath, storedUrl);

        if (!mediaUrl) {
            throw new Error("Failed to build a shared asset URL");
        }

        return { mediaUrl, virtualPath: normalizedVirtualPath, storageId, fileStorageId };
    },
});

/**
 * Fetch an existing external image URL into Convex storage and register it
 * under a virtual path.
 */
export const fetchExternalAssetToStorage = action({
    args: {
        sourceUrl: v.string(),
        virtualPath: v.string(),
        contentType: v.optional(v.string()),
        brandId: v.optional(v.id("oem_brands")),
        wheelId: v.optional(v.id("oem_wheels")),
        vehicleId: v.optional(v.id("oem_vehicles")),
    },
    handler: async (ctx, args) => {
        if (!/^https?:\/\//i.test(args.sourceUrl)) {
            throw new Error(`fetchExternalAssetToStorage: sourceUrl must be http(s): ${args.sourceUrl}`);
        }

        const response = await fetch(args.sourceUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; OEMWDB-Migration/1.0)",
                Accept: "image/*,*/*",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch image (${response.status} ${response.statusText}) from ${args.sourceUrl}`
            );
        }

        const blob = await response.blob();
        const contentType =
            args.contentType ||
            blob.type ||
            response.headers.get("content-type") ||
            "application/octet-stream";

        const storageId = await ctx.storage.store(blob);
        const normalizedVirtualPath = args.virtualPath.trim();

        await ctx.runMutation(internal.storageInternal.recordFile, {
            path: normalizedVirtualPath,
            storageId,
            contentType,
            brand_id: args.brandId,
            wheel_id: args.wheelId,
            vehicle_id: args.vehicleId,
        });

        const convexSiteUrl = process.env.CONVEX_SITE_URL || "";
        const storedUrl = await ctx.storage.getUrl(storageId);
        const mediaUrl = buildMediaUrl(convexSiteUrl, normalizedVirtualPath, storedUrl);

        if (!mediaUrl) {
            throw new Error("Failed to build an external asset media URL");
        }

        return { mediaUrl, virtualPath: normalizedVirtualPath, storageId, contentType };
    },
});
