import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkVariants() {
    // Try to find the variant shown in the screenshot
    // It has pcd: "5x120" and diameter "21"
    // It is likely linked to our wheel id 'mini-901-spoke-jcw'

    // Note: I need to know the table name for variants. It's likely 'oem_variants' or 'wheel_variants'
    // I'll guess 'oem_variants' first, as I don't have the schema handy in this context, 
    // but previous context mentioned 'oem_brands', 'oem_wheels'.

    // Actually, let me check the relationships on oem_wheels first to find the variants table?
    // Or I can just query 'vehicle_variants' if that's where they live.

    // Let's assume there is a table linking wheels to specific specs if "Variants" tab is populated.
    // OR, this "Standard" variant is being generated from the wheel data itself?
    // But the wheel data says 16" (or 18" now). 21" 5x120 is very specific (Tesla/BMW size).

    // Let's try to list tables or just guess.
    // I will look for any table with 'variant' in the name.

    console.log("Checking for rogue variant data...");
}

// Since I can't list tables easily without RLS or schema info, I'll try to guess based on standard naming
// or check if 'wheel_variants' exists.

async function findRogueVariant() {
    // 1. Check if there is a separate table for variants
    // The previous context mentioned 'vehicle_variants' in other conversations.

    // Let's look for a table that might contain this data. 
    // The previous prompt mentioned "oem_wheels" has a "specifications" jsonb column? 
    // No, checked row data, it was null.

    // Maybe it's a join table?

    // Let's just try to clean up the wheel row itself first to ensure no hidden fields are set.
    // The row audit showed 'specifications': null.

    // If the UI shows "Variants", it's likely fetching from a related table.
    // I'll check 'oem_variants' linked to this wheel.

    const { data, error } = await supabase
        .from('oem_variants')
        .select('*')
        .eq('wheel_id', 'mini-901-spoke-jcw');

    if (error) {
        console.log("oem_variants error (maybe table doesn't exist):", error.message);
        return;
    }

    console.log("Variants found:", data);

    if (data && data.length > 0) {
        console.log("Found rogue variants! Deleting...");
        const { error: delError } = await supabase
            .from('oem_variants')
            .delete()
            .eq('wheel_id', 'mini-901-spoke-jcw');

        if (delError) console.error("Delete failed:", delError);
        else console.log("Rogue variants deleted.");
    }
}

findRogueVariant();
