import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ColorCard from "@/components/color/ColorCard";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
  useCollectionSecondarySidebarState,
} from "@/components/collection/CollectionSecondarySidebar";
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
import { useRegisterPersistedCollectionSidebar } from "@/hooks/usePersistedCollectionSidebar";

const sortText = (left: string, right: string) =>
  left.localeCompare(right, undefined, { sensitivity: "base" });

const uniqueText = (values: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  ).sort(sortText);

const normalizeColorsCollection = (payload: any) => {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];

  const grouped = new Map<string, any>();

  for (const row of rows) {
    const canonicalId = String(row?.color_id ?? row?._id ?? "");
    if (!canonicalId) continue;

    const current = grouped.get(canonicalId) ?? {
      _id: canonicalId,
      slug: canonicalId,
      color_title: String(row?.color_title ?? row?.color ?? "Untitled Color").trim() || "Untitled Color",
      family_title: row?.family_title ?? null,
      swatch_hex: row?.swatch_hex ?? null,
      brand_titles: [] as string[],
      source_labels: [] as string[],
      paint_codes: [] as string[],
      notes_list: [] as string[],
      manufacturer_code: row?.manufacturer_code ?? null,
      finish: row?.finish ?? null,
      wheelCount: Number(row?.wheelCount ?? 0),
      wheelVariantCount: Number(row?.wheelVariantCount ?? 0),
      vehicleCount: Number(row?.vehicleCount ?? 0),
      vehicleVariantCount: Number(row?.vehicleVariantCount ?? 0),
    };

    current.color_title =
      String(row?.color_title ?? row?.color ?? current.color_title ?? "Untitled Color").trim() || current.color_title;
    current.family_title = current.family_title ?? row?.family_title ?? null;
    current.swatch_hex = current.swatch_hex ?? row?.swatch_hex ?? null;
    current.manufacturer_code = current.manufacturer_code ?? row?.manufacturer_code ?? null;
    current.finish = current.finish ?? row?.finish ?? null;
    current.wheelCount = Math.max(current.wheelCount, Number(row?.wheelCount ?? 0));
    current.wheelVariantCount = Math.max(current.wheelVariantCount, Number(row?.wheelVariantCount ?? 0));
    current.vehicleCount = Math.max(current.vehicleCount, Number(row?.vehicleCount ?? 0));
    current.vehicleVariantCount = Math.max(current.vehicleVariantCount, Number(row?.vehicleVariantCount ?? 0));

    current.brand_titles = uniqueText([
      ...current.brand_titles,
      row?.brand_title,
      ...(Array.isArray(row?.brand_titles) ? row.brand_titles : []),
    ]);
    current.source_labels = uniqueText([
      ...current.source_labels,
      row?.source_label,
      ...(Array.isArray(row?.source_labels) ? row.source_labels : []),
    ]);
    current.paint_codes = uniqueText([
      ...current.paint_codes,
      ...(Array.isArray(row?.paint_codes) ? row.paint_codes : []),
    ]);
    current.notes_list = uniqueText([...current.notes_list, row?.notes]);

    grouped.set(canonicalId, current);
  }

  return Array.from(grouped.values())
    .map((row) => ({
      ...row,
      brand_title:
        row.brand_titles.length <= 1
          ? row.brand_titles[0] ?? null
          : `${row.brand_titles.length} brands`,
      notes: row.notes_list[0] ?? null,
      manufacturer_code:
        row.manufacturer_code ??
        (row.paint_codes.length === 1 ? row.paint_codes[0] : null),
    }))
    .sort((left, right) => sortText(left.color_title, right.color_title));
};

