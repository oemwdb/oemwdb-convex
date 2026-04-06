import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart, RotateCw } from "lucide-react";
import {
  collectCardBackValues,
  firstCardBackValue,
  stripCardBackContext,
} from "@/lib/cardBackValues";

interface WheelCardBackProps {
  wheel: {
    id: string;
    name: string;
    diameter?: string | null;
    width?: string | null;
    bolt_pattern?: string | null;
    center_bore?: string | null;
    color?: string | null;
    tire_size?: string | null;
    brand_name?: string | null;
    vehicle_names?: string[] | string | null;
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
  return (
    <>
      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full flex flex-col">

            {/* Content section - takes remaining space */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                <h4 className="font-medium text-foreground text-sm">
                  {firstCardBackValue(wheel.brand_name, wheel.brand_ref) ?? "Specifications"}
                </h4>
              </div>
              <div
                className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0"
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
              >
                {(() => {
                  // Define fields to display with labels
                  const fields = [
                    {
                      label: 'Vehicle',
                      values: collectCardBackValues(wheel.vehicle_names, wheel.vehicle_ref).map(stripCardBackContext),
                    },
                    { label: 'Diameter', values: collectCardBackValues(wheel.diameter, wheel.diameter_ref) },
                    { label: 'Width', values: collectCardBackValues(wheel.width, wheel.width_ref) },
                    { label: 'Bolt Pattern', values: collectCardBackValues(wheel.bolt_pattern, wheel.bolt_pattern_ref) },
                    { label: 'Center Bore', values: collectCardBackValues(wheel.center_bore, wheel.center_bore_ref) },
                    { label: 'Color', values: collectCardBackValues(wheel.color, wheel.color_ref) },
                    { label: 'Tire Size', values: collectCardBackValues(wheel.tire_size, wheel.tire_size_ref) },
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

            {/* Find at section */}
            <div className="px-4 py-2 border-t border-border/50 shrink-0">
              <p className="text-xs text-muted-foreground mb-1">Find online</p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(wheel.name + " wheels")}&_sacat=6000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Search on eBay"
                >
                  eBay
                </a>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(wheel.name + " wheels price")}&tbm=shop`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Search on Google Shopping"
                >
                  Google
                </a>
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
