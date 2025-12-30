
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseOffset(offsetStr) {
    if (!offsetStr) return null;
    const s = offsetStr.trim();
    if (!s) return null;

    const lower = s.toLowerCase();

    let tags = [];

    if ((lower.includes('front') && lower.includes('rear')) || (lower.includes('/') || lower.includes(','))) {
        // Split logic
        const parts = s.split(/[,/]/).map(p => p.trim()).filter(p => p);

        const frontPart = parts.find(p => p.toLowerCase().includes('front') || p.toLowerCase().startsWith('f:'));
        const rearPart = parts.find(p => p.toLowerCase().includes('rear') || p.toLowerCase().startsWith('r:'));

        const clean = (str) => str.replace(/\(front\)/i, '').replace(/\(rear\)/i, '').replace(/front:?/i, '').replace(/rear:?/i, '').replace(/ET/i, '').trim();

        if (frontPart) tags.push(`F: ${frontPart.replace(/\(front\)/i, '').replace(/front:?/i, '').trim()}`);
        if (rearPart) tags.push(`R: ${rearPart.replace(/\(rear\)/i, '').replace(/rear:?/i, '').trim()}`);

        if (tags.length === 0 && parts.length > 0) {
            tags = parts;
        }
    } else {
        tags.push(s);
    }

    return tags;
}

async function migrateToV2() {
    console.log("🚀 Starting Migration to notion_source...");

    // 1. Fetch ALL data from old table
    const { data: oldData, error } = await supabase.from('oem_wheels').select('*');
    if (error) {
        console.error("❌ Error fetching old data:", error);
        return;
    }

    console.log(`📊 Migrating ${oldData.length} rows...`);

    let successCount = 0;
    let errorCount = 0;

    for (const row of oldData) {
        // Prepare new row

        // Parse offset
        const offsetRef = parseOffset(row.wheel_offset);

        // Map to new Schema? 
        // NOTE: oem_wheels_v2 (now notion_source) has exact matching columns mostly.

        // Need to handle missing columns if any? 
        // The schema I created matches mostly.

        const newRow = {
            ...row,
            offset_ref: offsetRef
        };

        // Insert into new table
        const { error: insertError } = await supabase.from('notion_source').insert(newRow);

        if (insertError) {
            console.error(`❌ Failed to insert ${row.id}:`, insertError.message);
            errorCount++;
        } else {
            successCount++;
            if (successCount % 50 === 0) console.log(`   ✅ Migrated ${successCount} rows...`);
        }
    }

    console.log("\n==================================");
    console.log(`Migration Complete.`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
}

migrateToV2();
