import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Checking MINI image data...");

    const { data: allWheels, error } = await supabase
        .from('oem_wheels')
        .select('wheel_title, good_pic_url, bad_pic_url, brand_ref');

    if (error) {
        console.error(error);
        return;
    }

    const wheels = allWheels.filter(w => {
        const b = JSON.stringify(w.brand_ref).toLowerCase();
        return b.includes('mini');
    }).slice(0, 10);

    wheels.forEach(w => {
        console.log(`\n${w.wheel_title}:`);
        console.log(`  Good:   ${w.good_pic_url}`);
        console.log(`  Bad:    ${w.bad_pic_url}`);
    });
}

main().catch(console.error);
