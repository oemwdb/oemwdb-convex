import fs from "node:fs";
import path from "node:path";

const TODAY = "2026-04-13";
const REPORT_PATH = path.resolve("reports", `traffic-cost-revenue-forecast-${TODAY}.md`);

const trafficTiers = [50_000, 100_000, 250_000, 500_000, 750_000, 1_000_000];

const mixes = {
  balanced: {
    casualAnonymous: 0.70,
    activeAnonymous: 0.20,
    heavyAnonymousShop: 0.08,
    proMember: 0.02,
  },
  heavyRisk: {
    casualAnonymous: 0.58,
    activeAnonymous: 0.20,
    heavyAnonymousShop: 0.20,
    proMember: 0.02,
  },
};

const pricing = {
  convexProfessionalBaseUsd: 25,
  cloudflareProUsd: 25,
  convexEuHosted: true,
  convexEuSurchargeMultiplier: 1.3,
  convexFunctionCallsPerMillionUsd: 2,
  convexDatabaseBandwidthPerGbUsd: 0.2,
  convexFileBandwidthPerGbUsd: 0.3,
};

const effectiveRates = {
  functionCallsPerMillionUsd:
    pricing.convexFunctionCallsPerMillionUsd * pricing.convexEuSurchargeMultiplier,
  databaseBandwidthPerGbUsd:
    pricing.convexDatabaseBandwidthPerGbUsd * pricing.convexEuSurchargeMultiplier,
  fileBandwidthPerGbUsd:
    pricing.convexFileBandwidthPerGbUsd * pricing.convexEuSurchargeMultiplier,
};

const costPerSession = {
  poorCaching: {
    casualAnonymous: { fileMb: 7, dbMb: 0.18, functionCalls: 5 },
    activeAnonymous: { fileMb: 24, dbMb: 0.6, functionCalls: 15 },
    heavyAnonymousShop: { fileMb: 90, dbMb: 1.8, functionCalls: 40 },
    proMember: { fileMb: 55, dbMb: 1.2, functionCalls: 30 },
  },
  cloudflareHeavyCaching: {
    casualAnonymous: { fileMb: 1.1, dbMb: 0.18, functionCalls: 5 },
    activeAnonymous: { fileMb: 4.5, dbMb: 0.6, functionCalls: 15 },
    heavyAnonymousShop: { fileMb: 18, dbMb: 1.8, functionCalls: 40 },
    proMember: { fileMb: 10, dbMb: 1.2, functionCalls: 30 },
  },
};

const revenueAssumptions = {
  ebay: {
    epcUsd: 0.07,
    ctrBySegment: {
      casualAnonymous: 0.004,
      activeAnonymous: 0.010,
      heavyAnonymousShop: 0.028,
      proMember: 0.015,
    },
  },
  tireRack: {
    epcUsd: 0.25,
    ctrBySegment: {
      casualAnonymous: 0.0015,
      activeAnonymous: 0.006,
      heavyAnonymousShop: 0.016,
      proMember: 0.009,
    },
  },
  itemPageAds: {
    rpmUsd: 6,
    impressionsPerSessionBySegment: {
      casualAnonymous: 0.35,
      activeAnonymous: 1.1,
      heavyAnonymousShop: 3.5,
      proMember: 2.0,
    },
  },
  collectionGridAds: {
    rpmUsd: 4.5,
    impressionsPerSessionBySegment: {
      casualAnonymous: 0.25,
      activeAnonymous: 1.0,
      heavyAnonymousShop: 3.0,
      proMember: 1.5,
    },
  },
  subscriptions: {
    monthlyPriceUsd: 5,
    sessionsPerMemberPerMonth: 8,
    includedSlotsPerMember: 5,
    includedSlotUtilizationRate: 0.6,
  },
  marketPaidSpots: {
    paidSpotsPerSession: 0.0012,
    spotPriceUsd: 1,
  },
};

const monetizationStatus = [
  {
    channel: "eBay affiliate CTA",
    status: "Live now",
    notes:
      "Rendered on wheel variants and wheel/vehicle surfaces; revenue modeled with conservative EPC assumptions.",
  },
  {
    channel: "Tire Rack CTA",
    status: "Live now",
    notes:
      "Rendered on wheel variants; treated as North America-biased revenue with conservative click-through assumptions.",
  },
  {
    channel: "Market paid spot system",
    status: "Live now",
    notes:
      "Convex market listing + placement pricing exists; forecast still uses the intended future Pro rule rather than the current included-slot count.",
  },
  {
    channel: "Item-page ad slot",
    status: "Target state",
    notes:
      "Current `ad_slot` render is still a placeholder block, so this revenue is forecast-only for now.",
  },
  {
    channel: "Collection grid ads every 3 rows",
    status: "Target state",
    notes:
      "No live collection-grid ad insertion was found in the browse surfaces; modeled as future inventory only.",
  },
  {
    channel: "Pro subscriptions",
    status: "Target state",
    notes:
      "Forecast uses the intended $5/month Pro tier with full filters and 5 included $1 market slots.",
  },
];

