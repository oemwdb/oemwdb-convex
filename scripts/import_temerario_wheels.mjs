
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

// --- Configuration ---
const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const scrapedWheels = [
    {
        "name": "Algareno Casted 20/21\" Shiny Silver",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh6qIVDRZM_J-OFjAc0XlkJ3OLr0uXgRkoVQDBQMDHV1qUU5BYlJirl1yUX5AnqGFAJBBmd3ENcfT0CQYAIPT0rsEAAAA.png"
    },
    {
        "name": "Algareno Casted 20/21\" Diamond Cut Matt Titanium",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYehO7u9fDu_UGSlRvaq4y3RtSxP6lgZmIFSBRAMBHx8pUU5BYlFibl6yUX5BXmCGgZEAmF2F9cQR0-fYACcFyxvwQAAAA.png"
    },
    {
        "name": "Algareno Casted 20/21\" Shiny Black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdByWD_L69733ZHNcRdEL658r8rU7UUAzNQqgCCgYCPr7QopyCxKDFXL7kovyBPUMOASCDM7uIa4ujpEwwA4xyZj8EAAAA.png"
    },
    {
        "name": "Velador Forged 20/21\" Shiny Black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdhRq-45ZtV6k3vl-8R2KUw4_2u25NPMjADpQogGAj4-EqLcgoSixJz9ZKL8gvyBDUMiATC7C6uIY6ePsEAemtPKsEAAAA.png"
    },
    {
        "name": "Velador Forged 20/21\" Matt Titanium",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYeBzWGzx-wC7xONoZvmWexz5-6eH8zOwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMAbGhXFcEAAAA.png"
    },
    {
        "name": "Velador Forged 20/21\" Matt Bronze",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdh1vI51Sd3pPi4COxsW5aZefFURJkIAzNQqgCCgYCPr7QopyCxKDFXL7kovyBPUMOASCDM7uIa4ujpEwwA0OggjsEAAAA.png"
    },
    {
        "name": "Velador Forged 20/21\" Diamond Cut Shiny Black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdB4Ulu5aeoeqElAW5L64QWna4pSpjPwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMAL7RFEcEAAAA.png"
    },
    {
        "name": "Carbon 20/21\" Shiny",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYehx7P2ztr5qx_oH4-xa2KcwBntHeHBwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMAZHdTPsEAAAA.png"
    }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace('iconical', '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

async function downloadImage(url, filepath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    await streamPipeline(response.body, fs.createWriteStream(filepath));
}

async function uploadToSupabase(localPath, storagePath) {
    const fileContent = fs.readFileSync(localPath);
    const { data, error } = await supabase.storage
        .from('oemwdb images')
        .upload(storagePath, fileContent, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Error uploading:', error);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('oemwdb images')
        .getPublicUrl(storagePath);

    return publicUrl;
}

async function main() {
    console.log(`Processing ${scrapedWheels.length} wheels...`);
    const tempDir = './temp_temerario_images';
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    for (const wheel of scrapedWheels) {
        const cleanName = wheel.name.replace(/['"]/g, '').trim();
        const slug = `lamborghini-${slugify(cleanName)}`;
        const filename = `${slug}.png`;
        const localPath = path.join(tempDir, filename);

        console.log(`Downloading ${wheel.name}...`);
        try {
            await downloadImage(wheel.image_url, localPath);

            console.log(`Uploading ${filename}...`);
            const publicUrl = await uploadToSupabase(localPath, `lamborghini/${filename}`);

            if (publicUrl) {
                const wheelData = {
                    id: slug,
                    wheel_title: `Lamborghini ${wheel.name}`,
                    brand_ref: [{ value: 'lamborghini' }],
                    good_pic_url: publicUrl,
                    // Leaving other fields as defaults or null for now
                };

                // Upsert into oem_wheels
                const { error } = await supabase
                    .from('oem_wheels')
                    .upsert(wheelData, { onConflict: 'id' });

                if (error) {
                    console.error(`Error upsideerting ${slug}:`, error);
                } else {
                    console.log(`Successfully upserted ${slug}`);
                }
            }
        } catch (e) {
            console.error(`Failed to process ${wheel.name}:`, e);
        }
    }

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Done.');
}

main();
