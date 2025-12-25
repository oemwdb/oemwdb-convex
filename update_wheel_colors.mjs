import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const wheelId = process.argv[2];
const colors = process.argv.slice(3);

if (!wheelId || colors.length === 0) {
    console.error('Usage: node update_wheel_colors.mjs <wheel_id> <Color 1> [Color 2] ...');
    process.exit(1);
}

async function updateColors() {
    console.log(`Updating ${wheelId} with colors: ${JSON.stringify(colors)}`);

    const { data, error } = await supabase
        .from('oem_wheels')
        .update({ color_ref: colors })
        .eq('id', wheelId)
        .select('id, wheel_title, color_ref');

    if (error) {
        console.error('Error updating wheel:', error);
        return;
    }

    console.log('✅ Success:', data[0]);
}

updateColors().catch(console.error);
