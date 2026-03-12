/**
 * Script: Organize Convex storage by moving existing storage IDs into a structured virtual path system.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;

if (!CONVEX_URL) {
    throw new Error("VITE_CONVEX_URL is missing in .env.local");
}

async function convexAction<T>(path: string, args: Record<string, unknown>): Promise<T> {
    const url = `${CONVEX_URL.replace(/\/$/, "")}/api/action`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
    });
    const json = await res.json();
    if (json.status !== "success") throw new Error(`Action ${path} failed: ${json.errorMessage}`);
    return json.value;
}

function extractStorageId(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.includes("/api/media/")) return null;
    const match = url.match(/\/storage\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
}

async function main() {
    console.log("🚀 Starting Storage Reorganization...");

    // 1. Process Brands
    console.log("\n📁 Processing Brands...");
    const brands = await convexAction<any[]>("brandMigrations:getAllBrandsMigration", {});
    for (const brand of brands) {
        const fields = ["brand_image_url", "good_pic_url", "bad_pic_url"];
        for (const field of fields as any[]) {
            const storageId = extractStorageId(brand[field]);
            if (storageId) {
                const ext = brand[field].endsWith(".svg") ? "svg" : "jpg";
                const picType = field === "brand_image_url" ? "icon" : field;
                const virtualPath = `${brand.slug}/${picType}.${ext}`;

                console.log(`   🔗 Mapping ${brand.brand_title} ${field} -> ${virtualPath}`);
                const { mediaUrl } = await convexAction<any>("storage:moveStorageIdToPath", {
                    storageId,
                    virtualPath,
                    contentType: ext === "svg" ? "image/svg+xml" : "image/jpeg",
                    brandId: brand._id
                });

                await convexAction("storage:updateBrandImageUrlAction", {
                    brandId: brand._id,
                    field,
                    mediaUrl
                });
            }
        }
    }

    // 2. Process Wheels
    console.log("\n📁 Processing Wheels...");
    const wheels = await convexAction<any[]>("brandMigrations:getAllWheelsMigration", {});
    for (const wheel of wheels) {
        const fields = ["good_pic_url", "bad_pic_url"];
        for (const field of fields as any[]) {
            const storageId = extractStorageId(wheel[field]);
            if (storageId) {
                const virtualPath = `wheels/${wheel.slug || wheel._id}/${field}.jpg`;
                console.log(`   🔗 Mapping Wheel ${wheel.wheel_title} ${field} -> ${virtualPath}`);
                const { mediaUrl } = await convexAction<any>("storage:moveStorageIdToPath", {
                    storageId,
                    virtualPath,
                    contentType: "image/jpeg",
                    wheelId: wheel._id
                });

                await convexAction("storage:updateWheelImageUrlAction", {
                    wheelId: wheel._id,
                    field,
                    mediaUrl
                });
            }
        }
    }

    console.log("\n✨ Storage Reorganization Complete!");
}

main().catch(console.error);
