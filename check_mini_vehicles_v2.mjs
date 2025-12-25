import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkMiniVehicles() {
    const { data: vehicles, error } = await supabase
        .from('oem_vehicles')
        .select('id, vehicle_title, brand_ref, bolt_pattern_ref, center_bore_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(`Found ${vehicles.length} MINI vehicles.`);

    // Check how many have valid specs
    // Assuming these are JSONB arrays like ['5x112']
    const validSpecs = vehicles.filter(v =>
        v.bolt_pattern_ref && v.bolt_pattern_ref.length > 0 &&
        v.center_bore_ref && v.center_bore_ref.length > 0
    );

    console.log(`Vehicles with valid specs: ${validSpecs.length} / ${vehicles.length}`);

    if (vehicles.length > 0) {
        console.log("\nSample Vehicles:");
        vehicles.slice(0, 5).forEach(v => console.log(JSON.stringify(v, null, 2)));
    }
}

checkMiniVehicles();
