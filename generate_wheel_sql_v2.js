
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WHEELS_DIR = '/Users/GABRIEL_1/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/classified.obsid/classified/04. oem_wheels (master)/OEM WHEEL RECORDS';
const OUTPUT_FILE = 'import_wheels_v2.sql';

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

// Function to extract value from YAML-like lines
function extractValue(content, key) {
    const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
    const match = content.match(regex);
    if (match) {
        let val = match[1].trim();
        // Remove quotes if present
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        return val;
    }
    return null;
}

// Function to extract BadPIC array
function extractBadPic(content) {
    // Look for BadPIC:\n  - "[[...]]" pattern
    const regex = /BadPIC:\s*\n\s*-\s*"?\[\[(.*?)\]\]"?/m;
    const match = content.match(regex);
    return match ? match[1] : null;
}

function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.md');

    // ID strategy: Use filename as ID, lowercased and slugified
    const id = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Fields
    const brand = extractValue(content, 'Brand Relation');
    const partNumbers = extractValue(content, 'Part Numbers');
    const widthVal = extractValue(content, 'Width');
    const diameterVal = extractValue(content, 'Diameter Text');
    const boltPattern = extractValue(content, 'Bolt Pattern Text');
    const finish = extractValue(content, 'Color');
    const designStyle = extractValue(content, 'Design Style Text');
    const badPic = extractBadPic(content);

    // Parse numeric values
    let diameter = null;
    if (diameterVal) {
        const d = parseFloat(diameterVal);
        if (!isNaN(d)) diameter = d;
    }

    let width = null;
    if (widthVal) {
        const w = parseFloat(widthVal);
        if (!isNaN(w)) width = w;
    }

    // Construct JSONB Arrays (to be safe and consistent with DB patches)
    const diamRef = diameter ? JSON.stringify([{ value: diameter, unit: 'inch', raw: diameterVal }]) : null;
    const widthRef = width ? JSON.stringify([{ value: width, unit: 'inch', raw: widthVal }]) : null;
    const boltRef = boltPattern ? JSON.stringify([{ value: boltPattern }]) : null;
    const brandRef = brand ? JSON.stringify([{ value: brand }]) : null;

    // Construct Title if missing
    const title = brand ? `${brand} ${designStyle || 'OEM Wheel'} ${diameter ? diameter + '"' : ''}` : filename;

    // Image Source (Obsidian formatted)
    const imgPath = badPic ? `![[${badPic}]]` : null;

    return `INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  ${escapeSql(id)},
  ${escapeSql(title)},
  ${escapeSql(partNumbers)},
  ${diamRef ? "'" + diamRef + "'" : 'NULL'},
  ${widthRef ? "'" + widthRef + "'" : 'NULL'},
  ${boltRef ? "'" + boltRef + "'" : 'NULL'},
  ${brandRef ? "'" + brandRef + "'" : 'NULL'},
  ${escapeSql(finish)},
  ${escapeSql(imgPath)},
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
`;
}

async function main() {
    console.log('Starting script generation v2...');
    const writeStream = fs.createWriteStream(OUTPUT_FILE);

    async function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                await walk(fullPath);
            } else if (file.endsWith('.md')) {
                try {
                    const sql = parseFile(fullPath);
                    writeStream.write(sql);
                } catch (err) {
                    console.error(`Error parsing ${file}:`, err.message);
                }
            }
        }
    }

    await walk(WHEELS_DIR);
    writeStream.end();
    console.log('Finished generating SQL v2.');
}

main();
