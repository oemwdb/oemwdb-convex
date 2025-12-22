
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import { CollectionFilterDropdown } from "@/components/collection/CollectionFilterDropdown";
import { cn } from "@/lib/utils";
import { useCollectionSearch } from "@/hooks/useCollectionSearch";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseVehicleFilterString, ParsedVehicleFilters } from "@/utils/vehicleFilterParser";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const VehiclesPage = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [parsedFilters, setParsedFilters] = useState<ParsedVehicleFilters>({});
  const [topDropdownSuggestion, setTopDropdownSuggestion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
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
  } = useCollectionSearch('vehicles');

  const { data: supabaseVehicles, isLoading, isError, error } = useSupabaseVehicles();

  // Map Supabase vehicles to the format expected by VehiclesGrid
  const vehicles = (supabaseVehicles ?? []).map(v => ({
    name: v.vehicle_title || v.model_name || v.chassis_code || "Unknown",
    brand: v.brand_name || "Unknown",
    wheels: 0, // We'll need to add wheel count logic later
    image: v.vehicle_image || undefined,
    // Include JSONB refs for card back display
    bolt_pattern_ref: v.bolt_pattern_ref,
    center_bore_ref: v.center_bore_ref,
    wheel_diameter_ref: v.wheel_diameter_ref,
    wheel_width_ref: v.wheel_width_ref
  }));

  // Initialize search and parsed filters from URL params
  useEffect(() => {
    // Parse multi-tag search from URL params
    const searchQueries = searchParams.getAll('search');
    setSearchTags(searchQueries);

    // Parse multi-value filters from URL params
    const newParsedFilters: ParsedVehicleFilters = {};

    const brands = searchParams.getAll('brand');
    if (brands.length > 0) newParsedFilters.brand = brands;

    const boltPatterns = searchParams.getAll('boltPattern');
    if (boltPatterns.length > 0) newParsedFilters.boltPattern = boltPatterns;

    const centerBores = searchParams.getAll('centerBore');
    if (centerBores.length > 0) newParsedFilters.centerBore = centerBores;

    const productionYears = searchParams.getAll('productionYears');
    if (productionYears.length > 0) newParsedFilters.productionYears = productionYears;

    console.log('[VehiclesPage] Parsed filters from URL:', newParsedFilters);
    setParsedFilters(newParsedFilters);

    // Update legacy filters for dropdown compatibility
    if (brands[0]) updateFilter('Brand Name', brands[0]);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTags, filters]);

  // Handle filter search submit with smart parsing
  const handleFilterSearchSubmit = (filterString: string) => {
    // Smart parsing
    const parsed = parseVehicleFilterString(filterString);

    // Build URL params from parsed filters
    const params = new URLSearchParams(searchParams);

    // Clear existing filter params
    ['brand', 'boltPattern', 'centerBore', 'productionYears'].forEach(key => {
      params.delete(key);
    });

    // Add new filter params
    if (parsed.brand?.length) {
      parsed.brand.forEach(b => params.append('brand', b));
    }
    if (parsed.boltPattern?.length) {
      parsed.boltPattern.forEach(bp => params.append('boltPattern', bp));
    }
    if (parsed.centerBore?.length) {
      parsed.centerBore.forEach(cb => params.append('centerBore', cb));
    }
    if (parsed.productionYears?.length) {
      parsed.productionYears.forEach(py => params.append('productionYears', py));
    }

    navigate(`/vehicles?${params.toString()}`);
  };

  // Handle tag click from suggestions
  const handleTagClick = (tag: string, category: string) => {
    const paramMap: Record<string, string> = {
      brand: 'brand',
      boltPattern: 'boltPattern',
      centerBore: 'centerBore',
      productionYears: 'productionYears',
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

      navigate(`/vehicles?${params.toString()}`);
    }
  };

  // Handle removing individual filter
  const handleRemoveFilter = (category: keyof ParsedVehicleFilters, value: string) => {
    const params = new URLSearchParams(searchParams);
    const allValues = params.getAll(category);
    params.delete(category);
    allValues.filter(v => v !== value).forEach(v => params.append(category, v));
    navigate(`/vehicles?${params.toString()}`);
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['brand', 'boltPattern', 'centerBore', 'productionYears'].forEach(key => {
      params.delete(key);
    });
    navigate(`/vehicles?${params.toString()}`);
    setParsedFilters({});
  };

  const filteredVehicles = vehicles
    .filter(vehicle => !filters.hasWheels || vehicle.wheels > 0)
    .filter(vehicle => {
      // Apply multi-tag search filter (OR logic - match any tag)
      if (searchTags.length > 0) {
        const matchesAnyTag = searchTags.some(tag => {
          const searchLower = tag.toLowerCase();
          return (
            vehicle.name?.toLowerCase().includes(searchLower) ||
            vehicle.brand?.toLowerCase().includes(searchLower)
          );
        });
        if (!matchesAnyTag) return false;
      }
      return true;
    })
    .filter(vehicle => {
      // Apply parsed multi-value filters (OR logic within each category)

      // Brand filter
      if (parsedFilters.brand?.length) {
        const matches = parsedFilters.brand.some(filterBrand => {
          const cleanFilter = filterBrand.toLowerCase().trim();
          const vehicleBrand = vehicle.brand?.toLowerCase().trim() || '';
          return vehicleBrand === cleanFilter || vehicleBrand.includes(cleanFilter);
        });
        if (!matches) return false;
      }

      // Bolt Pattern filter - need to get from supabaseVehicles
      if (parsedFilters.boltPattern?.length) {
        const supabaseVehicle = (supabaseVehicles || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (supabaseVehicle) {
          const matches = parsedFilters.boltPattern.some(filterBp => {
            const cleanFilter = filterBp.toLowerCase().trim();
            const vehicleBoltPattern = supabaseVehicle.bolt_pattern?.toLowerCase().trim() || '';
            return vehicleBoltPattern.includes(cleanFilter) || vehicleBoltPattern === cleanFilter;
          });
          if (!matches) return false;
        } else {
          return false;
        }
      }

      // Center Bore filter
      if (parsedFilters.centerBore?.length) {
        const supabaseVehicle = (supabaseVehicles || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (supabaseVehicle) {
          const matches = parsedFilters.centerBore.some(filterCb => {
            const cleanFilter = filterCb.replace('mm', '').trim();
            const vehicleCenterBore = supabaseVehicle.center_bore?.toLowerCase().trim() || '';
            return vehicleCenterBore.includes(cleanFilter.toLowerCase()) ||
              vehicleCenterBore === cleanFilter.toLowerCase();
          });
          if (!matches) return false;
        } else {
          return false;
        }
      }

      // Production Years filter
      if (parsedFilters.productionYears?.length) {
        const supabaseVehicle = (supabaseVehicles || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (supabaseVehicle) {
          const matches = parsedFilters.productionYears.some(filterYears => {
            const vehicleYears = supabaseVehicle.production_years?.toLowerCase().trim() || '';
            return vehicleYears.includes(filterYears.toLowerCase()) ||
              vehicleYears === filterYears.toLowerCase();
          });
          if (!matches) return false;
        } else {
          return false;
        }
      }

      // Apply legacy brand filter
      if (filters['Brand Name'] && vehicle.brand !== filters['Brand Name']) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by brand first (alphabetically)
      const brandCompare = (a.brand || 'Unknown').localeCompare(b.brand || 'Unknown');
      if (brandCompare !== 0) return brandCompare;

      // Then sort by vehicle name (alphabetically)
      return (a.name || '').localeCompare(b.name || '');
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Handle adding a search tag
  const handleAddSearchTag = (tag: string) => {
    if (!searchTags.includes(tag)) {
      const params = new URLSearchParams(searchParams);
      params.append('search', tag);
      navigate(`/vehicles?${params.toString()}`);
    }
  };

  // Handle removing a search tag
  const handleRemoveSearchTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    const allSearchValues = params.getAll('search');
    params.delete('search');
    allSearchValues.filter(v => v !== tag).forEach(v => params.append('search', v));
    navigate(`/vehicles?${params.toString()}`);
  };

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <DashboardLayout
      title="Vehicles"
      searchPlaceholder="Search vehicles..."
      onFilterClick={() => setShowDropdown(prev => !prev)}
      showFilterButton={true}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={setSidebarCollapsed}
      onFilterSearchSubmit={handleFilterSearchSubmit}
      parsedFilters={parsedFilters}
      onRemoveFilter={handleRemoveFilter}
      searchTags={searchTags}
      onAddSearchTag={handleAddSearchTag}
      onRemoveSearchTag={handleRemoveSearchTag}
      topSuggestion={topDropdownSuggestion}
      filterSearchDropdown={
        showDropdown && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            {[
              { label: 'Brand', category: 'brand', values: [...new Set((supabaseVehicles || []).map(v => v.brand_name).filter(Boolean))] as string[] },
              {
                label: 'Bolt Pattern', category: 'boltPattern', values: [...new Set((supabaseVehicles || []).flatMap(v => {
                  const bp = v.bolt_pattern;
                  if (!bp) return [];
                  if (Array.isArray(bp)) return bp.filter(Boolean);
                  if (typeof bp === 'string') return [bp];
                  return [];
                }).filter(Boolean))] as string[]
              },
              {
                label: 'Center Bore', category: 'centerBore', values: [...new Set((supabaseVehicles || []).flatMap(v => {
                  const cb = v.center_bore;
                  if (!cb) return [];
                  if (Array.isArray(cb)) return cb.filter(Boolean);
                  if (typeof cb === 'string') return [cb];
                  return [];
                }).filter(Boolean))] as string[]
              },
              { label: 'Production Years', category: 'productionYears', values: [...new Set((supabaseVehicles || []).map(v => v.production_years).filter(Boolean))] as string[] },
            ].map((field, idx) => (
              <div key={idx} className="py-2 border-b border-border/50 last:border-b-0">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-xs text-muted-foreground py-1 min-w-[100px]">{field.label}:</span>
                  {field.values.map((value: string, valueIdx: number) => (
                    <button
                      key={valueIdx}
                      onClick={() => handleTagClick(value, field.category)}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 transition-colors",
                        parsedFilters[field.category as keyof typeof parsedFilters]?.includes(value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }
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

      <div className="pl-0 pr-4 pt-0 pb-4 space-y-4">
        {/* Ad Panel */}
        <div className="w-full bg-muted/30 border border-dashed border-border rounded-lg p-6 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
              <svg className="h-6 w-6 text-primary/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Advertisement</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading vehicles...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Failed to load vehicles from Supabase.<br />
            {error?.message && <span className="block mt-2 text-xs text-slate-400">Error: {error.message}</span>}
          </div>
        ) : (
          <>
            <VehiclesGrid
              vehicles={paginatedVehicles}
              flippedCards={flippedCards}
              onFlip={toggleCardFlip}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* First page */}
                    {currentPage > 2 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(1)}
                            className="cursor-pointer"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage > 3 && <PaginationEllipsis />}
                      </>
                    )}

                    {/* Current page and neighbors */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        return page === currentPage ||
                          page === currentPage - 1 ||
                          page === currentPage + 1;
                      })
                      .map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    }

                    {/* Last page */}
                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && <PaginationEllipsis />}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Results info */}
            {filteredVehicles.length > 0 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VehiclesPage;
