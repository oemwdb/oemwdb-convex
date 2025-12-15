import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Package, Grid3x3 } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  brand_description?: string | null;
  brand_image_url?: string | null;
  subsidiaries?: string | null;
  wheel_count?: number;
  vehicle_count?: number;
}

interface BrandCollectionTemplateProps {
  brands?: Brand[];
  layout?: 'grid' | 'list';
  showStats?: boolean;
  columnsPerRow?: number;
}

export default function BrandCollectionTemplate({
  brands = [],
  layout = 'grid',
  showStats = true,
  columnsPerRow = 3
}: BrandCollectionTemplateProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5'
  }[columnsPerRow] || 'grid-cols-3';

  if (brands.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No brands to display</p>
      </div>
    );
  }

  return (
    <div className={layout === 'grid' ? `grid ${gridCols} gap-6` : 'flex flex-col gap-4'}>
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="relative preserve-3d cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: flippedCards.has(brand.id) ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
          onClick={() => toggleCard(brand.id)}
        >
          {/* Front of card */}
          <Card className="p-6 backface-hidden">
            <div className="flex flex-col items-center text-center space-y-4">
              {brand.brand_image_url ? (
                <img 
                  src={brand.brand_image_url} 
                  alt={brand.name}
                  className="w-24 h-24 object-contain rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-lg">{brand.name}</h3>
                {brand.subsidiaries && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {brand.subsidiaries}
                  </p>
                )}
              </div>

              {showStats && (
                <div className="flex gap-3">
                  {brand.wheel_count !== undefined && (
                    <Badge variant="secondary" className="gap-1">
                      <Grid3x3 className="w-3 h-3" />
                      {brand.wheel_count} wheels
                    </Badge>
                  )}
                  {brand.vehicle_count !== undefined && (
                    <Badge variant="secondary" className="gap-1">
                      <Package className="w-3 h-3" />
                      {brand.vehicle_count} vehicles
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Back of card */}
          <Card 
            className="absolute inset-0 p-6 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-lg mb-3">{brand.name}</h3>
              
              <div className="flex-1 space-y-3">
                {brand.brand_description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">About</p>
                    <p className="text-sm">{brand.brand_description}</p>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}