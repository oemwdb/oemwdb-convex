#!/usr/bin/env node

import { config } from "dotenv";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const CONVEX_URL = (process.env.VITE_CONVEX_URL || "").replace(/\/$/, "");
const SNAPSHOT_ZIP = process.env.MINI_JCW_SNAPSHOT_ZIP || "/tmp/convex-export-mini-jcw-pre.zip";
const APPLY = process.argv.includes("--apply");
const TODAY = new Date().toISOString().slice(0, 10);
const REPORT_PATH = path.resolve(process.cwd(), "reports", `mini-jcw-report-${TODAY}.md`);

const TARGETS = [
  ["mini-1041-double-spoke-jcw-wheels", "jcw-1041-double-spoke-wheels"],
  ["mini-r95-star-spoke-jcw-wheels", "jcw-r95-star-spoke-wheels"],
  ["mini-563-cup-spoke-jcw-wheels", "jcw-563-cup-spoke-wheels"],
  ["mini-501-track-spoke-silver-jcw-wheels", "jcw-501-track-spoke-wheels"],
  ["mini-534-double-spoke-jcw-wheels", "jcw-534-double-spoke-wheels"],
  ["mini-901-spoke-jcw-wheels", "jcw-901-spoke-wheels"],
  ["mini-991-star-spoke-jcw-wheels", "jcw-991-star-spoke-wheels"],
  ["mini-510-double-spoke-jcw-wheels", "jcw-510-double-spoke-wheels"],
  ["mini-902-circuit-spoke-jcw-wheels", "jcw-902-circuit-spoke-wheels"],
  ["mini-562-track-spoke-jcw-wheels", "jcw-562-track-spoke-wheels"],
  ["mini-506-cross-spoke-jcw-wheels", "jcw-506-cross-spoke-wheels"],
  ["mini-962-star-spoke-jcw-wheels", "jcw-962-star-spoke-wheels"],
  ["mini-498-race-spoke-jcw-wheels", "jcw-498-race-spoke-wheels"],
  ["mini-949-flag-spoke-jcw-wheels", "jcw-949-flag-spoke-wheels"],
  ["mini-r112-cross-spoke-challenge-wheels", "jcw-r112-cross-spoke-challenge-wheels"],
  ["mini-509-cup-spoke-jcw-wheels", "jcw-509-cup-spoke-wheels"],
  ["mini-986-lap-spoke-jcw-wheels", "jcw-986-lap-spoke-wheels"],
  ["mini-945-y-spoke-jcw-wheels", "jcw-945-y-spoke-wheels"],
  ["mini-r107-gp-wheels-wheels", "jcw-r107-gp-wheels"],
  ["mini-957-sprint-spoke-jcw-wheels", "jcw-957-sprint-spoke-wheels"],
  ["mini-992-rallye-spoke-jcw-wheels", "jcw-992-rallye-spoke-wheels"],
  ["mini-989-lap-spoke-jcw-wheels", "jcw-989-lap-spoke-wheels"],
];

