import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type BrandDoc = Doc<"oem_brands">;
type VehicleDoc = Doc<"oem_vehicles">;
type WheelDoc = Doc<"oem_wheels">;

function splitCsvLike(value: string | undefined | null): string[] {
  return String(value || "")
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueSorted(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].sort();
}

function mergeCsvLike(...values: Array<string | undefined | null>): string | undefined {
  const merged = uniqueSorted(values.flatMap((value) => splitCsvLike(value)));
  return merged.length ? merged.join(", ") : undefined;
}

async function moveIndexedRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any,
  signatureKeys: string[],
  patch: Record<string, unknown> = {}
) {
  const sourceRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  const targetRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, toId))
    .collect();
  const targetSignatures = new Set(
    targetRows.map((row: any) => JSON.stringify(signatureKeys.map((key) => row[key] ?? null)))
  );

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    const signature = JSON.stringify(signatureKeys.map((key) => row[key] ?? null));
    if (targetSignatures.has(signature)) {
      await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    await ctx.db.patch(row._id, {
      [foreignField]: toId,
      ...patch,
    });
    targetSignatures.add(signature);
    moved += 1;
  }

  return { moved, deleted };
}

async function moveSavedRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any
) {
  const sourceRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  const targetRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, toId))
    .collect();
  const targetUsers = new Set(targetRows.map((row: any) => row.user_id));

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetUsers.has(row.user_id)) {
      await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    await ctx.db.patch(row._id, { [foreignField]: toId });
    targetUsers.add(row.user_id);
    moved += 1;
  }

  return { moved, deleted };
}

async function moveCommentRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any
) {
  const rows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  const now = new Date().toISOString();
  for (const row of rows) {
    await ctx.db.patch(row._id, { [foreignField]: toId, updated_at: now });
  }
  return rows.length;
}

async function moveRowsByIndex(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any,
  patch: Record<string, unknown> = {}
) {
  const rows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  for (const row of rows) {
    await ctx.db.patch(row._id, {
      [foreignField]: toId,
      ...patch,
    });
  }
  return rows.length;
}

async function moveRowsByScan(
  ctx: any,
  table: string,
  foreignField: string,
  fromId: any,
  toId: any,
  patch: Record<string, unknown> = {}
) {
  const rows = await ctx.db.query(table).collect();
  const matchingRows = rows.filter((row: any) => row[foreignField] === fromId);
  for (const row of matchingRows) {
    await ctx.db.patch(row._id, {
      [foreignField]: toId,
      ...patch,
    });
  }
  return matchingRows.length;
}

async function moveWheelVariants(
  ctx: any,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  canonicalTitle: string
) {
  const rows = await ctx.db
    .query("oem_wheel_variants")
    .withIndex("by_wheel_id", (q: any) => q.eq("wheel_id", fromWheelId))
    .collect();
  const now = new Date().toISOString();
  for (const row of rows) {
    await ctx.db.patch(row._id, {
      wheel_id: toWheelId,
      wheel_title: canonicalTitle,
      updated_at: now,
    });
  }
  return rows.length;
}

async function moveVehicleVariants(
  ctx: any,
  fromVehicleId: Id<"oem_vehicles">,
  toVehicleId: Id<"oem_vehicles">
) {
  const rows = await ctx.db
    .query("oem_vehicle_variants")
    .withIndex("by_vehicle_id", (q: any) => q.eq("vehicle_id", fromVehicleId))
    .collect();
  const now = new Date().toISOString();
  for (const row of rows) {
    await ctx.db.patch(row._id, {
      vehicle_id: toVehicleId,
      updated_at: now,
    });
  }
  return rows.length;
}

