import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableVehicleHeaderProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableVehicleHeader: React.FC<HighlightableVehicleHeaderProps> = ({
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

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-6">
          <AspectRatio ratio={16/9} className="bg-muted">
            <div className="w-full h-full flex items-center justify-center">
              {renderField("heroImageUrl", "[VEHICLE IMAGE]", "text-muted-foreground")}
            </div>
          </AspectRatio>
          
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">
                {renderField("name", "[MODEL NAME]")}
              </h1>
              <p className="text-xl text-muted-foreground">
                {renderField("generation", "[GENERATION]")}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Years:</span>
                {renderField("years", "[YEARS]", "font-medium")}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Description:</span>
                {renderField("description", "[DESCRIPTION]", "text-sm")}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {renderField("segment", "[SEGMENT]")}
              </Badge>
              <Badge variant="secondary">
                {renderField("drive", "[DRIVE]")}
              </Badge>
              <Badge variant="secondary">
                {renderField("engines", "[ENGINES]")}
              </Badge>
            </div>
            
            <div className="pt-2">
              <span className="text-lg font-semibold">
                {renderField("msrp", "[MSRP]")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightableVehicleHeader;