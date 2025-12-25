import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const TODAY = new Date().toISOString().split('T')[0]; // 2024-12-24

async function auditAndUpdateBlurbs() {
    console.log("=== AUDIT & UPDATE PRIVATE_BLURB ===\n");
    console.log(`Audit date: ${TODAY}\n`);

    // Fetch all wheels
    const { data: allWheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, width_ref, part_numbers, good_pic_url, bad_pic_url, center_bore_ref, color_ref, private_blurb');

    if (error) { console.error("Error fetching wheels:", error); return; }

    // Categorize issues
    const missingWidth = allWheels.filter(w => !w.width_ref || w.width_ref.length === 0);
    const missingPN = allWheels.filter(w => !w.part_numbers || w.part_numbers.trim() === '');
    const noImage = allWheels.filter(w =>
        (!w.good_pic_url || w.good_pic_url.trim() === '') &&
        (!w.bad_pic_url || w.bad_pic_url.trim() === '')
    );
    const missingCB = allWheels.filter(w => !w.center_bore_ref || w.center_bore_ref.length === 0);
    const missingColor = allWheels.filter(w => !w.color_ref || w.color_ref.length === 0);

    console.log("Found issues:");
    console.log(`  - Missing width: ${missingWidth.length}`);
    console.log(`  - Missing part numbers: ${missingPN.length}`);
    console.log(`  - No image: ${noImage.length}`);
    console.log(`  - Missing center bore: ${missingCB.length}`);
    console.log(`  - Missing color: ${missingColor.length}`);
    console.log("");

    // Collect all wheels that need blurb updates
    const wheelsToUpdate = new Map();

    function addIssue(wheel, issue) {
        const existing = wheelsToUpdate.get(wheel.id) || {
            wheel,
            issues: [],
            existingBlurb: wheel.private_blurb || ''
        };
        existing.issues.push(issue);
        wheelsToUpdate.set(wheel.id, existing);
    }

    missingWidth.forEach(w => addIssue(w, 'Missing: width_ref'));
    missingPN.forEach(w => addIssue(w, 'Missing: part_numbers'));
    noImage.forEach(w => addIssue(w, 'Missing: images (good_pic_url, bad_pic_url)'));
    missingCB.forEach(w => addIssue(w, 'Missing: center_bore_ref'));
    missingColor.forEach(w => addIssue(w, 'Missing: color_ref'));

    console.log(`\nUpdating private_blurb for ${wheelsToUpdate.size} wheels...\n`);

    // Update each wheel's private_blurb
    for (const [id, data] of wheelsToUpdate) {
        const { wheel, issues, existingBlurb } = data;

        // Read existing blurb and parse if it has prior audit info
        let newBlurb = `Audit ${TODAY} | ${issues.join(' | ')}`;

        // If there's existing content, preserve it but update audit date
        if (existingBlurb && existingBlurb.trim()) {
            // Check if it contains a previous audit - update it
            if (existingBlurb.includes('Audit ')) {
                // Replace old audit line with new one
                const lines = existingBlurb.split('\n');
                const nonAuditLines = lines.filter(l => !l.startsWith('Audit '));
                newBlurb = [newBlurb, ...nonAuditLines].join('\n');
            } else {
                // Append to existing
                newBlurb = `${newBlurb}\n${existingBlurb}`;
            }
        }

        console.log(`[${wheel.wheel_title || id}]`);
        console.log(`  Previous: ${existingBlurb || '(empty)'}`);
        console.log(`  Updated:  ${newBlurb}`);
        console.log("");

        const { error: updateError } = await supabase
            .from('oem_wheels')
            .update({ private_blurb: newBlurb })
            .eq('id', id);

        if (updateError) {
            console.error(`  ERROR updating ${id}:`, updateError.message);
        }
    }

    console.log(`\n✅ Updated ${wheelsToUpdate.size} wheel private_blurb fields with audit findings.`);
}

auditAndUpdateBlurbs();
