import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type VehicleDoc = Doc<"oem_vehicles">;
type WheelDoc = Doc<"oem_wheels">;

type LegacyWheelSeed = {
  key: string;
  businessId: string;
  title: string;
  vehicleKey: string;
  diameter?: string;
  tireSize?: string;
  color?: string;
  styleNumber?: string;
  notes: string;
};

type LegacyVehicleVariantSeed = {
  slug: string;
  variantTitle: string;
  trimLevel?: string;
  notes?: string;
  wheelKeys: string[];
};

type LegacyVehicleSeed = {
  key: string;
  businessId: string;
  title: string;
  modelName: string;
  productionYears?: string;
  yearFrom?: number;
  yearTo?: number;
  bodyType?: string;
  driveType?: string;
  notes: string;
  variants: LegacyVehicleVariantSeed[];
};

function clean(value: unknown): string | undefined {
  const out = String(value ?? "").trim();
  return out ? out : undefined;
}

function dedupe(values: Array<string | undefined>): string[] {
  return [...new Set(values.map((value) => clean(value)).filter(Boolean) as string[])];
}

function joinCsv(values: Array<string | undefined>): string | undefined {
  const out = dedupe(values);
  return out.length ? out.join(", ") : undefined;
}

async function getOrCreateByIndex(
  ctx: any,
  table: string,
  indexName: string,
  field: string,
  value: string
) {
  const existing = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(field, value))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert(table, { [field]: value });
}

async function ensureJunctionRow(
  ctx: any,
  table: string,
  indexName: string,
  fieldA: string,
  valueA: unknown,
  fieldB: string,
  valueB: unknown,
  row: Record<string, unknown>
) {
  const existing = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(fieldA, valueA).eq(fieldB, valueB))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert(table, row);
}

async function ensureVehicleBrandLink(
  ctx: any,
  vehicle: VehicleDoc,
  brandId: Id<"oem_brands">,
  brandTitle: string
) {
  await ensureJunctionRow(
    ctx,
    "j_vehicle_brand",
    "by_vehicle_brand",
    "vehicle_id",
    vehicle._id,
    "brand_id",
    brandId,
    {
      vehicle_id: vehicle._id,
      brand_id: brandId,
      vehicle_title: vehicle.vehicle_title ?? vehicle.model_name ?? "",
      brand_title: brandTitle,
    }
  );
}

async function ensureWheelBrandLink(
  ctx: any,
  wheel: WheelDoc,
  brandId: Id<"oem_brands">,
  brandTitle: string
) {
  await ensureJunctionRow(
    ctx,
    "j_wheel_brand",
    "by_wheel_brand",
    "wheel_id",
    wheel._id,
    "brand_id",
    brandId,
    {
      wheel_id: wheel._id,
      brand_id: brandId,
      wheel_title: wheel.wheel_title ?? "",
      brand_title: brandTitle,
    }
  );
}

async function ensureVehicle(
  ctx: any,
  brandId: Id<"oem_brands">,
  brandTitle: string,
  seed: LegacyVehicleSeed,
  diameters: string[],
  tireSizes: string[]
) {
  const now = new Date().toISOString();
  const existing =
    (await ctx.db
      .query("oem_vehicles")
      .withIndex("by_slug", (q: any) => q.eq("slug", seed.businessId))
      .first()) ??
     (await ctx.db
      .query("oem_vehicles")
      .withIndex("by_id_str", (q: any) => q.eq("id", seed.businessId))
      .first());

  const patch = {
    id: seed.businessId,
    slug: seed.businessId,
    vehicle_title: seed.title,
    model_name: seed.modelName,
    brand_id: brandId,
    text_brands: brandTitle,
    production_years: seed.productionYears,
    year_from: seed.yearFrom,
    year_to: seed.yearTo,
    body_type: seed.bodyType,
    drive_type: seed.driveType,
    special_notes: seed.notes,
    text_diameters: joinCsv(diameters),
    updated_at: now,
  };

  let vehicleId: Id<"oem_vehicles">;
  if (existing) {
    await ctx.db.patch(existing._id, patch);
    vehicleId = existing._id;
  } else {
    vehicleId = await ctx.db.insert("oem_vehicles", {
      ...patch,
      created_at: now,
    });
  }

  const vehicle = (await ctx.db.get(vehicleId)) as VehicleDoc;
  await ensureVehicleBrandLink(ctx, vehicle, brandId, brandTitle);
  return vehicle;
}

async function ensureVehicleVariant(
  ctx: any,
  vehicleId: Id<"oem_vehicles">,
  seed: LegacyVehicleVariantSeed
) {
  const bySlug = await ctx.db
    .query("oem_vehicle_variants")
    .withIndex("by_slug", (q: any) => q.eq("slug", seed.slug))
    .first();
  if (bySlug) {
    await ctx.db.patch(bySlug._id, {
      vehicle_id: vehicleId,
      slug: seed.slug,
      variant_title: seed.variantTitle,
      trim_level: seed.trimLevel,
      notes: seed.notes,
    });
    return bySlug._id as Id<"oem_vehicle_variants">;
  }

  return await ctx.db.insert("oem_vehicle_variants", {
    vehicle_id: vehicleId,
    slug: seed.slug,
    variant_title: seed.variantTitle,
    trim_level: seed.trimLevel,
    notes: seed.notes,
  });
}

