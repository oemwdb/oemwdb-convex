# Alfa Romeo Rebuild Report

Date: 2026-03-11

## Result

- Alfa Romeo vehicles: 3
- Alfa Romeo vehicle variants: 3
- Alfa Romeo wheels: 33
- Alfa Romeo wheel variants: 33
- Alfa Romeo wheel-to-vehicle links: 33
- Alfa Romeo vehicle-variant-to-wheel-variant links: 33
- Exact duplicate Alfa wheel rows deleted: 66

## What Changed

- Collapsed the triplicated live Alfa wheel imports from 99 rows down to 33 canonical wheels.
- Promoted one wheel variant per unique workshop wheel row because `ws_alfa_romeo_wheel_variants` is empty.
- Normalized live wheel business ids/slugs from raw UUIDs to readable Alfa slugs.
- Preserved workshop UUIDs in `oem_wheels.uuid`.
- Backfilled wheel metadata from workshop rows:
  - part numbers
  - diameter
  - width
  - finish/color
  - image URL
  - source metadata in `specifications_json`
- Linked each canonical wheel to its Alfa vehicle family using the workshop `variant_id` family hint.
- Created `All` vehicle variants for:
  - Giulia
  - Stelvio
  - 4C
- Linked each wheel variant to the corresponding `All` vehicle variant.
- Patched Alfa vehicle rows with:
  - production years
  - body type
  - drive type
  - aggregated wheel diameter coverage
  - aggregated wheel width coverage

## Important Source Constraint

The Alfa workshop source does **not** provide a separate wheel-variant table.

That means Alfa wheel variants were reconstructed from `ws_alfa_romeo_wheels` itself. In practice, each unique workshop wheel row became:

- 1 canonical `oem_wheels` row
- 1 `oem_wheel_variants` row

This is the safest structure available from the source without inventing fake higher-level wheel families.

## Verified End State

- exact duplicate wheel business-id groups: 0
- wheels missing images: 0
- wheels missing wheel variants: 0
- wheels missing vehicle links: 0
- wheel variants without vehicle-variant links: 0

## Remaining Ambiguities

Three part numbers still collide across distinct Alfa wheel rows:

- `6ME44UDBAA`
  - Silver painted Stelvio row
  - Hyper silver Stelvio row
- `6RA91UDCAA`
  - Silver painted Stelvio row
  - Grey painted Stelvio row
- `6CP07U90AA`
  - 18-inch dark grey Giulia row
  - 19-inch hyper silver Giulia row

These were **not** merged because the current source itself presents them as distinct finished wheels.

Two Alfa wheel rows also have no part number in the source:

- `ALY58195U 4C Painted`
- `ALY58196U 4C Painted`

## Recommended Next Verification Pass

Use targeted Mopar / Alfa parts lookups only for:

- the 3 part-number collision pairs above
- the 2 4C wheels with missing part numbers
- exact bolt pattern / center bore verification if you want measurement completeness beyond the workshop source

## Files

- Admin mutation: `/Users/GABRIEL/oemwdb-convex/convex/alfaRomeoRebuild.ts`
- Audit plan: `/Users/GABRIEL/oemwdb-convex/reports/alfa-romeo-wheel-audit-plan-2026-03-11.md`
