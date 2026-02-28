import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CollectionType, COLLECTION_CONFIGS } from "@/types/collection";

export interface CollectionFilters {
  [key: string]: unknown;
}

export function useCollectionSearch(collectionType: CollectionType) {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<CollectionFilters>({});

  const config = COLLECTION_CONFIGS[collectionType];

  const fetchedOptions = useQuery(api.queries.collectionFilterOptions, {
    collectionType,
  });

  const filterOptions: Record<string, string[]> = useMemo(() => {
    const options: Record<string, string[]> = {};
    const dropdownFields = config.filterableFields.filter(
      (f) => f.type === "dropdown"
    );
    for (const field of dropdownFields) {
      if (field.options && field.options.length > 0) {
        options[field.key] = field.options;
      } else if (fetchedOptions && typeof fetchedOptions === "object") {
        const key = field.key as keyof typeof fetchedOptions;
        const arr = fetchedOptions[key];
        if (Array.isArray(arr)) options[field.key] = arr;
      }
    }
    return options;
  }, [config.filterableFields, fetchedOptions]);

  const searchQuery = useMemo(() => {
    if (!searchText.trim()) return "";
    const searchableFields = config.searchableFields.map((f) => f.key);
    const conditions = searchableFields.map(
      (field) => `"${field}".ilike.%${searchText}%`
    );
    return conditions.length > 0 ? `or(${conditions.join(",")})` : "";
  }, [searchText, config.searchableFields]);

  const updateSearchText = (text: string) => setSearchText(text);

  const updateFilter = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
  };

  return {
    searchText,
    updateSearchText,
    filters,
    updateFilter,
    clearFilters,
    searchQuery,
    filterOptions,
    config,
  };
}
