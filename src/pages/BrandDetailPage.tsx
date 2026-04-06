import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBrandVehicles, useBrandWheels } from "@/hooks/useBrandDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelCard from "@/components/vehicle/WheelCard";
import { SaveButton } from "@/components/SaveButton";
import { ImageOff, Loader2 } from "lucide-react";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import { getPrimaryMediaUrl } from "@/lib/mediaUrls";
import { MarketSurfacePanel } from "@/components/market/MarketSurfacePanel";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { ItemPageEmptyState, ItemPageGrid } from "@/components/item-page/ItemPageCommonBlocks";

const BrandDetailPage = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand");

  // Format brand name for display (convert from URL format)
  const formattedBrandName = brandName
    ? brandName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("-")
    : "Unknown Brand";

  const brandSlug = brandName ?? "";
  const brand = useQuery(api.queries.brandsGetById, brandSlug ? { id: brandSlug } : "skip");
  const { template } = useResolvedItemPageLayoutTemplate("brand_item");
  const brandTitle = brand?.brand_title ?? "";
  const marketSurface = useConvexResourceQuery<any>({
    queryKey: ["brand-market-surface", brand?._id ?? "missing"],
    queryRef: api.market.surfaceByBrand,
    args: brand?._id ? { brandId: brand._id } : "skip",
    enabled: Boolean(brand?._id),
  });

  const { data: brandVehicles, isLoading: vehiclesLoading } = useBrandVehicles(brandTitle);
  const { data: brandWheels, isLoading: wheelsLoading } = useBrandWheels(brandTitle);

  const vehicleCardList = (brandVehicles ?? []).map((v) => ({
    id: v.id,
    name: v.model_name || v.chassis_code || "Unknown Vehicle",
    year: v.production_years ?? "",
    brand: v.brand_name ?? "",
    wheels: 0,
    image: v.hero_image_url ?? undefined,
  }));

  const wheelCardList = (brandWheels ?? []).map((w) => ({
    id: w.id,
    name: w.wheel_name,
    brand: w.brand_name ?? formattedBrandName,
    specs: [w.diameter, w.width, w.bolt_pattern, w.color].filter(Boolean) as string[],
    imageUrl: w.good_pic_url || "/placeholder.svg",
  }));
  const brandReferenceImageUrl = getPrimaryMediaUrl(brand?.brand_image_url, "oemwdb images");

  // Auto-flip all cards back to front when switching tabs
  useEffect(() => {
    setFlippedCards({});
  }, [activeTab]);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const enabledTabIds = template.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(template.defaultActiveTab);
    }
  }, [activeTab, template]);

  return (
    <ItemPageTabsShell
      titleTabLabel={formattedBrandName}
      template={template}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onBack={() => navigate(-1)}
      renderBlock={(block) => {
        switch (block.kind) {
          case "hero":
            return (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold">
                      {formattedBrandName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{formattedBrandName}</h1>
                        {brand ? (
                          <SaveButton
                            itemId={brand.id}
                            itemType="brand"
                            convexId={brand._id}
                          />
                        ) : null}
                      </div>
                      <p className="text-slate-500">
                        {vehicleCardList.length} vehicles • {wheelCardList.length} wheels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          case "vehicles_grid":
            return brand === undefined || vehiclesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : vehicleCardList.length === 0 ? (
              <ItemPageEmptyState
                title="No vehicles found"
                description="This brand does not have vehicles linked on the current backend yet."
              />
            ) : (
              <ItemPageGrid>
                {vehicleCardList.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id ?? vehicle.name}
                    vehicle={vehicle}
                    isFlipped={flippedCards[vehicle.name] || false}
                    onFlip={toggleCardFlip}
                  />
                ))}
              </ItemPageGrid>
            );
          case "wheels_grid":
            return brand === undefined || wheelsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : wheelCardList.length === 0 ? (
              <ItemPageEmptyState
                title="No wheels found"
                description="This brand does not have wheels linked on the current backend yet."
              />
            ) : (
              <ItemPageGrid>
                {wheelCardList.map((wheel) => (
                  <WheelCard
                    key={wheel.id}
                    wheel={wheel}
                    isFlipped={flippedCards[wheel.id] || false}
                    onFlip={toggleCardFlip}
                    linkToDetail={true}
                  />
                ))}
              </ItemPageGrid>
            );
          case "market":
            return marketSurface.isBackendUnavailable ? (
              <ConvexBackendUnavailableCard
                title="Market unavailable on this backend"
                description="The brand market surface query is not deployed on the active backend yet."
                error={marketSurface.error}
              />
            ) : marketSurface.isError ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-destructive">Could not load market data</p>
                  <p className="text-sm text-muted-foreground">{getConvexErrorMessage(marketSurface.error)}</p>
                </CardContent>
              </Card>
            ) : (
              <MarketSurfacePanel
                title="Listings"
                items={marketSurface.data?.items}
                emptyTitle="No linked listings yet"
                emptyDescription={`Nothing is linked directly to ${formattedBrandName} right now.`}
              />
            );
          case "gallery":
            return (
              <Card>
                <CardContent className="pt-4">
                  {brandReferenceImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                          src={brandReferenceImageUrl}
                          alt={`${formattedBrandName} reference`}
                          className="max-h-[600px] w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <ImageOff className="mx-auto mb-4 h-16 w-16 opacity-30" />
                      <p>No reference image available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          case "comments":
            return (
              <ItemCommentsPanel
                itemType="brand"
                itemId={brand?._id}
                itemName={formattedBrandName}
              />
            );
          default:
            return null;
        }
      }}
    />
  );
};

export default BrandDetailPage;
