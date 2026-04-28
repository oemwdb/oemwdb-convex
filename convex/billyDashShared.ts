import type { QueryCtx } from "./_generated/server";

export const SNAPSHOT_KEY = "billy_dash";

const STALE_WINDOW_MS = 1000 * 60 * 60 * 24 * 21;
const RECENT_WINDOW_MS = 1000 * 60 * 60 * 24 * 7;

const WORKSHOP_BRAND_GROUPS = [
  "944racing",
  "alfa_romeo",
  "audi",
  "ferrari",
  "fiat",
  "jaguar",
  "lamborghini",
  "land_rover",
  "mercedes",
  "porsche",
  "vw",
] as const;

const WORKSHOP_CORE_SUFFIXES = [
  "wheels",
  "wheel_variants",
  "vehicles",
  "vehicle_variants",
  "brands",
  "junction_vehicles_wheels",
] as const;

const WORKSHOP_EXTRA_TABLES = [
  "ws_audi_chassis_groups",
  "ws_audi_chassis_group_urls",
  "ws_alfa_romeo_models",
  "ws_alfa_romeo_variants",
  "ws_fiat_models",
  "ws_fiat_variants",
] as const;

type Stage =
  | "Seeded"
  | "Vehicle Canon"
  | "Fitment"
  | "Family Links"
  | "Exact Links"
  | "Media Polish"
  | "Complete";

type Health = "healthy" | "watch" | "critical" | "idle";
type Movement = "improving" | "steady" | "at-risk" | "quiet";

type CoverageMetric = {
  current: number;
  total: number;
  percent: number;
};

type StageSummary = {
  brandsSeeded: number;
  brandsVehicleComplete: number;
  brandsFitmentComplete: number;
  brandsFamilyLinkComplete: number;
  brandsExactLinkReadyOrComplete: number;
  brandsMediaComplete: number;
};

type QueueTotals = {
  blocked: number;
  review: number;
  held: number;
  stale: number;
  newlyImprovedThisWeek: number;
  regressedThisWeek: number;
};

type CoverageBundle = {
  vehicleFamilyCanon: CoverageMetric;
  vehicleVariantCanon: CoverageMetric;
  familyFitment: CoverageMetric;
  variantFitment: CoverageMetric;
  familyWheelLinks: CoverageMetric;
  exactVariantLinks: CoverageMetric;
  media: CoverageMetric;
  queueHealth: CoverageMetric;
  mediaLayers: {
    brands: CoverageMetric;
    vehicleFamilies: CoverageMetric;
    vehicleVariants: CoverageMetric;
    wheelFamilies: CoverageMetric;
    wheelVariants: CoverageMetric;
  };
};

type QueueComposition = {
  blocked: number;
  review: number;
  held: number;
  stale: number;
  unresolvedResidue: number;
  resolvedThisWeek: number;
  statusBreakdown: Array<{
    label: string;
    count: number;
  }>;
};

type CanonicalDebt = {
  zeroLinkFamilies: number;
  variantsMissingExactLinks: number;
  parentlessWheelVariants: number;
  familiesMissingBoltPattern: number;
  familiesMissingCenterBore: number;
  familiesMissingBoth: number;
  entitiesMissingRealMedia: number;
  missingBrandLinks: number;
  directFieldImageDrift: number;
  imageNormalizationDrift: number;
  orphanRows: number;
  unresolvedWorkshopResidue: number;
  blocked: number;
  review: number;
  held: number;
  stale: number;
};

export type BrandControlTowerRow = {
  brandId: string;
  brand: string;
  slug: string | null;
  seeded: boolean;
  stage: Stage;
  health: Health;
  recentMovement: Movement;
  progressScore: number;
  lastMeaningfulUpdate: string | null;
  nextLane: string;
  counts: {
    vehicleFamilies: number;
    vehicleVariants: number;
    wheelFamilies: number;
    wheelVariants: number;
    unresolvedWorkshopResidue: number;
    workshopVehicleResidue: number;
    workshopVehicleVariantResidue: number;
    workshopWheelResidue: number;
    workshopWheelVariantResidue: number;
    workshopBrandResidue: number;
    workshopJunctionResidue: number;
    workshopOtherResidue: number;
  };
  coverage: CoverageBundle;
  queue: QueueComposition;
  debt: CanonicalDebt;
  blockers: string[];
};

export type ControlTowerOverview = {
  refreshedAt: string;
  snapshotVersion: string;
  summary: StageSummary & {
    totalCanonicalBrands: number;
    queue: QueueTotals;
  };
  brands: BrandControlTowerRow[];
  globalRisk: {
    orphanRows: number;
    orphanImageRows: number;
    backlogBrandsWithoutCanonical: string[];
  };
};

type ImageRowLike = {
  url: string;
  image_type: string;
  is_primary?: boolean | null;
  sort_order?: number | null;
  created_at?: string | null;
};

type WorkshopResidueMutable = {
  unresolved: number;
  blocked: number;
  review: number;
  held: number;
  stale: number;
  resolvedThisWeek: number;
  latestTimestamp: number;
  byCategory: {
    brands: number;
    vehicles: number;
    vehicleVariants: number;
    wheels: number;
    wheelVariants: number;
    junctions: number;
    other: number;
  };
  statusBreakdown: Map<string, number>;
};

type PrivateBlurbSignal = {
  blocked: boolean;
  review: boolean;
  held: boolean;
  note: string | null;
};

type MutableBrandAccumulator = {
  brandId: string;
  brand: string;
  slug: string | null;
  latestTimestamp: number;
  lastMeaningfulUpdate: string | null;
  vehicleFamilies: number;
  vehicleVariants: number;
  wheelFamilies: number;
  wheelVariants: number;
  vehicleFamilyCanonResidue: number;
  vehicleVariantCanonResidue: number;
  vehicleFitmentCurrent: number;
  vehicleVariantFitmentCurrent: number;
  wheelFamilyLinkCurrent: number;
  vehicleVariantExactCurrent: number;
  brandMediaCurrent: number;
  brandMediaTotal: number;
  vehicleMediaCurrent: number;
  vehicleMediaTotal: number;
  vehicleVariantMediaCurrent: number;
  vehicleVariantMediaTotal: number;
  wheelMediaCurrent: number;
  wheelMediaTotal: number;
  wheelVariantMediaCurrent: number;
  wheelVariantMediaTotal: number;
  zeroLinkFamilies: number;
  variantsMissingExactLinks: number;
  parentlessWheelVariants: number;
  familiesMissingBoltPattern: number;
  familiesMissingCenterBore: number;
  familiesMissingBoth: number;
  missingBrandLinks: number;
  directFieldImageDrift: number;
  imageNormalizationDrift: number;
  orphanRows: number;
  blocked: number;
  review: number;
  held: number;
  stale: number;
  unresolvedWorkshopResidue: number;
  workshopVehicleResidue: number;
  workshopVehicleVariantResidue: number;
  workshopWheelResidue: number;
  workshopWheelVariantResidue: number;
  workshopBrandResidue: number;
  workshopJunctionResidue: number;
  workshopOtherResidue: number;
  resolvedThisWeek: number;
  statusBreakdown: Map<string, number>;
  blockerNotes: string[];
};

