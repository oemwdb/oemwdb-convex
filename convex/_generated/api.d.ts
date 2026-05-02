/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as alfaRomeoImageBackfill from "../alfaRomeoImageBackfill.js";
import type * as alfaRomeoLegacyAdditive from "../alfaRomeoLegacyAdditive.js";
import type * as alfaRomeoNavigation from "../alfaRomeoNavigation.js";
import type * as alfaRomeoRebuild from "../alfaRomeoRebuild.js";
import type * as assetGeneration from "../assetGeneration.js";
import type * as assetGenerationInternal from "../assetGenerationInternal.js";
import type * as auth from "../auth.js";
import type * as billyDash from "../billyDash.js";
import type * as billyDashBrowser from "../billyDashBrowser.js";
import type * as billyDashShared from "../billyDashShared.js";
import type * as brandMigrations from "../brandMigrations.js";
import type * as brandMigrationsInternal from "../brandMigrationsInternal.js";
import type * as bucketBrowser from "../bucketBrowser.js";
import type * as bucketBrowserActions from "../bucketBrowserActions.js";
import type * as bucketBrowserShared from "../bucketBrowserShared.js";
import type * as collectionMerges from "../collectionMerges.js";
import type * as colors from "../colors.js";
import type * as colorsBrowser from "../colorsBrowser.js";
import type * as configurator from "../configurator.js";
import type * as databaseTableAccess from "../databaseTableAccess.js";
import type * as debug from "../debug.js";
import type * as http from "../http.js";
import type * as imageMigrations from "../imageMigrations.js";
import type * as imageTables from "../imageTables.js";
import type * as market from "../market.js";
import type * as migrations from "../migrations.js";
import type * as miniDedupe from "../miniDedupe.js";
import type * as mutations from "../mutations.js";
import type * as pageLayouts from "../pageLayouts.js";
import type * as queries from "../queries.js";
import type * as storage from "../storage.js";
import type * as storageInternal from "../storageInternal.js";
import type * as storagePaths from "../storagePaths.js";
import type * as tableBrowser from "../tableBrowser.js";
import type * as tableBrowserActions from "../tableBrowserActions.js";
import type * as tableBrowserInternal from "../tableBrowserInternal.js";
import type * as users from "../users.js";
import type * as wheelAssets from "../wheelAssets.js";
import type * as wheelRecogniser from "../wheelRecogniser.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  alfaRomeoImageBackfill: typeof alfaRomeoImageBackfill;
  alfaRomeoLegacyAdditive: typeof alfaRomeoLegacyAdditive;
  alfaRomeoNavigation: typeof alfaRomeoNavigation;
  alfaRomeoRebuild: typeof alfaRomeoRebuild;
  assetGeneration: typeof assetGeneration;
  assetGenerationInternal: typeof assetGenerationInternal;
  auth: typeof auth;
  billyDash: typeof billyDash;
  billyDashBrowser: typeof billyDashBrowser;
  billyDashShared: typeof billyDashShared;
  brandMigrations: typeof brandMigrations;
  brandMigrationsInternal: typeof brandMigrationsInternal;
  bucketBrowser: typeof bucketBrowser;
  bucketBrowserActions: typeof bucketBrowserActions;
  bucketBrowserShared: typeof bucketBrowserShared;
  collectionMerges: typeof collectionMerges;
  colors: typeof colors;
  colorsBrowser: typeof colorsBrowser;
  configurator: typeof configurator;
  databaseTableAccess: typeof databaseTableAccess;
  debug: typeof debug;
  http: typeof http;
  imageMigrations: typeof imageMigrations;
  imageTables: typeof imageTables;
  market: typeof market;
  migrations: typeof migrations;
  miniDedupe: typeof miniDedupe;
  mutations: typeof mutations;
  pageLayouts: typeof pageLayouts;
  queries: typeof queries;
  storage: typeof storage;
  storageInternal: typeof storageInternal;
  storagePaths: typeof storagePaths;
  tableBrowser: typeof tableBrowser;
  tableBrowserActions: typeof tableBrowserActions;
  tableBrowserInternal: typeof tableBrowserInternal;
  users: typeof users;
  wheelAssets: typeof wheelAssets;
  wheelRecogniser: typeof wheelRecogniser;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
