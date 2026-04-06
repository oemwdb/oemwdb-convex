# OEMWDB Agent Rules

## private_blurb Field Usage

The `private_blurb` field serves as an **inter-agent context handoff** for each item (brand, vehicle, or wheel). When working on an item, agents MUST:

1. **Read the existing `private_blurb`** to understand prior work, known issues, or pending tasks
2. **Update the field** with relevant status notes, data quality flags, or context that future agents need

### Example Content:
```
Last audited: 2024-12-24 | Specs verified via alloywheelsdirect.net
Missing: good_pic_url upgrade needed
Note: Part numbers include color variants - verified against BMW catalog
```

### Purpose:
This creates persistent context that survives across separate AI sessions, enabling continuity without requiring full re-investigation of each item's history.

## Repo-Specific Rules: oemwdb-convex

This repo is the live site app. Optimize for stable runtime behavior, clean admin tooling, and predictable Convex publishes.

### Provider / Auth Rules

1. Mount exactly one Clerk provider tree.
2. Do not force-remount auth/provider wrappers with `key=` just to refresh state.
3. If backend selection changes, swap the active Convex client, not the Clerk tree.
4. Keep public and non-admin browsing pinned to the control backend unless a deliberate product decision says otherwise.

### Convex Rules

1. Prefer stable, explicit browser-facing query modules over scattered ad hoc public functions.
2. After backend changes that affect the site, always run:
   - `npx convex codegen`
   - `npx convex dev --once`
   - `npm run build`
3. If the browser says a public function is missing, assume publish drift first and verify deployment before rewriting frontend logic.
4. Do not add UI fallback spaghetti to compensate for an unpublished or broken Convex function.

### React / Page Stability Rules

1. Never put hooks behind branches or after early returns.
2. If a page has loading/error/not-found branches, declare hooks first and branch in JSX.
3. Keep render shape stable between loading and loaded states.
4. If a page flickers, white-screens, or “glitches,” check hook order and provider structure before blaming Convex.

### Data / UI Contract Rules

1. Fix data at the source when possible; do not make the UI permanently accept broken data.
2. Denormalized text fields such as `text_diameters`, `text_widths`, `text_colors`, and `text_tire_sizes` are display caches and should stay in sync with source/junction tables.
3. The site should read the normalized fields and render them simply, not invent extra parsing layers unless there is a temporary migration need.
4. Reuse proven display patterns instead of creating near-duplicate custom versions.

### Admin UX Rules

1. Admin-only controls must be gated by both admin status and dev mode where appropriate.
2. Right-side admin header buttons should open right-side panels, matching the established mirrored layout pattern.
3. Inline admin CRUD must write to Convex directly; no local-only pretend state for real editing flows.
4. When adding dangerous admin modes, show a persistent visible indicator.

### Verification Rules

1. Before finishing work, verify the actual route or surface you changed.
2. Treat `npm run build` as required, not optional.
3. If a crash still happens, preserve a copyable error payload before making more changes.
