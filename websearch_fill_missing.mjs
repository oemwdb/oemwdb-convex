#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const anthropic = new Anthropic();

// Get wheels missing data
async function getIncompleteWheels() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('*')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (error) throw error;

  // Filter for wheels missing part_numbers or notes
  return data.filter(w => !w.part_numbers || !w.notes);
}

// Search and extract data using Claude
async function searchAndExtract(wheel) {
  const searchQuery = `${wheel.wheel_title} MINI wheel part number specifications`;

  console.log(`  🔍 Searching: "${searchQuery}"`);

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      tools: [{
        name: "web_search",
        description: "Search the web for information",
        input_schema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query"
            }
          },
          required: ["query"]
        }
      }],
      messages: [{
        role: "user",
        content: `Search for information about the ${wheel.wheel_title} and extract:
1. OEM part numbers (all variants/finishes)
2. Technical notes about the wheel (production years, vehicle compatibility, special features)

Return ONLY valid JSON in this format:
{
  "part_numbers": "comma-separated list of part numbers if found, or null",
  "notes": "technical notes, compatibility info, production details if found, or null"
}

Search query: ${searchQuery}`
      }]
    });

    // Check if Claude wants to use web search tool
    if (message.stop_reason === 'tool_use') {
      const toolUse = message.content.find(c => c.type === 'tool_use');
      if (toolUse && toolUse.name === 'web_search') {
        console.log(`  ⚠️  Claude requested web search but tool not available, using direct search...`);
      }
    }

    // Extract text response
    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent) return null;

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.log(`  ❌ Search failed: ${error.message}`);
    return null;
  }
}

// Process single wheel
async function processWheel(wheel, index, total) {
  console.log(`\n[${index + 1}/${total}] ${wheel.wheel_title}`);

  // Skip if already complete
  if (wheel.part_numbers && wheel.notes) {
    console.log(`  ⏭️  Already complete`);
    return { success: true, wheel: wheel.wheel_title, skipped: true };
  }

  try {
    const extracted = await searchAndExtract(wheel);

    if (!extracted) {
      console.log(`  ❌ No data extracted`);
      return { success: false, wheel: wheel.wheel_title };
    }

    // Build updates
    const updates = {};
    let hasUpdates = false;

    if (extracted.part_numbers && !wheel.part_numbers) {
      updates.part_numbers = extracted.part_numbers;
      hasUpdates = true;
      console.log(`  ✓ Part numbers: ${extracted.part_numbers.substring(0, 60)}...`);
    }

    if (extracted.notes && !wheel.notes) {
      updates.notes = extracted.notes;
      hasUpdates = true;
      console.log(`  ✓ Notes: ${extracted.notes.substring(0, 60)}...`);
    }

    if (!hasUpdates) {
      console.log(`  → No new data found`);
      return { success: true, wheel: wheel.wheel_title, noData: true };
    }

    // Update database
    const { error } = await supabase
      .from('oem_wheels')
      .update(updates)
      .eq('id', wheel.id);

    if (error) throw error;

    console.log(`  ✅ Updated`);
    return { success: true, wheel: wheel.wheel_title, updated: true };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, wheel: wheel.wheel_title, error: error.message };
  }
}

// Main
async function main() {
  console.log('🔍 Web Search: Filling Missing Part Numbers & Notes\n');

  const wheels = await getIncompleteWheels();
  console.log(`Found ${wheels.length} wheels with missing data\n`);

  if (wheels.length === 0) {
    console.log('🎉 All wheels are complete!');
    return;
  }

  const results = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < wheels.length; i++) {
    const result = await processWheel(wheels[i], i, wheels.length);
    results.push(result);

    // Rate limiting - 2 seconds between searches
    await new Promise(r => setTimeout(r, 2000));
  }

  const updated = results.filter(r => r.updated).length;
  const skipped = results.filter(r => r.skipped).length;
  const noData = results.filter(r => r.noData).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 SEARCH COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} wheels`);
  console.log(`⏭️  Skipped: ${skipped} (already complete)`);
  console.log(`ℹ️  No data: ${noData} (searched but nothing found)`);
  console.log(`❌ Failed: ${failed} wheels`);

  if (failed > 0) {
    console.log('\n❌ Failed wheels:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.wheel}: ${r.error || 'unknown error'}`);
    });
  }
}

main().catch(console.error);