function weightedAverage(values, mix) {
  return Object.entries(mix).reduce((sum, [segment, weight]) => sum + values[segment] * weight, 0);
}

function roundMoney(value) {
  return Math.round(value);
}

function fmtMoney(value) {
  const rounded = roundMoney(value);
  return `$${rounded.toLocaleString("en-US")}`;
}

function fmtMoneyPrecise(value) {
  if (Math.abs(value) >= 100) return fmtMoney(value);
  if (Math.abs(value) >= 10) return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
}

function fmtNumber(value) {
  return value.toLocaleString("en-US");
}

function computeCost(sessions, mix, scenarioKey) {
  const scenario = costPerSession[scenarioKey];
  const avgFileMb = weightedAverage(
    Object.fromEntries(Object.entries(scenario).map(([segment, value]) => [segment, value.fileMb])),
    mix
  );
  const avgDbMb = weightedAverage(
    Object.fromEntries(Object.entries(scenario).map(([segment, value]) => [segment, value.dbMb])),
    mix
  );
  const avgFunctionCalls = weightedAverage(
    Object.fromEntries(Object.entries(scenario).map(([segment, value]) => [segment, value.functionCalls])),
    mix
  );

  const fileCost =
    (sessions * avgFileMb * effectiveRates.fileBandwidthPerGbUsd) / 1024;
  const dbCost =
    (sessions * avgDbMb * effectiveRates.databaseBandwidthPerGbUsd) / 1024;
  const functionCallCost =
    (sessions * avgFunctionCalls * effectiveRates.functionCallsPerMillionUsd) /
    1_000_000;

  const fixed =
    pricing.convexProfessionalBaseUsd +
    (scenarioKey === "cloudflareHeavyCaching" ? pricing.cloudflareProUsd : 0);

  return {
    avgFileMb,
    avgDbMb,
    avgFunctionCalls,
    fileCost,
    dbCost,
    functionCallCost,
    fixed,
    total: fixed + fileCost + dbCost + functionCallCost,
  };
}

function computeRevenue(sessions, mix) {
  const ebay =
    sessions *
    weightedAverage(
      Object.fromEntries(
        Object.entries(revenueAssumptions.ebay.ctrBySegment).map(([segment, ctr]) => [
          segment,
          ctr * revenueAssumptions.ebay.epcUsd,
        ])
      ),
      mix
    );

  const tireRack =
    sessions *
    weightedAverage(
      Object.fromEntries(
        Object.entries(revenueAssumptions.tireRack.ctrBySegment).map(([segment, ctr]) => [
          segment,
          ctr * revenueAssumptions.tireRack.epcUsd,
        ])
      ),
      mix
    );

  const itemPageAds =
    (sessions *
      weightedAverage(revenueAssumptions.itemPageAds.impressionsPerSessionBySegment, mix) *
      revenueAssumptions.itemPageAds.rpmUsd) /
    1000;

  const collectionGridAds =
    (sessions *
      weightedAverage(revenueAssumptions.collectionGridAds.impressionsPerSessionBySegment, mix) *
      revenueAssumptions.collectionGridAds.rpmUsd) /
    1000;

  const proMembers =
    (sessions * mix.proMember) / revenueAssumptions.subscriptions.sessionsPerMemberPerMonth;

  const proSubscriptions =
    proMembers * revenueAssumptions.subscriptions.monthlyPriceUsd;

  const paidMarketSlots =
    sessions *
    revenueAssumptions.marketPaidSpots.paidSpotsPerSession *
    revenueAssumptions.marketPaidSpots.spotPriceUsd;

  const includedSlotFaceValue =
    proMembers *
    revenueAssumptions.subscriptions.includedSlotsPerMember *
    revenueAssumptions.subscriptions.includedSlotUtilizationRate *
    revenueAssumptions.marketPaidSpots.spotPriceUsd;

  const liveNowTotal = ebay + tireRack + paidMarketSlots;
  const targetStateTotal =
    liveNowTotal + itemPageAds + collectionGridAds + proSubscriptions;

  return {
    ebay,
    tireRack,
    itemPageAds,
    collectionGridAds,
    proMembers,
    proSubscriptions,
    paidMarketSlots,
    includedSlotFaceValue,
    liveNowTotal,
    targetStateTotal,
  };
}

