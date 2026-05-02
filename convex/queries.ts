/**
 * Convex queries for core domain tables with junction table lookups.
 * No *_ref fields. Use junction tables for many-to-many.
 */

import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { paginationOptsValidator as basePaginationOptsValidator } from "convex/server";
import {
  DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE,
  requireAdmin,
  requireAdminUserId,
} from "./adminAuth";

// Relaxed validator to handle "id": "initial" or "cursor": null from frontend
export const paginationOptsValidator = v.object({
  numItems: v.number(),
  cursor: v.union(v.string(), v.null()),
  id: v.optional(v.union(v.number(), v.string())),
});

const getVehicleVariantEngineLayers = async (
  ctx: any,
  variant: Doc<"oem_vehicle_variants">
) => {
  const familyEngine = variant.engine_id
    ? await ctx.db.get(variant.engine_id)
    : null;

  const linkedEngineVariantId =
    variant.engine_variant_id ??
    (
      await ctx.db
        .query("j_oem_vehicle_variant_engine_variant")
        .withIndex("by_vehicle_variant", (q) => q.eq("variant_id", variant._id))
        .first()
    )?.engine_variant_id ??
    null;

  const exactEngineVariant = linkedEngineVariantId
    ? await ctx.db.get(linkedEngineVariantId)
    : null;

  const parentFamilyEngine =
    familyEngine ??
    (exactEngineVariant?.engine_id
      ? await ctx.db.get(exactEngineVariant.engine_id)
      : null);

  return {
    ...variant,
    engine_title: parentFamilyEngine?.engine_title ?? null,
    engine_code: parentFamilyEngine?.engine_code ?? null,
    engine_display_title: (parentFamilyEngine as any)?.engine_display_title ?? null,
    engine_family_label: (parentFamilyEngine as any)?.engine_family_label ?? null,
    configuration: parentFamilyEngine?.configuration ?? null,
    engine_layout: parentFamilyEngine?.engine_layout ?? null,
    cylinders: parentFamilyEngine?.cylinders ?? null,
    power_hp: parentFamilyEngine?.power_hp ?? null,
    power_kw: parentFamilyEngine?.power_kw ?? null,
    displacement_l: parentFamilyEngine?.displacement_l ?? null,
    fuel_type: parentFamilyEngine?.fuel_type ?? null,
    aspiration: parentFamilyEngine?.aspiration ?? null,
    engine_variant_title: exactEngineVariant?.engine_variant_title ?? null,
    engine_variant_code: exactEngineVariant?.engine_variant_code ?? null,
    powertrain_designation: exactEngineVariant?.powertrain_designation ?? null,
    engine_variant_displacement_l: (exactEngineVariant as any)?.displacement_l ?? null,
    engine_variant_power_hp: exactEngineVariant?.engine_variant_power_hp ?? null,
    engine_variant_power_kw: exactEngineVariant?.engine_variant_power_kw ?? null,
    engine_variant_fuel_type: exactEngineVariant?.engine_variant_fuel_type ?? null,
    engine_variant_aspiration: exactEngineVariant?.engine_variant_aspiration ?? null,
    engine_variant_electrification: exactEngineVariant?.engine_variant_electrification ?? null,
  };
};

const isConvexIdLike = (value: string) => /^[a-z0-9]{20,}$/i.test(value);

const uniqueSortedStrings = (values: Array<string | null | undefined>) =>
  [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))]
    .sort((a, b) => a.localeCompare(b));

const cleanOptionalString = (value: string | null | undefined) => {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
};

function compareVehicleImageRows(
  a: Doc<"oem_vehicle_images">,
  b: Doc<"oem_vehicle_images">,
) {
  const primaryCompare = Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary));
  if (primaryCompare !== 0) return primaryCompare;

  const aSort = typeof a.sort_order === "number" ? a.sort_order : Number.MAX_SAFE_INTEGER;
  const bSort = typeof b.sort_order === "number" ? b.sort_order : Number.MAX_SAFE_INTEGER;
  if (aSort !== bSort) return aSort - bSort;

  const aCreatedAt = Date.parse(a.created_at ?? "") || 0;
  const bCreatedAt = Date.parse(b.created_at ?? "") || 0;
  return bCreatedAt - aCreatedAt;
}

function buildVehicleImageLookup(imageRows: Doc<"oem_vehicle_images">[]) {
  const rowsByVehicleId = new Map<string, Doc<"oem_vehicle_images">[]>();

  for (const row of imageRows) {
    const key = String(row.vehicle_id);
    const bucket = rowsByVehicleId.get(key);
    if (bucket) {
      bucket.push(row);
    } else {
      rowsByVehicleId.set(key, [row]);
    }
  }

  return rowsByVehicleId;
}

async function getVehicleImageRows(
  ctx: QueryCtx,
  vehicleId: Id<"oem_vehicles">,
  limit = 8,
) {
  return await ctx.db
    .query("oem_vehicle_images")
    .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
    .take(limit);
}

function resolveVehicleImageFields(
  vehicle: {
    _id: Id<"oem_vehicles">;
    good_pic_url?: string | null;
    bad_pic_url?: string | null;
  },
  imageRowsByVehicleId: Map<string, Doc<"oem_vehicle_images">[]>,
) {
  const imageRows = imageRowsByVehicleId.get(String(vehicle._id)) ?? [];
  if (imageRows.length === 0) {
    return {
      good_pic_url: cleanOptionalString(vehicle.good_pic_url),
      bad_pic_url: cleanOptionalString(vehicle.bad_pic_url),
    };
  }

  const bestByType = new Map<string, Doc<"oem_vehicle_images">>();
  for (const row of [...imageRows].sort(compareVehicleImageRows)) {
    if (!bestByType.has(row.image_type)) {
      bestByType.set(row.image_type, row);
    }
  }

  return {
    good_pic_url:
      cleanOptionalString(bestByType.get("good")?.url) ??
      cleanOptionalString(vehicle.good_pic_url),
    bad_pic_url:
      cleanOptionalString(bestByType.get("bad")?.url) ??
      cleanOptionalString(vehicle.bad_pic_url),
  };
}

function compareCollectionAssetImages(
  a: {
    isPrimary?: boolean | null;
    sortOrder?: number | null;
    createdAt?: string | null;
  },
  b: {
    isPrimary?: boolean | null;
    sortOrder?: number | null;
    createdAt?: string | null;
  },
) {
  const primaryCompare = Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary));
  if (primaryCompare !== 0) return primaryCompare;

  const aSort = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
  const bSort = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;
  if (aSort !== bSort) return aSort - bSort;

  const aCreatedAt = Date.parse(a.createdAt ?? "") || 0;
  const bCreatedAt = Date.parse(b.createdAt ?? "") || 0;
  return bCreatedAt - aCreatedAt;
}

type CollectionAssetImageRow = {
  id: string;
  url: string;
  imageType: string;
  role: string | null;
  visibility: string | null;
  sortOrder: number | null;
  isPrimary: boolean;
  createdAt: string | null;
  isSynthetic: boolean;
  storageId: string | null;
  fileStorageId: string | null;
};

function normalizeCollectionAssetImage(
  row: {
    _id: string;
    url: string;
    image_type: string;
    storage_id?: string;
    file_storage_id?: Id<"oem_file_storage">;
    role?: string;
    visibility?: string;
    sort_order?: number;
    is_primary?: boolean;
    created_at?: string;
  },
  primaryUrlByType: Map<string, string>,
): CollectionAssetImageRow {
  const url = cleanOptionalString(row.url) ?? "";
  return {
    id: String(row._id),
    url,
    imageType: row.image_type,
    role: cleanOptionalString(row.role) ?? null,
    visibility: cleanOptionalString(row.visibility) ?? null,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : null,
    isPrimary: Boolean(row.is_primary) || primaryUrlByType.get(row.image_type) === url,
    createdAt: cleanOptionalString(row.created_at) ?? null,
    isSynthetic: false,
    storageId: cleanOptionalString(row.storage_id) ?? null,
    fileStorageId: row.file_storage_id ? String(row.file_storage_id) : null,
  };
}

function addLegacyAssetImage(
  rows: CollectionAssetImageRow[],
  imageType: string,
  url: string | null | undefined,
) {
  const cleanUrl = cleanOptionalString(url);
  if (!cleanUrl) return;
  if (rows.some((row) => row.imageType === imageType && row.url === cleanUrl)) return;
  rows.push({
    id: `legacy:${imageType}:${cleanUrl}`,
    url: cleanUrl,
    imageType,
    role: imageType,
    visibility: "public",
    sortOrder: null,
    isPrimary: true,
    createdAt: null,
    isSynthetic: true,
    storageId: null,
    fileStorageId: null,
  });
}

export const collectionItemAssetImages = query({
  args: {
    itemType: v.union(
      v.literal("brand"),
      v.literal("vehicle"),
      v.literal("wheel"),
      v.literal("engine"),
      v.literal("color"),
      v.literal("vehicle_variant"),
      v.literal("wheel_variant"),
    ),
    id: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_engines"),
      v.id("oem_colors"),
      v.id("oem_vehicle_variants"),
      v.id("oem_wheel_variants"),
    ),
  },
  handler: async (ctx, args) => {
    const rows: CollectionAssetImageRow[] = [];

    switch (args.itemType) {
      case "brand": {
        const brand = await ctx.db.get(args.id as Id<"oem_brands">);
        if (!brand) return [];
        const primaryUrlByType = new Map([
          ["brand", cleanOptionalString(brand.brand_image_url) ?? ""],
          ["good", cleanOptionalString(brand.good_pic_url) ?? ""],
          ["bad", cleanOptionalString(brand.bad_pic_url) ?? ""],
        ]);
        const imageRows = await ctx.db
          .query("oem_brand_images")
          .withIndex("by_brand", (q) => q.eq("brand_id", brand._id))
          .collect();
        rows.push(...imageRows.map((row) => normalizeCollectionAssetImage(row, primaryUrlByType)));
        addLegacyAssetImage(rows, "brand", brand.brand_image_url);
        addLegacyAssetImage(rows, "good", brand.good_pic_url);
        addLegacyAssetImage(rows, "bad", brand.bad_pic_url);
        break;
      }
      case "vehicle": {
        const vehicle = await ctx.db.get(args.id as Id<"oem_vehicles">);
        if (!vehicle) return [];
        const primaryUrlByType = new Map([
          ["good", cleanOptionalString(vehicle.good_pic_url) ?? ""],
          ["bad", cleanOptionalString(vehicle.bad_pic_url) ?? ""],
        ]);
        const imageRows = await ctx.db
          .query("oem_vehicle_images")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicle._id))
          .collect();
        rows.push(...imageRows.map((row) => normalizeCollectionAssetImage(row, primaryUrlByType)));
        addLegacyAssetImage(rows, "good", vehicle.good_pic_url);
        addLegacyAssetImage(rows, "bad", vehicle.bad_pic_url);
        break;
      }
      case "wheel": {
        const wheel = await ctx.db.get(args.id as Id<"oem_wheels">);
        if (!wheel) return [];
        const primaryUrlByType = new Map([
          ["good", cleanOptionalString(wheel.good_pic_url) ?? ""],
          ["bad", cleanOptionalString(wheel.bad_pic_url) ?? ""],
        ]);
        const imageRows = await ctx.db
          .query("oem_wheel_images")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", wheel._id))
          .collect();
        rows.push(...imageRows.map((row) => normalizeCollectionAssetImage(row, primaryUrlByType)));
        addLegacyAssetImage(rows, "good", wheel.good_pic_url);
        addLegacyAssetImage(rows, "bad", wheel.bad_pic_url);
        break;
      }
      case "wheel_variant": {
        const variant = await ctx.db.get(args.id as Id<"oem_wheel_variants">);
        if (!variant) return [];
        const primaryUrlByType = new Map([
          ["good", cleanOptionalString(variant.good_pic_url) ?? ""],
          ["bad", cleanOptionalString(variant.bad_pic_url) ?? ""],
        ]);
        const imageRows = await ctx.db
          .query("oem_wheel_variant_images")
          .withIndex("by_variant", (q) => q.eq("variant_id", variant._id))
          .collect();
        rows.push(...imageRows.map((row) => normalizeCollectionAssetImage(row, primaryUrlByType)));
        addLegacyAssetImage(rows, "good", variant.good_pic_url);
        addLegacyAssetImage(rows, "bad", variant.bad_pic_url);
        break;
      }
      case "engine": {
        const engine = await ctx.db.get(args.id as Id<"oem_engines">);
        if (!engine) return [];
        addLegacyAssetImage(rows, "good", engine.good_pic_url);
        addLegacyAssetImage(rows, "bad", engine.bad_pic_url);
        break;
      }
      case "color": {
        const color = await ctx.db.get(args.id as Id<"oem_colors">);
        if (!color) return [];
        addLegacyAssetImage(rows, "good", color.good_pic_url);
        addLegacyAssetImage(rows, "bad", color.bad_pic_url);
        break;
      }
      case "vehicle_variant": {
        const variant = await ctx.db.get(args.id as Id<"oem_vehicle_variants">);
        if (!variant) return [];
        addLegacyAssetImage(rows, "good", variant.good_pic_url);
        addLegacyAssetImage(rows, "bad", variant.bad_pic_url);
        break;
      }
      default:
        return [];
    }

    return rows.sort(compareCollectionAssetImages);
  },
});

type VehicleFitmentLookups = {
  boltByVehicleId: Map<string, string[]>;
  centerByVehicleId: Map<string, string[]>;
  diameterByVehicleId: Map<string, string[]>;
  widthByVehicleId: Map<string, string[]>;
};

function buildVehicleMetricLookup(rows: any[], field: "bolt_pattern" | "center_bore" | "diameter" | "width") {
  const byVehicleId = new Map<string, string[]>();
  for (const row of rows) {
    const vehicleId = row.vehicle_id ? String(row.vehicle_id) : null;
    const value = cleanOptionalString(row[field] ?? null);
    if (!vehicleId || !value) continue;
    const bucket = byVehicleId.get(vehicleId);
    if (bucket) {
      bucket.push(value);
    } else {
      byVehicleId.set(vehicleId, [value]);
    }
  }
  return byVehicleId;
}

async function buildVehicleFitmentLookups(ctx: QueryCtx): Promise<VehicleFitmentLookups> {
  const [boltRows, centerRows, diameterRows, widthRows] = await Promise.all([
    ctx.db.query("j_vehicle_bolt_pattern").collect(),
    ctx.db.query("j_vehicle_center_bore").collect(),
    ctx.db.query("j_vehicle_diameter").collect(),
    ctx.db.query("j_vehicle_width").collect(),
  ]);

  return {
    boltByVehicleId: buildVehicleMetricLookup(boltRows, "bolt_pattern"),
    centerByVehicleId: buildVehicleMetricLookup(centerRows, "center_bore"),
    diameterByVehicleId: buildVehicleMetricLookup(diameterRows, "diameter"),
    widthByVehicleId: buildVehicleMetricLookup(widthRows, "width"),
  };
}

function joinMetricValues(values: string[] | undefined, fallback?: string | null) {
  const canonical = uniqueSortedStrings(values ?? []).join(", ");
  return cleanOptionalString(canonical) ?? cleanOptionalString(fallback ?? null);
}

function resolveVehicleFitmentAliases(
  vehicle: {
    _id: Id<"oem_vehicles">;
    text_bolt_patterns?: string | null;
    text_center_bores?: string | null;
    text_diameters?: string | null;
    text_widths?: string | null;
  },
  lookups: VehicleFitmentLookups,
) {
  const key = String(vehicle._id);
  return {
    bolt_pattern: joinMetricValues(lookups.boltByVehicleId.get(key), vehicle.text_bolt_patterns),
    center_bore: joinMetricValues(lookups.centerByVehicleId.get(key), vehicle.text_center_bores),
    diameter: joinMetricValues(lookups.diameterByVehicleId.get(key), vehicle.text_diameters),
    width: joinMetricValues(lookups.widthByVehicleId.get(key), vehicle.text_widths),
  };
}