async function moveRegisteredVehicleWheels(
  ctx: any,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  canonicalTitle: string
) {
  const sourceRows = await ctx.db
    .query("j_registered_vehicle_wheel")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId))
    .collect();
  const targetRows = await ctx.db
    .query("j_registered_vehicle_wheel")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", toWheelId))
    .collect();
  const targetVehicleIds = new Set(targetRows.map((row: any) => row.registered_vehicle_id));

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetVehicleIds.has(row.registered_vehicle_id)) {
      await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    await ctx.db.patch(row._id, {
      wheel_id: toWheelId,
      wheel_title: canonicalTitle,
    });
    targetVehicleIds.add(row.registered_vehicle_id);
    moved += 1;
  }
  return { moved, deleted };
}

async function syncWheelBrandMirror(ctx: any, wheelId: Id<"oem_wheels">) {
  const wheelLinks = await ctx.db
    .query("j_wheel_brand")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", wheelId))
    .collect();
  if (wheelLinks.length === 0) {
    return;
  }

  const brands = await Promise.all(wheelLinks.map((link: any) => ctx.db.get(link.brand_id)));
  const joinedBrands = Array.from(
    new Set(
      wheelLinks
        .map((link: any, index: number) =>
          String(brands[index]?.brand_title ?? link.brand_title ?? "").trim()
        )
        .filter(Boolean)
    )
  ).join(", ");

  await ctx.db.patch(wheelId, {
    brand_id: wheelLinks[0].brand_id,
    jnc_brands: joinedBrands || undefined,
    updated_at: new Date().toISOString(),
  });
}

async function syncVehicleBrandMirror(ctx: any, vehicleId: Id<"oem_vehicles">) {
  const vehicleLinks = await ctx.db
    .query("j_vehicle_brand")
    .withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", vehicleId))
    .collect();
  if (vehicleLinks.length === 0) {
    return;
  }

  const brands = await Promise.all(vehicleLinks.map((link: any) => ctx.db.get(link.brand_id)));
  const joinedBrands = Array.from(
    new Set(
      vehicleLinks
        .map((link: any, index: number) =>
          String(brands[index]?.brand_title ?? link.brand_title ?? "").trim()
        )
        .filter(Boolean)
    )
  ).join(", ");

  await ctx.db.patch(vehicleId, {
    brand_id: vehicleLinks[0].brand_id,
    text_brands: joinedBrands || undefined,
    updated_at: new Date().toISOString(),
  });
}

function mergeBrandPatch(canonical: BrandDoc, duplicate: BrandDoc) {
  const patch: Record<string, unknown> = {};
  if (!canonical.slug && duplicate.slug) patch.slug = duplicate.slug;
  if (!canonical.id && duplicate.id) patch.id = duplicate.id;
  if (!canonical.brand_title && duplicate.brand_title) patch.brand_title = duplicate.brand_title;
  if (!canonical.brand_description && duplicate.brand_description) patch.brand_description = duplicate.brand_description;
  if (!canonical.brand_image_url && duplicate.brand_image_url) patch.brand_image_url = duplicate.brand_image_url;
  if (!canonical.brand_page && duplicate.brand_page) patch.brand_page = duplicate.brand_page;
  if (!canonical.subsidiaries && duplicate.subsidiaries) patch.subsidiaries = duplicate.subsidiaries;
  if (!canonical.good_pic_url && duplicate.good_pic_url) patch.good_pic_url = duplicate.good_pic_url;
  if (!canonical.bad_pic_url && duplicate.bad_pic_url) patch.bad_pic_url = duplicate.bad_pic_url;
  if (!canonical.country_of_origin && duplicate.country_of_origin) patch.country_of_origin = duplicate.country_of_origin;
  if (!canonical.founded_year && duplicate.founded_year) patch.founded_year = duplicate.founded_year;
  if (!canonical.wheel_count && duplicate.wheel_count) patch.wheel_count = duplicate.wheel_count;
  return patch;
}

