/**
 * Backfill slug on core entity tables (brands, vehicles, wheels, engines).
 * Uses dotenv + native fetch to call Convex migration mutations.
 *
 * Prerequisites: .env.local with VITE_CONVEX_URL
 * Run from project root: npx tsx scripts/backfill-slugs.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL!;

const required = [["VITE_CONVEX_URL", CONVEX_URL]] as const;
for (const [name, value] of required) {
  if (!value || String(value).trim() === "") {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local and run from project root.`
    );
  }
}

type ConvexSuccess = { status: "success"; value: unknown };
type ConvexError = { status: "error"; errorMessage: string; errorData?: unknown };

async function convexMutation(
  path: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  const url = `${CONVEX_URL.replace(/\/$/, "")}/api/mutation`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  let json: ConvexSuccess | ConvexError;
  try {
    json = JSON.parse(text) as ConvexSuccess | ConvexError;
  } catch {
    throw new Error(
      `Convex mutation failed: HTTP ${res.status}, body: ${text.slice(0, 500)}`
    );
  }
  if (json.status !== "success") {
    throw new Error(
      `Convex mutation ${path}: ${json.errorMessage ?? "unknown error"}`
    );
  }
  return json.value;
}

async function main() {
  const base = "migrations";

  console.log("Backfilling slugs (slug = id, engines fallback to engine_code)...\n");

  const brandResult = (await convexMutation(`${base}:backfillBrandSlugs`, {})) as {
    updated?: number;
  };
  const brandCount = brandResult?.updated ?? 0;
  console.log(`oem_brands: ${brandCount} updated`);

  const vehicleResult = (await convexMutation(
    `${base}:backfillVehicleSlugs`,
    {}
  )) as { updated?: number };
  const vehicleCount = vehicleResult?.updated ?? 0;
  console.log(`oem_vehicles: ${vehicleCount} updated`);

  const wheelResult = (await convexMutation(`${base}:backfillWheelSlugs`, {})) as {
    updated?: number;
  };
  const wheelCount = wheelResult?.updated ?? 0;
  console.log(`oem_wheels: ${wheelCount} updated`);

  const engineResult = (await convexMutation(
    `${base}:backfillEngineSlugs`,
    {}
  )) as { updated?: number };
  const engineCount = engineResult?.updated ?? 0;
  console.log(`oem_engines: ${engineCount} updated`);

  console.log(
    `\nDone. Total: ${brandCount + vehicleCount + wheelCount + engineCount} documents updated.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
