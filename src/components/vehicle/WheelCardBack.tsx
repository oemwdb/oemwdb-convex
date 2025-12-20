import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart, RotateCw } from "lucide-react";

interface WheelCardBackProps {
  wheel: {
    id: string;
    name: string;
    diameter_ref?: any;
    width_ref?: any;
    bolt_pattern_ref?: any;
    center_bore_ref?: any;
    color_ref?: any;
    tire_size_ref?: any;
    vehicle_ref?: any;
    brand_ref?: any;
    design_style_ref?: string[];
  };
  isFavorite: boolean;
  isTextOverflowing: boolean;
  isHovering: boolean;
  backTextRef: React.RefObject<HTMLParagraphElement>;
  onToggleFavorite: () => void;
  onFlip: () => void;
  linkToDetail?: boolean;
}

const WheelCardBack = ({
  wheel,
  isFavorite,
  isTextOverflowing,
  isHovering,
  backTextRef,
  onToggleFavorite,
  onFlip,
  linkToDetail = false,
}: WheelCardBackProps) => {
  // Helper to extract values from JSONB array
  const extractValues = (jsonb: any): string[] => {
    if (!jsonb) return [];
    if (typeof jsonb === 'string') {
      try {
        jsonb = JSON.parse(jsonb);
      } catch {
        return [];
      }
    }
    if (Array.isArray(jsonb)) {
      return jsonb.map(item => typeof item === 'string' ? item : item.toString());
    }
    return [];
  };

  return (
    <>
      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full flex flex-col">

            {/* Content section - takes remaining space */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                <h4 className="font-medium text-foreground text-sm">
                  {wheel.brand_ref && extractValues(wheel.brand_ref).length > 0
                    ? extractValues(wheel.brand_ref)[0]
                    : "Specifications"}
                </h4>
              </div>
              <div
                className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0"
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
              >
                {(() => {
                  // Define fields to display with labels
                  const fields = [
                    { label: 'Vehicle', values: wheel.vehicle_ref ? extractValues(wheel.vehicle_ref).map(v => v.replace(/^.*?\s-\s/, '')) : [] },
                    { label: 'Diameter', values: wheel.diameter_ref ? extractValues(wheel.diameter_ref) : [] },
                    { label: 'Width', values: wheel.width_ref ? extractValues(wheel.width_ref) : [] },
                    { label: 'Bolt Pattern', values: wheel.bolt_pattern_ref ? extractValues(wheel.bolt_pattern_ref) : [] },
                    { label: 'Center Bore', values: wheel.center_bore_ref ? extractValues(wheel.center_bore_ref) : [] },
                    { label: 'Color', values: wheel.color_ref ? extractValues(wheel.color_ref) : [] },
                    { label: 'Tire Size', values: wheel.tire_size_ref ? extractValues(wheel.tire_size_ref) : [] },
                  ];

                  return fields.map((field, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "py-2 border-b border-border/50",
                        idx === fields.length - 1 && "border-b-0"
                      )}
                    >
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {field.values.length > 0 ? (
                          field.values.map((value, valueIdx) => (
                            <Badge
                              key={valueIdx}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                            >
                              {value}
                            </Badge>
                          ))
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0 text-muted-foreground"
                          >
                            {field.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Footer with wheel name and favorite button - matches front card */}
            <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
              <div className="relative overflow-hidden flex-1">
                <p
                  ref={backTextRef}
                  className={cn(
                    "text-foreground text-sm font-medium whitespace-nowrap",
                    isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                  )}
                >
                  {wheel.name}
                  {isTextOverflowing && isHovering && (
                    <span className="pl-4 inline-block">{wheel.name}</span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 w-7 p-0 flex-shrink-0 hover:!bg-transparent",
                  isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
                <span className="sr-only">Favorite</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flip button - positioned outside Card to avoid overflow-hidden clipping */}
      <div className="absolute top-2 left-2 h-8 w-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto backface-hidden rotate-y-180" style={{ zIndex: 999 }}>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFlip();
          }}
        >
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Flip card</span>
        </Button>
      </div>
    </>
  );
};

export default WheelCardBack;
