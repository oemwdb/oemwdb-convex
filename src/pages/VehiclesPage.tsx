import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParsedVehicleFilters } from "@/utils/vehicleFilterParser";
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
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<ParsedVehicleFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: supabaseVehicles, isLoading, isError, error } = useSupabaseVehicles();

  // Map Supabase vehicles to grid format
  const vehicles = (supabaseVehicles ?? []).map(v => ({
    name: v.vehicle_title || v.model_name || v.chassis_code || "Unknown",
    brand: v.brand_name || "Unknown",
    wheels: 0,
    image: v.vehicle_image || undefined,
    bolt_pattern_ref: v.bolt_pattern_ref,
    center_bore_ref: v.center_bore_ref,
    wheel_diameter_ref: v.wheel_diameter_ref,
    wheel_width_ref: v.wheel_width_ref
  }));

  // Initialize filters from URL
  useEffect(() => {
    const searchQueries = searchParams.getAll('search');
    setSearchTags(searchQueries);

    const newParsedFilters: ParsedVehicleFilters = {};
    const brands = searchParams.getAll('brand');
    if (brands.length > 0) newParsedFilters.brand = brands;
    const boltPatterns = searchParams.getAll('boltPattern');
    if (boltPatterns.length > 0) newParsedFilters.boltPattern = boltPatterns;
    const centerBores = searchParams.getAll('centerBore');
    if (centerBores.length > 0) newParsedFilters.centerBore = centerBores;
    const productionYears = searchParams.getAll('productionYears');
    if (productionYears.length > 0) newParsedFilters.productionYears = productionYears;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
    setCurrentPage(1);
  }, [searchTags, parsedFilters]);

  // Handle tag click
  const handleTagClick = (tag: string, category: string) => {
    const params = new URLSearchParams(searchParams);
    const existingValues = params.getAll(category);

    if (existingValues.includes(tag)) {
      params.delete(category);
      existingValues.filter(v => v !== tag).forEach(v => params.append(category, v));
    } else {
      params.append(category, tag);
    }
    navigate(`/vehicles?${params.toString()}`);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['brand', 'boltPattern', 'centerBore', 'productionYears', 'search'].forEach(key => {
      params.delete(key);
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  // Handle adding/removing search tags
  const handleAddSearchTag = (tag: string) => {
    if (!searchTags.includes(tag)) {
      const params = new URLSearchParams(searchParams);
      params.append('search', tag);
      navigate(`/vehicles?${params.toString()}`);
    }
  };

  const handleRemoveSearchTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    const allSearchValues = params.getAll('search');
    params.delete('search');
    allSearchValues.filter(v => v !== tag).forEach(v => params.append('search', v));
    navigate(`/vehicles?${params.toString()}`);
  };

  // Filter vehicles
  const filteredVehicles = vehicles
    .filter(vehicle => {
      if (searchTags.length > 0) {
        const matchesAnyTag = searchTags.some(tag => {
          const searchLower = tag.toLowerCase();
          return vehicle.name?.toLowerCase().includes(searchLower) ||
            vehicle.brand?.toLowerCase().includes(searchLower);
        });
        if (!matchesAnyTag) return false;
      }
      return true;
    })
    .filter(vehicle => {
      if (parsedFilters.brand?.length) {
        const matches = parsedFilters.brand.some(b =>
          vehicle.brand?.toLowerCase().includes(b.toLowerCase())
        );
        if (!matches) return false;
      }

      if (parsedFilters.boltPattern?.length) {
        const sv = (supabaseVehicles || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (sv) {
          const matches = parsedFilters.boltPattern.some(bp =>
            sv.bolt_pattern?.toLowerCase().includes(bp.toLowerCase())
          );
          if (!matches) return false;
        } else return false;
      }

      if (parsedFilters.centerBore?.length) {
        const sv = (supabaseVehicles || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (sv) {
          const matches = parsedFilters.centerBore.some(cb => {
            const clean = cb.replace('mm', '').trim();
            return sv.center_bore?.toLowerCase().includes(clean.toLowerCase());
          });
          if (!matches) return false;
        } else return false;
      }

      return true;
    })
    .sort((a, b) => {
      const brandCompare = (a.brand || '').localeCompare(b.brand || '');
      if (brandCompare !== 0) return brandCompare;
      return (a.name || '').localeCompare(b.name || '');
    });

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Build filter fields
  const filterFields = [
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
  ];

  return (
    <DashboardLayout
      title="Vehicles"
      showFilterButton={false}
      secondaryTitle="Filters"
      secondarySidebar={
        <CollectionSecondarySidebar
          title="Filters"
          filterFields={filterFields}
          parsedFilters={parsedFilters as Record<string, string[] | undefined>}
          onTagClick={handleTagClick}
          onClearAll={handleClearAllFilters}
          searchPlaceholder="Search vehicles..."
          searchTags={searchTags}
          onAddSearchTag={handleAddSearchTag}
          onRemoveSearchTag={handleRemoveSearchTag}
          totalResults={filteredVehicles.length}
        />
      }
    >
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading vehicles...</div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">
          Failed to load vehicles.
          {error?.message && <span className="block mt-2 text-xs text-slate-400">Error: {error.message}</span>}
        </div>
      ) : (
        <>
          <VehiclesGrid
            vehicles={paginatedVehicles}
            flippedCards={flippedCards}
            onFlip={toggleCardFlip}
          />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {currentPage > 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">1</PaginationLink>
                      </PaginationItem>
                      {currentPage > 3 && <PaginationEllipsis />}
                    </>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === currentPage || page === currentPage - 1 || page === currentPage + 1)
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
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && <PaginationEllipsis />}
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
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

          {filteredVehicles.length > 0 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default VehiclesPage;
