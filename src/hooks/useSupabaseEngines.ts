import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseEngine {
    id: string;
    engine_code: string;
    engine_name: string | null;
    brand_ref: string | null;
    displacement_cc: number | null;
    displacement_l: number | null;
    cylinders: number | null;
    configuration: string | null;
    aspiration: string | null;
    power_hp: number | null;
    power_kw: number | null;
    torque_nm: number | null;
    torque_lb_ft: number | null;
    fuel_type: string | null;
    production_years: string | null;
    vehicle_ref: any;
    notes: string | null;
}

const fetchEngines = async () => {
    const { data, error } = await supabase
        .from('oem_engines' as any)
        .select('*')
        .order('engine_code');

    if (error) {
        console.error("[Engines Query] Error:", error);
        throw error;
    }

    console.log("[Engines Query] Fetched engines:", data?.length);

    return (data ?? []) as SupabaseEngine[];
};

export function useSupabaseEngines() {
    return useQuery({
        queryKey: ["engines"],
        queryFn: fetchEngines,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
