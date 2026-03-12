# MINI Data Backfill Report

Date: 2026-03-10T20:01:20.199Z
Mode: APPLY
Snapshot: `/tmp/convex-export.zip`
Post-run export: `/tmp/convex-export-mini-post.zip`

## Summary

- Legacy MINI vehicle rows normalized: 10
- New MINI vehicle rows inserted: 3
- MINI wheel rows updated: 393
- New MINI wheel rows inserted: 1
- MINI wheel-to-vehicle links added: 364
- MINI wheel variants promoted: 124
- MINI vehicle variants promoted: 98
- Verified post-run MINI vehicles: 13
- Verified post-run MINI wheels: 420
- Verified post-run MINI wheel variants: 124
- Verified post-run MINI vehicle variants: 98
- Remaining MINI wheel rows with zero verified vehicle links: 150

## Current Model Shape

- Production MINI family rows targeted: 13
- Workshop MINI vehicles deduped: 19
- Workshop MINI vehicle variants deduped: 98
- Workshop MINI wheel styles deduped: 113
- Workshop MINI wheel variants deduped: 124

## Post-Run Notes

- Vehicle-level `text_bolt_patterns` and `text_center_bores` were manually overridden to verified family defaults after the backfill.
  Existing legacy `j_wheel_vehicle` rows still contain old noisy links, and the user explicitly asked for no deletions.
- The remaining 150 zero-link wheel rows are mostly duplicate part-number imports, archived MINI rows, or unresolved JCW-specific rows rather than untouched canonical MINI workshop styles.

## Remaining Wheel Rows Without Verified Workshop Match

Count: 26

- `mini-1041-double-spoke-jcw-wheels` | MINI 1041 Double Spoke (JCW) 
- `mini-r95-star-spoke-jcw-wheels` | MINI R95 Star Spoke (JCW)
- `mini-563-cup-spoke-jcw-wheels` | MINI 563 Cup Spoke (JCW)
- `mini-501-track-spoke-silver-jcw-wheels` | MINI 501 Track Spoke Silver (JCW)
- `mini-534-double-spoke-jcw-wheels` | MINI 534 Double Spoke (JCW)
- `mini-901-spoke-jcw-wheels` | MINI 901 Spoke (JCW)
- `mini-991-star-spoke-jcw-wheels` | MINI 991 Star Spoke (JCW) 
- `minilite-wheels` | Minilite
- `mini-510-double-spoke-jcw-wheels` | MINI 510 Double Spoke (JCW)
- `mini-902-circuit-spoke-jcw-wheels` | MINI 902 Circuit Spoke (JCW)
- `mini-562-track-spoke-jcw-wheels` | MINI 562 Track Spoke (JCW)
- `mini-506-cross-spoke-jcw-wheels` | MINI 506 Cross Spoke (JCW)
- `mini-964-rallye-spoke-wheels` | MINI 964 Rallye Spoke
- `mini-525-60-year-spoke-wheels` | MINI 525 60 Year Spoke
- `mini-962-star-spoke-jcw-wheels` | MINI 962 Star Spoke (JCW)
- `mini-498-race-spoke-jcw-wheels` |  MINI 498 Race Spoke (JCW)
- `mini-949-flag-spoke-jcw-wheels` | MINI 949 Flag Spoke (JCW)
- `mini-r112-cross-spoke-challenge-wheels` | MINI R112 Cross Spoke Challenge 
- `mini-509-cup-spoke-jcw-wheels` | MINI 509 Cup Spoke (JCW)
- `mini-986-lap-spoke-jcw-wheels` | MINI 986 Lap Spoke (JCW)
- `mini-945-y-spoke-jcw-wheels` | MINI 945 Y Spoke (JCW)
- `mini-r107-gp-wheels-wheels` | MINI R107 GP Wheels 
- `mini-r109-double-spoke-wheels` | MINI R109 Double Spoke 
- `mini-957-sprint-spoke-jcw-wheels` | MINI 957 Sprint Spoke (JCW)
- `mini-992-rallye-spoke-jcw-wheels` | MINI 992 Rallye Spoke (JCW) 
- `mini-989-lap-spoke-jcw-wheels` | MINI 989 Lap Spoke (JCW)

Most of these are JCW-specific or archived MINI rows that do not resolve through the current MINI workshop export or live AWD product pages.

## Suggested Schema / Admin Changes

- Add `vehicle_family_id` or a dedicated `oem_vehicle_families` table.
  MINI fitment naturally exists at both family scope (`F55/F56/F57`) and exact model scope (`F56 Hatch 3-Door`). The current model forces those into one table.
- Add row-level provenance fields like `source_system`, `source_record_id`, `source_url`, `verification_status`, and `verified_at`.
  This backfill had to combine workshop rows, BMW/MINI part-number rows, Supabase legacy junctions, and AWD product pages.
- Add fitment provenance / confidence on `j_wheel_vehicle`.
  Some links are direct legacy links, some are clean family links, and some model gaps remain unverified.
- Expose admin write support for immutable business ids or an alias table.
  Several preserved MINI legacy vehicle rows have misaligned `id` values that cannot be corrected through the deployed mutation surface.
- Expose create/write support for `oem_drive_types`, `oem_body_styles`, `oem_markets`, and the vehicle measurement junctions.
  MINI vehicle variants can be promoted today, but drivetrain/body-style references cannot be populated cleanly from the deployed API surface.
- Add a write path for `j_oem_vehicle_variant_wheel_variant`.
  It is the correct place to store verified trim-to-wheel-variant fitment once model-level MINI fitment sources are available.
