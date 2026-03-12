# Alfa Romeo Wheel Audit Plan

Date: 2026-03-11

## Current State

- `oem_wheels` rows under Alfa Romeo: 99
- `oem_wheel_variants` rows under Alfa Romeo: 0
- `ws_alfa_romeo_wheels` rows: 165
- `ws_alfa_romeo_wheel_variants` rows: 0

## What The Duplicate Problem Actually Is

- Alfa Romeo is not showing the same mixed duplicate classes as MINI.
- The dominant issue is one triplicated import pattern:
  - 33 exact duplicate business-id groups
  - each group has 3 rows
  - 99 live Alfa wheel rows = 33 unique source ids imported 3 times each
- The Alfa wheel business `id` values are raw workshop/source UUIDs, not canonical wheel ids.
- The promoted Alfa wheel rows are almost empty structurally:
  - no wheel variants
  - no vehicle links
  - `text_diameters`, `text_widths`, `text_colors`, and image fields are blank on all 33 canonical source ids checked

## What The Source Is Telling Us

`ws_alfa_romeo_wheels` already contains variant-like fields inside the wheel rows themselves:

- `variant_id`
- `size`
- `front_width`
- `rear_width`
- `front_offset`
- `rear_offset`
- `finish`
- `part_number`
- image URL (`good_pic_url` or `src_url`)

`ws_alfa_romeo_wheel_variants` is empty, so the source never split wheels from wheel variants for us.

## Important Risk

Do not treat part number alone as the canonical key.

The raw Alfa source already has real collisions where the same part number appears across different marketed wheel rows, usually finish-level variants:

- `6RA91UDCAA`
  - `ALY58168U35/58187 Stelvio Grey Painted`
  - `ALY58168U20/58187 Stelvio Silver Painted`
- `6ME44UDBAA`
  - `ALY58174U20/58188 Stelvio Silver Painted`
  - `ALY58174U77/58188 Stelvio Hyper Silver`
- `6CP07U90AA`
  - `ALY58161 Giulia Grey Painted`
  - `ALY58162U77 Giulia Hyper Silver`

So Alfa has both:

- bad duplicate rows from repeated import
- real finish/size distinctions hiding inside the raw wheel source

## Recommended Cleanup Plan

### Phase 1: Build The Whole Picture First

Do **not** start by deleting live Alfa rows only.

First reconstruct a staged canonical view from:

1. `ws_alfa_romeo_wheels`
2. current live `oem_wheels`
3. targeted external verification for ambiguous rows only

Why:

- live Alfa is only 33 unique source ids right now
- raw workshop staging has 165 rows
- if we delete before reconciling, we risk preserving the wrong 33

### Phase 2: Separate Exact Duplicates From Real Variants

Use these rules:

- exact duplicate class:
  - same source UUID / same title / same part number / same size / same finish
  - safe to collapse aggressively
- candidate wheel-style variant class:
  - same Hollander/style family or shared title stem
  - different finish and/or size and/or width
  - should become wheel variants, not deleted duplicates
- ambiguous collision class:
  - same part number but different title/finish/size
  - hold for verification before merge

### Phase 3: Create Canonical Style Keys

For Alfa, the best first-pass canonical wheel key is not the UUID.

Use a staged key built from:

- Hollander/style token from title, e.g. `ALY58174`
- model family from `variant_id`, e.g. `giulia`, `stelvio`, `4c`
- size / width
- finish

That lets us answer:

- which rows are the same wheel duplicated 3 times
- which rows are front/rear or finish variants of the same wheel family

### Phase 4: Populate Wheel Variants From The Raw Wheel Table

Because `ws_alfa_romeo_wheel_variants` is empty, variant generation has to come from `ws_alfa_romeo_wheels`.

Recommended mapping:

- `oem_wheels`
  - canonical style/family row
- `oem_wheel_variants`
  - size
  - width
  - finish/color
  - part number
  - front/rear fitment note if applicable

This is the main structural fix Alfa needs.

### Phase 5: Use External Sources Selectively, Not As A Full Rebuild

A single “better source” does not replace the current one cleanly.

Best approach:

- keep the current Hubcap Haven-style source as the dense spec feed
  - it has size, finish, fitment hints, images, and Hollander-style product ids
- use targeted Mopar / Alfa parts pages to verify:
  - part existence
  - part descriptions
  - part supersession / replacement hints
- use targeted page searches only for rows where:
  - same part number maps to multiple finishes/sizes
  - fitment is unclear
  - width/size/front-rear pairing is suspicious
  - image/spec fields are missing

So the answer is:

- **not** “full merge from a better source first”
- **not** “randomly patch gaps one by one first”
- build a staged whole picture from the current raw source, then fill only the ambiguous gaps with targeted searches

## Recommended Execution Order

1. snapshot current Alfa live + workshop rows
2. derive 33 unique live source ids from the 99 rows
3. diff those 33 against all 165 raw workshop rows
4. build candidate canonical wheel families from raw titles
5. mark exact triplicates for collapse
6. mark finish/size rows as candidate wheel variants
7. verify ambiguous part-number collisions with targeted external checks
8. write/import `oem_wheel_variants`
9. only then delete the redundant exact duplicate live wheel rows

## Conclusion

For Alfa Romeo, the right move is:

- whole-picture reconciliation first
- exact duplicate deletion second
- targeted searches only for ambiguous collisions

If we skip the reconstruction step and delete against the current live table now, we will almost certainly preserve an incomplete and structurally wrong Alfa set.
