#!/usr/bin/env node
/**
 * Nemigaparts.com ETKA Wheel Scraper v2
 * 
 * IMPROVED: Only scrapes actual alloy wheels, filters out:
 * - Tires (601 3XX patterns)
 * - Wheel bolts (698 139 patterns)  
 * - Hub caps, valve caps, accessories
 * - Steel spare wheels (optional)
 * 
 * Usage:
 *   node scripts/scrape_nemiga_wheels_v2.mjs --brand audi --model a4
 *   node scripts/scrape_nemiga_wheels_v2.mjs --brand audi --list-models
 *   node scripts/scrape_nemiga_wheels_v2.mjs --brand audi --model a4 --include-spares
 */

import https from 'https';
import fs from 'fs';

const BASE_URL = 'https://nemigaparts.com';
const DELAY_MS = 1000; // 1 second between requests

// Parse command line args
const args = process.argv.slice(2);
const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const brand = getArg('brand') || 'audi';
const model = getArg('model');
const listModels = hasFlag('list-models');
const includeSpares = hasFlag('include-spares');
const outputFile = getArg('output') || `./data/nemiga_${brand}_wheels_v2.json`;

// ============================================
// PART NUMBER FILTERS - Based on learnings
// ============================================

// Part numbers that are NOT wheels (bolts, caps, tires, etc.)
const EXCLUDE_PATTERNS = [
    /698 139/,        // Wheel bolts/locks
    /698 138/,        // Wheel bolts
    /601 147/,        // Hub caps
    /601 149/,        // Hub caps
    /601 170/,        // Hub caps
    /601 171/,        // Hub caps
    /601 308/,        // Tires
    /601 309/,        // Tires
    /601 310/,        // Tires
    /601 311/,        // Tires
    /601 312/,        // Tires
    /601 313/,        // Tires
    /601 361/,        // Center caps
    /601 165/,        // Valve caps
    /601 173/,        // Valve extensions
    /601 139/,        // Wheel bolts
    /601 027/,        // Space saver (steel) - exclude unless --include-spares
];

// Subgroups that contain actual alloy wheels
const ALLOY_WHEEL_SUBGROUPS = [
    '601600',  // Aluminium rim
    '601700',  // Alloy wheels
    '601800',  // Light alloy wheels
    '601950',  // Accessory wheels
];

// Subgroups to skip (not alloy wheels)
const SKIP_SUBGROUPS = [
    '601100',  // Steel rim / spare wheel (unless --include-spares)
    '601120',  // Spare wheel carrier
    '601200',  // Wheel bolts
    '601300',  // Tires
    '601400',  // Tire pressure
    '601500',  // Older steel wheels
];

function isActualWheel(partNumber, specs, price) {
    // Check exclusion patterns first - these are DEFINITELY not wheels
    for (const pattern of EXCLUDE_PATTERNS) {
        if (pattern.test(partNumber)) {
            // Space savers only if --include-spares
            if (partNumber.includes('601 027') && includeSpares) {
                continue;
            }
            return false;
        }
    }

    // KNOWN wheel patterns - always include
    const definiteWheelPattern = /\d{3} 601 0(10|25|26)/;
    if (definiteWheelPattern.test(partNumber)) {
        return true;
    }

    // Has specs = looks like a wheel
    if (specs && specs.diameter) {
        // But filter out cheap items (caps, bolts are usually < $50)
        if (price && price < 50) return false;
        return true;
    }

    // No specs, no pattern match - could still be a wheel
    // If price is > $100, probably a wheel
    if (price && price > 100) {
        return true;
    }

    // No price, no specs, but in an alloy wheel subgroup - include it
    // The scraper only gets here from 601600+ subgroups anyway
    return true;
}

function shouldScrapeSubgroup(subgroupId) {
    // Always scrape alloy wheel subgroups
    if (ALLOY_WHEEL_SUBGROUPS.includes(subgroupId)) {
        return true;
    }

    // Skip known non-wheel subgroups (unless including spares)
    if (SKIP_SUBGROUPS.includes(subgroupId)) {
        return includeSpares && subgroupId === '601100';
    }

    // Scrape anything else that starts with 601
    return subgroupId.startsWith('601');
}

