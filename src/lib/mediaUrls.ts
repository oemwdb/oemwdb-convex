import { getRuntimeConvexSiteUrl } from "@/lib/backendTargetRuntime";

const OBSIDIAN_EMBED_PATTERN = /^!\[\[(.*)\]\]$/;

function trimValue(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function stripObsidianEmbed(value: string) {
  const match = value.match(OBSIDIAN_EMBED_PATTERN);
  return match?.[1]?.trim() || value;
}

function getConvexSiteBaseUrl() {
  const runtimeSiteUrl = trimValue(getRuntimeConvexSiteUrl());
  if (runtimeSiteUrl) return runtimeSiteUrl.replace(/\/$/, "");

  const explicit =
    trimValue((import.meta as any).env?.VITE_CONVEX_CONTROL_SITE_URL) ||
    trimValue((import.meta as any).env?.VITE_CONVEX_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");

  const cloudUrl =
    trimValue((import.meta as any).env?.VITE_CONVEX_CONTROL_URL) ||
    trimValue((import.meta as any).env?.VITE_CONVEX_CLOUD_URL) ||
    trimValue((import.meta as any).env?.VITE_CONVEX_URL);

  if (!cloudUrl) return "";

  try {
    const parsed = new URL(cloudUrl);
    parsed.hostname = parsed.hostname.replace(/\.cloud$/i, ".site");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function encodePathSegments(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildConvexMediaUrl(path: string) {
  const baseUrl = getConvexSiteBaseUrl();
  if (!baseUrl) return null;
  return `${baseUrl}/api/media/${encodePathSegments(path)}`;
}

export function getMediaUrlCandidates(
  rawValue?: string | null,
  bucketHint?: string | null
) {
  const value = stripObsidianEmbed(trimValue(rawValue));
  if (!value) return [];

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return [value];
  }

  if (value.startsWith("/api/media/")) {
    const baseUrl = getConvexSiteBaseUrl();
    return baseUrl ? [`${baseUrl}${value}`] : [value];
  }

  if (value.startsWith("/")) {
    return [value];
  }

  const candidates: string[] = [];
  const directMediaUrl = buildConvexMediaUrl(value);
  if (directMediaUrl) {
    candidates.push(directMediaUrl);
  }

  const normalizedBucket = trimValue(bucketHint);
  if (normalizedBucket && !value.startsWith(`${normalizedBucket}/`)) {
    const bucketMediaUrl = buildConvexMediaUrl(`${normalizedBucket}/${value}`);
    if (bucketMediaUrl) {
      candidates.push(bucketMediaUrl);
    }
  }

  candidates.push(value);

  return [...new Set(candidates)];
}

export function getPrimaryMediaUrl(
  rawValue?: string | null,
  bucketHint?: string | null
) {
  return getMediaUrlCandidates(rawValue, bucketHint)[0] ?? null;
}
