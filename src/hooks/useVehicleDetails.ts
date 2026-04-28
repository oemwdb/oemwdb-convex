import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type VehicleDetailsData = {
  brand: string;
  model: string;
  year: number | undefined;
  brandImageUrl: string | undefined;
  vehicleImageUrl: string | undefined;
  productionYears: string | undefined;
} | null;

export const useVehicleDetails = (
  brandRef?: string,
  vehicleRef?: string
): {
  data: VehicleDetailsData;
  isLoading: boolean;
  error: null;
  isError: false;
} => {
  const brand = useQuery(
    api.queries.brandsGetById,
    brandRef ? { id: brandRef } : "skip"
  );
  const vehicle = useQuery(
    api.queries.vehiclesGetById,
    vehicleRef ? { id: vehicleRef } : "skip"
  );

  const enabled = !!brandRef && !!vehicleRef;
  const isLoading =
    enabled && (brand === undefined || vehicle === undefined);
  const data: VehicleDetailsData | undefined =
    !enabled
      ? null
      : isLoading
        ? undefined
        : brand && vehicle
          ? (() => {
              const yearMatch = vehicle.production_years?.match(/\d{4}/);
              const year = yearMatch ? parseInt(yearMatch[0], 10) : undefined;
              return {
                brand: brand.brand_title,
                model:
                  vehicle.vehicle_title ||
                  vehicle.model_name ||
                  "Unknown Model",
                year,
                brandImageUrl: brand.brand_image_url,
                vehicleImageUrl: vehicle.good_pic_url ?? vehicle.bad_pic_url,
                productionYears: vehicle.production_years,
              };
            })()
          : null;

  return {
    data: data ?? null,
    isLoading,
    error: null,
    isError: false,
  };
};
