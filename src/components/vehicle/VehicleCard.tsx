import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RotateCw, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { CardBackSlot } from "@/components/cards/CardBackSlot";
import VehicleCardButtons from "./VehicleCardButtons";

interface VehicleCardProps {
  vehicle: {
    name: string;
    brand: string;
    wheels: number;
    image?: string;
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSourceExpanded, setIsSourceExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);
  const [imageError, setImageError] = useState(false);

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

  // Helper to remove brand name from vehicle name
  const getDisplayName = () => {
    if (!vehicle.brand || !vehicle.name) return vehicle.name;

    // Remove brand name from the beginning of the vehicle name
    const brandRegex = new RegExp(`^${vehicle.brand}\\s*[-–—]?\\s*`, 'i');
    return vehicle.name.replace(brandRegex, '').trim() || vehicle.name;
  };

  const displayName = getDisplayName();

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
        className="absolute inset-0 w-full h-full backface-hidden hover:shadow-md cursor-pointer overflow-hidden"
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full bg-muted flex flex-col justify-between">
            {/* Background with image or centered vehicle name */}
            <div className="flex-grow flex items-center justify-center overflow-hidden rounded-t-lg">
              {vehicle.image && !imageError ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
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

                  // Add any vehicle ref fields here - adapt from wheel card structure
                  const vehicleData: any = vehicle;

                  // Define fields to display with labels
                  const fields = [
                    { label: 'Bolt Pattern', values: extractValues(vehicleData.bolt_pattern_ref) },
                    { label: 'Center Bore', values: extractValues(vehicleData.center_bore_ref) },
                    { label: 'Wheel Diameter', values: extractValues(vehicleData.wheel_diameter_ref) },
                    { label: 'Wheel Width', values: extractValues(vehicleData.wheel_width_ref) },
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
    </div>
  );

  return (
    <Link
      to={`/vehicles/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn("group relative block w-full perspective-1000", height)}
    >
      {cardContent}
      <VehicleCardButtons
        isFlipped={isFlipped}
        isSourceExpanded={isSourceExpanded}
        imageSource={vehicle.image}
        onFlip={() => onFlip(vehicle.name)}
        onToggleSource={toggleSource}
      />
    </Link>
  );
};

export default VehicleCard;
