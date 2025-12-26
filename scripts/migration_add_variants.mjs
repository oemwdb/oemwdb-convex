
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Adding variants column via Supabase...');

    // With service role key, we can use the Management API SQL endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/run_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({
            query: "ALTER TABLE oem_wheels ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;"
        })
    });

    if (!response.ok) {
        console.log('RPC method not available. Trying direct pg connection...');

        // If RPC not available, we'll use the supabase-js to test if column exists 
        // by trying to select it
        const { data, error } = await supabase
            .from('oem_wheels')
            .select('id, variants')
            .limit(1);

        if (error && error.message.includes('variants')) {
            console.error('Column does not exist and cannot add via API. Please run this SQL in the Dashboard:');
            console.log("ALTER TABLE oem_wheels ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;");
        } else {
            console.log('Column already exists or was created:', data);
        }
    } else {
        const result = await response.json();
        console.log('Result:', result);
    }
}

main();