function cleanText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toMetric(current: number, total: number): CoverageMetric {
  return {
    current,
    total,
    percent: total > 0 ? Math.round((current / total) * 100) : 0,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parseTimestamp(value: string | null | undefined) {
  const cleaned = cleanText(value);
  if (!cleaned) return 0;
  const normalized = cleaned
    .replace(" CEST", "+02:00")
    .replace(" CET", "+01:00")
    .replace(" UTC", "Z")
    .replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function compareImageRows<T extends ImageRowLike>(a: T, b: T) {
  const primaryCompare = Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary));
  if (primaryCompare !== 0) return primaryCompare;

  const aSort = typeof a.sort_order === "number" ? a.sort_order : Number.MAX_SAFE_INTEGER;
  const bSort = typeof b.sort_order === "number" ? b.sort_order : Number.MAX_SAFE_INTEGER;
  if (aSort !== bSort) return aSort - bSort;

  return parseTimestamp(b.created_at ?? null) - parseTimestamp(a.created_at ?? null);
}

function buildRowsByEntity<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
  const buckets = new Map<string, T[]>();
  for (const row of rows) {
    const entityId = String(row[key]);
    const bucket = buckets.get(entityId);
    if (bucket) {
      bucket.push(row);
    } else {
      buckets.set(entityId, [row]);
    }
  }
  return buckets;
}

function bestImageByType<T extends ImageRowLike>(rows: T[]) {
  const best = new Map<string, T>();
  for (const row of [...rows].sort(compareImageRows)) {
    if (!best.has(row.image_type)) best.set(row.image_type, row);
  }
  return best;
}

function isPlaceholderMediaUrl(value: string | null | undefined) {
  const cleaned = cleanText(value);
  if (!cleaned) return true;
  const normalized = cleaned.toLowerCase();
  return (
    normalized.includes("placeholder") ||
    normalized.includes("no-image") ||
    normalized.includes("no_image") ||
    normalized.includes("noimage") ||
    normalized.includes("no image") ||
    normalized.endsWith("/placeholder.svg") ||
    normalized.endsWith("placeholder.svg")
  );
}

function hasRealMediaUrl(...values: Array<string | null | undefined>) {
  return values.some((value) => {
    const cleaned = cleanText(value);
    return Boolean(cleaned) && !isPlaceholderMediaUrl(cleaned);
  });
}

