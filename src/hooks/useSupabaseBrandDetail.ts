import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BrandVehicle {
  id: string;
  chassis_code: string;
  model_name: string | null;
  brand_name: string | null;
  production_years: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  hero_image_url: string | null;
  status: string | null;
}

export interface BrandWheel {
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
  status: string | null;
}

export function useSupabaseBrandVehicles(brandName: string) {
  return useQuery({
    queryKey: ["brand-vehicles", brandName],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_vehicles_by_brand', { brand_name_param: brandName });
      
      if (error) {
        console.error("[Brand Vehicles Query] Error:", error);
        throw error;
      }
      
      console.log(`[Brand Vehicles Query] Fetched ${data?.length} vehicles for ${brandName}`);
      return (data ?? []) as BrandVehicle[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!brandName,
  });
}

export function useSupabaseBrandWheels(brandName: string) {
  return useQuery({
    queryKey: ["brand-wheels", brandName],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_wheels_by_brand', { brand_name_param: brandName });
      
      if (error) {
        console.error("[Brand Wheels Query] Error:", error);
        throw error;
      }
      
      console.log(`[Brand Wheels Query] Fetched ${data?.length} wheels for ${brandName}`);
      return (data ?? []) as BrandWheel[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!brandName,
  });
}