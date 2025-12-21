/**
 * Upload Rolls-Royce wheel images to local Supabase Storage
 * and update oem_wheels.bad_pic_url with storage URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const BUCKET_NAME = 'wheel-images';
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

// Slugify folder/wheel name to match DB id
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Ensure bucket exists
async function ensureBucket() {
    console.log('Checking if bucket exists...');

    // Check if bucket exists
    const listResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });

    const buckets = await listResponse.json();
    const bucketExists = Array.isArray(buckets) && buckets.some(b => b.id === BUCKET_NAME);

    if (!bucketExists) {
        console.log(`Creating bucket: ${BUCKET_NAME}`);
        const createResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: BUCKET_NAME,
                name: BUCKET_NAME,
                public: true
            })
        });

        if (!createResponse.ok) {
            const error = await createResponse.text();
            console.error('Failed to create bucket:', error);
            return false;
        }
        console.log('Bucket created successfully');
    } else {
        console.log('Bucket already exists');
    }
    return true;
}

// Upload file to storage
async function uploadFile(localPath, storagePath) {
    const fileContent = fs.readFileSync(localPath);
    const contentType = getContentType(localPath);

    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodeURIComponent(storagePath)}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': contentType,
                'x-upsert': 'true'
            },
            body: fileContent
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed for ${storagePath}: ${error}`);
    }

    // Return public URL
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${encodeURIComponent(storagePath)}`;
}

// Process all wheel folders
async function processWheelFolders() {
    const folders = fs.readdirSync(IMAGE_DIR).filter(f => {
        const fullPath = path.join(IMAGE_DIR, f);
        return fs.statSync(fullPath).isDirectory() && f.toLowerCase().includes('rolls-royce');
    });

    console.log(`Found ${folders.length} Rolls-Royce wheel folders`);

    const results = [];

    for (const folder of folders) {
        const folderPath = path.join(IMAGE_DIR, folder);
        const files = fs.readdirSync(folderPath).filter(f =>
            /\.(webp|png|jpg|jpeg)$/i.test(f)
        );

        if (files.length === 0) {
            console.log(`  No images in: ${folder}`);
            continue;
        }

        // Use first image
        const imageFile = files[0];
        const localPath = path.join(folderPath, imageFile);
        const wheelId = slugify(folder);
        const storagePath = `rolls-royce/${imageFile}`;

        try {
            console.log(`  Uploading: ${imageFile}`);
            const publicUrl = await uploadFile(localPath, storagePath);
            results.push({
                wheelId,
                folder,
                imageFile,
                publicUrl
            });
        } catch (error) {
            console.error(`  Failed to upload ${imageFile}:`, error.message);
        }
    }

    return results;
}

// Generate SQL updates
function generateSql(results) {
    let sql = '-- Update wheel bad_pic_url with local Supabase storage URLs\n';
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    for (const r of results) {
        sql += `UPDATE oem_wheels SET bad_pic_url = '${r.publicUrl}' WHERE id = '${r.wheelId}';\n`;
    }

    return sql;
}

// Main
async function main() {
    console.log('======================================');
    console.log('Uploading wheel images to Supabase');
    console.log('======================================\n');

    const bucketReady = await ensureBucket();
    if (!bucketReady) {
        console.error('Failed to ensure bucket exists');
        process.exit(1);
    }

    const results = await processWheelFolders();
    console.log(`\nSuccessfully uploaded ${results.length} images`);

    // Generate SQL
    const sql = generateSql(results);
    fs.writeFileSync('update_rr_badpic_storage.sql', sql);
    console.log(`Generated update_rr_badpic_storage.sql`);

    // Log summary
    console.log('\nSummary:');
    for (const r of results.slice(0, 5)) {
        console.log(`  ${r.wheelId} -> ${r.publicUrl.substring(0, 60)}...`);
    }
    if (results.length > 5) {
        console.log(`  ... and ${results.length - 5} more`);
    }
}

main().catch(console.error);
