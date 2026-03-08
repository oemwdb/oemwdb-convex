import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface BrandVehicle {
  id: string;
  chassis_code: string;
  model_name: string | null;
  brand_name: string | null;
  production_years: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
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
  wheel_offset: string | null;
  color: string | null;
  good_pic_url: string | null;
  status: string | null;
}

function mapToBrandVehicle(
  raw: {
    _id?: string;
    id?: string;
    vehicle_id_only?: string | null;
    generation?: string | null;
    model_name?: string | null;
    production_years?: string | null;
    vehicle_image?: string | null;
  },
  brandName: string | null
): BrandVehicle {
  return {
    id: (raw.id ?? raw._id ?? "") as string,
    chassis_code: raw.vehicle_id_only || raw.generation || "",
    model_name: raw.model_name ?? null,
    brand_name: brandName,
    production_years: raw.production_years ?? null,
    bolt_pattern: null,
    center_bore: null,
    hero_image_url: raw.vehicle_image ?? null,
    status: "active",
  };
}

function mapToBrandWheel(
  raw: {
    _id?: string;
    id?: string;
    wheel_title: string;
    good_pic_url?: string | null;
  },
  brandName: string | null
): BrandWheel {
  return {
    id: (raw.id ?? raw._id ?? "") as string,
    wheel_name: raw.wheel_title ?? "",
    brand_name: brandName,
    diameter: null,
    width: null,
    bolt_pattern: null,
    center_bore: null,
    wheel_offset: null,
    color: null,
    good_pic_url: raw.good_pic_url ?? null,
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
