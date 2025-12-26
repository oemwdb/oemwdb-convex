
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Fetching sample wheels...');

    // Fetch a working wheel (Revuelto)
    const { data: workingWheel } = await supabase
        .from('oem_wheels')
        .select('id, brand_ref')
        .eq('id', 'lamborghini-altanero')
        .single();

    console.log('Working Wheel (Altanero):', JSON.stringify(workingWheel, null, 2));

    // Fetch a broken wheel (Urus)
    const { data: brokenWheel } = await supabase
        .from('oem_wheels')
        .select('id, brand_ref')
        .ilike('id', 'lamborghini-%')
        .not('id', 'in', '("lamborghini-altanero","lamborghini-triguero","lamborghini-venancio")') // Exclude Revuelto
        .limit(1)
        .single();

    console.log('Broken Wheel (Sample):', JSON.stringify(brokenWheel, null, 2));
}

main();