const ColorsPage = () => {
  const colorsResource = useConvexResourceQuery<any>({
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
    () => normalizeColorsCollection(colorsResource.data),
    [colorsResource.data]
  );

  useEffect(() => {
    setSearchTags(searchParams.getAll("search"));
    const next: Record<string, string[] | undefined> = {};
    ["brand", "source", "hasPaintCodes"].forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) next[key] = values;
    });
    setParsedFilters(next);
  }, [searchParams]);

  useEffect(() => {
    setFlippedCards({});
  }, [searchTags, parsedFilters, sortBy]);

  const applySidebarFilters = (nextFilters: Record<string, string[] | undefined>, searchQuery: string) => {
    const params = new URLSearchParams(searchParams);
    ["brand", "source", "hasPaintCodes", "search"].forEach((key) => params.delete(key));
    Object.entries(nextFilters).forEach(([category, values]) => {
      (values ?? []).forEach((value) => params.append(category, value));
    });
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
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
          ...(Array.isArray(color.brand_titles) ? color.brand_titles : []),
          ...(Array.isArray(color.source_labels) ? color.source_labels : []),
          ...(Array.isArray(color.paint_codes) ? color.paint_codes : []),
          color.finish,
          color.manufacturer_code,
          color.notes,
          color.legacy_color,
        ].some((value) => typeof value === "string" && value.toLowerCase().includes(search));
      });
    })
    .filter((color: any) => {
      if (
        parsedFilters.brand?.length &&
        !parsedFilters.brand.some((value) =>
          (Array.isArray(color.brand_titles) ? color.brand_titles : [color.brand_title]).includes(value)
        )
      ) {
        return false;
      }
      if (
        parsedFilters.source?.length &&
        !parsedFilters.source.some((value) =>
          (Array.isArray(color.source_labels) ? color.source_labels : []).includes(value)
        )
      ) {
        return false;
      }
      if (parsedFilters.hasPaintCodes?.includes("Yes") && !(Array.isArray(color.paint_codes) && color.paint_codes.length > 0)) return false;
      if (parsedFilters.hasPaintCodes?.includes("No") && Array.isArray(color.paint_codes) && color.paint_codes.length > 0) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "nameDesc":
          return b.color_title.localeCompare(a.color_title);
        case "mostBrands":
          return ((b.brand_titles?.length ?? 0) - (a.brand_titles?.length ?? 0)) || a.color_title.localeCompare(b.color_title);
        case "mostPaintCodes":
          return ((b.paint_codes?.length ?? 0) - (a.paint_codes?.length ?? 0)) || a.color_title.localeCompare(b.color_title);
        case "nameAsc":
        default:
          return a.color_title.localeCompare(b.color_title);
      }
    });

  const buildFilterValues = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const filterFields = [
    { label: "Brand", category: "brand", values: buildFilterValues(colors.flatMap((color: any) => color.brand_titles ?? [])) },
    { label: "Source", category: "source", values: buildFilterValues(colors.flatMap((color: any) => color.source_labels ?? [])) },
    { label: "Has Paint Codes", category: "hasPaintCodes", values: ["Yes", "No"] },
  ];

  const sortOptions = [
    { label: "Name A-Z", value: "nameAsc" },
    { label: "Name Z-A", value: "nameDesc" },
    { label: "Most Brands", value: "mostBrands" },
    { label: "Most Paint Codes", value: "mostPaintCodes" },
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
  const filterSidebarState = useCollectionSecondarySidebarState({
    title: "Color Filters",
    filterFields,
    parsedFilters,
    onApply: ({ filters, searchQuery }) => applySidebarFilters(filters, searchQuery),
    searchPlaceholder: "Search colors...",
    searchValue: searchTags[0] ?? "",
    totalResults: filteredColors.length,
  });
  useRegisterPersistedCollectionSidebar({
    contextKey: "colors",
    title: "Color Filters",
    basePath: "/colors",
    filterFields,
    searchPlaceholder: "Search colors...",
  });

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
      secondarySidebarContextKey="colors"
      secondaryHeaderContent={<CollectionSecondarySidebarHeader state={filterSidebarState} />}
      secondarySidebar={<CollectionSecondarySidebarBody state={filterSidebarState} />}
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
