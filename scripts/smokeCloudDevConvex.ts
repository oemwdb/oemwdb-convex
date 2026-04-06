import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { getConvexErrorMessage, isMissingConvexFunctionError } from "../src/lib/convexErrors";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const convexUrl = process.env.VITE_CONVEX_URL?.trim();

if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL in .env.local.");
}

const manifestPath = path.join(
  process.cwd(),
  "artifacts",
  "convex",
  "cloud-dev",
  "function-spec.json"
);
const manifest = existsSync(manifestPath)
  ? (JSON.parse(readFileSync(manifestPath, "utf8")) as {
      functions: Array<{ identifier: string; visibility?: { kind?: string } }>;
    })
  : null;
const manifestRefs = new Set(
  manifest
    ? manifest.functions
        .filter((entry) => entry.visibility?.kind === "public")
        .map((entry) => {
          const [modulePath, functionName] = entry.identifier.split(":");
          return `api.${modulePath.replace(/\.js$/, "").replace(/\//g, ".")}.${functionName}`;
        })
    : []
);

const client = new ConvexHttpClient(convexUrl);

async function assertFunctionReachable(
  label: string,
  executor: () => Promise<unknown>
) {
  try {
    await executor();
  } catch (error) {
    if (isMissingConvexFunctionError(error)) {
      throw new Error(`${label} is missing from cloud dev: ${getConvexErrorMessage(error)}`);
    }
    console.log(`${label}: reached deployment (${getConvexErrorMessage(error)})`);
    return;
  }

  console.log(`${label}: reached deployment`);
}

async function main() {
  const requiredManifestRefs = [
    "api.auth.sessionProbe",
    "api.billyDashBrowser.overviewGet",
    "api.billyDashBrowser.refreshOverview",
    "api.colors.collectionGet",
    "api.colors.detailGet",
    "api.market.adminListingsIndex",
    "api.market.marketListingGetById",
    "api.market.marketLinkTargetsSearch",
    "api.market.marketSurfaceGetByBrand",
    "api.market.marketSurfaceGetByVehicle",
    "api.market.marketSurfaceGetByWheel",
    "api.market.listingCreate",
    "api.mutations.brandCommentDelete",
    "api.mutations.vehicleCommentDelete",
    "api.mutations.wheelCommentDelete",
    "api.tableBrowser.rowsGet",
    "api.wheelAssets.getByWheel",
    "api.wheelRecogniser.formOptionsGet",
    "api.wheelRecogniser.search",
  ];

  if (manifest) {
    for (const reference of requiredManifestRefs) {
      assert(
        manifestRefs.has(reference),
        `Canonical cloud dev manifest is missing ${reference}.`
      );
    }
    console.log(`Using canonical manifest ${manifestPath}`);
  } else {
    console.log("Canonical cloud dev manifest not found locally; continuing with live function probes only.");
  }

  const colors = await client.query(api.colors.collectionGet, {});
  assert(Array.isArray(colors), "colors.collectionGet should return an array.");
  console.log(`colors.collectionGet: ${colors.length} rows`);

  const firstColorLookup =
    colors[0]?.slug ?? colors[0]?._id ?? colors[0]?.id ?? null;
  if (firstColorLookup) {
    const detail = await client.query(api.colors.detailGet, { id: String(firstColorLookup) });
    assert(
      detail === null || typeof detail === "object",
      "colors.detailGet should return an object or null."
    );
    console.log("colors.detailGet: ok");
  } else {
    console.log("colors.detailGet: skipped (no colors available)");
  }

  const tableRows = await client.query(api.tableBrowser.rowsGet, {
    tableName: "oem_brands",
    limit: 1,
    offset: 0,
  });
  assert(Array.isArray(tableRows.rows), "tableBrowser.rowsGet should return a rows array.");
  console.log(`tableBrowser.rowsGet: ${tableRows.rows.length} rows`);

  const authProbe = await client.query(api.auth.sessionProbe, {});
  assert.equal(typeof authProbe.authenticated, "boolean");
  console.log(`auth.sessionProbe: authenticated=${authProbe.authenticated}`);

  const billyDashOverview = await client.query(api.billyDashBrowser.overviewGet, {});
  assert(
    billyDashOverview === null ||
      (typeof billyDashOverview === "object" && Array.isArray(billyDashOverview.brands)),
    "billyDashBrowser.overviewGet should return null or a dashboard snapshot."
  );
  console.log(
    `billyDashBrowser.overviewGet: ${
      billyDashOverview?.brands?.length ?? 0
    } brands`
  );

  await assertFunctionReachable("wheelAssets.getByWheel", async () => {
    await client.query(api.wheelAssets.getByWheel, {
      wheelId: "missing_wheel_id_for_smoke" as never,
    });
  });

  const wheelRecogniserOptions = await client.query(
    api.wheelRecogniser.formOptionsGet,
    {}
  );
  assert(Array.isArray(wheelRecogniserOptions.brands), "wheelRecogniser.formOptionsGet should return option arrays.");
  console.log(`wheelRecogniser.formOptionsGet: ${wheelRecogniserOptions.brands.length} brands`);

  const wheelRecogniserResults = await client.query(
    api.wheelRecogniser.search,
    { limit: 1 }
  );
  assert(Array.isArray(wheelRecogniserResults.families), "wheelRecogniser.search should return a families array.");
  console.log(`wheelRecogniser.search: ${wheelRecogniserResults.families.length} families`);

  await assertFunctionReachable("market.adminListingsIndex", async () => {
    await client.query(api.market.adminListingsIndex, {});
  });
  await assertFunctionReachable("market.marketLinkTargetsSearch", async () => {
    await client.query(api.market.marketLinkTargetsSearch, {
      targetType: "brand",
      query: "bmw",
    });
  });
  await assertFunctionReachable("market.marketListingGetById", async () => {
    await client.query(api.market.marketListingGetById, {
      listingId: "missing_listing_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("market.marketSurfaceGetByBrand", async () => {
    await client.query(api.market.marketSurfaceGetByBrand, {
      brandId: "missing_brand_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("market.marketSurfaceGetByVehicle", async () => {
    await client.query(api.market.marketSurfaceGetByVehicle, {
      vehicleId: "missing_vehicle_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("market.marketSurfaceGetByWheel", async () => {
    await client.query(api.market.marketSurfaceGetByWheel, {
      wheelId: "missing_wheel_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("market.listingCreate", async () => {
    await client.mutation(api.market.listingCreate, {
      listing_type: "wheel",
      title: "Smoke Listing",
      status: "draft",
    });
  });
  await assertFunctionReachable("mutations.brandCommentDelete", async () => {
    await client.mutation(api.mutations.brandCommentDelete, {
      commentId: "missing_comment_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("mutations.vehicleCommentDelete", async () => {
    await client.mutation(api.mutations.vehicleCommentDelete, {
      commentId: "missing_comment_id_for_smoke" as never,
    });
  });
  await assertFunctionReachable("mutations.wheelCommentDelete", async () => {
    await client.mutation(api.mutations.wheelCommentDelete, {
      commentId: "missing_comment_id_for_smoke" as never,
    });
  });

  console.log("Cloud dev Convex smoke checks passed.");
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
