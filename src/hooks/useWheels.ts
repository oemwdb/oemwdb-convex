import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface Wheel {
  id: string;
  wheel_name: string;
  brand_name: string | null;
  diameter: string | null;
  width: string | null;
  bolt_pattern: string | null;
  center_bore: string | null;
  wheel_offset: string | null;
  color: string | null;
  good_pic_url: string | null;
  bad_pic_url: string | null;
  status: string | null;
  image_source: string | null;
  specifications?: Record<string, unknown> | null;
  diameter_ref?: unknown;
  width_ref?: unknown;
  bolt_pattern_ref?: unknown;
  center_bore_ref?: unknown;
  color_ref?: unknown;
  tire_size_ref?: unknown;
  vehicle_ref?: unknown;
  brand_ref?: unknown;
  design_style_ref?: string[];
}

function mapToWheelShape(raw: {
  id: string;
  wheel_title: string;
  brand_name?: string | null;
  good_pic_url?: string | null;
  image_source?: string | null;
  specifications_json?: string | null;
}): Wheel {
  let specifications: Record<string, unknown> | null = null;
  if (raw.specifications_json) {
    try {
      specifications = JSON.parse(raw.specifications_json) as Record<string, unknown>;
    } catch {
      specifications = null;
    }
  }
  return {
    id: raw.id,
    wheel_name: raw.wheel_title ?? "",
    brand_name: raw.brand_name ?? null,
    diameter: null,
    width: null,
    bolt_pattern: null,
    center_bore: null,
    wheel_offset: null,
    color: null,
    good_pic_url: raw.good_pic_url ?? null,
    bad_pic_url: null,
    status: "active",
    image_source: raw.image_source ?? null,
    specifications: specifications ?? null,
    diameter_ref: [],
    width_ref: [],
    bolt_pattern_ref: [],
    center_bore_ref: [],
    color_ref: [],
    tire_size_ref: [],
    vehicle_ref: [],
    brand_ref: [],
    design_style_ref: [],
  };
}

export function useWheels() {
  const data = useQuery(api.queries.wheelsGetAllWithBrands);

  const wheels: Wheel[] = data?.map(mapToWheelShape) ?? [];

  return {
    data: wheels,
    isLoading: data === undefined,
    error: null,
    isError: false,
  };
}
