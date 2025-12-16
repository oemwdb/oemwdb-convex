import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelCard from "@/components/vehicle/WheelCard";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { Loader2 } from "lucide-react";

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

  return (
    <DashboardLayout title={`${formattedBrandName}`}>
      <div className="p-4 space-y-4">
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
          <TabsList className="mb-4">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="wheels">Wheels</TabsTrigger>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrandDetailPage;