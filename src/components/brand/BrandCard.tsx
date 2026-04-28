
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useImageLoader } from "./hooks/useImageLoader";
import { useBrandCardState } from "./hooks/useBrandCardState";
import BrandCardFront from "./BrandCardFront";
import BrandCardBack from "./BrandCardBack";
import BrandCardButtons from "./BrandCardButtons";
import { shouldCarryCollectionSearch } from "@/lib/collectionSearchPersistence";

interface BrandCardProps {
  brand: {
    name: string;
    wheelCount: number;
    vehicleCount?: number;
    description?: string | null;
    imagelink?: string | null;
    good_pic_url?: string | null;
    bad_pic_url?: string | null;
  };
  isFlipped: boolean;
  onFlip: (name: string) => void;
  showAdminImageFields?: boolean;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
  }>;
  height?: string;
}

const BrandCard = ({
  brand,
  isFlipped,
  onFlip,
  showAdminImageFields = false,
  dataMapping,
  height = "h-[240px]",
}: BrandCardProps) => {
  const location = useLocation();
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
  const preservedSearch = shouldCarryCollectionSearch(location.pathname, ["/brands"])
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
      to={{
        pathname: `/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`,
        search: preservedSearch,
      }}
      className={cn("group relative block w-full perspective-1000", height)}
    >
      {cardContent}
      <BrandCardButtons
        isFlipped={isFlipped}
        isSourceExpanded={isSourceExpanded}
        imageSource={brand.imagelink}
        badPicSource={brand.bad_pic_url}
        showAdminImageFields={showAdminImageFields}
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
