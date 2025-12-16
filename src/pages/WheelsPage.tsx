import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { CollectionFilterDropdown } from "@/components/collection/CollectionFilterDropdown";
import { TagSuggestionDropdown } from "@/components/wheel/TagSuggestionDropdown";
import { AppliedFilterTags } from "@/components/collection/AppliedFilterTags";
import { useCollectionSearch } from "@/hooks/useCollectionSearch";
import { useSupabaseWheels } from "@/hooks/useSupabaseWheels";
import { CircleSlash2, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseFilterString, ParsedFilters } from "@/utils/filterParser";

const WheelsPage = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [topDropdownSuggestion, setTopDropdownSuggestion] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    searchText,
    updateSearchText,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    config,
  } = useCollectionSearch('wheels');
  
  // Fetch wheels from Supabase
  const { data: wheels, isLoading, error } = useSupabaseWheels();

  // Initialize search and parsed filters from URL params
  useEffect(() => {
    // Parse multi-tag search from URL params
    const searchQueries = searchParams.getAll('search');
    setSearchTags(searchQueries);
    
    // Parse multi-value filters from URL params
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
    
    console.log('[WheelsPage] Parsed filters from URL:', newParsedFilters);
    setParsedFilters(newParsedFilters);
    
    // Update legacy filters for dropdown compatibility
    if (diameters[0]) updateFilter('Diameter Tag', diameters[0]);
    if (boltPatterns[0]) updateFilter('Bolt-Pattern .tag', boltPatterns[0]);
  }, [searchParams]);

  // Reset flipped cards when filters change
  useEffect(() => {
    setFlippedCards({});
  }, [searchTags, filters]);

  // Handle filter search submit with smart parsing
  const handleFilterSearchSubmit = (filterString: string) => {
    // Smart parsing
    const parsed = parseFilterString(filterString);
    
    // Build URL params from parsed filters
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    ['brand', 'diameter', 'width', 'boltPattern', 'centerBore', 'color'].forEach(key => {
      params.delete(key);
    });
    
    // Add new filter params
    if (parsed.brand?.length) {
      parsed.brand.forEach(b => params.append('brand', b));
    }
    if (parsed.diameter?.length) {
      parsed.diameter.forEach(d => params.append('diameter', d));
    }
    if (parsed.width?.length) {
      parsed.width.forEach(w => params.append('width', w));
    }
    if (parsed.boltPattern?.length) {
      parsed.boltPattern.forEach(bp => params.append('boltPattern', bp));
    }
    if (parsed.centerBore?.length) {
      parsed.centerBore.forEach(cb => params.append('centerBore', cb));
    }
    if (parsed.color?.length) {
      parsed.color.forEach(c => params.append('color', c));
    }
    
    navigate(`/wheels?${params.toString()}`);
  };

  // Handle tag click from suggestions
  const handleTagClick = (tag: string, category: string) => {
    const paramMap: Record<string, string> = {
      brand: 'brand',
      diameter: 'diameter',
      width: 'width',
      boltPattern: 'boltPattern',
      centerBore: 'centerBore',
      color: 'color',
    };
    
    const param = paramMap[category];
    if (param) {
      const params = new URLSearchParams(searchParams);
      
      // Toggle behavior: check if tag already exists
      const existingValues = params.getAll(param);
      if (existingValues.includes(tag)) {
        // Remove the tag if it's already selected
        params.delete(param);
        existingValues.filter(v => v !== tag).forEach(v => params.append(param, v));
      } else {
        // Add the tag if it's not selected
        params.append(param, tag);
      }
      
      navigate(`/wheels?${params.toString()}`);
    }
  };

  // Handle removing individual filter
  const handleRemoveFilter = (category: keyof ParsedFilters, value: string) => {
    const params = new URLSearchParams(searchParams);
    const allValues = params.getAll(category);
    params.delete(category);
    allValues.filter(v => v !== value).forEach(v => params.append(category, v));
    navigate(`/wheels?${params.toString()}`);
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['brand', 'diameter', 'width', 'boltPattern', 'centerBore', 'color'].forEach(key => {
      params.delete(key);
    });
    navigate(`/wheels?${params.toString()}`);
    setParsedFilters({});
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

  // Filter wheels based on search tags and filters (including parsed multi-value filters)
  const filteredWheels = (wheels || []).filter(wheel => {
    // Apply multi-tag search filter (OR logic - match any tag)
    if (searchTags.length > 0) {
      const specsString = wheel.specifications 
        ? JSON.stringify(wheel.specifications).toLowerCase()
        : '';
      
      const matchesAnyTag = searchTags.some(tag => {
        const searchLower = tag.toLowerCase();
        return wheel.wheel_name?.toLowerCase().includes(searchLower) ||
               wheel.brand_name?.toLowerCase().includes(searchLower) ||
               specsString.includes(searchLower);
      });
      
      if (!matchesAnyTag) return false;
    }
    
    // Apply parsed multi-value filters (OR logic within each category)
    if (parsedFilters.brand?.length) {
      const matches = parsedFilters.brand.some(b => {
        const cleanFilter = b.toLowerCase().trim();
        const wheelBrand = wheel.brand_name?.toLowerCase().trim() || '';
        return wheelBrand === cleanFilter || wheelBrand.includes(cleanFilter);
      });
      if (!matches) return false;
    }
    
    if (parsedFilters.diameter?.length) {
      const matches = parsedFilters.diameter.some(d => {
        const cleanFilter = d.replace(' inch', '').replace('"', '').trim();
        const wheelDiameter = wheel.diameter?.toLowerCase().trim() || '';
        // Match if wheel diameter contains the number (handles "20", "20 inch", "20\"", etc.)
        const result = wheelDiameter.includes(cleanFilter.toLowerCase()) || 
               wheelDiameter === cleanFilter.toLowerCase() ||
               wheelDiameter.startsWith(cleanFilter.toLowerCase());
        
        if (result) {
          console.log(`[Filter Match] Diameter: "${d}" matches wheel diameter: "${wheel.diameter}"`);
        }
        return result;
      });
      if (!matches) {
        console.log(`[Filter Skip] Wheel "${wheel.wheel_name}" diameter "${wheel.diameter}" doesn't match filters:`, parsedFilters.diameter);
        return false;
      }
    }
    
    if (parsedFilters.width?.length) {
      const matches = parsedFilters.width.some(w => {
        const cleanFilter = w.replace('J', '').trim();
        const wheelWidth = wheel.width?.toLowerCase().trim() || '';
        // Match width flexibly (handles "9.0", "9.0J", "9", etc.)
        return wheelWidth.includes(cleanFilter.toLowerCase()) ||
               wheelWidth === cleanFilter.toLowerCase() ||
               wheelWidth.startsWith(cleanFilter.toLowerCase());
      });
      if (!matches) return false;
    }
    
    if (parsedFilters.boltPattern?.length) {
      const matches = parsedFilters.boltPattern.some(bp => {
        const cleanFilter = bp.toLowerCase().trim();
        const wheelBoltPattern = wheel.bolt_pattern?.toLowerCase().trim() || '';
        return wheelBoltPattern.includes(cleanFilter) ||
               wheelBoltPattern === cleanFilter;
      });
      if (!matches) return false;
    }
    
    if (parsedFilters.centerBore?.length) {
      const matches = parsedFilters.centerBore.some(cb => {
        const cleanFilter = cb.replace('mm', '').trim();
        const wheelCenterBore = wheel.center_bore?.toLowerCase().trim() || '';
        return wheelCenterBore.includes(cleanFilter.toLowerCase()) ||
               wheelCenterBore === cleanFilter.toLowerCase();
      });
      if (!matches) return false;
    }
    
    if (parsedFilters.color?.length) {
      const matches = parsedFilters.color.some(c => {
        const cleanFilter = c.toLowerCase().trim();
        const wheelColor = wheel.color?.toLowerCase().trim() || '';
        return wheelColor.includes(cleanFilter) ||
               wheelColor === cleanFilter;
      });
      if (!matches) return false;
    }
    
    // Apply brand filter
    if (filters['Brand Rel.'] && wheel.brand_name !== filters['Brand Rel.']) {
      return false;
    }
    // Apply status filter  
    if (filters['Status'] && wheel.status !== filters['Status']) {
      return false;
    }
    
    return true;
  });

  // Toggle card flip
  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <DashboardLayout 
      title="Wheels"
      searchPlaceholder="Search wheels..."
      showFilterButton={true}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={setSidebarCollapsed}
      onFilterSearchSubmit={handleFilterSearchSubmit}
      onFilterClick={() => setShowDropdown(prev => !prev)}
      parsedFilters={parsedFilters}
      onRemoveFilter={handleRemoveFilter}
      searchTags={searchTags}
      onAddSearchTag={handleAddSearchTag}
      onRemoveSearchTag={handleRemoveSearchTag}
      topSuggestion={topDropdownSuggestion}
      filterSearchDropdown={
        showDropdown && (
          <TagSuggestionDropdown
            searchText=""
            allWheels={wheels || []}
            onTagClick={handleTagClick}
            isOpen={showDropdown}
            selectedTags={parsedFilters}
            onTopSuggestionChange={setTopDropdownSuggestion}
          />
        )
      }
    >
      <div className="p-4 space-y-4">
        {/* Content area */}
          {error ? (
          <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
            <CircleSlash2 className="h-12 w-12 mx-auto mb-4 text-destructive/50" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Wheels</h3>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </Card>
        ) : isLoading ? (
          <Card className="p-12 text-center bg-muted/20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading wheels collection...</p>
          </Card>
        ) : (
          <WheelsGrid
            wheels={filteredWheels}
            flippedCards={flippedCards}
            onFlip={toggleCardFlip}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default WheelsPage;
