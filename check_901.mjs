import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function check901() {
    // Check the wheel itself
    const { data: wheel, error: wheelError } = await supabase
        .from('oem_wheels')
        .select('*')
        .ilike('id', '%901%');

    if (wheelError) console.error('Wheel Error:', wheelError);
    else console.log('Wheel Data:', JSON.stringify(wheel, null, 2));

    // Check for any variants linked to this wheel (if table exists)
    // Trying 'vehicle_variants' or similar if known, otherwise just wheel
}

check901();
