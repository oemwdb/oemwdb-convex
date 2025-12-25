import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const UPDATES = [
    { id: 'mini-r101-rotator-spoke-wheels', width: '5.5J', diameter: '15', offset: 'ET45', bolt_pattern: '4x100', center_bore: '56.1mm' },
    { id: 'mini-r96-delta-spoke-wheels', width: '5.5J', diameter: '15', offset: 'ET45', bolt_pattern: '4x100', center_bore: '56.1mm' },
    { id: 'mini-957-sprint-spoke-jcw', width: '7J', diameter: '17', offset: 'ET47', bolt_pattern: '5x112', center_bore: '66.6mm' },
    { id: 'mini-950-rally-spoke', width: '8J', diameter: '21', offset: 'ET46', bolt_pattern: '5x112', center_bore: '66.6mm' },
    { id: 'mini-947-kaleido-spoke', width: '8J', diameter: '19', offset: 'ET46', bolt_pattern: '5x112', center_bore: '66.6mm' }
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
