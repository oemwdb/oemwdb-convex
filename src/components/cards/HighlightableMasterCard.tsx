import React from "react";
import MasterCard from "./MasterCard";

interface HighlightableMasterCardProps {
  data: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string | null;
    specs?: string[];
    metadata?: string;
  };
  isFlipped: boolean;
  onFlip: (id: string) => void;
  hoveredMapping: string | null;
  onElementClick: (element: string) => void;
  onElementHover: (element: string | null) => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
    label?: string;
  }>;
}

const HighlightableMasterCard = ({ 
  data, 
  isFlipped, 
  onFlip, 
  hoveredMapping, 
  onElementClick,
  onElementHover,
  dataMapping 
}: HighlightableMasterCardProps) => {
  return (
    <div className="relative">
      <MasterCard data={data} isFlipped={isFlipped} onFlip={onFlip} dataMapping={dataMapping} />
      
      {/* Overlay highlights */}
      {/* Check for any image-related field names */}
      {(hoveredMapping === "imageUrl" || hoveredMapping === "image" || 
        (hoveredMapping && hoveredMapping.toLowerCase().includes('image'))) && !isFlipped && (
        <div className="absolute top-0 left-0 right-0 h-[188px] bg-yellow-300/40 pointer-events-none rounded-t-lg" />
      )}
      
      {(hoveredMapping === "title" || (hoveredMapping && hoveredMapping.toLowerCase().includes('title'))) && !isFlipped && (
        <div className="absolute bottom-0 left-0 w-[70%] h-[52px] bg-yellow-300/40 pointer-events-none rounded-bl-lg" />
      )}
      
      {hoveredMapping === "subtitle" && !isFlipped && data.subtitle && (
        <div className="absolute top-[145px] left-1/2 transform -translate-x-1/2 bg-yellow-300/40 pointer-events-none px-3 py-1 rounded" />
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
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "imageUrl" ? 'none' : 'auto' }}
            onClick={() => onElementClick("imageUrl")}
            onMouseEnter={() => onElementHover("imageUrl")}
            onMouseLeave={() => onElementHover(null)}
          />
          
          <div 
            className="absolute bottom-0 left-0 w-[70%] h-[52px] cursor-pointer"
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "title" ? 'none' : 'auto' }}
            onClick={() => onElementClick("title")}
            onMouseEnter={() => onElementHover("title")}
            onMouseLeave={() => onElementHover(null)}
          />
          
          {/* Subtitle overlay - if it exists */}
          {data.subtitle && (
            <div 
              className="absolute top-[145px] left-1/2 transform -translate-x-1/2 px-3 py-1 cursor-pointer"
              style={{ pointerEvents: hoveredMapping && hoveredMapping !== "subtitle" ? 'none' : 'auto' }}
              onClick={() => onElementClick("subtitle")}
              onMouseEnter={() => onElementHover("subtitle")}
              onMouseLeave={() => onElementHover(null)}
            />
          )}
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

export default HighlightableMasterCard;