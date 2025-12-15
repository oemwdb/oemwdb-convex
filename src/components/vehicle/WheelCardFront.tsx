import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart, RotateCw, Info } from "lucide-react";

interface WheelCardFrontProps {
  wheel: {
    id: string;
    name: string;
    imageSource?: string | null;
    brand_ref?: any;
  };
  imageUrl: string | null;
  isFavorite: boolean;
  isFlipped: boolean;
  isTextOverflowing: boolean;
  isHovering: boolean;
  isSourceExpanded: boolean;
  textRef: React.RefObject<HTMLParagraphElement>;
  onImageError: () => void;
  onToggleFavorite: () => void;
  onFlip: () => void;
  onToggleSource: () => void;
  handleWheelMouseEnter: () => void;
  handleWheelMouseLeave: () => void;
  getTransformStyle: () => React.CSSProperties;
  linkToDetail?: boolean;
}

const WheelCardFront = ({
  wheel,
  imageUrl,
  isFavorite,
  isFlipped,
  isTextOverflowing,
  isHovering,
  isSourceExpanded,
  textRef,
  onImageError,
  onToggleFavorite,
  onFlip,
  onToggleSource,
  handleWheelMouseEnter,
  handleWheelMouseLeave,
  getTransformStyle,
  linkToDetail = false,
}: WheelCardFrontProps) => {
  // Extract brand name from brand_ref
  const extractBrandName = (): string | null => {
    if (!wheel.brand_ref) return null;

    let brandData = wheel.brand_ref;
    if (typeof brandData === 'string') {
      try {
        brandData = JSON.parse(brandData);
      } catch {
        return null;
      }
    }

    if (Array.isArray(brandData) && brandData.length > 0) {
      const brandValue = typeof brandData[0] === 'string' ? brandData[0] : brandData[0].toString();
      return brandValue;
    }

    return null;
  };

  const brandName = extractBrandName();
  return (
    <Card className="absolute inset-0 w-full h-full backface-hidden hover:shadow-md cursor-pointer overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-full w-full bg-card flex flex-col">
          {/* Wheel image area - takes remaining space above footer */}
          <div
            className="flex-1 relative overflow-hidden"
          >
            {!imageUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg">
                <span className="text-muted-foreground text-sm text-center px-2">
                  No image available
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg pt-[5%]">
                <img
                  src={imageUrl}
                  alt={wheel.name}
                  className="max-w-[105%] max-h-[105%] object-contain"
                  style={getTransformStyle()}
                  onError={onImageError}
                  onMouseEnter={handleWheelMouseEnter}
                  onMouseLeave={handleWheelMouseLeave}
                />
              </div>
            )}
          </div>

          {/* Footer with brand badge, wheel name and favorite button */}
          <div className="relative bg-card p-3 border-t border-border flex items-center justify-between flex-shrink-0 h-[52px] z-10">
            <div className="relative overflow-hidden flex-1">
              <div
                ref={textRef}
                className={cn(
                  "text-foreground text-sm font-medium whitespace-nowrap flex items-center gap-2",
                  isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                )}
              >
                {brandName && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 flex-shrink-0">
                    {brandName}
                  </Badge>
                )}
                <span>{wheel.name}</span>
                {isTextOverflowing && isHovering && (
                  <>
                    {brandName && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 flex-shrink-0 ml-4">
                        {brandName}
                      </Badge>
                    )}
                    <span className={brandName ? "" : "pl-4"}>{wheel.name}</span>
                  </>
                )}
              </div>
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

      {/* Buttons - integrated into the card */}
      <div
        className={cn(
          "absolute inset-0 z-20 backface-hidden",
          isFlipped ? "pointer-events-none opacity-0" : "pointer-events-none"
        )}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Info button - top left */}
        <div
          className={cn(
            "absolute top-2 h-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-[left,right,width,background-color,border-color] duration-300 ease-out flex items-center overflow-hidden z-10",
            isSourceExpanded && "bg-background/80 backdrop-blur-sm border-border/50",
            isSourceExpanded ? "left-2 right-2 pr-10" : "w-8 left-2"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-transparent pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSource();
            }}
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Image source</span>
          </Button>

          {isSourceExpanded && (
            <div className="flex-1 flex items-center gap-2 overflow-hidden animate-in fade-in duration-300 pl-1 pointer-events-auto">
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-xs text-muted-foreground">
                    {wheel.imageSource || "img source"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Flip button - top right */}
        <div className="absolute top-2 right-2 h-8 w-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto z-30">
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
      </div>

      {/* Navigation overlay - doesn't block wheel rotation */}
      {linkToDetail && (
        <Link
          to={`/wheel/${wheel.id}`}
          className="absolute inset-0 cursor-pointer pointer-events-none"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      )}
    </Card>
  );
};

export default WheelCardFront;
