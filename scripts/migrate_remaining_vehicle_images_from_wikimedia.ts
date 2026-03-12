import { config } from "dotenv";

config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("VITE_CONVEX_URL is missing in .env.local");
}

const BASE_URL = CONVEX_URL.replace(/\/$/, "");
const DRY_RUN = process.env.DRY_RUN === "1";

type VehicleRow = {
  imageId: string;
  vehicleId: string;
  imageType: string;
  url: string;
  entityKey: string;
  title?: string;
};

type WikiPage = {
  title: string;
  fullurl?: string;
  thumbnail?: {
    source?: string;
  };
  original?: {
    source?: string;
  };
};

const MANUAL_QUERY_BY_ENTITY_KEY: Record<string, string[]> = {
  "Lamborghini-LB724-Huracan": ["Lamborghini Huracán"],
  "Rolls-Royce-RR04-Ghost I": ["Rolls-Royce Ghost"],
  "Rolls-Royce-RR21-Ghost II": ["Rolls-Royce Ghost"],
  "Rolls-Royce-RR22-Ghost II EWB": ["Rolls-Royce Ghost"],
  "Rolls-Royce-RR05-Wraith": ["Rolls-Royce Wraith 2013", "Rolls-Royce Wraith"],
  "Volkswagen-MK4-Golf R32": ["Volkswagen Golf R32 Mk4", "Volkswagen Golf Mk4 R32"],
  "Volkswagen-XL1-XL1": ["Volkswagen 1-litre car"],
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function normalize(value: string | undefined) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string | undefined) {
  return normalize(value)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !["the", "and", "of", "car", "cars", "motor", "motors"].includes(token));
}

function buildQueries(row: VehicleRow) {
  const manual = MANUAL_QUERY_BY_ENTITY_KEY[row.entityKey];
  if (manual?.length) {
    return manual;
  }

  const title = row.title ?? row.entityKey;
  const parts = title.split(" - ").map((part) => part.trim()).filter(Boolean);
  const brand = parts[0] ?? "";
  const model = parts[parts.length - 1] ?? title;

  let code = "";
  if (row.entityKey.startsWith(`${brand}-`)) {
    const rest = row.entityKey.slice(brand.length + 1);
    code = rest.split("-")[0] ?? "";
  }

  const queries = new Set<string>();
  if (brand && model && code && /^(mk\d+|l\d+|lb\d+)/i.test(code)) {
    queries.add(`${brand} ${model} ${code}`);
  }
  if (brand && model) {
    queries.add(`${brand} ${model}`);
  }
  queries.add(title.replace(/\s+-\s+/g, " "));
  return [...queries];
}

async function searchWikipedia(query: string): Promise<WikiPage[]> {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrlimit", "5");
  url.searchParams.set("prop", "pageimages|info");
  url.searchParams.set("inprop", "url");
  url.searchParams.set("piprop", "thumbnail|original");
  url.searchParams.set("pithumbsize", "640");
  url.searchParams.set("format", "json");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "OEMWDB/1.0",
    },
  });
  const json = await res.json();
  return Object.values(json.query?.pages || {}) as WikiPage[];
}

function scorePage(query: string, row: VehicleRow, page: WikiPage) {
  const queryTokens = new Set(tokenize(query));
  const modelTokens = new Set(tokenize((row.title ?? row.entityKey).split(" - ").pop() ?? row.title ?? row.entityKey));
  const titleTokens = new Set(tokenize(page.title));
  const allowedTokens = new Set([...queryTokens, ...modelTokens]);

  let score = 0;
  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += 2;
  }
  for (const token of modelTokens) {
    if (titleTokens.has(token)) score += 3;
  }
  if (normalize(page.title) === normalize(query)) score += 5;
  for (const token of titleTokens) {
    if (!allowedTokens.has(token)) score -= 1;
  }
  if (!page.thumbnail?.source && !page.original?.source) score -= 100;
  return score;
}

async function findBestImage(row: VehicleRow) {
  const queries = buildQueries(row);
  let best:
    | {
        query: string;
        page: WikiPage;
        score: number;
      }
    | undefined;

  for (const query of queries) {
    const pages = await searchWikipedia(query);
    for (const page of pages) {
      const score = scorePage(query, row, page);
      if (!best || score > best.score) {
        best = { query, page, score };
      }
    }
  }

  if (!best || best.score <= 0 || (!best.page.thumbnail?.source && !best.page.original?.source)) {
    return null;
  }

  const imageUrl = best.page.thumbnail?.source ?? best.page.original?.source;
  if (!imageUrl) {
    return null;
  }

  return { ...best, imageUrl };
}

async function main() {
  const result = await convexCall<{ rows: VehicleRow[] }>("query", "imageTables:listExternalVehicleImages", {
    limit: 100,
  });

  const summary = {
    dryRun: DRY_RUN,
    migrated: 0,
    skipped: 0,
    failures: [] as Array<{ title: string; reason: string }>,
  };
  const uploadedBySource = new Map<string, { storageId: string; mediaUrl: string }>();

  for (const row of result.rows) {
    try {
      const match = await findBestImage(row);
      if (!match) {
        summary.skipped += 1;
        summary.failures.push({
          title: row.title ?? row.entityKey,
          reason: "No Wikimedia match with an image",
        });
        continue;
      }

      console.log(
        `${DRY_RUN ? "preview" : "migrate"} ${row.title ?? row.entityKey}\n` +
          `  query: ${match.query}\n` +
          `  page: ${match.page.title}\n` +
          `  image: ${match.imageUrl}`
      );

      if (DRY_RUN) {
        summary.migrated += 1;
        continue;
      }

      const virtualPath = `vehicles/${row.entityKey}/images/hero-${row.imageId}`;
      let stored = uploadedBySource.get(match.imageUrl);

      if (!stored) {
        await sleep(3000);
        const response = await fetch(match.imageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; OEMWDB/1.0)",
            "Referer": "https://en.wikipedia.org/",
          },
        });
        if (!response.ok) {
          throw new Error(`Local fetch failed: ${response.status} ${response.statusText} from ${match.imageUrl}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const fileName = match.imageUrl.split("/").pop()?.split("?")[0] || `${row.entityKey}.img`;
        stored = await convexCall<{ mediaUrl: string; storageId: string }>("action", "storage:uploadSharedAsset", {
          fileBase64: Buffer.from(arrayBuffer).toString("base64"),
          fileName,
          virtualPath,
          contentType,
        });
        uploadedBySource.set(match.imageUrl, stored);
      } else {
        const moved = await convexCall<{ mediaUrl: string }>("action", "storage:moveStorageIdToPath", {
          storageId: stored.storageId,
          virtualPath,
          vehicleId: row.vehicleId,
        });
        stored = {
          storageId: stored.storageId,
          mediaUrl: moved.mediaUrl,
        };
      }

      await convexCall("mutation", "imageTables:applyVehicleImageStorage", {
        imageId: row.imageId,
        storageId: stored.storageId,
        mediaUrl: stored.mediaUrl,
      });

      summary.migrated += 1;
    } catch (error) {
      summary.failures.push({
        title: row.title ?? row.entityKey,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  if (summary.failures.length > 0 && !DRY_RUN) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
