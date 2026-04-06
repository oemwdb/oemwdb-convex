import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, ChevronLeft, CircleSlash2, Gauge, Loader2, ShoppingBag, Zap } from "lucide-react";
import VehicleCard from "@/components/vehicle/VehicleCard";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import type { OemEngineFamilyBrowseRow } from "@/types/oem";
import {
  getEngineFamilyCode,
  getEngineFamilyDescriptor,
  getEngineFamilyMeta,
  getEngineFamilyTitle,
  getEngineVariantMeta,
  getEngineVariantSubtitle,
  getEngineVariantTitle,
} from "@/lib/engineDisplay";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { ItemPageAdSlot, ItemPageEmptyState, ItemPageGrid, ItemPagePanel, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";

const normalizeText = (value?: string | null) => value?.trim() || null;

const EngineItemPage = () => {
  const { engineId } = useParams<{ engineId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("specs");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { template } = useResolvedItemPageLayoutTemplate("engine_item");

  const engine = useQuery(
    api.queries.engineFamiliesGetById,
    engineId ? { id: engineId } : "skip",
  ) as OemEngineFamilyBrowseRow | null | undefined;

  const vehicles = useMemo(
    () =>
      (engine?.linked_vehicles ?? []).map((vehicle) => ({
        id: vehicle._id,
        routeId: vehicle.id ?? vehicle.slug ?? vehicle._id,
        slug: vehicle.slug ?? undefined,
        name: vehicle.vehicle_title || vehicle.model_name || "Unknown Vehicle",
        year: vehicle.production_years ?? "",
        brand: vehicle.brand_title ?? "",
        wheels: 0,
        image: vehicle.vehicle_image ?? undefined,
      })),
    [engine?.linked_vehicles],
  );

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);

  useEffect(() => {
    const enabledTabIds = template.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(template.defaultActiveTab);
    }
  }, [activeTab, template]);

  const loading = engineId ? engine === undefined : false;

  if (loading) {
    return (
      <DashboardLayout title="Loading Engine...">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!engine) {
    return (
      <DashboardLayout title="Engine Not Found">
        <Card className="border-destructive/20 bg-destructive/5 p-12 text-center">
          <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Engine not found</h2>
          <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the engine family you're looking for.</p>
          <Button asChild variant="outline">
            <Link to="/engines">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Engines
            </Link>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const isElectric = normalizeText(engine.fuel_summary)?.toLowerCase() === "electric";

  const getConfigColor = () => {
    const layout = normalizeText(engine.configuration ?? engine.engine_layout)?.toUpperCase();
    if (isElectric) return "from-blue-500/20 to-cyan-500/20";
    if (layout === "V12") return "from-amber-500/20 to-orange-500/20";
    if (layout === "V8") return "from-red-500/20 to-pink-500/20";
    return "from-slate-500/20 to-slate-600/20";
  };

  const familyTitle = getEngineFamilyTitle(engine);
  const familyCode = getEngineFamilyCode(engine);
  const familyDescriptor = getEngineFamilyDescriptor(engine);
  const familyMeta = getEngineFamilyMeta(engine);
  const engineCommentId = engine.family_row_id ? (engine.family_row_id as Id<"oem_engines">) : null;
  const normalizedConfiguration = normalizeText(engine.configuration);
  const normalizedLayout = normalizeText(engine.engine_layout);

  const detailFacts = [
    normalizedConfiguration
      ? {
          label:
            normalizedLayout && normalizedLayout.toLowerCase() !== normalizedConfiguration.toLowerCase()
              ? "Configuration"
              : "Architecture",
          value: normalizedConfiguration,
        }
      : null,
    normalizedLayout && normalizedLayout.toLowerCase() !== normalizedConfiguration?.toLowerCase()
      ? { label: "Layout", value: normalizedLayout }
      : null,
    engine.cylinders != null && engine.cylinders > 0
      ? { label: "Cylinders", value: String(engine.cylinders) }
      : null,
    engine.fuel_summary
      ? { label: "Fuel lane", value: engine.fuel_summary }
      : null,
    engine.aspiration_summary
      ? { label: "Aspiration", value: engine.aspiration_summary }
      : null,
    engine.displacement_summary
      ? { label: "Covered displacements", value: engine.displacement_summary }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const renderVariantCards = () => {
    if (engine.variants.length === 0) {
      return (
        <div className="py-12 text-center">
          <Gauge className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No exact engine variants linked yet.</p>
        </div>
      );
    }

    return (
      <div className="grid w-full grid-cols-1 content-start justify-items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {engine.variants.map((variant) => {
          const variantTitle = getEngineVariantTitle(variant);
          const variantSubtitle = getEngineVariantSubtitle(variant);
          const variantMeta = getEngineVariantMeta(variant);

          return (
            <Card key={variant.id}>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <h3 className="font-semibold text-foreground">{variantTitle}</h3>
                  {variantSubtitle && <p className="mt-1 text-sm text-muted-foreground">{variantSubtitle}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.engine_variant_code && variant.engine_variant_code !== variantTitle && (
                    <Badge variant="secondary">{variant.engine_variant_code}</Badge>
                  )}
                  {variant.powertrain_designation && variant.powertrain_designation !== variantTitle && (
                    <Badge variant="secondary">{variant.powertrain_designation}</Badge>
                  )}
                  {variantMeta.map((value) => (
                    <Badge key={`${variant.id}-${value}`} variant="outline">
                      {value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={scrollContainerRef} className="h-full min-h-0">
      <ItemPageTabsShell
        titleTabLabel={familyTitle}
        template={template}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        onBack={() => navigate(-1)}
        renderBlock={(block) => {
          switch (block.kind) {
            case "hero":
              return (
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start">
                      <div
                        className={`flex h-48 w-48 flex-shrink-0 items-center justify-center rounded-[28px] border border-border/70 bg-gradient-to-br ${getConfigColor()}`}
                      >
                        {isElectric ? (
                          <Zap className="h-16 w-16 text-blue-400" />
                        ) : (
                          <Gauge className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h1 className="text-2xl font-bold">{familyTitle}</h1>
                          {familyCode && <Badge variant="outline">{familyCode}</Badge>}
                        </div>
                        {familyDescriptor && <p className="mb-3 text-muted-foreground">{familyDescriptor}</p>}
                        {familyMeta.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {familyMeta.map((value) => (
                              <Badge key={value} variant="secondary">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="mb-5 flex flex-wrap gap-2">
                          <Badge variant="secondary">{engine.variant_count} exact variants</Badge>
                          <Badge variant="secondary">{engine.linked_vehicle_count} linked vehicles</Badge>
                          {engine.family_engine_count > 1 ? (
                            <Badge variant="outline">{engine.family_engine_count} grouped</Badge>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {detailFacts.map((fact) => (
                            <div key={fact.label}>
                              <p className="text-sm text-muted-foreground">{fact.label}</p>
                              <p className="font-semibold text-foreground">{fact.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            case "variants":
              return (
                <ItemPagePanel
                  title="Exact variants"
                  badge={<Badge variant="secondary">{engine.variants.length}</Badge>}
                >
                  {renderVariantCards()}
                </ItemPagePanel>
              );
            case "vehicles_grid":
              return vehicles.length === 0 ? (
                <ItemPageEmptyState
                  title="No vehicles linked yet"
                  description="No vehicles are attached to this engine family on the current backend."
                  icon={<Car className="mx-auto h-12 w-12 text-muted-foreground/50" />}
                />
              ) : (
                <ItemPageGrid columnsClassName="grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {vehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id ?? `${vehicle.name}-${index}`}
                      vehicle={vehicle}
                      isFlipped={flippedCards[vehicle.id ?? vehicle.routeId ?? vehicle.name] || false}
                      onFlip={toggleCardFlip}
                    />
                  ))}
                </ItemPageGrid>
              );
            case "comments":
              return engineCommentId ? (
                <ItemCommentsPanel
                  itemType="engine"
                  itemId={engineCommentId}
                  itemName={familyTitle}
                  layout="bottom-anchored"
                  footerSlot={<ItemPageAdSlot />}
                />
              ) : (
                <ItemPageEmptyState
                  title="Comments unavailable"
                  description="Comments need a canonical engine row id before they can be attached to this engine family."
                />
              );
            case "market":
              return (
                <ItemPagePanel title="Market">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/40">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Market</h2>
                        <p className="text-sm text-muted-foreground">Engine marketplace surface is not wired yet.</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-dashed border-border bg-background/40 px-5 py-10 text-center text-sm text-muted-foreground">
                      No engine market feed is available on this backend yet.
                    </div>
                  </div>
                </ItemPagePanel>
              );
            case "rich_text":
              return <ItemPageRichText title={block.settings?.title} body={block.settings?.body} />;
            case "ad_slot":
              return <ItemPageAdSlot />;
            default:
              return null;
          }
        }}
      />
    </div>
  );
};

export default EngineItemPage;
