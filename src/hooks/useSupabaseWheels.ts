import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseWheel {
  id: string;
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
  image_source: string | null;
  specifications?: Record<string, any> | null;
  // Full JSONB reference arrays
  diameter_ref?: any;
  width_ref?: any;
  bolt_pattern_ref?: any;
  center_bore_ref?: any;
  color_ref?: any;
  tire_size_ref?: any;
  vehicle_ref?: any;
  brand_ref?: any;
  design_style_ref?: string[];
}

const fetchWheels = async () => {
  // Use the new database function with proper JSONB handling
  const { data, error } = await supabase.rpc('get_wheels_with_brands');

  if (error) {
    console.error("[Wheels Query] Error:", error);
    throw error;
  }

  // No longer filter by good_pic_url, let the UI decide based on Dev Mode
  const wheels = data ?? [];

  console.log("[Wheels Query] Fetched wheels:", wheels.length);

  return wheels as SupabaseWheel[];
};

export function useSupabaseWheels() {
  return useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels,
    staleTime: 0, // Force fresh data fetch to fix missing columns
  });
}