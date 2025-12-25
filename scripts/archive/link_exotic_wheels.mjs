#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('🔗 Linking exotic wheels to vehicles...');

    // 1. Fetch Wheels
    const { data: wheels, error: wError } = await supabase
        .from('oem_wheels')
        .select('*')
        .or('brand_ref.cs.[{"value":"ferrari"}],brand_ref.cs.[{"value":"lamborghini"}]'); // Note: syntax might vary for jsonb containment, best to fetch all if small or filter in memory

    if (wError) {
        console.error('Error fetching wheels:', wError);
        return;
    }

    // Fallback: Fetch all if query fails or returns empty (sometimes .or with JSONB is tricky)
    // Actually, let's just fetch all rows that have brand_ref not null.
    // Given the small dataset, fetching 1000 rows is fine.

    // 2. Fetch Vehicles
    const { data: vehicles, error: vError } = await supabase
        .from('oem_vehicles')
        .select('*');

    if (vError) {
        console.error('Error fetching vehicles:', vError);
        return;
    }

    // Filter for Ferrari/Lambo in memory to be safe
    const exoticWheels = wheels.filter(w => {
        const b = JSON.stringify(w.brand_ref).toLowerCase();
        return b.includes('ferrari') || b.includes('lamborghini');
    });

    const exoticVehicles = vehicles.filter(v => {
        const b = JSON.stringify(v.brand_ref).toLowerCase();
        return b.includes('ferrari') || b.includes('lamborghini');
    });

    console.log(`Found ${exoticWheels.length} exotic wheels and ${exoticVehicles.length} exotic vehicles.`);

    let updatedCount = 0;

    for (const wheel of exoticWheels) {
        const matches = [];
        const textToSearch = (wheel.wheel_title + " " + (wheel.notes || "")).toLowerCase();

        for (const vehicle of exoticVehicles) {
            // STRICT CHECK: Brands must match
            const wBrand = JSON.stringify(wheel.brand_ref).toLowerCase();
            const vBrand = JSON.stringify(vehicle.brand_ref).toLowerCase();

            // Extract brand name roughly (ferrari vs lamborghini)
            const wIsFerrari = wBrand.includes('ferrari');
            const wIsLambo = wBrand.includes('lamborghini');
            const vIsFerrari = vBrand.includes('ferrari');
            const vIsLambo = vBrand.includes('lamborghini');

            if ((wIsFerrari && !vIsFerrari) || (wIsLambo && !vIsLambo)) {
                continue;
            }

            // Check for Model Name match

            const modelName = vehicle.model_name ? vehicle.model_name.toLowerCase() : "";
            const title = vehicle.vehicle_title ? vehicle.vehicle_title.toLowerCase() : "";

            let match = false;

            // Check Model Name (if length > 2 to avoid "S" matching "Sports")
            if (modelName.length > 2 && textToSearch.includes(modelName)) {
                match = true;
            }

            // Check Title (e.g. Chassis code)
            if (title.length > 2 && textToSearch.includes(title)) {
                match = true;
            }

            // Special case logic
            // e.g. "Aventador" matches "Aventador S" too. 
            // If we match "Aventador", good.

            if (match) {
                // Check if already in list
                if (!matches.find(m => m.id === vehicle.id)) {
                    matches.push({ id: vehicle.id, title: vehicle.vehicle_title }); // Store ID and Title
                }
            }
        }

        if (matches.length > 0) {
            // Update Supabase
            // Merge with existing? Or overwrite? 
            // "link everything up" likely means "set it".
            // But if existing refs exist... 
            // migrate_exotic_wheels set it to [].

            // If we want to accept manual edits later, we should merge.
            // But for this run, overwriting [] is fine.

            // Only update if different
            const current = JSON.stringify(wheel.vehicle_ref);
            const proposed = JSON.stringify(matches);

            if (current !== proposed) {
                console.log(`Linking ${wheel.wheel_title} -> ${matches.map(m => m.title).join(', ')}`);

                const { error } = await supabase
                    .from('oem_wheels')
                    .update({ vehicle_ref: matches })
                    .eq('id', wheel.id);

                if (error) console.error(`  Error updating ${wheel.id}:`, error);
                else updatedCount++;
            }
        }
    }

    console.log(`\nUpdated ${updatedCount} wheels.`);
}

main().catch(console.error);
