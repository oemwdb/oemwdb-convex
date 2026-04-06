import { useEffect, useMemo, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { MarketFeaturedCard } from "@/components/market/MarketFeaturedCard";
import { MarketFeaturedItemForm } from "@/components/market/MarketFeaturedItemForm";
import type {
  MarketFeaturedItem,
  MarketFeaturedItemFormValue,
  MarketSellerPlacementSummary,
} from "@/components/market/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

function normalizeSellerKey(rawValue: string, fallback: string) {
  return (rawValue || fallback || "seller")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateInputValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function buildFormValue(item: MarketFeaturedItem): MarketFeaturedItemFormValue {
  const extraImages = item.imageGallery.filter((imageUrl) => imageUrl !== item.imageUrl);
  return {
    title: item.title,
    shortDescription: item.shortDescription ?? "",
    description: item.description ?? "",
    price: item.price === null ? "" : String(item.price),
    currency: item.currency || "USD",
    imageUrl: item.imageUrl ?? "",
    extraImagesText: extraImages.join("\n"),
    destinationUrl: item.destinationUrl ?? "",
    sourceProvider: item.sourceProvider || "External",
    listingType: item.listingType,
    location: item.location ?? "",
    sellerDisplayName: item.sellerDisplayName ?? "",
    sellerKey: item.sellerKey ?? "",
    placementCoverage: item.placementCoverage,
    startDate: toDateInputValue(item.startDate),
    endDate: toDateInputValue(item.endDate),
    moderationStatus: item.moderationStatus,
    status: item.status === "inactive" ? "inactive" : item.status === "draft" ? "draft" : "active",
    linkedObjects: item.linkedObjects,
  };
}

export default function MarketListingDetailPage() {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  const { isAdmin } = useAuth();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const updateFeaturedItem = useMutation(api.market.adminFeaturedItemUpdate);
  const [formValue, setFormValue] = useState<MarketFeaturedItemFormValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canUseAdminQueries = isAdmin && isConvexAuthenticated && !isConvexAuthLoading && !!listingId;
  const listing = useQuery(
    api.market.adminFeaturedItemGet,
    canUseAdminQueries ? { listingId: listingId as Id<"market_listings"> } : "skip"
  ) as { item: MarketFeaturedItem; sellerSummary: MarketSellerPlacementSummary | null } | null | undefined;

  useEffect(() => {
    if (listing?.item) {
      setFormValue(buildFormValue(listing.item));
    }
  }, [listing?.item]);

  const normalizedSellerKey = useMemo(
    () => normalizeSellerKey(formValue?.sellerKey ?? "", formValue?.sellerDisplayName ?? ""),
    [formValue?.sellerDisplayName, formValue?.sellerKey]
  );

  const liveSellerSummary = useQuery(
    api.market.adminSellerPlacementSummary,
    canUseAdminQueries && formValue?.placementCoverage === "membership" && normalizedSellerKey
      ? { sellerKey: normalizedSellerKey, excludeListingId: listingId as Id<"market_listings"> }
      : "skip"
  ) as MarketSellerPlacementSummary | undefined;

  const handleSubmit = async () => {
    if (!formValue || !listingId || !canUseAdminQueries) return;

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
        description: "Attach at least one OEMWDB object to the featured item.",
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
      await updateFeaturedItem({
        listingId: listingId as Id<"market_listings">,
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
        title: "Featured item updated",
        description: "Changes saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update featured item",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Edit" disableContentPadding={true}>
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
          ) : !listingId ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No featured item id provided.
              </CardContent>
            </Card>
          ) : listing === null ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Featured item not found.
              </CardContent>
            </Card>
          ) : listing === undefined || formValue === null ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading featured item…
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-4">
                <MarketFeaturedCard item={listing.item} />
              </div>

              <MarketFeaturedItemForm
                value={formValue}
                onChange={setFormValue}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                canUseAdminQueries={canUseAdminQueries}
                sellerSummary={liveSellerSummary ?? listing.sellerSummary}
                submitLabel="Save"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
