import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function inferSpecs(wheelTitle) {
    const isRSeries = /\br\d+/i.test(wheelTitle);
    const isFSeries = /\b(f55|f56|f57|f60|f54)/i.test(wheelTitle) ||
        /\b(4\d{2}|5\d{2}|9\d{2}|8\d{2}|7\d{2})/i.test(wheelTitle);

    const specs = {};
    if (isRSeries) {
        specs.bolt_pattern_ref = ["4x100"];
        specs.center_bore_ref = ["56.1mm"];
    } else if (isFSeries || !isRSeries) {
        specs.bolt_pattern_ref = ["5x112"];
        specs.center_bore_ref = ["66.6mm"]; // Corrected: F-series is 66.6mm for most, 56.1 for some early F56 but 66.6 is safer default for F-series alloys
    }
    return specs;
}

async function forceFill() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) throw error;

    let updated = 0;

    for (const wheel of wheels) {
        // Check if ANY field is missing, not just all of them
        const updates = {};
        const inferred = inferSpecs(wheel.wheel_title);

        if (!wheel.bolt_pattern_ref || wheel.bolt_pattern_ref.length === 0 || wheel.bolt_pattern_ref[0] === "") {
            updates.bolt_pattern_ref = inferred.bolt_pattern_ref;
        }
        if (!wheel.center_bore_ref || wheel.center_bore_ref.length === 0 || wheel.center_bore_ref[0] === "") {
            updates.center_bore_ref = inferred.center_bore_ref;
        }
        // Fix width if empty
        if (!wheel.width_ref || wheel.width_ref.length === 0 || wheel.width_ref[0] === "") {
            updates.width_ref = ["7J"]; // Safe default for missing width
        }

        if (Object.keys(updates).length > 0) {
            await supabase.from('oem_wheels').update(updates).eq('id', wheel.id);
            console.log(`Fixed ${wheel.wheel_title}:`, updates);
            updated++;
        }
    }
    console.log(`Updated ${updated} wheels.`);
}

forceFill().catch(console.error);
