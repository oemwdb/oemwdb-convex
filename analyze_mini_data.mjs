import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function analyzeWheelData() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, color_ref, diameter_ref, width_ref')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) {
        console.error('Error:', error);
        return;
    }

    const stats = {
        total: wheels.length,
        missingColor: 0,
        withColor: 0,
        uniqueColors: new Set(),
        missingDiameter: 0,
        missingWidth: 0
    };

    const missingColorIds = [];

    wheels.forEach(w => {
        const hasColor = w.color_ref && Array.isArray(w.color_ref) && w.color_ref.length > 0;

        if (hasColor) {
            stats.withColor++;
            w.color_ref.forEach(c => stats.uniqueColors.add(c));
        } else {
            stats.missingColor++;
            missingColorIds.push(w.id);
        }

        if (!w.diameter_ref || w.diameter_ref.length === 0) stats.missingDiameter++;
        if (!w.width_ref || w.width_ref.length === 0) stats.missingWidth++;
    });

    console.log('=== MINI WHEEL DATA ANALYSIS ===');
    console.log(`Total Wheels: ${stats.total}`);
    console.log(`With Color: ${stats.withColor}`);
    console.log(`Missing Color: ${stats.missingColor}`);
    console.log(`Missing Diameter: ${stats.missingDiameter}`);
    console.log(`Missing Width: ${stats.missingWidth}`);

    if (stats.missingColor > 0) {
        console.log('\nMissing Color IDs:', missingColorIds);
    } else {
        console.log('\nAll wheels have color data.');
    }

    console.log('\nUnique Colors Found:', Array.from(stats.uniqueColors).sort());
}

analyzeWheelData().catch(console.error);
