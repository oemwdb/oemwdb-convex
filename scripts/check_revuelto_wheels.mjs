import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Checking for Revuelto wheels...");

    const names = ["Altanero", "Triguero", "Venancio"];
    const found = [];

    for (const name of names) {
        const { data } = await supabase
            .from('oem_wheels')
            .select('id, wheel_title')
            .ilike('wheel_title', `%${name}%`);

        if (data && data.length > 0) {
            found.push(...data);
        }
    }

    if (found.length > 0) {
        console.log("Found existing wheels:", found);
    } else {
        console.log("No existing wheels found for these names.");
    }
}

main().catch(console.error);
