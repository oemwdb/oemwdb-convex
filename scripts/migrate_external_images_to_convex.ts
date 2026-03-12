import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!CONVEX_URL) {
  throw new Error("VITE_CONVEX_URL is missing in .env.local");
}

const BASE_URL = CONVEX_URL.replace(/\/$/, "");
const BATCH_SIZE = 50;
const CONCURRENCY = 4;
const MAX_RETRIES = 3;
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

type Kind = "brand" | "vehicle" | "wheel";

type BrandRow = {
  imageId: string;
  brandId: string;
  imageType: string;
  url: string;
  storageId?: string;
  entityKey: string;
  title?: string;
};

type VehicleRow = {
  imageId: string;
  vehicleId: string;
  imageType: string;
  url: string;
  storageId?: string;
  entityKey: string;
  title?: string;
};

type WheelRow = {
  imageId: string;
  wheelId: string;
  imageType: string;
  url: string;
  storageId?: string;
  entityKey: string;
  title?: string;
};

type ImageRow = BrandRow | VehicleRow | WheelRow;

type StoredAsset = {
  storageId: string;
  contentType?: string;
};

type DownloadedAsset = {
  bytes: Buffer;
  contentType?: string;
};

type SupabaseObjectLocation = {
  bucket: string;
  objectPath: string;
};

let vehicleAssetIndexPromise: Promise<Map<string, string[]>> | null = null;

async function convexCall<T>(
  endpoint: "query" | "mutation" | "action",
  path: string,
  args: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });

  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(`${endpoint} ${path} failed: ${json.errorMessage ?? "unknown error"}`);
  }

  return json.value;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries<T>(label: string, fn: () => Promise<T>, maxRetries = MAX_RETRIES): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (/asset not found in live storage|object not found|not found$/i.test(message)) {
        break;
      }
      if (attempt === maxRetries) break;
      const delayMs = attempt * 1000;
      console.warn(`   retrying ${label} (${attempt}/${maxRetries}) in ${delayMs}ms`);
      await sleep(delayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function sanitizePathSegment(value: string | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

function buildVirtualPath(kind: Kind, row: ImageRow) {
  const entityKey = sanitizePathSegment(row.entityKey);
  const imageType = sanitizePathSegment(row.imageType);
  const imageId = sanitizePathSegment(row.imageId);
  return `${kind}s/${entityKey}/images/${imageType}-${imageId}`;
}

function getListPath(kind: Kind) {
  if (kind === "brand") return "imageTables:listExternalBrandImages";
  if (kind === "vehicle") return "imageTables:listExternalVehicleImages";
  return "imageTables:listExternalWheelImages";
}

function getApplyPath(kind: Kind) {
  if (kind === "brand") return "imageTables:applyBrandImageStorage";
  if (kind === "vehicle") return "imageTables:applyVehicleImageStorage";
  return "imageTables:applyWheelImageStorage";
}

function getParentArgs(kind: Kind, row: ImageRow) {
  if (kind === "brand") {
    return { brandId: (row as BrandRow).brandId };
  }
  if (kind === "vehicle") {
    return { vehicleId: (row as VehicleRow).vehicleId };
  }
  return { wheelId: (row as WheelRow).wheelId };
}

function isSupabaseSignedUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith("supabase.co") && parsed.pathname.includes("/storage/v1/object/sign/");
  } catch {
    return false;
  }
}

function normalizeLookup(value: string | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parseSupabaseSignedUrl(url: string) {
  const parsed = new URL(url);
  const token = parsed.searchParams.get("token");
  let rawPath: string | undefined;

  if (token) {
    const payloadPart = token.split(".")[1];
    if (payloadPart) {
      const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as {
        url?: string;
      };
      rawPath = payload.url;
    }
  }

  if (!rawPath) {
    const marker = "/storage/v1/object/sign/";
    const index = parsed.pathname.indexOf(marker);
    if (index !== -1) {
      rawPath = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    }
  }

  const normalizedPath = String(rawPath ?? "").trim();
  const slashIndex = normalizedPath.indexOf("/");
  if (!normalizedPath || slashIndex === -1) {
    return null;
  }

  return {
    bucket: normalizedPath.slice(0, slashIndex),
    objectPath: normalizedPath.slice(slashIndex + 1),
  };
}

async function listSupabaseFolder(path: string) {
  if (!supabase) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY are required to inspect Supabase storage");
  }

  const { data, error } = await supabase.storage
    .from("oemwdb images")
    .list(path, { limit: 500, sortBy: { column: "name", order: "asc" } });

  if (error) {
    throw new Error(`Failed listing Supabase path ${path}: ${error.message}`);
  }

  return data || [];
}

async function getVehicleAssetIndex() {
  if (!vehicleAssetIndexPromise) {
    vehicleAssetIndexPromise = (async () => {
      const roots = await listSupabaseFolder("Brands");
      const vehicleDirs: string[] = [];

      for (const root of roots) {
        if (root.name === ".emptyFolderPlaceholder" || root.id !== null) continue;

        if (/vehicles/i.test(root.name)) {
          vehicleDirs.push(`Brands/${root.name}`);
          continue;
        }

        const childPath = `Brands/${root.name}`;
        let children: Awaited<ReturnType<typeof listSupabaseFolder>> = [];

        try {
          children = await listSupabaseFolder(childPath);
        } catch {
          children = [];
        }

        for (const child of children) {
          if (child.id === null && /vehicles/i.test(child.name)) {
            vehicleDirs.push(`${childPath}/${child.name}`);
          }
        }
      }

      const index = new Map<string, string[]>();

      for (const dir of vehicleDirs) {
        const files = await listSupabaseFolder(dir);
        for (const file of files) {
          if (file.id === null) continue;
          const objectPath = `${dir}/${file.name}`;
          const key = normalizeLookup(file.name);
          const current = index.get(key) ?? [];
          current.push(objectPath);
          index.set(key, current);
        }
      }

      return index;
    })();
  }

  return vehicleAssetIndexPromise;
}

async function tryDownloadSupabaseObject(location: SupabaseObjectLocation): Promise<DownloadedAsset | null> {
  if (!supabase) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY are required to recover signed Supabase URLs");
  }

  const { data, error } = await supabase.storage.from(location.bucket).download(location.objectPath);
  if (error) {
    if (
      error.statusCode === "404" ||
      error.status === 400 ||
      /not found/i.test(error.message)
    ) {
      return null;
    }

    throw new Error(`Supabase download failed for ${location.bucket}/${location.objectPath}: ${error.message}`);
  }

  const bytes = Buffer.from(await data.arrayBuffer());
  return {
    bytes,
    contentType: data.type || undefined,
  };
}

async function resolveSupabaseObjectLocation(url: string): Promise<SupabaseObjectLocation | null> {
  const parsed = parseSupabaseSignedUrl(url);
  if (!parsed) {
    throw new Error(`Could not parse signed Supabase URL: ${url}`);
  }

  const directHit = await tryDownloadSupabaseObject(parsed);
  if (directHit) {
    return parsed;
  }

  const fileName = parsed.objectPath.split("/").pop();
  if (!fileName) {
    return null;
  }

  const fileKey = normalizeLookup(fileName);
  const brandHint = normalizeLookup(
    parsed.objectPath.split("/").slice(-2, -1)[0]?.replace(/vehicles?/i, "")
  );
  const index = await getVehicleAssetIndex();
  const candidates = [...(index.get(fileKey) ?? [])];

  candidates.sort((a, b) => {
    const aScore = brandHint && normalizeLookup(a).includes(brandHint) ? 1 : 0;
    const bScore = brandHint && normalizeLookup(b).includes(brandHint) ? 1 : 0;
    return bScore - aScore;
  });

  for (const objectPath of candidates) {
    const recovered = await tryDownloadSupabaseObject({
      bucket: parsed.bucket,
      objectPath,
    });
    if (recovered) {
      return {
        bucket: parsed.bucket,
        objectPath,
      };
    }
  }

  return null;
}

async function downloadViaSupabaseService(url: string): Promise<DownloadedAsset> {
  const resolved = await resolveSupabaseObjectLocation(url);
  if (!resolved) {
    const parsed = parseSupabaseSignedUrl(url);
    throw new Error(
      `Supabase asset not found in live storage for ${parsed?.bucket ?? "unknown"}/${parsed?.objectPath ?? "unknown"}`
    );
  }

  const asset = await tryDownloadSupabaseObject(resolved);
  if (!asset) {
    throw new Error(`Supabase asset vanished during download for ${resolved.bucket}/${resolved.objectPath}`);
  }

  return asset;
}

async function uploadBufferToConvex(
  bytes: Buffer,
  virtualPath: string,
  contentType?: string
): Promise<{ mediaUrl: string; storageId: string }> {
  return convexCall<{ mediaUrl: string; storageId: string }>("action", "storage:uploadSharedAsset", {
    fileBase64: bytes.toString("base64"),
    fileName: virtualPath.split("/").pop() || "asset",
    virtualPath,
    contentType,
  });
}

async function processWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const current = index;
      index += 1;
      if (current >= items.length) return;
      await worker(items[current]);
    }
  });
  await Promise.all(runners);
}

