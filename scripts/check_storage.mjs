
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Checking storage buckets and policies...\n');

    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return;
    }

    console.log('Available buckets:');
    buckets.forEach(b => {
        console.log(`  - ${b.id} (public: ${b.public})`);
    });

    // Test move on a specific bucket
    const testBucket = buckets[0]?.id;
    if (testBucket) {
        console.log(`\nTesting list on bucket: ${testBucket}`);
        const { data: files, error: listError } = await supabase.storage.from(testBucket).list('', { limit: 5 });

        if (listError) {
            console.error('List error:', listError);
        } else {
            console.log('Files:', files?.map(f => f.name));
        }
    }
}

main();
