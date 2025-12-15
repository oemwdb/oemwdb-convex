import React from "react";
import BrandCard from "@/components/brand/BrandCard";
import { cn } from "@/lib/utils";

interface HighlightableBrandCardProps {
  brand: {
    name: string;
    wheelCount: number;
    description?: string | null;
    imagelink?: string | null;
  };
  isFlipped: boolean;
  onFlip: (name: string) => void;
  hoveredMapping: string | null;
  onElementClick: (element: string) => void;
  onElementHover: (element: string | null) => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
    label: string;
  }>;
}

const HighlightableBrandCard = ({ 
  brand, 
  isFlipped, 
  onFlip, 
  hoveredMapping, 
  onElementClick,
  onElementHover,
  dataMapping 
}: HighlightableBrandCardProps) => {
  return (
    <div className="relative">
      <BrandCard brand={brand} isFlipped={isFlipped} onFlip={onFlip} dataMapping={dataMapping} />
      
      {/* Overlay highlights */}
      {/* Check for any image-related field names */}
      {(hoveredMapping === "imagelink" || hoveredMapping === "imageUrl" || hoveredMapping === "image" ||
        (hoveredMapping && hoveredMapping.toLowerCase().includes('image'))) && !isFlipped && (
        <div 
          className="absolute top-0 left-0 right-0 h-[188px] bg-yellow-300/40 pointer-events-none rounded-t-lg"
        />
      )}
      
      {(hoveredMapping === "name" || (hoveredMapping && hoveredMapping.toLowerCase().includes('name') && !hoveredMapping.toLowerCase().includes('brand'))) && !isFlipped && (
        <div className="absolute bottom-0 left-0 w-[70%] h-[52px] bg-yellow-300/40 pointer-events-none rounded-bl-lg" />
      )}
      
      {/* Dynamic back card highlights */}
      {isFlipped && dataMapping && dataMapping
        .filter(item => item.location === 'back')
        .sort((a, b) => a.order - b.order)
        .map((element, index) => (
          hoveredMapping === element.field && (
            <div 
              key={element.field}
              className="absolute left-4 right-4 h-[32px] bg-yellow-300/40 pointer-events-none rounded"
              style={{ top: `${44 + (index * 32)}px` }}
            />
          )
        ))}
      
      {/* Clickable overlays for front card */}
      {!isFlipped && (
        <>
          <div 
            className="absolute top-0 left-0 right-12 h-[188px] cursor-pointer"
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "imagelink" ? 'none' : 'auto' }}
            onClick={() => onElementClick("imagelink")}
            onMouseEnter={() => onElementHover("imagelink")}
            onMouseLeave={() => onElementHover(null)}
          />
          
          <div 
            className="absolute bottom-0 left-0 w-[70%] h-[52px] cursor-pointer"
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "name" ? 'none' : 'auto' }}
            onClick={() => onElementClick("name")}
            onMouseEnter={() => onElementHover("name")}
            onMouseLeave={() => onElementHover(null)}
          />
        </>
      )}
      
      {/* Clickable overlays for back card */}
      {isFlipped && dataMapping && (
        <>
          {dataMapping
            .filter(item => item.location === 'back')
            .sort((a, b) => a.order - b.order)
            .map((element, index) => (
              <div 
                key={element.field}
                className="absolute left-4 right-4 h-[32px] cursor-pointer"
                style={{ 
                  top: `${44 + (index * 32)}px`,
            pointerEvents: hoveredMapping && hoveredMapping !== element.field ? 'none' : 'auto'
                }}
                onClick={() => onElementClick(element.field)}
                onMouseEnter={() => onElementHover(element.field)}
                onMouseLeave={() => onElementHover(null)}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default HighlightableBrandCard;