import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./adminAuth";

const rigStatus = v.union(v.literal("draft"), v.literal("approved"), v.literal("archived"));
const sourceKind = v.union(v.literal("existing_asset"), v.literal("upload"), v.literal("generated"));

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function splitValues(value: unknown) {
  return String(value ?? "")
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.map((value) => clean(value)).filter(Boolean) as string[])];
}

function withoutUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as T;
}

function normalizeBoltPattern(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/\s+/g, "")
    .trim();
}

function numberFromText(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function numericSet(values: string[]) {
  return values
    .map(numberFromText)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

function normalizeTireSize(value: unknown) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/ZR/g, "R")
    .trim();
}

function parseWheelDiameterIn(value: unknown) {
  const diameterMm = parseWheelDiameterMm(value);
  if (!diameterMm) return null;
  return Math.round((diameterMm / 25.4) * 10) / 10;
}

function parseTireRimIn(value: unknown) {
  const text = String(value ?? "").toUpperCase().replace(/\s+/g, "");
  const match = text.match(/\d{3}\/\d{2,3}[A-Z]*R(\d{2})(?:\D|$)/);
  return match ? Number(match[1]) : null;
}

function formatDiameterIn(value: number | null) {
  if (!value) return null;
  return Number.isInteger(value) ? `${value} in` : `${value.toFixed(1)} in`;
}

function tireSizesForDiameter(tireSizes: string[], diameterIn: number | null) {
  if (!diameterIn) return tireSizes;
  return tireSizes.filter((tireSize) => {
    const rimIn = parseTireRimIn(tireSize);
    return rimIn !== null && Math.abs(rimIn - diameterIn) < 0.05;
  });
}

function parseWheelDiameterMm(value: unknown) {
  const numeric = numberFromText(value);
  if (!numeric) return null;
  return numeric > 40 ? numeric : numeric * 25.4;
}

function getTitle(row: any, fallback = "Untitled") {
  return clean(row?.vehicle_title) ??
    clean(row?.wheel_title) ??
    clean(row?.variant_title) ??
    clean(row?.model_name) ??
    clean(row?.generation) ??
    clean(row?.slug) ??
    fallback;
}

async function getBrandMaps(ctx: any) {
  const [brands, vehicleLinks, wheelLinks] = await Promise.all([
    ctx.db.query("oem_brands").collect(),
    ctx.db.query("j_vehicle_brand").collect(),
    ctx.db.query("j_wheel_brand").collect(),
  ]);

  const brandById = new Map<string, any>(brands.map((brand: any) => [String(brand._id), brand]));
  const vehicleBrand = new Map<string, string>();
  const wheelBrand = new Map<string, string>();

  for (const link of vehicleLinks) {
    vehicleBrand.set(String(link.vehicle_id), clean(link.brand_title) ?? "");
  }
  for (const link of wheelLinks) {
    wheelBrand.set(String(link.wheel_id), clean(link.brand_title) ?? "");
  }

  return { brandById, vehicleBrand, wheelBrand };
}

function summarizeVehicle(vehicle: any, brandName?: string | null) {
  const label = getTitle(vehicle, "Vehicle");
  return {
    _id: vehicle._id,
    label,
    brandName: clean(brandName) ?? clean(vehicle.text_brands),
    subtitle: unique([vehicle.generation, vehicle.production_years]).join(" · "),
    imageUrl: clean(vehicle.good_pic_url) ?? clean(vehicle.bad_pic_url),
    goodPicUrl: clean(vehicle.good_pic_url),
    badPicUrl: clean(vehicle.bad_pic_url),
    wheelbaseMm: vehicle.wheelbase_mm ?? null,
    boltPatterns: splitValues(vehicle.text_bolt_patterns),
    centerBores: splitValues(vehicle.text_center_bores),
    diameters: splitValues(vehicle.text_diameters),
    widths: splitValues(vehicle.text_widths),
  };
}

