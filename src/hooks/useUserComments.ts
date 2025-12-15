import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserComments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-comments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("vehicle_comments")
        .select(`
          id,
          comment_text,
          created_at,
          updated_at,
          vehicle_id,
          oem_vehicles (
            id,
            model_name,
            chassis_code,
            hero_image_url,
            brand_refs
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
    enabled: !!user?.id,
  });
};
