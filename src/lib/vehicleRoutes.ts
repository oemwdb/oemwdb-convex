const normalizeVehicleRouteText = (value?: string | null) => value?.trim() || null;

const slugifyVehicleFallback = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getVehicleRouteParam = (vehicle: {
  id?: string | null;
  slug?: string | null;
  routeId?: string | null;
  name?: string | null;
}) => {
  const explicitRouteId = normalizeVehicleRouteText(vehicle.routeId);
  if (explicitRouteId) return explicitRouteId;

  const id = normalizeVehicleRouteText(vehicle.id);
  if (id) return id;

  const slug = normalizeVehicleRouteText(vehicle.slug);
  if (slug) return slug;

  const name = normalizeVehicleRouteText(vehicle.name);
  return name ? slugifyVehicleFallback(name) : "unknown-vehicle";
};

export const getVehicleRoutePath = (vehicle: {
  id?: string | null;
  slug?: string | null;
  routeId?: string | null;
  name?: string | null;
}) => `/vehicles/${encodeURIComponent(getVehicleRouteParam(vehicle))}`;
