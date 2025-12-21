
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VehicleVariant {
    id: string;
    vehicle_id: string;
    model_name: string;
    year_start: number | null;
    year_end: number | null;
    engine_summary: string | null;
    power_summary: string | null;
    body_type: string | null;
    search_term: string | null;
}

export function useVehicleVariants(vehicleId: string) {
    return useQuery({
        queryKey: ["vehicle-variants", vehicleId],
        queryFn: async () => {
            console.log("[Variants Query] Fetching for vehicle_id:", vehicleId);
            const { data, error } = await (supabase as any)
                .from("vehicle_variants")
                .select("*")
                .eq("vehicle_id", vehicleId)
                .order("year_start", { ascending: true });

            if (error) {
                console.error("[Variants Query] Error:", error);
                throw error;
            }
            return data as VehicleVariant[];
        },
        enabled: !!vehicleId,
    });
}
