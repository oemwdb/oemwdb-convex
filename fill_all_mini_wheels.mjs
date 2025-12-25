#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Infer specs based on wheel name patterns
function inferSpecs(wheelTitle) {
  const title = wheelTitle.toLowerCase();
  const specs = {};

  // Determine series (R-series vs F-series)
  const isRSeries = /\br\d+/i.test(wheelTitle);
  const isFSeries = /\b(f55|f56|f57|f60|f54)/i.test(wheelTitle) ||
                    /\b(4\d{2}|5\d{2}|9\d{2}|8\d{2}|7\d{2})/i.test(wheelTitle);

  // Bolt pattern and center bore based on series
  if (isRSeries) {
    specs.bolt_pattern_ref = ["4x100"];
    specs.center_bore_ref = ["56.1mm"];
  } else if (isFSeries || !isRSeries) { // Default to F-series
    specs.bolt_pattern_ref = ["5x112"];
    specs.center_bore_ref = ["56.1mm", "66.6mm"];
  }

  // Metal type (all aluminum alloy except steel wheels)
  specs.metal_type = title.includes('steel') ? 'Steel' : 'Aluminum Alloy';

  // Diameter inference
  if (isRSeries) {
    specs.diameter_ref = ["15", "16", "17"]; // R-series common sizes
  } else {
    // F-series typically 16-19"
    const num = wheelTitle.match(/\b([4-9]\d{2})\b/);
    if (num) {
      const n = parseInt(num[1]);
      if (n >= 400 && n < 500) specs.diameter_ref = ["16", "17"];
      else if (n >= 500 && n < 600) specs.diameter_ref = ["17", "18"];
      else if (n >= 900) specs.diameter_ref = ["17", "18", "19"];
      else specs.diameter_ref = ["17", "18"];
    } else {
      specs.diameter_ref = ["17", "18"];
    }
  }

  // Width inference
  if (title.includes('steel')) {
    specs.width_ref = ["5.5J", "6J"];
  } else if (title.includes('jcw')) {
    specs.width_ref = ["7J", "7.5J", "8J"];
  } else {
    specs.width_ref = ["6.5J", "7J"];
  }

  return specs;
}

// Get all Mini wheels
async function getAllWheels() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('id, wheel_title, diameter_ref, width_ref, bolt_pattern_ref, center_bore_ref, metal_type, color_ref')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (error) throw error;
  return data;
}

// Update wheel
async function updateWheel(id, updates) {
  const { data, error } = await supabase
    .from('oem_wheels')
    .update(updates)
    .eq('id', id)
    .select('id, wheel_title');

  if (error) throw error;
  return data;
}

// Process all wheels
async function processAllWheels() {
  console.log('🚀 Filling ALL Mini wheels with intelligent inference...\n');

  const wheels = await getAllWheels();
  console.log(`Found ${wheels.length} wheels\n`);

  let updated = 0;
  let skipped = 0;

  for (const wheel of wheels) {
    const needsUpdate =
      (!wheel.diameter_ref || wheel.diameter_ref.length === 0) ||
      (!wheel.width_ref || wheel.width_ref.length === 0) ||
      (!wheel.bolt_pattern_ref || wheel.bolt_pattern_ref.length === 0) ||
      (!wheel.center_bore_ref || wheel.center_bore_ref.length === 0) ||
      (!wheel.metal_type || wheel.metal_type === '');

    if (!needsUpdate) {
      console.log(`⏭️  ${wheel.wheel_title} - Already complete`);
      skipped++;
      continue;
    }

    const inferredSpecs = inferSpecs(wheel.wheel_title);
    const updates = {};

    if (!wheel.diameter_ref || wheel.diameter_ref.length === 0) updates.diameter_ref = inferredSpecs.diameter_ref;
    if (!wheel.width_ref || wheel.width_ref.length === 0) updates.width_ref = inferredSpecs.width_ref;
    if (!wheel.bolt_pattern_ref || wheel.bolt_pattern_ref.length === 0) updates.bolt_pattern_ref = inferredSpecs.bolt_pattern_ref;
    if (!wheel.center_bore_ref || wheel.center_bore_ref.length === 0) updates.center_bore_ref = inferredSpecs.center_bore_ref;
    if (!wheel.metal_type || wheel.metal_type === '') updates.metal_type = inferredSpecs.metal_type;

    if (Object.keys(updates).length > 0) {
      await updateWheel(wheel.id, updates);
      console.log(`✅ ${wheel.wheel_title}`);
      console.log(`   ${JSON.stringify(updates, null, 2).split('\n').join('\n   ')}`);
      updated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} wheels`);
  console.log(`⏭️  Skipped: ${skipped} wheels (already complete)`);
}

processAllWheels().catch(console.error);
