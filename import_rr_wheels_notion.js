/**
 * Import Rolls-Royce Wheels from Notion API to Supabase
 * 
 * This script fetches wheels from the Notion OEM Wheels database
 * and generates SQL INSERT statements for the local Supabase.
 */

import fs from 'fs';

const NOTION_API_KEY = 'ntn_V62415588614DljTKXbJOe8o2ZUuvymXCe0PEM1vNNgeoE';
const DATABASE_ID = '1b417406-a14d-81cd-97bb-f544af38ecf1';
const OUTPUT_FILE = 'import_rr_wheels.sql';

// Fetch from Notion API
async function fetchNotionWheels() {
    const wheels = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Brand Relation',
                    rich_text: { contains: 'Rolls' }
                },
                page_size: 100,
                start_cursor: startCursor
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Notion API Error:', data.error);
            process.exit(1);
        }

        wheels.push(...data.results);
        hasMore = data.has_more;
        startCursor = data.next_cursor;
    }

    return wheels;
}

// Helper to extract plain text from rich_text array
function getPlainText(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray) || richTextArray.length === 0) {
        return null;
    }
    return richTextArray.map(rt => rt.plain_text).join('').trim() || null;
}

// Helper to get title text
function getTitleText(titleArray) {
    if (!titleArray || !Array.isArray(titleArray) || titleArray.length === 0) {
        return null;
    }
    return titleArray.map(t => t.plain_text).join('').trim() || null;
}

// Helper to get file URL from files array
function getFileUrl(filesArray) {
    if (!filesArray || !Array.isArray(filesArray) || filesArray.length === 0) {
        return null;
    }
    const file = filesArray[0];
    if (file.type === 'file') {
        return file.file?.url || null;
    } else if (file.type === 'external') {
        return file.external?.url || null;
    }
    return null;
}

// Escape SQL string
function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

