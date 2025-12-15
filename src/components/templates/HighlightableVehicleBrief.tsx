import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableVehicleBriefProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableVehicleBrief: React.FC<HighlightableVehicleBriefProps> = ({
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
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Chassis Code:</span>
              {renderField("chassisCode", "[CHASSIS]", "font-mono text-sm")}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform:</span>
              {renderField("platform", "[PLATFORM]", "text-sm")}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Production:</span>
              {renderField("production", "[PRODUCTION]", "text-sm")}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bolt Pattern:</span>
              {renderField("boltPattern", "[BOLT PATTERN]", "font-mono text-sm")}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Center Bore:</span>
              {renderField("centerBore", "[CENTER BORE]", "font-mono text-sm")}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weight:</span>
              {renderField("weight", "[WEIGHT]", "text-sm")}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notes:</span>
            {renderField("notes", "[ADDITIONAL NOTES]", "text-sm italic")}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">
            {renderField("engineType", "[ENGINE TYPE]")}
          </Badge>
          <Badge variant="outline">
            {renderField("transmission", "[TRANSMISSION]")}
          </Badge>
          <Badge variant="outline">
            {renderField("drivetrain", "[DRIVETRAIN]")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightableVehicleBrief;