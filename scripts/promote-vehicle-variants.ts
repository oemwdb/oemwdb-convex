/**
 * Promote ws_[brand]_vehicle_variants workshop data into oem_vehicle_variants.
 *
 * ENV: .env.local with VITE_CONVEX_URL
 * Run from project root: npx tsx scripts/promote-vehicle-variants.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;
const required = [["VITE_CONVEX_URL", CONVEX_URL]] as const;
for (const [name, value] of required) {
    if (!value || String(value).trim() === "") {
        throw new Error(
            `Missing env: ${name}. Set in .env.local and run from project root.`
        );
    }
}

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
    "ws_944racing_vehicle_variants",
    "ws_alfa_romeo_vehicle_variants",
    "ws_audi_vehicle_variants",
    "ws_ferrari_vehicle_variants",
    "ws_fiat_vehicle_variants",
    "ws_jaguar_vehicle_variants",
    "ws_lamborghini_vehicle_variants",
    "ws_land_rover_vehicle_variants",
    "ws_mercedes_vehicle_variants",
    "ws_porsche_vehicle_variants",
    "ws_vw_vehicle_variants",
];

type WsRow = { _id: string; data: string; title?: string; brand?: string };
type CsvRow = Record<string, unknown> & {
    id?: string;
    vehicle_title?: string;
    trim_level?: string;
    year_from?: string | number;
    year_to?: string | number;
    engine_id?: string;
    body_style_id?: string;
    drive_type_id?: string;
    market_id?: string;
};

const BATCH_SIZE = 10;

function num(x: unknown): number | undefined {
    const n = Number(x);
    return isNaN(n) ? undefined : n;
}

async function processRow(
    table: string,
    row: WsRow,
    stats: { promoted: number; skipped: number; errors: string[] },
    vehicleTitleToId: Map<string, string>
) {
    let data: CsvRow;
    try {
        data = JSON.parse(row.data);
    } catch {
        stats.errors.push(`JSON parse error in ${table} row ${row._id}`);
        return;
    }

    const vehicleTitle = data.vehicle_title || row.title;
    if (!vehicleTitle) {
        stats.skipped++;
        return;
    }

    const vehicleId = vehicleTitleToId.get(vehicleTitle);
    if (!vehicleId) {
        // Try to find it via query if not in map
        stats.skipped++;
        return;
    }

    try {
        await convexMutation("migrations:promoteVehicleVariant", {
            vehicle_id: vehicleId,
            slug: data.id || row.title,
            variant_title: data.trim_level || row.title,
            trim_level: data.trim_level,
            year_from: num(data.year_from),
            year_to: num(data.year_to),
            engine_id: data.engine_id,
            body_style_id: data.body_style_id,
            drive_type_id: data.drive_type_id,
            market_id: data.market_id,
        });
        stats.promoted++;
    } catch (e: any) {
        stats.errors.push(`Error in ${table} row ${row._id}: ${e.message}`);
    }
}

async function run() {
    console.log("Fetching oem_vehicles for mapping...");
    const vehicles = (await convexQuery("queries:vehiclesGetAll", {})) as any[];
    const vehicleTitleToId = new Map(vehicles.map((v) => [v.vehicle_title, v._id]));
    console.log(`Mapped ${vehicleTitleToId.size} vehicles.\n`);

    for (const table of WS_TABLES) {
        console.log(`Processing ${table}...`);
        const rows = (await convexQuery("queries:getWsRows", { table, limit: 1000 })) as WsRow[];
        const stats = { promoted: 0, skipped: 0, errors: [] as string[] };

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map((row) => processRow(table, row, stats, vehicleTitleToId)));
            if (i % 100 === 0 && i > 0) process.stdout.write(".");
        }

        console.log(`\nDone ${table}: promoted ${stats.promoted}, skipped ${stats.skipped}, errors ${stats.errors.length}`);
        if (stats.errors.length > 0) {
            console.log("Sample errors:", stats.errors.slice(0, 3));
        }
    }
}

run().catch(console.error);
