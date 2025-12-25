import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Checking Lamborghini image data...");

    const { data: wheels } = await supabase
        .from('oem_wheels')
        .select('wheel_title, good_pic_url, bad_pic_url')
        .contains('brand_ref', JSON.stringify([{ value: 'lamborghini' }]))
        .limit(10);

    wheels.forEach(w => {
        console.log(`\n${w.wheel_title}:`);
        console.log(`  Good: ${w.good_pic_url}`);
        console.log(`  Bad:  ${w.bad_pic_url}`);
    });
}

main().catch(console.error);
