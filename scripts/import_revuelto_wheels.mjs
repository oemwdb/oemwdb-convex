import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const WHEELS = [
    {
        name: "Lamborghini Altanero",
        url: "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfhHtvbFaE_5vE2vmBXzfj8ZslH7wdrGZiBUgUQDAR8fKVFOQWJRYm5eslF-QV5ghoGRAJhdhfXEEdPn2AASWKI0sEAAAA.png",
        isUpdate: true,
        id: "lamborghini-altanero"
    },
    {
        name: "Lamborghini Triguero",
        url: "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYehOPnIBF0m6ce2bh1Vr57ZPOwyXFPEwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMA-w1WHcEAAAA.png",
        isUpdate: false,
        id: "lamborghini-triguero"
    },
    {
        name: "Lamborghini Venancio",
        url: "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYeh9-ojw7MPLzJGrPv59fH9ypaF-7ezMTADpQogGAj4-EqLcgoSixJz9ZKL8gvyBDUMiATC7C6uIY6ePsEASqz3PcEAAAA.png",
        isUpdate: false,
        id: "lamborghini-venancio"
    }
];

// Reference check script for Vehicle ID if needed, or link manually later.
// For now, let's just get the wheels in.

async function downloadImage(url, id) {
    if (!url) return null;
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const filePath = `/tmp/${id}.png`;
        writeFileSync(filePath, Buffer.from(buffer));
        return filePath;
    } catch (error) {
        console.error(`  ❌ Failed to download: ${error.message}`);
        return null;
    }
}

async function uploadToStorage(id, localPath) {
    try {
        const fileBuffer = readFileSync(localPath);
        const fileName = `wheels/${id}.png`; // storing as png this time as source is png

        const { error } = await supabase.storage
            .from('oemwdb images')
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('oemwdb images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error(`  ❌ Failed to upload: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log("Importing Revuelto wheels...");

    for (const w of WHEELS) {
        console.log(`Processing ${w.name}...`);

        // 1. Download & Upload Image
        const localPath = await downloadImage(w.url, w.id);
        let storageUrl = null;
        if (localPath) {
            storageUrl = await uploadToStorage(w.id, localPath);
            console.log(`  ✓ Image uploaded: ${storageUrl}`);
        }

        if (!storageUrl) {
            console.log("  ⚠️ Skipping DB update due to image failure");
            continue;
        }

        // 2. Update/Insert DB
        const payload = {
            id: w.id,
            wheel_title: w.name,
            good_pic_url: storageUrl,
            bad_pic_url: null, // Scraped are high quality "good" pics
            brand_ref: [{ value: 'lamborghini' }]
            // Add other fields if needed for new inserts
        };

        const { error } = await supabase
            .from('oem_wheels')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error(`  ❌ Failed to upsert: ${error.message}`);
        } else {
            console.log(`  ✓ Database updated`);
        }
    }
}

main().catch(console.error);
