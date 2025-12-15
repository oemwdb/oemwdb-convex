
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RotateCw, Heart } from "lucide-react";
import { CardBackSlot } from "@/components/cards/CardBackSlot";

interface BrandCardBackProps {
  brandName: string;
  description?: string | null;
  wheelCount: number;
  vehicleCount?: number;
  isFavorite: boolean;
  isTextOverflowing: boolean;
  isHovering: boolean;
  backTextRef: React.RefObject<HTMLParagraphElement>;
  onFlip: () => void;
  onToggleFavorite: () => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
    label: string;
  }>;
}

const BrandCardBack = ({
  brandName,
  description,
  wheelCount,
  vehicleCount = 0,
  isFavorite,
  isTextOverflowing,
  isHovering,
  backTextRef,
  onFlip,
  onToggleFavorite,
  dataMapping
}: BrandCardBackProps) => {
  return (
    <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-full w-full bg-muted flex flex-col">

          {/* Content section - takes remaining space */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
              <h4 className="font-medium text-foreground text-sm">Brand Information</h4>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              {/* Vehicle count row */}
              <div className="py-2 border-b border-border/50">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0">
                    {vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
              
              {/* Wheel count row */}
              <div className="py-2 border-b-0">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0">
                    {wheelCount} wheel{wheelCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with brand name and favorite button - matches front card */}
          <div className="bg-card p-3 border-t border-border flex items-center justify-between flex-shrink-0 h-[52px]">
            <div className="relative overflow-hidden flex-1">
              <p 
                ref={backTextRef}
                className={cn(
                  "text-foreground text-sm font-medium whitespace-nowrap",
                  isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                )}
              >
                {brandName}
                {isTextOverflowing && isHovering && (
                  <span className="pl-4 inline-block">{brandName}</span>
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
  );
};

export default BrandCardBack;