function summarizeWheel(wheel: any, brandName?: string | null) {
  const label = getTitle(wheel, "Wheel");
  return {
    _id: wheel._id,
    label,
    brandName: clean(brandName) ?? clean(wheel.text_brands) ?? clean(wheel.jnc_brands),
    subtitle: unique([wheel.text_diameters, wheel.text_widths, wheel.text_offsets]).join(" · "),
    imageUrl: clean(wheel.good_pic_url) ?? clean(wheel.bad_pic_url),
    goodPicUrl: clean(wheel.good_pic_url),
    badPicUrl: clean(wheel.bad_pic_url),
    diameterMm: parseWheelDiameterMm(wheel.text_diameters),
    boltPatterns: splitValues(wheel.text_bolt_patterns),
    centerBores: splitValues(wheel.text_center_bores),
    diameters: splitValues(wheel.text_diameters),
    widths: splitValues(wheel.text_widths),
    offsets: splitValues(wheel.text_offsets ?? wheel.wheel_offset),
    tireSizes: splitValues(wheel.text_tire_sizes),
  };
}

function summarizeWheelVariant(variant: any) {
  return {
    _id: variant._id,
    wheelId: variant.wheel_id ?? null,
    label: getTitle(variant, "Wheel variant"),
    imageUrl: clean(variant.good_pic_url) ?? clean(variant.bad_pic_url),
    goodPicUrl: clean(variant.good_pic_url),
    badPicUrl: clean(variant.bad_pic_url),
    diameterMm: parseWheelDiameterMm(variant.diameter),
    diameter: clean(variant.diameter),
    width: clean(variant.width),
    offset: clean(variant.offset),
    boltPattern: clean(variant.bolt_pattern),
    centerBore: clean(variant.center_bore),
    finish: clean(variant.finish) ?? clean(variant.color),
  };
}

async function getWheelPackageVariant(ctx: any, variant: any, familySpecs: any) {
  const [
    diameterRows,
    widthRows,
    offsetRows,
    colorRows,
    tireRows,
  ] = await Promise.all([
    ctx.db.query("j_oem_wheel_variant_diameter").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variant._id)).collect(),
    ctx.db.query("j_oem_wheel_variant_width").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variant._id)).collect(),
    ctx.db.query("j_oem_wheel_variant_offset").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variant._id)).collect(),
    ctx.db.query("j_oem_wheel_variant_color").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variant._id)).collect(),
    ctx.db.query("j_oem_wheel_variant_tire_size").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variant._id)).collect(),
  ]);

  const diameters = unique([
    variant.diameter,
    ...diameterRows.map((row: any) => row.diameter),
  ]);
  const widths = unique([
    variant.width,
    ...widthRows.map((row: any) => row.width),
  ]);
  const offsets = unique([
    variant.offset,
    ...offsetRows.map((row: any) => row.offset),
  ]);
  const finishes = unique([
    variant.finish,
    variant.color,
    ...colorRows.map((row: any) => row.color),
  ]);
  const tireSizes = unique([
    ...tireRows.map((row: any) => row.tire_size),
    ...familySpecs.tireSizes,
  ]);
  const packageDiameters = diameters.length > 0 ? diameters : familySpecs.diameters;
  const packageSources = packageDiameters.length > 0 ? packageDiameters : [null];

  return packageSources.map((diameter: string | null, index: number) => {
    const diameterIn = parseWheelDiameterIn(diameter);
    const diameterLabel = clean(diameter) ?? formatDiameterIn(diameterIn);
    const widthLabel = widths.length === 1 ? widths[0] : widths.join(", ");
    const finishLabel = finishes.length === 1 ? finishes[0] : finishes.join(", ");
    const filteredTires = tireSizesForDiameter(tireSizes, diameterIn);
    const titleParts = unique([
      diameterLabel,
      widthLabel ? `${widthLabel} wide` : null,
      finishLabel,
    ]);

    return {
      id: `${String(variant._id)}:${diameterIn ?? clean(diameter) ?? index}`,
      source: "variant",
      wheelId: variant.wheel_id ?? null,
      variantId: variant._id,
      label: titleParts.length > 0 ? titleParts.join(" / ") : getTitle(variant, "Wheel package"),
      variantTitle: getTitle(variant, "Wheel variant"),
      diameter: diameterLabel,
      diameterIn,
      diameterMm: parseWheelDiameterMm(diameter),
      width: widths[0] ?? null,
      widths,
      offset: offsets[0] ?? null,
      offsets,
      finish: finishes[0] ?? null,
      finishes,
      tireSizes: filteredTires,
      allTireSizes: tireSizes,
      goodPicUrl: clean(variant.good_pic_url),
      badPicUrl: clean(variant.bad_pic_url),
    };
  });
}

