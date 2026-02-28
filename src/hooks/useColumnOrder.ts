import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TableColumn } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

const rehydrateColumns = (
  storedKeys: string[],
  defaultColumns: TableColumn[]
): TableColumn[] => {
  const columnMap = new Map(defaultColumns.map((col) => [col.key, col]));
  const ordered = storedKeys
    .map((key) => columnMap.get(key))
    .filter(Boolean) as TableColumn[];
  const orderedKeys = new Set(ordered.map((col) => col.key));
  const newColumns = defaultColumns.filter((col) => !orderedKeys.has(col.key));
  return [...ordered, ...newColumns];
};

export function useColumnOrder(tableName: string, defaultColumns: TableColumn[]) {
  const { user } = useAuth();
  const [orderedColumns, setOrderedColumns] = useState<TableColumn[]>(defaultColumns);

  const pref = useQuery(
    api.queries.userTablePreferencesGetByUserAndTable,
    user && tableName ? { userId: user.id, tableName } : "skip"
  );
  const upsertPref = useMutation(api.mutations.userTablePreferencesUpsert);
  const deletePref = useMutation(api.mutations.userTablePreferencesDelete);

  const isLoading = !!user && !!tableName && pref === undefined;

  useEffect(() => {
    if (pref?.column_order_json) {
      try {
        const storedKeys = JSON.parse(pref.column_order_json) as string[];
        setOrderedColumns(rehydrateColumns(storedKeys, defaultColumns));
        localStorage.setItem(
          `table_column_order_${tableName}`,
          pref.column_order_json
        );
        return;
      } catch {
        // invalid JSON, fall through
      }
    }
    if (pref === null || !user) {
      const stored = localStorage.getItem(`table_column_order_${tableName}`);
      if (stored) {
        try {
          const storedKeys = JSON.parse(stored) as string[];
          setOrderedColumns(rehydrateColumns(storedKeys, defaultColumns));
          return;
        } catch {
          // invalid
        }
      }
    }
    if (pref !== undefined) {
      setOrderedColumns(defaultColumns);
    }
  }, [pref, tableName, user, defaultColumns]);

  const reorderColumns = useCallback(
    async (oldIndex: number, newIndex: number) => {
      const newOrder = [...orderedColumns];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      setOrderedColumns(newOrder);
      const columnKeys = newOrder.map((col) => col.key);
      const columnOrderJson = JSON.stringify(columnKeys);
      localStorage.setItem(
        `table_column_order_${tableName}`,
        columnOrderJson
      );
      if (user?.id) {
        try {
          await upsertPref({
            userId: user.id,
            tableName,
            columnOrderJson,
          });
        } catch (err) {
          console.error("Error syncing column order:", err);
        }
      }
    },
    [orderedColumns, tableName, user?.id, upsertPref]
  );

  const resetToDefault = useCallback(async () => {
    setOrderedColumns(defaultColumns);
    localStorage.removeItem(`table_column_order_${tableName}`);
    if (user?.id) {
      try {
        await deletePref({ userId: user.id, tableName });
      } catch (err) {
        console.error("Error resetting column order:", err);
      }
    }
  }, [defaultColumns, tableName, user?.id, deletePref]);

  return {
    orderedColumns,
    reorderColumns,
    resetToDefault,
    isLoading,
  };
}
