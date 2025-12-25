import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Final batch of part numbers from web search
const PART_NUMBERS_BATCH_2 = {
    'mini-r102-s-winder-wheels': '36116768584 (Silver), 36116769408 (White)',
    'mini-r94-bridge-spoke-wheels': '36116775684 (Silver), 36116775800 (White), 36116787238 (Black)',
    'mini-r101-rotator-spoke-wheels': '36116769405 (Silver), 36116769406 (White)',
    'mini-987-hexagram-spoke': '36105A90F72',
    'mini-r108-multispoke-wheels': '36116777356 (Silver), 36116791464 (Black)',
    'mini-946-windmill-spoke': '36115A269E4',
    'mini-r96-delta-spoke-wheels': '36116768972',
    'mini-1041-double-spoke-jcw': '36115A661A8',
    'mini-r91-5-star-bullet-wheels': '36116763299 (Silver), 36116764099 (White)',
    'mini-959-night-flash-spoke': '36115A3E640',
    'mini-964-rallye-spoke': '36115A3E644 (Vibrant Silver), 36115A615F2 (Frozen Midnight)',
    'mini-525-60-year-spoke': '36106898289 (Jet Black), 36116884399 (Spectre Grey)',
    'mini-944-asteroid-spoke': '36115A269E2 (Vibrant Silver), 36105B640C8 (Jet Black)',
    'mini-955-4-square-spoke': '36115A3E635',
    'mini-965-parallel-spoke': '36115A3E6A6',
};

async function updatePartNumbers() {
    for (const [id, pn] of Object.entries(PART_NUMBERS_BATCH_2)) {
        console.log(`Updating ${id} -> ${pn}`);
        const { error } = await supabase
            .from('oem_wheels')
            .update({ part_numbers: pn })
            .eq('id', id);

        if (error) {
            console.error(`Error updating ${id}:`, error.message);
        }
    }
    console.log(`\nUpdated ${Object.keys(PART_NUMBERS_BATCH_2).length} wheels with part numbers.`);
}

updatePartNumbers();
