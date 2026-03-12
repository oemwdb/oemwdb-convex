import { config } from "dotenv";

config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const ALFA_BRAND_ID = "jd7e74szr52gabs9mgmqr77h4n821s7g";

if (!CONVEX_URL || !CONVEX_URL.trim()) {
  throw new Error("VITE_CONVEX_URL is missing. Set it in .env.local before running this script.");
}

type ConvexSuccess<T> = { status: "success"; value: T };
type ConvexError = { status: "error"; errorMessage?: string; errorData?: unknown };

type WheelDoc = {
  _id: string;
  id?: string | null;
  wheel_title?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
};

async function convexQuery<T>(path: string, args: Record<string, unknown>): Promise<T> {
  const url = `${CONVEX_URL!.replace(/\/$/, "")}/api/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });

  const text = await res.text();
  let json: ConvexSuccess<T> | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess<T> | ConvexError;
  } catch {
    throw new Error(`Failed to parse Convex query response (${res.status}) for ${path}: ${text}`);
  }

  if (json.status !== "success") {
    throw new Error(`Convex query ${path} failed: ${(json as ConvexError).errorMessage ?? "Unknown error"}`);
  }

  return (json as ConvexSuccess<T>).value;
}

async function convexAction<T>(path: string, args: Record<string, unknown>): Promise<T> {
  const url = `${CONVEX_URL!.replace(/\/$/, "")}/api/action`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });

  const text = await res.text();
  let json: ConvexSuccess<T> | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess<T> | ConvexError;
  } catch {
    throw new Error(`Failed to parse Convex action response (${res.status}) for ${path}: ${text}`);
  }

  if (json.status !== "success") {
    throw new Error(`Convex action ${path} failed: ${(json as ConvexError).errorMessage ?? "Unknown error"}`);
  }

  return (json as ConvexSuccess<T>).value;
}

function isHttpUrl(value: string | null | undefined): value is string {
  return !!value && /^https?:\/\//i.test(value);
}

function isConvexUrl(value: string | null | undefined): boolean {
  return !!value && (value.includes(".convex.site") || value.includes(".convex.cloud") || value.includes("/api/media/"));
}

async function main() {
  console.log("Migrating Alfa wheel images to Convex storage...");
  const wheels = await convexQuery<WheelDoc[]>("queries:getWheelsByBrand", { brandId: ALFA_BRAND_ID });
  console.log(`Found ${wheels.length} Alfa wheels.`);

  let wheelsTouched = 0;
  let fieldMigrations = 0;
  let dedupedBadFieldUpdates = 0;
  let skippedNoExternal = 0;
  let failures = 0;

  for (const wheel of wheels) {
    const good = wheel.good_pic_url ?? null;
    const bad = wheel.bad_pic_url ?? null;

    const goodNeedsMigration = isHttpUrl(good) && !isConvexUrl(good);
    const badNeedsMigration = isHttpUrl(bad) && !isConvexUrl(bad);

    if (!goodNeedsMigration && !badNeedsMigration) {
      skippedNoExternal += 1;
      continue;
    }

    const label = wheel.id ?? wheel.wheel_title ?? wheel._id;

    try {
      let touchedThisWheel = false;

      if (goodNeedsMigration) {
        const { convexUrl } = await convexAction<{ convexUrl: string }>(
          "imageMigrations:migrateWheelImageFromUrl",
          {
            wheelId: wheel._id,
            sourceUrl: good,
            field: "good_pic_url",
          }
        );
        fieldMigrations += 1;
        touchedThisWheel = true;

        if (badNeedsMigration && bad === good) {
          await convexAction("storage:updateWheelImageUrlAction", {
            wheelId: wheel._id,
            field: "bad_pic_url",
            mediaUrl: convexUrl,
          });
          dedupedBadFieldUpdates += 1;
        } else if (badNeedsMigration) {
          await convexAction("imageMigrations:migrateWheelImageFromUrl", {
            wheelId: wheel._id,
            sourceUrl: bad,
            field: "bad_pic_url",
          });
          fieldMigrations += 1;
        }
      } else if (badNeedsMigration) {
        await convexAction("imageMigrations:migrateWheelImageFromUrl", {
          wheelId: wheel._id,
          sourceUrl: bad,
          field: "bad_pic_url",
        });
        fieldMigrations += 1;
        touchedThisWheel = true;
      }

      if (touchedThisWheel) {
        wheelsTouched += 1;
        console.log(`  migrated: ${label}`);
      }
    } catch (error) {
      failures += 1;
      console.error(`  failed: ${label}: ${(error as Error).message}`);
    }
  }

  console.log("");
  console.log(JSON.stringify({
    wheelsTotal: wheels.length,
    wheelsTouched,
    fieldMigrations,
    dedupedBadFieldUpdates,
    skippedNoExternal,
    failures,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
