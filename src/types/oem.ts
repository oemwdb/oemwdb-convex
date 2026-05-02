/**
 * Shared DTO types for OEM entities (brands, vehicles, wheels) used across the UI.
 * Data is sourced from Convex.
 */

export interface OemBrand {
  id: string;
  brand_title?: string | null;
  brand_description?: string | null;
  private_blurb?: string | null;
  brand_image_url?: string | null;
  [key: string]: unknown;
}

export interface OemVehicle {
  id: string;
  model_name?: string | null;
  vehicle_title?: string | null;
  private_blurb?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  brand_name?: string | null;
  production_years?: string | null;
  [key: string]: unknown;
}

export interface OemEngineFamily {
  id: string;
  engine_title?: string | null;
  engine_code?: string | null;
  private_blurb?: string | null;
  fuel_type?: string | null;
  aspiration?: string | null;
  displacement_l?: number | null;
  power_hp?: number | null;
  power_kw?: number | null;
  [key: string]: unknown;
}

export interface OemEngineVariant {
  id: string;
  engine_variant_title?: string | null;
  engine_variant_code?: string | null;
  powertrain_designation?: string | null;
  engine_variant_power_hp?: number | null;
  engine_variant_power_kw?: number | null;
  engine_variant_fuel_type?: string | null;
  engine_variant_aspiration?: string | null;
  engine_variant_electrification?: string | null;
  engine_id?: string | null;
  [key: string]: unknown;
}

export interface OemEngineFamilyBrowseVariant {
  id: string;
  label: string;
  title: string;
  engine_variant_code?: string | null;
  powertrain_designation?: string | null;
  displacement_l?: number | null;
  fuel_type?: string | null;
  aspiration?: string | null;
  power_hp?: number | null;
  power_kw?: number | null;
  source?: "engine_variant" | "engine_row" | string;
}

export interface OemEngineFamilyBrowseRow {
  id: string;
  family_key: string;
  family_row_id?: string | null;
  private_blurb?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  family_title: string;
  family_code?: string | null;
  engine_family_name?: string | null;
  engine_display_title?: string | null;
  brand_ref?: string | null;
  configuration?: string | null;
  engine_layout?: string | null;
  cylinders?: number | null;
  displacement_summary?: string | null;
  fuel_summary?: string | null;
  aspiration_summary?: string | null;
  engine_variant_title?: string | null;
  engine_variant_code?: string | null;
  powertrain_designation?: string | null;
  engine_variant_fuel_type?: string | null;
  engine_variant_aspiration?: string | null;
  engine_variant_power_hp?: number | null;
  engine_variant_power_kw?: number | null;
  engine_variant_displacement_l?: number | null;
  variant_count: number;
  family_engine_count: number;
  linked_vehicle_count: number;
  linked_vehicle_titles: string[];
  linked_vehicles: Array<{
    _id: string;
    id?: string | null;
    slug?: string | null;
    vehicle_title: string;
    model_name?: string | null;
    production_years?: string | null;
    good_pic_url?: string | null;
    bad_pic_url?: string | null;
    brand_title?: string | null;
  }>;
  variants: OemEngineFamilyBrowseVariant[];
  search_text?: string;
  [key: string]: unknown;
}

export interface OemVehicleVariant {
  id: string;
  vehicle_id?: string | null;
  variant_title?: string | null;
  trim_level?: string | null;
  year_from?: number | null;
  year_to?: number | null;
  market?: string | null;
  notes?: string | null;
  engine_id?: string | null;
  engine_variant_id?: string | null;
  engine_title?: string | null;
  engine_code?: string | null;
  engine_display_title?: string | null;
  engine_family_label?: string | null;
  fuel_type?: string | null;
  aspiration?: string | null;
  displacement_l?: number | null;
  power_hp?: number | null;
  power_kw?: number | null;
  configuration?: string | null;
  engine_layout?: string | null;
  cylinders?: number | null;
  engine_variant_title?: string | null;
  engine_variant_code?: string | null;
  powertrain_designation?: string | null;
  engine_variant_displacement_l?: number | null;
  engine_variant_power_hp?: number | null;
  engine_variant_power_kw?: number | null;
  engine_variant_fuel_type?: string | null;
  engine_variant_aspiration?: string | null;
  engine_variant_electrification?: string | null;
  [key: string]: unknown;
}

export interface OemWheel {
  id: string;
  convexId?: string;
  wheel_name: string;
  private_blurb?: string | null;
  brand_name?: string | null;
  /** Comma-separated wheel brands mirrored from j_wheel_brand. */
  jnc_brands?: string | null;
  diameter?: string | null;
  width?: string | null;
  bolt_pattern?: string | null;
  center_bore?: string | null;
  tire_size?: string | null;
  wheel_offset?: string | null;
  color?: string | null;
  vehicle_names?: string | string[] | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  status?: string | null;
  image_source?: string | null;
  specifications?: Record<string, unknown> | null;
  diameter_ref?: unknown[];
  width_ref?: unknown[];
  bolt_pattern_ref?: unknown[];
  center_bore_ref?: unknown[];
  color_ref?: unknown[];
  tire_size_ref?: unknown[];
  vehicle_ref?: unknown[];
  brand_ref?: unknown[];
  design_style_ref?: string[];
  created_at?: string | null;
  updated_at?: string | null;
  slug?: string | null;
  style_number?: string | null;
}
