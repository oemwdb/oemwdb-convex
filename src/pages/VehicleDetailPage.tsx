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
            {(vehicleData as any).model_name?.toLowerCase().includes("rolls") || (vehicleData as any).vehicle_title?.toLowerCase().includes("rolls") ? (
              <VariantsSection vehicleId={String((vehicleData as any)._id)} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* E36 3 Series Variants */}
                    {[
                      {
                        chassis: 'E36',
                        model: '318i',
                        years: '1991-1998',
                        engine: '1.8L M42/M43 I4',
                        power: '113-140 hp',
                        body: 'Sedan',
                        searchTerm: 'BMW E36 318i'
                      },
                      {
                        chassis: 'E36',
                        model: '320i',
                        years: '1991-1998',
                        engine: '2.0L M50/M52 I6',
                        power: '150 hp',
                        body: 'Sedan',
                        searchTerm: 'BMW E36 320i'
                      },
                      {
                        chassis: 'E36',
                        model: '325i',
                        years: '1991-1995',
                        engine: '2.5L M50 I6',
                        power: '192 hp',
                        body: 'Sedan',
                        searchTerm: 'BMW E36 325i'
                      },
                      {
                        chassis: 'E36',
                        model: '328i',
                        years: '1995-1998',
                        engine: '2.8L M52 I6',
                        power: '193 hp',
                        body: 'Sedan',
                        searchTerm: 'BMW E36 328i'
                      },
                      {
                        chassis: 'E36',
                        model: 'M3',
                        years: '1992-1999',
                        engine: '3.0L S50/3.2L S52 I6',
                        power: '240-321 hp',
                        body: 'Coupe',
                        searchTerm: 'BMW E36 M3'
                      },
                      {
                        chassis: 'E36',
                        model: '323i',
                        years: '1995-1998',
                        engine: '2.5L M52 I6',
                        power: '170 hp',
                        body: 'Sedan',
                        searchTerm: 'BMW E36 323i'
                      }
                    ].map((variant, idx) => (
                      <Card key={idx} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col gap-2">
                          {/* Header */}
                          <h4 className="font-semibold text-foreground text-base">
                            BMW {variant.chassis} {variant.model}
                          </h4>

                          {/* Content */}
                          <div className="space-y-1 text-sm">
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Years:</span> {variant.years}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Engine:</span> {variant.engine}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Power:</span> {variant.power}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Body:</span> {variant.body}
                            </p>
                          </div>

                          {/* Find at section */}
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Find at</p>
                            <div className="flex gap-2 flex-wrap">
                              <a
                                href={`https://www.autoscout24.com/lst?query=${encodeURIComponent(variant.searchTerm)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                title="Search on AutoScout24"
                              >
                                AutoScout
                              </a>
                              <a
                                href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(variant.searchTerm)}&_sacat=6001`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                title="Search on eBay Motors"
                              >
                                eBay
                              </a>
                              <a
                                href={`https://www.autotrader.com/cars-for-sale/all-cars?searchRadius=0&makeCodeList=BMW&keywordPhrases=${encodeURIComponent(variant.model)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                title="Search on Autotrader"
                              >
                                Autotrader
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wheels" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {(vehicleData.wheels || []).map((wheel: any) => (
                <WheelCard
                  key={wheel.id}
                  wheel={{
                    id: wheel.id,
                    name: wheel.wheel_name,
                    imageUrl: wheel.good_pic_url || wheel.bad_pic_url,
                    diameter_ref: wheel.diameter ? [{ value: wheel.diameter }] : [],
                    width_ref: wheel.width ? [{ value: wheel.width }] : [],
                    bolt_pattern_ref: wheel.bolt_pattern ? [{ value: wheel.bolt_pattern }] : [],
                    center_bore_ref: wheel.center_bore ? [{ value: wheel.center_bore }] : [],
                  }}
                  isFlipped={flippedCards[wheel.id] || false}
                  onFlip={() => toggleCardFlip(wheel.id)}
                />
              ))}
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