const resolveVehicleVariantDoc = async (
  ctx: QueryCtx,
  id: string | Id<"oem_vehicle_variants">
) => {
  if (typeof id !== "string") {
    return await ctx.db.get("oem_vehicle_variants", id);
  }

  if (isConvexIdLike(id)) {
    const byConvexId = await ctx.db.get("oem_vehicle_variants", id as Id<"oem_vehicle_variants">);
    if (byConvexId) return byConvexId;
  }

  const bySlug = await ctx.db
    .query("oem_vehicle_variants")
    .withIndex("by_slug", (q) => q.eq("slug", id))
    .first();
  if (bySlug) return bySlug;

  return await ctx.db
    .query("oem_vehicle_variants")
    .filter((q) =>
      q.or(
        q.eq(q.field("variant_title"), id),
        q.eq(q.field("trim_level"), id),
      )
    )
    .first();
};

const resolveWheelVariantDoc = async (
  ctx: QueryCtx,
  id: string | Id<"oem_wheel_variants">
) => {
  if (typeof id !== "string") {
    return await ctx.db.get("oem_wheel_variants", id);
  }

  if (isConvexIdLike(id)) {
    const byConvexId = await ctx.db.get("oem_wheel_variants", id as Id<"oem_wheel_variants">);
    if (byConvexId) return byConvexId;
  }

  const bySlug = await ctx.db
    .query("oem_wheel_variants")
    .withIndex("by_slug", (q) => q.eq("slug", id))
    .first();
  if (bySlug) return bySlug;

  return await ctx.db
    .query("oem_wheel_variants")
    .filter((q) =>
      q.or(
        q.eq(q.field("variant_title"), id),
        q.eq(q.field("wheel_title"), id),
      )
    )
    .first();
};

// =============================================================================
// OEM BRANDS
// =============================================================================

export const brandsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const brandsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id looks like Convex _id, try db.get first
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_brands", args.id as Id<"oem_brands">);
        if (byConvexId) return byConvexId;
      }
      // 2. Try slug (URL param like "mini" or "mini-cooper")
      const bySlug = await ctx.db
        .query("oem_brands")
        .withIndex("by_slug", (q) => q.eq("slug", args.id))
        .first();
      if (bySlug) return bySlug;
      // 3. Try slug with hyphen-to-title case (e.g. "mini" -> "Mini")
      const titleCase = args.id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      const byTitle = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title", (q) => q.eq("brand_title", titleCase))
        .first();
      if (byTitle) return byTitle;
      // 4. Fall back to business id field
      return await ctx.db
        .query("oem_brands")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

export const brandsGetByTitle = query({
  args: { brandTitle: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title", (q) => q.eq("brand_title", args.brandTitle))
        .first();
    } catch {
      return null;
    }
  },
});

export const brandsGetAllWithCounts = query({
  args: {},
  handler: async (ctx) => {
    try {
      const brands = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const result = await Promise.all(
        brands.map(async (brand) => {
          const vehicleLinks = await ctx.db
            .query("j_vehicle_brand")
            .withIndex("by_brand", (q) => q.eq("brand_id", brand._id))
            .collect();
          const wheelLinks = await ctx.db
            .query("j_wheel_brand")
            .withIndex("by_brand", (q) => q.eq("brand_id", brand._id))
            .collect();
          return {
            ...brand,
            vehicleCount: vehicleLinks.length,
            wheelCount: wheelLinks.length,
          };
        })
      );
      return result;
    } catch {
      return [];
    }
  },
});

export const vehiclesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_vehicles")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const vehiclesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id is a Convex _id, db.get returns the doc (invalid id returns null)
      const byConvexId = await ctx.db.get(
        "oem_vehicles",
        args.id as Id<"oem_vehicles">
      );
      if (byConvexId) return byConvexId;
      // 2. Fall back to business id (slug) — id is optional on oem_vehicles
      const byBusinessId = await ctx.db
        .query("oem_vehicles")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      return byBusinessId ?? null;
    } catch {
      return null;
    }
  },
});

export const vehiclesGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [vehicles, brands, fitmentLookups] = await Promise.all([
        ctx.db
          .query("oem_vehicles")
          .order("asc")
          .collect(),
        ctx.db.query("oem_brands").collect(),
        buildVehicleFitmentLookups(ctx),
      ]);

      const brandById = new Map(brands.map((brand) => [String(brand._id), brand]));
      const brandByTitle = new Map(
        brands
          .map((brand) => [cleanOptionalString(brand.brand_title)?.toLowerCase(), brand] as const)
          .filter((entry): entry is [string, Doc<"oem_brands">] => Boolean(entry[0]))
      );

      return vehicles.map((vehicle) => {
        const textBrand = cleanOptionalString(vehicle.text_brands);
        const brand =
          (vehicle.brand_id ? brandById.get(String(vehicle.brand_id)) : null) ??
          (textBrand ? brandByTitle.get(textBrand.toLowerCase()) : null) ??
          null;

        return {
          ...vehicle,
          good_pic_url: cleanOptionalString(vehicle.good_pic_url),
          bad_pic_url: cleanOptionalString(vehicle.bad_pic_url),
          brand_name: (brand?.brand_title ?? textBrand ?? null) as string | null,
          brand_id: brand?._id ?? vehicle.brand_id ?? null,
          ...resolveVehicleFitmentAliases(vehicle, fitmentLookups),
        };
      });
    } catch (error) {
      console.error("vehiclesGetAllWithBrands failed", error);
      throw error;
    }
  },
});

export const vehiclesGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_vehicle_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const [vehicles, imageRowEntries, fitmentLookups] = await Promise.all([
        Promise.all(links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))),
        Promise.all(
          links.map(async (j) => [
            String(j.vehicle_id),
            await ctx.db
              .query("oem_vehicle_images")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", j.vehicle_id))
              .collect(),
            ] as const),
        ),
        buildVehicleFitmentLookups(ctx),
      ]);
      const imageRowsByVehicleId = new Map(imageRowEntries);
      return vehicles
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((vehicle) => ({
          ...vehicle,
          ...resolveVehicleFitmentAliases(vehicle, fitmentLookups),
          ...resolveVehicleImageFields(vehicle, imageRowsByVehicleId),
        }));
    } catch {
      return [];
    }
  },
});

export const vehicleVariantsGetByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const variants = await ctx.db
        .query("oem_vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      const variantsWithEngines = await Promise.all(
        variants.map((variant) => getVehicleVariantEngineLayers(ctx, variant))
      );

      return variantsWithEngines.sort(
        (a, b) => (a.year_from ?? 0) - (b.year_from ?? 0)
      );
    } catch {
      return [];
    }
  },
});

export const vehicleVariantGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_vehicle_variants")),
  },
  handler: async (ctx, args) => {
    try {
      const rawVariant = await resolveVehicleVariantDoc(ctx, args.id);
      if (!rawVariant) return null;

      const variant = await getVehicleVariantEngineLayers(ctx, rawVariant);
      const [
        parentVehicle,
        parentVehicleImageRows,
        brandLink,
        bodyStyleLinks,
        driveTypeLinks,
        marketLinks,
        boltPatternLinks,
        centerBoreLinks,
        diameterLinks,
        widthLinks,
        offsetLinks,
        colorLinks,
        tireSizeLinks,
        partNumberLinks,
        wheelVariantLinks,
      ] = await Promise.all([
        variant.vehicle_id ? ctx.db.get(variant.vehicle_id) : null,
        variant.vehicle_id
          ? ctx.db
              .query("oem_vehicle_images")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", variant.vehicle_id!))
              .collect()
          : [],
        variant.vehicle_id
          ? ctx.db
              .query("j_vehicle_brand")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", variant.vehicle_id!))
              .first()
          : null,
        ctx.db
          .query("j_oem_vehicle_variant_body_style")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_drive_type")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_market")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_bolt_pattern")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_center_bore")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_diameter")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_width")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_offset")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_color")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_tire_size")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_part_number")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_wheel_variant")
          .withIndex("by_oem_vehicle_variant", (q) => q.eq("vehicle_variant_id", variant._id))
          .collect(),
      ]);

      const brand = brandLink ? await ctx.db.get(brandLink.brand_id) : null;
      const linkedWheelVariantsRaw = await Promise.all(
        wheelVariantLinks.map((link) => ctx.db.get(link.wheel_variant_id))
      );
      const linkedWheelParents = await Promise.all(
        linkedWheelVariantsRaw.map((wheelVariant) =>
          wheelVariant?.wheel_id ? ctx.db.get(wheelVariant.wheel_id) : null
        )
      );

      const linkedWheelVariants = linkedWheelVariantsRaw
        .map((wheelVariant, index) => {
          if (!wheelVariant) return null;
          const parentWheel = linkedWheelParents[index];
          return {
            ...wheelVariant,
            parent_wheel_id: parentWheel?._id ?? null,
            parent_wheel_title: parentWheel?.wheel_title ?? null,
            parent_wheel_slug: parentWheel?.slug ?? null,
          };
        })
        .filter((wheelVariant): wheelVariant is NonNullable<typeof wheelVariant> => wheelVariant !== null)
        .sort((a, b) => {
          const aTitle = (a.variant_title ?? a.wheel_title ?? "").trim();
          const bTitle = (b.variant_title ?? b.wheel_title ?? "").trim();
          return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
        });

      return {
        ...variant,
        body_styles: uniqueSortedStrings(bodyStyleLinks.map((link) => link.body_style)),
        drive_types: uniqueSortedStrings(driveTypeLinks.map((link) => link.drive_type)),
        markets: uniqueSortedStrings([variant.market, ...marketLinks.map((link) => link.market)]),
        bolt_patterns: uniqueSortedStrings(boltPatternLinks.map((link) => link.bolt_pattern)),
        center_bores: uniqueSortedStrings(centerBoreLinks.map((link) => link.center_bore)),
        diameters: uniqueSortedStrings(diameterLinks.map((link) => link.diameter)),
        widths: uniqueSortedStrings(widthLinks.map((link) => link.width)),
        offsets: uniqueSortedStrings(offsetLinks.map((link) => link.offset)),
        colors: uniqueSortedStrings(colorLinks.map((link) => link.color)),
        tire_sizes: uniqueSortedStrings(tireSizeLinks.map((link) => link.tire_size)),
        part_numbers: uniqueSortedStrings(partNumberLinks.map((link) => link.part_number)),
        parent_vehicle: parentVehicle
          ? {
              ...parentVehicle,
              ...resolveVehicleImageFields(
                parentVehicle,
                new Map([[String(parentVehicle._id), parentVehicleImageRows]])
              ),
              brand_title: brand?.brand_title ?? null,
            }
          : null,
        linked_wheel_variants: linkedWheelVariants,
      };
    } catch {
      return null;
    }
  },
});

export const vehiclesGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_vehicles")),
  },
  handler: async (ctx, args) => {
    try {
      let vehicle = null;
      if (typeof args.id === "string") {
        // Try Convex _id first (format: alphanumeric, typically 32 chars)
        if (/^[a-z0-9]{20,}$/i.test(args.id)) {
          vehicle = await ctx.db.get("oem_vehicles", args.id as Id<"oem_vehicles">);
        }
        if (!vehicle) {
          vehicle = await ctx.db
            .query("oem_vehicles")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first();
        }
        if (!vehicle) {
          vehicle = await ctx.db
            .query("oem_vehicles")
            .filter((q) =>
              q.or(
                q.eq(q.field("vehicle_title"), args.id),
                q.eq(q.field("model_name"), args.id),
                q.eq(q.field("slug"), args.id)
              )
            )
            .first();
        }
      } else {
        vehicle = await ctx.db.get("oem_vehicles", args.id);
      }
      if (!vehicle) return null;

      const vehicleId = vehicle._id;
      const [variants, wheelLinks, engineLinks, directVehicleEngine, vehicleImageRows] = await Promise.all([
        ctx.db
          .query("oem_vehicle_variants")
          .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
        ctx.db
          .query("j_wheel_vehicle")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
        ctx.db
          .query("j_vehicle_engine")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
        vehicle.oem_engine_id ? ctx.db.get("oem_engines", vehicle.oem_engine_id) : null,
        ctx.db
          .query("oem_vehicle_images")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
      ]);
      const resolvedVehicle = {
        ...vehicle,
        ...resolveVehicleImageFields(vehicle, new Map([[String(vehicleId), vehicleImageRows]])),
      };

      const wheelDocs = await Promise.all(
        wheelLinks.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      const linkedEngineDocs = await Promise.all(
        engineLinks.map((j) => ctx.db.get("oem_engines", j.engine_id))
      );
      const engineMap = new Map<string, NonNullable<(typeof linkedEngineDocs)[number]>>();
      if (directVehicleEngine) {
        engineMap.set(String(directVehicleEngine._id), directVehicleEngine);
      }
      for (const engine of linkedEngineDocs) {
        if (!engine) continue;
        engineMap.set(String(engine._id), engine);
      }

      return {
        ...resolvedVehicle,
        brand: null,
        engine: null,
        engines: Array.from(engineMap.values()),
        variants: await Promise.all(
          (variants ?? []).map((variant) => getVehicleVariantEngineLayers(ctx, variant))
        ),
        wheels: wheelDocs.filter((w): w is NonNullable<typeof w> => w !== null),
      };
    } catch {
      return null;
    }
  },
});

// =============================================================================
// OEM ENGINES
// =============================================================================

