import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface OemVehicleRow {
  _id: string;
  id?: string;
  vehicle_title?: string | null;
  model_name?: string | null;
  generation?: string | null;
  chassis_code?: string | null;
  brand_name?: string | null;
  brand_id?: string | null;
  vehicle_image?: string | null;
  production_years?: string | null;
  bolt_pattern?: string | null;
  center_bore?: string | null;
  bolt_pattern_ref?: unknown;
  center_bore_ref?: unknown;
  wheel_diameter_ref?: unknown;
  wheel_width_ref?: unknown;
}

export function useVehicles() {
  const data = useQuery(api.queries.vehiclesGetAllWithBrands, {});

  return {
    data: (data ?? []) as OemVehicleRow[],
    isLoading: data === undefined,
    error: null as unknown,
    isError: false,
  };
}
