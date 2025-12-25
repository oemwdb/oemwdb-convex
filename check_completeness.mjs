#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkCompleteness() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('*')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (error) throw error;

  console.log(`📊 Completeness Check for ${data.length} MINI Wheels\n`);

  const fields = {
    'metal_type': 0,
    'color_ref': 0,
    'diameter_ref': 0,
    'width_ref': 0,
    'bolt_pattern_ref': 0,
    'center_bore_ref': 0,
    'part_numbers': 0,
    'notes': 0,
    'good_pic_url': 0
  };

  const incomplete = [];

  for (const wheel of data) {
    const missing = [];

    if (!wheel.metal_type) {
      fields.metal_type++;
      missing.push('metal_type');
    }
    if (!wheel.color_ref || wheel.color_ref.length === 0) {
      fields.color_ref++;
      missing.push('color_ref');
    }
    if (!wheel.diameter_ref || wheel.diameter_ref.length === 0) {
      fields.diameter_ref++;
      missing.push('diameter_ref');
    }
    if (!wheel.width_ref || wheel.width_ref.length === 0) {
      fields.width_ref++;
      missing.push('width_ref');
    }
    if (!wheel.bolt_pattern_ref || wheel.bolt_pattern_ref.length === 0) {
      fields.bolt_pattern_ref++;
      missing.push('bolt_pattern_ref');
    }
    if (!wheel.center_bore_ref || wheel.center_bore_ref.length === 0) {
      fields.center_bore_ref++;
      missing.push('center_bore_ref');
    }
    if (!wheel.part_numbers) {
      fields.part_numbers++;
      missing.push('part_numbers');
    }
    if (!wheel.notes) {
      fields.notes++;
      missing.push('notes');
    }
    if (!wheel.good_pic_url || (typeof wheel.good_pic_url === 'string' && wheel.good_pic_url.length === 0)) {
      fields.good_pic_url++;
      missing.push('good_pic_url');
    }

    if (missing.length > 0) {
      incomplete.push({
        title: wheel.wheel_title,
        missing: missing
      });
    }
  }

  console.log('Missing Data Summary:');
  console.log('='.repeat(60));
  for (const [field, count] of Object.entries(fields)) {
    const percentage = ((data.length - count) / data.length * 100).toFixed(1);
    const status = count === 0 ? '✅' : count < 10 ? '⚠️' : '❌';
    console.log(`${status} ${field.padEnd(20)} ${count} missing (${percentage}% complete)`);
  }

  if (incomplete.length > 0) {
    console.log(`\n\nWheels with Missing Data (${incomplete.length}):`);
    console.log('='.repeat(60));
    incomplete.slice(0, 20).forEach(w => {
      console.log(`\n${w.title}`);
      console.log(`  Missing: ${w.missing.join(', ')}`);
    });
    if (incomplete.length > 20) {
      console.log(`\n... and ${incomplete.length - 20} more`);
    }
  } else {
    console.log('\n🎉 All wheels are 100% complete!');
  }
}

checkCompleteness().catch(console.error);
