import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { OemWheel } from "@/types/oem";

function parseSpecifications(specifications_json: string | undefined | null) {
  if (!specifications_json) return null;
  try {
    return JSON.parse(specifications_json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mapToOemWheel(raw: Record<string, unknown>): OemWheel {
  const brand_name =
    (raw.brand_name as string | undefined) ??
    (raw.text_brands as string | undefined) ??
    null;
  const diameter =
    (raw.diameter as string | undefined) ??
    (raw.text_diameters as string | undefined) ??
    null;
  const width =
    (raw.width as string | undefined) ??
    (raw.text_widths as string | undefined) ??
    null;
  const bolt_pattern =
    (raw.bolt_pattern as string | undefined) ??
    (raw.text_bolt_patterns as string | undefined) ??
    null;
  const center_bore =
    (raw.center_bore as string | undefined) ??
    (raw.text_center_bores as string | undefined) ??
    null;
  const tire_size =
    (raw.tire_size as string | undefined) ??
    (raw.text_tire_sizes as string | undefined) ??
    null;

  return {
    id: (raw.id as string | undefined) ?? (raw._id as string),
    wheel_name: (raw.wheel_title as string | undefined) ?? "",
    brand_name,
    diameter,
    width,
    bolt_pattern,
    center_bore,
    tire_size,
    wheel_offset: (raw.wheel_offset as string | undefined) ?? null,
    color: (raw.color as string | undefined) ?? (raw.text_colors as string | undefined) ?? null,
    good_pic_url: (raw.good_pic_url as string | undefined) ?? null,
    bad_pic_url: (raw.bad_pic_url as string | undefined) ?? null,
    status: (raw.status as string | undefined) ?? null,
    image_source: (raw.image_source as string | undefined) ?? null,
    specifications: parseSpecifications(
      raw.specifications_json as string | undefined | null
    ),
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

export function useWheels() {
  const data = useQuery(api.queries.wheelsGetAllWithBrands, {});

  const wheels: OemWheel[] = (data ?? []).map((raw) => mapToOemWheel(raw as Record<string, unknown>));

  return {
    data: wheels,
    isLoading: data === undefined,
    error: null as unknown,
    isError: false,
  };
}

/** Fetch a single wheel by slug, id, or Convex _id (for WheelDetailPage). */
export function useWheelByName(wheelName: string) {
  const data = useQuery(
    api.queries.wheelsGetByIdFull,
    wheelName ? { id: wheelName } : "skip"
  );

  const wheel = data
    ? {
        ...data,
        wheel_name: (data.wheel_title ?? data.wheel_name ?? "") as string,
        id: (data.id ?? data._id) as string,
        brand_name:
          (data.brand_name as string | undefined) ??
          (data.text_brands as string | undefined) ??
          null,
        diameter:
          (data.diameter as string | undefined) ??
          (data.text_diameters as string | undefined) ??
          null,
        width:
          (data.width as string | undefined) ??
          (data.text_widths as string | undefined) ??
          null,
        bolt_pattern:
          (data.bolt_pattern as string | undefined) ??
          (data.text_bolt_patterns as string | undefined) ??
          null,
        center_bore:
          (data.center_bore as string | undefined) ??
          (data.text_center_bores as string | undefined) ??
          null,
        tire_size:
          (data.tire_size as string | undefined) ??
          (data.text_tire_sizes as string | undefined) ??
          null,
        color:
          (data.color as string | undefined) ??
          (data.text_colors as string | undefined) ??
          null,
      }
    : null;

  return {
    data: wheel,
    isLoading: data === undefined,
    error: null as unknown,
    isError: false,
  };
}

/** Paginated wheels list (saves DB bandwidth: only fetches one page at a time). */
export function usePaginatedWheels(initialNumItems: number) {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.queries.wheelsListPaginated,
    {},
    { initialNumItems }
  );
  const wheels: OemWheel[] = (results ?? []).map((raw) => mapToOemWheel(raw as Record<string, unknown>));
  return {
    data: wheels,
    isLoading: isLoading || status === "LoadingFirstPage",
    status,
    loadMore,
    error: null as unknown,
    isError: false,
  };
}
