import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WheelFormProps {
  wheelData: {
    wheelName: string;
    diameter: string;
    diameterTag: string;
    brandRel: string;
    boltPatternTxt: string;
    boltPatternTag: string;
    centerBoreTxt: string;
    centerBoreTag: string;
    widthTag: string;
    colorNamesTxt: string;
    colorGroups: string;
    designStyleTag: string;
    oemPartNumbersTxt: string;
    hollanderInterchangePartNumbers: string;
    oemBoltPatterns: string;
    oemColorRel: string;
    vehicleRel: string;
    vehicleRelTxt: string;
    wheelSourceLink: string;
    goodPic: string;
    badPic: string;
    sources: string;
    userSubmissionInput: string;
    status: string;
  };
  setWheelData: (data: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const WheelForm = ({ wheelData, setWheelData, onSubmit, isSubmitting }: WheelFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Wheel</CardTitle>
        <CardDescription>
          Add a new wheel style to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wheel-name">Wheel Name *</Label>
              <Input 
                id="wheel-name"
                value={wheelData.wheelName}
                onChange={(e) => setWheelData({...wheelData, wheelName: e.target.value})}
                placeholder="e.g., Style 162, BBS CH-R"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diameter">Diameter</Label>
              <Input 
                id="diameter"
                value={wheelData.diameter}
                onChange={(e) => setWheelData({...wheelData, diameter: e.target.value})}
                placeholder="e.g., 18, 19, 20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diameter-tag">Diameter Tag</Label>
              <Input 
                id="diameter-tag"
                value={wheelData.diameterTag}
                onChange={(e) => setWheelData({...wheelData, diameterTag: e.target.value})}
                placeholder="Diameter classification tag"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand-rel">Brand Relation</Label>
              <Input 
                id="brand-rel"
                value={wheelData.brandRel}
                onChange={(e) => setWheelData({...wheelData, brandRel: e.target.value})}
                placeholder="Related brand"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bolt-pattern-txt">Bolt Pattern</Label>
              <Input 
                id="bolt-pattern-txt"
                value={wheelData.boltPatternTxt}
                onChange={(e) => setWheelData({...wheelData, boltPatternTxt: e.target.value})}
                placeholder="e.g., 5x120, 5x114.3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="center-bore-txt">Center Bore</Label>
              <Input 
                id="center-bore-txt"
                value={wheelData.centerBoreTxt}
                onChange={(e) => setWheelData({...wheelData, centerBoreTxt: e.target.value})}
                placeholder="e.g., 72.6mm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width-tag">Width Tag</Label>
              <Input 
                id="width-tag"
                value={wheelData.widthTag}
                onChange={(e) => setWheelData({...wheelData, widthTag: e.target.value})}
                placeholder="e.g., 8.5J, 9J"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color-names">Color Names</Label>
              <Textarea 
                id="color-names"
                value={wheelData.colorNamesTxt}
                onChange={(e) => setWheelData({...wheelData, colorNamesTxt: e.target.value})}
                placeholder="Available colors (comma separated)"
                rows={2}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oem-part-numbers">OEM Part Numbers</Label>
              <Textarea 
                id="oem-part-numbers"
                value={wheelData.oemPartNumbersTxt}
                onChange={(e) => setWheelData({...wheelData, oemPartNumbersTxt: e.target.value})}
                placeholder="OEM part numbers (comma separated)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hollander-numbers">Hollander Interchange Part Numbers</Label>
              <Textarea 
                id="hollander-numbers"
                value={wheelData.hollanderInterchangePartNumbers}
                onChange={(e) => setWheelData({...wheelData, hollanderInterchangePartNumbers: e.target.value})}
                placeholder="Hollander interchange numbers"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle-rel">Vehicle Relations</Label>
              <Textarea 
                id="vehicle-rel"
                value={wheelData.vehicleRel}
                onChange={(e) => setWheelData({...wheelData, vehicleRel: e.target.value})}
                placeholder="Compatible vehicles"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wheel-source-link">Wheel Source Link</Label>
              <Input 
                id="wheel-source-link"
                value={wheelData.wheelSourceLink}
                onChange={(e) => setWheelData({...wheelData, wheelSourceLink: e.target.value})}
                placeholder="Source URL for wheel information"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="good-pic">Good Picture URL</Label>
              <Input 
                id="good-pic"
                value={wheelData.goodPic}
                onChange={(e) => setWheelData({...wheelData, goodPic: e.target.value})}
                placeholder="URL to high quality wheel image"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sources">Sources</Label>
              <Textarea 
                id="sources"
                value={wheelData.sources}
                onChange={(e) => setWheelData({...wheelData, sources: e.target.value})}
                placeholder="Information sources"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-submission">Additional Notes</Label>
              <Textarea 
                id="user-submission"
                value={wheelData.userSubmissionInput}
                onChange={(e) => setWheelData({...wheelData, userSubmissionInput: e.target.value})}
                placeholder="Additional information or notes"
                rows={2}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onSubmit} disabled={isSubmitting || !wheelData.wheelName}>
            {isSubmitting ? "Submitting..." : "Add Wheel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelForm;