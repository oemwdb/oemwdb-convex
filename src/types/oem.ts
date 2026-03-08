/**
 * Shared DTO types for OEM entities (brands, vehicles, wheels) used across the UI.
 * Data is sourced from Convex.
 */

export interface OemBrand {
  id: string;
  brand_title?: string | null;
  brand_description?: string | null;
  brand_image_url?: string | null;
  [key: string]: unknown;
}

export interface OemVehicle {
  id: string;
  model_name?: string | null;
  vehicle_title?: string | null;
  vehicle_image?: string | null;
  brand_name?: string | null;
  production_years?: string | null;
  [key: string]: unknown;
}

export interface OemWheel {
  id: string;
  wheel_name: string;
  brand_name?: string | null;
  diameter?: string | null;
  width?: string | null;
  bolt_pattern?: string | null;
  center_bore?: string | null;
  tire_size?: string | null;
  wheel_offset?: string | null;
  color?: string | null;
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
