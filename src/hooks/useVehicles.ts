import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface Vehicle {
  id: string;
  chassis_code: string;
  model_name: string | null;
  vehicle_title: string | null;
  brand_name: string | null;
  brand_id: string | null;
  production_years: string | null;
  platform: string | null;
  engine_details: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  vehicle_image: string | null;
  status: string | null;
  bolt_pattern_ref?: unknown[];
  center_bore_ref?: unknown[];
  wheel_diameter_ref?: unknown[];
  wheel_width_ref?: unknown[];
}

function mapToVehicleShape(raw: {
  id: string;
  vehicle_id_only?: string | null;
  generation?: string | null;
  model_name?: string | null;
  vehicle_title?: string | null;
  brand_name?: string | null;
  brand_id?: string | null;
  production_years?: string | null;
  vehicle_image?: string | null;
  oem_engine_id?: string | null;
}): Vehicle {
  return {
    id: raw.id,
    chassis_code: raw.vehicle_id_only || raw.generation || "",
    model_name: raw.model_name ?? null,
    vehicle_title: raw.vehicle_title ?? null,
    brand_name: raw.brand_name ?? "Unknown",
    brand_id: raw.brand_id ?? null,
    production_years: raw.production_years ?? null,
    platform: null,
    engine_details: null,
    bolt_pattern: null,
    center_bore: null,
    vehicle_image: raw.vehicle_image ?? null,
    status: "active",
    bolt_pattern_ref: [],
    center_bore_ref: [],
    wheel_diameter_ref: [],
    wheel_width_ref: [],
  };
}

export function useVehicles() {
  const data = useQuery(api.queries.vehiclesGetAllWithBrands);

  const vehicles: Vehicle[] = data?.map(mapToVehicleShape) ?? [];

  return {
    data: vehicles,
    isLoading: data === undefined,
    error: null,
    isError: false,
  };
}
