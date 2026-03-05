/**
 * Convex queries for core domain tables with junction table lookups.
 * No *_ref fields. Use junction tables for many-to-many.
 */

import { query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

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
      const vehicles = await ctx.db
        .query("oem_vehicles")
        .order("asc")
        .collect();
      return vehicles.map((v) => ({
        ...v,
        brand_name: null as string | null,
        brand_id: null as string | null,
      }));
    } catch {
      return [];
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
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
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
        .query("vehicle_variants")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", args.vehicleId))
        .collect();
      return variants.sort(
        (a, b) => (a.year_from ?? 0) - (b.year_from ?? 0)
      );
    } catch {
      return [];
    }
  },
});

export const vehiclesGetByIdFull = query({
  args: {
    id: v.union(v.string(), v.id("oem_vehicles")),
  },
  handler: async (ctx, args) => {
    try {
      const vehicle =
        typeof args.id === "string"
          ? await ctx.db
            .query("oem_vehicles")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first()
          : await ctx.db.get("oem_vehicles", args.id);
      if (!vehicle) return null;

      const vehicleId = vehicle._id;
      const [variants, wheelLinks] = await Promise.all([
        ctx.db
          .query("vehicle_variants")
          .withIndex("by_vehicle_id", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
        ctx.db
          .query("j_wheel_vehicle")
          .withIndex("by_vehicle", (q) => q.eq("vehicle_id", vehicleId))
          .collect(),
      ]);

      const wheelDocs = await Promise.all(
        wheelLinks.map((j) => ctx.db.get("oem_wheels", j.wheel_id))
      );

      return {
        ...vehicle,
        brand: null,
        engine: null,
        variants: variants ?? [],
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
      return await ctx.db
        .query("oem_engines")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
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

export const vehiclesGetByEngine = query({
  args: { engineId: v.id("oem_engines") },
  handler: async (ctx, args) => {
    try {
      const links = await ctx.db
        .query("j_vehicle_engine")
        .withIndex("by_engine", (q) => q.eq("engine_id", args.engineId))
        .collect();
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((v) => ({ ...v, brand_name: null as string | null }));
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

export const wheelsGetAllWithBrands = query({
  args: {},
  handler: async (ctx) => {
    try {
      const wheels = await ctx.db
        .query("oem_wheels")
        .order("asc")
        .collect();
      return wheels.map((w) => ({
        ...w,
        brand_name: null as string | null,
        brand_id: null as string | null,
      }));
    } catch {
      return [];
    }
  },
});

export const wheelsGetById = query({
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
      const wheel =
        typeof args.id === "string"
          ? await ctx.db
            .query("oem_wheels")
            .filter((q) => q.eq(q.field("id"), args.id as string))
            .first()
          : await ctx.db.get("oem_wheels", args.id);
      if (!wheel) return null;
      return {
        ...wheel,
        brand: null,
        vehicles: [],
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
      const vehicles = await Promise.all(
        links.map((j) => ctx.db.get("oem_vehicles", j.vehicle_id))
      );
      return vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
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
        default:
          return [];
      }
      return rows.slice(0, limit);
    } catch {
      return [];
    }
  },
});
