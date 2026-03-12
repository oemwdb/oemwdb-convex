import { query } from "./_generated/server";

export const getCounts = query({
    args: {},
    handler: async (ctx) => {
        const tables = [
            "oem_brands",
            "oem_engines",
            "oem_vehicles",
            "oem_vehicle_variants",
            "oem_wheels",
            "oem_wheel_variants",
            "ws_944racing_vehicles",
            "ws_944racing_vehicle_variants",
            "ws_alfa_romeo_vehicles",
            "ws_alfa_romeo_vehicle_variants",
            "ws_audi_vehicles",
            "ws_audi_vehicle_variants",
            "ws_ferrari_vehicles",
            "ws_ferrari_vehicle_variants",
            "ws_fiat_vehicles",
            "ws_fiat_vehicle_variants",
            "ws_jaguar_vehicles",
            "ws_jaguar_vehicle_variants",
            "ws_lamborghini_vehicles",
            "ws_lamborghini_vehicle_variants",
            "ws_land_rover_vehicles",
            "ws_land_rover_vehicle_variants",
            "ws_mercedes_vehicles",
            "ws_mercedes_vehicle_variants",
            "ws_porsche_vehicles",
            "ws_porsche_vehicle_variants",
            "ws_vw_vehicles",
            "ws_vw_vehicle_variants",
        ];

        const counts: Record<string, string> = {};
        for (const table of tables) {
            try {
                const rows = await ctx.db.query(table as any).collect();
                const count = rows.length;
                counts[table] = count.toString();
            } catch (e) {
                counts[table] = "Error: " + (e as Error).message;
            }
        }
        return counts;
    },
});
