import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseBrand } from "./useSupabaseBrands";
import { SupabaseVehicle } from "./useSupabaseVehicles";

export const useVehicleDetails = (brandRef?: string, vehicleRef?: string) => {
  return useQuery({
    queryKey: ["vehicle-details", brandRef, vehicleRef],
    queryFn: async () => {
      if (!brandRef || !vehicleRef) return null;

      const [brandResult, vehicleResult] = await Promise.all([
        supabase.from("oem_brands").select("*").eq("id", brandRef).single(),
        supabase.from("oem_vehicles").select("*").eq("id", vehicleRef).single(),
      ]);

      if (brandResult.error || vehicleResult.error) {
        console.error("Error fetching vehicle details:", brandResult.error || vehicleResult.error);
        return null;
      }

      const brand = brandResult.data as any;
      const vehicle = vehicleResult.data as any;

      // Extract year from production_years
      const yearMatch = vehicle.production_years?.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

      return {
        brand: brand.brand_title,
        model: vehicle.vehicle_title || vehicle.model_name || "Unknown Model",
        year,
        brandImageUrl: brand.brand_image_url,
        vehicleImageUrl: vehicle.vehicle_image,
        productionYears: vehicle.production_years,
      };
    },
    enabled: !!brandRef && !!vehicleRef,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
