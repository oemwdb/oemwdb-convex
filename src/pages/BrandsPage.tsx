
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BrandCard from "@/components/brand/BrandCard";
import { CollectionFilterDropdown } from "@/components/collection/CollectionFilterDropdown";
import { useCollectionSearch } from "@/hooks/useCollectionSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

// Fetch brands from Supabase
const fetchBrands = async () => {
  const { data, error } = await supabase
    .from("oem_brands" as any)
    .select("brand_title, brand_description, brand_image_url, wheel_count");
  if (error) throw error;

  // Fetch vehicle counts for each brand
  const brandsWithCounts = await Promise.all(
    ((data ?? []) as any[]).map(async (brand: any) => {
      const { data: vehicleCount } = await supabase
        .rpc('get_brand_vehicle_count', { 
          brand_name_param: brand.brand_title 
        });
      
      return {
        name: brand.brand_title || "Unknown",
        description: brand.brand_description ?? null,
        imagelink: brand.brand_image_url ?? null,
        wheelCount: brand.wheel_count ?? 0,
        vehicleCount: vehicleCount ?? 0,
      };
    })
  );
  
  return brandsWithCounts;
};

const BrandsPage = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  
  const {
    searchText,
    updateSearchText,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    config,
  } = useCollectionSearch('brands');

  // Initialize search from URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchQuery !== searchText) {
      updateSearchText(searchQuery);
    }
  }, []);

  const { data: brands, isLoading, isError } = useQuery({
    queryKey: ["oem-brands"],
    queryFn: fetchBrands,
  });

  // Apply filtering and sorting to brands fetched from Supabase
  const filteredBrands = (brands ?? [])
    .filter(brand => {
      // Search filter
      if (searchText.trim()) {
        const searchLower = searchText.toLowerCase();
        return (
          brand.name.toLowerCase().includes(searchLower) ||
          (brand.description && brand.description.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(brand => {
      // Boolean filters
      if (filters.hasWheels && brand.wheelCount === 0) return false;
      if (filters.hasImage && (!brand.imagelink || brand.imagelink.trim() === '')) return false;
      if (filters.hasVehicles) return true; // Placeholder - will connect to actual data later
      
      return true;
    })
    .sort((a, b) => {
      // First, sort by whether they have images (brands with images first)
      const aHasImage = a.imagelink && a.imagelink.trim() !== '';
      const bHasImage = b.imagelink && b.imagelink.trim() !== '';
      
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      
      // If both have images or both don't have images, sort alphabetically
      return a.name.localeCompare(b.name);
    });

  // Toggle card flip
  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <DashboardLayout 
      title="Brands"
      searchValue={searchText}
      onSearchChange={updateSearchText}
      searchPlaceholder="Search brands..."
      onFilterClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
      showFilterButton={true}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={setSidebarCollapsed}
    >
      <CollectionFilterDropdown
        isOpen={isFilterDropdownOpen}
        onClose={() => setIsFilterDropdownOpen(false)}
        config={config}
        filters={filters}
        filterOptions={filterOptions}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="p-4 space-y-4">
          {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading brands...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">Failed to load brands from Supabase.</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredBrands.map((brand) => (
              <BrandCard
                key={brand.name}
                brand={brand}
                isFlipped={flippedCards[brand.name] || false}
                onFlip={toggleCardFlip}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrandsPage;
