
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WHEELS_DIR = '/Users/GABRIEL_1/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/classified.obsid/classified/04. oem_wheels (master)/OEM WHEELS';
const OUTPUT_FILE = 'import_wheels.sql';

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
}

function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract ID
    const idMatch = content.match(/Record ID:\s*(.+)/);
    const id = idMatch ? idMatch[1].trim() : path.basename(filePath, '.md');
    const cleanId = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Extract Title
    const titleMatch = content.match(/\*\*Wheel Title\*\*[\s\S]*?\*\*Value:\*\*\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : id;

    // Extract Hollander
    const hollanderMatch = content.match(/\*\*Hollander Number:\*\*\s*(.+)/);
    const hollander = hollanderMatch ? hollanderMatch[1].trim() : null;

    // Extract OE
    const oeMatch = content.match(/\*\*OE Number:\*\*\s*(.+)/);
    const oe = oeMatch ? oeMatch[1].trim() : null;

    let partNumbers = [];
    if (hollander && hollander !== 'Description') partNumbers.push(`Hollander: ${hollander}`);
    if (oe && oe !== 'Description') partNumbers.push(`OE: ${oe}`);
    const partNumbersStr = partNumbers.join(', ');

    // Specifications
    const diamMatch = content.match(/\*\*Diameter:\*\*\s*([\d\.]+)/);
    const widthMatch = content.match(/\*\*Width:\*\*\s*([\d\.]+)/);
    const boltMatch = content.match(/\*\*Bolt Pattern:\*\*\s*(.+)/);

    const diameter = diamMatch ? parseFloat(diamMatch[1]) : null;
    const width = widthMatch ? parseFloat(widthMatch[1]) : null;
    const boltPattern = boltMatch && boltMatch[1] !== 'N/A' ? boltMatch[1].trim() : null;

    // Finish
    const finishMatch = content.match(/### Finish[\s\S]*?\*\*Value:\*\*\s*(.+)/);
    const finish = finishMatch ? finishMatch[1].trim() : null;

    // Image
    const imgMatch = content.match(/!\[\[(.*?)\]\]/);
    const imgPath = imgMatch ? imgMatch[1] : null;

    // Jsonb refs
    const diamRef = diameter ? JSON.stringify({ value: diameter, unit: 'inch' }) : null;
    const widthRef = width ? JSON.stringify({ value: width, unit: 'inch' }) : null;
    const boltRef = boltPattern ? JSON.stringify({ value: boltPattern }) : null;

    // SQL
    return `INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, color, bad_pic_url, production_ready)
VALUES (
  ${escapeSql(cleanId)},
  ${escapeSql(title)},
  ${escapeSql(partNumbersStr)},
  ${diamRef ? "'" + diamRef + "'" : 'NULL'},
  ${widthRef ? "'" + widthRef + "'" : 'NULL'},
  ${boltRef ? "'" + boltRef + "'" : 'NULL'},
  ${escapeSql(finish)},
  ${escapeSql(imgPath)},
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
`;
}

async function main() {
    console.log('Starting script generation...');
    const writeStream = fs.createWriteStream(OUTPUT_FILE);

    // Walk directory
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
    console.log('Finished generating SQL.');
}

main();
