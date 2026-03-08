import { useState } from "react";
import { Heart, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  itemId: number | string;
  itemType: "wheel" | "vehicle" | "brand";
  /** When provided, use Convex saved link/unlink. */
  convexId?: string;
  className?: string;
  iconStyle?: "bookmark" | "heart";
}

export const SaveButton = ({
  itemId,
  itemType,
  convexId,
  className,
  iconStyle = "bookmark",
}: SaveButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Convex: reactive saved check (only when convexId is provided)
  const savedBrand = useQuery(
    api.queries.savedBrandCheck,
    user && convexId && itemType === "brand"
      ? { userId: user.id, brandId: convexId as Id<"oem_brands"> }
      : "skip"
  );
  const savedVehicle = useQuery(
    api.queries.savedVehicleCheck,
    user && convexId && itemType === "vehicle"
      ? { userId: user.id, vehicleId: convexId as Id<"oem_vehicles"> }
      : "skip"
  );
  const savedWheel = useQuery(
    api.queries.savedWheelCheck,
    user && convexId && itemType === "wheel"
      ? { userId: user.id, wheelId: convexId as Id<"oem_wheels"> }
      : "skip"
  );

  const savedBrandLink = useMutation(api.mutations.savedBrandLink);
  const savedBrandUnlink = useMutation(api.mutations.savedBrandUnlink);
  const savedVehicleLink = useMutation(api.mutations.savedVehicleLink);
  const savedVehicleUnlink = useMutation(api.mutations.savedVehicleUnlink);
  const savedWheelLink = useMutation(api.mutations.savedWheelLink);
  const savedWheelUnlink = useMutation(api.mutations.savedWheelUnlink);

  const isSavedConvex =
    itemType === "brand"
      ? savedBrand
      : itemType === "vehicle"
        ? savedVehicle
        : savedWheel;
  const convexQueryLoading =
    convexId &&
    (itemType === "brand"
      ? savedBrand === undefined
      : itemType === "vehicle"
        ? savedVehicle === undefined
        : savedWheel === undefined);

  const [convexMutating, setConvexMutating] = useState(false);

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (convexId) {
      setConvexMutating(true);
      try {
        const id = convexId as Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels">;
        if (isSavedConvex) {
          switch (itemType) {
            case "brand":
              await savedBrandUnlink({ userId: user.id, brandId: id as Id<"oem_brands"> });
              break;
            case "vehicle":
              await savedVehicleUnlink({ userId: user.id, vehicleId: id as Id<"oem_vehicles"> });
              break;
            case "wheel":
              await savedWheelUnlink({ userId: user.id, wheelId: id as Id<"oem_wheels"> });
              break;
          }
          toast.success(`Removed from saved ${itemType}s`);
        } else {
          switch (itemType) {
            case "brand":
              await savedBrandLink({ userId: user.id, brandId: id as Id<"oem_brands"> });
              break;
            case "vehicle":
              await savedVehicleLink({ userId: user.id, vehicleId: id as Id<"oem_vehicles"> });
              break;
            case "wheel":
              await savedWheelLink({ userId: user.id, wheelId: id as Id<"oem_wheels"> });
              break;
          }
          toast.success(`Added to saved ${itemType}s`);
        }
      } catch {
        toast.error(`Failed to ${isSavedConvex ? "remove" : "save"} ${itemType}`);
      } finally {
        setConvexMutating(false);
      }
      return;
    }

    // No Convex ID: save/unsave not available
    toast.info("Save is only available for items loaded from the database.");
  };

  const isSaved = convexId ? !!isSavedConvex : false;
  const isLoading = convexId ? convexQueryLoading || convexMutating : false;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSave}
      disabled={isLoading}
      className={cn(iconStyle === "heart" && "rounded-full", className)}
    >
      {iconStyle === "heart" ? (
        <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
      ) : isSaved ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
};