function mergeVehiclePatch(canonical: VehicleDoc, duplicate: VehicleDoc) {
  const patch: Record<string, unknown> = {};
  const textBrands = mergeCsvLike(canonical.text_brands, duplicate.text_brands);
  const widths = mergeCsvLike(canonical.text_widths, duplicate.text_widths);
  const diameters = mergeCsvLike(canonical.text_diameters, duplicate.text_diameters);
  const boltPatterns = mergeCsvLike(canonical.text_bolt_patterns, duplicate.text_bolt_patterns);
  const centerBores = mergeCsvLike(canonical.text_center_bores, duplicate.text_center_bores);

  if (!canonical.slug && duplicate.slug) patch.slug = duplicate.slug;
  if (!canonical.id && duplicate.id) patch.id = duplicate.id;
  if (!canonical.vehicle_title && duplicate.vehicle_title) patch.vehicle_title = duplicate.vehicle_title;
  if (!canonical.model_name && duplicate.model_name) patch.model_name = duplicate.model_name;
  if (!canonical.generation && duplicate.generation) patch.generation = duplicate.generation;
  if (!canonical.body_type && duplicate.body_type) patch.body_type = duplicate.body_type;
  if (!canonical.platform && duplicate.platform) patch.platform = duplicate.platform;
  if (!canonical.drive_type && duplicate.drive_type) patch.drive_type = duplicate.drive_type;
  if (!canonical.segment && duplicate.segment) patch.segment = duplicate.segment;
  if (!canonical.engine_details && duplicate.engine_details) patch.engine_details = duplicate.engine_details;
  if (!canonical.price_range && duplicate.price_range) patch.price_range = duplicate.price_range;
  if (!canonical.special_notes && duplicate.special_notes) patch.special_notes = duplicate.special_notes;
  if (!canonical.production_years && duplicate.production_years) patch.production_years = duplicate.production_years;
  if (!canonical.year_from && duplicate.year_from) patch.year_from = duplicate.year_from;
  if (!canonical.year_to && duplicate.year_to) patch.year_to = duplicate.year_to;
  if (!canonical.production_stats && duplicate.production_stats) patch.production_stats = duplicate.production_stats;
  if (!canonical.good_pic_url && duplicate.good_pic_url) patch.good_pic_url = duplicate.good_pic_url;
  if (!canonical.bad_pic_url && duplicate.bad_pic_url) patch.bad_pic_url = duplicate.bad_pic_url;
  if (!canonical.vehicle_image && duplicate.vehicle_image) patch.vehicle_image = duplicate.vehicle_image;
  if (!canonical.wheelbase_mm && duplicate.wheelbase_mm) patch.wheelbase_mm = duplicate.wheelbase_mm;
  if (!canonical.platform_code && duplicate.platform_code) patch.platform_code = duplicate.platform_code;
  if (!canonical.brand_id && duplicate.brand_id) patch.brand_id = duplicate.brand_id;
  if (textBrands && textBrands !== canonical.text_brands) patch.text_brands = textBrands;
  if (widths && widths !== canonical.text_widths) patch.text_widths = widths;
  if (diameters && diameters !== canonical.text_diameters) patch.text_diameters = diameters;
  if (boltPatterns && boltPatterns !== canonical.text_bolt_patterns) patch.text_bolt_patterns = boltPatterns;
  if (centerBores && centerBores !== canonical.text_center_bores) patch.text_center_bores = centerBores;
  return patch;
}

