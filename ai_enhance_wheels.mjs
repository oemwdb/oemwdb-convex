#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDU2NjYsImV4cCI6MjA4MjA4MTY2Nn0.JHggoRpYAVvPQQ1-M7p0NZ2SpQFxYNwWZKDbsnRvqMc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const anthropic = new Anthropic();

// Get all Mini wheels
async function getWheels() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('*')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (error) throw error;
  return data;
}

// Use AI to extract missing data
async function extractDataWithAI(wheel) {
  const prompt = `Analyze this MINI wheel data and extract missing information:

Wheel: ${wheel.wheel_title}
Part Numbers: ${wheel.part_numbers || 'N/A'}
Notes: ${wheel.notes || 'N/A'}

Extract and return ONLY valid JSON with this exact structure:
{
  "color_ref": ["color1", "color2"],
  "metal_type": "Aluminum Alloy" or "Forged Aluminum" or "Steel" or "",
  "diameter_ref": ["17", "18"],
  "width_ref": ["7J", "7.5J"],
  "bolt_pattern_ref": ["5x112", "4x100"],
  "center_bore_ref": ["56.1mm", "66.6mm"]
}

Rules:
- Extract colors from part numbers (e.g., "Spectre Grey", "Silver", "Black")
- For MINI wheels: R-series use 4x100 bolt pattern and 56.1mm bore, F-series use 5x112 and 56.1mm/66.6mm
- Extract diameter from wheel name (e.g., "497" is 17", R-series typically 15-17", F-series 16-19")
- Width from part numbers or typical for that wheel
- Only include data you're confident about
- If uncertain, use empty array [] or ""`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  const jsonText = response.content[0].text;
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  return JSON.parse(jsonMatch[0]);
}

// Process wheel
async function processWheel(wheel, index, total) {
  console.log(`\n[${index + 1}/${total}] ${wheel.wheel_title}`);

  try {
    const aiData = await extractDataWithAI(wheel);

    if (!aiData) {
      console.log('  ❌ AI extraction failed');
      return { success: false, wheel: wheel.wheel_title };
    }

    // Merge with existing data (don't overwrite if exists)
    const updates = {};

    if (aiData.color_ref?.length > 0 && (!wheel.color_ref || wheel.color_ref.length === 0)) {
      updates.color_ref = aiData.color_ref;
      console.log(`  ✓ Colors: ${aiData.color_ref.join(', ')}`);
    }

    if (aiData.metal_type && !wheel.metal_type) {
      updates.metal_type = aiData.metal_type;
      console.log(`  ✓ Metal: ${aiData.metal_type}`);
    }

    if (aiData.diameter_ref?.length > 0 && (!wheel.diameter_ref || wheel.diameter_ref.length === 0)) {
      updates.diameter_ref = aiData.diameter_ref;
      console.log(`  ✓ Diameter: ${aiData.diameter_ref.join(', ')}"`)
;
    }

    if (aiData.width_ref?.length > 0 && (!wheel.width_ref || wheel.width_ref.length === 0)) {
      updates.width_ref = aiData.width_ref;
      console.log(`  ✓ Width: ${aiData.width_ref.join(', ')}`);
    }

    if (aiData.bolt_pattern_ref?.length > 0 && (!wheel.bolt_pattern_ref || wheel.bolt_pattern_ref.length === 0)) {
      updates.bolt_pattern_ref = aiData.bolt_pattern_ref;
      console.log(`  ✓ Bolt: ${aiData.bolt_pattern_ref.join(', ')}`);
    }

    if (aiData.center_bore_ref?.length > 0 && (!wheel.center_bore_ref || wheel.center_bore_ref.length === 0)) {
      updates.center_bore_ref = aiData.center_bore_ref;
      console.log(`  ✓ Bore: ${aiData.center_bore_ref.join(', ')}`);
    }

    if (Object.keys(updates).length === 0) {
      console.log('  → Already complete');
      return { success: true, wheel: wheel.wheel_title, updated: false };
    }

    // Update Supabase
    const { error } = await supabase
      .from('oem_wheels')
      .update(updates)
      .eq('id', wheel.id);

    if (error) throw error;

    console.log(`  ✅ Updated Supabase`);
    return { success: true, wheel: wheel.wheel_title, updated: true };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, wheel: wheel.wheel_title, error: error.message };
  }
}

// Main
async function main() {
  console.log('🤖 AI-Powered MINI Wheels Enhancement\n');

  const wheels = await getWheels();
  console.log(`Found ${wheels.length} wheels\n`);

  const results = [];
  for (let i = 0; i < wheels.length; i++) {
    const result = await processWheel(wheels[i], i, wheels.length);
    results.push(result);

    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  const successful = results.filter(r => r.success).length;
  const updated = results.filter(r => r.updated).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successful}`);
  console.log(`📝 Updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failures:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.wheel}: ${r.error}`);
    });
  }
}

main().catch(console.error);
