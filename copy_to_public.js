/**
 * Copy wheel images to public folder with proper naming
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, 'temp_notion_import', 'OEM Wheels');
const DEST_DIR = path.join(__dirname, 'public', 'wheels', 'rolls-royce');

// Ensure destination exists
fs.mkdirSync(DEST_DIR, { recursive: true });

// Slugify
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Process folders
const folders = fs.readdirSync(SOURCE_DIR).filter(f => {
    const fullPath = path.join(SOURCE_DIR, f);
    return fs.statSync(fullPath).isDirectory() && f.toLowerCase().includes('rolls-royce');
});

console.log(`Found ${folders.length} Rolls-Royce folders`);

const copied = [];
for (const folder of folders) {
    const folderPath = path.join(SOURCE_DIR, folder);
    const files = fs.readdirSync(folderPath).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));

    if (files.length === 0) continue;

    const firstFile = files[0];
    const ext = path.extname(firstFile).toLowerCase();
    const slug = slugify(folder);
    const destName = `${slug}${ext}`;
    const destPath = path.join(DEST_DIR, destName);

    fs.copyFileSync(path.join(folderPath, firstFile), destPath);
    console.log(`Copied: ${destName}`);
    copied.push({ id: slug, filename: destName });
}

// Generate SQL
let sql = '-- Update bad_pic_url to use public/wheels paths\n';
sql += `-- Generated: ${new Date().toISOString()}\n\n`;
for (const c of copied) {
    sql += `UPDATE oem_wheels SET bad_pic_url = '/wheels/rolls-royce/${c.filename}' WHERE id = '${c.id}';\n`;
}
fs.writeFileSync('update_badpic_public.sql', sql);
console.log(`\nGenerated update_badpic_public.sql with ${copied.length} updates`);
