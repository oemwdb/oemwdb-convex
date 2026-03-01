# Site audit: what works, what’s broken, what needs rebuilding

After the Supabase → Convex migration. Auth and image storage remain on Supabase by design.

---

## Working (Convex-backed)

| Area | Notes |
|------|--------|
| **Home** | Index page, search (useGlobalSearch), dashboard metrics (useHomeDashboardMetrics), wheel cards (useWheels). All Convex. |
| **Brands** | BrandsPage, BrandDetailPage use Convex (useBrands, useBrandDetail). |
| **Vehicles** | VehiclesPage uses useSupabaseVehicles → useVehicles (Convex). VehicleDetailPage uses useVehicleWithWheels (Convex). |
| **Wheels** | WheelsPage uses useSupabaseWheels → useWheels (Convex). WheelDetailPage, WheelItemPage use Convex hooks. |
| **Engines** | EnginesPage, EngineItemPage use useSupabaseEngines → Convex (enginesGetAll, enginesGetById, vehiclesGetByEngine). |
| **Search** | Global search (brands/vehicles/wheels) is Convex (useGlobalSearch). |
| **Profile “saved” read** | ProfilePage saved lists use useSavedBrands, useSavedVehicles, useSavedWheels (Convex read-only). |
| **Registered vehicles** | useRegisteredVehicles, useVehicleRegistration use Convex queries/mutations. |
| **Vehicle comments** | useVehicleComments (Convex). |
| **User table preferences** | useColumnOrder (Convex). |
| **Contribute form** | useContributeForm uses Convex mutations for brands/vehicles/wheels. |
| **Public profile** | usePublicProfile (profileGetByUsername) – Convex if profiles exist there; otherwise still Supabase. |

---

## Broken or inconsistent

### 1. Save (bookmark) button – **broken**

- **Where:** `SaveButton` used on brand/vehicle/wheel detail views.
- **Issue:** Writes to **Supabase** `saved_brands` / `saved_vehicles` / `saved_wheels`. App reads saved items from **Convex** (useSavedBrands, useSavedVehicles, useSavedWheels). Saves never show up.
- **Fix:** Add Convex mutations for saved items (e.g. `savedBrandLink`/`savedBrandUnlink` and equivalents for vehicles/wheels). Rebuild `SaveButton` to use Convex (need brand_id/vehicle_id/wheel_id as Convex `Id<>`, not Supabase row id).

### 2. Dev Tables page – **wrong backend**

- **Where:** `TablesPage` (`/dev/tables`).
- **Issue:** Uses `useSupabaseTable` and direct Supabase for **all** tables (oem_brands, oem_vehicles, oem_wheels, reference tables, users). Data for migrated tables now lives in Convex; this will show empty or stale.
- **Fix:** Use Convex for oem_* and reference tables. Either switch to `useAdvancedTable` for brands/vehicles/wheels and add Convex-backed tables for ref tables, or build a Convex-backed “dev tables” data source and keep Supabase only for `users` if still there.

### 3. Database record edit page – **wrong backend**

- **Where:** `DatabaseRecordPage` (`/dev/tables/:tableName/:recordId`).
- **Issue:** Fetches and updates the record via Supabase. For oem_brands, oem_vehicles, oem_wheels (and ref tables) data is in Convex; edits go to the wrong place or fail.
- **Fix:** For Convex-backed tables, load by business id (or Convex id) via Convex queries and update via Convex mutations. Keep Supabase only for non-migrated tables (e.g. users).

### 4. EditableDataTable cell updates – **wrong backend**

- **Where:** `EditableDataTable` (used from TablesPage).
- **Issue:** Calls Supabase to update cells. Migrated tables are in Convex.
- **Fix:** When table is a Convex table, call Convex update mutations (brandsUpdate, vehiclesUpdate, wheelsUpdate, etc.) instead of Supabase.

### 5. Premium market listings (home) – **different backend, OK for now**

