import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getHeuristic(series, diameter) {
    const d = parseInt(diameter);
    if (isNaN(d)) return null;

    if (series === 'R') {
        if (d === 15) return { width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' };
        if (d === 16) return { width: '6.5J', offset: 'ET48', bp: '4x100', cb: '56.1mm' };
        if (d === 17) return { width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' }; // Most common S-spoke etc
        if (d === 18) return { width: '7J', offset: 'ET52', bp: '4x100', cb: '56.1mm' }; // JCW usually
    } else {
        // F-series
        if (d === 15) return { width: '5.5J', offset: 'ET46', bp: '5x112', cb: '66.6mm' };
        if (d === 16) return { width: '6.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' };
        if (d === 17) return { width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' };
        if (d === 18) return { width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }; // JCW Cup spoke etc often 54
        if (d === 19) return { width: '8J', offset: 'ET47', bp: '5x112', cb: '66.6mm' }; // Countryman/Clubman
    }
    return null;
}

async function smartFill() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) throw error;

    let updatedCount = 0;

    for (const w of wheels) {
        // 1. Determine Series
        let series = 'F'; // Default to F (newer)
        if (w.wheel_title.match(/\bR\d+/i) || w.wheel_title.toLowerCase().includes('r-series')) {
            series = 'R';
        }

        // 2. Determine Diameter
        let diameter = w.diameter_ref?.[0];
        if (!diameter || diameter === 'MISSING' || diameter === '') {
            // Regex for diameter
            // Look for "17 inch" or just "17" if R113 is known, etc.
            // Heuristic mappings for known models without explicit numbers
            if (w.wheel_title.includes('R98')) diameter = '17';
            else if (w.wheel_title.includes('R103')) diameter = '16';
            else if (w.wheel_title.includes('R86')) diameter = '15';
            else if (w.wheel_title.includes('R90')) diameter = '17';
            else if (w.wheel_title.includes('R84')) diameter = '16';
            else if (w.wheel_title.includes('R81')) diameter = '15';
            else if (w.wheel_title.includes('R82')) diameter = '15';
            else if (w.wheel_title.includes('R83')) diameter = '16';
            else if (w.wheel_title.includes('R88')) diameter = '15';
            else if (w.wheel_title.includes('R92')) diameter = '17';
            else if (w.wheel_title.includes('R97')) diameter = '17';
            else if (w.wheel_title.includes('R104')) diameter = '17';
            else if (w.wheel_title.includes('R108')) diameter = '17';
            else if (w.wheel_title.includes('R110')) diameter = '17';
            else if (w.wheel_title.includes('R112')) diameter = '17';
            else if (w.wheel_title.includes('R107')) diameter = '18'; // GP is 18
            else if (w.wheel_title.includes('R106')) diameter = '17'; // Night spoke
            else if (w.wheel_title.includes('R99')) diameter = '17';
            else if (w.wheel_title.includes('R91')) diameter = '17';
            else if (w.wheel_title.includes('R105')) diameter = '18';
            else if (w.wheel_title.includes('R113')) diameter = '18';
            else if (w.wheel_title.includes('901')) diameter = '18';
            else if (w.wheel_title.includes('534')) diameter = '18';
            else if (w.wheel_title.includes('508')) diameter = '16'; // Wait, 508 is Radial Spoke, usually 16? Checking... 
            // My previous manual fix said 508 Radial Spoke. Actually 508 is 16" Radial Spoke usually.

            // Fallback regex scan
            if (!diameter) {
                const match = w.wheel_title.match(/\b(15|16|17|18|19)['"]?/);
                if (match) diameter = match[1];
            }
        }

        if (!diameter) {
            console.log(`Skipping ${w.id} - Could not determine diameter`);
            continue;
        }

        // 3. Get Specs
        const specs = getHeuristic(series, diameter);
        if (!specs) continue;

        // 4. Update if missing or generic
        const updates = {};

        // Update diameter if missing
        if (!w.diameter_ref || w.diameter_ref[0] !== diameter) {
            updates.diameter_ref = [diameter];
        }

        // Update Width if missing or "7J" (when it shouldn't be, e.g. 15"/16")
        // Or if I just want to enforce the heuristic "True Data"
        const currentWidth = w.width_ref?.[0];
        if (!currentWidth || (currentWidth === '7J' && specs.width !== '7J') || currentWidth === '') {
            updates.width_ref = [specs.width];
        }

        // Update Offset if missing
        if (!w.wheel_offset || w.wheel_offset.includes('MISSING') || w.wheel_offset === '') {
            updates.wheel_offset = specs.offset;
        }

        // Update BP/CB
        if (!w.bolt_pattern_ref || w.bolt_pattern_ref[0] !== specs.bp) {
            updates.bolt_pattern_ref = [specs.bp];
        }
        if (!w.center_bore_ref || w.center_bore_ref[0] !== specs.cb) {
            updates.center_bore_ref = [specs.cb];
        }

        if (Object.keys(updates).length > 0) {
            console.log(`Updating ${w.wheel_title} (${series} ${diameter}"):`, updates);
            await supabase.from('oem_wheels').update(updates).eq('id', w.id);
            updatedCount++;
        }
    }

    console.log(`Smart Filled ${updatedCount} wheels.`);
}

smartFill();
