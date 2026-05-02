import { v } from "convex/values";

import { internalMutation, internalQuery } from "./_generated/server";
import { requireAdmin } from "./adminAuth";

const generatedItemType = v.union(
  v.literal("brand"),
  v.literal("vehicle"),
  v.literal("wheel"),
  v.literal("wheel_variant"),
);

const generatedItemId = v.union(
  v.id("oem_brands"),
  v.id("oem_vehicles"),
  v.id("oem_wheels"),
  v.id("oem_wheel_variants"),
);

export const requireAdminForAssetGeneration = internalQuery({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return true;
  },
});

async function getGeneratedSourceRows(ctx: any, itemType: string, id: any) {
  switch (itemType) {
    case "brand":
      return await ctx.db
        .query("oem_brand_images")
        .withIndex("by_brand_type", (q: any) => q.eq("brand_id", id).eq("image_type", "source"))
        .collect();
    case "vehicle":
      return await ctx.db
        .query("oem_vehicle_images")
        .withIndex("by_vehicle_type", (q: any) => q.eq("vehicle_id", id).eq("image_type", "source"))
        .collect();
    case "wheel":
      return await ctx.db
        .query("oem_wheel_images")
        .withIndex("by_wheel_type", (q: any) => q.eq("wheel_id", id).eq("image_type", "source"))
        .collect();
    case "wheel_variant":
      return await ctx.db
        .query("oem_wheel_variant_images")
        .withIndex("by_variant_type", (q: any) => q.eq("variant_id", id).eq("image_type", "source"))
        .collect();
    default:
      return [];
  }
}

async function insertGeneratedSourceRow(ctx: any, itemType: string, id: any, row: Record<string, unknown>) {
  switch (itemType) {
    case "brand":
      return await ctx.db.insert("oem_brand_images", { brand_id: id, ...row });
    case "vehicle":
      return await ctx.db.insert("oem_vehicle_images", { vehicle_id: id, ...row });
    case "wheel":
      return await ctx.db.insert("oem_wheel_images", { wheel_id: id, ...row });
    case "wheel_variant":
      return await ctx.db.insert("oem_wheel_variant_images", { variant_id: id, ...row });
    default:
      throw new Error(`Unsupported asset generation item type: ${itemType}`);
  }
}

export const insertGeneratedSourceImage = internalMutation({
  args: {
    itemType: generatedItemType,
    id: generatedItemId,
    mediaUrl: v.string(),
    storageId: v.string(),
    fileStorageId: v.id("oem_file_storage"),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const mediaUrl = args.mediaUrl.trim();
    if (!mediaUrl) throw new Error("Generated media URL cannot be empty.");

    const existingRows = await getGeneratedSourceRows(ctx, args.itemType, args.id);
    const existing =
      existingRows.find((row: any) => String(row.file_storage_id ?? "") === String(args.fileStorageId)) ??
      existingRows.find((row: any) => String(row.storage_id ?? "") === args.storageId) ??
      existingRows.find((row: any) => String(row.url ?? "").trim() === mediaUrl) ??
      null;

    const now = new Date().toISOString();
    const sortOrder =
      args.sortOrder ??
      (typeof existing?.sort_order === "number"
        ? existing.sort_order
        : existingRows.reduce((max: number, row: any) => Math.max(max, row.sort_order ?? -1), -1) + 1);
    const patch = {
      storage_id: args.storageId,
      file_storage_id: args.fileStorageId,
      url: mediaUrl,
      image_type: "source",
      role: "generated",
      visibility: "public",
      sort_order: sortOrder,
      is_primary: false,
      created_at: existing?.created_at ?? now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return String(existing._id);
    }

    const imageId = await insertGeneratedSourceRow(ctx, args.itemType, args.id, patch);
    return String(imageId);
  },
});
