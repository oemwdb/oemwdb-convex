import { loadCloudDevEnv, runConvexCloudDev } from "./convexCloudDev";

const { env } = loadCloudDevEnv();

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function deriveIssuerFromPublishableKey(value?: string) {
  const publishableKey = value?.trim();
  if (!publishableKey) return null;

  const payload = publishableKey.replace(/^pk_(test|live)_/, "");
  const decoded = decodeBase64Url(payload);
  const host = decoded.replace(/\$$/, "").trim();
  return host ? `https://${host}` : null;
}

const issuer =
  env.CLERK_JWT_ISSUER_DOMAIN?.trim() ||
  deriveIssuerFromPublishableKey(env.VITE_CLERK_PUBLISHABLE_KEY);

if (!issuer) {
  throw new Error(
    "Could not determine CLERK_JWT_ISSUER_DOMAIN from .env.local. Set CLERK_JWT_ISSUER_DOMAIN or VITE_CLERK_PUBLISHABLE_KEY first."
  );
}

runConvexCloudDev(["env", "set", "CLERK_JWT_ISSUER_DOMAIN", issuer]);

console.log(`Set CLERK_JWT_ISSUER_DOMAIN on cloud dev to ${issuer}.`);
