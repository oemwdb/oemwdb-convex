type BrandSnapshot = {
  brandId: string;
  brand: string;
  slug: string | null;
  updatedAt: string | null;
  vehicleFamilies: number;
  vehicleVariants: number;
  wheelFamilies: number;
  wheelVariants: number;
  wheelVehicleLinks: number;
  exactLinks: number;
  zeroLinkFamilies: number;
  parentlessVariants: number;
  badPicRows: number;
  brandImageCoverage: { current: number; total: number; percent: number };
  vehicleImageCoverage: { current: number; total: number; percent: number };
  vehicleVariantImageCoverage: { current: number; total: number; percent: number };
  wheelImageCoverage: { current: number; total: number; percent: number };
  wheelVariantImageCoverage: { current: number; total: number; percent: number };
  stateScore: number;
};

type BillyDashOverview = {
  brands: BrandSnapshot[];
  refreshedAt: string;
  snapshotVersion: string;
};

type MutableBrandSnapshot = Omit<
  BrandSnapshot,
  | "brandImageCoverage"
  | "vehicleImageCoverage"
  | "vehicleVariantImageCoverage"
  | "wheelImageCoverage"
  | "wheelVariantImageCoverage"
  | "stateScore"
> & {
  latestTimestamp: number;
  brandImageCurrent: number;
  brandImageTotal: number;
  vehicleImageCurrent: number;
  vehicleImageTotal: number;
  vehicleVariantImageCurrent: number;
  vehicleVariantImageTotal: number;
  wheelImageCurrent: number;
  wheelImageTotal: number;
  wheelVariantImageCurrent: number;
  wheelVariantImageTotal: number;
};

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasAnyImage(...values: Array<string | null | undefined>) {
  return values.some((value) => hasText(value));
}

function toRatio(current: number, total: number) {
  return {
    current,
    total,
    percent: total > 0 ? Math.round((current / total) * 100) : 0,
  };
}

