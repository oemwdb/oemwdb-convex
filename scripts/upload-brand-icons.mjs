import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(process.cwd(), '.env.local') });
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bclvqqnnyqgzoavgrkke.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY, SUPABASE_KEY, or SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BRAND_ICONS_PATH = join(__dirname, '..', '..', 'classified', '01. oem_brands (master)', '01. BRANDS STORAGE', 'Brand Icons');
const BUCKET_NAME = 'brand-icons';

// Map SVG filenames to brand IDs in database
const FILENAME_TO_BRAND_ID = {
    'acura.svg': 'acura',
    'alfaromeo.svg': 'alfa-romeo',
    'amg.svg': 'amg',
    'astonmartin.svg': 'aston-martin',
    'audi.svg': 'audi',
    'bentley.svg': 'bentley',
    'bmw.svg': 'bmw',
    'bugatti.svg': 'bugatti',
    'chevrolet.svg': 'chevrolet',
    'chrysler.svg': 'chrysler',
    'citroen.svg': 'citroen',
    'ferrarinv.svg': 'ferrari',
    'fiat.svg': 'fiat',
    'ford.svg': 'ford',
    'honda.svg': 'honda',
    'hyundai.svg': 'hyundai',
    'infiniti.svg': 'infiniti',
    'jaguar.svg': 'jaguar',
    'kia.svg': 'kia',
    'lada.svg': 'lada',
    'lamborghini.svg': 'lamborghini',
    'landrover.svg': 'land-rover',
    'mazda.svg': 'mazda',
    'mercedes.svg': 'mercedes-benz',
    'mini.svg': 'mini',
    'mitsubishi.svg': 'mitsubishi',
    'nissan.svg': 'nissan',
    'peugeot.svg': 'peugeot',
    'polestar.svg': 'polestar',
    'porsche.svg': 'porsche',
    'ram.svg': 'ram',
    'renault.svg': 'renault',
    'rollsroyce.svg': 'rolls-royce',
    'seat.svg': 'seat',
    'skoda.svg': 'skoda',
    'subaru.svg': 'subaru',
    'tesla.svg': 'tesla',
    'toyota.svg': 'toyota',
    'volkswagen.svg': 'volkswagen',
    'volvo.svg': 'volvo',
};

async function createBucketIfNotExists() {
    console.log('\n📦 Checking if bucket exists...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Error listing buckets:', listError);
        throw listError;
    }

    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (bucketExists) {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists`);
        return;
    }

    console.log(`📝 Creating bucket '${BUCKET_NAME}'...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 1024 * 1024,
        allowedMimeTypes: ['image/svg+xml']
    });

    if (createError) {
        console.error('❌ Error creating bucket:', createError);
        throw createError;
    }

    console.log(`✅ Bucket '${BUCKET_NAME}' created successfully`);
}

async function uploadBrandIcons() {
    const results = [];

    console.log(`\n📂 Reading SVG files from: ${BRAND_ICONS_PATH}`);
    const files = readdirSync(BRAND_ICONS_PATH);

    console.log(`🎯 Will upload ${Object.keys(FILENAME_TO_BRAND_ID).length} brand icons\n`);

    for (const [filename, brandId] of Object.entries(FILENAME_TO_BRAND_ID)) {
        try {
            const filePath = join(BRAND_ICONS_PATH, filename);
            const fileBuffer = readFileSync(filePath);

            console.log(`⬆️  Uploading ${filename} → ${brandId}...`);

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filename, fileBuffer, {
                    contentType: 'image/svg+xml',
                    upsert: true
                });

            if (uploadError) {
                console.error(`   ❌ Upload failed: ${uploadError.message}`);
                results.push({ filename, brandId, success: false, error: uploadError.message });
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filename);

            console.log(`   ✅ Uploaded successfully`);
            console.log(`   🔗 ${publicUrl}`);

            results.push({ filename, brandId, success: true, publicUrl });

        } catch (error) {
            console.error(`   ❌ Error: ${error}`);
            results.push({ filename, brandId, success: false, error: String(error) });
        }
    }

    return results;
}

async function updateBrandRecords(results) {
    console.log('\n🔄 Updating brand records in database...\n');

    const successfulUploads = results.filter(r => r.success);
    let updated = 0;
    let failed = 0;

    for (const result of successfulUploads) {
        try {
            const { error } = await supabase
                .from('oem_brands')
                .update({ brand_image_url: result.publicUrl })
                .eq('id', result.brandId);

            if (error) {
                console.error(`   ❌ Failed to update ${result.brandId}: ${error.message}`);
                failed++;
            } else {
                console.log(`   ✅ Updated ${result.brandId}`);
                updated++;
            }
        } catch (error) {
            console.error(`   ❌ Error updating ${result.brandId}: ${error}`);
            failed++;
        }
    }

    console.log(`\n📊 Database update complete:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
}

async function main() {
    console.log('🚀 Starting brand icon upload to Supabase...');

    try {
        await createBucketIfNotExists();
        const results = await uploadBrandIcons();
        await updateBrandRecords(results);

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log('\n' + '='.repeat(50));
        console.log('🎉 MIGRATION COMPLETE!');
        console.log('='.repeat(50));
        console.log(`✅ Successfully uploaded: ${successful} icons`);
        console.log(`❌ Failed: ${failed} icons`);

        if (failed > 0) {
            console.log('\n❌ Failed uploads:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`   - ${r.filename} (${r.brandId}): ${r.error}`);
            });
        }

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

main();
