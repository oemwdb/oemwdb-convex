#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SNAPSHOT_ZIP = process.env.MINI_DUPLICATE_SNAPSHOT_ZIP || "/tmp/convex-export-mini-jcw-post.zip";
const TODAY = new Date().toISOString().slice(0, 10);
const REPORT_PATH = path.resolve(process.cwd(), "reports", `mini-duplicate-audit-${TODAY}.md`);

if (!fs.existsSync(SNAPSHOT_ZIP)) {
  console.error(`Snapshot not found: ${SNAPSHOT_ZIP}`);
  process.exit(1);
}

function load(member) {
  const raw = execFileSync("unzip", ["-p", SNAPSHOT_ZIP, member], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 64,
  });
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function simplifyWheelId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-wheels(?:-wheels)+$/g, "-wheels")
    .replace(
      /-(silver|black|grey|gray|white|chrome|jet-black|midnight-black|frozen-black|gloss-black)(?=-wheels$)/g,
      ""
    );
}

function splitPartNumbers(value) {
  return String(value || "")
    .split(/[,\s;|/]+/)
    .map((part) => part.trim())
    .filter((part) => /^36[0-9A-Z]+$/i.test(part));
}

function groupBy(rows, keyFn) {
  const out = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const list = out.get(key) || [];
    list.push(row);
    out.set(key, list);
  }
  return out;
}

function topGroups(groups, limit, vehicleLinkCount, variantCount) {
  return [...groups.entries()]
    .filter(([, rows]) => rows.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, limit)
    .map(([key, rows]) => ({
      key,
      count: rows.length,
      rows: rows.slice(0, 8).map((row) => ({
        id: row.id,
        title: row.wheel_title,
        part_numbers: row.part_numbers || "",
        links: vehicleLinkCount.get(row._id) || 0,
        variants: variantCount.get(row._id) || 0,
      })),
    }));
}

const wheels = load("oem_wheels/documents.jsonl");
const brands = load("oem_brands/documents.jsonl");
const wheelBrands = load("j_wheel_brand/documents.jsonl");
const wheelVehicles = load("j_wheel_vehicle/documents.jsonl");
const wheelVariants = load("oem_wheel_variants/documents.jsonl");

const miniBrand = brands.find((brand) => String(brand.brand_title || "").toLowerCase() === "mini");
if (!miniBrand) {
  console.error("Mini brand not found in snapshot");
  process.exit(1);
}

const miniWheelIds = new Set(
  wheelBrands.filter((row) => row.brand_id === miniBrand._id).map((row) => row.wheel_id)
);
const miniWheels = wheels.filter((wheel) => miniWheelIds.has(wheel._id));

const vehicleLinkCount = new Map();
for (const row of wheelVehicles) {
  vehicleLinkCount.set(row.wheel_id, (vehicleLinkCount.get(row.wheel_id) || 0) + 1);
}

const variantCount = new Map();
for (const row of wheelVariants) {
  variantCount.set(row.wheel_id, (variantCount.get(row.wheel_id) || 0) + 1);
}

const exactBusinessIdGroups = groupBy(miniWheels, (row) => String(row.id || "").trim());
const simplifiedIdGroups = groupBy(miniWheels, (row) => simplifyWheelId(row.id || row.slug || row.wheel_title));

const partNumberGroups = new Map();
for (const row of miniWheels) {
  for (const partNumber of splitPartNumbers(row.part_numbers)) {
    const list = partNumberGroups.get(partNumber) || [];
    list.push(row);
    partNumberGroups.set(partNumber, list);
  }
}

const exactBusinessIdGroupList = [...exactBusinessIdGroups.entries()].filter(([, rows]) => rows.length > 1);
const simplifiedIdGroupList = [...simplifiedIdGroups.entries()].filter(([, rows]) => rows.length > 1);
const duplicatePartNumberList = [...partNumberGroups.entries()].filter(([, rows]) => rows.length > 1);

const hashedLegacyRows = miniWheels.filter((row) => /^[a-f0-9]{32}$/i.test(String(row.id || "")));
const bmwMiniShadowRows = miniWheels.filter((row) => String(row.id || "").startsWith("bmw_mini-"));
const suffixWheelsRows = miniWheels.filter((row) => /-wheels-wheels$/.test(String(row.id || "")));
const wheelsWithNoVehicleLinks = miniWheels.filter((row) => (vehicleLinkCount.get(row._id) || 0) === 0);
const wheelsWithNoVariants = miniWheels.filter((row) => (variantCount.get(row._id) || 0) === 0);
const likelyCanonicalRows = miniWheels.filter(
  (row) =>
    !String(row.id || "").startsWith("bmw_mini-") &&
    !/^[a-f0-9]{32}$/i.test(String(row.id || "")) &&
    !/-wheels-wheels$/.test(String(row.id || ""))
);

