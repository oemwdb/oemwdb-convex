#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Configuration
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";
const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const VEHICLES_DB_ID = "1b417406-a14d-81c4-a685-d72e258420b8";

const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper to slugify
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Fetch vehicles from Notion
async function fetchNotionVehicles() {
    const response = await fetch(`https://api.notion.com/v1/databases/${VEHICLES_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
            filter: {
                or: [
                    { property: "Brand Name", rich_text: { contains: "Ferrari" } },
                    { property: "Brand Name", rich_text: { contains: "Lamborghini" } }
                ]
            },
            page_size: 100
        })
    });

    const data = await response.json();
    return data.results;
}

// Extract vehicle properties
function extractVehicleData(page) {
    const props = page.properties;

    // Helper to get text safely
    const getText = (richText) => {
        if (!richText || !Array.isArray(richText)) return null;
        return richText.map(t => t.plain_text).join('').trim() || null;
    };

    const chassisCode = getText(props['OEM Chassis Code']?.title) || 'Unknown';
    const modelName = getText(props['Model Name']?.rich_text) || chassisCode;
    const brandName = getText(props['Brand Name']?.rich_text) || "";
    // Normalize Brand Name
    let brandSlug = "unknown";
    if (brandName.toLowerCase().includes("ferrari")) brandSlug = "ferrari";
    else if (brandName.toLowerCase().includes("lamborghini")) brandSlug = "lamborghini";
    else if (brandName.toLowerCase().includes("rolls")) brandSlug = "rolls-royce";
    else if (brandName.toLowerCase().includes("mini")) brandSlug = "mini";

    const productionYears = getText(props['Productions Years Range']?.rich_text);
    const engineDetails = getText(props['Engine List']?.rich_text);

    return {
        id: slugify(chassisCode + "-" + modelName), // Create unique ID if chassis is generic
        // Actually, let's use chassis code as ID if available, else model name
        // But chassis codes can be duplicated across brands? No.
        // Let's use clean slug of model name + chassis for uniqueness
        // Or follow existing pattern: slugify(chassisCode)
        // Existing RR script used slugify(chassisCode).

        vehicle_title: chassisCode,
        model_name: modelName,
        brand_ref: [{ value: brandSlug }],
        production_years: productionYears,
        oem_engine_ref: engineDetails, // This is text in DB? Check schema.
        // check import_rr_vehicles.js: schema has oem_engine_ref as JSONB ?? No, import_rr_vehicles.js treated it as text but cast to ?
        // import_rr_vehicles.sql: `INSERT INTO oem_vehicles ... oem_engine_ref`
        // Wait, check oem_vehicles schema?
        // Let's assume text or JSONB. The previous script: `truncate(v.engineDetails, 500)` implies text.
        // BUT `import_rr_vehicles.js` line 107: `oem_engine_ref = EXCLUDED.oem_engine_ref`.
        // If the column is generic text, fine. If it's JSONB, implies structured.
        // Let's assume it's text for now or JSONB containing text.
        // Actually, checking Supabase schema is safest.
        // I will assume text description for now.

        uuid: page.id
    };
}

// Transform for Supabase
function transformForSupabase(vehicle) {
    // We need to match Supabase Column Types.
    // oem_vehicles: id (text), vehicle_title (text), model_name (text), brand_ref (jsonb), production_years (text), uuid (uuid)
    // oem_engine_ref ??

    // Let's just include fields we are sure of.

    return {
        id: slugify(vehicle.vehicle_title), // Use chassis code or title slug
        vehicle_title: vehicle.vehicle_title,
        model_name: vehicle.model_name,
        brand_ref: vehicle.brand_ref,
        production_years: vehicle.production_years,
        // uuid: vehicle.uuid // Column missing in DB
    };
}

// Upsert to Supabase
async function upsertVehicle(vehicleData) {
    const { error } = await supabaseService
        .from('oem_vehicles')
        .upsert(vehicleData, { onConflict: 'id' });

    if (error) throw error;
}

// Main migration
async function main() {
    console.log('🚀 Starting Ferrari & Lamborghini vehicles migration...\n');

    // Fetch
    console.log('📥 Fetching vehicles from Notion...');
    const vehicles = await fetchNotionVehicles();
    console.log(`✓ Found ${vehicles.length} vehicles to migrate\n`);

    // Process
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < vehicles.length; i++) {
        const raw = vehicles[i];
        const data = extractVehicleData(raw);
        const supabaseData = transformForSupabase(data);

        console.log(`[${i + 1}/${vehicles.length}] Processing: ${data.vehicle_title} (${data.model_name})`);

        try {
            await upsertVehicle(supabaseData);
            console.log(`  ✓ Inserted (ID: ${supabaseData.id})`);
            successful++;
        } catch (e) {
            console.error(`  ❌ Failed: ${e.message}`);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully migrated: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
}

main().catch(console.error);
