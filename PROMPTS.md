# OEMWDB Modular Agent Prompts

These prompts are designed to be self-contained processes. Every process MANDATES a `private_blurb` read/update loop to ensure inter-agent continuity.

---

## 1. Discovery & Entry (Active Search)
**Use when:** Finding and adding new wheel styles or vehicles that don't exist in our DB yet.

```markdown
Objective: Discover and add new [Brand] wheel styles.
Process:
1. Read existing styles for [Brand] in DB to avoid duplicates.
2. Search [Target Source, e.g., alloywheelsdirect.net] for styles we are missing.
3. For each new style found:
   - **CRITICAL:** Search specifically for the official "Style Number" (e.g., "Style 767" or "MINI 982").
   - Use the Style Number in the `wheel_title`.
   - Create a new record with all available specifications.
   - **IMPORTANT:** Ensure `brand_ref` is an ARRAY (e.g. `['Mini']`), NOT a string.
   - Initialize `private_blurb` with: "Created: [Date] | Found via [Source] | Initial specs populated."
4. If specs are partial, note the specific missing fields in the blurb for the next agent.
```

---

## 2. Deep Verification Audit (Confirmation)
**Use when:** Verifying existing data against a source of truth to reach "Gold Standard" status.

```markdown
Objective: Verify [Item Title] against official catalogs.
Process:
1. Read existing `private_blurb` for [Item Title] to see prior verification attempts.
2. Cross-reference all fields (PCD, Offset, Width, Part Numbers) against [Official Catalog].
3. If mismatches found:
   - Correct the data.
   - Note the correction in `private_blurb`.
4. Update blurb: "Verified: [Date] | Source: [Catalog URL] | All specs confirmed 100% accurate."
```

---

## 3. The "Missing" Hunt (Deep Research)
**Use when:** An item is already in the DB but is missing critical fields like Part Numbers or High-Res images.

```markdown
Objective: Fill missing [Fields] for [Item Title].
Process:
1. Read existing `private_blurb` to see where previous agents already searched.
2. Perform targeted searches on sites NOT already documented in the blurb.
3. If found:
   - Update the fields.
   - Update blurb: "Audit [Date]: Found [Fields] via [New Source]."
4. If NOT found:
   - Update blurb: "Audit [Date]: Searched [Site A, Site B] for [Fields] - No results found. Requires [VIN/Dealer/Etc]."
   - CRITICAL: Document identifying info found during the search to help the next agent.
```

---

## 4. Relationship Audit (Vehicle-to-Wheel)
**Use when:** Auditing vehicle specifications to ensure they correctly link to corresponding wheels.

```markdown
Objective: Audit specs for [Vehicle Title] to enable wheel matching.
Process:
1. Read `private_blurb` for the vehicle.
2. Verify `bolt_pattern_ref` and `center_bore_ref` against [Source].
3. Update vehicle record.
4. Update blurb: "Audit [Date]: Specs verified. Vehicle now correctly matches wheels with [Spec]."
```
