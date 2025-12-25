import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addBlurbFields() {
    console.log("Adding public_blurb and private_blurb fields...\n");

    const sql = `
        -- Add to oem_brands
        ALTER TABLE oem_brands 
        ADD COLUMN IF NOT EXISTS public_blurb TEXT,
        ADD COLUMN IF NOT EXISTS private_blurb TEXT;

        -- Add to oem_vehicles
        ALTER TABLE oem_vehicles 
        ADD COLUMN IF NOT EXISTS public_blurb TEXT,
        ADD COLUMN IF NOT EXISTS private_blurb TEXT;

        -- Add to oem_wheels
        ALTER TABLE oem_wheels 
        ADD COLUMN IF NOT EXISTS public_blurb TEXT,
        ADD COLUMN IF NOT EXISTS private_blurb TEXT;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        // Try direct queries if RPC doesn't exist
        console.log("Trying direct table updates...");

        // We can't run raw SQL without RPC, so let's verify by checking columns
        const { data: brandsData } = await supabase.from('oem_brands').select('public_blurb').limit(1);
        const { data: vehiclesData } = await supabase.from('oem_vehicles').select('public_blurb').limit(1);
        const { data: wheelsData } = await supabase.from('oem_wheels').select('public_blurb').limit(1);

        if (brandsData !== null && vehiclesData !== null && wheelsData !== null) {
            console.log("✓ Fields already exist on all tables!");
        } else {
            console.log("⚠ Fields need to be added via Supabase SQL Editor.");
            console.log("\nRun this SQL in the Supabase Dashboard SQL Editor:\n");
            console.log(sql);
        }
        return;
    }

    console.log("✓ Fields added successfully!");
}

addBlurbFields();
