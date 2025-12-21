
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Comment {
    id: string;
    user_id: string;
    vehicle_id: string;
    comment_text: string;
    tag: string;
    created_at: string;
    user_email?: string; // Optional, might need to join with profiles or auth
}

export const TAG_OPTIONS = [
    "General",
    "Brief",
    "Variants",
    "Wheels",
    "Maintenance",
    "Upgrades",
    "Gallery"
] as const;

export function useVehicleComments(vehicleId: string) {
    const queryClient = useQueryClient();

    const { data: comments, isLoading, error } = useQuery({
        queryKey: ["vehicle-comments", vehicleId],
        queryFn: async () => {
            // Fetch comments
            // Note: We might want user details. For now, we'll just get the user_id.
            // Ideally we join with a profiles table if it exists and has names.
            // Checking schema earlier showed 'users' and 'profiles' table.
            // Let's assume we can just display the email or a placeholder for now to keep it simple,
            // or fetch user metadata if RLS allows.

            const { data, error } = await supabase
                .from("vehicle_comments")
                .select("*")
                .eq("vehicle_id", vehicleId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Enhance with user email if possible (client side or separate query?)
            // For now returning raw data. We can fetch user details later if needed.
            return data as unknown as Comment[];
        },
        enabled: !!vehicleId,
    });

    const addComment = useMutation({
        mutationFn: async ({ comment, tag }: { comment: string; tag: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Must be logged in to comment");

            const { data, error } = await supabase
                .from("vehicle_comments")
                .insert({
                    vehicle_id: vehicleId,
                    user_id: user.id,
                    comment_text: comment,
                    tag: tag,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicle-comments", vehicleId] });
        },
    });

    return {
        comments,
        isLoading,
        error,
        addComment,
        TAG_OPTIONS
    };
}
