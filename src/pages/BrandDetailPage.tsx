import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBrandVehicles, useBrandWheels, useBrandEngines, useBrandColors } from "@/hooks/useBrandDetail";
import { Card, CardContent } from "@/components/ui/card";
import { ImageOff, Loader2 } from "lucide-react";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import { getPrimaryMediaUrl } from "@/lib/mediaUrls";
import { MarketSurfacePanel } from "@/components/market/MarketSurfacePanel";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { AdminPrivateBlurbTab } from "@/components/item-page/AdminPrivateBlurbTab";
import { ItemPageEmptyState, ItemPageGrid } from "@/components/item-page/ItemPageCommonBlocks";
import BrandHeaderCard from "@/components/brand/BrandHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";
import BrandAssetsPanel from "@/components/brand/BrandAssetsPanel";
import EngineCard from "@/components/engine/EngineCard";
import ColorCard from "@/components/color/ColorCard";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicleGridColumns, useWheelsGridColumns } from "@/hooks/useWheelsGridColumns";
import { toOemWheelCard } from "@/lib/wheelCards";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
} from "@/components/collection/CollectionSecondarySidebar";
import { usePersistedCollectionSidebarState } from "@/hooks/usePersistedCollectionSidebar";

const BrandDetailPage = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicles");

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
  const { data: brandEngines, isLoading: enginesLoading } = useBrandEngines(brandTitle);
  const { data: brandColors, isLoading: colorsLoading } = useBrandColors(brandTitle);
  const { isAdmin } = useAuth();
  const showAdminAssets = isAdmin;
  const vehicleColumns = useVehicleGridColumns();
  const wheelColumns = useWheelsGridColumns();
  const collectionSidebar = usePersistedCollectionSidebarState("brands");

  const vehicleCardList = (brandVehicles ?? []).map((v) => ({
    id: v.id,
    name: v.vehicle_title || v.model_name || v.generation || "Unknown Vehicle",
    year: v.production_years ?? "",
    brand: v.brand_name || "Unknown",
    wheels: 0,
    image: undefined,
    good_pic_url: v.good_pic_url ?? null,
    bad_pic_url: v.bad_pic_url ?? null,
    bolt_pattern_ref: v.bolt_pattern ?? undefined,
    center_bore_ref: v.center_bore ?? undefined,
    wheel_diameter_ref: v.wheel_diameter_ref ?? undefined,
    wheel_width_ref: v.wheel_width_ref ?? undefined,
  }));

  const wheelCardList = useMemo(
    () =>
      (brandWheels ?? []).map((wheel) =>
        toOemWheelCard({
          ...wheel,
          wheel_name: wheel.wheel_name,
          brand_name: wheel.brand_name ?? formattedBrandName,
          good_pic_url: wheel.good_pic_url,
          bad_pic_url: wheel.bad_pic_url,
          tire_size: wheel.tire_size,
        } as Record<string, unknown>)
      ),
    [brandWheels, formattedBrandName]
  );
  const brandReferenceImageUrl = getPrimaryMediaUrl(brand?.brand_image_url, "oemwdb images");

  // Auto-flip all cards back to front when switching tabs
  useEffect(() => {
    setFlippedCards({});
  }, [activeTab]);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const brandTemplate = useMemo(() => {
    const order = ["vehicles", "engines", "wheels", "colors", "market", "comments"];
    const defaults: Record<string, { label: string; kind: "vehicles_grid" | "engines_grid" | "wheels_grid" | "colors_grid" | "market" | "comments" }> = {
      vehicles: { label: "Vehicles", kind: "vehicles_grid" },
      engines: { label: "Engines", kind: "engines_grid" },
      wheels: { label: "Wheels", kind: "wheels_grid" },
      colors: { label: "Colors", kind: "colors_grid" },
      market: { label: "Market", kind: "market" },
      comments: { label: "Comments", kind: "comments" },
    };
    const byId = new Map(template.tabs.map((tab) => [tab.id, tab]));
    const tabs = order.map((id) => {
      const existing = byId.get(id);
      if (existing) {
        const normalizedBlocks = existing.blocks.length
          ? existing.blocks
          : [
              {
                id: `${id}-block`,
                kind: defaults[id].kind,
                span: 12,
                enabled: true,
              },
            ];
        return {
          ...existing,
          label: defaults[id].label,
          enabled: true,
          blocks: normalizedBlocks,
        };
      }
      return {
        id,
        label: defaults[id].label,
        enabled: true,
        blocks: [
          {
            id: `${id}-block`,
            kind: defaults[id].kind,
            span: 12,
            enabled: true,
          },
        ],
      };
    });

    return {
      ...template,
      defaultActiveTab: order[0],
      tabs,
    };
  }, [template]);

  useEffect(() => {
    const enabledTabIds = brandTemplate.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (isAdmin && brand?._id) enabledTabIds.push("private-blurb");
    if (showAdminAssets) enabledTabIds.push("assets");
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(brandTemplate.defaultActiveTab);
    }
  }, [activeTab, brand?._id, brandTemplate, isAdmin, showAdminAssets]);

  const persistentHeaderContent = (
    <BrandHeaderCard
      title={brandTitle || formattedBrandName}
      description={brand?.brand_description ?? null}
      itemId={brand?.id}
      convexId={brand?._id}
      counts={[
        { label: "Vehicles", value: vehicleCardList.length },
        { label: "Engines", value: brandEngines.length },
        { label: "Wheels", value: wheelCardList.length },
        { label: "Colors", value: brandColors.length },
      ]}
      media={
        brandReferenceImageUrl ? (
          <HeaderMediaImage
            alt={brandTitle || formattedBrandName}
            sources={[{ value: brandReferenceImageUrl, bucketHint: "oemwdb images" }]}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-6xl font-semibold text-muted-foreground/70">
              {(brandTitle || formattedBrandName).charAt(0)}
            </span>
          </div>
        )
      }
    />
  );

  return (
    <ItemPageTabsShell
      titleTabLabel={formattedBrandName}
      template={brandTemplate}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onBack={() => navigate(-1)}
      tabPlacement="content"
      useItemTitleForFirstTab={false}
      secondaryHeaderContent={
        collectionSidebar.isAvailable ? <CollectionSecondarySidebarHeader state={collectionSidebar.state} /> : undefined
      }
      secondarySidebar={
        collectionSidebar.isAvailable ? <CollectionSecondarySidebarBody state={collectionSidebar.state} /> : undefined
      }
      secondarySidebarContextKey={collectionSidebar.isAvailable ? "brands" : undefined}
      persistentHeaderContent={persistentHeaderContent}
      additionalTabs={
        isAdmin && brand?._id
          ? [
              {
                id: "private-blurb",
                label: "Private blurb",
                triggerTone: "admin",
                content: (
                  <AdminPrivateBlurbTab
                    itemType="brand"
                    convexId={brand._id}
                    value={brand.private_blurb ?? ""}
                  />
                ),
              },
              ...(showAdminAssets ? [
              {
                id: "assets",
                label: "Assets",
                triggerTone: "admin",
                content: (
                  <BrandAssetsPanel
                    brandId={brand._id}
                    brandTitle={brandTitle || formattedBrandName}
                    brandImageUrl={brand?.brand_image_url ?? null}
                    goodPicUrl={brand?.good_pic_url ?? null}
                    badPicUrl={brand?.bad_pic_url ?? null}
                  />
                ),
              },
            ] : []),
            ]
          : []
      }
      renderBlock={(block) => {
        switch (block.kind) {
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
              <VehiclesGrid
                vehicles={vehicleCardList}
                flippedCards={flippedCards}
                onFlip={toggleCardFlip}
                insertAdEvery={vehicleColumns * 3}
              />
            );
          case "engines_grid":
            return brand === undefined || enginesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : brandEngines.length === 0 ? (
              <ItemPageEmptyState
                title="No engines found"
                description="This brand does not have engines linked on the current backend yet."
              />
            ) : (
              <ItemPageGrid insertAdEvery={vehicleColumns * 3}>
                {brandEngines.map((engine) => (
                  <EngineCard
                    key={engine.id}
                    engine={{
                      id: engine.id,
                      family_title: engine.family_title,
                      family_code: engine.family_code,
                      brand_ref: engine.brand_ref,
                      linked_vehicle_count: engine.linked_vehicle_count,
                      variant_count: engine.variant_count,
                      variants: [],
                      linked_vehicle_titles: [],
                      configuration: null,
                      engine_layout: null,
                      fuel_summary: null,
                      aspiration_summary: null,
                    } as any}
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
              <WheelsGrid
                wheels={wheelCardList}
                flippedCards={flippedCards}
                onFlip={toggleCardFlip}
                insertAdEvery={wheelColumns * 3}
              />
            );
          case "colors_grid":
            return brand === undefined || colorsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : brandColors.length === 0 ? (
              <ItemPageEmptyState
                title="No colors found"
                description="This brand does not have colors linked on the current backend yet."
              />
            ) : (
              <ItemPageGrid insertAdEvery={vehicleColumns * 3}>
                {brandColors.map((color) => (
                  <ColorCard
                    key={color.id}
                    color={{
                      slug: color.slug,
                      color_title: color.color_title,
                      brand_title: color.brand_title,
                      family_title: color.family_title,
                      finish: color.finish,
                      swatch_hex: color.swatch_hex,
                      wheelCount: color.wheelCount,
                      wheelVariantCount: color.wheelVariantCount,
                      vehicleCount: color.vehicleCount,
                      vehicleVariantCount: color.vehicleVariantCount,
                    }}
                    isFlipped={flippedCards[color.slug] || false}
                    onFlip={toggleCardFlip}
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
