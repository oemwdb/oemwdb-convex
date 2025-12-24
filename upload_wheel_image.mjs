#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const wheelId = process.argv[2];
const imagePath = process.argv[3];

if (!wheelId || !imagePath) {
  console.error('Usage: node upload_wheel_image.mjs <wheel-id> <image-path>');
  process.exit(1);
}

async function uploadImage() {
  try {
    const fileBuffer = readFileSync(imagePath);
    const fileName = `wheels/${wheelId}.webp`;

    console.log(`Uploading to bucket: oemwdb images`);
    console.log(`File path: ${fileName}`);

    const { data, error } = await supabase.storage
      .from('oemwdb images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      process.exit(1);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('oemwdb images')
      .getPublicUrl(fileName);

    console.log('Success!');
    console.log(publicUrl);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadImage();
