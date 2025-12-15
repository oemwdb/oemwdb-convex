
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BrandForm from "@/components/contribute/BrandForm";
import VehicleForm from "@/components/contribute/VehicleForm";
import WheelForm from "@/components/contribute/WheelForm";

import { useContributeForm } from "@/hooks/useContributeForm";

const ContributePage = () => {
  const {
    isSubmitting,
    brandData,
    setBrandData,
    vehicleData,
    setVehicleData,
    wheelData,
    setWheelData,
    handleSubmitBrand,
    handleSubmitVehicle,
    handleSubmitWheel,
  } = useContributeForm();

  return (
    <DashboardLayout title="Contribute">
      <div className="max-w-7xl mx-auto p-3">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Contribute to OEMWDB</h1>
          <p className="text-muted-foreground mt-2">
            Help expand the database by adding brands, vehicles, or wheels
          </p>
        </div>
        
        <Tabs defaultValue="brand" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="brand">Add Brand</TabsTrigger>
            <TabsTrigger value="vehicle">Add Vehicle</TabsTrigger>
            <TabsTrigger value="wheel">Add Wheel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="brand">
            <BrandForm
              brandData={brandData}
              setBrandData={setBrandData}
              onSubmit={handleSubmitBrand}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="vehicle">
            <VehicleForm
              vehicleData={vehicleData}
              setVehicleData={setVehicleData}
              onSubmit={handleSubmitVehicle}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="wheel">
            <WheelForm
              wheelData={wheelData}
              setWheelData={setWheelData}
              onSubmit={handleSubmitWheel}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContributePage;