function cleanEngineValue(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeEngineValue(value: unknown) {
  return cleanEngineValue(value).toLowerCase();
}

function slugifyEngineValue(value: unknown) {
  return cleanEngineValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeEngineCodeRoot(value: unknown) {
  const raw = cleanEngineValue(value).toUpperCase();
  if (!raw) return "";
  if (raw === "AJ16S") return "AJ16";
  if (raw === "AJ34S") return "AJ34";
  return raw;
}

function normalizeEngineLayoutToken(value: unknown) {
  const raw = normalizeEngineValue(value).replace(/\s+/g, "");
  if (!raw) return null;
  if (raw.includes("inline-4") || raw.includes("inline4") || raw === "i4") return "I4";
  if (raw.includes("inline-5") || raw.includes("inline5") || raw === "i5") return "I5";
  if (raw.includes("inline-6") || raw.includes("inline6") || raw === "i6") return "I6";
  if (raw.includes("v12")) return "V12";
  if (raw.includes("v8")) return "V8";
  if (raw.includes("v6")) return "V6";
  if (raw.includes("v4")) return "V4";
  return cleanEngineValue(value) || null;
}

function buildEngineFamilyDescriptor(
  engine: Doc<"oem_engines">,
  brandTitle?: string | null,
) {
  const root = normalizeEngineCodeRoot(engine.engine_code);
  if (!root) return null;

  const layoutToken =
    normalizeEngineLayoutToken(engine.engine_layout) ??
    normalizeEngineLayoutToken(engine.configuration);

  switch (root) {
    case "INGENIUM":
      if (layoutToken === "I4" || layoutToken === "I6") {
        return {
          key: `ingenium-${layoutToken.toLowerCase()}`,
          title: `Ingenium ${layoutToken}`,
          code: "Ingenium",
          configuration: engine.configuration ?? layoutToken,
          engineLayout: engine.engine_layout ?? layoutToken,
          cylinders: engine.cylinders ?? (layoutToken === "I4" ? 4 : 6),
        };
      }
      return {
        key: "ingenium",
        title: "Ingenium",
        code: "Ingenium",
        configuration: engine.configuration ?? null,
        engineLayout: engine.engine_layout ?? null,
        cylinders: engine.cylinders ?? null,
      };
    case "AJ16":
      return {
        key: "aj16",
        title: "AJ16",
        code: "AJ16",
        configuration: engine.configuration ?? "Inline-6",
        engineLayout: engine.engine_layout ?? "Inline-6",
        cylinders: engine.cylinders ?? 6,
      };
    case "AJ-V8":
      return {
        key: "aj-v8",
        title: "AJ-V8",
        code: "AJ-V8",
        configuration: engine.configuration ?? "V8",
        engineLayout: engine.engine_layout ?? "V8",
        cylinders: engine.cylinders ?? 8,
      };
    case "AJ34":
      return {
        key: "aj34",
        title: "AJ34",
        code: "AJ34",
        configuration: engine.configuration ?? "V8",
        engineLayout: engine.engine_layout ?? "V8",
        cylinders: engine.cylinders ?? 8,
      };
    case "AJ126":
      return {
        key: "aj126",
        title: "AJ126",
        code: "AJ126",
        configuration: engine.configuration ?? "V6",
        engineLayout: engine.engine_layout ?? "V6",
        cylinders: engine.cylinders ?? 6,
      };
    case "AJ133":
      return {
        key: "aj133",
        title: "AJ133",
        code: "AJ133",
        configuration: engine.configuration ?? "V8",
        engineLayout: engine.engine_layout ?? "V8",
        cylinders: engine.cylinders ?? 8,
      };
    case "ROVER V8":
      return {
        key: "rover-v8",
        title: "Rover V8",
        code: "Rover V8",
        configuration: engine.configuration ?? "V8",
        engineLayout: engine.engine_layout ?? "V8",
        cylinders: engine.cylinders ?? 8,
      };
    case "PUMA":
      return {
        key: "puma",
        title: "Puma",
        code: "Puma",
        configuration: engine.configuration ?? "Inline-4",
        engineLayout: engine.engine_layout ?? "Inline-4",
        cylinders: engine.cylinders ?? 4,
      };
    case "TDV6":
      return {
        key: "tdv6",
        title: "TDV6",
        code: "TDV6",
        configuration: engine.configuration ?? "V6",
        engineLayout: engine.engine_layout ?? "V6",
        cylinders: engine.cylinders ?? 6,
      };
    case "TDV8":
      return {
        key: "tdv8",
        title: "TDV8",
        code: "TDV8",
        configuration: engine.configuration ?? "V8",
        engineLayout: engine.engine_layout ?? "V8",
        cylinders: engine.cylinders ?? 8,
      };
    case "TD5":
      return {
        key: "td5",
        title: "Td5",
        code: "Td5",
        configuration: engine.configuration ?? "Inline-5",
        engineLayout: engine.engine_layout ?? "Inline-5",
        cylinders: engine.cylinders ?? 5,
      };
    default:
      return null;
  }
}

function resolveEngineFamilyTitle(
  familyEngine: Doc<"oem_engines"> | null | undefined,
  descriptor: ReturnType<typeof buildEngineFamilyDescriptor>,
) {
  const descriptorCode = normalizeEngineCodeRoot(descriptor?.code);
  if (descriptorCode === "INGENIUM") {
    const layoutToken =
      normalizeEngineLayoutToken(descriptor?.engineLayout) ??
      normalizeEngineLayoutToken(descriptor?.configuration) ??
      normalizeEngineLayoutToken(familyEngine?.engine_layout) ??
      normalizeEngineLayoutToken(familyEngine?.configuration);
    if (layoutToken === "I4" || layoutToken === "I6") {
      return `Ingenium ${layoutToken}`;
    }
  }

  return (
    descriptor?.title ||
    cleanEngineValue(familyEngine?.engine_title) ||
    cleanEngineValue(familyEngine?.engine_code) ||
    "Engine"
  );
}

function isGenericFamilyEngineRow(
  engine: Doc<"oem_engines">,
  descriptor: ReturnType<typeof buildEngineFamilyDescriptor>,
) {
  if (!descriptor) return false;
  const title = normalizeEngineValue(engine.engine_title);
  return (
    title === normalizeEngineValue(descriptor.title) ||
    normalizeEngineValue(engine.id) === normalizeEngineValue(descriptor.key) ||
    normalizeEngineValue(engine.slug) === normalizeEngineValue(descriptor.key)
  );
}

function summarizeNumericDisplacements(values: Array<number | null | undefined>) {
  const unique = [...new Set(values.filter((value): value is number => typeof value === "number" && value > 0))]
    .sort((a, b) => a - b);
  if (unique.length === 0) return null;
  if (unique.length === 1) return `${unique[0]}L`;
  return `${unique[0]}-${unique[unique.length - 1]}L`;
}

function summarizeTextValues(values: Array<string | null | undefined>, maxItems = 3) {
  const unique = [...new Set(
    values
      .map((value) => cleanEngineValue(value))
      .filter((value) => value.length > 0),
  )];
  if (unique.length === 0) return null;
  if (unique.length <= maxItems) return unique.join(" / ");
  return `${unique.slice(0, maxItems).join(" / ")} +${unique.length - maxItems}`;
}

async function buildEngineFamilyBrowseRows(ctx: QueryCtx) {
  const [engines, engineVariants, brands, vehicleLinks, vehicles, engineBrandLinks] = await Promise.all([
    ctx.db.query("oem_engines").collect(),
    ctx.db.query("oem_engine_variants").collect(),
    ctx.db.query("oem_brands").collect(),
    ctx.db.query("j_vehicle_engine").collect(),
    ctx.db.query("oem_vehicles").collect(),
    ctx.db.query("j_engine_brand").collect(),
  ]);

  const brandById = new Map(brands.map((brand) => [String(brand._id), brand]));
  const engineById = new Map(engines.map((engine) => [String(engine._id), engine]));
  const vehicleById = new Map(vehicles.map((vehicle) => [String(vehicle._id), vehicle]));

  const groups = new Map<
    string,
    {
      key: string;
      brandTitle: string | null;
      descriptor: ReturnType<typeof buildEngineFamilyDescriptor>;
      engines: Doc<"oem_engines">[];
      exactVariants: Doc<"oem_engine_variants">[];
      vehicleIds: Set<string>;
      brandTitles: Set<string>;
      familyEngine: Doc<"oem_engines"> | null;
    }
  >();

  const ensureGroup = (engine: Doc<"oem_engines">) => {
    const brandTitle = brandById.get(String(engine.brand_id ?? ""))?.brand_title ?? null;
    const descriptor = buildEngineFamilyDescriptor(engine, brandTitle);
    const key = descriptor?.key ?? String(engine._id);
    const existing = groups.get(key);
    if (existing) return existing;
    const created = {
      key,
      brandTitle,
      descriptor,
      engines: [],
      exactVariants: [],
      vehicleIds: new Set<string>(),
      brandTitles: new Set(brandTitle ? [brandTitle] : []),
      familyEngine: null,
    };
    groups.set(key, created);
    return created;
  };

  for (const engine of engines) {
    const group = ensureGroup(engine);
    group.engines.push(engine);
    const engineBrandTitle = brandById.get(String(engine.brand_id ?? ""))?.brand_title ?? null;
    if (engineBrandTitle) {
      group.brandTitles.add(engineBrandTitle);
    }
    if (!group.familyEngine && isGenericFamilyEngineRow(engine, group.descriptor)) {
      group.familyEngine = engine;
    }
  }

  for (const variant of engineVariants) {
    const parent = engineById.get(String(variant.engine_id));
    if (!parent) continue;
    ensureGroup(parent).exactVariants.push(variant);
  }

  for (const link of vehicleLinks) {
    const parent = engineById.get(String(link.engine_id));
    if (!parent) continue;
    ensureGroup(parent).vehicleIds.add(String(link.vehicle_id));
  }

  for (const link of engineBrandLinks) {
    const parent = engineById.get(String(link.engine_id));
    if (!parent) continue;
    const brandTitle = brandById.get(String(link.brand_id))?.brand_title ?? (cleanEngineValue(link.brand_title) || null);
    if (!brandTitle) continue;
    ensureGroup(parent).brandTitles.add(brandTitle);
  }

  const rows = Array.from(groups.values()).map((group) => {
    const familyEngine = group.familyEngine ?? group.engines[0];
    const familyTitle = resolveEngineFamilyTitle(familyEngine, group.descriptor);
    const familyCode = group.descriptor?.code ?? (cleanEngineValue(familyEngine?.engine_code) || null);
    const brandSummary = summarizeTextValues(Array.from(group.brandTitles), 2);
    const syntheticConcreteVariants = group.descriptor
      ? group.engines
          .filter((engine) => !isGenericFamilyEngineRow(engine, group.descriptor))
          .map((engine) => {
            const rootCode = normalizeEngineCodeRoot(engine.engine_code);
            const familyRootCode = normalizeEngineCodeRoot(group.descriptor?.code);
            const exactCode =
              rootCode && familyRootCode && rootCode !== familyRootCode
                ? cleanEngineValue(engine.engine_code)
                : (normalizeEngineValue(engine.engine_code) !== normalizeEngineValue(group.descriptor?.code)
                    ? cleanEngineValue(engine.engine_code)
                    : null);
            return {
              id: `engine-row:${engine._id}`,
              label: exactCode || cleanEngineValue(engine.engine_title) || "Variant",
              title: cleanEngineValue(engine.engine_title) || cleanEngineValue(engine.engine_code) || "Variant",
              engine_variant_code: exactCode,
              powertrain_designation: null,
              displacement_l: engine.displacement_l ?? null,
              fuel_type: engine.fuel_type ?? null,
              aspiration: engine.aspiration ?? null,
              power_hp: engine.power_hp ?? null,
              power_kw: engine.power_kw ?? null,
              source: "engine_row",
            };
          })
      : [];

    const exactVariants = group.exactVariants.map((variant) => ({
      id: `engine-variant:${variant._id}`,
      label:
        cleanEngineValue(variant.powertrain_designation) ||
        cleanEngineValue(variant.engine_variant_code) ||
        cleanEngineValue(variant.engine_variant_title) ||
        "Variant",
      title:
        cleanEngineValue(variant.engine_variant_title) ||
        cleanEngineValue(variant.engine_variant_code) ||
        "Variant",
      engine_variant_code: cleanEngineValue(variant.engine_variant_code) || null,
      powertrain_designation: cleanEngineValue(variant.powertrain_designation) || null,
      displacement_l: variant.displacement_l ?? null,
      fuel_type: variant.engine_variant_fuel_type ?? null,
      aspiration: variant.engine_variant_aspiration ?? null,
      power_hp: variant.engine_variant_power_hp ?? null,
      power_kw: variant.engine_variant_power_kw ?? null,
      source: "engine_variant",
    }));

    const seenVariantKeys = new Set<string>();
    const variants = [...exactVariants, ...syntheticConcreteVariants]
      .filter((variant) => {
        const dedupeKey = `${normalizeEngineValue(variant.label)}::${normalizeEngineValue(variant.title)}`;
        if (seenVariantKeys.has(dedupeKey)) return false;
        seenVariantKeys.add(dedupeKey);
        return true;
      })
      .sort((a, b) => {
        const aPriority = a.powertrain_designation || a.engine_variant_code ? 0 : 1;
        const bPriority = b.powertrain_designation || b.engine_variant_code ? 0 : 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      });

    const linkedVehicles = Array.from(group.vehicleIds)
      .map((vehicleId) => vehicleById.get(vehicleId))
      .filter((vehicle): vehicle is NonNullable<typeof vehicle> => Boolean(vehicle))
      .sort((a, b) =>
        cleanEngineValue(a.vehicle_title ?? a.model_name).localeCompare(
          cleanEngineValue(b.vehicle_title ?? b.model_name),
          undefined,
          { sensitivity: "base" },
        ),
      )
      .map((vehicle) => ({
        _id: vehicle._id,
        id: vehicle.id ?? null,
        slug: vehicle.slug ?? null,
        vehicle_title: vehicle.vehicle_title ?? vehicle.model_name ?? "Unknown Vehicle",
        model_name: vehicle.model_name ?? null,
        production_years: vehicle.production_years ?? null,
        good_pic_url: vehicle.good_pic_url ?? null,
        bad_pic_url: vehicle.bad_pic_url ?? null,
        brand_title: brandById.get(String(vehicle.brand_id ?? ""))?.brand_title ?? null,
      }));

    const displacementSummary = summarizeNumericDisplacements([
      familyEngine?.displacement_l ?? null,
      ...syntheticConcreteVariants.map((variant) => variant.displacement_l),
      ...exactVariants.map((variant) => variant.displacement_l),
    ]);

    const fuelSummary = summarizeTextValues([
      familyEngine?.fuel_type ?? null,
      ...syntheticConcreteVariants.map((variant) => variant.fuel_type),
      ...exactVariants.map((variant) => variant.fuel_type),
    ]);

    const aspirationSummary = summarizeTextValues([
      familyEngine?.aspiration ?? null,
      ...syntheticConcreteVariants.map((variant) => variant.aspiration),
      ...exactVariants.map((variant) => variant.aspiration),
    ]);

    return {
      id: group.key,
      family_key: group.key,
      family_row_id: familyEngine?._id ?? null,
      private_blurb: familyEngine?.private_blurb ?? null,
      good_pic_url: familyEngine?.good_pic_url ?? null,
      bad_pic_url: familyEngine?.bad_pic_url ?? null,
      family_title: familyTitle,
      family_code: familyCode,
      brand_ref: brandSummary,
      configuration: group.descriptor?.configuration ?? familyEngine?.configuration ?? null,
      engine_layout: group.descriptor?.engineLayout ?? familyEngine?.engine_layout ?? null,
      cylinders: group.descriptor?.cylinders ?? familyEngine?.cylinders ?? null,
      displacement_summary: displacementSummary,
      fuel_summary: fuelSummary,
      aspiration_summary: aspirationSummary,
      variant_count: variants.length,
      family_engine_count: group.engines.length,
      linked_vehicle_count: linkedVehicles.length,
      linked_vehicle_titles: linkedVehicles.slice(0, 3).map((vehicle) => vehicle.vehicle_title),
      linked_vehicles: linkedVehicles,
      variants,
      search_text: [
        familyTitle,
        familyCode,
        ...group.engines.map((engine) => engine.engine_title ?? engine.engine_code ?? ""),
        ...variants.flatMap((variant) => [variant.label, variant.title]),
        ...linkedVehicles.map((vehicle) => vehicle.vehicle_title),
      ]
        .map((value) => cleanEngineValue(value))
        .filter((value) => value.length > 0)
        .join(" "),
    };
  });

  return rows.sort((a, b) => {
    const brandCompare = cleanEngineValue(a.brand_ref).localeCompare(cleanEngineValue(b.brand_ref), undefined, {
      sensitivity: "base",
    });
    if (brandCompare !== 0) return brandCompare;
    const titleCompare = cleanEngineValue(a.family_title).localeCompare(cleanEngineValue(b.family_title), undefined, {
      sensitivity: "base",
    });
    if (titleCompare !== 0) return titleCompare;
    return cleanEngineValue(a.id).localeCompare(cleanEngineValue(b.id), undefined, {
      sensitivity: "base",
    });
  });
}

export const enginesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_engines")
        .withIndex("by_engine_code")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

export const enginesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_engines", args.id as Id<"oem_engines">);
        if (byConvexId) return byConvexId;
      }
      const byBusinessId = await ctx.db
        .query("oem_engines")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      if (byBusinessId) return byBusinessId;
      return await ctx.db
        .query("oem_engines")
        .withIndex("by_slug", (q) => q.eq("slug", args.id))
        .first();
    } catch {
      return null;
    }
  },
});

export const engineVariantsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      const rows = await ctx.db.query("oem_engine_variants").collect();
      return rows.sort((a, b) => {
        const titleCompare = String(a.engine_variant_title ?? "").localeCompare(
          String(b.engine_variant_title ?? ""),
          undefined,
          { sensitivity: "base" },
        );
        if (titleCompare !== 0) return titleCompare;
        const codeCompare = String(a.engine_variant_code ?? "").localeCompare(
          String(b.engine_variant_code ?? ""),
          undefined,
          { sensitivity: "base" },
        );
        if (codeCompare !== 0) return codeCompare;
        return String(a._id).localeCompare(String(b._id));
      });
    } catch {
      return [];
    }
  },
});

export const engineFamiliesBrowse = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await buildEngineFamilyBrowseRows(ctx);
    } catch {
      return [];
    }
  },
});

export const engineFamiliesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const rows = await buildEngineFamilyBrowseRows(ctx);
      const normalized = normalizeEngineValue(args.id);
      return (
        rows.find((row) => normalizeEngineValue(row.id) === normalized) ??
        rows.find((row) => normalizeEngineValue(row.family_row_id) === normalized) ??
        null
      );
    } catch {
      return null;
    }
  },
});

export const enginesGetByCode = query({
  args: { engineCode: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_engines")
        .withIndex("by_engine_code", (q) => q.eq("engine_code", args.engineCode))
        .first();
    } catch {
      return null;
    }
  },
});

export const engineVariantsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_engine_variants", args.id as Id<"oem_engine_variants">);
        if (byConvexId) return byConvexId;
      }
      const byBusinessId = await ctx.db
        .query("oem_engine_variants")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      if (byBusinessId) return byBusinessId;
      return await ctx.db
        .query("oem_engine_variants")
        .withIndex("by_slug", (q) => q.eq("slug", args.id))
        .first();
    } catch {
      return null;
    }
  },
});

export const engineVariantsGetByCode = query({
  args: { engineVariantCode: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_engine_variants")
        .withIndex("by_engine_variant_code", (q) => q.eq("engine_variant_code", args.engineVariantCode))
        .first();
    } catch {
      return null;
    }
  },
});

