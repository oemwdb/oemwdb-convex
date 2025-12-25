import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function inspectWheel() {
    // Fetch ANY Mini wheel
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]))
        .limit(3);

    if (error) {
        console.error('Error:', error);
        return;
    }

    wheels.forEach(w => {
        console.log(`ID: ${w.id}`);
        console.log(`Color Ref:`, w.color_ref);
        console.log(`Type: ${typeof w.color_ref}`);
        console.log(`Is Array? ${Array.isArray(w.color_ref)}`);
        console.log('---');
    });
}

inspectWheel().catch(console.error);
