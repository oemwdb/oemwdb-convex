/**
 * Migration script: upload brand SVG icons from Desktop to Convex storage.
 * 
 * Strategy:
 * - Recursively find all SVG files in /Users/GABRIEL/Desktop/STUFF/OEMWDB/
 * - Map filenames to brand slugs as defined in the project's upload mapping.
 * - Call Convex action brandMigrations:uploadBrandIcon to store and link the icon.
 * 
 * Run from project root:
 *   npx tsx scripts/migrate_brand_images_to_convex.ts
 */

import { config } from "dotenv";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;
const SEARCH_ROOT = "/Users/GABRIEL/Desktop/STUFF/OEMWDB";

if (!CONVEX_URL) {
    throw new Error("VITE_CONVEX_URL is missing in .env.local");
}

// Mapping from filename to brand slug (from existing project logic)
const FILENAME_TO_BRAND_SLUG: Record<string, string> = {
    'acura.svg': 'acura',
    'alfaromeo.svg': 'alfa-romeo',
    'amg.svg': 'amg',
    'astonmartin.svg': 'aston-martin',
    'audi.svg': 'audi',
    'bentley.svg': 'bentley',
    'bmw.svg': 'bmw',
    'bugatti.svg': 'bugatti',
    'chevrolet.svg': 'chevrolet',
    'chrysler.svg': 'chrysler',
    'citroen.svg': 'citroen',
    'ferrarinv.svg': 'ferrari',
    'ferrari.svg': 'ferrari',
    'fiat.svg': 'fiat',
    'ford.svg': 'ford',
    'honda.svg': 'honda',
    'hyundai.svg': 'hyundai',
    'infiniti.svg': 'infiniti',
    'jaguar.svg': 'jaguar',
    'kia.svg': 'kia',
    'lada.svg': 'lada',
    'lamborghini.svg': 'lamborghini',
    'landrover.svg': 'land-rover',
    'mazda.svg': 'mazda',
    'mercedes.svg': 'mercedes-benz',
    'mini.svg': 'mini',
    'mitsubishi.svg': 'mitsubishi',
    'nissan.svg': 'nissan',
    'peugeot.svg': 'peugeot',
    'polestar.svg': 'polestar',
    'porsche.svg': 'porsche',
    'ram.svg': 'ram',
    'renault.svg': 'renault',
    'rollsroyce.svg': 'rolls-royce',
    'seat.svg': 'seat',
    'skoda.svg': 'skoda',
    'subaru.svg': 'subaru',
    'tesla.svg': 'tesla',
    'toyota.svg': 'toyota',
    'volkswagen.svg': 'volkswagen',
    'volvo.svg': 'volvo',
};

async function convexQuery<T>(path: string, args: Record<string, unknown>): Promise<T> {
    const url = `${CONVEX_URL.replace(/\/$/, "")}/api/query`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
    });
    const json = await res.json();
    if (json.status !== "success") throw new Error(`Convex query failed: ${json.errorMessage}`);
    return json.value;
}

async function convexAction<T>(path: string, args: Record<string, unknown>): Promise<T> {
    const url = `${CONVEX_URL.replace(/\/$/, "")}/api/action`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
    });
    const json = await res.json();
    if (json.status !== "success") throw new Error(`Convex action failed: ${json.errorMessage}`);
    return json.value;
}

function findFiles(dir: string, ext: string, fileList: string[] = []): string[] {
    const files = readdirSync(dir);
    files.forEach((file) => {
        const filePath = join(dir, file);
        if (statSync(filePath).isDirectory()) {
            findFiles(filePath, ext, fileList);
        } else if (file.endsWith(ext)) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

async function main() {
    console.log("🚀 Starting brand image migration to Convex...");

    // 1. Get all brands from Convex
    const brands = await convexQuery<any[]>("queries:brandsGetAll", {});
    console.log(`📊 Found ${brands.length} brands in Convex.`);

    // 2. Find all SVGs on Desktop
    console.log(`📂 Searching for SVGs in ${SEARCH_ROOT}...`);
    const svgFiles = findFiles(SEARCH_ROOT, ".svg");
    console.log(`🔍 Found ${svgFiles.length} SVG files.`);

    // Create a map of filename -> absolute path for quick lookup
    const svgMap: Record<string, string> = {};
    svgFiles.forEach(path => {
        svgMap[basename(path).toLowerCase()] = path;
    });

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const brand of brands) {
        const slug = brand.slug || brand.id;
        if (!slug) continue;

        // Try to find a matching file
        // First check our explicit mapping
        let filePath: string | undefined;
        for (const [filename, mappedSlug] of Object.entries(FILENAME_TO_BRAND_SLUG)) {
            if (mappedSlug === slug) {
                filePath = svgMap[filename.toLowerCase()];
                if (filePath) break;
            }
        }

        // If not found in mapping, try direct filename match
        if (!filePath) {
            filePath = svgMap[`${slug.toLowerCase()}.svg`];
        }

        if (!filePath) {
            console.log(`  ⚠️ No SVG found for brand: ${brand.brand_title} (slug: ${slug})`);
            skipped++;
            continue;
        }

        try {
            console.log(`  ⬆️ Uploading icon for ${brand.brand_title}...`);
            const fileBuffer = readFileSync(filePath);
            const base64 = fileBuffer.toString("base64");

            await convexAction("brandMigrations:uploadBrandIcon", {
                brandId: brand._id,
                iconBase64: base64,
                fileName: basename(filePath),
            });

            console.log(`    ✅ Success: ${basename(filePath)}`);
            migrated++;
        } catch (err) {
            console.error(`    ❌ Failed: ${brand.brand_title}:`, (err as Error).message);
            failed++;
        }
    }

    console.log("\n✨ Migration complete!");
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Skipped:  ${skipped}`);
    console.log(`   Failed:   ${failed}`);
}

main().catch(err => {
    console.error("❌ Fatal error:", err);
    process.exit(1);
});
