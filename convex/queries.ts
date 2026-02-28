/**
 * Convex queries for core domain tables with junction table lookups.
 * No *_ref fields. Use junction tables for many-to-many.
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

// =============================================================================
// OEM BRANDS
// =============================================================================

export const brandsGetAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("oem_brands")
      .withIndex("by_brand_title")
      .order("asc")
      .collect();
  },
});

export const brandsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_brands")
      .withIndex("by_id", (q) => q.eq("id", args.id))
      .first();
  },
});

export const brandsGetByTitle = query({
  args: { brandTitle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_brands")
      .withIndex("by_brand_title", (q) => q.eq("brand_title", args.brandTitle))
      .first();
  },
});

// =============================================================================
// OEM VEHICLES
// =============================================================================

export const vehiclesGetAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("oem_vehicles")
      .order("asc")
      .collect();
  },
});

export const vehiclesGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_vehicles")
      .withIndex("by_id", (q) => q.eq("id", args.id))
      .first();
  },
});

export const vehiclesGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db
      .query("oem_vehicles")
      .order("asc")
      .collect();
    const brands = await ctx.db.query("oem_brands").collect();
    const brandMap = new Map(brands.map((b) => [b._id, b]));
    return vehicles.map((v) => {
      const brand = brandMap.get(v.brand_id);
      return {
        ...v,
        brand_name: brand?.brand_title ?? "Unknown",
        brand_id: brand?.id ?? null,
      };
    });
  },
});

export const vehiclesGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_vehicles")
      .withIndex("by_brand_id", (q) => q.eq("brand_id", args.brandId))
      .collect();
  },
});

export const vehicleVariantsGetByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    const variants = await ctx.db
      .query("vehicle_variants")
      .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", args.vehicleId))
      .collect();
    return variants.sort(
      (a, b) => (a.year_from ?? 0) - (b.year_from ?? 0)
    );
  },
});

export const vehiclesGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_vehicles")),
  },
  handler: async (ctx, args) => {
    const vehicle =
      typeof args.id === "string"
        ? await ctx.db
            .query("oem_vehicles")
            .withIndex("by_id", (q) => q.eq("id", args.id as string))
            .first()
        : await ctx.db.get("oem_vehicles", args.id);
    if (!vehicle) return null;

    const vehicleId = vehicle._id;
    const [brand, engine, variants, wheels] = await Promise.all([
      ctx.db.get("oem_brands", vehicle.brand_id),
      vehicle.oem_engine_id
        ? ctx.db.get("oem_engines", vehicle.oem_engine_id)
        : null,
      ctx.db
        .query("vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", vehicleId))
        .collect(),
      ctx.db
        .query("wheel_vehicles")
        .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
        .collect(),
    ]);

    const wheelDocs = await Promise.all(
      wheels.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
    );

    return {
      ...vehicle,
      brand: brand ?? null,
      engine: engine ?? null,
      variants: variants ?? [],
      wheels: wheelDocs.filter((w): w is NonNullable<typeof w> => w !== null),
    };
  },
});

// =============================================================================
// OEM WHEELS
// =============================================================================

export const wheelsGetAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("oem_wheels")
      .order("asc")
      .collect();
  },
});

export const wheelsGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    const wheels = await ctx.db
      .query("oem_wheels")
      .order("asc")
      .collect();
    const brands = await ctx.db.query("oem_brands").collect();
    const brandMap = new Map(brands.map((b) => [b._id, b]));
    return wheels.map((w) => {
      const brand = brandMap.get(w.brand_id);
      return {
        ...w,
        brand_name: brand?.brand_title ?? "Unknown",
        brand_id: brand?.id ?? null,
      };
    });
  },
});

export const wheelsGetById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_wheels")
      .withIndex("by_id", (q) => q.eq("id", args.id))
      .first();
  },
});

export const wheelsGetByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_wheels")
      .withIndex("by_brand_id", (q) => q.eq("brand_id", args.brandId))
      .collect();
  },
});

export const wheelsGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_wheels")),
  },
  handler: async (ctx, args) => {
    const wheel =
      typeof args.id === "string"
        ? await ctx.db
            .query("oem_wheels")
            .withIndex("by_id", (q) => q.eq("id", args.id as string))
            .first()
        : await ctx.db.get("oem_wheels", args.id);
    if (!wheel) return null;

    const wheelId = wheel._id;
    const [
      brand,
      vehicleLinks,
      boltPatternLinks,
      diameterLinks,
      widthLinks,
      centerBoreLinks,
      colorLinks,
      tireSizeLinks,
    ] = await Promise.all([
      ctx.db.get("oem_brands", wheel.brand_id),
      ctx.db
        .query("wheel_vehicles")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_bolt_patterns")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_diameters")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_widths")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_center_bores")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_colors")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
      ctx.db
        .query("wheel_tire_sizes")
        .withIndex("by_wheel", (q) => q.eq("wheel_id", wheelId))
        .collect(),
    ]);

    const [vehicles, boltPatterns, diameters, widths, centerBores, colors, tireSizes] =
      await Promise.all([
        Promise.all(vehicleLinks.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))),
        Promise.all(
          boltPatternLinks.map((j) => ctx.db.get("oem_bolt_patterns", j.bolt_pattern_id))
        ),
        Promise.all(
          diameterLinks.map((j) => ctx.db.get("oem_diameters", j.diameter_id))
        ),
        Promise.all(widthLinks.map((j) => ctx.db.get("oem_widths", j.width_id))),
        Promise.all(
          centerBoreLinks.map((j) =>
            ctx.db.get("oem_center_bores", j.center_bore_id)
          )
        ),
        Promise.all(colorLinks.map((j) => ctx.db.get("oem_colors", j.color_id))),
        Promise.all(
          tireSizeLinks.map((j) => ctx.db.get("tire_sizes", j.tire_size_id))
        ),
      ]);

    return {
      ...wheel,
      brand: brand ?? null,
      vehicles: vehicles.filter((v): v is NonNullable<typeof v> => v !== null),
      bolt_patterns: boltPatterns.filter(
        (v): v is NonNullable<typeof v> => v !== null
      ),
      diameters: diameters.filter((v): v is NonNullable<typeof v> => v !== null),
      widths: widths.filter((v): v is NonNullable<typeof v> => v !== null),
      center_bores: centerBores.filter(
        (v): v is NonNullable<typeof v> => v !== null
      ),
      colors: colors.filter((v): v is NonNullable<typeof v> => v !== null),
      tire_sizes: tireSizes.filter((v): v is NonNullable<typeof v> => v !== null),
    };
  },
});

// =============================================================================
// JUNCTION TABLE QUERIES (many-to-many lookups)
// =============================================================================

export const getVehiclesByWheel = query({
  args: { wheelId: v.id("oem_wheels") },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("wheel_vehicles")
      .withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId))
      .collect();
    const vehicles = await Promise.all(
      links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
    );
    return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
  },
});

export const getWheelsByVehicle = query({
  args: { vehicleId: v.id("oem_vehicles") },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("wheel_vehicles")
      .withIndex("by_vehicle", (q) => q.eq("vehicle_id", args.vehicleId))
      .collect();
    const wheels = await Promise.all(
      links.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
    );
    return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
  },
});

export const getWheelsByBrand = query({
  args: { brandId: v.id("oem_brands") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oem_wheels")
      .withIndex("by_brand_id", (q) => q.eq("brand_id", args.brandId))
      .collect();
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
  },
});

export const globalSearchVehicles = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    const all = await ctx.db.query("oem_vehicles").order("asc").collect();
    return all
      .filter(
        (v) =>
          matchesSearch(v.vehicle_title, args.query) ||
          matchesSearch(v.model_name, args.query) ||
          matchesSearch(v.vehicle_id_only, args.query) ||
          matchesSearch(v.generation, args.query)
      )
      .slice(0, 50);
  },
});

export const globalSearchWheels = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    const all = await ctx.db.query("oem_wheels").order("asc").collect();
    return all
      .filter(
        (w) =>
          matchesSearch(w.wheel_title, args.query) ||
          matchesSearch(w.notes, args.query)
      )
      .slice(0, 50);
  },
});

// =============================================================================
// DASHBOARD METRICS
// =============================================================================

export const dashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
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
  },
});

export const wheelsByBrandDistribution = query({
  args: {},
  handler: async (ctx) => {
    const brands = await ctx.db
      .query("oem_brands")
      .withIndex("by_brand_title")
      .order("asc")
      .collect();
    const wheels = await ctx.db.query("oem_wheels").collect();
    const vehicles = await ctx.db.query("oem_vehicles").collect();
    const wheelCountByBrand = new Map<string, number>();
    const vehicleCountByBrand = new Map<string, number>();
    for (const b of brands) {
      wheelCountByBrand.set(b._id, 0);
      vehicleCountByBrand.set(b._id, 0);
    }
    for (const w of wheels) {
      wheelCountByBrand.set(
        w.brand_id,
        (wheelCountByBrand.get(w.brand_id) ?? 0) + 1
      );
    }
    for (const v of vehicles) {
      vehicleCountByBrand.set(
        v.brand_id,
        (vehicleCountByBrand.get(v.brand_id) ?? 0) + 1
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
  },
});

export const boltPatternDistribution = query({
  args: {},
  handler: async (ctx) => {
    const [links, patternDocs] = await Promise.all([
      ctx.db.query("wheel_bolt_patterns").collect(),
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
  },
});

// =============================================================================
// SAVED ITEMS (by user)
// =============================================================================

export const savedBrandsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("saved_brands")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
    const brands = await Promise.all(
      links.map((l) => ctx.db.get("oem_brands", l.brand_id))
    );
    return brands.filter((b): b is NonNullable<typeof b> => b !== null);
  },
});

export const savedVehiclesGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("saved_vehicles")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
    const vehicles = await Promise.all(
      links.map((l) => ctx.db.get("oem_vehicles", l.vehicle_id))
    );
    return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
  },
});

export const savedWheelsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("saved_wheels")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
    const wheels = await Promise.all(
      links.map((l) => ctx.db.get("oem_wheels", l.wheel_id))
    );
    return wheels.filter((w): w is NonNullable<typeof w> => w !== null);
  },
});

// =============================================================================
// USER CONTENT (comments)
// =============================================================================

export const userCommentsGetByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
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
                chassis_code: vehicle.vehicle_id_only ?? vehicle.generation ?? null,
                hero_image_url: vehicle.vehicle_image ?? null,
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
  },
});

// =============================================================================
// REFERENCE / LOOKUP TABLES
// =============================================================================

export const boltPatternsGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("oem_bolt_patterns").collect(),
});

export const centerBoresGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("oem_center_bores").collect(),
});

export const colorsGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("oem_colors").collect(),
});

export const diametersGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("oem_diameters").collect(),
});

export const widthsGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("oem_widths").collect(),
});

export const tireSizesGetAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("tire_sizes").collect(),
});
