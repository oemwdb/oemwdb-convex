import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Logic:
// R60, R61: 5x120, 72.5mm (Wait, R60/R61 are weird. They are 5x120, CB 72.56mm because they share platform with BMW X1 E84)
// Other R-Series (R50-R59): 4x100, 56.1mm
// F-Series: 5x112, 66.6mm

async function fixMiniVehicles() {
    const { data: vehicles, error } = await supabase
        .from('oem_vehicles')
        .select('id, vehicle_id_only')
        .contains('brand_ref', JSON.stringify(['MINI']));

    if (error) { console.error(error); return; }

    for (const v of vehicles) {
        const id = v.vehicle_id_only || '';
        let bp = [];
        let cb = [];

        if (id.startsWith('F')) {
            // F54, F55, F56, F57, F60
            bp = ['5x112']; // F60 Countryman is also 5x112
            cb = ['66.6mm'];
        } else if (id.startsWith('R')) {
            if (id === 'R60' || id === 'R61') {
                // Countryman/Paceman Gen 1
                bp = ['5x120'];
                cb = ['72.6mm']; // Often cited as 72.5 or 72.6
            } else {
                // R50, R52, R53, R55, R56, R57, R58, R59
                bp = ['4x100'];
                cb = ['56.1mm'];
            }
        }

        if (bp.length > 0) {
            console.log(`Updating ${v.id} (${id}) -> ${bp} / ${cb}`);
            await supabase.from('oem_vehicles').update({
                bolt_pattern_ref: bp,
                center_bore_ref: cb
            }).eq('id', v.id);
        } else if (id.includes('R50')) {
            // Handle generic "R50/R53/R56"
            bp = ['4x100'];
            cb = ['56.1mm'];
            console.log(`Updating ${v.id} (Generic R) -> ${bp} / ${cb}`);
            await supabase.from('oem_vehicles').update({
                bolt_pattern_ref: bp,
                center_bore_ref: cb
            }).eq('id', v.id);
        }
    }
}

fixMiniVehicles();
