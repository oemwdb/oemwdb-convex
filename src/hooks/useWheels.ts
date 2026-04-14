import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { OemWheel } from "@/types/oem";
import { toOemWheelCard } from "@/lib/wheelCards";

const FILTER_PARAM_KEYS = ["brand", "diameter", "width", "boltPattern", "centerBore", "tireSize", "color", "search"] as const;

/** True if the URL has any wheel filter/search params (so we need the full list for client-side filtering). */
export function hasWheelFilterParams(searchParams: URLSearchParams): boolean {
  if (searchParams.getAll("search").length > 0) return true;
  return FILTER_PARAM_KEYS.some((key) => key !== "search" && searchParams.getAll(key).length > 0);
}

export function useWheels(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const data = useQuery(
    api.queries.wheelsGetAllWithBrands,
    enabled ? {} : "skip"
  );

  const wheels: OemWheel[] = (data ?? []).map((raw) => toOemWheelCard(raw as Record<string, unknown>));

  return {
    data: wheels,
    isLoading: enabled && data === undefined,
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
          (data.jnc_brands as string | undefined) ??
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

/** Build filter args for wheelsListOnePageFiltered from URL search params. */
export function wheelsFilterArgsFromSearchParams(searchParams: URLSearchParams) {
  const brand = searchParams.getAll("brand").filter(Boolean);
  const diameter = searchParams.getAll("diameter").filter(Boolean);
  const width = searchParams.getAll("width").filter(Boolean);
  const boltPattern = searchParams.getAll("boltPattern").filter(Boolean);
  const centerBore = searchParams.getAll("centerBore").filter(Boolean);
  const tireSize = searchParams.getAll("tireSize").filter(Boolean);
  const color = searchParams.getAll("color").filter(Boolean);
  const search = searchParams.getAll("search").filter(Boolean);
  const hasGoodPic = searchParams.getAll("hasGoodPic").filter(Boolean);
  const hasBadPic = searchParams.getAll("hasBadPic").filter(Boolean);
  const sortBy = searchParams.get("sortBy")?.trim();
  return {
    ...(brand.length ? { brand } : {}),
    ...(diameter.length ? { diameter } : {}),
    ...(width.length ? { width } : {}),
    ...(boltPattern.length ? { boltPattern } : {}),
    ...(centerBore.length ? { centerBore } : {}),
    ...(tireSize.length ? { tireSize } : {}),
    ...(color.length ? { color } : {}),
    ...(search.length ? { search } : {}),
    ...(hasGoodPic.length ? { hasGoodPic } : {}),
    ...(hasBadPic.length ? { hasBadPic } : {}),
    ...(sortBy ? { sortBy } : {}),
  };
}

/** Single page of wheels. Uses filtered query when URL has filters, otherwise simple pagination. */
export function useWheelsPage(
  pageNumber: number,
  pageSize: number,
  filterArgs: ReturnType<typeof wheelsFilterArgsFromSearchParams>
) {
  const data = useQuery(
    api.queries.wheelsListOnePageFiltered,
    pageSize > 0 ? { page: pageNumber, pageSize, ...filterArgs } : "skip"
  );
  const wheels: OemWheel[] = (data?.page ?? []).map((raw) => toOemWheelCard(raw as Record<string, unknown>));
  return {
    data: wheels,
    pageNumber: (data as { pageNumber?: number } | undefined)?.pageNumber ?? pageNumber,
    pageSize: (data as { pageSize?: number } | undefined)?.pageSize ?? pageSize,
    totalCount: (data as { totalCount?: number | null } | undefined)?.totalCount ?? 0,
    totalPages: (data as { totalPages?: number } | undefined)?.totalPages ?? 1,
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
  const wheels: OemWheel[] = (results ?? []).map((raw) => toOemWheelCard(raw as Record<string, unknown>));
  return {
    data: wheels,
    isLoading: isLoading || status === "LoadingFirstPage",
    status,
    loadMore,
    error: null as unknown,
    isError: false,
  };
}
