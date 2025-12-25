#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function linkImages() {
  console.log('🖼️  Linking wheel images to database records...\n');

  // Get all wheels
  const { data: wheels, error: wheelsError } = await supabase
    .from('oem_wheels')
    .select('id, wheel_title, good_pic_url')
    .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

  if (wheelsError) throw wheelsError;

  console.log(`Found ${wheels.length} MINI wheels\n`);

  // Get all images in storage
  const { data: images, error: imagesError } = await supabase.storage
    .from('oemwdb images')
    .list('wheels', { limit: 100 });

  if (imagesError) throw imagesError;

  console.log(`Found ${images.length} images in storage\n`);

  const results = [];
  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const wheel of wheels) {
    // Skip if already has image URL
    if (wheel.good_pic_url && typeof wheel.good_pic_url === 'string' && wheel.good_pic_url.length > 0) {
      skipped++;
      continue;
    }

    // Find matching image (filename should be wheel ID + .webp)
    const imageFile = images.find(img => img.name === `${wheel.id}.webp`);

    if (!imageFile) {
      console.log(`❌ ${wheel.wheel_title}: No image found for ${wheel.id}.webp`);
      notFound++;
      continue;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('oemwdb images')
      .getPublicUrl(`wheels/${imageFile.name}`);

    // Update database - store as string in good_pic_url
    const { error: updateError } = await supabase
      .from('oem_wheels')
      .update({ good_pic_url: publicUrl })
      .eq('id', wheel.id);

    if (updateError) {
      console.error(`❌ ${wheel.wheel_title}: Update failed - ${updateError.message}`);
      results.push({ success: false, wheel: wheel.wheel_title, error: updateError.message });
    } else {
      console.log(`✅ ${wheel.wheel_title}`);
      updated++;
      results.push({ success: true, wheel: wheel.wheel_title });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Linked: ${updated} images`);
  console.log(`⏭️  Skipped: ${skipped} (already had images)`);
  console.log(`❌ Not found: ${notFound} images`);

  if (notFound > 0) {
    console.log('\n💡 Tip: Image filenames must match wheel IDs exactly');
  }
}

linkImages().catch(console.error);
