import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { View, Filter, Sort, GroupBy } from "@/types/database";

const CORE_TABLE_NAMES = ["oem_brands", "oem_vehicles", "oem_wheels"] as const;
export type CoreTableName = (typeof CORE_TABLE_NAMES)[number];

function isCoreTableName(name: string): name is CoreTableName {
  return CORE_TABLE_NAMES.includes(name as CoreTableName);
}

interface UseAdvancedTableOptions {
  tableName: CoreTableName;
  defaultView?: Partial<View>;
  pageSize?: number;
  enableRealtime?: boolean;
}

// Searchable fields per table (string fields we search with .includes)
const SEARCHABLE_FIELDS: Record<CoreTableName, string[]> = {
  oem_brands: ["brand_title", "brand_description", "id"],
  oem_vehicles: ["vehicle_title", "model_name", "brand_name", "id", "generation"],
  oem_wheels: ["wheel_title", "part_numbers", "brand_name", "id", "color", "notes"],
};

function normalizeSearchTerm(s: string): string {
  return s.trim().toLowerCase();
}

function rowMatchesSearch(row: Record<string, unknown>, searchLower: string, fields: string[]): boolean {
  if (!searchLower) return true;
  return fields.some((field) => {
    const val = row[field];
    if (val == null) return false;
    return String(val).toLowerCase().includes(searchLower);
  });
}

function rowMatchesFilter(row: Record<string, unknown>, filter: Filter): boolean {
  const val = row[filter.column];
  const fv = filter.value;
  switch (filter.operator) {
    case "equals":
      return val === fv;
    case "not_equals":
      return val !== fv;
    case "contains":
      return val != null && String(val).toLowerCase().includes(String(fv).toLowerCase());
    case "not_contains":
      return val == null || !String(val).toLowerCase().includes(String(fv).toLowerCase());
    case "is_empty":
      return val == null || val === "";
    case "is_not_empty":
      return val != null && val !== "";
    case "starts_with":
      return val != null && String(val).toLowerCase().startsWith(String(fv).toLowerCase());
    case "ends_with":
      return val != null && String(val).toLowerCase().endsWith(String(fv).toLowerCase());
    case "greater_than":
      return typeof val === "number" && typeof fv === "number" ? val > fv : Number(val) > Number(fv);
    case "less_than":
      return typeof val === "number" && typeof fv === "number" ? val < fv : Number(val) < Number(fv);
    default:
      return true;
  }
}

function applyFilters(rows: Record<string, unknown>[], filters: Filter[]): Record<string, unknown>[] {
  if (!filters.length) return rows;
  return rows.filter((row) => filters.every((f) => rowMatchesFilter(row, f)));
}

function applySorts(rows: Record<string, unknown>[], sorts: Sort[]): Record<string, unknown>[] {
  if (!sorts.length) return [...rows];
  return [...rows].sort((a, b) => {
    for (const sort of sorts) {
      const aVal = a[sort.column];
      const bVal = b[sort.column];
      const aCmp = aVal == null ? "" : String(aVal);
      const bCmp = bVal == null ? "" : String(bVal);
      const cmp = aCmp.localeCompare(bCmp, undefined, { numeric: true });
      const out = sort.direction === "desc" ? -cmp : cmp;
      if (out !== 0) return out;
    }
    return 0;
  });
}