export const engineVariantsGetByEngine = query({
  args: { engineId: v.id("oem_engines") },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_engine_variants")
        .withIndex("by_engine_id", (q) => q.eq("engine_id", args.engineId))
        .collect();
    } catch {
      return [];
    }
  },
});

export const vehiclesGetByEngine = query({
  args: { engineId: v.id("oem_engines") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_vehicle_engine")
        .withIndex("by_engine", (q) => q.eq("engine_id", args.engineId))
        .collect();
      const [vehicles, imageRowEntries] = await Promise.all([
        Promise.all(links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))),
        Promise.all(
          links.map(async (j) => [
            String(j.vehicle_id),
            await ctx.db
              .query("oem_vehicle_images")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", j.vehicle_id))
              .collect(),
          ] as const),
        ),
      ]);
      const imageRowsByVehicleId = new Map(imageRowEntries);
      return vehicles
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((vehicle) => ({
          ...vehicle,
          ...resolveVehicleImageFields(vehicle, imageRowsByVehicleId),
          brand_name: null as string | null,
        }));
    } catch {
      return [];
    }
  },
});

// =============================================================================
// OEM WHEELS
// =============================================================================

export const wheelsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db
        .query("oem_wheels")
        .order("asc")
        .collect();
    } catch {
      return [];
    }
  },
});

/** Split a spec string by common separators and return trimmed non-empty parts. */
function splitSpecValues(raw: string): string[] {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/[,;|\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Split diameter/width string that may be space-separated ("19 inch 20 inch") into parts. */
function splitSpecValuesWithSpaces(raw: string): string[] {
  const byComma = splitSpecValues(raw);
  const out: string[] = [];
  for (const part of byComma) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const spaceSplit = trimmed.split(/\s+(?=\d)/);
    for (const s of spaceSplit) {
      const t = s.trim();
      if (t) out.push(t);
    }
  }
  return out.length ? out : byComma;
}

/** Canonical diameter for filter display: "17 inch" / "17\"" -> "17", else strip " inch" and trim. */
function normalizeDiameterOption(v: string): string {
  const n = v.replace(/\s*inch\s*/gi, "").replace(/[""]/g, "").trim();
  const num = /^\d+(\.\d+)?$/.test(n) ? n : v.trim();
  return num || v.trim();
}

/** Canonical width for filter display: "8.5J" -> "8.5", "8" -> "8". */
function normalizeWidthOption(v: string): string {
  const n = v.replace(/\s*J\s*$/gi, "").trim();
  return /^\d+(\.\d+)?$/.test(n) ? n : v.trim();
}

/** Display diameter exactly as requested: "18 inch". */
function formatDiameterOption(v: string): string {
  const n = parseFloat(normalizeDiameterOption(v));
  return Number.isNaN(n) ? v.trim() : `${Number.isInteger(n) ? String(n) : String(n)} inch`;
}

/** Display width exactly as requested: "8.5J", "10.0J". */
function formatWidthOption(v: string): string {
  const n = parseFloat(normalizeWidthOption(v));
  return Number.isNaN(n) ? v.trim() : `${n.toFixed(1)}J`;
}

/** Valid rim diameter for filter: 14–24 inch only. */
function isValidDiameterOption(v: string): boolean {
  const n = parseFloat(normalizeDiameterOption(v));
  return !Number.isNaN(n) && n >= 14 && n <= 24;
}

/** Valid rim width for filter: 5–13 inch. */
function isValidWidthOption(v: string): boolean {
  const n = parseFloat(v);
  return !Number.isNaN(n) && n >= 5 && n <= 13;
}

/** Valid bolt pattern: 4x100, 5x112, 5x114.3, 6x139.7 etc. (lugs x PCD 80–160mm). */
function isValidBoltPatternOption(v: string): boolean {
  const normalized = v.replace(/×/g, "x").trim();
  const m = normalized.match(/^(\d)x(\d+(?:\.\d+)?)$/i);
  if (!m) return false;
  const lugs = parseInt(m[1], 10);
  const pcd = parseFloat(m[2]);
  return (lugs === 4 || lugs === 5 || lugs === 6 || lugs === 8) && pcd >= 80 && pcd <= 160;
}

/** Canonical bolt pattern for filter display: "5 x 112.0" -> "5x112". */
function normalizeBoltPatternOption(v: string): string {
  const compact = v.replace(/×/g, "x").replace(/\s+/g, "").trim().toLowerCase();
  const m = compact.match(/^(\d)x(\d+(?:\.\d+)?)$/);
  if (!m) return v.trim();
  const lugs = m[1];
  const pcdNum = parseFloat(m[2]);
  return `${lugs}x${Number.isInteger(pcdNum) ? String(pcdNum) : String(pcdNum)}`;
}

/** Display bolt pattern exactly as requested: "4 x 100". */
function formatBoltPatternOption(v: string): string {
  const normalized = normalizeBoltPatternOption(v);
  const m = normalized.match(/^(\d)x(\d+(?:\.\d+)?)$/i);
  if (!m) return v.trim();
  return `${m[1]} x ${m[2]}`;
}

/** Valid center bore for filter: 50–85mm. */
function isValidCenterBoreOption(v: string): boolean {
  const num = parseFloat(v.replace(/mm\s*$/i, "").trim());
  return !Number.isNaN(num) && num >= 50 && num <= 85;
}

/** Canonical center bore for filter display: "72.6 mm" -> "72.6mm". */
function normalizeCenterBoreOption(v: string): string {
  const num = parseFloat(v.replace(/mm\s*$/i, "").trim());
  if (Number.isNaN(num)) return v.trim();
  return `${num}mm`;
}

/** Canonical tire size for filter display: "245 / 40 r18" -> "245/40R18". */
function normalizeTireSizeOption(v: string): string {
  return v.replace(/\s+/g, "").toUpperCase().trim();
}

/** Valid tire size for filter: standard road and odd OEM sizes like 265/790R540. */
function isValidTireSizeOption(v: string): boolean {
  return /^\d{3}\/\d{2,3}R\d{2,3}$/i.test(normalizeTireSizeOption(v));
}

/** Normalize raw finish/color text into usable filter buckets. */
function normalizeColorOption(v: string): string | null {
  const s = v.trim().toLowerCase();
  if (!s || s === "unknown") return null;
  if (s.includes("black")) return "Black";
  if (s.includes("silver")) return "Silver";
  if (s.includes("chrome")) return "Chrome";
  if (
    s.includes("gunmetal") ||
    s.includes("anthracite") ||
    s.includes("graphite") ||
    s.includes("grey") ||
    s.includes("gray")
  ) return "Gunmetal";
  if (s.includes("white")) return "White";
  if (s.includes("bronze")) return "Bronze";
  if (s.includes("gold")) return "Gold";
  if (s.includes("red")) return "Red";
  if (s.includes("blue")) return "Blue";
  if (s.includes("green")) return "Green";
  if (s.includes("bi-colour") || s.includes("bi-color") || s.includes("bicolor")) return "Bi-Color";
  if (s.includes("machined") || s.includes("diamond turned") || s.includes("polished")) return "Machined";
  return null;
}

/** Collect distinct non-empty values from wheel text_* (comma/semicolon/newline/pipe split). */
function distinctFromWheelText(wheels: { text_diameters?: string | null; text_widths?: string | null; text_bolt_patterns?: string | null; text_center_bores?: string | null; text_colors?: string | null }[], key: "text_diameters" | "text_widths" | "text_bolt_patterns" | "text_center_bores" | "text_colors"): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w[key] ?? "").toString().trim();
    for (const v of splitSpecValues(raw)) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Normalized diameter options for filter: single values like "17", "18", "19" from raw text_diameters. */
