import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY or SUPABASE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function analyzeOffsets() {
    console.log('🚀 Analyizing offsets...');

    // Check if offset_ref exists? 
    // We can just try to select it. If it fails, it doesn't exist.
    const { data: testData, error: schemaError } = await supabase.from('oem_wheels').select('offset_ref').limit(1);
    if (schemaError) {
        console.log("ℹ️  offset_ref column likely does NOT exist (or other error):", schemaError.message);
    } else {
        console.log("✅ offset_ref column EXISTS.");
    }

    // Get unique wheel_offset values
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('wheel_offset')
        .not('wheel_offset', 'is', null);

    if (error) {
        console.error('❌ Error fetching wheels:', error);
        return;
    }

    const uniqueOffsets = new Set(wheels.map(w => w.wheel_offset));
    console.log(`📊 Found ${wheels.length} wheels with offsets.`);
    console.log(`📊 Found ${uniqueOffsets.size} unique offset strings.\n`);

    console.log("--- Unique Values Sample ---");
    Array.from(uniqueOffsets).sort().forEach(val => {
        console.log(`"${val}"`);
    });
}

analyzeOffsets();
