# MINI Wheel Dedupe Final

Date: 2026-03-11

## Result

- MINI wheel rows before cleanup: 420
- MINI wheel rows after cleanup: 145
- Wheel rows destroyed: 275
- MINI vehicle rows: 13
- MINI vehicle variant rows: 98
- MINI wheel variant rows: 154

## What Was Deleted

- 88 exact duplicate business-id shadow rows
- 24 `-wheels-wheels` suffix shadow rows
- 79 hashed legacy shadow rows
- 79 `bmw_mini-*` shadow rows
- 5 orphan `bmw_mini-*` rows after canonical promotion

## What Was Renamed

- 5 orphan hashed rows were promoted into real canonical MINI ids:
  - `mini-r105-crown-spoke-wheels`
  - `mini-r112-wheels`
  - `mini-r113-wheels`
  - `mini-r131-double-cross-wheels`
  - `mini-r136-wheels`
- `mini-r107-gp-wheels-wheels` was renamed to `mini-r107-gp-wheels`

## Verified End State

- Exact duplicate business-id groups: 0
- Exact duplicate business-id rows: 0
- `-wheels-wheels` suffix rows: 0
- Hashed legacy rows: 0
- `bmw_mini-*` shadow rows: 0
- Remaining simplified duplicate groups: 1
- Remaining duplicate part-number groups: 20
- MINI wheels with zero vehicle links: 50
- MINI wheels with zero wheel variants: 10

## Remaining Ambiguous Duplicate

The only remaining simplified duplicate cluster is:

- `mini-494-loop-spoke-wheels`
- `mini-494-loop-spoke-silver-wheels`

This is not the same duplicate class as the deleted rows. It is a style-level row plus a color-specific row sharing the same part number, so deleting one without a better model would risk collapsing a legitimate variant boundary.

## Fields And Junction Tables Still Needed

- `oem_wheel_aliases`
  Why: the deleted hashed ids and `bmw_mini-*` ids were source aliases, not real wheel entities. Storing them as aliases would prevent re-importing them as fresh wheel rows.
  Suggested columns: `wheel_id`, `alias_type`, `alias_value`, `source_system`, `source_record_id`.

- `wheel_style_id` on `oem_wheels` or a dedicated `oem_wheel_styles` table
  Why: the remaining `494 Loop Spoke` case is a style/family row plus a color-specific row. Right now the schema cannot represent “same wheel style, different marketed row” cleanly.
  Suggested minimum shape: `style_code`, `style_title`, `brand_id`.

- `j_part_number_supersession`
  Why: MINI/JCW part numbers can supersede or collide across style names. Part-number reuse is still the main reason duplicate cleanup cannot rely on part number alone.
  Suggested columns: `from_part_number_id`, `to_part_number_id`, `relationship_type`, `source_url`.

- `source_system`, `source_record_id`, `source_url`, `verification_status`, `verified_at`
  Why: the duplicate classes aligned almost exactly with source origin. Without provenance, workshop imports, AWD pages, and legacy dumps all look equally canonical.
  Best placement: `oem_wheels`, `oem_wheel_variants`, and fitment junction rows.

- `fitment_source_url`, `fitment_source_note`, `fitment_confidence`
  Why: wheel metadata is now cleaner than wheel-to-vehicle fitment. We still need a way to distinguish workshop-verified fitment from inferred or inherited links.
  Best placement: `j_wheel_vehicle` and `j_oem_vehicle_variant_wheel_variant`.

- `j_oem_vehicle_variant_wheel_variant` population path
  Why: exact MINI/JCW fitment belongs at variant level, not just wheel-to-vehicle family level. Several fitment gaps remain because only the coarse wheel/vehicle junction is easy to populate today.

## Operational Note

Future MINI imports should upsert against:

1. canonical wheel business id
2. wheel aliases
3. style code + part number

If imports continue to create wheels directly from raw source ids, the same hashed and `bmw_mini-*` mess will come back.
