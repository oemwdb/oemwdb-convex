
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Fixing brand_ref for Urus wheels...');

    // Fetch all newly imported Urus wheels (by ID pattern and check if brand_ref is a string potentially? 
    // Easier to just update all that match the new import pattern)
    // We know the IDs start with 'lamborghini-nivale', 'lamborghini-asterope', etc.
    // Or simpler: fetch all wheels where id starts with 'lamborghini-' and brand_ref is not an array (if we could filter that).
    // But Supabase/PostgREST filtering on JSON type is tricky.

    // Let's iterate through the known list or just all lamborghini wheels and check structure in JS.

    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, brand_ref')
        .ilike('id', 'lamborghini-%');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    let fixedCount = 0;

    for (const wheel of wheels) {
        const currentRef = wheel.brand_ref;

        // Check if it's the incorrect string format (or just a string in general)
        if (typeof currentRef === 'string' && currentRef === 'lamborghini') {
            console.log(`Fixing ${wheel.id}...`);

            const newRef = [{ value: 'lamborghini' }];

            const { error: updateError } = await supabase
                .from('oem_wheels')
                .update({ brand_ref: newRef })
                .eq('id', wheel.id);

            if (updateError) {
                console.error(`Failed to update ${wheel.id}:`, updateError);
            } else {
                fixedCount++;
            }
        }
        // Also check if it's a string look-alike in JSONB but not an array? 
        // If Supabase returns it as a string, it's a string.
    }

    console.log(`Fixed ${fixedCount} wheels.`);
}

main();
