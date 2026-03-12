import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type BrandDoc = Doc<"oem_brands">;
type VehicleDoc = Doc<"oem_vehicles">;
type WheelDoc = Doc<"oem_wheels">;
type FileStorageDoc = Doc<"oem_file_storage">;

function clean(value: unknown): string | undefined {
  const out = String(value ?? "").trim();
  return out ? out : undefined;
}

function extractStorageIdFromUrl(url: string | undefined): string | undefined {
  const value = clean(url);
  if (!value) return undefined;
  const match = value.match(/\/api\/storage\/([^/?#]+)/i);
  return match?.[1];
}

function extractMediaPathFromUrl(url: string | undefined): string | undefined {
  const value = clean(url);
  if (!value) return undefined;

  try {
    const parsed = new URL(value);
    const prefix = "/api/media/";
    if (!parsed.pathname.startsWith(prefix)) return undefined;
    const path = parsed.pathname.slice(prefix.length);
    return clean(decodeURIComponent(path));
  } catch {
    const marker = "/api/media/";
    const index = value.indexOf(marker);
    if (index === -1) return undefined;
    const after = value.slice(index + marker.length).split("?")[0];
    return clean(after);
  }
}

function resolveStorageId(url: string | undefined, storageByPath: Map<string, string>): string | undefined {
  const direct = extractStorageIdFromUrl(url);
  if (direct) return direct;
  const mediaPath = extractMediaPathFromUrl(url);
  if (!mediaPath) return undefined;
  return storageByPath.get(mediaPath);
}

type CandidateImage = {
  imageType: string;
  url: string;
  storageId?: string;
  isPrimary: boolean;
  sortOrder: number;
};

function buildCandidates(
  rawCandidates: Array<{ imageType: string; url?: string }>,
  primaryOrder: string[],
  storageByPath: Map<string, string>
): CandidateImage[] {
  const present = rawCandidates
    .map((candidate) => ({
      imageType: candidate.imageType,
      url: clean(candidate.url),
    }))
    .filter((candidate): candidate is { imageType: string; url: string } => !!candidate.url);

  if (present.length === 0) return [];

  const primaryType =
    primaryOrder.find((imageType) => present.some((candidate) => candidate.imageType === imageType)) ??
    present[0].imageType;

  return present.map((candidate, index) => ({
    imageType: candidate.imageType,
    url: candidate.url,
    storageId: resolveStorageId(candidate.url, storageByPath),
    isPrimary: candidate.imageType === primaryType,
    sortOrder: index,
  }));
}

type ExistingBrandImage = Doc<"oem_brand_images">;
type ExistingVehicleImage = Doc<"oem_vehicle_images">;
type ExistingWheelImage = Doc<"oem_wheel_images">;

function brandKey(brandId: Id<"oem_brands">, imageType: string) {
  return `${brandId}::${imageType}`;
}

function vehicleKey(vehicleId: Id<"oem_vehicles">, imageType: string) {
  return `${vehicleId}::${imageType}`;
}

function wheelKey(wheelId: Id<"oem_wheels">, imageType: string) {
  return `${wheelId}::${imageType}`;
}

function isConvexUrl(url: string | undefined) {
  const value = clean(url);
  return !!value && /convex\.site|convex\.cloud|\/api\/media\//i.test(value);
}

function isExternalUrl(url: string | undefined) {
  const value = clean(url);
  return !!value && /^https?:\/\//i.test(value) && !isConvexUrl(value);
}

function brandLegacyFieldForImageType(imageType: string) {
  if (imageType === "brand") return "brand_image_url" as const;
  if (imageType === "good") return "good_pic_url" as const;
  if (imageType === "bad") return "bad_pic_url" as const;
  return undefined;
}

function vehicleLegacyFieldForImageType(imageType: string) {
  if (imageType === "hero") return "vehicle_image" as const;
  if (imageType === "good") return "good_pic_url" as const;
  if (imageType === "bad") return "bad_pic_url" as const;
  return undefined;
}

function wheelLegacyFieldForImageType(imageType: string) {
  if (imageType === "good") return "good_pic_url" as const;
  if (imageType === "bad") return "bad_pic_url" as const;
  return undefined;
}

function summarizeLegacyFields<T extends Record<string, unknown>>(rows: T[], fields: string[]) {
  const externalByField = Object.fromEntries(
    fields.map((field) => [field, rows.filter((row) => isExternalUrl(clean(row[field]))).length])
  );

  const totalExternal = Object.values(externalByField).reduce((sum, count) => sum + Number(count), 0);

  return {
    totalRows: rows.length,
    externalByField,
    totalExternal,
  };
}

export const auditImageTables = query({
  args: {},
  handler: async (ctx) => {
    const [brands, vehicles, wheels, brandImages, vehicleImages, wheelImages] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_brand_images").collect(),
      ctx.db.query("oem_vehicle_images").collect(),
      ctx.db.query("oem_wheel_images").collect(),
    ]);

    const summarize = (rows: Array<{ storage_id?: string; url: string }>) => ({
      total: rows.length,
      withStorageId: rows.filter((row) => !!clean(row.storage_id)).length,
      convexUrl: rows.filter((row) => isConvexUrl(row.url)).length,
      externalUrl: rows.filter((row) => isExternalUrl(row.url)).length,
    });

    return {
      brandImages: summarize(brandImages),
      vehicleImages: summarize(vehicleImages),
      wheelImages: summarize(wheelImages),
      legacyBrandFields: summarizeLegacyFields(brands, ["brand_image_url", "good_pic_url", "bad_pic_url"]),
      legacyVehicleFields: summarizeLegacyFields(vehicles, ["vehicle_image", "good_pic_url", "bad_pic_url"]),
      legacyWheelFields: summarizeLegacyFields(wheels, ["good_pic_url", "bad_pic_url"]),
    };
  },
});

export const backfillImageTablesFromLegacyFields = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const now = new Date().toISOString();

    const [
      brands,
      vehicles,
      wheels,
      fileStorageRows,
      existingBrandImages,
      existingVehicleImages,
      existingWheelImages,
    ] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_file_storage").collect(),
      ctx.db.query("oem_brand_images").collect(),
      ctx.db.query("oem_vehicle_images").collect(),
      ctx.db.query("oem_wheel_images").collect(),
    ]);

    const storageByPath = new Map<string, string>();
    for (const row of fileStorageRows as FileStorageDoc[]) {
      storageByPath.set(row.path, row.storageId);
    }

    const brandImagesByKey = new Map<string, ExistingBrandImage>();
    for (const row of existingBrandImages) {
      brandImagesByKey.set(brandKey(row.brand_id, row.image_type), row);
    }

    const vehicleImagesByKey = new Map<string, ExistingVehicleImage>();
    for (const row of existingVehicleImages) {
      vehicleImagesByKey.set(vehicleKey(row.vehicle_id, row.image_type), row);
    }

    const wheelImagesByKey = new Map<string, ExistingWheelImage>();
    for (const row of existingWheelImages) {
      wheelImagesByKey.set(wheelKey(row.wheel_id, row.image_type), row);
    }

    let insertedBrandImages = 0;
    let patchedBrandImages = 0;
    let insertedVehicleImages = 0;
    let patchedVehicleImages = 0;
    let insertedWheelImages = 0;
    let patchedWheelImages = 0;

    for (const brand of brands as BrandDoc[]) {
      const candidates = buildCandidates(
        [
          { imageType: "brand", url: brand.brand_image_url },
          { imageType: "good", url: brand.good_pic_url },
          { imageType: "bad", url: brand.bad_pic_url },
        ],
        ["brand", "good", "bad"],
        storageByPath
      );

      for (const candidate of candidates) {
        const key = brandKey(brand._id, candidate.imageType);
        const existing = brandImagesByKey.get(key);
        if (existing) {
          const patch: Record<string, unknown> = {};
          if (existing.url !== candidate.url) patch.url = candidate.url;
          if ((existing.storage_id ?? undefined) !== candidate.storageId) patch.storage_id = candidate.storageId;
          if ((existing.is_primary ?? false) !== candidate.isPrimary) patch.is_primary = candidate.isPrimary;
          if ((existing.sort_order ?? undefined) !== candidate.sortOrder) patch.sort_order = candidate.sortOrder;
          if (Object.keys(patch).length > 0) {
            if (!dryRun) await ctx.db.patch(existing._id, patch);
            patchedBrandImages += 1;
          }
        } else {
          if (!dryRun) {
            const insertedId = await ctx.db.insert("oem_brand_images", {
              brand_id: brand._id,
              storage_id: candidate.storageId,
              url: candidate.url,
              image_type: candidate.imageType,
              sort_order: candidate.sortOrder,
              is_primary: candidate.isPrimary,
              created_at: now,
            });
            const row = (await ctx.db.get(insertedId)) as ExistingBrandImage | null;
            if (row) brandImagesByKey.set(key, row);
          }
          insertedBrandImages += 1;
        }
      }
    }

    for (const vehicle of vehicles as VehicleDoc[]) {
      const candidates = buildCandidates(
        [
          { imageType: "hero", url: vehicle.vehicle_image },
          { imageType: "good", url: vehicle.good_pic_url },
          { imageType: "bad", url: vehicle.bad_pic_url },
        ],
        ["hero", "good", "bad"],
        storageByPath
      );

      for (const candidate of candidates) {
        const key = vehicleKey(vehicle._id, candidate.imageType);
        const existing = vehicleImagesByKey.get(key);
        if (existing) {
          const patch: Record<string, unknown> = {};
          if (existing.url !== candidate.url) patch.url = candidate.url;
          if ((existing.storage_id ?? undefined) !== candidate.storageId) patch.storage_id = candidate.storageId;
          if ((existing.is_primary ?? false) !== candidate.isPrimary) patch.is_primary = candidate.isPrimary;
          if ((existing.sort_order ?? undefined) !== candidate.sortOrder) patch.sort_order = candidate.sortOrder;
          if (Object.keys(patch).length > 0) {
            if (!dryRun) await ctx.db.patch(existing._id, patch);
            patchedVehicleImages += 1;
          }
        } else {
          if (!dryRun) {
            const insertedId = await ctx.db.insert("oem_vehicle_images", {
              vehicle_id: vehicle._id,
              storage_id: candidate.storageId,
              url: candidate.url,
              image_type: candidate.imageType,
              sort_order: candidate.sortOrder,
              is_primary: candidate.isPrimary,
              created_at: now,
            });
            const row = (await ctx.db.get(insertedId)) as ExistingVehicleImage | null;
            if (row) vehicleImagesByKey.set(key, row);
          }
          insertedVehicleImages += 1;
        }
      }
    }

    for (const wheel of wheels as WheelDoc[]) {
      const candidates = buildCandidates(
        [
          { imageType: "good", url: wheel.good_pic_url },
          { imageType: "bad", url: wheel.bad_pic_url },
        ],
        ["good", "bad"],
        storageByPath
      );

      for (const candidate of candidates) {
        const key = wheelKey(wheel._id, candidate.imageType);
        const existing = wheelImagesByKey.get(key);
        if (existing) {
          const patch: Record<string, unknown> = {};
          if (existing.url !== candidate.url) patch.url = candidate.url;
          if ((existing.storage_id ?? undefined) !== candidate.storageId) patch.storage_id = candidate.storageId;
          if ((existing.is_primary ?? false) !== candidate.isPrimary) patch.is_primary = candidate.isPrimary;
          if ((existing.sort_order ?? undefined) !== candidate.sortOrder) patch.sort_order = candidate.sortOrder;
          if (Object.keys(patch).length > 0) {
            if (!dryRun) await ctx.db.patch(existing._id, patch);
            patchedWheelImages += 1;
          }
        } else {
          if (!dryRun) {
            const insertedId = await ctx.db.insert("oem_wheel_images", {
              wheel_id: wheel._id,
              storage_id: candidate.storageId,
              url: candidate.url,
              image_type: candidate.imageType,
              sort_order: candidate.sortOrder,
              is_primary: candidate.isPrimary,
              created_at: now,
            });
            const row = (await ctx.db.get(insertedId)) as ExistingWheelImage | null;
            if (row) wheelImagesByKey.set(key, row);
          }
          insertedWheelImages += 1;
        }
      }
    }

    return {
      dryRun,
      insertedBrandImages,
      patchedBrandImages,
      insertedVehicleImages,
      patchedVehicleImages,
      insertedWheelImages,
      patchedWheelImages,
    };
  },
});

