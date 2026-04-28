import { query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

const COLOR_FAMILY_SWATCHES: Record<string, string> = {
  Black: "#1e1e1f",
  Silver: "#bbc1cb",
  Grey: "#6f737b",
  White: "#e7e6e1",
  Blue: "#4f7ed7",
  Red: "#cb4a46",
  Green: "#4d8b5c",
  Yellow: "#d4a422",
  Orange: "#d1793e",
  Purple: "#7e65cf",
  Brown: "#705844",
  Gold: "#ba9150",
  "Multi-tone": "#8a8a8a",
  Other: "#8c8a86",
};

function normalizeColorText(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeHex(value?: string | null) {
  const text = normalizeColorText(value);
  if (!text) return null;
  const stripped = text.replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(stripped) ? `#${stripped}` : null;
}

function slugifyColorText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferColorFamily(value: string) {
  const text = value.toLowerCase();

  if (/(two[-\s]?tone|bicolor|bi[-\s]?color|diamond cut|diamond turned|machined\/|machined |polished\/)/.test(text)) {
    return { familyTitle: "Multi-tone", swatchHex: COLOR_FAMILY_SWATCHES["Multi-tone"] };
  }
  if (/(bronze|gold|champagne|copper|brass)/.test(text)) {
    return { familyTitle: "Gold", swatchHex: COLOR_FAMILY_SWATCHES.Gold };
  }
  if (/(jet black|black|shadow line|onyx)/.test(text)) {
    return { familyTitle: "Black", swatchHex: COLOR_FAMILY_SWATCHES.Black };
  }
  if (/(grey|gray|anthracite|graphite|gunmetal|titanium|technical grey|ferric grey)/.test(text)) {
    return { familyTitle: "Grey", swatchHex: COLOR_FAMILY_SWATCHES.Grey };
  }
  if (/(silver|machined|polished|chrome|aluminum|alloy)/.test(text)) {
    return { familyTitle: "Silver", swatchHex: COLOR_FAMILY_SWATCHES.Silver };
  }
  if (/(white|ivory|cream|pearl white)/.test(text)) {
    return { familyTitle: "White", swatchHex: COLOR_FAMILY_SWATCHES.White };
  }
  if (/(blue|yas marina|laguna seca|estoril|navy|aqua|teal|cyan|turquoise)/.test(text)) {
    return { familyTitle: "Blue", swatchHex: COLOR_FAMILY_SWATCHES.Blue };
  }
  if (/(red|rosso|crimson|burgundy|scarlet|ruby)/.test(text)) {
    return { familyTitle: "Red", swatchHex: COLOR_FAMILY_SWATCHES.Red };
  }
  if (/(green|verde|olive|mint|sage)/.test(text)) {
    return { familyTitle: "Green", swatchHex: COLOR_FAMILY_SWATCHES.Green };
  }
  if (/(yellow|giallo)/.test(text)) {
    return { familyTitle: "Yellow", swatchHex: COLOR_FAMILY_SWATCHES.Yellow };
  }
  if (/(orange|clementine|sunset)/.test(text)) {
    return { familyTitle: "Orange", swatchHex: COLOR_FAMILY_SWATCHES.Orange };
  }
  if (/(purple|violet|lilac|magenta)/.test(text)) {
    return { familyTitle: "Purple", swatchHex: COLOR_FAMILY_SWATCHES.Purple };
  }
  if (/(brown|mocha|tan|beige|chocolate)/.test(text)) {
    return { familyTitle: "Brown", swatchHex: COLOR_FAMILY_SWATCHES.Brown };
  }

  return { familyTitle: "Other", swatchHex: COLOR_FAMILY_SWATCHES.Other };
}

function resolveColorPresentation(
  color: any,
  familyById: Record<string, any>,
  brandById: Record<string, any>,
  brandTitleOverride?: string | null,
  counts?: {
    wheel?: number;
    wheelVariant?: number;
    vehicle?: number;
    vehicleVariant?: number;
  }
) {
  const legacyColor = normalizeColorText(color.color);
  const colorTitle = normalizeColorText(color.color_title) || legacyColor || "Untitled Color";
  const linkedFamily = color.family_id ? familyById[String(color.family_id)] : null;
  const linkedBrand = color.brand_id ? brandById[String(color.brand_id)] : null;
  const inferredFamily = inferColorFamily(colorTitle);

  return {
    ...color,
    color_title: colorTitle,
    legacy_color: legacyColor || null,
    slug: normalizeColorText(color.slug) || slugifyColorText(colorTitle),
    family_title: normalizeColorText(linkedFamily?.family_title) || inferredFamily.familyTitle,
    family_description: normalizeColorText(linkedFamily?.family_description) || null,
    swatch_hex: normalizeHex(color.hex) || normalizeHex(linkedFamily?.swatch_hex) || inferredFamily.swatchHex,
    manufacturer_code: normalizeColorText(color.manufacturer_code) || null,
    finish: normalizeColorText(color.finish) || null,
    notes: normalizeColorText(color.notes) || null,
    brand_title: normalizeColorText(linkedBrand?.brand_title) || normalizeColorText(brandTitleOverride) || null,
    wheelCount: counts?.wheel ?? 0,
    wheelVariantCount: counts?.wheelVariant ?? 0,
    vehicleCount: counts?.vehicle ?? 0,
    vehicleVariantCount: counts?.vehicleVariant ?? 0,
    itemCount:
      (counts?.wheel ?? 0) +
      (counts?.wheelVariant ?? 0) +
      (counts?.vehicle ?? 0) +
      (counts?.vehicleVariant ?? 0),
  };
}

function chooseDerivedBrandTitle(counts: Record<string, number>) {
  const entries = Object.entries(counts).filter(([label, count]) => label && count > 0);
  if (entries.length === 0) return null;
  if (entries.length === 1) return entries[0][0];

  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const [topLabel, topCount] = entries[0];
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  return topCount / total >= 0.75 ? topLabel : null;
}

export const collectionGet = query({
  args: {},
  handler: async (ctx) => {
    const [colors, families, brands, wheels, wheelVariants, vehicles, vehicleVariants, wheelLinks, wheelVariantLinks, vehicleLinks, vehicleVariantLinks] =
      await Promise.all([
        ctx.db.query("oem_colors").collect(),
        ctx.db.query("oem_color_families").collect(),
        ctx.db.query("oem_brands").collect(),
        ctx.db.query("oem_wheels").collect(),
        ctx.db.query("oem_wheel_variants").collect(),
        ctx.db.query("oem_vehicles").collect(),
        ctx.db.query("oem_vehicle_variants").collect(),
        ctx.db.query("j_wheel_color").collect(),
        ctx.db.query("j_oem_wheel_variant_color").collect(),
        ctx.db.query("j_vehicle_color").collect(),
        ctx.db.query("j_oem_vehicle_variant_color").collect(),
      ]);

    const familyById = Object.fromEntries(families.map((family) => [String(family._id), family]));
    const brandById = Object.fromEntries(brands.map((brand) => [String(brand._id), brand]));

    const wheelCountByColor: Record<string, number> = {};
    const wheelVariantCountByColor: Record<string, number> = {};
    const vehicleCountByColor: Record<string, number> = {};
    const vehicleVariantCountByColor: Record<string, number> = {};
    const derivedBrandCountsByColor: Record<string, Record<string, number>> = {};

    const wheelById = Object.fromEntries(wheels.map((wheel) => [String(wheel._id), wheel]));
    const wheelVariantById = Object.fromEntries(wheelVariants.map((variant) => [String(variant._id), variant]));
    const vehicleById = Object.fromEntries(vehicles.map((vehicle) => [String(vehicle._id), vehicle]));
    const vehicleVariantById = Object.fromEntries(vehicleVariants.map((variant) => [String(variant._id), variant]));

    const resolveBrandTitle = (record: any) =>
      normalizeColorText(record?.brand_title) ||
      normalizeColorText(record?.brand_name) ||
      normalizeColorText(record?.jnc_brands) ||
      normalizeColorText(record?.text_brands) ||
      (record?.brand_id ? normalizeColorText(brandById[String(record.brand_id)]?.brand_title) : "");

    const addBrandCount = (colorId: string, brandTitle?: string | null) => {
      const normalized = normalizeColorText(brandTitle);
      if (!normalized) return;
      const bucket = (derivedBrandCountsByColor[colorId] ??= {});
      bucket[normalized] = (bucket[normalized] ?? 0) + 1;
    };

    for (const row of wheelLinks) wheelCountByColor[String(row.color_id)] = (wheelCountByColor[String(row.color_id)] ?? 0) + 1;
    for (const row of wheelVariantLinks) wheelVariantCountByColor[String(row.color_id)] = (wheelVariantCountByColor[String(row.color_id)] ?? 0) + 1;
    for (const row of vehicleLinks) vehicleCountByColor[String(row.color_id)] = (vehicleCountByColor[String(row.color_id)] ?? 0) + 1;
    for (const row of vehicleVariantLinks) vehicleVariantCountByColor[String(row.color_id)] = (vehicleVariantCountByColor[String(row.color_id)] ?? 0) + 1;

    for (const row of wheelLinks) {
      addBrandCount(String(row.color_id), resolveBrandTitle(wheelById[String(row.wheel_id)]));
    }
    for (const row of wheelVariantLinks) {
      const variant = wheelVariantById[String(row.variant_id)];
      const parentWheel = variant?.wheel_id ? wheelById[String(variant.wheel_id)] : null;
      addBrandCount(String(row.color_id), resolveBrandTitle(parentWheel));
    }
    for (const row of vehicleLinks) {
      addBrandCount(String(row.color_id), resolveBrandTitle(vehicleById[String(row.vehicle_id)]));
    }
    for (const row of vehicleVariantLinks) {
      const variant = vehicleVariantById[String(row.variant_id)];
      const parentVehicle = variant?.vehicle_id ? vehicleById[String(variant.vehicle_id)] : null;
      addBrandCount(String(row.color_id), resolveBrandTitle(parentVehicle));
    }

    return colors
      .map((color) =>
        resolveColorPresentation(
          color,
          familyById,
          brandById,
          chooseDerivedBrandTitle(derivedBrandCountsByColor[String(color._id)] ?? {}),
          {
            wheel: wheelCountByColor[String(color._id)] ?? 0,
            wheelVariant: wheelVariantCountByColor[String(color._id)] ?? 0,
            vehicle: vehicleCountByColor[String(color._id)] ?? 0,
            vehicleVariant: vehicleVariantCountByColor[String(color._id)] ?? 0,
          }
        )
      )
      .sort((a, b) => a.color_title.localeCompare(b.color_title));
  },
});

export const detailGet = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedLookupId = slugifyColorText(args.id);
    let color =
      /^[a-z0-9]{20,}$/i.test(args.id)
        ? await ctx.db.get("oem_colors", args.id as Id<"oem_colors">)
        : null;

    if (!color) {
      color = await ctx.db
        .query("oem_colors")
        .withIndex("by_slug", (q) => q.eq("slug", args.id))
        .first();
    }
    if (!color && normalizedLookupId && normalizedLookupId !== args.id) {
      color = await ctx.db
        .query("oem_colors")
        .withIndex("by_slug", (q) => q.eq("slug", normalizedLookupId))
        .first();
    }
    if (!color) {
      color = await ctx.db
        .query("oem_colors")
        .withIndex("by_color_title", (q) => q.eq("color_title", args.id))
        .first();
    }
    if (!color) {
      color = await ctx.db
        .query("oem_colors")
        .withIndex("by_color", (q) => q.eq("color", args.id))
        .first();
    }
    if (!color) {
      const allColors = await ctx.db.query("oem_colors").collect();
      color =
        allColors.find((candidate) => {
          const candidateTitle =
            normalizeColorText(candidate.color_title) ||
            normalizeColorText(candidate.color) ||
            "Untitled Color";
          const candidateSlug =
            normalizeColorText(candidate.slug) || slugifyColorText(candidateTitle);
          return (
            candidateSlug === args.id ||
            (normalizedLookupId && candidateSlug === normalizedLookupId)
          );
        }) ?? null;
    }
    if (!color) return null;

    const [families, brands, wheelLinks, wheelVariantLinks, vehicleLinks, vehicleVariantLinks] =
      await Promise.all([
        ctx.db.query("oem_color_families").collect(),
        ctx.db.query("oem_brands").collect(),
        ctx.db
          .query("j_wheel_color")
          .withIndex("by_color", (q) => q.eq("color_id", color._id))
          .collect(),
        ctx.db
          .query("j_oem_wheel_variant_color")
          .withIndex("by_color", (q) => q.eq("color_id", color._id))
          .collect(),
        ctx.db
          .query("j_vehicle_color")
          .withIndex("by_color", (q) => q.eq("color_id", color._id))
          .collect(),
        ctx.db
          .query("j_oem_vehicle_variant_color")
          .withIndex("by_color", (q) => q.eq("color_id", color._id))
          .collect(),
      ]);

    const familyById = Object.fromEntries(families.map((family) => [String(family._id), family]));
    const brandById = Object.fromEntries(brands.map((brand) => [String(brand._id), brand]));

    const wheelVariantDocs = (
      await Promise.all(
        wheelVariantLinks.map((row) => ctx.db.get("oem_wheel_variants", row.variant_id))
      )
    ).filter(Boolean) as any[];

    const vehicleVariantDocs = (
      await Promise.all(
        vehicleVariantLinks.map((row) => ctx.db.get("oem_vehicle_variants", row.variant_id))
      )
    ).filter(Boolean) as any[];

    const directWheelIds = wheelLinks.map((row) => String(row.wheel_id));
    const wheelIdsFromVariants = wheelVariantDocs
      .map((variant) => (variant.wheel_id ? String(variant.wheel_id) : null))
      .filter(Boolean) as string[];
    const wheelIds = Array.from(new Set([...directWheelIds, ...wheelIdsFromVariants]));

    const directVehicleIds = vehicleLinks.map((row) => String(row.vehicle_id));
    const vehicleIdsFromVariants = vehicleVariantDocs
      .map((variant) => (variant.vehicle_id ? String(variant.vehicle_id) : null))
      .filter(Boolean) as string[];
    const vehicleIds = Array.from(new Set([...directVehicleIds, ...vehicleIdsFromVariants]));

    const [wheelDocs, vehicleDocs, wheelBrandLinks, vehicleBrandLinks] = await Promise.all([
      Promise.all(wheelIds.map((id) => ctx.db.get("oem_wheels", id as Id<"oem_wheels">))),
      Promise.all(vehicleIds.map((id) => ctx.db.get("oem_vehicles", id as Id<"oem_vehicles">))),
      Promise.all(
        wheelIds.map(async (id) =>
          ctx.db
            .query("j_wheel_brand")
            .withIndex("by_wheel", (q) => q.eq("wheel_id", id as Id<"oem_wheels">))
            .first()
        )
      ),
      Promise.all(
        vehicleIds.map(async (id) =>
          ctx.db
            .query("j_vehicle_brand")
            .withIndex("by_vehicle", (q) => q.eq("vehicle_id", id as Id<"oem_vehicles">))
            .first()
        )
      ),
    ]);

    const wheels = wheelDocs
      .map((wheel, index) => {
        if (!wheel) return null;
        return {
          id: String(wheel._id),
          name: normalizeColorText(wheel.wheel_title) || normalizeColorText(wheel.id) || "Untitled Wheel",
          brand: normalizeColorText(wheelBrandLinks[index]?.brand_title) || normalizeColorText(wheel.jnc_brands) || "Unknown Brand",
          specs: [
            normalizeColorText(wheel.text_diameters),
            normalizeColorText(wheel.text_widths),
            normalizeColorText(wheel.text_bolt_patterns),
            normalizeColorText(wheel.text_colors),
          ].filter(Boolean),
          imageUrl: normalizeColorText(wheel.good_pic_url) || null,
          good_pic_url: normalizeColorText(wheel.good_pic_url) || null,
          bad_pic_url: normalizeColorText(wheel.bad_pic_url) || null,
        };
      })
      .filter(Boolean);

    const vehicles = vehicleDocs
      .map((vehicle, index) => {
        if (!vehicle) return null;
        return {
          id: String(vehicle._id),
          name:
            normalizeColorText(vehicle.vehicle_title) ||
            normalizeColorText(vehicle.model_name) ||
            "Untitled Vehicle",
          brand: normalizeColorText(vehicleBrandLinks[index]?.brand_title) || "Unknown Brand",
          wheels: 0,
          image: normalizeColorText(vehicle.good_pic_url) || normalizeColorText(vehicle.bad_pic_url) || null,
          good_pic_url: normalizeColorText(vehicle.good_pic_url) || null,
          bad_pic_url: normalizeColorText(vehicle.bad_pic_url) || null,
        };
      })
      .filter(Boolean);

    const detailBrandCounts: Record<string, number> = {};
    const addDetailBrandCount = (brandTitle?: string | null) => {
      const normalized = normalizeColorText(brandTitle);
      if (!normalized) return;
      detailBrandCounts[normalized] = (detailBrandCounts[normalized] ?? 0) + 1;
    };

    for (const wheel of wheelDocs) {
      const wheelAny = wheel as any;
      addDetailBrandCount(
        normalizeColorText(wheelAny?.brand_name) ||
        normalizeColorText(wheelAny?.jnc_brands) ||
        normalizeColorText(wheelAny?.text_brands)
      );
    }
    for (const variant of wheelVariantDocs) {
      const parentWheel = variant?.wheel_id ? wheelDocs.find((wheel) => wheel && String(wheel._id) === String(variant.wheel_id)) : null;
      addDetailBrandCount(
        normalizeColorText((parentWheel as any)?.brand_name) ||
        normalizeColorText((parentWheel as any)?.jnc_brands) ||
        normalizeColorText((parentWheel as any)?.text_brands)
      );
    }
    for (const vehicle of vehicleDocs) {
      const vehicleAny = vehicle as any;
      addDetailBrandCount(
        normalizeColorText(vehicleAny?.brand_name) ||
        normalizeColorText(vehicleAny?.text_brands)
      );
    }
    for (const variant of vehicleVariantDocs) {
      const parentVehicle = variant?.vehicle_id ? vehicleDocs.find((vehicle) => vehicle && String(vehicle._id) === String(variant.vehicle_id)) : null;
      addDetailBrandCount(
        normalizeColorText((parentVehicle as any)?.brand_name) ||
        normalizeColorText((parentVehicle as any)?.text_brands)
      );
    }

    return {
      color: resolveColorPresentation(
        color,
        familyById,
        brandById,
        chooseDerivedBrandTitle(detailBrandCounts),
        {
          wheel: wheelLinks.length,
          wheelVariant: wheelVariantLinks.length,
          vehicle: vehicleLinks.length,
          vehicleVariant: vehicleVariantLinks.length,
        }
      ),
      wheels,
      wheelVariants: wheelVariantDocs.map((variant) => ({
        id: String(variant._id),
        wheel_id: variant.wheel_id ? String(variant.wheel_id) : null,
        title:
          normalizeColorText(variant.variant_title) ||
          normalizeColorText(variant.wheel_title) ||
          "Untitled Variant",
        wheel_title: normalizeColorText(variant.wheel_title) || null,
        part_numbers: normalizeColorText(variant.part_numbers) || null,
        finish: normalizeColorText(variant.finish) || null,
        diameter: normalizeColorText(variant.diameter) || null,
        width: normalizeColorText(variant.width) || null,
        offset: normalizeColorText(variant.offset) || null,
        bolt_pattern: normalizeColorText(variant.bolt_pattern) || null,
        weight: normalizeColorText(variant.weight) || null,
        tire_size: null,
        center_bore: null,
        size: [normalizeColorText(variant.diameter), normalizeColorText(variant.width)].filter(Boolean).join(" x ") || null,
        good_pic_url: normalizeColorText(variant.good_pic_url) || null,
        bad_pic_url: normalizeColorText(variant.bad_pic_url) || null,
      })),
      vehicles,
      vehicleVariants: vehicleVariantDocs.map((variant) => ({
        id: String(variant._id),
        title: normalizeColorText(variant.variant_title) || "Untitled Variant",
        vehicle_id: variant.vehicle_id ? String(variant.vehicle_id) : null,
        market: normalizeColorText(variant.market) || null,
        years:
          [variant.year_from, variant.year_to].filter((value) => typeof value === "number").join(" - ") || null,
        good_pic_url: normalizeColorText(variant.good_pic_url) || null,
        bad_pic_url: normalizeColorText(variant.bad_pic_url) || null,
      })),
    };
  },
});
