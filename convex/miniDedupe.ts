import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type WheelDoc = Doc<"oem_wheels">;
function splitCsvLike(value: string | undefined | null): string[] {
  return String(value || "")
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitPartNumbers(value: string | undefined | null): string[] {
  return splitCsvLike(value).filter((part) => /^36[0-9A-Z]+$/i.test(part));
}

function uniqueSorted(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].sort();
}

function mergeCsvLike(...values: Array<string | undefined | null>): string | undefined {
  const merged = uniqueSorted(values.flatMap((value) => splitCsvLike(value)));
  return merged.length ? merged.join(", ") : undefined;
}

function normalizeTitleCore(value: string | undefined | null): string {
  return String(value || "")
    .replace(/\([^)]*\)\s*$/g, "")
    .replace(/\bwheels?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function simplifyWheelId(value: string | undefined | null): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-wheels(?:-wheels)+$/g, "-wheels")
    .replace(
      /-(silver|black|grey|gray|white|chrome|jet-black|midnight-black|frozen-black|gloss-black)(?=-wheels$)/g,
      ""
    );
}

function isHashedWheelId(value: string | undefined | null): boolean {
  return /^[a-f0-9]{32}$/i.test(String(value || "").trim());
}

function isBmwMiniWheelId(value: string | undefined | null): boolean {
  return String(value || "").startsWith("bmw_mini-");
}

function isSuffixShadowWheelId(value: string | undefined | null): boolean {
  return /-wheels-wheels$/.test(String(value || ""));
}

function isShadowWheelId(value: string | undefined | null): boolean {
  return isHashedWheelId(value) || isBmwMiniWheelId(value) || isSuffixShadowWheelId(value);
}

function partNumberOverlap(a: WheelDoc, b: WheelDoc): number {
  const aSet = new Set(splitPartNumbers(a.part_numbers));
  return splitPartNumbers(b.part_numbers).filter((partNumber) => aSet.has(partNumber)).length;
}

function wheelScore(
  wheel: WheelDoc,
  counts: {
    variantCountByWheelId: Map<Id<"oem_wheels">, number>;
    vehicleLinkCountByWheelId: Map<Id<"oem_wheels">, number>;
  }
): number {
  const businessId = String(wheel.id || "");
  let score = 0;
  if (!isShadowWheelId(businessId)) score += 1000;
  if (!isHashedWheelId(businessId)) score += 200;
  if (!isBmwMiniWheelId(businessId)) score += 100;
  if (!isSuffixShadowWheelId(businessId)) score += 50;
  if (!/\([^)]*\)\s*$/.test(String(wheel.wheel_title || ""))) score += 25;
  if ((wheel.good_pic_url || "").trim()) score += 10;
  score += (counts.variantCountByWheelId.get(wheel._id) || 0) * 100;
  score += (counts.vehicleLinkCountByWheelId.get(wheel._id) || 0) * 10;
  return score;
}

type Plan = {
  kind: "exact_business_id" | "suffix_shadow" | "hashed_shadow" | "bmw_shadow";
  canonicalWheelId: Id<"oem_wheels">;
  canonicalBusinessId: string;
  duplicateWheelId: Id<"oem_wheels">;
  duplicateBusinessId: string;
  duplicateTitle: string;
};

async function moveIndexedWheelRows(
  ctx: any,
  table: string,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  canonicalTitle: string,
  signatureKeys: string[],
  titleField = "wheel_title"
) {
  const sourceRows = await ctx.db.query(table).withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId)).collect();
  const targetRows = await ctx.db.query(table).withIndex("by_wheel", (q: any) => q.eq("wheel_id", toWheelId)).collect();
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
    const patch: Record<string, unknown> = { wheel_id: toWheelId };
    if (titleField in row) patch[titleField] = canonicalTitle;
    await ctx.db.patch(row._id, patch);
    targetSignatures.add(signature);
    moved += 1;
  }
  return { moved, deleted };
}

async function moveSavedWheels(ctx: any, fromWheelId: Id<"oem_wheels">, toWheelId: Id<"oem_wheels">) {
  const sourceRows = await ctx.db.query("saved_wheels").withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId)).collect();
  const targetRows = await ctx.db.query("saved_wheels").withIndex("by_wheel", (q: any) => q.eq("wheel_id", toWheelId)).collect();
  const targetUsers = new Set(targetRows.map((row: any) => row.user_id));
  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetUsers.has(row.user_id)) {
      await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    await ctx.db.patch(row._id, { wheel_id: toWheelId });
    targetUsers.add(row.user_id);
    moved += 1;
  }
  return { moved, deleted };
}

