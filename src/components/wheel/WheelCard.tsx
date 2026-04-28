import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import WheelCardButtons from "@/components/wheel/WheelCardButtons";
import { useWheelRotation } from "@/hooks/useWheelRotation";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";
import {
    collectCardBackValues,
    firstCardBackValue,
    stripCardBackContext,
} from "@/lib/cardBackValues";
import { shouldCarryCollectionSearch } from "@/lib/collectionSearchPersistence";

interface WheelCardProps {
    wheel: {
        id: string;
        name: string;
        imageUrl?: string | null;
        good_pic_url?: string | null;
        bad_pic_url?: string | null;
        imageSource?: string | null;
        brand_name?: string | null;
        diameter?: string | null;
        width?: string | null;
        bolt_pattern?: string | null;
        center_bore?: string | null;
        color?: string | null;
        tire_size?: string | null;
        vehicle_names?: string[] | string | null;
        // JSONB reference fields for back of card
        diameter_ref?: any;
        width_ref?: any;
        bolt_pattern_ref?: any;
        center_bore_ref?: any;
        color_ref?: any;
        tire_size_ref?: any;
        vehicle_ref?: any;
        brand_ref?: any;
    };
    isFlipped: boolean;
    onFlip: (id: string) => void;
    height?: string;
}

const WheelCard = ({ wheel, isFlipped, onFlip, height = "h-[240px]" }: WheelCardProps) => {
    const location = useLocation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isSourceExpanded, setIsSourceExpanded] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const backTextRef = useRef<HTMLParagraphElement>(null);
    const [imageError, setImageError] = useState(false);

    // Wheel rotation on hover (unique to wheel cards)
    const { handleMouseEnter: handleWheelMouseEnter, handleMouseLeave: handleWheelMouseLeave, wheelImageRef } = useWheelRotation();

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
    }, [wheel.name]);

    // Auto-collapse source when card flips
    useEffect(() => {
        if (isFlipped) {
            setIsSourceExpanded(false);
        }
    }, [isFlipped]);

    const brandName = firstCardBackValue(wheel.brand_name, wheel.brand_ref);

    // Helper to remove brand name from wheel name
    const getDisplayName = () => {
        if (!brandName || !wheel.name) return wheel.name;

        // Remove brand name from the beginning of the wheel name
        const brandRegex = new RegExp(`^${brandName}\\s*[-–—]?\\s*`, 'i');
        return wheel.name.replace(brandRegex, '').trim() || wheel.name;
    };

    const displayName = getDisplayName();

    const toggleSource = () => {
        setIsSourceExpanded(!isSourceExpanded);
    };

    // Priority: 1. Good Pic | 2. Bad Pic fallback | 3. imageUrl (legacy)
    const sourceCandidates = [
        ...getMediaUrlCandidates(wheel.good_pic_url, "oemwdb images"),
        ...getMediaUrlCandidates(wheel.bad_pic_url, "BADPICS"),
        ...getMediaUrlCandidates(wheel.imageUrl, "oemwdb images"),
    ].filter((candidate, index, all) => all.indexOf(candidate) === index);

    const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
    const imageUrl = sourceCandidates[imageCandidateIndex] ?? null;

    useEffect(() => {
        setImageError(false);
        setImageCandidateIndex(0);
    }, [wheel.good_pic_url, wheel.bad_pic_url, wheel.imageUrl]);

    const preservedSearch = shouldCarryCollectionSearch(location.pathname, ["/wheels", "/wheel", "/wheel-variants"])
        ? location.search
        : "";

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
                        {/* Background with image or centered wheel name */}
                        <div className="flex-grow flex items-center justify-center overflow-hidden rounded-t-lg">
                            {imageUrl && !imageError ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg pt-[5%]">
                                    <img
                                        ref={wheelImageRef}
                                        src={imageUrl}
                                        alt={wheel.name}
                                        className="max-w-[105%] max-h-[105%] object-contain will-change-transform"
                                        onError={() => {
                                            const nextIndex = imageCandidateIndex + 1;
                                            if (nextIndex < sourceCandidates.length) {
                                                setImageCandidateIndex(nextIndex);
                                                return;
                                            }
                                            setImageError(true);
                                        }}
                                        onMouseEnter={handleWheelMouseEnter}
                                        onMouseLeave={handleWheelMouseLeave}
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

                        {/* Footer with wheel name and favorite button */}
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
                                    {brandName || "Specifications"}
                                </h4>
                            </div>
                            <div
                                className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-2 min-h-0"
                                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
                            >
                                {(() => {
                                    // Define fields to display with labels (wheel-specific)
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

    return (
        <Link
            to={{ pathname: `/wheel/${wheel.id}`, search: preservedSearch }}
            className={cn("group relative block w-full perspective-1000", height)}
        >
            {cardContent}
            <WheelCardButtons
                isFlipped={isFlipped}
                isSourceExpanded={isSourceExpanded}
                imageSource={wheel.imageSource}
                onFlip={() => onFlip(wheel.id)}
                onToggleSource={toggleSource}
            />
        </Link>
    );
};

export default WheelCard;