function distinctDiametersNormalized(wheels: { text_diameters?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_diameters ?? "").toString().trim();
    for (const v of splitSpecValuesWithSpaces(raw)) {
      const n = normalizeDiameterOption(v);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
}

/** Normalized width options for filter: single values like "8", "8.5", "9". */
function distinctWidthsNormalized(wheels: { text_widths?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_widths ?? "").toString().trim();
    for (const v of splitSpecValuesWithSpaces(raw)) {
      const n = normalizeWidthOption(v);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
}

/** Normalized tire size options like "245/40R18". */
function distinctTireSizesNormalized(wheels: { text_tire_sizes?: string | null }[]): string[] {
  const set = new Set<string>();
  for (const w of wheels) {
    const raw = (w.text_tire_sizes ?? "").toString().trim();
    for (const v of splitSpecValues(raw)) {
      const n = normalizeTireSizeOption(v);
      if (isValidTireSizeOption(n)) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Extract one spec string from parsed specifications_json (same keys as backfill script). */
function specFromJson(
  obj: Record<string, unknown> | null,
  kind: "diameter" | "width" | "bolt" | "centerBore" | "color"
): string[] {
  if (!obj || typeof obj !== "object") return [];
  const out: string[] = [];
  if (kind === "diameter") {
    const v = obj.diameter ?? obj.diameters ?? obj.size ?? obj.rim_diameter ?? obj.wheel_diameter;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "width") {
    const v = obj.width ?? obj.widths ?? obj.rim_width ?? obj.wheel_width ?? obj.j_width;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "bolt") {
    const v = obj.bolt_pattern ?? obj.boltPattern ?? obj.bolt ?? obj.pcd ?? obj.lug_pattern;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "centerBore") {
    const v = obj.center_bore ?? obj.centerBore ?? obj.cb ?? obj.hub_bore;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  } else if (kind === "color") {
    const v = obj.color ?? obj.colors ?? obj.finish;
    if (Array.isArray(v)) out.push(...v.map((x) => String(x).trim()).filter(Boolean));
    else if (v != null) out.push(String(v).trim());
  }
  return out.filter(Boolean);
}

/** Collect distinct non-empty values from vehicle text_* (comma-split). */
function distinctFromVehicleText(
  vehicles: { text_bolt_patterns?: string | null; text_center_bores?: string | null }[],
  key: "text_bolt_patterns" | "text_center_bores"
): string[] {
  const set = new Set<string>();
  for (const v of vehicles) {
    const raw = (v[key] ?? "").toString().trim();
    if (!raw) continue;
    for (const part of raw.split(",")) {
      const s = part.trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Filter options for wheels. Returns global facet values, optionally narrowed by selected brands. */
export const wheelsFilterOptions = query({
  args: { brand: v.optional(v.array(v.string())) },
  handler: async (ctx, args) => {
    const allWheels = await ctx.db.query("oem_wheels").collect();
    const brands = Array.from(
      new Set(
        allWheels.flatMap((wheel) => splitSpecValues(wheel.jnc_brands ?? "").map((value) => value.trim()).filter(Boolean))
      )
    ).sort((a, b) => a.localeCompare(b));

    const selectedBrands = (args.brand ?? []).map((brand) => normalizeForMatch(brand)).filter(Boolean);
    const wheels = allWheels.filter((wheel) => {
      if (selectedBrands.length === 0) return true;
      const brandText = normalizeForMatch(wheel.jnc_brands ?? "");
      return selectedBrands.some((brand) => brandText.includes(brand) || brand.includes(brandText));
    });

    const diameters = distinctDiametersNormalized(wheels);
    const widths = distinctWidthsNormalized(wheels);
    const boltPatterns = distinctFromWheelText(wheels, "text_bolt_patterns");
    const centerBores = distinctFromWheelText(wheels, "text_center_bores");
    const tireSizes = distinctTireSizesNormalized(wheels);
    const colors = Array.from(
      new Set(
        distinctFromWheelText(wheels, "text_colors")
          .map((value) => normalizeColorOption(value))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));

    return {
      brands,
      diameters: diameters.map((d) => formatDiameterOption(d)),
      widths: widths.map((w) => formatWidthOption(w)),
      boltPatterns: boltPatterns.map((b) => formatBoltPatternOption(b)),
      centerBores,
      tireSizes,
      colors,
    };
  },
});

export const vehiclesFilterOptions = query({
  args: {},
  handler: async (ctx) => {
    const vehicleBrandLinks = await ctx.db.query("j_vehicle_brand").collect();
    const brandIds = [
      ...new Set(vehicleBrandLinks.map((link) => link.brand_id as Id<"oem_brands">)),
    ];
    const brandDocs = await Promise.all(
      brandIds.map((id) => ctx.db.get("oem_brands", id))
    );
    const brands = Array.from(
      new Set(
        brandDocs
          .filter((b): b is NonNullable<typeof b> => b !== null)
          .map((b) => (b.brand_title as string | undefined) ?? "")
          .filter((name) => name && name.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    const vehicles = await ctx.db.query("oem_vehicles").collect();

    const vehicleBoltLinks = await ctx.db.query("j_vehicle_bolt_pattern").collect();
    const boltIds = [
      ...new Set(
        vehicleBoltLinks.map(
          (link) => link.bolt_pattern_id as Id<"oem_bolt_patterns">
        )
      ),
    ];
    const boltDocs = await Promise.all(
      boltIds.map((id) => ctx.db.get("oem_bolt_patterns", id))
    );
    let boltPatterns = Array.from(
      new Set(
        boltDocs
          .filter((bp): bp is NonNullable<typeof bp> => bp !== null)
          .map((bp) => (bp.bolt_pattern as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
    if (boltPatterns.length === 0) {
      boltPatterns = distinctFromVehicleText(vehicles, "text_bolt_patterns");
    }

    const vehicleCenterBoreLinks = await ctx.db
      .query("j_vehicle_center_bore")
      .collect();
    const centerBoreIds = [
      ...new Set(
        vehicleCenterBoreLinks.map(
          (link) => link.center_bore_id as Id<"oem_center_bores">
        )
      ),
    ];
    const centerBoreDocs = await Promise.all(
      centerBoreIds.map((id) => ctx.db.get("oem_center_bores", id))
    );
    let centerBores = Array.from(
      new Set(
        centerBoreDocs
          .filter((cb): cb is NonNullable<typeof cb> => cb !== null)
          .map((cb) => (cb.center_bore as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => parseFloat(a) - parseFloat(b));
    if (centerBores.length === 0) {
      centerBores = distinctFromVehicleText(vehicles, "text_center_bores");
    }
    const productionYears = Array.from(
      new Set(
        vehicles
          .map((v) => (v.production_years as string | undefined) ?? "")
          .filter((val) => val && val.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return { brands, boltPatterns, centerBores, productionYears };
  },
});

/** Build a map wheel_id -> joined string from junction rows with a string field. */
function wheelJunctionMap<T extends { wheel_id: Id<"oem_wheels"> }>(
  rows: T[],
  getValue: (r: T) => string
): Record<string, string> {
  const byWheel: Record<string, Set<string>> = {};
  for (const r of rows) {
    const id = r.wheel_id as string;
    if (!byWheel[id]) byWheel[id] = new Set();
    const v = (getValue(r) ?? "").trim();
    if (v) byWheel[id].add(v);
  }
  const out: Record<string, string> = {};
  for (const [id, set] of Object.entries(byWheel)) {
    out[id] = Array.from(set).join(", ");
  }
  return out;
}

export const wheelsGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [wheels, brandLinks, diameterRows, widthRows, boltRows, centerBoreRows, tireSizeRows, colorRows] =
        await Promise.all([
          ctx.db.query("oem_wheels").order("asc").collect(),
          ctx.db.query("j_wheel_brand").collect(),
          ctx.db.query("j_wheel_diameter").collect(),
          ctx.db.query("j_wheel_width").collect(),
          ctx.db.query("j_wheel_bolt_pattern").collect(),
          ctx.db.query("j_wheel_center_bore").collect(),
          ctx.db.query("j_wheel_tire_size").collect(),
          ctx.db.query("j_wheel_color").collect(),
        ]);

      const brandByWheel: Record<string, { brand_id: Id<"oem_brands">; brand_title: string }> = {};
      for (const link of brandLinks) {
        const id = link.wheel_id as string;
        if (!brandByWheel[id] && link.brand_title != null) {
          brandByWheel[id] = { brand_id: link.brand_id, brand_title: String(link.brand_title).trim() };
        }
      }

      const diameterByWheel = wheelJunctionMap(diameterRows, (r) => r.diameter ?? "");
      const widthByWheel = wheelJunctionMap(widthRows, (r) => r.width ?? "");
      const boltByWheel = wheelJunctionMap(boltRows, (r) => r.bolt_pattern ?? "");
      const centerBoreByWheel = wheelJunctionMap(centerBoreRows, (r) => r.center_bore ?? "");
      const tireSizeByWheel = wheelJunctionMap(tireSizeRows, (r) => r.tire_size ?? "");
      const colorByWheel = wheelJunctionMap(colorRows, (r) => r.color ?? "");

      return wheels.map((w) => {
        const wid = w._id as string;
        const brand = brandByWheel[wid];
        return {
          ...w,
          brand_name: (brand?.brand_title ?? w.jnc_brands ?? null) as string | null,
          brand_id: brand?.brand_id ?? null,
          diameter: ((diameterByWheel[wid] || w.text_diameters) ?? null) as string | null,
          width: ((widthByWheel[wid] || w.text_widths) ?? null) as string | null,
          bolt_pattern: ((boltByWheel[wid] || w.text_bolt_patterns) ?? null) as string | null,
          center_bore: ((centerBoreByWheel[wid] || w.text_center_bores) ?? null) as string | null,
          tire_size: ((tireSizeByWheel[wid] || w.text_tire_sizes) ?? null) as string | null,
          color: ((colorByWheel[wid] || w.text_colors) ?? null) as string | null,
        };
      });
    } catch {
      return [];
    }
  },
});

/** Return wheel ids that have specifications_json (for server-side spec backfill). */
export const wheelsGetIdsWithSpecJson = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    return wheels.filter((w) => (w.specifications_json ?? "").trim().length > 0).map((w) => w._id);
  },
});

/** Audit: how many wheels have text_* or specifications_json populated (for filter backfill). */
export const wheelSpecDataAudit = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    let withTextDiameters = 0;
    let withTextWidths = 0;
    let withTextBolt = 0;
    let withTextCenterBore = 0;
    let withTextColors = 0;
    let withSpecJson = 0;
    const samples: string[] = [];
    const sampleTitles: string[] = [];
    for (const w of wheels) {
      if ((w.text_diameters ?? "").trim()) withTextDiameters++;
      if ((w.text_widths ?? "").trim()) withTextWidths++;
      if ((w.text_bolt_patterns ?? "").trim()) withTextBolt++;
      if ((w.text_center_bores ?? "").trim()) withTextCenterBore++;
      if ((w.text_colors ?? "").trim()) withTextColors++;
      const raw = (w.specifications_json ?? "").trim();
      if (raw) {
        withSpecJson++;
        if (samples.length < 3) samples.push(raw.slice(0, 400));
      }
      const title = (w.wheel_title ?? "").trim();
      if (title && sampleTitles.length < 8) sampleTitles.push(title);
    }
    return {
      total: wheels.length,
      withTextDiameters,
      withTextWidths,
      withTextBoltPatterns: withTextBolt,
      withTextCenterBores: withTextCenterBore,
      withTextColors,
      withSpecificationsJson: withSpecJson,
      sampleSpecJson: samples,
      sampleWheelTitles: sampleTitles,
    };
  },
});

/** Most common spec value in a list (mode); empty strings ignored. */
function mode(values: string[]): string | null {
  const trimmed = values.map((s) => s.trim()).filter((s) => s.length > 0);
  if (trimmed.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of trimmed) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      bestCount = c;
      best = v;
    }
  }
  return best;
}

/** Split spec string by comma/semicolon/newline and return non-empty parts. */
function specValues(raw: string | undefined | null): string[] {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/[,;|\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Common wheel specs per brand (from wheels that have data) + global fallback for filling empty wheels. */
export const wheelsCommonSpecsByBrand = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    const wheelBrandLinks = await ctx.db.query("j_wheel_brand").collect();
    const wheelToBrandIds = new Map<string, string[]>();
    for (const j of wheelBrandLinks) {
      const wid = j.wheel_id as string;
      if (!wheelToBrandIds.has(wid)) wheelToBrandIds.set(wid, []);
      wheelToBrandIds.get(wid)!.push(j.brand_id as string);
    }
    type SpecBag = { diameters: string[]; widths: string[]; boltPatterns: string[]; centerBores: string[] };
    const byBrand = new Map<string, SpecBag>();
    const global: SpecBag = { diameters: [], widths: [], boltPatterns: [], centerBores: [] };

    for (const w of wheels) {
      const wid = w._id as string;
      const diameters = specValues(w.text_diameters);
      const widths = specValues(w.text_widths);
      const boltPatterns = specValues(w.text_bolt_patterns);
      const centerBores = specValues(w.text_center_bores);
      if (diameters.length === 0 && widths.length === 0 && boltPatterns.length === 0 && centerBores.length === 0) continue;

      const brandIds = wheelToBrandIds.get(wid) ?? [];
      if (brandIds.length === 0) {
        global.diameters.push(...diameters);
        global.widths.push(...widths);
        global.boltPatterns.push(...boltPatterns);
        global.centerBores.push(...centerBores);
        continue;
      }
      for (const bid of brandIds) {
        let bag = byBrand.get(bid);
        if (!bag) {
          bag = { diameters: [], widths: [], boltPatterns: [], centerBores: [] };
          byBrand.set(bid, bag);
        }
        bag.diameters.push(...diameters);
        bag.widths.push(...widths);
        bag.boltPatterns.push(...boltPatterns);
        bag.centerBores.push(...centerBores);
      }
      global.diameters.push(...diameters);
      global.widths.push(...widths);
      global.boltPatterns.push(...boltPatterns);
      global.centerBores.push(...centerBores);
    }

    const saneWidth = (v: string | null): string | null => {
      if (!v) return null;
      const n = parseFloat(v.replace(/J$/i, ""));
      if (n >= 6 && n <= 12) return v;
      return null;
    };
    const saneCenterBore = (v: string | null): string | null => {
      if (!v) return null;
      const num = parseFloat(v.replace(/mm$/i, "").trim());
      if (num >= 50 && num <= 85) return v;
      return null;
    };

    const toResult = (bag: SpecBag, useDefaults: boolean) => {
      const diameter = mode(bag.diameters) ?? (useDefaults ? "18" : null);
      const widthRaw = mode(bag.widths) ?? (useDefaults ? "8.5" : null);
      const width = saneWidth(widthRaw) ?? (useDefaults ? "8.5" : null);
      const boltPattern = mode(bag.boltPatterns) ?? (useDefaults ? "5x114.3" : null);
      const centerBoreRaw = mode(bag.centerBores) ?? (useDefaults ? "66.1" : null);
      const centerBore = saneCenterBore(centerBoreRaw) ?? (useDefaults ? "66.1" : null);
      return { diameter, width, boltPattern, centerBore };
    };

    const byBrandResult: Record<string, { diameter: string | null; width: string | null; boltPattern: string | null; centerBore: string | null }> = {};
    for (const [bid, bag] of byBrand) byBrandResult[bid] = toResult(bag, false);
    const globalResult = toResult(global, true);

    return {
      byBrand: byBrandResult,
      global: globalResult,
    };
  },
});

/** Wheel ids that have at least one empty text_* spec (for common-spec backfill). */
export const wheelsGetIdsWithMissingSpecs = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db.query("oem_wheels").collect();
    return wheels
      .filter(
        (w) =>
          !(w.text_diameters ?? "").trim() ||
          !(w.text_widths ?? "").trim() ||
          !(w.text_bolt_patterns ?? "").trim() ||
          !(w.text_center_bores ?? "").trim()
      )
      .map((w) => w._id);
  },
});

/** Single page of wheels for simple pagination (cursor + numItems). Returns raw wheel docs; client uses text_* for display. */
export const wheelsListOnePage = query({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const paginationOpts = { numItems: args.numItems, cursor: args.cursor ?? null };
    const result = await ctx.db
      .query("oem_wheels")
      .order("asc")
      .paginate(paginationOpts);
    return {
      page: result.page,
      nextCursor: result.continueCursor ?? null,
      isDone: result.isDone,
    };
  },
});

const filterArgsValidator = {
  page: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  brand: v.optional(v.array(v.string())),
  diameter: v.optional(v.array(v.string())),
  width: v.optional(v.array(v.string())),
  boltPattern: v.optional(v.array(v.string())),
  centerBore: v.optional(v.array(v.string())),
  tireSize: v.optional(v.array(v.string())),
  color: v.optional(v.array(v.string())),
  search: v.optional(v.array(v.string())),
  hasGoodPic: v.optional(v.array(v.string())),
  hasBadPic: v.optional(v.array(v.string())),
  sortBy: v.optional(v.string()),
};

function normalizeForMatch(s: string): string {
  return String(s ?? "")
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function normalizeWheelSearchBlob(wheel: {
  wheel_title?: string | null;
  jnc_brands?: string | null;
  text_colors?: string | null;
  text_diameters?: string | null;
  text_widths?: string | null;
  notes?: string | null;
  specifications_json?: string | null;
}): string {
  return normalizeForMatch(
    [
      wheel.wheel_title,
      wheel.jnc_brands,
      wheel.text_colors,
      wheel.text_diameters,
      wheel.text_widths,
      wheel.notes,
      wheel.specifications_json,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function wheelMatchesMultiValueFilter(raw: string | null | undefined, filters: string[], transform?: (s: string) => string): boolean {
  if (!filters.length) return true;
  const parts = splitSpecValuesWithSpaces(raw ?? "").map((value) =>
    transform ? transform(value) : normalizeForMatch(value)
  );
  return filters.some((filter) => parts.some((part) => part.includes(filter) || filter.includes(part)));
}

function getWheelSortValue(
  wheel: {
    wheel_title?: string | null;
    jnc_brands?: string | null;
    text_diameters?: string | null;
  },
  sortBy: string
): string | number {
  switch (sortBy) {
    case "nameAsc":
    case "nameDesc":
      return (wheel.wheel_title ?? "").toLowerCase();
    case "brandDesc":
    case "brandAsc":
      return (wheel.jnc_brands ?? "").toLowerCase();
    case "diameterAsc":
    case "diameterDesc": {
      const first = splitSpecValuesWithSpaces(wheel.text_diameters ?? "")[0] ?? "";
      const normalized = normalizeDiameterOption(first);
      return normalized ? parseFloat(normalized) : 0;
    }
    default:
      return (wheel.jnc_brands ?? "").toLowerCase();
  }
}

/** Single page of wheels with optional filters; queries full dataset server-side. 40 per page, cursor-based. */
export const wheelsListOnePageFiltered = query({
  args: filterArgsValidator,
  handler: async (ctx, args) => {
    const page = Math.max(1, Math.floor(args.page ?? 1));
    const pageSize = Math.min(Math.max(1, Math.floor(args.pageSize ?? 24)), 100);
    const hasBrand = (args.brand?.length ?? 0) > 0;
    const hasDiameter = (args.diameter?.length ?? 0) > 0;
    const hasWidth = (args.width?.length ?? 0) > 0;
    const hasBolt = (args.boltPattern?.length ?? 0) > 0;
    const hasCenterBore = (args.centerBore?.length ?? 0) > 0;
    const hasTireSize = (args.tireSize?.length ?? 0) > 0;
    const hasColor = (args.color?.length ?? 0) > 0;
    const hasSearch = (args.search?.length ?? 0) > 0;
    const hasGoodPicFilter = (args.hasGoodPic?.length ?? 0) > 0;
    const hasBadPicFilter = (args.hasBadPic?.length ?? 0) > 0;
    const sortBy = args.sortBy ?? "brandAsc";
    const needsServerProcessing =
      hasBrand ||
      hasDiameter ||
      hasWidth ||
      hasBolt ||
      hasCenterBore ||
      hasTireSize ||
      hasColor ||
      hasSearch ||
      hasGoodPicFilter ||
      hasBadPicFilter ||
      sortBy !== "brandAsc";

    const brandFilters = (args.brand ?? []).map((value) => normalizeForMatch(value)).filter(Boolean);
    const diameterFilters = (args.diameter ?? [])
      .map((value) => normalizeDiameterOption(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeForMatch(value));
    const widthFilters = (args.width ?? [])
      .map((value) => normalizeWidthOption(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeForMatch(value));
    const boltFilters = (args.boltPattern ?? []).map((value) => normalizeForMatch(value)).filter(Boolean);
    const centerBoreFilters = (args.centerBore ?? [])
      .map((value) => normalizeCenterBoreOption(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeForMatch(value));
    const tireFilters = (args.tireSize ?? [])
      .map((value) => normalizeTireSizeOption(value))
      .filter((value) => isValidTireSizeOption(value))
      .map((value) => normalizeForMatch(value));
    const colorFilters = (args.color ?? [])
      .map((value) => normalizeColorOption(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeForMatch(value));
    const searchFilters = (args.search ?? []).map((value) => normalizeForMatch(value)).filter(Boolean);

    const allWheels = await ctx.db.query("oem_wheels").collect();
    const filteredWheels = allWheels.filter((wheel) => {
      if (brandFilters.length > 0) {
        const brandText = normalizeForMatch(wheel.jnc_brands ?? "");
        if (!brandFilters.some((filter) => brandText.includes(filter) || filter.includes(brandText))) return false;
      }
      if (!wheelMatchesMultiValueFilter(wheel.text_diameters, diameterFilters, (value) => normalizeForMatch(normalizeDiameterOption(value)))) return false;
      if (!wheelMatchesMultiValueFilter(wheel.text_widths, widthFilters, (value) => normalizeForMatch(normalizeWidthOption(value)))) return false;
      if (!wheelMatchesMultiValueFilter(wheel.text_bolt_patterns, boltFilters, (value) => normalizeForMatch(value))) return false;
      if (!wheelMatchesMultiValueFilter(wheel.text_center_bores, centerBoreFilters, (value) => normalizeForMatch(normalizeCenterBoreOption(value)))) return false;
      if (!wheelMatchesMultiValueFilter(wheel.text_tire_sizes, tireFilters, (value) => normalizeForMatch(normalizeTireSizeOption(value)))) return false;
      if (!wheelMatchesMultiValueFilter(wheel.text_colors, colorFilters, (value) => normalizeForMatch(normalizeColorOption(value) ?? ""))) return false;
      if (searchFilters.length > 0) {
        const blob = normalizeWheelSearchBlob(wheel);
        if (!searchFilters.some((filter) => blob.includes(filter))) return false;
      }
      if ((args.hasGoodPic ?? []).includes("Yes") && !(wheel.good_pic_url ?? "").trim()) return false;
      if ((args.hasGoodPic ?? []).includes("No") && (wheel.good_pic_url ?? "").trim()) return false;
      if ((args.hasBadPic ?? []).includes("Yes") && !(wheel.bad_pic_url ?? "").trim()) return false;
      if ((args.hasBadPic ?? []).includes("No") && (wheel.bad_pic_url ?? "").trim()) return false;
      return true;
    });

    const sortedWheels = [...filteredWheels].sort((a, b) => {
      const aVal = getWheelSortValue(a, sortBy);
      const bVal = getWheelSortValue(b, sortBy);
      const aTitle = (a.wheel_title ?? "").toLowerCase();
      const bTitle = (b.wheel_title ?? "").toLowerCase();
      switch (sortBy) {
        case "nameDesc":
          return String(bVal).localeCompare(String(aVal)) || aTitle.localeCompare(bTitle);
        case "brandDesc":
          return String(bVal).localeCompare(String(aVal)) || aTitle.localeCompare(bTitle);
        case "diameterDesc":
          return Number(bVal) - Number(aVal) || aTitle.localeCompare(bTitle);
        case "nameAsc":
        case "brandAsc":
          return String(aVal).localeCompare(String(bVal)) || aTitle.localeCompare(bTitle);
        case "diameterAsc":
          return Number(aVal) - Number(bVal) || aTitle.localeCompare(bTitle);
        default:
          return String(aVal).localeCompare(String(bVal)) || aTitle.localeCompare(bTitle);
      }
    });

    const totalCount = sortedWheels.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageDocs = sortedWheels.slice(startIndex, endIndex);
    return {
      page: pageDocs,
      pageNumber: safePage,
      pageSize,
      totalCount,
      totalPages,
    };
  },
});

/** Paginated wheels list — fast version.
 *  Specs come from text_* fields embedded on the document (no junction lookups needed).
 *  Brand name is resolved via a single indexed j_wheel_brand lookup per wheel (all in parallel).
 */
export const wheelsListPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("oem_wheels")
      .order("asc")
      .paginate(args.paginationOpts);

    const wheels = result.page;
    if (wheels.length === 0) return { ...result, page: [] };

    // One brand link per wheel (indexed — reads only 1 row per wheel)
    const brandLinks = await Promise.all(
      wheels.map((w) =>
        ctx.db
          .query("j_wheel_brand")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", w._id))
          .first()
      )
    );

    const page = wheels.map((w, i) => {
      const link = brandLinks[i];
      return {
        ...w,
        brand_name: ((link?.brand_title as string | undefined) ?? w.jnc_brands ?? null) as string | null,
        brand_id: link?.brand_id ?? null,
        // Specs come straight from the document text_* fields
        diameter: (w.text_diameters ?? null) as string | null,
        width: (w.text_widths ?? null) as string | null,
        bolt_pattern: (w.text_bolt_patterns ?? null) as string | null,
        center_bore: (w.text_center_bores ?? null) as string | null,
        tire_size: (w.text_tire_sizes ?? null) as string | null,
        color: (w.text_colors ?? null) as string | null,
      };
    });

    return { ...result, page };
  },
});



export const wheelsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // 1. If args.id looks like Convex _id, try db.get first
      if (/^[a-z0-9]{20,}$/i.test(args.id)) {
        const byConvexId = await ctx.db.get("oem_wheels", args.id as Id<"oem_wheels">);
        if (byConvexId) return byConvexId;
      }
      // 2. Fall back to business id field
      return await ctx.db
        .query("oem_wheels")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

/** Finds oem_wheels where the optional id (business/slug) field equals arg. Returns the doc or null. */
export const wheelsGetByOldId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("oem_wheels")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
    } catch {
      return null;
    }
  },
});

/** Finds the first oem_wheel where wheel_title equals the given title. Used to map ws_mercedes_wheels (title) to oem_wheels._id. */
export const wheelsGetByTitle = query({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    try {
      const t = args.title.trim();
      if (!t) return null;
      return await ctx.db
        .query("oem_wheels")
        .withIndex("by_wheel_title", (q) => q.eq("wheel_title", t))
        .first();
    } catch {
      return null;
    }
  },
});

export const wheelsGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const wheelsGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_wheels")),
  },
  handler: async (ctx, args) => {
    try {
      let wheel = null;
      if (typeof args.id === "string") {
        // 1. Try Convex _id first (alphanumeric, typically 20+ chars)
        if (/^[a-z0-9]{20,}$/i.test(args.id)) {
          wheel = await ctx.db.get("oem_wheels", args.id as Id<"oem_wheels">);
        }
        // 2. Try business id field
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first();
        }
        // 3. Try slug, wheel_title (for URL slugs like "mini-494-loop-spoke-silver-wheels")
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .filter((q) =>
              q.or(
                q.eq(q.field("slug"), args.id),
                q.eq(q.field("wheel_title"), args.id)
              )
            )
            .first();
        }
        // 4. Try by_slug index for direct slug lookup on oem_wheels
        if (!wheel) {
          wheel = await ctx.db
            .query("oem_wheels")
            .withIndex("by_slug", (q) => q.eq("slug", args.id))
            .first();
        }
        // 5. Try oem_wheel_variants.by_slug (slug may live on variant)
        if (!wheel) {
          const variant = await ctx.db
            .query("oem_wheel_variants")
            .withIndex("by_slug", (q) => q.eq("slug", args.id))
            .first();
          if (variant) {
            const parentWheel = await ctx.db.get("oem_wheels", variant.wheel_id);
            if (parentWheel) wheel = parentWheel;
          }
        }
      } else {
        wheel = await ctx.db.get("oem_wheels", args.id);
      }
      if (!wheel) return null;

      const wheelId = wheel._id;
      const [vehicleLinks, brandLink] = await Promise.all([
        ctx.db
          .query("j_wheel_vehicle")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
          .collect(),
        ctx.db
          .query("j_wheel_brand")
          .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
          .first(),
      ]);

      const brand = brandLink
        ? await ctx.db.get("oem_brands", brandLink.brand_id)
        : null;

      const vehicleImageEntries = await Promise.all(
        vehicleLinks.map(async (j) => [
          String(j.vehicle_id),
          await ctx.db
            .query("oem_vehicle_images")
            .withIndex("by_vehicle", (q) => q.eq("vehicle_id", j.vehicle_id))
            .collect(),
        ] as const)
      );
      const vehicleImageRowsByVehicleId = new Map(vehicleImageEntries);

      const mapVehicleWithBrand = async (vehicleId: Id<"oem_vehicles">) => {
        const v = await ctx.db.get("oem_vehicles", vehicleId);
        if (!v) return null;
        const vBrand = await ctx.db
          .query("j_vehicle_brand")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", v._id))
          .first();
        const brandDoc = vBrand
          ? await ctx.db.get("oem_brands", vBrand.brand_id)
          : null;
        return {
          ...v,
          ...resolveVehicleImageFields(v, vehicleImageRowsByVehicleId),
          brand_name: brandDoc?.brand_title ?? v.text_brands ?? null,
        };
      };

      const vehicleDocs = await Promise.all(
        vehicleLinks.map((j) => mapVehicleWithBrand(j.vehicle_id))
      );

      const vehicles = vehicleDocs.filter((v): v is NonNullable<typeof v> => v !== null);

      return {
        ...wheel,
        id: wheel.id ?? String(wheel._id),
        wheel_name: wheel.wheel_title ?? "",
        brand_name: brand?.brand_title ?? wheel.jnc_brands ?? null,
        diameter: (wheel.text_diameters ?? null) as string | null,
        width: (wheel.text_widths ?? null) as string | null,
        bolt_pattern: (wheel.text_bolt_patterns ?? null) as string | null,
        center_bore: (wheel.text_center_bores ?? null) as string | null,
        tire_size: (wheel.text_tire_sizes ?? null) as string | null,
        color: ((wheel.color as string | undefined) ?? wheel.text_colors ?? null) as string | null,
        brand,
        vehicles,
        bolt_patterns: [],
        diameters: [],
        widths: [],
        center_bores: [],
        colors: [],
        tire_sizes: [],
      };
    } catch {
      return null;
    }
  },
});

