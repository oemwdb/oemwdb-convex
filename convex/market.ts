import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

const ADMIN_EMAILS = new Set(["gabrielvarzaru96@gmail.com"]);
const DEFAULT_PLACEMENT_PRICE_USD = 1;
const DEFAULT_PLACEMENT_DURATION_DAYS = 30;
const MEMBERSHIP_INCLUDED_SLOTS = 20;

const optionalString = v.optional(v.string());
const optionalNumber = v.optional(v.number());
const optionalWheelId = v.optional(v.id("oem_wheels"));
const optionalWheelVariantId = v.optional(v.id("oem_wheel_variants"));
const optionalVehicleId = v.optional(v.id("oem_vehicles"));
const optionalVehicleVariantId = v.optional(v.id("oem_vehicle_variants"));
const optionalBrandId = v.optional(v.id("oem_brands"));

type MarketListingDoc = Doc<"market_listings">;

type LinkedObject = {
  type: "brand" | "wheel" | "wheel_variant" | "vehicle" | "vehicle_variant";
  id: string;
  label: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

function normalizeEmailCandidate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.includes("@") ? normalized : null;
}

function getIdentityEmailCandidates(identity: any): string[] {
  const candidates = new Set<string>();
  const direct = [
    identity?.email,
    identity?.preferredUsername,
    identity?.nickname,
  ];

  for (const candidate of direct) {
    const normalized = normalizeEmailCandidate(candidate);
    if (normalized) candidates.add(normalized);
  }

  const tokenIdentifier = typeof identity?.tokenIdentifier === "string"
    ? identity.tokenIdentifier
    : "";

  for (const piece of tokenIdentifier.split(/[|,\s:;]+/)) {
    const normalized = normalizeEmailCandidate(piece);
    if (normalized) candidates.add(normalized);
  }

  return [...candidates];
}

async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const emailCandidates = getIdentityEmailCandidates(identity);
  const isAdmin = emailCandidates.some((candidate) => ADMIN_EMAILS.has(candidate));

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  return {
    ...identity,
    subject: typeof identity.subject === "string"
      ? identity.subject.split("|")[0]
      : identity.subject,
  };
}

function normalizeSellerKey(rawSellerKey: string | undefined, sellerDisplayName: string | undefined) {
  const source = (rawSellerKey || sellerDisplayName || "seller").trim().toLowerCase();
  const normalized = source
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "seller";
}

function normalizeCoverage(value: string | undefined) {
  return value === "membership" ? "membership" : "paid";
}

function normalizeModerationStatus(value: string | undefined) {
  if (value === "pending" || value === "approved" || value === "rejected") {
    return value;
  }
  return "approved";
}

function normalizeStatus(value: string | undefined) {
  if (value === "draft" || value === "active" || value === "inactive" || value === "expired" || value === "scheduled") {
    return value;
  }
  return "active";
}

