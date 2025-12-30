import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicleWithWheels } from "@/hooks/useVehicleWithWheels";
import { Loader2, Layers, ImageOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import vehicle components
import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleBriefSection from "@/components/vehicle/VehicleBriefSection";
import DiscussionSection from "@/components/vehicle/DiscussionSection";
import GallerySection from "@/components/vehicle/GallerySection";
import WheelCard from "@/components/wheel/WheelCard";
import MaintenanceSection from "@/components/vehicle/MaintenanceSection";
import UpgradesSection from "@/components/vehicle/UpgradesSection";
import VariantsSection from "@/components/vehicle/VariantsSection";

import CommentsSection from "@/components/vehicle/CommentsSection";

const VehicleDetailPage = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Fetch vehicle with related wheels from Supabase
  const { data: vehicleData, isLoading, error } = useVehicleWithWheels(vehicleName || "");

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

  // Use formatted_name if available, otherwise fallback to model_name or chassis_code
  const vehicleDisplayName = vehicleData.formatted_name || vehicleData.model_name || vehicleData.chassis_code;

  // Format wheels for display
  const formattedWheels = (vehicleData.wheels || []).map((wheel: any) => {
    const specs = [];
    if (wheel.diameter) specs.push(`Diameter: ${wheel.diameter}`);
    if (wheel.width) specs.push(`Width: ${wheel.width}`);
    if (wheel.bolt_pattern) specs.push(`Bolt Pattern: ${wheel.bolt_pattern}`);
    if (wheel.center_bore) specs.push(`Center Bore: ${wheel.center_bore}`);
    if (wheel.wheel_offset) specs.push(`Offset: ${wheel.wheel_offset}`);
    if (wheel.color) specs.push(`Color: ${wheel.color}`);
    if (wheel.is_oem_fitment) specs.push("OEM Fitment");

    return {
      id: wheel.id.toString(),
      name: wheel.wheel_name,
      diameter: wheel.diameter || "N/A",
      boltPattern: wheel.bolt_pattern || "N/A",
      specs: specs,
      imageUrl: wheel.good_pic_url || wheel.bad_pic_url || "/placeholder.svg"
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

  // Sample comments
  const comments = [
    { id: 1, user: "BimmerFan", comment: "The E36 is a classic!", date: "2 days ago" },
    { id: 2, user: "DriftKing", comment: "Best chassis for builds.", date: "5 days ago" }
  ];

  return (
    <DashboardLayout
      title={`${vehicleDisplayName} Details`}
      secondaryTitle="Comments"
      secondarySidebar={
        <div className="p-2">
          <CommentsSection
            vehicleName={vehicleDisplayName || "Vehicle"}
            comments={comments}
          />
        </div>
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        {/* Grid layout with vehicle header and ad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vehicle Header - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <VehicleHeader
              name={vehicleDisplayName || "Unknown Vehicle"}
              generation={vehicleData.lineage || "Current Generation"}
              years={vehicleData.production_years || ""}
              engines={vehicleData.engine_details ? [
                // Extract just the engine code from parentheses, e.g., "(N74B68)" -> "N74B68"
                vehicleData.engine_details.match(/\(([^)]+)\)/)?.[1] || vehicleData.engine_details
              ] : []}
              drive="AWD"
              segment={vehicleData.market_info || "Luxury"}
              description={vehicleData.special_notes || ""}
              msrp={vehicleData.production_stats || ""}
              image={vehicleData.hero_image_url || undefined}
              specs={{
                bolt_pattern_ref: extractRefValues(vehicleData.bolt_pattern_ref),
                center_bore_ref: extractRefValues(vehicleData.center_bore_ref),
                wheel_diameter_ref: extractRefValues(vehicleData.diameter_ref),
                wheel_width_ref: extractRefValues(vehicleData.width_ref)
              }}
            />
          </div>

          {/* Ad Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed">
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary/50" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Advertisement</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1">
            <TabsTrigger value="details" className="flex-1 min-w-fit">Details</TabsTrigger>
            <TabsTrigger value="variants" className="flex-1 min-w-fit">Variants</TabsTrigger>
            <TabsTrigger value="wheels" className="flex-1 min-w-fit">Wheels ({formattedWheels.length})</TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-1 min-w-fit">Maintenance</TabsTrigger>
            <TabsTrigger value="upgrades" className="flex-1 min-w-fit">Upgrades</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 min-w-fit">Gallery</TabsTrigger>
            <TabsTrigger value="badpic" className="flex-1 min-w-fit">Bad Pic</TabsTrigger>
            <TabsTrigger value="discussion" className="flex-1 min-w-fit">Discussion</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <VehicleBriefSection
              chassisCode={vehicleData.chassis_code}
              platform={vehicleData.platform || ""}
              generation={vehicleData.lineage || "Current Generation"}
              bodyType={vehicleData.body_type || ""}
              productionYears={vehicleData.production_years || ""}
              dimensions={vehicleData.dimensions}
              performance={vehicleData.performance}
              fuelEconomy={vehicleData.fuel_economy}
              competitors={vehicleData.competitors || []}
              priceRange={vehicleData.price_range || ""}
              engineDetails={vehicleData.engine_details || ""}
              productionStats={vehicleData.production_stats || ""}
            />
          </TabsContent>



          <TabsContent value="variants" className="space-y-4">
            {vehicleData.model_name?.toLowerCase().includes("rolls") || vehicleData.formatted_name?.toLowerCase().includes("rolls") ? (
              <VariantsSection vehicleId={vehicleData.id} />
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

          <TabsContent value="maintenance" className="space-y-4">
            <MaintenanceSection vehicleId={vehicleData.id} />
          </TabsContent>

          <TabsContent value="upgrades" className="space-y-4">
            <UpgradesSection vehicleId={vehicleData.id} />
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

          <TabsContent value="discussion" className="space-y-4">
            <DiscussionSection vehicleId={vehicleData.id} />
          </TabsContent>

          <TabsContent value="badpic" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                {vehicleData.hero_image_url ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={vehicleData.hero_image_url}
                        alt={`${vehicleDisplayName} reference`}
                        className="w-full max-h-[600px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Image path: <code className="text-xs bg-muted px-1 py-0.5 rounded">{vehicleData.hero_image_url}</code>
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No reference image available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >
    </DashboardLayout >
  );
};

export default VehicleDetailPage;
