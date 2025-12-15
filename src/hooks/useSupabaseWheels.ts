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
  
  // Filter to only show wheels with images and map the data
  const wheelsWithImages = (data as any[] | null)?.filter(wheel => wheel.good_pic_url) ?? [];
  
  console.log("[Wheels Query] Fetched wheels with brands:", wheelsWithImages.length);
  
  return wheelsWithImages.map((d) => ({
    ...d,
    bad_pic_url: null
  })) as SupabaseWheel[];
};

export function useSupabaseWheels() {
  return useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}