async function moveWheelComments(ctx: any, fromWheelId: Id<"oem_wheels">, toWheelId: Id<"oem_wheels">) {
  const rows = await ctx.db.query("wheel_comments").withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId)).collect();
  for (const row of rows) {
    await ctx.db.patch(row._id, { wheel_id: toWheelId, updated_at: new Date().toISOString() });
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
  const targetIds = new Set(targetRows.map((row: any) => row.registered_vehicle_id));
  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetIds.has(row.registered_vehicle_id)) {
      await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    await ctx.db.patch(row._id, { wheel_id: toWheelId, wheel_title: canonicalTitle });
    targetIds.add(row.registered_vehicle_id);
    moved += 1;
  }
  return { moved, deleted };
}

async function moveWheelVariants(
  ctx: any,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  canonicalTitle: string
) {
  const sourceRows = await ctx.db
    .query("oem_wheel_variants")
    .withIndex("by_wheel_id", (q: any) => q.eq("wheel_id", fromWheelId))
    .collect();
  for (const row of sourceRows) {
    await ctx.db.patch(row._id, {
      wheel_id: toWheelId,
      wheel_title: canonicalTitle,
      updated_at: new Date().toISOString(),
    });
  }
  return sourceRows.length;
}

async function moveOptionalWheelRefs(
  ctx: any,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  prefetchedFileRows: Array<any>
) {
  const marketListings = await ctx.db
    .query("market_listings")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId))
    .collect();
  for (const row of marketListings) {
    await ctx.db.patch(row._id, { wheel_id: toWheelId, updated_at: new Date().toISOString() });
  }

  const fileRows = prefetchedFileRows.filter((row: any) => row.wheel_id === fromWheelId);
  for (const row of fileRows) {
    await ctx.db.patch(row._id, { wheel_id: toWheelId });
  }
  return { marketListings: marketListings.length, fileRows: fileRows.length };
}

function mergeWheelPatch(canonical: WheelDoc, duplicate: WheelDoc) {
  const patch: Record<string, string> = {};
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
  if (!canonical.notes && notes) patch.notes = notes;
  return patch;
}

