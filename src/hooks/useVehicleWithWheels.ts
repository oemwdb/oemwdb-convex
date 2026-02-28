import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface VehicleWithRelations {
  id: string;
  chassis_code: string;
  model_name: string | null;
  formatted_name: string | null;
  brand_name: string | null;
  production_years: string | null;
  platform: string | null;
  engine_details: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  hero_image_url: string | null;
  status: string | null;
  technical_specs: string | null;
  market_info: string | null;
  special_notes: string | null;
  awards: string | null;
  trim_levels: string | null;
  lineage: string | null;
  production_stats: string | null;
  safety_ratings: string | null;
  wheels?: WheelRelation[];
  bolt_pattern_ref?: unknown[];
  center_bore_ref?: unknown[];
  diameter_ref?: unknown[];
  width_ref?: unknown[];
  body_type?: string | null;
  dimensions?: unknown;
  performance?: unknown;
  fuel_economy?: unknown;
  competitors?: string[] | null;
  price_range?: string | null;
}

export interface WheelRelation {
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
  bad_pic_url: string | null;
  is_oem_fitment: boolean;
  fitment_notes: string | null;
}

function mapWheel(
  raw: {
    id: string;
    wheel_title: string;
    brand_id: unknown;
    wheel_offset?: string | null;
    color?: string | null;
    good_pic_url?: string | null;
  },
  brandName: string | null
): WheelRelation {
  return {
    id: raw.id,
    wheel_name: raw.wheel_title ?? "",
    brand_name: brandName,
    diameter: null,
    width: null,
    bolt_pattern: null,
    center_bore: null,
    wheel_offset: raw.wheel_offset ?? null,
    color: raw.color ?? null,
    good_pic_url: raw.good_pic_url ?? null,
    bad_pic_url: null,
    is_oem_fitment: true,
    fitment_notes: null,
  };
}

export function useVehicleWithWheels(vehicleId: string) {
  const vehicle = useQuery(
    api.queries.vehiclesGetById,
    vehicleId ? { id: vehicleId } : "skip"
  );
  const vehicleConvexId = vehicle?._id;
  const wheelsData = useQuery(
    api.queries.getWheelsByVehicle,
    vehicleConvexId ? { vehicleId: vehicleConvexId } : "skip"
  );
  const brandsData = useQuery(
    api.queries.brandsGetAll,
    vehicleId ? {} : "skip"
  );

  const brandMap = new Map(
    (brandsData ?? []).map((b) => [b._id, b])
  );

  const wheels: WheelRelation[] =
    wheelsData && brandsData
      ? wheelsData.map((w) =>
          mapWheel(w, brandMap.get(w.brand_id)?.brand_title ?? null)
        )
      : [];

  const data: VehicleWithRelations | null | undefined =
    !vehicleId
      ? null
      : vehicle === undefined ||
        (!!vehicleConvexId && wheelsData === undefined) ||
        (vehicleId && brandsData === undefined)
        ? undefined
        : vehicle
          ? {
              id: vehicle.id,
              chassis_code: vehicle.vehicle_id_only ?? "",
              model_name: vehicle.model_name ?? null,
              formatted_name: vehicle.vehicle_title ?? null,
              brand_name: brandMap.get(vehicle.brand_id)?.brand_title ?? null,
              production_years: vehicle.production_years ?? null,
              platform: null,
              engine_details: null,
              bolt_pattern: null,
              center_bore: null,
              hero_image_url: vehicle.vehicle_image ?? null,
              status: null,
              technical_specs: null,
              market_info: null,
              special_notes: null,
              awards: null,
              trim_levels: null,
              lineage: null,
              production_stats: vehicle.production_stats ?? null,
              safety_ratings: null,
              wheels,
              bolt_pattern_ref: [],
              center_bore_ref: [],
              diameter_ref: [],
              width_ref: [],
              body_type: null,
              dimensions: null,
              performance: null,
              fuel_economy: null,
              competitors: null,
              price_range: null,
            }
          : null;

  const isLoading =
    !!vehicleId &&
    (vehicle === undefined ||
      (!!vehicleConvexId && wheelsData === undefined) ||
      (!!vehicle && brandsData === undefined));

  return {
    data: data ?? null,
    isLoading,
    error: null,
    isError: false,
  };
}
