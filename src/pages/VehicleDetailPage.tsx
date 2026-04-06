import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketSurfacePanel } from "@/components/market/MarketSurfacePanel";

// Import vehicle components
import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleBriefSection from "@/components/vehicle/VehicleBriefSection";
import GallerySection from "@/components/vehicle/GallerySection";
import WheelCard from "@/components/wheel/WheelCard";
import EngineCard from "@/components/engine/EngineCard";
import VariantsSection from "@/components/vehicle/VariantsSection";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";
import { collectFamilyEngineLabels } from "@/lib/vehicleVariantEngines";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { buildFamilyEngineLabel } from "@/lib/vehicleVariantEngines";
import type { OemEngineFamilyBrowseRow } from "@/types/oem";
import { useResolvedItemPageLayoutTemplate } from "@/hooks/useItemPageLayoutTemplate";
import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import { ItemPageAdSlot, ItemPageEmptyState, ItemPageGrid, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";

const VehicleDetailPage = () => {
  const { vehicleName: vehicleRouteId } = useParams<{ vehicleName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const vehicleData = useQuery(
    api.queries.vehiclesGetByIdFull,
    vehicleRouteId ? { id: vehicleRouteId } : "skip"
  );
  const isLoading = vehicleRouteId && vehicleData === undefined;
  const error = null;
  const marketSurfaceResource = useConvexResourceQuery<any>({
    queryKey: ["vehicle-market-surface", vehicleData?._id ?? "skip"],
    queryRef: api.market.surfaceByVehicle,
    args: vehicleData?._id ? { vehicleId: vehicleData._id } : "skip",
  });
  const { template } = useResolvedItemPageLayoutTemplate("vehicle_item");

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const enabledTabIds = template.tabs.filter((tab) => tab.enabled).map((tab) => tab.id);
    if (!enabledTabIds.includes(activeTab)) {
      setActiveTab(template.defaultActiveTab);
    }
  }, [activeTab, template]);

  if (isLoading) {
    return (
      <DashboardLayout title="Vehicle Details">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !vehicleData) {
    return (
      <DashboardLayout title="Vehicle Details">
        <div className="text-center py-10 text-destructive">Vehicle not found.</div>
      </DashboardLayout>
    );
  }

  const vehicleDisplayName = vehicleData.vehicle_title || vehicleData.model_name || vehicleData.generation || "Unknown";

  const formattedWheels = (vehicleData.wheels || []).map((wheel: Record<string, unknown>) => {
    const diameter = (wheel.text_diameters ?? wheel.diameter ?? "") as string;
    const width = (wheel.text_widths ?? wheel.width ?? "") as string;
    const boltPattern = (wheel.text_bolt_patterns ?? wheel.bolt_pattern ?? "") as string;
    const centerBore = (wheel.text_center_bores ?? wheel.center_bore ?? "") as string;
    const specs: string[] = [];
    if (diameter) specs.push(`Diameter: ${diameter}`);
    if (width) specs.push(`Width: ${width}`);
    if (boltPattern) specs.push(`Bolt Pattern: ${boltPattern}`);
    if (centerBore) specs.push(`Center Bore: ${centerBore}`);
    if (wheel.wheel_offset) specs.push(`Offset: ${wheel.wheel_offset}`);
    if (wheel.color) specs.push(`Color: ${wheel.color}`);

    return {
      id: String(wheel._id ?? wheel.id ?? ""),
      name: (wheel.wheel_title ?? wheel.wheel_name ?? "Unknown") as string,
      diameter: diameter || "N/A",
      boltPattern: boltPattern || "N/A",
      specs,
      imageUrl: (wheel.good_pic_url ?? wheel.bad_pic_url ?? "/placeholder.svg") as string,
    };
  });

  // Helper to extract values from JSONB ref arrays
  const extractRefValues = (refArray: any[]): string[] => {
    if (!refArray || !Array.isArray(refArray)) return [];
    return refArray.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return item.value || item.raw || item.title || item.name || '';
      }
      return '';
    }).filter(Boolean);
  };

  const splitTextValues = (value: unknown): string[] => {
    if (typeof value !== "string") return [];
    return [...new Set(
      value
        .split(/[,\n;|]/)
        .map((part) => part.trim())
        .filter(Boolean)
    )];
  };

  const pickSpecValues = (refArray: any[] | undefined, fallback: unknown): string[] => {
    const refValues = extractRefValues(refArray ?? []);
    return refValues.length > 0 ? refValues : splitTextValues(fallback);
  };

  const familyEngineFallback = collectFamilyEngineLabels((vehicleData as any).variants);
  const linkedFamilyEngineRows = Array.isArray((vehicleData as any).engines)
    ? (vehicleData as any).engines
    : [];
  const linkedFamilyEngineLabels = linkedFamilyEngineRows
    .map((engine: any) =>
      String(
        engine.engine_display_title ??
          engine.engine_family_label ??
          engine.engine_title ??
          engine.engine_code ??
          ""
      ).trim()
    )
    .filter(Boolean);
  const familyEngines =
    linkedFamilyEngineLabels.length > 0
      ? linkedFamilyEngineLabels
      : splitTextValues(vehicleData.engine_details).length > 0
        ? splitTextValues(vehicleData.engine_details)
        : familyEngineFallback;
  const familyEngineDetails = familyEngines.join(", ");
  const engineVariants = Array.isArray((vehicleData as any).variants) ? (vehicleData as any).variants : [];
  const familyEngineGroups = (() => {
    if (linkedFamilyEngineRows.length > 0) {
      return linkedFamilyEngineRows
        .map((engine: any) => ({
          id: String(engine._id ?? engine.id ?? ""),
          label: String(
            engine.engine_display_title ??
              engine.engine_family_label ??
              engine.engine_title ??
              engine.engine_code ??
              "Engine"
          ).trim(),
          code: String(engine.engine_code ?? "").trim(),
        }))
        .filter((engine: { label: string }) => engine.label)
        .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
    }

    const values = new Set<string>();
    for (const label of familyEngines) {
      const trimmed = String(label ?? "").trim();
      if (trimmed) values.add(trimmed);
    }
    for (const variant of engineVariants) {
      const label = buildFamilyEngineLabel(variant);
      if (label) values.add(label);
    }

    return Array.from(values)
      .sort((a, b) => a.localeCompare(b))
      .map((label) => ({ id: "", label, code: "" }));
  })();

  const linkedEngineCards: OemEngineFamilyBrowseRow[] = linkedFamilyEngineRows.map((engine: any) => {
    const title = String(
      engine.engine_display_title ??
        engine.engine_family_label ??
        engine.engine_title ??
        engine.engine_code ??
        "Engine"
    ).trim();

    return {
      id: String(engine._id ?? engine.id ?? title),
      family_key: String(engine._id ?? engine.id ?? title),
      family_row_id: String(engine._id ?? engine.id ?? ""),
      family_title: title,
      family_code: String(engine.engine_code ?? "").trim() || null,
      engine_family_name: String(engine.engine_family_label ?? "").trim() || null,
      engine_display_title: String(engine.engine_display_title ?? "").trim() || null,
      brand_ref: null,
      configuration: String(engine.configuration ?? "").trim() || null,
      engine_layout: String(engine.engine_layout ?? "").trim() || null,
      cylinders: typeof engine.cylinders === "number" ? engine.cylinders : null,
      displacement_summary:
        typeof engine.displacement_l === "number" && engine.displacement_l > 0
          ? `${engine.displacement_l}L`
          : null,
      fuel_summary: String(engine.fuel_type ?? "").trim() || null,
      aspiration_summary: String(engine.aspiration ?? "").trim() || null,
      variant_count: 0,
      family_engine_count: 1,
      linked_vehicle_count: 1,
      linked_vehicle_titles: [vehicleDisplayName],
      linked_vehicles: [],
      variants: [],
    };
  });

  return (
    <ItemPageTabsShell
      titleTabLabel={vehicleDisplayName}
      template={template}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onBack={() => navigate(-1)}
      renderBlock={(block) => {
        switch (block.kind) {
          case "hero":
            return (
              <VehicleHeader
                name={vehicleDisplayName || "Unknown Vehicle"}
                generation={vehicleData.generation || "Unknown Generation"}
                years={vehicleData.production_years || ""}
                engines={familyEngines}
                drive={vehicleData.drive_type || "-"}
                segment={vehicleData.segment || "-"}
                description={vehicleData.special_notes || ""}
                msrp={vehicleData.production_stats || ""}
                image={(vehicleData as any).vehicle_image || (vehicleData as any).good_pic_url || undefined}
                itemId={String(vehicleData._id)}
                convexId={vehicleData._id}
                specs={{
                  bolt_pattern_ref: pickSpecValues((vehicleData as any).bolt_pattern_ref, (vehicleData as any).text_bolt_patterns),
                  center_bore_ref: pickSpecValues((vehicleData as any).center_bore_ref, (vehicleData as any).text_center_bores),
                  wheel_diameter_ref: pickSpecValues((vehicleData as any).diameter_ref, (vehicleData as any).text_diameters),
                  wheel_width_ref: pickSpecValues((vehicleData as any).width_ref, (vehicleData as any).text_widths),
                }}
              />
            );
          case "brief":
          case "facts":
            return (
              <VehicleBriefSection
                chassisCode={vehicleData.generation || "-"}
                platform={vehicleData.platform || vehicleData.platform_code || ""}
                generation={vehicleData.generation || "Unknown Generation"}
                bodyType={vehicleData.body_type || ""}
                productionYears={vehicleData.production_years || ""}
                dimensions={undefined}
                performance={undefined}
                fuelEconomy={undefined}
                competitors={[]}
                priceRange={vehicleData.price_range || ""}
                engineDetails={familyEngineDetails}
                productionStats={vehicleData.production_stats || ""}
              />
            );
          case "variants":
            return (
              <VariantsSection
                vehicleId={(vehicleData as any)._id}
                vehicleName={vehicleDisplayName}
              />
            );
          case "engines_grid":
            return linkedEngineCards.length > 0 ? (
              <ItemPageGrid columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {linkedEngineCards.map((engine) => {
                  const flipId = `engine-${engine.id}`;
                  return (
                    <EngineCard
                      key={engine.id}
                      engine={engine}
                      isFlipped={flippedCards[flipId] || false}
                      onFlip={() => toggleCardFlip(flipId)}
                    />
                  );
                })}
              </ItemPageGrid>
            ) : (
              <ItemPageEmptyState
                title="No engine cards linked yet"
                description={
                  familyEngineGroups.length > 0
                    ? "This backend has family engine labels, but no linked engine cards are available yet."
                    : "No engine data is linked to this vehicle yet."
                }
              />
            );
          case "wheels_grid":
            return (vehicleData.wheels || []).length > 0 ? (
              <ItemPageGrid columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {(vehicleData.wheels || []).map((wheel: any) => {
                  const wheelId = String(wheel.id ?? wheel._id ?? "");
                  const wheelName = (wheel.wheel_name ?? wheel.wheel_title ?? wheel.name ?? "Unknown Wheel") as string;

                  return (
                    <WheelCard
                      key={wheelId}
                      wheel={{
                        id: wheelId,
                        name: wheelName,
                        imageUrl: wheel.good_pic_url || wheel.bad_pic_url,
                        diameter_ref: wheel.diameter ? [{ value: wheel.diameter }] : [],
                        width_ref: wheel.width ? [{ value: wheel.width }] : [],
                        bolt_pattern_ref: wheel.bolt_pattern ? [{ value: wheel.bolt_pattern }] : [],
                        center_bore_ref: wheel.center_bore ? [{ value: wheel.center_bore }] : [],
                      }}
                      isFlipped={flippedCards[wheelId] || false}
                      onFlip={() => toggleCardFlip(wheelId)}
                    />
                  );
                })}
              </ItemPageGrid>
            ) : (
              <ItemPageEmptyState
                title="No linked wheels yet"
                description="No wheel fitments are linked to this vehicle on the active backend."
              />
            );
          case "market":
            return marketSurfaceResource.isBackendUnavailable ? (
              <ConvexBackendUnavailableCard
                title="Market surface is not deployed on this backend"
                description="This vehicle page can still load, but the optional market panel is unavailable on the current Convex target."
                error={marketSurfaceResource.error}
              />
            ) : marketSurfaceResource.isError ? (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Could not load market surface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{getConvexErrorMessage(marketSurfaceResource.error)}</p>
                </CardContent>
              </Card>
            ) : (
              <MarketSurfacePanel
                title="Listings"
                items={marketSurfaceResource.data?.items}
                externalLinks={marketSurfaceResource.data?.externalLinks ?? []}
                emptyTitle="No linked listings yet"
                emptyDescription="Nothing is linked to this vehicle right now."
              />
            );
          case "gallery":
            return (
              <GallerySection
                vehicleName={vehicleDisplayName || "Unknown Vehicle"}
                images={[
                  {
                    id: 1,
                    url: vehicleData.hero_image_url || `https://source.unsplash.com/800x600/?${vehicleDisplayName?.replace(/[()-]/g, "")},car,exterior`,
                    alt: `${vehicleDisplayName} exterior`,
                    user: "PhotoPro",
                    date: "3 days ago",
                  },
                ]}
              />
            );
          case "comments":
            return (
              <ItemCommentsPanel
                itemType="vehicle"
                itemId={vehicleData._id}
                itemName={vehicleDisplayName || "Vehicle"}
              />
            );
          case "rich_text":
            return (
              <ItemPageRichText
                title={block.settings?.title}
                body={block.settings?.body}
              />
            );
          case "ad_slot":
            return <ItemPageAdSlot />;
          default:
            return null;
        }
      }}
    />
  );
};

export default VehicleDetailPage;
