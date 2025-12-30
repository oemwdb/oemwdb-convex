
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PopularWheelsTab from "@/components/home/PopularWheelsTab";
import SavedWheelsTab from "@/components/home/SavedWheelsTab";
import PremiumMarketListings from "@/components/home/PremiumMarketListings";
import HomeDashboard from "@/components/home/HomeDashboard";
import { SearchResults } from "@/components/search/SearchResults";
import { useSupabaseWheels } from "@/hooks/useSupabaseWheels";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { Loader2 } from "lucide-react";

const Index = () => {
  // Track the flipped state of cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Check for search parameters
  const { searchQuery, collection, brands, vehicles, wheels: searchWheels, isLoading: searchLoading, hasSearch } = useGlobalSearch();

  // Fetch wheels for home page display
  const { data: wheels, isLoading, error } = useSupabaseWheels();

  // Toggle the flipped state of a card
  const toggleCardFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format wheels for display
  const formatWheelForCard = (wheel: any) => {
    const specs = [];
    if (wheel.diameter) specs.push(`Diameter: ${wheel.diameter}`);
    if (wheel.width) specs.push(`Width: ${wheel.width}`);
    if (wheel.bolt_pattern) specs.push(`Bolt Pattern: ${wheel.bolt_pattern}`);
    if (wheel.center_bore) specs.push(`Center Bore: ${wheel.center_bore}`);
    if (wheel.wheel_offset) specs.push(`Offset: ${wheel.wheel_offset}`);
    if (wheel.color) specs.push(`Color: ${wheel.color}`);

    return {
      id: wheel.id.toString(),
      name: wheel.wheel_name,
      diameter: wheel.diameter || "N/A",
      boltPattern: wheel.bolt_pattern || "N/A",
      specs: specs,
      imageUrl: wheel.good_pic_url || wheel.bad_pic_url
    };
  };

  // Get popular and saved wheels (just taking different slices for now)
  const popularWheels = (wheels || []).slice(0, 6).map(formatWheelForCard);
  const savedWheels = (wheels || []).slice(6, 12).map(formatWheelForCard);

  // Show search results if search params are present
  if (hasSearch) {
    return (
      <DashboardLayout title="Search Results" disableContentPadding={true}>
        <div className="h-full p-2 overflow-y-auto">
          <SearchResults
            searchQuery={searchQuery}
            collection={collection}
            brands={brands}
            vehicles={vehicles}
            wheels={searchWheels}
            isLoading={searchLoading}
          />
        </div>
      </DashboardLayout>
    );
  }

  // Default home page view
  return (
    <DashboardLayout title="OEM Wheel Database" disableContentPadding={true}>
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        {/* Dashboard Metrics */}
        <HomeDashboard />

        <PremiumMarketListings
          flippedCards={flippedCards}
          toggleCardFlip={toggleCardFlip}
        />
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load wheels. Please try again later.</p>
          </div>
        ) : (
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto">
              <TabsTrigger value="popular" className="flex-1 sm:flex-auto">Most Viewed</TabsTrigger>
              <TabsTrigger value="saved" className="flex-1 sm:flex-auto">Most Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="mt-0">
              <PopularWheelsTab
                wheels={popularWheels}
                flippedCards={flippedCards}
                toggleCardFlip={toggleCardFlip}
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <SavedWheelsTab
                wheels={savedWheels}
                flippedCards={flippedCards}
                toggleCardFlip={toggleCardFlip}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
