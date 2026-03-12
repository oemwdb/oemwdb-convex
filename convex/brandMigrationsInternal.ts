import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Internal: patch a brand's image URL field.
 */
export const patchBrandImageUrl = internalMutation({
    args: {
        brandId: v.id("oem_brands"),
        convexUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.brandId, {
            brand_image_url: args.convexUrl,
        });
    },
});

/**
 * Internal: copy brand_image_url to good_pic_url for all brands that have an image URL.
 */
export const copyBrandImageUrlToGoodPicUrl = internalMutation({
    args: {},
    handler: async (ctx) => {
        const brands = await ctx.db.query("oem_brands").collect();
        let updated = 0;
        for (const brand of brands) {
            if (brand.brand_image_url && brand.brand_image_url !== brand.good_pic_url) {
                await ctx.db.patch(brand._id, {
                    good_pic_url: brand.brand_image_url,
                });
                updated++;
            }
        }
        return { updated };
    },
});
