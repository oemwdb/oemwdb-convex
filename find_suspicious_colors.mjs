import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function findSuspiciousColors() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, color_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) {
        console.error('Error:', error);
        return;
    }

    const suspicious = wheels.filter(w =>
        w.color_ref && w.color_ref.includes('Light Alloy')
    );

    console.log(`Found ${suspicious.length} wheels with 'Light Alloy' as color:\n`);
    suspicious.forEach(w => {
        console.log(`- ${w.id} (${w.wheel_title})`);
    });
}

findSuspiciousColors().catch(console.error);
