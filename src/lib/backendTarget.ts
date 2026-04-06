export type BackendTarget = "control" | "workshop";

export const BACKEND_TARGET_STORAGE_KEY = "oemwdb_backend_target";
export const BACKEND_TARGET_CHANGE_EVENT = "backend-target-change";

function trimValue(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeBackendTarget(value: unknown): BackendTarget {
  return value === "workshop" ? "workshop" : "control";
}

export function readStoredBackendTarget(): BackendTarget {
  if (typeof window === "undefined") return "control";
  const stored = window.localStorage.getItem(BACKEND_TARGET_STORAGE_KEY);
  return normalizeBackendTarget(stored);
}

export function persistBackendTarget(nextTarget: BackendTarget) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BACKEND_TARGET_STORAGE_KEY, nextTarget);
  window.dispatchEvent(new Event(BACKEND_TARGET_CHANGE_EVENT));
}

export function inferConvexSiteUrl(rawUrl?: string | null) {
  const value = trimValue(rawUrl);
  if (!value) return "";

  try {
    const parsed = new URL(value);
    parsed.hostname = parsed.hostname.replace(/\.cloud$/i, ".site");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function getBackendUrlConfig() {
  const env = (import.meta as any).env ?? {};
  const controlUrl =
    trimValue(env.VITE_CONVEX_CONTROL_URL) ||
    trimValue(env.VITE_CONVEX_URL);
  const workshopUrl = trimValue(env.VITE_CONVEX_WORKSHOP_URL);
  const controlSiteUrl =
    trimValue(env.VITE_CONVEX_CONTROL_SITE_URL) ||
    trimValue(env.VITE_CONVEX_SITE_URL) ||
    inferConvexSiteUrl(controlUrl);
  const workshopSiteUrl =
    trimValue(env.VITE_CONVEX_WORKSHOP_SITE_URL) ||
    inferConvexSiteUrl(workshopUrl);

  return {
    controlUrl,
    workshopUrl,
    controlSiteUrl,
    workshopSiteUrl,
  };
}
