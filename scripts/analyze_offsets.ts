import { createClient } from '@supabase/supabase-js';

// Credentials from clean_rr_tags.mjs
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

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
