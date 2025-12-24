#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDU2NjYsImV4cCI6MjA4MjA4MTY2Nn0.JHggoRpYAVvPQQ1-M7p0NZ2SpQFxYNwWZKDbsnRvqMc";
const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_WHEELS_DB = "1b417406-a14d-81cd-97bb-f544af38ecf1";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to slugify wheel names
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fetch all Mini wheels from Supabase
async function getSupabaseWheels() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('id, wheel_title')
    .contains('brand_ref', [{ value: 'mini' }]);

  if (error) throw error;
  return data;
}

// Fetch wheel from Notion by wheel name
async function getNotionWheel(wheelName) {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_WHEELS_DB}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      filter: {
        property: "Wheel Name",
        title: {
          equals: wheelName
        }
      },
      page_size: 1
    })
  });

  const data = await response.json();
  return data.results[0];
}

// Extract color and metal type from Notion page
function extractMissingData(notionPage) {
  if (!notionPage) return null;

  const props = notionPage.properties;

  const colorMultiSelect = props.Color?.multi_select || [];
  const metalType = props["Metal Type"]?.select?.name || "";

  return {
    color_ref: colorMultiSelect.map(c => c.name),
    metal_type: metalType
  };
}

// Update wheel in Supabase
async function updateWheel(wheelId, updates) {
  const { error } = await supabase
    .from('oem_wheels')
    .update(updates)
    .eq('id', wheelId);

  if (error) throw error;
}

// Process single wheel
async function processWheel(wheel, index, total) {
  console.log(`\n[${index + 1}/${total}] Processing: ${wheel.wheel_title}`);

  try {
    // Fetch from Notion
    const notionPage = await getNotionWheel(wheel.wheel_title);

    if (!notionPage) {
      console.error(`  ❌ Not found in Notion`);
      return { success: false, wheel: wheel.wheel_title, error: 'Not found in Notion' };
    }

    // Extract missing data
    const updates = extractMissingData(notionPage);

    if (!updates) {
      console.error(`  ❌ Failed to extract data`);
      return { success: false, wheel: wheel.wheel_title, error: 'Failed to extract' };
    }

    console.log(`  ✓ Color: ${updates.color_ref.join(', ') || 'none'}`);
    console.log(`  ✓ Metal: ${updates.metal_type || 'none'}`);

    // Update Supabase
    await updateWheel(wheel.id, updates);
    console.log(`  ✓ Updated in Supabase`);

    return { success: true, wheel: wheel.wheel_title };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, wheel: wheel.wheel_title, error: error.message };
  }
}

// Main
async function main() {
  console.log('🚀 Starting Mini wheels enhancement...\n');

  // Get all Mini wheels from Supabase
  console.log('📥 Fetching Mini wheels from Supabase...');
  const wheels = await getSupabaseWheels();
  console.log(`✓ Found ${wheels.length} wheels to enhance\n`);

  // Process each wheel
  const results = [];
  for (let i = 0; i < wheels.length; i++) {
    const result = await processWheel(wheels[i], i, wheels.length);
    results.push(result);

    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 ENHANCEMENT COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully enhanced: ${successful} wheels`);
  console.log(`❌ Failed: ${failed} wheels`);

  if (failed > 0) {
    console.log('\n❌ Failed wheels:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.wheel}: ${r.error}`);
    });
  }
}

main().catch(console.error);
