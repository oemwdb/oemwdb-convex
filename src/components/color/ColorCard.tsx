import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, RotateCw } from "lucide-react";
import { shouldCarryCollectionSearch } from "@/lib/collectionSearchPersistence";

interface ColorCardProps {
  color: {
    slug: string;
    color_title: string;
    family_title?: string | null;
    swatch_hex?: string | null;
    brand_title?: string | null;
    finish?: string | null;
    wheelCount?: number;
    vehicleCount?: number;
    wheelVariantCount?: number;
    vehicleVariantCount?: number;
  };
  isFlipped?: boolean;
  onFlip?: (slug: string) => void;
  height?: string;
}

const ColorCard = ({
  color,
  isFlipped = false,
  onFlip,
  height = "h-[240px]",
}: ColorCardProps) => {
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current?.parentElement) {
        setIsTextOverflowing(textRef.current.scrollWidth > textRef.current.parentElement.clientWidth);
      }
      if (backTextRef.current?.parentElement) {
        setIsTextOverflowing((prev) => prev || backTextRef.current!.scrollWidth > backTextRef.current!.parentElement!.clientWidth);
      }
    };

    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    const resizeObserver = new ResizeObserver(() => setTimeout(checkOverflow, 50));
    if (textRef.current?.parentElement) resizeObserver.observe(textRef.current.parentElement);
    if (backTextRef.current?.parentElement) resizeObserver.observe(backTextRef.current.parentElement);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
      resizeObserver.disconnect();
    };
  }, [color.color_title]);

  const swatch = color.swatch_hex || "#7b7771";
  const wheelTotal = (color.wheelCount ?? 0) + (color.wheelVariantCount ?? 0);
  const vehicleTotal = (color.vehicleCount ?? 0) + (color.vehicleVariantCount ?? 0);
  const relatedCount = wheelTotal + vehicleTotal;
  const backFields = [
    { label: "Brand", values: color.brand_title ? [color.brand_title] : [] },
    { label: "Family", values: color.family_title ? [color.family_title] : [] },
    { label: "Finish", values: color.finish ? [color.finish] : [] },
    { label: "Hex", values: color.swatch_hex ? [color.swatch_hex] : [] },
    { label: "Wheels", values: wheelTotal > 0 ? [`${wheelTotal} linked`] : [] },
    { label: "Vehicles", values: vehicleTotal > 0 ? [`${vehicleTotal} linked`] : [] },
  ];

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip?.(color.slug);
  };
  const preservedSearch = shouldCarryCollectionSearch(location.pathname, ["/colors"])
    ? location.search
    : "";

  return (
    <Link
      to={{ pathname: `/colors/${color.slug}`, search: preservedSearch }}
      className={cn("group relative block w-full perspective-1000", height)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        <Card className="absolute inset-0 h-full w-full backface-hidden overflow-hidden hover:shadow-md">
          <CardContent className="p-0 flex h-full flex-col">
            <div className="relative h-full w-full bg-muted flex flex-col">
              <div
                className="flex-1 border-b border-border/60"
                style={{
                  background: `radial-gradient(circle at 50% 28%, rgba(255,255,255,0.24), transparent 42%), linear-gradient(135deg, ${swatch} 0%, color-mix(in srgb, ${swatch} 54%, #101010 46%) 100%)`,
                }}
              >
                <div className="flex h-full w-full items-end justify-between p-4">
                  <div className="h-3 w-3 rounded-full border border-white/25 bg-white/35 shadow-[0_0_18px_rgba(255,255,255,0.22)]" />
                  {color.brand_title ? (
                    <Badge variant="secondary" className="border border-black/15 bg-white/20 text-white backdrop-blur-sm">
                      {color.brand_title}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
                <div className="relative overflow-hidden flex-1">
                  <p
                    ref={textRef}
                    className={cn(
                      "text-foreground text-sm font-medium whitespace-nowrap",
                      isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                    )}
                  >
                    {color.color_title}
                    {isTextOverflowing && isHovering && (
                      <span className="pl-4 inline-block">{color.color_title}</span>
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
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="absolute inset-0 h-full w-full backface-hidden rotate-y-180 overflow-hidden hover:shadow-md">
          <CardContent className="p-0 flex h-full flex-col">
            <div className="relative h-full w-full flex flex-col">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                  <h4 className="font-medium text-foreground text-sm">
                    {color.brand_title || "Color details"}
                  </h4>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>
                  {backFields.map((field, idx) => (
                    <div
                      key={field.label}
                      className={cn("py-2 border-b border-border/50", idx === backFields.length - 1 && "border-b-0")}
                    >
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {field.values.length > 0 ? (
                          field.values.map((value, valueIdx) => (
                            <Badge
                              key={`${field.label}-${valueIdx}`}
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
                  ))}
                  <div className="pt-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-border/60 bg-black/20 px-3 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">Linked</div>
                        <div className="mt-1 text-base font-semibold leading-none text-foreground">{relatedCount}</div>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-black/20 px-3 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">Wheels</div>
                        <div className="mt-1 text-base font-semibold leading-none text-foreground">{wheelTotal}</div>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-black/20 px-3 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">Vehicles</div>
                        <div className="mt-1 text-base font-semibold leading-none text-foreground">{vehicleTotal}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
                <div className="relative overflow-hidden flex-1">
                  <p
                    ref={backTextRef}
                    className={cn(
                      "text-foreground text-sm font-medium whitespace-nowrap",
                      isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                    )}
                  >
                    {color.color_title}
                    {isTextOverflowing && isHovering && (
                      <span className="pl-4 inline-block">{color.color_title}</span>
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
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-2 right-2 h-8 w-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto z-30">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
            onClick={handleFlip}
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Flip card</span>
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ColorCard;