function parseTimestamp(value?: string | null) {
  if (!hasText(value)) return 0;
  const normalized = String(value)
    .trim()
    .replace(" CEST", "+02:00")
    .replace(" CET", "+01:00")
    .replace(" UTC", "Z")
    .replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function updateLatest(snapshot: MutableBrandSnapshot, ...values: Array<string | null | undefined>) {
  for (const value of values) {
    const timestamp = parseTimestamp(value);
    if (timestamp > snapshot.latestTimestamp) {
      snapshot.latestTimestamp = timestamp;
      snapshot.updatedAt = value ?? snapshot.updatedAt;
    }
  }
}

function addCount(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function finalizeSnapshot(snapshot: MutableBrandSnapshot): BrandSnapshot {
  const coverageMetrics = [
    toRatio(snapshot.vehicleImageCurrent, snapshot.vehicleImageTotal),
    toRatio(snapshot.wheelImageCurrent, snapshot.wheelImageTotal),
    toRatio(snapshot.wheelVariantImageCurrent, snapshot.wheelVariantImageTotal),
  ];

  const scoredMetrics = coverageMetrics.filter((metric) => metric.total > 0);
  const stateScore = scoredMetrics.length
    ? Math.round(scoredMetrics.reduce((sum, metric) => sum + metric.percent, 0) / scoredMetrics.length)
    : 0;

  return {
    brandId: snapshot.brandId,
    brand: snapshot.brand,
    slug: snapshot.slug,
    updatedAt: snapshot.updatedAt,
    vehicleFamilies: snapshot.vehicleFamilies,
    vehicleVariants: snapshot.vehicleVariants,
    wheelFamilies: snapshot.wheelFamilies,
    wheelVariants: snapshot.wheelVariants,
    wheelVehicleLinks: snapshot.wheelVehicleLinks,
    exactLinks: snapshot.exactLinks,
    zeroLinkFamilies: snapshot.zeroLinkFamilies,
    parentlessVariants: snapshot.parentlessVariants,
    badPicRows: snapshot.badPicRows,
    brandImageCoverage: toRatio(snapshot.brandImageCurrent, snapshot.brandImageTotal),
    vehicleImageCoverage: toRatio(snapshot.vehicleImageCurrent, snapshot.vehicleImageTotal),
    vehicleVariantImageCoverage: toRatio(snapshot.vehicleVariantImageCurrent, snapshot.vehicleVariantImageTotal),
    wheelImageCoverage: toRatio(snapshot.wheelImageCurrent, snapshot.wheelImageTotal),
    wheelVariantImageCoverage: toRatio(snapshot.wheelVariantImageCurrent, snapshot.wheelVariantImageTotal),
    stateScore,
  };
}

export async function buildOverview(ctx: any): Promise<BillyDashOverview> {
  const [
    brands,
    vehicles,
    vehicleVariants,
    wheels,
    wheelVariants,
    wheelVehicleLinks,
    exactLinks,
  ] = await Promise.all([
    ctx.db.query("oem_brands").collect(),
    ctx.db.query("oem_vehicles").collect(),
    ctx.db.query("oem_vehicle_variants").collect(),
    ctx.db.query("oem_wheels").collect(),
    ctx.db.query("oem_wheel_variants").collect(),
    ctx.db.query("j_wheel_vehicle").collect(),
    ctx.db.query("j_oem_vehicle_variant_wheel_variant").collect(),
  ]);

  const vehicleBrandById = new Map<string, string>();
  for (const vehicle of vehicles) {
    if (vehicle.brand_id) vehicleBrandById.set(String(vehicle._id), String(vehicle.brand_id));
  }

  const wheelBrandById = new Map<string, string>();
  for (const wheel of wheels) {
    if (wheel.brand_id) wheelBrandById.set(String(wheel._id), String(wheel.brand_id));
  }

  const vehicleVariantBrandById = new Map<string, string>();
  for (const variant of vehicleVariants) {
    const brandId = vehicleBrandById.get(String(variant.vehicle_id));
    if (brandId) vehicleVariantBrandById.set(String(variant._id), brandId);
  }

  const wheelVariantBrandById = new Map<string, string>();
  for (const variant of wheelVariants) {
    const directBrandId = variant.brand_id ? String(variant.brand_id) : null;
    const parentBrandId = variant.wheel_id ? wheelBrandById.get(String(variant.wheel_id)) ?? null : null;
    const brandId = directBrandId ?? parentBrandId;
    if (brandId) wheelVariantBrandById.set(String(variant._id), brandId);
  }

  const wheelLinkCounts = new Map<string, number>();
  for (const link of wheelVehicleLinks) {
    addCount(wheelLinkCounts, String(link.wheel_id));
  }

  const snapshots = new Map<string, MutableBrandSnapshot>();
  for (const brand of brands) {
    const brandId = String(brand._id);
    snapshots.set(brandId, {
      brandId,
      brand: brand.brand_title?.trim() || brand.slug?.trim() || "Untitled Brand",
      slug: brand.slug ?? null,
      updatedAt: brand.updated_at ?? brand.created_at ?? null,
      latestTimestamp: Math.max(parseTimestamp(brand.updated_at), parseTimestamp(brand.created_at)),
      vehicleFamilies: 0,
      vehicleVariants: 0,
      wheelFamilies: 0,
      wheelVariants: 0,
      wheelVehicleLinks: 0,
      exactLinks: 0,
      zeroLinkFamilies: 0,
      parentlessVariants: 0,
      badPicRows: 0,
      brandImageCurrent: hasAnyImage(brand.good_pic_url, brand.bad_pic_url, brand.brand_image_url) ? 1 : 0,
      brandImageTotal: 1,
      vehicleImageCurrent: 0,
      vehicleImageTotal: 0,
      vehicleVariantImageCurrent: 0,
      vehicleVariantImageTotal: 0,
      wheelImageCurrent: 0,
      wheelImageTotal: 0,
      wheelVariantImageCurrent: 0,
      wheelVariantImageTotal: 0,
    });
  }

  for (const vehicle of vehicles) {
    const brandId = vehicle.brand_id ? String(vehicle.brand_id) : null;
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;

    snapshot.vehicleFamilies += 1;
    snapshot.vehicleImageTotal += 1;
    if (hasAnyImage(vehicle.good_pic_url, vehicle.bad_pic_url, vehicle.vehicle_image)) {
      snapshot.vehicleImageCurrent += 1;
    }
    if (hasText(vehicle.bad_pic_url)) snapshot.badPicRows += 1;
    updateLatest(snapshot, vehicle.updated_at, vehicle.created_at);
  }

  for (const variant of vehicleVariants) {
    const brandId = vehicleBrandById.get(String(variant.vehicle_id));
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;

    snapshot.vehicleVariants += 1;
    snapshot.vehicleVariantImageTotal += 1;
    if (hasAnyImage(variant.good_pic_url, variant.bad_pic_url)) {
      snapshot.vehicleVariantImageCurrent += 1;
    }
    if (hasText(variant.bad_pic_url)) snapshot.badPicRows += 1;
    updateLatest(snapshot, new Date(variant._creationTime).toISOString());
  }

  for (const wheel of wheels) {
    const brandId = wheel.brand_id ? String(wheel.brand_id) : null;
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;

    snapshot.wheelFamilies += 1;
    snapshot.wheelImageTotal += 1;
    if (hasAnyImage(wheel.good_pic_url, wheel.bad_pic_url)) {
      snapshot.wheelImageCurrent += 1;
    }
    if ((wheelLinkCounts.get(String(wheel._id)) ?? 0) === 0) {
      snapshot.zeroLinkFamilies += 1;
    }
    if (hasText(wheel.bad_pic_url)) snapshot.badPicRows += 1;
    updateLatest(snapshot, wheel.updated_at, wheel.created_at);
  }

  for (const variant of wheelVariants) {
    const brandId = wheelVariantBrandById.get(String(variant._id));
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;

    snapshot.wheelVariants += 1;
    snapshot.wheelVariantImageTotal += 1;
    if (hasAnyImage(variant.good_pic_url, variant.bad_pic_url)) {
      snapshot.wheelVariantImageCurrent += 1;
    }
    if (!variant.wheel_id) snapshot.parentlessVariants += 1;
    if (hasText(variant.bad_pic_url)) snapshot.badPicRows += 1;
    updateLatest(snapshot, variant.updated_at, variant.created_at);
  }

  for (const link of wheelVehicleLinks) {
    const brandId =
      wheelBrandById.get(String(link.wheel_id)) ??
      vehicleBrandById.get(String(link.vehicle_id)) ??
      null;
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;
    snapshot.wheelVehicleLinks += 1;
  }

  for (const link of exactLinks) {
    const brandId =
      wheelVariantBrandById.get(String(link.wheel_variant_id)) ??
      vehicleVariantBrandById.get(String(link.vehicle_variant_id)) ??
      null;
    if (!brandId) continue;
    const snapshot = snapshots.get(brandId);
    if (!snapshot) continue;
    snapshot.exactLinks += 1;
  }

  const brandSnapshots = Array.from(snapshots.values())
    .map(finalizeSnapshot)
    .sort((a, b) => a.brand.localeCompare(b.brand));

  return {
    brands: brandSnapshots,
    refreshedAt: new Date().toISOString(),
    snapshotVersion: "v2",
  };
}

export const SNAPSHOT_KEY = "billy_dash";