async function migrateKind(kind: Kind, sourceCache: Map<string, StoredAsset>) {
  let uploaded = 0;
  let reused = 0;
  let recoveredFromSupabase = 0;
  let failed = 0;
  const failures: Array<{ url: string; error: string }> = [];
  const blockedImageIds = new Set<string>();

  while (true) {
    const batch = await convexCall<{ rows: ImageRow[] }>("query", getListPath(kind), { limit: BATCH_SIZE });
    const rows = batch.rows.filter((row) => !blockedImageIds.has(row.imageId));

    if (rows.length === 0) {
      break;
    }

    console.log(`\n${kind.toUpperCase()} batch: ${rows.length} rows`);

    await processWithConcurrency(rows, CONCURRENCY, async (row) => {
      const label = `${kind}:${row.title ?? row.entityKey}:${row.imageType}`;

      try {
        const virtualPath = buildVirtualPath(kind, row);
        const cached = sourceCache.get(row.url);

        let storageId: string;
        let mediaUrl: string;
        let contentType: string | undefined;

        if (cached) {
          const moved = await withRetries(`${label}:move`, () =>
            convexCall<{ mediaUrl: string }>("action", "storage:moveStorageIdToPath", {
              storageId: cached.storageId,
              virtualPath,
              contentType: cached.contentType,
              ...getParentArgs(kind, row),
            })
          );
          storageId = cached.storageId;
          mediaUrl = moved.mediaUrl;
          contentType = cached.contentType;
          reused += 1;
        } else {
          if (isSupabaseSignedUrl(row.url)) {
            const downloaded = await withRetries(`${label}:supabase`, () => downloadViaSupabaseService(row.url));
            const uploadedAsset = await withRetries(`${label}:upload`, () =>
              uploadBufferToConvex(downloaded.bytes, virtualPath, downloaded.contentType)
            );
            storageId = uploadedAsset.storageId;
            mediaUrl = uploadedAsset.mediaUrl;
            contentType = downloaded.contentType;
            recoveredFromSupabase += 1;
          } else {
            const stored = await withRetries(`${label}:fetch`, () =>
              convexCall<{ mediaUrl: string; storageId: string; contentType?: string }>(
                "action",
                "storage:fetchExternalAssetToStorage",
                {
                  sourceUrl: row.url,
                  virtualPath,
                  ...getParentArgs(kind, row),
                }
              )
            );

            storageId = stored.storageId;
            mediaUrl = stored.mediaUrl;
            contentType = stored.contentType;
          }

          sourceCache.set(row.url, { storageId, contentType });
          uploaded += 1;
        }

        await withRetries(`${label}:apply`, () =>
          convexCall("mutation", getApplyPath(kind), {
            imageId: row.imageId,
            storageId,
            mediaUrl,
          })
        );

        console.log(`   migrated ${label}`);
      } catch (error) {
        blockedImageIds.add(row.imageId);
        failed += 1;
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ url: row.url, error: message });
        console.error(`   failed ${label}: ${message}`);
      }
    });
  }

  return {
    uploaded,
    reused,
    recoveredFromSupabase,
    failed,
    failures,
  };
}

async function main() {
  console.log("Starting external image migration to Convex storage...");

  const preAudit = await convexCall<Record<string, unknown>>("query", "imageTables:auditImageTables", {});
  console.log("Pre-audit:");
  console.log(JSON.stringify(preAudit, null, 2));

  const backfillResult = await convexCall<Record<string, unknown>>(
    "mutation",
    "imageTables:backfillImageTablesFromLegacyFields",
    { dryRun: false }
  );
  console.log("Backfill sync:");
  console.log(JSON.stringify(backfillResult, null, 2));

  const sourceCache = new Map<string, StoredAsset>();
  const brandResult = await migrateKind("brand", sourceCache);
  const vehicleResult = await migrateKind("vehicle", sourceCache);
  const wheelResult = await migrateKind("wheel", sourceCache);

  const postAudit = await convexCall<Record<string, unknown>>("query", "imageTables:auditImageTables", {});

  console.log("\nMigration summary:");
  console.log(
    JSON.stringify(
      {
        brandResult,
        vehicleResult,
        wheelResult,
      },
      null,
      2
    )
  );

  console.log("\nPost-audit:");
  console.log(JSON.stringify(postAudit, null, 2));

  const failures = [
    ...brandResult.failures.map((failure) => ({ kind: "brand", ...failure })),
    ...vehicleResult.failures.map((failure) => ({ kind: "vehicle", ...failure })),
    ...wheelResult.failures.map((failure) => ({ kind: "wheel", ...failure })),
  ];

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) {
      console.log(`- [${failure.kind}] ${failure.url}`);
      console.log(`  ${failure.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Fatal migration error:", error);
  process.exit(1);
});
