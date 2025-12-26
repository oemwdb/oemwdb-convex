
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper: Extract base design name from a wheel title
// e.g., "Lamborghini Nath 22" Titanium Matt" -> "Nath 22""
// e.g., "Lamborghini Taigete 23" Diamond Finished" -> "Taigete 23""
function extractBaseDesign(title) {
    // Remove "Lamborghini " prefix
    let name = title.replace(/^Lamborghini\s+/i, '');
    // Remove "Rims " prefix if present
    name = name.replace(/^Rims\s+/i, '');

    // Pattern: "DesignName Size" (Size like 21", 22", 23", 20/21")
    // Capture everything up to and including the size (first "XX"" pattern)
    const match = name.match(/^([\w\-]+(?:\s+(?:Casted|Forged))?)\s+([\d\/]+\")/i);
    if (match) {
        return `${match[1]} ${match[2]}`.trim();
    }

    // Fallback: just take the first two words
    const parts = name.split(/\s+/);
    if (parts.length >= 2 && /\d+\"/.test(parts[1])) {
        return `${parts[0]} ${parts[1]}`;
    }

    // If still no luck, return the whole name (it might be a unique design)
    return name;
}

// Helper: Extract variant description (the color/finish part)
function extractVariant(title, baseDesign) {
    let name = title.replace(/^Lamborghini\s+/i, '');
    name = name.replace(/^Rims\s+/i, '');

    // Remove the base design part
    const variant = name.replace(baseDesign, '').trim();
    return variant || 'Standard';
}

async function main() {
    console.log('Fetching all Lamborghini wheels...');

    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('id, wheel_title, good_pic_url, bad_pic_url, brand_ref, specifications')
        .ilike('id', 'lamborghini-%');

    if (error) {
        console.error('Error fetching wheels:', error);
        return;
    }

    console.log(`Found ${wheels.length} Lamborghini wheels.`);

    // Group by base design
    const groups = {};
    for (const wheel of wheels) {
        const baseDesign = extractBaseDesign(wheel.wheel_title);
        if (!groups[baseDesign]) {
            groups[baseDesign] = [];
        }
        groups[baseDesign].push(wheel);
    }

    console.log(`Grouped into ${Object.keys(groups).length} design styles.`);
    console.log('Design Styles:', Object.keys(groups));

    // Process each group
    for (const [baseDesign, variants] of Object.entries(groups)) {
        console.log(`\nProcessing "${baseDesign}" with ${variants.length} variants...`);

        if (variants.length === 1) {
            // Single variant - just update to store in variants array for consistency
            const wheel = variants[0];
            const variantData = [{
                name: extractVariant(wheel.wheel_title, baseDesign),
                image: wheel.good_pic_url,
                original_id: wheel.id
            }];

            await supabase
                .from('oem_wheels')
                .update({
                    variants: variantData,
                    bad_pic_url: wheel.good_pic_url // Preserve in bad_pic as requested
                })
                .eq('id', wheel.id);

            console.log(`  Updated single variant: ${wheel.id}`);
            continue;
        }

        // Multiple variants - Merge into first one, delete others
        const master = variants[0];
        const masterId = `lamborghini-${baseDesign.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`;

        const variantsData = variants.map(v => ({
            name: extractVariant(v.wheel_title, baseDesign),
            image: v.good_pic_url,
            original_id: v.id
        }));

        // Collect all images for bad_pic_url (as requested, keep all pics)
        const allImages = variants.map(v => v.good_pic_url).filter(Boolean);

        // Upsert master record
        const masterRecord = {
            id: masterId,
            wheel_title: `Lamborghini ${baseDesign}`,
            brand_ref: [{ value: 'lamborghini' }],
            good_pic_url: master.good_pic_url, // Use first variant's image as main
            bad_pic_url: allImages.join(','), // Store all images comma-separated
            variants: variantsData,
            specifications: master.specifications
        };

        const { error: upsertError } = await supabase
            .from('oem_wheels')
            .upsert(masterRecord, { onConflict: 'id' });

        if (upsertError) {
            console.error(`  Error upserting master ${masterId}:`, upsertError);
            continue;
        }

        console.log(`  Created/Updated master: ${masterId}`);

        // Delete old variant records (except if one of them IS the master ID)
        const idsToDelete = variants.map(v => v.id).filter(id => id !== masterId);
        if (idsToDelete.length > 0) {
            const { error: deleteError } = await supabase
                .from('oem_wheels')
                .delete()
                .in('id', idsToDelete);

            if (deleteError) {
                console.error(`  Error deleting old variants:`, deleteError);
            } else {
                console.log(`  Deleted ${idsToDelete.length} old variant records.`);
            }
        }
    }

    console.log('\nConsolidation complete.');
}

main();
