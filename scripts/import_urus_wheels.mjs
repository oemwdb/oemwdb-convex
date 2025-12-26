
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
        "name": "Nivale 21\" shiny silver",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfhkUKW1K7XP4Ku1InJreBlOadfabmUgRkoVQDBQMDHV1qUU5BYlJirl1yUX5AnqGFAJBBmd3ENcfT0CQYAhpHzUMEAAAA.png"
    },
    {
        "name": "Asterope 21\" Silver",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh-IGrrF1vrfhvxZh1y69rf2gw-y0jAzNQqgCCgYCPr7QopyCxKDFXL7kovyBPUMOASCDM7uIa4ujpEwwA3HiNjcEAAAA.png"
    },
    {
        "name": "Asterope 21\" Graphite Grey",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYeh6-riqO3tYq-bdi6J_vNbontq5o4wBmagVAEEAwEfX2lRTkFiUWKuXnJRfkGeoIYBkUCY3cU1xNHTJxgA2C5ATMEAAAA.png"
    },
    {
        "name": "Nath 22\" Silver",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdB60rB-d3aD1sFz7metT6VmtT1QiuLgRkoVQDBQMDHV1qUU5BYlJirl1yUX5AnqGFAJBBmd3ENcfT0CQYAU3asvMEAAAA.png"
    },
    {
        "name": "Nath 22\" Diamond Finished",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh_eyth5bPM9-7v8jm48n2LRdOnej6w8AMlCqAYCDg4ystyilILErM1Usuyi_IE9QwIBIIs7u4hjh6-gQDAFB06TjBAAAA.png"
    },
    {
        "name": "Nath 22\" Titanium Matt",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYchtXB1XNn6jpaTyw_I5GnHTN3xp1KWgRkoVQDBQMDHV1qUU5BYlJirl1yUX5AnqGFAJBBmd3ENcfT0CQYAyvrbysEAAAA.png"
    },
    {
        "name": "Nath 22\" Titanium Matt diamond finishing",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh8Xu70IS_M_5OMDDItwyYcvOa0NslDMxAqQIIBgI-vtKinILEosRcveSi_II8QQ0DIoEwu4triKOnTzAAgYsetcEAAAA.png"
    },
    {
        "name": "Galanthus 23\" shiny black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfhv1BioWWGz1d-wzm_VtTfMTx-2UWKgRkoVQDBQMDHV1qUU5BYlJirl1yUX5AnqGFAJBBmd3ENcfT0CQYAnTyaqsEAAAA.png"
    },
    {
        "name": "Galanthus 23\" shiny black diamond",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfBo_JLV0lonqH8z-tbT514-VLu2uz5DMxAqQIIBgI-vtKinILEosRcveSi_II8QQ0DIoEwu4triKOnTzAAa93MicEAAAA.png"
    },
    {
        "name": "Galanthus 23\" shiny black bronze diamond cut",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh3P7F-zK2Rxt9qrn5NebaxZ8pFg8NGJiBUgUQDAR8fKVFOQWJRYm5eslF-QV5ghoGRAJhdhfXEEdPn2AACHSdwMEAAAA.png"
    },
    {
        "name": "Galanthus 23\" matt black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfBZfXsDI7LGs8bbgjrXLv_x0az8-lvBmagVAEEAwEfX2lRTkFiUWKuXnJRfkGeoIYBkUCY3cU1xNHTJxgAhgjZvcEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYeh9fTJTar7S99P_Rg2YemVLPG1Lb-9GZiBUgUQDAR8fKVFOQWJRYm5eslF-QV5ghoGRAJhdhfXEEdPn2AAHr7NlcEAAAA.png"
    },
    {
        "name": "Taigete 23\" Diamond Finished",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdhm9wtHdakmLORxR9n62rUpSaqPzzPwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMA2sKxbcEAAAA.png"
    },
    {
        "name": "Taigete 23\" Bronze Diamond finished",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfBn6Fz_b7NWguvuijxljAtOzX13TI1BmagVAEEAwEfX2lRTkFiUWKuXnJRfkGeoIYBkUCY3cU1xNHTJxgAjCQeAsEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Giallo Inti color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh3ebTsz23Tv1i-_wd-_d_bfuXsqe3MDADpQogGAj4-EqLcgoSixJz9ZKL8gvyBDUMiATC7C6uIY6ePsEA7q7uWsEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Arancio Borealis color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfh1ZnpXdm_xFZce_v5TNfrNPGoZOm1DMxAqQIIBgI-vtKinILEosRcveSi_II8QQ0DIoEwu4triKOnTzAAgYsetcEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Arancio Argos color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfhxtz4Azf5brwXmadpeS91Zdbvxvl2DMxAqQIIBgI-vtKinILEosRcveSi_II8QQ0DIoEwu4triKOnTzAALmMnusEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Verde Scandal color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYfB_oRfeW_yrgkc-v97BdZeyT_-s_o8AzNQqgCCgYCPr7QopyCxKDFXL7kovyBPUMOASCDM7uIa4ujpEwwAqPd0Y8EAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Rosso Desire color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYdhTeYD03t7wye7pMyrlnikvL3ur3YSAzNQqgCCgYCPr7QopyCxKDFXL7kovyBPUMOASCDM7uIa4ujpEwwAKPeHDcEAAAA.png"
    },
    {
        "name": "Rims Taigete 23\" shiny black with Verde Mantis color accent",
        "image_url": "https://configuratormedia.lamborghini.com/renderservice/media/fast/v3_1vzloG1tIiBKdppzWfxH2wcIQ-YGBgqChgYGJYxsJaUFiXlMwLZUUxcmbmJ6an6WQWp6eKiKakliZk5xfolGaW5SXkgpm6ZET8jO1ScHaiDkYchmWme3a5Ps9LOOUznbo57JxDHzqfDwAyUKoBgIODjKy3KKUgsSszVSy7KL8gT1DAgEgizu7iGOHr6BAMA2sKxbcEAAAA.png"
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
    const tempDir = './temp_urus_images';
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
                    wheel_title: `Lamborghini ${wheel.name.replace("Rims ", "")}`, // Remove "Rims " prefix if present in visual name
                    brand_ref: [{ value: 'lamborghini' }], // correct format: [{value: 'lamborghini'}]
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
