import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { CircleSlash2, Loader2 } from "lucide-react";

import { api } from "../../convex/_generated/api";
import type { ItemPageLayoutTemplate } from "@/types/itemPageLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import VehicleVariantHeader from "@/components/vehicle/VehicleVariantHeader";
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
import { getWheelVariantRoutePath } from "@/lib/variantRoutes";
import { useVehicleGridColumns, useWheelsGridColumns } from "@/hooks/useWheelsGridColumns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function buildVariantYearLabel(yearFrom?: number | null, yearTo?: number | null) {
  if (!yearFrom && !yearTo) return "";
  if (!yearFrom) return `${yearTo}`;
  return `${yearFrom}-${yearTo ?? "Present"}`;
}

function buildVehicleVariantTitle(parentTitle?: string | null, variantTitle?: string | null, trimLevel?: string | null) {
  const parent = parentTitle?.trim() ?? "";
  const variant = variantTitle?.trim() || trimLevel?.trim() || "";
  if (!parent) return variant || "Vehicle Variant";
  if (!variant) return parent;
  if (variant.toLowerCase().includes(parent.toLowerCase())) return variant;
  return `${parent} - ${variant}`;
}

const VehicleVariantPage = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const { updateCurrentLabel } = useNavigation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("brief");
  const [flippedParentVehicleCards, setFlippedParentVehicleCards] = useState<Record<string, boolean>>({});
  const [flippedWheelCards, setFlippedWheelCards] = useState<Record<string, boolean>>({});
  const vehicleColumns = useVehicleGridColumns();
  const wheelColumns = useWheelsGridColumns();

  const variant = useQuery(
    api.queries.vehicleVariantGetByIdFull,
    variantId ? { id: variantId } : "skip"
  );

  const marketSurfaceResource = useConvexResourceQuery<any>({
    queryKey: ["vehicle-variant-market-surface", variant?._id ?? "skip"],
    queryRef: api.market.surfaceByVehicleVariant,
    args: variant?._id ? { vehicleVariantId: variant._id } : "skip",
    enabled: Boolean(variant?._id),
  });

  const template = useMemo<ItemPageLayoutTemplate>(() => ({
    pageType: "vehicle_item",
    version: 2,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "brief",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    headerBlock: { id: "vehicle-variant-header", kind: "hero", span: 12, enabled: true },
    tabs: [
      { id: "brief", label: "Brief", enabled: true, blocks: [{ id: "vehicle-variant-brief", kind: "brief", span: 12, enabled: true }] },
      { id: "wheels", label: "Wheels", enabled: true, blocks: [{ id: "vehicle-variant-wheels", kind: "variants", span: 12, enabled: true }] },
      { id: "vehicle", label: "Vehicle", enabled: true, blocks: [{ id: "vehicle-variant-parent-vehicle", kind: "vehicles_grid", span: 12, enabled: true }] },
      { id: "market", label: "Market", enabled: true, blocks: [{ id: "vehicle-variant-market", kind: "market", span: 12, enabled: true }] },
      { id: "comments", label: "Comments", enabled: true, blocks: [{ id: "vehicle-variant-comments", kind: "comments", span: 12, enabled: true }] },
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
      buildVehicleVariantTitle(
        variant.parent_vehicle?.vehicle_title ?? variant.parent_vehicle?.model_name ?? null,
        variant.variant_title,
        variant.trim_level
      )
    );
  }, [updateCurrentLabel, variant]);

  if (variantId && variant === undefined) {
    return (
      <DashboardLayout title="Loading..." disableContentPadding={true}>
        <div className="p-2">
          <Card className="p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading vehicle variant...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!variant) {
    return (
      <DashboardLayout title="Vehicle Variant Not Found" disableContentPadding={true}>
        <div className="p-2">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-12 text-center">
              <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Vehicle variant not found</h2>
              <p className="text-muted-foreground">We couldn&apos;t find that exact variant yet.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const parentVehicle = variant.parent_vehicle;
  const pageTitle = buildVehicleVariantTitle(
    parentVehicle?.vehicle_title ?? parentVehicle?.model_name ?? null,
    variant.variant_title,
    variant.trim_level
  );
  const yearLabel = buildVariantYearLabel(variant.year_from, variant.year_to);
  const engineLabels = [
    variant.engine_variant_title,
    variant.powertrain_designation,
    variant.engine_display_title,
    variant.engine_title,
    variant.engine_code,
  ].filter((value, index, values): value is string => Boolean(value && values.indexOf(value) === index));

  const parentVehicleCard = parentVehicle
    ? [{
        id: String(parentVehicle._id ?? parentVehicle.id ?? ""),
        routeId: String(parentVehicle.slug ?? parentVehicle.id ?? parentVehicle._id ?? ""),
        slug: typeof parentVehicle.slug === "string" ? parentVehicle.slug : undefined,
        name: parentVehicle.vehicle_title || parentVehicle.model_name || parentVehicle.generation || "Unknown Vehicle",
        brand: parentVehicle.brand_title || "Unknown",
        wheels: 0,
        image: undefined,
        good_pic_url: parentVehicle.good_pic_url || null,
        bad_pic_url: parentVehicle.bad_pic_url || null,
        bolt_pattern_ref: variant.bolt_patterns,
        center_bore_ref: variant.center_bores,
        wheel_diameter_ref: variant.diameters,
        wheel_width_ref: variant.widths,
      }]
    : [];

  const linkedWheelCards = (variant.linked_wheel_variants ?? []).map((wheelVariant: any) => ({
    id: String(wheelVariant._id),
    slug: typeof wheelVariant.slug === "string" ? wheelVariant.slug : undefined,
    name: buildVehicleVariantTitle(wheelVariant.parent_wheel_title, wheelVariant.variant_title, wheelVariant.finish),
    size: [wheelVariant.width, wheelVariant.diameter].filter(Boolean).join(" x ") || "N/A",
    pcd: wheelVariant.bolt_pattern || "N/A",
    offset: wheelVariant.offset || "N/A",
    partNumber: wheelVariant.part_numbers?.split(/[,;\n]/)[0]?.trim() || "N/A",
  }));

  const parentWheelCards = (variant.linked_wheel_variants ?? []).map((wheelVariant: any) => ({
    _id: wheelVariant.parent_wheel_id ?? wheelVariant.wheel_id ?? undefined,
    id: wheelVariant.parent_wheel_id ?? wheelVariant.wheel_id ?? undefined,
    slug: wheelVariant.parent_wheel_slug ?? undefined,
    wheel_title: wheelVariant.parent_wheel_title ?? wheelVariant.wheel_title ?? wheelVariant.variant_title ?? "Wheel",
    wheel_name: wheelVariant.parent_wheel_title ?? wheelVariant.wheel_title ?? wheelVariant.variant_title ?? "Wheel",
    good_pic_url: wheelVariant.good_pic_url ?? null,
    bad_pic_url: wheelVariant.bad_pic_url ?? null,
    brand_name: parentVehicle?.brand_title ?? null,
    diameter: wheelVariant.diameter ?? null,
    width: wheelVariant.width ?? null,
    bolt_pattern: wheelVariant.bolt_pattern ?? null,
    center_bore: wheelVariant.center_bore ?? null,
    color: wheelVariant.color ?? wheelVariant.finish ?? null,
    tire_size: null,
  }))
    .filter((wheelCard: any, index: number, array: any[]) =>
      array.findIndex((candidate) => String(candidate._id ?? candidate.id ?? "") === String(wheelCard._id ?? wheelCard.id ?? "")) === index
    )
    .map((wheelCard: any) => toOemWheelCard(wheelCard));

  const quickFacts = [
    ...engineLabels.slice(0, 2),
    ...(variant.body_styles ?? []).slice(0, 2),
    ...(variant.drive_types ?? []).slice(0, 2),
    ...(variant.markets ?? []).slice(0, 2),
  ].filter((value, index, values) => values.indexOf(value) === index);

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
        <VehicleVariantHeader
          title={pageTitle}
          subtitle={[parentVehicle?.generation, yearLabel].filter(Boolean).join(" • ")}
          description={variant.notes || ""}
          image={variant.good_pic_url || variant.bad_pic_url || parentVehicle?.good_pic_url || parentVehicle?.bad_pic_url || null}
          engines={engineLabels}
          markets={variant.markets}
          bodyStyles={variant.body_styles}
          driveTypes={variant.drive_types}
          boltPatterns={variant.bolt_patterns}
          centerBores={variant.center_bores}
          diameters={variant.diameters}
          widths={variant.widths}
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
                    itemType="vehicle_variant"
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
                    itemType="vehicle_variant"
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
                        label: "Bad Pic",
                        value: variant.bad_pic_url ?? null,
                        uploadLabel: "Drop a reference/unprocessed image",
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
                    "This page represents an exact vehicle variant record, not the broader parent family. Use it to inspect the precise trim / market identity and the directly linked wheel variants."
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
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Parent vehicle</p>
                        {parentVehicle ? (
                          <Link
                            to={`/vehicles/${encodeURIComponent(String(parentVehicle.slug ?? parentVehicle.id ?? parentVehicle._id ?? ""))}`}
                            className="mt-3 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {parentVehicle.vehicle_title || parentVehicle.model_name || parentVehicle.generation || "Unknown Vehicle"}
                          </Link>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">No parent vehicle linked yet.</p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-border/60 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Linked wheel variants</p>
                        <p className="mt-3 text-sm text-foreground">
                          {(variant.linked_wheel_variants ?? []).length} exact wheel variant{(variant.linked_wheel_variants ?? []).length === 1 ? "" : "s"} linked
                        </p>
                      </div>
                    </div>
                  </div>
                </ItemPagePanel>
              </div>
            );
          case "variants":
            return linkedWheelCards.length > 0 ? (
              <ItemPageGrid columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3" insertAdEvery={3 * 3}>
                {linkedWheelCards.map((wheelVariant) => (
                  <Link key={wheelVariant.id} to={getWheelVariantRoutePath(wheelVariant)}>
                    <Card className="h-full transition-shadow hover:shadow-md">
                      <CardContent className="space-y-3 p-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{wheelVariant.name}</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-foreground"><span className="text-muted-foreground">Size:</span> {wheelVariant.size}</p>
                          <p className="text-foreground"><span className="text-muted-foreground">PCD:</span> {wheelVariant.pcd}</p>
                          <p className="text-foreground"><span className="text-muted-foreground">Offset:</span> {wheelVariant.offset}</p>
                          <p className="text-foreground">
                            <span className="text-muted-foreground">P/N:</span>{" "}
                            <span className="font-mono text-xs text-blue-500">{wheelVariant.partNumber}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </ItemPageGrid>
            ) : parentWheelCards.length > 0 ? (
              <WheelsGrid
                wheels={parentWheelCards}
                flippedCards={flippedWheelCards}
                onFlip={(id) =>
                  setFlippedWheelCards((current) => ({ ...current, [id]: !current[id] }))
                }
                insertAdEvery={wheelColumns * 3}
              />
            ) : (
              <ItemPageEmptyState
                title="No wheel variants linked yet"
                description="No exact wheel variants are linked to this vehicle variant on the current backend."
              />
            );
          case "vehicles_grid":
            return parentVehicleCard.length > 0 ? (
              <VehiclesGrid
                vehicles={parentVehicleCard}
                flippedCards={flippedParentVehicleCards}
                onFlip={(id) =>
                  setFlippedParentVehicleCards((current) => ({ ...current, [id]: !current[id] }))
                }
                insertAdEvery={vehicleColumns * 3}
              />
            ) : (
              <ItemPageEmptyState
                title="No parent vehicle linked yet"
                description="This exact variant is missing its parent vehicle link on the current backend."
              />
            );
          case "market":
            return (
              <MarketSurfacePanel
                title="Variant Market"
                description="Exact listings and external search links attached to this vehicle variant."
                items={marketSurfaceResource.data?.items}
                externalLinks={marketSurfaceResource.data?.externalLinks ?? []}
                emptyTitle="No variant listings yet"
                emptyDescription="No active featured listings are linked directly to this vehicle variant."
                showAdminEdit={isAdmin}
              />
            );
          case "comments":
            return (
              <ItemCommentsPanel
                itemType="vehicle_variant"
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

export default VehicleVariantPage;
