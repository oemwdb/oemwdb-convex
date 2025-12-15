import React, { useState, useEffect } from 'react';
import { ChevronDown, Home, Car, CircleEllipsis, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type CollectionType = 'all' | 'brands' | 'vehicles' | 'wheels';

interface Collection {
  value: CollectionType;
  label: string;
  icon: React.ElementType;
}

const collections: Collection[] = [
  { value: 'all', label: 'All Collections', icon: Home },
  { value: 'brands', label: 'Brands', icon: Package },
  { value: 'vehicles', label: 'Vehicles', icon: Car },
  { value: 'wheels', label: 'Wheels', icon: CircleEllipsis },
];

interface CollectionCarouselSelectorProps {
  selectedCollection: CollectionType;
  onCollectionChange: (collection: CollectionType) => void;
  isExpanded: boolean;
  className?: string;
}

export const CollectionCarouselSelector: React.FC<CollectionCarouselSelectorProps> = ({
  selectedCollection,
  onCollectionChange,
  isExpanded,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const currentCollection = collections.find(c => c.value === selectedCollection) || collections[0];
  const Icon = currentCollection.icon;

  const handleCollectionSelect = (collection: CollectionType) => {
    onCollectionChange(collection);
    setIsOpen(false);
  };

  useEffect(() => {
    // Auto-scroll to selected item when opened
    if (isOpen && carouselApi) {
      const index = collections.findIndex(c => c.value === selectedCollection);
      if (index !== -1) {
        carouselApi.scrollTo(index);
      }
    }
  }, [isOpen, selectedCollection, carouselApi]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full",
            "bg-muted/50 hover:bg-muted transition-colors",
            "text-sm font-medium cursor-pointer",
            "border border-border/50",
            "animate-fade-in",
            isExpanded && "min-w-[140px]",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground/80">{currentCollection.label}</span>
          <ChevronDown className={cn(
            "h-3 w-3 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[180px] p-2"
        align="start"
        sideOffset={8}
      >
        <Carousel
          orientation="vertical"
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="h-[200px] -mt-1">
            {collections.map((collection) => {
              const CollectionIcon = collection.icon;
              const isSelected = collection.value === selectedCollection;
              
              return (
                <CarouselItem key={collection.value} className="basis-1/4 pt-1">
                  <button
                    onClick={() => handleCollectionSelect(collection.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                      "transition-all duration-200",
                      "hover:bg-accent hover:scale-[1.02]",
                      isSelected && "bg-primary/10 border border-primary/20",
                      !isSelected && "hover:bg-muted"
                    )}
                  >
                    <CollectionIcon className={cn(
                      "h-4 w-4",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground/80"
                    )}>
                      {collection.label}
                    </span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center gap-1 mt-2 pt-2 border-t border-border/50">
            <CarouselPrevious className="h-6 w-6 relative static translate-x-0 translate-y-0" />
            <CarouselNext className="h-6 w-6 relative static translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </PopoverContent>
    </Popover>
  );
};