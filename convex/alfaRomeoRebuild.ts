import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type WheelDoc = Doc<"oem_wheels">;
type VehicleDoc = Doc<"oem_vehicles">;

type WsVehicle = {
  id?: string;
  name?: string;
  brand?: string;
};

type WsVehicleVariant = {
  id?: string;
  model_id?: string;
  name?: string;
};

type WsWheel = {
  id?: string;
  variant_id?: string;
  title?: string;
  part_number?: string;
  size?: string;
  front_width?: string;
  rear_width?: string;
  front_offset?: string;
  rear_offset?: string;
  bolt_pattern?: string;
  finish?: string;
  options?: string;
  good_pic_url?: string;
  src_url?: string;
};

function clean(value: unknown): string | undefined {
  const out = String(value ?? "").trim();
  return out ? out : undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueJoined(parts: Array<string | undefined>, suffix = ""): string | undefined {
  const values = [...new Set(parts.map((part) => clean(part)).filter(Boolean) as string[])];
  if (values.length === 0) return undefined;
  return values.map((value) => (suffix && !value.endsWith(suffix) ? `${value}${suffix}` : value)).join(", ");
}

function wheelSlug(raw: WsWheel): string {
  const title = clean(raw.title) ?? clean(raw.id) ?? "alfa-wheel";
  return `alfa-romeo-${slugify(title)}-wheels`;
}

function wheelVariantSlug(raw: WsWheel): string {
  const pn = clean(raw.part_number);
  if (pn) return `${wheelSlug(raw)}-${slugify(pn)}`;
  return `${wheelSlug(raw)}-variant`;
}

function mergeWsRows<T extends Record<string, unknown>>(rows: T[]): T {
  const out: Record<string, unknown> = {};
  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (out[key] == null || String(out[key] ?? "").trim() === "") {
        if (value != null && String(value).trim() !== "") out[key] = value;
      }
    }
  }
  return out as T;
}

function normalizedWheelFields(raw: WsWheel, vehicleTitle: string) {
  const diameter = clean(raw.size);
  const width = uniqueJoined([raw.front_width, raw.rear_width], "J");
  const offset = uniqueJoined([raw.front_offset, raw.rear_offset]);
  const color = clean(raw.finish);
  const imageUrl = clean(raw.good_pic_url) ?? clean(raw.src_url);
  const partNumber = clean(raw.part_number);

  return {
    wheelTitle: clean(raw.title) ?? partNumber ?? clean(raw.id) ?? "Alfa Romeo Wheel",
    businessId: wheelSlug(raw),
    variantSlug: wheelVariantSlug(raw),
    partNumber,
    diameterText: diameter ? `${diameter} inch` : undefined,
    widthText: width,
    offsetText: offset,
    colorText: color,
    imageUrl,
    notes: [
      "Backfilled from Alfa Romeo workshop wheel data.",
      clean(raw.variant_id) ? `variant_id=${raw.variant_id}` : undefined,
      clean(raw.id) ? `source_id=${raw.id}` : undefined,
      clean(raw.options) ? `options=${raw.options}` : undefined,
    ]
      .filter(Boolean)
      .join(" "),
    specificationsJson: JSON.stringify({
      source_id: clean(raw.id),
      variant_id: clean(raw.variant_id),
      title: clean(raw.title),
      part_number: partNumber,
      size: clean(raw.size),
      front_width: clean(raw.front_width),
      rear_width: clean(raw.rear_width),
      front_offset: clean(raw.front_offset),
      rear_offset: clean(raw.rear_offset),
      bolt_pattern: clean(raw.bolt_pattern),
      finish: color,
      options: clean(raw.options),
      image_url: imageUrl,
    }),
    textVehicles: vehicleTitle,
  };
}

const VEHICLE_METADATA: Record<
  string,
  {
    production_years: string;
    year_from: number;
    year_to?: number;
    body_type: string;
    drive_type: string;
    special_notes?: string;
  }
