import { query } from "./_generated/server";
import { v } from "convex/values";

const IMAGE_FILE_PATTERN = /\.(png|jpe?g|webp|gif|avif|heic|bmp|svg)$/i;

function looksLikeImageAsset(path: string, contentType?: string | null) {
  return Boolean((contentType && contentType.startsWith("image/")) || IMAGE_FILE_PATTERN.test(path));
}

function buildStoredMediaUrl(convexSiteUrl: string, virtualPath: string, storedUrl: string | null) {
  return convexSiteUrl
    ? `${convexSiteUrl}/api/media/${virtualPath}`
    : storedUrl;
}

export const getByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const wheel = await ctx.db.get(args.wheelId);
      if (!wheel) {
        return { wheelImages: [], brandUnlinkedAssets: [] };
      }

      const brandId = wheel.brand_id
        ?? (await ctx.db
          .query("j_wheel_brand")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
          .first())?.brand_id
        ?? null;

      const [wheelImages, wheelFiles, brandFiles] = await Promise.all([
        ctx.db
          .query("oem_wheel_images")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
          .collect(),
        ctx.db
          .query("oem_file_storage")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
          .collect(),
        brandId
          ? ctx.db
              .query("oem_file_storage")
              .withIndex("by_brand", (q) => q.eq("brand_id", brandId))
              .collect()
          : Promise.resolve([]),
      ]);

      const convexSiteUrl = process.env.CONVEX_SITE_URL || "";
      const wheelFilesByStorageId = new Map(
        wheelFiles.map((file) => [file.storageId, file])
      );

      const wheelImageRows = await Promise.all(
        wheelImages.map(async (image) => {
          const linkedFile = image.storage_id ? wheelFilesByStorageId.get(image.storage_id) ?? null : null;
          const storedUrl = image.storage_id ? await ctx.storage.getUrl(image.storage_id) : null;
          return {
            _id: image._id,
            image_type: image.image_type,
            url: image.url,
            storage_id: image.storage_id ?? null,
            sort_order: image.sort_order ?? null,
            is_primary: image.is_primary ?? false,
            created_at: image.created_at ?? null,
            path: linkedFile?.path ?? null,
            mediaUrl: image.url || buildStoredMediaUrl(convexSiteUrl, linkedFile?.path ?? "", storedUrl),
          };
        })
      );

      const brandUnlinkedAssets = await Promise.all(
        brandFiles
          .filter((file) => !file.wheel_id && !file.vehicle_id && looksLikeImageAsset(file.path, file.contentType ?? null))
          .map(async (file) => {
            const storedUrl = await ctx.storage.getUrl(file.storageId);
            return {
              _id: file._id,
              path: file.path,
              storageId: file.storageId,
              contentType: file.contentType ?? null,
              mediaUrl: buildStoredMediaUrl(convexSiteUrl, file.path, storedUrl),
            };
          })
      );

      brandUnlinkedAssets.sort((a, b) => a.path.localeCompare(b.path));

      return {
        wheelImages: wheelImageRows,
        brandUnlinkedAssets,
      };
    } catch {
      return { wheelImages: [], brandUnlinkedAssets: [] };
    }
  },
});
