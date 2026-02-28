import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface Brand {
  id: string;
  brand_title: string;
  brand_description: string | null;
  brand_image_url: string | null;
  brand_page: string | null;
  subsidiaries: string | null;
  wheel_count?: number | null;
}

export function useBrands() {
  const data = useQuery(api.queries.brandsGetAll);

  // Filter to only show brands with images (matches original behavior)
  const brandsWithImages: Brand[] =
    data?.filter((brand) => brand.brand_image_url) ?? [];

  return {
    data: brandsWithImages,
    isLoading: data === undefined,
    error: null,
    isError: false,
  };
}
