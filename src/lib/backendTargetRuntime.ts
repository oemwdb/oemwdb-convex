let currentConvexSiteUrl = "";

export function setRuntimeConvexSiteUrl(nextSiteUrl?: string | null) {
  currentConvexSiteUrl = typeof nextSiteUrl === "string" ? nextSiteUrl.trim() : "";
}

export function getRuntimeConvexSiteUrl() {
  return currentConvexSiteUrl;
}