if (!CONVEX_URL) {
  console.error("Missing VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(text) {
  return decodeHtml(String(text || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueSorted(values, sorter = undefined) {
  const out = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
  return sorter ? out.sort(sorter) : out.sort();
}

function sortNumericLabels(a, b) {
  const aNum = parseFloat(String(a));
  const bNum = parseFloat(String(b));
  if (Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }
  return String(a).localeCompare(String(b));
}

function formatDecimal(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (Number.isInteger(n)) return String(n);
  return String(n).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function formatParentDiameter(value) {
  return `${formatDecimal(value)} inch`;
}

function formatParentWidth(value) {
  const n = Number(value);
  return `${n.toFixed(1)}J`;
}

function formatParentOffset(value) {
  return `ET${formatDecimal(value)}`;
}

function formatParentBoltPattern(lugs, pcd) {
  return `${lugs} x ${formatDecimal(pcd)}`;
}

function inferCenterBoreLabel(boltPattern) {
  if (boltPattern === "4x100") return "56.1mm";
  if (boltPattern === "5x120") return "72.6mm";
  if (boltPattern === "5x112") return "66.6mm";
  return "";
}

function readJsonLinesFromZip(member) {
  if (!fs.existsSync(SNAPSHOT_ZIP)) return [];
  try {
    const raw = execFileSync("unzip", ["-p", SNAPSHOT_ZIP, member], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 64,
    });
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

async function convexQuery(pathName, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathName, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.errorMessage || `Convex query failed: ${pathName}`);
  }
  return json.value;
}

async function convexMutation(pathName, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathName, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.errorMessage || `Convex mutation failed: ${pathName}`);
  }
  return json.value;
}

function extractImageUrl(html) {
  return html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || "";
}

function extractSpecsMap(html) {
  const out = new Map();
  for (const match of html.matchAll(
    /ProductSingle__specs-item--label">\s*([^<]+?)\s*<\/span>[\s\S]{0,240}?ProductSingle__specs-item--value">\s*([\s\S]*?)\s*<\/span>/gi
  )) {
    out.set(stripTags(match[1]), stripTags(match[2]));
  }
  return out;
}

function parseVariantRecords(html) {
  const start = html.indexOf('ProductSpecification__tabs--contents">');
  if (start < 0) return [];
  const end = html.indexOf('<section class="ProductRelated', start);
  const section = html.slice(start, end > start ? end : undefined);
  const tokens = [...section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);

  const variants = [];
  let current = null;

  const flush = () => {
    if (!current?.partNumber) return;
    current.previousPartNumbers = uniqueSorted(current.previousPartNumbers);
    current.manufacturerIds = uniqueSorted(current.manufacturerIds);
    current.statuses = uniqueSorted(current.statuses);
    variants.push(current);
    current = null;
  };

  for (const token of tokens) {
    if (/^Colour:\s*/i.test(token)) {
      flush();
      current = {
        color: token.replace(/^Colour:\s*/i, "").trim(),
        previousPartNumbers: [],
        manufacturerIds: [],
        statuses: [],
      };
      continue;
    }

    current ||= { previousPartNumbers: [], manufacturerIds: [], statuses: [] };

    const sizeMatch = token.match(
      /^(\d+(?:\.\d+)?)Jx(\d+(?:\.\d+)?)\s+ET(-?\d+(?:\.\d+)?)\s+PCD\s+(\d+)x(\d+(?:\.\d+)?)$/i
    );
    if (sizeMatch) {
      current.width = sizeMatch[1];
      current.diameter = sizeMatch[2];
      current.offset = sizeMatch[3];
      current.boltPattern = `${sizeMatch[4]}x${formatDecimal(sizeMatch[5])}`;
      current.lugs = sizeMatch[4];
      current.pcd = formatDecimal(sizeMatch[5]);
      current.centerBore = inferCenterBoreLabel(current.boltPattern);
      continue;
    }

    if (/^P\/N:\s*/i.test(token)) {
      current.partNumber = token.replace(/^P\/N:\s*/i, "").trim();
      continue;
    }
    if (/^Previous P\/N:\s*/i.test(token)) {
      current.previousPartNumbers.push(token.replace(/^Previous P\/N:\s*/i, "").trim());
      continue;
    }
    if (/^Manuf ID:\s*/i.test(token)) {
      current.manufacturerIds.push(token.replace(/^Manuf ID:\s*/i, "").trim());
      continue;
    }
    if (/Available|Discontinued|Unavailable/i.test(token)) {
      current.statuses.push(token);
    }
  }
  flush();

  const byPartNumber = new Map();
  for (const variant of variants) {
    if (!byPartNumber.has(variant.partNumber)) {
      byPartNumber.set(variant.partNumber, variant);
    }
  }
  return [...byPartNumber.values()];
}

async function fetchJcwPage(slug) {
  const url = `https://www.alloywheelsdirect.net/jcw_alloys/${slug}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "follow",
  });
  const html = await res.text();
  if (!res.ok || !html.includes("ProductSingle__specs-item--label")) {
    throw new Error(`Failed to verify ${slug} from AWD`);
  }
  const specs = extractSpecsMap(html);
  const model = specs.get("Model") || "";
  const variants = parseVariantRecords(html);
  if (!variants.length) {
    throw new Error(`No JCW variants parsed for ${slug}`);
  }

  return {
    url: res.url || url,
    imageUrl: extractImageUrl(html),
    model,
    title: `Mini JCW ${model} Wheels`.replace(/\s+/g, " ").trim(),
    variants,
  };
}

function buildNotes(details, corroboratedPartNumbers) {
  const previousPartNumbers = uniqueSorted(
    details.variants.flatMap((variant) => variant.previousPartNumbers || [])
  );
  const statuses = uniqueSorted(details.variants.flatMap((variant) => variant.statuses || []));
  const manufacturerIds = uniqueSorted(
    details.variants.flatMap((variant) => variant.manufacturerIds || [])
  );

  const lines = [
    "Verified from direct JCW Alloy Wheels Direct product page on 2026-03-10. Brand retained under Mini.",
    "Center bore inferred from MINI fitment standard for the verified bolt pattern when the source did not publish it explicitly.",
  ];
  if (corroboratedPartNumbers.length) {
    lines.push(`Workshop/BMW-MINI part-number corroboration: ${corroboratedPartNumbers.join(", ")}.`);
  }
  if (previousPartNumbers.length) {
    lines.push(`Previous part numbers: ${previousPartNumbers.join(", ")}.`);
  }
  if (statuses.length) {
    lines.push(`Availability markers on source page: ${statuses.join(", ")}.`);
  }
  if (manufacturerIds.length) {
    lines.push(`Manufacturer IDs on source page: ${manufacturerIds.join(", ")}.`);
  }
  return lines.join(" ");
}

function buildExistingVariantPartNumbersByWheel(snapshotWheelVariants, snapshotVariantPartNumbers) {
  const wheelIdByVariantId = new Map(snapshotWheelVariants.map((row) => [row._id, row.wheel_id]));
  const out = new Map();
  for (const row of snapshotVariantPartNumbers) {
    const wheelId = wheelIdByVariantId.get(row.variant_id);
    if (!wheelId || !row.part_number) continue;
    const set = out.get(wheelId) || new Set();
    set.add(String(row.part_number).trim());
    out.set(wheelId, set);
  }
  return out;
}

async function getOrCreateRef(kind, value) {
  const pathByKind = {
    diameter: "migrations:getOrCreateDiameter",
    width: "migrations:getOrCreateWidth",
    offset: "migrations:getOrCreateOffset",
    boltPattern: "migrations:getOrCreateBoltPattern",
    centerBore: "migrations:getOrCreateCenterBore",
    color: "migrations:getOrCreateColor",
    partNumber: "migrations:getOrCreatePartNumber",
  };
  return convexMutation(pathByKind[kind], { value });
}

function buildVariantSlug(wheelId, partNumber) {
  return `${wheelId.replace(/-wheels$/, "")}-${String(partNumber).toLowerCase()}`;
}

async function main() {
  console.log(`${APPLY ? "Applying" : "Dry run"} MINI JCW wheel backfill...`);

  const snapshotWheelVariants = readJsonLinesFromZip("oem_wheel_variants/documents.jsonl");
  const snapshotVariantPartNumbers = readJsonLinesFromZip("j_oem_wheel_variant_part_number/documents.jsonl");
  const workshopPartRows = readJsonLinesFromZip("ws_bmw_mini_wheels/documents.jsonl").map((row) =>
    JSON.parse(row.data)
  );
  const workshopPartNumberSet = new Set(
    workshopPartRows.map((row) => String(row.part_number || "").trim()).filter(Boolean)
  );
  const existingVariantPartNumbersByWheel = buildExistingVariantPartNumbersByWheel(
    snapshotWheelVariants,
    snapshotVariantPartNumbers
  );

  const brand = await convexQuery("queries:brandsGetById", { id: "mini" });
  const liveMiniWheels = await convexQuery("queries:wheelsGetByBrand", { brandId: brand._id });
  const wheelById = new Map(liveMiniWheels.map((wheel) => [wheel.id, wheel]));

  const stats = {
    wheelsUpdated: 0,
    wheelVariantsInserted: 0,
    wheelVariantsSkipped: 0,
    currentPartNumbers: 0,
    previousPartNumbers: 0,
    pagesVerified: 0,
  };
  const reportRows = [];

  for (const [wheelBusinessId, jcwSlug] of TARGETS) {
    const wheel = wheelById.get(wheelBusinessId);
    if (!wheel) {
      throw new Error(`Live wheel not found: ${wheelBusinessId}`);
    }

    const details = await fetchJcwPage(jcwSlug);
    stats.pagesVerified += 1;

    const currentPartNumbers = uniqueSorted(details.variants.map((variant) => variant.partNumber));
    const previousPartNumbers = uniqueSorted(
      details.variants.flatMap((variant) => variant.previousPartNumbers || [])
    );
    const allPartNumbers = uniqueSorted([...currentPartNumbers, ...previousPartNumbers]);
    stats.currentPartNumbers += currentPartNumbers.length;
    stats.previousPartNumbers += previousPartNumbers.length;

    const diameters = uniqueSorted(
      details.variants.map((variant) => formatParentDiameter(variant.diameter)),
      sortNumericLabels
    );
    const widths = uniqueSorted(
      details.variants.map((variant) => formatParentWidth(variant.width)),
      sortNumericLabels
    );
    const offsets = uniqueSorted(
      details.variants.map((variant) => formatParentOffset(variant.offset)),
      sortNumericLabels
    );
    const boltPatterns = uniqueSorted(
      details.variants.map((variant) => formatParentBoltPattern(variant.lugs, variant.pcd)),
      sortNumericLabels
    );
    const centerBores = uniqueSorted(
      details.variants.map((variant) => variant.centerBore).filter(Boolean),
      sortNumericLabels
    );
    const colors = uniqueSorted(details.variants.map((variant) => variant.color));
    const corroboratedPartNumbers = currentPartNumbers.filter((partNumber) =>
      workshopPartNumberSet.has(partNumber)
    );
    const notes = buildNotes(details, corroboratedPartNumbers);

    const patch = {
      id: wheel._id,
      wheel_title: details.title,
      part_numbers: allPartNumbers.join(", "),
      notes,
      image_source: "Alloy Wheels Direct",
      good_pic_url: wheel.good_pic_url || details.imageUrl || details.url,
      jnc_brands: "Mini",
      text_diameters: diameters.join(", "),
      text_widths: widths.join(", "),
      text_bolt_patterns: boltPatterns.join(", "),
      text_center_bores: centerBores.join(", "),
      text_colors: colors.join(", "),
      text_offsets: offsets.join(", "),
    };

    if (APPLY) {
      await convexMutation("mutations:wheelsUpdate", patch);
    }
    stats.wheelsUpdated += 1;

    const existingPartNumbers = existingVariantPartNumbersByWheel.get(wheel._id) || new Set();
    for (const variant of details.variants) {
      if (existingPartNumbers.has(variant.partNumber)) {
        stats.wheelVariantsSkipped += 1;
        continue;
      }

      if (APPLY) {
        const diameterId = await getOrCreateRef("diameter", variant.diameter);
        const widthId = await getOrCreateRef("width", `${variant.width}J`);
        const offsetId = await getOrCreateRef("offset", `ET${variant.offset}`);
        const boltPatternId = await getOrCreateRef("boltPattern", variant.boltPattern);
        const colorId = await getOrCreateRef("color", variant.color);
        const partNumberId = await getOrCreateRef("partNumber", variant.partNumber);
        const centerBoreId = variant.centerBore
          ? await getOrCreateRef("centerBore", variant.centerBore)
          : undefined;

        await convexMutation("migrations:promoteWheelVariant", {
          wheel_id: wheel._id,
          wheel_title: details.title,
          slug: buildVariantSlug(wheelBusinessId, variant.partNumber),
          variant_title: variant.partNumber,
          part_number: variant.partNumber,
          diameter_id: diameterId,
          diameter_value: variant.diameter,
          width_id: widthId,
          width_value: `${variant.width}J`,
          offset_id: offsetId,
          offset_value: `ET${variant.offset}`,
          bolt_pattern_id: boltPatternId,
          bolt_pattern_value: variant.boltPattern,
          center_bore_id: centerBoreId,
          center_bore_value: variant.centerBore,
          color_id: colorId,
          color_value: variant.color,
          part_number_id: partNumberId,
        });
      }

      existingPartNumbers.add(variant.partNumber);
      stats.wheelVariantsInserted += 1;
    }

    existingVariantPartNumbersByWheel.set(wheel._id, existingPartNumbers);
    reportRows.push({
      wheelBusinessId,
      title: details.title,
      url: details.url,
      currentPartNumbers,
      previousPartNumbers,
      colors,
      boltPatterns,
      widths,
      diameters,
      offsets,
      corroboratedPartNumbers,
    });
  }

  const reportLines = reportRows
    .map((row) => {
      const lines = [
        `- \`${row.wheelBusinessId}\` | ${row.title}`,
        `  Source: ${row.url}`,
        `  Current part numbers: ${row.currentPartNumbers.join(", ")}`,
        `  Previous part numbers: ${row.previousPartNumbers.join(", ") || "None"}`,
        `  Specs: ${row.widths.join(", ")} | ${row.diameters.join(", ")} | ${row.offsets.join(", ")} | ${row.boltPatterns.join(", ")}`,
        `  Colors: ${row.colors.join(", ")}`,
        `  Workshop corroboration: ${row.corroboratedPartNumbers.join(", ") || "None"}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  const report = `# MINI JCW Wheel Backfill Report

Date: ${new Date().toISOString()}
Mode: ${APPLY ? "APPLY" : "DRY RUN"}
Snapshot: \`${SNAPSHOT_ZIP}\`

## Summary

- JCW MINI parent wheel rows updated: ${stats.wheelsUpdated}
- JCW MINI wheel variants inserted: ${stats.wheelVariantsInserted}
- Existing JCW MINI wheel variants skipped from snapshot: ${stats.wheelVariantsSkipped}
- Direct JCW product pages verified: ${stats.pagesVerified}
- Current JCW part numbers captured: ${stats.currentPartNumbers}
- Previous/superseded part numbers captured: ${stats.previousPartNumbers}

## What Changed

- All target JCW rows remain under the \`Mini\` brand in production.
- Placeholder fitment blocks were replaced with verified JCW product-page specs: diameter, width, offset, bolt pattern, color, and current part number.
- Where AWD only published bolt pattern, center bore was inferred from MINI platform standards and called out in notes.
- No vehicle links were added for these rows because the current workshop exports do not provide a direct JCW wheel-to-vehicle fitment junction for these part numbers.

## Verified Wheels

${reportLines}

## Still Missing

- Exact verified wheel-to-vehicle links for these JCW wheels remain unrepresented. The current blocker is source shape, not missing wheel metadata.

## Additional Schema / Junction Recommendations

- Add a part-number supersession model such as \`j_oem_part_number_supersession\`.
  JCW source pages expose previous part numbers, and right now that relationship can only be stuffed into free-text notes.
- Add \`availability_status\` plus \`availability_source_url\` on wheel variants or part-number junctions.
  JCW source pages explicitly mark some rows as available or permanently discontinued, which is operationally important but currently not first-class data.
- Keep the previously recommended \`j_oem_vehicle_variant_wheel_variant\` write path as a priority.
  This JCW pass confirms that variant-level fitment is the right target once a trustworthy MINI/JCW fitment source is available.
`;

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log(JSON.stringify({ stats, reportPath: REPORT_PATH }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
