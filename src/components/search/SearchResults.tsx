import React from 'react';
import { Package, Car, CircleEllipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HighlightableBrandCard from '@/components/cards/HighlightableBrandCard';
import HighlightableVehicleCard from '@/components/cards/HighlightableVehicleCard';
import HighlightableWheelCard from '@/components/cards/HighlightableWheelCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  searchQuery: string;
  collection?: 'all' | 'brands' | 'vehicles' | 'wheels';
  brands?: any[];
  vehicles?: any[];
  wheels?: any[];
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  collection = 'all',
  brands = [],
  vehicles = [],
  wheels = [],
  isLoading = false,
}) => {
  const hasResults = brands.length > 0 || vehicles.length > 0 || wheels.length > 0;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Search Results for: "{searchQuery}"
        </h1>
        <p className="text-muted-foreground">
          {collection === 'all' 
            ? 'Searching across all collections' 
            : `Searching in ${collection}`}
        </p>
      </div>

      {!hasResults ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-muted-foreground text-center">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        </div>
      ) : collection === 'all' ? (
        <Tabs defaultValue={brands.length > 0 ? 'brands' : vehicles.length > 0 ? 'vehicles' : 'wheels'} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Brands ({brands.length})
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicles ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="wheels" className="flex items-center gap-2">
              <CircleEllipsis className="h-4 w-4" />
              Wheels ({wheels.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="mt-6">
            <ResultsGrid items={brands} type="brand" />
          </TabsContent>

          <TabsContent value="vehicles" className="mt-6">
            <ResultsGrid items={vehicles} type="vehicle" />
          </TabsContent>

          <TabsContent value="wheels" className="mt-6">
            <ResultsGrid items={wheels} type="wheel" />
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          {collection === 'brands' && <ResultsGrid items={brands} type="brand" />}
          {collection === 'vehicles' && <ResultsGrid items={vehicles} type="vehicle" />}
          {collection === 'wheels' && <ResultsGrid items={wheels} type="wheel" />}
        </div>
      )}
    </div>
  );
};

interface ResultsGridProps {
  items: any[];
  type: 'brand' | 'vehicle' | 'wheel';
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ items, type }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {type}s found matching your search
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      type === 'brand' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      type === 'vehicle' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      type === 'wheel' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    )}>
      {items.map((item) => {
        if (type === 'brand') {
          return (
            <HighlightableBrandCard
              key={item.id}
              brand={{
                name: item.name,
                description: item.brand_description,
                wheelCount: item.wheel_count,
                imagelink: item.brand_image_url,
              }}
              isFlipped={false}
              onFlip={() => {}}
              hoveredMapping={null}
              onElementClick={() => {}}
              onElementHover={() => {}}
            />
          );
        }
        
        if (type === 'vehicle') {
          return (
            <HighlightableVehicleCard
              key={item.id}
              vehicle={{
                name: item.vehicle_title || item.model_name,
                brand: item.brand_refs?.[0] || '',
                wheels: item.wheel_refs?.length || 0,
                image: item.hero_image_url,
              }}
              isFlipped={false}
              onFlip={() => {}}
              hoveredMapping={null}
              onElementClick={() => {}}
              onElementHover={() => {}}
            />
          );
        }
        
        if (type === 'wheel') {
          return (
            <HighlightableWheelCard
              key={item.id}
              wheel={{
                id: item.id,
                name: item.wheel_name,
                diameter: item.diameter_refs?.[0] || '',
                boltPattern: item.bolt_pattern_refs?.[0] || '',
                specs: [
                  item.width_refs?.[0] && `Width: ${item.width_refs[0]}`,
                  item.wheel_offset && `Offset: ${item.wheel_offset}`,
                ].filter(Boolean),
                imageUrl: item.good_pic_url,
              }}
              isFlipped={false}
              onFlip={() => {}}
              hoveredMapping={null}
              onElementClick={() => {}}
              onElementHover={() => {}}
            />
          );
        }
        
        return null;
      })}
    </div>
  );
};