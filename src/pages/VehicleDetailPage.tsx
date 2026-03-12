import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import vehicle components
import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleBriefSection from "@/components/vehicle/VehicleBriefSection";
import GallerySection from "@/components/vehicle/GallerySection";
import WheelCard from "@/components/wheel/WheelCard";
import VariantsSection from "@/components/vehicle/VariantsSection";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";

const VehicleDetailPage = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const vehicleData = useQuery(
    api.queries.vehiclesGetByIdFull,
    vehicleName ? { id: vehicleName } : "skip"
  );
  const isLoading = vehicleName && vehicleData === undefined;
  const error = null;

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
  const marketSearchTerm = [vehicleData.brand_name, vehicleDisplayName]
    .filter(Boolean)
    .join(" ")
    .trim();

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

  return (
    <DashboardLayout
      title={`${vehicleDisplayName} Details`}
      secondaryTitle="Comments"
      secondarySidebar={
        <ItemCommentsPanel
          itemType="vehicle"
          itemId={vehicleData._id}
          itemName={vehicleDisplayName || "Vehicle"}
        />
      }
      secondaryActionIcon={<MessageSquare className="h-4 w-4" />}
      disableContentPadding={true}
    >
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        <div className="w-full">
          <VehicleHeader
              name={vehicleDisplayName || "Unknown Vehicle"}
              generation={vehicleData.generation || "Unknown Generation"}
              years={vehicleData.production_years || ""}
              engines={splitTextValues(vehicleData.engine_details)}
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1">
            <TabsTrigger value="details" className="flex-1 min-w-fit">Details</TabsTrigger>
            <TabsTrigger value="variants" className="flex-1 min-w-fit">Variants</TabsTrigger>
            <TabsTrigger value="wheels" className="flex-1 min-w-fit">Wheels ({formattedWheels.length})</TabsTrigger>
            <TabsTrigger value="market" className="flex-1 min-w-fit">Market</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 min-w-fit">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
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
              engineDetails={vehicleData.engine_details || ""}
              productionStats={vehicleData.production_stats || ""}
            />
          </TabsContent>



          <TabsContent value="variants" className="space-y-4">
            <VariantsSection
              vehicleId={(vehicleData as any)._id}
              vehicleName={vehicleDisplayName}
            />
          </TabsContent>

          <TabsContent value="wheels" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Search this vehicle across major marketplaces.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://www.autoscout24.com/lst?query=${encodeURIComponent(marketSearchTerm)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    AutoScout24
                  </a>
                  <a
                    href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(marketSearchTerm)}&_sacat=6001`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    eBay Motors
                  </a>
                  <a
                    href={`https://www.autotrader.com/cars-for-sale/all-cars?searchRadius=0&keywordPhrases=${encodeURIComponent(marketSearchTerm)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Autotrader
                  </a>
                  <a
                    href={`https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(marketSearchTerm)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Facebook Marketplace
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="gallery" className="space-y-4">
            <GallerySection
              vehicleName={vehicleDisplayName || "Unknown Vehicle"}
              images={[
                {
                  id: 1,
                  url: vehicleData.hero_image_url || `https://source.unsplash.com/800x600/?${vehicleDisplayName?.replace(/[()-]/g, '')},car,exterior`,
                  alt: `${vehicleDisplayName} exterior`,
                  user: "PhotoPro",
                  date: "3 days ago"
                }
              ]}
            />
          </TabsContent>
        </Tabs>
      </div >
    </DashboardLayout >
  );
};

export default VehicleDetailPage;
