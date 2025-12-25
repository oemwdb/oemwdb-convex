import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function polishAudit() {
    console.log("--- 1. Global Diameter Tag Audit ---");
    const { data: allWheels, error: wheelError } = await supabase
        .from('oem_wheels')
        .select('id, brand_ref, diameter_ref, wheel_title');

    if (wheelError) console.error(wheelError);
    else {
        const messyTags = allWheels.filter(w => {
            if (!w.diameter_ref) return false;
            return w.diameter_ref.some(d => d.includes(',') || d.includes('inch') || d.length > 3);
        });

        if (messyTags.length > 0) {
            console.log(`Found ${messyTags.length} wheels with messy tags:`);
            messyTags.forEach(w => console.log(`- [${w.brand_ref}] ${w.wheel_title}: ${JSON.stringify(w.diameter_ref)}`));
        } else {
            console.log("Diameter tags look clean globally.");
        }
    }

    console.log("\n--- 2. Rolls-Royce Vehicle Spec Audit ---");
    const { data: rrVehicles, error: rrError } = await supabase
        .from('oem_vehicles')
        .select('id, vehicle_title, bolt_pattern_ref, center_bore_ref')
        .contains('brand_ref', JSON.stringify(['Rolls-Royce'])); // Guessing 'Rolls-Royce' based on typical casing

    if (rrError) {
        console.error("RR Query Error:", rrError);
    } else {
        console.log(`Found ${rrVehicles.length} Rolls-Royce vehicles.`);
        const missingSpecs = rrVehicles.filter(v =>
            !v.bolt_pattern_ref || v.bolt_pattern_ref.length === 0 ||
            !v.center_bore_ref || v.center_bore_ref.length === 0
        );

        if (missingSpecs.length > 0) {
            console.log(`${missingSpecs.length} RR vehicles are missing specs (will break relations):`);
            missingSpecs.forEach(v => console.log(`- ${v.vehicle_title || v.id}`));
        } else {
            console.log("All Rolls-Royce vehicles have specs.");
        }
    }
}

polishAudit();
