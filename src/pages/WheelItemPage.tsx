import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useWheelByName } from "@/hooks/useWheels";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, CircleSlash2, MessageSquare, Image, ImageOff, ShoppingCart, Award, Info, TrendingUp, Car, Megaphone, Layers, Package2, DollarSign, MapPin } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import WheelVariantsTable from "@/components/wheel/WheelVariantsTable";
import WheelAssetsPanel from "@/components/wheel/WheelAssetsPanel";
import GallerySection from "@/components/vehicle/GallerySection";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import { MarketSurfacePanel } from "@/components/market/MarketSurfacePanel";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { AdminPrivateBlurbTab } from "@/components/item-page/AdminPrivateBlurbTab";
import { ItemPageEmptyState, ItemPageGrid, ItemPagePanel, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";
import { getWheelVariantRoutePath } from "@/lib/variantRoutes";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
} from "@/components/collection/CollectionSecondarySidebar";
import { usePersistedCollectionSidebarState } from "@/hooks/usePersistedCollectionSidebar";

function buildEbaySearchUrl(query: string) {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=6000`;
}

function splitSpecValues(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return [...new Set(
    value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  )];
}

const WheelItemPage = () => {
  const { wheelId } = useParams<{ wheelId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fitment");
  const { updateCurrentLabel } = useNavigation();
  const { isAdmin } = useAuth();
  const showAdminAssets = isAdmin;

  // Fetch wheel with related vehicles from Convex
  const { data: wheel, isLoading, error } = useWheelByName(wheelId || "");
  const marketSurfaceResource = useConvexResourceQuery<any>({
    queryKey: ["wheel-market-surface", wheel?._id ?? "missing"],
    queryRef: api.market.surfaceByWheel,
    args: wheel?._id ? { wheelId: wheel._id } : "skip",
    enabled: Boolean(wheel?._id),
  });
  const { template } = useResolvedItemPageLayoutTemplate("wheel_item");
  const wheelVariants = useQuery(
    api.queries.wheelVariantsGetByWheel,
    wheel?._id ? { wheelId: wheel._id } : "skip"
  ) ?? [];
  const wheelTemplate = useMemo(
    () => ({
      ...template,
      tabs: template.tabs.map((tab) =>
        tab.id === "fitment"
          ? { ...tab, label: "Brief", triggerClassName: undefined, triggerTone: "default" }
          : tab.id === "gallery" || tab.id === "market"
            ? { ...tab, triggerClassName: undefined, triggerTone: "default" }
            : tab
      ),
    }),
    [template]
  );
  const headerBlock = template.headerBlock;
  const collectionSidebar = usePersistedCollectionSidebarState("wheels");

  // Update breadcrumb label when wheel data is loaded
  useEffect(() => {
    if (wheel?.wheel_name) {
      updateCurrentLabel(wheel.wheel_name);
    }
  }, [wheel?.wheel_name, updateCurrentLabel]);

  useEffect(() => {
    const enabledTabIds = wheelTemplate.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (isAdmin && wheel?._id) enabledTabIds.push("private-blurb");
    if (showAdminAssets) enabledTabIds.push("assets");
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(wheelTemplate.defaultActiveTab);
    }
  }, [activeTab, isAdmin, showAdminAssets, wheelTemplate, wheel?._id]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." disableContentPadding={true}>
        <Card className="p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading wheel details...</p>
        </Card>
      </DashboardLayout>
    );
  }

  // If wheel not found or error, show error message
  if (!wheel || error) {
    return (
      <DashboardLayout title="Wheel Not Found" disableContentPadding={true}>
        <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
          <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Wheel not found</h2>
          <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the wheel you're looking for.</p>
          <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Link to="/wheels">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Wheels
            </Link>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  // Use wheel name for the dashboard title
  const pageTitle = wheel.wheel_name || `Wheel #${wheelId}`;

  const fitmentVehicles = wheel.vehicles ?? [];

  const compatibleVehicles = fitmentVehicles.map((vehicle) => ({
    id: String(vehicle._id ?? vehicle.id ?? ""),
    slug: typeof vehicle.slug === "string" ? vehicle.slug : undefined,
    routeId: String(vehicle.slug ?? vehicle.id ?? vehicle._id ?? ""),
    name: vehicle.vehicle_title || vehicle.model_name || vehicle.generation || "Unknown",
    brand: vehicle.brand_name || "Unknown",
    wheels: 0,
    image: undefined,
    good_pic_url: vehicle.good_pic_url || null,
    bad_pic_url: vehicle.bad_pic_url || null,
    bolt_pattern_ref: vehicle.bolt_pattern_ref ?? vehicle.bolt_pattern ?? vehicle.text_bolt_patterns,
    center_bore_ref: vehicle.center_bore_ref ?? vehicle.center_bore ?? vehicle.text_center_bores,
    wheel_diameter_ref: vehicle.wheel_diameter_ref ?? vehicle.diameter_ref ?? vehicle.text_diameters,
    wheel_width_ref: vehicle.wheel_width_ref ?? vehicle.width_ref ?? vehicle.text_widths,
  }));

  // Sample gallery images
  const galleryImages = wheel.good_pic_url ? [{
    id: 1,
    url: wheel.good_pic_url,
    alt: `${wheel.wheel_name} wheel`,
    user: "Official",
    date: "Official Photo"
  }] : [];

  const wheelSpecs = {
    diameter_refs: splitSpecValues(wheel.diameter),
    width_ref: splitSpecValues(wheel.width),
    offset: wheel.wheel_offset || "",
    offset_refs: splitSpecValues(wheel.wheel_offset),
    bolt_pattern_refs: splitSpecValues(wheel.bolt_pattern),
    center_bore_ref: splitSpecValues(wheel.center_bore),
    color_refs: splitSpecValues(wheel.color),
    tire_size_refs: splitSpecValues(wheel.tire_size),
  };

  // Generate available sizes based on the wheel model
  const availableSizes = [
    {
      diameter: wheel.diameter || "18\"",
      width: wheel.width || "8.5J",
      offset: wheel.wheel_offset || "ET40",
      finish: wheel.color || "Silver",
      price: "$249.99",
      inStock: wheel.status === "Ready for website"
    }
  ];

  return (
    <ItemPageTabsShell
      titleTabLabel={pageTitle}
      template={wheelTemplate}
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
      secondarySidebarContextKey={collectionSidebar.isAvailable ? "wheels" : undefined}
      persistentHeaderContent={
        <WheelHeader
          name={wheel.wheel_name}
          brand={wheel.brand_name || "Unknown Brand"}
          price="$249.99"
          description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel with exceptional performance and style.`}
          goodPicUrl={wheel.good_pic_url}
          badPicUrl={wheel.bad_pic_url}
          specs={wheelSpecs}
          itemId={wheel.id}
          convexId={wheel._id}
          fieldLayout={headerBlock?.settings?.fieldLayout}
        />
      }
      additionalTabs={
        isAdmin && wheel?._id
          ? [
              {
                id: "private-blurb",
                label: "Private blurb",
                triggerTone: "admin",
                content: (
                  <AdminPrivateBlurbTab
                    itemType="wheel"
                    convexId={wheel._id}
                    value={wheel.private_blurb ?? ""}
                  />
                ),
              },
              ...(showAdminAssets
                ? [
              {
                id: "assets",
                label: "Assets",
                triggerTone: "admin",
                content: (
                  <WheelAssetsPanel
                    wheelId={wheel._id}
                    wheelName={wheel.wheel_name}
                    goodPicUrl={wheel.good_pic_url}
                    badPicUrl={wheel.bad_pic_url}
                  />
                ),
              },
            ]
                : []),
            ]
          : []
      }
      renderBlock={(block) => {
        switch (block.kind) {
          case "variants": {
            const normalizedVariants = wheelVariants.length > 0
              ? wheelVariants.map((variant) => ({
                  id: String(variant._id),
                  slug: typeof variant.slug === "string" ? variant.slug : undefined,
                  color: variant.color?.trim() || variant.finish?.trim() || variant.variant_title?.trim() || "Standard",
                  size:
                    [variant.width?.trim(), variant.diameter?.trim()]
                      .filter(Boolean)
                      .join(" x ") || `${wheel.width || "N/A"} x ${wheel.diameter || "N/A"}`,
                  pcd: variant.bolt_pattern?.trim() || wheel.bolt_pattern || "N/A",
                  partNumber:
                    variant.part_numbers
                      ?.split(/[,;\n]/)
                      .map((part) => part.trim())
                      .find(Boolean) || "N/A",
                  offset: variant.offset?.trim() || wheel.wheel_offset || "N/A",
                }))
              : [{
                  id: null,
                  color: "Standard",
                  size: `${wheel.diameter || "N/A"} x ${wheel.width || "N/A"}`,
                  pcd: wheel.bolt_pattern || "N/A",
                  partNumber: wheel.wheel_name?.replace(/\s+/g, "") || "N/A",
                  offset: wheel.wheel_offset || "N/A",
                }];

            return (
              <ItemPagePanel title="Variants">
                <ItemPageGrid columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {normalizedVariants.map((variant: any, idx: number) => (
                    <Card
                      key={`${variant.id ?? variant.partNumber}-${idx}`}
                      className="flex flex-col transition-shadow hover:shadow-md"
                      onClick={(event) => {
                        if (!isAdmin || !variant.id) return;
                        const target = event.target as HTMLElement | null;
                        if (target?.closest("a,button")) return;
                        navigate(
                          getWheelVariantRoutePath({
                            id: variant.id,
                            slug: variant.slug,
                            name: [wheel.wheel_name, variant.color].filter(Boolean).join(" - "),
                          })
                        );
                      }}
                    >
                      <CardContent className="flex flex-col gap-2 p-4">
                        <h4 className="text-base font-semibold text-foreground">{variant.color}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-foreground"><span className="text-muted-foreground">Size:</span> {variant.size}</p>
                          <p className="text-foreground"><span className="text-muted-foreground">PCD:</span> {variant.pcd}</p>
                          <p className="text-foreground"><span className="text-muted-foreground">Offset:</span> {variant.offset}</p>
                          <p className="text-foreground">
                            <span className="text-muted-foreground">P/N:</span>{" "}
                            <span className="font-mono text-xs text-blue-500">{variant.partNumber}</span>
                          </p>
                        </div>
                        <div className="pt-1">
                          <Button asChild variant="outline" size="sm" className="h-8 rounded-full px-3 text-[11px] font-medium transition-colors hover:border-white/90 hover:bg-transparent hover:text-foreground">
                            <a
                              href={buildEbaySearchUrl(
                                [wheel.wheel_name, variant.partNumber]
                                  .filter(Boolean)
                                  .join(" ")
                              )}
                              target="_blank"
                              rel="noreferrer"
                              title="Search this wheel variant on eBay"
                            >
                              eBay
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ItemPageGrid>
              </ItemPagePanel>
            );
          }
          case "fitment_table":
            return (
              <WheelVariantsTable
                wheelName={wheel.wheel_name}
                diameter={wheel.diameter}
                width={wheel.width}
                offset={wheel.wheel_offset}
                boltPattern={wheel.bolt_pattern}
                centerBore={wheel.center_bore}
                weight={wheel.weight}
                tireSize={wheel.tire_size || wheel.tire_size_refs?.[0] || null}
                partNumbers={wheel.part_numbers}
                vehicles={wheel.vehicles}
              />
            );
          case "vehicles_grid":
            return compatibleVehicles.length > 0 ? (
              <FitmentSection
                wheelName={wheel.wheel_name}
                compatibleVehicles={compatibleVehicles}
              />
            ) : (
              <ItemPageEmptyState
                title="No compatible vehicles linked yet"
                description="No vehicle fitments are linked to this wheel on the active backend."
              />
            );
          case "gallery":
            return (
              <GallerySection
                vehicleName={wheel.wheel_name}
                images={galleryImages}
              />
            );
          case "market":
            return marketSurfaceResource.isBackendUnavailable ? (
              <ConvexBackendUnavailableCard
                title="Market unavailable on this backend"
                description="The wheel market surface query is not deployed on the active backend yet."
                error={marketSurfaceResource.error}
              />
            ) : marketSurfaceResource.isError ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-destructive">Could not load market data</p>
                  <p className="text-sm text-muted-foreground">{getConvexErrorMessage(marketSurfaceResource.error)}</p>
                </CardContent>
              </Card>
            ) : (
              <MarketSurfacePanel
                title="Listings"
                items={marketSurfaceResource.data?.items}
                emptyTitle="No linked listings yet"
                emptyDescription={`Nothing is tagged to ${wheel.wheel_name} right now.`}
              />
            );
          case "comments":
            return (
              <ItemCommentsPanel
                itemType="wheel"
                itemId={wheel._id}
                itemName={wheel.wheel_name}
              />
            );
          case "rich_text":
            return <ItemPageRichText title={block.settings?.title} body={block.settings?.body} />;
          default:
            return null;
        }
      }}
    />
  );
};

export default WheelItemPage;