function mergeWheelPatch(canonical: WheelDoc, duplicate: WheelDoc) {
  const patch: Record<string, unknown> = {};
  const partNumbers = mergeCsvLike(canonical.part_numbers, duplicate.part_numbers);
  const boltPatterns = mergeCsvLike(canonical.text_bolt_patterns, duplicate.text_bolt_patterns);
  const centerBores = mergeCsvLike(canonical.text_center_bores, duplicate.text_center_bores);
  const diameters = mergeCsvLike(canonical.text_diameters, duplicate.text_diameters);
  const widths = mergeCsvLike(canonical.text_widths, duplicate.text_widths);
  const colors = mergeCsvLike(canonical.text_colors, duplicate.text_colors);
  const offsets = mergeCsvLike(canonical.text_offsets, duplicate.text_offsets);
  const tireSizes = mergeCsvLike(canonical.text_tire_sizes, duplicate.text_tire_sizes);
  const vehicles = mergeCsvLike(canonical.text_vehicles, duplicate.text_vehicles);
  const brands = mergeCsvLike(canonical.jnc_brands, duplicate.jnc_brands);
  const brandText = mergeCsvLike(canonical.text_brands, duplicate.text_brands);
  const notes = mergeCsvLike(canonical.notes, duplicate.notes);

  if (!canonical.slug && duplicate.slug) patch.slug = duplicate.slug;
  if (!canonical.id && duplicate.id) patch.id = duplicate.id;
  if (!canonical.wheel_title && duplicate.wheel_title) patch.wheel_title = duplicate.wheel_title;
  if (!canonical.weight && duplicate.weight) patch.weight = duplicate.weight;
  if (!canonical.spoke_count && duplicate.spoke_count) patch.spoke_count = duplicate.spoke_count;
  if (!canonical.load_rating && duplicate.load_rating) patch.load_rating = duplicate.load_rating;
  if (partNumbers && partNumbers !== canonical.part_numbers) patch.part_numbers = partNumbers;
  if (boltPatterns && boltPatterns !== canonical.text_bolt_patterns) patch.text_bolt_patterns = boltPatterns;
  if (centerBores && centerBores !== canonical.text_center_bores) patch.text_center_bores = centerBores;
  if (diameters && diameters !== canonical.text_diameters) patch.text_diameters = diameters;
  if (widths && widths !== canonical.text_widths) patch.text_widths = widths;
  if (colors && colors !== canonical.text_colors) patch.text_colors = colors;
  if (offsets && offsets !== canonical.text_offsets) patch.text_offsets = offsets;
  if (tireSizes && tireSizes !== canonical.text_tire_sizes) patch.text_tire_sizes = tireSizes;
  if (vehicles && vehicles !== canonical.text_vehicles) patch.text_vehicles = vehicles;
  if (brands && brands !== canonical.jnc_brands) patch.jnc_brands = brands;
  if (brandText && brandText !== canonical.text_brands) patch.text_brands = brandText;
  if (!canonical.good_pic_url && duplicate.good_pic_url) patch.good_pic_url = duplicate.good_pic_url;
  if (!canonical.bad_pic_url && duplicate.bad_pic_url) patch.bad_pic_url = duplicate.bad_pic_url;
  if (!canonical.image_source && duplicate.image_source) patch.image_source = duplicate.image_source;
  if (!canonical.style_number && duplicate.style_number) patch.style_number = duplicate.style_number;
  if (!canonical.brand_id && duplicate.brand_id) patch.brand_id = duplicate.brand_id;
  if (!canonical.notes && notes) patch.notes = notes;
  return patch;
}

