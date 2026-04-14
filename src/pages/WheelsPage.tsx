import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WheelsGrid from "@/components/wheel/WheelsGrid";
import { CollectionAdminSidebar } from "@/components/collection/CollectionAdminSidebar";
import { CollectionDeleteHeaderButton } from "@/components/collection/CollectionDeleteHeaderButton";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
  useCollectionSecondarySidebarState,
} from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CircleSlash2, GitMerge, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParsedFilters } from "@/utils/filterParser";
import { useWheelsPage, wheelsFilterArgsFromSearchParams } from "@/hooks/useWheels";
import { useWheelsGridColumns } from "@/hooks/useWheelsGridColumns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import { useCollectionDuplicateControl } from "@/hooks/useCollectionDuplicateControl";
import { useCollectionDeleteControl } from "@/hooks/useCollectionDeleteControl";

const LOAD_TIMEOUT_MS = 12_000;
const ROWS_PER_LOAD = 3;

function findScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null;
  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null;
}

const WheelsPage = () => {
  const columns = useWheelsGridColumns();
  const itemsPerLoad = ROWS_PER_LOAD * columns;
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters>({});
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("brandAsc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [isEditingPageNumber, setIsEditingPageNumber] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const showAdminTools = isAdmin && isDevMode;
  const mergeWheels = useMutation(api.collectionMerges.mergeWheels);
  const deleteWheel = useMutation(api.mutations.wheelsDelete);
  const duplicateControl = useCollectionDuplicateControl({
    itemLabel: "wheels",
    onMerge: ({ canonicalId, duplicateIds }) =>
      mergeWheels({
        canonicalId: canonicalId as Id<"oem_wheels">,
        duplicateIds: duplicateIds as Id<"oem_wheels">[],
      }),
  });
  const deleteControl = useCollectionDeleteControl({
    itemLabel: "wheels",
    onDelete: async (ids) => {
      await Promise.all(ids.map((id) => deleteWheel({ id: id as Id<"oem_wheels"> })));
      return { deletedCount: ids.length };
    },
  });
  const filterArgs = {
    ...wheelsFilterArgsFromSearchParams(searchParams),
    sortBy,
  };

  const { data: wheels, isLoading, error, totalCount, totalPages, pageNumber } = useWheelsPage(
    currentPage,
    itemsPerLoad,
    filterArgs
  );
  const isInitialLoading = isLoading && wheels.length === 0;

  // Filter facet options derived from Convex junction tables
  const selectedBrands = searchParams.getAll("brand").filter(Boolean);
  const filterOptions = useQuery(api.queries.wheelsFilterOptions, {
    ...(selectedBrands.length > 0 ? { brand: selectedBrands } : {}),
  }) ?? {
    brands: [] as string[],
    diameters: [] as string[],
    widths: [] as string[],
    boltPatterns: [] as string[],
    centerBores: [] as string[],
    tireSizes: [] as string[],
    colors: [] as string[],
  };

  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isLoading]);

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
    const hasGoodPic = searchParams.getAll('hasGoodPic');
    if (hasGoodPic.length > 0) newParsedFilters.hasGoodPic = hasGoodPic;
    const hasBadPic = searchParams.getAll('hasBadPic');
    if (hasBadPic.length > 0) newParsedFilters.hasBadPic = hasBadPic;

    setParsedFilters(newParsedFilters);
  }, [searchParams]);

  // Reset flipped cards when filters change
  useEffect(() => {
    setFlippedCards({});
    setCurrentPage(1);
    duplicateControl.clearSelection();
    deleteControl.clearSelection();
  }, [searchTags, parsedFilters, itemsPerLoad, sortBy, duplicateControl.clearSelection, deleteControl.clearSelection]);

  useEffect(() => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [pageNumber, currentPage]);

  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    if (!isEditingPageNumber) return;
    pageInputRef.current?.focus();
    pageInputRef.current?.select();
  }, [isEditingPageNumber]);

  useEffect(() => {
    const scrollParent = findScrollParent(contentRef.current);
    if (scrollParent) {
      scrollParent.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [currentPage]);

  useEffect(() => {
    duplicateControl.clearSelection();
    deleteControl.clearSelection();
  }, [currentPage, duplicateControl.clearSelection, deleteControl.clearSelection]);

  const applySidebarFilters = (nextFilters: Record<string, string[] | undefined>, searchQuery: string) => {
    const params = new URLSearchParams(searchParams);
    ["brand", "diameter", "width", "boltPattern", "centerBore", "tireSize", "color", "hasGoodPic", "hasBadPic", "search"].forEach((key) => {
      params.delete(key);
    });
    Object.entries(nextFilters).forEach(([category, values]) => {
      (values ?? []).forEach((value) => params.append(category, value));
    });
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    params.delete("page");
    navigate(`/wheels?${params.toString()}`);
  };

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
    { label: "Diameter Low-High", value: "diameterAsc" },
    { label: "Diameter High-Low", value: "diameterDesc" },
  ];

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setCurrentPage(nextPage);
  };

  const commitPageInput = () => {
    const parsed = Number.parseInt(pageInputValue, 10);
    if (Number.isFinite(parsed)) {
      handlePageChange(parsed);
    }
    setPageInputValue(String(currentPage));
    setIsEditingPageNumber(false);
  };

  const buildPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-right", totalPages] as const;
    }
    if (currentPage >= totalPages - 3) {
      return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    }
    return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages] as const;
  };

  const pageItems = buildPageItems();
  const handleMergeControl = async () => {
    if (!duplicateControl.selectionMode) {
      deleteControl.clearSelection();
    }
    await duplicateControl.handleDuplicateControl();
  };
  const handleDeleteControl = async () => {
    if (!deleteControl.selectionMode) {
      duplicateControl.clearSelection();
    }
    await deleteControl.handleDeleteControl();
  };
  const selectedWheelLabels = duplicateControl.selectedIds
    .map((selectedId) => wheels.find((wheel) => (wheel.convexId ?? wheel.id) === selectedId)?.wheel_name)
    .filter((value): value is string => Boolean(value));
  const filterSidebarState = useCollectionSecondarySidebarState({
    title: "Filters",
    filterFields,
    parsedFilters: parsedFilters as Record<string, string[] | undefined>,
    onApply: ({ filters, searchQuery }) => applySidebarFilters(filters, searchQuery),
    searchPlaceholder: "Search wheels...",
    searchValue: searchTags[0] ?? "",
    totalResults: totalCount,
  });

  return (
    <DashboardLayout
      title="Wheels"
      showFilterButton={false}
      secondaryTitle="Filters"
      secondaryHeaderContent={<CollectionSecondarySidebarHeader state={filterSidebarState} />}
      secondarySidebar={<CollectionSecondarySidebarBody state={filterSidebarState} />}
      sortTitle="Sort Wheels"
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Wheels"
          options={sortOptions}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={totalCount}
        />
      }
      customTitle="Merge"
      customActionIcon={<GitMerge className="h-4 w-4" />}
      customSidebarSide="right"
      customSidebarInteractive={false}
      customSidebar={
        showAdminTools ? (
          <CollectionAdminSidebar
            itemLabel="wheels"
            selectionMode={duplicateControl.selectionMode}
            selectedCount={duplicateControl.selectedCount}
            selectedLabels={selectedWheelLabels}
            isMerging={duplicateControl.isMerging}
            onDuplicateControl={handleMergeControl}
            onClearSelection={duplicateControl.clearSelection}
          />
        ) : null
      }
      headerActions={
        showAdminTools ? (
          <CollectionDeleteHeaderButton
            itemLabel="wheels"
            selectionMode={deleteControl.selectionMode}
            selectedCount={deleteControl.selectedCount}
            isDeleting={deleteControl.isDeleting}
            onClick={handleDeleteControl}
          />
        ) : null
      }
      disableContentPadding={true}
    >
      <div ref={contentRef} className="h-full p-2">
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
        ) : isInitialLoading ? (
          <Card className="p-8 text-center bg-muted/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground">Loading wheels...</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <WheelsGrid
              wheels={wheels}
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
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {pageItems.map((item, index) =>
                    typeof item === "number" ? (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            handlePageChange(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`${item}-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    {isEditingPageNumber ? (
                      <Input
                        ref={pageInputRef}
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageInputValue}
                        onChange={(event) => setPageInputValue(event.target.value)}
                        onBlur={commitPageInput}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            commitPageInput();
                          }
                          if (event.key === "Escape") {
                            setPageInputValue(String(currentPage));
                            setIsEditingPageNumber(false);
                          }
                        }}
                        className="h-9 w-16 text-center"
                      />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setPageInputValue(String(currentPage));
                          setIsEditingPageNumber(true);
                        }}
                      >
                        #
                      </PaginationLink>
                    )}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WheelsPage;
