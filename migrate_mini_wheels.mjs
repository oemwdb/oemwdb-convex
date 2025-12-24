#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDU2NjYsImV4cCI6MjA4MjA4MTY2Nn0.JHggoRpYAVvPQQ1-M7p0NZ2SpQFxYNwWZKDbsnRvqMc";
const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_DB_ID = "1b417406-a14d-81cd-97bb-f544af38ecf1";

const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to slugify wheel names
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fetch wheels from Notion
async function fetchNotionWheels() {
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
          { property: "Brand Relation", rich_text: { contains: "Mini" } }
        ]
      },
      page_size: 100
    })
  });

  const data = await response.json();
  return data.results;
}

// Extract wheel properties
function extractWheelData(page) {
  const props = page.properties;
  return {
    page_id: page.id,
    wheel_name: props["Wheel Name"]?.title[0]?.plain_text || "",
    brand: props["Brand Relation"]?.rich_text[0]?.plain_text || "",
    diameter: props["Diameter Text"]?.rich_text[0]?.plain_text || "",
    width: props.Width?.rich_text[0]?.plain_text || "",
    bolt_pattern: props["Bolt Pattern Text"]?.rich_text[0]?.plain_text || "",
    center_bore: props["Center Bore"]?.rich_text[0]?.plain_text || "",
    color: props.Color?.multi_select || [],
    offset: props.Offset?.rich_text[0]?.plain_text || "",
    part_numbers: props["Part Numbers"]?.rich_text[0]?.plain_text || "",
    metal_type: props["Metal Type"]?.select?.name || "",
    notes: props.Notes?.rich_text[0]?.plain_text || "",
    weight: props.Weight?.rich_text[0]?.plain_text || "",
    good_pic: props["GoodPic (RFW)"]?.files[0]?.file?.url || props["GoodPic (RFW)"]?.files[0]?.external?.url || "",
    bad_pic: props.BadPIC?.files[0]?.file?.url || props.BadPIC?.files[0]?.external?.url || "",
    status: props.Status?.status?.name || ""
  };
}

// Transform for Supabase
function transformForSupabase(wheel) {
  return {
    id: slugify(wheel.wheel_name),
    wheel_title: wheel.wheel_name,
    brand_ref: [{ value: wheel.brand.toLowerCase() }],
    diameter_ref: [wheel.diameter.replace(" inch", "")],
    width_ref: [wheel.width],
    bolt_pattern_ref: [wheel.bolt_pattern],
    center_bore_ref: [wheel.center_bore],
    color_ref: wheel.color.map(c => c.name),
    wheel_offset: wheel.offset,
    part_numbers: wheel.part_numbers,
    metal_type: wheel.metal_type,
    notes: wheel.notes,
    weight: wheel.weight,
    good_pic_url: null,
    bad_pic_url: null,
    vehicle_ref: []
  };
}

// Download image
async function downloadImage(url, wheelId) {
  if (!url) return null;

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const filePath = `/tmp/${wheelId}.webp`;
    writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  } catch (error) {
    console.error(`  ❌ Failed to download image: ${error.message}`);
    return null;
  }
}

// Upload to Supabase Storage
async function uploadToStorage(wheelId, localPath) {
  if (!localPath) return null;

  try {
    const fileBuffer = readFileSync(localPath);
    const fileName = `wheels/${wheelId}.webp`;

    const { error } = await supabaseService.storage
      .from('oemwdb images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/webp',
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
async function upsertWheel(wheelData) {
  const { error } = await supabaseAnon
    .from('oem_wheels')
    .upsert(wheelData, { onConflict: 'id' });

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

// Process single wheel
async function processWheel(page, index, total) {
  const wheel = extractWheelData(page);
  console.log(`\n[${index + 1}/${total}] Processing: ${wheel.wheel_name}`);

  try {
    // Transform data
    const supabaseData = transformForSupabase(wheel);
    console.log(`  ✓ Data transformed (ID: ${supabaseData.id})`);

    // Handle images
    if (wheel.good_pic) {
      const localPath = await downloadImage(wheel.good_pic, supabaseData.id + '-good');
      if (localPath) {
        supabaseData.good_pic_url = await uploadToStorage(supabaseData.id + '-good', localPath);
        console.log(`  ✓ Good pic uploaded`);
      }
    }

    if (wheel.bad_pic) {
      const localPath = await downloadImage(wheel.bad_pic, supabaseData.id);
      if (localPath) {
        supabaseData.bad_pic_url = await uploadToStorage(supabaseData.id, localPath);
        console.log(`  ✓ Bad pic uploaded`);
      }
    }

    // Upsert to Supabase
    await upsertWheel(supabaseData);
    console.log(`  ✓ Inserted into Supabase`);

    // Update Notion
    await updateNotionStatus(wheel.page_id);
    console.log(`  ✓ Notion status updated`);

    return { success: true, wheel: wheel.wheel_name };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, wheel: wheel.wheel_name, error: error.message };
  }
}

// Main migration
async function main() {
  console.log('🚀 Starting Mini wheels migration...\n');

  // Fetch wheels
  console.log('📥 Fetching wheels from Notion...');
  const wheels = await fetchNotionWheels();
  console.log(`✓ Found ${wheels.length} wheels to migrate\n`);

  // Process each wheel
  const results = [];
  for (let i = 0; i < wheels.length; i++) {
    const result = await processWheel(wheels[i], i, wheels.length);
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
  console.log(`✅ Successfully migrated: ${successful} wheels`);
  console.log(`❌ Failed: ${failed} wheels`);

  if (failed > 0) {
    console.log('\n❌ Failed wheels:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.wheel}: ${r.error}`);
    });
  }
}

main().catch(console.error);