async function getVehicleSpecs(ctx: any, vehicle: any, vehicleVariant: any | null) {
  const vehicleId = vehicle._id as Id<"oem_vehicles">;
  const variantId = vehicleVariant?._id as Id<"oem_vehicle_variants"> | undefined;

  const [
    boltRows,
    centerRows,
    diameterRows,
    widthRows,
    offsetRows,
    tireRows,
    variantBoltRows,
    variantCenterRows,
    variantDiameterRows,
    variantWidthRows,
    variantOffsetRows,
    variantTireRows,
  ] = await Promise.all([
    ctx.db.query("j_vehicle_bolt_pattern").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    ctx.db.query("j_vehicle_center_bore").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    ctx.db.query("j_vehicle_diameter").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    ctx.db.query("j_vehicle_width").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    ctx.db.query("j_vehicle_offset").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    ctx.db.query("j_vehicle_tire_size").withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId)).collect(),
    variantId ? ctx.db.query("j_oem_vehicle_variant_bolt_pattern").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_vehicle_variant_center_bore").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_vehicle_variant_diameter").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_vehicle_variant_width").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_vehicle_variant_offset").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_vehicle_variant_tire_size").withIndex("by_oem_vehicle_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
  ]);

  return {
    boltPatterns: unique([
      ...splitValues(vehicle.text_bolt_patterns),
      ...boltRows.map((row: any) => row.bolt_pattern),
      ...variantBoltRows.map((row: any) => row.bolt_pattern),
    ]),
    centerBores: unique([
      ...splitValues(vehicle.text_center_bores),
      ...centerRows.map((row: any) => row.center_bore),
      ...variantCenterRows.map((row: any) => row.center_bore),
    ]),
    diameters: unique([
      ...splitValues(vehicle.text_diameters),
      ...diameterRows.map((row: any) => row.diameter),
      ...variantDiameterRows.map((row: any) => row.diameter),
    ]),
    widths: unique([
      ...splitValues(vehicle.text_widths),
      ...widthRows.map((row: any) => row.width),
      ...variantWidthRows.map((row: any) => row.width),
    ]),
    offsets: unique([
      ...offsetRows.map((row: any) => row.offset),
      ...variantOffsetRows.map((row: any) => row.offset),
    ]),
    tireSizes: unique([
      ...tireRows.map((row: any) => row.tire_size),
      ...variantTireRows.map((row: any) => row.tire_size),
    ]),
  };
}

async function getWheelSpecs(ctx: any, wheel: any, wheelVariant: any | null) {
  const wheelId = wheel._id as Id<"oem_wheels">;
  const variantId = wheelVariant?._id as Id<"oem_wheel_variants"> | undefined;

  const [
    boltRows,
    centerRows,
    diameterRows,
    widthRows,
    offsetRows,
    tireRows,
    variantBoltRows,
    variantCenterRows,
    variantDiameterRows,
    variantWidthRows,
    variantOffsetRows,
    variantTireRows,
  ] = await Promise.all([
    ctx.db.query("j_wheel_bolt_pattern").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    ctx.db.query("j_wheel_center_bore").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    ctx.db.query("j_wheel_diameter").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    ctx.db.query("j_wheel_width").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    ctx.db.query("j_wheel_offset").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    ctx.db.query("j_wheel_tire_size").withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId)).collect(),
    variantId ? ctx.db.query("j_oem_wheel_variant_bolt_pattern").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_wheel_variant_center_bore").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_wheel_variant_diameter").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_wheel_variant_width").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_wheel_variant_offset").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
    variantId ? ctx.db.query("j_oem_wheel_variant_tire_size").withIndex("by_oem_wheel_variant", (q: any) => q.eq("variant_id", variantId)).collect() : [],
  ]);

  return {
    boltPatterns: unique([
      ...splitValues(wheel.text_bolt_patterns),
      wheelVariant?.bolt_pattern,
      ...boltRows.map((row: any) => row.bolt_pattern),
      ...variantBoltRows.map((row: any) => row.bolt_pattern),
    ]),
    centerBores: unique([
      ...splitValues(wheel.text_center_bores),
      wheelVariant?.center_bore,
      ...centerRows.map((row: any) => row.center_bore),
      ...variantCenterRows.map((row: any) => row.center_bore),
    ]),
    diameters: unique([
      ...splitValues(wheel.text_diameters),
      wheelVariant?.diameter,
      ...diameterRows.map((row: any) => row.diameter),
      ...variantDiameterRows.map((row: any) => row.diameter),
    ]),
    widths: unique([
      ...splitValues(wheel.text_widths),
      wheelVariant?.width,
      ...widthRows.map((row: any) => row.width),
      ...variantWidthRows.map((row: any) => row.width),
    ]),
    offsets: unique([
      ...splitValues(wheel.text_offsets ?? wheel.wheel_offset),
      wheelVariant?.offset,
      ...offsetRows.map((row: any) => row.offset),
      ...variantOffsetRows.map((row: any) => row.offset),
    ]),
    tireSizes: unique([
      ...splitValues(wheel.text_tire_sizes),
      ...tireRows.map((row: any) => row.tire_size),
      ...variantTireRows.map((row: any) => row.tire_size),
    ]),
  };
}

