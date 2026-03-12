"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Upload a brand icon directly to Convex storage and update the record.
 */
export const uploadBrandIcon = action({
    args: {
        brandId: v.id("oem_brands"),
        iconBase64: v.string(), // Send as base64
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        const { brandId, iconBase64 } = args;

        // Decode base64 manually without Buffer
        const binaryString = atob(iconBase64);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array]);

        // Store into Convex storage
        const storageId = await ctx.storage.store(blob);
        const convexUrl = await ctx.storage.getUrl(storageId);

        if (!convexUrl) {
            throw new Error("Failed to get URL for stored brand icon");
        }

        // Patch the brand document
        await ctx.runMutation(internal.brandMigrationsInternal.patchBrandImageUrl, {
            brandId,
            convexUrl,
        });

        return { storageId, convexUrl };
    },
});

/**
 * Public action to trigger copying brand_image_url to good_pic_url for all brands.
 */
export const linkBrandImagesToGoodPic = action({
    args: {},
    handler: async (ctx) => {
        return await ctx.runMutation(internal.brandMigrationsInternal.copyBrandImageUrlToGoodPicUrl);
    },
});

/**
 * Public action to get all brands for migration.
 */
export const getAllBrandsMigration = action({
    args: {},
    handler: async (ctx) => {
        return await ctx.runQuery(internal.queries.brandsGetAll, {});
    },
});

/**
 * Public action to get all wheels for migration.
 */
export const getAllWheelsMigration = action({
    args: {},
    handler: async (ctx) => {
        return await ctx.runQuery(internal.queries.wheelsGetAll, {});
    },
});
