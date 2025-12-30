import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelCard from "@/components/vehicle/WheelCard";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { Loader2, ImageOff } from "lucide-react";

import CommentsSection from "@/components/vehicle/CommentsSection";

const BrandDetailPage = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [activeTab, setActiveTab] = useState("vehicles");

  // Format brand name for display (convert from URL format)
  const formattedBrandName = brandName
    ? brandName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-')
    : "Unknown Brand";

  // State for vehicles and wheels
  const [brandVehicles, setBrandVehicles] = useState<any[]>([]);
  const [brandWheels, setBrandWheels] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any>(null);
  const [wheelsLoading, setWheelsLoading] = useState<boolean>(true);

  // Fetch vehicles using the shared hook (cached)
  const { data: allVehicles, isLoading: vehiclesLoading } = useSupabaseVehicles();

  // Filter vehicles for this brand
  useEffect(() => {
    if (allVehicles) {
      const filteredVehicles = allVehicles.filter(v => {
        const brand = v.brand_name || "";
        return brand.toLowerCase() === formattedBrandName.toLowerCase();
      });

      const vehiclesWithWheelCounts = filteredVehicles.map((vehicle) => {
        return {
          name: vehicle.model_name || vehicle.chassis_code || "Unknown Vehicle",
          year: vehicle.production_years ?? "",
          brand: vehicle.brand_name ?? "",
          wheels: 0, // Wheel count would need another query or function
          image: vehicle.vehicle_image || undefined
        };
      });
      setBrandVehicles(vehiclesWithWheelCounts);
    } else {
      setBrandVehicles([]);
    }
  }, [allVehicles, formattedBrandName]);

  // Fetch wheels from Supabase
  useEffect(() => {
    const fetchBrandData = async () => {
      // Fetch wheels using optimized RPC function for specific brand
      setWheelsLoading(true);
      const { data: wheelsData, error: wheelsError } = await supabase
        .rpc('get_wheels_by_brand', { brand_name_param: formattedBrandName });

      if (!wheelsError && wheelsData) {
        const filteredWheels = wheelsData.map((wheel: any) => ({
          id: wheel.id.toString(),
          name: wheel.wheel_name,
          brand: wheel.brand_name || formattedBrandName,
          specs: [
            wheel.diameter ? `${wheel.diameter}` : "",
            wheel.width ? `${wheel.width}` : "",
            wheel.bolt_pattern || "",
            wheel.color || ""
          ].filter(Boolean),
          imageUrl: wheel.good_pic_url || "/placeholder.svg"
        }));
        setBrandWheels(filteredWheels);
      } else {
        setBrandWheels([]);
      }

      // Fetch brand data for bad pic
      const { data: brandInfo } = await supabase
        .from('oem_brands' as any)
        .select('*')
        .eq('id', brandName?.toLowerCase())
        .maybeSingle();

      if (brandInfo) {
        setBrandData(brandInfo);
      }

      setWheelsLoading(false);
    };

    fetchBrandData();
  }, [formattedBrandName]);

  // Debug: Log when active tab changes
  useEffect(() => {
    console.log('[BrandDetailPage] Active tab changed to:', activeTab);
    console.log('[BrandDetailPage] Vehicles count:', brandVehicles.length);
    console.log('[BrandDetailPage] Wheels count:', brandWheels.length);
  }, [activeTab, brandVehicles.length, brandWheels.length]);

  // Auto-flip all cards back to front when switching tabs
  useEffect(() => {
    setFlippedCards({});
  }, [activeTab]);

  // Track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Toggle card flip
  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sample comments
  const comments = [
    { id: 1, user: "CarFan123", comment: `Love the new ${formattedBrandName} lineup!`, date: "2 days ago" },
    { id: 2, user: "MechanicMike", comment: "Great reliability on these models.", date: "1 week ago" }
  ];

  return (
    <DashboardLayout
      title={`${formattedBrandName}`}
      secondaryTitle="Comments"
      secondarySidebar={
        <div className="p-2">
          <CommentsSection
            vehicleName={formattedBrandName}
            comments={comments}
          />
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
              <div>
                <h1 className="text-2xl font-bold">{formattedBrandName}</h1>
                <p className="text-slate-500">
                  {brandVehicles.length} vehicles • {brandWheels.length} wheels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1 mb-4">
            <TabsTrigger value="vehicles" className="flex-1 min-w-fit">Vehicles ({brandVehicles.length})</TabsTrigger>
            <TabsTrigger value="wheels" className="flex-1 min-w-fit">Wheels ({brandWheels.length})</TabsTrigger>
            <TabsTrigger value="badpic" className="flex-1 min-w-fit">Bad Pic</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            {vehiclesLoading ? (
              <p className="text-slate-500">Loading vehicles...</p>
            ) : brandVehicles.length === 0 ? (
              <p className="text-slate-500">No vehicles found for this brand.</p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {brandVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.name}
                    vehicle={vehicle}
                    isFlipped={flippedCards[vehicle.name] || false}
                    onFlip={toggleCardFlip}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Wheels Tab */}
          <TabsContent value="wheels">
            {wheelsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : brandWheels.length === 0 ? (
              <p className="text-slate-500">No wheels found for this brand.</p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {brandWheels.map((wheel) => (
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

          {/* Bad Pic Tab */}
          <TabsContent value="badpic">
            <Card>
              <CardContent className="pt-4">
                {brandData?.brand_image_url ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={brandData.brand_image_url}
                        alt={`${formattedBrandName} reference`}
                        className="w-full max-h-[600px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
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