const topExact = topGroups(exactBusinessIdGroups, 20, vehicleLinkCount, variantCount);
const topSimplified = topGroups(simplifiedIdGroups, 20, vehicleLinkCount, variantCount);
const topPartNumbers = [...duplicatePartNumberList]
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20)
  .map(([key, rows]) => ({
    key,
    count: rows.length,
    rows: rows.slice(0, 8).map((row) => ({
      id: row.id,
      title: row.wheel_title,
      part_numbers: row.part_numbers || "",
      links: vehicleLinkCount.get(row._id) || 0,
      variants: variantCount.get(row._id) || 0,
    })),
  }));

function renderGroup(group) {
  const rows = group.rows
    .map(
      (row) =>
        `  - \`${row.id}\` | ${row.title} | pn: ${row.part_numbers || "None"} | links: ${row.links} | variants: ${row.variants}`
    )
    .join("\n");
  return `- \`${group.key}\` (${group.count})\n${rows}`;
}

const report = `# MINI Duplicate Audit

Date: ${new Date().toISOString()}
Snapshot: \`${SNAPSHOT_ZIP}\`

## Summary

- MINI wheel rows: ${miniWheels.length}
- Likely canonical rows: ${likelyCanonicalRows.length}
- Exact duplicate business-id groups: ${exactBusinessIdGroupList.length}
- Exact duplicate business-id rows: ${exactBusinessIdGroupList.reduce((sum, [, rows]) => sum + rows.length, 0)}
- Simplified duplicate groups: ${simplifiedIdGroupList.length}
- Duplicate part-number groups: ${duplicatePartNumberList.length}
- \`-wheels-wheels\` suffix rows: ${suffixWheelsRows.length}
- Hashed legacy rows: ${hashedLegacyRows.length}
- \`bmw_mini-*\` shadow rows: ${bmwMiniShadowRows.length}
- Rows with zero vehicle links: ${wheelsWithNoVehicleLinks.length}
- Rows with zero wheel variants: ${wheelsWithNoVariants.length}

## What The Duplicate Problem Actually Is

- Exact cloned rows exist in production with the same business \`id\` repeated multiple times.
- Canonical MINI rows are often shadowed by a \`-wheels-wheels\` sibling plus one or more hashed legacy imports.
- BMW/MINI part-number shadow rows (\`bmw_mini-*\`) duplicate canonical MINI rows and often carry the same part-number set.
- Some part numbers are shared across multiple named wheel rows, which means duplicate cleanup cannot be done by part number alone.

## Highest-Risk Exact Duplicate Clusters

${topExact.map(renderGroup).join("\n\n")}

## Highest-Risk Simplified ID Clusters

${topSimplified.map(renderGroup).join("\n\n")}

## Highest-Risk Part Number Collisions

${topPartNumbers.map(renderGroup).join("\n\n")}

## Recommended Non-Destructive Cleanup Controls

- Add \`canonical_wheel_id\` plus \`duplicate_of_wheel_id\` or a dedicated wheel-alias junction.
  This lets us collapse hashed rows, \`bmw_mini-*\` shadow rows, and \`-wheels-wheels\` suffix rows without deleting source history.
- Add a row state like \`record_status\` or \`visibility_status\`.
  We need to suppress shadow rows from user-facing queries while preserving them for provenance and rollback.
- Add provenance fields: \`source_system\`, \`source_record_id\`, \`source_url\`, and \`verification_status\`.
  The current duplicate classes line up almost exactly with source origin, but that distinction is not modeled.
- Add a canonical-part-number junction or supersession model.
  Some apparent duplicates are really multi-part-number style rows or superseded part-number rows, so normalization needs first-class part-number relationships.

## Practical Next Step

- Build a MINI wheel dedupe pass that marks canonical rows and suppresses shadow rows in queries, without deleting any records.
`;

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report, "utf8");

console.log(
  JSON.stringify(
    {
      reportPath: REPORT_PATH,
      summary: {
        miniWheels: miniWheels.length,
        likelyCanonicalRows: likelyCanonicalRows.length,
        exactDuplicateBusinessIdGroups: exactBusinessIdGroupList.length,
        exactDuplicateBusinessIdRows: exactBusinessIdGroupList.reduce((sum, [, rows]) => sum + rows.length, 0),
        simplifiedDuplicateGroups: simplifiedIdGroupList.length,
        duplicatePartNumberGroups: duplicatePartNumberList.length,
        suffixWheelsWheelsRows: suffixWheelsRows.length,
        hashedLegacyRows: hashedLegacyRows.length,
        bmwMiniShadowRows: bmwMiniShadowRows.length,
        wheelsWithNoVehicleLinks: wheelsWithNoVehicleLinks.length,
        wheelsWithNoVariants: wheelsWithNoVariants.length,
      },
    },
    null,
    2
  )
);
