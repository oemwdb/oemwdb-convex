export const STORAGE_NAMESPACES = [
  "imports",
  "brands",
  "vehicles",
  "wheels",
  "variants",
  "shared",
] as const;

export type StorageNamespace = (typeof STORAGE_NAMESPACES)[number];

type OwnershipHints = {
  brand_id?: unknown;
  vehicle_id?: unknown;
  wheel_id?: unknown;
  variant_id?: unknown;
};

export function normalizePath(path: string) {
  return path
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/");
}

export function normalizeRelativePath(path: string) {
  return normalizePath(path);
}

export function isStorageNamespace(value: string): value is StorageNamespace {
  return (STORAGE_NAMESPACES as readonly string[]).includes(value);
}

function inferNamespaceFromHints(hints: OwnershipHints): StorageNamespace {
  if (hints.variant_id) return "variants";
  if (hints.wheel_id) return "wheels";
  if (hints.vehicle_id) return "vehicles";
  if (hints.brand_id) return "brands";
  return "shared";
}

export function derivePathMetadata(path: string, hints: OwnershipHints = {}) {
  const normalizedPath = normalizePath(path);
  const segments = normalizedPath.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const hasExplicitNamespace = isStorageNamespace(firstSegment);
  const namespace = hasExplicitNamespace
    ? firstSegment
    : inferNamespaceFromHints(hints);
  const relativeSegments = hasExplicitNamespace ? segments.slice(1) : segments;
  const relativePath = relativeSegments.join("/");
  const name =
    relativeSegments[relativeSegments.length - 1] ??
    firstSegment ??
    namespace;
  const parentPath = relativeSegments.slice(0, -1).join("/");

  return {
    normalizedPath,
    namespace,
    relativePath,
    name,
    parentPath,
    hasExplicitNamespace,
  };
}

export function buildStoragePath(namespace: StorageNamespace, relativePath = "") {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  return normalizedRelativePath
    ? `${namespace}/${normalizedRelativePath}`
    : namespace;
}
