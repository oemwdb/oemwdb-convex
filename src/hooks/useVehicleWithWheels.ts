
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  wheels?: any[];
}

export const fetchVehicleWithWheels = async (vehicleIdentifier: string) => {
  // Convert URL-friendly identifier back to a searchable format
  // e.g., "bmw---e36:-3-series" or "e36:-3-series" -> search for vehicle

  // Decode and clean up the identifier
  const cleanIdentifier = decodeURIComponent(vehicleIdentifier)
    .replace(/-/g, ' ')  // Replace hyphens with spaces
    .trim();

  console.log("[Vehicle Query] Looking for vehicle with identifier:", vehicleIdentifier);
  console.log("[Vehicle Query] Cleaned search term:", cleanIdentifier);

  // Search for the vehicle by vehicle_title, model_name, or chassis_code
  // Use a broader search that will match any part of these fields
  const { data: vehicleData, error: vehicleError } = await supabase
    .from("oem_vehicles" as any)
    .select("*")
    .or(`vehicle_title.ilike.%${cleanIdentifier}%,model_name.ilike.%${cleanIdentifier}%,vehicle_id_only.ilike.%${cleanIdentifier}%`)
    .limit(1)
    .maybeSingle();

  if (vehicleError) {
    console.error("[Vehicle Query] Error:", vehicleError);
    throw vehicleError;
  }

  if (!vehicleData) {
    console.error("[Vehicle Query] No vehicle found for identifier:", vehicleIdentifier);
    return null;
  }

  // Cast to any to access fields
  const vehicle = vehicleData as any;

  // Parse wheel_ref to get associated wheels (simple string array now)
  let associatedWheels: any[] = [];
  if (vehicle.wheel_ref && Array.isArray(vehicle.wheel_ref)) {
    const wheelTitles = vehicle.wheel_ref.filter(Boolean);

    if (wheelTitles.length > 0) {
      const { data: wheelsData, error: wheelsError } = await supabase
        .from("oem_wheels" as any)
        .select("*")
        .in("wheel_title", wheelTitles);

      if (wheelsError) {
        console.error("[Vehicle Wheels Query] Error:", wheelsError);
      } else if (wheelsData) {
        associatedWheels = (wheelsData as any[]).map((wheel: any) => ({
          id: wheel.id,
          wheel_name: wheel.wheel_title,
          brand_name: wheel.brand_ref?.[0] || null,
          diameter: wheel.diameter_ref?.[0] || null,
          width: wheel.width_ref?.[0] || null,
          bolt_pattern: wheel.bolt_pattern_ref?.[0] || null,
          center_bore: wheel.center_bore_ref?.[0] || null,
          wheel_offset: wheel.wheel_offset,
          color: wheel.color || null,
          good_pic_url: wheel.good_pic_url,
          is_oem_fitment: true,
          fitment_notes: null
        }));
      }
    }
  }

  // Map oem_vehicles fields to expected format
  const vehicleWithWheels: VehicleWithRelations = {
    id: vehicle.id,
    chassis_code: vehicle.vehicle_id_only || '',
    model_name: vehicle.model_name,
    formatted_name: vehicle.vehicle_title,
    brand_name: vehicle.brand_ref?.[0] || null,
    production_years: vehicle.production_years,
    platform: null, // Not in oem_vehicles
    engine_details: vehicle.oem_engine_ref,
    bolt_pattern: vehicle.bolt_pattern_ref?.[0] || null,
    center_bore: vehicle.center_bore_ref?.[0] || null,
    hero_image_url: vehicle.hero_image_url,
    status: null, // Not in oem_vehicles
    technical_specs: null, // Not in oem_vehicles
    market_info: null, // Not in oem_vehicles
    special_notes: null, // Not in oem_vehicles
    awards: null, // Not in oem_vehicles
    trim_levels: null, // Not in oem_vehicles
    lineage: null, // Not in oem_vehicles
    production_stats: vehicle.production_stats,
    safety_ratings: null, // Not in oem_vehicles
    wheels: associatedWheels
  };

  console.log("[Vehicle Query] Fetched vehicle with wheels:", vehicleWithWheels);
  return vehicleWithWheels;
};

export function useVehicleWithWheels(chassisCode: string) {
  return useQuery({
    queryKey: ["vehicle-with-wheels", chassisCode],
    queryFn: () => fetchVehicleWithWheels(chassisCode),
    enabled: !!chassisCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
