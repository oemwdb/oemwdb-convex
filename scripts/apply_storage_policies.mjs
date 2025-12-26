
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Applying storage policies for move operations...\n');

    // Policy 1: UPDATE for listing-files bucket
    console.log('1. Creating UPDATE policy for listing-files...');
    await supabase.rpc('exec_sql', {
        sql: `
            DROP POLICY IF EXISTS "Users can move files in listing-files" ON storage.objects;
            CREATE POLICY "Users can move files in listing-files"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (bucket_id = 'listing-files')
            WITH CHECK (bucket_id = 'listing-files');
        `
    }).then(({ error }) => {
        if (error) console.log('   Note:', error.message);
        else console.log('   ✓ Created');
    });

    // Policy 2: UPDATE for registered-vehicles bucket
    console.log('2. Creating UPDATE policy for registered-vehicles...');
    await supabase.rpc('exec_sql', {
        sql: `
            DROP POLICY IF EXISTS "Users can move own registered-vehicle files" ON storage.objects;
            CREATE POLICY "Users can move own registered-vehicle files"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (
                bucket_id = 'registered-vehicles' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            )
            WITH CHECK (
                bucket_id = 'registered-vehicles' 
                AND auth.uid()::text = (storage.foldername(name))[1]
            );
        `
    }).then(({ error }) => {
        if (error) console.log('   Note:', error.message);
        else console.log('   ✓ Created');
    });

    // Policy 3: Generic CRUD for all public buckets
    console.log('3. Creating generic CRUD policy for public buckets...');
    await supabase.rpc('exec_sql', {
        sql: `
            DROP POLICY IF EXISTS "Allow authenticated CRUD on public buckets" ON storage.objects;
            CREATE POLICY "Allow authenticated CRUD on public buckets"
            ON storage.objects
            TO authenticated
            USING (
                bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
            )
            WITH CHECK (
                bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
            );
        `
    }).then(({ error }) => {
        if (error) console.log('   Note:', error.message);
        else console.log('   ✓ Created');
    });

    console.log('\nDone! Storage move operations should now work.');
}

main();
