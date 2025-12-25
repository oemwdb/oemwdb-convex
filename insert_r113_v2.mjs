import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const R113_DATA = {
    id: 'mini-r113-cross-spoke-jcw',
    wheel_title: 'MINI R113 Cross Spoke (JCW)',
    brand_ref: [{ value: 'mini' }],
    diameter: '18',
    width: '7J',
    bolt_pattern: '4x100',
    center_bore: '56.1mm',
    wheel_offset: 'ET52',
    color_ref: ['Black', 'Silver', 'Red Stripe'],
    diameter_ref: ['18'],
    width_ref: ['7J'],
    bolt_pattern_ref: ['4x100'],
    center_bore_ref: ['56.1mm'],
    metal_type: 'Aluminum Alloy',
    production_ready: true,
    ai_processing_complete: true,
    notes: 'Manually added R113 JCW Wheel.',
    status: 'published'
};

async function insertR113() {
    // Tryupsert
    const { data, error } = await supabase
        .from('oem_wheels')
        .upsert([R113_DATA])
        .select();

    if (error) {
        console.error("Error upserting R113:", error);
        // Fallback: Try minimal keys if schema cache is really broken for legacy columns
        const MINIMAL_R113 = {
            id: 'mini-r113-cross-spoke-jcw',
            wheel_title: 'MINI R113 Cross Spoke (JCW)',
            brand_ref: [{ value: 'mini' }],
            diameter_ref: ['18'],
            width_ref: ['7J'],
            bolt_pattern_ref: ['4x100'],
            center_bore_ref: ['56.1mm'],
            wheel_offset: 'ET52'
        };
        console.log("Retrying with minimal keys (refs only + offset)...");
        const { error: err2 } = await supabase.from('oem_wheels').upsert([MINIMAL_R113]);
        if (err2) console.error("Minimal insert also failed:", err2);
        else console.log("Minimal insert succeeded!");
    } else {
        console.log("Success upserting R113:", data);
    }
}

insertR113();
