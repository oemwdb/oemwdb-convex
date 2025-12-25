import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function findMissingColors() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, color_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) {
        console.error('Error fetching wheels:', error);
        return;
    }

    console.log(`Scanning ${wheels.length} MINI wheels for missing colors...\n`);

    const missing = wheels.filter(w => !w.color_ref || w.color_ref.length === 0);

    missing.forEach(w => {
        console.log(`MISSING_COLOR: ${w.id} | ${w.wheel_title}`);
    });

    console.log(`\nFound ${missing.length} wheels with missing color data.`);
}

findMissingColors().catch(console.error);