async function ensureWheel(
  ctx: any,
  brandId: Id<"oem_brands">,
  brandTitle: string,
  vehicleTitle: string,
  seed: LegacyWheelSeed
) {
  const now = new Date().toISOString();
  const existing =
    (await ctx.db
      .query("oem_wheels")
      .withIndex("by_slug", (q: any) => q.eq("slug", seed.businessId))
      .first()) ??
    (await ctx.db
      .query("oem_wheels")
      .withIndex("by_wheel_title", (q: any) => q.eq("wheel_title", seed.title))
      .first());

  const patch = {
    id: seed.businessId,
    slug: seed.businessId,
    wheel_title: seed.title,
    brand_id: brandId,
    jnc_brands: brandTitle,
    text_brands: brandTitle,
    notes: seed.notes,
    style_number: seed.styleNumber,
    text_diameters: seed.diameter,
    text_tire_sizes: seed.tireSize,
    text_colors: seed.color,
    text_vehicles: vehicleTitle,
    specifications_json: JSON.stringify({
      source: "alfa_romeo_legacy_additive",
      vehicle_key: seed.vehicleKey,
      wheel_key: seed.key,
      diameter: seed.diameter,
      tire_size: seed.tireSize,
      color: seed.color,
      style_number: seed.styleNumber,
    }),
    updated_at: now,
  };

  let wheelId: Id<"oem_wheels">;
  if (existing) {
    await ctx.db.patch(existing._id, patch);
    wheelId = existing._id;
  } else {
    wheelId = await ctx.db.insert("oem_wheels", {
      ...patch,
      created_at: now,
    });
  }

  const wheel = (await ctx.db.get(wheelId)) as WheelDoc;
  await ensureWheelBrandLink(ctx, wheel, brandId, brandTitle);
  return wheel;
}

async function ensureWheelVariant(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  seed: LegacyWheelSeed
) {
  const now = new Date().toISOString();
  const slug = `${seed.businessId}-variant`;
  const variantTitle = clean(seed.diameter)
    ? `${seed.title} ${seed.diameter}`
    : `${seed.title} Variant`;

  const bySlug = await ctx.db
    .query("oem_wheel_variants")
    .withIndex("by_slug", (q: any) => q.eq("slug", slug))
    .first();
  if (bySlug) {
    await ctx.db.patch(bySlug._id, {
      wheel_id: wheelId,
      slug,
      variant_title: variantTitle,
      wheel_title: seed.title,
      notes: seed.notes,
      updated_at: now,
    });
    return bySlug._id as Id<"oem_wheel_variants">;
  }

  return await ctx.db.insert("oem_wheel_variants", {
    wheel_id: wheelId,
    slug,
    variant_title: variantTitle,
    wheel_title: seed.title,
    notes: seed.notes,
    created_at: now,
    updated_at: now,
  });
}

async function ensureWheelMeasurements(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  wheelTitle: string,
  wheelVariantId: Id<"oem_wheel_variants">,
  wheelVariantTitle: string,
  seed: LegacyWheelSeed
) {
  if (seed.diameter) {
    const diameterId = await getOrCreateByIndex(ctx, "oem_diameters", "by_diameter", "diameter", seed.diameter);
    await ensureJunctionRow(
      ctx,
      "j_wheel_diameter",
      "by_wheel_diameter",
      "wheel_id",
      wheelId,
      "diameter_id",
      diameterId,
      { wheel_id: wheelId, diameter_id: diameterId, wheel_title: wheelTitle, diameter: seed.diameter }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_diameter",
      "by_oem_wheel_variant_diameter",
      "variant_id",
      wheelVariantId,
      "diameter_id",
      diameterId,
      { variant_id: wheelVariantId, diameter_id: diameterId, variant_title: wheelVariantTitle, diameter: seed.diameter }
    );
  }

  if (seed.tireSize) {
    const tireSizeId = await getOrCreateByIndex(ctx, "tire_sizes", "by_tire_size", "tire_size", seed.tireSize);
    await ensureJunctionRow(
      ctx,
      "j_wheel_tire_size",
      "by_wheel_tire_size",
      "wheel_id",
      wheelId,
      "tire_size_id",
      tireSizeId,
      { wheel_id: wheelId, tire_size_id: tireSizeId, wheel_title: wheelTitle, tire_size: seed.tireSize }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_tire_size",
      "by_oem_wheel_variant_tire_size",
      "variant_id",
      wheelVariantId,
      "tire_size_id",
      tireSizeId,
      { variant_id: wheelVariantId, tire_size_id: tireSizeId, variant_title: wheelVariantTitle, tire_size: seed.tireSize }
    );
  }

  if (seed.color) {
    const colorId = await getOrCreateByIndex(ctx, "oem_colors", "by_color", "color", seed.color);
    await ensureJunctionRow(
      ctx,
      "j_wheel_color",
      "by_wheel_color",
      "wheel_id",
      wheelId,
      "color_id",
      colorId,
      { wheel_id: wheelId, color_id: colorId, wheel_title: wheelTitle, color: seed.color }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_color",
      "by_oem_wheel_variant_color",
      "variant_id",
      wheelVariantId,
      "color_id",
      colorId,
      { variant_id: wheelVariantId, color_id: colorId, variant_title: wheelVariantTitle, color: seed.color }
    );
  }
}