> = {
  "alfa-romeo-alfa-romeo-giulia": {
    production_years: "2017-present",
    year_from: 2017,
    body_type: "Sedan",
    drive_type: "RWD, AWD",
    special_notes: "Verified against current Alfa Romeo USA Giulia model pages.",
  },
  "alfa-romeo-alfa-romeo-stelvio": {
    production_years: "2018-present",
    year_from: 2018,
    body_type: "SUV",
    drive_type: "AWD",
    special_notes: "Verified against current Alfa Romeo USA Stelvio model pages.",
  },
  "alfa-romeo-alfa-romeo-4c": {
    production_years: "2015-2020",
    year_from: 2015,
    year_to: 2020,
    body_type: "Sports Car",
    drive_type: "RWD",
    special_notes: "Verified against Alfa Romeo USA 4C pages and owner manual listings.",
  },
};

async function ensureJunctionRow(
  ctx: any,
  table: string,
  indexName: string,
  fieldA: string,
  valueA: any,
  fieldB: string,
  valueB: any,
  row: Record<string, unknown>
) {
  const existing = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(fieldA, valueA).eq(fieldB, valueB))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert(table, row);
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

async function ensureVehicleBrandLink(ctx: any, vehicle: VehicleDoc, brandId: Id<"oem_brands">, brandTitle: string) {
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

async function ensureWheelBrandLink(ctx: any, wheel: WheelDoc, brandId: Id<"oem_brands">, brandTitle: string) {
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

async function ensureVehicleVariant(
  ctx: any,
  vehicleId: Id<"oem_vehicles">,
  slug: string,
  title: string
) {
  const bySlug = await ctx.db
    .query("oem_vehicle_variants")
    .withIndex("by_slug", (q: any) => q.eq("slug", slug))
    .first();
  if (bySlug) {
    await ctx.db.patch(bySlug._id, {
      vehicle_id: vehicleId,
      variant_title: title,
      trim_level: title,
    });
    return bySlug._id as Id<"oem_vehicle_variants">;
  }

  const existing = await ctx.db
    .query("oem_vehicle_variants")
    .withIndex("by_vehicle_id", (q: any) => q.eq("vehicle_id", vehicleId))
    .collect();
  const matched = existing.find((row: any) => String(row.slug ?? "").trim() === slug || String(row.variant_title ?? "").trim() === title);
  if (matched) {
    await ctx.db.patch(matched._id, {
      slug,
      variant_title: title,
      trim_level: title,
    });
    return matched._id as Id<"oem_vehicle_variants">;
  }

  return await ctx.db.insert("oem_vehicle_variants", {
    vehicle_id: vehicleId,
    slug,
    variant_title: title,
    trim_level: title,
  });
}

async function ensureWheelVariant(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  wheelTitle: string,
  slug: string,
  variantTitle: string,
  partNumbers: string | undefined,
  notes: string,
  imageUrl: string | undefined
) {
  const bySlug = await ctx.db
    .query("oem_wheel_variants")
    .withIndex("by_slug", (q: any) => q.eq("slug", slug))
    .first();
  if (bySlug) {
    await ctx.db.patch(bySlug._id, {
      wheel_id: wheelId,
      wheel_title: wheelTitle,
      variant_title: variantTitle,
      part_numbers: partNumbers,
      notes,
      good_pic_url: imageUrl,
      updated_at: new Date().toISOString(),
    });
    return bySlug._id as Id<"oem_wheel_variants">;
  }

  return await ctx.db.insert("oem_wheel_variants", {
    wheel_id: wheelId,
    slug,
    variant_title: variantTitle,
    wheel_title: wheelTitle,
    part_numbers: partNumbers,
    notes,
    good_pic_url: imageUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

async function ensureWheelMeasurementRefs(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  wheelTitle: string,
  wheelVariantId: Id<"oem_wheel_variants">,
  variantTitle: string,
  fields: {
    diameterText?: string;
    widthText?: string;
    offsetText?: string;
    colorText?: string;
    partNumber?: string;
  }
) {
  if (fields.diameterText) {
    const id = await getOrCreateByIndex(ctx, "oem_diameters", "by_diameter", "diameter", fields.diameterText);
    await ensureJunctionRow(
      ctx,
      "j_wheel_diameter",
      "by_wheel_diameter",
      "wheel_id",
      wheelId,
      "diameter_id",
      id,
      { wheel_id: wheelId, diameter_id: id, wheel_title: wheelTitle, diameter: fields.diameterText }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_diameter",
      "by_oem_wheel_variant_diameter",
      "variant_id",
      wheelVariantId,
      "diameter_id",
      id,
      { variant_id: wheelVariantId, diameter_id: id, variant_title: variantTitle, diameter: fields.diameterText }
    );
  }

  if (fields.widthText) {
    const id = await getOrCreateByIndex(ctx, "oem_widths", "by_width", "width", fields.widthText);
    await ensureJunctionRow(
      ctx,
      "j_wheel_width",
      "by_wheel_width",
      "wheel_id",
      wheelId,
      "width_id",
      id,
      { wheel_id: wheelId, width_id: id, wheel_title: wheelTitle, width: fields.widthText }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_width",
      "by_oem_wheel_variant_width",
      "variant_id",
      wheelVariantId,
      "width_id",
      id,
      { variant_id: wheelVariantId, width_id: id, variant_title: variantTitle, width: fields.widthText }
    );
  }

  if (fields.offsetText) {
    const id = await getOrCreateByIndex(ctx, "oem_offsets", "by_offset", "offset", fields.offsetText);
    await ensureJunctionRow(
      ctx,
      "j_wheel_offset",
      "by_wheel_offset",
      "wheel_id",
      wheelId,
      "offset_id",
      id,
      { wheel_id: wheelId, offset_id: id, wheel_title: wheelTitle, offset: fields.offsetText }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_offset",
      "by_oem_wheel_variant_offset",
      "variant_id",
      wheelVariantId,
      "offset_id",
      id,
      { variant_id: wheelVariantId, offset_id: id, variant_title: variantTitle, offset: fields.offsetText }
    );
  }

  if (fields.colorText) {
    const id = await getOrCreateByIndex(ctx, "oem_colors", "by_color", "color", fields.colorText);
    await ensureJunctionRow(
      ctx,
      "j_wheel_color",
      "by_wheel_color",
      "wheel_id",
      wheelId,
      "color_id",
      id,
      { wheel_id: wheelId, color_id: id, wheel_title: wheelTitle, color: fields.colorText }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_color",
      "by_oem_wheel_variant_color",
      "variant_id",
      wheelVariantId,
      "color_id",
      id,
      { variant_id: wheelVariantId, color_id: id, variant_title: variantTitle, color: fields.colorText }
    );
  }

  if (fields.partNumber) {
    const id = await getOrCreateByIndex(ctx, "oem_part_numbers", "by_part_number", "part_number", fields.partNumber);
    await ensureJunctionRow(
      ctx,
      "j_wheel_part_number",
      "by_wheel_part_number",
      "wheel_id",
      wheelId,
      "part_number_id",
      id,
      { wheel_id: wheelId, part_number_id: id, wheel_title: wheelTitle, part_number: fields.partNumber }
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_part_number",
      "by_oem_wheel_variant_part_number",
      "variant_id",
      wheelVariantId,
      "part_number_id",
      id,
      { variant_id: wheelVariantId, part_number_id: id, variant_title: variantTitle, part_number: fields.partNumber }
    );
  }
}

async function deleteWheelBrandLinks(ctx: any, wheelId: Id<"oem_wheels">) {
  const rows = await ctx.db
    .query("j_wheel_brand")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId))
    .collect();
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
  return rows.length;
}

export const rebuildAlfaRomeoFromWorkshop = mutation({
  args: {
    commit: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const commit = args.commit ?? false;

    const [
      brands,
      vehicles,
      vehicleVariants,
      wheels,
      wheelVariants,
      vehicleBrandLinks,
      wheelBrandLinks,
      wheelVehicleLinks,
      vehicleVariantWheelVariantLinks,
      wsVehicleRows,
      wsVehicleVariantRows,
      wsWheelRows,
    ] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_vehicle_variants").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_wheel_variants").collect(),
      ctx.db.query("j_vehicle_brand").collect(),
      ctx.db.query("j_wheel_brand").collect(),
      ctx.db.query("j_wheel_vehicle").collect(),
      ctx.db.query("j_oem_vehicle_variant_wheel_variant").collect(),
      ctx.db.query("ws_alfa_romeo_vehicles").collect(),
      ctx.db.query("ws_alfa_romeo_vehicle_variants").collect(),
      ctx.db.query("ws_alfa_romeo_wheels").collect(),
    ]);

    const brand = brands.find((row) => String(row.brand_title ?? "").toLowerCase() === "alfa romeo");
    if (!brand) throw new Error("Alfa Romeo brand not found");

    const brandTitle = String(brand.brand_title ?? "Alfa Romeo");
    const liveVehicleIds = new Set(
      vehicleBrandLinks.filter((row) => row.brand_id === brand._id).map((row) => row.vehicle_id)
    );
    const liveWheelIds = new Set(
      wheelBrandLinks.filter((row) => row.brand_id === brand._id).map((row) => row.wheel_id)
    );

    const alfaVehicles = vehicles.filter((row) => liveVehicleIds.has(row._id));
    const alfaWheels = wheels.filter((row) => liveWheelIds.has(row._id));

    const wsVehicles = new Map<string, WsVehicle>();
    for (const row of wsVehicleRows) {
      const parsed = JSON.parse(row.data) as WsVehicle;
      const id = clean(parsed.id ?? row.source_id);
      if (!id) continue;
      const existing = wsVehicles.get(id);
      wsVehicles.set(id, existing ? mergeWsRows([existing, parsed]) : parsed);
    }

    const wsVehicleVariants = new Map<string, WsVehicleVariant>();
    for (const row of wsVehicleVariantRows) {
      const parsed = JSON.parse(row.data) as WsVehicleVariant;
      const id = clean(parsed.id ?? row.source_id);
      if (!id) continue;
      const existing = wsVehicleVariants.get(id);
      wsVehicleVariants.set(id, existing ? mergeWsRows([existing, parsed]) : parsed);
    }

    const wsWheels = new Map<string, WsWheel>();
    for (const row of wsWheelRows) {
      const parsed = JSON.parse(row.data) as WsWheel;
      const id = clean(parsed.id ?? row.source_id);
      if (!id) continue;
      const existing = wsWheels.get(id);
      wsWheels.set(id, existing ? mergeWsRows([existing, parsed]) : parsed);
    }

    const duplicateWheelGroups = new Map<string, WheelDoc[]>();
    for (const wheel of alfaWheels) {
      const uuid = clean(wheel.uuid);
      const businessId = clean(wheel.id);
      if (uuid && wsWheels.has(uuid)) {
        const list = duplicateWheelGroups.get(uuid) ?? [];
        list.push(wheel);
        duplicateWheelGroups.set(uuid, list);
        continue;
      }
      if (businessId && wsWheels.has(businessId)) {
        const list = duplicateWheelGroups.get(businessId) ?? [];
        list.push(wheel);
        duplicateWheelGroups.set(businessId, list);
      }
    }

    const plannedDeletes = [...duplicateWheelGroups.values()].reduce((sum, rows) => sum + Math.max(0, rows.length - 1), 0);

    if (!commit) {
      return {
        commit,
        stats: {
          wsVehicles: wsVehicles.size,
          wsVehicleVariants: wsVehicleVariants.size,
          wsWheels: wsWheels.size,
          liveVehicles: alfaVehicles.length,
          liveVehicleVariants: vehicleVariants.filter((row) => liveVehicleIds.has(row.vehicle_id)).length,
          liveWheels: alfaWheels.length,
          liveWheelVariants: wheelVariants.filter((row) => liveWheelIds.has(row.wheel_id)).length,
          plannedDeletes,
        },
        sample: [...wsWheels.entries()].slice(0, 10).map(([sourceId, raw]) => ({
          sourceId,
          title: raw.title,
          businessId: wheelSlug(raw),
          variantSlug: wheelVariantSlug(raw),
          vehicleVariantId: raw.variant_id,
        })),
      };
    }

    const now = new Date().toISOString();
    const vehicleBySourceId = new Map<string, VehicleDoc>();
    const vehicleVariantBySourceId = new Map<string, Id<"oem_vehicle_variants">>();

    let vehiclesPatched = 0;
    let vehicleVariantsPatched = 0;
    let wheelsPatched = 0;
    let wheelVariantsPatched = 0;
    let wheelVehicleLinksCreated = 0;
    let vehicleVariantWheelVariantLinksCreated = 0;
    let deleted = 0;
    const vehicleDiameterCoverage = new Map<Id<"oem_vehicles">, Set<string>>();
    const vehicleWidthCoverage = new Map<Id<"oem_vehicles">, Set<string>>();

    for (const [sourceId, raw] of wsVehicles.entries()) {
      const meta = VEHICLE_METADATA[sourceId];
      const existing =
        alfaVehicles.find((row) => clean(row.id) === sourceId) ??
        vehicles.find((row) => clean(row.id) === sourceId);
      const patch = {
        id: sourceId,
        slug: sourceId,
        vehicle_title: clean(raw.name) ?? clean(raw.id) ?? sourceId,
        model_name: clean(raw.name) ?? clean(raw.id) ?? sourceId,
        brand_id: brand._id,
        text_brands: brandTitle,
        ...(meta ?? {}),
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
      vehicleBySourceId.set(sourceId, vehicle);
      await ensureVehicleBrandLink(ctx, vehicle, brand._id, brandTitle);
      vehiclesPatched += 1;
    }

    for (const [sourceId, raw] of wsVehicleVariants.entries()) {
      const vehicle = vehicleBySourceId.get(clean(raw.model_id) ?? "");
      if (!vehicle) continue;
      const variantId = await ensureVehicleVariant(
        ctx,
        vehicle._id,
        sourceId,
        clean(raw.name) ?? "All"
      );
      vehicleVariantBySourceId.set(sourceId, variantId);
      vehicleVariantsPatched += 1;
    }

    for (const [sourceId, raw] of wsWheels.entries()) {
      const vehicleVariantId = vehicleVariantBySourceId.get(clean(raw.variant_id) ?? "");
      const vehicleSourceId = clean(raw.variant_id)?.replace(/-all$/i, "") ?? "";
      const vehicle = vehicleBySourceId.get(vehicleSourceId);
      if (!vehicle || !vehicleVariantId) continue;

      const group =
        duplicateWheelGroups.get(sourceId) ??
        alfaWheels.filter((row) => clean(row.uuid) === sourceId || clean(row.id) === sourceId || clean(row.uuid) === wheelSlug(raw) || clean(row.id) === wheelSlug(raw));
      const canonical = [...group].sort((a, b) => a._creationTime - b._creationTime)[0];
      const fields = normalizedWheelFields(raw, vehicle.vehicle_title ?? vehicle.model_name ?? "");

      let wheelId: Id<"oem_wheels">;
      if (canonical) {
        await ctx.db.patch(canonical._id, {
          id: fields.businessId,
          slug: fields.businessId,
          uuid: sourceId,
          wheel_title: fields.wheelTitle,
          brand_id: brand._id,
          part_numbers: fields.partNumber,
          notes: fields.notes,
          good_pic_url: fields.imageUrl,
          image_source: fields.imageUrl ? "hubcaphaven.com" : undefined,
          specifications_json: fields.specificationsJson,
          text_brands: brandTitle,
          jnc_brands: brandTitle,
          text_diameters: fields.diameterText,
          text_widths: fields.widthText,
          text_offsets: fields.offsetText,
          text_colors: fields.colorText,
          text_vehicles: fields.textVehicles,
          updated_at: now,
        });
        wheelId = canonical._id;
      } else {
        wheelId = await ctx.db.insert("oem_wheels", {
          id: fields.businessId,
          slug: fields.businessId,
          uuid: sourceId,
          wheel_title: fields.wheelTitle,
          brand_id: brand._id,
          part_numbers: fields.partNumber,
          notes: fields.notes,
          good_pic_url: fields.imageUrl,
          image_source: fields.imageUrl ? "hubcaphaven.com" : undefined,
          specifications_json: fields.specificationsJson,
          text_brands: brandTitle,
          jnc_brands: brandTitle,
          text_diameters: fields.diameterText,
          text_widths: fields.widthText,
          text_offsets: fields.offsetText,
          text_colors: fields.colorText,
          text_vehicles: fields.textVehicles,
          created_at: now,
          updated_at: now,
        });
      }

      const wheel = (await ctx.db.get(wheelId)) as WheelDoc;
      await ensureWheelBrandLink(ctx, wheel, brand._id, brandTitle);

      if (fields.diameterText) {
        const values = vehicleDiameterCoverage.get(vehicle._id) ?? new Set<string>();
        values.add(fields.diameterText);
        vehicleDiameterCoverage.set(vehicle._id, values);
      }
      if (fields.widthText) {
        const values = vehicleWidthCoverage.get(vehicle._id) ?? new Set<string>();
        values.add(fields.widthText);
        vehicleWidthCoverage.set(vehicle._id, values);
      }

      const existingWheelVehicle = await ctx.db
        .query("j_wheel_vehicle")
        .withIndex("by_wheel_vehicle", (q: any) => q.eq("wheel_id", wheelId).eq("vehicle_id", vehicle._id))
        .first();
      if (!existingWheelVehicle) {
        await ctx.db.insert("j_wheel_vehicle", {
          wheel_id: wheelId,
          vehicle_id: vehicle._id,
          wheel_title: fields.wheelTitle,
          vehicle_title: vehicle.vehicle_title ?? vehicle.model_name ?? "",
        });
        wheelVehicleLinksCreated += 1;
      }

      const variantTitle = fields.partNumber ?? fields.wheelTitle;
      const wheelVariantId = await ensureWheelVariant(
        ctx,
        wheelId,
        fields.wheelTitle,
        fields.variantSlug,
        variantTitle,
        fields.partNumber,
        fields.notes,
        fields.imageUrl
      );

      await ensureWheelMeasurementRefs(ctx, wheelId, fields.wheelTitle, wheelVariantId, variantTitle, {
        diameterText: fields.diameterText,
        widthText: fields.widthText,
        offsetText: fields.offsetText,
        colorText: fields.colorText,
        partNumber: fields.partNumber,
      });

      const existingVehicleVariantWheelVariant = await ctx.db
        .query("j_oem_vehicle_variant_wheel_variant")
        .withIndex("by_oem_vehicle_variant_wheel_variant", (q: any) =>
          q.eq("vehicle_variant_id", vehicleVariantId).eq("wheel_variant_id", wheelVariantId)
        )
        .first();
      if (!existingVehicleVariantWheelVariant) {
        await ctx.db.insert("j_oem_vehicle_variant_wheel_variant", {
          vehicle_variant_id: vehicleVariantId,
          wheel_variant_id: wheelVariantId,
          variant_title: "All",
          wheel_variant_title: variantTitle,
        });
        vehicleVariantWheelVariantLinksCreated += 1;
      }

      wheelsPatched += 1;
      wheelVariantsPatched += 1;

      const duplicates = group.filter((row) => row._id !== canonical?._id);
      for (const duplicate of duplicates) {
        await deleteWheelBrandLinks(ctx, duplicate._id);
        await ctx.db.delete(duplicate._id);
        deleted += 1;
      }
    }

    for (const [vehicleSourceId, vehicle] of vehicleBySourceId.entries()) {
      const meta = VEHICLE_METADATA[vehicleSourceId];
      const diameters = [...(vehicleDiameterCoverage.get(vehicle._id) ?? new Set<string>())].sort().join(", ");
      const widths = [...(vehicleWidthCoverage.get(vehicle._id) ?? new Set<string>())].sort().join(", ");
      await ctx.db.patch(vehicle._id, {
        brand_id: brand._id,
        text_brands: brandTitle,
        text_diameters: diameters || undefined,
        text_widths: widths || undefined,
        ...(meta ?? {}),
        updated_at: now,
      });
    }

    return {
      commit,
      stats: {
        vehiclesPatched,
        vehicleVariantsPatched,
        wheelsPatched,
        wheelVariantsPatched,
        wheelVehicleLinksCreated,
        vehicleVariantWheelVariantLinksCreated,
        deleted,
      },
    };
  },
});