export const listExternalBrandImages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 500));
    const [brands, imageRows] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_brand_images").collect(),
    ]);

    const brandById = new Map(brands.map((brand) => [String(brand._id), brand]));
    const rows = imageRows
      .filter((row) => isExternalUrl(row.url))
      .map((row) => {
        const brand = brandById.get(String(row.brand_id)) as BrandDoc | undefined;
        return {
          imageId: row._id,
          brandId: row.brand_id,
          imageType: row.image_type,
          url: row.url,
          storageId: row.storage_id,
          entityKey: clean(brand?.slug) ?? clean(brand?.id) ?? String(row.brand_id),
          title: clean(brand?.brand_title),
        };
      })
      .slice(0, limit);

    return { rows };
  },
});

export const listExternalVehicleImages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 500));
    const [vehicles, imageRows] = await Promise.all([
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_vehicle_images").collect(),
    ]);

    const vehicleById = new Map(vehicles.map((vehicle) => [String(vehicle._id), vehicle]));
    const rows = imageRows
      .filter((row) => isExternalUrl(row.url))
      .map((row) => {
        const vehicle = vehicleById.get(String(row.vehicle_id)) as VehicleDoc | undefined;
        return {
          imageId: row._id,
          vehicleId: row.vehicle_id,
          imageType: row.image_type,
          url: row.url,
          storageId: row.storage_id,
          entityKey: clean(vehicle?.id) ?? String(row.vehicle_id),
          title: clean(vehicle?.vehicle_title),
        };
      })
      .slice(0, limit);

    return { rows };
  },
});

