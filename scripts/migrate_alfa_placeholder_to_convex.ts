import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

config({ path: ".env.local" });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const ALFA_BRAND_ID = "jd7e74szr52gabs9mgmqr77h4n821s7g";
const PLACEHOLDER_PATH = resolve(process.cwd(), "public/placeholder.svg");

if (!CONVEX_URL || !CONVEX_URL.trim()) {
  throw new Error("VITE_CONVEX_URL is missing. Set it in .env.local before running this script.");
}

type ConvexSuccess<T> = { status: "success"; value: T };
type ConvexError = { status: "error"; errorMessage?: string; errorData?: unknown };

type VehicleDoc = {
  _id: string;
  id?: string | null;
  bad_pic_url?: string | null;
};

type WheelDoc = {
  _id: string;
  id?: string | null;
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

async function main() {
  console.log("Uploading shared Alfa placeholder to Convex storage...");
  const fileBuffer = await readFile(PLACEHOLDER_PATH);
  const fileBase64 = fileBuffer.toString("base64");
  const { mediaUrl } = await convexAction<{ mediaUrl: string }>("storage:uploadSharedAsset", {
    fileBase64,
    fileName: "placeholder.svg",
    virtualPath: "shared/placeholders/placeholder.svg",
    contentType: "image/svg+xml",
  });

  console.log(`Shared placeholder URL: ${mediaUrl}`);

  const [vehicles, wheels] = await Promise.all([
    convexQuery<VehicleDoc[]>("queries:vehiclesGetByBrand", { brandId: ALFA_BRAND_ID }),
    convexQuery<WheelDoc[]>("queries:getWheelsByBrand", { brandId: ALFA_BRAND_ID }),
  ]);

  let vehiclesPatched = 0;
  let wheelsPatched = 0;

  for (const vehicle of vehicles) {
    if (vehicle.bad_pic_url !== "/placeholder.svg") continue;
    await convexAction("storage:updateVehicleImageUrlAction", {
      vehicleId: vehicle._id,
      field: "bad_pic_url",
      mediaUrl,
    });
    vehiclesPatched += 1;
  }

  for (const wheel of wheels) {
    if (wheel.bad_pic_url !== "/placeholder.svg") continue;
    await convexAction("storage:updateWheelImageUrlAction", {
      wheelId: wheel._id,
      field: "bad_pic_url",
      mediaUrl,
    });
    wheelsPatched += 1;
  }

  console.log("");
  console.log(JSON.stringify({ mediaUrl, vehiclesPatched, wheelsPatched }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
