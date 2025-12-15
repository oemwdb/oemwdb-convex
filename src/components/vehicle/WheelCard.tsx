import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWheelRotation } from "@/hooks/useWheelRotation";
import { useWheelImageLoader } from "@/components/vehicle/hooks/useWheelImageLoader";
import WheelCardFront from "./WheelCardFront";
import WheelCardBack from "./WheelCardBack";

interface WheelCardProps {
  wheel: {
    id: string;
    name: string;
    diameter?: string;
    boltPattern?: string;
    specs?: string[];
    imageUrl?: string | null;
    imageSource?: string | null;
    // JSONB reference fields
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
  isFlipped: boolean;
  onFlip: (id: string) => void;
  linkToDetail?: boolean;
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

const WheelCard = ({ wheel, isFlipped, onFlip, linkToDetail = false, dataMapping, height = "h-[240px]" }: WheelCardProps) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSourceExpanded, setIsSourceExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);
  const isMobile = useIsMobile();
  const { handleMouseEnter: handleWheelMouseEnter, handleMouseLeave: handleWheelMouseLeave, getTransformStyle } = useWheelRotation();

  const rawImage = (wheel.imageUrl ?? (wheel as any).good_pic_url ?? (wheel as any).image ?? null) as string | null;
  const { imageUrl, handleImageError } = useWheelImageLoader(rawImage);

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

  // Auto-collapse source expansion when card flips
  useEffect(() => {
    if (isFlipped) {
      setIsSourceExpanded(false);
    }
  }, [isFlipped]);

  const handleFlip = () => {
    onFlip(wheel.id);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleSource = () => {
    setIsSourceExpanded(!isSourceExpanded);
  };

  return (
    <div className={cn("group relative w-full perspective-1000", height)}>
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d will-change-transform",
          isFlipped ? "rotate-y-180" : ""
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <WheelCardFront
          wheel={{
            ...wheel,
            brand_ref: wheel.brand_ref
          }}
          imageUrl={imageUrl}
          isFavorite={isFavorite}
          isFlipped={isFlipped}
          isTextOverflowing={isTextOverflowing}
          isHovering={isHovering}
          isSourceExpanded={isSourceExpanded}
          textRef={textRef}
          onImageError={handleImageError}
          onToggleFavorite={toggleFavorite}
          onFlip={handleFlip}
          onToggleSource={toggleSource}
          handleWheelMouseEnter={handleWheelMouseEnter}
          handleWheelMouseLeave={handleWheelMouseLeave}
          getTransformStyle={getTransformStyle}
          linkToDetail={linkToDetail}
        />

        <WheelCardBack
          wheel={wheel}
          isFavorite={isFavorite}
          isTextOverflowing={isTextOverflowing}
          isHovering={isHovering}
          backTextRef={backTextRef}
          onToggleFavorite={toggleFavorite}
          onFlip={handleFlip}
          linkToDetail={linkToDetail}
        />

        {/* BMW outline - inside flip container so it flips too */}
        {wheel.name.toLowerCase().includes('bmw') && (
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[hsl(var(--outline-light)/0.5)] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        )}
      </div>
    </div>
  );
};

export default WheelCard;
