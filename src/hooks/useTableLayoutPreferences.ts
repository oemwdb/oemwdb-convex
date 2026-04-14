import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ColumnTabGroup, TableColumn } from "@/types/database";

const DEFAULT_COLUMN_WIDTH = 220;
const MIN_COLUMN_WIDTH = 120;
const MAX_COLUMN_WIDTH = 640;

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
};

const parseLabelOverrides = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, label]) => typeof key === "string" && typeof label === "string"
    )
  );
};

const parseColumnGroups = (value: unknown): ColumnTabGroup[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((group) => {
    if (!group || typeof group !== "object") return [];
    const candidate = group as Partial<ColumnTabGroup>;
    const isValid = (
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      Array.isArray(candidate.columnIds) &&
      candidate.columnIds.every((columnId) => typeof columnId === "string")
    );
    if (!isValid) return [];

    return [{
      id: candidate.id,
      name: candidate.name,
      columnIds: candidate.columnIds,
      color: typeof candidate.color === "string" ? candidate.color : undefined,
    }];
  });
};

const parseColumnWidths = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, width]) => {
      if (typeof key !== "string" || typeof width !== "number" || Number.isNaN(width)) {
        return [];
      }

      return [[key, Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, Math.round(width)))]];
    })
  );
};

const rehydrateOrderedKeys = (storedKeys: string[], defaultColumns: TableColumn[]) => {
  const defaultKeys = defaultColumns.map((column) => column.key);
  const uniqueStoredKeys = storedKeys.filter((key, index) => storedKeys.indexOf(key) === index);
  const orderedKeys = uniqueStoredKeys.filter((key) => defaultKeys.includes(key));
  const unseenDefaultKeys = defaultKeys.filter((key) => !orderedKeys.includes(key));
  return [...orderedKeys, ...unseenDefaultKeys];
};

const safeParseJson = <T,>(value: string | undefined, parser: (input: unknown) => T, fallback: T) => {
  if (!value) return fallback;
  try {
    return parser(JSON.parse(value));
  } catch {
    return fallback;
  }
};

const buildStorageKeys = (tableName: string) => ({
  columnOrder: `table_column_order_${tableName}`,
  hiddenColumns: `table_hidden_columns_${tableName}`,
  columnGroups: `table_column_groups_v2_${tableName}`,
  columnLabels: `table_column_labels_${tableName}`,
  columnWidths: `table_column_widths_${tableName}`,
  hiddenTables: "oemwdb.hiddenTables",
});

const buildLayoutSignature = ({
  orderedKeys,
  hiddenColumnIds,
  columnLabelOverrides,
  columnTabGroups,
  columnWidths,
  hiddenTableNames,
}: {
  orderedKeys: string[];
  hiddenColumnIds: string[];
  columnLabelOverrides: Record<string, string>;
  columnTabGroups: ColumnTabGroup[];
  columnWidths: Record<string, number>;
  hiddenTableNames: string[];
}) =>
  JSON.stringify({
    orderedKeys,
    hiddenColumnIds,
    columnLabelOverrides,
    columnTabGroups,
    columnWidths,
    hiddenTableNames,
  });