async function ensureVehicleMeasurements(
  ctx: any,
  vehicleId: Id<"oem_vehicles">,
  vehicleTitle: string,
  vehicleVariantId: Id<"oem_vehicle_variants">,
  vehicleVariantTitle: string,
  wheelSeeds: LegacyWheelSeed[]
) {
  for (const diameter of dedupe(wheelSeeds.map((seed) => seed.diameter))) {
    const diameterId = await getOrCreateByIndex(ctx, "oem_diameters", "by_diameter", "diameter", diameter);
    await ensureJunctionRow(
      ctx,
      "j_vehicle_diameter",
      "by_vehicle_diameter",
      "vehicle_id",
      vehicleId,
      "diameter_id",
      diameterId,
      { vehicle_id: vehicleId, diameter_id: diameterId, vehicle_title: vehicleTitle, diameter }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_vehicle_variant_diameter",
      "by_oem_vehicle_variant_diameter",
      "variant_id",
      vehicleVariantId,
      "diameter_id",
      diameterId,
      { variant_id: vehicleVariantId, diameter_id: diameterId, variant_title: vehicleVariantTitle, diameter }
    );
  }

  for (const tireSize of dedupe(wheelSeeds.map((seed) => seed.tireSize))) {
    const tireSizeId = await getOrCreateByIndex(ctx, "tire_sizes", "by_tire_size", "tire_size", tireSize);
    await ensureJunctionRow(
      ctx,
      "j_vehicle_tire_size",
      "by_vehicle_tire_size",
      "vehicle_id",
      vehicleId,
      "tire_size_id",
      tireSizeId,
      { vehicle_id: vehicleId, tire_size_id: tireSizeId, vehicle_title: vehicleTitle, tire_size: tireSize }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_vehicle_variant_tire_size",
      "by_oem_vehicle_variant_tire_size",
      "variant_id",
      vehicleVariantId,
      "tire_size_id",
      tireSizeId,
      { variant_id: vehicleVariantId, tire_size_id: tireSizeId, variant_title: vehicleVariantTitle, tire_size: tireSize }
    );
  }
}

