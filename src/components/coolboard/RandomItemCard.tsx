import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";

import BrandCard from "@/components/brand/BrandCard";
import VehicleCard from "@/components/vehicle/VehicleCard";
import WheelCard from "@/components/vehicle/WheelCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RandomItemCardProps {
  onItemChange?: (type: string, id: number) => void;
  filterType?: 'brand' | 'vehicle' | 'wheel';
  width?: string;
}

export interface RandomItemCardRef {
  handleNext: () => void;
  handlePrevious: () => void;
}

const RandomItemCard = forwardRef<RandomItemCardRef, RandomItemCardProps>(
  ({ onItemChange, filterType }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [itemType, setItemType] = useState<'brand' | 'vehicle' | 'wheel'>('brand');
    const [isLoading, setIsLoading] = useState(true);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);

    // Fetch all items on mount
    useEffect(() => {
      const fetchAllItems = async () => {
        console.log('[CoolBoard] Fetching items for type:', filterType || 'all');
        setIsLoading(true);

        try {
          // TODO: use Convex queries for brands/vehicles/wheels when wired
          void filterType;
          const items: unknown[] = [];
          setAllItems(items);

          // Set the first item
          if (items.length > 0) {
            const firstItem = items[0];
            setCurrentItem(firstItem);
            setItemType(firstItem.type);
            onItemChange?.(firstItem.type, firstItem.id);
          }
        } catch (error) {
          console.error('[CoolBoard] Error fetching items:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllItems();
    }, [filterType]);

    const handleNext = () => {
      if (allItems.length === 0) return;

      const nextIndex = (currentIndex + 1) % allItems.length;
      const nextItem = allItems[nextIndex];

      console.log('[CoolBoard] Moving to next item:', nextIndex, nextItem);

      setCurrentIndex(nextIndex);
      setCurrentItem(nextItem);
      setItemType(nextItem.type);
      setIsFlipped(false); // Reset flip state for new card
      onItemChange?.(nextItem.type, nextItem.id);
    };

    const handlePrevious = () => {
      if (allItems.length === 0) return;

      const previousIndex = currentIndex === 0 ? allItems.length - 1 : currentIndex - 1;
      const previousItem = allItems[previousIndex];

      console.log('[CoolBoard] Moving to previous item:', previousIndex, previousItem);

      setCurrentIndex(previousIndex);
      setCurrentItem(previousItem);
      setItemType(previousItem.type);
      setIsFlipped(false); // Reset flip state for new card
      onItemChange?.(previousItem.type, previousItem.id);
    };

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      handleNext,
      handlePrevious
    }));

    // Determine the height based on viewport width - MUST be before any returns
    const getCardHeight = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1536) return "h-[600px]"; // 2xl
        if (window.innerWidth >= 1280) return "h-[500px]"; // xl
        return "h-[400px]"; // default
      }
      return "h-[400px]";
    };

    const [cardHeight, setCardHeight] = useState(getCardHeight());

    useEffect(() => {
      const handleResize = () => {
        setCardHeight(getCardHeight());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[400px] xl:h-[500px] 2xl:h-[600px] w-full rounded-lg" />
        </div>
      );
    }

    if (!currentItem || allItems.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="text-muted-foreground">No items available</div>
        </div>
      );
    }

    console.log('[CoolBoard] Rendering item:', {
      itemType,
      currentItem,
      isFlipped,
      hasImage: currentItem?.good_pic_url || currentItem?.hero_image_url || currentItem?.brand_image_url
    });

    return (
      <div className={`w-full ${cardHeight.replace('h-', 'h-')}`}>
        {itemType === 'brand' && currentItem && (
          <BrandCard
            brand={{
              name: currentItem.brand_title || 'Unknown Brand',
              wheelCount: currentItem.wheel_count || 0,
              vehicleCount: currentItem.vehicle_count || 0,
              description: currentItem.brand_description,
              imagelink: currentItem.brand_image_url
            }}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            height={cardHeight}
          />
        )}

        {itemType === 'vehicle' && currentItem && (
          <VehicleCard
            vehicle={{
              name: currentItem.model_name || 'Unknown Vehicle',
              brand: currentItem.brand_refs?.[0]?.value || currentItem.brand_name || 'Unknown',
              wheels: 0,
              image: currentItem.hero_image_url
            }}
            isFlipped={isFlipped}
            onFlip={() => handleFlip()}
            height={cardHeight}
          />
        )}

        {itemType === 'wheel' && currentItem && (
          <WheelCard
            wheel={{
              id: currentItem.id.toString(),
              name: currentItem.wheel_name || 'Unknown Wheel',
              diameter: currentItem.diameter_refs?.[0] || currentItem.diameter || 'N/A',
              boltPattern: currentItem.bolt_pattern_refs?.[0] || currentItem.bolt_pattern || 'N/A',
              specs: [
                `Width: ${currentItem.width_refs?.[0] || currentItem.width || 'N/A'}`,
                `Offset: ${currentItem.wheel_offset || 'N/A'}`
              ],
              imageUrl: currentItem.good_pic_url
            }}
            isFlipped={isFlipped}
            onFlip={() => handleFlip()}
            height={cardHeight}
          />
        )}
      </div>
    );
  }
);

RandomItemCard.displayName = 'RandomItemCard';

export default RandomItemCard;