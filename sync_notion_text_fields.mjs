#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";
const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_DB_ID = "1b417406-a14d-81cd-97bb-f544af38ecf1";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Fetch all MINI wheels from Notion
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
        property: "Brand Relation",
        rich_text: { contains: "Mini" }
      },
      page_size: 100
    })
  });

  const data = await response.json();
  return data.results;
}

// Extract text fields from Notion page
function extractTextFields(page) {
  const props = page.properties;

  return {
    wheel_name: props["Wheel Name"]?.title[0]?.plain_text || "",
    part_numbers: props["Part Numbers"]?.rich_text[0]?.plain_text || null,
    notes: props.Notes?.rich_text[0]?.plain_text || null
  };
}

// Slugify wheel name to match ID
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

async function syncTextFields() {
  console.log('📝 Syncing part_numbers and notes from Notion...\n');

  // Fetch from Notion
  const notionPages = await fetchNotionWheels();
  console.log(`Found ${notionPages.length} MINI wheels in Notion\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const page of notionPages) {
    const fields = extractTextFields(page);
    const wheelId = slugify(fields.wheel_name);  // Wheel name already includes "MINI"

    // Skip if no data to update
    if (!fields.part_numbers && !fields.notes) {
      continue;
    }

    // Build update object
    const updates = {};
    if (fields.part_numbers) updates.part_numbers = fields.part_numbers;
    if (fields.notes) updates.notes = fields.notes;

    // Update Supabase
    const { data, error } = await supabase
      .from('oem_wheels')
      .update(updates)
      .eq('id', wheelId)
      .select();

    if (error) {
      console.error(`❌ ${fields.wheel_name}: ${error.message}`);
      notFound++;
    } else if (data.length === 0) {
      console.log(`⚠️  ${fields.wheel_name}: Not found in Supabase (${wheelId})`);
      notFound++;
    } else {
      const fieldsUpdated = Object.keys(updates);
      console.log(`✅ ${fields.wheel_name}: Updated ${fieldsUpdated.join(', ')}`);
      updated++;
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 SYNC COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} wheels`);
  console.log(`❌ Not found: ${notFound} wheels`);
}

syncTextFields().catch(console.error);
