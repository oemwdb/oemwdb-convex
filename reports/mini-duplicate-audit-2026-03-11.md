# MINI Duplicate Audit

Date: 2026-03-11T11:40:47.699Z
Snapshot: `/tmp/convex-export-mini-final-2026-03-11.zip`

## Summary

- MINI wheel rows: 145
- Likely canonical rows: 145
- Exact duplicate business-id groups: 0
- Exact duplicate business-id rows: 0
- Simplified duplicate groups: 1
- Duplicate part-number groups: 20
- `-wheels-wheels` suffix rows: 0
- Hashed legacy rows: 0
- `bmw_mini-*` shadow rows: 0
- Rows with zero vehicle links: 50
- Rows with zero wheel variants: 10

## What The Duplicate Problem Actually Is

- Exact cloned rows exist in production with the same business `id` repeated multiple times.
- Canonical MINI rows are often shadowed by a `-wheels-wheels` sibling plus one or more hashed legacy imports.
- BMW/MINI part-number shadow rows (`bmw_mini-*`) duplicate canonical MINI rows and often carry the same part-number set.
- Some part numbers are shared across multiple named wheel rows, which means duplicate cleanup cannot be done by part number alone.

## Highest-Risk Exact Duplicate Clusters



## Highest-Risk Simplified ID Clusters

- `mini-494-loop-spoke-wheels` (2)
  - `mini-494-loop-spoke-silver-wheels` | MINI 494 Loop Spoke Silver | pn: 36116855103 | links: 2 | variants: 0
  - `mini-494-loop-spoke-wheels` | Mini 494 Loop Spoke Wheels | pn: 36116855103 | links: 2 | variants: 2

## Highest-Risk Part Number Collisions

- `36109804376` (2)
  - `mini-958-slide-spoke-wheels` | Mini 958 Slide Spoke Wheels | pn: 36109804376 | links: 1 | variants: 1
  - `mini-r127-5-star-double-spoke-wheels` | Mini R127 5-Star Double Spoke Wheels | pn: 36109803727, 36109804376 | links: 2 | variants: 1

- `36116855108` (2)
  - `mini-499-cosmos-spoke-wheels` | Mini 499 Cosmos Spoke Wheels | pn: 36116855108 | links: 1 | variants: 1
  - `mini-500-tentacle-spoke-wheels` | Mini 500 Tentacle Spoke Wheels | pn: 36116855108, 36116856099 | links: 1 | variants: 1

- `36116799229` (2)
  - `mini-504-vanity-spoke-wheels` | Mini 504 Vanity Spoke Wheels | pn: 36116799229, 36116855113 | links: 0 | variants: 1
  - `mini-r130-twin-blade-spoke-wheels` | Mini R130 Twin Blade Spoke Wheels | pn: 36116799229 | links: 1 | variants: 1

- `36116856045` (2)
  - `mini-833-v-spoke-wheels` | Mini 833 V Spoke Wheels | pn: 36116856045 | links: 1 | variants: 1
  - `mini-518-vent-spoke-wheels` | Mini 518 Vent Spoke Wheels | pn: 36116856045 | links: 1 | variants: 1

- `36109809485` (2)
  - `mini-988-eternal-spoke-wheels` | Mini 988 Eternal Spoke Wheels | pn: 36109809485 | links: 1 | variants: 1
  - `mini-r139-y-spoke-wheels` | Mini R139 Y Spoke Wheels | pn: 36109809485 | links: 2 | variants: 1

- `36116855114` (2)
  - `mini-r111-star-bullet-wheels` | Mini R111 Star Bullet Wheels | pn: 36116784124, 36116855114 | links: 0 | variants: 1
  - `mini-505-multi-spoke-wheels` | Mini 505 Multi Spoke Wheels | pn: 36116855114 | links: 1 | variants: 1

- `36116856033` (2)
  - `mini-533-pin-spoke-wheels` | Mini 533 Pin Spoke Wheels | pn: 36116856033 | links: 2 | variants: 1
  - `mini-879-double-spoke-wheels` | Mini 879 Double Spoke Wheels | pn: 36116856033 | links: 1 | variants: 1

- `36116777356` (2)
  - `mini-r108-multi-spoke-wheels` | Mini R108 Multi Spoke Wheels | pn: 36116777356, 36116791464 | links: 0 | variants: 1
  - `mini-r108-multispoke-wheels` | Mini R108 Multispoke Wheels | pn: 36116777356 | links: 0 | variants: 1

- `36109803727` (2)
  - `mini-r127-5-star-double-spoke-wheels` | Mini R127 5-Star Double Spoke Wheels | pn: 36109803727, 36109804376 | links: 2 | variants: 1
  - `mini-532-pair-spoke-wheels` | Mini 532 Pair Spoke Wheels | pn: 36109803727, 36116856032 | links: 2 | variants: 1

