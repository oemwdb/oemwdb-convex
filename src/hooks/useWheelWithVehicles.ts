import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface WheelWithRelations {
  id: string;
  _id: string;
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
  status: string | null;
  weight: string | null;
  metal_type: string | null;
  part_numbers: string | null;
  notes: string | null;
  specifications?: unknown;
  vehicles?: VehicleRelation[];
  brand_refs?: string[];
  diameter_refs?: string[];
  width_ref?: string[];
  bolt_pattern_refs?: string[];
  center_bore_ref?: string[];
  offset_refs?: string[];
  color_refs?: string[];
  tire_size_refs?: string[];
  vehicle_refs?: unknown;
}

export interface VehicleRelation {
  id: string;
  chassis_code: string | null;
  model_name: string | null;
  vehicle_title: string | null;
  production_years: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  bolt_pattern_ref?: unknown;
  center_bore_ref?: unknown;
  wheel_diameter_ref?: unknown;
  wheel_width_ref?: unknown;
  hero_image_url: string | null;
  brand_name: string | null;
  is_oem_fitment: boolean;
}

function mapVehicle(
  raw: {
    id: string;
    vehicle_id_only?: string | null;
    generation?: string | null;
    model_name?: string | null;
    vehicle_title?: string | null;
    production_years?: string | null;
    vehicle_image?: string | null;
    brand_id: unknown;
  },
  brandName: string | null
): VehicleRelation {
  return {
    id: raw.id,
    chassis_code: raw.vehicle_id_only ?? raw.generation ?? null,
    model_name: raw.model_name ?? null,
    vehicle_title: raw.vehicle_title ?? null,
    production_years: raw.production_years ?? null,
    bolt_pattern: null,
    center_bore: null,
    bolt_pattern_ref: undefined,
    center_bore_ref: undefined,
    wheel_diameter_ref: undefined,
    wheel_width_ref: undefined,
    hero_image_url: raw.vehicle_image ?? null,
    brand_name: brandName,
    is_oem_fitment: true,
  };
}

export function useWheelWithVehicles(wheelId: string) {
  const wheel = useQuery(
    api.queries.wheelsGetById,
    wheelId ? { id: wheelId } : "skip"
  );
  const wheelConvexId = wheel?._id;
  const vehiclesData = useQuery(
    api.queries.getVehiclesByWheel,
    wheelConvexId ? { wheelId: wheelConvexId } : "skip"
  );
  const brandsData = useQuery(
    api.queries.brandsGetAll,
    wheelId ? {} : "skip"
  );

  const brandMap = new Map(
    (brandsData ?? []).map((b) => [b._id, b])
  );

  const vehicles: VehicleRelation[] =
    vehiclesData && brandsData
      ? vehiclesData.map((v) =>
          mapVehicle(v, brandMap.get(v.brand_id)?.brand_title ?? null)
        )
      : [];

  let specifications: unknown = null;
  if (wheel?.specifications_json) {
    try {
      specifications = JSON.parse(wheel.specifications_json) as unknown;
    } catch {
      specifications = null;
    }
  }

  const data: WheelWithRelations | null | undefined =
    !wheelId
      ? null
      : wheel === undefined ||
        (!!wheelConvexId && vehiclesData === undefined) ||
        (!!wheelId && brandsData === undefined)
        ? undefined
        : wheel
          ? {
              id: wheel.id,
              _id: wheel._id,
              wheel_name: wheel.wheel_title ?? "",
              brand_name: brandMap.get(wheel.brand_id)?.brand_title ?? null,
              diameter: null,
              width: null,
              bolt_pattern: null,
              center_bore: null,
              wheel_offset: wheel.wheel_offset ?? null,
              color: wheel.color ?? null,
              good_pic_url: wheel.good_pic_url ?? null,
              bad_pic_url: null,
              status: wheel.good_pic_url ? "Ready for website" : "Needs Good Pic",
              weight: wheel.weight ?? null,
              metal_type: wheel.metal_type ?? null,
              part_numbers: wheel.part_numbers ?? null,
              notes: wheel.notes ?? null,
              specifications,
              vehicles,
              brand_refs: [],
              diameter_refs: [],
              width_ref: [],
              bolt_pattern_refs: [],
              center_bore_ref: [],
              offset_refs: [],
              color_refs: [],
              tire_size_refs: [],
              vehicle_refs: undefined,
            }
          : null;

  const isLoading =
    !!wheelId &&
    (wheel === undefined ||
      (!!wheelConvexId && vehiclesData === undefined) ||
      (!!wheel && brandsData === undefined));

  return {
    data: data ?? null,
    isLoading,
    error: null,
    isError: false,
  };
}

/** Uses same lookup as useWheelWithVehicles (wheel id is the business key). */
export function useWheelByName(wheelName: string) {
  return useWheelWithVehicles(wheelName);
}
