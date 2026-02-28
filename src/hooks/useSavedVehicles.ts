import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

/** Saved vehicle shape for VehicleCard: id, name, brand, wheels, image, refs, isSaved */
export type SavedVehicleItem = {
  id: string;
  name: string;
  brand: string;
  wheels: number;
  image?: string | null;
  bolt_pattern_ref?: unknown;
  center_bore_ref?: unknown;
  wheel_diameter_ref?: unknown;
  wheel_width_ref?: unknown;
  isSaved: true;
};

export function useSavedVehicles() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const vehiclesRaw = useQuery(
    api.queries.savedVehiclesGetByUser,
    userId ? { userId } : "skip"
  );
  const brandsRaw = useQuery(
    api.queries.brandsGetAll,
    userId && vehiclesRaw && vehiclesRaw.length > 0 ? {} : "skip"
  );

  const brandMap = new Map(
    (brandsRaw ?? []).map((b) => [b._id, b.brand_title])
  );

  const data: SavedVehicleItem[] =
    vehiclesRaw?.map((v) => ({
      id: v.id,
      name: v.vehicle_title || v.model_name || v.vehicle_id_only || v.generation || "Unknown",
      brand: brandMap.get(v.brand_id) ?? "Unknown",
      wheels: 0,
      image: v.vehicle_image ?? null,
      bolt_pattern_ref: undefined,
      center_bore_ref: undefined,
      wheel_diameter_ref: undefined,
      wheel_width_ref: undefined,
      isSaved: true as const,
    })) ?? [];

  const isLoading =
    !!userId &&
    (vehiclesRaw === undefined ||
      (vehiclesRaw.length > 0 && brandsRaw === undefined));

  return {
    data,
    isLoading,
    error: null,
    isError: false,
  };
}
