import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import WheelCardButtons from "@/components/wheel/WheelCardButtons";
import { useWheelRotation } from "@/hooks/useWheelRotation";
import { useDevMode } from "@/contexts/DevModeContext";
import { useStorageActions } from "@/hooks/useStorage";

interface WheelCardProps {
    wheel: {
        id: string;
        name: string;
        imageUrl?: string | null;
        good_pic_url?: string | null;
        bad_pic_url?: string | null;
        imageSource?: string | null;
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
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isSourceExpanded, setIsSourceExpanded] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const backTextRef = useRef<HTMLParagraphElement>(null);
    const [imageError, setImageError] = useState(false);

    // Wheel rotation on hover (unique to wheel cards)
    const { handleMouseEnter: handleWheelMouseEnter, handleMouseLeave: handleWheelMouseLeave, getTransformStyle } = useWheelRotation();

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

    // Helper to extract values from JSONB array
    const extractValues = (jsonb: any): string[] => {
        if (!jsonb) return [];
        if (typeof jsonb === 'string') {
            try {
                jsonb = JSON.parse(jsonb);
            } catch {
                return [jsonb]; // Return as-is if not parseable
            }
        }
        if (Array.isArray(jsonb)) {
            return jsonb.map(item => {
                if (typeof item === 'string') return item;
                // Handle JSONB objects with various formats
                if (typeof item === 'object' && item !== null) {
                    if (item.value !== undefined) return String(item.value);
                    if (item.raw !== undefined) return String(item.raw);
                    if (item.title !== undefined) return String(item.title);
                    if (item.name !== undefined) return String(item.name);
                    // For vehicle_ref that has id and title
                    if (item.id && item.title) return String(item.title);
                }
                return null;
            }).filter(Boolean) as string[];
        }
        return [];
    };

    // Extract brand name from brand_ref
    const extractBrandName = (): string | null => {
        if (!wheel.brand_ref) return null;
        const values = extractValues(wheel.brand_ref);
        return values.length > 0 ? values[0] : null;
    };

    const brandName = extractBrandName();

    // Helper to remove brand name from wheel name
    const getDisplayName = () => {
        if (!brandName || !wheel.name) return wheel.name;

        // Remove brand name from the beginning of the wheel name
        const brandRegex = new RegExp(`^${brandName}\\s*[-–—]?\\s*`, 'i');
        return wheel.name.replace(brandRegex, '').trim() || wheel.name;
    };

    const displayName = getDisplayName();

    const { isDevMode } = useDevMode();
    const { getPublicUrl } = useStorageActions();

    const toggleSource = () => {
        setIsSourceExpanded(!isSourceExpanded);
    };

    // Calculate effective image URL based on dev mode
    // Priority: 1. Good Pic | 2. Bad Pic (fallback) | 3. imageUrl (legacy)
    let effectiveImageUrl: string | null = null;
    let isBadPic = false;

    if (wheel.good_pic_url && wheel.good_pic_url.length > 5 && wheel.good_pic_url.startsWith('http')) {
        effectiveImageUrl = wheel.good_pic_url;
    } else if (isDevMode && wheel.bad_pic_url && wheel.bad_pic_url.length > 1) {
        // STRICTLY only show bad pic if we are in Dev Mode
        effectiveImageUrl = wheel.bad_pic_url;
        isBadPic = true;
    } else if (wheel.imageUrl && wheel.imageUrl.length > 5) {
        effectiveImageUrl = wheel.imageUrl;
    }

    // If we have an image URL but it's not absolute (http/https), resolve it to storage
    if (effectiveImageUrl && !effectiveImageUrl.startsWith('http') && !effectiveImageUrl.startsWith('/')) {
        // Use BADPICS bucket for bad_pic_url values, otherwise use oemwdb images
        const bucketName = isBadPic ? 'BADPICS' : 'oemwdb images';
        effectiveImageUrl = getPublicUrl(bucketName, effectiveImageUrl);
    }

    const imageUrl = effectiveImageUrl && effectiveImageUrl.length > 5 ? effectiveImageUrl : null;

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
                                        src={imageUrl}
                                        alt={wheel.name}
                                        className="max-w-[105%] max-h-[105%] object-contain"
                                        style={getTransformStyle()}
                                        onError={() => setImageError(true)}
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
                                        { label: 'Vehicle', values: wheel.vehicle_ref ? extractValues(wheel.vehicle_ref).map(v => v.replace(/^.*?\s-\s/, '')) : [] },
                                        { label: 'Diameter', values: extractValues(wheel.diameter_ref) },
                                        { label: 'Width', values: extractValues(wheel.width_ref) },
                                        { label: 'Bolt Pattern', values: extractValues(wheel.bolt_pattern_ref) },
                                        { label: 'Center Bore', values: extractValues(wheel.center_bore_ref) },
                                        { label: 'Color', values: extractValues(wheel.color_ref) },
                                        { label: 'Tire Size', values: extractValues(wheel.tire_size_ref) },
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
            to={`/wheel/${wheel.id}`}
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