export const listExternalWheelImages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 500));
    const [wheels, imageRows] = await Promise.all([
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_wheel_images").collect(),
    ]);

    const wheelById = new Map(wheels.map((wheel) => [String(wheel._id), wheel]));
    const rows = imageRows
      .filter((row) => isExternalUrl(row.url))
      .map((row) => {
        const wheel = wheelById.get(String(row.wheel_id)) as WheelDoc | undefined;
        return {
          imageId: row._id,
          wheelId: row.wheel_id,
          imageType: row.image_type,
          url: row.url,
          storageId: row.storage_id,
          entityKey: clean(wheel?.id) ?? String(row.wheel_id),
          title: clean(wheel?.wheel_title),
        };
      })
      .slice(0, limit);

    return { rows };
  },
});

export const applyBrandImageStorage = mutation({
  args: {
    imageId: v.id("oem_brand_images"),
    storageId: v.string(),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.imageId);
    if (!row) {
      throw new Error(`Brand image row not found: ${args.imageId}`);
    }

    await ctx.db.patch(row._id, {
      storage_id: args.storageId,
      url: args.mediaUrl,
    });

    const field = brandLegacyFieldForImageType(row.image_type);
    if (field) {
      await ctx.db.patch(row.brand_id, {
        [field]: args.mediaUrl,
      });
    }

    return {
      brandId: row.brand_id,
      field: field ?? null,
    };
  },
});

