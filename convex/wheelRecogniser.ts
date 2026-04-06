import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

const MAX_RESULTS = 16;

type WheelDoc = Doc<"oem_wheels">;
type VariantDoc = Doc<"oem_wheel_variants">;

type SearchCriteria = {
  brand?: string;
  diameter?: string;
  width?: string;
  boltPattern?: string;
  centerBore?: string;
  color?: string;
  finish?: string;
  spokeCount?: number;
  styleTags?: string[];
};

type ScoredReason = {
  label: string;
  score: number;
};

function normalizeText(value?: string | null): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9.+/#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitValues(value?: string | null) {
  return String(value ?? "")
    .split(/[,;|\n/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function looksLikeGarbageToken(value?: string | null) {
  const text = String(value ?? "").trim();
  if (!text) return true;
  if (text.length < 2) return true;
  if (/^https?:\/\//i.test(text)) return true;
  if (/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(text)) return true;
  if (/^[._-]+$/.test(text)) return true;
  return false;
}

function isReasonableDiameter(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 12 && numeric <= 30;
}

function isReasonableWidth(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 4 && numeric <= 15;
}

function isReasonableCenterBore(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 40 && numeric <= 100;
}

function isReasonableBoltPattern(value: string) {
  return /^\d{1,2}x\d{2,3}(?:\.\d)?$/i.test(value.replace(/\s+/g, ""));
}

function normalizeColorLabel(value?: string | null) {
  const normalized = normalizeColor(value);
  if (!normalized) return "";
  if (normalized === "gunmetal") return "Gunmetal";
  return titleCase(normalized);
}

function normalizeFinishLabel(value?: string | null) {
  const cleaned = String(value ?? "").trim();
  if (looksLikeGarbageToken(cleaned)) return "";
  if (cleaned.length > 60) return "";
  return cleaned;
}

function dataCompletenessScore(wheel: WheelDoc, variants: VariantDoc[]) {
  let score = 0;
  if (pickWheelImage(wheel)) score += 18;
  if (wheel.wheel_title) score += 8;
  if (wheel.text_diameters) score += 6;
  if (wheel.text_widths) score += 6;
  if (wheel.text_bolt_patterns) score += 6;
  if (wheel.text_center_bores) score += 4;
  if (wheel.color || wheel.text_colors) score += 3;
  if (wheel.spoke_count) score += 3;
  score += Math.min(variants.length, 5) * 3;
  score += Math.min(
    variants.filter((variant) => pickVariantImage(variant)).length,
    5
  ) * 4;
  return score;
}

function variantBrowseScore(variant: VariantDoc) {
  let score = 0;
  if (pickVariantImage(variant)) score += 12;
  if (variant.finish) score += 4;
  if (variant.diameter) score += 4;
  if (variant.width) score += 4;
  if (variant.offset) score += 3;
  if (variant.bolt_pattern) score += 3;
  if (variant.part_numbers) score += 2;
  return score;
}

function normalizeDiameter(value?: string | null) {
  const match = String(value ?? "").match(/(\d{2}(?:\.\d+)?)/);
  return match ? match[1] : "";
}

function normalizeWidth(value?: string | null) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : "";
}

function normalizeBoltPattern(value?: string | null) {
  return normalizeText(value).replace(/\s+/g, "");
}

function normalizeCenterBore(value?: string | null) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : "";
}

function normalizeColor(value?: string | null) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  if (normalized.includes("black")) return "black";
  if (normalized.includes("silver")) return "silver";
  if (normalized.includes("chrome")) return "chrome";
  if (normalized.includes("grey") || normalized.includes("gray") || normalized.includes("anthracite") || normalized.includes("graphite") || normalized.includes("gunmetal")) return "gunmetal";
  if (normalized.includes("white")) return "white";
  if (normalized.includes("bronze")) return "bronze";
  if (normalized.includes("gold")) return "gold";
  if (normalized.includes("red")) return "red";
  if (normalized.includes("blue")) return "blue";
  if (normalized.includes("green")) return "green";
  if (normalized.includes("machined") || normalized.includes("diamond turned") || normalized.includes("polished")) return "machined";
  return normalized;
}

function normalizeFinish(value?: string | null) {
  return normalizeColor(value);
}

