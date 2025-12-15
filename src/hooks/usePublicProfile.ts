import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePublicProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      if (!username) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!username,
  });
};
