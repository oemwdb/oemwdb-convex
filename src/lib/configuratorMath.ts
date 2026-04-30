export type VehicleRigLike = {
  image_width_px?: number | null;
  image_height_px?: number | null;
  vehicle_length_mm?: number | null;
  front_x?: number | null;
  rear_x?: number | null;
  front_axle_x?: number | null;
  front_axle_y?: number | null;
  rear_axle_x?: number | null;
  rear_axle_y?: number | null;
  ground_y?: number | null;
  px_per_mm?: number | null;
};

export type WheelRigLike = {
  image_width_px?: number | null;
  image_height_px?: number | null;
  wheel_center_x?: number | null;
  wheel_center_y?: number | null;
  wheel_radius_px?: number | null;
  wheel_diameter_mm?: number | null;
  px_per_mm?: number | null;
};

export type WheelPlacement = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function finiteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function firstNumber(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function parseWheelDiameterMm(value: unknown) {
  const number = firstNumber(value);
  if (!number) return null;
  return number > 40 ? number : number * 25.4;
}

export function parseTireSize(value: unknown) {
  const text = String(value ?? "").toUpperCase().replace(/\s+/g, "");
  const match = text.match(/^(\d{3})\/(\d{2,3})[A-Z]*R(\d{2})(?:\D.*)?$/);
  if (!match) return null;

  const widthMm = Number(match[1]);
  const aspectRatio = Number(match[2]);
  const rimIn = Number(match[3]);
  const rimMm = rimIn * 25.4;
  const sidewallMm = widthMm * (aspectRatio / 100);

  return {
    widthMm,
    aspectRatio,
    rimIn,
    rimMm,
    outerDiameterMm: rimMm + sidewallMm * 2,
  };
}

export function calculateVehiclePxPerMm(rig: VehicleRigLike) {
  const frontX = finiteNumber(rig.front_x, NaN);
  const rearX = finiteNumber(rig.rear_x, NaN);
  const lengthMm = finiteNumber(rig.vehicle_length_mm, NaN);
  if (!Number.isFinite(frontX) || !Number.isFinite(rearX) || !Number.isFinite(lengthMm) || lengthMm <= 0) {
    return rig.px_per_mm ?? null;
  }
  return Math.abs(rearX - frontX) / lengthMm;
}

export function calculateWheelPxPerMm(rig: WheelRigLike) {
  const radiusPx = finiteNumber(rig.wheel_radius_px, NaN);
  const diameterMm = finiteNumber(rig.wheel_diameter_mm, NaN);
  if (!Number.isFinite(radiusPx) || !Number.isFinite(diameterMm) || diameterMm <= 0) {
    return rig.px_per_mm ?? null;
  }
  return (radiusPx * 2) / diameterMm;
}

export function calculateWheelPlacement(
  vehicleRig: VehicleRigLike,
  wheelRig: WheelRigLike,
  axle: "front" | "rear",
  displayScale: number,
  tireSize?: string | null
): WheelPlacement | null {
  const vehiclePxPerMm = calculateVehiclePxPerMm(vehicleRig);
  const wheelDiameterMm =
    parseTireSize(tireSize)?.outerDiameterMm ??
    finiteNumber(wheelRig.wheel_diameter_mm, NaN);
  const wheelRadiusPx = finiteNumber(wheelRig.wheel_radius_px, NaN);
  const wheelImageWidth = finiteNumber(wheelRig.image_width_px, NaN);
  const wheelImageHeight = finiteNumber(wheelRig.image_height_px, NaN);
  const centerX = finiteNumber(wheelRig.wheel_center_x, NaN);
  const centerY = finiteNumber(wheelRig.wheel_center_y, NaN);
  const axleX = finiteNumber(axle === "front" ? vehicleRig.front_axle_x : vehicleRig.rear_axle_x, NaN);
  const axleY = finiteNumber(axle === "front" ? vehicleRig.front_axle_y : vehicleRig.rear_axle_y, NaN);

  if (
    !vehiclePxPerMm ||
    !Number.isFinite(wheelDiameterMm) ||
    !Number.isFinite(wheelRadiusPx) ||
    !Number.isFinite(wheelImageWidth) ||
    !Number.isFinite(wheelImageHeight) ||
    !Number.isFinite(centerX) ||
    !Number.isFinite(centerY) ||
    !Number.isFinite(axleX) ||
    !Number.isFinite(axleY)
  ) {
    return null;
  }

  const targetDiameterInVehiclePx = wheelDiameterMm * vehiclePxPerMm;
  const sourceDiameterPx = wheelRadiusPx * 2;
  const naturalScale = targetDiameterInVehiclePx / sourceDiameterPx;
  const renderedScale = naturalScale * displayScale;

  return {
    left: axleX * displayScale - centerX * renderedScale,
    top: axleY * displayScale - centerY * renderedScale,
    width: wheelImageWidth * renderedScale,
    height: wheelImageHeight * renderedScale,
  };
}

export function formatMm(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)} mm` : "Unknown";
}

export function rigImageUrl<T extends { cutout_asset_url?: string | null; source_asset_url?: string | null }>(rig?: T | null) {
  return rig?.cutout_asset_url || rig?.source_asset_url || "";
}
