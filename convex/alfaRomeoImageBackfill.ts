import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type VehicleDoc = Doc<"oem_vehicles">;
type WheelDoc = Doc<"oem_wheels">;

function clean(value: unknown): string | undefined {
  const out = String(value ?? "").trim();
  return out ? out : undefined;
}

async function getAlfaBrand(ctx: any) {
  const brands = await ctx.db.query("oem_brands").collect();
  const brand = brands.find((row: any) => String(row.brand_title ?? "").toLowerCase() === "alfa romeo");
  if (!brand) throw new Error("Alfa Romeo brand not found");
  return brand;
}

async function getAlfaEntities(ctx: any) {
  const brand = await getAlfaBrand(ctx);
  const [vehicles, wheels, vehicleLinks, wheelLinks] = await Promise.all([
    ctx.db.query("oem_vehicles").collect(),
    ctx.db.query("oem_wheels").collect(),
    ctx.db.query("j_vehicle_brand").withIndex("by_brand", (q: any) => q.eq("brand_id", brand._id)).collect(),
    ctx.db.query("j_wheel_brand").withIndex("by_brand", (q: any) => q.eq("brand_id", brand._id)).collect(),
  ]);

  const vehicleIds = new Set(vehicleLinks.map((row: any) => row.vehicle_id as Id<"oem_vehicles">));
  const wheelIds = new Set(wheelLinks.map((row: any) => row.wheel_id as Id<"oem_wheels">));

  return {
    brand,
    vehicles: vehicles.filter((row) => vehicleIds.has(row._id)),
    wheels: wheels.filter((row) => wheelIds.has(row._id)),
  };
}

export const auditAlfaImageCoverage = query({
  args: {},
  handler: async (ctx) => {
    const { vehicles, wheels } = await getAlfaEntities(ctx);

    const vehicleMissingGood = vehicles.filter((row: VehicleDoc) => !clean(row.good_pic_url));
    const vehicleMissingBad = vehicles.filter((row: VehicleDoc) => !clean(row.bad_pic_url));
    const wheelMissingGood = wheels.filter((row: WheelDoc) => !clean(row.good_pic_url));
    const wheelMissingBad = wheels.filter((row: WheelDoc) => !clean(row.bad_pic_url));

    return {
      vehicles: {
        total: vehicles.length,
        missingGoodPic: vehicleMissingGood.length,
        missingBadPic: vehicleMissingBad.length,
        missingBoth: vehicles.filter((row: VehicleDoc) => !clean(row.good_pic_url) && !clean(row.bad_pic_url)).length,
        samplesMissingGood: vehicleMissingGood.slice(0, 20).map((row: VehicleDoc) => row.id ?? row.slug ?? String(row._id)),
        samplesMissingBad: vehicleMissingBad.slice(0, 20).map((row: VehicleDoc) => row.id ?? row.slug ?? String(row._id)),
      },
      wheels: {
        total: wheels.length,
        missingGoodPic: wheelMissingGood.length,
        missingBadPic: wheelMissingBad.length,
        missingBoth: wheels.filter((row: WheelDoc) => !clean(row.good_pic_url) && !clean(row.bad_pic_url)).length,
        samplesMissingGood: wheelMissingGood.slice(0, 30).map((row: WheelDoc) => row.id ?? row.slug ?? String(row._id)),
        samplesMissingBad: wheelMissingBad.slice(0, 30).map((row: WheelDoc) => row.id ?? row.slug ?? String(row._id)),
      },
    };
  },
});

export const mirrorAlfaGoodBadPics = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const { vehicles, wheels } = await getAlfaEntities(ctx);

    let vehiclesPatched = 0;
    let wheelsPatched = 0;
    const vehicleSamples: string[] = [];
    const wheelSamples: string[] = [];

    for (const row of vehicles) {
      const good = clean(row.good_pic_url);
      const bad = clean(row.bad_pic_url);
      const patch: Record<string, string> = {};
      if (!bad && good) patch.bad_pic_url = good;
      if (!good && bad) patch.good_pic_url = bad;
      if (Object.keys(patch).length === 0) continue;
      if (!dryRun) await ctx.db.patch(row._id, patch);
      vehiclesPatched += 1;
      if (vehicleSamples.length < 20) vehicleSamples.push(row.id ?? row.slug ?? String(row._id));
    }

    for (const row of wheels) {
      const good = clean(row.good_pic_url);
      const bad = clean(row.bad_pic_url);
      const patch: Record<string, string> = {};
      if (!bad && good) patch.bad_pic_url = good;
      if (!good && bad) patch.good_pic_url = bad;
      if (Object.keys(patch).length === 0) continue;
      if (!dryRun) await ctx.db.patch(row._id, patch);
      wheelsPatched += 1;
      if (wheelSamples.length < 30) wheelSamples.push(row.id ?? row.slug ?? String(row._id));
    }

    return {
      dryRun,
      vehiclesPatched,
      wheelsPatched,
      vehicleSamples,
      wheelSamples,
    };
  },
});

export const fillAlfaBadPicsWithPlaceholder = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
    placeholderUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const placeholderUrl = clean(args.placeholderUrl) ?? "/placeholder.svg";
    const { vehicles, wheels } = await getAlfaEntities(ctx);

    let vehiclesPatched = 0;
    let wheelsPatched = 0;
    const vehicleSamples: string[] = [];
    const wheelSamples: string[] = [];

    for (const row of vehicles) {
      if (clean(row.bad_pic_url)) continue;
      if (!dryRun) await ctx.db.patch(row._id, { bad_pic_url: placeholderUrl });
      vehiclesPatched += 1;
      if (vehicleSamples.length < 20) vehicleSamples.push(row.id ?? row.slug ?? String(row._id));
    }

    for (const row of wheels) {
      if (clean(row.bad_pic_url)) continue;
      if (!dryRun) await ctx.db.patch(row._id, { bad_pic_url: placeholderUrl });
      wheelsPatched += 1;
      if (wheelSamples.length < 30) wheelSamples.push(row.id ?? row.slug ?? String(row._id));
    }

    return {
      dryRun,
      placeholderUrl,
      vehiclesPatched,
      wheelsPatched,
      vehicleSamples,
      wheelSamples,
    };
  },
});
