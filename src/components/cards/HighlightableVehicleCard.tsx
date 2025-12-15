import React from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";

interface HighlightableVehicleCardProps {
  vehicle: {
    name: string;
    brand: string;
    wheels: number;
    image?: string;
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

const HighlightableVehicleCard = ({ 
  vehicle, 
  isFlipped, 
  onFlip, 
  hoveredMapping, 
  onElementClick,
  onElementHover,
  dataMapping 
}: HighlightableVehicleCardProps) => {
  return (
    <div className="relative">
      <VehicleCard vehicle={vehicle} isFlipped={isFlipped} onFlip={onFlip} dataMapping={dataMapping} />
      
      {/* Overlay highlights */}
      {/* Check for any image-related field names */}
      {(hoveredMapping === "image" || hoveredMapping === "imageUrl" || hoveredMapping === "heroImageUrl" || 
        (hoveredMapping && hoveredMapping.toLowerCase().includes('image'))) && !isFlipped && (
        <div className="absolute top-0 left-0 right-0 h-[188px] bg-yellow-300/40 pointer-events-none rounded-t-lg" />
      )}
      
      {(hoveredMapping === "name" || hoveredMapping === "modelName" || 
        (hoveredMapping && hoveredMapping.toLowerCase().includes('name') && !hoveredMapping.toLowerCase().includes('brand'))) && !isFlipped && (
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
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "image" ? 'none' : 'auto' }}
            onClick={() => onElementClick("image")}
            onMouseEnter={() => onElementHover("image")}
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

export default HighlightableVehicleCard;