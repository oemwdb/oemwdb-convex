import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Part numbers found via web search
const PART_NUMBERS = {
    'mini-948-runway-spoke': '36115A269E6',
    'mini-945-y-spoke-jcw': '36115A269E1, 36115A8E633 (Frozen Midnight)',
    'mini-981-x-spoke': '36105A90F59',
    'mini-r107-gp-wheels': '36116774581',
    'mini-737-corona-spoke': '36106889171 (Spectre Grey), 36105A84DC9 (Jet Black)',
    'mini-900-pulse-spoke': '36106897988',
    'mini-820-yours-british-spoke': '36116888078 (18"), 36116888084 (19")',
    'mini-957-sprint-spoke-jcw': '36115A3E638',
    'mini-950-rally-spoke': '36115A269E8, 36115A8E202 (Bicolour)',
    'mini-947-kaleido-spoke': '36115A269E5',
    'mini-r109-double-spoke': '36116777357',
    'mini-990-pin-spoke': '36107886558',
    'mini-961-pin-spoke': '36115A3E642',
    'mini-962-star-spoke-jcw': '36115A3E643',
    'mini-949-flag-spoke-jcw': '36115A269E7',
    'mini-984-night-flash-spoke': '36105A72870 (Bicolor), 36105A90F35 (Grey)',
    'mini-980-4-square-spoke': '36105A72925',
    'mini-982-u-spoke': '36105A72824 (Spectre Grey), 36105A727F9 (Silver)',
    'mini-983-parallel-spoke': '36105A72838',
    'mini-992-rallye-spoke-jcw': '36115A68603',
    'mini-986-lap-spoke-jcw': '36105A72873',
    'mini-r113-cross-spoke-jcw': '36116769569, 36116775824',
    'mini-r81-7-hole-wheels': '36116768498',
};

async function updatePartNumbers() {
    for (const [id, pn] of Object.entries(PART_NUMBERS)) {
        console.log(`Updating ${id} -> ${pn}`);
        const { error } = await supabase
            .from('oem_wheels')
            .update({ part_numbers: pn })
            .eq('id', id);

        if (error) {
            console.error(`Error updating ${id}:`, error.message);
        }
    }
    console.log(`\nUpdated ${Object.keys(PART_NUMBERS).length} wheels with part numbers.`);
}

updatePartNumbers();
