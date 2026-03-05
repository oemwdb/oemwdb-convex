import fs from 'fs';
import path from 'path';

const hooksToRemove = [
    'useSupabase', 'useAdvancedTable', 'useBrandDetail', 'useBrands',
    'usePageMappings', 'useReferenceFieldEditor', 'useStorage',
    'useUserListings', 'useVehicleMaintenance', 'useVehicleRegistration',
    'useVehicles', 'useVehicleUpgrades', 'useVehicleVariants',
    'useVehicleWithWheels', 'useWheels', 'useWheelWithVehicles',
    'supabase'
];

function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            const lines = content.split('\n');
            const newLines = [];

            for (const line of lines) {
                if (line.trim().startsWith('import ') && hooksToRemove.some(hook => line.includes(hook))) {
                    modified = true;
                    continue; // Skip the import line
                }

                // Very aggressive: replace hook calls with stub
                let newLine = line;
                for (const hook of hooksToRemove) {
                    if (hook !== 'supabase' && newLine.includes(`${hook}(`)) {
                        newLine = newLine.replace(new RegExp(`${hook}\\([^)]*\\)`), '{ data: null as any, isLoading: false, error: null }');
                        modified = true;
                    }
                }
                newLines.push(newLine);
            }

            if (modified) {
                fs.writeFileSync(fullPath, newLines.join('\n'));
                console.log(`Cleaned ${fullPath}`);
            }
        }
    }
}

processDirectory('./src');
console.log('Done cleaning imports.');