function hasOverlap(candidateValues: string[], expected: string) {
  if (!expected) return false;
  return candidateValues.some((value) => {
    const normalizedValue = normalizeText(value);
    return normalizedValue.includes(expected) || expected.includes(normalizedValue);
  });
}

function formatReason(label: string, value?: string | number | null) {
  return value !== undefined && value !== null && String(value).trim().length > 0
    ? `${label}: ${value}`
    : label;
}

function pickWheelImage(wheel: WheelDoc) {
  return wheel.good_pic_url?.trim() || wheel.bad_pic_url?.trim() || null;
}

function pickVariantImage(variant: VariantDoc) {
  return variant.good_pic_url?.trim() || variant.bad_pic_url?.trim() || null;
}

function extractBrandLabel(wheel: WheelDoc, brandTitle?: string | null) {
  return brandTitle || wheel.jnc_brands?.trim() || wheel.text_brands?.trim() || null;
}

function buildStyleBlob(wheel: WheelDoc, variant?: VariantDoc | null) {
  return normalizeText(
    [
      wheel.wheel_title,
      wheel.notes,
      wheel.design_style_tags?.join(" "),
      variant?.variant_title,
      variant?.finish,
      variant?.notes,
      variant?.part_numbers,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function scoreWheelFamily(
  wheel: WheelDoc,
  variant: VariantDoc | null,
  criteria: SearchCriteria,
  brandLabel: string | null
) {
  const reasons: ScoredReason[] = [];
  let totalPossible = 0;
  let score = 0;

  const brandQuery = normalizeText(criteria.brand);
  if (brandQuery) {
    totalPossible += 18;
    if (hasOverlap([brandLabel ?? "", wheel.wheel_title ?? ""], brandQuery)) {
      score += 18;
      reasons.push({ label: formatReason("Brand", brandLabel ?? wheel.wheel_title ?? criteria.brand), score: 18 });
    }
  }

  const diameterQuery = normalizeDiameter(criteria.diameter);
  if (diameterQuery) {
    totalPossible += 16;
    const candidates = [
      variant?.diameter ?? "",
      wheel.text_diameters ?? "",
    ].flatMap(splitValues).map(normalizeDiameter);
    if (candidates.includes(diameterQuery)) {
      score += 16;
      reasons.push({ label: formatReason("Diameter", diameterQuery), score: 16 });
    }
  }

  const widthQuery = normalizeWidth(criteria.width);
  if (widthQuery) {
    totalPossible += 12;
    const candidates = [
      variant?.width ?? "",
      wheel.text_widths ?? "",
    ].flatMap(splitValues).map(normalizeWidth);
    if (candidates.includes(widthQuery)) {
      score += 12;
      reasons.push({ label: formatReason("Width", widthQuery), score: 12 });
    }
  }

  const boltQuery = normalizeBoltPattern(criteria.boltPattern);
  if (boltQuery) {
    totalPossible += 18;
    const candidates = [
      variant?.bolt_pattern ?? "",
      wheel.text_bolt_patterns ?? "",
    ].flatMap(splitValues).map(normalizeBoltPattern);
    if (candidates.includes(boltQuery)) {
      score += 18;
      reasons.push({ label: formatReason("Bolt pattern", criteria.boltPattern), score: 18 });
    }
  }

  const centerBoreQuery = normalizeCenterBore(criteria.centerBore);
  if (centerBoreQuery) {
    totalPossible += 12;
    const candidates = [wheel.text_center_bores ?? ""].flatMap(splitValues).map(normalizeCenterBore);
    if (candidates.includes(centerBoreQuery)) {
      score += 12;
      reasons.push({ label: formatReason("Center bore", criteria.centerBore), score: 12 });
    }
  }

  const colorQuery = normalizeColor(criteria.color);
  if (colorQuery) {
    totalPossible += 8;
    const candidates = [wheel.color ?? "", wheel.text_colors ?? ""].flatMap(splitValues).map(normalizeColor);
    if (candidates.includes(colorQuery)) {
      score += 8;
      reasons.push({ label: formatReason("Color", criteria.color), score: 8 });
    }
  }

  const finishQuery = normalizeFinish(criteria.finish);
  if (finishQuery) {
    totalPossible += 8;
    const candidates = [variant?.finish ?? "", wheel.color ?? "", wheel.text_colors ?? ""].flatMap(splitValues).map(normalizeFinish);
    if (candidates.includes(finishQuery)) {
      score += 8;
      reasons.push({ label: formatReason("Finish", variant?.finish ?? criteria.finish), score: 8 });
    }
  }

  if (criteria.spokeCount && criteria.spokeCount > 0) {
    totalPossible += 8;
    const candidateSpokeCount = variant?.spoke_count ?? wheel.spoke_count ?? null;
    if (candidateSpokeCount === criteria.spokeCount) {
      score += 8;
      reasons.push({ label: formatReason("Spoke count", candidateSpokeCount), score: 8 });
    } else if (
      candidateSpokeCount !== null &&
      Math.abs(candidateSpokeCount - criteria.spokeCount) === 1
    ) {
      score += 4;
      reasons.push({ label: formatReason("Spoke count close", candidateSpokeCount), score: 4 });
    }
  }

  const styleTags = (criteria.styleTags ?? []).map(normalizeText).filter(Boolean);
  if (styleTags.length > 0) {
    totalPossible += 10;
    const blob = buildStyleBlob(wheel, variant);
    const matched = styleTags.filter((tag) => blob.includes(tag));
    if (matched.length > 0) {
      const styleScore = Math.round((matched.length / styleTags.length) * 10);
      score += styleScore;
      reasons.push({ label: `Style clues: ${matched.join(", ")}`, score: styleScore });
    }
  }

  return { score, totalPossible, reasons };
}

export const formOptionsGet = query({
  args: {},
  handler: async (ctx) => {
    const [wheels, variants, brands] = await Promise.all([
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_wheel_variants").collect(),
      ctx.db.query("oem_brands").collect(),
    ]);

    const brandNames = brands
      .map((brand) => brand.brand_title ?? "")
      .filter((value) => !looksLikeGarbageToken(value));

    const diameters = [
      ...wheels.flatMap((wheel) => splitValues(wheel.text_diameters ?? "")),
      ...variants.flatMap((variant) => splitValues(variant.diameter ?? "")),
    ]
      .map(normalizeDiameter)
      .filter((value) => value && isReasonableDiameter(value));

    const widths = [
      ...wheels.flatMap((wheel) => splitValues(wheel.text_widths ?? "")),
      ...variants.flatMap((variant) => splitValues(variant.width ?? "")),
    ]
      .map(normalizeWidth)
      .filter((value) => value && isReasonableWidth(value));

    const boltPatterns = [
      ...wheels.flatMap((wheel) => splitValues(wheel.text_bolt_patterns ?? "")),
      ...variants.flatMap((variant) => splitValues(variant.bolt_pattern ?? "")),
    ]
      .map((value) => value.replace(/\s+/g, "").trim())
      .filter((value) => value && isReasonableBoltPattern(value));

    const centerBores = wheels
      .flatMap((wheel) => splitValues(wheel.text_center_bores ?? ""))
      .map(normalizeCenterBore)
      .filter((value) => value && isReasonableCenterBore(value));

    const colors = [
      ...wheels.flatMap((wheel) => splitValues(wheel.color ?? wheel.text_colors ?? "")),
      ...variants.flatMap((variant) => splitValues(variant.finish ?? "")),
    ]
      .map(normalizeColorLabel)
      .filter((value) => value && !looksLikeGarbageToken(value));

    const finishes = variants
      .flatMap((variant) => splitValues(variant.finish ?? ""))
      .map(normalizeFinishLabel)
      .filter(Boolean);

    const spokeCounts = uniqueSorted(
      [...wheels.map((wheel) => wheel.spoke_count), ...variants.map((variant) => variant.spoke_count)]
        .filter((value): value is number => typeof value === "number")
        .map((value) => String(value))
    ).map((value) => Number(value));

    const styleTags = uniqueSorted(
      wheels.flatMap((wheel) => wheel.design_style_tags ?? []).map((value) => value.trim()).filter(Boolean)
    ).slice(0, 24);

    return {
      brands: uniqueSorted(brandNames).slice(0, 60),
      diameters: uniqueSorted(diameters).slice(0, 40),
      widths: uniqueSorted(widths).slice(0, 40),
      boltPatterns: uniqueSorted(boltPatterns).slice(0, 40),
      centerBores: uniqueSorted(centerBores).slice(0, 40),
      colors: uniqueSorted(colors).slice(0, 40),
      finishes: uniqueSorted(finishes).slice(0, 40),
      spokeCounts,
      styleTags,
    };
  },
});

export const search = query({
  args: {
    brand: v.optional(v.string()),
    diameter: v.optional(v.string()),
    width: v.optional(v.string()),
    boltPattern: v.optional(v.string()),
    centerBore: v.optional(v.string()),
    color: v.optional(v.string()),
    finish: v.optional(v.string()),
    spokeCount: v.optional(v.number()),
    styleTags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const criteria: SearchCriteria = {
      brand: args.brand?.trim(),
      diameter: args.diameter?.trim(),
      width: args.width?.trim(),
      boltPattern: args.boltPattern?.trim(),
      centerBore: args.centerBore?.trim(),
      color: args.color?.trim(),
      finish: args.finish?.trim(),
      spokeCount: args.spokeCount,
      styleTags: (args.styleTags ?? []).map((value) => value.trim()).filter(Boolean),
    };

    const hasAnyCriteria = Boolean(
      criteria.brand ||
        criteria.diameter ||
        criteria.width ||
        criteria.boltPattern ||
        criteria.centerBore ||
        criteria.color ||
        criteria.finish ||
        criteria.spokeCount ||
        (criteria.styleTags?.length ?? 0) > 0
    );

    const [wheels, variants, brands] = await Promise.all([
      ctx.db.query("oem_wheels").collect(),
      ctx.db.query("oem_wheel_variants").collect(),
      ctx.db.query("oem_brands").collect(),
    ]);

    const brandById = new Map<string, string>();
    for (const brand of brands) {
      if (brand.brand_title) {
        brandById.set(brand._id, brand.brand_title);
      }
    }

    const variantsByWheel = new Map<string, VariantDoc[]>();
    for (const variant of variants) {
      if (!variant.wheel_id) continue;
      const wheelId = variant.wheel_id as string;
      const bucket = variantsByWheel.get(wheelId) ?? [];
      bucket.push(variant);
      variantsByWheel.set(wheelId, bucket);
    }

    const familyResults = wheels
      .map((wheel) => {
        const brandLabel = extractBrandLabel(wheel, wheel.brand_id ? brandById.get(wheel.brand_id as string) ?? null : null);
        const wheelOnlyScore = scoreWheelFamily(wheel, null, criteria, brandLabel);
        const scoredVariants = (variantsByWheel.get(wheel._id as string) ?? [])
          .map((variant) => {
            const variantScore = scoreWheelFamily(wheel, variant, criteria, brandLabel);
            const partNumberValues = splitValues(variant.part_numbers);
            return {
              variantId: variant._id,
              title: variant.variant_title || variant.wheel_title || wheel.wheel_title || "Wheel variant",
              slug: variant.slug ?? null,
              imageUrl: pickVariantImage(variant),
              finish: variant.finish ?? null,
              diameter: variant.diameter ?? null,
              width: variant.width ?? null,
              offset: variant.offset ?? null,
              boltPattern: variant.bolt_pattern ?? null,
              partNumbers: partNumberValues.slice(0, 4),
              score: variantScore.score,
              confidence: variantScore.totalPossible > 0 ? Math.round((variantScore.score / variantScore.totalPossible) * 100) : 0,
              matchedOn: variantScore.reasons
                .sort((a, b) => b.score - a.score)
                .map((reason) => reason.label)
                .slice(0, 4),
            };
          })
          .filter((variant) => variant.score > 0)
          .sort((a, b) => b.score - a.score);

        const allFamilyVariants = variantsByWheel.get(wheel._id as string) ?? [];
        const bestVariant = scoredVariants[0] ?? null;
        const bestVariantConfidenceBase = bestVariant ? Math.max(wheelOnlyScore.totalPossible, 1) : Math.max(wheelOnlyScore.totalPossible, 1);
        const familyScore = Math.max(wheelOnlyScore.score, bestVariant?.score ?? 0);
        const totalPossible = bestVariant ? bestVariantConfidenceBase : Math.max(wheelOnlyScore.totalPossible, 1);
        const confidence = hasAnyCriteria
          ? Math.round((familyScore / totalPossible) * 100)
          : 0;

        if (hasAnyCriteria && familyScore <= 0) return null;

        const fallbackVariants = allFamilyVariants
          .map((variant) => ({
            variantId: variant._id,
            title: variant.variant_title || variant.wheel_title || wheel.wheel_title || "Wheel variant",
            slug: variant.slug ?? null,
            imageUrl: pickVariantImage(variant),
            finish: variant.finish ?? null,
            diameter: variant.diameter ?? null,
            width: variant.width ?? null,
            offset: variant.offset ?? null,
            boltPattern: variant.bolt_pattern ?? null,
            partNumbers: splitValues(variant.part_numbers).slice(0, 4),
            score: 0,
            confidence: 0,
            matchedOn: [],
          }))
          .sort((a, b) => {
            const sourceA = allFamilyVariants.find((variant) => variant._id === a.variantId);
            const sourceB = allFamilyVariants.find((variant) => variant._id === b.variantId);
            const scoreA = sourceA ? variantBrowseScore(sourceA) : 0;
            const scoreB = sourceB ? variantBrowseScore(sourceB) : 0;
            return scoreB - scoreA || a.title.localeCompare(b.title);
          });

        const familyReasons = hasAnyCriteria
          ? [
          ...wheelOnlyScore.reasons,
          ...(bestVariant
            ? bestVariant.matchedOn.map((label) => ({ label, score: 0 }))
            : []),
        ]
          .map((reason) => reason.label)
          .filter(Boolean)
          .filter((value, index, array) => array.indexOf(value) === index)
          .slice(0, 5)
          : [];

        const familyImage = pickWheelImage(wheel) ?? (bestVariant?.imageUrl ?? fallbackVariants[0]?.imageUrl ?? null);

        return {
          wheelId: wheel._id,
          wheelRouteId: wheel.slug || wheel.id || wheel._id,
          wheelTitle: wheel.wheel_title || "Wheel",
          brandName: brandLabel,
          imageUrl: familyImage,
          confidence,
          browseScore: dataCompletenessScore(wheel, allFamilyVariants),
          matchedOn: familyReasons,
          summary: hasAnyCriteria
            ? familyReasons.length > 0
              ? familyReasons.join(" • ")
              : "Metadata match"
            : "Browse mode",
          tableData: {
            diameter: wheel.text_diameters ?? null,
            width: wheel.text_widths ?? null,
            offset: wheel.text_offsets ?? wheel.wheel_offset ?? null,
            boltPattern: wheel.text_bolt_patterns ?? null,
            centerBore: wheel.text_center_bores ?? null,
            weight: wheel.weight ?? null,
            tireSize: wheel.text_tire_sizes ?? null,
            partNumbers: wheel.part_numbers ?? null,
          },
          topVariants: hasAnyCriteria ? scoredVariants.slice(0, 3) : fallbackVariants.slice(0, 3),
        };
      })
      .filter((result): result is NonNullable<typeof result> => result !== null)
      .sort((a, b) => {
        if (hasAnyCriteria) {
          return b.confidence - a.confidence || a.wheelTitle.localeCompare(b.wheelTitle);
        }
        const aHasImage = a.imageUrl ? 1 : 0;
        const bHasImage = b.imageUrl ? 1 : 0;
        return (
          bHasImage - aHasImage ||
          (b.browseScore ?? 0) - (a.browseScore ?? 0) ||
          a.wheelTitle.localeCompare(b.wheelTitle)
        );
      })
      .slice(0, Math.min(args.limit ?? 12, MAX_RESULTS));

    return {
      searchMode: hasAnyCriteria ? "match" : "browse",
      appliedCriteriaCount: [
        criteria.brand,
        criteria.diameter,
        criteria.width,
        criteria.boltPattern,
        criteria.centerBore,
        criteria.color,
        criteria.finish,
        criteria.spokeCount ? String(criteria.spokeCount) : "",
        ...(criteria.styleTags ?? []),
      ].filter(Boolean).length,
      families: familyResults,
      totalFamiliesConsidered: wheels.length,
      totalMatches: familyResults.length,
    };
  },
});
