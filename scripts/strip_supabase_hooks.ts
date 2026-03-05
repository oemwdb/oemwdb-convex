import fs from 'fs';
import path from 'path';

function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            // Replace hook calls like useSupabaseWheels()
            const hookRegex = /useSupabase[A-Za-z0-9_]*\([^)]*\)/g;
            if (hookRegex.test(content)) {
                content = content.replace(hookRegex, '{ data: null as any, isLoading: false, error: null }');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Cleaned hooks in ${fullPath}`);
            }
        }
    }
}

processDirectory('./src');
console.log('Done cleaning Supabase hooks.');
