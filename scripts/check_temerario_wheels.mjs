
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Checking for Temerario wheels...');

    // Checking by ID pattern since we use 'lamborghini-algareno', etc.
    // Note: Some might overlap if names are reused but these specific models are unique enough.
    const { data, error, count } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title', { count: 'exact' })
        .ilike('id', 'lamborghini-%')
        .ilike('wheel_title', 'Lamborghini%')
        .or('id.ilike.%algareno%,id.ilike.%velador%,id.ilike.%carbon%');
    // Filter specifically for the Temerario wheel names we just scraped

    if (error) {
        console.error('Error fetching wheels:', error);
        return;
    }

    console.log(`Found ${count} Temerario wheels.`);
    console.log('Sample wheels:', data);
}

main();