// ============================================
// FETCH UTILITIES
// ============================================

async function fetchPage(url) {
    return new Promise((resolve, reject) => {
        console.log(`  Fetching: ${url}`);

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// PARSERS
// ============================================

function parseModels(html) {
    const models = [];
    const regex = /href="https:\/\/nemigaparts\.com\/cat_spares\/etka\/[^/]+\/([^/]+)\/"[^>]*>([^<]+)</g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const slug = match[1];
        const name = match[2].trim();
        if (!models.find(m => m.slug === slug)) {
            models.push({ slug, name });
        }
    }
    return models;
}

function parseModifications(html) {
    const mods = [];
    const rows = html.split(/<tr[^>]*>/i);

    for (const row of rows) {
        const modMatch = row.match(/href="https:\/\/nemigaparts\.com\/cat_spares\/etka\/[^/]+\/[^/]+\/(\d+)\//);
        if (!modMatch) continue;

        const modId = modMatch[1];
        const yearMatch = row.match(/(\d{4})\s*-\s*(\d{4})/);
        const years = yearMatch ? `${yearMatch[1]} - ${yearMatch[2]}` : 'Unknown';

        if (!mods.find(m => m.id === modId)) {
            mods.push({ id: modId, years });
        }
    }

    return mods;
}

function parseWheelSubgroups(html) {
    const subgroups = [];
    const regex = /href="https:\/\/nemigaparts\.com\/cat_spares\/etka\/[^"]+\/(\d{6})\/"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const id = match[1];
        if (id.startsWith('601') && !subgroups.find(s => s.id === id)) {
            const code = `601-${id.slice(3, 6).replace(/^0+/, '') || '0'}`;
            subgroups.push({ id, code });
        }
    }
    return subgroups;
}

function parseWheels(html, context) {
    const wheels = [];
    const rows = html.split(/<tr[^>]*>/i);

    for (const row of rows) {
        // Part number pattern: 8W0&nbsp;601&nbsp;025&nbsp;A&nbsp;
        const pnMatch = row.match(/([0-9A-Z]{3})\s*&nbsp;(\d{3})\s*&nbsp;(\d{3})\s*&nbsp;([A-Z]?)\s*&nbsp;/);
        if (!pnMatch) continue;

        const partNumber = `${pnMatch[1]} ${pnMatch[2]} ${pnMatch[3]}${pnMatch[4] ? ' ' + pnMatch[4] : ''}`.trim();

        // Wheel specs: "7  JX16H2 ET35"
        const specMatch = row.match(/(\d+)\s+JX?(\d+)H?\d?\s+ET(\d+)/i);
        const boltMatch = row.match(/(\d)\/(\d{3})/);
        const colorMatch = row.match(/ET\d+<br\/>[\d\/]+<br\/>([A-Z0-9]{2,4})</i);
        const priceMatch = row.match(/color:\s*green[^>]*>(\d+\.\d+)</);

        const price = priceMatch ? parseFloat(priceMatch[1]) : null;

        const specs = {
            width: specMatch ? `${specMatch[1]}J` : null,
            diameter: specMatch ? `${specMatch[2]}"` : null,
            offset: specMatch ? `ET${specMatch[3]}` : null,
            bolt_pattern: boltMatch ? `${boltMatch[1]}x${boltMatch[2]}` : null,
            color_code: colorMatch ? colorMatch[1] : null
        };

        // Apply wheel filter
        if (!isActualWheel(partNumber, specs, price)) {
            continue;
        }

        wheels.push({
            part_number: partNumber,
            brand: context.brand,
            vehicle: context.vehicle,
            years: context.years,
            specs,
            price_usd: price,
            source_url: context.url,
            wheel_type: specMatch ? 'alloy' : 'unknown'
        });
    }

    // Dedupe by part number
    const seen = new Set();
    return wheels.filter(w => {
        if (seen.has(w.part_number)) return false;
        seen.add(w.part_number);
        return true;
    });
}

// ============================================
// MAIN SCRAPER
// ============================================

async function scrapeWheels() {
    console.log(`\n🔧 Nemigaparts ETKA Wheel Scraper v2`);
    console.log(`   Brand: ${brand}`);
    console.log(`   Mode: ${includeSpares ? 'All wheels (including spares)' : 'Alloy wheels only'}`);

    const allWheels = [];

    // Step 1: Get brand page
    const brandUrl = `${BASE_URL}/cat_spares/etka/${brand}/`;
    console.log(`\n📦 Fetching brand page...`);
    const brandHtml = await fetchPage(brandUrl);
    const models = parseModels(brandHtml);

    console.log(`   Found ${models.length} models`);

    if (listModels) {
        console.log('\n📋 Available models:');
        models.forEach(m => console.log(`   - ${m.slug}: ${m.name}`));
        return;
    }

    const targetModels = model
        ? models.filter(m => m.slug.toLowerCase() === model.toLowerCase())
        : models; // Scrape ALL models when none specified

    if (model && targetModels.length === 0) {
        console.error(`\n❌ Model "${model}" not found. Use --list-models to see available models.`);
        return;
    }

    console.log(`\n🚗 Scraping ${targetModels.length} model(s)...`);

    for (const targetModel of targetModels) {
        console.log(`\n━━━ ${targetModel.name} (${targetModel.slug}) ━━━`);

        await delay(DELAY_MS);

        const modelUrl = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/`;
        const modelHtml = await fetchPage(modelUrl);
        const mods = parseModifications(modelHtml);

        console.log(`   Found ${mods.length} year range(s)`);

        for (const mod of mods.slice(-3).reverse()) { // Last 3 years, newest first
            console.log(`\n   📅 ${mod.years}`);

            await delay(DELAY_MS);

            const group6Url = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/${mod.id}/6/`;
            const group6Html = await fetchPage(group6Url);
            const subgroups = parseWheelSubgroups(group6Html);

            // Filter to alloy wheel subgroups only
            const wheelSubgroups = subgroups.filter(s => shouldScrapeSubgroup(s.id));

            console.log(`      Found ${wheelSubgroups.length} wheel subgroup(s)`);

            for (const subgroup of wheelSubgroups) {
                await delay(DELAY_MS);

                const subgroupUrl = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/${mod.id}/${subgroup.id}/`;
                const subgroupHtml = await fetchPage(subgroupUrl);

                const context = {
                    brand,
                    vehicle: targetModel.name,
                    years: mod.years,
                    url: subgroupUrl
                };

                const wheels = parseWheels(subgroupHtml, context);

                if (wheels.length > 0) {
                    console.log(`      ✓ ${subgroup.code}: ${wheels.length} wheel(s)`);
                    allWheels.push(...wheels);
                } else {
                    console.log(`      · ${subgroup.code}: 0 (filtered)`);
                }
            }
        }
    }

    // Dedupe final results
    const seen = new Set();
    const uniqueWheels = allWheels.filter(w => {
        const key = `${w.part_number}-${w.vehicle}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Total unique ALLOY wheels found: ${uniqueWheels.length}`);

    // Save
    const outputDir = './data';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(uniqueWheels, null, 2));
    console.log(`💾 Saved to: ${outputFile}`);

    if (uniqueWheels.length > 0) {
        console.log(`\n📋 Sample wheel:`);
        console.log(JSON.stringify(uniqueWheels[0], null, 2));
    }

    // Stats
    const withSpecs = uniqueWheels.filter(w => w.specs.diameter).length;
    const withPrice = uniqueWheels.filter(w => w.price_usd).length;
    console.log(`\n📊 Stats:`);
    console.log(`   With full specs: ${withSpecs}/${uniqueWheels.length} (${Math.round(100 * withSpecs / uniqueWheels.length)}%)`);
    console.log(`   With price: ${withPrice}/${uniqueWheels.length} (${Math.round(100 * withPrice / uniqueWheels.length)}%)`);
}

scrapeWheels().catch(console.error);
