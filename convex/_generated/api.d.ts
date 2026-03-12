/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alfaRomeoImageBackfill from "../alfaRomeoImageBackfill.js";
import type * as alfaRomeoLegacyAdditive from "../alfaRomeoLegacyAdditive.js";
import type * as alfaRomeoNavigation from "../alfaRomeoNavigation.js";
import type * as alfaRomeoRebuild from "../alfaRomeoRebuild.js";
import type * as auth from "../auth.js";
import type * as brandMigrations from "../brandMigrations.js";
import type * as brandMigrationsInternal from "../brandMigrationsInternal.js";
import type * as collectionMerges from "../collectionMerges.js";
import type * as debug from "../debug.js";
import type * as http from "../http.js";
import type * as imageMigrations from "../imageMigrations.js";
import type * as imageTables from "../imageTables.js";
import type * as migrations from "../migrations.js";
import type * as miniDedupe from "../miniDedupe.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as storage from "../storage.js";
import type * as storageInternal from "../storageInternal.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alfaRomeoImageBackfill: typeof alfaRomeoImageBackfill;
  alfaRomeoLegacyAdditive: typeof alfaRomeoLegacyAdditive;
  alfaRomeoNavigation: typeof alfaRomeoNavigation;
  alfaRomeoRebuild: typeof alfaRomeoRebuild;
  auth: typeof auth;
  brandMigrations: typeof brandMigrations;
  brandMigrationsInternal: typeof brandMigrationsInternal;
  collectionMerges: typeof collectionMerges;
  debug: typeof debug;
  http: typeof http;
  imageMigrations: typeof imageMigrations;
  imageTables: typeof imageTables;
  migrations: typeof migrations;
  miniDedupe: typeof miniDedupe;
  mutations: typeof mutations;
  queries: typeof queries;
  storage: typeof storage;
  storageInternal: typeof storageInternal;
  users: typeof users;
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
