import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { CircleSlash2, Loader2, Palette } from "lucide-react";
import WheelCard from "@/components/vehicle/WheelCard";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelVariantsTable from "@/components/wheel/WheelVariantsTable";
import { buildTireRackUrl } from "@/lib/tireRack";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { ItemPageEmptyState, ItemPageGrid, ItemPagePanel, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";

const splitSummaryValues = (value?: string | null) =>
  String(value ?? "")
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);

const valueOrDash = (value?: string | null) => {
  const text = String(value ?? "").trim();
  return text || "—";
};

const normalizeOffset = (value?: string | null) => {
  const text = String(value ?? "").replace(/^ET\s*/i, "").trim();
  return text || "—";
};

const ColorItemPage = () => {
  const { colorId } = useParams<{ colorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("color");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const detailResource = useConvexResourceQuery<any>({
    queryKey: ["colors", "detail", colorId ?? "missing"],
    queryRef: api.colors.detailGet,
    args: colorId ? { id: colorId } : "skip",
    staleTime: 30_000,
  });
  const { template } = useResolvedItemPageLayoutTemplate("color_item");
  const resolvedDetail = detailResource.data;

  const wheels = resolvedDetail?.wheels ?? [];
  const vehicles = resolvedDetail?.vehicles ?? [];
  const wheelVariants = resolvedDetail?.wheelVariants ?? [];
  const vehicleVariants = resolvedDetail?.vehicleVariants ?? [];

  const toggleWheelFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  React.useEffect(() => {
    const enabledTabIds = template.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(template.defaultActiveTab);
    }
  }, [activeTab, template]);

  if (detailResource.isInitialLoading) {
    return (
      <DashboardLayout title="Loading Color..." disableContentPadding={true}>
        <div className="flex h-full items-center justify-center p-2">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (detailResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Color Unavailable" disableContentPadding={true}>
        <div className="p-2">
          <ConvexBackendUnavailableCard
            title="Color detail is not deployed on cloud dev yet"
            description="The canonical `colors.detailGet` query is missing from the cloud dev Convex deployment."
            error={detailResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (detailResource.error) {
    return (
      <DashboardLayout title="Color Error" disableContentPadding={true}>
        <div className="p-2">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-12 text-center">
              <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Could not load color</h2>
              <p className="text-muted-foreground">{getConvexErrorMessage(detailResource.error)}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!resolvedDetail?.color) {
    return (
      <DashboardLayout title="Color Not Found" disableContentPadding={true}>
        <div className="p-2">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-12 text-center">
              <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Color not found</h2>
              <p className="text-muted-foreground">We couldn&apos;t find that color yet.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const color = resolvedDetail.color;
  const totalLinked =
    (color.wheelCount ?? 0) +
    (color.wheelVariantCount ?? 0) +
    (color.vehicleCount ?? 0) +
    (color.vehicleVariantCount ?? 0);

  const wheelVariantRows = wheelVariants.map((variant: any) => {
    const partNumberValues = splitSummaryValues(variant.part_numbers);
    const primaryPartNumber = partNumberValues[0] ?? variant.title ?? "N/A";

    return {
      id: variant.id,
      modelLabel: variant.wheel_title || variant.title || "Unknown",
      modelHref: variant.wheel_id ? `/wheel/${encodeURIComponent(variant.wheel_id)}` : null,
      cardTitle: variant.finish || variant.title || "Standard",
      size: variant.size || [variant.diameter, variant.width].filter(Boolean).join(" x ") || "N/A",
      pcd: valueOrDash(variant.bolt_pattern),
      offset: normalizeOffset(variant.offset),
      centerBore: valueOrDash(variant.center_bore),
      weight: valueOrDash(variant.weight),
      tireSize: valueOrDash(variant.tire_size),
      tireRackUrl: buildTireRackUrl(variant.tire_size),
      partNumber: primaryPartNumber,
      partNumberDisplay: primaryPartNumber.substring(0, 30),
      searchTitle: `${variant.title || variant.wheel_title || "wheel variant"} ${variant.finish || color.color_title || ""}`.trim(),
      spec: variant.size || [variant.diameter, variant.width].filter(Boolean).join(" x ") || "—",
    };
  });

  const joinVariantField = (field: string) =>
    wheelVariants
      .map((variant: any) => String(variant?.[field] ?? "").trim())
      .filter(Boolean)
      .join(", ");

  const aggregatedVariantFields = {
    diameter: joinVariantField("diameter"),
    width: joinVariantField("width"),
    offset: joinVariantField("offset"),
    boltPattern: joinVariantField("bolt_pattern"),
    centerBore: joinVariantField("center_bore"),
    weight: joinVariantField("weight"),
    tireSize: joinVariantField("tire_size"),
    partNumbers: joinVariantField("part_numbers"),
    modelItems: wheelVariantRows
      .map((variant) => ({
        href: variant.modelHref,
        label: variant.modelLabel,
      }))
      .filter((item, index, array) =>
        item.label && array.findIndex((candidate) => candidate.label === item.label && candidate.href === item.href) === index
      ),
  };

  return (
    <ItemPageTabsShell
      titleTabLabel={color.color_title}
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
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div
                      className="h-40 w-full rounded-2xl border border-border/60 md:w-56"
                      style={{
                        background: `radial-gradient(circle at 50% 25%, rgba(255,255,255,0.22), transparent 42%), linear-gradient(135deg, ${color.swatch_hex} 0%, color-mix(in srgb, ${color.swatch_hex} 56%, #121212 44%) 100%)`,
                      }}
                    />
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Palette className="h-5 w-5 text-muted-foreground" />
                          <h1 className="text-2xl font-bold text-foreground">{color.color_title}</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {color.family_title ? <Badge variant="outline">{color.family_title}</Badge> : null}
                          {color.brand_title ? <Badge variant="outline">{color.brand_title}</Badge> : null}
                          {color.finish ? <Badge variant="outline">{color.finish}</Badge> : null}
                          {color.swatch_hex ? <Badge variant="outline" className="font-mono uppercase">{color.swatch_hex}</Badge> : null}
                          {color.manufacturer_code ? <Badge variant="outline">{color.manufacturer_code}</Badge> : null}
                        </div>
                      </div>
                      {color.notes ? <p className="max-w-4xl text-sm text-muted-foreground">{color.notes}</p> : null}
                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div className="rounded-xl border border-border/60 bg-black/20 px-3 py-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Wheels</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{(color.wheelCount ?? 0) + (color.wheelVariantCount ?? 0)}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-black/20 px-3 py-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Vehicles</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{(color.vehicleCount ?? 0) + (color.vehicleVariantCount ?? 0)}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-black/20 px-3 py-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Variants</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{(color.wheelVariantCount ?? 0) + (color.vehicleVariantCount ?? 0)}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-black/20 px-3 py-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Links</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{totalLinked}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          case "wheels_grid":
            return wheels.length > 0 ? (
              <ItemPageGrid>
                {wheels.map((wheel: any) => (
                  <WheelCard
                    key={wheel.id}
                    wheel={{
                      ...wheel,
                      diameter_ref: wheel.diameter ? [wheel.diameter] : [],
                      width_ref: wheel.width ? [wheel.width] : [],
                      bolt_pattern_ref: wheel.bolt_pattern ? [wheel.bolt_pattern] : [],
                      center_bore_ref: wheel.center_bore ? [wheel.center_bore] : [],
                      color_ref: wheel.color ? [wheel.color] : [],
                      tire_size_ref: wheel.tire_size ? [wheel.tire_size] : [],
                      brand_ref: wheel.brand_name ? [wheel.brand_name] : [],
                    }}
                    isFlipped={flippedCards[wheel.id] || false}
                    onFlip={toggleWheelFlip}
                    linkToDetail={true}
                  />
                ))}
              </ItemPageGrid>
            ) : (
              <ItemPageEmptyState
                title="No wheels linked yet"
                description="No wheels are linked to this color on the current backend."
              />
            );
          case "vehicles_grid":
            return vehicles.length > 0 ? (
              <ItemPageGrid>
                {vehicles.map((vehicle: any) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isFlipped={flippedCards[vehicle.id] || false}
                    onFlip={toggleWheelFlip}
                  />
                ))}
              </ItemPageGrid>
            ) : (
              <ItemPageEmptyState
                title="No vehicles linked yet"
                description="No vehicles are linked to this color on the current backend."
              />
            );
          case "variants":
            if (block.settings?.variantScope === "vehicle") {
              return vehicleVariants.length > 0 ? (
                <ItemPageGrid columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {vehicleVariants.map((variant: any) => (
                    <Card key={variant.id}>
                      <CardContent className="space-y-3 p-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{variant.title}</h3>
                          {variant.years ? <p className="text-sm text-muted-foreground">{variant.years}</p> : null}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {variant.market ? <Badge variant="outline">{variant.market}</Badge> : null}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ItemPageGrid>
              ) : (
                <ItemPageEmptyState
                  title="No vehicle variants linked yet"
                  description="No vehicle variants are linked to this color on the current backend."
                />
              );
            }

            return wheelVariantRows.length > 0 ? (
              <div className="grid gap-6">
                <ItemPagePanel title="Wheel Variants">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wheelVariantRows.map((variant) => (
                      <Card key={variant.id} className="flex flex-col transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-col gap-2 p-4">
                          <h4 className="text-base font-semibold text-foreground">{variant.cardTitle}</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-foreground"><span className="text-muted-foreground">Size:</span> {variant.size}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">PCD:</span> {variant.pcd}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Offset:</span> {variant.offset}</p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">P/N:</span>{" "}
                              <span className="font-mono text-xs text-blue-500">{variant.partNumberDisplay}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ItemPagePanel>

                <WheelVariantsTable
                  wheelName={color.color_title}
                  diameter={aggregatedVariantFields.diameter}
                  width={aggregatedVariantFields.width}
                  offset={aggregatedVariantFields.offset}
                  boltPattern={aggregatedVariantFields.boltPattern}
                  centerBore={aggregatedVariantFields.centerBore}
                  weight={aggregatedVariantFields.weight}
                  tireSize={aggregatedVariantFields.tireSize}
                  partNumbers={aggregatedVariantFields.partNumbers}
                  vehicles={aggregatedVariantFields.modelItems}
                />
              </div>
            ) : (
              <ItemPageEmptyState
                title="No wheel variants linked yet"
                description="No wheel variants are linked to this color on the current backend."
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

export default ColorItemPage;
