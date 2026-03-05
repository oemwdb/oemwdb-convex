import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelCard from "@/components/vehicle/WheelCard";
import { SaveButton } from "@/components/SaveButton";
import { Loader2, ImageOff } from "lucide-react";

import CommentsSection from "@/components/vehicle/CommentsSection";

const BrandDetailPage = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [activeTab, setActiveTab] = useState("vehicles");

  // Format brand name for display (convert from URL format)
  const formattedBrandName = brandName
    ? brandName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("-")
    : "Unknown Brand";

  const brandSlug = brandName ?? "";
  const brand = useQuery(api.queries.brandsGetById, brandSlug ? { id: brandSlug } : "skip");
  const brandTitle = brand?.brand_title ?? "";

  const { data: brandVehicles, isLoading: vehiclesLoading } = useBrandVehicles(brandTitle);
  const { data: brandWheels, isLoading: wheelsLoading } = useBrandWheels(brandTitle);

  const vehicleCardList = (brandVehicles ?? []).map((v) => ({
    id: v.id,
    name: v.model_name || v.chassis_code || "Unknown Vehicle",
    year: v.production_years ?? "",
    brand: v.brand_name ?? "",
    wheels: 0,
    image: v.hero_image_url ?? undefined,
  }));

  const wheelCardList = (brandWheels ?? []).map((w) => ({
    id: w.id,
    name: w.wheel_name,
    brand: w.brand_name ?? formattedBrandName,
    specs: [w.diameter, w.width, w.bolt_pattern, w.color].filter(Boolean) as string[],
    imageUrl: w.good_pic_url || "/placeholder.svg",
  }));

  // Auto-flip all cards back to front when switching tabs
  useEffect(() => {
    setFlippedCards({});
  }, [activeTab]);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const comments = [
    { id: 1, user: "CarFan123", comment: `Love the new ${formattedBrandName} lineup!`, date: "2 days ago" },
    { id: 2, user: "MechanicMike", comment: "Great reliability on these models.", date: "1 week ago" },
  ];

  return (
    <DashboardLayout
      title={formattedBrandName}
      secondaryTitle="Comments"
      secondarySidebar={
        <div className="p-2">
          <CommentsSection vehicleName={formattedBrandName} comments={comments} />
        </div>
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold">
                {formattedBrandName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{formattedBrandName}</h1>
                  {brand && (
                    <SaveButton
                      itemId={brand.id}
                      itemType="brand"
                      convexId={brand._id}
                    />
                  )}
                </div>
                <p className="text-slate-500">
                  {vehicleCardList.length} vehicles • {wheelCardList.length} wheels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1 mb-4">
            <TabsTrigger value="vehicles" className="flex-1 min-w-fit">
              Vehicles ({vehicleCardList.length})
            </TabsTrigger>
            <TabsTrigger value="wheels" className="flex-1 min-w-fit">
              Wheels ({wheelCardList.length})
            </TabsTrigger>
            <TabsTrigger value="badpic" className="flex-1 min-w-fit">
              Bad Pic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            {brand === undefined || vehiclesLoading ? (
              <p className="text-slate-500">Loading vehicles...</p>
            ) : vehicleCardList.length === 0 ? (
              <p className="text-slate-500">No vehicles found for this brand.</p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {vehicleCardList.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id ?? vehicle.name}
                    vehicle={vehicle}
                    isFlipped={flippedCards[vehicle.name] || false}
                    onFlip={toggleCardFlip}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wheels">
            {brand === undefined || wheelsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : wheelCardList.length === 0 ? (
              <p className="text-slate-500">No wheels found for this brand.</p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {wheelCardList.map((wheel) => (
                  <WheelCard
                    key={wheel.id}
                    wheel={wheel}
                    isFlipped={flippedCards[wheel.id] || false}
                    onFlip={toggleCardFlip}
                    linkToDetail={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="badpic">
            <Card>
              <CardContent className="pt-4">
                {brand?.brand_image_url ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={brand.brand_image_url}
                        alt={`${formattedBrandName} reference`}
                        className="w-full max-h-[600px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageOff className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>No reference image available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrandDetailPage;
