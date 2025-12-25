import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Fixing duplicate image URLs...");

    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, good_pic_url, bad_pic_url')
        .not('good_pic_url', 'is', null)
        .not('bad_pic_url', 'is', null);

    if (error) {
        console.error(error);
        return;
    }

    let fixedCount = 0;

    for (const w of wheels) {
        if (w.good_pic_url === w.bad_pic_url) {
            console.log(`Fixing ${w.wheel_title} (${w.id})...`);

            const { error: uError } = await supabase
                .from('oem_wheels')
                .update({ good_pic_url: null })
                .eq('id', w.id);

            if (uError) {
                console.error(`  ❌ Failed: ${uError.message}`);
            } else {
                console.log(`  ✓ Cleared duplicate good_pic_url`);
                fixedCount++;
            }
        }
    }

    console.log(`\nFixed ${fixedCount} wheels.`);
}

main().catch(console.error);
