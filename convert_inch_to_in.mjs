import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function convertInchToIn() {
    const { data: allWheels, error } = await supabase
        .from('oem_wheels')
        .select('id, diameter_ref');

    if (error) { console.error(error); return; }

    let count = 0;
    for (const w of allWheels) {
        if (!w.diameter_ref || w.diameter_ref.length === 0) continue;

        let needsUpdate = false;
        const newRef = w.diameter_ref.map(d => {
            // Replace " inch" with " in"
            if (d.includes(' inch')) {
                needsUpdate = true;
                return d.replace(' inch', ' in');
            }
            return d;
        });

        if (needsUpdate) {
            console.log(`Updating ${w.id}: ${JSON.stringify(w.diameter_ref)} -> ${JSON.stringify(newRef)}`);
            await supabase.from('oem_wheels').update({ diameter_ref: newRef }).eq('id', w.id);
            count++;
        }
    }
    console.log(`Updated ${count} wheels to use ' in' format.`);
}

convertInchToIn();
