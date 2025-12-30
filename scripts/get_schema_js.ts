
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function getSchema() {
    console.log("Fetching schema for oem_wheels...");

    // We can't query information_schema easily via JS client usually, 
    // but we can query one row and inspect the structure if we want, 
    // OR we can use the 'rpc' if we had a function.
    // Actually, let's just create the new table based on known fields from previous files.

    // We know the fields from 'useWheelWithVehicles.ts' interface + previous scripts
    /*
    id, wheel_name, brand_name, diameter, width, bolt_pattern, center_bore, wheel_offset,
    color, good_pic_url, bad_pic_url, status, weight, metal_type, part_numbers, notes, specifications,
    vehicles, brand_ref, diameter_ref, width_ref, bolt_pattern_ref, center_bore_ref, color_ref, tire_size_ref, vehicle_ref
    
    plus created_at?
    */

    const { data, error } = await supabase.from('oem_wheels').select('*').limit(1);
    if (data && data.length > 0) {
        console.log("Keys found:", Object.keys(data[0]));
    } else {
        console.log("Error or no data:", error);
    }
}

getSchema();