function compareOverlap(label: string, vehicleValues: string[], wheelValues: string[], normalizer = (value: string) => value.toLowerCase()) {
  if (vehicleValues.length === 0 || wheelValues.length === 0) {
    return {
      label,
      status: "unknown",
      message: `${label} data is incomplete`,
      vehicleValues,
      wheelValues,
    };
  }

  const vehicleSet = new Set(vehicleValues.map(normalizer));
  const overlap = wheelValues.filter((value) => vehicleSet.has(normalizer(value)));

  return {
    label,
    status: overlap.length > 0 ? "match" : "mismatch",
    message: overlap.length > 0 ? `${label} matches ${overlap.join(", ")}` : `${label} does not overlap`,
    vehicleValues,
    wheelValues,
    overlap,
  };
}

function compareCenterBore(vehicleValues: string[], wheelValues: string[]) {
  const vehicleNumbers = numericSet(vehicleValues);
  const wheelNumbers = numericSet(wheelValues);
  if (vehicleNumbers.length === 0 || wheelNumbers.length === 0) {
    return {
      label: "Center bore",
      status: "unknown",
      message: "Center bore data is incomplete",
      vehicleValues,
      wheelValues,
    };
  }

  const minWheel = Math.min(...wheelNumbers);
  const maxVehicle = Math.max(...vehicleNumbers);
  const exact = wheelNumbers.some((wheel) => vehicleNumbers.some((vehicle) => Math.abs(wheel - vehicle) < 0.05));
  const clearsHub = minWheel >= maxVehicle;

  return {
    label: "Center bore",
    status: exact || clearsHub ? "match" : "mismatch",
    message: exact
      ? "Center bore matches"
      : clearsHub
        ? "Wheel bore clears vehicle hub"
        : "Wheel bore is smaller than vehicle hub",
    vehicleValues,
    wheelValues,
  };
}

function compareOffsets(vehicleValues: string[], wheelValues: string[]) {
  const vehicleNumbers = numericSet(vehicleValues);
  const wheelNumbers = numericSet(wheelValues);
  if (vehicleNumbers.length === 0 || wheelNumbers.length === 0) {
    return {
      label: "Offset",
      status: "unknown",
      message: "Offset data is incomplete",
      vehicleValues,
      wheelValues,
    };
  }

  const match = wheelNumbers.some((wheel) =>
    vehicleNumbers.some((vehicle) => Math.abs(wheel - vehicle) <= 5)
  );

  return {
    label: "Offset",
    status: match ? "match" : "mismatch",
    message: match ? "Offset is within 5mm" : "Offset is outside the v1 tolerance",
    vehicleValues,
    wheelValues,
  };
}

function visualReadiness(vehicleRig: any, wheelRig: any) {
  const vehicleReady = [
    vehicleRig.front_axle_x,
    vehicleRig.front_axle_y,
    vehicleRig.rear_axle_x,
    vehicleRig.rear_axle_y,
    vehicleRig.px_per_mm,
  ].every((value) => typeof value === "number" && Number.isFinite(value));
  const wheelReady = [
    wheelRig.wheel_center_x,
    wheelRig.wheel_center_y,
    wheelRig.wheel_radius_px,
    wheelRig.wheel_diameter_mm,
  ].every((value) => typeof value === "number" && Number.isFinite(value));

  return {
    status: vehicleReady && wheelReady ? "ready" : "needs_calibration",
    message: vehicleReady && wheelReady
      ? "Visual rig is calibrated"
      : "One or both rigs need calibration anchors",
  };
}