export function useTableLayoutPreferences(tableName: string, defaultColumns: TableColumn[]) {
  const { user } = useAuth();
  const storageKeys = useMemo(() => buildStorageKeys(tableName), [tableName]);
  const pref = useQuery(
    api.queries.userTablePreferencesGetByUserAndTable,
    user?.id && tableName ? { userId: user.id, tableName } : "skip"
  );
  const upsertPref = useMutation(api.mutations.userTablePreferencesUpsert);

  const [orderedKeys, setOrderedKeys] = useState<string[]>(defaultColumns.map((column) => column.key));
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);
  const [columnLabelOverrides, setColumnLabelOverrides] = useState<Record<string, string>>({});
  const [columnTabGroups, setColumnTabGroups] = useState<ColumnTabGroup[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [hiddenTableNames, setHiddenTableNames] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastPersistedSignatureRef = useRef<string>("");

  const defaultColumnKeys = useMemo(
    () => defaultColumns.map((column) => column.key),
    [defaultColumns]
  );
  const hasPrefRecord = Boolean(pref?._id);

  const orderedColumns = useMemo(() => {
    const columnMap = new Map(defaultColumns.map((column) => [column.key, column]));
    const ordered = orderedKeys
      .map((key) => columnMap.get(key))
      .filter(Boolean)
      .map((column) => ({
        ...column!,
        width: columnWidths[column!.id] ?? column!.width ?? DEFAULT_COLUMN_WIDTH,
      })) as TableColumn[];

    const seenKeys = new Set(ordered.map((column) => column.key));
    const unseen = defaultColumns
      .filter((column) => !seenKeys.has(column.key))
      .map((column) => ({
        ...column,
        width: columnWidths[column.id] ?? column.width ?? DEFAULT_COLUMN_WIDTH,
      }));

    return [...ordered, ...unseen];
  }, [columnWidths, defaultColumns, orderedKeys]);

  useEffect(() => {
    const validColumnIds = new Set(defaultColumns.map((column) => column.id));

    const prefOrderedKeys = safeParseJson(pref?.column_order_json, parseStringArray, []);
    const prefHiddenColumns = safeParseJson(pref?.hidden_columns_json, parseStringArray, []);
    const prefLabelOverrides = safeParseJson(pref?.column_labels_json, parseLabelOverrides, {});
    const prefColumnGroups = safeParseJson(pref?.column_groups_json, parseColumnGroups, []);
    const prefColumnWidths = safeParseJson(pref?.column_widths_json, parseColumnWidths, {});
    const prefHiddenTables = safeParseJson(pref?.picker_hidden_tables_json, parseStringArray, []);

    const localOrderedKeys =
      typeof window === "undefined"
        ? []
        : safeParseJson(window.localStorage.getItem(storageKeys.columnOrder) ?? undefined, parseStringArray, []);
    const localHiddenColumns =
      typeof window === "undefined"
        ? []
        : safeParseJson(window.localStorage.getItem(storageKeys.hiddenColumns) ?? undefined, parseStringArray, []);
    const localLabelOverrides =
      typeof window === "undefined"
        ? {}
        : safeParseJson(window.localStorage.getItem(storageKeys.columnLabels) ?? undefined, parseLabelOverrides, {});
    const localColumnGroups =
      typeof window === "undefined"
        ? []
        : safeParseJson(window.localStorage.getItem(storageKeys.columnGroups) ?? undefined, parseColumnGroups, []);
    const localColumnWidths =
      typeof window === "undefined"
        ? {}
        : safeParseJson(window.localStorage.getItem(storageKeys.columnWidths) ?? undefined, parseColumnWidths, {});
    const localHiddenTables =
      typeof window === "undefined"
        ? []
        : safeParseJson(window.localStorage.getItem(storageKeys.hiddenTables) ?? undefined, parseStringArray, []);

    const nextOrderedKeys = rehydrateOrderedKeys(
      hasPrefRecord
        ? (pref?.column_order_json ? prefOrderedKeys : [])
        : localOrderedKeys,
      defaultColumns
    );
    const nextHiddenColumns = (hasPrefRecord
      ? (pref?.hidden_columns_json ? prefHiddenColumns : [])
      : localHiddenColumns).filter((id) =>
      validColumnIds.has(id)
    );
    const nextLabelOverrides = Object.fromEntries(
      Object.entries(
        hasPrefRecord
          ? (pref?.column_labels_json ? prefLabelOverrides : {})
          : localLabelOverrides
      ).filter(([columnId]) =>
          validColumnIds.has(columnId)
        )
    );
    const nextColumnGroups = (hasPrefRecord
      ? (pref?.column_groups_json ? prefColumnGroups : [])
      : localColumnGroups)
      .map((group) => ({
        ...group,
        columnIds: group.columnIds.filter((columnId) => validColumnIds.has(columnId)),
      }))
      .filter((group) => group.name.trim().length > 0);
    const nextColumnWidths = Object.fromEntries(
      Object.entries(
        hasPrefRecord
          ? (pref?.column_widths_json ? prefColumnWidths : {})
          : localColumnWidths
      ).filter(([columnId]) =>
          validColumnIds.has(columnId)
        )
    );
    const nextHiddenTables = hasPrefRecord
      ? (pref?.picker_hidden_tables_json ? prefHiddenTables : [])
      : localHiddenTables;

    setOrderedKeys(nextOrderedKeys);
    setHiddenColumnIds(nextHiddenColumns);
    setColumnLabelOverrides(nextLabelOverrides);
    setColumnTabGroups(nextColumnGroups);
    setColumnWidths(nextColumnWidths);
    setHiddenTableNames(nextHiddenTables);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.columnOrder, JSON.stringify(nextOrderedKeys));
      window.localStorage.setItem(storageKeys.hiddenColumns, JSON.stringify(nextHiddenColumns));
      window.localStorage.setItem(storageKeys.columnLabels, JSON.stringify(nextLabelOverrides));
      window.localStorage.setItem(storageKeys.columnGroups, JSON.stringify(nextColumnGroups));
      window.localStorage.setItem(storageKeys.columnWidths, JSON.stringify(nextColumnWidths));
      window.localStorage.setItem(storageKeys.hiddenTables, JSON.stringify(nextHiddenTables));
    }

    lastPersistedSignatureRef.current = buildLayoutSignature({
      orderedKeys: nextOrderedKeys,
      hiddenColumnIds: nextHiddenColumns,
      columnLabelOverrides: nextLabelOverrides,
      columnTabGroups: nextColumnGroups,
      columnWidths: nextColumnWidths,
      hiddenTableNames: nextHiddenTables,
    });
    setIsHydrated(true);
  }, [defaultColumns, hasPrefRecord, pref, storageKeys]);

  useEffect(() => {
    if (!isHydrated) return;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.columnOrder, JSON.stringify(orderedKeys));
      window.localStorage.setItem(storageKeys.hiddenColumns, JSON.stringify(hiddenColumnIds));
      window.localStorage.setItem(storageKeys.columnLabels, JSON.stringify(columnLabelOverrides));
      window.localStorage.setItem(storageKeys.columnGroups, JSON.stringify(columnTabGroups));
      window.localStorage.setItem(storageKeys.columnWidths, JSON.stringify(columnWidths));
      window.localStorage.setItem(storageKeys.hiddenTables, JSON.stringify(hiddenTableNames));
    }

    if (!user?.id || !tableName) return;

    const signature = buildLayoutSignature({
      orderedKeys,
      hiddenColumnIds,
      columnLabelOverrides,
      columnTabGroups,
      columnWidths,
      hiddenTableNames,
    });

    if (signature === lastPersistedSignatureRef.current) return;

    const timeout = window.setTimeout(async () => {
      try {
        await upsertPref({
          userId: user.id,
          tableName,
          columnOrderJson: JSON.stringify(orderedKeys),
          hiddenColumnsJson: JSON.stringify(hiddenColumnIds),
          columnLabelsJson: JSON.stringify(columnLabelOverrides),
          columnGroupsJson: JSON.stringify(columnTabGroups),
          columnWidthsJson: JSON.stringify(columnWidths),
          pickerHiddenTablesJson: JSON.stringify(hiddenTableNames),
        });
        lastPersistedSignatureRef.current = signature;
      } catch (error) {
        console.error("Error syncing table layout preferences:", error);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [
    columnLabelOverrides,
    columnTabGroups,
    columnWidths,
    hiddenColumnIds,
    hiddenTableNames,
    isHydrated,
    orderedKeys,
    storageKeys,
    tableName,
    upsertPref,
    user?.id,
  ]);

  const reorderColumns = useCallback((oldIndex: number, newIndex: number) => {
    setOrderedKeys((current) => {
      const next = [...current];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  }, []);

  const setColumnWidth = useCallback((columnId: string, width: number) => {
    const clampedWidth = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, Math.round(width)));
    setColumnWidths((current) => ({
      ...current,
      [columnId]: clampedWidth,
    }));
  }, []);

  const setColumnOrder = useCallback((nextKeys: string[]) => {
    setOrderedKeys(rehydrateOrderedKeys(nextKeys, defaultColumns));
  }, [defaultColumns]);

  const resetToDefault = useCallback(() => {
    setOrderedKeys(defaultColumnKeys);
    setHiddenColumnIds([]);
    setColumnLabelOverrides({});
    setColumnTabGroups([]);
    setColumnWidths({});
  }, [defaultColumnKeys]);

  return {
    orderedColumns,
    hiddenColumnIds,
    setHiddenColumnIds,
    columnLabelOverrides,
    setColumnLabelOverrides,
    columnTabGroups,
    setColumnTabGroups,
    hiddenTableNames,
    setHiddenTableNames,
    reorderColumns,
    setColumnOrder,
    setColumnWidth,
    resetToDefault,
    isHydrated,
  };
}
