import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WheelWithRelations {
  id: string;  // Changed to string since oem_wheels.id is text
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
  specifications?: any;  // JSON field with detailed specs
  vehicles?: any[];
  // Reference fields (arrays from database)
  brand_refs?: string[];
  diameter_refs?: string[];
  width_ref?: string[];
  bolt_pattern_refs?: string[];
  center_bore_ref?: string[];
  color_refs?: string[];
  tire_size_refs?: string[];
  vehicle_refs?: any;
}

// Helper to extract values from JSONB ref arrays
const extractRefValues = (refs: any): string[] => {
  if (!refs || !Array.isArray(refs) || refs.length === 0) return [];
  return refs.map(ref => {
    // Handle both JSONB objects {id, value} and plain strings
    if (typeof ref === 'object' && ref.value) return ref.value;
    if (typeof ref === 'string') return ref;
    return null;
  }).filter(Boolean) as string[];
};

// Helper to extract first string from array
const getFirstString = (refs: any): string | null => {
  const values = extractRefValues(refs);
  return values.length > 0 ? values[0] : null;
};

export const fetchWheelWithVehicles = async (wheelId: string) => {
  // Since oem_wheels.id is now text (wheel name), query directly
  const { data: wheelData, error: wheelError } = await supabase
    .from("oem_wheels" as any)
    .select("*")
    .eq("id", wheelId)  // No parseInt needed - id is text
    .maybeSingle();

  if (wheelError) {
    console.error("[Wheel Query] Error:", wheelError);
    throw wheelError;
  }

  if (!wheelData) {
    throw new Error("Wheel not found");
  }

  // Type assertion to handle the any type
  const wheel = wheelData as any;

  // Map the refs to proper values
  const mappedWheel = {
    id: wheel.id,
    wheel_name: wheel.wheel_title || wheel.wheel_name,
    brand_name: getFirstString(wheel.brand_ref),
    diameter: getFirstString(wheel.diameter_ref),
    width: getFirstString(wheel.width_ref),
    bolt_pattern: getFirstString(wheel.bolt_pattern_ref),
    center_bore: getFirstString(wheel.center_bore_ref),
    wheel_offset: wheel.wheel_offset,
    color: wheel.color,
    good_pic_url: wheel.good_pic_url,
    bad_pic_url: wheel.bad_pic_url,
    weight: wheel.weight,
    metal_type: wheel.metal_type,
    part_numbers: wheel.part_numbers,
    notes: wheel.notes,
    specifications: wheel.specifications,
    status: wheel.good_pic_url ? "Ready for website" : "Needs Good Pic",
    // Extract and keep all ref values as arrays
    brand_refs: extractRefValues(wheel.brand_ref),
    diameter_refs: extractRefValues(wheel.diameter_ref),
    width_ref: extractRefValues(wheel.width_ref),
    bolt_pattern_refs: extractRefValues(wheel.bolt_pattern_ref),
    center_bore_ref: extractRefValues(wheel.center_bore_ref),
    color_refs: extractRefValues(wheel.color_ref),
    tire_size_refs: extractRefValues(wheel.tire_size_ref),
    vehicle_refs: wheel.vehicle_ref
  };

  // Fetch related vehicles if vehicle_ref exists
  let vehicles: any[] = [];
  if (wheel.vehicle_ref && Array.isArray(wheel.vehicle_ref)) {
    // Extract vehicle IDs from JSONB array [{id: "...", title: "..."}]
    const vehicleIds = wheel.vehicle_ref
      .filter((ref: any) => ref && ref.id)
      .map((ref: any) => ref.id);

    if (vehicleIds.length > 0) {
      const { data: vehicleData } = await supabase
        .from('oem_vehicles' as any)
        .select('*')
        .in('id', vehicleIds);

      if (vehicleData) {
        vehicles = (vehicleData as any[]).map((v: any) => ({
          id: v.id,
          chassis_code: v.vehicle_id_only || v.generation,
          model_name: v.model_name,
          vehicle_title: v.vehicle_title,
          production_years: v.production_years,
          bolt_pattern: getFirstString(v.bolt_pattern_ref),
          center_bore: getFirstString(v.center_bore_ref),
          hero_image_url: v.hero_image_url || v.vehicle_image,
          brand_name: getFirstString(v.brand_ref) || 'Rolls-Royce',
          is_oem_fitment: true
        }));
      }
    }
  }

  const wheelWithVehicles: WheelWithRelations = {
    ...mappedWheel,
    vehicles
  };

  console.log("[Wheel Query] Fetched wheel with vehicles:", wheelWithVehicles);
  return wheelWithVehicles;
};

