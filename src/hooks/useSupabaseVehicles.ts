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
  // JSONB reference fields for card back display
  bolt_pattern_ref?: any;
  center_bore_ref?: any;
  wheel_diameter_ref?: any;
  wheel_width_ref?: any;
}

const fetchVehicles = async () => {
  // Query vehicles directly from oem_vehicles table
  const { data, error } = await supabase
    .from('oem_vehicles' as any)
    .select('*')
    .order('vehicle_title');

  if (error) {
    console.error("[Vehicles Query] Error:", error);
    throw error;
  }

  // Map to expected format with brand_name from brand_ref JSONB
  const vehicles = (data ?? []).map((v: any) => ({
    id: v.id,
    chassis_code: v.vehicle_id_only || v.generation || '',
    model_name: v.model_name,
    vehicle_title: v.vehicle_title,
    brand_name: v.brand_ref?.[0]?.value || 'Unknown',
    brand_id: v.brand_ref?.[0]?.value?.toLowerCase() || null,
    production_years: v.production_years,
    platform: v.platform,
    engine_details: v.oem_engine_ref,
    bolt_pattern: v.bolt_pattern_ref?.[0]?.value || null,
    center_bore: v.center_bore_ref?.[0]?.value || null,
    vehicle_image: v.hero_image_url || v.vehicle_image,
    status: 'active',
    // Include full JSONB refs for card display
    bolt_pattern_ref: v.bolt_pattern_ref,
    center_bore_ref: v.center_bore_ref,
    wheel_diameter_ref: v.diameter_ref,
    wheel_width_ref: v.width_ref
  }));

  console.log("[Vehicles Query] Fetched vehicles:", vehicles.length);
  return vehicles as SupabaseVehicle[];
};

export function useSupabaseVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}