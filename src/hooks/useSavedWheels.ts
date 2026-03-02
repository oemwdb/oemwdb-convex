import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

/** Saved wheel shape for WheelCard: id, name, diameter, boltPattern, specs, imageUrl, refs */
export type SavedWheelItem = {
  id: string;
  name: string;
  diameter?: string;
  boltPattern?: string;
  specs?: string[];
  imageUrl?: string | null;
  imageSource?: string | null;
  diameter_ref?: unknown;
  width_ref?: unknown;
  bolt_pattern_ref?: unknown;
  center_bore_ref?: unknown;
  color_ref?: unknown;
  tire_size_ref?: unknown;
  vehicle_ref?: unknown;
  brand_ref?: unknown;
  design_style_ref?: string[];
  isSaved?: true;
};

export function useSavedWheels() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const wheelsRaw = useQuery(
    api.queries.savedWheelsGetByUser,
    userId ? { userId } : "skip"
  );

  const data: SavedWheelItem[] =
    wheelsRaw?.map((w) => ({
      id: w.id,
      name: w.wheel_title ?? "",
      diameter: undefined,
      boltPattern: undefined,
      specs: [],
      imageUrl: w.good_pic_url ?? null,
      imageSource: w.image_source ?? null,
      diameter_ref: undefined,
      width_ref: undefined,
      bolt_pattern_ref: undefined,
      center_bore_ref: undefined,
      color_ref: undefined,
      tire_size_ref: undefined,
      vehicle_ref: undefined,
      brand_ref: undefined,
      design_style_ref: [],
      isSaved: true as const,
    })) ?? [];

  return {
    data,
    isLoading: !!userId && wheelsRaw === undefined,
    error: null,
    isError: false,
  };
}
