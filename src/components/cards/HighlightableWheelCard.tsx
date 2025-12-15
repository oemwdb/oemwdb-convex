import React from "react";
import WheelCard from "@/components/vehicle/WheelCard";

interface HighlightableWheelCardProps {
  wheel: {
    id: string;
    name: string;
    diameter: string;
    boltPattern: string;
    specs: string[];
    imageUrl?: string | null;
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
    label: string;
  }>;
}

const HighlightableWheelCard = ({
  wheel,
  isFlipped,
  onFlip,
  hoveredMapping,
  onElementClick,
  onElementHover,
  dataMapping
}: HighlightableWheelCardProps) => {
  // Find front elements in dataMapping
  const frontElements = dataMapping?.filter(item => item.location === 'front') || [];
  const backElements = dataMapping?.filter(item => item.location === 'back')
    .sort((a, b) => a.order - b.order) || [];

  // Check if hoveredMapping matches any image or name related field
  const isImageHovered = hoveredMapping === "imageUrl" || hoveredMapping === "image" ||
    (hoveredMapping && hoveredMapping.toLowerCase().includes('image')) ||
    (hoveredMapping && hoveredMapping.toLowerCase().includes('pic'));
  const isNameHovered = hoveredMapping === "name" ||
    (hoveredMapping && hoveredMapping.toLowerCase().includes('name') && !hoveredMapping.toLowerCase().includes('brand'));

  // Find the index of the hovered back element
  const hoveredBackIndex = backElements.findIndex(item => item.field === hoveredMapping);

  return (
    <div className="relative">
      <WheelCard wheel={wheel} isFlipped={isFlipped} onFlip={onFlip} linkToDetail={false} dataMapping={dataMapping} />

      {/* Front card overlay highlights */}
      {isImageHovered && !isFlipped && (
        <div className="absolute top-0 left-0 right-0 h-[188px] bg-yellow-300/40 pointer-events-none rounded-t-lg" />
      )}

      {isNameHovered && !isFlipped && (
        <div className="absolute bottom-0 left-0 w-[70%] h-[52px] bg-yellow-300/40 pointer-events-none rounded-bl-lg" />
      )}

      {/* Back card overlay highlights - dynamically positioned */}
      {hoveredBackIndex !== -1 && isFlipped && (
        <div
          className="absolute left-4 right-4 h-[32px] bg-yellow-300/40 pointer-events-none rounded"
          style={{
            top: `${44 + (hoveredBackIndex * 32)}px` // 44px header + 32px per field
          }}
        />
      )}

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
            style={{ pointerEvents: hoveredMapping && hoveredMapping !== "name" ? 'none' : 'auto' }}
            onClick={() => onElementClick("name")}
            onMouseEnter={() => onElementHover("name")}
            onMouseLeave={() => onElementHover(null)}
          />
        </>
      )}

      {/* Clickable overlays for back card */}
      {isFlipped && backElements.map((element, index) => (
        <div
          key={element.field}
          className="absolute left-4 right-12 h-[32px] cursor-pointer"
          style={{
            top: `${44 + (index * 32)}px`,
            pointerEvents: hoveredMapping && hoveredMapping !== element.field ? 'none' : 'auto'
          }}
          onClick={() => onElementClick(element.field)}
          onMouseEnter={() => onElementHover(element.field)}
          onMouseLeave={() => onElementHover(null)}
        />
      ))}
    </div>
  );
};

export default HighlightableWheelCard;