function normalizeBrandKey(value: string | null | undefined) {
  const cleaned = cleanText(value);
  if (!cleaned) return null;
  return cleaned
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toDisplayBrandFromKey(key: string) {
  const special: Record<string, string> = {
    vw: "Volkswagen",
    land_rover: "Land Rover",
    alfa_romeo: "Alfa Romeo",
    mercedes: "Mercedes-Benz",
    "944racing": "944 Racing",
  };
  if (special[key]) return special[key];
  return key
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function brandKeyAliases(brand: { slug?: string | null; brand_title?: string | null }) {
  const aliases = new Set<string>();
  const slugKey = normalizeBrandKey(brand.slug);
  const titleKey = normalizeBrandKey(brand.brand_title);
  if (slugKey) aliases.add(slugKey);
  if (titleKey) aliases.add(titleKey);

  const baseCandidates = [...aliases];
  for (const key of baseCandidates) {
    if (key === "volkswagen") aliases.add("vw");
    if (key === "vw") aliases.add("volkswagen");
    if (key === "mercedes_benz") aliases.add("mercedes");
    if (key === "mercedes") aliases.add("mercedes_benz");
  }

  return [...aliases];
}

function workshopTableBrandKey(tableName: string) {
  const stripped = tableName.replace(/^ws_/, "");
  const segments = stripped.split("_");

  if (stripped.startsWith("944racing_")) return "944racing";
  if (stripped.startsWith("alfa_romeo_")) return "alfa_romeo";
  if (stripped.startsWith("land_rover_")) return "land_rover";

  return segments[0] ?? stripped;
}

function workshopCategoryFromTable(tableName: string): keyof WorkshopResidueMutable["byCategory"] {
  if (tableName.endsWith("_vehicle_variants") || tableName.endsWith("_variants")) return "vehicleVariants";
  if (tableName.endsWith("_vehicles") || tableName.endsWith("_models")) return "vehicles";
  if (tableName.endsWith("_wheel_variants")) return "wheelVariants";
  if (tableName.endsWith("_wheels")) return "wheels";
  if (tableName.endsWith("_brands")) return "brands";
  if (tableName.includes("_junction_")) return "junctions";
  return "other";
}

function isResolvedWorkshopStatus(status: string | null | undefined) {
  const normalized = cleanText(status)?.toLowerCase() ?? "";
  if (!normalized) return false;
  return [
    "complete",
    "completed",
    "done",
    "ready for website",
    "ready",
    "resolved",
    "canon",
    "canonical",
    "promoted",
    "merged",
    "linked",
    "published",
    "finished",
  ].some((token) => normalized.includes(token));
}

function classifyWorkshopQueue(status: string | null | undefined) {
  const normalized = cleanText(status)?.toLowerCase() ?? "";
  if (!normalized) return null;
  if (
    ["blocked", "stuck", "missing source", "broken", "error", "failed"].some((token) =>
      normalized.includes(token),
    )
  ) {
    return "blocked" as const;
  }
  if (
    ["held", "hold", "waiting", "paused", "defer"].some((token) =>
      normalized.includes(token),
    )
  ) {
    return "held" as const;
  }
  if (
    ["review", "verify", "verification", "audit", "check", "qa"].some((token) =>
      normalized.includes(token),
    )
  ) {
    return "review" as const;
  }
  return null;
}

function classifyPrivateBlurbSignal(value: string | null | undefined): PrivateBlurbSignal {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return {
      blocked: false,
      review: false,
      held: false,
      note: null,
    };
  }

  const normalized = cleaned.toLowerCase();
  const blocked = normalized.includes("blocked");
  const review = ["review", "verify", "audit", "check"].some((token) => normalized.includes(token));
  const held = ["held", "hold", "waiting", "pause"].some((token) => normalized.includes(token));

  return {
    blocked,
    review,
    held,
    note: blocked || review || held ? cleaned.slice(0, 180) : null,
  };
}

function pushStatus(map: Map<string, number>, label: string) {
  map.set(label, (map.get(label) ?? 0) + 1);
}

function pushUniqueNote(target: string[], note: string) {
  if (target.includes(note)) return;
  target.push(note);
}

async function collectWorkshopResidue(ctx: QueryCtx) {
  const tables = [
    ...WORKSHOP_BRAND_GROUPS.flatMap((brand) =>
      WORKSHOP_CORE_SUFFIXES.map((suffix) => `ws_${brand}_${suffix}`),
    ),
    ...WORKSHOP_EXTRA_TABLES,
  ];

  const tableResults = await Promise.all(
    tables.map(async (tableName) => {
      try {
        const rows = await (ctx.db.query as any)(tableName).collect();
        return { tableName, rows: rows as Array<{ status?: string; imported_at?: string }> };
      } catch {
        return { tableName, rows: [] as Array<{ status?: string; imported_at?: string }> };
      }
    }),
  );

  const residueByBrandKey = new Map<string, WorkshopResidueMutable>();

  for (const { tableName, rows } of tableResults) {
    const brandKey = workshopTableBrandKey(tableName);
    const category = workshopCategoryFromTable(tableName);
    const bucket = residueByBrandKey.get(brandKey) ?? {
      unresolved: 0,
      blocked: 0,
      review: 0,
      held: 0,
      stale: 0,
      resolvedThisWeek: 0,
      latestTimestamp: 0,
      byCategory: {
        brands: 0,
        vehicles: 0,
        vehicleVariants: 0,
        wheels: 0,
        wheelVariants: 0,
        junctions: 0,
        other: 0,
      },
      statusBreakdown: new Map<string, number>(),
    };

    for (const row of rows) {
      const importedTimestamp = parseTimestamp(row.imported_at ?? null);
      bucket.latestTimestamp = Math.max(bucket.latestTimestamp, importedTimestamp);
      bucket.byCategory[category] += 1;

      const statusLabel = cleanText(row.status) ?? "Unlabelled";
      pushStatus(bucket.statusBreakdown, statusLabel);

      if (isResolvedWorkshopStatus(row.status ?? null)) {
        if (importedTimestamp && Date.now() - importedTimestamp <= RECENT_WINDOW_MS) {
          bucket.resolvedThisWeek += 1;
        }
        continue;
      }

      bucket.unresolved += 1;
      const queueBucket = classifyWorkshopQueue(row.status ?? null);
      if (queueBucket === "blocked") bucket.blocked += 1;
      if (queueBucket === "review") bucket.review += 1;
      if (queueBucket === "held") bucket.held += 1;
      if (importedTimestamp && Date.now() - importedTimestamp >= STALE_WINDOW_MS) {
        bucket.stale += 1;
      }
    }

    residueByBrandKey.set(brandKey, bucket);
  }

  return residueByBrandKey;
}

function queueHealthPercent(unresolved: number, blocked: number, review: number, held: number, stale: number) {
  if (unresolved === 0) return 100;

  const unresolvedPressure = Math.min(24, unresolved * 1.25);
  const blockedRatio = blocked / unresolved;
  const reviewRatio = review / unresolved;
  const heldRatio = held / unresolved;
  const staleRatio = stale / unresolved;

  const score =
    100 -
    unresolvedPressure -
    blockedRatio * 42 -
    reviewRatio * 18 -
    heldRatio * 26 -
    staleRatio * 22;

  return clamp(Math.round(score), 0, 100);
}

function progressStage(
  counts: MutableBrandAccumulator,
  coverage: CoverageBundle,
): Stage {
  const hasAnyCanonical =
    counts.vehicleFamilies > 0 ||
    counts.vehicleVariants > 0 ||
    counts.wheelFamilies > 0 ||
    counts.wheelVariants > 0;

  if (!hasAnyCanonical) return "Seeded";
  if (coverage.vehicleFamilyCanon.percent < 95 || coverage.vehicleVariantCanon.percent < 95) {
    return "Vehicle Canon";
  }
  if (coverage.familyFitment.percent < 95 || coverage.variantFitment.percent < 95) {
    return "Fitment";
  }
  if (coverage.familyWheelLinks.percent < 95) {
    return "Family Links";
  }
  if (coverage.exactVariantLinks.percent < 95) {
    return "Exact Links";
  }
  if (coverage.media.percent < 95) {
    return "Media Polish";
  }
  return "Complete";
}

function progressHealth(progressScore: number, queue: QueueComposition): Health {
  if (progressScore === 0 && queue.unresolvedResidue === 0) return "idle";
  if (queue.blocked > 0 || progressScore < 40) return "critical";
  if (queue.stale > 0 || queue.review > 0 || queue.held > 0 || progressScore < 75) return "watch";
  return "healthy";
}

function movementTrend(latestTimestamp: number, progressScore: number, queue: QueueComposition): Movement {
  if (!latestTimestamp) return "quiet";
  const age = Date.now() - latestTimestamp;

  if (age <= RECENT_WINDOW_MS) {
    if (queue.blocked > 0 || queue.stale > 0) return "at-risk";
    if (progressScore >= 65) return "improving";
    return "steady";
  }

  if (age <= STALE_WINDOW_MS) {
    return queue.blocked > 0 ? "at-risk" : "steady";
  }

  return queue.unresolvedResidue > 0 ? "quiet" : "steady";
}

function stageNextLane(stage: Stage, queue: QueueComposition, debt: CanonicalDebt) {
  if (queue.blocked > 0) return "Unblock queue";
  if (debt.parentlessWheelVariants > 0) return "Repair parent wheel chains";
  switch (stage) {
    case "Seeded":
      return "Seed vehicle canon";
    case "Vehicle Canon":
      return "Promote vehicle canon";
    case "Fitment":
      return "Backfill fitment";
    case "Family Links":
      return "Build family wheel links";
    case "Exact Links":
      return "Link exact variants";
    case "Media Polish":
      return "Normalize media";
    case "Complete":
      return "Watch drift";
  }
}

function blockersForBrand(row: {
  debt: CanonicalDebt;
  queue: QueueComposition;
  coverage: CoverageBundle;
}) {
  const blockers: string[] = [];

  if (row.queue.blocked > 0) blockers.push(`${row.queue.blocked} blocked queue items`);
  if (row.debt.parentlessWheelVariants > 0) blockers.push(`${row.debt.parentlessWheelVariants} parentless wheel variants`);
  if (row.debt.zeroLinkFamilies > 0) blockers.push(`${row.debt.zeroLinkFamilies} zero-link wheel families`);
  if (row.debt.variantsMissingExactLinks > 0) blockers.push(`${row.debt.variantsMissingExactLinks} vehicle variants missing exact links`);
  if (row.debt.familiesMissingBoth > 0) blockers.push(`${row.debt.familiesMissingBoth} vehicle families missing both bolt pattern and center bore`);
  if (row.coverage.media.percent < 95) blockers.push(`${100 - row.coverage.media.percent}% media debt`);
  if (row.debt.missingBrandLinks > 0) blockers.push(`${row.debt.missingBrandLinks} entities missing brand links`);
  if (row.queue.stale > 0) blockers.push(`${row.queue.stale} stale queue items`);

  return blockers.slice(0, 5);
}

function snapshotVersion() {
  return "control-tower-v1";
}

export async function buildOverview(ctx: QueryCtx): Promise<ControlTowerOverview> {
  const [
    brands,
    vehicles,
    vehicleVariants,
    wheels,
    wheelVariants,
    vehicleBrandLinks,
    wheelBrandLinks,
    vehicleVariantBrandLinks,
    familyWheelLinks,
    exactVariantLinks,
    vehicleBoltPatternLinks,
    vehicleCenterBoreLinks,
    vehicleVariantBoltPatternLinks,
    vehicleVariantCenterBoreLinks,
    brandImages,
    vehicleImages,
    wheelImages,
    wheelVariantImages,
    workshopResidueByBrandKey,
  ] = await Promise.all([
    ctx.db.query("oem_brands").collect(),
    ctx.db.query("oem_vehicles").collect(),
    ctx.db.query("oem_vehicle_variants").collect(),
    ctx.db.query("oem_wheels").collect(),
    ctx.db.query("oem_wheel_variants").collect(),
    ctx.db.query("j_vehicle_brand").collect(),
    ctx.db.query("j_wheel_brand").collect(),
    ctx.db.query("j_oem_vehicle_variant_brand").collect(),
    ctx.db.query("j_wheel_vehicle").collect(),
    ctx.db.query("j_oem_vehicle_variant_wheel_variant").collect(),
    ctx.db.query("j_vehicle_bolt_pattern").collect(),
    ctx.db.query("j_vehicle_center_bore").collect(),
    ctx.db.query("j_oem_vehicle_variant_bolt_pattern").collect(),
    ctx.db.query("j_oem_vehicle_variant_center_bore").collect(),
    ctx.db.query("oem_brand_images").collect(),
    ctx.db.query("oem_vehicle_images").collect(),
    ctx.db.query("oem_wheel_images").collect(),
    ctx.db.query("oem_wheel_variant_images").collect(),
    collectWorkshopResidue(ctx),
  ]);

  const brandKeyToBrandId = new Map<string, string>();
  const brandIdToAccumulator = new Map<string, MutableBrandAccumulator>();

  for (const brand of brands) {
    const brandId = String(brand._id);
    const latestTimestamp = Math.max(parseTimestamp(brand.updated_at), parseTimestamp(brand.created_at));
    const accumulator: MutableBrandAccumulator = {
      brandId,
      brand: cleanText(brand.brand_title) ?? cleanText(brand.slug) ?? "Untitled Brand",
      slug: cleanText(brand.slug),
      latestTimestamp,
      lastMeaningfulUpdate: cleanText(brand.updated_at) ?? cleanText(brand.created_at),
      vehicleFamilies: 0,
      vehicleVariants: 0,
      wheelFamilies: 0,
      wheelVariants: 0,
      vehicleFamilyCanonResidue: 0,
      vehicleVariantCanonResidue: 0,
      vehicleFitmentCurrent: 0,
      vehicleVariantFitmentCurrent: 0,
      wheelFamilyLinkCurrent: 0,
      vehicleVariantExactCurrent: 0,
      brandMediaCurrent: 0,
      brandMediaTotal: 1,
      vehicleMediaCurrent: 0,
      vehicleMediaTotal: 0,
      vehicleVariantMediaCurrent: 0,
      vehicleVariantMediaTotal: 0,
      wheelMediaCurrent: 0,
      wheelMediaTotal: 0,
      wheelVariantMediaCurrent: 0,
      wheelVariantMediaTotal: 0,
      zeroLinkFamilies: 0,
      variantsMissingExactLinks: 0,
      parentlessWheelVariants: 0,
      familiesMissingBoltPattern: 0,
      familiesMissingCenterBore: 0,
      familiesMissingBoth: 0,
      missingBrandLinks: 0,
      directFieldImageDrift: 0,
      imageNormalizationDrift: 0,
      orphanRows: 0,
      blocked: 0,
      review: 0,
      held: 0,
      stale: 0,
      unresolvedWorkshopResidue: 0,
      workshopVehicleResidue: 0,
      workshopVehicleVariantResidue: 0,
      workshopWheelResidue: 0,
      workshopWheelVariantResidue: 0,
      workshopBrandResidue: 0,
      workshopJunctionResidue: 0,
      workshopOtherResidue: 0,
      resolvedThisWeek: 0,
      statusBreakdown: new Map<string, number>(),
      blockerNotes: [],
    };

    brandIdToAccumulator.set(brandId, accumulator);
    for (const alias of brandKeyAliases(brand)) {
      brandKeyToBrandId.set(alias, brandId);
    }
  }

  const brandImagesByBrandId = buildRowsByEntity(brandImages, "brand_id");
  const vehicleImagesByVehicleId = buildRowsByEntity(vehicleImages, "vehicle_id");
  const wheelImagesByWheelId = buildRowsByEntity(wheelImages, "wheel_id");
  const wheelVariantImagesByVariantId = buildRowsByEntity(wheelVariantImages, "variant_id");

  const vehicleBrandIdByVehicleId = new Map<string, string>();
  const wheelBrandIdByWheelId = new Map<string, string>();

  for (const link of vehicleBrandLinks) {
    vehicleBrandIdByVehicleId.set(String(link.vehicle_id), String(link.brand_id));
  }
  for (const wheel of wheels) {
    if (wheel.brand_id) {
      wheelBrandIdByWheelId.set(String(wheel._id), String(wheel.brand_id));
    }
  }
  for (const link of wheelBrandLinks) {
    if (!wheelBrandIdByWheelId.has(String(link.wheel_id))) {
      wheelBrandIdByWheelId.set(String(link.wheel_id), String(link.brand_id));
    }
  }

  const vehicleVariantBrandIdByVariantId = new Map<string, string>();
  const wheelVariantBrandIdByVariantId = new Map<string, string>();

  for (const vehicle of vehicles) {
    if (vehicle.brand_id) {
      vehicleBrandIdByVehicleId.set(String(vehicle._id), String(vehicle.brand_id));
    }
  }

  for (const variant of vehicleVariants) {
    const direct = variant.vehicle_id ? vehicleBrandIdByVehicleId.get(String(variant.vehicle_id)) ?? null : null;
    if (direct) vehicleVariantBrandIdByVariantId.set(String(variant._id), direct);
  }
  for (const link of vehicleVariantBrandLinks) {
    if (!vehicleVariantBrandIdByVariantId.has(String(link.variant_id))) {
      vehicleVariantBrandIdByVariantId.set(String(link.variant_id), String(link.brand_id));
    }
  }

  for (const variant of wheelVariants) {
    const direct = variant.brand_id ? String(variant.brand_id) : null;
    const parent = variant.wheel_id ? wheelBrandIdByWheelId.get(String(variant.wheel_id)) ?? null : null;
    const resolved = direct ?? parent;
    if (resolved) wheelVariantBrandIdByVariantId.set(String(variant._id), resolved);
  }

  const vehicleHasBolt = new Set(vehicleBoltPatternLinks.map((row) => String(row.vehicle_id)));
  const vehicleHasCenter = new Set(vehicleCenterBoreLinks.map((row) => String(row.vehicle_id)));
  const vehicleVariantHasBolt = new Set(vehicleVariantBoltPatternLinks.map((row) => String(row.variant_id)));
  const vehicleVariantHasCenter = new Set(vehicleVariantCenterBoreLinks.map((row) => String(row.variant_id)));
  const wheelFamilyLinkCounts = new Map<string, number>();
  const vehicleVariantExactCounts = new Map<string, number>();
  const wheelVariantExactCounts = new Map<string, number>();

  let orphanRows = 0;
  let orphanImageRows = 0;

  for (const link of familyWheelLinks) {
    const wheelId = String(link.wheel_id);
    wheelFamilyLinkCounts.set(wheelId, (wheelFamilyLinkCounts.get(wheelId) ?? 0) + 1);
    const wheelBrandId = wheelBrandIdByWheelId.get(wheelId) ?? null;
    const vehicleBrandId = vehicleBrandIdByVehicleId.get(String(link.vehicle_id)) ?? null;
    if (!wheelBrandId || !vehicleBrandId) {
      orphanRows += 1;
    }
  }

  for (const link of exactVariantLinks) {
    const vehicleVariantId = String(link.vehicle_variant_id);
    const wheelVariantId = String(link.wheel_variant_id);
    vehicleVariantExactCounts.set(vehicleVariantId, (vehicleVariantExactCounts.get(vehicleVariantId) ?? 0) + 1);
    wheelVariantExactCounts.set(wheelVariantId, (wheelVariantExactCounts.get(wheelVariantId) ?? 0) + 1);
    if (!vehicleVariantBrandIdByVariantId.get(vehicleVariantId) || !wheelVariantBrandIdByVariantId.get(wheelVariantId)) {
      orphanRows += 1;
    }
  }

  for (const brand of brands) {
    const accumulator = brandIdToAccumulator.get(String(brand._id));
    if (!accumulator) continue;
    const imageRows = brandImagesByBrandId.get(String(brand._id)) ?? [];
    const bestRows = bestImageByType(imageRows);
    const resolvedBrand = cleanText(bestRows.get("brand")?.url) ?? cleanText(brand.brand_image_url);
    const resolvedGood = cleanText(bestRows.get("good")?.url) ?? cleanText(brand.good_pic_url);
    const resolvedBad = cleanText(bestRows.get("bad")?.url) ?? cleanText(brand.bad_pic_url);

    if (hasRealMediaUrl(resolvedBrand, resolvedGood, resolvedBad)) {
      accumulator.brandMediaCurrent += 1;
    }

    const directRoles = [
      { direct: cleanText(brand.brand_image_url), normalized: cleanText(bestRows.get("brand")?.url) },
      { direct: cleanText(brand.good_pic_url), normalized: cleanText(bestRows.get("good")?.url) },
      { direct: cleanText(brand.bad_pic_url), normalized: cleanText(bestRows.get("bad")?.url) },
    ];
    for (const role of directRoles) {
      const directReal = hasRealMediaUrl(role.direct);
      const normalizedReal = hasRealMediaUrl(role.normalized);
      if (directReal !== normalizedReal || (directReal && normalizedReal && role.direct !== role.normalized)) {
        accumulator.directFieldImageDrift += 1;
      }
    }
    if (imageRows.some((row) => !cleanText(row.storage_id) && !row.file_storage_id)) {
      accumulator.imageNormalizationDrift += 1;
    }

    const signal = classifyPrivateBlurbSignal(brand.private_blurb);
    if (signal.blocked) accumulator.blocked += 1;
    if (signal.review) accumulator.review += 1;
    if (signal.held) accumulator.held += 1;
    if ((signal.blocked || signal.review || signal.held) && accumulator.latestTimestamp && Date.now() - accumulator.latestTimestamp >= STALE_WINDOW_MS) {
      accumulator.stale += 1;
    }
    if (signal.note) pushUniqueNote(accumulator.blockerNotes, `Brand: ${signal.note}`);
  }

  for (const vehicle of vehicles) {
    const brandId = vehicle.brand_id ? String(vehicle.brand_id) : vehicleBrandIdByVehicleId.get(String(vehicle._id)) ?? null;
    if (!brandId) {
      orphanRows += 1;
      continue;
    }
    const accumulator = brandIdToAccumulator.get(brandId);
    if (!accumulator) {
      orphanRows += 1;
      continue;
    }

    accumulator.vehicleFamilies += 1;
    accumulator.vehicleMediaTotal += 1;
    accumulator.latestTimestamp = Math.max(
      accumulator.latestTimestamp,
      parseTimestamp(vehicle.updated_at),
      parseTimestamp(vehicle.created_at),
    );
    accumulator.lastMeaningfulUpdate =
      parseTimestamp(vehicle.updated_at) >= parseTimestamp(accumulator.lastMeaningfulUpdate)
        ? cleanText(vehicle.updated_at) ?? accumulator.lastMeaningfulUpdate
        : accumulator.lastMeaningfulUpdate;

    const imageRows = vehicleImagesByVehicleId.get(String(vehicle._id)) ?? [];
    const bestRows = bestImageByType(imageRows);
    const resolvedGood = cleanText(bestRows.get("good")?.url) ?? cleanText(vehicle.good_pic_url);
    const resolvedBad = cleanText(bestRows.get("bad")?.url) ?? cleanText(vehicle.bad_pic_url);
    const resolvedHero = cleanText(bestRows.get("hero")?.url) ?? cleanText(vehicle.vehicle_image);

    if (hasRealMediaUrl(resolvedGood, resolvedBad, resolvedHero)) {
      accumulator.vehicleMediaCurrent += 1;
    }

    const hasBolt = vehicleHasBolt.has(String(vehicle._id));
    const hasCenter = vehicleHasCenter.has(String(vehicle._id));
    if (hasBolt && hasCenter) {
      accumulator.vehicleFitmentCurrent += 1;
    }
    if (!hasBolt) accumulator.familiesMissingBoltPattern += 1;
    if (!hasCenter) accumulator.familiesMissingCenterBore += 1;
    if (!hasBolt && !hasCenter) accumulator.familiesMissingBoth += 1;

    if (!vehicle.brand_id && !vehicleBrandIdByVehicleId.get(String(vehicle._id))) {
      accumulator.missingBrandLinks += 1;
    }

    const directRoles = [
      { direct: cleanText(vehicle.good_pic_url), normalized: cleanText(bestRows.get("good")?.url) },
      { direct: cleanText(vehicle.bad_pic_url), normalized: cleanText(bestRows.get("bad")?.url) },
      { direct: cleanText(vehicle.vehicle_image), normalized: cleanText(bestRows.get("hero")?.url) },
    ];
    for (const role of directRoles) {
      const directReal = hasRealMediaUrl(role.direct);
      const normalizedReal = hasRealMediaUrl(role.normalized);
      if (directReal !== normalizedReal || (directReal && normalizedReal && role.direct !== role.normalized)) {
        accumulator.directFieldImageDrift += 1;
      }
    }
    if (imageRows.some((row) => !cleanText(row.storage_id) && !row.file_storage_id)) {
      accumulator.imageNormalizationDrift += 1;
    }

    const signal = classifyPrivateBlurbSignal(vehicle.private_blurb);
    if (signal.blocked) accumulator.blocked += 1;
    if (signal.review) accumulator.review += 1;
    if (signal.held) accumulator.held += 1;
    if ((signal.blocked || signal.review || signal.held) && parseTimestamp(vehicle.updated_at) && Date.now() - parseTimestamp(vehicle.updated_at) >= STALE_WINDOW_MS) {
      accumulator.stale += 1;
    }
    if (signal.note) {
      pushUniqueNote(
        accumulator.blockerNotes,
        `${cleanText(vehicle.vehicle_title) ?? cleanText(vehicle.model_name) ?? "Vehicle"}: ${signal.note}`,
      );
    }
  }

  for (const variant of vehicleVariants) {
    const brandId =
      vehicleVariantBrandIdByVariantId.get(String(variant._id)) ??
      (variant.vehicle_id ? vehicleBrandIdByVehicleId.get(String(variant.vehicle_id)) ?? null : null);
    if (!brandId) {
      orphanRows += 1;
      continue;
    }
    const accumulator = brandIdToAccumulator.get(brandId);
    if (!accumulator) {
      orphanRows += 1;
      continue;
    }

    accumulator.vehicleVariants += 1;
    accumulator.vehicleVariantMediaTotal += 1;
    accumulator.latestTimestamp = Math.max(accumulator.latestTimestamp, variant._creationTime);
    if (!accumulator.lastMeaningfulUpdate || variant._creationTime > parseTimestamp(accumulator.lastMeaningfulUpdate)) {
      accumulator.lastMeaningfulUpdate = new Date(variant._creationTime).toISOString();
    }

    if (hasRealMediaUrl(variant.good_pic_url, variant.bad_pic_url)) {
      accumulator.vehicleVariantMediaCurrent += 1;
    }
    if (vehicleVariantHasBolt.has(String(variant._id)) && vehicleVariantHasCenter.has(String(variant._id))) {
      accumulator.vehicleVariantFitmentCurrent += 1;
    }
    if ((vehicleVariantExactCounts.get(String(variant._id)) ?? 0) > 0) {
      accumulator.vehicleVariantExactCurrent += 1;
    } else {
      accumulator.variantsMissingExactLinks += 1;
    }

    if (!vehicleVariantBrandIdByVariantId.get(String(variant._id))) {
      accumulator.missingBrandLinks += 1;
    }

    const signal = classifyPrivateBlurbSignal(variant.private_blurb);
    if (signal.blocked) accumulator.blocked += 1;
    if (signal.review) accumulator.review += 1;
    if (signal.held) accumulator.held += 1;
    if ((signal.blocked || signal.review || signal.held) && Date.now() - variant._creationTime >= STALE_WINDOW_MS) {
      accumulator.stale += 1;
    }
    if (signal.note) {
      pushUniqueNote(
        accumulator.blockerNotes,
        `${cleanText(variant.variant_title) ?? cleanText(variant.trim_level) ?? "Vehicle variant"}: ${signal.note}`,
      );
    }
  }

  for (const wheel of wheels) {
    const brandId = wheel.brand_id ? String(wheel.brand_id) : wheelBrandIdByWheelId.get(String(wheel._id)) ?? null;
    if (!brandId) {
      orphanRows += 1;
      continue;
    }
    const accumulator = brandIdToAccumulator.get(brandId);
    if (!accumulator) {
      orphanRows += 1;
      continue;
    }

    accumulator.wheelFamilies += 1;
    accumulator.wheelMediaTotal += 1;
    accumulator.latestTimestamp = Math.max(
      accumulator.latestTimestamp,
      parseTimestamp(wheel.updated_at),
      parseTimestamp(wheel.created_at),
    );
    accumulator.lastMeaningfulUpdate =
      parseTimestamp(wheel.updated_at) >= parseTimestamp(accumulator.lastMeaningfulUpdate)
        ? cleanText(wheel.updated_at) ?? accumulator.lastMeaningfulUpdate
        : accumulator.lastMeaningfulUpdate;

    const imageRows = wheelImagesByWheelId.get(String(wheel._id)) ?? [];
    const bestRows = bestImageByType(imageRows);
    const resolvedGood = cleanText(bestRows.get("good")?.url) ?? cleanText(wheel.good_pic_url);
    const resolvedBad = cleanText(bestRows.get("bad")?.url) ?? cleanText(wheel.bad_pic_url);

    if (hasRealMediaUrl(resolvedGood, resolvedBad)) {
      accumulator.wheelMediaCurrent += 1;
    }
    if ((wheelFamilyLinkCounts.get(String(wheel._id)) ?? 0) > 0) {
      accumulator.wheelFamilyLinkCurrent += 1;
    } else {
      accumulator.zeroLinkFamilies += 1;
    }

    if (!wheel.brand_id && !wheelBrandIdByWheelId.get(String(wheel._id))) {
      accumulator.missingBrandLinks += 1;
    }

    const directRoles = [
      { direct: cleanText(wheel.good_pic_url), normalized: cleanText(bestRows.get("good")?.url) },
      { direct: cleanText(wheel.bad_pic_url), normalized: cleanText(bestRows.get("bad")?.url) },
    ];
    for (const role of directRoles) {
      const directReal = hasRealMediaUrl(role.direct);
      const normalizedReal = hasRealMediaUrl(role.normalized);
      if (directReal !== normalizedReal || (directReal && normalizedReal && role.direct !== role.normalized)) {
        accumulator.directFieldImageDrift += 1;
      }
    }
    if (imageRows.some((row) => !cleanText(row.storage_id) && !row.file_storage_id)) {
      accumulator.imageNormalizationDrift += 1;
    }

    const signal = classifyPrivateBlurbSignal(wheel.private_blurb);
    if (signal.blocked) accumulator.blocked += 1;
    if (signal.review) accumulator.review += 1;
    if (signal.held) accumulator.held += 1;
    if ((signal.blocked || signal.review || signal.held) && parseTimestamp(wheel.updated_at) && Date.now() - parseTimestamp(wheel.updated_at) >= STALE_WINDOW_MS) {
      accumulator.stale += 1;
    }
    if (signal.note) {
      pushUniqueNote(
        accumulator.blockerNotes,
        `${cleanText(wheel.wheel_title) ?? "Wheel family"}: ${signal.note}`,
      );
    }
  }

  for (const variant of wheelVariants) {
    const brandId =
      wheelVariantBrandIdByVariantId.get(String(variant._id)) ??
      (variant.wheel_id ? wheelBrandIdByWheelId.get(String(variant.wheel_id)) ?? null : null);
    if (!brandId) {
      orphanRows += 1;
      continue;
    }
    const accumulator = brandIdToAccumulator.get(brandId);
    if (!accumulator) {
      orphanRows += 1;
      continue;
    }

    accumulator.wheelVariants += 1;
    accumulator.wheelVariantMediaTotal += 1;
    accumulator.latestTimestamp = Math.max(
      accumulator.latestTimestamp,
      parseTimestamp(variant.updated_at),
      parseTimestamp(variant.created_at),
    );
    accumulator.lastMeaningfulUpdate =
      parseTimestamp(variant.updated_at) >= parseTimestamp(accumulator.lastMeaningfulUpdate)
        ? cleanText(variant.updated_at) ?? accumulator.lastMeaningfulUpdate
        : accumulator.lastMeaningfulUpdate;

    const imageRows = wheelVariantImagesByVariantId.get(String(variant._id)) ?? [];
    const bestRows = bestImageByType(imageRows);
    const resolvedGood = cleanText(bestRows.get("good")?.url) ?? cleanText(variant.good_pic_url);
    const resolvedBad = cleanText(bestRows.get("bad")?.url) ?? cleanText(variant.bad_pic_url);

    if (hasRealMediaUrl(resolvedGood, resolvedBad)) {
      accumulator.wheelVariantMediaCurrent += 1;
    }
    if (!variant.wheel_id) {
      accumulator.parentlessWheelVariants += 1;
      accumulator.orphanRows += 1;
    }
    if (!wheelVariantBrandIdByVariantId.get(String(variant._id))) {
      accumulator.missingBrandLinks += 1;
    }

    const directRoles = [
      { direct: cleanText(variant.good_pic_url), normalized: cleanText(bestRows.get("good")?.url) },
      { direct: cleanText(variant.bad_pic_url), normalized: cleanText(bestRows.get("bad")?.url) },
    ];
    for (const role of directRoles) {
      const directReal = hasRealMediaUrl(role.direct);
      const normalizedReal = hasRealMediaUrl(role.normalized);
      if (directReal !== normalizedReal || (directReal && normalizedReal && role.direct !== role.normalized)) {
        accumulator.directFieldImageDrift += 1;
      }
    }
    if (imageRows.some((row) => !cleanText(row.storage_id) && !row.file_storage_id)) {
      accumulator.imageNormalizationDrift += 1;
    }

    const signal = classifyPrivateBlurbSignal(variant.private_blurb);
    if (signal.blocked) accumulator.blocked += 1;
    if (signal.review) accumulator.review += 1;
    if (signal.held) accumulator.held += 1;
    if ((signal.blocked || signal.review || signal.held) && parseTimestamp(variant.updated_at) && Date.now() - parseTimestamp(variant.updated_at) >= STALE_WINDOW_MS) {
      accumulator.stale += 1;
    }
    if (signal.note) {
      pushUniqueNote(
        accumulator.blockerNotes,
        `${cleanText(variant.variant_title) ?? cleanText(variant.wheel_title) ?? "Wheel variant"}: ${signal.note}`,
      );
    }
  }

  for (const [key, residue] of workshopResidueByBrandKey.entries()) {
    const brandId = brandKeyToBrandId.get(key);
    if (!brandId) continue;
    const accumulator = brandIdToAccumulator.get(brandId);
    if (!accumulator) continue;

    accumulator.unresolvedWorkshopResidue += residue.unresolved;
    accumulator.blocked += residue.blocked;
    accumulator.review += residue.review;
    accumulator.held += residue.held;
    accumulator.stale += residue.stale;
    accumulator.resolvedThisWeek += residue.resolvedThisWeek;
    accumulator.workshopBrandResidue += residue.byCategory.brands;
    accumulator.workshopVehicleResidue += residue.byCategory.vehicles;
    accumulator.workshopVehicleVariantResidue += residue.byCategory.vehicleVariants;
    accumulator.workshopWheelResidue += residue.byCategory.wheels;
    accumulator.workshopWheelVariantResidue += residue.byCategory.wheelVariants;
    accumulator.workshopJunctionResidue += residue.byCategory.junctions;
    accumulator.workshopOtherResidue += residue.byCategory.other;
    accumulator.vehicleFamilyCanonResidue += residue.byCategory.vehicles;
    accumulator.vehicleVariantCanonResidue += residue.byCategory.vehicleVariants;

    accumulator.latestTimestamp = Math.max(accumulator.latestTimestamp, residue.latestTimestamp);
    if (!accumulator.lastMeaningfulUpdate || residue.latestTimestamp > parseTimestamp(accumulator.lastMeaningfulUpdate)) {
      accumulator.lastMeaningfulUpdate = residue.latestTimestamp ? new Date(residue.latestTimestamp).toISOString() : accumulator.lastMeaningfulUpdate;
    }

    for (const [status, count] of residue.statusBreakdown.entries()) {
      pushStatus(accumulator.statusBreakdown, status);
      if (count > 0 && classifyWorkshopQueue(status) === "blocked") {
        pushUniqueNote(accumulator.blockerNotes, `Workshop: ${status} (${count})`);
      }
    }
  }

  const backlogBrandsWithoutCanonical = [...workshopResidueByBrandKey.keys()]
    .filter((key) => !brandKeyToBrandId.has(key))
    .map(toDisplayBrandFromKey)
    .sort((a, b) => a.localeCompare(b));

  for (const imageRow of brandImages) {
    if (!brandIdToAccumulator.has(String(imageRow.brand_id))) orphanImageRows += 1;
  }
  for (const imageRow of vehicleImages) {
    if (!vehicleBrandIdByVehicleId.get(String(imageRow.vehicle_id))) orphanImageRows += 1;
  }
  for (const imageRow of wheelImages) {
    if (!wheelBrandIdByWheelId.get(String(imageRow.wheel_id))) orphanImageRows += 1;
  }
  for (const imageRow of wheelVariantImages) {
    if (!wheelVariantBrandIdByVariantId.get(String(imageRow.variant_id))) orphanImageRows += 1;
  }

  const rows = [...brandIdToAccumulator.values()]
    .map((accumulator) => {
      const vehicleFamilyCanon = toMetric(
        accumulator.vehicleFamilies,
        accumulator.vehicleFamilies + accumulator.vehicleFamilyCanonResidue,
      );
      const vehicleVariantCanon = toMetric(
        accumulator.vehicleVariants,
        accumulator.vehicleVariants + accumulator.vehicleVariantCanonResidue,
      );
      const familyFitment = toMetric(accumulator.vehicleFitmentCurrent, accumulator.vehicleFamilies);
      const variantFitment = toMetric(accumulator.vehicleVariantFitmentCurrent, accumulator.vehicleVariants);
      const familyWheelLinks = toMetric(accumulator.wheelFamilyLinkCurrent, accumulator.wheelFamilies);
      const exactVariantLinks = toMetric(accumulator.vehicleVariantExactCurrent, accumulator.vehicleVariants);
      const mediaBrand = toMetric(accumulator.brandMediaCurrent, accumulator.brandMediaTotal);
      const mediaVehicleFamilies = toMetric(accumulator.vehicleMediaCurrent, accumulator.vehicleMediaTotal);
      const mediaVehicleVariants = toMetric(accumulator.vehicleVariantMediaCurrent, accumulator.vehicleVariantMediaTotal);
      const mediaWheelFamilies = toMetric(accumulator.wheelMediaCurrent, accumulator.wheelMediaTotal);
      const mediaWheelVariants = toMetric(accumulator.wheelVariantMediaCurrent, accumulator.wheelVariantMediaTotal);
      const media = toMetric(
        accumulator.brandMediaCurrent +
          accumulator.vehicleMediaCurrent +
          accumulator.vehicleVariantMediaCurrent +
          accumulator.wheelMediaCurrent +
          accumulator.wheelVariantMediaCurrent,
        accumulator.brandMediaTotal +
          accumulator.vehicleMediaTotal +
          accumulator.vehicleVariantMediaTotal +
          accumulator.wheelMediaTotal +
          accumulator.wheelVariantMediaTotal,
      );
      const queueHealthPercentValue = queueHealthPercent(
        accumulator.unresolvedWorkshopResidue,
        accumulator.blocked,
        accumulator.review,
        accumulator.held,
        accumulator.stale,
      );
      const queueHealth = toMetric(queueHealthPercentValue, 100);

      const coverage: CoverageBundle = {
        vehicleFamilyCanon,
        vehicleVariantCanon,
        familyFitment,
        variantFitment,
        familyWheelLinks,
        exactVariantLinks,
        media,
        queueHealth,
        mediaLayers: {
          brands: mediaBrand,
          vehicleFamilies: mediaVehicleFamilies,
          vehicleVariants: mediaVehicleVariants,
          wheelFamilies: mediaWheelFamilies,
          wheelVariants: mediaWheelVariants,
        },
      };

      const queue: QueueComposition = {
        blocked: accumulator.blocked,
        review: accumulator.review,
        held: accumulator.held,
        stale: accumulator.stale,
        unresolvedResidue: accumulator.unresolvedWorkshopResidue,
        resolvedThisWeek: accumulator.resolvedThisWeek,
        statusBreakdown: [...accumulator.statusBreakdown.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([label, count]) => ({ label, count })),
      };

      const debt: CanonicalDebt = {
        zeroLinkFamilies: accumulator.zeroLinkFamilies,
        variantsMissingExactLinks: accumulator.variantsMissingExactLinks,
        parentlessWheelVariants: accumulator.parentlessWheelVariants,
        familiesMissingBoltPattern: accumulator.familiesMissingBoltPattern,
        familiesMissingCenterBore: accumulator.familiesMissingCenterBore,
        familiesMissingBoth: accumulator.familiesMissingBoth,
        entitiesMissingRealMedia:
          media.total - media.current,
        missingBrandLinks: accumulator.missingBrandLinks,
        directFieldImageDrift: accumulator.directFieldImageDrift,
        imageNormalizationDrift: accumulator.imageNormalizationDrift,
        orphanRows: accumulator.orphanRows,
        unresolvedWorkshopResidue: accumulator.unresolvedWorkshopResidue,
        blocked: accumulator.blocked,
        review: accumulator.review,
        held: accumulator.held,
        stale: accumulator.stale,
      };

      const progressScore = Math.round(
        ((familyFitment.percent + variantFitment.percent) / 2) * 0.3 +
          familyWheelLinks.percent * 0.25 +
          exactVariantLinks.percent * 0.2 +
          media.percent * 0.15 +
          queueHealthPercentValue * 0.1,
      );

      const stage = progressStage(accumulator, coverage);
      const health = progressHealth(progressScore, queue);
      const recentMovement = movementTrend(accumulator.latestTimestamp, progressScore, queue);
      const nextLane = stageNextLane(stage, queue, debt);

      return {
        brandId: accumulator.brandId,
        brand: accumulator.brand,
        slug: accumulator.slug,
        seeded: true,
        stage,
        health,
        recentMovement,
        progressScore,
        lastMeaningfulUpdate: accumulator.lastMeaningfulUpdate,
        nextLane,
        counts: {
          vehicleFamilies: accumulator.vehicleFamilies,
          vehicleVariants: accumulator.vehicleVariants,
          wheelFamilies: accumulator.wheelFamilies,
          wheelVariants: accumulator.wheelVariants,
          unresolvedWorkshopResidue: accumulator.unresolvedWorkshopResidue,
          workshopVehicleResidue: accumulator.workshopVehicleResidue,
          workshopVehicleVariantResidue: accumulator.workshopVehicleVariantResidue,
          workshopWheelResidue: accumulator.workshopWheelResidue,
          workshopWheelVariantResidue: accumulator.workshopWheelVariantResidue,
          workshopBrandResidue: accumulator.workshopBrandResidue,
          workshopJunctionResidue: accumulator.workshopJunctionResidue,
          workshopOtherResidue: accumulator.workshopOtherResidue,
        },
        coverage,
        queue,
        debt,
        blockers: [
          ...blockersForBrand({ debt, queue, coverage }),
          ...accumulator.blockerNotes,
        ].slice(0, 6),
      } satisfies BrandControlTowerRow;
    })
    .sort((a, b) => a.brand.localeCompare(b.brand));

  const summary: ControlTowerOverview["summary"] = {
    totalCanonicalBrands: brands.length,
    brandsSeeded: brands.length,
    brandsVehicleComplete: rows.filter(
      (row) =>
        row.coverage.vehicleFamilyCanon.percent >= 95 &&
        row.coverage.vehicleVariantCanon.percent >= 95,
    ).length,
    brandsFitmentComplete: rows.filter(
      (row) =>
        row.coverage.familyFitment.percent >= 95 &&
        row.coverage.variantFitment.percent >= 95,
    ).length,
    brandsFamilyLinkComplete: rows.filter((row) => row.coverage.familyWheelLinks.percent >= 95).length,
    brandsExactLinkReadyOrComplete: rows.filter((row) =>
      ["Exact Links", "Media Polish", "Complete"].includes(row.stage),
    ).length,
    brandsMediaComplete: rows.filter((row) => row.coverage.media.percent >= 95).length,
    queue: {
      blocked: rows.reduce((sum, row) => sum + row.queue.blocked, 0),
      review: rows.reduce((sum, row) => sum + row.queue.review, 0),
      held: rows.reduce((sum, row) => sum + row.queue.held, 0),
      stale: rows.reduce((sum, row) => sum + row.queue.stale, 0),
      newlyImprovedThisWeek: rows.filter((row) => row.recentMovement === "improving").length,
      regressedThisWeek: rows.filter((row) => row.recentMovement === "at-risk").length,
    },
  };

  return {
    refreshedAt: new Date().toISOString(),
    snapshotVersion: snapshotVersion(),
    summary,
    brands: rows,
    globalRisk: {
      orphanRows,
      orphanImageRows,
      backlogBrandsWithoutCanonical,
    },
  };
}