function parseIsoDate(value: string | undefined | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function coerceIsoDate(value: string | undefined | null, fallback: string) {
  const parsed = parseIsoDate(value);
  return parsed ? parsed.toISOString() : fallback;
}

function addDays(isoDate: string, days: number) {
  const parsed = parseIsoDate(isoDate) ?? new Date();
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString();
}

function getImageUrl(listing: MarketListingDoc) {
  if (listing.image_url) return listing.image_url;
  if (listing.images && listing.images.length > 0) return listing.images[0];
  return null;
}

function isValidExternalUrl(value: string | undefined | null) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function computeEffectiveStatus(listing: MarketListingDoc, nowMs: number) {
  const storedStatus = normalizeStatus(listing.status);
  if (storedStatus === "inactive" || listing.is_active === false) return "inactive";
  if (storedStatus === "draft") return "draft";

  const startDate = parseIsoDate(listing.start_date);
  const endDate = parseIsoDate(listing.end_date);

  if (endDate && endDate.getTime() < nowMs) return "expired";
  if (startDate && startDate.getTime() > nowMs) return "scheduled";
  if (storedStatus === "expired") return "expired";
  return "active";
}

function isPubliclyVisible(listing: MarketListingDoc, nowMs: number) {
  return (
    computeEffectiveStatus(listing, nowMs) === "active" &&
    normalizeModerationStatus(listing.moderation_status) === "approved" &&
    isValidExternalUrl(listing.destination_url)
  );
}

function occupiesMembershipSlot(listing: MarketListingDoc, nowMs: number) {
  if (normalizeCoverage(listing.placement_coverage) !== "membership") return false;
  if (normalizeModerationStatus(listing.moderation_status) === "rejected") return false;
  const effectiveStatus = computeEffectiveStatus(listing, nowMs);
  return effectiveStatus === "active" || effectiveStatus === "scheduled" || effectiveStatus === "draft";
}

function uniqueStrings(values: Array<string | undefined | null>) {
  return [...new Set(values.filter((value): value is string => !!value && value.trim().length > 0))];
}

function sortMarketItems<T extends { startDate?: string | null; createdAt?: string | null }>(items: T[]) {
  return items.sort((a, b) => {
    const aTime = parseIsoDate(a.startDate ?? a.createdAt ?? null)?.getTime() ?? 0;
    const bTime = parseIsoDate(b.startDate ?? b.createdAt ?? null)?.getTime() ?? 0;
    return bTime - aTime;
  });
}

async function buildLinkedObjects(ctx: any, listing: MarketListingDoc): Promise<LinkedObject[]> {
  const linkedObjects: LinkedObject[] = [];

  if (listing.brand_id) {
    const brand = await ctx.db.get(listing.brand_id);
    if (brand) {
      linkedObjects.push({
        type: "brand",
        id: String(brand._id),
        label: brand.brand_title ?? brand.slug ?? brand.id ?? "Brand",
        imageUrl: brand.brand_image_url ?? brand.good_pic_url ?? brand.bad_pic_url ?? null,
      });
    }
  }

  if (listing.vehicle_id) {
    const vehicle = await ctx.db.get(listing.vehicle_id);
    if (vehicle) {
      linkedObjects.push({
        type: "vehicle",
        id: String(vehicle._id),
        label: vehicle.vehicle_title ?? vehicle.model_name ?? vehicle.slug ?? vehicle.id ?? "Vehicle",
        subtitle: vehicle.generation ?? null,
        imageUrl: vehicle.good_pic_url ?? vehicle.bad_pic_url ?? null,
      });
    }
  }

  if (listing.vehicle_variant_id) {
    const variant = await ctx.db.get(listing.vehicle_variant_id);
    if (variant) {
      linkedObjects.push({
        type: "vehicle_variant",
        id: String(variant._id),
        label: variant.variant_title ?? variant.trim_level ?? variant.slug ?? "Vehicle Variant",
        subtitle: variant.market ?? null,
        imageUrl: variant.good_pic_url ?? variant.bad_pic_url ?? null,
      });
    }
  }

  if (listing.wheel_id) {
    const wheel = await ctx.db.get(listing.wheel_id);
    if (wheel) {
      linkedObjects.push({
        type: "wheel",
        id: String(wheel._id),
        label: wheel.wheel_title ?? wheel.slug ?? wheel.id ?? "Wheel",
        subtitle: wheel.style_number ?? null,
        imageUrl: wheel.good_pic_url ?? wheel.bad_pic_url ?? null,
      });
    }
  }

  if (listing.wheel_variant_id) {
    const variant = await ctx.db.get(listing.wheel_variant_id);
    if (variant) {
      linkedObjects.push({
        type: "wheel_variant",
        id: String(variant._id),
        label: variant.variant_title ?? variant.wheel_title ?? variant.slug ?? "Wheel Variant",
        subtitle: uniqueStrings([variant.color, variant.finish, variant.part_numbers]).join(" • ") || null,
        imageUrl: variant.good_pic_url ?? variant.bad_pic_url ?? null,
      });
    }
  }

  return linkedObjects;
}

function buildExternalLinksForVehicle(vehicle: any, brandTitle: string | null) {
  const vehicleName = vehicle?.vehicle_title ?? vehicle?.model_name ?? vehicle?.generation ?? "";
  const searchTerm = uniqueStrings([brandTitle, vehicleName]).join(" ").trim();
  if (!searchTerm) return [];

  return [
    {
      provider: "AutoScout24",
      url: `https://www.autoscout24.com/lst?query=${encodeURIComponent(searchTerm)}`,
    },
    {
      provider: "eBay Motors",
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}&_sacat=6001`,
    },
    {
      provider: "Autotrader",
      url: `https://www.autotrader.com/cars-for-sale/all-cars?searchRadius=0&keywordPhrases=${encodeURIComponent(searchTerm)}`,
    },
    {
      provider: "Facebook Marketplace",
      url: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(searchTerm)}`,
    },
  ];
}

function buildExternalLinksForVehicleVariant(
  variant: any,
  vehicle: any,
  brandTitle: string | null
) {
  const variantName =
    variant?.variant_title ??
    variant?.trim_level ??
    variant?.engine_variant_title ??
    "";
  const vehicleName =
    vehicle?.vehicle_title ??
    vehicle?.model_name ??
    vehicle?.generation ??
    "";
  const searchTerm = uniqueStrings([brandTitle, vehicleName, variantName]).join(" ").trim();
  if (!searchTerm) return [];
  return buildExternalLinksForVehicle({ vehicle_title: `${vehicleName} ${variantName}`.trim() }, brandTitle);
}

function buildExternalLinksForWheelVariant(
  variant: any,
  wheel: any,
  brandTitle: string | null
) {
  const wheelName = wheel?.wheel_title ?? wheel?.slug ?? wheel?.id ?? "";
  const variantName =
    variant?.variant_title ??
    variant?.finish ??
    variant?.color ??
    "";
  const partNumber = typeof variant?.part_numbers === "string"
    ? variant.part_numbers.split(/[,;\n]/)[0]?.trim() ?? ""
    : "";
  const searchTerm = uniqueStrings([brandTitle, wheelName, variantName, partNumber]).join(" ").trim();
  if (!searchTerm) return [];

  return [
    {
      provider: "eBay Motors",
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}&_sacat=6000`,
    },
    {
      provider: "Facebook Marketplace",
      url: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(searchTerm)}`,
    },
  ];
}

async function buildMarketItem(ctx: any, listing: MarketListingDoc) {
  const nowMs = Date.now();
  const linkedObjects = await buildLinkedObjects(ctx, listing);
  const effectiveStatus = computeEffectiveStatus(listing, nowMs);

  return {
    _id: listing._id,
    userId: listing.user_id,
    listingType: listing.listing_type,
    title: listing.title,
    shortDescription: listing.short_description ?? null,
    description: listing.description ?? null,
    price: listing.price ?? null,
    currency: listing.currency ?? "USD",
    imageUrl: getImageUrl(listing),
    imageGallery: listing.images ?? [],
    destinationUrl: listing.destination_url ?? null,
    sourceProvider: listing.source_provider ?? "external",
    location: listing.location ?? null,
    sellerDisplayName: listing.seller_display_name ?? null,
    sellerKey: listing.seller_key ?? null,
    placementCoverage: normalizeCoverage(listing.placement_coverage),
    placementPriceUsd: listing.placement_price_usd ?? (normalizeCoverage(listing.placement_coverage) === "membership" ? 0 : DEFAULT_PLACEMENT_PRICE_USD),
    placementDurationDays: listing.placement_duration_days ?? DEFAULT_PLACEMENT_DURATION_DAYS,
    moderationStatus: normalizeModerationStatus(listing.moderation_status),
    status: normalizeStatus(listing.status),
    effectiveStatus,
    isActive: effectiveStatus === "active",
    startDate: listing.start_date ?? null,
    endDate: listing.end_date ?? null,
    createdAt: listing.created_at ?? null,
    updatedAt: listing.updated_at ?? null,
    linkedObjects,
  };
}

async function getSellerPlacementSummary(ctx: any, sellerKey: string, excludeListingId?: Id<"market_listings">) {
  const nowMs = Date.now();
  const listings = await ctx.db
    .query("market_listings")
    .withIndex("by_seller_key", (q: any) => q.eq("seller_key", sellerKey))
    .collect();

  const filtered = listings.filter((listing: MarketListingDoc) => listing._id !== excludeListingId);
  const activeFeaturedPlacements = filtered.filter((listing) => isPubliclyVisible(listing, nowMs)).length;
  const activeMembershipPlacements = filtered.filter((listing) => occupiesMembershipSlot(listing, nowMs)).length;

  return {
    sellerKey,
    activeFeaturedPlacements,
    activeMembershipPlacements,
    includedMembershipSlots: MEMBERSHIP_INCLUDED_SLOTS,
    remainingMembershipPlacements: Math.max(0, MEMBERSHIP_INCLUDED_SLOTS - activeMembershipPlacements),
  };
}

function ensureLinkedObjectPresent(args: {
  brandId?: Id<"oem_brands">;
  wheelId?: Id<"oem_wheels">;
  wheelVariantId?: Id<"oem_wheel_variants">;
  vehicleId?: Id<"oem_vehicles">;
  vehicleVariantId?: Id<"oem_vehicle_variants">;
}) {
  if (!args.brandId && !args.wheelId && !args.wheelVariantId && !args.vehicleId && !args.vehicleVariantId) {
    throw new Error("At least one linked OEMWDB object is required.");
  }
}

async function validateMembershipCapacity(ctx: any, sellerKey: string, excludeListingId?: Id<"market_listings">) {
  const summary = await getSellerPlacementSummary(ctx, sellerKey, excludeListingId);
  if (summary.activeMembershipPlacements >= MEMBERSHIP_INCLUDED_SLOTS) {
    throw new Error(`Membership slot limit reached for ${sellerKey}.`);
  }
  return summary;
}

const featuredItemArgs = {
  title: v.string(),
  shortDescription: optionalString,
  description: optionalString,
  price: optionalNumber,
  currency: optionalString,
  imageUrl: optionalString,
  images: v.optional(v.array(v.string())),
  destinationUrl: v.string(),
  sourceProvider: v.string(),
  listingType: v.string(),
  location: optionalString,
  sellerDisplayName: v.string(),
  sellerKey: optionalString,
  placementCoverage: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  moderationStatus: optionalString,
  status: optionalString,
  brandId: optionalBrandId,
  wheelId: optionalWheelId,
  wheelVariantId: optionalWheelVariantId,
  vehicleId: optionalVehicleId,
  vehicleVariantId: optionalVehicleVariantId,
};

export const browseFeaturedItems = query({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db
      .query("market_listings")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const nowMs = Date.now();
    const visible = listings.filter((listing) => isPubliclyVisible(listing, nowMs));
    const items = sortMarketItems(await Promise.all(visible.map((listing) => buildMarketItem(ctx, listing))));

    return {
      pricing: {
        singlePlacementUsd: DEFAULT_PLACEMENT_PRICE_USD,
        placementDurationDays: DEFAULT_PLACEMENT_DURATION_DAYS,
        membershipPriceUsd: 5,
        membershipIncludedSlots: MEMBERSHIP_INCLUDED_SLOTS,
      },
      items,
    };
  },
});

export const surfaceByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    const [wheel, directListings, wheelVariants] = await Promise.all([
      ctx.db.get(args.wheelId),
      ctx.db.query("market_listings").withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId)).collect(),
      ctx.db.query("oem_wheel_variants").withIndex("by_wheel_id", (q) => q.eq("wheel_id", args.wheelId)).collect(),
    ]);

    const variantListings = await Promise.all(
      wheelVariants.map((variant: Doc<"oem_wheel_variants">) =>
        ctx.db
          .query("market_listings")
          .withIndex("by_wheel_variant", (q) => q.eq("wheel_variant_id", variant._id))
          .collect()
      )
    );

    const listingMap = new Map<string, MarketListingDoc>();
    for (const listing of directListings) {
      listingMap.set(String(listing._id), listing);
    }
    for (const listingGroup of variantListings) {
      for (const listing of listingGroup) {
        listingMap.set(String(listing._id), listing);
      }
    }

    const nowMs = Date.now();
    const items = sortMarketItems(
      await Promise.all(
        [...listingMap.values()]
          .filter((listing) => isPubliclyVisible(listing, nowMs))
          .map((listing) => buildMarketItem(ctx, listing))
      )
    );

    return {
      targetSummary: {
        id: String(args.wheelId),
        type: "wheel",
        title: wheel?.wheel_title ?? wheel?.slug ?? wheel?.id ?? "Wheel",
      },
      items,
    };
  },
});

export const surfaceByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    const [vehicle, directListings, vehicleVariants] = await Promise.all([
      ctx.db.get(args.vehicleId),
      ctx.db.query("market_listings").withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId)).collect(),
      ctx.db.query("oem_vehicle_variants").withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", args.vehicleId)).collect(),
    ]);

    const variantListings = await Promise.all(
      vehicleVariants.map((variant: Doc<"oem_vehicle_variants">) =>
        ctx.db
          .query("market_listings")
          .withIndex("by_vehicle_variant", (q) => q.eq("vehicle_variant_id", variant._id))
          .collect()
      )
    );

    const listingMap = new Map<string, MarketListingDoc>();
    for (const listing of directListings) {
      listingMap.set(String(listing._id), listing);
    }
    for (const listingGroup of variantListings) {
      for (const listing of listingGroup) {
        listingMap.set(String(listing._id), listing);
      }
    }

    let brandTitle: string | null = null;
    if (vehicle?.brand_id) {
      const brand = await ctx.db.get(vehicle.brand_id);
      brandTitle = brand?.brand_title ?? null;
    }

    const nowMs = Date.now();
    const items = sortMarketItems(
      await Promise.all(
        [...listingMap.values()]
          .filter((listing) => isPubliclyVisible(listing, nowMs))
          .map((listing) => buildMarketItem(ctx, listing))
      )
    );

    return {
      targetSummary: {
        id: String(args.vehicleId),
        type: "vehicle",
        title: vehicle?.vehicle_title ?? vehicle?.model_name ?? vehicle?.generation ?? "Vehicle",
      },
      externalLinks: buildExternalLinksForVehicle(vehicle, brandTitle),
      items,
    };
  },
});

export const surfaceByVehicleVariant = query({
  args: { vehicleVariantId: v.id("oem_vehicle_variants") },
  handler: async (ctx, args) => {
    const [variant, listings] = await Promise.all([
      ctx.db.get(args.vehicleVariantId),
      ctx.db
        .query("market_listings")
        .withIndex("by_vehicle_variant", (q) => q.eq("vehicle_variant_id", args.vehicleVariantId))
        .collect(),
    ]);

    const vehicle = variant?.vehicle_id ? await ctx.db.get(variant.vehicle_id) : null;
    const brand = vehicle?.brand_id ? await ctx.db.get(vehicle.brand_id) : null;

    const nowMs = Date.now();
    const items = sortMarketItems(
      await Promise.all(
        listings
          .filter((listing) => isPubliclyVisible(listing, nowMs))
          .map((listing) => buildMarketItem(ctx, listing))
      )
    );

    return {
      targetSummary: {
        id: String(args.vehicleVariantId),
        type: "vehicle_variant",
        title: variant?.variant_title ?? variant?.trim_level ?? variant?.slug ?? "Vehicle Variant",
      },
      externalLinks: buildExternalLinksForVehicleVariant(variant, vehicle, brand?.brand_title ?? null),
      items,
    };
  },
});

export const surfaceByWheelVariant = query({
  args: { wheelVariantId: v.id("oem_wheel_variants") },
  handler: async (ctx, args) => {
    const [variant, listings] = await Promise.all([
      ctx.db.get(args.wheelVariantId),
      ctx.db
        .query("market_listings")
        .withIndex("by_wheel_variant", (q) => q.eq("wheel_variant_id", args.wheelVariantId))
        .collect(),
    ]);

    const wheel = variant?.wheel_id ? await ctx.db.get(variant.wheel_id) : null;
    const brand = variant?.brand_id
      ? await ctx.db.get(variant.brand_id)
      : wheel?.brand_id
        ? await ctx.db.get(wheel.brand_id)
        : null;

    const nowMs = Date.now();
    const items = sortMarketItems(
      await Promise.all(
        listings
          .filter((listing) => isPubliclyVisible(listing, nowMs))
          .map((listing) => buildMarketItem(ctx, listing))
      )
    );

    return {
      targetSummary: {
        id: String(args.wheelVariantId),
        type: "wheel_variant",
        title: variant?.variant_title ?? variant?.wheel_title ?? variant?.slug ?? "Wheel Variant",
      },
      externalLinks: buildExternalLinksForWheelVariant(variant, wheel, brand?.brand_title ?? null),
      items,
    };
  },
});

export const surfaceByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    const [brand, listings] = await Promise.all([
      ctx.db.get(args.brandId),
      ctx.db.query("market_listings").withIndex("by_brand", (q) => q.eq("brand_id", args.brandId)).collect(),
    ]);

    const nowMs = Date.now();
    const items = sortMarketItems(
      await Promise.all(
        listings
          .filter((listing) => isPubliclyVisible(listing, nowMs))
          .map((listing) => buildMarketItem(ctx, listing))
      )
    );

    return {
      targetSummary: {
        id: String(args.brandId),
        type: "brand",
        title: brand?.brand_title ?? brand?.slug ?? brand?.id ?? "Brand",
      },
      items,
    };
  },
});

export const adminFeaturedItemsIndex = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const listings = await ctx.db.query("market_listings").collect();
    const items = sortMarketItems(await Promise.all(listings.map((listing) => buildMarketItem(ctx, listing))));

    return {
      summary: {
        total: items.length,
        live: items.filter((item) => item.isActive && item.moderationStatus === "approved").length,
        pendingModeration: items.filter((item) => item.moderationStatus === "pending").length,
        membershipCovered: items.filter((item) => item.placementCoverage === "membership").length,
        paidPlacements: items.filter((item) => item.placementCoverage === "paid").length,
      },
      items,
    };
  },
});

export const adminFeaturedItemGet = query({
  args: { listingId: v.id("market_listings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (!listing) return null;

    const item = await buildMarketItem(ctx, listing);
    const sellerSummary = item.sellerKey
      ? await getSellerPlacementSummary(ctx, item.sellerKey, args.listingId)
      : null;

    return { item, sellerSummary };
  },
});

export const adminSellerPlacementSummary = query({
  args: {
    sellerKey: v.string(),
    excludeListingId: v.optional(v.id("market_listings")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return getSellerPlacementSummary(ctx, normalizeSellerKey(args.sellerKey, args.sellerKey), args.excludeListingId);
  },
});

export const adminLinkSearch = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const searchTerm = args.search.trim().toLowerCase();
    if (searchTerm.length < 2) {
      return {
        brands: [],
        wheels: [],
        wheelVariants: [],
        vehicles: [],
        vehicleVariants: [],
      };
    }

    const [brands, wheels, wheelVariants, vehicles, vehicleVariants] = await Promise.all([
      ctx.db.query("oem_brands").withIndex("by_brand_title").order("asc").collect(),
      ctx.db.query("oem_wheels").withIndex("by_wheel_title").order("asc").collect(),
      ctx.db.query("oem_wheel_variants").collect(),
      ctx.db.query("oem_vehicles").withIndex("by_vehicle_title").order("asc").collect(),
      ctx.db.query("oem_vehicle_variants").collect(),
    ]);

    const includesTerm = (...values: Array<string | undefined | null>) =>
      values.some((value) => value?.toLowerCase().includes(searchTerm));

    return {
      brands: brands
        .filter((brand: Doc<"oem_brands">) => includesTerm(brand.brand_title, brand.slug, brand.id))
        .slice(0, 8)
        .map((brand: Doc<"oem_brands">) => ({
          type: "brand",
          id: String(brand._id),
          label: brand.brand_title ?? brand.slug ?? brand.id ?? "Brand",
          imageUrl: brand.brand_image_url ?? brand.good_pic_url ?? brand.bad_pic_url ?? null,
        })),
      wheels: wheels
        .filter((wheel: Doc<"oem_wheels">) => includesTerm(wheel.wheel_title, wheel.slug, wheel.id, wheel.style_number, wheel.part_numbers))
        .slice(0, 8)
        .map((wheel: Doc<"oem_wheels">) => ({
          type: "wheel",
          id: String(wheel._id),
          label: wheel.wheel_title ?? wheel.slug ?? wheel.id ?? "Wheel",
          subtitle: wheel.style_number ?? null,
          imageUrl: wheel.good_pic_url ?? wheel.bad_pic_url ?? null,
        })),
      wheelVariants: wheelVariants
        .filter((variant: Doc<"oem_wheel_variants">) =>
          includesTerm(variant.variant_title, variant.wheel_title, variant.slug, variant.part_numbers, variant.color, variant.finish)
        )
        .slice(0, 8)
        .map((variant: Doc<"oem_wheel_variants">) => ({
          type: "wheel_variant",
          id: String(variant._id),
          label: variant.variant_title ?? variant.wheel_title ?? variant.slug ?? "Wheel Variant",
          subtitle: uniqueStrings([variant.color, variant.finish, variant.part_numbers]).join(" • ") || null,
          imageUrl: variant.good_pic_url ?? variant.bad_pic_url ?? null,
        })),
      vehicles: vehicles
        .filter((vehicle: Doc<"oem_vehicles">) => includesTerm(vehicle.vehicle_title, vehicle.model_name, vehicle.slug, vehicle.id, vehicle.generation))
        .slice(0, 8)
        .map((vehicle: Doc<"oem_vehicles">) => ({
          type: "vehicle",
          id: String(vehicle._id),
          label: vehicle.vehicle_title ?? vehicle.model_name ?? vehicle.slug ?? vehicle.id ?? "Vehicle",
          subtitle: vehicle.generation ?? null,
          imageUrl: vehicle.good_pic_url ?? vehicle.bad_pic_url ?? null,
        })),
      vehicleVariants: vehicleVariants
        .filter((variant: Doc<"oem_vehicle_variants">) =>
          includesTerm(variant.variant_title, variant.trim_level, variant.slug, variant.market, variant.notes)
        )
        .slice(0, 8)
        .map((variant: Doc<"oem_vehicle_variants">) => ({
          type: "vehicle_variant",
          id: String(variant._id),
          label: variant.variant_title ?? variant.trim_level ?? variant.slug ?? "Vehicle Variant",
          subtitle: variant.market ?? null,
          imageUrl: variant.good_pic_url ?? variant.bad_pic_url ?? null,
        })),
    };
  },
});

export const adminFeaturedItemCreate = mutation({
  args: featuredItemArgs,
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);

    if (!isValidExternalUrl(args.destinationUrl)) {
      throw new Error("A valid external destination URL is required.");
    }

    ensureLinkedObjectPresent(args);

    const now = new Date().toISOString();
    const startDate = coerceIsoDate(args.startDate, now);
    const endDate = coerceIsoDate(args.endDate, addDays(startDate, DEFAULT_PLACEMENT_DURATION_DAYS));
    const sellerKey = normalizeSellerKey(args.sellerKey, args.sellerDisplayName);
    const placementCoverage = normalizeCoverage(args.placementCoverage);

    if (placementCoverage === "membership") {
      await validateMembershipCapacity(ctx, sellerKey);
    }

    const imageGallery = uniqueStrings([args.imageUrl, ...(args.images ?? [])]);

    return await ctx.db.insert("market_listings", {
      user_id: identity.subject,
      listing_type: args.listingType,
      wheel_id: args.wheelId,
      wheel_variant_id: args.wheelVariantId,
      vehicle_id: args.vehicleId,
      vehicle_variant_id: args.vehicleVariantId,
      brand_id: args.brandId,
      title: args.title.trim(),
      short_description: args.shortDescription?.trim() || undefined,
      description: args.description?.trim() || undefined,
      price: args.price,
      currency: args.currency?.trim() || "USD",
      image_url: args.imageUrl?.trim() || imageGallery[0],
      images: imageGallery.length > 0 ? imageGallery : undefined,
      destination_url: args.destinationUrl.trim(),
      source_provider: args.sourceProvider.trim(),
      seller_display_name: args.sellerDisplayName.trim(),
      seller_key: sellerKey,
      placement_coverage: placementCoverage,
      placement_price_usd: placementCoverage === "membership" ? 0 : DEFAULT_PLACEMENT_PRICE_USD,
      placement_duration_days: DEFAULT_PLACEMENT_DURATION_DAYS,
      moderation_status: normalizeModerationStatus(args.moderationStatus),
      is_active: normalizeStatus(args.status) === "active",
      start_date: startDate,
      end_date: endDate,
      status: normalizeStatus(args.status),
      location: args.location?.trim() || undefined,
      created_at: now,
      updated_at: now,
    });
  },
});

export const adminFeaturedItemUpdate = mutation({
  args: {
    listingId: v.id("market_listings"),
    ...featuredItemArgs,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.listingId);
    if (!existing) {
      throw new Error("Featured item not found.");
    }

    if (!isValidExternalUrl(args.destinationUrl)) {
      throw new Error("A valid external destination URL is required.");
    }

    ensureLinkedObjectPresent(args);

    const now = new Date().toISOString();
    const startDate = coerceIsoDate(args.startDate, existing.start_date ?? now);
    const endDate = coerceIsoDate(args.endDate, addDays(startDate, DEFAULT_PLACEMENT_DURATION_DAYS));
    const sellerKey = normalizeSellerKey(args.sellerKey, args.sellerDisplayName);
    const placementCoverage = normalizeCoverage(args.placementCoverage);

    if (placementCoverage === "membership") {
      await validateMembershipCapacity(ctx, sellerKey, args.listingId);
    }

    const imageGallery = uniqueStrings([args.imageUrl, ...(args.images ?? [])]);

    await ctx.db.patch(args.listingId, {
      listing_type: args.listingType,
      wheel_id: args.wheelId,
      wheel_variant_id: args.wheelVariantId,
      vehicle_id: args.vehicleId,
      vehicle_variant_id: args.vehicleVariantId,
      brand_id: args.brandId,
      title: args.title.trim(),
      short_description: args.shortDescription?.trim() || undefined,
      description: args.description?.trim() || undefined,
      price: args.price,
      currency: args.currency?.trim() || "USD",
      image_url: args.imageUrl?.trim() || imageGallery[0],
      images: imageGallery.length > 0 ? imageGallery : undefined,
      destination_url: args.destinationUrl.trim(),
      source_provider: args.sourceProvider.trim(),
      seller_display_name: args.sellerDisplayName.trim(),
      seller_key: sellerKey,
      placement_coverage: placementCoverage,
      placement_price_usd: placementCoverage === "membership" ? 0 : DEFAULT_PLACEMENT_PRICE_USD,
      placement_duration_days: DEFAULT_PLACEMENT_DURATION_DAYS,
      moderation_status: normalizeModerationStatus(args.moderationStatus),
      is_active: normalizeStatus(args.status) === "active",
      start_date: startDate,
      end_date: endDate,
      status: normalizeStatus(args.status),
      location: args.location?.trim() || undefined,
      updated_at: now,
    });

    return args.listingId;
  },
});