// Generate slug from wheel name
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Transform Notion wheel to Supabase row
function transformWheel(page) {
    const props = page.properties;

    // Extract basic text fields
    const wheelName = getTitleText(props['Wheel Name']?.title);
    if (!wheelName) return null;

    const id = slugify(wheelName);
    const partNumbers = getPlainText(props['Part Numbers']?.rich_text);
    const offset = getPlainText(props['Offset']?.rich_text);
    const weight = getPlainText(props['Weight']?.rich_text);
    const color = getPlainText(props['Color']?.rich_text);
    const metalType = getPlainText(props['Metal Type']?.rich_text);
    const notes = getPlainText(props['Notes']?.rich_text);
    const imgSources = getPlainText(props['IMG Sources']?.rich_text);

    // File URLs
    const goodPicUrl = getFileUrl(props['Good Pic']?.files);
    const badPicUrl = getFileUrl(props['Bad Pic Notion']?.files);

    // Checkbox
    const aiProcessingComplete = props['AI Processing Complete']?.checkbox || false;

    // JSONB refs
    const centerBore = getPlainText(props['Center Bore']?.rich_text);
    const centerBoreRef = centerBore ? JSON.stringify([{ value: centerBore }]) : null;

    const widthRaw = getPlainText(props['Width']?.rich_text);
    let widthRef = null;
    if (widthRaw) {
        const widths = widthRaw.split(',').map(s => {
            const match = s.match(/([\d.]+)/);
            return match ? { value: parseFloat(match[1]), unit: 'J', raw: s.trim() } : null;
        }).filter(Boolean);
        if (widths.length > 0) widthRef = JSON.stringify(widths);
    }

    const diameterRaw = getPlainText(props['Diameter Text']?.rich_text);
    let diameterRef = null;
    if (diameterRaw) {
        const match = diameterRaw.match(/([\d.]+)/);
        if (match) diameterRef = JSON.stringify([{ value: parseFloat(match[1]), unit: 'inch', raw: diameterRaw }]);
    }

    const boltPattern = getPlainText(props['Bolt Pattern Text']?.rich_text);
    const boltPatternRef = boltPattern ? JSON.stringify([{ value: boltPattern }]) : null;

    // Brand ref - use "rolls-royce" since we're filtering for RR
    const brandRef = JSON.stringify([{ value: 'rolls-royce' }]);

    // Vehicle ref from relation
    const vehicleRelations = props['Vehicle Rel.']?.relation || [];
    let vehicleRef = null;
    if (vehicleRelations.length > 0) {
        vehicleRef = JSON.stringify(vehicleRelations.map(v => ({ id: v.id })));
    }

    // Color ref from relation
    const colorRelations = props['OEM Color Rel.']?.relation || [];
    let colorRef = null;
    if (colorRelations.length > 0) {
        colorRef = JSON.stringify(colorRelations.map(c => ({ id: c.id })));
    }

    // Design style
    const designStyleRaw = getPlainText(props['Design Style Text']?.rich_text);
    let designStyleRef = null;
    if (designStyleRaw) {
        designStyleRef = designStyleRaw.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Extra specs (number of spokes, etc.)
    const numSpokes = getPlainText(props['Number of Spokes']?.rich_text);
    let specifications = null;
    if (numSpokes) {
        specifications = JSON.stringify({ numberOfSpokes: numSpokes });
    }

    return {
        id,
        wheel_title: wheelName,
        part_numbers: partNumbers,
        wheel_offset: offset,
        weight,
        notes,
        color,
        metal_type: metalType,
        image_source: imgSources,
        good_pic_url: goodPicUrl,
        bad_pic_url: badPicUrl,
        ai_processing_complete: aiProcessingComplete,
        uuid: page.id, // Store Notion page ID
        brand_ref: brandRef,
        diameter_ref: diameterRef,
        width_ref: widthRef,
        bolt_pattern_ref: boltPatternRef,
        center_bore_ref: centerBoreRef,
        vehicle_ref: vehicleRef,
        color_ref: colorRef,
        design_style_ref: designStyleRef,
        specifications
    };
}

// Generate SQL INSERT statement
function generateSql(wheel) {
    const designStyleSql = wheel.design_style_ref
        ? `ARRAY[${wheel.design_style_ref.map(s => escapeSql(s)).join(', ')}]`
        : 'NULL';

    return `INSERT INTO oem_wheels (
  id, wheel_title, part_numbers, wheel_offset, weight, notes, color, metal_type,
  image_source, good_pic_url, bad_pic_url, ai_processing_complete, uuid,
  brand_ref, diameter_ref, width_ref, bolt_pattern_ref, center_bore_ref,
  vehicle_ref, color_ref, design_style_ref, specifications, production_ready
) VALUES (
  ${escapeSql(wheel.id)},
  ${escapeSql(wheel.wheel_title)},
  ${escapeSql(wheel.part_numbers)},
  ${escapeSql(wheel.wheel_offset)},
  ${escapeSql(wheel.weight)},
  ${escapeSql(wheel.notes)},
  ${escapeSql(wheel.color)},
  ${escapeSql(wheel.metal_type)},
  ${escapeSql(wheel.image_source)},
  ${escapeSql(wheel.good_pic_url)},
  ${escapeSql(wheel.bad_pic_url)},
  ${wheel.ai_processing_complete},
  ${escapeSql(wheel.uuid)},
  ${wheel.brand_ref ? escapeSql(wheel.brand_ref) : 'NULL'}::jsonb,
  ${wheel.diameter_ref ? escapeSql(wheel.diameter_ref) : 'NULL'}::jsonb,
  ${wheel.width_ref ? escapeSql(wheel.width_ref) : 'NULL'}::jsonb,
  ${wheel.bolt_pattern_ref ? escapeSql(wheel.bolt_pattern_ref) : 'NULL'}::jsonb,
  ${wheel.center_bore_ref ? escapeSql(wheel.center_bore_ref) : 'NULL'}::jsonb,
  ${wheel.vehicle_ref ? escapeSql(wheel.vehicle_ref) : 'NULL'}::jsonb,
  ${wheel.color_ref ? escapeSql(wheel.color_ref) : 'NULL'}::jsonb,
  ${designStyleSql},
  ${wheel.specifications ? escapeSql(wheel.specifications) : 'NULL'}::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  wheel_offset = EXCLUDED.wheel_offset,
  weight = EXCLUDED.weight,
  notes = EXCLUDED.notes,
  color = EXCLUDED.color,
  metal_type = EXCLUDED.metal_type,
  image_source = EXCLUDED.image_source,
  good_pic_url = EXCLUDED.good_pic_url,
  bad_pic_url = EXCLUDED.bad_pic_url,
  ai_processing_complete = EXCLUDED.ai_processing_complete,
  uuid = EXCLUDED.uuid,
  brand_ref = EXCLUDED.brand_ref,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  center_bore_ref = EXCLUDED.center_bore_ref,
  vehicle_ref = EXCLUDED.vehicle_ref,
  color_ref = EXCLUDED.color_ref,
  design_style_ref = EXCLUDED.design_style_ref,
  specifications = EXCLUDED.specifications,
  updated_at = NOW();

`;
}

// Main
async function main() {
    console.log('Fetching Rolls-Royce wheels from Notion...');
    const notionWheels = await fetchNotionWheels();
    console.log(`Found ${notionWheels.length} Rolls-Royce wheels.`);

    let sql = '-- Rolls-Royce Wheel Import from Notion\n';
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Total wheels: ${notionWheels.length}\n\n`;

    let successCount = 0;
    for (const page of notionWheels) {
        const wheel = transformWheel(page);
        if (wheel) {
            sql += generateSql(wheel);
            successCount++;
        }
    }

    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`Generated ${OUTPUT_FILE} with ${successCount} wheel inserts.`);
}

main().catch(console.error);
