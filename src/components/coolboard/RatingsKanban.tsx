import React, { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RatingsKanbanProps {
  userId: string;
}

interface RatingItem {
  id: string;
  itemType: 'brand' | 'vehicle' | 'wheel';
  itemId: number;
  rating: number;
  itemName?: string;
  itemImage?: string;
  createdAt: string;
}

const RatingsKanban: React.FC<RatingsKanbanProps> = ({ userId }) => {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedColumn, setExpandedColumn] = useState<number | null>(null);

  const columns = [
    { rating: 1, label: "Very Uncool", color: "bg-gradient-to-b from-red-500/10 to-red-600/5" },
    { rating: 2, label: "Uncool", color: "bg-gradient-to-b from-orange-500/10 to-orange-600/5" },
    { rating: 3, label: "Meh", color: "bg-gradient-to-b from-gray-500/10 to-gray-600/5" },
    { rating: 4, label: "Cool", color: "bg-gradient-to-b from-blue-500/10 to-blue-600/5" },
    { rating: 5, label: "Very Cool", color: "bg-gradient-to-b from-green-500/10 to-green-600/5" }
  ];

  useEffect(() => {
    fetchUserRatings();
  }, [userId]);

  const fetchUserRatings = async () => {
    setIsLoading(true);
    
    try {
      const { data: ratingsData, error } = await supabase
        .from('cool_ratings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Fetch item details for each rating
      const enrichedRatings = await Promise.all(
        (ratingsData || []).map(async (rating) => {
          let itemData;
          
          if (rating.item_type === 'brand') {
            const { data } = await supabase
              .from('oem_brands')
              .select('brand_title, brand_image_url')
              .eq('id', rating.item_id.toString())
              .single();
            itemData = { name: data?.brand_title, image: data?.brand_image_url };
          } else if (rating.item_type === 'vehicle') {
            const { data } = await supabase
              .from('oem_vehicles')
              .select('model_name, vehicle_image')
              .eq('id', rating.item_id.toString())
              .single();
            itemData = { name: data?.model_name, image: data?.vehicle_image };
          } else {
            const { data } = await supabase
              .from('oem_wheels')
              .select('wheel_title, good_pic_url')
              .eq('id', rating.item_id.toString())
              .single();
            itemData = { name: data?.wheel_title, image: data?.good_pic_url };
          }

          return {
            id: rating.id,
            itemType: rating.item_type as 'brand' | 'vehicle' | 'wheel',
            itemId: rating.item_id,
            rating: rating.rating,
            itemName: itemData?.name,
            itemImage: itemData?.image,
            createdAt: rating.created_at
          };
        })
      );

      setRatings(enrichedRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingsByColumn = (rating: number) => {
    return ratings.filter(r => r.rating === rating);
  };

  const handleColumnClick = (rating: number) => {
    setExpandedColumn(expandedColumn === rating ? null : rating);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 w-full">
        {columns.map((col) => (
          <div key={col.rating} className="flex-1 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 w-full">
      {columns.map((column) => {
        const isExpanded = expandedColumn === column.rating;
        const isCollapsed = expandedColumn !== null && !isExpanded;
        
        return (
          <div 
            key={column.rating} 
            onClick={() => handleColumnClick(column.rating)}
            className={cn(
              "rounded-lg p-3 transition-all duration-300 cursor-pointer hover:opacity-90",
              column.color,
              isExpanded ? "flex-1" : isCollapsed ? "w-0 p-0 opacity-0 overflow-hidden" : "flex-1"
            )}
          >
            {!isCollapsed && (
              <>
                <h3 className="font-semibold text-sm mb-3 text-center">
                  {column.label}
                </h3>
                <ScrollArea className={cn(
                  "transition-all duration-300",
                  isExpanded ? "h-[600px]" : "h-[400px]"
                )}>
                  <div className="space-y-2">
                    {getRatingsByColumn(column.rating).map((item) => (
                      <Card 
                        key={item.id} 
                        className="p-2 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        {item.itemImage && (
                          <div className="aspect-square mb-2 overflow-hidden rounded">
                            <img 
                              src={item.itemImage} 
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-xs font-medium truncate">
                          {item.itemName || 'Unknown'}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.itemType}
                        </Badge>
                      </Card>
                    ))}
                    {getRatingsByColumn(column.rating).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No ratings yet
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingsKanban;