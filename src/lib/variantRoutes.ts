const normalizeRouteText = (value?: string | null) => value?.trim() || null;

const slugifyFallback = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function getVariantRouteParam(variant: {
  routeId?: string | null;
  slug?: string | null;
  id?: string | null;
  name?: string | null;
}) {
  const explicitRouteId = normalizeRouteText(variant.routeId);
  if (explicitRouteId) return explicitRouteId;

  const slug = normalizeRouteText(variant.slug);
  if (slug) return slug;

  const id = normalizeRouteText(variant.id);
  if (id) return id;

  const name = normalizeRouteText(variant.name);
  return name ? slugifyFallback(name) : "unknown-variant";
}

export function getVehicleVariantRoutePath(variant: {
  routeId?: string | null;
  slug?: string | null;
  id?: string | null;
  name?: string | null;
}) {
  return `/vehicle-variants/${encodeURIComponent(getVariantRouteParam(variant))}`;
}

export function getWheelVariantRoutePath(variant: {
  routeId?: string | null;
  slug?: string | null;
  id?: string | null;
  name?: string | null;
}) {
  return `/wheel-variants/${encodeURIComponent(getVariantRouteParam(variant))}`;
}