const LEGACY_WHEELS: LegacyWheelSeed[] = [
  {
    key: "145-14-alloy",
    businessId: "alfa-romeo-145-14-inch-light-alloy-wheels",
    title: "Alfa Romeo 145 14-Inch Light Alloy Wheels",
    vehicleKey: "145",
    diameter: "14 inch",
    tireSize: "185/60 HR14",
    notes: "Official Alfa Romeo / Stellantis media references describe Alfa Romeo 145 light-alloy wheel packages with 185/60 HR14 tires.",
  },
  {
    key: "145-15-alloy",
    businessId: "alfa-romeo-145-15-inch-light-alloy-wheels",
    title: "Alfa Romeo 145 15-Inch Light Alloy Wheels",
    vehicleKey: "145",
    diameter: "15 inch",
    tireSize: "195/55 HR15",
    notes: "Official Alfa Romeo / Stellantis media references describe Alfa Romeo 145 light-alloy wheel packages with 195/55 HR15 tires.",
  },
  {
    key: "145-15-junior",
    businessId: "alfa-romeo-145-15-inch-junior-alloy-wheels",
    title: "Alfa Romeo 145 15-Inch Junior Alloy Wheels",
    vehicleKey: "145",
    diameter: "15 inch",
    tireSize: "195/50 R15",
    notes: "Official Alfa Romeo / Stellantis media references for 145 Junior describe 15-inch alloy wheels with 195/50 R15 tires.",
  },
  {
    key: "146-14-alloy",
    businessId: "alfa-romeo-146-14-inch-light-alloy-wheels",
    title: "Alfa Romeo 146 14-Inch Light Alloy Wheels",
    vehicleKey: "146",
    diameter: "14 inch",
    tireSize: "185/60 HR14",
    notes: "Official Alfa Romeo / Stellantis media references describe Alfa Romeo 146 light-alloy wheel packages with 185/60 HR14 tires.",
  },
  {
    key: "146-15-alloy",
    businessId: "alfa-romeo-146-15-inch-light-alloy-wheels",
    title: "Alfa Romeo 146 15-Inch Light Alloy Wheels",
    vehicleKey: "146",
    diameter: "15 inch",
    tireSize: "195/55 HR15",
    notes: "Official Alfa Romeo / Stellantis media references describe Alfa Romeo 146 light-alloy wheel packages with 195/55 HR15 tires.",
  },
  {
    key: "146-15-junior",
    businessId: "alfa-romeo-146-15-inch-junior-ti-alloy-wheels",
    title: "Alfa Romeo 146 15-Inch Junior / ti Alloy Wheels",
    vehicleKey: "146",
    diameter: "15 inch",
    tireSize: "195/50 R15",
    notes: "Official Alfa Romeo / Stellantis media references for 146 Junior and ti describe 15-inch alloy wheel packages with 195/50 R15 tires.",
  },
  {
    key: "147-15-alloy",
    businessId: "alfa-romeo-147-15-inch-alloy-wheels",
    title: "Alfa Romeo 147 15-Inch Alloy Wheels",
    vehicleKey: "147",
    diameter: "15 inch",
    tireSize: "195/60 R15",
    notes: "Official Alfa Romeo 147 price-list material describes 15-inch alloy wheel packages with 195/60 R15 tires.",
  },
  {
    key: "147-16-alloy",
    businessId: "alfa-romeo-147-16-inch-alloy-wheels",
    title: "Alfa Romeo 147 16-Inch Alloy Wheels",
    vehicleKey: "147",
    diameter: "16 inch",
    tireSize: "205/55 R16",
    notes: "Official Alfa Romeo 147 price-list material describes 16-inch alloy wheel packages with 205/55 R16 tires.",
  },
  {
    key: "147-17-alloy",
    businessId: "alfa-romeo-147-17-inch-alloy-wheels",
    title: "Alfa Romeo 147 17-Inch Alloy Wheels",
    vehicleKey: "147",
    diameter: "17 inch",
    tireSize: "215/45 R17",
    notes: "Official Alfa Romeo 147 price-list material describes 17-inch alloy wheel packages with 215/45 R17 tires.",
  },
  {
    key: "147-18-blackline",
    businessId: "alfa-romeo-147-18-inch-blackline-alloy-wheels",
    title: "Alfa Romeo 147 18-Inch Blackline Alloy Wheels",
    vehicleKey: "147",
    diameter: "18 inch",
    tireSize: "215/40 R18",
    notes: "Official Alfa Romeo 147 Blackline material describes 18-inch alloy wheel packages with 215/40 R18 tires.",
  },
  {
    key: "155-15-sport",
    businessId: "alfa-romeo-155-15-inch-sport-alloy-wheels",
    title: "Alfa Romeo 155 15-Inch Sport Alloy Wheels",
    vehicleKey: "155",
    diameter: "15 inch",
    notes: "Official Alfa Romeo / Stellantis media references describe 15-inch sporting wheel packages for Alfa Romeo 155.",
  },
  {
    key: "155-16-sport",
    businessId: "alfa-romeo-155-16-inch-sport-alloy-wheels",
    title: "Alfa Romeo 155 16-Inch Sport Alloy Wheels",
    vehicleKey: "155",
    diameter: "16 inch",
    notes: "Official Alfa Romeo / Stellantis media references describe 16-inch sporting wheel packages for Alfa Romeo 155.",
  },
  {
    key: "156-15-alloy",
    businessId: "alfa-romeo-156-15-inch-alloy-wheels",
    title: "Alfa Romeo 156 15-Inch Alloy Wheels",
    vehicleKey: "156",
    diameter: "15 inch",
    tireSize: "205/60 R15",
    notes: "Official Alfa Romeo 156 range material describes 15-inch alloy wheel packages with 205/60 R15 tires.",
  },
  {
    key: "156-16-alloy",
    businessId: "alfa-romeo-156-16-inch-alloy-wheels",
    title: "Alfa Romeo 156 16-Inch Alloy Wheels",
    vehicleKey: "156",
    diameter: "16 inch",
    tireSize: "205/55 R16",
    notes: "Official Alfa Romeo 156 range material describes 16-inch alloy wheel packages with 205/55 R16 tires.",
  },
  {
    key: "159-16-alloy",
    businessId: "alfa-romeo-159-16-inch-alloy-wheels",
    title: "Alfa Romeo 159 16-Inch Alloy Wheels",
    vehicleKey: "159",
    diameter: "16 inch",
    notes: "Official Alfa Romeo 159 media material describes 16-inch alloy wheel packages.",
  },
  {
    key: "159-17-alloy",
    businessId: "alfa-romeo-159-17-inch-alloy-wheels",
    title: "Alfa Romeo 159 17-Inch Alloy Wheels",
    vehicleKey: "159",
    diameter: "17 inch",
    notes: "Official Alfa Romeo 159 media material describes 17-inch alloy wheel packages.",
  },
  {
    key: "159-18-ti",
    businessId: "alfa-romeo-159-18-inch-ti-alloy-wheels",
    title: "Alfa Romeo 159 18-Inch ti Alloy Wheels",
    vehicleKey: "159",
    diameter: "18 inch",
    notes: "Official Alfa Romeo 159 ti material describes 18-inch alloy wheel packages.",
  },
  {
    key: "166-16-alloy",
    businessId: "alfa-romeo-166-16-inch-alloy-wheels",
    title: "Alfa Romeo 166 16-Inch Alloy Wheels",
    vehicleKey: "166",
    diameter: "16 inch",
    tireSize: "205/55 WR16",
    notes: "Official Alfa Romeo 166 media material describes 16-inch alloy wheel packages with 205/55 WR16 tires.",
  },
  {
    key: "166-17-alloy",
    businessId: "alfa-romeo-166-17-inch-alloy-wheels",
    title: "Alfa Romeo 166 17-Inch Alloy Wheels",
    vehicleKey: "166",
    diameter: "17 inch",
    tireSize: "225/45 WR17",
    notes: "Official Alfa Romeo 166 media material describes 17-inch alloy wheel packages with 225/45 WR17 tires.",
  },
  {
    key: "166-18-alloy",
    businessId: "alfa-romeo-166-18-inch-sport-alloy-wheels",
    title: "Alfa Romeo 166 18-Inch Sport Alloy Wheels",
    vehicleKey: "166",
    diameter: "18 inch",
    tireSize: "235/40 ZR18",
    notes: "Official Alfa Romeo 166 media material describes 18-inch sport alloy wheel packages with 235/40 ZR18 tires.",
  },
  {
    key: "gtv-spider-16-alloy",
    businessId: "alfa-romeo-gtv-spider-16-inch-alloy-wheels",
    title: "Alfa Romeo GTV / Spider 16-Inch Alloy Wheels",
    vehicleKey: "gtv-spider",
    diameter: "16 inch",
    notes: "Official Alfa Romeo GTV / Spider material describes 16-inch alloy wheel packages.",
  },
  {
    key: "gtv-spider-17-alloy",
    businessId: "alfa-romeo-gtv-spider-17-inch-alloy-wheels",
    title: "Alfa Romeo GTV / Spider 17-Inch Alloy Wheels",
    vehicleKey: "gtv-spider",
    diameter: "17 inch",
    notes: "Official Alfa Romeo GTV / Spider material describes 17-inch alloy wheel packages.",
  },
  {
    key: "gt-16-alloy",
    businessId: "alfa-romeo-gt-16-inch-alloy-wheels",
    title: "Alfa Romeo GT 16-Inch Alloy Wheels",
    vehicleKey: "gt",
    diameter: "16 inch",
    tireSize: "205/55 R16",
    notes: "Official Alfa Romeo GT media material describes 16-inch alloy wheel packages with 205/55 R16 tires.",
  },
  {
    key: "gt-17-alloy",
    businessId: "alfa-romeo-gt-17-inch-alloy-wheels",
    title: "Alfa Romeo GT 17-Inch Alloy Wheels",
    vehicleKey: "gt",
    diameter: "17 inch",
    tireSize: "215/45 R17",
    notes: "Official Alfa Romeo GT media material describes 17-inch alloy wheel packages with 215/45 R17 tires.",
  },
  {
    key: "gt-18-alloy",
    businessId: "alfa-romeo-gt-18-inch-alloy-wheels",
    title: "Alfa Romeo GT 18-Inch Alloy Wheels",
    vehicleKey: "gt",
    diameter: "18 inch",
    tireSize: "225/40 R18",
    notes: "Official Alfa Romeo GT media material describes 18-inch alloy wheel packages with 225/40 R18 tires.",
  },
  {
    key: "brera-spider-17-sport",
    businessId: "alfa-romeo-brera-spider-17-inch-sport-alloy-wheels",
    title: "Alfa Romeo Brera / Spider 17-Inch Sport Alloy Wheels",
    vehicleKey: "brera-spider",
    diameter: "17 inch",
    notes: "Official Alfa Romeo Brera / Spider material describes 17-inch Sport alloy wheel packages.",
  },
  {
    key: "brera-spider-17-supersport",
    businessId: "alfa-romeo-brera-spider-17-inch-supersport-alloy-wheels",
    title: "Alfa Romeo Brera / Spider 17-Inch Supersport Alloy Wheels",
    vehicleKey: "brera-spider",
    diameter: "17 inch",
    notes: "Official Alfa Romeo Brera / Spider material describes 17-inch Supersport alloy wheel packages.",
  },
  {
    key: "brera-spider-18-supersport",
    businessId: "alfa-romeo-brera-spider-18-inch-supersport-alloy-wheels",
    title: "Alfa Romeo Brera / Spider 18-Inch Supersport Alloy Wheels",
    vehicleKey: "brera-spider",
    diameter: "18 inch",
    notes: "Official Alfa Romeo Brera / Spider material describes 18-inch Supersport alloy wheel packages.",
  },
  {
    key: "mito-15-alloy",
    businessId: "alfa-romeo-mito-15-inch-alloy-wheels",
    title: "Alfa Romeo MiTo 15-Inch Alloy Wheels",
    vehicleKey: "mito",
    diameter: "15 inch",
    tireSize: "185/65 R15",
    notes: "Official Alfa Romeo MiTo price-list material describes 15-inch alloy wheel packages with 185/65 R15 tires.",
  },
  {
    key: "mito-16-alloy",
    businessId: "alfa-romeo-mito-16-inch-alloy-wheels",
    title: "Alfa Romeo MiTo 16-Inch Alloy Wheels",
    vehicleKey: "mito",
    diameter: "16 inch",
    tireSize: "195/55 R16",
    notes: "Official Alfa Romeo MiTo price-list material describes 16-inch alloy wheel packages with 195/55 R16 tires.",
  },
  {
    key: "mito-17-alloy",
    businessId: "alfa-romeo-mito-17-inch-alloy-wheels",
    title: "Alfa Romeo MiTo 17-Inch Alloy Wheels",
    vehicleKey: "mito",
    diameter: "17 inch",
    tireSize: "215/45 R17",
    notes: "Official Alfa Romeo MiTo price-list material describes 17-inch alloy wheel packages with 215/45 R17 tires.",
  },
  {
    key: "mito-18-alloy",
    businessId: "alfa-romeo-mito-18-inch-alloy-wheels",
    title: "Alfa Romeo MiTo 18-Inch Alloy Wheels",
    vehicleKey: "mito",
    diameter: "18 inch",
    tireSize: "215/40 R18",
    notes: "Official Alfa Romeo MiTo price-list material describes 18-inch alloy wheel packages with 215/40 R18 tires.",
  },
  {
    key: "giulietta-16-alloy",
    businessId: "alfa-romeo-giulietta-16-inch-alloy-wheels",
    title: "Alfa Romeo Giulietta 16-Inch Alloy Wheels",
    vehicleKey: "giulietta",
    diameter: "16 inch",
    tireSize: "205/55 R16",
    notes: "Official Alfa Romeo Giulietta technical-spec material describes 16-inch wheel packages with 205/55 R16 tires.",
  },
  {
    key: "giulietta-17-alloy",
    businessId: "alfa-romeo-giulietta-17-inch-alloy-wheels",
    title: "Alfa Romeo Giulietta 17-Inch Alloy Wheels",
    vehicleKey: "giulietta",
    diameter: "17 inch",
    tireSize: "225/45 R17",
    notes: "Official Alfa Romeo Giulietta technical-spec material describes 17-inch wheel packages with 225/45 R17 tires.",
  },
  {
    key: "giulietta-18-qv",
    businessId: "alfa-romeo-giulietta-18-inch-qv-five-hole-wheels",
    title: "Alfa Romeo Giulietta 18-Inch QV Five-Hole Wheels",
    vehicleKey: "giulietta",
    diameter: "18 inch",
    notes: "Official Alfa Romeo Giulietta Quadrifoglio Verde material describes 18-inch five-hole alloy wheel packages.",
  },
  {
    key: "8c-20-standard",
    businessId: "alfa-romeo-8c-20-inch-standard-alloy-wheels",
    title: "Alfa Romeo 8C 20-Inch Standard Alloy Wheels",
    vehicleKey: "8c",
    diameter: "20 inch",
    notes: "Official Alfa Romeo 8C Competizione / Spider material describes standard 20-inch alloy wheel packages.",
  },
  {
    key: "8c-20-racing",
    businessId: "alfa-romeo-8c-20-inch-racing-titanium-double-spoke-wheels",
    title: "Alfa Romeo 8C 20-Inch Racing Titanium Double-Spoke Wheels",
    vehicleKey: "8c",
    diameter: "20 inch",
    color: "Titanium",
    notes: "Official Alfa Romeo 8C Spider material describes optional Racing titanium double-spoke wheels.",
  },
];

