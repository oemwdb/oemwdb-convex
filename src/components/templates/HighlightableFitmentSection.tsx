import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableFitmentSectionProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableFitmentSection: React.FC<HighlightableFitmentSectionProps> = ({
  fields,
  hoveredMapping,
  onElementClick,
  onElementHover,
}) => {
  const getFieldValue = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.value || `[${fieldId.toUpperCase()}]`;
  };

  const renderField = (fieldId: string, defaultValue: string, className?: string) => {
    const isHighlighted = hoveredMapping === fieldId;
    
    return (
      <span
        className={cn(
          "cursor-pointer transition-all duration-200 px-1 rounded",
          isHighlighted && "bg-yellow-200 dark:bg-yellow-900/50",
          className
        )}
        onClick={() => onElementClick(fieldId)}
        onMouseEnter={() => onElementHover(fieldId)}
        onMouseLeave={() => onElementHover(null)}
      >
        {getFieldValue(fieldId) || defaultValue}
      </span>
    );
  };

  // Mock vehicle cards for demonstration
  const mockVehicles = [1, 2, 3, 4];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Compatible Vehicles</h2>
        <p className="text-muted-foreground">
          {renderField("fitmentDescription", "Vehicles that fit this wheel")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockVehicles.map((vehicle, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                {renderField(`vehicleImage${index}`, "[VEHICLE IMAGE]", "text-xs text-muted-foreground")}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  {renderField(`vehicleName${index}`, `[VEHICLE ${index + 1}]`)}
                </h3>
                
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chassis:</span>
                    {renderField(`vehicleChassis${index}`, "[CHASSIS]", "font-mono")}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years:</span>
                    {renderField(`vehicleYears${index}`, "[YEARS]")}
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {renderField(`fitmentType${index}`, "[OEM/AFTERMARKET]")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HighlightableFitmentSection;