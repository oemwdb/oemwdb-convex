import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runFullAudit() {
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║           OEMWDB WHEEL DATA - COMPLETE AUDIT                 ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    // Fetch all wheels
    const { data: allWheels, error } = await supabase
        .from('oem_wheels')
        .select('*');

    if (error) { console.error("Error fetching wheels:", error); return; }

    const total = allWheels.length;
    console.log(`Total wheels in database: ${total}\n`);

    // ═══════════════════════════════════════════════════════════════
    // 1. MISSING SPECIFICATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("═══ 1. SPECIFICATIONS COVERAGE ═══");

    const missingDiameter = allWheels.filter(w => !w.diameter_ref || w.diameter_ref.length === 0);
    const missingWidth = allWheels.filter(w => !w.width_ref || w.width_ref.length === 0);
    const missingOffset = allWheels.filter(w => !w.wheel_offset || w.wheel_offset.trim() === '');
    const missingBoltPattern = allWheels.filter(w => !w.bolt_pattern_ref || w.bolt_pattern_ref.length === 0);
    const missingCenterBore = allWheels.filter(w => !w.center_bore_ref || w.center_bore_ref.length === 0);

    console.log(`  Diameter:     ${total - missingDiameter.length}/${total} (${missingDiameter.length} missing)`);
    console.log(`  Width:        ${total - missingWidth.length}/${total} (${missingWidth.length} missing)`);
    console.log(`  Offset:       ${total - missingOffset.length}/${total} (${missingOffset.length} missing)`);
    console.log(`  Bolt Pattern: ${total - missingBoltPattern.length}/${total} (${missingBoltPattern.length} missing)`);
    console.log(`  Center Bore:  ${total - missingCenterBore.length}/${total} (${missingCenterBore.length} missing)`);

    if (missingDiameter.length > 0 && missingDiameter.length <= 10) {
        console.log("\n  Missing Diameter:");
        missingDiameter.forEach(w => console.log(`    - ${w.wheel_title || w.id}`));
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. PART NUMBERS
    // ═══════════════════════════════════════════════════════════════
    console.log("\n═══ 2. PART NUMBERS COVERAGE ═══");

    const missingPN = allWheels.filter(w => !w.part_numbers || w.part_numbers.trim() === '');
    console.log(`  With Part Numbers: ${total - missingPN.length}/${total}`);
    console.log(`  Missing:           ${missingPN.length}`);

    if (missingPN.length > 0 && missingPN.length <= 10) {
        console.log("\n  Missing Part Numbers:");
        missingPN.forEach(w => console.log(`    - ${w.wheel_title || w.id}`));
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. FORMATTING CONSISTENCY
    // ═══════════════════════════════════════════════════════════════
    console.log("\n═══ 3. FORMATTING CONSISTENCY ═══");

    // Check diameter format: should be "## in"
    const badDiameterFormat = allWheels.filter(w => {
        if (!w.diameter_ref) return false;
        return w.diameter_ref.some(d => {
            // Bad if: contains "inch", contains comma, doesn't end with " in", or is just a number
            if (d.includes('inch')) return true;
            if (d.includes(',')) return true;
            if (/^\d+$/.test(d)) return true; // Just a number
            if (!d.endsWith(' in')) return true;
            return false;
        });
    });

    console.log(`  Diameter format ("## in"): ${badDiameterFormat.length === 0 ? '✓ All correct' : `⚠ ${badDiameterFormat.length} issues`}`);

    if (badDiameterFormat.length > 0 && badDiameterFormat.length <= 5) {
        badDiameterFormat.forEach(w => console.log(`    - ${w.id}: ${JSON.stringify(w.diameter_ref)}`));
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. VEHICLE RELATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("\n═══ 4. VEHICLE RELATIONS ═══");

    const { data: vehicles } = await supabase.from('oem_vehicles').select('id, vehicle_title, brand_ref, bolt_pattern_ref, center_bore_ref');

    const vehiclesWithSpecs = vehicles?.filter(v =>
        v.bolt_pattern_ref && v.bolt_pattern_ref.length > 0 &&
        v.center_bore_ref && v.center_bore_ref.length > 0
    ) || [];

    const vehiclesMissingSpecs = vehicles?.filter(v =>
        !v.bolt_pattern_ref || v.bolt_pattern_ref.length === 0 ||
        !v.center_bore_ref || v.center_bore_ref.length === 0
    ) || [];

    console.log(`  Total vehicles:     ${vehicles?.length || 0}`);
    console.log(`  With specs:         ${vehiclesWithSpecs.length}`);
    console.log(`  Missing specs:      ${vehiclesMissingSpecs.length}`);

    if (vehiclesMissingSpecs.length > 0 && vehiclesMissingSpecs.length <= 10) {
        console.log("\n  Vehicles missing specs (can't match wheels):");
        vehiclesMissingSpecs.forEach(v => console.log(`    - ${v.vehicle_title || v.id}`));
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. IMAGE COVERAGE
    // ═══════════════════════════════════════════════════════════════
    console.log("\n═══ 5. IMAGE COVERAGE ═══");

    const withGoodPic = allWheels.filter(w => w.good_pic_url && w.good_pic_url.trim() !== '');
    const withBadPicOnly = allWheels.filter(w =>
        (!w.good_pic_url || w.good_pic_url.trim() === '') &&
        (w.bad_pic_url && w.bad_pic_url.trim() !== '')
    );
    const noImage = allWheels.filter(w =>
        (!w.good_pic_url || w.good_pic_url.trim() === '') &&
        (!w.bad_pic_url || w.bad_pic_url.trim() === '')
    );

    console.log(`  Good image:         ${withGoodPic.length}/${total}`);
    console.log(`  Bad image only:     ${withBadPicOnly.length}/${total} (needs upgrade)`);
    console.log(`  No image:           ${noImage.length}/${total}`);

    // ═══════════════════════════════════════════════════════════════
    // 6. COLOR DATA
    // ═══════════════════════════════════════════════════════════════
    console.log("\n═══ 6. COLOR DATA ═══");

    const missingColor = allWheels.filter(w => !w.color_ref || w.color_ref.length === 0);
    const suspiciousColor = allWheels.filter(w => {
        if (!w.color_ref) return false;
        return w.color_ref.some(c =>
            c.toLowerCase().includes('light alloy') ||
            c.toLowerCase().includes('unknown') ||
            c.toLowerCase().includes('n/a')
        );
    });

    console.log(`  With colors:        ${total - missingColor.length}/${total}`);
    console.log(`  Missing colors:     ${missingColor.length}`);
    console.log(`  Suspicious values:  ${suspiciousColor.length}`);

    if (suspiciousColor.length > 0 && suspiciousColor.length <= 5) {
        console.log("\n  Suspicious color values:");
        suspiciousColor.forEach(w => console.log(`    - ${w.id}: ${JSON.stringify(w.color_ref)}`));
    }

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║                        AUDIT SUMMARY                         ║");
    console.log("╚══════════════════════════════════════════════════════════════╝");

    const issues = [];
    if (missingDiameter.length > 0) issues.push(`${missingDiameter.length} wheels missing diameter`);
    if (missingWidth.length > 0) issues.push(`${missingWidth.length} wheels missing width`);
    if (missingOffset.length > 0) issues.push(`${missingOffset.length} wheels missing offset`);
    if (missingBoltPattern.length > 0) issues.push(`${missingBoltPattern.length} wheels missing bolt pattern`);
    if (missingCenterBore.length > 0) issues.push(`${missingCenterBore.length} wheels missing center bore`);
    if (missingPN.length > 0) issues.push(`${missingPN.length} wheels missing part numbers`);
    if (badDiameterFormat.length > 0) issues.push(`${badDiameterFormat.length} wheels with bad diameter format`);
    if (vehiclesMissingSpecs.length > 0) issues.push(`${vehiclesMissingSpecs.length} vehicles missing specs`);
    if (noImage.length > 0) issues.push(`${noImage.length} wheels with no image`);
    if (missingColor.length > 0) issues.push(`${missingColor.length} wheels missing color`);

    if (issues.length === 0) {
        console.log("\n✅ ALL CHECKS PASSED - Data is complete and consistent!\n");
    } else {
        console.log(`\n⚠️  ISSUES FOUND: ${issues.length}\n`);
        issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
        console.log("");
    }
}

runFullAudit();
