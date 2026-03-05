import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Wheel shape used across the UI (WheelsPage, WheelsGrid, admin tables, tag suggestions).
 * This is a "Supabase-style" DTO mapped from Convex's oem_wheels table.
 */
export interface SupabaseWheel {
  id: string;
  wheel_name: string;
  brand_name?: string | null;
  diameter?: string | null;
  width?: string | null;
  bolt_pattern?: string | null;
  center_bore?: string | null;
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

function parseSpecifications(specifications_json: string | undefined | null) {
  if (!specifications_json) return null;
  try {
    return JSON.parse(specifications_json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mapToSupabaseWheel(raw: any): SupabaseWheel {
  return {
    id: (raw.id as string | undefined) ?? (raw._id as string),
    wheel_name: (raw.wheel_title as string | undefined) ?? "",
    brand_name: (raw.brand_name as string | undefined) ?? null,
    // These will be hydrated more richly once diameter/width/bolt pattern relationships are wired
    diameter: null,
    width: null,
    bolt_pattern: null,
    center_bore: null,
    wheel_offset: (raw.wheel_offset as string | undefined) ?? null,
    color: (raw.color as string | undefined) ?? null,
    good_pic_url: (raw.good_pic_url as string | undefined) ?? null,
    bad_pic_url: (raw.bad_pic_url as string | undefined) ?? null,
    status: (raw.status as string | undefined) ?? null,
    image_source: (raw.image_source as string | undefined) ?? null,
    specifications: parseSpecifications(
      raw.specifications_json as string | undefined | null
    ),
    // Reference-style fields are currently empty arrays; they can be populated from
    // junction tables in a later migration step.
    diameter_ref: [],
    width_ref: [],
    bolt_pattern_ref: [],
    center_bore_ref: [],
    color_ref: [],
    tire_size_ref: [],
    vehicle_ref: [],
    brand_ref: [],
    design_style_ref: (raw.design_style_tags as string[] | undefined) ?? [],
    created_at: (raw.created_at as string | undefined) ?? null,
    updated_at: (raw.updated_at as string | undefined) ?? null,
    slug: (raw.slug as string | undefined) ?? null,
    style_number: (raw.style_number as string | undefined) ?? null,
  };
}

export function useSupabaseWheels() {
  const data = useQuery(api.queries.wheelsGetAllWithBrands, {});

  const wheels: SupabaseWheel[] = (data ?? []).map(mapToSupabaseWheel);

  return {
    data: wheels,
    isLoading: data === undefined,
    error: null as unknown,
    isError: false,
  };
}

