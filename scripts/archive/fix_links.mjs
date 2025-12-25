import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log("Fixing cross-brand links...");

    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .not('vehicle_ref', 'is', null);

    if (error) {
        console.error(error);
        return;
    }

    let fixedCount = 0;

    for (const w of wheels) {
        if (!w.vehicle_ref || !Array.isArray(w.vehicle_ref) || w.vehicle_ref.length === 0) continue;

        const wBrand = JSON.stringify(w.brand_ref).toLowerCase();
        let isLambo = wBrand.includes('lamborghini');
        let isFerrari = wBrand.includes('ferrari');

        if (!isLambo && !isFerrari) continue; // Skip other brands

        const newRefs = w.vehicle_ref.filter(v => {
            const vTitle = (v.title || "").toLowerCase();
            if (isLambo && vTitle.includes('ferrari')) return false;
            if (isFerrari && vTitle.includes('lamborghini')) return false;
            return true;
        });

        if (newRefs.length !== w.vehicle_ref.length) {
            console.log(`Fixing ${w.wheel_title}: Removed ${w.vehicle_ref.length - newRefs.length} invalid links.`);
            const { error: uError } = await supabase
                .from('oem_wheels')
                .update({ vehicle_ref: newRefs })
                .eq('id', w.id);

            if (uError) console.error(`Failed to update ${w.id}:`, uError);
            else fixedCount++;
        }
    }

    console.log(`Fixed ${fixedCount} wheels.`);
}

main().catch(console.error);