async function evaluateFitmentForRigs(ctx: any, vehicleRig: any, wheelRig: any, tireSize?: string | null) {
  const [vehicle, wheel, vehicleVariant, wheelVariant] = await Promise.all([
    ctx.db.get(vehicleRig.vehicle_id),
    ctx.db.get(wheelRig.wheel_id),
    vehicleRig.vehicle_variant_id ? ctx.db.get(vehicleRig.vehicle_variant_id) : null,
    wheelRig.wheel_variant_id ? ctx.db.get(wheelRig.wheel_variant_id) : null,
  ]);

  if (!vehicle || !wheel) {
    return {
      status: "unknown",
      visualStatus: "needs_calibration",
      reasons: [{ label: "Records", status: "unknown", message: "Vehicle or wheel record is missing" }],
      tireOptions: [],
    };
  }

  const [vehicleSpecs, wheelSpecs] = await Promise.all([
    getVehicleSpecs(ctx, vehicle, vehicleVariant),
    getWheelSpecs(ctx, wheel, wheelVariant),
  ]);

  const checks = [
    compareOverlap("Bolt pattern", vehicleSpecs.boltPatterns, wheelSpecs.boltPatterns, normalizeBoltPattern),
    compareCenterBore(vehicleSpecs.centerBores, wheelSpecs.centerBores),
    compareOverlap("Diameter", vehicleSpecs.diameters, wheelSpecs.diameters, (value) => String(numberFromText(value) ?? value).toLowerCase()),
    compareOverlap("Width", vehicleSpecs.widths, wheelSpecs.widths, (value) => String(numberFromText(value) ?? value).toLowerCase()),
    compareOffsets(vehicleSpecs.offsets, wheelSpecs.offsets),
  ];

  const normalizedTire = normalizeTireSize(tireSize);
  if (normalizedTire) {
    const vehicleTires = vehicleSpecs.tireSizes.map(normalizeTireSize);
    const wheelTires = wheelSpecs.tireSizes.map(normalizeTireSize);
    const knownOnVehicle = vehicleTires.length === 0 || vehicleTires.includes(normalizedTire);
    const knownOnWheel = wheelTires.length === 0 || wheelTires.includes(normalizedTire);
    checks.push({
      label: "Tire size",
      status: knownOnVehicle && knownOnWheel ? "match" : "mismatch",
      message: knownOnVehicle && knownOnWheel
        ? `${tireSize} is not contradicted by known tire data`
        : `${tireSize} is not listed for this pairing`,
      vehicleValues: vehicleSpecs.tireSizes,
      wheelValues: wheelSpecs.tireSizes,
    });
  }

  const hasMismatch = checks.some((check) => check.status === "mismatch");
  const hasUnknown = checks.some((check) => check.status === "unknown");
  const visual = visualReadiness(vehicleRig, wheelRig);

  return {
    status: hasMismatch ? "incompatible" : hasUnknown ? "unknown" : "compatible",
    visualStatus: visual.status,
    visualMessage: visual.message,
    reasons: checks,
    vehicleSpecs,
    wheelSpecs,
    tireOptions: unique([...vehicleSpecs.tireSizes, ...wheelSpecs.tireSizes]),
    vehicle: summarizeVehicle(vehicle),
    wheel: summarizeWheel(wheel),
    wheelVariant: wheelVariant ? summarizeWheelVariant(wheelVariant) : null,
  };
}

export const assetStudioData = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const [
      vehicles,
      wheels,
      wheelVariants,
      vehicleRigs,
      wheelRigs,
    ] = await Promise.all([
      ctx.db.query("oem_vehicles").order("asc").collect(),
      ctx.db.query("oem_wheels").order("asc").collect(),
      ctx.db.query("oem_wheel_variants").order("asc").collect(),
      ctx.db.query("configurator_vehicle_rigs").order("desc").collect(),
      ctx.db.query("configurator_wheel_rigs").order("desc").collect(),
    ]);

    const { brandById, vehicleBrand, wheelBrand } = await getBrandMaps(ctx);

    return {
      vehicles: vehicles.map((vehicle: any) =>
        summarizeVehicle(
          vehicle,
          vehicle.brand_id ? brandById.get(String(vehicle.brand_id))?.brand_title : vehicleBrand.get(String(vehicle._id))
        )
      ),
      wheels: wheels.map((wheel: any) =>
        summarizeWheel(
          wheel,
          wheel.brand_id ? brandById.get(String(wheel.brand_id))?.brand_title : wheelBrand.get(String(wheel._id))
        )
      ),
      wheelVariants: wheelVariants.map(summarizeWheelVariant),
      vehicleRigs,
      wheelRigs,
    };
  },
});