- `36116855103` (2)
  - `mini-494-loop-spoke-silver-wheels` | MINI 494 Loop Spoke Silver | pn: 36116855103 | links: 2 | variants: 0
  - `mini-494-loop-spoke-wheels` | Mini 494 Loop Spoke Wheels | pn: 36116855103 | links: 2 | variants: 2

- `36116784130` (2)
  - `mini-r113-wheels` | Mini R113 Wheels (36116784130) | pn: 36116784130 | links: 0 | variants: 0
  - `mini-r112-cross-spoke-challenge-wheels` | Mini JCW R112 Cross Spoke Challenge Wheels | pn: 36116784130, 36116795208 | links: 0 | variants: 2

- `36105A31927` (2)
  - `mini-900-pulse-spoke-wheels` | Mini 900 Pulse Spoke Wheels | pn: 36105A31927 | links: 0 | variants: 1
  - `mini-959-night-flash-spoke-wheels` | Mini 959 Night Flash Spoke Wheels | pn: 36105A31927 | links: 1 | variants: 1

- `36116775686` (2)
  - `mini-r98-web-spoke-2pc-wheels` | Mini R98 Web Spoke 2pc Wheels | pn: 36116775686 | links: 0 | variants: 1
  - `mini-r98-web-spoke-wheels` | Mini R98 Web Spoke Wheels | pn: 36116775686, 36116787710 | links: 0 | variants: 1

- `36106874569` (2)
  - `mini-896-y-spoke-wheels` | Mini 896 Y Spoke Wheels | pn: 36106874569 | links: 1 | variants: 1
  - `mini-531-channel-spoke-wheels` | Mini 531 Channel Spoke Wheels | pn: 36106874569 | links: 2 | variants: 1

- `36105A72875` (2)
  - `mini-985-slide-spoke-wheels` | Mini 985 Slide Spoke Wheels | pn: 36105A72875 | links: 1 | variants: 1
  - `mini-521-star-spoke-wheels` | Mini 521 Star Spoke Wheels | pn: 36105A72875, 36116856053 | links: 1 | variants: 1

- `36116856059` (2)
  - `mini-528-bridge-spoke-wheels` | Mini 528 Bridge Spoke Wheels | pn: 36116856059 | links: 1 | variants: 1
  - `mini-r90-cross-spoke-2pc-wheels` | Mini R90 Cross Spoke 2pc Wheels | pn: 36116777969, 36116856059 | links: 0 | variants: 1

- `36105A72838` (2)
  - `mini-983-parallel-spoke-wheels` | Mini 983 Parallel Spoke Wheels | pn: 36105A72838 | links: 1 | variants: 1
  - `mini-r116-infinite-spoke-wheels` | Mini R116 Infinite Spoke Wheels | pn: 36105A72838, 36116795455 | links: 1 | variants: 1

- `36116787710` (2)
  - `mini-875-profile-spoke-wheels` | Mini 875 Profile Spoke Wheels | pn: 36116787710 | links: 1 | variants: 1
  - `mini-r98-web-spoke-wheels` | Mini R98 Web Spoke Wheels | pn: 36116775686, 36116787710 | links: 0 | variants: 1

- `36116795208` (2)
  - `mini-r112-wheels` | Mini R112 Wheels (36116795208) | pn: 36116795208 | links: 0 | variants: 0
  - `mini-r112-cross-spoke-challenge-wheels` | Mini JCW R112 Cross Spoke Challenge Wheels | pn: 36116784130, 36116795208 | links: 0 | variants: 2

- `36109803725` (2)
  - `mini-r123-5-hole-circular-spoke-wheels` | Mini R123 5 Hole Circular Spoke Wheels | pn: 36109803725 | links: 2 | variants: 1
  - `mini-r125-tunnel-spoke-wheels` | Mini R125 Tunnel Spoke Wheels | pn: 36109803725, 36109804373 | links: 2 | variants: 1

## Recommended Non-Destructive Cleanup Controls

- Add `canonical_wheel_id` plus `duplicate_of_wheel_id` or a dedicated wheel-alias junction.
  This lets us collapse hashed rows, `bmw_mini-*` shadow rows, and `-wheels-wheels` suffix rows without deleting source history.
- Add a row state like `record_status` or `visibility_status`.
  We need to suppress shadow rows from user-facing queries while preserving them for provenance and rollback.
- Add provenance fields: `source_system`, `source_record_id`, `source_url`, and `verification_status`.
  The current duplicate classes line up almost exactly with source origin, but that distinction is not modeled.
- Add a canonical-part-number junction or supersession model.
  Some apparent duplicates are really multi-part-number style rows or superseded part-number rows, so normalization needs first-class part-number relationships.

## Practical Next Step

- Build a MINI wheel dedupe pass that marks canonical rows and suppresses shadow rows in queries, without deleting any records.
