import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFormProps {
  vehicleData: {
    brandName: string;
    modelName: string;
    oemChasisCode: string;
    generationTag: string;
    productionYearsRange: string;
    heroImage: string;
    oemWheels: string;
    status: string;
  };
  setVehicleData: (data: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const VehicleForm = ({ vehicleData, setVehicleData, onSubmit, isSubmitting }: VehicleFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
        <CardDescription>
          Add a new vehicle model to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input 
                id="brand-name"
                value={vehicleData.brandName}
                onChange={(e) => setVehicleData({...vehicleData, brandName: e.target.value})}
                placeholder="e.g., BMW"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name *</Label>
              <Input 
                id="model-name"
                value={vehicleData.modelName}
                onChange={(e) => setVehicleData({...vehicleData, modelName: e.target.value})}
                placeholder="e.g., 3 Series"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chassis-code">OEM Chassis Code *</Label>
              <Input 
                id="chassis-code"
                value={vehicleData.oemChasisCode}
                onChange={(e) => setVehicleData({...vehicleData, oemChasisCode: e.target.value})}
                placeholder="e.g., E90"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="generation-tag">Generation Tag</Label>
              <Input 
                id="generation-tag"
                value={vehicleData.generationTag}
                onChange={(e) => setVehicleData({...vehicleData, generationTag: e.target.value})}
                placeholder="e.g., 5th Generation"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="production-years">Production Years Range</Label>
              <Input 
                id="production-years"
                value={vehicleData.productionYearsRange}
                onChange={(e) => setVehicleData({...vehicleData, productionYearsRange: e.target.value})}
                placeholder="e.g., 2005-2012"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-image">Hero Image URL</Label>
              <Input 
                id="hero-image"
                value={vehicleData.heroImage}
                onChange={(e) => setVehicleData({...vehicleData, heroImage: e.target.value})}
                placeholder="https://example.com/vehicle-image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oem-wheels-vehicle">OEM Wheels</Label>
              <Textarea 
                id="oem-wheels-vehicle"
                value={vehicleData.oemWheels}
                onChange={(e) => setVehicleData({...vehicleData, oemWheels: e.target.value})}
                placeholder="List of compatible OEM wheels"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={vehicleData.status} onValueChange={(value) => setVehicleData({...vehicleData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || !vehicleData.brandName || !vehicleData.modelName || !vehicleData.oemChasisCode}
          >
            {isSubmitting ? "Submitting..." : "Add Vehicle"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;