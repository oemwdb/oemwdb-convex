/**
 * Fetch Rolls-Royce vehicle images from cloud Supabase
 * and update local vehicle hero_image_url
 */

const CLOUD_PROJECT_REF = 'bclvqqnnyqgzoavgrkke';
const SUPABASE_ACCESS_TOKEN = 'sbp_ec891a6d647edf2bda7ef0dc1fd6d99c5d751ea1';

async function fetchCloudVehicleImages() {
    console.log('Fetching Rolls-Royce vehicle images from cloud...');

    // Get storage buckets
    const listUrl = `https://api.supabase.com/v1/projects/${CLOUD_PROJECT_REF}/storage/buckets`;
    const bucketsRes = await fetch(listUrl, {
        headers: { 'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}` }
    });

    if (!bucketsRes.ok) {
        console.error('Failed to get buckets:', await bucketsRes.text());
        return [];
    }

    const buckets = await bucketsRes.json();
    console.log('Buckets:', buckets.map(b => b.name));

    // Try to list files in oemwdb images bucket
    const storageUrl = `https://${CLOUD_PROJECT_REF}.supabase.co/storage/v1`;
    const listFilesUrl = `${storageUrl}/object/list/oemwdb%20images`;

    const filesRes = await fetch(listFilesUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prefix: 'oem vehicles/Rolls-Royce',
            limit: 100
        })
    });

    if (!filesRes.ok) {
        console.log('Trying alternative path...');
        // Try alternative path
        const altRes = await fetch(listFilesUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prefix: '',
                limit: 100
            })
        });

        const altData = await altRes.json();
        console.log('Root files/folders:', altData);
        return [];
    }

    const files = await filesRes.json();
    console.log(`Found ${files.length} files`);

    // Generate signed URLs for each file
    const imageUrls = [];
    for (const file of files) {
        if (file.name && !file.id) continue; // Skip folders

        const signUrl = `${storageUrl}/object/sign/oemwdb%20images/${encodeURIComponent(file.name)}`;
        const signRes = await fetch(signUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expiresIn: 31536000 }) // 1 year
        });

        if (signRes.ok) {
            const signData = await signRes.json();
            imageUrls.push({
                name: file.name,
                url: `https://${CLOUD_PROJECT_REF}.supabase.co${signData.signedURL}`
            });
        }
    }

    return imageUrls;
}

// Query cloud Supabase for vehicles with images
async function queryCloudVehicles() {
    const url = `https://${CLOUD_PROJECT_REF}.supabase.co/rest/v1/oem_vehicles?select=id,vehicle_title,hero_image_url,vehicle_image&or=(vehicle_title.ilike.*rolls*,id.ilike.*rolls*)`;

    const res = await fetch(url, {
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbHZxcW5ueXFnem9hdmdya2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNTQ4NTgsImV4cCI6MjAzNTkzMDg1OH0.fSQPhVo0Eo4irnkB0ZNNMvDv_9LIolm0uu_htzMSRsc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbHZxcW5ueXFnem9hdmdya2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNTQ4NTgsImV4cCI6MjAzNTkzMDg1OH0.fSQPhVo0Eo4irnkB0ZNNMvDv_9LIolm0uu_htzMSRsc'
        }
    });

    if (!res.ok) {
        console.error('Cloud query failed:', await res.text());
        return [];
    }

    return await res.json();
}

async function main() {
    console.log('=== Syncing RR Vehicle Images from Cloud ===\n');

    const cloudVehicles = await queryCloudVehicles();
    console.log(`Found ${cloudVehicles.length} Rolls-Royce vehicles in cloud with images`);

    const fs = await import('fs');

    // Generate SQL updates
    let sql = '-- Sync vehicle images from cloud Supabase\n';
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    for (const v of cloudVehicles) {
        const imageUrl = v.hero_image_url || v.vehicle_image;
        if (!imageUrl) continue;

        // Match by vehicle title or similar patterns
        const titleMatch = v.vehicle_title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';

        sql += `-- ${v.vehicle_title}\n`;
        sql += `UPDATE oem_vehicles SET hero_image_url = '${imageUrl}' WHERE vehicle_title ILIKE '%${v.vehicle_title?.replace(/'/g, "''")}%';\n\n`;
    }

    fs.writeFileSync('sync_vehicle_images.sql', sql);
    console.log('Generated sync_vehicle_images.sql');

    // Also print cloud vehicles for debugging
    console.log('\nCloud vehicles:');
    for (const v of cloudVehicles) {
        console.log(`  ${v.id}: ${v.vehicle_title} -> ${v.hero_image_url?.substring(0, 50) || 'no image'}...`);
    }
}

main().catch(console.error);
