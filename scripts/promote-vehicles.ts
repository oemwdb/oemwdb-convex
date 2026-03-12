/**
 * Promote ws_[brand]_vehicles workshop data into oem_vehicles.
 *
 * ENV: .env.local with VITE_CONVEX_URL
 * Run from project root: npx tsx scripts/promote-vehicles.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;
const BASE = CONVEX_URL.replace(/\/$/, "");

async function convexQuery(path: string, args: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(`${BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
    });
    const data = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
    if (data.status === "error") throw new Error(data.errorMessage ?? "Query failed");
    return data.value;
}

async function convexMutation(path: string, args: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(`${BASE}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
    });
    const data = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
    if (data.status === "error") throw new Error(data.errorMessage ?? "Mutation failed");
    return data.value;
}

const WS_TABLES = [
    "ws_944racing_vehicles",
    "ws_alfa_romeo_vehicles",
    "ws_audi_vehicles",
    "ws_ferrari_vehicles",
    "ws_fiat_vehicles",
    "ws_jaguar_vehicles",
    "ws_lamborghini_vehicles",
    "ws_land_rover_vehicles",
    "ws_mercedes_vehicles",
    "ws_porsche_vehicles",
    "ws_vw_vehicles",
];

type WsRow = { _id: string; data: string; title?: string; brand?: string };
type CsvRow = Record<string, unknown> & {
    id?: string;
    vehicle_id?: string;
    model_name?: string;
    vehicle_title?: string;
    brand?: string;
    production_years?: string;
    body_type?: string;
    drive_type?: string;
};

const BATCH_SIZE = 10;

async function processRow(
    table: string,
    row: WsRow,
    stats: { promoted: number; skipped: number; errors: string[] },
    brandTitleToId: Map<string, string>
) {
    let data: CsvRow;
    try {
        data = JSON.parse(row.data);
    } catch {
        stats.errors.push(`JSON parse error in ${table} row ${row._id}`);
        return;
    }

    // The id in CSV is often what we want for oem_vehicles.id
    const vehicleIdStr = data.id || data.vehicle_id || row.source_id;
    const modelName = data.model_name || data.vehicle_title || row.title;

    if (!vehicleIdStr || !modelName) {
        stats.skipped++;
        return;
    }

    // Find brand
    // Staging "brand" field often has "audi vehicle" etc.
    // We'll try to find a match in brands
    const brandName = (row.brand || data.brand || "").split(" ")[0].toLowerCase();
    const brandId = brandTitleToId.get(brandName);

    try {
        await convexMutation("migrations:promoteVehicle", {
            id: vehicleIdStr,
            model_name: modelName,
            vehicle_title: data.vehicle_title || modelName,
            brand_id: brandId as any,
            production_years: data.production_years,
            body_type: data.body_type,
            drive_type: data.drive_type,
        });
        stats.promoted++;
    } catch (e: any) {
        stats.errors.push(`Error in ${table} row ${row._id}: ${e.message}`);
    }
}

async function run() {
    console.log("Fetching oem_brands for mapping...");
    const brands = (await convexQuery("queries:brandsGetAllWithCounts", {})) as any[];
    const brandTitleToId = new Map(brands.map((b) => [b.id.toLowerCase(), b._id]));
    console.log(`Mapped ${brandTitleToId.size} brands.\n`);

    for (const table of WS_TABLES) {
        console.log(`Processing ${table}...`);
        const rows = (await convexQuery("queries:getWsRows", { table, limit: 1000 })) as WsRow[];
        const stats = { promoted: 0, skipped: 0, errors: [] as string[] };

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map((row) => processRow(table, row, stats, brandTitleToId)));
            if (i % 100 === 0 && i > 0) process.stdout.write(".");
        }

        console.log(`\nDone ${table}: promoted ${stats.promoted}, skipped ${stats.skipped}, errors ${stats.errors.length}`);
    }
}

run().catch(console.error);
