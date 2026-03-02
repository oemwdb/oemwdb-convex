import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

/** Saved brand shape for BrandCard: name, wheelCount, description, imagelink, isSaved */
export type SavedBrandItem = {
  id: string;
  name: string;
  wheelCount: number;
  description?: string | null;
  imagelink?: string | null;
  isSaved: true;
};

export function useSavedBrands() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const brandsRaw = useQuery(
    api.queries.savedBrandsGetByUser,
    userId ? { userId } : "skip"
  );

  const data: SavedBrandItem[] =
    brandsRaw?.map((b) => ({
      id: b.id ?? "",
      name: b.brand_title ?? "",
      wheelCount: 0,
      description: b.brand_description ?? null,
      imagelink: b.brand_image_url ?? null,
      isSaved: true as const,
    })) ?? [];

  return {
    data,
    isLoading: !!userId && brandsRaw === undefined,
    error: null,
    isError: false,
  };
}