export const fetchWheelByName = async (wheelName: string) => {
  // Since oem_wheels.id is now the wheel name, we can query directly by id
  const { data: wheelData, error: wheelError } = await supabase
    .from("oem_wheels" as any)
    .select("*")
    .eq("id", wheelName)  // Use id directly as it contains the wheel name
    .maybeSingle();

  if (wheelError) {
    console.error("[Wheel Query] Error:", wheelError);
    throw wheelError;
  }

  if (!wheelData) {
    throw new Error("Wheel not found");
  }

  // Type assertion to handle the any type
  const wheel = wheelData as any;

  // Map the refs to proper values
  const mappedWheel = {
    id: wheel.id,
    wheel_name: wheel.wheel_title || wheel.wheel_name,
    brand_name: getFirstString(wheel.brand_ref),
    diameter: getFirstString(wheel.diameter_ref),
    width: getFirstString(wheel.width_ref),
    bolt_pattern: getFirstString(wheel.bolt_pattern_ref),
    center_bore: getFirstString(wheel.center_bore_ref),
    wheel_offset: wheel.wheel_offset,
    color: wheel.color,
    good_pic_url: wheel.good_pic_url,
    bad_pic_url: wheel.bad_pic_url,
    weight: wheel.weight,
    metal_type: wheel.metal_type,
    part_numbers: wheel.part_numbers,
    notes: wheel.notes,
    specifications: wheel.specifications,
    status: wheel.good_pic_url ? "Ready for website" : "Needs Good Pic",
    // Extract and keep all ref values as arrays
    brand_refs: extractRefValues(wheel.brand_ref),
    diameter_refs: extractRefValues(wheel.diameter_ref),
    width_ref: extractRefValues(wheel.width_ref),
    bolt_pattern_refs: extractRefValues(wheel.bolt_pattern_ref),
    center_bore_ref: extractRefValues(wheel.center_bore_ref),
    color_refs: extractRefValues(wheel.color_ref),
    tire_size_refs: extractRefValues(wheel.tire_size_ref),
    vehicle_refs: wheel.vehicle_ref
  };

  // Fetch related vehicles if vehicle_ref exists
  let vehicles: any[] = [];
  if (wheel.vehicle_ref && Array.isArray(wheel.vehicle_ref)) {
    // Extract vehicle IDs from JSONB array [{id: "...", title: "..."}]
    const vehicleIds = wheel.vehicle_ref
      .filter((ref: any) => ref && ref.id)
      .map((ref: any) => ref.id);

    if (vehicleIds.length > 0) {
      const { data: vehicleData } = await supabase
        .from('oem_vehicles' as any)
        .select('*')
        .in('id', vehicleIds);

      if (vehicleData) {
        vehicles = (vehicleData as any[]).map((v: any) => ({
          id: v.id,
          chassis_code: v.vehicle_id_only || v.generation,
          model_name: v.model_name,
          vehicle_title: v.vehicle_title,
          production_years: v.production_years,
          bolt_pattern: getFirstString(v.bolt_pattern_ref),
          center_bore: getFirstString(v.center_bore_ref),
          hero_image_url: v.hero_image_url || v.vehicle_image,
          brand_name: getFirstString(v.brand_ref) || 'Rolls-Royce',
          is_oem_fitment: true
        }));
      }
    }
  }

  const wheelWithVehicles: WheelWithRelations = {
    ...mappedWheel,
    vehicles
  };

  console.log("[Wheel Query] Fetched wheel by name:", wheelWithVehicles);
  return wheelWithVehicles;
};

export function useWheelWithVehicles(wheelId: string) {
  return useQuery({
    queryKey: ["wheel-with-vehicles", wheelId],
    queryFn: () => fetchWheelWithVehicles(wheelId),
    enabled: !!wheelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useWheelByName(wheelName: string) {
  return useQuery({
    queryKey: ["wheel-by-name", wheelName],
    queryFn: () => fetchWheelByName(wheelName),
    enabled: !!wheelName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}