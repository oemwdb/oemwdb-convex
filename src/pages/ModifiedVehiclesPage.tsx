import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ModifiedVehiclesGrid from "@/components/modified-vehicle/ModifiedVehiclesGrid";
import {
  CollectionSecondarySidebarBody,
  CollectionSecondarySidebarHeader,
  useCollectionSecondarySidebarState,
} from "@/components/collection/CollectionSecondarySidebar";
import { CollectionSortSidebar } from "@/components/collection/CollectionSortSidebar";
import { useVehicleGridColumns } from "@/hooks/useWheelsGridColumns";
import { MODIFIED_VEHICLE_RECORDS } from "@/data/modifiedVehicles";

const ROWS_PER_LOAD = 3;

export default function ModifiedVehiclesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const columns = useVehicleGridColumns();
  const itemsPerLoad = ROWS_PER_LOAD * columns;
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState("brandAsc");

  const parsedFilters = useMemo<Record<string, string[] | undefined>>(() => {
    const filters: Record<string, string[] | undefined> = {};
    ["brand", "style", "builder"].forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) filters[key] = values;
    });
    return filters;
  }, [searchParams]);

  const searchValue = searchParams.get("search") ?? "";

  const filterFields = useMemo(() => {
    const brands = [...new Set(MODIFIED_VEHICLE_RECORDS.map((record) => record.brand))].sort();
    const styles = [...new Set(MODIFIED_VEHICLE_RECORDS.map((record) => record.style))].sort();
    const builders = [...new Set(MODIFIED_VEHICLE_RECORDS.map((record) => record.builder))].sort();
    return [
      { label: "Brand", category: "brand", values: brands },
      { label: "Style", category: "style", values: styles },
      { label: "Builder", category: "builder", values: builders },
    ];
  }, []);

  const applySidebarFilters = (nextFilters: Record<string, string[] | undefined>, nextSearchQuery: string) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([category, values]) => {
      (values ?? []).forEach((value) => params.append(category, value));
    });
    if (nextSearchQuery.trim()) params.set("search", nextSearchQuery.trim());
    navigate(`/builds${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const filterSidebarState = useCollectionSecondarySidebarState({
    title: "Filters",
    filterFields,
    parsedFilters,
    onApply: ({ filters, searchQuery }) => applySidebarFilters(filters, searchQuery),
    searchPlaceholder: "Search builds...",
    searchValue,
    totalResults: MODIFIED_VEHICLE_RECORDS.length,
  });

  const filteredBuilds = useMemo(() => {
    return MODIFIED_VEHICLE_RECORDS.filter((record) => {
      const query = searchValue.trim().toLowerCase();
      if (
        query &&
        ![
          record.title,
          record.brand,
          record.baseVehicle,
          record.builder,
          record.style,
          ...record.featureTags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }

      if (parsedFilters.brand?.length && !parsedFilters.brand.includes(record.brand)) return false;
      if (parsedFilters.style?.length && !parsedFilters.style.includes(record.style)) return false;
      if (parsedFilters.builder?.length && !parsedFilters.builder.includes(record.builder)) return false;
      return true;
    }).sort((left, right) => {
      switch (sortBy) {
        case "titleAsc":
          return left.title.localeCompare(right.title);
        case "titleDesc":
          return right.title.localeCompare(left.title);
        case "builderAsc":
          return left.builder.localeCompare(right.builder) || left.title.localeCompare(right.title);
        case "brandAsc":
        default:
          return left.brand.localeCompare(right.brand) || left.title.localeCompare(right.title);
      }
    });
  }, [parsedFilters, searchValue, sortBy]);

  const toggleCardFlip = (slug: string) => {
    setFlippedCards((current) => ({ ...current, [slug]: !current[slug] }));
  };

  return (
    <DashboardLayout
      title="Modified Vehicles"
      showFilterButton={false}
      secondaryTitle="Filters"
      secondaryHeaderContent={<CollectionSecondarySidebarHeader state={filterSidebarState} />}
      secondarySidebar={<CollectionSecondarySidebarBody state={filterSidebarState} />}
      sortTitle="Sort Builds"
      sortSidebar={
        <CollectionSortSidebar
          title="Sort Builds"
          options={[
            { label: "Brand A-Z", value: "brandAsc" },
            { label: "Builder A-Z", value: "builderAsc" },
            { label: "Title A-Z", value: "titleAsc" },
            { label: "Title Z-A", value: "titleDesc" },
          ]}
          selectedValue={sortBy}
          onChange={setSortBy}
          totalResults={filteredBuilds.length}
        />
      }
      disableContentPadding={true}
    >
      <div className="h-full overflow-y-auto p-2">
        <ModifiedVehiclesGrid
          builds={filteredBuilds}
          flippedCards={flippedCards}
          onFlip={toggleCardFlip}
          insertAdEvery={itemsPerLoad}
        />
      </div>
    </DashboardLayout>
  );
}
