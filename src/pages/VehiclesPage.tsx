import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParsedVehicleFilters } from "@/utils/vehicleFilterParser";
import { useVehicleGridColumns } from "@/hooks/useWheelsGridColumns";

const LOAD_TIMEOUT_MS = 12_000;
const ROWS_PER_LOAD = 3;
const LOAD_MORE_DELAY_MS = 450;
const LOAD_MORE_COOLDOWN_MS = 1200;

const getYearStart = (years?: string | null) => {
  const match = String(years ?? "").match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : 0;
};

const VehiclesPage = () => {
  const columns = useVehicleGridColumns();
  const itemsPerLoad = ROWS_PER_LOAD * columns;
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<ParsedVehicleFilters>({});
  const [sortBy, setSortBy] = useState("brandAsc");
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const totalCountRef = useRef(0);
  const lastLoadMoreTimeRef = useRef(0);
  const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const itemsPerLoadRef = useRef(itemsPerLoad);
  itemsPerLoadRef.current = itemsPerLoad;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehiclesData = useQuery(api.queries.vehiclesGetAllWithBrands, {});
  const filterOptions = useQuery(api.queries.vehiclesFilterOptions, {}) ?? {
    brands: [] as string[],
    boltPatterns: [] as string[],
    centerBores: [] as string[],
    productionYears: [] as string[],
  };
  const isLoading = vehiclesData === undefined;
  const isError = false;
  const error = null;

  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isLoading]);

  const vehicles = (vehiclesData ?? []).map(v => ({
    id: String(v._id),
    name: v.vehicle_title || v.model_name || v.generation || "Unknown",
    brand: v.brand_name || "Unknown",
    wheels: 0,
    image: v.vehicle_image || undefined,
    bolt_pattern_ref: v.bolt_pattern,
    center_bore_ref: v.center_bore,
    wheel_diameter_ref: v.text_diameters,
    wheel_width_ref: v.text_widths
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
    setVisibleCount(itemsPerLoad);
  }, [searchTags, parsedFilters, itemsPerLoad]);

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
        const sv = (vehiclesData || []).find(v =>
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
        const sv = (vehiclesData || []).find(v =>
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

      if (parsedFilters.productionYears?.length) {
        const sv = (vehiclesData || []).find(v =>
          (v.vehicle_title || v.model_name || v.chassis_code) === vehicle.name
        );
        if (sv) {
          const vehicleYears = (sv.production_years ?? "").toLowerCase();
          const matches = parsedFilters.productionYears.some(py =>
            vehicleYears.includes(py.toLowerCase().trim())
          );
          if (!matches) return false;
        } else return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "nameAsc":
          return (a.name || '').localeCompare(b.name || '');
        case "nameDesc":
          return (b.name || '').localeCompare(a.name || '');
        case "brandDesc": {
          const brandCompare = (b.brand || '').localeCompare(a.brand || '');
          if (brandCompare !== 0) return brandCompare;
          return (a.name || '').localeCompare(b.name || '');
        }
        case "yearNewest":
          return getYearStart((vehiclesData || []).find(v => (v.vehicle_title || v.model_name || v.chassis_code) === b.name)?.production_years) -
            getYearStart((vehiclesData || []).find(v => (v.vehicle_title || v.model_name || v.chassis_code) === a.name)?.production_years) ||
            (a.name || '').localeCompare(b.name || '');
        case "yearOldest":
          return getYearStart((vehiclesData || []).find(v => (v.vehicle_title || v.model_name || v.chassis_code) === a.name)?.production_years) -
            getYearStart((vehiclesData || []).find(v => (v.vehicle_title || v.model_name || v.chassis_code) === b.name)?.production_years) ||
            (a.name || '').localeCompare(b.name || '');
        case "brandAsc":
        default: {
          const brandCompare = (a.brand || '').localeCompare(b.brand || '');
          if (brandCompare !== 0) return brandCompare;
          return (a.name || '').localeCompare(b.name || '');
        }
      }
    });

  totalCountRef.current = filteredVehicles.length;
  const visibleVehicles = filteredVehicles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVehicles.length;

  // Infinite scroll: load more when near bottom, with delay for paced feel
  useEffect(() => {
    if (isLoading) return;
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e?.isIntersecting) return;
        const now = Date.now();
        if (now - lastLoadMoreTimeRef.current < LOAD_MORE_COOLDOWN_MS) return;
        lastLoadMoreTimeRef.current = now;
        const total = totalCountRef.current;
        const load = itemsPerLoadRef.current;
        if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
        loadMoreTimeoutRef.current = setTimeout(() => {
          loadMoreTimeoutRef.current = undefined;
          setVisibleCount((prev) => Math.min(prev + load, total));
        }, LOAD_MORE_DELAY_MS);
      },
      { rootMargin: "120px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
    };
  }, [isLoading]);

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Build filter fields
  const filterFields = [
    { label: 'Brand', category: 'brand', values: filterOptions.brands },
    { label: 'Bolt Pattern', category: 'boltPattern', values: filterOptions.boltPatterns },
    { label: 'Center Bore', category: 'centerBore', values: filterOptions.centerBores },
    { label: 'Production Years', category: 'productionYears', values: filterOptions.productionYears },
  ];

  const sortOptions = [
    { label: "Brand A-Z", value: "brandAsc" },
    { label: "Brand Z-A", value: "brandDesc" },
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Newest Production Start", value: "yearNewest" },
    { label: "Oldest Production Start", value: "yearOldest" },
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
      sortTitle="Sort Vehicles"
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Vehicles"
          options={sortOptions}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={filteredVehicles.length}
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
          <div className="text-center py-10 text-muted-foreground">Loading vehicles...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Failed to load vehicles.
            {error?.message && <span className="block mt-2 text-xs text-slate-400">Error: {error.message}</span>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <VehiclesGrid
              vehicles={visibleVehicles}
              flippedCards={flippedCards}
              onFlip={toggleCardFlip}
              insertAdEvery={itemsPerLoad}
            />
            {hasMore && (
              <div
                ref={loadMoreSentinelRef}
                className="h-4 w-full shrink-0"
                aria-hidden
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VehiclesPage;