export const applyVehicleImageStorage = mutation({
  args: {
    imageId: v.id("oem_vehicle_images"),
    storageId: v.string(),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.imageId);
    if (!row) {
      throw new Error(`Vehicle image row not found: ${args.imageId}`);
    }

    await ctx.db.patch(row._id, {
      storage_id: args.storageId,
      url: args.mediaUrl,
    });

    const field = vehicleLegacyFieldForImageType(row.image_type);
    if (field) {
      await ctx.db.patch(row.vehicle_id, {
        [field]: args.mediaUrl,
      });
    }

    return {
      vehicleId: row.vehicle_id,
      field: field ?? null,
    };
  },
});

export const applyWheelImageStorage = mutation({
  args: {
    imageId: v.id("oem_wheel_images"),
    storageId: v.string(),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.imageId);
    if (!row) {
      throw new Error(`Wheel image row not found: ${args.imageId}`);
    }

    await ctx.db.patch(row._id, {
      storage_id: args.storageId,
      url: args.mediaUrl,
    });

    const field = wheelLegacyFieldForImageType(row.image_type);
    if (field) {
      await ctx.db.patch(row.wheel_id, {
        [field]: args.mediaUrl,
      });
    }

    return {
      wheelId: row.wheel_id,
      field: field ?? null,
    };
  },
});
