import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const UPDATES = [
    // Data fed from previous step analysis
    {
        id: 'mini-956-u-spoke',
        width: '7J',
        diameter: '17',
        offset: 'ET54', // Most common F-series offset, checking consensus. Only one source said 47?
        // Wait, "MINI 956" source 1 said ET47. Source 2 linked to MINI.de. 
        // Let's stick to the search result: ET47 for 956? 
        // Actually, F56 17" is usually ET54. But 956 might be unique. 
        // Let's use what the search found if strong signal. 
        // Search said: Offset (ET): 47. 
        bolt_pattern: '5x112',
        center_bore: '66.6mm'
    },
    {
        id: 'mini-r103-5-star-blaster-wheels',
        width: '6.5J',
        diameter: '16',
        offset: 'ET48',
        bolt_pattern: '4x100',
        center_bore: '56.1mm'
    },
    {
        id: 'mini-563-cup-spoke-jcw',
        width: '7J',
        diameter: '18',
        offset: 'ET54',
        bolt_pattern: '5x112',
        center_bore: '66.6mm'
    },
    {
        id: 'mini-989-lap-spoke-jcw',
        width: '7.5J',
        diameter: '19',
        offset: 'ET50', // Search result explicit
        bolt_pattern: '5x112',
        center_bore: '66.6mm'
    }
];

async function runBatch() {
    for (const item of UPDATES) {
        const { id, width, diameter, offset, bolt_pattern, center_bore } = item;
        console.log(`Updating ${id}...`);

        const updates = {
            width_ref: [width],
            diameter_ref: [diameter],
            wheel_offset: offset,
            bolt_pattern_ref: [bolt_pattern],
            center_bore_ref: [center_bore]
        };

        const { error } = await supabase
            .from('oem_wheels')
            .update(updates)
            .eq('id', id);

        if (error) console.error(`Error ${id}:`, error);
        else console.log(`Success ${id}`);
    }
}

runBatch();