// =============================================================================
// JUNCTION TABLE QUERIES (many-to-many lookups)
// =============================================================================

export const getVehiclesByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_vehicle")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
        .collect();
      const [vehicles, imageRowEntries] = await Promise.all([
        Promise.all(links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))),
        Promise.all(
          links.map(async (j) => [
            String(j.vehicle_id),
            await ctx.db
              .query("oem_vehicle_images")
              .withIndex("by_vehicle", (q) => q.eq("vehicle_id", j.vehicle_id))
              .collect(),
          ] as const),
        ),
      ]);
      const imageRowsByVehicleId = new Map(imageRowEntries);
      return vehicles
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((vehicle) => ({
          ...vehicle,
          ...resolveVehicleImageFields(vehicle, imageRowsByVehicleId),
        }));
    } catch {
      return [];
    }
  },
});

export const getWheelsByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_vehicle")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const getWheelsByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_wheel_brand")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      const wheels = await Promise.all(
        links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const wheelVariantsGetByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const variants = await ctx.db
        .query("oem_wheel_variants")
        .withIndex("by_wheel_id", (q) => q.eq("wheel_id", args.wheelId))
        .collect();

      return variants.sort((a, b) => {
        const aTitle = (a.variant_title ?? a.wheel_title ?? "").trim();
        const bTitle = (b.variant_title ?? b.wheel_title ?? "").trim();
        const titleCompare = aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
        if (titleCompare !== 0) return titleCompare;

        const aPart = (a.part_numbers ?? "").trim();
        const bPart = (b.part_numbers ?? "").trim();
        return aPart.localeCompare(bPart, undefined, { sensitivity: "base" });
      });
    } catch {
      return [];
    }
  },
});

export const wheelVariantGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_wheel_variants")),
  },
  handler: async (ctx, args) => {
    try {
      const variant = await resolveWheelVariantDoc(ctx, args.id);
      if (!variant) return null;

      const [
        parentWheel,
        directBrand,
        wheelBrandLink,
        marketLinks,
        boltPatternLinks,
        centerBoreLinks,
        diameterLinks,
        widthLinks,
        offsetLinks,
        colorLinks,
        tireSizeLinks,
        partNumberLinks,
        materialLinks,
        finishTypeLinks,
        designStyleLinks,
        vehicleVariantLinks,
      ] = await Promise.all([
        variant.wheel_id ? ctx.db.get(variant.wheel_id) : null,
        variant.brand_id ? ctx.db.get(variant.brand_id) : null,
        variant.wheel_id
          ? ctx.db
              .query("j_wheel_brand")
              .withIndex("by_wheel", (q) => q.eq("wheel_id", variant.wheel_id!))
              .first()
          : null,
        ctx.db
          .query("j_oem_wheel_variant_market")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_bolt_pattern")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_center_bore")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_diameter")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_width")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_offset")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_color")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_tire_size")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_part_number")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_material")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_finish_type")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_design_style")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("variant_id", variant._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_wheel_variant")
          .withIndex("by_oem_wheel_variant", (q) => q.eq("wheel_variant_id", variant._id))
          .collect(),
      ]);

      const wheelBrand =
        directBrand ??
        (wheelBrandLink ? await ctx.db.get(wheelBrandLink.brand_id) : null);

      const linkedVehicleVariantsRaw = await Promise.all(
        vehicleVariantLinks.map((link) => ctx.db.get(link.vehicle_variant_id))
      );
      const linkedVehicleVariants = await Promise.all(
        linkedVehicleVariantsRaw.map(async (vehicleVariant) => {
          if (!vehicleVariant) return null;
          const enrichedVariant = await getVehicleVariantEngineLayers(ctx, vehicleVariant);
          const parentVehicle = enrichedVariant.vehicle_id
            ? await ctx.db.get(enrichedVariant.vehicle_id)
            : null;
          const vehicleBrandLink = enrichedVariant.vehicle_id
            ? await ctx.db
                .query("j_vehicle_brand")
                .withIndex("by_vehicle", (q) => q.eq("vehicle_id", enrichedVariant.vehicle_id!))
                .first()
            : null;
          const brand = vehicleBrandLink ? await ctx.db.get(vehicleBrandLink.brand_id) : null;

          return {
            ...enrichedVariant,
            parent_vehicle_title:
              parentVehicle?.vehicle_title ??
              parentVehicle?.model_name ??
              parentVehicle?.generation ??
              null,
            parent_vehicle_generation: parentVehicle?.generation ?? null,
            parent_vehicle_image:
              parentVehicle?.good_pic_url ??
              parentVehicle?.bad_pic_url ??
              null,
            parent_vehicle_slug: parentVehicle?.slug ?? null,
            parent_vehicle_id: parentVehicle?._id ?? null,
            brand_title: brand?.brand_title ?? null,
          };
        })
      );

      return {
        ...variant,
        markets: uniqueSortedStrings(marketLinks.map((link) => link.market)),
        bolt_patterns: uniqueSortedStrings([variant.bolt_pattern, ...boltPatternLinks.map((link) => link.bolt_pattern)]),
        center_bores: uniqueSortedStrings([variant.center_bore, ...centerBoreLinks.map((link) => link.center_bore)]),
        diameters: uniqueSortedStrings([variant.diameter, ...diameterLinks.map((link) => link.diameter)]),
        widths: uniqueSortedStrings([variant.width, ...widthLinks.map((link) => link.width)]),
        offsets: uniqueSortedStrings([variant.offset, ...offsetLinks.map((link) => link.offset)]),
        colors: uniqueSortedStrings([variant.color, variant.finish, ...colorLinks.map((link) => link.color)]),
        tire_sizes: uniqueSortedStrings(tireSizeLinks.map((link) => link.tire_size)),
        part_numbers: uniqueSortedStrings([
          ...(variant.part_numbers ?? "")
            .split(/[,;\n]/)
            .map((part) => part.trim()),
          ...partNumberLinks.map((link) => link.part_number),
        ]),
        materials: uniqueSortedStrings([variant.metal_type, ...materialLinks.map((link) => link.material)]),
        finish_types: uniqueSortedStrings([variant.finish, ...finishTypeLinks.map((link) => link.finish_type)]),
        design_styles: uniqueSortedStrings(designStyleLinks.map((link) => link.design_style)),
        parent_wheel: parentWheel
          ? {
              ...parentWheel,
              brand_title: wheelBrand?.brand_title ?? null,
            }
          : null,
        linked_vehicle_variants: linkedVehicleVariants
          .filter((vehicleVariant): vehicleVariant is NonNullable<typeof vehicleVariant> => vehicleVariant !== null)
          .sort((a, b) => {
            const aTitle = (a.variant_title ?? a.trim_level ?? "").trim();
            const bTitle = (b.variant_title ?? b.trim_level ?? "").trim();
            return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
          }),
      };
    } catch {
      return null;
    }
  },
});

// =============================================================================
// GLOBAL SEARCH (text filter in handler; no index for substring match)
// =============================================================================

function normalizeSearchTerm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchesSearch(text: string | undefined | null, query: string): boolean {
  if (!text) return false;
  return normalizeSearchTerm(text).includes(normalizeSearchTerm(query));
}

export const globalSearchBrands = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const q = normalizeSearchTerm(args.query);
      return all
        .filter(
          (b) =>
            matchesSearch(b.brand_title, args.query) ||
            matchesSearch(b.brand_description, args.query) ||
            matchesSearch(b.subsidiaries, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

export const globalSearchVehicles = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db.query("oem_vehicles").order("asc").collect();
      return all
        .filter(
          (v) =>
            matchesSearch(v.vehicle_title, args.query) ||
            matchesSearch(v.model_name, args.query) ||
            matchesSearch(v.generation, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

export const globalSearchWheels = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) return [];
      const all = await ctx.db.query("oem_wheels").order("asc").collect();
      return all
        .filter(
          (w) =>
            matchesSearch(w.wheel_title, args.query) ||
            matchesSearch(w.notes, args.query)
        )
        .slice(0, 50);
    } catch {
      return [];
    }
  },
});

// =============================================================================
// DASHBOARD METRICS
// =============================================================================

export const dashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [brands, vehicles, wheels] = await Promise.all([
        ctx.db.query("oem_brands").collect(),
        ctx.db.query("oem_vehicles").collect(),
        ctx.db.query("oem_wheels").collect(),
      ]);
      return {
        totalBrands: brands.length,
        totalVehicles: vehicles.length,
        totalWheels: wheels.length,
      };
    } catch {
      return { totalBrands: 0, totalVehicles: 0, totalWheels: 0 };
    }
  },
});

export const wheelsByBrandDistribution = query({
  args: {},
  handler: async (ctx) => {
    try {
      const brands = await ctx.db
        .query("oem_brands")
        .withIndex("by_brand_title")
        .order("asc")
        .collect();
      const wheelLinks = await ctx.db.query("j_wheel_brand").collect();
      const vehicleLinks = await ctx.db.query("j_vehicle_brand").collect();
      const wheelCountByBrand = new Map<string, number>();
      const vehicleCountByBrand = new Map<string, number>();
      for (const b of brands) {
        wheelCountByBrand.set(b._id, 0);
        vehicleCountByBrand.set(b._id, 0);
      }
      for (const j of wheelLinks) {
        wheelCountByBrand.set(
          j.brand_id,
          (wheelCountByBrand.get(j.brand_id) ?? 0) + 1
        );
      }
      for (const j of vehicleLinks) {
        vehicleCountByBrand.set(
          j.brand_id,
          (vehicleCountByBrand.get(j.brand_id) ?? 0) + 1
        );
      }
      const distribution = brands
        .map((b) => ({
          brand: b.brand_title,
          wheels: wheelCountByBrand.get(b._id) ?? 0,
          vehicles: vehicleCountByBrand.get(b._id) ?? 0,
        }))
        .sort((a, b) => b.wheels - a.wheels)
        .slice(0, 10);
      return distribution;
    } catch {
      return [];
    }
  },
});

