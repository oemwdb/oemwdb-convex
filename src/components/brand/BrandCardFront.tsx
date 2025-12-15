
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCw, Heart } from "lucide-react";

interface BrandCardFrontProps {
  brandName: string;
  imageUrl: string | null;
  isFavorite: boolean;
  isTextOverflowing: boolean;
  isHovering: boolean;
  textRef: React.RefObject<HTMLParagraphElement>;
  onImageError: () => void;
  onFlip: () => void;
  onToggleFavorite: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const BrandCardFront = ({
  brandName,
  imageUrl,
  isFavorite,
  isTextOverflowing,
  isHovering,
  textRef,
  onImageError,
  onFlip,
  onToggleFavorite,
  onMouseEnter,
  onMouseLeave
}: BrandCardFrontProps) => {
  return (
    <Card 
      className="absolute inset-0 w-full h-full backface-hidden hover:shadow-md cursor-pointer overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-full w-full bg-muted flex flex-col">
          {/* Image or brand name section - fixed height container */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            {imageUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt={brandName}
                  className="max-w-full max-h-full object-contain"
                  onError={onImageError}
                />
              </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg">
                  <span className="text-muted-foreground text-sm text-center px-2">
                    No image available
                  </span>
                </div>
              )}
          </div>
          {/* Footer with brand name and favorite button - fixed height */}
          <div className="bg-card p-3 border-t border-border flex items-center justify-between flex-shrink-0 h-[52px]">
            <div className="relative overflow-hidden flex-1">
              <p 
                ref={textRef}
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

export default BrandCardFront;
