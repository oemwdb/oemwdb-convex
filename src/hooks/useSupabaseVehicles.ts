import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseVehicle {
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
}

const fetchVehicles = async () => {
  // Use the new database function with proper JSONB handling
  const { data, error } = await supabase.rpc('get_vehicles_with_brands');
    
  if (error) {
    console.error("[Vehicles Query] Error:", error);
    throw error;
  }
  
  // Filter to only show vehicles with images
  const vehiclesWithImages = (data ?? []).filter(vehicle => vehicle.vehicle_image);
  
  console.log("[Vehicles Query] Fetched vehicles with brands:", vehiclesWithImages.length);
  return vehiclesWithImages as SupabaseVehicle[];
};

export function useSupabaseVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}