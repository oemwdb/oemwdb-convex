# Alfa Romeo Navigation Rebuild

Date: 2026-03-11

## Result

- Alfa Romeo vehicles: `4`
- Alfa Romeo vehicle variants: `12`
- Alfa Romeo wheel families: `21`
- Alfa Romeo wheel variants: `36`
- Alfa Romeo wheel-to-vehicle links: `21`
- Alfa Romeo vehicle-variant-to-wheel-variant links: `48`
- Alfa Romeo junk `All` vehicle rows deleted: `3`
- Alfa Romeo junk `All` vehicle variants deleted: `3`
- Alfa Romeo old 1:1 wheel variants deleted and rebuilt: `33`
- Alfa Romeo wheel rows merged away during regrouping: `15`

## What Changed

- Rebuilt Alfa Romeo from a wheel-family / wheel-variant structure instead of keeping one live wheel row per part-specific source row.
- Deleted the bogus Alfa `All` vehicle rows and `All` vehicle variants.
- Kept the real Alfa vehicle family rows and added the missing `Tonale` vehicle row.
- Regrouped the existing Alfa `4C`, `Giulia`, and `Stelvio` wheels into canonical wheel families.
- Recreated Alfa wheel variants under those canonical wheel families with verified diameter, width, finish, bolt pattern, and part-number data where available.
- Rebuilt family-level `j_wheel_vehicle` links.
- Rebuilt variant-level `j_oem_vehicle_variant_wheel_variant` links.

## Live Alfa Vehicle Coverage

- `Alfa Romeo 4C`
  - variants:
    - `4C Coupe`
    - `4C Spider`
- `Alfa Romeo Giulia`
  - variants:
    - `Giulia Base / Touring`
    - `Giulia Sport 19-Inch Package`
    - `Giulia Quadrifoglio Hyper Silver`
    - `Giulia Quadrifoglio Hyper Charcoal`
- `Alfa Romeo Stelvio`
  - variants:
    - `Stelvio Standard 18-Inch`
    - `Stelvio Touring 19-Inch`
    - `Stelvio Sport 20-Inch`
- `Alfa Romeo Tonale`
  - variants:
    - `Tonale Standard 18-Inch`
    - `Tonale Veloce / Tributo Italiano 19-Inch`
    - `Tonale Intensa / Sport Speciale 20-Inch`

## Live Alfa Wheel Coverage

### 4C

- `4C 10-Spoke Black Machined Wheels`
- `4C 10-Spoke Painted Wheels`
- `4C 10-Spoke Silver Painted Wheels`
- `4C 10-Spoke Charcoal Painted Wheels`
- `4C 5 Split-Spoke Silver Painted Wheels`
- `4C 5 Split-Spoke Charcoal Painted Wheels`

### Giulia

- `Giulia 17-Inch 10-Spoke Grey Wheels`
- `Giulia 18-Inch Painted Wheels`
- `Giulia 18-Inch 20-Spoke Grey Machined Wheels`
- `Giulia 18-Inch Dark Grey Painted Wheels`
- `Giulia 19-Inch 5 Y-Spoke Hyper Charcoal Wheels`
- `Giulia Quadrifoglio 19-Inch 5 Y-Spoke Hyper Silver Wheels`
- `Giulia Quadrifoglio 19-Inch 5 Y-Spoke Hyper Charcoal Wheels`

### Stelvio

- `Stelvio 18-Inch 5-Spoke Painted Wheels`
- `Stelvio 19-Inch 5 Split-Spoke Charcoal Machined Wheels`
- `Stelvio 19-Inch 10-Spoke Silver Painted Wheels`
- `Stelvio 20-Inch 5 Y-Spoke Wheels`
- `Stelvio 20-Inch 5 Split-Spoke Black Machined Wheels`

### Tonale

- `Tonale 18-Inch Black Diamond Cut Wheels`
- `Tonale 19-Inch Veloce Five-Hole Wheels`
- `Tonale 20-Inch Black Alloy Wheels`

## Source Stack Used

### Tier 1 Official Alfa Sources

- [Alfa Romeo USA owner manuals](https://www.alfaromeousa.com/owners/owners-service-manual)
- [2026 Giulia](https://www.alfaromeousa.com/models/giulia-2026)
- [2026 Tonale](https://www.alfaromeousa.com/models/tonale-2026)
- [Alfa Romeo USA sitemap](https://www.alfaromeousa.com/sitemap)

### Tier 2 Official / OEM Parts Sources

- [Mopar Alfa Romeo model index](https://store.mopar.com/v-alfa-romeo)
- [Giulia years](https://store.mopar.com/v-alfa-romeo-giulia)
- [Stelvio years](https://store.mopar.com/v-alfa-romeo-stelvio)

### Supplemental OEM Wheel Sources

- existing Alfa Romeo workshop / Hubcap Haven rows already staged in Convex
- targeted Tonale OEM wheel listings surfaced via:
  - OriginalWheels
  - ShopAlfaRomeoParts
  - Alfa Romeo Shop
  - AutoRimShop

## What Is Better Now

- Alfa is now navigable at the family level.
- Wheel pages are cleaner because the wheel table now represents wheel families instead of a flat pile of part-specific rows.
- Wheel variants now carry the detailed part-specific size / finish / part-number data.
- Tonale is no longer missing.
- The old fake `All` scaffolding is gone.

## What Is Still Missing

- This is still not full heritage-Alfa coverage.
- `Junior` is not yet modeled live.
- Broad pre-4C heritage families suggested by Mopar’s Alfa model index are not yet promoted.
- Some current-market trim naming still needs a deeper official trim-by-trim reconciliation pass if we want exact market-specific `Sprint / Veloce / Intensa / Tributo Italiano / Super Sport` splits instead of the broader grouped variants used here.
- Tonale wheel images are still sparse because the verified OEM-part sources were better for specs than for image assets.

## Recommended Next Alfa Pass

1. Add `Junior` from official product-guide sources.
2. Decide whether Alfa scope should expand into broader Mopar-covered heritage families.
3. Add provenance fields if we want every promoted Alfa row to retain exact source URLs and verification timestamps in-DB instead of only in notes / reports.

## Files

- Mutation: `/Users/GABRIEL/oemwdb-convex/convex/alfaRomeoNavigation.ts`
- Source strategy: `/Users/GABRIEL/oemwdb-convex/reports/alfa-romeo-source-strategy-2026-03-11.md`
