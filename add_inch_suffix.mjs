import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addInchSuffix() {
    // Fetch all wheels
    const { data: allWheels, error } = await supabase
        .from('oem_wheels')
        .select('id, diameter_ref'); // All brands

    if (error) { console.error(error); return; }

    let count = 0;
    for (const w of allWheels) {
        if (!w.diameter_ref || w.diameter_ref.length === 0) continue;

        let needsUpdate = false;
        const newRef = w.diameter_ref.map(d => {
            // Trim whitespace
            let clean = d.trim();
            // If it's just a number (e.g. "17"), add " inch"
            // Regex: ^\d+$ matches only digits
            if (/^\d+(\.\d+)?$/.test(clean)) {
                needsUpdate = true;
                return `${clean} inch`;
            }
            // If it already has "inch" or something else, leave it (or maybe normalize spacing?)
            // e.g. "17inch" -> "17 inch"
            if (/^\d+inch$/.test(clean)) {
                needsUpdate = true;
                return clean.replace('inch', ' inch');
            }
            return clean;
        });

        if (needsUpdate) {
            console.log(`Updating ${w.id}: ${JSON.stringify(w.diameter_ref)} -> ${JSON.stringify(newRef)}`);
            await supabase.from('oem_wheels').update({ diameter_ref: newRef }).eq('id', w.id);
            count++;
        }
    }
    console.log(`Updated ${count} wheels to include 'inch' suffix.`);
}

addInchSuffix();
