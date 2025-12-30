
import { createClient } from '@supabase/supabase-js';

// Service Key for admin rights
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseOffset(offsetStr) {
    if (!offsetStr) return null;
    const s = offsetStr.trim();
    if (!s) return null;

    // Pattern: "ET40 (front) / ET44 (rear)"
    // Pattern: "Front: ET42, Rear: ET40"
    // Pattern: "ET42 Front / ET40 Rear"
    // Pattern: "ET19 (front), ET33 (rear)"

    const lower = s.toLowerCase();

    // Combined separated by slash or comma, AND contains "front" and "rear"
    if ((lower.includes('front') && lower.includes('rear')) || (lower.includes('/') || lower.includes(','))) {
        // Try to split
        const parts = s.split(/[,/]/).map(p => p.trim()).filter(p => p);

        const frontPart = parts.find(p => p.toLowerCase().includes('front') || p.toLowerCase().startsWith('f:'));
        const rearPart = parts.find(p => p.toLowerCase().includes('rear') || p.toLowerCase().startsWith('r:'));

        if (frontPart && rearPart) {
            // Clean up textual noise
            const clean = (str) => {
                return str
                    .replace(/\(front\)/i, '')
                    .replace(/\(rear\)/i, '')
                    .replace(/front:?/i, '')
                    .replace(/rear:?/i, '')
                    .trim();
            };

            const f = clean(frontPart);
            const r = clean(rearPart);

            // Reformat to standard "F: ETxx", "R: ETxx"
            // If it doesn't have ET, maybe add it? Or keep original if complex.
            // User requested: ( F: ET40 ) ( R: ET44 ) format (implied JSONB array)

            return [`F: ${f}`, `R: ${r}`];
        }
    }

    // Fallback: Just return the string as a single tag if reasonable short
    // Or if it's a simple "ET40", return ["ET40"]
    if (s.length < 20) {
        return [s];
    }

    // If complex string, return as single tag for now
    return [s];
}

async function migrate() {
    console.log("🚀 Starting Offset Migration...");

    // 1. Fetch wheels with offset
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_offset');

    if (error) {
        console.error("❌ Fetch error:", error);
        return;
    }

    console.log(`📊 Processing ${wheels.length} wheels...`);

    let count = 0;
    for (const w of wheels) {
        if (!w.wheel_offset) continue;

        const newRefs = parseOffset(w.wheel_offset);

        // Only update if we have a valid parsed result
        if (newRefs && newRefs.length > 0) {
            // Check if it's actually separate
            const isSplit = newRefs.length > 1;
            const isClean = newRefs.every(r => r.length < 20); // sanity check

            if (isSplit || isClean) {
                console.log(`Updating ${w.id}: "${w.wheel_offset}" -> ${JSON.stringify(newRefs)}`);

                const { error: updateError } = await supabase
                    .from('oem_wheels')
                    .update({ offset_ref: newRefs })
                    .eq('id', w.id);

                if (updateError) {
                    console.log(`   ⚠️ Update failed (Column probably missing): ${updateError.message}`);
                } else {
                    count++;
                }
            }
        }
    }

    console.log(`✅ Processed. update calls made: ${count}`);
}

migrate();
