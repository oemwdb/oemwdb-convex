# Alfa Romeo Legacy Additive Pass

Date: 2026-03-11

## Summary

This pass extended Alfa Romeo beyond the modern `4C / Giulia / Stelvio / Tonale` set without using `wheel-size.com`.

Source stack used in this pass:

- Official Stellantis technical-information coverage tables:
  - `https://www.technicalinformation.fiat.com/tech-info-web/web/pageLarge.do?id=343`
  - `https://www.technicalinformation.fiat.com/tech-info-web/web/pageLarge.do?id=344`
  - `https://www.technicalinformation.fiat.com/tech-info-web/web/pageLarge.do?id=467`
- Official Alfa Romeo / Stellantis media and price-list material for legacy wheel-package descriptions and tire sizes.

## Live Result

- Alfa vehicles: `17`
- Alfa wheels: `58`
- Added in this pass:
  - `13` vehicles
  - `27` vehicle variants
  - `37` wheel families
  - `37` wheel variants

## Vehicles Added

- Alfa Romeo 145
- Alfa Romeo 146
- Alfa Romeo 147
- Alfa Romeo 155
- Alfa Romeo 156
- Alfa Romeo 159
- Alfa Romeo 166
- Alfa Romeo GTV / Spider
- Alfa Romeo GT
- Alfa Romeo Brera / Spider
- Alfa Romeo MiTo
- Alfa Romeo Giulietta
- Alfa Romeo 8C Competizione / Spider

## Wheel Coverage Added

Legacy wheel families were added from official package descriptions rather than third-party fitment tables. This means the data is navigable and source-backed, but still thinner than the modern Alfa rows.

Examples:

- 145: 14-inch, 15-inch, Junior 15-inch
- 146: 14-inch, 15-inch, Junior / ti 15-inch
- 147: 15-inch, 16-inch, 17-inch, Blackline 18-inch
- 156: 15-inch, 16-inch
- 166: 16-inch, 17-inch, 18-inch
- GTV / Spider: 16-inch, 17-inch
- GT: 16-inch, 17-inch, 18-inch
- Brera / Spider: 17-inch Sport, 17-inch Supersport, 18-inch Supersport
- MiTo: 15-inch, 16-inch, 17-inch, 18-inch
- Giulietta: 16-inch, 17-inch, 18-inch QV
- 8C: standard 20-inch, Racing titanium double-spoke 20-inch

## What Is Good Now

- Alfa brand navigation is no longer limited to the modern 4-model subset.
- Legacy Alfa models now have vehicle rows, vehicle variants, wheel families, wheel variants, and fitment junctions.
- The pass was additive and non-destructive.
- Modern Alfa rows from the earlier cleanup were left intact.

## Remaining Gaps

These still need a stronger non-`wheel-size.com` source before another live pass:

- `33`
- `75`
- `164`
- `Junior`

These are the main data-quality gaps still left on legacy Alfa:

- missing official part numbers for most legacy wheels
- sparse images for legacy wheels
- sparse width / offset / bolt pattern / center-bore coverage on legacy rows
- some legacy fitment is still wheel-package level rather than exact year-engine-market granularity

## Recommendation

Next Alfa pass should stay on the same source policy:

1. keep official Stellantis technical-information pages as the vehicle-scope source
2. keep official Stellantis media / listino / technical-spec PDFs as the wheel-package source
3. do targeted searches only for the unresolved legacy families (`33`, `75`, `164`, `Junior`) and for missing part numbers / images / exact offsets
