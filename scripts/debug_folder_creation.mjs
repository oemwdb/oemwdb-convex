
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('Testing folder creation...');

    const bucketName = 'oemwdb images';
    const folderPath = 'test-folder-debug/.keep';

    const placeholderContent = new Uint8Array(0); // Empty file

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(folderPath, placeholderContent, {
            contentType: 'text/plain',
            upsert: true
        });

    if (error) {
        console.error('Upload failed:', error);
    } else {
        console.log('Upload succeeded:', data);

        // List to verify
        const { data: files } = await supabase.storage.from(bucketName).list('');
        console.log('Root files:', files?.map(f => f.name));
    }
}

main();
