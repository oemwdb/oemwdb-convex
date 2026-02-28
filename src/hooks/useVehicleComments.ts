import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  id: string;
  user_id: string;
  vehicle_id: string;
  comment_text: string;
  tag: string;
  created_at: string;
  user_email?: string;
}

export const TAG_OPTIONS = [
  "General",
  "Brief",
  "Variants",
  "Wheels",
  "Maintenance",
  "Upgrades",
  "Gallery",
] as const;

export function useVehicleComments(vehicleId: string) {
  const { user } = useAuth();
  const vehicle = useQuery(
    api.queries.vehiclesGetById,
    vehicleId ? { id: vehicleId } : "skip"
  );
  const vehicleConvexId = vehicle?._id;
  const commentsRaw = useQuery(
    api.queries.vehicleCommentsGetByVehicle,
    vehicleConvexId ? { vehicleId: vehicleConvexId } : "skip"
  );
  const insertComment = useMutation(api.mutations.vehicleCommentInsert);

  const comments: Comment[] =
    commentsRaw?.map((c) => ({
      id: String(c._id),
      user_id: c.user_id,
      vehicle_id: String(c.vehicle_id),
      comment_text: c.comment_text,
      tag: c.tag ?? "General",
      created_at: c.created_at ?? new Date().toISOString(),
    })) ?? [];

  const addComment = {
    mutateAsync: async ({
      comment,
      tag,
    }: {
      comment: string;
      tag: string;
    }) => {
      if (!user?.id) throw new Error("Must be logged in to comment");
      if (!vehicleConvexId) throw new Error("Vehicle not found");
      return await insertComment({
        vehicleId: vehicleConvexId,
        userId: user.id,
        comment_text: comment,
        tag,
      });
    },
  };

  return {
    comments,
    isLoading: !!vehicleId && (vehicle === undefined || (!!vehicleConvexId && commentsRaw === undefined)),
    error: null,
    addComment,
    TAG_OPTIONS,
  };
}
