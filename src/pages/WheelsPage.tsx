import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { useSupabaseWheels } from "@/hooks/useSupabaseWheels";
import { CircleSlash2, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseFilterString, ParsedFilters } from "@/utils/filterParser";

const WheelsPage = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch wheels from Supabase
  const { data: wheels, isLoading, error } = useSupabaseWheels();

  // Initialize search and parsed filters from URL params
  useEffect(() => {
    const searchQueries = searchParams.getAll('search');
    setSearchTags(searchQueries);

    const newParsedFilters: ParsedFilters = {};
    const brands = searchParams.getAll('brand');
    if (brands.length > 0) newParsedFilters.brand = brands;
    const diameters = searchParams.getAll('diameter');
    if (diameters.length > 0) newParsedFilters.diameter = diameters;
    const widths = searchParams.getAll('width');
    if (widths.length > 0) newParsedFilters.width = widths;
    const boltPatterns = searchParams.getAll('boltPattern');
    if (boltPatterns.length > 0) newParsedFilters.boltPattern = boltPatterns;
    const centerBores = searchParams.getAll('centerBore');
    if (centerBores.length > 0) newParsedFilters.centerBore = centerBores;
    const colors = searchParams.getAll('color');
    if (colors.length > 0) newParsedFilters.color = colors;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  // Reset flipped cards when filters change
  useEffect(() => {
    setFlippedCards({});
  }, [searchTags, parsedFilters]);

  // Handle tag click from filter sidebar
  const handleTagClick = (tag: string, category: string) => {
    const params = new URLSearchParams(searchParams);
    const existingValues = params.getAll(category);

    if (existingValues.includes(tag)) {
      params.delete(category);
      existingValues.filter(v => v !== tag).forEach(v => params.append(category, v));
    } else {
      params.append(category, tag);
    }
    navigate(`/wheels?${params.toString()}`);
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['brand', 'diameter', 'width', 'boltPattern', 'centerBore', 'color', 'search'].forEach(key => {
      params.delete(key);
    });
    navigate(`/wheels?${params.toString()}`);
  };

  // Handle adding a search tag
  const handleAddSearchTag = (tag: string) => {
    if (!searchTags.includes(tag)) {
      const params = new URLSearchParams(searchParams);
      params.append('search', tag);
      navigate(`/wheels?${params.toString()}`);
    }
  };

  // Handle removing a search tag
  const handleRemoveSearchTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    const allSearchValues = params.getAll('search');
    params.delete('search');
    allSearchValues.filter(v => v !== tag).forEach(v => params.append('search', v));
    navigate(`/wheels?${params.toString()}`);
  };

  // Filter wheels
  const filteredWheels = (wheels || []).filter(wheel => {
    // Apply multi-tag search filter
    if (searchTags.length > 0) {
      const specsString = wheel.specifications ? JSON.stringify(wheel.specifications).toLowerCase() : '';
      const matchesAnyTag = searchTags.some(tag => {
        const searchLower = tag.toLowerCase();
        return wheel.wheel_name?.toLowerCase().includes(searchLower) ||
          wheel.brand_name?.toLowerCase().includes(searchLower) ||
          specsString.includes(searchLower);
      });
      if (!matchesAnyTag) return false;
    }

    // Apply parsed filters
    if (parsedFilters.brand?.length) {
      const matches = parsedFilters.brand.some(b =>
        wheel.brand_name?.toLowerCase().includes(b.toLowerCase())
      );
      if (!matches) return false;
    }

    if (parsedFilters.diameter?.length) {
      const matches = parsedFilters.diameter.some(d => {
        const clean = d.replace(' inch', '').replace('"', '').trim();
        return wheel.diameter?.toLowerCase().includes(clean.toLowerCase());
      });
      if (!matches) return false;
    }

    if (parsedFilters.width?.length) {
      const matches = parsedFilters.width.some(w => {
        const clean = w.replace('J', '').trim();
        return wheel.width?.toLowerCase().includes(clean.toLowerCase());
      });
      if (!matches) return false;
    }

    if (parsedFilters.boltPattern?.length) {
      const matches = parsedFilters.boltPattern.some(bp =>
        wheel.bolt_pattern?.toLowerCase().includes(bp.toLowerCase())
      );
      if (!matches) return false;
    }

    if (parsedFilters.centerBore?.length) {
      const matches = parsedFilters.centerBore.some(cb => {
        const clean = cb.replace('mm', '').trim();
        return wheel.center_bore?.toLowerCase().includes(clean.toLowerCase());
      });
      if (!matches) return false;
    }

    if (parsedFilters.color?.length) {
      const matches = parsedFilters.color.some(c =>
        wheel.color?.toLowerCase().includes(c.toLowerCase())
      );
      if (!matches) return false;
    }

    return true;
  });

  // Build filter fields for secondary sidebar
  const filterFields = [
    { label: 'Brand', category: 'brand', values: [...new Set((wheels || []).map(w => w.brand_name).filter(Boolean))].sort() as string[] },
    { label: 'Diameter', category: 'diameter', values: [...new Set((wheels || []).map(w => w.diameter).filter(Boolean))].sort((a, b) => parseFloat(a!) - parseFloat(b!)) as string[] },
    { label: 'Width', category: 'width', values: [...new Set((wheels || []).map(w => w.width).filter(Boolean))].sort((a, b) => parseFloat(a!) - parseFloat(b!)) as string[] },
    { label: 'Bolt Pattern', category: 'boltPattern', values: [...new Set((wheels || []).map(w => w.bolt_pattern).filter(Boolean))] as string[] },
    { label: 'Center Bore', category: 'centerBore', values: [...new Set((wheels || []).map(w => w.center_bore).filter(Boolean))] as string[] },
  ];

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout
      title="Wheels"
      showFilterButton={false}
      secondaryTitle="Filters"
      secondarySidebar={
        <CollectionSecondarySidebar
          title="Filters"
          filterFields={filterFields}
          parsedFilters={parsedFilters as Record<string, string[] | undefined>}
          onTagClick={handleTagClick}
          onClearAll={handleClearAllFilters}
          searchPlaceholder="Search wheels..."
          searchTags={searchTags}
          onAddSearchTag={handleAddSearchTag}
          onRemoveSearchTag={handleRemoveSearchTag}
          totalResults={filteredWheels.length}
        />
      }
    >
      {error ? (
        <Card className="p-8 text-center bg-destructive/5 border-destructive/20">
          <CircleSlash2 className="h-10 w-10 mx-auto mb-3 text-destructive/50" />
          <h3 className="text-base font-semibold text-destructive mb-1">Failed to Load Wheels</h3>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </Card>
      ) : isLoading ? (
        <Card className="p-8 text-center bg-muted/20">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">Loading wheels...</p>
        </Card>
      ) : (
        <WheelsGrid
          wheels={filteredWheels}
          flippedCards={flippedCards}
          onFlip={toggleCardFlip}
        />
      )}
    </DashboardLayout>
  );
};

export default WheelsPage;
