#!/usr/bin/env node
/**
 * Import Nemiga wheel data into Supabase nemiga_source table
 * 
 * Usage:
 *   node scripts/import_nemiga_to_supabase.mjs ./data/nemiga_audi_wheels.json
 *   node scripts/import_nemiga_to_supabase.mjs --all  # imports all nemiga_*.json files
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bxpgfxawwcrxsqercsue.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY environment variable');
    console.error('   Set it with: export SUPABASE_SERVICE_KEY="your-key"');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse command line args
const args = process.argv.slice(2);
const importAll = args.includes('--all');
const dryRun = args.includes('--dry-run');
const inputFile = args.find(a => a.endsWith('.json'));

async function importWheels(filePath) {
    console.log(`\n📄 Importing from: ${filePath}`);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`   Found ${data.length} wheels`);

    if (data.length === 0) {
        console.log('   Skipping - no data');
        return { inserted: 0, updated: 0, errors: 0 };
    }

    // Transform to match nemiga_source schema
    const records = data.map(wheel => ({
        part_number: wheel.part_number,
        wheel_title: `${wheel.brand.toUpperCase()} ${wheel.specs?.diameter || ''} ${wheel.specs?.width || ''} ${wheel.specs?.color_code || ''}`.trim() || wheel.part_number,
        brand: wheel.brand,
        vehicle: wheel.vehicle,
        years: wheel.years,
        source_url: wheel.source_url,
        width: wheel.specs?.width || null,
        diameter: wheel.specs?.diameter || null,
        wheel_offset: wheel.specs?.offset || null,
        bolt_pattern: wheel.specs?.bolt_pattern || null,
        color_code: wheel.specs?.color_code || null,
        price_usd: wheel.price_usd || null,
        specs_raw: wheel.specs || {},
        raw_data: wheel,
        scraped_at: new Date().toISOString()
    }));

    // Dedupe by part_number + brand (keep first occurrence)
    const seen = new Set();
    const uniqueRecords = records.filter(r => {
        const key = `${r.part_number}|${r.brand}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`   Unique records after dedup: ${uniqueRecords.length}`);

    if (dryRun) {
        console.log('   🏃 Dry run - would insert:');
        console.log(JSON.stringify(uniqueRecords[0], null, 2));
        return { inserted: uniqueRecords.length, updated: 0, errors: 0 };
    }

    // Upsert in batches of 50
    const BATCH_SIZE = 50;
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < uniqueRecords.length; i += BATCH_SIZE) {
        const batch = uniqueRecords.slice(i, i + BATCH_SIZE);

        const { data: result, error } = await supabase
            .from('nemiga_source')
            .upsert(batch, {
                onConflict: 'part_number,brand',
                ignoreDuplicates: false
            })
            .select();

        if (error) {
            console.error(`   ❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
            errors += batch.length;
        } else {
            inserted += result?.length || batch.length;
            console.log(`   ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueRecords.length / BATCH_SIZE)}: ${batch.length} records`);
        }
    }

    return { inserted, updated, errors };
}

async function main() {
    console.log('🚀 Nemiga → Supabase Importer');
    console.log(`   URL: ${SUPABASE_URL}`);
    if (dryRun) console.log('   Mode: DRY RUN');

    let totalInserted = 0;
    let totalErrors = 0;

    if (importAll) {
        // Find all nemiga_*.json files in ./data/
        const dataDir = './data';
        const files = fs.readdirSync(dataDir)
            .filter(f => f.startsWith('nemiga_') && f.endsWith('.json'))
            .map(f => path.join(dataDir, f));

        console.log(`\n📁 Found ${files.length} files to import`);

        for (const file of files) {
            const result = await importWheels(file);
            totalInserted += result.inserted;
            totalErrors += result.errors;
        }
    } else if (inputFile) {
        const result = await importWheels(inputFile);
        totalInserted = result.inserted;
        totalErrors = result.errors;
    } else {
        console.error('❌ Please specify a JSON file or use --all');
        console.error('   Usage: node scripts/import_nemiga_to_supabase.mjs ./data/nemiga_audi_wheels.json');
        process.exit(1);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Import complete!`);
    console.log(`   Inserted/Updated: ${totalInserted}`);
    console.log(`   Errors: ${totalErrors}`);
}

main().catch(console.error);
