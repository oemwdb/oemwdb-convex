import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkMultiDiameter() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, diameter_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) console.error(error);

    const multi = wheels.filter(w => w.diameter_ref && w.diameter_ref.length > 1);
    const singleCombined = wheels.filter(w => w.diameter_ref && w.diameter_ref.length === 1 && w.diameter_ref[0].includes(','));

    console.log(`Total MINI wheels: ${wheels.length}`);
    console.log(`Wheels with >1 diameter entries: ${multi.length}`);
    if (multi.length > 0) console.log(multi);

    console.log(`Wheels with comma-separated single entry: ${singleCombined.length}`);
    if (singleCombined.length > 0) console.log(singleCombined);
}

checkMultiDiameter();