export const boltPatternDistribution = query({
  args: {},
  handler: async (ctx) => {
    try {
      const [links, patternDocs] = await Promise.all([
        ctx.db.query("j_wheel_bolt_pattern").collect(),
        ctx.db.query("oem_bolt_patterns").collect(),
      ]);
      const patternById = new Map(
        patternDocs.map((p) => [p._id, p.bolt_pattern])
      );
      const patternCounts = new Map<string, number>();
      for (const link of links) {
        const pattern = patternById.get(link.bolt_pattern_id) ?? "Unknown";
        patternCounts.set(pattern, (patternCounts.get(pattern) ?? 0) + 1);
      }
      return Array.from(patternCounts.entries())
        .map(([pattern, count]) => ({ pattern, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    } catch {
      return [];
    }
  },
});

// =============================================================================
// SAVED ITEMS (by user)
// =============================================================================

export const savedBrandsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_brands")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const brands = await Promise.all(
        links.map((l) => ctx.db.get("oem_brands", l.brand_id))
      );
      return brands.filter((b): b is NonNullable<typeof b> => b !== null);
    } catch {
      return [];
    }
  },
});

export const savedVehiclesGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_vehicles")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const vehicles = await Promise.all(
        links.map((l) => ctx.db.get("oem_vehicles", l.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
    } catch {
      return [];
    }
  },
});

export const savedWheelsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("saved_wheels")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const wheels = await Promise.all(
        links.map((l) => ctx.db.get("oem_wheels", l.wheel_id))
      );
      return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
    } catch {
      return [];
    }
  },
});

export const savedBrandCheck = query({
  args: {
    userId: v.string(),
    brandId: v.id("oem_brands"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_brands")
        .withIndex("by_user_brand", (q) =>
          q.eq("user_id", args.userId).eq("brand_id", args.brandId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

export const savedVehicleCheck = query({
  args: {
    userId: v.string(),
    vehicleId: v.id("oem_vehicles"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_vehicles")
        .withIndex("by_user_vehicle", (q) =>
          q.eq("user_id", args.userId).eq("vehicle_id", args.vehicleId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

export const savedWheelCheck = query({
  args: {
    userId: v.string(),
    wheelId: v.id("oem_wheels"),
  },
  handler: async (ctx, args) => {
    try {
      const link = await ctx.db
        .query("saved_wheels")
        .withIndex("by_user_wheel", (q) =>
          q.eq("user_id", args.userId).eq("wheel_id", args.wheelId)
        )
        .first();
      return link !== null;
    } catch {
      return false;
    }
  },
});

// =============================================================================
// USER CONTENT (comments)
// =============================================================================

export const userCommentsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("vehicle_comments")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const withVehicle = await Promise.all(
        comments.map(async (c) => {
          const vehicle = await ctx.db.get("oem_vehicles", c.vehicle_id);
          return {
            _id: c._id,
            id: c._id,
            comment_text: c.comment_text,
            created_at: c.created_at,
            updated_at: c.updated_at,
            vehicle_id: c.vehicle_id,
            oem_vehicles: vehicle
              ? {
                id: vehicle.id,
                model_name: vehicle.model_name ?? null,
                chassis_code: vehicle.generation ?? null,
                hero_image_url: vehicle.good_pic_url ?? vehicle.bad_pic_url ?? null,
                brand_refs: null as unknown,
              }
              : null,
          };
        })
      );
      return withVehicle.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const vehicleCommentsGetByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("vehicle_comments")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const engineCommentsGetByEngine = query({
  args: { engineId: v.id("oem_engines") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("engine_comments")
        .withIndex("by_engine", (q) => q.eq("engine_id", args.engineId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const wheelCommentsGetByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("wheel_comments")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const vehicleVariantCommentsGetByVehicleVariant = query({
  args: { vehicleVariantId: v.id("oem_vehicle_variants") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("vehicle_variant_comments")
        .withIndex("by_vehicle_variant", (q) => q.eq("vehicle_variant_id", args.vehicleVariantId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const wheelVariantCommentsGetByWheelVariant = query({
  args: { wheelVariantId: v.id("oem_wheel_variants") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("wheel_variant_comments")
        .withIndex("by_wheel_variant", (q) => q.eq("wheel_variant_id", args.wheelVariantId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

export const brandCommentsGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    try {
      const comments = await ctx.db
        .query("brand_comments")
        .withIndex("by_brand", (q) => q.eq("brand_id", args.brandId))
        .collect();
      return comments.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

// =============================================================================
// USER CONTENT (listings)
// =============================================================================

export const userListingsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      /*
      const listings = await ctx.db
        .query("market_listings")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      return listings
        .filter((l) => l.status === "active")
        .sort((a, b) => {
          const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return tB - tA;
        });
      */
      return [];
    } catch {
      return [];
    }
  },
});

export const marketListingsGetByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    try {
      const listings = await ctx.db
        .query("market_listings")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
        .collect();

      const activeListings = listings
        .filter((listing) => (listing.status ?? "active") === "active")
        .sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });

      return await Promise.all(
        activeListings.map(async (listing) => {
          const sellerProfile = await ctx.db
            .query("profiles")
            .withIndex("by_profile_id", (q) => q.eq("id", listing.user_id))
            .first();

          return {
            ...listing,
            seller_profile: sellerProfile
              ? {
                  username: sellerProfile.username,
                  display_name: sellerProfile.display_name ?? null,
                  avatar_url: sellerProfile.avatar_url ?? null,
                  verification_status: sellerProfile.verification_status ?? "unverified",
                }
              : null,
          };
        })
      );
    } catch {
      return [];
    }
  },
});

// =============================================================================
// PUBLIC PROFILE
// =============================================================================

export const profileGetByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();
    } catch {
      return null;
    }
  },
});

export const profilesList = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      const all = await ctx.db.query("profiles").collect();
      const sorted = all.sort((a, b) => {
        const aT = (a.created_at ?? "").localeCompare(b.created_at ?? "");
        return -aT;
      });
      if (!args.search?.trim()) return sorted;
      const searchLower = args.search.trim().toLowerCase();
      return sorted.filter(
        (p) =>
          (p.username ?? "").toLowerCase().includes(searchLower) ||
          ((p.display_name ?? "") as string).toLowerCase().includes(searchLower)
      );
    } catch {
      return [];
    }
  },
});

// =============================================================================
// REGISTERED VEHICLES (by user)
// =============================================================================

export const registeredVehiclesGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const rows = await ctx.db
        .query("user_registered_vehicles")
        .withIndex("by_user", (q) => q.eq("user_id", args.userId))
        .collect();
      const result = await Promise.all(
        rows.map(async (r) => {
          const brand = r.brand_id ? await ctx.db.get("oem_brands", r.brand_id) : null;
          const vehicle = r.linked_oem_vehicle_id
            ? await ctx.db.get("oem_vehicles", r.linked_oem_vehicle_id)
            : null;
          return {
            ...r,
            brand_ref: brand?.id ?? "",
            vehicle_ref: vehicle?.id ?? "",
          };
        })
      );
      return result.sort((a, b) => {
        const tA = new Date(a.created_at).getTime();
        const tB = new Date(b.created_at).getTime();
        return tB - tA;
      });
    } catch {
      return [];
    }
  },
});

// =============================================================================
// COLLECTION FILTER OPTIONS (for admin collection search)
// =============================================================================

export const collectionFilterOptions = query({
  args: { collectionType: v.union(v.literal("brands"), v.literal("vehicles"), v.literal("wheels")) },
  handler: async (ctx, args) => {
    try {
      if (args.collectionType === "wheels") {
        const [brands, diameters, boltPatterns] = await Promise.all([
          ctx.db.query("oem_brands").withIndex("by_brand_title").order("asc").collect(),
          ctx.db.query("oem_diameters").collect(),
          ctx.db.query("oem_bolt_patterns").collect(),
        ]);
        return {
          Brand: brands.map((b) => b.brand_title).filter(Boolean).sort(),
          Diameter: diameters.map((d) => d.diameter).filter(Boolean).sort(),
          BoltPattern: boltPatterns.map((p) => p.bolt_pattern).filter(Boolean).sort(),
        };
      }
      return {} as Record<string, string[]>;
    } catch {
      return {} as Record<string, string[]>;
    }
  },
});

// =============================================================================
// DATABASE RECORD (generic get-by-id for record editor)
// =============================================================================

export const databaseRecordGet = query({
  args: { tableName: v.string(), recordId: v.string() },
  handler: async (ctx, args) => {
    if (!args.tableName || !args.recordId) return null;
    try {
      if (args.tableName === "oem_brands") {
        if (/^[a-z0-9]{20,}$/i.test(args.recordId)) {
          const byConvexId = await ctx.db.get("oem_brands", args.recordId as Id<"oem_brands">);
          if (byConvexId) return byConvexId;
        }
        return await ctx.db
          .query("oem_brands")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      if (args.tableName === "oem_vehicles") {
        const byConvexId = await ctx.db.get("oem_vehicles", args.recordId as Id<"oem_vehicles">);
        if (byConvexId) return byConvexId;
        return await ctx.db
          .query("oem_vehicles")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      if (args.tableName === "oem_wheels") {
        const byConvexId = await ctx.db.get("oem_wheels", args.recordId as Id<"oem_wheels">);
        if (byConvexId) return byConvexId;
        return await ctx.db
          .query("oem_wheels")
          .filter((q) => q.eq(q.field("id"), args.recordId))
          .first();
      }
      return null;
    } catch {
      return null;
    }
  },
});

// =============================================================================
// USER TABLE PREFERENCES (column order)
// =============================================================================

export const userTablePreferencesGetByUserAndTable = query({
  args: { userId: v.string(), tableName: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("user_table_preferences")
        .withIndex("by_user_table", (q) =>
          q.eq("user_id", args.userId).eq("table_name", args.tableName)
        )
        .first();
    } catch {
      return null;
    }
  },
});

export const adminTableSelectorLayoutGet = query({
  args: {
    layoutScope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await requireAdmin(ctx);
      const userId = requireAdminUserId(identity);
      const layoutScope = args.layoutScope?.trim() || DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE;

      return await ctx.db
        .query("admin_table_selector_layouts")
        .withIndex("by_user_scope", (q) =>
          q.eq("user_id", userId).eq("layout_scope", layoutScope)
        )
        .first();
    } catch {
      return null;
    }
  },
});

// =============================================================================
// REFERENCE / LOOKUP TABLES
// =============================================================================

export const boltPatternsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_bolt_patterns").collect();
    } catch {
      return [];
    }
  },
});

export const centerBoresGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_center_bores").collect();
    } catch {
      return [];
    }
  },
});

export const colorsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_colors").collect();
    } catch {
      return [];
    }
  },
});

export const diametersGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_diameters").collect();
    } catch {
      return [];
    }
  },
});

export const widthsGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("oem_widths").collect();
    } catch {
      return [];
    }
  },
});

export const tireSizesGetAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("tire_sizes").collect();
    } catch {
      return [];
    }
  },
});

// =============================================================================
// WORKSHOP (ws_*) TABLES — read rows by table name for migration scripts
// =============================================================================

