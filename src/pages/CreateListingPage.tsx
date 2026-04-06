import { useMemo, useState } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { MarketFeaturedItemForm } from "@/components/market/MarketFeaturedItemForm";
import type { MarketFeaturedItemFormValue, MarketSellerPlacementSummary } from "@/components/market/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString || Date.now());
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeSellerKey(rawValue: string, fallback: string) {
  return (rawValue || fallback || "seller")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const initialFormState: MarketFeaturedItemFormValue = {
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  currency: "USD",
  imageUrl: "",
  extraImagesText: "",
  destinationUrl: "",
  sourceProvider: "eBay",
  listingType: "wheel",
  location: "",
  sellerDisplayName: "",
  sellerKey: "",
  placementCoverage: "paid",
  startDate: todayIsoDate(),
  endDate: addDays(todayIsoDate(), 30),
  moderationStatus: "approved",
  status: "active",
  linkedObjects: [],
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const createFeaturedItem = useMutation(api.market.adminFeaturedItemCreate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValue, setFormValue] = useState<MarketFeaturedItemFormValue>(initialFormState);

  const canUseAdminQueries = isAdmin && isConvexAuthenticated && !isConvexAuthLoading;
  const normalizedSellerKey = useMemo(
    () => normalizeSellerKey(formValue.sellerKey, formValue.sellerDisplayName),
    [formValue.sellerDisplayName, formValue.sellerKey]
  );

  const sellerSummary = useQuery(
    api.market.adminSellerPlacementSummary,
    canUseAdminQueries && formValue.placementCoverage === "membership" && normalizedSellerKey
      ? { sellerKey: normalizedSellerKey }
      : "skip"
  ) as MarketSellerPlacementSummary | undefined;

  const handleSubmit = async () => {
    if (!canUseAdminQueries) {
      toast({
        title: "Convex auth required",
        description: "Wait for Convex auth to finish before creating a featured item.",
        variant: "destructive",
      });
      return;
    }

    if (!formValue.title.trim() || !formValue.destinationUrl.trim() || !formValue.sellerDisplayName.trim()) {
      toast({
        title: "Missing required fields",
        description: "Title, seller display name, and destination URL are required.",
        variant: "destructive",
      });
      return;
    }

    if (formValue.linkedObjects.length === 0) {
      toast({
        title: "Missing linked objects",
        description: "Attach at least one OEMWDB object so the featured item can appear contextually.",
        variant: "destructive",
      });
      return;
    }

    const linkedIds = {
      brandId: formValue.linkedObjects.find((linkedObject) => linkedObject.type === "brand")?.id as Id<"oem_brands"> | undefined,
      wheelId: formValue.linkedObjects.find((linkedObject) => linkedObject.type === "wheel")?.id as Id<"oem_wheels"> | undefined,
      wheelVariantId: formValue.linkedObjects.find((linkedObject) => linkedObject.type === "wheel_variant")?.id as Id<"oem_wheel_variants"> | undefined,
      vehicleId: formValue.linkedObjects.find((linkedObject) => linkedObject.type === "vehicle")?.id as Id<"oem_vehicles"> | undefined,
      vehicleVariantId: formValue.linkedObjects.find((linkedObject) => linkedObject.type === "vehicle_variant")?.id as Id<"oem_vehicle_variants"> | undefined,
    };

    const extraImages = formValue.extraImagesText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      const listingId = await createFeaturedItem({
        title: formValue.title.trim(),
        shortDescription: formValue.shortDescription.trim() || undefined,
        description: formValue.description.trim() || undefined,
        price: formValue.price.trim() ? Number(formValue.price) : undefined,
        currency: formValue.currency.trim() || "USD",
        imageUrl: formValue.imageUrl.trim() || undefined,
        images: extraImages.length > 0 ? extraImages : undefined,
        destinationUrl: formValue.destinationUrl.trim(),
        sourceProvider: formValue.sourceProvider,
        listingType: formValue.listingType,
        location: formValue.location.trim() || undefined,
        sellerDisplayName: formValue.sellerDisplayName.trim(),
        sellerKey: normalizedSellerKey || undefined,
        placementCoverage: formValue.placementCoverage,
        startDate: formValue.startDate || undefined,
        endDate: formValue.endDate || undefined,
        moderationStatus: formValue.moderationStatus,
        status: formValue.status,
        ...linkedIds,
      });

      toast({
        title: "Featured item created",
        description: "The external placement has been saved.",
      });
      navigate(`/market/${listingId}`);
    } catch (error) {
      toast({
        title: "Failed to create featured item",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="New" disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-2">
        <div className="mx-auto max-w-7xl space-y-4 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/market")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Market
          </Button>

          {isConvexAuthLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Waiting for Convex admin auth…
              </CardContent>
            </Card>
          ) : (
            <MarketFeaturedItemForm
              value={formValue}
              onChange={setFormValue}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              canUseAdminQueries={canUseAdminQueries}
              sellerSummary={sellerSummary ?? null}
              submitLabel="Create Item"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
