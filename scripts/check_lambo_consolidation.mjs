
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Checking Lamborghini wheel consolidation results...');

    const { data, count } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, variants', { count: 'exact' })
        .ilike('id', 'lamborghini-%');

    console.log(`Total Lamborghini wheels after consolidation: ${count}`);

    // Show some with variants populated
    const withVariants = data.filter(w => w.variants && w.variants.length > 1);
    console.log(`\nWheels with multiple variants: ${withVariants.length}`);

    for (const w of withVariants.slice(0, 5)) {
        console.log(`\n${w.wheel_title}:`);
        console.log(`  Variants: ${w.variants.map(v => v.name).join(', ')}`);
    }
}

main();
