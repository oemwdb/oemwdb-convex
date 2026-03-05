/**
 * One-off script: move wheel good_pic_url images from Supabase to Convex storage.
 *
 * Strategy:
 * - Query Convex for all oem_wheels via queries:wheelsGetAll
 * - For each wheel where good_pic_url looks like a Supabase URL (contains "supabase.co")
 *   and not yet a Convex URL, call the Convex action:
 *     imageMigrations:migrateWheelImageFromUrl
 *   which downloads the image, stores it in Convex storage, and overwrites good_pic_url.
 *
 * Run from project root:
 *   npx tsx scripts/migrate_wheel_images_to_convex.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;

if (!CONVEX_URL || !CONVEX_URL.trim()) {
  throw new Error(
    "VITE_CONVEX_URL is missing. Set it in .env.local before running this script."
  );
}

type ConvexSuccess<T> = { status: "success"; value: T };
type ConvexError = { status: "error"; errorMessage?: string; errorData?: unknown };

async function convexQuery<T>(path: string, args: Record<string, unknown>): Promise<T> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/query`;
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
    throw new Error(
      `Failed to parse Convex query response (HTTP ${res.status}) for ${path}: ${text}`
    );
  }

  if (json.status !== "success") {
    const err = json as ConvexError;
    throw new Error(
      `Convex query ${path} failed: ${err.errorMessage ?? "Unknown error"}`
    );
  }

  return (json as ConvexSuccess<T>).value;
}

async function convexAction<T>(
  path: string,
  args: Record<string, unknown>
): Promise<T> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/action`;
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
    throw new Error(
      `Failed to parse Convex action response (HTTP ${res.status}) for ${path}: ${text}`
    );
  }

  if (json.status !== "success") {
    const err = json as ConvexError;
    throw new Error(
      `Convex action ${path} failed: ${err.errorMessage ?? "Unknown error"}`
    );
  }

  return (json as ConvexSuccess<T>).value;
}

type WheelDoc = {
  _id: string;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
};

function looksLikeConvexUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes(".convex.cloud") || url.includes(".convex.site");
}

function looksLikeSupabaseUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("supabase.co");
}

async function main() {
  console.log("🚀 Migrating wheel images from Supabase to Convex storage…");
  console.log(`   Convex deployment: ${CONVEX_URL}`);

  const wheels = await convexQuery<WheelDoc[]>("queries:wheelsGetAll", {});
  console.log(`📊 Found ${wheels.length} wheels in Convex.`);

  let migrated = 0;
  let skippedAlreadyConvex = 0;
  let skippedNoImage = 0;
  let failed = 0;

  for (const wheel of wheels) {
    // Prefer good_pic_url; migrate bad_pic_url only if no good_pic.
    const currentUrl = wheel.good_pic_url ?? wheel.bad_pic_url ?? null;

    if (!currentUrl) {
      skippedNoImage++;
      continue;
    }

    if (looksLikeConvexUrl(currentUrl)) {
      skippedAlreadyConvex++;
      continue;
    }

    if (!looksLikeSupabaseUrl(currentUrl)) {
      skippedNoImage++;
      continue;
    }

    try {
      const field = wheel.good_pic_url ? "good_pic_url" : "bad_pic_url";
      await convexAction("imageMigrations:migrateWheelImageFromUrl", {
        wheelId: wheel._id,
        sourceUrl: currentUrl,
        field,
      });
      migrated++;
      if (migrated % 25 === 0) {
        console.log(`   ✅ Migrated ${migrated} images so far…`);
      }
    } catch (err) {
      failed++;
      console.error(
        `❌ Failed to migrate image for wheel ${wheel._id}:`,
        (err as Error).message
      );
    }
  }

  console.log("\n✅ Migration complete.");
  console.log(`   Migrated to Convex: ${migrated}`);
  console.log(`   Skipped (already Convex): ${skippedAlreadyConvex}`);
  console.log(`   Skipped (no / unsupported image URL): ${skippedNoImage}`);
  console.log(`   Failed: ${failed}`);
}

main().catch((err) => {
  console.error("❌ Migration script crashed:", err);
  process.exit(1);
});