export const clientConfiguratorData = query({
  args: {},
  handler: async (ctx) => {
    const [vehicleRigs, wheelRigs] = await Promise.all([
      ctx.db
        .query("configurator_vehicle_rigs")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .collect(),
      ctx.db
        .query("configurator_wheel_rigs")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .collect(),
    ]);

    const vehicleDocs = await Promise.all(vehicleRigs.map((rig: any) => ctx.db.get(rig.vehicle_id)));
    const wheelDocs = await Promise.all(wheelRigs.map((rig: any) => ctx.db.get(rig.wheel_id)));
    const wheelVariantDocs = await Promise.all(
      wheelRigs.map((rig: any) => rig.wheel_variant_id ? ctx.db.get(rig.wheel_variant_id) : null)
    );

    return {
      vehicleRigs: vehicleRigs
        .map((rig: any, index: number) => {
          const vehicle = vehicleDocs[index];
          if (!vehicle) return null;
          return {
            ...rig,
            vehicle: summarizeVehicle(vehicle),
          };
        })
        .filter(Boolean),
      wheelRigs: wheelRigs
        .map((rig: any, index: number) => {
          const wheel = wheelDocs[index];
          if (!wheel) return null;
          const wheelVariant = wheelVariantDocs[index];
          return {
            ...rig,
            wheel: summarizeWheel(wheel),
            wheelVariant: wheelVariant ? summarizeWheelVariant(wheelVariant) : null,
          };
        })
        .filter(Boolean),
    };
  },
});

export const wheelPackagesForWheel = query({
  args: {
    wheelId: v.id("oem_wheels"),
  },
  handler: async (ctx, args) => {
    const wheel = await ctx.db.get(args.wheelId);
    if (!wheel) {
      return {
        wheel: null,
        packages: [],
        tireSizes: [],
      };
    }

    const [
      variants,
      diameterRows,
      widthRows,
      offsetRows,
      tireRows,
    ] = await Promise.all([
      ctx.db.query("oem_wheel_variants").withIndex("by_wheel_id", (q) => q.eq("wheel_id", args.wheelId)).collect(),
      ctx.db.query("j_wheel_diameter").withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId)).collect(),
      ctx.db.query("j_wheel_width").withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId)).collect(),
      ctx.db.query("j_wheel_offset").withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId)).collect(),
      ctx.db.query("j_wheel_tire_size").withIndex("by_wheel", (q) => q.eq("wheel_id", args.wheelId)).collect(),
    ]);

    const familySpecs = {
      diameters: unique([
        ...splitValues(wheel.text_diameters),
        ...diameterRows.map((row: any) => row.diameter),
      ]),
      widths: unique([
        ...splitValues(wheel.text_widths),
        ...widthRows.map((row: any) => row.width),
      ]),
      offsets: unique([
        ...splitValues(wheel.text_offsets ?? wheel.wheel_offset),
        ...offsetRows.map((row: any) => row.offset),
      ]),
      tireSizes: unique([
        ...splitValues(wheel.text_tire_sizes),
        ...tireRows.map((row: any) => row.tire_size),
      ]),
    };

    const variantPackages = (await Promise.all(
      variants.map((variant: any) => getWheelPackageVariant(ctx, variant, familySpecs))
    )).flat();

    const familyDiameters = familySpecs.diameters.length > 0 ? familySpecs.diameters : [null];
    const familyPackages = familyDiameters.map((diameter: string | null, index: number) => {
      const diameterIn = parseWheelDiameterIn(diameter);
      const diameterLabel = clean(diameter) ?? formatDiameterIn(diameterIn);
      const widthLabel = familySpecs.widths.length === 1 ? familySpecs.widths[0] : familySpecs.widths.join(", ");
      const filteredTires = tireSizesForDiameter(familySpecs.tireSizes, diameterIn);
      const titleParts = unique([
        diameterLabel,
        widthLabel ? `${widthLabel} wide` : null,
      ]);

      return {
        id: `${String(wheel._id)}:${diameterIn ?? clean(diameter) ?? index}`,
        source: "wheel",
        wheelId: wheel._id,
        variantId: null,
        label: titleParts.length > 0 ? titleParts.join(" / ") : "Known wheel package",
        variantTitle: null,
        diameter: diameterLabel,
        diameterIn,
        diameterMm: parseWheelDiameterMm(diameter),
        width: familySpecs.widths[0] ?? null,
        widths: familySpecs.widths,
        offset: familySpecs.offsets[0] ?? null,
        offsets: familySpecs.offsets,
        finish: clean(wheel.color),
        finishes: unique([wheel.color, ...splitValues(wheel.text_colors)]),
        tireSizes: filteredTires,
        allTireSizes: familySpecs.tireSizes,
        goodPicUrl: clean(wheel.good_pic_url),
        badPicUrl: clean(wheel.bad_pic_url),
      };
    });

    const packages = (variantPackages.length > 0 ? variantPackages : familyPackages)
      .sort((a: any, b: any) => {
        const diameterDelta = (a.diameterIn ?? 999) - (b.diameterIn ?? 999);
        if (diameterDelta !== 0) return diameterDelta;
        return String(a.label).localeCompare(String(b.label), undefined, { sensitivity: "base" });
      });

    return {
      wheel: summarizeWheel(wheel),
      packages,
      tireSizes: familySpecs.tireSizes,
    };
  },
});

