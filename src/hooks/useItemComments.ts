import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/AuthContext";
import { useSafeConvexQuery } from "@/hooks/useSafeConvexQuery";

export type CommentableItemType =
  | "brand"
  | "vehicle"
  | "wheel"
  | "engine"
  | "vehicle_variant"
  | "wheel_variant";

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
  itemId:
    | Id<"oem_brands">
    | Id<"oem_vehicles">
    | Id<"oem_wheels">
    | Id<"oem_engines">
    | Id<"oem_vehicle_variants">
    | Id<"oem_wheel_variants">
    | null
    | undefined
) {
  const { user, isAuthenticated } = useAuth();

  const vehicleCommentsState = useSafeConvexQuery<any[]>(
    api.queries.vehicleCommentsGetByVehicle,
    itemType === "vehicle" && itemId
      ? { vehicleId: itemId as Id<"oem_vehicles"> }
      : "skip"
  );
  const wheelCommentsState = useSafeConvexQuery<any[]>(
    api.queries.wheelCommentsGetByWheel,
    itemType === "wheel" && itemId
      ? { wheelId: itemId as Id<"oem_wheels"> }
      : "skip"
  );
  const brandCommentsState = useSafeConvexQuery<any[]>(
    api.queries.brandCommentsGetByBrand,
    itemType === "brand" && itemId
      ? { brandId: itemId as Id<"oem_brands"> }
      : "skip"
  );
  const engineCommentsState = useSafeConvexQuery<any[]>(
    api.queries.engineCommentsGetByEngine,
    itemType === "engine" && itemId
      ? { engineId: itemId as Id<"oem_engines"> }
      : "skip"
  );
  const vehicleVariantCommentsState = useSafeConvexQuery<any[]>(
    api.queries.vehicleVariantCommentsGetByVehicleVariant,
    itemType === "vehicle_variant" && itemId
      ? { vehicleVariantId: itemId as Id<"oem_vehicle_variants"> }
      : "skip"
  );
  const wheelVariantCommentsState = useSafeConvexQuery<any[]>(
    api.queries.wheelVariantCommentsGetByWheelVariant,
    itemType === "wheel_variant" && itemId
      ? { wheelVariantId: itemId as Id<"oem_wheel_variants"> }
      : "skip"
  );

  const insertVehicleComment = useMutation(api.mutations.vehicleCommentInsert);
  const insertEngineComment = useMutation(api.mutations.engineCommentInsert);
  const insertWheelComment = useMutation(api.mutations.wheelCommentInsert);
  const insertBrandComment = useMutation(api.mutations.brandCommentInsert);
  const insertVehicleVariantComment = useMutation(api.mutations.vehicleVariantCommentInsert);
  const insertWheelVariantComment = useMutation(api.mutations.wheelVariantCommentInsert);

  const commentsState =
    itemType === "vehicle"
      ? vehicleCommentsState
      : itemType === "engine"
        ? engineCommentsState
      : itemType === "vehicle_variant"
        ? vehicleVariantCommentsState
      : itemType === "wheel_variant"
        ? wheelVariantCommentsState
      : itemType === "wheel"
        ? wheelCommentsState
        : brandCommentsState;

  const commentsRaw = commentsState.data;
  const commentsError = commentsState.error;
  const hasMissingFunctionError = commentsError?.message?.includes("Could not find public function") ?? false;

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
    if (hasMissingFunctionError) {
      throw new Error("Comments are unavailable on this backend");
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

    if (itemType === "engine") {
      await insertEngineComment({
        engineId: itemId as Id<"oem_engines">,
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

    if (itemType === "vehicle_variant") {
      await insertVehicleVariantComment({
        vehicleVariantId: itemId as Id<"oem_vehicle_variants">,
        userId: user.id,
        userName,
        comment_text: trimmed,
      });
      return;
    }

    if (itemType === "wheel_variant") {
      await insertWheelVariantComment({
        wheelVariantId: itemId as Id<"oem_wheel_variants">,
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
    isLoading: !!itemId && commentsState.isLoading,
    isAuthenticated,
    error: commentsError,
    isAvailable: !hasMissingFunctionError,
  };
}
