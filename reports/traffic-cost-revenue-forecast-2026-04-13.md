# OEMWDB Traffic Cost vs Revenue Forecast (2026-04-13)

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
- Important deployment note: `.env.local` is currently pointed at **eu-west-1 Convex URLs**, so this model uses **EU-hosted Convex pricing behavior** and applies the current **30% EU surcharge** to usage.

## Monetization Status
| Channel | Status | Notes |
| --- | --- | --- |
| eBay affiliate CTA | Live now | Rendered on wheel variants and wheel/vehicle surfaces; revenue modeled with conservative EPC assumptions. |
| Tire Rack CTA | Live now | Rendered on wheel variants; treated as North America-biased revenue with conservative click-through assumptions. |
| Market paid spot system | Live now | Convex market listing + placement pricing exists; forecast still uses the intended future Pro rule rather than the current included-slot count. |
| Item-page ad slot | Target state | Current `ad_slot` render is still a placeholder block, so this revenue is forecast-only for now. |
| Collection grid ads every 3 rows | Target state | No live collection-grid ad insertion was found in the browse surfaces; modeled as future inventory only. |
| Pro subscriptions | Target state | Forecast uses the intended $5/month Pro tier with full filters and 5 included $1 market slots. |

## Modeling Assumptions
### Convex and CDN pricing
- Convex Professional: **$25/month**
- Cloudflare Pro for the cache-heavy scenario: **$25/month**
- EU-hosted variable pricing used in the model:
  - function calls: **$2.60 / 1M**
  - DB bandwidth: **$0.26 / GB**
  - file/media bandwidth: **$0.39 / GB**
- This is intentionally conservative because the official Convex pricing page currently says **included usage amounts apply only to US deployments**.

### Balanced traffic mix
- Casual anonymous: **70%**
- Active anonymous browsers: **20%**
- Heavy anonymous shop users: **8%**
- Pro members: **2%**

### Revenue assumptions
- eBay: conservative modeled EPC **$0.07**
- Tire Rack: conservative modeled EPC **$0.25**
- Item-page ads: modeled net RPM **$6.00**
- Collection-grid ads: modeled net RPM **$4.50**
- Pro members average **8 sessions/month**
- Paid market spot system modeled at **$1 / 30-day slot**

## Primary Scenario Table (Balanced Mix)
| Monthly sessions | Poor cost | Cached cost | eBay | Tire Rack | Item ads* | Grid ads* | Pro subs* | Paid slots | Live-now revenue | Full-target revenue | Poor margin (live) | Cached margin (live) | Poor margin (target) | Cached margin (target) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50,000 | $374 | $120 | $26 | $46 | $236 | $145 | $625 | $60 | $132 | $1,138 | $-242 | $12 | $763 | $1,018 |
| 100,000 | $724 | $189 | $51 | $93 | $471 | $290 | $1,250 | $120 | $264 | $2,275 | $-460 | $75 | $1,552 | $2,086 |
| 250,000 | $1,772 | $398 | $128 | $232 | $1,178 | $726 | $3,125 | $300 | $660 | $5,688 | $-1,112 | $262 | $3,917 | $5,290 |
| 500,000 | $3,519 | $746 | $257 | $464 | $2,355 | $1,451 | $6,250 | $600 | $1,321 | $11,377 | $-2,198 | $574 | $7,858 | $10,631 |
| 750,000 | $5,266 | $1,094 | $385 | $696 | $3,533 | $2,177 | $9,375 | $900 | $1,981 | $17,065 | $-3,285 | $887 | $11,800 | $15,971 |
| 1,000,000 | $7,012 | $1,443 | $514 | $928 | $4,710 | $2,903 | $12,500 | $1,200 | $2,641 | $22,754 | $-4,371 | $1,199 | $15,741 | $21,311 |

\* `Item ads`, `Grid ads`, and `Pro subs` are **target-state** revenue columns, not current live revenue.

## Heavy Anonymous Shop Risk View
This table keeps the same traffic tiers but raises heavy anonymous shop behavior to **20% of sessions**.

| Monthly sessions | Heavy anon share | Poor cost | Cached cost | Live-now revenue | Full-target revenue | Poor margin (live) | Cached margin (live) | Risk note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50,000 | 20% | $567 | $161 | $164 | $1,357 | $-403 | $3 | Free tier underwater without stronger gating |
| 100,000 | 20% | $1,109 | $273 | $328 | $2,714 | $-781 | $55 | Free tier underwater without stronger gating |
| 250,000 | 20% | $2,735 | $606 | $819 | $6,786 | $-1,916 | $213 | Free tier underwater without stronger gating |
| 500,000 | 20% | $5,446 | $1,163 | $1,639 | $13,572 | $-3,807 | $476 | Free tier underwater without stronger gating |
| 750,000 | 20% | $8,156 | $1,719 | $2,458 | $20,358 | $-5,697 | $740 | Free tier underwater without stronger gating |
| 1,000,000 | 20% | $10,866 | $2,275 | $3,278 | $27,143 | $-7,588 | $1,003 | Free tier underwater without stronger gating |

## Included Pro Slot Exposure
This tracks the **face-value inventory consumed** by the intended Pro benefit. It is **not** booked as cash revenue and is **not deducted as a hard cost**, but it matters if paid slot demand gets tight.

| Monthly sessions | Modeled Pro members | Included slot face value* | Rule |
| --- | --- | --- | --- |
| 50,000 | 125 | $375 | 5 included slots/member |
| 100,000 | 250 | $750 | 5 included slots/member |
| 250,000 | 625 | $1,875 | 5 included slots/member |
| 500,000 | 1,250 | $3,750 | 5 included slots/member |
| 750,000 | 1,875 | $5,625 | 5 included slots/member |
| 1,000,000 | 2,500 | $7,500 | 5 included slots/member |

\* Assumes **60%** of the included slot allowance is actually used in a given month.

## What The Numbers Mean
- **Live-now revenue only**
  - Without strong caching, the free/basic surface is underwater starting at **50,000 monthly sessions** and stays that way as traffic scales.
  - With Cloudflare-grade caching, live-now monetization is far safer, but the margin is still thin against heavy anonymous usage.
- **Full target state**
  - Once Pro + display ads are actually live, the site becomes much healthier at every modeled tier.
  - The biggest operational risk is not “function calls exploding,” it is **image/media egress from deep browsing**.
- **Per-member economics**
  - One modeled Pro member costs about **$0.17 / month** in direct origin traffic under poor caching.
  - The same member costs about **$0.03 / month** with aggressive caching.
  - A $5 Pro price point comfortably covers its own direct traffic; the real problem is **heavy anonymous usage**, not Pro members.
- **Heavy anonymous shop load**
  - One heavy anonymous shop session costs about **$0.03** without caching.
  - The same session costs about **$0.01** with strong caching.
  - One $5 Pro subscription roughly offsets about **143 heavy anonymous sessions** without caching, or about **674 heavy anonymous sessions** with strong caching.

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
  - live market pricing in `convex/market.ts`
  - wheel eBay and Tire Rack CTAs in `src/pages/WheelItemPage.tsx` and `src/components/wheel/WheelVariantsTable.tsx`
  - placeholder item-page ad slot in `src/components/item-page/ItemPageCommonBlocks.tsx`