export const mergeBrands = mutation({
  args: {
    canonicalId: v.id("oem_brands"),
    duplicateIds: v.array(v.id("oem_brands")),
  },
  handler: async (ctx, args) => {
    const duplicateIds = [...new Set(args.duplicateIds)].filter((id) => id !== args.canonicalId);
    if (duplicateIds.length === 0) {
      throw new Error("Select at least two brands to merge.");
    }

    let canonical = await ctx.db.get(args.canonicalId);
    if (!canonical) {
      throw new Error("Canonical brand not found.");
    }

    const now = new Date().toISOString();
    const mergedIds: string[] = [];

    for (const duplicateId of duplicateIds) {
      const duplicate = await ctx.db.get(duplicateId);
      if (!duplicate) {
        continue;
      }

      const patch = mergeBrandPatch(canonical, duplicate);
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(canonical._id, { ...patch, updated_at: now });
      }

      canonical = (await ctx.db.get(args.canonicalId)) ?? canonical;
      const canonicalTitle = String(canonical.brand_title ?? duplicate.brand_title ?? "").trim();

      await moveIndexedRows(
        ctx,
        "j_vehicle_brand",
        "by_brand",
        "brand_id",
        duplicate._id,
        canonical._id,
        ["vehicle_id"],
        { brand_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_brand",
        "by_brand",
        "brand_id",
        duplicate._id,
        canonical._id,
        ["wheel_id"],
        { brand_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_engine_brand",
        "by_brand",
        "brand_id",
        duplicate._id,
        canonical._id,
        ["engine_id"],
        { brand_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_oem_vehicle_variant_brand",
        "by_brand",
        "brand_id",
        duplicate._id,
        canonical._id,
        ["variant_id"],
        { brand_title: canonicalTitle }
      );

      await moveSavedRows(ctx, "saved_brands", "by_brand", "brand_id", duplicate._id, canonical._id);
      await moveCommentRows(ctx, "brand_comments", "by_brand", "brand_id", duplicate._id, canonical._id);
      await moveRowsByScan(ctx, "oem_vehicles", "brand_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByScan(ctx, "oem_wheels", "brand_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByScan(ctx, "oem_engines", "brand_id", duplicate._id, canonical._id);
      await moveRowsByScan(ctx, "user_registered_vehicles", "brand_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByIndex(ctx, "market_listings", "by_brand", "brand_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByScan(ctx, "oem_file_storage", "brand_id", duplicate._id, canonical._id);

      await ctx.db.delete(duplicate._id);
      mergedIds.push(String(duplicate.id ?? duplicate._id));
    }

    const vehicleLinks = await ctx.db
      .query("j_vehicle_brand")
      .withIndex("by_brand", (q: any) => q.eq("brand_id", args.canonicalId))
      .collect();
    const wheelLinks = await ctx.db
      .query("j_wheel_brand")
      .withIndex("by_brand", (q: any) => q.eq("brand_id", args.canonicalId))
      .collect();
    const uniqueVehicleIds = [...new Set(vehicleLinks.map((row: any) => row.vehicle_id))];
    const uniqueWheelIds = [...new Set(wheelLinks.map((row: any) => row.wheel_id))];

    for (const vehicleId of uniqueVehicleIds) {
      await syncVehicleBrandMirror(ctx, vehicleId);
    }
    for (const wheelId of uniqueWheelIds) {
      await syncWheelBrandMirror(ctx, wheelId);
    }

    return {
      canonicalId: args.canonicalId,
      mergedCount: mergedIds.length,
      mergedIds,
    };
  },
});

export const mergeVehicles = mutation({
  args: {
    canonicalId: v.id("oem_vehicles"),
    duplicateIds: v.array(v.id("oem_vehicles")),
  },
  handler: async (ctx, args) => {
    const duplicateIds = [...new Set(args.duplicateIds)].filter((id) => id !== args.canonicalId);
    if (duplicateIds.length === 0) {
      throw new Error("Select at least two vehicles to merge.");
    }

    let canonical = await ctx.db.get(args.canonicalId);
    if (!canonical) {
      throw new Error("Canonical vehicle not found.");
    }

    const now = new Date().toISOString();
    const mergedIds: string[] = [];

    for (const duplicateId of duplicateIds) {
      const duplicate = await ctx.db.get(duplicateId);
      if (!duplicate) {
        continue;
      }

      const patch = mergeVehiclePatch(canonical, duplicate);
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(canonical._id, { ...patch, updated_at: now });
      }

      canonical = (await ctx.db.get(args.canonicalId)) ?? canonical;
      const canonicalTitle = String(canonical.vehicle_title ?? canonical.model_name ?? duplicate.vehicle_title ?? "").trim();

      await moveVehicleVariants(ctx, duplicate._id, canonical._id);
      await moveIndexedRows(
        ctx,
        "j_vehicle_brand",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["brand_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_engine",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["engine_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_body_style",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["body_style_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_drive_type",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["drive_type_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_market",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["market_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_vehicle",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["wheel_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_bolt_pattern",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["bolt_pattern_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_center_bore",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["center_bore_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_diameter",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["diameter_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_width",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["width_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_offset",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["offset_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_tire_size",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["tire_size_id"],
        { vehicle_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_vehicle_part_number",
        "by_vehicle",
        "vehicle_id",
        duplicate._id,
        canonical._id,
        ["part_number_id"],
        { vehicle_title: canonicalTitle }
      );

      await moveSavedRows(ctx, "saved_vehicles", "by_vehicle", "vehicle_id", duplicate._id, canonical._id);
      await moveCommentRows(ctx, "vehicle_comments", "by_vehicle", "vehicle_id", duplicate._id, canonical._id);
      await moveRowsByIndex(
        ctx,
        "user_registered_vehicles",
        "by_linked_vehicle",
        "linked_oem_vehicle_id",
        duplicate._id,
        canonical._id,
        { updated_at: now }
      );
      await moveRowsByIndex(ctx, "market_listings", "by_vehicle", "vehicle_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByScan(ctx, "oem_file_storage", "vehicle_id", duplicate._id, canonical._id);

      await ctx.db.delete(duplicate._id);
      mergedIds.push(String(duplicate.id ?? duplicate._id));
    }

    await syncVehicleBrandMirror(ctx, args.canonicalId);

    return {
      canonicalId: args.canonicalId,
      mergedCount: mergedIds.length,
      mergedIds,
    };
  },
});

export const mergeWheels = mutation({
  args: {
    canonicalId: v.id("oem_wheels"),
    duplicateIds: v.array(v.id("oem_wheels")),
  },
  handler: async (ctx, args) => {
    const duplicateIds = [...new Set(args.duplicateIds)].filter((id) => id !== args.canonicalId);
    if (duplicateIds.length === 0) {
      throw new Error("Select at least two wheels to merge.");
    }

    let canonical = await ctx.db.get(args.canonicalId);
    if (!canonical) {
      throw new Error("Canonical wheel not found.");
    }

    const now = new Date().toISOString();
    const mergedIds: string[] = [];

    for (const duplicateId of duplicateIds) {
      const duplicate = await ctx.db.get(duplicateId);
      if (!duplicate) {
        continue;
      }

      const patch = mergeWheelPatch(canonical, duplicate);
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(canonical._id, { ...patch, updated_at: now });
      }

      canonical = (await ctx.db.get(args.canonicalId)) ?? canonical;
      const canonicalTitle = String(canonical.wheel_title ?? duplicate.wheel_title ?? "").trim();

      await moveWheelVariants(ctx, duplicate._id, canonical._id, canonicalTitle);
      await moveIndexedRows(
        ctx,
        "j_wheel_brand",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["brand_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_vehicle",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["vehicle_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_market",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["market_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_bolt_pattern",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["bolt_pattern_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_center_bore",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["center_bore_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_diameter",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["diameter_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_width",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["width_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_offset",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["offset_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_color",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["color_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_tire_size",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["tire_size_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_part_number",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["part_number_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_material",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["material_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_finish_type",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["finish_type_id"],
        { wheel_title: canonicalTitle }
      );
      await moveIndexedRows(
        ctx,
        "j_wheel_design_style",
        "by_wheel",
        "wheel_id",
        duplicate._id,
        canonical._id,
        ["design_style_id"],
        { wheel_title: canonicalTitle }
      );

      await moveSavedRows(ctx, "saved_wheels", "by_wheel", "wheel_id", duplicate._id, canonical._id);
      await moveCommentRows(ctx, "wheel_comments", "by_wheel", "wheel_id", duplicate._id, canonical._id);
      await moveRegisteredVehicleWheels(ctx, duplicate._id, canonical._id, canonicalTitle);
      await moveRowsByIndex(ctx, "market_listings", "by_wheel", "wheel_id", duplicate._id, canonical._id, { updated_at: now });
      await moveRowsByScan(ctx, "oem_file_storage", "wheel_id", duplicate._id, canonical._id);

      await ctx.db.delete(duplicate._id);
      mergedIds.push(String(duplicate.id ?? duplicate._id));
    }

    await syncWheelBrandMirror(ctx, args.canonicalId);

    return {
      canonicalId: args.canonicalId,
      mergedCount: mergedIds.length,
      mergedIds,
    };
  },
});
