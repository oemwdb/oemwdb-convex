import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicleWithWheels } from "@/hooks/useVehicleWithWheels";
import { Loader2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import vehicle components
import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleBriefSection from "@/components/vehicle/VehicleBriefSection";
import CommentsSection from "@/components/vehicle/CommentsSection";
import GallerySection from "@/components/vehicle/GallerySection";
import WheelsSection from "@/components/vehicle/WheelsSection";

const VehicleDetailPage = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [activeTab, setActiveTab] = useState("brief");
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

  // Sample data for comments and gallery - you can later fetch these from Supabase too
  const comments = [
    {
      id: 1,
      user: "AutoEnthusiast",
      comment: "Great vehicle! Really impressed with the build quality and performance.",
      date: "2 days ago"
    },
    {
      id: 2,
      user: "CarExpert",
      comment: "The handling is exceptional, especially in sport mode. Highly recommended.",
      date: "1 week ago"
    }
  ];

  const galleryImages = [
    {
      id: 1,
      url: vehicleData.hero_image_url || `https://source.unsplash.com/800x600/?${vehicleDisplayName?.replace(/[()-]/g, '')},car,exterior`,
      alt: `${vehicleDisplayName} exterior`,
      user: "PhotoPro",
      date: "3 days ago"
    }
  ];

  return (
    <DashboardLayout title={`${vehicleDisplayName} Details`}>
      <div className="p-4 space-y-4">
        <VehicleHeader
          name={vehicleDisplayName || "Unknown Vehicle"}
          generation={vehicleData.lineage || "Current Generation"}
          years={vehicleData.production_years || ""}
          engines={vehicleData.engine_details ? [vehicleData.engine_details] : []}
          drive="AWD"
          segment={vehicleData.market_info || "Luxury"}
          description={vehicleData.special_notes || ""}
          msrp={vehicleData.production_stats || ""}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="brief">Brief</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="wheels">Wheels ({formattedWheels.length})</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-6">
            <VehicleBriefSection
              chassisCode={vehicleData.chassis_code}
              platform={vehicleData.platform || ""}
              generation={vehicleData.lineage || ""}
              bodyType="Sedan"
              productionYears={vehicleData.production_years || ""}
              productionLocations={[]}
              unitsProduced={vehicleData.production_stats || ""}
              status={vehicleData.status || ""}
              targetMarket={vehicleData.market_info ? [vehicleData.market_info] : []}
              priceRange=""
              competitors={[]}
              engines={vehicleData.engine_details ? [vehicleData.engine_details] : []}
              transmission={[]}
              driveType=""
              fuelEconomy=""
              performance=""
              dimensions=""
            />
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="wheels" className="space-y-6">
            <WheelsSection
              wheels={formattedWheels}
              flippedCards={flippedCards}
              toggleCardFlip={toggleCardFlip}
            />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GallerySection
              vehicleName={vehicleDisplayName || "Unknown Vehicle"}
              images={galleryImages}
            />
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <CommentsSection
              vehicleName={vehicleDisplayName || "Unknown Vehicle"}
              comments={comments}
            />
          </TabsContent>
        </Tabs>
      </div >
    </DashboardLayout >
  );
};

export default VehicleDetailPage;
