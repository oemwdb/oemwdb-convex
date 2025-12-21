import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceItem {
    id: string;
    vehicle_id: string;
    category: string;
    type: "known_issue" | "schedule";
    engine_variant: string | null;
    title: string;
    description: string;
    interval_miles: number | null;
}

export function useVehicleMaintenance(vehicleId: string) {
    return useQuery({
        queryKey: ["vehicle-maintenance", vehicleId],
        queryFn: async () => {
            console.log("[Maintenance Query] Fetching from oem_vehicles JSONB for:", vehicleId);

            // Query the maintenance_data JSONB field from oem_vehicles
            const { data: vehicle, error } = await (supabase as any)
                .from("oem_vehicles")
                .select("id, maintenance_data")
                .eq("id", vehicleId)
                .maybeSingle();

            if (error) {
                console.error("[Maintenance Query] Error:", error);
                throw error;
            }

            if (!vehicle?.maintenance_data) {
                console.log("[Maintenance Query] No maintenance data found");
                return [] as MaintenanceItem[];
            }

            const data = vehicle.maintenance_data;
            const items: MaintenanceItem[] = [];

            // Convert JSONB to display format
            // Oil change
            if (data.oil_change) {
                items.push({
                    id: 'oil-change',
                    vehicle_id: vehicleId,
                    category: 'fluids',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Oil Change',
                    description: `${data.oil_change.oil_type}, ${data.oil_change.capacity_liters}L capacity`,
                    interval_miles: data.oil_change.interval_km ? Math.round(data.oil_change.interval_km * 0.621) : null
                });
            }

            // Brake fluid
            if (data.brake_fluid) {
                items.push({
                    id: 'brake-fluid',
                    vehicle_id: vehicleId,
                    category: 'fluids',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Brake Fluid Flush',
                    description: `Replace every ${data.brake_fluid.interval_months} months`,
                    interval_miles: null
                });
            }

            // Coolant
            if (data.coolant) {
                items.push({
                    id: 'coolant',
                    vehicle_id: vehicleId,
                    category: 'fluids',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Coolant Flush',
                    description: `Replace every ${data.coolant.interval_months} months`,
                    interval_miles: data.coolant.interval_km ? Math.round(data.coolant.interval_km * 0.621) : null
                });
            }

            // Spark plugs
            if (data.spark_plugs) {
                items.push({
                    id: 'spark-plugs',
                    vehicle_id: vehicleId,
                    category: 'engine',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Spark Plugs',
                    description: 'Replace iridium spark plugs',
                    interval_miles: data.spark_plugs.interval_km ? Math.round(data.spark_plugs.interval_km * 0.621) : null
                });
            }

            // Transmission fluid
            if (data.transmission_fluid) {
                items.push({
                    id: 'trans-fluid',
                    vehicle_id: vehicleId,
                    category: 'drivetrain',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Transmission Fluid',
                    description: data.transmission_fluid.type || 'Automatic transmission service',
                    interval_miles: data.transmission_fluid.interval_km ? Math.round(data.transmission_fluid.interval_km * 0.621) : null
                });
            }

            // Known issues
            if (data.common_issues && Array.isArray(data.common_issues)) {
                data.common_issues.forEach((issue: string, idx: number) => {
                    items.push({
                        id: `issue-${idx}`,
                        vehicle_id: vehicleId,
                        category: 'general',
                        type: 'known_issue',
                        engine_variant: null,
                        title: issue,
                        description: 'Common issue reported by owners',
                        interval_miles: null
                    });
                });
            }

            // Annual service cost
            if (data.service_cost_annual_usd) {
                items.push({
                    id: 'annual-cost',
                    vehicle_id: vehicleId,
                    category: 'general',
                    type: 'schedule',
                    engine_variant: null,
                    title: 'Estimated Annual Service Cost',
                    description: `Approximately $${data.service_cost_annual_usd.toLocaleString()} per year`,
                    interval_miles: null
                });
            }

            console.log("[Maintenance Query] Parsed items:", items.length);
            return items;
        },
        enabled: !!vehicleId,
    });
}
