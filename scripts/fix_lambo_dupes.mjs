
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Merge pairs: [keepId, deleteId, mergedTitle]
const MERGE_PAIRS = [
    ['lamborghini-asterope-21', 'lamborghini-asterope', 'Lamborghini Asterope'],
    ['lamborghini-galanthus-23', 'lamborghini-galanthus', 'Lamborghini Galanthus'],
    ['lamborghini-taigete-23', 'lamborghini-taigete', 'Lamborghini Taigete'],
    ['lamborghini-nath-22', 'lamborghini-nath', 'Lamborghini Nath'],
];

async function main() {
    console.log('Finding and merging remaining duplicates...');

    for (const [keepId, deleteId, mergedTitle] of MERGE_PAIRS) {
        // Fetch both records
        const { data: keepRecord } = await supabase
            .from('oem_wheels')
            .select('*')
            .eq('id', keepId)
            .single();

        const { data: deleteRecord } = await supabase
            .from('oem_wheels')
            .select('*')
            .eq('id', deleteId)
            .single();

        if (!keepRecord || !deleteRecord) {
            console.log(`Skipping ${keepId} / ${deleteId} - one or both not found`);
            continue;
        }

        console.log(`\nMerging "${deleteRecord.wheel_title}" into "${keepRecord.wheel_title}"...`);

        // Merge variants
        const keepVariants = keepRecord.variants || [];
        const deleteVariants = deleteRecord.variants || [];
        const allVariants = [...keepVariants, ...deleteVariants];

        // Collect all images
        const allImages = [
            keepRecord.good_pic_url,
            deleteRecord.good_pic_url,
            ...(keepRecord.bad_pic_url?.split(',') || []),
            ...(deleteRecord.bad_pic_url?.split(',') || [])
        ].filter(Boolean);

        // Update the keeper
        const { error: updateError } = await supabase
            .from('oem_wheels')
            .update({
                wheel_title: mergedTitle,
                variants: allVariants,
                bad_pic_url: [...new Set(allImages)].join(',')
            })
            .eq('id', keepId);

        if (updateError) {
            console.error(`  Error updating ${keepId}:`, updateError);
            continue;
        }

        // Delete the duplicate
        const { error: deleteError } = await supabase
            .from('oem_wheels')
            .delete()
            .eq('id', deleteId);

        if (deleteError) {
            console.error(`  Error deleting ${deleteId}:`, deleteError);
        } else {
            console.log(`  Merged and deleted ${deleteId}`);
        }
    }

    console.log('\nDone.');
}

main();