const LEGACY_VEHICLES: LegacyVehicleSeed[] = [
  {
    key: "145",
    businessId: "alfa-romeo-alfa-romeo-145",
    title: "Alfa Romeo 145",
    modelName: "Alfa Romeo 145",
    bodyType: "Hatchback",
    notes: "Added from official Alfa Romeo / Stellantis media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-145-standard",
        variantTitle: "145 Standard",
        trimLevel: "Standard",
        notes: "Grouped around official 14-inch and 15-inch Alfa Romeo 145 alloy-wheel packages.",
        wheelKeys: ["145-14-alloy", "145-15-alloy"],
      },
      {
        slug: "alfa-romeo-145-junior",
        variantTitle: "145 Junior",
        trimLevel: "Junior",
        notes: "Grouped around official Alfa Romeo 145 Junior alloy-wheel package references.",
        wheelKeys: ["145-15-junior"],
      },
    ],
  },
  {
    key: "146",
    businessId: "alfa-romeo-alfa-romeo-146",
    title: "Alfa Romeo 146",
    modelName: "Alfa Romeo 146",
    bodyType: "Hatchback",
    notes: "Added from official Alfa Romeo / Stellantis media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-146-standard",
        variantTitle: "146 Standard",
        trimLevel: "Standard",
        notes: "Grouped around official 14-inch and 15-inch Alfa Romeo 146 alloy-wheel packages.",
        wheelKeys: ["146-14-alloy", "146-15-alloy"],
      },
      {
        slug: "alfa-romeo-146-junior-ti",
        variantTitle: "146 Junior / ti",
        trimLevel: "Junior / ti",
        notes: "Grouped around official Alfa Romeo 146 Junior and ti alloy-wheel package references.",
        wheelKeys: ["146-15-junior"],
      },
    ],
  },
  {
    key: "147",
    businessId: "alfa-romeo-alfa-romeo-147",
    title: "Alfa Romeo 147",
    modelName: "Alfa Romeo 147",
    bodyType: "Hatchback",
    notes: "Added from official Alfa Romeo 147 price-list material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-147-progression-and-distinctive",
        variantTitle: "147 Progression / Distinctive",
        trimLevel: "Progression / Distinctive",
        notes: "Grouped around official Alfa Romeo 147 15-inch and 16-inch alloy-wheel packages.",
        wheelKeys: ["147-15-alloy", "147-16-alloy"],
      },
      {
        slug: "alfa-romeo-147-sport",
        variantTitle: "147 Sport",
        trimLevel: "Sport",
        notes: "Grouped around official Alfa Romeo 147 17-inch alloy-wheel packages.",
        wheelKeys: ["147-17-alloy"],
      },
      {
        slug: "alfa-romeo-147-blackline",
        variantTitle: "147 Blackline",
        trimLevel: "Blackline",
        notes: "Grouped around official Alfa Romeo 147 Blackline 18-inch alloy-wheel packages.",
        wheelKeys: ["147-18-blackline"],
      },
    ],
  },
  {
    key: "155",
    businessId: "alfa-romeo-alfa-romeo-155",
    title: "Alfa Romeo 155",
    modelName: "Alfa Romeo 155",
    bodyType: "Sedan",
    notes: "Added from official Alfa Romeo / Stellantis media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-155-standard-and-super",
        variantTitle: "155 Standard / Super",
        trimLevel: "Standard / Super",
        notes: "Grouped around official Alfa Romeo 155 sporting wheel package references.",
        wheelKeys: ["155-15-sport", "155-16-sport"],
      },
    ],
  },
  {
    key: "156",
    businessId: "alfa-romeo-alfa-romeo-156",
    title: "Alfa Romeo 156",
    modelName: "Alfa Romeo 156",
    bodyType: "Saloon / Estate",
    notes: "Added from official Alfa Romeo 156 range material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-156-turismo-and-lusso",
        variantTitle: "156 Turismo / Lusso",
        trimLevel: "Turismo / Lusso",
        notes: "Grouped around official Alfa Romeo 156 15-inch alloy-wheel packages.",
        wheelKeys: ["156-15-alloy"],
      },
      {
        slug: "alfa-romeo-156-veloce",
        variantTitle: "156 Veloce",
        trimLevel: "Veloce",
        notes: "Grouped around official Alfa Romeo 156 16-inch alloy-wheel packages.",
        wheelKeys: ["156-16-alloy"],
      },
    ],
  },
  {
    key: "159",
    businessId: "alfa-romeo-alfa-romeo-159",
    title: "Alfa Romeo 159",
    modelName: "Alfa Romeo 159",
    bodyType: "Saloon / Sportwagon",
    notes: "Added from official Alfa Romeo 159 media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-159-standard",
        variantTitle: "159 Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo 159 16-inch and 17-inch alloy-wheel packages.",
        wheelKeys: ["159-16-alloy", "159-17-alloy"],
      },
      {
        slug: "alfa-romeo-159-ti",
        variantTitle: "159 ti",
        trimLevel: "ti",
        notes: "Grouped around official Alfa Romeo 159 ti 18-inch alloy-wheel packages.",
        wheelKeys: ["159-18-ti"],
      },
    ],
  },
  {
    key: "166",
    businessId: "alfa-romeo-alfa-romeo-166",
    title: "Alfa Romeo 166",
    modelName: "Alfa Romeo 166",
    bodyType: "Sedan",
    notes: "Added from official Alfa Romeo 166 media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-166-standard",
        variantTitle: "166 Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo 166 16-inch alloy-wheel packages.",
        wheelKeys: ["166-16-alloy"],
      },
      {
        slug: "alfa-romeo-166-sport",
        variantTitle: "166 Sport",
        trimLevel: "Sport",
        notes: "Grouped around official Alfa Romeo 166 17-inch and 18-inch alloy-wheel packages.",
        wheelKeys: ["166-17-alloy", "166-18-alloy"],
      },
    ],
  },
  {
    key: "gtv-spider",
    businessId: "alfa-romeo-alfa-romeo-gtv-spider",
    title: "Alfa Romeo GTV / Spider",
    modelName: "Alfa Romeo GTV / Spider",
    bodyType: "Coupe / Convertible",
    notes: "Added from official Alfa Romeo GTV / Spider media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-gtv-spider-standard",
        variantTitle: "GTV / Spider Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo GTV / Spider 16-inch alloy-wheel packages.",
        wheelKeys: ["gtv-spider-16-alloy"],
      },
      {
        slug: "alfa-romeo-gtv-spider-v6-and-cup",
        variantTitle: "GTV / Spider V6 / Cup",
        trimLevel: "V6 / Cup",
        notes: "Grouped around official Alfa Romeo GTV / Spider 17-inch alloy-wheel packages.",
        wheelKeys: ["gtv-spider-17-alloy"],
      },
    ],
  },
  {
    key: "gt",
    businessId: "alfa-romeo-alfa-romeo-gt",
    title: "Alfa Romeo GT",
    modelName: "Alfa Romeo GT",
    bodyType: "Coupe",
    notes: "Added from official Alfa Romeo GT media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-gt-standard",
        variantTitle: "GT Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo GT 16-inch and 17-inch alloy-wheel packages.",
        wheelKeys: ["gt-16-alloy", "gt-17-alloy"],
      },
      {
        slug: "alfa-romeo-gt-sport",
        variantTitle: "GT Sport",
        trimLevel: "Sport",
        notes: "Grouped around official Alfa Romeo GT 18-inch alloy-wheel packages.",
        wheelKeys: ["gt-18-alloy"],
      },
    ],
  },
  {
    key: "brera-spider",
    businessId: "alfa-romeo-alfa-romeo-brera-spider",
    title: "Alfa Romeo Brera / Spider",
    modelName: "Alfa Romeo Brera / Spider",
    bodyType: "Coupe / Convertible",
    notes: "Added from official Alfa Romeo Brera / Spider media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-brera-spider-standard",
        variantTitle: "Brera / Spider Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo Brera / Spider 17-inch alloy-wheel packages.",
        wheelKeys: ["brera-spider-17-sport", "brera-spider-17-supersport"],
      },
      {
        slug: "alfa-romeo-brera-spider-supersport",
        variantTitle: "Brera / Spider Supersport",
        trimLevel: "Supersport",
        notes: "Grouped around official Alfa Romeo Brera / Spider 18-inch Supersport alloy-wheel packages.",
        wheelKeys: ["brera-spider-18-supersport"],
      },
    ],
  },
  {
    key: "mito",
    businessId: "alfa-romeo-alfa-romeo-mito",
    title: "Alfa Romeo MiTo",
    modelName: "Alfa Romeo MiTo",
    bodyType: "Hatchback",
    notes: "Added from official Alfa Romeo MiTo price-list and technical-spec material plus official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-mito-progression-and-junior",
        variantTitle: "MiTo Progression / Junior",
        trimLevel: "Progression / Junior",
        notes: "Grouped around official Alfa Romeo MiTo 15-inch and 16-inch alloy-wheel packages.",
        wheelKeys: ["mito-15-alloy", "mito-16-alloy"],
      },
      {
        slug: "alfa-romeo-mito-distinctive-and-qv-line",
        variantTitle: "MiTo Distinctive / QV Line",
        trimLevel: "Distinctive / QV Line",
        notes: "Grouped around official Alfa Romeo MiTo 17-inch alloy-wheel packages.",
        wheelKeys: ["mito-17-alloy"],
      },
      {
        slug: "alfa-romeo-mito-quadrifoglio-verde",
        variantTitle: "MiTo Quadrifoglio Verde",
        trimLevel: "Quadrifoglio Verde",
        notes: "Grouped around official Alfa Romeo MiTo 18-inch alloy-wheel packages.",
        wheelKeys: ["mito-18-alloy"],
      },
    ],
  },
  {
    key: "giulietta",
    businessId: "alfa-romeo-alfa-romeo-giulietta",
    title: "Alfa Romeo Giulietta",
    modelName: "Alfa Romeo Giulietta",
    bodyType: "Hatchback",
    notes: "Added from official Alfa Romeo Giulietta technical-spec and Quadrifoglio Verde material plus official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-giulietta-standard",
        variantTitle: "Giulietta Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo Giulietta 16-inch and 17-inch wheel packages.",
        wheelKeys: ["giulietta-16-alloy", "giulietta-17-alloy"],
      },
      {
        slug: "alfa-romeo-giulietta-quadrifoglio-verde",
        variantTitle: "Giulietta Quadrifoglio Verde",
        trimLevel: "Quadrifoglio Verde",
        notes: "Grouped around official Alfa Romeo Giulietta Quadrifoglio Verde 18-inch wheel packages.",
        wheelKeys: ["giulietta-18-qv"],
      },
    ],
  },
  {
    key: "8c",
    businessId: "alfa-romeo-alfa-romeo-8c-competizione",
    title: "Alfa Romeo 8C Competizione / Spider",
    modelName: "Alfa Romeo 8C Competizione / Spider",
    bodyType: "Coupe / Convertible",
    notes: "Added from official Alfa Romeo 8C media material and official technical-information coverage tables.",
    variants: [
      {
        slug: "alfa-romeo-8c-standard",
        variantTitle: "8C Standard",
        trimLevel: "Standard",
        notes: "Grouped around official Alfa Romeo 8C standard alloy-wheel packages.",
        wheelKeys: ["8c-20-standard"],
      },
      {
        slug: "alfa-romeo-8c-racing",
        variantTitle: "8C Racing",
        trimLevel: "Racing",
        notes: "Grouped around official Alfa Romeo 8C optional racing titanium double-spoke wheel packages.",
        wheelKeys: ["8c-20-racing"],
      },
    ],
  },
];

