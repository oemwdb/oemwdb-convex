
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useImageLoader } from "./hooks/useImageLoader";
import { useBrandCardState } from "./hooks/useBrandCardState";
import BrandCardFront from "./BrandCardFront";
import BrandCardBack from "./BrandCardBack";
import BrandCardButtons from "./BrandCardButtons";

interface BrandCardProps {
  brand: {
    name: string;
    wheelCount: number;
    vehicleCount?: number;
    description?: string | null;
    imagelink?: string | null;
  };
  isFlipped: boolean;
  onFlip: (name: string) => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
  }>;
  height?: string;
}

const BrandCard = ({ brand, isFlipped, onFlip, dataMapping, height = "h-[240px]" }: BrandCardProps) => {
  const { imageUrl, handleImageError } = useImageLoader(brand.imagelink);
  const {
    isFavorite,
    isTextOverflowing,
    isHovering,
    textRef,
    backTextRef,
    setIsHovering,
    toggleFavorite
  } = useBrandCardState(brand.name);

  const [isSourceExpanded, setIsSourceExpanded] = useState(false);
  
  useEffect(() => {
    if (isFlipped) {
      setIsSourceExpanded(false);
    }
  }, [isFlipped]);
  
  const toggleSource = () => {
    setIsSourceExpanded(!isSourceExpanded);
  };

  const handleFlip = () => {
    onFlip(brand.name);
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
      <BrandCardFront
        brandName={brand.name}
        imageUrl={imageUrl}
        isFavorite={isFavorite}
        isTextOverflowing={isTextOverflowing}
        isHovering={isHovering}
        textRef={textRef}
        onImageError={handleImageError}
        onFlip={handleFlip}
        onToggleFavorite={toggleFavorite}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
      <BrandCardBack
        brandName={brand.name}
        description={brand.description}
        wheelCount={brand.wheelCount}
        vehicleCount={brand.vehicleCount ?? 0}
        isFavorite={isFavorite}
        isTextOverflowing={isTextOverflowing}
        isHovering={isHovering}
        backTextRef={backTextRef}
        onFlip={handleFlip}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
  
  return (
    <Link 
      to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`} 
      className={cn("group relative block w-full perspective-1000", height)}
    >
      {cardContent}
      <BrandCardButtons
        isFlipped={isFlipped}
        isSourceExpanded={isSourceExpanded}
        imageSource={brand.imagelink}
        onFlip={handleFlip}
        onToggleSource={toggleSource}
      />
      {brand.name.toLowerCase() === 'audi' && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[hsl(var(--warning)/0.5)] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      )}
      {brand.name.toLowerCase() === 'bmw' && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[hsl(var(--outline-light)/0.5)] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      )}
    </Link>
  );
};

export default BrandCard;
