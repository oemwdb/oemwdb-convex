import React, { useState, useEffect, useMemo, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BrandsGrid from "@/components/brand/BrandsGrid";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { CollectionAdminSidebar } from "@/components/collection/CollectionAdminSidebar";
import { CollectionDeleteHeaderButton } from "@/components/collection/CollectionDeleteHeaderButton";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVehicleGridColumns } from "@/hooks/useWheelsGridColumns";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import { useCollectionDuplicateControl } from "@/hooks/useCollectionDuplicateControl";
import { useCollectionDeleteControl } from "@/hooks/useCollectionDeleteControl";
import { GitMerge } from "lucide-react";

const LOAD_TIMEOUT_MS = 12_000;
const ROWS_PER_LOAD = 3;
const LOAD_MORE_DELAY_MS = 650;
const LOAD_MORE_COOLDOWN_MS = 900;
const LOAD_MORE_ROOT_MARGIN = "420px";

const BrandsPage = () => {
  const columns = useVehicleGridColumns();
  const itemsPerLoad = ROWS_PER_LOAD * columns;
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
  const [sortBy, setSortBy] = useState("imageFirst");
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
  const mergeBrands = useMutation(api.collectionMerges.mergeBrands);
  const deleteBrand = useMutation(api.mutations.brandsDelete);
  const duplicateControl = useCollectionDuplicateControl({
    itemLabel: "brands",
    onMerge: ({ canonicalId, duplicateIds }) =>
      mergeBrands({
        canonicalId: canonicalId as Id<"oem_brands">,
        duplicateIds: duplicateIds as Id<"oem_brands">[],
      }),
  });
  const deleteControl = useCollectionDeleteControl({
    itemLabel: "brands",
    onDelete: async (ids) => {
      await Promise.all(ids.map((id) => deleteBrand({ id: id as Id<"oem_brands"> })));
      return { deletedCount: ids.length };
    },
  });

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
      id: String(b._id),
      name: b.brand_title ?? "Unknown",
      description: b.brand_description ?? null,
      imagelink: b.brand_image_url ?? b.good_pic_url ?? null,
      good_pic_url: b.good_pic_url ?? null,
      bad_pic_url: b.bad_pic_url ?? null,
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
    const hasGoodPic = searchParams.getAll('hasGoodPic');
    if (hasGoodPic.length > 0) newParsedFilters.hasGoodPic = hasGoodPic;
    const hasBadPic = searchParams.getAll('hasBadPic');
    if (hasBadPic.length > 0) newParsedFilters.hasBadPic = hasBadPic;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
    setVisibleCount(itemsPerLoad);
    duplicateControl.clearSelection();
    deleteControl.clearSelection();
  }, [searchTags, parsedFilters, itemsPerLoad, duplicateControl.clearSelection, deleteControl.clearSelection]);

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
    const params = new URLSearchParams(searchParams);
    ['hasWheels', 'hasImage', 'hasGoodPic', 'hasBadPic', 'search'].forEach((key) => {
      params.delete(key);
    });
    navigate(`/brands?${params.toString()}`);
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
      if (parsedFilters.hasGoodPic?.includes('Yes') && !brand.good_pic_url?.trim()) return false;
      if (parsedFilters.hasGoodPic?.includes('No') && brand.good_pic_url?.trim()) return false;
      if (parsedFilters.hasBadPic?.includes('Yes') && !brand.bad_pic_url?.trim()) return false;
      if (parsedFilters.hasBadPic?.includes('No') && brand.bad_pic_url?.trim()) return false;
      return true;
    })
    .sort((a, b) => {
      const aHasImage = !!(a.imagelink && a.imagelink.trim() !== '');
      const bHasImage = !!(b.imagelink && b.imagelink.trim() !== '');

      switch (sortBy) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "mostWheels":
          return (b.wheelCount ?? 0) - (a.wheelCount ?? 0) || a.name.localeCompare(b.name);
        case "mostVehicles":
          return (b.vehicleCount ?? 0) - (a.vehicleCount ?? 0) || a.name.localeCompare(b.name);
        case "imageFirst":
        default:
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          return a.name.localeCompare(b.name);
      }
    });

  totalCountRef.current = filteredBrands.length;
  const visibleBrands = filteredBrands.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBrands.length;

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
    { label: 'Has Wheels', category: 'hasWheels', values: ['Yes', 'No'] },
    { label: 'Has Image', category: 'hasImage', values: ['Yes', 'No'] },
    ...(isDevMode
      ? [
          { label: 'Has Good Pic', category: 'hasGoodPic', values: ['Yes', 'No'] },
          { label: 'Has Bad Pic', category: 'hasBadPic', values: ['Yes', 'No'] },
        ]
      : []),
  ];

  const sortOptions = [
    { label: "Has Image First", value: "imageFirst" },
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Most Wheels", value: "mostWheels" },
    { label: "Most Vehicles", value: "mostVehicles" },
  ];

  const selectedBrandLabels = duplicateControl.selectedIds
    .map((selectedId) => filteredBrands.find((brand) => (brand.id ?? brand.name) === selectedId)?.name)
    .filter((value): value is string => Boolean(value));
  const handleMergeControl = async () => {
    if (!duplicateControl.selectionMode) deleteControl.clearSelection();
    await duplicateControl.handleDuplicateControl();
  };
  const handleDeleteControl = async () => {
    if (!deleteControl.selectionMode) duplicateControl.clearSelection();
    await deleteControl.handleDeleteControl();
  };

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
      sortTitle="Sort Brands"
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Brands"
          options={sortOptions}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={filteredBrands.length}
        />
      }
      customTitle="Merge"
      customActionIcon={<GitMerge className="h-4 w-4" />}
      customSidebarSide="right"
      customSidebarInteractive={false}
      customSidebar={
        showAdminTools ? (
          <CollectionAdminSidebar
            itemLabel="brands"
            selectionMode={duplicateControl.selectionMode}
            selectedCount={duplicateControl.selectedCount}
            selectedLabels={selectedBrandLabels}
            isMerging={duplicateControl.isMerging}
            onDuplicateControl={handleMergeControl}
            onClearSelection={duplicateControl.clearSelection}
          />
        ) : null
      }
      headerActions={
        showAdminTools ? (
          <CollectionDeleteHeaderButton
            itemLabel="brands"
            selectionMode={deleteControl.selectionMode}
            selectedCount={deleteControl.selectedCount}
            isDeleting={deleteControl.isDeleting}
            onClick={handleDeleteControl}
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
          <div className="text-center py-10 text-muted-foreground">Loading brands...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">Failed to load brands.</div>
        ) : (
          <div className="flex flex-col gap-4" style={{ overflowAnchor: "none" }}>
            <BrandsGrid
              brands={visibleBrands}
              flippedCards={flippedCards}
              onFlip={toggleCardFlip}
              insertAdEvery={itemsPerLoad}
              selectionMode={duplicateControl.selectionMode || deleteControl.selectionMode}
              selectedIds={duplicateControl.selectionMode ? duplicateControl.selectedIds : deleteControl.selectedIds}
              onToggleSelection={
                duplicateControl.selectionMode
                  ? duplicateControl.toggleSelection
                  : deleteControl.selectionMode
                    ? deleteControl.toggleSelection
                    : undefined
              }
              selectionTone={deleteControl.selectionMode ? "delete" : "merge"}
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

export default BrandsPage;
