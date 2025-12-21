import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UpgradeItem {
    id: string;
    vehicle_id: string;
    category: string;
    level: "STOCK" | "LIGHT" | "HEAVY";
    engine_variant: string | null;
    title: string;
    description: string;
    source?: "oem_plus" | "aftermarket";
}

export function useVehicleUpgrades(vehicleId: string) {
    return useQuery({
        queryKey: ["vehicle-upgrades", vehicleId],
        queryFn: async () => {
            console.log("[Upgrades Query] Fetching from oem_vehicles JSONB for:", vehicleId);

            // Query the upgrades_data JSONB field from oem_vehicles
            const { data: vehicle, error } = await (supabase as any)
                .from("oem_vehicles")
                .select("id, upgrades_data")
                .eq("id", vehicleId)
                .maybeSingle();

            if (error) {
                console.error("[Upgrades Query] Error:", error);
                throw error;
            }

            if (!vehicle?.upgrades_data) {
                console.log("[Upgrades Query] No upgrades data found");
                return [] as UpgradeItem[];
            }

            const data = vehicle.upgrades_data;
            const items: UpgradeItem[] = [];

            // Process each upgrade category
            const categoryMapping: Record<string, { source: "oem_plus" | "aftermarket", level: "STOCK" | "LIGHT" | "HEAVY" }> = {
                performance: { source: 'aftermarket', level: 'HEAVY' },
                suspension: { source: 'aftermarket', level: 'LIGHT' },
                wheels: { source: 'aftermarket', level: 'LIGHT' },
                interior: { source: 'oem_plus', level: 'STOCK' },
                exterior: { source: 'oem_plus', level: 'STOCK' }
            };

            for (const [category, upgrades] of Object.entries(data)) {
                if (Array.isArray(upgrades)) {
                    const config = categoryMapping[category] || { source: 'aftermarket' as const, level: 'LIGHT' as const };

                    upgrades.forEach((upgrade: any, idx: number) => {
                        let description = '';
                        if (upgrade.power_gain_hp) description += `+${upgrade.power_gain_hp} hp. `;
                        if (upgrade.weight_reduction_kg) description += `${upgrade.weight_reduction_kg}kg lighter. `;
                        if (upgrade.drop_mm) description += `${upgrade.drop_mm}mm lower. `;
                        if (upgrade.price_usd) description += `$${upgrade.price_usd.toLocaleString()}`;

                        items.push({
                            id: `${category}-${idx}`,
                            vehicle_id: vehicleId,
                            category: category,
                            level: config.level,
                            engine_variant: null,
                            title: upgrade.name,
                            description: description.trim() || `Premium ${category} upgrade`,
                            source: config.source
                        });
                    });
                }
            }

            console.log("[Upgrades Query] Parsed items:", items.length);
            return items;
        },
        enabled: !!vehicleId,
    });
}
