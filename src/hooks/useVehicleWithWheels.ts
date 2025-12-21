
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
  // New detailed specs
  // New detailed specs
  // platform already defined above
  body_type?: string | null;
  dimensions?: any | null;
  performance?: any | null;
  fuel_economy?: any | null;
  competitors?: string[] | null;
  price_range?: string | null;
}

export const fetchVehicleWithWheels = async (vehicleIdentifier: string) => {
  // Convert URL-friendly identifier back to a searchable format
  // e.g., "bmw---e36:-3-series" or "e36:-3-series" -> search for vehicle

  // Decode and clean up the identifier
  // URL format: "rolls-royce---rr11:-phantom-viii" -> need to extract "Phantom VIII"
  let cleanIdentifier = decodeURIComponent(vehicleIdentifier)
    .replace(/-/g, ' ')  // Replace hyphens with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .trim();

  // Extract just the model name part (after the colon if present)
  const colonIndex = cleanIdentifier.indexOf(':');
  const modelPart = colonIndex > -1 ? cleanIdentifier.substring(colonIndex + 1).trim() : cleanIdentifier;

  console.log("[Vehicle Query] Looking for vehicle with identifier:", vehicleIdentifier);
  console.log("[Vehicle Query] Cleaned search term:", cleanIdentifier);
  console.log("[Vehicle Query] Model part:", modelPart);

  // Search for the vehicle - try exact id first, then model name search
  const { data: vehicleData, error: vehicleError } = await supabase
    .from("oem_vehicles" as any)
    .select("*")
    .or(`model_name.ilike.%${modelPart}%,vehicle_title.ilike.%${modelPart}%`)
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

  // Parse wheel_ref to get associated wheels (check both directions)
  let associatedWheels: any[] = [];

  // Method 1: Check if vehicle has wheel_ref pointing to wheels
  if (vehicle.wheel_ref && Array.isArray(vehicle.wheel_ref)) {
    const wheelTitles = vehicle.wheel_ref.filter(Boolean);

    if (wheelTitles.length > 0) {
      const { data: wheelsData } = await supabase
        .from("oem_wheels" as any)
        .select("*")
        .in("wheel_title", wheelTitles);

      if (wheelsData) {
        associatedWheels = (wheelsData as any[]).map((wheel: any) => ({
          id: wheel.id,
          wheel_name: wheel.wheel_title,
          brand_name: wheel.brand_ref?.[0]?.value || wheel.brand_ref?.[0] || null,
          diameter: wheel.diameter_ref?.[0]?.value || wheel.diameter_ref?.[0] || null,
          width: wheel.width_ref?.[0]?.value || wheel.width_ref?.[0] || null,
          bolt_pattern: wheel.bolt_pattern_ref?.[0]?.value || wheel.bolt_pattern_ref?.[0] || null,
          center_bore: wheel.center_bore_ref?.[0]?.value || wheel.center_bore_ref?.[0] || null,
          wheel_offset: wheel.wheel_offset,
          color: wheel.color || null,
          good_pic_url: wheel.good_pic_url,
          bad_pic_url: wheel.bad_pic_url,
          is_oem_fitment: true,
          fitment_notes: null
        }));
      }
    }
  }

  // Method 2: Also check wheels that have this vehicle in their vehicle_ref JSONB
  // This is for the RR-style data where vehicle_ref on wheels contains [{id: "...", title: "..."}]
  console.log("[Vehicle Query] Searching wheels with vehicle_ref containing:", vehicle.id);

  // Use filter with @> operator for JSONB contains
  const containsValue = JSON.stringify([{ id: vehicle.id }]);
  const { data: reverseWheelsData, error: reverseError } = await supabase
    .from("oem_wheels" as any)
    .select("*")
    .filter('vehicle_ref', 'cs', containsValue);

  if (reverseError) {
    console.error("[Vehicle Query] Reverse wheel query error:", reverseError);
  }
  console.log("[Vehicle Query] Found reverse wheels:", reverseWheelsData?.length || 0);

  if (reverseWheelsData && reverseWheelsData.length > 0) {
    const reverseWheels = (reverseWheelsData as any[]).map((wheel: any) => ({
      id: wheel.id,
      wheel_name: wheel.wheel_title,
      brand_name: wheel.brand_ref?.[0]?.value || wheel.brand_ref?.[0] || null,
      diameter: wheel.diameter_ref?.[0]?.value || wheel.diameter_ref?.[0]?.raw || wheel.diameter_ref?.[0] || null,
      width: wheel.width_ref?.[0]?.value || wheel.width_ref?.[0]?.raw || wheel.width_ref?.[0] || null,
      bolt_pattern: wheel.bolt_pattern_ref?.[0]?.value || wheel.bolt_pattern_ref?.[0] || null,
      center_bore: wheel.center_bore_ref?.[0]?.value || wheel.center_bore_ref?.[0] || null,
      wheel_offset: wheel.wheel_offset,
      color: wheel.color || null,
      good_pic_url: wheel.good_pic_url,
      bad_pic_url: wheel.bad_pic_url,
      is_oem_fitment: true,
      fitment_notes: null
    }));

    // Merge, avoiding duplicates
    const existingIds = new Set(associatedWheels.map(w => w.id));
    for (const wheel of reverseWheels) {
      if (!existingIds.has(wheel.id)) {
        associatedWheels.push(wheel);
      }
    }
  }

  console.log("[Vehicle Query] Found", associatedWheels.length, "wheels for vehicle");

  // Map oem_vehicles fields to expected format
  // Map oem_vehicles fields to expected format
  const vehicleWithWheels: VehicleWithRelations = {
    id: vehicle.id,
    chassis_code: vehicle.vehicle_id_only || '',
    model_name: vehicle.model_name,
    formatted_name: vehicle.vehicle_title,
    brand_name: vehicle.brand_ref?.[0] || null,
    production_years: vehicle.production_years,
    platform: vehicle.detailed_specs?.platform || null,
    engine_details: vehicle.oem_engine_ref,
    bolt_pattern: vehicle.bolt_pattern_ref?.[0] || null,
    center_bore: vehicle.center_bore_ref?.[0] || null,
    hero_image_url: vehicle.hero_image_url || vehicle.vehicle_image,
    status: null,
    technical_specs: null,
    market_info: vehicle.detailed_specs?.priceRange || null,
    special_notes: null,
    awards: null,
    trim_levels: null,
    lineage: null,
    production_stats: vehicle.production_stats,
    safety_ratings: null,
    wheels: associatedWheels,
    // Detailed specs fields
    body_type: vehicle.detailed_specs?.bodyType || null,
    dimensions: vehicle.detailed_specs?.dimensions || null,
    performance: vehicle.detailed_specs?.performance || null,
    fuel_economy: vehicle.detailed_specs?.fuelEconomy || null,
    competitors: vehicle.detailed_specs?.competitors || null,
    price_range: vehicle.detailed_specs?.priceRange || null
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
