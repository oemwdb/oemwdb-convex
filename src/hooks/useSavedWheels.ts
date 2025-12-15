import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSavedWheels = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-wheels", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("saved_wheels")
        .select(`
          wheel_id,
          created_at,
          oem_wheels (
            id,
            wheel_name,
            wheel_code,
            diameter_refs,
            width_ref,
            bolt_pattern_refs,
            center_bore_ref,
            wheel_offset,
            color,
            good_pic_url,
            brand_refs,
            vehicle_refs,
            specifications
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform the data to match wheel card format
      return data.map((item: any) => ({
        ...item.oem_wheels,
        isSaved: true
      }));
    },
    enabled: !!user?.id,
  });
};
