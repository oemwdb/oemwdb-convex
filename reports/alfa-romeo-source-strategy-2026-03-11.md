# Alfa Romeo Source Strategy

Date: 2026-03-11

## Why The Current Alfa State Is Not Good Enough

- Live Alfa currently has only `3` vehicles, `3` vehicle variants, `33` wheels, and `33` wheel variants.
- That is a structurally clean subset, not a credible Alfa catalog.
- The current workshop feed only stages:
  - `4C`
  - `Giulia`
  - `Stelvio`
- Live Convex counts confirm there is no hidden richer Alfa staging already deployed:
  - `ws_alfa_romeo_vehicles`: `9` rows, but only `3` unique source ids
  - `ws_alfa_romeo_vehicle_variants`: `9` rows, but only `3` unique source ids
  - `ws_alfa_romeo_wheels`: effectively the same narrow source family used in the first rebuild

## Better Source Hierarchy

### Tier 1: Official Alfa Romeo Model And Manual Sources

Use official Alfa Romeo sites to define vehicle scope, current trims, and year coverage.

Primary sources verified on 2026-03-11:

- [Alfa Romeo USA owner manuals](https://www.alfaromeousa.com/owners/owners-service-manual)
  - confirms manual coverage for `Giulia`, `Giulia Quadrifoglio`, `Stelvio`, `Stelvio Quadrifoglio`, `Tonale`, `4C Coupe`, and `4C Spider`
- [2026 Giulia](https://www.alfaromeousa.com/models/giulia-2026)
- [2026 Tonale](https://www.alfaromeousa.com/models/tonale-2026)
- [Alfa Romeo USA sitemap](https://www.alfaromeousa.com/sitemap)
- [Junior official PDF](https://www.alfaromeo.com/content/dam/alfa/cross/download-center/pricelist/JUNIOR_interactive_pdf.pdf)

What Tier 1 is good for:

- `oem_vehicles`
- modern `oem_vehicle_variants`
- production year coverage
- body type / drivetrain
- official wheel and tire sizing by trim where exposed in model and manual pages

What Tier 1 is not good for:

- full OEM wheel part-number coverage
- historical wheel style inventory
- part supersessions

### Tier 2: Official Mopar Alfa Romeo Parts Catalog

Use Mopar as the official service-parts source for model/year/trim coverage and wheel part data.

Primary sources verified on 2026-03-11:

- [Alfa Romeo model index](https://store.mopar.com/v-alfa-romeo)
  - search snippet confirms broad heritage coverage including `164`, `1900`, `2600`, `4C`, `8C`, `Giulia`, `Giulietta`, `Milano`, `Montreal`, `Spider`, `Stelvio`, `Tonale`, and more
- [Giulia years](https://store.mopar.com/v-alfa-romeo-giulia)
- [Stelvio years](https://store.mopar.com/v-alfa-romeo-stelvio)
- [2025 Stelvio trims](https://store.mopar.com/v-2025-alfa-romeo-stelvio)
- [2024 Stelvio trims](https://store.mopar.com/v-2024-alfa-romeo-stelvio)

Observed search-result evidence:

- Mopar year pages expose `year -> trim -> engine` structure cleanly enough to promote vehicle variants.
- Search snippets show trim names such as:
  - `Base`
  - `Sprint`
  - `TI`
  - `Veloce`
  - `Competizione`
  - `Tributo Italiano`
  - `Quadrifoglio`
  - `Quadrifoglio Carbon`
  - `Quadrifoglio Supersport`

What Tier 2 is good for:

- broad Alfa vehicle family coverage beyond the current `4C/Giulia/Stelvio` subset
- `oem_vehicle_variants` from official year/trim pages
- OEM wheel part numbers
- wheel descriptions
- application text
- supersession / replacement hints
- model-year applicability

What Tier 2 is weak on:

- fitment is not always exposed cleanly on every individual part page
- wheel style marketing names can be inconsistent
- direct scraping is Cloudflare-protected, so ingestion may need search-index capture, browser automation, or manual staging

### Tier 3: Existing Workshop / Hollander-Style Source

Keep the current Alfa workshop source, but demote it to a supplemental feed.

Use it for:

- images
- width / offset fields
- finish labels
- raw wheel naming tokens like `ALY58174`
- fallback part numbers when verified elsewhere

Do not use it as the source of truth for:

- Alfa catalog completeness
- vehicle coverage
- trim coverage
- canonical wheel families

## What This Means For Each Target Table

### `oem_vehicles`

Build from Tier 1 and Tier 2 first.

Expected next minimum vehicle families:

- `4C Coupe`
- `4C Spider`
- `Giulia`
- `Giulia Quadrifoglio`
- `Stelvio`
- `Stelvio Quadrifoglio`
- `Tonale`
- `Junior` if we choose global-current scope

If we choose broader heritage scope, Mopar strongly suggests there are many more historic families available.

### `oem_vehicle_variants`

Source from:

- Mopar `year -> trim -> engine` pages
- official Alfa model/compare/manual pages for current trims and wheel/tire sizing

This is the correct place to represent:

- `Sprint`
- `TI`
- `Veloce`
- `Competizione`
- `Tributo Italiano`
- `Intensa`
- `Quadrifoglio`
- `Quadrifoglio Carbon`
- `Quadrifoglio Supersport`

### `oem_wheels`

Do **not** keep building one wheel row per raw workshop row.

Instead:

- stage the whole official wheel universe first
- group by canonical wheel family
- use workshop/Hollander tokens and part descriptions only as supporting evidence

For Alfa, a wheel family key will likely need:

- official part family or style token
- vehicle family
- diameter
- marketed finish/style stem

### `oem_wheel_variants`

This is where the real density belongs.

Wheel variants should be split on:

- part number
- diameter
- width
- offset where known
- finish / color
- front vs rear where staggered

### `j_wheel_vehicle`

Populate from:

- Mopar model/year applicability
- official model pages when a wheel is clearly associated to a family

This junction should answer:

- which wheel families belong to `Giulia`
- which belong to `Stelvio`
- which belong to `Tonale`
- which legacy wheels belong to legacy Alfa families

### `j_oem_vehicle_variant_wheel_variant`

Populate only after trim-level evidence is staged.

Best sources:

- official model/compare/manual pages with trim-level wheel sizing
- Mopar trim pages and part applicability where the trim is explicit

This is the table that should answer:

- which exact wheel variant belongs to `2024 Stelvio Competizione`
- which exact wheel variant belongs to `2025 Stelvio Tributo Italiano`
- which exact wheel variant belongs to `Tonale Veloce`

## Merge Strategy

The right answer is:

- **yes**, reference against a better source first
- **then** merge after we have the whole picture
- **then** use targeted searches only for the residual gaps and collisions

Execution order:

1. Build a staged Alfa vehicle spine from official Alfa + official Mopar.
2. Expand `oem_vehicles` before touching more wheel merges.
3. Build staged Alfa vehicle variants from official year/trim coverage.
4. Stage official Alfa wheel-part rows from Mopar.
5. Reconcile those part rows against the existing workshop/Hollander wheel feed.
6. Create canonical wheel families.
7. Split official wheel variants correctly.
8. Populate `j_wheel_vehicle`.
9. Populate `j_oem_vehicle_variant_wheel_variant`.
10. Only then run destructive dedupe/merge on old Alfa wheel rows that are proven shadows or inferior copies.

## Do We Already Know Which Wheels Cover Which Vehicles?

Not in a trustworthy Alfa-wide sense.

Current live reality:

- the existing Alfa data only links `33` wheels across `3` broad families
- that linkage came from a narrow workshop `variant_id` hint, not a brand-wide verified fitment source

After the source rebuild, we should know:

- family-level wheel coverage for a much larger Alfa catalog
- trim-level coverage for many modern vehicles

But some legacy or ambiguous rows will still need targeted verification before final linking.

## New Staging/Modeling Needed

The existing schema already has dormant Alfa staging buckets like:

- `ws_alfa_romeo_models`
- `ws_alfa_romeo_variants`

Those are not enough on their own.

Recommended additions:

- `ws_alfa_romeo_parts`
  - to store official Mopar wheel part rows separately from the old workshop source
- `ws_alfa_romeo_part_fitment`
  - to store part-to-year/trim applicability before promotion
- provenance fields on promoted rows:
  - `source_system`
  - `source_url`
  - `source_record_id`
  - `verified_at`
  - `verification_status`

Optional but high-value:

- a wheel-style layer or alias table
  - because Alfa will likely have the same style marketed across multiple part numbers, finishes, and staggered front/rear pairs

## Recommendation

For Alfa Romeo, the next pass should be a source-backed rebuild in this order:

1. vehicle families
2. vehicle variants
3. official wheel-part staging
4. wheel families
5. wheel variants
6. junction tables

Do not keep polishing the old `33`-wheel subset as if that is the brand.
