import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gauge, Heart, RotateCw, Zap } from "lucide-react";
import type { OemEngineFamilyBrowseRow } from "@/types/oem";
import {
  getEngineFamilyCode,
  getEngineFamilyDescriptor,
  getEngineFamilyTitle,
  getEngineVariantTitle,
  normalizeEngineText,
  uniqueEngineValues,
} from "@/lib/engineDisplay";
import { shouldCarryCollectionSearch } from "@/lib/collectionSearchPersistence";

interface EngineCardProps {
  engine: OemEngineFamilyBrowseRow;
  isFlipped?: boolean;
  onFlip?: (id: string) => void;
  height?: string;
}

const EngineCard = ({ engine, isFlipped = false, onFlip, height = "h-[240px]" }: EngineCardProps) => {
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);

  const title = getEngineFamilyTitle(engine);
  const familyCode = getEngineFamilyCode(engine);
  const familyDescriptor = getEngineFamilyDescriptor(engine);
  const backTitle = normalizeEngineText(engine.brand_ref) || "Specifications";

  const isElectric = normalizeEngineText(engine.fuel_summary)?.toLowerCase() === "electric";

  const variantPreview = useMemo(
    () => uniqueEngineValues(engine.variants.slice(0, 6).map((variant) => getEngineVariantTitle(variant))),
    [engine.variants],
  );

  const fields = useMemo(
    () => [
      { label: "Code", values: familyCode ? [familyCode] : [] },
      { label: "Family", values: familyDescriptor ? [familyDescriptor] : [] },
      { label: "Fuel", values: normalizeEngineText(engine.fuel_summary) ? [engine.fuel_summary!.trim()] : [] },
      { label: "Aspiration", values: normalizeEngineText(engine.aspiration_summary) ? [engine.aspiration_summary!.trim()] : [] },
      { label: "Variants", values: variantPreview },
      { label: "Vehicles", values: uniqueEngineValues(engine.linked_vehicle_titles.slice(0, 6)) },
    ],
    [engine.aspiration_summary, engine.fuel_summary, engine.linked_vehicle_titles, familyCode, familyDescriptor, variantPreview],
  );

  useEffect(() => {
    const checkOverflow = () => {
      const frontParent = textRef.current?.parentElement;
      const backParent = backTextRef.current?.parentElement;
      const frontOverflow = frontParent ? textRef.current!.scrollWidth > frontParent.clientWidth : false;
      const backOverflow = backParent ? backTextRef.current!.scrollWidth > backParent.clientWidth : false;
      setIsTextOverflowing(frontOverflow || backOverflow);
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
  }, [title]);

  const getConfigColor = () => {
    const layout = normalizeEngineText(engine.configuration ?? engine.engine_layout)?.toUpperCase();
    if (isElectric) return "from-blue-500/20 to-cyan-500/20";
    if (layout === "V12") return "from-amber-500/20 to-orange-500/20";
    if (layout === "V8") return "from-red-500/20 to-pink-500/20";
    return "from-slate-500/20 to-slate-600/20";
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip?.(engine.id);
  };
  const preservedSearch = shouldCarryCollectionSearch(location.pathname, ["/engines"])
    ? location.search
    : "";

  return (
    <Link
      to={{ pathname: `/engines/${engine.id}`, search: preservedSearch }}
      className={cn("group relative block w-full perspective-1000", height)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        <Card className="absolute inset-0 w-full h-full backface-hidden hover:shadow-md overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative h-full w-full bg-muted flex flex-col">
              <div className={cn("flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br", getConfigColor())}>
                {isElectric ? (
                  <Zap className="h-12 w-12 text-blue-400" />
                ) : (
                  <Gauge className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
                <div className="relative overflow-hidden flex-1">
                  <p
                    ref={textRef}
                    className={cn(
                      "text-foreground text-sm font-medium whitespace-nowrap",
                      isTextOverflowing && isHovering ? "animate-text-scroll" : "",
                    )}
                  >
                    {title}
                    {isTextOverflowing && isHovering && (
                      <span className="pl-4 inline-block">{title}</span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 flex-shrink-0 hover:!bg-transparent",
                    isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
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

        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative h-full w-full flex flex-col">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                  <h4 className="font-medium text-foreground text-sm">{backTitle}</h4>
                </div>

                <div
                  className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0"
                  style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
                >
                  {fields.map((field, idx) => (
                    <div
                      key={field.label}
                      className={cn(
                        "py-2 border-b border-border/50",
                        idx === fields.length - 1 && "border-b-0",
                      )}
                    >
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {field.values.length > 0 ? (
                          field.values.map((value, valueIdx) => (
                            <Badge
                              key={`${field.label}-${valueIdx}-${value}`}
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
                </div>
              </div>

              <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
                <div className="relative overflow-hidden flex-1">
                  <p
                    ref={backTextRef}
                    className={cn(
                      "text-foreground text-sm font-medium whitespace-nowrap",
                      isTextOverflowing && isHovering ? "animate-text-scroll" : "",
                    )}
                  >
                    {title}
                    {isTextOverflowing && isHovering && (
                      <span className="pl-4 inline-block">{title}</span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 flex-shrink-0 hover:!bg-transparent",
                    isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
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

export default EngineCard;
