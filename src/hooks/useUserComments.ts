import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export type UserCommentItem = {
  id: string;
  comment_text: string;
  created_at?: string | null;
  updated_at?: string | null;
  vehicle_id: string;
  oem_vehicles: {
    id: string;
    model_name: string | null;
    chassis_code: string | null;
    hero_image_url: string | null;
    brand_refs?: unknown;
  } | null;
};

export function useUserComments() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const dataRaw = useQuery(
    api.queries.userCommentsGetByUser,
    userId ? { userId } : "skip"
  );

  const data: UserCommentItem[] =
    dataRaw?.map((c) => ({
      id: String(c._id),
      comment_text: c.comment_text,
      created_at: c.created_at ?? null,
      updated_at: c.updated_at ?? null,
      vehicle_id: String(c.vehicle_id),
      oem_vehicles: c.oem_vehicles,
    })) ?? [];

  return {
    data,
    isLoading: !!userId && dataRaw === undefined,
    error: null,
    isError: false,
  };
}
