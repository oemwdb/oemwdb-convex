import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableWheelsSectionProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableWheelsSection: React.FC<HighlightableWheelsSectionProps> = ({
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

  // Mock wheel cards for demonstration
  const mockWheels = [1, 2, 3, 4];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Compatible Wheels</h2>
        <p className="text-muted-foreground">
          {renderField("wheelsDescription", "Wheel options available for your vehicle")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockWheels.map((wheel, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                {renderField(`wheelImage${index}`, "[WHEEL IMAGE]", "text-xs text-muted-foreground")}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  {renderField(`wheelName${index}`, `[WHEEL ${index + 1}]`)}
                </h3>
                
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    {renderField(`wheelSize${index}`, "[SIZE]", "font-mono")}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Width:</span>
                    {renderField(`wheelWidth${index}`, "[WIDTH]", "font-mono")}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offset:</span>
                    {renderField(`wheelOffset${index}`, "[OFFSET]", "font-mono")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HighlightableWheelsSection;