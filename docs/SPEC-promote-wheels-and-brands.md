# Spec: Promote Wheels & Wheel–Brand Junctions

Cursor just implemented the Mercedes UUID→oem_wheel map fix and wheelsGetByTitle query.
Here's what was done:
- wheelsGetByTitle(title) added to queries.ts
- ws_mercedes_wheels added to getWsRows
- promote-wheel-variants.ts now builds a UUID→oem_id map via title matching for Mercedes

Your tasks in order:

## 1. DEPLOY AND TEST MERCEDES
- Deploy: `CONVEX_DEPLOYMENT=dev:stoic-warthog-770 npx convex deploy --yes`
- Run: `npx tsx scripts/promote-wheel-variants.ts`
- Check log for "Mercedes UUID→oem_wheel map: N entries"
- Check ws_mercedes_wheel_variants shows promoted > 0
- If titles don't match exactly, add case-insensitive normalization to the map lookup
- Keep fixing until mercedes promotes > 0

## 2. PROMOTE GROUP A WHEELS INTO oem_wheels
Group A brands (porsche, vw, audi, lamborghini, ferrari, jaguar, land_rover, 944racing, alfa_romeo, fiat) have wheels only in ws_[brand]_wheels, not in oem_wheels yet.

Write **scripts/promote-ws-wheels.ts**:
- Reads ws_[brand]_wheels for each Group A brand
- Parses data JSON: expects fields like id, title, description, image_url, good_pic_url, brand etc
- For each row, check if oem_wheels already has a record with id = csvRow.id (via wheelsGetByOldId) — skip if exists
- If not found, insert into oem_wheels via a new mutation: `migrations:insertOemWheel({ id, wheel_title, good_pic_url, image_source, is_oem, is_visible, slug })`
- After inserting, also populate j_wheel_brand junction if brand can be matched
- Batch 10 at a time, log per brand: inserted X, skipped Y, errors Z
- Deploy any new mutations needed first

## 3. ONCE GROUP A WHEELS ARE IN oem_wheels
Run promote-wheel-variants.ts again — Group A variants should now find their parent wheels and promote successfully

## 4. POPULATE j_wheel_brand FOR MERCEDES WHEELS
Write **scripts/promote-wheel-brands.ts**:
- For each brand's ws_[brand]_wheels table
- Find oem_wheel by old id or title
- Find oem_brand by brand name (case-insensitive match on brand_title)
- Insert j_wheel_brand if not exists
- Use a new mutation: `migrations:insertWheelBrandJunction({ wheel_id, wheel_title, brand_id, brand_title })`

---

Work through these sequentially. Use @db-agent for any convex/ changes and @scripts-agent for script work. Deploy between each step.

Report back when wheel_variants and j_wheel_brand start showing data in the dashboard.