export const evaluateFitment = query({
  args: {
    vehicleRigId: v.id("configurator_vehicle_rigs"),
    wheelRigId: v.id("configurator_wheel_rigs"),
    tireSize: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const [vehicleRig, wheelRig] = await Promise.all([
      ctx.db.get(args.vehicleRigId),
      ctx.db.get(args.wheelRigId),
    ]);

    if (!vehicleRig || !wheelRig || vehicleRig.status !== "approved" || wheelRig.status !== "approved") {
      return {
        status: "unknown",
        visualStatus: "needs_calibration",
        visualMessage: "Approved vehicle and wheel rigs are required",
        reasons: [],
        tireOptions: [],
      };
    }

    return await evaluateFitmentForRigs(ctx, vehicleRig, wheelRig, args.tireSize);
  },
});

export const vehicleRigUpsert = mutation({
  args: {
    id: v.optional(v.id("configurator_vehicle_rigs")),
    vehicleId: v.id("oem_vehicles"),
    vehicleVariantId: v.optional(v.id("oem_vehicle_variants")),
    title: v.optional(v.string()),
    sourceAssetUrl: v.string(),
    cutoutAssetUrl: v.optional(v.string()),
    sourceKind,
    generationSessionId: v.optional(v.string()),
    imageWidthPx: v.optional(v.number()),
    imageHeightPx: v.optional(v.number()),
    vehicleLengthMm: v.optional(v.number()),
    wheelbaseMm: v.optional(v.number()),
    frontX: v.optional(v.number()),
    rearX: v.optional(v.number()),
    frontAxleX: v.optional(v.number()),
    frontAxleY: v.optional(v.number()),
    rearAxleX: v.optional(v.number()),
    rearAxleY: v.optional(v.number()),
    groundY: v.optional(v.number()),
    pxPerMm: v.optional(v.number()),
    status: v.optional(rigStatus),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = typeof identity.subject === "string" ? identity.subject : undefined;
    const now = new Date().toISOString();
    const patch = withoutUndefined({
      vehicle_id: args.vehicleId,
      vehicle_variant_id: args.vehicleVariantId,
      title: args.title,
      source_asset_url: args.sourceAssetUrl,
      cutout_asset_url: args.cutoutAssetUrl,
      source_kind: args.sourceKind,
      generation_session_id: args.generationSessionId,
      image_width_px: args.imageWidthPx,
      image_height_px: args.imageHeightPx,
      vehicle_length_mm: args.vehicleLengthMm,
      wheelbase_mm: args.wheelbaseMm,
      front_x: args.frontX,
      rear_x: args.rearX,
      front_axle_x: args.frontAxleX,
      front_axle_y: args.frontAxleY,
      rear_axle_x: args.rearAxleX,
      rear_axle_y: args.rearAxleY,
      ground_y: args.groundY,
      px_per_mm: args.pxPerMm,
      status: args.status ?? "draft",
      notes: args.notes,
      updated_at: now,
      approved_at: args.status === "approved" ? now : undefined,
    });

    if (args.id) {
      await ctx.db.patch(args.id, patch);
      return args.id;
    }

    return await ctx.db.insert("configurator_vehicle_rigs", {
      ...patch,
      status: args.status ?? "draft",
      created_by: userId ?? undefined,
      created_at: now,
      updated_at: now,
    });
  },
});

