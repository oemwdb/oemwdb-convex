import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useCollectionSecondarySidebarState,
  type CollectionSecondarySidebarState,
  type FilterField,
} from "@/components/collection/CollectionSecondarySidebar";
import {
  useCollectionSidebarContext,
  type PersistedCollectionSidebarConfig,
} from "@/contexts/CollectionSidebarContext";

interface PersistedSidebarRegistrationConfig extends PersistedCollectionSidebarConfig {
  contextKey: string;
}

export function useRegisterPersistedCollectionSidebar({
  contextKey,
  ...config
}: PersistedSidebarRegistrationConfig) {
  const { registerConfig } = useCollectionSidebarContext();

  useEffect(() => {
    registerConfig(contextKey, config);
  }, [config, contextKey, registerConfig]);
}

export function usePersistedCollectionSidebarState(
  contextKey: string,
): { isAvailable: boolean; state: CollectionSecondarySidebarState } {
  const { getConfig, setFilterPanelOpen } = useCollectionSidebarContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const config = getConfig(contextKey);

  const filterFields: FilterField[] = config?.filterFields ?? [];
  const parsedFilters = useMemo<Record<string, string[] | undefined>>(() => {
    return Object.fromEntries(
      filterFields
        .map((field) => [field.category, searchParams.getAll(field.category)] as const)
        .filter(([, values]) => values.length > 0),
    );
  }, [filterFields, searchParams]);

  const searchValue = searchParams.get("search") ?? "";

  const state = useCollectionSecondarySidebarState({
    title: config?.title ?? "Filters",
    filterFields,
    parsedFilters,
    onApply: ({ filters, searchQuery }) => {
      if (!config) return;
      setFilterPanelOpen(contextKey, false);
      const params = new URLSearchParams(searchParams);
      [...filterFields.map((field) => field.category), "search"].forEach((key) => params.delete(key));
      Object.entries(filters).forEach(([category, values]) => {
        (values ?? []).forEach((value) => params.append(category, value));
      });
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      const query = params.toString();
      navigate(query ? `${config.basePath}?${query}` : config.basePath);
    },
    searchPlaceholder: config?.searchPlaceholder ?? "Search...",
    searchValue,
  });

  return {
    isAvailable: Boolean(config),
    state,
  };
}
