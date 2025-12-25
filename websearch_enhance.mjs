#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// First, let me just update MINI 504 as a test
async function updateWheel504() {
  console.log('Updating MINI 504 Vanity Spoke...');

  const updates = {
    diameter_ref: ["18"],
    width_ref: ["7.0J"],
    bolt_pattern_ref: ["5x112"],
    center_bore_ref: ["66.6mm"],
    color_ref: ["Silver", "Spectre Grey", "Bicolor"],
    metal_type: "Aluminum Alloy"
  };

  const { data, error } = await supabase
    .from('oem_wheels')
    .update(updates)
    .eq('id', 'mini-504-vanity-spoke')
    .select();

  if (error) {
    console.error('Error:', error);
    return false;
  }

  console.log('✅ Updated:', data);
  return true;
}

updateWheel504().catch(console.error);
