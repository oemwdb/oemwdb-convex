import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/AuthContext";

export type CommentableItemType = "brand" | "vehicle" | "wheel";

export interface ItemComment {
  id: string;
  userId: string;
  userName: string;
  commentText: string;
  createdAt: string | null;
}

function getUserDisplayName(user: unknown): string {
  if (!user || typeof user !== "object") {
    return "User";
  }

  const candidate = user as {
    fullName?: string | null;
    username?: string | null;
    primaryEmailAddress?: { emailAddress?: string | null } | null;
    emailAddresses?: Array<{ emailAddress?: string | null }> | null;
  };

  return (
    candidate.fullName?.trim() ||
    candidate.username?.trim() ||
    candidate.primaryEmailAddress?.emailAddress?.trim() ||
    candidate.emailAddresses?.[0]?.emailAddress?.trim() ||
    "User"
  );
}

export function useItemComments(
  itemType: CommentableItemType,
  itemId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | null | undefined
) {
  const { user, isAuthenticated } = useAuth();

  const vehicleCommentsRaw = useQuery(
    api.queries.vehicleCommentsGetByVehicle,
    itemType === "vehicle" && itemId
      ? { vehicleId: itemId as Id<"oem_vehicles"> }
      : "skip"
  );
  const wheelCommentsRaw = useQuery(
    api.queries.wheelCommentsGetByWheel,
    itemType === "wheel" && itemId
      ? { wheelId: itemId as Id<"oem_wheels"> }
      : "skip"
  );
  const brandCommentsRaw = useQuery(
    api.queries.brandCommentsGetByBrand,
    itemType === "brand" && itemId
      ? { brandId: itemId as Id<"oem_brands"> }
      : "skip"
  );

  const insertVehicleComment = useMutation(api.mutations.vehicleCommentInsert);
  const insertWheelComment = useMutation(api.mutations.wheelCommentInsert);
  const insertBrandComment = useMutation(api.mutations.brandCommentInsert);

  const commentsRaw =
    itemType === "vehicle"
      ? vehicleCommentsRaw
      : itemType === "wheel"
        ? wheelCommentsRaw
        : brandCommentsRaw;

  const comments: ItemComment[] =
    commentsRaw?.map((comment) => ({
      id: String(comment._id),
      userId: comment.user_id,
      userName: comment.user_name?.trim() || "User",
      commentText: comment.comment_text,
      createdAt: comment.created_at ?? null,
    })) ?? [];

  const addComment = async (commentText: string) => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      throw new Error("Comment cannot be empty");
    }
    if (!isAuthenticated || !user?.id) {
      throw new Error("Must be logged in to comment");
    }
    if (!itemId) {
      throw new Error("Item not found");
    }

    const userName = getUserDisplayName(user);

    if (itemType === "vehicle") {
      await insertVehicleComment({
        vehicleId: itemId as Id<"oem_vehicles">,
        userId: user.id,
        userName,
        comment_text: trimmed,
      });
      return;
    }

    if (itemType === "wheel") {
      await insertWheelComment({
        wheelId: itemId as Id<"oem_wheels">,
        userId: user.id,
        userName,
        comment_text: trimmed,
      });
      return;
    }

    await insertBrandComment({
      brandId: itemId as Id<"oem_brands">,
      userId: user.id,
      userName,
      comment_text: trimmed,
    });
  };

  return {
    comments,
    addComment,
    isLoading: !!itemId && commentsRaw === undefined,
    isAuthenticated,
  };
}
