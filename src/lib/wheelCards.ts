import type { OemWheel } from "@/types/oem";

function parseSpecifications(specificationsJson: string | undefined | null) {
  if (!specificationsJson) return null;
  try {
    return JSON.parse(specificationsJson) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function toOemWheelCard(raw: Record<string, unknown>): OemWheel {
  const brandName =
    asText(raw.brand_name) ??
    asText(raw.jnc_brands) ??
    asText(raw.text_brands) ??
    null;
  const diameter =
    asText(raw.diameter) ??
    asText(raw.text_diameters) ??
    null;
  const width =
    asText(raw.width) ??
    asText(raw.text_widths) ??
    null;
  const boltPattern =
    asText(raw.bolt_pattern) ??
    asText(raw.text_bolt_patterns) ??
    null;
  const centerBore =
    asText(raw.center_bore) ??
    asText(raw.text_center_bores) ??
    null;
  const tireSize =
    asText(raw.tire_size) ??
    asText(raw.text_tire_sizes) ??
    null;

  return {
    id: String(raw.id ?? raw._id ?? ""),
    convexId: asText(raw._id),
    wheel_name:
      asText(raw.wheel_title) ??
      asText(raw.wheel_name) ??
      asText(raw.name) ??
      "",
    private_blurb: asText(raw.private_blurb),
    brand_name: brandName,
    jnc_brands:
      asText(raw.jnc_brands) ??
      asText(raw.text_brands) ??
      null,
    diameter,
    width,
    bolt_pattern: boltPattern,
    center_bore: centerBore,
    tire_size: tireSize,
    wheel_offset: asText(raw.wheel_offset),
    color: asText(raw.color) ?? asText(raw.text_colors) ?? null,
    good_pic_url: asText(raw.good_pic_url),
    bad_pic_url: asText(raw.bad_pic_url),
    status: asText(raw.status),
    image_source: asText(raw.image_source),
    specifications: parseSpecifications(
      raw.specifications_json as string | undefined | null
    ),
    diameter_ref: asArray(raw.diameter_ref),
    width_ref: asArray(raw.width_ref),
    bolt_pattern_ref: asArray(raw.bolt_pattern_ref),
    center_bore_ref: asArray(raw.center_bore_ref),
    color_ref: asArray(raw.color_ref),
    tire_size_ref: asArray(raw.tire_size_ref),
    vehicle_ref: asArray(raw.vehicle_ref),
    brand_ref: asArray(raw.brand_ref),
    design_style_ref: asArray(raw.design_style_tags) as string[],
    created_at: asText(raw.created_at),
    updated_at: asText(raw.updated_at),
    slug: asText(raw.slug),
    style_number: asText(raw.style_number),
  };
}
