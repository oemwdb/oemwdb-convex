#!/usr/bin/env node
/**
 * Nemigaparts.com ETKA Wheel Scraper
 * 
 * Scrapes OEM wheel data from the ETKA online catalog.
 * Outputs JSON ready for OEMWDB import.
 * 
 * Usage:
 *   node scripts/scrape_nemiga_wheels.mjs --brand audi --model a4
 *   node scripts/scrape_nemiga_wheels.mjs --brand audi --list-models
 */

import https from 'https';
import fs from 'fs';

const BASE_URL = 'https://nemigaparts.com';
const DELAY_MS = 1000; // 1 second between requests - be polite

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
const outputFile = getArg('output') || `./data/nemiga_${brand}_wheels.json`;

// Utility: fetch URL with delay
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

// Utility: delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse models list from brand page
function parseModels(html) {
    const models = [];
    // Match model links: https://nemigaparts.com/cat_spares/etka/audi/a4/
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

// Parse modifications (year ranges) from model page
function parseModifications(html) {
    const mods = [];
    // Split by table rows and extract mod ID + years
    const rows = html.split(/<tr[^>]*>/i);

    for (const row of rows) {
        // Look for modification link with numeric ID
        const modMatch = row.match(/href="https:\/\/nemigaparts\.com\/cat_spares\/etka\/[^/]+\/[^/]+\/(\d+)\//);
        if (!modMatch) continue;

        const modId = modMatch[1];

        // Look for year range pattern
        const yearMatch = row.match(/(\d{4})\s*-\s*(\d{4})/);
        const years = yearMatch ? `${yearMatch[1]} - ${yearMatch[2]}` : 'Unknown';

        // Avoid duplicates
        if (!mods.find(m => m.id === modId)) {
            mods.push({ id: modId, years });
        }
    }

    return mods;
}

// Parse wheel subgroups from group 6 page
function parseWheelSubgroups(html) {
    const subgroups = [];
    // Match: https://nemigaparts.com/cat_spares/etka/audi/a4/849/601600/
    const regex = /href="https:\/\/nemigaparts\.com\/cat_spares\/etka\/[^"]+\/(\d{6})\/"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const id = match[1];
        // Only include wheel-related subgroups (601XXX)
        if (id.startsWith('601') && !subgroups.find(s => s.id === id)) {
            const code = `601-${id.slice(3, 6).replace(/^0+/, '') || '0'}`;
            subgroups.push({ id, code });
        }
    }
    return subgroups;
}

// Parse wheel data from a subgroup page
function parseWheels(html, context) {
    const wheels = [];

    // Extract table rows with wheel data
    // Pattern: part number, specs (size, ET, bolt pattern, color), price

    // Find all part numbers first
    const partNumberRegex = /href="[^"]*\/part\/([^/]+)\/"[^>]*>\s*([0-9A-Z]{3})\s*&nbsp;(\d{3})\s*&nbsp;(\d{3})\s*&nbsp;([A-Z]?)\s*&nbsp;/g;
    let match;
    const partNumbers = [];

    while ((match = partNumberRegex.exec(html)) !== null) {
        const pn = `${match[2]} ${match[3]} ${match[4]}${match[5] ? ' ' + match[5] : ''}`.trim();
        if (!partNumbers.includes(pn)) {
            partNumbers.push(pn);
        }
    }

    // Extract specs for each wheel row
    // Format: 7  JX16H2 ET35<br/>5/112<br/>8Z8
    const specsRegex = /(\d+)\s*JX?(\d+)H?\d?\s+ET(\d+)<br\/>(\d\/\d+)<br\/>([A-Z0-9]+)/g;
    const specs = [];
    while ((match = specsRegex.exec(html)) !== null) {
        specs.push({
            width: match[1],
            diameter: match[2],
            offset: match[3],
            boltPattern: match[4],
            colorCode: match[5]
        });
    }

    // Extract prices
    const priceRegex = /style="color: green;"[^>]*>(\d+\.\d+)</g;
    const prices = [];
    while ((match = priceRegex.exec(html)) !== null) {
        prices.push(parseFloat(match[1]));
    }

    // Combine into wheel objects
    // Each unique part number is a wheel
    const seen = new Set();

    for (let i = 0; i < partNumbers.length; i++) {
        const pn = partNumbers[i];
        if (seen.has(pn)) continue;
        seen.add(pn);

        const spec = specs[i] || specs[0] || {};
        const price = prices[i];

        // Skip non-wheel parts (hub caps, bolts, etc - usually under $100)
        if (price && price < 100) continue;

        // Only include actual wheels (part numbers ending in 025, 601, etc)
        if (!pn.includes('601 025') && !pn.includes('601 025') &&
            !pn.match(/\d{3} 601 \d{3}/)) {
            // Check if it's an actual wheel by specs
            if (!spec.diameter) continue;
        }

        wheels.push({
            part_number: pn,
            brand: context.brand,
            vehicle: context.vehicle,
            years: context.years,
            specs: {
                width: spec.width ? `${spec.width}J` : null,
                diameter: spec.diameter ? `${spec.diameter}"` : null,
                offset: spec.offset ? `ET${spec.offset}` : null,
                bolt_pattern: spec.boltPattern ? spec.boltPattern.replace('/', 'x') : null,
                color_code: spec.colorCode || null
            },
            price_usd: price || null,
            source_url: context.url
        });
    }

    return wheels;
}

