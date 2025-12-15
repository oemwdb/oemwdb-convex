import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSavedBrands = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-brands", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("saved_brands")
        .select(`
          brand_id,
          created_at,
          oem_brands (
            id,
            name,
            brand_image_url,
            brand_description,
            wheel_count,
            subsidiaries,
            readable_id
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform the data to match brand card format
      return data.map((item: any) => ({
        ...item.oem_brands,
        isSaved: true
      }));
    },
    enabled: !!user?.id,
  });
};
