import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableBrandHeaderProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableBrandHeader: React.FC<HighlightableBrandHeaderProps> = ({
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
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
            {renderField("logoUrl", "[BRAND LOGO]", "text-sm text-muted-foreground")}
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {renderField("name", "[BRAND NAME]")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {renderField("tagline", "[TAGLINE]")}
            </p>
          </div>
          
          <p className="text-base max-w-2xl mx-auto">
            {renderField("description", "[BRAND DESCRIPTION]")}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Founded</span>
              {renderField("foundedYear", "[YEAR]", "font-semibold")}
            </div>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Country</span>
              {renderField("country", "[COUNTRY]", "font-semibold")}
            </div>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Headquarters</span>
              {renderField("headquarters", "[LOCATION]", "font-semibold")}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">
              {renderField("vehicleCount", "[X] Vehicles")}
            </Badge>
            <Badge variant="secondary">
              {renderField("wheelCount", "[X] Wheels")}
            </Badge>
            <Badge variant="secondary">
              {renderField("marketSegment", "[SEGMENT]")}
            </Badge>
          </div>
          
          <div className="pt-4">
            {renderField("website", "[WEBSITE URL]", "text-primary hover:underline")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightableBrandHeader;