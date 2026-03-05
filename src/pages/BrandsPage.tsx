import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BrandCard from "@/components/brand/BrandCard";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams, useNavigate } from "react-router-dom";

const LOAD_TIMEOUT_MS = 12_000;

const BrandsPage = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawBrands = useQuery(api.queries.brandsGetAllWithCounts);
  const isLoading = rawBrands === undefined;
  const isError = false;

  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isLoading]);

  const brands = useMemo(() => {
    const data = rawBrands ?? [];
    if (!Array.isArray(data)) return [];
    return data.map((b) => ({
      name: b.brand_title ?? "Unknown",
      description: b.brand_description ?? null,
      imagelink: b.brand_image_url ?? null,
      wheelCount: b.wheelCount ?? 0,
      vehicleCount: b.vehicleCount ?? 0,
    }));
  }, [rawBrands]);

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
        {loadTimedOut ? (
          <div className="text-center py-10 max-w-md mx-auto space-y-2">
            <p className="text-amber-600 font-medium">Loading is taking longer than usual</p>
            <p className="text-sm text-muted-foreground">
              Check that <code className="bg-muted px-1 rounded">VITE_CONVEX_URL</code> is set in <code className="bg-muted px-1 rounded">.env.local</code> and that <code className="bg-muted px-1 rounded">npx convex dev</code> is running (or your Convex deployment is up). Then refresh the page.
            </p>
          </div>
        ) : isLoading ? (
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
