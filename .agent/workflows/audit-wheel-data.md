---
description: Audit and verify wheel data completeness and accuracy
---

# OEMWDB Wheel Data Audit

Run this workflow to verify all wheel data is complete, accurate, and consistently formatted.

## Quick Start Prompt

Copy and paste this to start an audit:

```
Run a complete audit of the OEMWDB wheel data. Check for:
1. Missing specifications (diameter, width, offset, bolt pattern, center bore)
2. Missing or incomplete part numbers
3. Inconsistent formatting (diameter tags should be "## in" format)
4. Vehicle relations (vehicles need bolt_pattern_ref and center_bore_ref to match)
5. Missing or poor quality images (bad_pic_url vs good_pic_url)
6. Missing color data

For any issues found, provide a summary and offer to fix them via batch update scripts.
```

---

## Detailed Audit Steps

### 1. Run Master Audit Script
```bash
node audit_parts_variants.mjs
```
This checks:
- Part numbers coverage (should be 100%)
- Sample format verification

### 2. Check Specification Completeness
```bash
node list_missing_diameter.mjs
node audit_mini_specs.mjs
```
All wheels should have:
- `diameter_ref` (format: `["17 in", "18 in"]`)
- `width_ref` (format: `["7J", "7.5J"]`)
- `wheel_offset` (format: `"ET47"`)
- `bolt_pattern_ref` (format: `["5x112"]`)
- `center_bore_ref` (format: `["66.6mm"]`)

### 3. Verify Tag Formatting Rules

| Field | Correct Format | Incorrect Examples |
|-------|---------------|-------------------|
| Diameter | `["17 in"]` | `["17"]`, `["17 inch"]`, `["17, 18 in"]` |
| Width | `["7J"]` | `["7"]`, `["7.0J"]` |
| Bolt Pattern | `["5x112"]` | `["5×112"]`, `["5 x 112"]` |
| Center Bore | `["66.6mm"]` | `["66.6"]`, `["66.6 mm"]` |
| Offset | `"ET47"` | `"47"`, `"ET 47"` |

### 4. Check Vehicle Relations
```bash
node check_mini_vehicles.mjs
```
Vehicles must have `bolt_pattern_ref` and `center_bore_ref` populated for spec-based matching.

### 5. Verify Image Coverage
Check for wheels with:
- Missing `good_pic_url` (high quality image)
- Only `bad_pic_url` (needs replacement)

---

## Fix Scripts Reference

| Issue | Fix Script |
|-------|-----------|
| Add " in" suffix to diameters | `add_inch_suffix.mjs` |
| Fill missing specs by style code | `smart_fill_mini_v2.mjs` |
| Update part numbers | `update_part_numbers.mjs` |
| Fix vehicle specs | `fix_mini_vehicles.mjs` |
| Clean messy tags | `clean_rr_tags.mjs` |

---

## Expected Audit Results (Healthy State)

```
=== PART NUMBERS AUDIT ===
MINI Wheels Total: 88
With Part Numbers: 88
Missing Part Numbers: 0

=== SPECIFICATION COVERAGE ===
Diameter: 100%
Width: 100%
Offset: 100%
Bolt Pattern: 100%
Center Bore: 100%

=== VEHICLE RELATIONS ===
All vehicles have specs: ✓
```
