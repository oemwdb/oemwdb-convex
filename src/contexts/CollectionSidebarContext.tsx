import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { FilterField } from "@/components/collection/CollectionSecondarySidebar";

export interface PersistedCollectionSidebarConfig {
  title: string;
  basePath: string;
  filterFields: FilterField[];
  searchPlaceholder?: string;
}

interface CollectionSidebarContextValue {
  configs: Record<string, PersistedCollectionSidebarConfig>;
  filterPanelOpenByContextKey: Record<string, boolean>;
  registerConfig: (contextKey: string, config: PersistedCollectionSidebarConfig) => void;
  getConfig: (contextKey: string) => PersistedCollectionSidebarConfig | undefined;
  setFilterPanelOpen: (contextKey: string, open: boolean) => void;
  setActiveCollectionContext: (contextKey?: string) => void;
}

const CollectionSidebarContext = createContext<CollectionSidebarContextValue | undefined>(undefined);

export function CollectionSidebarProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, PersistedCollectionSidebarConfig>>({});
  const [filterPanelOpenByContextKey, setFilterPanelOpenByContextKey] = useState<Record<string, boolean>>({});
  const [activeCollectionContextKey, setActiveCollectionContextKey] = useState<string | undefined>(undefined);

  const registerConfig = useCallback((contextKey: string, config: PersistedCollectionSidebarConfig) => {
    setConfigs((current) => {
      const existing = current[contextKey];
      if (
        existing &&
        existing.title === config.title &&
        existing.basePath === config.basePath &&
        existing.searchPlaceholder === config.searchPlaceholder &&
        JSON.stringify(existing.filterFields) === JSON.stringify(config.filterFields)
      ) {
        return current;
      }
      return {
        ...current,
        [contextKey]: config,
      };
    });
  }, []);

  const getConfig = useCallback(
    (contextKey: string) => configs[contextKey],
    [configs],
  );

  const setFilterPanelOpen = useCallback((contextKey: string, open: boolean) => {
    setFilterPanelOpenByContextKey((current) => {
      if ((current[contextKey] ?? false) === open) {
        return current;
      }
      return {
        ...current,
        [contextKey]: open,
      };
    });
  }, []);

  const setActiveCollectionContext = useCallback((contextKey?: string) => {
    setActiveCollectionContextKey((current) => {
      if (current === contextKey) {
        return current;
      }

      setFilterPanelOpenByContextKey((panelState) => {
        if (Object.keys(panelState).length === 0) {
          return panelState;
        }
        return Object.fromEntries(
          Object.keys(panelState).map((key) => [key, false]),
        );
      });

      return contextKey;
    });
  }, []);

  const value = useMemo<CollectionSidebarContextValue>(
    () => ({
      configs,
      filterPanelOpenByContextKey,
      registerConfig,
      getConfig,
      setFilterPanelOpen,
      setActiveCollectionContext,
    }),
    [
      configs,
      filterPanelOpenByContextKey,
      registerConfig,
      getConfig,
      setFilterPanelOpen,
      setActiveCollectionContext,
    ],
  );

  return (
    <CollectionSidebarContext.Provider value={value}>
      {children}
    </CollectionSidebarContext.Provider>
  );
}

export function useCollectionSidebarContext() {
  const context = useContext(CollectionSidebarContext);
  if (!context) {
    throw new Error("useCollectionSidebarContext must be used within a CollectionSidebarProvider");
  }
  return context;
}