function buildMarkdownTable(headers, rows) {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = rows.map((row) => `| ${row.join(" | ")} |`);
  return [headerRow, separatorRow, ...bodyRows].join("\n");
}

function buildPrimaryRows(mix) {
  return trafficTiers.map((sessions) => {
    const poor = computeCost(sessions, mix, "poorCaching");
    const cached = computeCost(sessions, mix, "cloudflareHeavyCaching");
    const revenue = computeRevenue(sessions, mix);

    return [
      fmtNumber(sessions),
      fmtMoney(poor.total),
      fmtMoney(cached.total),
      fmtMoney(revenue.ebay),
      fmtMoney(revenue.tireRack),
      fmtMoney(revenue.itemPageAds),
      fmtMoney(revenue.collectionGridAds),
      fmtMoney(revenue.proSubscriptions),
      fmtMoney(revenue.paidMarketSlots),
      fmtMoney(revenue.liveNowTotal),
      fmtMoney(revenue.targetStateTotal),
      fmtMoney(revenue.liveNowTotal - poor.total),
      fmtMoney(revenue.liveNowTotal - cached.total),
      fmtMoney(revenue.targetStateTotal - poor.total),
      fmtMoney(revenue.targetStateTotal - cached.total),
    ];
  });
}

function buildRiskRows(mix) {
  return trafficTiers.map((sessions) => {
    const poor = computeCost(sessions, mix, "poorCaching");
    const cached = computeCost(sessions, mix, "cloudflareHeavyCaching");
    const revenue = computeRevenue(sessions, mix);

    const freeTierDanger =
      revenue.liveNowTotal < poor.total
        ? "Free tier underwater without stronger gating"
        : revenue.liveNowTotal < cached.total
          ? "Cloudflare needed to stay ahead"
          : "Acceptable only with tight browse controls";

    return [
      fmtNumber(sessions),
      "20%",
      fmtMoney(poor.total),
      fmtMoney(cached.total),
      fmtMoney(revenue.liveNowTotal),
      fmtMoney(revenue.targetStateTotal),
      fmtMoney(revenue.liveNowTotal - poor.total),
      fmtMoney(revenue.liveNowTotal - cached.total),
      freeTierDanger,
    ];
  });
}

function buildIncludedSlotRows(mix) {
  return trafficTiers.map((sessions) => {
    const revenue = computeRevenue(sessions, mix);
    return [
      fmtNumber(sessions),
      fmtNumber(Math.round(revenue.proMembers)),
      fmtMoney(revenue.includedSlotFaceValue),
      `${revenueAssumptions.subscriptions.includedSlotsPerMember} included slots/member`,
    ];
  });
}

function findFirstRiskTier(mix, scenarioKey) {
  for (const sessions of trafficTiers) {
    const cost = computeCost(sessions, mix, scenarioKey);
    const revenue = computeRevenue(sessions, mix);
    if (revenue.liveNowTotal < cost.total) {
      return sessions;
    }
  }
  return null;
}

