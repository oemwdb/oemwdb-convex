import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface VehicleVariant {
  id: string;
  vehicle_id: string;
  model_name: string;
  year_start: number | null;
  year_end: number | null;
  engine_summary: string | null;
  power_summary: string | null;
  body_type: string | null;
  search_term: string | null;
}

function mapToVariantShape(
  raw: {
    _id: string;
    vehicle_id: string;
    variant_name: string;
    year_from?: number | null;
    year_to?: number | null;
    engine_id?: string | null;
    trim_level?: string | null;
    market?: string | null;
    notes?: string | null;
  },
  vehicleIdStr: string
): VehicleVariant {
  return {
    id: raw._id,
    vehicle_id: vehicleIdStr,
    model_name: raw.variant_name ?? "",
    year_start: raw.year_from ?? null,
    year_end: raw.year_to ?? null,
    engine_summary: null,
    power_summary: null,
    body_type: raw.trim_level ?? null,
    search_term: raw.variant_name ?? null,
  };
}

export function useVehicleVariants(vehicleId: string) {
  const vehicle = useQuery(
    api.queries.vehiclesGetById,
    vehicleId ? { id: vehicleId } : "skip"
  );
  const vehicleConvexId = vehicle?._id;
  const variantsData = useQuery(
    api.queries.vehicleVariantsGetByVehicle,
    vehicleConvexId ? { vehicleId: vehicleConvexId } : "skip"
  );

  const data: VehicleVariant[] =
    variantsData && vehicleId
      ? variantsData.map((v) => mapToVariantShape(v, vehicleId))
      : [];

  return {
    data,
    isLoading: vehicleId
      ? vehicle === undefined || (!!vehicleConvexId && variantsData === undefined)
      : false,
    error: null,
    isError: false,
  };
}