export const addLegacyAlfaRomeo1990Plus = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const brands = await ctx.db.query("oem_brands").collect();
    const brand = brands.find((row) => String(row.brand_title ?? "").toLowerCase() === "alfa romeo");
    if (!brand) throw new Error("Alfa Romeo brand not found");

    if (dryRun) {
      return {
        dryRun,
        vehiclesPlanned: LEGACY_VEHICLES.length,
        vehicleVariantsPlanned: LEGACY_VEHICLES.reduce((sum, seed) => sum + seed.variants.length, 0),
        wheelsPlanned: LEGACY_WHEELS.length,
        wheelVariantsPlanned: LEGACY_WHEELS.length,
      };
    }

    const wheelByKey = new Map<string, WheelDoc>();
    const wheelVariantByKey = new Map<string, Id<"oem_wheel_variants">>();
    const vehicleByKey = new Map<string, VehicleDoc>();
    const vehicleVariantBySlug = new Map<string, Id<"oem_vehicle_variants">>();

    for (const vehicleSeed of LEGACY_VEHICLES) {
      const modelWheelSeeds = LEGACY_WHEELS.filter((wheelSeed) => wheelSeed.vehicleKey === vehicleSeed.key);
      const vehicle = await ensureVehicle(
        ctx,
        brand._id,
        String(brand.brand_title ?? "Alfa Romeo"),
        vehicleSeed,
        modelWheelSeeds.map((wheelSeed) => wheelSeed.diameter),
        modelWheelSeeds.map((wheelSeed) => wheelSeed.tireSize)
      );
      vehicleByKey.set(vehicleSeed.key, vehicle);
    }

    for (const wheelSeed of LEGACY_WHEELS) {
      const vehicle = vehicleByKey.get(wheelSeed.vehicleKey);
      if (!vehicle) continue;
      const wheel = await ensureWheel(
        ctx,
        brand._id,
        String(brand.brand_title ?? "Alfa Romeo"),
        vehicle.vehicle_title ?? vehicle.model_name ?? "",
        wheelSeed
      );
      const wheelVariantId = await ensureWheelVariant(ctx, wheel._id, wheelSeed);
      const wheelVariantTitle = `${wheelSeed.title}${wheelSeed.diameter ? ` ${wheelSeed.diameter}` : ""}`;
      await ensureWheelMeasurements(ctx, wheel._id, wheelSeed.title, wheelVariantId, wheelVariantTitle, wheelSeed);
      wheelByKey.set(wheelSeed.key, wheel);
      wheelVariantByKey.set(wheelSeed.key, wheelVariantId);

      await ensureJunctionRow(
        ctx,
        "j_wheel_vehicle",
        "by_wheel_vehicle",
        "wheel_id",
        wheel._id,
        "vehicle_id",
        vehicle._id,
        {
          wheel_id: wheel._id,
          vehicle_id: vehicle._id,
          wheel_title: wheelSeed.title,
          vehicle_title: vehicle.vehicle_title ?? vehicle.model_name ?? "",
        }
      );
    }

    for (const vehicleSeed of LEGACY_VEHICLES) {
      const vehicle = vehicleByKey.get(vehicleSeed.key);
      if (!vehicle) continue;
      for (const variantSeed of vehicleSeed.variants) {
        const vehicleVariantId = await ensureVehicleVariant(ctx, vehicle._id, variantSeed);
        vehicleVariantBySlug.set(variantSeed.slug, vehicleVariantId);
        const linkedWheelSeeds = variantSeed.wheelKeys
          .map((key) => LEGACY_WHEELS.find((wheelSeed) => wheelSeed.key === key))
          .filter((value): value is LegacyWheelSeed => value !== undefined);

        await ensureVehicleMeasurements(
          ctx,
          vehicle._id,
          vehicle.vehicle_title ?? vehicle.model_name ?? "",
          vehicleVariantId,
          variantSeed.variantTitle,
          linkedWheelSeeds
        );

        for (const wheelKey of variantSeed.wheelKeys) {
          const wheelVariantId = wheelVariantByKey.get(wheelKey);
          if (!wheelVariantId) continue;
          const wheelSeed = LEGACY_WHEELS.find((entry) => entry.key === wheelKey);
          await ensureJunctionRow(
            ctx,
            "j_oem_vehicle_variant_wheel_variant",
            "by_oem_vehicle_variant_wheel_variant",
            "vehicle_variant_id",
            vehicleVariantId,
            "wheel_variant_id",
            wheelVariantId,
            {
              vehicle_variant_id: vehicleVariantId,
              wheel_variant_id: wheelVariantId,
              variant_title: variantSeed.variantTitle,
              wheel_variant_title: wheelSeed?.title ?? wheelKey,
            }
          );
        }
      }
    }

    return {
      dryRun,
      vehiclesAddedOrPatched: LEGACY_VEHICLES.length,
      vehicleVariantsAddedOrPatched: LEGACY_VEHICLES.reduce((sum, seed) => sum + seed.variants.length, 0),
      wheelsAddedOrPatched: LEGACY_WHEELS.length,
      wheelVariantsAddedOrPatched: LEGACY_WHEELS.length,
    };
  },
});