- **Where:** `PremiumMarketListings` on home.
- **Issue:** Uses TanStack Query + Supabase `market_listings`. Convex has `market_listings` schema and `userListingsGetByUser`; listing lists may still be Supabase.
- **Status:** Works if `market_listings` is still in Supabase. If you migrate listings to Convex, this component needs to be switched to Convex queries.

---

## Still on Supabase by design (no change needed)

| Area | Notes |
|------|--------|
| **Auth** | AuthContext: sign in/up/out, session, getSession, onAuthStateChange. Supabase only. |
| **Profile update** | ProfilePage: email/password update via `supabase.auth.updateUser`. |
| **Delete account** | DeleteAccountDialog: Supabase auth + signOut. |
| **Storage** | useStorage, CreateListingPage uploads, useVehicleRegistration images, useVehicleUpgrades, brand useImageLoader: Supabase storage. |
| **Users list** | UsersPage: Supabase `profiles` (and possibly auth). Convex has `profiles` table; if you sync or migrate profiles to Convex, switch this to a Convex query. |
| **Page mappings** | usePageMappings: Supabase (and auth.getUser). Convex has page_mappings table; can be migrated later. |
| **Card system / templates** | CardSystemPage: Supabase. Convex has card_mappings, custom_card_templates; can be migrated later. |

---

## Needs rebuilding (Convex schema exists, app still uses Supabase)

| Feature | Convex | App | Action |
|--------|--------|-----|--------|
| **Saved items (save/unsave)** | saved_brands, saved_vehicles, saved_wheels tables + get-by-user queries | SaveButton → Supabase | Add link/unlink mutations; rebuild SaveButton to use Convex with Convex Ids. |
| **Dev tables list** | brands, vehicles, wheels, ref tables in Convex | TablesPage + useSupabaseTable → Supabase | Use Convex (e.g. useAdvancedTable or new Convex-backed hook) for oem_* and ref tables. |
| **Dev record edit** | get-by-id queries + update mutations | DatabaseRecordPage → Supabase | For Convex tables: Convex query + mutation; keep Supabase for users if needed. |
| **Cell edit in dev table** | brandsUpdate, vehiclesUpdate, wheelsUpdate, etc. | EditableDataTable → Supabase | Branch by table source: Convex tables → Convex mutations; else Supabase. |

---

## Optional / later migration (Supabase still used)

- **Cool board** (CoolBoardPage, RatingsKanban, RandomItemCard, RatingButtons, CommunityJustifications): Supabase `cool_ratings` (and possibly oem_brands for item details). Convex has `cool_board_queue`, `cool_ratings`. Rebuild to use Convex when you want ratings in Convex.
- **Market** (MarketPage, MarketListingDetailPage, CreateListingPage): Supabase `market_listings` + storage. Convex has `market_listings` and userListingsGetByUser. Migrate when you move listings to Convex.
- **UsersPage**: Supabase `profiles`. Convex has `profiles`; switch when profiles are in Convex.
- **useReferenceFieldEditor**: Supabase. Only needed if you keep a Supabase-backed ref editor; dev tables can use Convex ref tables instead.
- **useVehicleMaintenance / useVehicleUpgrades**: TanStack Query + Supabase. Leave on Supabase unless you add Convex tables for maintenance/upgrades.
- **BucketsPage / StorageExplorer**: Supabase storage. Keep on Supabase unless you move to Convex file storage or another provider.

---

## Summary

- **Working:** Home, brands, vehicles, wheels, engines, search, dashboard metrics, registered vehicles, vehicle comments, column order, contribute form. Saved lists **read** from Convex.
- **Broken:** Save button (writes to Supabase, reads from Convex). Dev tables and record edit (read/write Supabase for data that’s in Convex).
- **Rebuild:** SaveButton + Convex saved mutations; TablesPage + DatabaseRecordPage + EditableDataTable to use Convex for oem_* and ref tables.
- **By design on Supabase:** Auth, storage, profile auth updates, delete account. Optional later: cool board, market, users list, page mappings, card system.
