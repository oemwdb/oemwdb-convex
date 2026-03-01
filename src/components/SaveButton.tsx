import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface SaveButtonProps {
  itemId: number | string;
  itemType: "wheel" | "vehicle" | "brand";
  /** When provided, use Convex saved link/unlink; otherwise fall back to Supabase. */
  convexId?: string;
  className?: string;
}

export const SaveButton = ({
  itemId,
  itemType,
  convexId,
  className,
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

  // Supabase fallback: state + effect (when convexId is not provided)
  const [isSavedSupabase, setIsSavedSupabase] = useState(false);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  useEffect(() => {
    if (!convexId && user) {
      checkIfSaved();
    }
  }, [convexId, user, itemId, itemType]);

  const checkIfSaved = async () => {
    if (!user) return;
    try {
      let data: unknown;
      switch (itemType) {
        case "wheel":
          const { data: wheelData } = await supabase
            .from("saved_wheels")
            .select("id")
            .eq("user_id", user.id)
            .eq("wheel_id", String(itemId))
            .single();
          data = wheelData;
          break;
        case "vehicle":
          const { data: vehicleData } = await supabase
            .from("saved_vehicles")
            .select("id")
            .eq("user_id", user.id)
            .eq("vehicle_id", String(itemId))
            .single();
          data = vehicleData;
          break;
        case "brand":
          const { data: brandData } = await supabase
            .from("saved_brands")
            .select("id")
            .eq("user_id", user.id)
            .eq("brand_id", String(itemId))
            .single();
          data = brandData;
          break;
      }
      setIsSavedSupabase(!!data);
    } catch {
      setIsSavedSupabase(false);
    }
  };

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

    // Supabase path
    setSupabaseLoading(true);
    try {
      if (isSaved) {
        // Remove from saved items
        switch (itemType) {
          case "wheel":
            await supabase
              .from("saved_wheels")
              .delete()
              .eq("user_id", user.id)
              .eq("wheel_id", String(itemId));
            break;
          case "vehicle":
            await supabase
              .from("saved_vehicles")
              .delete()
              .eq("user_id", user.id)
              .eq("vehicle_id", String(itemId));
            break;
          case "brand":
            await supabase
              .from("saved_brands")
              .delete()
              .eq("user_id", user.id)
              .eq("brand_id", String(itemId));
            break;
        }
        setIsSavedSupabase(false);
        toast.success(`Removed from saved ${itemType}s`);
      } else {
        switch (itemType) {
          case "wheel":
            await supabase.from("saved_wheels").insert({
              user_id: user.id,
              wheel_id: String(itemId),
            });
            break;
          case "vehicle":
            await supabase.from("saved_vehicles").insert({
              user_id: user.id,
              vehicle_id: String(itemId),
            });
            break;
          case "brand":
            await supabase.from("saved_brands").insert({
              user_id: user.id,
              brand_id: String(itemId),
            });
            break;
        }
        setIsSavedSupabase(true);
        toast.success(`Added to saved ${itemType}s`);
      }
    } catch {
      toast.error(`Failed to ${isSavedSupabase ? "remove" : "save"} ${itemType}`);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const isSaved = convexId ? !!isSavedConvex : isSavedSupabase;
  const isLoading = convexId ? convexQueryLoading || convexMutating : supabaseLoading;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSave}
      disabled={isLoading}
      className={className}
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
};
