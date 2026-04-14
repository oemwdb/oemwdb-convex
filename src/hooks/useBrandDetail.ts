import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface BrandVehicle {
  id: string;
  routeId?: string;
  vehicle_title: string | null;
  generation: string | null;
  chassis_code: string;
  model_name: string | null;
  brand_name: string | null;
  production_years: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  wheel_diameter_ref: string | null;
  wheel_width_ref: string | null;
  vehicle_image: string | null;
  hero_image_url: string | null;
  status: string | null;
}

export interface BrandWheel {
  id: string;
  wheel_name: string;
  brand_name: string | null;
  diameter: string | null;
  width: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  tire_size: string | null;
  wheel_offset: string | null;
  color: string | null;
  good_pic_url: string | null;
  bad_pic_url: string | null;
  status: string | null;
}

export interface BrandEngine {
  id: string;
  family_title: string;
  family_code: string | null;
  brand_ref: string | null;
  linked_vehicle_count: number;
  variant_count: number;
}

export interface BrandColor {
  id: string;
  slug: string;
  color_title: string;
  brand_title: string | null;
  family_title: string | null;
  finish: string | null;
  swatch_hex: string | null;
  wheelCount: number;
  wheelVariantCount: number;
  vehicleCount: number;
  vehicleVariantCount: number;
}

function mapToBrandVehicle(
  raw: {
    _id?: string;
    id?: string;
    slug?: string | null;
    vehicle_id_only?: string | null;
    vehicle_title?: string | null;
    generation?: string | null;
    model_name?: string | null;
    production_years?: string | null;
    bolt_pattern?: string | null;
    center_bore?: string | null;
    text_diameters?: string | null;
    text_widths?: string | null;
    vehicle_image?: string | null;
  },
  brandName: string | null
): BrandVehicle {
  return {
    id: (raw.id ?? raw._id ?? "") as string,
    routeId: (raw.slug ?? raw.id ?? raw._id ?? "") as string,
    vehicle_title: raw.vehicle_title ?? null,
    generation: raw.generation ?? null,
    chassis_code: raw.vehicle_id_only || raw.generation || "",
    model_name: raw.model_name ?? null,
    brand_name: brandName,
    production_years: raw.production_years ?? null,
    bolt_pattern: raw.bolt_pattern ?? null,
    center_bore: raw.center_bore ?? null,
    wheel_diameter_ref: raw.text_diameters ?? null,
    wheel_width_ref: raw.text_widths ?? null,
    vehicle_image: raw.vehicle_image ?? null,
    hero_image_url: raw.vehicle_image ?? null,
    status: "active",
  };
}

function mapToBrandWheel(
  raw: {
    _id?: string;
    id?: string;
    wheel_title?: string | null;
    wheel_name?: string | null;
    diameter?: string | null;
    width?: string | null;
    bolt_pattern?: string | null;
    center_bore?: string | null;
    tire_size?: string | null;
    wheel_offset?: string | null;
    color?: string | null;
    good_pic_url?: string | null;
    bad_pic_url?: string | null;
  },
  brandName: string | null
): BrandWheel {
  return {
    id: (raw.id ?? raw._id ?? "") as string,
    wheel_name: raw.wheel_title ?? raw.wheel_name ?? "",
    brand_name: brandName,
    diameter: raw.diameter ?? null,
    width: raw.width ?? null,
    bolt_pattern: raw.bolt_pattern ?? null,
    center_bore: raw.center_bore ?? null,
    tire_size: raw.tire_size ?? null,
    wheel_offset: raw.wheel_offset ?? null,
    color: raw.color ?? null,
    good_pic_url: raw.good_pic_url ?? null,
    bad_pic_url: raw.bad_pic_url ?? null,
    status: "active",
  };
}

