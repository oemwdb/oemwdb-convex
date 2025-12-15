import React from "react";
import { Link } from "react-router-dom";
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

  // Collect all ref fields - vehicle_ref first
  const refFields: Array<string[]> = [];

  if (wheel.vehicle_ref) {
    const values = extractValues(wheel.vehicle_ref).map(v =>
      v.replace(/^.*?\s-\s/, '') // Remove "Brand Name - " prefix
    );
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.diameter_ref) {
    const values = extractValues(wheel.diameter_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.width_ref) {
    const values = extractValues(wheel.width_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.bolt_pattern_ref) {
    const values = extractValues(wheel.bolt_pattern_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.center_bore_ref) {
    const values = extractValues(wheel.center_bore_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.color_ref) {
    const values = extractValues(wheel.color_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.tire_size_ref) {
    const values = extractValues(wheel.tire_size_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.brand_ref) {
    const values = extractValues(wheel.brand_ref);
    if (values.length > 0) refFields.push(values);
  }
  if (wheel.design_style_ref && wheel.design_style_ref.length > 0) {
    refFields.push(wheel.design_style_ref);
  }

  return (
    <>
      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden cursor-pointer">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full flex flex-col">
            {/* Content section - takes remaining space */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                <h4 className="font-medium text-foreground text-sm">Specifications</h4>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-2">
                {refFields.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    No specifications available
                  </div>
                ) : (
                  refFields.map((values, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "py-2 border-b border-border/50",
                        idx === refFields.length - 1 && "border-b-0"
                      )}
                    >
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {values.map((value, valueIdx) => (
                          <Badge
                            key={valueIdx}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                          >
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer with wheel name and favorite button - matches front card */}
            <div className="relative p-3 border-t border-border flex items-center justify-between flex-shrink-0 h-[52px] z-10">
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

        {/* Navigation overlay - behind all buttons */}
        {linkToDetail && (
          <Link
            to={`/wheel/${wheel.id}`}
            className="absolute inset-0 cursor-pointer z-0"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
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
