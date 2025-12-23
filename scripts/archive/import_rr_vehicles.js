/**
 * Import Rolls-Royce vehicles from Notion and update wheel variants data
 */

const NOTION_API_KEY = 'ntn_V62415588614DljTKXbJOe8o2ZUuvymXCe0PEM1vNNgeoE';
const VEHICLES_DB_ID = '1b417406-a14d-81c4-a685-d72e258420b8';

// Slugify
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Extract text from rich_text
function getText(richText) {
    if (!richText || !Array.isArray(richText)) return null;
    return richText.map(t => t.plain_text).join('').trim() || null;
}

// Fetch RR vehicles from Notion
async function fetchRRVehicles() {
    const response = await fetch(`https://api.notion.com/v1/databases/${VEHICLES_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filter: {
                property: 'Brand Name',
                rich_text: { contains: 'Rolls' }
            },
            page_size: 30
        })
    });

    if (!response.ok) {
        throw new Error(`Notion API error: ${await response.text()}`);
    }

    return await response.json();
}

// Process and generate SQL
async function main() {
    console.log('Fetching Rolls-Royce vehicles from Notion...');

    const data = await fetchRRVehicles();
    console.log(`Found ${data.results.length} vehicles`);

    const vehicles = [];

    for (const page of data.results) {
        const props = page.properties;

        const chassisCode = getText(props['OEM Chassis Code']?.title) || 'Unknown';
        const modelName = getText(props['Model Name']?.rich_text);
        const brandName = getText(props['Brand Name']?.rich_text) || 'Rolls-Royce';
        const productionYears = getText(props['Productions Years Range']?.rich_text);
        const engineDetails = getText(props['Engine List']?.rich_text);
        const specialNotes = getText(props['Special Notes']?.rich_text);
        const platform = getText(props['Platform']?.rich_text);
        const boltPattern = getText(props['Bolt Pattern']?.rich_text);
        const centerBore = getText(props['Center Bore']?.rich_text);

        const id = slugify(chassisCode);
        const title = chassisCode;

        vehicles.push({
            uuid: page.id,
            id,
            title,
            modelName,
            brandName,
            productionYears,
            engineDetails,
            specialNotes,
            platform,
            boltPattern,
            centerBore
        });
    }

    // Generate SQL for vehicles
    let sql = '-- Import Rolls-Royce Vehicles from Notion\n';
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    for (const v of vehicles) {
        const escape = (s) => s ? `'${s.replace(/'/g, "''")}'` : 'NULL';
        const truncate = (s, len) => s && s.length > len ? s.substring(0, len) + '...' : s;

        sql += `INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (\n`;
        sql += `  ${escape(v.id)},\n`;
        sql += `  ${escape(v.title)},\n`;
        sql += `  ${escape(v.modelName)},\n`;
        sql += `  '[{"value":"rolls-royce"}]'::jsonb,\n`;
        sql += `  ${escape(v.productionYears)},\n`;
        sql += `  ${escape(truncate(v.engineDetails, 500))},\n`;
        sql += `  ${escape(v.uuid)}\n`;
        sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
        sql += `  vehicle_title = EXCLUDED.vehicle_title,\n`;
        sql += `  model_name = EXCLUDED.model_name,\n`;
        sql += `  brand_ref = EXCLUDED.brand_ref,\n`;
        sql += `  production_years = EXCLUDED.production_years,\n`;
        sql += `  oem_engine_ref = EXCLUDED.oem_engine_ref,\n`;
        sql += `  uuid = EXCLUDED.uuid;\n\n`;
    }

    // Generate SQL to update wheel vehicle_ref with proper titles
    sql += '\n-- Update wheel vehicle_ref to use vehicle IDs instead of Notion UUIDs\n';
    sql += '-- This maps the Notion UUIDs in wheels to the imported vehicle IDs\n\n';

    // Create a UUID to ID mapping
    const uuidMap = {};
    for (const v of vehicles) {
        uuidMap[v.uuid] = v.id;
    }

    console.log('\nVehicle UUID mapping:');
    for (const v of vehicles) {
        console.log(`  ${v.uuid} -> ${v.id} (${v.modelName || v.title})`);
    }

    const fs = await import('fs');
    fs.writeFileSync('import_rr_vehicles.sql', sql);
    console.log(`\nGenerated import_rr_vehicles.sql with ${vehicles.length} vehicles`);

    // Also write UUID mapping for reference
    fs.writeFileSync('rr_vehicle_uuid_map.json', JSON.stringify(uuidMap, null, 2));
    console.log('Generated rr_vehicle_uuid_map.json');
}

main().catch(console.error);
