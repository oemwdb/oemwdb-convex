import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function listMissingDiameter() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, diameter_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) console.error(error);

    const missing = wheels.filter(w => !w.diameter_ref || w.diameter_ref.length === 0 || w.diameter_ref[0] === "" || w.diameter_ref[0] === "MISSING");

    if (missing.length === 0) {
        console.log("No missing diameters found? Checking raw data for nulls...");
        // Re-query ensuring we catch nulls
        const { data: rawWheels } = await supabase.from('oem_wheels').select('*').filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));
        const rawMissing = rawWheels.filter(w => !w.diameter_ref || w.diameter_ref.length === 0);
        console.log(`Raw check found ${rawMissing.length}`);
        rawMissing.forEach(w => console.log(w.id));
        return;
    }

    console.log(`Found ${missing.length} wheels missing diameter:`);
    missing.forEach(w => console.log(w.id));
}

listMissingDiameter();