export function useBrandVehicles(brandName: string) {
  const brand = useQuery(
    api.queries.brandsGetByTitle,
    brandName ? { brandTitle: brandName } : "skip"
  );
  const brandId = brand?._id;
  const vehiclesData = useQuery(
    api.queries.vehiclesGetByBrand,
    brandId ? { brandId } : "skip"
  );

  const data: BrandVehicle[] =
    vehiclesData && brand
      ? vehiclesData.map((v) => mapToBrandVehicle(v, brand.brand_title))
      : [];

  return {
    data,
    isLoading: brandName
      ? brand === undefined || (!!brandId && vehiclesData === undefined)
      : false,
    error: null,
    isError: false,
  };
}

export function useBrandWheels(brandName: string) {
  const brand = useQuery(
    api.queries.brandsGetByTitle,
    brandName ? { brandTitle: brandName } : "skip"
  );
  const brandId = brand?._id;
  const wheelsData = useQuery(
    api.queries.wheelsGetByBrand,
    brandId ? { brandId } : "skip"
  );

  const data: BrandWheel[] =
    wheelsData && brand
      ? wheelsData.map((w) => mapToBrandWheel(w, brand.brand_title))
      : [];

  return {
    data,
    isLoading: brandName
      ? brand === undefined || (!!brandId && wheelsData === undefined)
      : false,
    error: null,
    isError: false,
  };
}

export function useBrandEngines(brandName: string) {
  const hasBrand = Boolean(brandName.trim());
  const raw = useQuery(api.queries.engineFamiliesBrowse);
  const normalized = brandName.trim().toLowerCase();
  const data: BrandEngine[] = hasBrand
    ? (raw ?? [])
    .filter((row: any) => String(row.brand_ref ?? "").toLowerCase().includes(normalized))
    .map((row: any) => ({
      id: row.id,
      family_title: row.family_title,
      family_code: row.family_code ?? null,
      brand_ref: row.brand_ref ?? null,
      linked_vehicle_count: row.linked_vehicle_count ?? 0,
      variant_count: row.variant_count ?? 0,
    }))
    : [];

  return {
    data,
    isLoading: hasBrand ? raw === undefined : false,
    error: null,
    isError: false,
  };
}

export function useBrandColors(brandName: string) {
  const hasBrand = Boolean(brandName.trim());
  const colors = useQuery(api.colors.collectionGet);
  const normalized = brandName.trim().toLowerCase();
  const rawColors = Array.isArray(colors)
    ? colors
    : Array.isArray((colors as { items?: unknown[] } | undefined)?.items)
      ? ((colors as { items?: unknown[] }).items as any[])
      : [];
  const data: BrandColor[] = hasBrand
    ? Array.from(
        rawColors
          .filter((color: any) => {
            const titles = [
              color?.brand_title,
              ...(Array.isArray(color?.brand_titles) ? color.brand_titles : []),
            ]
              .map((value) => String(value ?? "").trim().toLowerCase())
              .filter(Boolean);

            return titles.includes(normalized);
          })
          .reduce((map, color: any) => {
            const canonicalId = String(color?.color_id ?? color?._id ?? color?.id ?? color?.slug ?? color?.color_title ?? "");
            if (!canonicalId) return map;

            if (!map.has(canonicalId)) {
              map.set(canonicalId, {
                id: canonicalId,
                slug: String(color?.slug ?? color?.color_id ?? color?.id ?? color?._id ?? color?.color_title ?? canonicalId),
                color_title: color?.color_title ?? color?.color ?? "",
                brand_title: color?.brand_title ?? null,
                family_title: color?.family_title ?? null,
                finish: color?.finish ?? null,
                swatch_hex: color?.swatch_hex ?? null,
                wheelCount: color?.wheelCount ?? 0,
                wheelVariantCount: color?.wheelVariantCount ?? 0,
                vehicleCount: color?.vehicleCount ?? 0,
                vehicleVariantCount: color?.vehicleVariantCount ?? 0,
              } satisfies BrandColor);
            }

            return map;
          }, new Map<string, BrandColor>())
          .values()
      )
    : [];

  return {
    data,
    isLoading: hasBrand ? colors === undefined : false,
    error: null,
    isError: false,
  };
}
