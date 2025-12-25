import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function auditSpecs() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, width_ref, wheel_offset, diameter_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) console.error(error);

    const widths = {};
    const offsets = {};
    const diameters = {};

    wheels.forEach(w => {
        // Width
        const wVal = w.width_ref?.[0] || 'MISSING';
        widths[wVal] = (widths[wVal] || 0) + 1;

        // Offset
        const oVal = w.wheel_offset || 'MISSING';
        offsets[oVal] = (offsets[oVal] || 0) + 1;

        // Diameter
        const dVal = w.diameter_ref?.[0] || 'MISSING';
        diameters[dVal] = (diameters[dVal] || 0) + 1;
    });

    console.log('--- WIDTH DISTRIBUTION ---');
    console.table(widths);

    console.log('--- OFFSET DISTRIBUTION ---');
    console.table(offsets);

    console.log('--- DIAMETER DISTRIBUTION ---');
    console.table(diameters);
}

auditSpecs();