/** Returns up to `limit` rows from a workshop table. Used by promote-wheel-variants.ts. */
export const getWsRows = query({
  args: {
    table: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit ?? 1000;
      type WsRow = { _id: string; source_id?: string; title?: string; brand?: string; status?: string; imported_at?: string; data: string };
      let rows: WsRow[] = [];
      switch (args.table) {
        case "ws_mercedes_wheels":
          rows = (await ctx.db.query("ws_mercedes_wheels").collect()) as WsRow[];
          break;
        case "ws_mercedes_wheel_variants":
          rows = (await ctx.db.query("ws_mercedes_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_porsche_wheel_variants":
          rows = (await ctx.db.query("ws_porsche_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_audi_wheel_variants":
          rows = (await ctx.db.query("ws_audi_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_vw_wheel_variants":
          rows = (await ctx.db.query("ws_vw_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_lamborghini_wheel_variants":
          rows = (await ctx.db.query("ws_lamborghini_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_ferrari_wheel_variants":
          rows = (await ctx.db.query("ws_ferrari_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_jaguar_wheel_variants":
          rows = (await ctx.db.query("ws_jaguar_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_land_rover_wheel_variants":
          rows = (await ctx.db.query("ws_land_rover_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_944racing_wheel_variants":
          rows = (await ctx.db.query("ws_944racing_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_wheel_variants":
          rows = (await ctx.db.query("ws_alfa_romeo_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_fiat_wheel_variants":
          rows = (await ctx.db.query("ws_fiat_wheel_variants").collect()) as WsRow[];
          break;
        case "ws_mercedes_vehicle_variants":
          rows = (await ctx.db.query("ws_mercedes_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_porsche_vehicle_variants":
          rows = (await ctx.db.query("ws_porsche_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_audi_vehicle_variants":
          rows = (await ctx.db.query("ws_audi_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_vw_vehicle_variants":
          rows = (await ctx.db.query("ws_vw_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_lamborghini_vehicle_variants":
          rows = (await ctx.db.query("ws_lamborghini_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_ferrari_vehicle_variants":
          rows = (await ctx.db.query("ws_ferrari_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_jaguar_vehicle_variants":
          rows = (await ctx.db.query("ws_jaguar_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_land_rover_vehicle_variants":
          rows = (await ctx.db.query("ws_land_rover_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_944racing_vehicle_variants":
          rows = (await ctx.db.query("ws_944racing_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_vehicle_variants":
          rows = (await ctx.db.query("ws_alfa_romeo_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_fiat_vehicle_variants":
          rows = (await ctx.db.query("ws_fiat_vehicle_variants").collect()) as WsRow[];
          break;
        case "ws_mercedes_vehicles":
          rows = (await ctx.db.query("ws_mercedes_vehicles").collect()) as WsRow[];
          break;
        case "ws_porsche_vehicles":
          rows = (await ctx.db.query("ws_porsche_vehicles").collect()) as WsRow[];
          break;
        case "ws_audi_vehicles":
          rows = (await ctx.db.query("ws_audi_vehicles").collect()) as WsRow[];
          break;
        case "ws_vw_vehicles":
          rows = (await ctx.db.query("ws_vw_vehicles").collect()) as WsRow[];
          break;
        case "ws_lamborghini_vehicles":
          rows = (await ctx.db.query("ws_lamborghini_vehicles").collect()) as WsRow[];
          break;
        case "ws_ferrari_vehicles":
          rows = (await ctx.db.query("ws_ferrari_vehicles").collect()) as WsRow[];
          break;
        case "ws_jaguar_vehicles":
          rows = (await ctx.db.query("ws_jaguar_vehicles").collect()) as WsRow[];
          break;
        case "ws_land_rover_vehicles":
          rows = (await ctx.db.query("ws_land_rover_vehicles").collect()) as WsRow[];
          break;
        case "ws_944racing_vehicles":
          rows = (await ctx.db.query("ws_944racing_vehicles").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_vehicles":
          rows = (await ctx.db.query("ws_alfa_romeo_vehicles").collect()) as WsRow[];
          break;
        case "ws_fiat_vehicles":
          rows = (await ctx.db.query("ws_fiat_vehicles").collect()) as WsRow[];
          break;
        case "ws_944racing_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_944racing_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_alfa_romeo_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_alfa_romeo_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_audi_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_audi_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_ferrari_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_ferrari_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_fiat_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_fiat_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_jaguar_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_jaguar_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_lamborghini_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_lamborghini_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_land_rover_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_land_rover_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_mercedes_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_mercedes_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_porsche_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_porsche_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        case "ws_vw_junction_vehicles_wheels":
          rows = (await ctx.db.query("ws_vw_junction_vehicles_wheels").collect()) as WsRow[];
          break;
        default:
          return [];
      }
      return rows.slice(0, limit);
    } catch {
      return [];
    }
  },
});

const WS_JUNCTION_TABLES = [
  "ws_944racing_junction_vehicles_wheels",
  "ws_alfa_romeo_junction_vehicles_wheels",
  "ws_audi_junction_vehicles_wheels",
  "ws_ferrari_junction_vehicles_wheels",
  "ws_fiat_junction_vehicles_wheels",
  "ws_jaguar_junction_vehicles_wheels",
  "ws_lamborghini_junction_vehicles_wheels",
  "ws_land_rover_junction_vehicles_wheels",
  "ws_mercedes_junction_vehicles_wheels",
  "ws_porsche_junction_vehicles_wheels",
  "ws_vw_junction_vehicles_wheels",
] as const;

function parseWsJunctionData(data: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function extractVehicleWheelFromParsed(
  parsed: Record<string, unknown>
): { vehicleId?: string; wheelId?: string; vehicleTitle?: string; wheelTitle?: string } {
  const getStr = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      const v = parsed[key];
      if (typeof v === "string" && v.trim() && v !== "undefined") return v.trim();
      const lower = key.toLowerCase();
      const found = Object.keys(parsed).find((k) => k.toLowerCase() === lower);
      if (found) {
        const val = parsed[found];
        if (typeof val === "string" && val.trim() && val !== "undefined") return val.trim();
      }
    }
    return undefined;
  };
  return {
    vehicleId: getStr("vehicle_id", "vehicleId"),
    wheelId: getStr("wheel_id", "wheelId"),
    vehicleTitle: getStr("vehicle_title", "vehicleTitle", "vehicle"),
    wheelTitle: getStr("wheel_title", "wheelTitle", "wheel"),
  };
}

/** Scan all ws_*_junction_vehicles_wheels tables and return vehicle–wheel connections from the `data` JSON. */
export const getWsVehicleWheelConnections = query({
  args: {},
  handler: async (ctx) => {
    const connections: {
      brand: string;
      vehicleId?: string;
      wheelId?: string;
      vehicleTitle?: string;
      wheelTitle?: string;
      raw?: Record<string, unknown>;
    }[] = [];
    const byBrand: Record<string, number> = {};

    type Row = { _id: string; data: string };
    const tables: { table: typeof WS_JUNCTION_TABLES[number]; brand: string }[] = [
      { table: "ws_944racing_junction_vehicles_wheels", brand: "944racing" },
      { table: "ws_alfa_romeo_junction_vehicles_wheels", brand: "alfa romeo" },
      { table: "ws_audi_junction_vehicles_wheels", brand: "audi" },
      { table: "ws_ferrari_junction_vehicles_wheels", brand: "ferrari" },
      { table: "ws_fiat_junction_vehicles_wheels", brand: "fiat" },
      { table: "ws_jaguar_junction_vehicles_wheels", brand: "jaguar" },
      { table: "ws_lamborghini_junction_vehicles_wheels", brand: "lamborghini" },
      { table: "ws_land_rover_junction_vehicles_wheels", brand: "land rover" },
      { table: "ws_mercedes_junction_vehicles_wheels", brand: "mercedes" },
      { table: "ws_porsche_junction_vehicles_wheels", brand: "porsche" },
      { table: "ws_vw_junction_vehicles_wheels", brand: "vw" },
    ];

    for (const { table, brand } of tables) {
      let rows: Row[] = [];
      try {
        switch (table) {
          case "ws_944racing_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_944racing_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_alfa_romeo_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_alfa_romeo_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_audi_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_audi_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_ferrari_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_ferrari_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_fiat_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_fiat_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_jaguar_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_jaguar_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_lamborghini_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_lamborghini_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_land_rover_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_land_rover_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_mercedes_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_mercedes_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_porsche_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_porsche_junction_vehicles_wheels").collect()) as Row[];
            break;
          case "ws_vw_junction_vehicles_wheels":
            rows = (await ctx.db.query("ws_vw_junction_vehicles_wheels").collect()) as Row[];
            break;
        }
      } catch {
        continue;
      }
      for (const row of rows) {
        const parsed = parseWsJunctionData(row.data);
        if (!parsed) continue;
        const { vehicleId, wheelId, vehicleTitle, wheelTitle } = extractVehicleWheelFromParsed(parsed);
        if (vehicleId || wheelId || vehicleTitle || wheelTitle) {
          connections.push({
            brand,
            vehicleId,
            wheelId,
            vehicleTitle,
            wheelTitle,
            raw: Object.keys(parsed).length <= 10 ? parsed : undefined,
          });
        } else {
          connections.push({ brand, raw: Object.keys(parsed).length <= 10 ? parsed : undefined });
        }
      }
      if (rows.length > 0) byBrand[brand] = (byBrand[brand] ?? 0) + rows.length;
    }

    return {
      total: connections.length,
      byBrand: Object.fromEntries(Object.entries(byBrand).sort((a, b) => b[1] - a[1])),
      connections,
    };
  },
});

// =============================================================================
// MIGRATION AUDIT (data quality after Supabase → Convex migration)
// =============================================================================

export const migrationAudit = query({
  args: {},
  handler: async (ctx) => {
    const [
      brands,
      vehicles,
      wheels,
      jvb,
      jwb,
      boltPatterns,
      centerBores,
      colors,
      diameters,
      widths,
    ] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("j_vehicle_brand").collect(),
      ctx.db.query("j_wheel_brand").collect(),
      ctx.db.query("oem_bolt_patterns").collect(),
      ctx.db.query("oem_center_bores").collect(),
      ctx.db.query("oem_colors").collect(),
      ctx.db.query("oem_diameters").collect(),
      ctx.db.query("oem_widths").collect(),
    ]);

    const vehicleIdsWithBrand = new Set(jvb.map((l) => l.vehicle_id));
    const wheelIdsWithBrand = new Set(jwb.map((l) => l.wheel_id));

    const vehiclesWithoutBrand = vehicles.filter((v) => !vehicleIdsWithBrand.has(v._id));
    const wheelsWithoutBrand = wheels.filter((w) => !wheelIdsWithBrand.has(w._id));

    const wheelsMissingTitle = wheels.filter((w) => !w.wheel_title?.trim());
    const wheelsMissingId = wheels.filter((w) => !w.id?.trim());
    const vehiclesMissingTitle = vehicles.filter((v) => !(v.vehicle_title?.trim() || v.model_name?.trim()));

    return {
      counts: {
        brands: brands.length,
        vehicles: vehicles.length,
        wheels: wheels.length,
        j_vehicle_brand: jvb.length,
        j_wheel_brand: jwb.length,
        oem_bolt_patterns: boltPatterns.length,
        oem_center_bores: centerBores.length,
        oem_colors: colors.length,
        oem_diameters: diameters.length,
        oem_widths: widths.length,
      },
      gaps: {
        vehiclesWithoutBrand: vehiclesWithoutBrand.length,
        wheelsWithoutBrand: wheelsWithoutBrand.length,
        wheelsMissingTitle: wheelsMissingTitle.length,
        wheelsMissingId: wheelsMissingId.length,
        vehiclesMissingTitle: vehiclesMissingTitle.length,
      },
      samples: {
        vehiclesWithoutBrand: vehiclesWithoutBrand.slice(0, 5).map((v) => ({
          _id: v._id,
          id: v.id,
          vehicle_title: v.vehicle_title,
          model_name: v.model_name,
          text_brands: v.text_brands,
        })),
        wheelsWithoutBrand: wheelsWithoutBrand.slice(0, 5).map((w) => ({
          _id: w._id,
          id: w.id,
          wheel_title: w.wheel_title,
          jnc_brands: w.jnc_brands,
        })),
        wheelsMissingTitle: wheelsMissingTitle.slice(0, 5).map((w) => ({
          _id: w._id,
          id: w.id,
          wheel_title: w.wheel_title,
        })),
        j_wheel_brand_sample: jwb.slice(0, 3).map((l) => ({
          wheel_id: l.wheel_id,
          brand_id: l.brand_id,
          wheel_title: l.wheel_title,
          brand_title: l.brand_title,
        })),
      },
    };
  },
});

// =============================================================================
// WHEEL SPECS FOR BACKFILL (Phase 3 — aggregate from junction tables)
// =============================================================================

export const wheelsGetJunctionSpecsForBackfill = query({
  args: {},
  handler: async (ctx) => {
    const [diameters, widths, boltPatterns, centerBores, colors] = await Promise.all([
      ctx.db.query("j_wheel_diameter").collect(),
      ctx.db.query("j_wheel_width").collect(),
      ctx.db.query("j_wheel_bolt_pattern").collect(),
      ctx.db.query("j_wheel_center_bore").collect(),
      ctx.db.query("j_wheel_color").collect(),
    ]);
    const byWheel = new Map<
      string,
      { text_diameters: string[]; text_widths: string[]; text_bolt_patterns: string[]; text_center_bores: string[]; text_colors: string[] }
    >();
    function add(id: string, key: "text_diameters" | "text_widths" | "text_bolt_patterns" | "text_center_bores" | "text_colors", value: string) {
      if (!value?.trim()) return;
      let m = byWheel.get(id);
      if (!m) {
        m = { text_diameters: [], text_widths: [], text_bolt_patterns: [], text_center_bores: [], text_colors: [] };
        byWheel.set(id, m);
      }
      const arr = m[key];
      if (!arr.includes(value.trim())) arr.push(value.trim());
    }
    for (const r of diameters) add(r.wheel_id, "text_diameters", r.diameter);
    for (const r of widths) add(r.wheel_id, "text_widths", r.width);
    for (const r of boltPatterns) add(r.wheel_id, "text_bolt_patterns", r.bolt_pattern);
    for (const r of centerBores) add(r.wheel_id, "text_center_bores", r.center_bore);
    for (const r of colors) add(r.wheel_id, "text_colors", r.color);
    return Array.from(byWheel.entries()).map(([wheel_id, m]) => ({
      wheel_id: wheel_id as Id<"oem_wheels">,
      text_diameters: m.text_diameters.length ? m.text_diameters.join(", ") : undefined,
      text_widths: m.text_widths.length ? m.text_widths.join(", ") : undefined,
      text_bolt_patterns: m.text_bolt_patterns.length ? m.text_bolt_patterns.join(", ") : undefined,
      text_center_bores: m.text_center_bores.length ? m.text_center_bores.join(", ") : undefined,
      text_colors: m.text_colors.length ? m.text_colors.join(", ") : undefined,
    }));
  },
});

// =============================================================================
// FULL DATA AUDIT — every cell we need per entity (for to-do list)
// =============================================================================

const BRAND_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "brand_title", label: "Brand title", required: true },
  { key: "brand_description", label: "Description", required: false },
  { key: "brand_image_url", label: "Brand image URL", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "country_of_origin", label: "Country of origin", required: false },
  { key: "founded_year", label: "Founded year", required: false },
] as const;

const VEHICLE_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "vehicle_title", label: "Vehicle title", required: true },
  { key: "model_name", label: "Model name", required: false },
  { key: "generation", label: "Generation", required: false },
  { key: "production_years", label: "Production years", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "bad_pic_url", label: "Bad pic URL", required: false },
  { key: "text_brands", label: "Text brands (or j_vehicle_brand)", required: false },
] as const;

const WHEEL_FIELDS = [
  { key: "id", label: "ID (legacy)", required: true },
  { key: "slug", label: "Slug (URL)", required: true },
  { key: "wheel_title", label: "Wheel title", required: true },
  { key: "part_numbers", label: "Part numbers", required: false },
  { key: "good_pic_url", label: "Good pic URL", required: false },
  { key: "bad_pic_url", label: "Bad pic URL", required: false },
  { key: "weight", label: "Weight", required: false },
  { key: "metal_type", label: "Metal type", required: false },
  { key: "color", label: "Color", required: false },
  { key: "wheel_offset", label: "Offset", required: false },
  { key: "jnc_brands", label: "Junction brands (from j_wheel_brand)", required: false },
  { key: "text_diameters", label: "Text diameters", required: false },
  { key: "text_widths", label: "Text widths", required: false },
  { key: "text_bolt_patterns", label: "Text bolt patterns", required: false },
  { key: "text_center_bores", label: "Text center bores", required: false },
  { key: "text_colors", label: "Text colors", required: false },
  { key: "notes", label: "Notes", required: false },
] as const;

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (typeof v === "number") return Number.isNaN(v);
  return false;
}

export const fullDataAudit = query({
  args: {},
  handler: async (ctx) => {
    const [brands, vehicles, wheels, jvb, jwb] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("j_vehicle_brand").collect(),
      ctx.db.query("j_wheel_brand").collect(),
    ]);

    const vehicleHasBrand = new Set(jvb.map((l) => l.vehicle_id));
    const wheelHasBrand = new Set(jwb.map((l) => l.wheel_id));

    const brandRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of BRAND_FIELDS) {
      const missing = brands.filter((b) => isEmpty((b as Record<string, unknown>)[f.key]));
      brandRows.push({
        field: f.key,
        label: f.label,
        required: f.required,
        total: brands.length,
        missing: missing.length,
        sampleIds: missing.slice(0, 15).map((b) => (b.id ?? b._id) as string),
      });
    }

    const vehicleRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of VEHICLE_FIELDS) {
      if (f.key === "text_brands") {
        const missing = vehicles.filter((v) => !vehicleHasBrand.has(v._id) && isEmpty((v as Record<string, unknown>).text_brands));
        vehicleRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: vehicles.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((v) => (v.id ?? v._id) as string),
        });
      } else {
        const missing = vehicles.filter((v) => isEmpty((v as Record<string, unknown>)[f.key]));
        vehicleRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: vehicles.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((v) => (v.id ?? v._id) as string),
        });
      }
    }

    const wheelRows: { field: string; label: string; required: boolean; total: number; missing: number; sampleIds: string[] }[] = [];
    for (const f of WHEEL_FIELDS) {
      if (f.key === "jnc_brands") {
        const missing = wheels.filter((w) => !wheelHasBrand.has(w._id) && isEmpty((w as Record<string, unknown>).jnc_brands));
        wheelRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: wheels.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((w) => (w.id ?? w._id) as string),
        });
      } else {
        const missing = wheels.filter((w) => isEmpty((w as Record<string, unknown>)[f.key]));
        wheelRows.push({
          field: f.key,
          label: f.label,
          required: f.required,
          total: wheels.length,
          missing: missing.length,
          sampleIds: missing.slice(0, 15).map((w) => (w.id ?? w._id) as string),
        });
      }
    }

    // Per-record missing fields (for to-do: first 50 brands, 50 vehicles, 100 wheels with any missing required or any missing field)
    const brandTodo = brands
      .map((b) => {
        const missing = BRAND_FIELDS.filter((f) => isEmpty((b as Record<string, unknown>)[f.key])).map((f) => f.key);
        return { id: (b.id ?? b._id) as string, title: b.brand_title ?? b.id ?? String(b._id), missing };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 200);

    const vehicleTodo = vehicles
      .map((v) => {
        const hasBrand = vehicleHasBrand.has(v._id) || !isEmpty((v as Record<string, unknown>).text_brands);
        const missing = VEHICLE_FIELDS.filter((f) => {
          if (f.key === "text_brands") return !hasBrand;
          return isEmpty((v as Record<string, unknown>)[f.key]);
        }).map((f) => f.key);
        return {
          id: (v.id ?? v._id) as string,
          title: v.vehicle_title ?? v.model_name ?? v.id ?? String(v._id),
          missing,
        };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 200);

    const wheelTodo = wheels
      .map((w) => {
        const hasBrand = wheelHasBrand.has(w._id) || !isEmpty((w as Record<string, unknown>).jnc_brands);
        const missing = WHEEL_FIELDS.filter((f) => {
          if (f.key === "jnc_brands") return !hasBrand;
          return isEmpty((w as Record<string, unknown>)[f.key]);
        }).map((f) => f.key);
        return {
          id: (w.id ?? w._id) as string,
          title: (w.wheel_title ?? w.id ?? String(w._id)) as string,
          missing,
        };
      })
      .filter((r) => r.missing.length > 0)
      .slice(0, 300);

    return {
      byTable: {
        oem_brands: { total: brands.length, fields: brandRows },
        oem_vehicles: { total: vehicles.length, fields: vehicleRows },
        oem_wheels: { total: wheels.length, fields: wheelRows },
      },
      todo: {
        brands: brandTodo,
        vehicles: vehicleTodo,
        wheels: wheelTodo,
      },
      totalWithMissing: {
        brands: brands.filter((b) => BRAND_FIELDS.some((f) => isEmpty((b as Record<string, unknown>)[f.key]))).length,
        vehicles: vehicles.filter((v) => {
          const hasBrand = vehicleHasBrand.has(v._id) || !isEmpty((v as Record<string, unknown>).text_brands);
          return VEHICLE_FIELDS.some((f) => {
            if (f.key === "text_brands") return !hasBrand;
            return isEmpty((v as Record<string, unknown>)[f.key]);
          });
        }).length,
        wheels: wheels.filter((w) => {
          const hasBrand = wheelHasBrand.has(w._id) || !isEmpty((w as Record<string, unknown>).jnc_brands);
          return WHEEL_FIELDS.some((f) => {
            if (f.key === "jnc_brands") return !hasBrand;
            return isEmpty((w as Record<string, unknown>)[f.key]);
          });
        }).length,
      },
      fieldDefinitions: {
        brands: BRAND_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
        vehicles: VEHICLE_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
        wheels: WHEEL_FIELDS.map((f) => ({ key: f.key, label: f.label, required: f.required })),
      },
    };
  },
});