function buildReport() {
  const balancedPrimaryHeaders = [
    "Monthly sessions",
    "Poor cost",
    "Cached cost",
    "eBay",
    "Tire Rack",
    "Item ads*",
    "Grid ads*",
    "Pro subs*",
    "Paid slots",
    "Live-now revenue",
    "Full-target revenue",
    "Poor margin (live)",
    "Cached margin (live)",
    "Poor margin (target)",
    "Cached margin (target)",
  ];

  const riskHeaders = [
    "Monthly sessions",
    "Heavy anon share",
    "Poor cost",
    "Cached cost",
    "Live-now revenue",
    "Full-target revenue",
    "Poor margin (live)",
    "Cached margin (live)",
    "Risk note",
  ];

  const slotHeaders = [
    "Monthly sessions",
    "Modeled Pro members",
    "Included slot face value*",
    "Rule",
  ];

  const balancedRows = buildPrimaryRows(mixes.balanced);
  const riskRows = buildRiskRows(mixes.heavyRisk);
  const slotRows = buildIncludedSlotRows(mixes.balanced);

  const firstPoorRiskTier = findFirstRiskTier(mixes.balanced, "poorCaching");
  const firstCachedRiskTier = findFirstRiskTier(mixes.balanced, "cloudflareHeavyCaching");

  const heavyPoorSessionCost =
    (costPerSession.poorCaching.heavyAnonymousShop.fileMb / 1024) *
      effectiveRates.fileBandwidthPerGbUsd +
    (costPerSession.poorCaching.heavyAnonymousShop.dbMb / 1024) *
      effectiveRates.databaseBandwidthPerGbUsd +
    (costPerSession.poorCaching.heavyAnonymousShop.functionCalls / 1_000_000) *
      effectiveRates.functionCallsPerMillionUsd;

  const heavyCachedSessionCost =
    (costPerSession.cloudflareHeavyCaching.heavyAnonymousShop.fileMb / 1024) *
      effectiveRates.fileBandwidthPerGbUsd +
    (costPerSession.cloudflareHeavyCaching.heavyAnonymousShop.dbMb / 1024) *
      effectiveRates.databaseBandwidthPerGbUsd +
    (costPerSession.cloudflareHeavyCaching.heavyAnonymousShop.functionCalls / 1_000_000) *
      effectiveRates.functionCallsPerMillionUsd;

  const proPoorMonthlyCost =
    revenueAssumptions.subscriptions.sessionsPerMemberPerMonth *
    (
      (costPerSession.poorCaching.proMember.fileMb / 1024) *
        effectiveRates.fileBandwidthPerGbUsd +
      (costPerSession.poorCaching.proMember.dbMb / 1024) *
        effectiveRates.databaseBandwidthPerGbUsd +
      (costPerSession.poorCaching.proMember.functionCalls / 1_000_000) *
        effectiveRates.functionCallsPerMillionUsd
    );

  const proCachedMonthlyCost =
    revenueAssumptions.subscriptions.sessionsPerMemberPerMonth *
    (
      (costPerSession.cloudflareHeavyCaching.proMember.fileMb / 1024) *
        effectiveRates.fileBandwidthPerGbUsd +
      (costPerSession.cloudflareHeavyCaching.proMember.dbMb / 1024) *
        effectiveRates.databaseBandwidthPerGbUsd +
      (costPerSession.cloudflareHeavyCaching.proMember.functionCalls / 1_000_000) *
        effectiveRates.functionCallsPerMillionUsd
    );

  return `# OEMWDB Traffic Cost vs Revenue Forecast (${TODAY})

## Summary
- This forecast treats monthly visits as **sessions** and uses a **balanced traffic mix** by default.
- It compares two origin-cost scenarios:
  - **Poor caching / no effective CDN**
  - **Cloudflare + aggressive media/app caching**
- It models the business against the **intended Pro tier**:
  - **$5/month**
  - **5 included $1 / 30-day market item slots**
  - full filter functionality and other perks
- It separates **live-now** revenue from **target-state** revenue so placeholder surfaces are not counted as shipped income.

## Grounding From The Current App
- The app ships a large cold bundle right now: roughly **3.5 MB raw JS / 0.96 MB gzip JS** plus **0.02 MB gzip CSS** from the latest local build.
- A lot of card surfaces still use direct image tags and Convex-backed media URLs, so **file/media bandwidth** is the primary cost risk.
- **Live now monetization in code**
  - eBay outbound CTAs on wheel and variant surfaces
  - Tire Rack outbound CTA on wheel variants
  - market paid placement pricing in Convex at **$1 / 30 days**
- **Target-state monetization**
  - item-page ad slots
  - collection-grid ads every 3 rows
  - the revised Pro tier with 5 included slots
- Important deployment note: \`.env.local\` is currently pointed at **eu-west-1 Convex URLs**, so this model uses **EU-hosted Convex pricing behavior** and applies the current **30% EU surcharge** to usage.

## Monetization Status
${buildMarkdownTable(
  ["Channel", "Status", "Notes"],
  monetizationStatus.map((item) => [item.channel, item.status, item.notes])
)}

## Modeling Assumptions
### Convex and CDN pricing
- Convex Professional: **$25/month**
- Cloudflare Pro for the cache-heavy scenario: **$25/month**
- EU-hosted variable pricing used in the model:
  - function calls: **$${effectiveRates.functionCallsPerMillionUsd.toFixed(2)} / 1M**
  - DB bandwidth: **$${effectiveRates.databaseBandwidthPerGbUsd.toFixed(2)} / GB**
  - file/media bandwidth: **$${effectiveRates.fileBandwidthPerGbUsd.toFixed(2)} / GB**
- This is intentionally conservative because the official Convex pricing page currently says **included usage amounts apply only to US deployments**.

### Balanced traffic mix
- Casual anonymous: **70%**
- Active anonymous browsers: **20%**
- Heavy anonymous shop users: **8%**
- Pro members: **2%**

### Revenue assumptions
- eBay: conservative modeled EPC **$${revenueAssumptions.ebay.epcUsd.toFixed(2)}**
- Tire Rack: conservative modeled EPC **$${revenueAssumptions.tireRack.epcUsd.toFixed(2)}**
- Item-page ads: modeled net RPM **$${revenueAssumptions.itemPageAds.rpmUsd.toFixed(2)}**
- Collection-grid ads: modeled net RPM **$${revenueAssumptions.collectionGridAds.rpmUsd.toFixed(2)}**
- Pro members average **${revenueAssumptions.subscriptions.sessionsPerMemberPerMonth} sessions/month**
- Paid market spot system modeled at **$${revenueAssumptions.marketPaidSpots.spotPriceUsd} / 30-day slot**

## Primary Scenario Table (Balanced Mix)
${buildMarkdownTable(balancedPrimaryHeaders, balancedRows)}

\\* \`Item ads\`, \`Grid ads\`, and \`Pro subs\` are **target-state** revenue columns, not current live revenue.

## Heavy Anonymous Shop Risk View
This table keeps the same traffic tiers but raises heavy anonymous shop behavior to **20% of sessions**.

${buildMarkdownTable(riskHeaders, riskRows)}

## Included Pro Slot Exposure
This tracks the **face-value inventory consumed** by the intended Pro benefit. It is **not** booked as cash revenue and is **not deducted as a hard cost**, but it matters if paid slot demand gets tight.

${buildMarkdownTable(slotHeaders, slotRows)}

\\* Assumes **60%** of the included slot allowance is actually used in a given month.

## What The Numbers Mean
- **Live-now revenue only**
  - Without strong caching, the free/basic surface is underwater starting at **${firstPoorRiskTier ? fmtNumber(firstPoorRiskTier) : "none of the modeled"} monthly sessions** and stays that way as traffic scales.
  - With Cloudflare-grade caching, live-now monetization is far safer, but the margin is still thin against heavy anonymous usage.
- **Full target state**
  - Once Pro + display ads are actually live, the site becomes much healthier at every modeled tier.
  - The biggest operational risk is not “function calls exploding,” it is **image/media egress from deep browsing**.
- **Per-member economics**
  - One modeled Pro member costs about **${fmtMoneyPrecise(proPoorMonthlyCost)} / month** in direct origin traffic under poor caching.
  - The same member costs about **${fmtMoneyPrecise(proCachedMonthlyCost)} / month** with aggressive caching.
  - A $5 Pro price point comfortably covers its own direct traffic; the real problem is **heavy anonymous usage**, not Pro members.
- **Heavy anonymous shop load**
  - One heavy anonymous shop session costs about **${fmtMoneyPrecise(heavyPoorSessionCost)}** without caching.
  - The same session costs about **${fmtMoneyPrecise(heavyCachedSessionCost)}** with strong caching.
  - One $5 Pro subscription roughly offsets about **${fmtNumber(Math.floor(revenueAssumptions.subscriptions.monthlyPriceUsd / heavyPoorSessionCost))} heavy anonymous sessions** without caching, or about **${fmtNumber(Math.floor(revenueAssumptions.subscriptions.monthlyPriceUsd / heavyCachedSessionCost))} heavy anonymous sessions** with strong caching.

## Recommendations
1. **Do not leave full deep-browse power unlimited for Basic forever.**
   - Put full compound filtering and the easiest high-depth browse workflows behind Pro first.
2. **Put media behind Cloudflare before real scale.**
   - On the current architecture, this is the cleanest protection against browse-heavy origin cost.
3. **Treat item-page ads and collection-grid ads as upside, not current cash flow.**
   - Right now they should help planning, not justify current spend.
4. **Keep market paid slots live and simple.**
   - The $1 / 30-day slot is not huge revenue by itself, but it layers well with Pro and affiliate income.
5. **Use Pro to monetize convenience, not just scarcity.**
   - Full filters, better browse flow, market perks, and included spots fit the economics better than trying to monetize only after origin costs already happen.

## Source Notes
- Convex Professional pricing and EU-hosting note: [Convex pricing](https://www.convex.dev/pricing/previous)
- Cloudflare CDN pricing baseline: [Cloudflare CDN](https://www.cloudflare.com/application-services/products/cdn/)
- OEMWDB code grounding:
  - live market pricing in \`convex/market.ts\`
  - wheel eBay and Tire Rack CTAs in \`src/pages/WheelItemPage.tsx\` and \`src/components/wheel/WheelVariantsTable.tsx\`
  - placeholder item-page ad slot in \`src/components/item-page/ItemPageCommonBlocks.tsx\`
`;
}

const report = buildReport();
fs.writeFileSync(REPORT_PATH, report, "utf8");
process.stdout.write(`Wrote ${REPORT_PATH}\n`);