// Alternative parser - more aggressive
function parseWheelsAggressive(html, context) {
    const wheels = [];

    // Split by table rows and look for wheel-like content
    const rows = html.split(/<tr[^>]*>/i);

    for (const row of rows) {
        // Look for part number pattern: 8W0&nbsp;601&nbsp;025&nbsp;A&nbsp;
        const pnMatch = row.match(/([0-9A-Z]{3})\s*&nbsp;(\d{3})\s*&nbsp;(\d{3})\s*&nbsp;([A-Z]?)\s*&nbsp;/);
        if (!pnMatch) continue;

        const partNumber = `${pnMatch[1]} ${pnMatch[2]} ${pnMatch[3]}${pnMatch[4] ? ' ' + pnMatch[4] : ''}`.trim();

        // Look for wheel specs pattern: "6  JX15H2 ET45" or "7 JX16H2 ET35"
        const specMatch = row.match(/(\d+)\s+JX?(\d+)H?\d?\s+ET(\d+)/i);
        // Bolt pattern: 5/112
        const boltMatch = row.match(/(\d)\/(\d{3})/);
        // Color code after second <br/>
        const colorMatch = row.match(/ET\d+<br\/>[\d\/]+<br\/>([A-Z0-9]{2,4})</i);
        // Price
        const priceMatch = row.match(/color:\s*green[^>]*>(\d+\.\d+)</);

        const price = priceMatch ? parseFloat(priceMatch[1]) : null;

        // Skip cheap parts (not wheels - hub caps are usually < $50)
        if (price && price < 50) continue;

        wheels.push({
            part_number: partNumber,
            brand: context.brand,
            vehicle: context.vehicle,
            years: context.years,
            specs: {
                width: specMatch ? `${specMatch[1]}J` : null,
                diameter: specMatch ? `${specMatch[2]}"` : null,
                offset: specMatch ? `ET${specMatch[3]}` : null,
                bolt_pattern: boltMatch ? `${boltMatch[1]}x${boltMatch[2]}` : null,
                color_code: colorMatch ? colorMatch[1] : null
            },
            price_usd: price,
            source_url: context.url
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

// Main scraper function
async function scrapeWheels() {
    console.log(`\n🔧 Nemigaparts ETKA Wheel Scraper`);
    console.log(`   Brand: ${brand}`);

    const allWheels = [];

    // Step 1: Get brand page to list models
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

    // Filter to specific model if requested
    const targetModels = model
        ? models.filter(m => m.slug.toLowerCase() === model.toLowerCase())
        : models.slice(0, 3); // Default: first 3 models for testing

    if (model && targetModels.length === 0) {
        console.error(`\n❌ Model "${model}" not found. Use --list-models to see available models.`);
        return;
    }

    console.log(`\n🚗 Scraping ${targetModels.length} model(s)...`);

    for (const targetModel of targetModels) {
        console.log(`\n━━━ ${targetModel.name} (${targetModel.slug}) ━━━`);

        await delay(DELAY_MS);

        // Step 2: Get model page to list modifications (year ranges)
        const modelUrl = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/`;
        const modelHtml = await fetchPage(modelUrl);
        const mods = parseModifications(modelHtml);

        console.log(`   Found ${mods.length} year range(s)`);

        for (const mod of mods.slice(-2).reverse()) { // Start with NEWEST year ranges
            console.log(`\n   📅 ${mod.years}`);

            await delay(DELAY_MS);

            // Step 3: Get group 6 (wheels/brakes) page
            const group6Url = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/${mod.id}/6/`;
            const group6Html = await fetchPage(group6Url);
            const subgroups = parseWheelSubgroups(group6Html);

            // Use all wheel subgroups - they're already filtered to 601XXX in parseWheelSubgroups
            const wheelSubgroups = subgroups;

            console.log(`      Found ${wheelSubgroups.length} wheel subgroup(s)`);

            for (const subgroup of wheelSubgroups) {
                await delay(DELAY_MS);

                // Step 4: Get subgroup page with actual wheel data
                const subgroupUrl = `${BASE_URL}/cat_spares/etka/${brand}/${targetModel.slug}/${mod.id}/${subgroup.id}/`;
                const subgroupHtml = await fetchPage(subgroupUrl);

                const context = {
                    brand: brand,
                    vehicle: targetModel.name,
                    years: mod.years,
                    url: subgroupUrl
                };

                // Try both parsers
                let wheels = parseWheels(subgroupHtml, context);
                if (wheels.length === 0) {
                    wheels = parseWheelsAggressive(subgroupHtml, context);
                }

                if (wheels.length > 0) {
                    console.log(`      ✓ ${subgroup.code}: ${wheels.length} wheel(s)`);
                    allWheels.push(...wheels);
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
    console.log(`✅ Total unique wheels found: ${uniqueWheels.length}`);

    // Save to file
    const outputDir = './data';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(uniqueWheels, null, 2));
    console.log(`💾 Saved to: ${outputFile}`);

    // Show sample
    if (uniqueWheels.length > 0) {
        console.log(`\n📋 Sample wheel data:`);
        console.log(JSON.stringify(uniqueWheels[0], null, 2));
    }
}

// Run
scrapeWheels().catch(console.error);
