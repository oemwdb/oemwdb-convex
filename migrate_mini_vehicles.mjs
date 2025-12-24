#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

// Configuration
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDU2NjYsImV4cCI6MjA4MjA4MTY2Nn0.JHggoRpYAVvPQQ1-M7p0NZ2SpQFxYNwWZKDbsnRvqMc";
const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_DB_ID = "1b417406a14d81c4a685d72e258420b8";

const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch vehicles from Notion
async function fetchNotionVehicles() {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      filter: {
        and: [
          {
            or: [
              { property: "Status", status: { does_not_equal: "Ported to SupaBase" } },
              { property: "Status", status: { is_empty: true } }
            ]
          },
          { property: "Brand Name", rich_text: { contains: "MINI" } }
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

  // OEM Chassis Code is the title and contains the full vehicle ID
  const chassisCodeTitle = props["OEM Chassis Code"]?.title[0]?.plain_text || "";

  return {
    page_id: page.id,
    id: chassisCodeTitle, // e.g., "MINI - R60: Countryman"
    brand_name: props["Brand Name"]?.rich_text[0]?.plain_text || "",
    model_name: props["Model Name"]?.rich_text[0]?.plain_text || "",
    lineage: props.Lineage?.rich_text[0]?.plain_text || "",
    production_years: props["Productions Years Range"]?.rich_text[0]?.plain_text || "",
    generation: props["Generation Tag"]?.select?.name || "",
    platform: props.Platform?.rich_text[0]?.plain_text || "",
    bolt_pattern: props["Bolt Pattern"]?.rich_text[0]?.plain_text || "",
    center_bore: props["Center Bore"]?.rich_text[0]?.plain_text || "",
    technical_specs: props["Technical Specs"]?.rich_text[0]?.plain_text || "",
    production_stats: props["Production Stats"]?.rich_text[0]?.plain_text || "",
    special_notes: props["Special Notes"]?.rich_text[0]?.plain_text || "",
    market_info: props["Market Info"]?.rich_text[0]?.plain_text || "",
    hero_image: props["Hero Image"]?.files[0]?.file?.url || props["Hero Image"]?.files[0]?.external?.url || "",
    status: props.Status?.status?.name || ""
  };
}

// Transform for Supabase
function transformForSupabase(vehicle) {
  // Extract vehicle_id_only (e.g., "R60" from "MINI - R60: Countryman")
  const vehicleIdMatch = vehicle.id.match(/- ([^:]+):/);
  const vehicle_id_only = vehicleIdMatch ? vehicleIdMatch[1].trim() : "";

  // Extract vehicle_title (e.g., "Countryman" from "MINI - R60: Countryman")
  const vehicleTitleMatch = vehicle.id.match(/: (.+)$/);
  const vehicle_title = vehicleTitleMatch ? vehicleTitleMatch[1].trim() : "";

  return {
    id: vehicle.id,
    vehicle_id_only: vehicle_id_only,
    vehicle_title: vehicle_title,
    model_name: vehicle.model_name || vehicle_title,
    brand_ref: ["MINI"],
    generation: vehicle.generation,
    production_years: vehicle.production_years,
    bolt_pattern_ref: vehicle.bolt_pattern ? [vehicle.bolt_pattern] : [],
    center_bore_ref: vehicle.center_bore ? [vehicle.center_bore] : [],
    detailed_specs: vehicle.technical_specs,
    production_stats: vehicle.production_stats,
    vehicle_image: null, // Will update if image exists
    diameter_ref: [],
    width_ref: [],
    color_ref: [],
    wheel_ref: [],
    oem_engine_ref: []
  };
}

// Download image
async function downloadImage(url, vehicleId) {
  if (!url) return null;

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const safeName = vehicleId.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filePath = `/tmp/${safeName}.jpg`;
    writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  } catch (error) {
    console.error(`  ❌ Failed to download image: ${error.message}`);
    return null;
  }
}

// Upload to Supabase Storage
async function uploadToStorage(vehicleId, localPath) {
  if (!localPath) return null;

  try {
    const { readFileSync } = await import('fs');
    const fileBuffer = readFileSync(localPath);
    const safeName = vehicleId.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const fileName = `vehicles/${safeName}.jpg`;

    const { error } = await supabaseService.storage
      .from('oemwdb images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseService.storage
      .from('oemwdb images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error(`  ❌ Failed to upload image: ${error.message}`);
    return null;
  }
}

// Upsert to Supabase
async function upsertVehicle(vehicleData) {
  const { error } = await supabaseAnon
    .from('oem_vehicles')
    .upsert(vehicleData, { onConflict: 'id' });

  if (error) throw error;
}

// Update Notion status
async function updateNotionStatus(pageId) {
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      properties: {
        Status: {
          status: { name: "Ported to SupaBase" }
        }
      }
    })
  });
}

// Process single vehicle
async function processVehicle(page, index, total) {
  const vehicle = extractVehicleData(page);
  console.log(`\n[${index + 1}/${total}] Processing: ${vehicle.id}`);

  if (!vehicle.id) {
    console.error(`  ❌ Missing vehicle ID, skipping`);
    return { success: false, vehicle: 'Unknown', error: 'Missing ID' };
  }

  try {
    // Transform data
    const supabaseData = transformForSupabase(vehicle);
    console.log(`  ✓ Data transformed`);

    // Handle image
    if (vehicle.hero_image) {
      const localPath = await downloadImage(vehicle.hero_image, vehicle.id);
      if (localPath) {
        supabaseData.vehicle_image = await uploadToStorage(vehicle.id, localPath);
        console.log(`  ✓ Image uploaded`);
      }
    }

    // Upsert to Supabase
    await upsertVehicle(supabaseData);
    console.log(`  ✓ Inserted into Supabase`);

    // Update Notion
    await updateNotionStatus(vehicle.page_id);
    console.log(`  ✓ Notion status updated`);

    return { success: true, vehicle: vehicle.id };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, vehicle: vehicle.id, error: error.message };
  }
}

// Main migration
async function main() {
  console.log('🚀 Starting Mini vehicles migration...\n');

  // Fetch vehicles
  console.log('📥 Fetching vehicles from Notion...');
  const vehicles = await fetchNotionVehicles();
  console.log(`✓ Found ${vehicles.length} vehicles to migrate\n`);

  // Process each vehicle
  const results = [];
  for (let i = 0; i < vehicles.length; i++) {
    const result = await processVehicle(vehicles[i], i, vehicles.length);
    results.push(result);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 MIGRATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${successful} vehicles`);
  console.log(`❌ Failed: ${failed} vehicles`);

  if (failed > 0) {
    console.log('\n❌ Failed vehicles:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.vehicle}: ${r.error}`);
    });
  }
}

main().catch(console.error);
