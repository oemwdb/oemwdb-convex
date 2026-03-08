import React from "react";
import WheelCard from "@/components/vehicle/WheelCard";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";

interface PremiumMarketListingsProps {
  flippedCards: Record<string, boolean>;
  toggleCardFlip: (id: string) => void;
}

const PremiumMarketListings = ({ flippedCards, toggleCardFlip }: PremiumMarketListingsProps) => {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["premium-listings"],
    queryFn: async () => {
      // TODO: use Convex query for market_listings when wired
      return [];
    },
  });

  const premiumListings = (listings || []).map(listing => ({
    id: listing.id,
    name: listing.title,
    diameter: "",
    boltPattern: "",
    specs: [
      listing.price ? `Price: $${listing.price.toLocaleString()}` : "",
      listing.condition ? `Condition: ${listing.condition}` : "",
      listing.location ? `Location: ${listing.location}` : "",
    ].filter(Boolean),
    imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : null
  }));

  return (
    <div className="space-y-4">
      <div className="w-full bg-card border border-border py-2 px-4 rounded-md">
        <p className="text-center text-sm font-medium tracking-wider text-muted-foreground">FEATURED MARKET ITEMS</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : premiumListings.length > 0 ? (
          premiumListings.map((listing) => (
            <WheelCard
              key={listing.id}
              wheel={listing}
              isFlipped={flippedCards[listing.id] || false}
              onFlip={toggleCardFlip}
              linkToDetail={false}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
            No featured listings available
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumMarketListings;