import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import EngineCard from "@/components/engine/EngineCard";
import { CircleSlash2, GitMerge, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";
import { CollectionAdminSidebar } from "@/components/collection/CollectionAdminSidebar";
import { CollectionDeleteHeaderButton } from "@/components/collection/CollectionDeleteHeaderButton";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
  useCollectionSecondarySidebarState,
} from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { useCollectionDuplicateControl } from "@/hooks/useCollectionDuplicateControl";
import { useCollectionDeleteControl } from "@/hooks/useCollectionDeleteControl";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";
import type { OemEngineFamilyBrowseRow } from "@/types/oem";
import { getEngineFamilyCode, getEngineFamilyTitle } from "@/lib/engineDisplay";

const EnginesPage = () => {
    const [selectionIds, setSelectionIds] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
    const [sortBy, setSortBy] = useState("familyAsc");
    const { isDevMode } = useDevMode();
    const { isAdmin } = useAuth();
    const showAdminTools = isAdmin && isDevMode;
    const rawEngineFamilies = useQuery(api.queries.engineFamiliesBrowse);
    const error: Error | null = null;
    const isLoading = rawEngineFamilies === undefined;
    const engineFamilies = useMemo(() => {
      const rows = (rawEngineFamilies ?? []) as OemEngineFamilyBrowseRow[];
      const filtered = rows.filter((engine) => {
        const activeSearch = searchTags[0]?.trim().toLowerCase();
        if (activeSearch) {
          const matchesSearch = [
            getEngineFamilyTitle(engine),
            getEngineFamilyCode(engine),
            engine.brand_ref,
            engine.configuration,
            engine.engine_layout,
            engine.fuel_summary,
            engine.aspiration_summary,
          ].some((value) => String(value ?? "").toLowerCase().includes(activeSearch));
          if (!matchesSearch) return false;
        }

        const matchesBrand =
          !parsedFilters.brand?.length ||
          parsedFilters.brand.some((value) => (engine.brand_ref ?? "").toLowerCase().includes(value.toLowerCase()));
        if (!matchesBrand) return false;

        const matchesConfiguration =
          !parsedFilters.configuration?.length ||
          parsedFilters.configuration.some((value) => (engine.configuration ?? engine.engine_layout ?? "").toLowerCase() === value.toLowerCase());
        if (!matchesConfiguration) return false;

        const matchesFuel =
          !parsedFilters.fuel?.length ||
          parsedFilters.fuel.some((value) => (engine.fuel_summary ?? "").toLowerCase().includes(value.toLowerCase()));
        if (!matchesFuel) return false;

        const matchesAspiration =
          !parsedFilters.aspiration?.length ||
          parsedFilters.aspiration.some((value) => (engine.aspiration_summary ?? "").toLowerCase().includes(value.toLowerCase()));
        if (!matchesAspiration) return false;

        return true;
      });

      return [...filtered].sort((a, b) => {
        if (sortBy === "brandAsc") {
          return String(a.brand_ref ?? "").localeCompare(String(b.brand_ref ?? ""), undefined, { sensitivity: "base" });
        }
        if (sortBy === "variantsDesc") {
          return b.variant_count - a.variant_count;
        }
        if (sortBy === "vehiclesDesc") {
          return b.linked_vehicle_count - a.linked_vehicle_count;
        }
        return getEngineFamilyTitle(a).localeCompare(getEngineFamilyTitle(b), undefined, { sensitivity: "base" });
      });
    }, [parsedFilters, rawEngineFamilies, searchTags, sortBy]);

    const oneValuePerTag = (vals: string[]) =>
      [...new Set(vals.flatMap((v) => v.split(",").map((s) => s.trim()).filter(Boolean)))];

    const allRows = (rawEngineFamilies ?? []) as OemEngineFamilyBrowseRow[];
    const filterFields = [
      {
        label: "Brand",
        category: "brand",
        values: oneValuePerTag(allRows.map((engine) => engine.brand_ref ?? "").filter(Boolean)),
      },
      {
        label: "Configuration",
        category: "configuration",
        values: oneValuePerTag(allRows.map((engine) => engine.configuration ?? engine.engine_layout ?? "").filter(Boolean)),
      },
      {
        label: "Fuel",
        category: "fuel",
        values: oneValuePerTag(allRows.map((engine) => engine.fuel_summary ?? "").filter(Boolean)),
      },
      {
        label: "Aspiration",
        category: "aspiration",
        values: oneValuePerTag(allRows.map((engine) => engine.aspiration_summary ?? "").filter(Boolean)),
      },
    ];

    const sortOptions = [
      { label: "Family title", value: "familyAsc" },
      { label: "Brand", value: "brandAsc" },
      { label: "Most variants", value: "variantsDesc" },
      { label: "Most linked vehicles", value: "vehiclesDesc" },
    ];

    const applySidebarFilters = (filters: Record<string, string[] | undefined>, searchQuery: string) => {
      setParsedFilters(filters);
      setSearchTags(searchQuery.trim() ? [searchQuery.trim()] : []);
    };
    const duplicateControl = useCollectionDuplicateControl({
      itemLabel: "engines",
      onMerge: async () => {
        throw new Error("Engine merge is not wired yet.");
      },
    });
    const deleteControl = useCollectionDeleteControl({
      itemLabel: "engines",
      onDelete: async () => {
        throw new Error("Engine delete is not wired yet.");
      },
    });
    const controlsDisabled = true;
    const disabledReason = "Engine merge/delete backend wiring is still missing.";
    const filterSidebarState = useCollectionSecondarySidebarState({
      title: "Filters",
      filterFields,
      parsedFilters,
      onApply: ({ filters, searchQuery }) => applySidebarFilters(filters, searchQuery),
      searchPlaceholder: "Search engines...",
      searchValue: searchTags[0] ?? "",
      totalResults: engineFamilies.length,
    });

    if (isLoading) {
        return (
            <DashboardLayout title="Engines" disableContentPadding={true}>
                <div className="flex items-center justify-center py-24 p-2">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title="Engines" disableContentPadding={true}>
                <div className="p-2">
                    <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
                        <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
                        <h2 className="text-2xl font-bold mb-2 text-foreground">Error loading engines</h2>
                        <p className="text-muted-foreground">{error.message}</p>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
          title="OEM Engines"
          showFilterButton={false}
          secondaryTitle="Filters"
          secondaryHeaderContent={<CollectionSecondarySidebarHeader state={filterSidebarState} />}
          secondarySidebar={<CollectionSecondarySidebarBody state={filterSidebarState} />}
          sortTitle="Sort Engines"
          sortSidebar={
            <CollectionSortSidebar
              title="Sort Engines"
              options={sortOptions}
              selectedValue={sortBy}
              onChange={setSortBy}
              totalResults={engineFamilies.length}
            />
          }
          customTitle="Merge"
          customActionIcon={<GitMerge className="h-4 w-4" />}
          customSidebarSide="right"
          customSidebarInteractive={false}
          customSidebar={
            showAdminTools ? (
              <CollectionAdminSidebar
                itemLabel="engines"
                selectionMode={duplicateControl.selectionMode}
                selectedCount={duplicateControl.selectedCount}
                selectedLabels={selectionIds
                  .map((selectedId) => {
                    const engine = engineFamilies.find((row) => row.id === selectedId);
                    return engine ? getEngineFamilyTitle(engine) : null;
                  })
                  .filter((value): value is string => Boolean(value))}
                isMerging={duplicateControl.isMerging}
                onDuplicateControl={duplicateControl.handleDuplicateControl}
                onClearSelection={() => {
                  duplicateControl.clearSelection();
                  setSelectionIds([]);
                }}
                disabled={controlsDisabled}
                disabledReason={disabledReason}
              />
            ) : null
          }
          headerActions={
            showAdminTools ? (
              <CollectionDeleteHeaderButton
                itemLabel="engines"
                selectionMode={deleteControl.selectionMode}
                selectedCount={deleteControl.selectedCount}
                isDeleting={deleteControl.isDeleting}
                onClick={deleteControl.handleDeleteControl}
                disabled={controlsDisabled}
                disabledReason={disabledReason}
              />
            ) : null
          }
          disableContentPadding={true}
        >
            <div className="p-2 space-y-4">
                {/* Results count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {engineFamilies.length} engine families
                    </p>
                </div>

                {/* Engine Grid */}
                {engineFamilies.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {engineFamilies.map((engine) => (
                            <SelectableCollectionCard
                              key={engine.id}
                              label={getEngineFamilyTitle(engine)}
                              selectionMode={duplicateControl.selectionMode || deleteControl.selectionMode}
                              selectedOrder={
                                (duplicateControl.selectionMode ? duplicateControl.selectedIds : deleteControl.selectedIds).indexOf(engine.id) + 1 || undefined
                              }
                              onToggleSelection={
                                duplicateControl.selectionMode
                                  ? () => {
                                      duplicateControl.toggleSelection(engine.id);
                                      setSelectionIds((current) =>
                                        current.includes(engine.id) ? current.filter((value) => value !== engine.id) : [...current, engine.id]
                                      );
                                    }
                                  : deleteControl.selectionMode
                                    ? () => {
                                        deleteControl.toggleSelection(engine.id);
                                        setSelectionIds((current) =>
                                          current.includes(engine.id) ? current.filter((value) => value !== engine.id) : [...current, engine.id]
                                        );
                                      }
                                    : undefined
                              }
                              selectionTone={deleteControl.selectionMode ? "delete" : "merge"}
                            >
                              <EngineCard
                                  engine={engine}
                                  isFlipped={flippedCards[engine.id] || false}
                                  onFlip={(id) => setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }))}
                              />
                            </SelectableCollectionCard>
                        ))}
                    </div>
                ) : (
                  <CollectionEmptyState
                      title="No engine families found"
                      description={searchValue ? "Try a different engine-family or variant search." : "Try adjusting your search or filters to see more results."}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default EnginesPage;
