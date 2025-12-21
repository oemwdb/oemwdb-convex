
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the CSV file
const IMPORT_DIR = path.join(__dirname, 'temp_notion_import');
const files = fs.readdirSync(IMPORT_DIR);
// Prioritize _all.csv
let csvFile = files.find(f => f.endsWith('_all.csv') && f.includes('OEM Wheels'));
if (!csvFile) {
    csvFile = files.find(f => f.endsWith('.csv') && f.includes('OEM Wheels'));
}

if (!csvFile) {
    console.error("No CSV file found in temp_notion_import");
    process.exit(1);
}

const CSV_PATH = path.join(IMPORT_DIR, csvFile);
const OUTPUT_FILE = 'import_wheels_notion.sql';

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

// Robust CSV Line Parser
function parseCsvLine(line) {
    // Regex matches:
    // 1. Quoted string: "([^"]*(?:""[^"]*)*)"
    // 2. Standard field: ([^",]+)
    // 3. Empty field: ,,
    const pattern = /("((?:""|[^"])*)"|([^,]*))(?:,|$)/g;
    const result = [];
    let match;
    while ((match = pattern.exec(line)) !== null) {
        if (match.index === pattern.lastIndex) {
            pattern.lastIndex++;
        }
        // Last match is always empty string at end of line due to logic, skip it if we already have data but check integrity
        if (match[0].length === 0 && pattern.lastIndex > line.length) break;

        let val = match[2] !== undefined ? match[2].replace(/""/g, '"') : match[3];
        result.push(val);
    }
    // The regex loop might add an extra empty element at end, pop if invalid? 
    // Actually simpler approach:
    return line.match(/("((?:""|[^"])*)"|[^,]*)(?:,|$)/g).map(m => {
        // Remove trailing comma
        let txt = m.endsWith(',') ? m.slice(0, -1) : m;
        // Strip quotes if present
        if (txt.startsWith('"') && txt.endsWith('"')) {
            txt = txt.slice(1, -1).replace(/""/g, '"');
        }
        return txt;
    }).slice(0, -1); // remove last empty match from line end
}

function parseFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // Handle BOM
    const content = fileContent.charCodeAt(0) === 0xFEFF ? fileContent.slice(1) : fileContent;
    const rawLines = content.split(/\r?\n/);

    const lines = [];
    let currentLine = '';
    let inQuote = false;

    // Re-assemble multiline CSV records
    for (let i = 0; i < rawLines.length; i++) {
        const raw = rawLines[i];

        // Count quotes in this chunk to determine state toggle
        // Note: Escaped quotes "" don't change state if scanned sequentially, 
        // but simply counting total quotes works because "" is even. 
        // Single " wraps start/end.
        // However, simplest way is to just traverse the string to track state.

        let tempRaw = currentLine ? (currentLine + '\n' + raw) : raw;

        // Check if the accumulated line is "complete" (even number of non-escaped quotes)
        // Actually, simple count of " chars is enough?
        // "" counts as 2. " counts as 1. 
        // If total count is Even, we are Closed. If Odd, we are Open.
        // Make sure to count from the *start* of the logical record.

        // Let's count quotes in the 'raw' segment
        let quoteCount = 0;
        for (let char of raw) {
            if (char === '"') quoteCount++;
        }

        if (currentLine === '') {
            // Starting a new record
            if (quoteCount % 2 === 0) {
                // Complete line
                lines.push(raw);
            } else {
                // Incomplete, start accumulating
                currentLine = raw;
            }
        } else {
            // Continuing a record
            currentLine += '\n' + raw;
            // Check if we just closed it (added odd number of quotes to an existing odd number -> even)
            // Wait, we need to count total quotes in currentLine to be sure?
            // Or just track parity.
            // Previous parity was Odd (Open). Current segment has N quotes.
            // If N is Odd -> Total is Even -> Closed.
            // If N is Even -> Total is Odd -> Still Open.
            if (quoteCount % 2 !== 0) {
                lines.push(currentLine);
                currentLine = '';
            }
        }
    }

    if (lines.length === 0) {
        console.error("No valid lines found.");
        process.exit(1);
    }

    const headerLine = lines[0];
    const headers = parseCsvLine(headerLine);

    const getIdx = (name) => headers.indexOf(name);

    const idxTitle = getIdx('Wheel Name'); // Notion CSV uses 'Wheel Name' for the first column
    const idxBrand = getIdx('Brand Relation');
    const idxPart = getIdx('Part Numbers');
    const idxDiam = getIdx('Diameter Text');
    const idxWidth = getIdx('Width');
    const idxOffset = getIdx('Offset');
    const idxBolt = getIdx('Bolt Pattern Text');
    const idxBore = getIdx('Center Bore');
    const idxColor = getIdx('Color');
    const idxBadPic = getIdx('BadPIC');
    const idxVehicle = getIdx('Vehicle Relation Text');
    const idxNotes = getIdx('Notes');
    const idxWeight = getIdx('Weight');

    let sql = '';


    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = parseCsvLine(line);

        // Basic fields
        const title = cols[idxTitle];
        if (!title) continue; // Skip empty rows

        // ID generation
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const brand = cols[idxBrand];
        const partNumbers = cols[idxPart];
        const color = cols[idxColor];
        const offset = cols[idxOffset];
        const weight = cols[idxWeight];
        const notes = cols[idxNotes];

        // Arrays / Refs
        const diamRaw = cols[idxDiam];
        let diamRef = null;
        if (diamRaw) {
            const match = diamRaw.match(/([\d.]+)/);
            if (match) diamRef = JSON.stringify([{ value: parseFloat(match[1]), unit: 'inch', raw: diamRaw }]);
        }

        const widthRaw = cols[idxWidth];
        let widthRef = null;
        if (widthRaw) {
            // Handle "8.5J, 9.5J"
            const widths = widthRaw.split(',').map(s => {
                const match = s.match(/([\d.]+)/);
                return match ? { value: parseFloat(match[1]), unit: 'J', raw: s.trim() } : null;
            }).filter(Boolean);
            if (widths.length > 0) widthRef = JSON.stringify(widths);
        }

        const boltRaw = cols[idxBolt];
        let boltRef = null;
        if (boltRaw) boltRef = JSON.stringify([{ value: boltRaw }]);

        // Brand ID normalization (lowercase slug)
        let brandRef = null;
        if (brand) {
            // Assume ID is lowercase slug of name (e.g. Rolls-Royce -> rolls-royce)
            const brandId = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            brandRef = JSON.stringify([{ value: brandId }]);
        }

        const vehicleRaw = cols[idxVehicle];
        let vehicleRef = null;
        if (vehicleRaw) {
            const vehicles = vehicleRaw.split(',').map(v => ({ value: v.trim() })).filter(v => v.value);
            if (vehicles.length > 0) vehicleRef = JSON.stringify(vehicles);
        }

        const boreRaw = cols[idxBore];
        let boreRef = null;
        if (boreRaw) boreRef = JSON.stringify([{ value: boreRaw }]);

        // Bad Pic - Convert "OEM Wheels/Filename.webp" to "![[Filename.webp]]"
        const badPicRaw = cols[idxBadPic];
        let badPicUrl = null;
        if (badPicRaw) {
            // Take first if multiple
            const firstPath = badPicRaw.split(',')[0].trim();
            const filename = path.basename(firstPath); // extract filename
            // Decode URI components if needed (Notion sometimes encodes spaces as %20)
            const decodedFilename = decodeURIComponent(filename);
            badPicUrl = `![[${decodedFilename}]]`;
        }

        sql += `INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, vehicle_ref, center_bore_ref, wheel_offset, weight, notes, color, bad_pic_url, production_ready)
VALUES (
  ${escapeSql(id)},
  ${escapeSql(title)},
  ${escapeSql(partNumbers)},
  ${diamRef ? "'" + diamRef + "'" : 'NULL'},
  ${widthRef ? "'" + widthRef + "'" : 'NULL'},
  ${boltRef ? "'" + boltRef + "'" : 'NULL'},
  ${brandRef ? "'" + brandRef + "'" : 'NULL'},
  ${vehicleRef ? "'" + vehicleRef + "'" : 'NULL'},
  ${boreRef ? "'" + boreRef + "'" : 'NULL'},
  ${escapeSql(offset)},
  ${escapeSql(weight)},
  ${escapeSql(notes)},
  ${escapeSql(color)},
  ${escapeSql(badPicUrl)},
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  vehicle_ref = EXCLUDED.vehicle_ref,
  center_bore_ref = EXCLUDED.center_bore_ref,
  wheel_offset = EXCLUDED.wheel_offset,
  weight = EXCLUDED.weight,
  notes = EXCLUDED.notes,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
`;
    }

    return sql;
}

const sql = parseFile(CSV_PATH);
fs.writeFileSync(OUTPUT_FILE, sql);
console.log(`Generated ${OUTPUT_FILE}`);
