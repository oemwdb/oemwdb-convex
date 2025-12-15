import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicleWithWheels } from "@/hooks/useVehicleWithWheels";
import { Loader2 } from "lucide-react";

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
      <div className="p-3 space-y-6">
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brief">Brief</TabsTrigger>
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
      </div>
    </DashboardLayout>
  );
};

export default VehicleDetailPage;
