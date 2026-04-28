import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RotateCw, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { CardBackSlot } from "@/components/cards/CardBackSlot";
import VehicleCardButtons from "./VehicleCardButtons";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";
import { getVehicleRoutePath } from "@/lib/vehicleRoutes";
import { collectCardBackValues } from "@/lib/cardBackValues";
import { shouldCarryCollectionSearch } from "@/lib/collectionSearchPersistence";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";

interface VehicleCardProps {
  vehicle: {
    id?: string;
    slug?: string;
    routeId?: string;
    name: string;
    brand: string;
    wheels: number;
    image?: string;
    good_pic_url?: string | null;
    bad_pic_url?: string | null;
    bolt_pattern_ref?: any;
    center_bore_ref?: any;
    wheel_diameter_ref?: any;
    wheel_width_ref?: any;
  };
  isFlipped: boolean;
  onFlip: (name: string) => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
    label: string;
  }>;
  height?: string;
}

const VehicleCard = ({ vehicle, isFlipped, onFlip, dataMapping, height = "h-[240px]" }: VehicleCardProps) => {
  const location = useLocation();
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSourceExpanded, setIsSourceExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);
  const [imageError, setImageError] = useState(false);
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);

  // Check if text is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      // Check front text
      if (textRef.current) {
        const parent = textRef.current.parentElement;
        if (parent) {
          const isOverflowing = textRef.current.scrollWidth > parent.clientWidth;
          setIsTextOverflowing(isOverflowing);
        }
      }
      // Check back text
      if (backTextRef.current) {
        const parent = backTextRef.current.parentElement;
        if (parent) {
          const isOverflowing = backTextRef.current.scrollWidth > parent.clientWidth;
          setIsTextOverflowing(prev => prev || isOverflowing);
        }
      }
    };

    // Delay initial check to ensure layout is complete
    const timeoutId = setTimeout(checkOverflow, 100);

    // Re-check on window resize
    window.addEventListener('resize', checkOverflow);

    // Use ResizeObserver to detect when card size changes (e.g., sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkOverflow, 50);
    });

    // Observe both text elements and their containers
    if (textRef.current?.parentElement) {
      resizeObserver.observe(textRef.current.parentElement);
    }
    if (backTextRef.current?.parentElement) {
      resizeObserver.observe(backTextRef.current.parentElement);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
      resizeObserver.disconnect();
    };
  }, [vehicle.name]);

  // Auto-collapse source when card flips
  useEffect(() => {
    if (isFlipped) {
      setIsSourceExpanded(false);
    }
  }, [isFlipped]);

  useEffect(() => {
    setImageCandidateIndex(0);
    setImageError(false);
  }, [vehicle.good_pic_url, vehicle.bad_pic_url, vehicle.image]);

  // Use chassis code (name) directly - no brand stripping needed for chassis codes like F55, F56
  const displayName = vehicle.name;
  const preferBadPic = isAdmin && isDevMode;
  const prioritizedSources = preferBadPic
    ? [
        {
          values: getMediaUrlCandidates(vehicle.bad_pic_url, "BADPICS"),
          fitMode: "contain" as const,
          sourceKind: "bad" as const,
        },
        {
          values: getMediaUrlCandidates(vehicle.good_pic_url, "oemwdb images"),
          fitMode: "cover" as const,
          sourceKind: "good" as const,
        },
        {
          values: getMediaUrlCandidates(vehicle.image, "oemwdb images"),
          fitMode: "cover" as const,
          sourceKind: "legacy" as const,
        },
      ]
    : [
        {
          values: getMediaUrlCandidates(vehicle.good_pic_url, "oemwdb images"),
          fitMode: "cover" as const,
          sourceKind: "good" as const,
        },
        {
          values: getMediaUrlCandidates(vehicle.bad_pic_url, "BADPICS"),
          fitMode: "contain" as const,
          sourceKind: "bad" as const,
        },
        {
          values: getMediaUrlCandidates(vehicle.image, "oemwdb images"),
          fitMode: "cover" as const,
          sourceKind: "legacy" as const,
        },
      ];

  const imageSources = prioritizedSources.flatMap(({ values, fitMode, sourceKind }) =>
    values.map((value) => ({
      value,
      fitMode,
      sourceKind,
    })),
  ).filter(
    (candidate, index, all) => all.findIndex((item) => item.value === candidate.value) === index
  );
  const activeImageSource = !imageError ? imageSources[imageCandidateIndex] ?? null : null;
  const vehicleImageUrl = activeImageSource?.value ?? null;
  const usesContainedImage = activeImageSource?.fitMode === "contain";

  const toggleSource = () => {
    setIsSourceExpanded(!isSourceExpanded);
  };

  const cardContent = (
    <div
      className={cn(
        "relative w-full h-full transition-transform duration-500 transform-style-3d",
        isFlipped ? "rotate-y-180" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Front of card */}
      <Card
        className="absolute inset-0 w-full h-full backface-hidden hover-glow cursor-pointer overflow-hidden"
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full bg-muted flex flex-col justify-between">
            {/* Background with image or centered vehicle name */}
            <div className="flex-grow flex items-center justify-center overflow-hidden rounded-t-lg">
              {vehicleImageUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg">
                  <img
                    src={vehicleImageUrl}
                    alt={vehicle.name}
                    className={cn(
                      usesContainedImage ? "max-w-[90%] max-h-[90%] object-contain" : "w-full h-full object-cover"
                    )}
                    onError={() => {
                      const nextIndex = imageCandidateIndex + 1;
                      if (nextIndex < imageSources.length) {
                        setImageCandidateIndex(nextIndex);
                        return;
                      }
                      setImageError(true);
                    }}
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

            {/* Footer with vehicle name and favorite button */}
            <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2">
              <div className="relative overflow-hidden flex-1">
                <p
                  ref={textRef}
                  className={cn(
                    "text-foreground text-sm font-medium whitespace-nowrap",
                    isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                  )}
                >
                  {displayName}
                  {isTextOverflowing && isHovering && (
                    <span className="pl-4 inline-block">{displayName}</span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 w-7 p-0 hover:!bg-transparent flex-shrink-0",
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

      {/* Back of card */}
      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full flex flex-col">

            {/* Content section - takes remaining space */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="pl-4 pr-12 pt-4 pb-2 flex-shrink-0">
                <h4 className="font-medium text-foreground text-sm">
                  {vehicle.brand || "Vehicle Specifications"}
                </h4>
              </div>
              <div
                className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0"
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
              >
                {(() => {
                  // Add any vehicle ref fields here - adapt from wheel card structure
                  const vehicleData: any = vehicle;

                  // Define fields to display with labels
                  const fields = [
                    { label: 'Bolt Pattern', values: collectCardBackValues(vehicleData.bolt_pattern_ref) },
                    { label: 'Center Bore', values: collectCardBackValues(vehicleData.center_bore_ref) },
                    { label: 'Wheel Diameter', values: collectCardBackValues(vehicleData.wheel_diameter_ref) },
                    { label: 'Wheel Width', values: collectCardBackValues(vehicleData.wheel_width_ref) },
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

            {/* Footer with vehicle name and favorite button - matches front card */}
            <div className="bg-card p-3 border-t border-border flex items-center justify-between gap-2 flex-shrink-0">
              <div className="relative overflow-hidden flex-1">
                <p
                  ref={backTextRef}
                  className={cn(
                    "text-foreground text-sm font-medium whitespace-nowrap",
                    isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                  )}
                >
                  {vehicle.name}
                  {isTextOverflowing && isHovering && (
                    <span className="pl-4 inline-block">{vehicle.name}</span>
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
    </div >
  );

  // Use vehicle ID for link if available, otherwise fallback to name-based slug
  const vehicleLink = getVehicleRoutePath(vehicle);
  const preservedSearch = shouldCarryCollectionSearch(location.pathname, ["/vehicles", "/vehicle-variants"])
    ? location.search
    : "";
  const flipKey = vehicle.id || vehicle.slug || vehicle.routeId || vehicle.name;

  return (
    <Link
      to={{ pathname: vehicleLink, search: preservedSearch }}
      className={cn("group relative block w-full perspective-1000", height)}
    >
      {cardContent}
      <VehicleCardButtons
        isFlipped={isFlipped}
        isSourceExpanded={isSourceExpanded}
        imageSource={activeImageSource?.value ?? vehicle.image}
        onFlip={() => onFlip(flipKey)}
        onToggleSource={toggleSource}
      />
    </Link>
  );
};

export default VehicleCard;
