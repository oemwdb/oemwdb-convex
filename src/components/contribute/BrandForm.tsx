import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BrandFormProps {
  brandData: {
    brandPage: string;
    brandDescription: string;
    oemChasisCodes: string;
    oemModelLines: string;
    oemWheels: string;
    imagelink: string;
  };
  setBrandData: (data: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const BrandForm = ({ brandData, setBrandData, onSubmit, isSubmitting }: BrandFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Brand</CardTitle>
        <CardDescription>
          Add a new automotive brand to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-page">Brand Name *</Label>
              <Input 
                id="brand-page"
                value={brandData.brandPage}
                onChange={(e) => setBrandData({...brandData, brandPage: e.target.value})}
                placeholder="e.g., BMW, Audi, Mercedes"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand-description">Brand Description</Label>
              <Textarea 
                id="brand-description"
                value={brandData.brandDescription}
                onChange={(e) => setBrandData({...brandData, brandDescription: e.target.value})}
                placeholder="Brief description of the brand"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oem-chassis-codes">OEM Chassis Codes</Label>
              <Textarea 
                id="oem-chassis-codes"
                value={brandData.oemChasisCodes}
                onChange={(e) => setBrandData({...brandData, oemChasisCodes: e.target.value})}
                placeholder="e.g., E90, F30, G20 (comma separated)"
                rows={2}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oem-model-lines">OEM Model Lines</Label>
              <Textarea 
                id="oem-model-lines"
                value={brandData.oemModelLines}
                onChange={(e) => setBrandData({...brandData, oemModelLines: e.target.value})}
                placeholder="e.g., 3 Series, 5 Series, X3 (comma separated)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oem-wheels">OEM Wheels</Label>
              <Textarea 
                id="oem-wheels"
                value={brandData.oemWheels}
                onChange={(e) => setBrandData({...brandData, oemWheels: e.target.value})}
                placeholder="List of OEM wheel styles"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-link">Image URL</Label>
              <Input 
                id="image-link"
                value={brandData.imagelink}
                onChange={(e) => setBrandData({...brandData, imagelink: e.target.value})}
                placeholder="https://example.com/brand-logo.jpg"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onSubmit} disabled={isSubmitting || !brandData.brandPage}>
            {isSubmitting ? "Submitting..." : "Add Brand"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandForm;