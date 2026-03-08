import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MapPin, Package, Filter, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MarketListing {
  id: string;
  user_id: string;
  listing_type: string;
  linked_item_id: number;
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  location: string | null;
  shipping_available: boolean;
  images: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  seller_profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    verification_status: string;
  } | null;
}

const MarketPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["market-listings", searchValue, selectedType, selectedCondition, sortBy],
    queryFn: async (): Promise<MarketListing[]> => {
      // TODO: use Convex query for market_listings when wired
      void searchValue; void selectedType; void selectedCondition; void sortBy;
      return [];
    },
  });

  const getConditionBadge = (condition: string | null) => {
    if (!condition) return null;

    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      new: "default",
      "like-new": "default",
      good: "secondary",
      fair: "outline",
      parts: "destructive",
    };

    return (
      <Badge variant={variants[condition] || "outline"} className="text-xs">
        {condition}
      </Badge>
    );
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DashboardLayout
      title="Marketplace"
      showSearch={true}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search listings..."
      showFilterButton={false}
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="wheel" className="text-xs">Wheels</TabsTrigger>
              <TabsTrigger value="vehicle" className="text-xs">Vehicles</TabsTrigger>
              <TabsTrigger value="brand" className="text-xs">Parts</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate("/market/new")}
              size="sm"
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Listing
            </Button>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-[120px] h-9 text-xs">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="parts">For Parts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px] h-9 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">{listings?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Active Listings</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">
              {listings?.filter((l) => l.listing_type === "wheel").length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Wheels</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">
              {listings?.filter((l) => l.listing_type === "vehicle").length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Vehicles</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">
              ${listings?.reduce((sum, l) => sum + (l.price || 0), 0).toLocaleString() || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <Skeleton className="h-48 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))
          ) : listings && listings.length > 0 ? (
            listings.map((listing) => (
              <Card
                key={listing.id}
                className="group overflow-hidden border-border/50 hover:border-border transition-all hover:shadow-sm cursor-pointer"
                onClick={() => navigate(`/market/${listing.id}`)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <Badge className="absolute top-2 left-2 text-xs capitalize">
                    {listing.listing_type}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm line-clamp-1 flex-1">
                      {listing.title}
                    </h3>
                    {getConditionBadge(listing.condition)}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-sm">{formatPrice(listing.price)}</span>
                  </div>

                  {/* Location & Shipping */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {listing.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    {listing.shipping_available && (
                      <Badge variant="outline" className="text-xs h-5">
                        Ships
                      </Badge>
                    )}
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={listing.seller_profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {listing.seller_profile?.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {listing.seller_profile?.display_name || listing.seller_profile?.username || "Unknown"}
                    </span>
                    {listing.seller_profile?.verification_status === "verified" && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center border-border/50">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">No listings found</p>
                <Button onClick={() => navigate("/market/new")} size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create First Listing
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPage;