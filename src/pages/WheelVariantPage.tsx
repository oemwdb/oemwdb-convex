import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { CircleSlash2, Loader2 } from "lucide-react";

import { api } from "../../convex/_generated/api";
import type { ItemPageLayoutTemplate } from "@/types/itemPageLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import WheelVariantHeader from "@/components/wheel/WheelVariantHeader";
import { ItemPageEmptyState, ItemPageGrid, ItemPagePanel, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";
import { AdminPrivateBlurbTab } from "@/components/item-page/AdminPrivateBlurbTab";
import { MarketSurfacePanel } from "@/components/market/MarketSurfacePanel";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import { SharedItemAssetsPanel } from "@/components/item-page/SharedItemAssetsPanel";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { toOemWheelCard } from "@/lib/wheelCards";
import { getVehicleVariantRoutePath } from "@/lib/variantRoutes";
import { useVehicleGridColumns, useWheelsGridColumns } from "@/hooks/useWheelsGridColumns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildPreferredVariantEngineLabel } from "@/lib/vehicleVariantEngines";

function buildWheelVariantTitle(parentTitle?: string | null, variantTitle?: string | null, finish?: string | null) {
  const parent = parentTitle?.trim() ?? "";
  const variant = variantTitle?.trim() || finish?.trim() || "";
  if (!parent) return variant || "Wheel Variant";
  if (!variant) return parent;
  if (variant.toLowerCase().includes(parent.toLowerCase())) return variant;
  return `${parent} - ${variant}`;
}

function buildYearLabel(yearFrom?: number | null, yearTo?: number | null) {
  if (!yearFrom && !yearTo) return "";
  if (!yearFrom) return `${yearTo}`;
  return `${yearFrom}-${yearTo ?? "Present"}`;
}

const WheelVariantPage = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const { updateCurrentLabel } = useNavigation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("brief");
  const [flippedVehicleCards, setFlippedVehicleCards] = useState<Record<string, boolean>>({});
  const [flippedParentWheelCards, setFlippedParentWheelCards] = useState<Record<string, boolean>>({});
  const vehicleColumns = useVehicleGridColumns();
  const wheelColumns = useWheelsGridColumns();

  const variant = useQuery(
    api.queries.wheelVariantGetByIdFull,
    variantId ? { id: variantId } : "skip"
  );

  const marketSurfaceResource = useConvexResourceQuery<any>({
    queryKey: ["wheel-variant-market-surface", variant?._id ?? "skip"],
    queryRef: api.market.surfaceByWheelVariant,
    args: variant?._id ? { wheelVariantId: variant._id } : "skip",
    enabled: Boolean(variant?._id),
  });

  const template = useMemo<ItemPageLayoutTemplate>(() => ({
    pageType: "wheel_item",
    version: 2,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "brief",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    headerBlock: { id: "wheel-variant-header", kind: "hero", span: 12, enabled: true },
    tabs: [
      { id: "brief", label: "Brief", enabled: true, blocks: [{ id: "wheel-variant-brief", kind: "brief", span: 12, enabled: true }] },
      { id: "vehicles", label: "Vehicles", enabled: true, blocks: [{ id: "wheel-variant-vehicles", kind: "variants", span: 12, enabled: true }] },
      { id: "wheel", label: "Wheel", enabled: true, blocks: [{ id: "wheel-variant-parent-wheel", kind: "wheels_grid", span: 12, enabled: true }] },
      { id: "market", label: "Market", enabled: true, blocks: [{ id: "wheel-variant-market", kind: "market", span: 12, enabled: true }] },
      { id: "comments", label: "Comments", enabled: true, blocks: [{ id: "wheel-variant-comments", kind: "comments", span: 12, enabled: true }] },
    ],
  }), []);

  useEffect(() => {
    const enabledTabIds = template.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (isAdmin && variant?._id) enabledTabIds.push("private-blurb", "assets");
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(template.defaultActiveTab);
    }
  }, [activeTab, isAdmin, template, variant?._id]);

  useEffect(() => {
    if (!variant) return;
    updateCurrentLabel(
      buildWheelVariantTitle(
        variant.parent_wheel?.wheel_title ?? null,
        variant.variant_title,
        variant.finish
      )
    );
  }, [updateCurrentLabel, variant]);

  if (variantId && variant === undefined) {
    return (
      <DashboardLayout title="Loading..." disableContentPadding={true}>
        <div className="p-2">
          <Card className="p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading wheel variant...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!variant) {
    return (
      <DashboardLayout title="Wheel Variant Not Found" disableContentPadding={true}>
        <div className="p-2">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-12 text-center">
              <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Wheel variant not found</h2>
              <p className="text-muted-foreground">We couldn&apos;t find that exact wheel variant yet.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const parentWheel = variant.parent_wheel;
  const pageTitle = buildWheelVariantTitle(
    parentWheel?.wheel_title ?? null,
    variant.variant_title,
    variant.finish
  );
  const yearLabel = buildYearLabel(variant.year_from, variant.year_to);
  const quickFacts = [
    ...(variant.design_styles ?? []).slice(0, 2),
    ...(variant.finish_types ?? []).slice(0, 2),
    ...(variant.materials ?? []).slice(0, 2),
    ...(variant.markets ?? []).slice(0, 2),
  ].filter((value, index, values) => values.indexOf(value) === index);

  const parentWheelCards = parentWheel
      ? [toOemWheelCard({
        ...parentWheel,
        wheel_name: parentWheel.wheel_title,
        brand_name: parentWheel.brand_title ?? null,
      })]
    : [];

  const linkedVehicleCards = (variant.linked_vehicle_variants ?? []).map((vehicleVariant: any) => ({
    id: String(vehicleVariant.parent_vehicle_id ?? vehicleVariant.vehicle_id ?? vehicleVariant._id ?? ""),
    routeId: String(vehicleVariant.parent_vehicle_slug ?? vehicleVariant.parent_vehicle_id ?? vehicleVariant.vehicle_id ?? ""),
    slug: typeof vehicleVariant.parent_vehicle_slug === "string" ? vehicleVariant.parent_vehicle_slug : undefined,
    name:
      vehicleVariant.parent_vehicle_title ||
      vehicleVariant.variant_title ||
      vehicleVariant.trim_level ||
      "Unknown Vehicle",
    brand: vehicleVariant.brand_title || "Unknown",
    wheels: 0,
    image: vehicleVariant.parent_vehicle_image || vehicleVariant.good_pic_url || vehicleVariant.bad_pic_url || undefined,
    bolt_pattern_ref: vehicleVariant.bolt_patterns,
    center_bore_ref: vehicleVariant.center_bores,
    wheel_diameter_ref: vehicleVariant.diameters,
    wheel_width_ref: vehicleVariant.widths,
  }));

  const vehicleVariantCards = (variant.linked_vehicle_variants ?? []).map((vehicleVariant: any) => {
    const label = buildPreferredVariantEngineLabel(vehicleVariant);
    return {
      id: String(vehicleVariant._id),
      slug: typeof vehicleVariant.slug === "string" ? vehicleVariant.slug : undefined,
      name: buildWheelVariantTitle(vehicleVariant.parent_vehicle_title, vehicleVariant.variant_title, vehicleVariant.trim_level),
      years: buildYearLabel(vehicleVariant.year_from, vehicleVariant.year_to),
      market: vehicleVariant.market || (vehicleVariant.markets ?? []).join(", "),
      engine: label,
    };
  });

  return (
    <ItemPageTabsShell
      titleTabLabel={pageTitle}
      template={template}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onBack={() => navigate(-1)}
      tabPlacement="content"
      useItemTitleForFirstTab={false}
      persistentHeaderContent={
        <WheelVariantHeader
          title={pageTitle}
          subtitle={[parentWheel?.brand_title, yearLabel].filter(Boolean).join(" • ")}
          description={variant.notes || ""}
          image={variant.good_pic_url || variant.bad_pic_url || parentWheel?.good_pic_url || parentWheel?.bad_pic_url || null}
          diameters={variant.diameters}
          widths={variant.widths}
          offsets={variant.offsets}
          boltPatterns={variant.bolt_patterns}
          centerBores={variant.center_bores}
          finishTypes={variant.finish_types}
          colors={variant.colors}
          partNumbers={variant.part_numbers}
          markets={variant.markets}
        />
      }
      additionalTabs={
        isAdmin && variant?._id
          ? [
              {
                id: "private-blurb",
                label: "Private blurb",
                triggerTone: "admin",
                content: (
                  <AdminPrivateBlurbTab
                    itemType="wheel_variant"
                    convexId={variant._id}
                    value={variant.private_blurb ?? ""}
                  />
                ),
              },
              {
                id: "assets",
                label: "Assets",
                triggerTone: "admin",
                content: (
                  <SharedItemAssetsPanel
                    itemType="wheel_variant"
                    itemId={variant._id}
                    itemTitle={pageTitle}
                    fields={[
                      {
                        field: "good_pic_url",
                        label: "Good Pic",
                        value: variant.good_pic_url ?? null,
                        uploadLabel: "Drop a processed/primary image",
                      },
                      {
                        field: "bad_pic_url",
                        label: "Bad Pics",
                        value: variant.bad_pic_url ?? null,
                        uploadLabel: "Drop reference/unprocessed images",
                      },
                    ]}
                  />
                ),
              },
            ]
          : []
      }
      renderBlock={(block) => {
        switch (block.kind) {
          case "brief":
            return (
              <div className="space-y-4">
                <ItemPageRichText
                  title="Variant Summary"
                  body={
                    variant.notes?.trim() ||
                    "This page represents an exact wheel variant record. Use it for the precise size, finish, part-number, and fitment context rather than the broader parent wheel family."
                  }
                />
                <ItemPagePanel title="Relationship Map">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {quickFacts.length > 0 ? quickFacts.map((fact) => (
                        <Badge key={fact} variant="outline" className="rounded-full px-3 py-1 text-xs">
                          {fact}
                        </Badge>
                      )) : (
                        <span className="text-sm text-muted-foreground">No quick tags linked yet.</span>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Parent wheel</p>
                        {parentWheel ? (
                          <Link
                            to={`/wheel/${encodeURIComponent(String(parentWheel.slug ?? parentWheel.id ?? parentWheel._id ?? ""))}`}
                            className="mt-3 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {parentWheel.wheel_title || "Unknown Wheel"}
                          </Link>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">No parent wheel linked yet.</p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-border/60 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Linked vehicle variants</p>
                        <p className="mt-3 text-sm text-foreground">
                          {(variant.linked_vehicle_variants ?? []).length} exact vehicle variant{(variant.linked_vehicle_variants ?? []).length === 1 ? "" : "s"} linked
                        </p>
                      </div>
                    </div>
                  </div>
                </ItemPagePanel>
              </div>
            );
          case "variants":
            return vehicleVariantCards.length > 0 ? (
              <ItemPageGrid columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3" insertAdEvery={3 * 3}>
                {vehicleVariantCards.map((vehicleVariant) => (
                  <Link key={vehicleVariant.id} to={getVehicleVariantRoutePath(vehicleVariant)}>
                    <Card className="h-full transition-shadow hover:shadow-md">
                      <CardContent className="space-y-3 p-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{vehicleVariant.name}</h3>
                          {vehicleVariant.years ? (
                            <p className="text-sm text-muted-foreground">{vehicleVariant.years}</p>
                          ) : null}
                        </div>
                        <div className="space-y-1 text-sm">
                          {vehicleVariant.engine ? (
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Engine:</span> {vehicleVariant.engine}
                            </p>
                          ) : null}
                          {vehicleVariant.market ? (
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Market:</span> {vehicleVariant.market}
                            </p>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </ItemPageGrid>
            ) : linkedVehicleCards.length > 0 ? (
              <VehiclesGrid
                vehicles={linkedVehicleCards}
                flippedCards={flippedVehicleCards}
                onFlip={(id) =>
                  setFlippedVehicleCards((current) => ({ ...current, [id]: !current[id] }))
                }
                insertAdEvery={vehicleColumns * 3}
              />
            ) : (
              <ItemPageEmptyState
                title="No linked vehicle variants yet"
                description="No exact vehicle variants are linked to this wheel variant on the current backend."
              />
            );
          case "wheels_grid":
            return parentWheelCards.length > 0 ? (
              <WheelsGrid
                wheels={parentWheelCards}
                flippedCards={flippedParentWheelCards}
                onFlip={(id) =>
                  setFlippedParentWheelCards((current) => ({ ...current, [id]: !current[id] }))
                }
                insertAdEvery={wheelColumns * 3}
              />
            ) : (
              <ItemPageEmptyState
                title="No parent wheel linked yet"
                description="This exact wheel variant is missing its parent family link on the current backend."
              />
            );
          case "market":
            return (
              <MarketSurfacePanel
                title="Variant Market"
                description="Exact listings and external search links attached to this wheel variant."
                items={marketSurfaceResource.data?.items}
                externalLinks={marketSurfaceResource.data?.externalLinks ?? []}
                emptyTitle="No variant listings yet"
                emptyDescription="No active featured listings are linked directly to this wheel variant."
                showAdminEdit={isAdmin}
              />
            );
          case "comments":
            return (
              <ItemCommentsPanel
                itemType="wheel_variant"
                itemId={variant._id}
                itemName={pageTitle}
                layout="bottom-anchored"
              />
            );
          default:
            return null;
        }
      }}
    />
  );
};

export default WheelVariantPage;
