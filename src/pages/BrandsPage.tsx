import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BrandCard from "@/components/brand/BrandCard";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";

// Fetch brands from Supabase
const fetchBrands = async () => {
  const { data, error } = await supabase
    .from("oem_brands" as any)
    .select("brand_title, brand_description, brand_image_url, wheel_count");
  if (error) throw error;

  const brandsWithCounts = await Promise.all(
    ((data ?? []) as any[]).map(async (brand: any) => {
      const { data: vehicleCount } = await supabase
        .rpc('get_brand_vehicle_count', { brand_name_param: brand.brand_title });
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
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: brands, isLoading, isError } = useQuery({
    queryKey: ["oem-brands"],
    queryFn: fetchBrands,
  });

  // Initialize from URL
  useEffect(() => {
    const searchQueries = searchParams.getAll('search');
    setSearchTags(searchQueries);

    const newParsedFilters: Record<string, string[] | undefined> = {};
    const hasWheels = searchParams.getAll('hasWheels');
    if (hasWheels.length > 0) newParsedFilters.hasWheels = hasWheels;
    const hasImage = searchParams.getAll('hasImage');
    if (hasImage.length > 0) newParsedFilters.hasImage = hasImage;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  // Handle tag click
  const handleTagClick = (tag: string, category: string) => {
    const params = new URLSearchParams(searchParams);
    const existingValues = params.getAll(category);

    if (existingValues.includes(tag)) {
      params.delete(category);
      existingValues.filter(v => v !== tag).forEach(v => params.append(category, v));
    } else {
      params.delete(category); // For boolean filters, only allow one value
      params.append(category, tag);
    }
    navigate(`/brands?${params.toString()}`);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    navigate('/brands');
  };

  // Handle search tags
  const handleAddSearchTag = (tag: string) => {
    if (!searchTags.includes(tag)) {
      const params = new URLSearchParams(searchParams);
      params.append('search', tag);
      navigate(`/brands?${params.toString()}`);
    }
  };

  const handleRemoveSearchTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    const allSearchValues = params.getAll('search');
    params.delete('search');
    allSearchValues.filter(v => v !== tag).forEach(v => params.append('search', v));
    navigate(`/brands?${params.toString()}`);
  };

  // Filter brands
  const filteredBrands = (brands ?? [])
    .filter(brand => {
      if (searchTags.length > 0) {
        const matchesAnyTag = searchTags.some(tag => {
          const searchLower = tag.toLowerCase();
          return brand.name.toLowerCase().includes(searchLower) ||
            (brand.description && brand.description.toLowerCase().includes(searchLower));
        });
        if (!matchesAnyTag) return false;
      }
      return true;
    })
    .filter(brand => {
      if (parsedFilters.hasWheels?.includes('Yes') && brand.wheelCount === 0) return false;
      if (parsedFilters.hasWheels?.includes('No') && brand.wheelCount > 0) return false;
      if (parsedFilters.hasImage?.includes('Yes') && (!brand.imagelink || brand.imagelink.trim() === '')) return false;
      if (parsedFilters.hasImage?.includes('No') && brand.imagelink && brand.imagelink.trim() !== '') return false;
      return true;
    })
    .sort((a, b) => {
      const aHasImage = a.imagelink && a.imagelink.trim() !== '';
      const bHasImage = b.imagelink && b.imagelink.trim() !== '';
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      return a.name.localeCompare(b.name);
    });

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Build filter fields
  const filterFields = [
    { label: 'Has Wheels', category: 'hasWheels', values: ['Yes', 'No'] },
    { label: 'Has Image', category: 'hasImage', values: ['Yes', 'No'] },
  ];

  return (
    <DashboardLayout
      title="Brands"
      showFilterButton={false}
      secondaryTitle="Filters"
      secondarySidebar={
        <CollectionSecondarySidebar
          title="Filters"
          filterFields={filterFields}
          parsedFilters={parsedFilters}
          onTagClick={handleTagClick}
          onClearAll={handleClearAllFilters}
          searchPlaceholder="Search brands..."
          searchTags={searchTags}
          onAddSearchTag={handleAddSearchTag}
          onRemoveSearchTag={handleRemoveSearchTag}
          totalResults={filteredBrands.length}
        />
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading brands...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">Failed to load brands.</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
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