export const dedupeMiniWheelShadows = mutation({
  args: {
    commit: v.optional(v.boolean()),
    maxDeletes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const commit = args.commit ?? false;
    const maxDeletes = Math.max(1, Math.min(args.maxDeletes ?? 100, 500));

    const [brands, wheelBrandLinks, wheels, wheelVariants, wheelVehicleLinks, fileRows] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("j_wheel_brand").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_wheel_variants").collect(),
      ctx.db.query("j_wheel_vehicle").collect(),
      ctx.db.query("oem_file_storage").collect(),
    ]);

    const miniBrand = brands.find((brand) => String(brand.brand_title || "").toLowerCase() === "mini");
    if (!miniBrand) throw new Error("Mini brand not found");

    const miniWheelIds = new Set(
      wheelBrandLinks.filter((row) => row.brand_id === miniBrand._id).map((row) => row.wheel_id)
    );
    const miniWheels = wheels.filter((wheel) => miniWheelIds.has(wheel._id));

    const variantCountByWheelId = new Map<Id<"oem_wheels">, number>();
    for (const row of wheelVariants) {
      variantCountByWheelId.set(row.wheel_id, (variantCountByWheelId.get(row.wheel_id) || 0) + 1);
    }
    const vehicleLinkCountByWheelId = new Map<Id<"oem_wheels">, number>();
    for (const row of wheelVehicleLinks) {
      vehicleLinkCountByWheelId.set(row.wheel_id, (vehicleLinkCountByWheelId.get(row.wheel_id) || 0) + 1);
    }
    const counts = { variantCountByWheelId, vehicleLinkCountByWheelId };

    const nonShadowMiniWheels = miniWheels.filter((wheel) => !isShadowWheelId(wheel.id));
    const plans: Plan[] = [];
    const plannedDuplicateIds = new Set<Id<"oem_wheels">>();

    const exactGroups = new Map<string, WheelDoc[]>();
    for (const wheel of miniWheels) {
      const key = String(wheel.id || "").trim();
      if (!key) continue;
      const group = exactGroups.get(key) || [];
      group.push(wheel);
      exactGroups.set(key, group);
    }
    for (const [businessId, group] of exactGroups.entries()) {
      if (group.length < 2) continue;
      const ranked = [...group].sort((a, b) => wheelScore(b, counts) - wheelScore(a, counts));
      const canonical = ranked[0];
      for (const duplicate of ranked.slice(1)) {
        plans.push({
          kind: "exact_business_id",
          canonicalWheelId: canonical._id,
          canonicalBusinessId: String(canonical.id || canonical._id),
          duplicateWheelId: duplicate._id,
          duplicateBusinessId: String(duplicate.id || duplicate._id),
          duplicateTitle: String(duplicate.wheel_title || ""),
        });
        plannedDuplicateIds.add(duplicate._id);
      }
    }

    const wheelByBusinessId = new Map(miniWheels.map((wheel) => [String(wheel.id || ""), wheel]));
    for (const duplicate of miniWheels) {
      if (plannedDuplicateIds.has(duplicate._id)) continue;
      if (!isSuffixShadowWheelId(duplicate.id)) continue;
      const baseBusinessId = String(duplicate.id).replace(/-wheels$/, "");
      const canonical = wheelByBusinessId.get(baseBusinessId);
      if (!canonical || canonical._id === duplicate._id) continue;
      if (partNumberOverlap(canonical, duplicate) === 0 && normalizeTitleCore(canonical.wheel_title) !== normalizeTitleCore(duplicate.wheel_title)) {
        continue;
      }
      plans.push({
        kind: "suffix_shadow",
        canonicalWheelId: canonical._id,
        canonicalBusinessId: String(canonical.id || canonical._id),
        duplicateWheelId: duplicate._id,
        duplicateBusinessId: String(duplicate.id || duplicate._id),
        duplicateTitle: String(duplicate.wheel_title || ""),
      });
      plannedDuplicateIds.add(duplicate._id);
    }

    for (const duplicate of miniWheels) {
      if (plannedDuplicateIds.has(duplicate._id)) continue;
      const kind = isHashedWheelId(duplicate.id)
        ? "hashed_shadow"
        : isBmwMiniWheelId(duplicate.id)
          ? "bmw_shadow"
          : null;
      if (!kind) continue;

      const titleCore = normalizeTitleCore(duplicate.wheel_title);
      const candidates = nonShadowMiniWheels
        .filter((wheel) => wheel._id !== duplicate._id)
        .filter((wheel) => normalizeTitleCore(wheel.wheel_title) === titleCore)
        .map((wheel) => ({ wheel, overlap: partNumberOverlap(wheel, duplicate), score: wheelScore(wheel, counts) }))
        .filter((row) => row.overlap > 0)
        .sort((a, b) => b.score - a.score || b.overlap - a.overlap);

      if (candidates.length === 0) continue;
      if (candidates.length > 1 && candidates[0].score === candidates[1].score && candidates[0].overlap === candidates[1].overlap) {
        continue;
      }
      const canonical = candidates[0].wheel;
      plans.push({
        kind,
        canonicalWheelId: canonical._id,
        canonicalBusinessId: String(canonical.id || canonical._id),
        duplicateWheelId: duplicate._id,
        duplicateBusinessId: String(duplicate.id || duplicate._id),
        duplicateTitle: String(duplicate.wheel_title || ""),
      });
      plannedDuplicateIds.add(duplicate._id);
    }

    const selectedPlans = plans.slice(0, maxDeletes);
    const stats = {
      planned: plans.length,
      selected: selectedPlans.length,
      deleted: 0,
      variantsMoved: 0,
      commentsMoved: 0,
      marketListingsMoved: 0,
      fileRowsMoved: 0,
      byKind: {
        exact_business_id: selectedPlans.filter((plan) => plan.kind === "exact_business_id").length,
        suffix_shadow: selectedPlans.filter((plan) => plan.kind === "suffix_shadow").length,
        hashed_shadow: selectedPlans.filter((plan) => plan.kind === "hashed_shadow").length,
        bmw_shadow: selectedPlans.filter((plan) => plan.kind === "bmw_shadow").length,
      },
      deletedIds: [] as string[],
    };

    if (!commit) {
      return {
        commit,
        stats,
        sample: selectedPlans.slice(0, 25),
      };
    }

    for (const plan of selectedPlans) {
      const canonical = await ctx.db.get(plan.canonicalWheelId);
      const duplicate = await ctx.db.get(plan.duplicateWheelId);
      if (!canonical || !duplicate) continue;

      const patch = mergeWheelPatch(canonical, duplicate);
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(canonical._id, {
          ...patch,
          updated_at: new Date().toISOString(),
        });
      }

      stats.variantsMoved += await moveWheelVariants(ctx, duplicate._id, canonical._id, canonical.wheel_title || "");

      await moveIndexedWheelRows(ctx, "j_wheel_brand", duplicate._id, canonical._id, canonical.wheel_title || "", ["brand_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_vehicle", duplicate._id, canonical._id, canonical.wheel_title || "", ["vehicle_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_market", duplicate._id, canonical._id, canonical.wheel_title || "", ["market_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_bolt_pattern", duplicate._id, canonical._id, canonical.wheel_title || "", ["bolt_pattern_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_center_bore", duplicate._id, canonical._id, canonical.wheel_title || "", ["center_bore_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_diameter", duplicate._id, canonical._id, canonical.wheel_title || "", ["diameter_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_width", duplicate._id, canonical._id, canonical.wheel_title || "", ["width_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_offset", duplicate._id, canonical._id, canonical.wheel_title || "", ["offset_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_color", duplicate._id, canonical._id, canonical.wheel_title || "", ["color_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_tire_size", duplicate._id, canonical._id, canonical.wheel_title || "", ["tire_size_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_part_number", duplicate._id, canonical._id, canonical.wheel_title || "", ["part_number_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_material", duplicate._id, canonical._id, canonical.wheel_title || "", ["material_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_finish_type", duplicate._id, canonical._id, canonical.wheel_title || "", ["finish_type_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_design_style", duplicate._id, canonical._id, canonical.wheel_title || "", ["design_style_id"]);
      await moveSavedWheels(ctx, duplicate._id, canonical._id);
      stats.commentsMoved += await moveWheelComments(ctx, duplicate._id, canonical._id);
      await moveRegisteredVehicleWheels(ctx, duplicate._id, canonical._id, canonical.wheel_title || "");
      const optionalMoves = await moveOptionalWheelRefs(ctx, duplicate._id, canonical._id, fileRows);
      stats.marketListingsMoved += optionalMoves.marketListings;
      stats.fileRowsMoved += optionalMoves.fileRows;

      await ctx.db.delete(duplicate._id);
      stats.deleted += 1;
      stats.deletedIds.push(plan.duplicateBusinessId);
    }

    return {
      commit,
      stats,
      sample: selectedPlans.slice(0, 25),
    };
  },
});

export const promoteMiniOrphanCanonicals = mutation({
  args: {
    commit: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const commit = args.commit ?? false;

    const [brands, wheelBrandLinks, wheels, fileRows] = await Promise.all([
      ctx.db.query("oem_brands").collect(),
      ctx.db.query("j_wheel_brand").collect(),
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_file_storage").collect(),
    ]);

    const miniBrand = brands.find((brand) => String(brand.brand_title || "").toLowerCase() === "mini");
    if (!miniBrand) throw new Error("Mini brand not found");

    const miniWheelIds = new Set(
      wheelBrandLinks.filter((row) => row.brand_id === miniBrand._id).map((row) => row.wheel_id)
    );
    const miniWheels = wheels.filter((wheel) => miniWheelIds.has(wheel._id));
    const wheelByBusinessId = new Map(miniWheels.map((wheel) => [String(wheel.id || ""), wheel]));

    const renames = [
      {
        fromBusinessId: "30a84117a0acbbe7de76f11a3f21a482",
        duplicateBusinessId: "bmw_mini-36116778428",
        toBusinessId: "mini-r105-crown-spoke-wheels",
      },
      {
        fromBusinessId: "e619f31e08c0e20b151c39b399bfc40a",
        duplicateBusinessId: "bmw_mini-36116850503",
        toBusinessId: "mini-r131-double-cross-wheels",
      },
      {
        fromBusinessId: "8102772fc8ae67ab77b934dce6948cee",
        duplicateBusinessId: "bmw_mini-36116795208",
        toBusinessId: "mini-r112-wheels",
      },
      {
        fromBusinessId: "8db2dca3aff83af83c0e6015e0e5d772",
        duplicateBusinessId: "bmw_mini-36116784130",
        toBusinessId: "mini-r113-wheels",
      },
      {
        fromBusinessId: "14eeadb2ea014c1dfa1283d0f447b427",
        duplicateBusinessId: "bmw_mini-36116856220",
        toBusinessId: "mini-r136-wheels",
      },
      {
        fromBusinessId: "mini-r107-gp-wheels-wheels",
        duplicateBusinessId: null,
        toBusinessId: "mini-r107-gp-wheels",
      },
    ];

    const sample = renames.map((rename) => ({
      fromBusinessId: rename.fromBusinessId,
      duplicateBusinessId: rename.duplicateBusinessId,
      toBusinessId: rename.toBusinessId,
      exists: wheelByBusinessId.has(rename.fromBusinessId),
    }));

    if (!commit) {
      return { commit, sample };
    }

    let deleted = 0;
    let renamed = 0;
    let commentsMoved = 0;
    let variantsMoved = 0;
    let marketListingsMoved = 0;
    let fileRowsMoved = 0;

    for (const rename of renames) {
      const canonical = wheelByBusinessId.get(rename.fromBusinessId);
      if (!canonical) continue;

      const conflicting = wheelByBusinessId.get(rename.toBusinessId);
      if (conflicting && conflicting._id !== canonical._id) {
        throw new Error(`Target business id already exists: ${rename.toBusinessId}`);
      }

      await ctx.db.patch(canonical._id, {
        id: rename.toBusinessId,
        slug: rename.toBusinessId,
        updated_at: new Date().toISOString(),
      });
      wheelByBusinessId.delete(rename.fromBusinessId);
      wheelByBusinessId.set(rename.toBusinessId, {
        ...canonical,
        id: rename.toBusinessId,
        slug: rename.toBusinessId,
      });
      renamed += 1;

      if (!rename.duplicateBusinessId) continue;
      const duplicate = wheelByBusinessId.get(rename.duplicateBusinessId);
      if (!duplicate) continue;

      const patch = mergeWheelPatch(canonical, duplicate);
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(canonical._id, {
          ...patch,
          updated_at: new Date().toISOString(),
        });
      }

      variantsMoved += await moveWheelVariants(ctx, duplicate._id, canonical._id, canonical.wheel_title || "");
      await moveIndexedWheelRows(ctx, "j_wheel_brand", duplicate._id, canonical._id, canonical.wheel_title || "", ["brand_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_vehicle", duplicate._id, canonical._id, canonical.wheel_title || "", ["vehicle_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_market", duplicate._id, canonical._id, canonical.wheel_title || "", ["market_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_bolt_pattern", duplicate._id, canonical._id, canonical.wheel_title || "", ["bolt_pattern_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_center_bore", duplicate._id, canonical._id, canonical.wheel_title || "", ["center_bore_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_diameter", duplicate._id, canonical._id, canonical.wheel_title || "", ["diameter_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_width", duplicate._id, canonical._id, canonical.wheel_title || "", ["width_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_offset", duplicate._id, canonical._id, canonical.wheel_title || "", ["offset_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_color", duplicate._id, canonical._id, canonical.wheel_title || "", ["color_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_tire_size", duplicate._id, canonical._id, canonical.wheel_title || "", ["tire_size_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_part_number", duplicate._id, canonical._id, canonical.wheel_title || "", ["part_number_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_material", duplicate._id, canonical._id, canonical.wheel_title || "", ["material_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_finish_type", duplicate._id, canonical._id, canonical.wheel_title || "", ["finish_type_id"]);
      await moveIndexedWheelRows(ctx, "j_wheel_design_style", duplicate._id, canonical._id, canonical.wheel_title || "", ["design_style_id"]);
      await moveSavedWheels(ctx, duplicate._id, canonical._id);
      commentsMoved += await moveWheelComments(ctx, duplicate._id, canonical._id);
      await moveRegisteredVehicleWheels(ctx, duplicate._id, canonical._id, canonical.wheel_title || "");
      const optionalMoves = await moveOptionalWheelRefs(ctx, duplicate._id, canonical._id, fileRows);
      marketListingsMoved += optionalMoves.marketListings;
      fileRowsMoved += optionalMoves.fileRows;

      await ctx.db.delete(duplicate._id);
      wheelByBusinessId.delete(rename.duplicateBusinessId);
      deleted += 1;
    }

    return {
      commit,
      sample,
      stats: { deleted, renamed, commentsMoved, variantsMoved, marketListingsMoved, fileRowsMoved },
    };
  },
});
