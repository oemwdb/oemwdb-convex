import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSavedVehicles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-vehicles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("saved_vehicles")
        .select(`
          vehicle_id,
          created_at,
          oem_vehicles (
            id,
            chassis_code,
            model_name,
            vehicle_title,
            production_years,
            bolt_pattern,
            center_bore,
            hero_image_url,
            brand_refs,
            wheel_refs,
            diameter_refs,
            width_refs
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform the data to match vehicle card format
      return data.map((item: any) => ({
        ...item.oem_vehicles,
        isSaved: true
      }));
    },
    enabled: !!user?.id,
  });
};
