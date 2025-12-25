import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function listMissingPartNumbers() {
    const { data: miniWheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) { console.error(error); return; }

    const withoutPN = miniWheels.filter(w => {
        // Check if part_numbers is missing - need to fetch it
        return true; // Will filter after full fetch
    });

    // Refetch with part_numbers
    const { data: fullData } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, part_numbers')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    const missing = fullData.filter(w => !w.part_numbers || w.part_numbers.trim().length === 0);

    console.log("=== WHEELS MISSING PART NUMBERS ===");
    console.log(`Total: ${missing.length}\n`);

    missing.forEach((w, i) => {
        // Extract style code from id or title
        const match = w.wheel_title?.match(/\b(\d{3})\b/) || w.wheel_title?.match(/\b(R\d+)\b/i);
        const code = match ? match[1] : 'N/A';
        console.log(`${i + 1}. [${code}] ${w.wheel_title} (${w.id})`);
    });
}

listMissingPartNumbers();
