import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ColorCard from "@/components/color/ColorCard";
import CollectionSecondarySidebar from "@/components/collection/CollectionSecondarySidebar";
import CollectionSortSidebar from "@/components/collection/CollectionSortSidebar";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";
import { CollectionAdminSidebar } from "@/components/collection/CollectionAdminSidebar";
import { CollectionDeleteHeaderButton } from "@/components/collection/CollectionDeleteHeaderButton";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";
import { useCollectionDuplicateControl } from "@/hooks/useCollectionDuplicateControl";
import { useCollectionDeleteControl } from "@/hooks/useCollectionDeleteControl";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { CircleSlash2, GitMerge, Loader2 } from "lucide-react";

const ColorsPage = () => {
  const colorsResource = useConvexResourceQuery<any[]>({
    queryKey: ["colors", "collection"],
    queryRef: api.colors.collectionGet,
    args: {},
    staleTime: 30_000,
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
  const [sortBy, setSortBy] = useState("nameAsc");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const showAdminTools = isAdmin && isDevMode;
  const mergeColors = useMutation(api.collectionMerges.mergeColors);
  const deleteColor = useMutation(api.mutations.colorsDelete);
  const duplicateControl = useCollectionDuplicateControl({
    itemLabel: "colors",
    onMerge: ({ canonicalId, duplicateIds }) =>
      mergeColors({
        canonicalId: canonicalId as Id<"oem_colors">,
        duplicateIds: duplicateIds as Id<"oem_colors">[],
      }),
  });
  const deleteControl = useCollectionDeleteControl({
    itemLabel: "colors",
    onDelete: async (ids) => {
      await Promise.all(ids.map((id) => deleteColor({ id: id as Id<"oem_colors"> })));
    },
  });

  const colors = useMemo(
    () => (Array.isArray(colorsResource.data) ? colorsResource.data : []),
    [colorsResource.data]
  );

  useEffect(() => {
    setSearchTags(searchParams.getAll("search"));
    const next: Record<string, string[] | undefined> = {};
    ["family", "brand", "finish", "hasHex"].forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) next[key] = values;
    });
    setParsedFilters(next);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
  }, [searchTags, parsedFilters, sortBy]);

  const handleTagClick = (tag: string, category: string) => {
    const params = new URLSearchParams(searchParams);
    const existing = params.getAll(category);
    if (existing.includes(tag)) {
      params.delete(category);
      existing.filter((value) => value !== tag).forEach((value) => params.append(category, value));
    } else {
      params.delete(category);
      existing.forEach((value) => params.append(category, value));
      params.append(category, tag);
    }
    navigate(`/colors?${params.toString()}`);
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    ["family", "brand", "finish", "hasHex", "search"].forEach((key) => params.delete(key));
    navigate(`/colors?${params.toString()}`);
  };

  const handleAddSearchTag = (tag: string) => {
    if (searchTags.includes(tag)) return;
    const params = new URLSearchParams(searchParams);
    params.append("search", tag);
    navigate(`/colors?${params.toString()}`);
  };

  const handleRemoveSearchTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    const allSearch = params.getAll("search");
    params.delete("search");
    allSearch.filter((value) => value !== tag).forEach((value) => params.append("search", value));
    navigate(`/colors?${params.toString()}`);
  };

  const filteredColors = colors
    .filter((color: any) => {
      if (!searchTags.length) return true;
      return searchTags.some((tag) => {
        const search = tag.toLowerCase();
        return [
          color.color_title,
          color.family_title,
          color.brand_title,
          color.finish,
          color.manufacturer_code,
          color.notes,
          color.legacy_color,
        ].some((value) => typeof value === "string" && value.toLowerCase().includes(search));
      });
    })
    .filter((color: any) => {
      if (parsedFilters.family?.length && !parsedFilters.family.includes(color.family_title || "")) return false;
      if (parsedFilters.brand?.length && !parsedFilters.brand.includes(color.brand_title || "")) return false;
      if (parsedFilters.finish?.length && !parsedFilters.finish.includes(color.finish || "")) return false;
      if (parsedFilters.hasHex?.includes("Yes") && !color.swatch_hex) return false;
      if (parsedFilters.hasHex?.includes("No") && color.swatch_hex) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "nameDesc":
          return b.color_title.localeCompare(a.color_title);
        case "familyAsc":
          return (a.family_title || "").localeCompare(b.family_title || "") || a.color_title.localeCompare(b.color_title);
        case "familyDesc":
          return (b.family_title || "").localeCompare(a.family_title || "") || a.color_title.localeCompare(b.color_title);
        case "mostWheels":
          return ((b.wheelCount ?? 0) + (b.wheelVariantCount ?? 0)) - ((a.wheelCount ?? 0) + (a.wheelVariantCount ?? 0)) || a.color_title.localeCompare(b.color_title);
        case "mostVehicles":
          return ((b.vehicleCount ?? 0) + (b.vehicleVariantCount ?? 0)) - ((a.vehicleCount ?? 0) + (a.vehicleVariantCount ?? 0)) || a.color_title.localeCompare(b.color_title);
        case "nameAsc":
        default:
          return a.color_title.localeCompare(b.color_title);
      }
    });

  const buildCountedValues = (values: string[]) =>
    Array.from(
      values.reduce((map, value) => {
        if (!value) return map;
        map.set(value, (map.get(value) ?? 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));

  const filterFields = [
    { label: "Family", category: "family", values: buildCountedValues(colors.map((color: any) => color.family_title).filter(Boolean)) },
    { label: "Brand", category: "brand", values: buildCountedValues(colors.map((color: any) => color.brand_title).filter(Boolean)) },
    { label: "Finish", category: "finish", values: buildCountedValues(colors.map((color: any) => color.finish).filter(Boolean)) },
    { label: "Has Hex", category: "hasHex", values: ["Yes", "No"] },
  ];

  const sortOptions = [
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Family A-Z", value: "familyAsc" },
    { label: "Family Z-A", value: "familyDesc" },
    { label: "Most Wheels", value: "mostWheels" },
    { label: "Most Vehicles", value: "mostVehicles" },
  ];

  const selectedColorLabels = duplicateControl.selectedIds
    .map((selectedId) => filteredColors.find((color) => String(color._id) === selectedId)?.color_title)
    .filter((value): value is string => Boolean(value));

  const handleMergeControl = async () => {
    if (!duplicateControl.selectionMode) deleteControl.clearSelection();
    await duplicateControl.handleDuplicateControl();
  };

  const handleDeleteControl = async () => {
    if (!deleteControl.selectionMode) duplicateControl.clearSelection();
    await deleteControl.handleDeleteControl();
  };

  if (colorsResource.isInitialLoading) {
    return (
      <DashboardLayout title="Colors" disableContentPadding={true}>
        <div className="flex h-full items-center justify-center p-2">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (colorsResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Colors" disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <ConvexBackendUnavailableCard
            title="Colors are not deployed on cloud dev yet"
            description="The canonical `colors.collectionGet` query is missing from the cloud dev Convex deployment."
            error={colorsResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (colorsResource.error) {
    return (
      <DashboardLayout title="Colors" disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <Card className="bg-muted/30">
            <CardContent className="p-12 text-center">
              <CircleSlash2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">Could not load colors</h2>
              <p className="text-muted-foreground">{getConvexErrorMessage(colorsResource.error)}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Colors"
      secondarySidebar={
        <CollectionSecondarySidebar
          title="Color Filters"
          filterFields={filterFields}
          parsedFilters={parsedFilters}
          onTagClick={handleTagClick}
          onClearAll={handleClearAllFilters}
          searchPlaceholder="Search colors..."
          searchTags={searchTags}
          onAddSearchTag={handleAddSearchTag}
          onRemoveSearchTag={handleRemoveSearchTag}
          totalResults={filteredColors.length}
        />
      }
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Colors"
          options={sortOptions}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={filteredColors.length}
        />
      }
      secondaryTitle="Filters"
      sortTitle="Sort"
      customTitle="Merge"
      customActionIcon={<GitMerge className="h-4 w-4" />}
      customSidebarSide="right"
      customSidebarInteractive={false}
      customSidebar={
        showAdminTools ? (
          <CollectionAdminSidebar
            itemLabel="colors"
            selectionMode={duplicateControl.selectionMode}
            selectedCount={duplicateControl.selectedCount}
            selectedLabels={selectedColorLabels}
            isMerging={duplicateControl.isMerging}
            onDuplicateControl={handleMergeControl}
            onClearSelection={duplicateControl.clearSelection}
          />
        ) : null
      }
      headerActions={
        showAdminTools ? (
          <CollectionDeleteHeaderButton
            itemLabel="colors"
            selectionMode={deleteControl.selectionMode}
            selectedCount={deleteControl.selectedCount}
            isDeleting={deleteControl.isDeleting}
            onClick={handleDeleteControl}
          />
        ) : null
      }
      disableContentPadding={true}
    >
      <div className="h-full overflow-y-auto p-2">
        {filteredColors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredColors.map((color: any) => (
              <SelectableCollectionCard
                key={String(color._id)}
                label={color.color_title}
                selectionMode={duplicateControl.selectionMode || deleteControl.selectionMode}
                selectedOrder={
                  (duplicateControl.selectionMode ? duplicateControl.selectedIds : deleteControl.selectedIds).indexOf(String(color._id)) + 1 || undefined
                }
                onToggleSelection={
                  duplicateControl.selectionMode
                    ? () => duplicateControl.toggleSelection(String(color._id))
                    : deleteControl.selectionMode
                      ? () => deleteControl.toggleSelection(String(color._id))
                      : undefined
                }
                selectionTone={deleteControl.selectionMode ? "delete" : "merge"}
              >
                <ColorCard
                  color={color}
                  isFlipped={flippedCards[String(color._id)] || false}
                  onFlip={(slug) =>
                    setFlippedCards((prev) => ({ ...prev, [String(color._id)]: !prev[String(color._id)] }))
                  }
                />
              </SelectableCollectionCard>
            ))}
          </div>
        ) : (
          <CollectionEmptyState
            title="No colors found"
            description="Try adjusting your search or filters to see more results."
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ColorsPage;
