import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import { CollectionAdminSidebar } from "@/components/collection/CollectionAdminSidebar";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParsedVehicleFilters } from "@/utils/vehicleFilterParser";
import { useVehicleGridColumns } from "@/hooks/useWheelsGridColumns";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import { useCollectionDuplicateControl } from "@/hooks/useCollectionDuplicateControl";
import { Shield } from "lucide-react";

const LOAD_TIMEOUT_MS = 12_000;
const ROWS_PER_LOAD = 3;
const LOAD_MORE_DELAY_MS = 650;
const LOAD_MORE_COOLDOWN_MS = 900;
const LOAD_MORE_ROOT_MARGIN = "420px";

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
  const queuedLoadRef = useRef(false);
  const itemsPerLoadRef = useRef(itemsPerLoad);
  itemsPerLoadRef.current = itemsPerLoad;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const showAdminTools = isAdmin && isDevMode;
  const mergeVehicles = useMutation(api.collectionMerges.mergeVehicles);
  const duplicateControl = useCollectionDuplicateControl({
    itemLabel: "vehicles",
    onMerge: ({ canonicalId, duplicateIds }) =>
      mergeVehicles({
        canonicalId: canonicalId as Id<"oem_vehicles">,
        duplicateIds: duplicateIds as Id<"oem_vehicles">[],
      }),
  });

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
    good_pic_url: v.good_pic_url || null,
    bad_pic_url: v.bad_pic_url || null,
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
    const hasGoodPic = searchParams.getAll('hasGoodPic');
    if (hasGoodPic.length > 0) (newParsedFilters as Record<string, string[] | undefined>).hasGoodPic = hasGoodPic;
    const hasBadPic = searchParams.getAll('hasBadPic');
    if (hasBadPic.length > 0) (newParsedFilters as Record<string, string[] | undefined>).hasBadPic = hasBadPic;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
    setVisibleCount(itemsPerLoad);
    duplicateControl.clearSelection();
  }, [searchTags, parsedFilters, itemsPerLoad, duplicateControl.clearSelection]);

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
    ['brand', 'boltPattern', 'centerBore', 'productionYears', 'hasGoodPic', 'hasBadPic', 'search'].forEach(key => {
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

      const adminFilters = parsedFilters as Record<string, string[] | undefined>;
      if (adminFilters.hasGoodPic?.includes('Yes') && !vehicle.good_pic_url?.trim()) return false;
      if (adminFilters.hasGoodPic?.includes('No') && vehicle.good_pic_url?.trim()) return false;
      if (adminFilters.hasBadPic?.includes('Yes') && !vehicle.bad_pic_url?.trim()) return false;
      if (adminFilters.hasBadPic?.includes('No') && vehicle.bad_pic_url?.trim()) return false;

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
    if (isLoading || !hasMore) {
      queuedLoadRef.current = false;
      return;
    }
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e?.isIntersecting) return;
        if (queuedLoadRef.current) return;
        const now = Date.now();
        if (now - lastLoadMoreTimeRef.current < LOAD_MORE_COOLDOWN_MS) return;
        lastLoadMoreTimeRef.current = now;
        queuedLoadRef.current = true;
        const total = totalCountRef.current;
        const load = itemsPerLoadRef.current;
        if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
        loadMoreTimeoutRef.current = setTimeout(() => {
          loadMoreTimeoutRef.current = undefined;
          queuedLoadRef.current = false;
          setVisibleCount((prev) => Math.min(prev + load, total));
        }, LOAD_MORE_DELAY_MS);
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN, threshold: 0.01 }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
      queuedLoadRef.current = false;
    };
  }, [hasMore, isLoading]);

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Build filter fields
  const filterFields = [
    { label: 'Brand', category: 'brand', values: filterOptions.brands },
    { label: 'Bolt Pattern', category: 'boltPattern', values: filterOptions.boltPatterns },
    { label: 'Center Bore', category: 'centerBore', values: filterOptions.centerBores },
    { label: 'Production Years', category: 'productionYears', values: filterOptions.productionYears },
    ...(isDevMode
      ? [
          { label: 'Has Good Pic', category: 'hasGoodPic', values: ['Yes', 'No'] },
          { label: 'Has Bad Pic', category: 'hasBadPic', values: ['Yes', 'No'] },
        ]
      : []),
  ];

  const sortOptions = [
    { label: "Brand A-Z", value: "brandAsc" },
    { label: "Brand Z-A", value: "brandDesc" },
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Newest Production Start", value: "yearNewest" },
    { label: "Oldest Production Start", value: "yearOldest" },
  ];

  const selectedVehicleLabels = duplicateControl.selectedIds
    .map((selectedId) => filteredVehicles.find((vehicle) => (vehicle.id ?? vehicle.name) === selectedId)?.name)
    .filter((value): value is string => Boolean(value));

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
      customTitle="Admin"
      customActionIcon={<Shield className="h-4 w-4" />}
      customSidebarInteractive={showAdminTools}
      customSidebar={
        showAdminTools ? (
          <CollectionAdminSidebar
            itemLabel="vehicles"
            selectionMode={duplicateControl.selectionMode}
            selectedCount={duplicateControl.selectedCount}
            selectedLabels={selectedVehicleLabels}
            isMerging={duplicateControl.isMerging}
            onDuplicateControl={duplicateControl.handleDuplicateControl}
            onClearSelection={duplicateControl.clearSelection}
          />
        ) : null
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto">
        {loadTimedOut ? (
          <div className="text-center py-10 max-w-md mx-auto space-y-2">
            <p className="text-amber-600 font-medium">Loading is taking longer than usual</p>
            <p className="text-sm text-muted-foreground">
              Check that <code className="bg-muted px-1 rounded">VITE_CONVEX_URL</code> is set and <code className="bg-muted px-1 rounded">npx convex dev</code> is running. Then refresh.
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
          <div className="flex flex-col gap-4" style={{ overflowAnchor: "none" }}>
            <VehiclesGrid
              vehicles={visibleVehicles}
              flippedCards={flippedCards}
              onFlip={toggleCardFlip}
              insertAdEvery={itemsPerLoad}
              selectionMode={duplicateControl.selectionMode}
              selectedIds={duplicateControl.selectedIds}
              onToggleSelection={duplicateControl.toggleSelection}
            />
            {hasMore && (
              <div
                ref={loadMoreSentinelRef}
                className="h-px w-full shrink-0"
                aria-hidden
                style={{ overflowAnchor: "none" }}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VehiclesPage;
