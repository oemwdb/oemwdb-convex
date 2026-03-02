import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { CollectionType } from "@/components/search/CollectionCarouselSelector";

export function useGlobalSearch() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const collection =
    (searchParams.get("collection") || "all") as CollectionType;

  const searchBrands =
    !!searchQuery && (collection === "all" || collection === "brands");
  const searchVehicles =
    !!searchQuery && (collection === "all" || collection === "vehicles");
  const searchWheels =
    !!searchQuery && (collection === "all" || collection === "wheels");

  const brandsRaw = useQuery(
    api.queries.globalSearchBrands,
    searchBrands ? { query: searchQuery } : "skip"
  );
  const vehiclesRaw = useQuery(
    api.queries.globalSearchVehicles,
    searchVehicles ? { query: searchQuery } : "skip"
  );
  const wheelsRaw = useQuery(
    api.queries.globalSearchWheels,
    searchWheels ? { query: searchQuery } : "skip"
  );
  const allBrands = useQuery(
    api.queries.brandsGetAll,
    searchVehicles && vehiclesRaw && vehiclesRaw.length > 0 ? {} : "skip"
  );

  const brandMap = new Map(
    (allBrands ?? []).map((b) => [b._id, b.brand_title])
  );

  const brands =
    brandsRaw?.map((b) => ({
      ...b,
      name: b.brand_title,
    })) ?? [];

  const vehicles =
    vehiclesRaw?.map((v) => ({
      ...v,
      brand_refs: [] as string[],
      hero_image_url: v.vehicle_image ?? null,
    })) ?? [];

  const wheels =
    wheelsRaw?.map((w) => ({
      ...w,
      wheel_name: w.wheel_title,
      diameter_refs: [] as string[],
      bolt_pattern_refs: [] as string[],
      width_refs: [] as string[],
    })) ?? [];

  const isLoading =
    (searchBrands && brandsRaw === undefined) ||
    (searchVehicles && vehiclesRaw === undefined) ||
    (searchWheels && wheelsRaw === undefined) ||
    (searchVehicles &&
      vehiclesRaw &&
      vehiclesRaw.length > 0 &&
      allBrands === undefined);

  return {
    searchQuery,
    collection,
    brands,
    vehicles,
    wheels,
    isLoading,
    hasSearch: !!searchQuery,
  };
}
