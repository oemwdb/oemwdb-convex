import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Checking Ferrari & Lamborghini data...");

    // Check Wheels
    const { count: ferrariWheels } = await supabase
        .from('oem_wheels')
        .select('*', { count: 'exact', head: true })
        .contains('brand_ref', JSON.stringify([{ value: 'ferrari' }]));

    const { count: lamboWheels } = await supabase
        .from('oem_wheels')
        .select('*', { count: 'exact', head: true })
        .contains('brand_ref', JSON.stringify([{ value: 'lamborghini' }]));

    console.log(`\nWheels:`);
    console.log(`- Ferrari: ${ferrariWheels}`);
    console.log(`- Lamborghini: ${lamboWheels}`);

    // Check Links
    const { data: linkedWheels } = await supabase
        .from('oem_wheels')
        .select('wheel_title, vehicle_ref')
        .contains('brand_ref', JSON.stringify([{ value: 'lamborghini' }]))
        .limit(10);

    console.log('\nSample Linked Wheels (Lambo):');
    linkedWheels.forEach(w => {
        console.log(`${w.wheel_title} -> ${JSON.stringify(w.vehicle_ref)}`);
    });
}

main().catch(console.error);
