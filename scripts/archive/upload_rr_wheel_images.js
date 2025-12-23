/**
 * Upload Rolls-Royce wheel images to Supabase Storage
 * and update oem_wheels records with storage URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const BUCKET_NAME = 'wheel-images';

// Image directory
const IMAGE_DIR = path.join(__dirname, 'temp_notion_import', 'OEM Wheels');

// Get content type from extension
function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = {
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
    };
    return types[ext] || 'application/octet-stream';
}

// Upload file to Supabase storage
async function uploadFile(filePath, storagePath) {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${storagePath}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': contentType,
                'x-upsert': 'true'
            },
            body: fileContent
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
}

// Create bucket if not exists
async function ensureBucket() {
    // Check if bucket exists
    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/bucket/${BUCKET_NAME}`,
        {
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        }
    );

    if (response.status === 404) {
        // Create bucket
        const createResponse = await fetch(
            `${SUPABASE_URL}/storage/v1/bucket`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: BUCKET_NAME,
                    name: BUCKET_NAME,
                    public: true
                })
            }
        );

        if (!createResponse.ok) {
            const error = await createResponse.text();
            console.log('Bucket creation response:', error);
            // Continue anyway, might just need service key
        } else {
            console.log(`Created bucket: ${BUCKET_NAME}`);
        }
    } else {
        console.log(`Bucket ${BUCKET_NAME} exists`);
    }
}

// Slugify wheel name to match DB id
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Find all wheel images and generate SQL updates
async function processImages() {
    console.log('Scanning for Rolls-Royce wheel images...');

    const updates = [];
    const folders = fs.readdirSync(IMAGE_DIR).filter(f =>
        fs.statSync(path.join(IMAGE_DIR, f)).isDirectory() &&
        f.toLowerCase().includes('rolls-royce')
    );

    console.log(`Found ${folders.length} Rolls-Royce wheel folders`);

    for (const folder of folders) {
        const folderPath = path.join(IMAGE_DIR, folder);
        const files = fs.readdirSync(folderPath).filter(f =>
            /\.(webp|png|jpg|jpeg)$/i.test(f)
        );

        if (files.length === 0) continue;

        // Use the first image as the bad_pic_url
        const imageFile = files[0];
        const wheelId = slugify(folder);
        const storagePath = `rolls-royce/${encodeURIComponent(imageFile)}`;
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

        updates.push({
            wheelId,
            folder,
            imagePath: path.join(folderPath, imageFile),
            storagePath,
            imageUrl
        });
    }

    return updates;
}

// Generate SQL update file
function generateSqlUpdates(updates) {
    let sql = '-- Update wheel images with Supabase storage URLs\n';
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    for (const update of updates) {
        sql += `UPDATE oem_wheels SET bad_pic_url = '${update.imageUrl}' WHERE id = '${update.wheelId}';\n`;
    }

    return sql;
}

// Main
async function main() {
    try {
        await ensureBucket();
    } catch (e) {
        console.log('Note: Bucket check failed, continuing with SQL generation only');
    }

    const updates = await processImages();
    console.log(`Found ${updates.length} wheels with images`);

    // For now, just generate the SQL with local file references
    // that can be updated once storage is configured properly
    let sql = '-- Update wheel images with local file references\n';
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += '-- These paths reference files in temp_notion_import/OEM Wheels/\n\n';

    for (const update of updates) {
        // For now, use the relative path (can be updated to storage URL later)
        const relativePath = path.relative(__dirname, update.imagePath);
        sql += `UPDATE oem_wheels SET bad_pic_url = '${relativePath.replace(/'/g, "''")}' WHERE id = '${update.wheelId}';\n`;
    }

    fs.writeFileSync('update_rr_wheel_images.sql', sql);
    console.log(`Generated update_rr_wheel_images.sql with ${updates.length} updates`);

    // Also output mapping for reference
    console.log('\nImage mapping:');
    for (const update of updates.slice(0, 5)) {
        console.log(`  ${update.wheelId} -> ${path.basename(update.imagePath)}`);
    }
    if (updates.length > 5) {
        console.log(`  ... and ${updates.length - 5} more`);
    }
}

main().catch(console.error);
