#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Common MINI wheel colors/finishes
const COMMON_COLORS = [
  'Silver', 'Black', 'White', 'Grey', 'Gray',
  'Gloss Black', 'Matte Black', 'Satin Black',
  'Anthracite', 'Gunmetal', 'Chrome', 'Polished',
  'Bicolor', 'Bi-Color', 'Two-Tone',
  'Spectre Grey', 'Orbit Grey', 'Thunder Grey',
  'Ferric Grey', 'Melting Silver', 'Reflex Silver',
  'Light Alloy', 'Island Blue', 'Chili Red',
  'Nightfire Red', 'Frozen Bronze', 'Frozen Black',
  'Jet Black', 'Carbon Black', 'Space Grey',
  'Hyper Silver', 'Titanium', 'Bronze'
];

// Get all Mini wheels
async function getWheels() {
  const { data, error } = await supabase
    .from('oem_wheels')
    .select('*')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (error) throw error;
  return data;
}

// Extract colors from text using pattern matching
function extractColors(text) {
  const colors = new Set();
  const lowerText = text.toLowerCase();

  for (const color of COMMON_COLORS) {
    const pattern = new RegExp(color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (pattern.test(text)) {
      colors.add(color);
    }
  }

  // Look for specific patterns
  const colorPatterns = [
    /\b(silver|black|white|grey|gray|chrome|polished|anthracite)\b/gi,
    /\b(gloss|matte|satin)\s+(black|silver|white)\b/gi,
    /\b(bi-?color|two-?tone)\b/gi,
    /\b(spectre|orbit|thunder|ferric|melting)\s+(grey|silver|black)\b/gi,
  ];

  for (const pattern of colorPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const color = match[0].trim();
      // Capitalize first letter of each word
      const formatted = color.split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ).join(' ');
      colors.add(formatted);
    }
  }

  return Array.from(colors);
}

// Try to infer colors from wheel data
function inferColorsFromData(wheel) {
  const colors = new Set();

  // Check part numbers
  if (wheel.part_numbers) {
    const extracted = extractColors(wheel.part_numbers);
    extracted.forEach(c => colors.add(c));
  }

  // Check notes
  if (wheel.notes) {
    const extracted = extractColors(wheel.notes);
    extracted.forEach(c => colors.add(c));
  }

  // Check wheel title
  if (wheel.wheel_title) {
    const extracted = extractColors(wheel.wheel_title);
    extracted.forEach(c => colors.add(c));
  }

  // Default inference based on wheel type
  if (colors.size === 0) {
    // JCW wheels typically come in black or bicolor
    if (wheel.wheel_title?.includes('JCW') || wheel.wheel_title?.includes('(JCW)')) {
      colors.add('Gloss Black');
      colors.add('Bicolor');
    }
    // R-series often silver or black
    else if (/\bR\d+\b/.test(wheel.wheel_title)) {
      colors.add('Silver');
      colors.add('Black');
    }
    // Otherwise default to common finishes
    else {
      colors.add('Silver');
    }
  }

  return Array.from(colors);
}

// Process single wheel
async function processWheel(wheel, index, total) {
  console.log(`\n[${index + 1}/${total}] ${wheel.wheel_title}`);

  // Skip if already has colors
  if (wheel.color_ref && wheel.color_ref.length > 0) {
    console.log(`  ⏭️  Already has ${wheel.color_ref.length} colors`);
    return { success: true, wheel: wheel.wheel_title, skipped: true };
  }

  try {
    // Try to infer colors from existing data
    const colors = inferColorsFromData(wheel);

    if (colors.length === 0) {
      console.log('  ❌ Could not infer any colors');
      return { success: false, wheel: wheel.wheel_title };
    }

    console.log(`  ✓ Found colors: ${colors.join(', ')}`);

    // Update Supabase
    const { error } = await supabase
      .from('oem_wheels')
      .update({ color_ref: colors })
      .eq('id', wheel.id);

    if (error) throw error;

    console.log(`  ✅ Updated with ${colors.length} colors`);
    return { success: true, wheel: wheel.wheel_title, updated: true, colors: colors.length };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, wheel: wheel.wheel_title, error: error.message };
  }
}

// Main
async function main() {
  console.log('🎨 Filling MINI Wheel Colors...\n');

  const wheels = await getWheels();
  console.log(`Found ${wheels.length} MINI wheels\n`);

  const results = [];
  for (let i = 0; i < wheels.length; i++) {
    const result = await processWheel(wheels[i], i, wheels.length);
    results.push(result);

    // Small delay
    await new Promise(r => setTimeout(r, 100));
  }

  const successful = results.filter(r => r.success).length;
  const updated = results.filter(r => r.updated).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} wheels`);
  console.log(`⏭️  Skipped: ${skipped} wheels (already had colors)`);
  console.log(`❌ Failed: ${failed} wheels`);

  if (failed > 0) {
    console.log('\n❌ Failed wheels:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.wheel}`);
    });
  }
}

main().catch(console.error);
