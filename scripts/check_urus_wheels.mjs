
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Checking for Urus wheels...');

    const { data, error, count } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title', { count: 'exact' })
        .ilike('id', 'lamborghini-%');

    if (error) {
        console.error('Error fetching wheels:', error);
        return;
    }

    console.log(`Found ${count} Urus wheels.`);
    console.log('Sample wheels:', data.slice(0, 5));

    // Check specifically for the one that failed: lamborghini-rims-taigete-23-shiny-black-with-verde-mantis-color-accent
    const failedId = 'lamborghini-rims-taigete-23-shiny-black-with-verde-mantis-color-accent';
    const { data: failedWheel } = await supabase
        .from('oem_wheels')
        .select('id')
        .eq('id', failedId)
        .single();

    if (failedWheel) {
        console.log(`Wheel ${failedId} EXISTS.`);
    } else {
        console.log(`Wheel ${failedId} is MISSING.`);
    }
}

main();
