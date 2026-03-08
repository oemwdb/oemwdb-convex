import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { AdBar } from "@/components/AdBar";
import { CircleSlash2, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseFilterString, ParsedFilters } from "@/utils/filterParser";
import { usePaginatedWheels, useWheels } from "@/hooks/useWheels";
import { useWheelsGridColumns } from "@/hooks/useWheelsGridColumns";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const LOAD_TIMEOUT_MS = 12_000;
const ROWS_PER_LOAD = 3;
/** Delay before loading next batch so it doesn't feel instant. */
const LOAD_MORE_DELAY_MS = 450;
/** Cooldown between load-more triggers so rapid scroll doesn't blast through. */
const LOAD_MORE_COOLDOWN_MS = 1200;

const getNumberFromText = (value?: string | null) => {
  const match = String(value ?? "").match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

const WheelsPage = () => {
  const columns = useWheelsGridColumns();
  const itemsPerLoad = ROWS_PER_LOAD * columns;
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("brandAsc");
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadMoreTimeRef = useRef(0);
  const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const itemsPerLoadRef = useRef(itemsPerLoad);
  itemsPerLoadRef.current = itemsPerLoad;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: wheels, isLoading, error, status, loadMore } = usePaginatedWheels(itemsPerLoad);
  const { data: allWheels, isLoading: isAllWheelsLoading } = useWheels();
  const isInitialLoading = status === "LoadingFirstPage";
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  // Filter facet options derived from Convex junction tables
  const filterOptions = useQuery(api.queries.wheelsFilterOptions, {}) ?? {
    brands: [] as string[],
    diameters: [] as string[],
    widths: [] as string[],
    boltPatterns: [] as string[],
    centerBores: [] as string[],
    tireSizes: [] as string[],
    colors: [] as string[],
  };

  useEffect(() => {
    if (!isInitialLoading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isInitialLoading]);

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
    const tireSizes = searchParams.getAll('tireSize');
    if (tireSizes.length > 0) newParsedFilters.tireSize = tireSizes;
    const colors = searchParams.getAll('color');
    if (colors.length > 0) newParsedFilters.color = colors;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  // Reset flipped cards when filters change
  useEffect(() => {
    setFlippedCards({});
  }, [searchTags, parsedFilters]);

  const hasActiveCollectionFilters =
    searchTags.length > 0 ||
    Object.values(parsedFilters).some((values) => (values?.length ?? 0) > 0);

  const sourceWheels = hasActiveCollectionFilters ? allWheels : wheels;
  const isGridLoading = hasActiveCollectionFilters ? isAllWheelsLoading : isInitialLoading;

  // Infinite scroll: fetch next page from server when near bottom (saves DB bandwidth)
  useEffect(() => {
    if (hasActiveCollectionFilters) return;
    if (status !== "CanLoadMore") return;
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e?.isIntersecting) return;
        if (loadMoreRef.current === undefined) return;
        const now = Date.now();
        if (now - lastLoadMoreTimeRef.current < LOAD_MORE_COOLDOWN_MS) return;
        lastLoadMoreTimeRef.current = now;
        const load = itemsPerLoadRef.current;
        if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
        loadMoreTimeoutRef.current = setTimeout(() => {
          loadMoreTimeoutRef.current = undefined;
          loadMoreRef.current(load);
        }, LOAD_MORE_DELAY_MS);
      },
      { rootMargin: "120px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (loadMoreTimeoutRef.current) clearTimeout(loadMoreTimeoutRef.current);
    };
  }, [hasActiveCollectionFilters, status]);

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
    ['brand', 'diameter', 'width', 'boltPattern', 'centerBore', 'tireSize', 'color', 'search'].forEach(key => {
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
  const filteredWheels = (sourceWheels || []).filter(wheel => {
    const normalizeBoltPattern = (value: string) =>
      value.replace(/×/g, 'x').replace(/\s+/g, '').toLowerCase().trim();
    const normalizeTireSize = (value: string) =>
      value.replace(/\s+/g, '').toUpperCase().trim();

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
      const wheelBolt = wheel.bolt_pattern ? normalizeBoltPattern(wheel.bolt_pattern) : '';
      const matches = parsedFilters.boltPattern.some(bp =>
        wheelBolt.includes(normalizeBoltPattern(bp))
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

    if (parsedFilters.tireSize?.length) {
      const wheelTireSize = wheel.tire_size ? normalizeTireSize(wheel.tire_size) : '';
      const matches = parsedFilters.tireSize.some(ts =>
        wheelTireSize.includes(normalizeTireSize(ts))
      );
      if (!matches) return false;
    }

    if (parsedFilters.color?.length) {
      const matches = parsedFilters.color.some(c =>
        wheel.color?.toLowerCase().includes(c.toLowerCase())
      );
      if (!matches) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":
        return (a.wheel_name || '').localeCompare(b.wheel_name || '');
      case "nameDesc":
        return (b.wheel_name || '').localeCompare(a.wheel_name || '');
      case "brandDesc":
        return (b.brand_name || '').localeCompare(a.brand_name || '') ||
          (a.wheel_name || '').localeCompare(b.wheel_name || '');
      case "diameterAsc":
        return getNumberFromText(a.diameter) - getNumberFromText(b.diameter) ||
          (a.wheel_name || '').localeCompare(b.wheel_name || '');
      case "diameterDesc":
        return getNumberFromText(b.diameter) - getNumberFromText(a.diameter) ||
          (a.wheel_name || '').localeCompare(b.wheel_name || '');
      case "brandAsc":
      default:
        return (a.brand_name || '').localeCompare(b.brand_name || '') ||
          (a.wheel_name || '').localeCompare(b.wheel_name || '');
    }
  });

  const hasMore = !hasActiveCollectionFilters && status === "CanLoadMore";

  // One measurement per tag: split any "16 inch, 17 inch" into separate tags
  const oneValuePerTag = (vals: string[]): string[] =>
    [...new Set(vals.flatMap((v) => v.split(",").map((s) => s.trim()).filter(Boolean)))];

  // Build filter fields for secondary sidebar
  const filterFields = [
    { label: 'Brand', category: 'brand', values: oneValuePerTag(filterOptions.brands) },
    { label: 'Diameter', category: 'diameter', values: oneValuePerTag(filterOptions.diameters) },
    { label: 'Width', category: 'width', values: oneValuePerTag(filterOptions.widths) },
    { label: 'Bolt Pattern', category: 'boltPattern', values: oneValuePerTag(filterOptions.boltPatterns) },
    { label: 'Center Bore', category: 'centerBore', values: oneValuePerTag(filterOptions.centerBores) },
    { label: 'Tire Size', category: 'tireSize', values: oneValuePerTag(filterOptions.tireSizes ?? []) },
    { label: 'Color', category: 'color', values: oneValuePerTag(filterOptions.colors ?? []) },
  ];

  const sortOptions = [
    { label: "Brand A-Z", value: "brandAsc" },
    { label: "Brand Z-A", value: "brandDesc" },
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Diameter Low-High", value: "diameterAsc" },
    { label: "Diameter High-Low", value: "diameterDesc" },
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
      sortTitle="Sort Wheels"
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Wheels"
          options={sortOptions}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={filteredWheels.length}
        />
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto">
        {error ? (
          <Card className="p-8 text-center bg-destructive/5 border-destructive/20">
            <CircleSlash2 className="h-10 w-10 mx-auto mb-3 text-destructive/50" />
            <h3 className="text-base font-semibold text-destructive mb-1">Failed to Load Wheels</h3>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </Card>
        ) : loadTimedOut ? (
          <Card className="p-8 text-center max-w-md mx-auto bg-muted/20">
            <p className="text-amber-600 font-medium mb-2">Loading is taking longer than usual</p>
            <p className="text-sm text-muted-foreground">
              Check that <code className="bg-muted px-1 rounded">VITE_CONVEX_URL</code> is set in <code className="bg-muted px-1 rounded">.env.local</code> and that <code className="bg-muted px-1 rounded">npx convex dev</code> is running (or your Convex deployment is up). Then refresh the page.
            </p>
          </Card>
        ) : isGridLoading ? (
          <Card className="p-8 text-center bg-muted/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground">Loading wheels...</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <WheelsGrid
              wheels={filteredWheels}
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

export default WheelsPage;