export const wheelRigUpsert = mutation({
  args: {
    id: v.optional(v.id("configurator_wheel_rigs")),
    wheelId: v.id("oem_wheels"),
    wheelVariantId: v.optional(v.id("oem_wheel_variants")),
    title: v.optional(v.string()),
    sourceAssetUrl: v.string(),
    cutoutAssetUrl: v.optional(v.string()),
    sourceKind,
    generationSessionId: v.optional(v.string()),
    imageWidthPx: v.optional(v.number()),
    imageHeightPx: v.optional(v.number()),
    wheelCenterX: v.optional(v.number()),
    wheelCenterY: v.optional(v.number()),
    wheelRadiusPx: v.optional(v.number()),
    wheelDiameterMm: v.optional(v.number()),
    pxPerMm: v.optional(v.number()),
    status: v.optional(rigStatus),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = typeof identity.subject === "string" ? identity.subject : undefined;
    const now = new Date().toISOString();
    const patch = withoutUndefined({
      wheel_id: args.wheelId,
      wheel_variant_id: args.wheelVariantId,
      title: args.title,
      source_asset_url: args.sourceAssetUrl,
      cutout_asset_url: args.cutoutAssetUrl,
      source_kind: args.sourceKind,
      generation_session_id: args.generationSessionId,
      image_width_px: args.imageWidthPx,
      image_height_px: args.imageHeightPx,
      wheel_center_x: args.wheelCenterX,
      wheel_center_y: args.wheelCenterY,
      wheel_radius_px: args.wheelRadiusPx,
      wheel_diameter_mm: args.wheelDiameterMm,
      px_per_mm: args.pxPerMm,
      status: args.status ?? "draft",
      notes: args.notes,
      updated_at: now,
      approved_at: args.status === "approved" ? now : undefined,
    });

    if (args.id) {
      await ctx.db.patch(args.id, patch);
      return args.id;
    }

    return await ctx.db.insert("configurator_wheel_rigs", {
      ...patch,
      status: args.status ?? "draft",
      created_by: userId ?? undefined,
      created_at: now,
      updated_at: now,
    });
  },
});

export const vehicleRigSetStatus = mutation({
  args: {
    id: v.id("configurator_vehicle_rigs"),
    status: rigStatus,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: args.status,
      updated_at: now,
      approved_at: args.status === "approved" ? now : undefined,
    });
    return args.id;
  },
});

export const wheelRigSetStatus = mutation({
  args: {
    id: v.id("configurator_wheel_rigs"),
    status: rigStatus,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: args.status,
      updated_at: now,
      approved_at: args.status === "approved" ? now : undefined,
    });
    return args.id;
  },
});

export const buildPresetSave = mutation({
  args: {
    vehicleRigId: v.id("configurator_vehicle_rigs"),
    wheelRigId: v.id("configurator_wheel_rigs"),
    tireSize: v.optional(v.string()),
    visualTransformJson: v.optional(v.string()),
    fitmentResultJson: v.optional(v.string()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = typeof identity?.subject === "string" ? identity.subject : undefined;
    const now = new Date().toISOString();
    return await ctx.db.insert("configurator_build_presets", {
      vehicle_rig_id: args.vehicleRigId,
      wheel_rig_id: args.wheelRigId,
      tire_size: args.tireSize,
      visual_transform_json: args.visualTransformJson,
      fitment_result_json: args.fitmentResultJson,
      owner_user_id: userId ?? undefined,
      label: args.label,
      created_at: now,
      updated_at: now,
    });
  },
});
