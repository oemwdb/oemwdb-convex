import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function auditPartsAndVariants() {
    console.log("=== PART NUMBERS AUDIT ===");

    // Check MINI wheels for part numbers
    const { data: miniWheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, part_numbers')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) { console.error(error); return; }

    const withPN = miniWheels.filter(w => w.part_numbers && w.part_numbers.trim().length > 0);
    const withoutPN = miniWheels.filter(w => !w.part_numbers || w.part_numbers.trim().length === 0);

    console.log(`MINI Wheels Total: ${miniWheels.length}`);
    console.log(`With Part Numbers: ${withPN.length}`);
    console.log(`Missing Part Numbers: ${withoutPN.length}`);

    if (withoutPN.length > 0 && withoutPN.length <= 20) {
        console.log("\nMissing Part Numbers:");
        withoutPN.forEach(w => console.log(`- ${w.wheel_title || w.id}`));
    }

    // Sample of existing part numbers format
    console.log("\n=== SAMPLE PART NUMBERS ===");
    withPN.slice(0, 5).forEach(w => {
        console.log(`${w.wheel_title}: ${w.part_numbers}`);
    });

    // Check for variants table
    console.log("\n=== VARIANTS TABLE CHECK ===");
    const { data: variants, error: varErr } = await supabase
        .from('oem_wheel_variants')
        .select('*')
        .limit(5);

    if (varErr) {
        console.log("Variants table error or doesn't exist:", varErr.message);
    } else {
        console.log(`Variants table exists. Sample count: ${variants?.length || 0}`);
        if (variants && variants.length > 0) {
            console.log("Sample variant:", JSON.stringify(variants[0], null, 2));
        }
    }
}

auditPartsAndVariants();
