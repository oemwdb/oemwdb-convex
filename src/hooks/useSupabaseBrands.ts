import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseBrand {
  id: string;
  brand_title: string;
  brand_description: string | null;
  brand_image_url: string | null;
  brand_page: string | null;
  subsidiaries: string | null;
  wheel_count?: number | null;
}

const fetchBrands = async () => {
  const { data, error } = await supabase
    .from("oem_brands" as any)
    .select("*")
    .order("brand_title", { ascending: true });
    
  if (error) {
    console.error("[Brands Query] Error:", error);
    throw error;
  }
  
  // Filter to only show brands with images
  const allBrands = (data ?? []) as unknown as SupabaseBrand[];
  const brandsWithImages = allBrands.filter(brand => brand.brand_image_url);
  
  console.log("[Brands Query] Fetched brands:", brandsWithImages.length);
  return brandsWithImages;
};

export function useSupabaseBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}