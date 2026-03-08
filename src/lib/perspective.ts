export type ViewerPerspective = "dev" | "basic" | "user";

export const PERSPECTIVE_STORAGE_KEY = "oemwdb_viewer_perspective";

export const ADMIN_EMAILS = new Set([
  "gabrielvarzaru96@gmail.com",
]);

export function normalizePerspective(value: unknown): ViewerPerspective {
  return value === "dev" || value === "basic" || value === "user"
    ? value
    : "user";
}

export function readStoredPerspective(): ViewerPerspective {
  if (typeof window === "undefined") return "user";
  const stored = window.localStorage.getItem(PERSPECTIVE_STORAGE_KEY);
  return normalizePerspective(stored);
}
