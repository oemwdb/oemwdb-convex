
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Fetching one wheel to inspect keys...');
    const { data, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Keys:', Object.keys(data));
    console.log('Sample Variants (if any):', data.variants);

    // Also fetch list of Lambo wheels to plan grouping
    const { data: lamboWheels } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title')
        .ilike('id', 'lamborghini-%');

    console.log('Total Lambo Wheels:', lamboWheels.length);
    // console.log('Titles:', lamboWheels.map(w => w.wheel_title));
}

main();