export function useAdvancedTable({
  tableName,
  defaultView,
  pageSize = 50,
}: UseAdvancedTableOptions) {
  const [currentView, setCurrentView] = useState<View>({
    id: "default",
    name: "Default View",
    type: "table",
    filters: [],
    sorts: [],
    ...defaultView,
  });

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const brandsRaw = useQuery(api.queries.brandsGetAll, tableName === "oem_brands" ? {} : "skip");
  const vehiclesRaw = useQuery(
    api.queries.vehiclesGetAllWithBrands,
    tableName === "oem_vehicles" ? {} : "skip"
  );
  const wheelsRaw = useQuery(
    api.queries.wheelsGetAllWithBrands,
    tableName === "oem_wheels" ? {} : "skip"
  );

  const rawData = useMemo(() => {
    if (tableName === "oem_brands") return Array.isArray(brandsRaw) ? brandsRaw : [];
    if (tableName === "oem_vehicles") return Array.isArray(vehiclesRaw) ? vehiclesRaw : [];
    if (tableName === "oem_wheels") return Array.isArray(wheelsRaw) ? wheelsRaw : [];
    return [];
  }, [tableName, brandsRaw, vehiclesRaw, wheelsRaw]);

  const isLoading =
    (tableName === "oem_brands" && brandsRaw === undefined) ||
    (tableName === "oem_vehicles" && vehiclesRaw === undefined) ||
    (tableName === "oem_wheels" && wheelsRaw === undefined);

  const error = useMemo(() => {
    if (rawData.length === 0 && !isLoading) return null;
    return null;
  }, [rawData.length, isLoading]);

  const brandsUpdate = useMutation(api.mutations.brandsUpdate);
  const vehiclesUpdate = useMutation(api.mutations.vehiclesUpdate);
  const wheelsUpdate = useMutation(api.mutations.wheelsUpdate);
  const brandsDelete = useMutation(api.mutations.brandsDelete);
  const vehiclesDelete = useMutation(api.mutations.vehiclesDelete);
  const wheelsDelete = useMutation(api.mutations.wheelsDelete);

  const rowsWithId = useMemo(() => {
    return rawData.map((row: Record<string, unknown>) => ({
      ...row,
      id: row.id ?? (row._id as string),
    }));
  }, [rawData]);

  const filteredAndSorted = useMemo(() => {
    const searchLower = normalizeSearchTerm(debouncedSearchQuery);
    const fields = SEARCHABLE_FIELDS[tableName];
    let out = rowsWithId.filter((row) => rowMatchesSearch(row, searchLower, fields));
    out = applyFilters(out, currentView.filters);
    out = applySorts(out, currentView.sorts);
    return out.slice(0, pageSize);
  }, [rowsWithId, debouncedSearchQuery, currentView.filters, currentView.sorts, tableName, pageSize]);

  const data = useMemo(() => {
    return filteredAndSorted as Record<string, unknown>[];
  }, [filteredAndSorted]);

  const resolveConvexId = useCallback(
    (rowId: string): Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | null => {
      const row = rowsWithId.find(
        (r) => r.id === rowId || String(r._id) === rowId
      ) as (Record<string, unknown> & { _id: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> }) | undefined;
      return row?._id ?? null;
    },
    [rowsWithId]
  );

  const updateCellMutation = useCallback(
    async (rowId: string, column: string, value: unknown) => {
      const convexId = resolveConvexId(rowId);
      if (convexId == null) {
        toast({ title: "Error updating cell", description: "Row not found", variant: "destructive" });
        return;
      }
      try {
        const payload = { id: convexId, [column]: value } as Record<string, unknown>;
        if (tableName === "oem_brands") {
          await brandsUpdate(payload as Parameters<typeof brandsUpdate>[0]);
        } else if (tableName === "oem_vehicles") {
          await vehiclesUpdate(payload as Parameters<typeof vehiclesUpdate>[0]);
        } else {
          await wheelsUpdate(payload as Parameters<typeof wheelsUpdate>[0]);
        }
        toast({ title: "Cell updated successfully" });
        setEditingCell(null);
      } catch (err: unknown) {
        toast({
          title: "Error updating cell",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      }
    },
    [tableName, resolveConvexId, brandsUpdate, vehiclesUpdate, wheelsUpdate]
  );

  const deleteRowsMutation = useCallback(
    async (rowIds: string[]) => {
      const ids = rowIds.map((id) => resolveConvexId(id)).filter(Boolean) as (Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels">)[];
      if (ids.length === 0) return;
      try {
        if (tableName === "oem_brands") {
          for (const id of ids) await brandsDelete({ id: id as Id<"oem_brands"> });
        } else if (tableName === "oem_vehicles") {
          for (const id of ids) await vehiclesDelete({ id: id as Id<"oem_vehicles"> });
        } else {
          for (const id of ids) await wheelsDelete({ id: id as Id<"oem_wheels"> });
        }
        toast({ title: "Rows deleted successfully" });
        setSelectedRows(new Set());
      } catch (err: unknown) {
        toast({
          title: "Error deleting rows",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      }
    },
    [tableName, resolveConvexId, brandsDelete, vehiclesDelete, wheelsDelete]
  );

  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row: Record<string, unknown>) => row.id as string)));
    }
    setSelectAll(!selectAll);
  }, [selectAll, data]);

  const selectRange = useCallback(
    (startId: string, endId: string) => {
      if (!data.length) return;
      const startIndex = data.findIndex((row: Record<string, unknown>) => row.id === startId);
      const endIndex = data.findIndex((row: Record<string, unknown>) => row.id === endId);
      if (startIndex === -1 || endIndex === -1) return;
      const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const rangeIds = data.slice(from, to + 1).map((row: Record<string, unknown>) => row.id as string);
      setSelectedRows((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((id) => next.add(id));
        return next;
      });
    },
    [data]
  );

  const updateView = useCallback((updates: Partial<View>) => {
    setCurrentView((prev) => ({ ...prev, ...updates }));
  }, []);

  const addFilter = useCallback((filter: Filter) => {
    setCurrentView((prev) => ({ ...prev, filters: [...prev.filters, filter] }));
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setCurrentView((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => f.id !== filterId),
    }));
  }, []);

  const updateFilter = useCallback((filterId: string, updates: Partial<Filter>) => {
    setCurrentView((prev) => ({
      ...prev,
      filters: prev.filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f)),
    }));
  }, []);

  const addSort = useCallback((sort: Sort) => {
    setCurrentView((prev) => ({ ...prev, sorts: [...prev.sorts, sort] }));
  }, []);

  const removeSort = useCallback((column: string) => {
    setCurrentView((prev) => ({
      ...prev,
      sorts: prev.sorts.filter((s) => s.column !== column),
    }));
  }, []);

  const setGroupBy = useCallback((groupBy: GroupBy | undefined) => {
    setCurrentView((prev) => ({ ...prev, groupBy }));
  }, []);

  const groupedData = useMemo(() => {
    if (!data.length || !currentView.groupBy) return null;
    const groups = new Map<string, Record<string, unknown>[]>();
    data.forEach((row: Record<string, unknown>) => {
      const groupValue = String(row[currentView.groupBy!.column] ?? "Uncategorized");
      if (!groups.has(groupValue)) groups.set(groupValue, []);
      groups.get(groupValue)!.push(row);
    });
    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      items,
      collapsed: currentView.groupBy?.collapsed?.includes(key) ?? false,
    }));
  }, [data, currentView.groupBy]);

  const refetch = useCallback(() => {
    // Convex is reactive; no-op for API compatibility
  }, []);

  return {
    data: groupedData ?? data ?? [],
    isLoading,
    error,
    refetch,
    currentView,
    updateView,
    selectedRows,
    toggleRowSelection,
    toggleSelectAll,
    selectRange,
    selectAll,
    editingCell,
    setEditingCell,
    updateCell: (payload: { rowId: string; column: string; value: unknown }) =>
      updateCellMutation(payload.rowId, payload.column, payload.value),
    addFilter,
    removeFilter,
    updateFilter,
    addSort,
    removeSort,
    setGroupBy,
    searchQuery,
    setSearchQuery,
    deleteRows: (rowIds: string[]) => deleteRowsMutation(rowIds),
  };
}
