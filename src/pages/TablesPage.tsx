import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdvancedTableView } from "@/components/database/AdvancedTableView";
import { FileListView } from "@/components/database/FileListView";
import { TableSelectorPanel } from "@/components/admin/TableSelectorPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdvancedTable } from "@/hooks/useAdvancedTable";
import { useTableLayoutPreferences } from "@/hooks/useTableLayoutPreferences";
import { useTableSelectorState } from "@/hooks/useTableSelectorState";
import { SCHEMA_CATALOG } from "@/lib/schemaVisualizer";
import { TABLE_CONFIGS } from "@/config/tableConfigs";
import type { TableColumn } from "@/types/database";
import { toast } from "sonner";
import {
  Columns3,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";

const CORE_TABLES = ["oem_brands", "oem_vehicles", "oem_wheels"] as const;
const REF_QUERY_TABLES = [
  "oem_bolt_patterns",
  "oem_center_bores",
  "oem_colors",
  "oem_diameters",
  "oem_widths",
  "users",
] as const;
const TABLE_SELECTION_RAIL_WIDTH = 48;
const TAB_ROW_HEIGHT = 42;

function mapRefRows<T extends { _id?: string; id?: string }>(
  rows: T[] | undefined,
): (T & { id: string })[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    ...row,
    id: String(row.id ?? row._id ?? ""),
  }));
}

function formatTableLabel(name: string) {
  return name
    .replace(/^ws_/, "ws ")
    .replace(/^j_/, "j ")
    .split("_")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function mapSchemaKindToCellType(kind: string): TableColumn["type"] {
  if (kind === "number") return "number";
  if (kind === "boolean") return "checkbox";
  if (kind === "relation") return "relation";
  if (kind === "array") return "tags";
  return "text";
}

function buildSchemaColumns(tableName: string): TableColumn[] {
  const schemaTable = SCHEMA_CATALOG.find((table) => table.name === tableName);
  if (!schemaTable) return [];

  const schemaColumns = schemaTable.fields.map<TableColumn>((field) => ({
    id: field.name,
    key: field.name,
    label: field.name,
    type: mapSchemaKindToCellType(field.kind),
  }));

  return [
    { id: "_id", key: "_id", label: "_id", type: "text" },
    ...schemaColumns,
    { id: "_creationTime", key: "_creationTime", label: "_creationTime", type: "number" },
  ];
}

function getColumnBoundaryMap(columns: TableColumn[], columnTabGroups: { columnIds: string[] }[]) {
  const visibleIds = columns.map((column) => column.id);
  const boundaries: Record<string, { left?: boolean; right?: boolean }> = {};

  for (const group of columnTabGroups) {
    const ids = visibleIds.filter((columnId) => group.columnIds.includes(columnId));
    if (!ids.length) continue;

    const first = ids[0];
    const last = ids[ids.length - 1];
    boundaries[first] = { ...(boundaries[first] ?? {}), left: true };
    boundaries[last] = { ...(boundaries[last] ?? {}), right: true };
  }

  return boundaries;
}

function uniqueColumnIds(columnIds: string[]) {
  return columnIds.filter((columnId, index) => columnIds.indexOf(columnId) === index);
}

function moveColumnBlock(orderedIds: string[], movingIds: string[], insertIndex: number) {
  const movingSet = new Set(movingIds);
  const block = orderedIds.filter((columnId) => movingSet.has(columnId));
  const remaining = orderedIds.filter((columnId) => !movingSet.has(columnId));
  const safeIndex = Math.max(0, Math.min(insertIndex, remaining.length));

  return [
    ...remaining.slice(0, safeIndex),
    ...block,
    ...remaining.slice(safeIndex),
  ];
}

export default function TablesPage() {
  const [activeTable, setActiveTable] = useState<string>("oem_brands");
  const [refSearchQuery, setRefSearchQuery] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [activeColumnTab, setActiveColumnTab] = useState<string>("all");
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showRenameGroupDialog, setShowRenameGroupDialog] = useState(false);
  const [groupNameDraft, setGroupNameDraft] = useState("");
  const [assignmentGroupId, setAssignmentGroupId] = useState<string | null>(null);
  const [tableHorizontalOffset, setTableHorizontalOffset] = useState(0);
  const selectorItems = useMemo(
    () =>
      SCHEMA_CATALOG.map((table) => ({
        name: table.name,
        label: formatTableLabel(table.name),
        baseGroup: table.group,
      })),
    [],
  );

  const isCoreTable = CORE_TABLES.includes(activeTable as (typeof CORE_TABLES)[number]);
  const isRefQueryTable = REF_QUERY_TABLES.includes(activeTable as (typeof REF_QUERY_TABLES)[number]);
  const isUsersTable = activeTable === "users";
  const needsGenericBrowser = !isCoreTable && !isRefQueryTable;

  const advancedTable = useAdvancedTable({
    tableName: isCoreTable ? (activeTable as "oem_brands" | "oem_vehicles" | "oem_wheels") : "oem_brands",
    defaultView: { type: "table", groupBy: undefined },
  });

  const boltPatterns = useQuery(
    api.queries.boltPatternsGetAll,
    activeTable === "oem_bolt_patterns" ? {} : "skip",
  );
  const centerBores = useQuery(
    api.queries.centerBoresGetAll,
    activeTable === "oem_center_bores" ? {} : "skip",
  );
  const colors = useQuery(
    api.queries.colorsGetAll,
    activeTable === "oem_colors" ? {} : "skip",
  );
  const diameters = useQuery(
    api.queries.diametersGetAll,
    activeTable === "oem_diameters" ? {} : "skip",
  );
  const widths = useQuery(
    api.queries.widthsGetAll,
    activeTable === "oem_widths" ? {} : "skip",
  );
  const profiles = useQuery(
    api.queries.profilesList,
    activeTable === "users" ? { search: refSearchQuery || undefined } : "skip",
  );
  const genericRows = useQuery(
    api.tableBrowser.rowsGet,
    needsGenericBrowser ? { tableName: activeTable, limit: 250, offset: 0 } : "skip",
  );

  const refData = useMemo(() => {
    if (activeTable === "oem_bolt_patterns") return mapRefRows(boltPatterns);
    if (activeTable === "oem_center_bores") return mapRefRows(centerBores);
    if (activeTable === "oem_colors") return mapRefRows(colors);
    if (activeTable === "oem_diameters") return mapRefRows(diameters);
    if (activeTable === "oem_widths") return mapRefRows(widths);
    if (activeTable === "users") return mapRefRows(profiles as any[] | undefined);
    return [];
  }, [activeTable, boltPatterns, centerBores, colors, diameters, profiles, widths]);

  const genericData = useMemo(
    () => mapRefRows((genericRows?.rows as any[] | undefined) ?? []),
    [genericRows?.rows],
  );

  const rawData = isCoreTable
    ? advancedTable.data ?? []
    : isRefQueryTable
      ? refData
      : genericData;

  const defaultColumns = useMemo(() => {
    const configured = TABLE_CONFIGS[activeTable];
    if (configured?.length) return configured;
    return buildSchemaColumns(activeTable);
  }, [activeTable]);

  const {
    orderedColumns,
    hiddenColumnIds,
    setHiddenColumnIds,
    columnTabGroups,
    setColumnTabGroups,
    resetToDefault,
    reorderColumns,
    setColumnOrder,
    setColumnWidth,
  } = useTableLayoutPreferences(activeTable, defaultColumns);

  const tableSelectorState = useTableSelectorState(selectorItems);
  const currentTable = selectorItems.find((table) => table.name === activeTable);

  const refIsLoading =
    (activeTable === "oem_bolt_patterns" && boltPatterns === undefined) ||
    (activeTable === "oem_center_bores" && centerBores === undefined) ||
    (activeTable === "oem_colors" && colors === undefined) ||
    (activeTable === "oem_diameters" && diameters === undefined) ||
    (activeTable === "oem_widths" && widths === undefined) ||
    (activeTable === "users" && profiles === undefined);

  const genericIsLoading = needsGenericBrowser && genericRows === undefined;

  const { data, isLoading, refetch, updateCell, deleteRows, searchQuery, setSearchQuery } = isCoreTable
    ? advancedTable
    : {
        data: rawData,
        isLoading: refIsLoading || genericIsLoading,
        refetch: () => {},
        updateCell: async () => {
          toast.info("Inline editing is not wired for this table yet.");
        },
        deleteRows: async () => {
          toast.info("Delete is not wired for this table yet.");
        },
        searchQuery: refSearchQuery,
        setSearchQuery: setRefSearchQuery,
      };

  useEffect(() => {
    setSelectedColumns(new Set());
    setActiveColumnTab("all");
    setAssignmentGroupId(null);
  }, [activeTable]);

  useEffect(() => {
    if (activeColumnTab === "all") return;
    if (!columnTabGroups.some((group) => group.id === activeColumnTab)) {
      setActiveColumnTab("all");
    }
  }, [activeColumnTab, columnTabGroups]);

  const activeColumnGroup =
    activeColumnTab === "all"
      ? null
      : columnTabGroups.find((group) => group.id === activeColumnTab) ?? null;

  const visibleColumnsForActiveTab = orderedColumns;

  const columnBoundaryMap = useMemo(
    () => getColumnBoundaryMap(visibleColumnsForActiveTab, columnTabGroups),
    [columnTabGroups, visibleColumnsForActiveTab],
  );

  const selectedColumnIds = orderedColumns
    .map((column) => column.id)
    .filter((columnId) => selectedColumns.has(columnId));

  const toggleColumnSelection = (columnId: string) => {
    setSelectedColumns((current) => {
      const next = new Set(current);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  };

  const toggleSelectAllColumns = () => {
    if (selectedColumns.size === orderedColumns.length) {
      setSelectedColumns(new Set());
      return;
    }
    setSelectedColumns(new Set(orderedColumns.map((column) => column.id)));
  };

  const handleCreateColumnGroup = () => {
    const nextName = groupNameDraft.trim() || `Tab ${columnTabGroups.length + 1}`;
    const exclusiveGroups = columnTabGroups.map((group) => ({
      ...group,
      columnIds: group.columnIds.filter((columnId) => !selectedColumnIds.includes(columnId)),
    }));

    const nextGroup = {
      id: `tab-${Date.now()}`,
      name: nextName,
      columnIds: uniqueColumnIds(selectedColumnIds),
    };

    setColumnTabGroups([...exclusiveGroups, nextGroup]);
    const orderedIds = orderedColumns.map((column) => column.id);
    const selectedOrderedIds = orderedIds.filter((columnId) => selectedColumnIds.includes(columnId));
    const firstSelectedIndex = orderedIds.findIndex((columnId) => selectedOrderedIds.includes(columnId));
    if (selectedOrderedIds.length && firstSelectedIndex !== -1) {
      setColumnOrder(moveColumnBlock(orderedIds, selectedOrderedIds, firstSelectedIndex));
    }
    setActiveColumnTab(nextGroup.id);
    setGroupNameDraft("");
    setShowCreateGroupDialog(false);
    toast.success(`Created ${nextName}`);
  };

  const handleRenameColumnGroup = () => {
    if (!activeColumnGroup) return;
    const nextName = groupNameDraft.trim();
    if (!nextName) return;

    setColumnTabGroups(
      columnTabGroups.map((group) =>
        group.id === activeColumnGroup.id ? { ...group, name: nextName } : group,
      ),
    );
    setShowRenameGroupDialog(false);
    setGroupNameDraft("");
    toast.success(`Renamed ${activeColumnGroup.name}`);
  };

  const handleReplaceActiveColumnGroup = () => {
    if (!activeColumnGroup) return;
    if (!selectedColumnIds.length) {
      toast.info("Select one or more columns first.");
      return;
    }

    setColumnTabGroups(
      columnTabGroups.map((group) => {
        const withoutSelected = group.columnIds.filter((columnId) => !selectedColumnIds.includes(columnId));
        return group.id === activeColumnGroup.id
          ? { ...group, columnIds: uniqueColumnIds(selectedColumnIds) }
          : { ...group, columnIds: withoutSelected };
      }),
    );
    const orderedIds = orderedColumns.map((column) => column.id);
    const selectedOrderedIds = orderedIds.filter((columnId) => selectedColumnIds.includes(columnId));
    const activeGroupFirstColumnId = activeColumnGroup.columnIds[0] ?? selectedOrderedIds[0];
    const remainingIds = orderedIds.filter((columnId) => !selectedOrderedIds.includes(columnId));
    const insertIndex = activeGroupFirstColumnId
      ? Math.max(0, remainingIds.indexOf(activeGroupFirstColumnId))
      : 0;
    if (selectedOrderedIds.length) {
      setColumnOrder(moveColumnBlock(orderedIds, selectedOrderedIds, insertIndex === -1 ? remainingIds.length : insertIndex));
    }
    toast.success(`Updated ${activeColumnGroup.name}`);
  };

  const handleAssignColumnToGroup = (columnId: string, groupId: string | null) => {
    const prunedGroups = columnTabGroups.map((group) => ({
      ...group,
      columnIds: group.columnIds.filter((id) => id !== columnId),
    }));

    if (!groupId) {
      setColumnTabGroups(prunedGroups);
      setActiveColumnTab("all");
      return;
    }

    const targetGroupBefore = columnTabGroups.find((group) => group.id === groupId) ?? null;
    const nextGroups = prunedGroups.map((group) =>
      group.id === groupId
        ? { ...group, columnIds: [...group.columnIds, columnId] }
        : group,
    );

    setColumnTabGroups(nextGroups);
    setActiveColumnTab(groupId);

    const orderedIds = orderedColumns.map((column) => column.id);
    if (!orderedIds.includes(columnId) || !targetGroupBefore?.columnIds.length) return;

    const anchorColumnId = targetGroupBefore.columnIds[targetGroupBefore.columnIds.length - 1];
    const remainingIds = orderedIds.filter((id) => id !== columnId);
    const anchorIndex = remainingIds.indexOf(anchorColumnId);
    const nextOrderedIds = moveColumnBlock(
      orderedIds,
      [columnId],
      anchorIndex === -1 ? remainingIds.length : anchorIndex + 1,
    );
    setColumnOrder(nextOrderedIds);
  };

  const handleAssignSelectedColumnsToGroup = (groupId: string) => {
    if (!selectedColumnIds.length) {
      setAssignmentGroupId(null);
      return;
    }

    const selectedOrderedIds = orderedColumns
      .map((column) => column.id)
      .filter((columnId) => selectedColumnIds.includes(columnId));
    const targetGroup = columnTabGroups.find((group) => group.id === groupId) ?? null;

    const nextGroups = columnTabGroups.map((group) => {
      const withoutSelected = group.columnIds.filter((columnId) => !selectedColumnIds.includes(columnId));
      return group.id === groupId
        ? { ...group, columnIds: uniqueColumnIds([...withoutSelected, ...selectedOrderedIds]) }
        : { ...group, columnIds: withoutSelected };
    });

    setColumnTabGroups(nextGroups);
    setActiveColumnTab(groupId);
    setAssignmentGroupId(null);
    setSelectedColumns(new Set());

    const orderedIds = orderedColumns.map((column) => column.id);
    const remainingIds = orderedIds.filter((columnId) => !selectedOrderedIds.includes(columnId));
    const targetAnchorId = targetGroup?.columnIds[0] ?? selectedOrderedIds[0];
    const insertIndex = targetAnchorId ? remainingIds.indexOf(targetAnchorId) : remainingIds.length;
    setColumnOrder(
      moveColumnBlock(
        orderedIds,
        selectedOrderedIds,
        insertIndex === -1 ? remainingIds.length : insertIndex,
      ),
    );
    toast.success(`Added ${selectedOrderedIds.length} column${selectedOrderedIds.length === 1 ? "" : "s"} to ${targetGroup?.name ?? "tab"}`);
  };

  const handleDeleteActiveColumnGroup = () => {
    if (!activeColumnGroup) return;
    setColumnTabGroups(columnTabGroups.filter((group) => group.id !== activeColumnGroup.id));
    setActiveColumnTab("all");
    toast.success(`Deleted ${activeColumnGroup.name}`);
  };

  const handleCellEdit = async (rowId: string, columnId: string, value: unknown) => {
    if (isCoreTable) {
      await updateCell({ rowId, column: columnId, value });
      return;
    }
    await updateCell();
  };

  const handleDeleteRows = async (rowIds: string[]) => {
    if (isCoreTable) {
      await deleteRows(rowIds);
      return;
    }
    await deleteRows();
  };

  const handleExport = () => {
    const rows = data ?? [];
    const csv = [
      visibleColumnsForActiveTab.map((column) => column.label).join(","),
      ...rows.map((row) =>
        visibleColumnsForActiveTab
          .map((column) => JSON.stringify((row as Record<string, unknown>)[column.key] ?? ""))
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeTable}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const handleCreateRecord = async (_data: Record<string, unknown>) => {
    toast.info("Create record will be wired table-by-table.");
    refetch();
  };

  const groupLayouts = useMemo(() => {
    const widths = orderedColumns.map((column) => column.width ?? 220);
    const offsets = new Map<string, number>();
    const widthMap = new Map<string, number>();
    let runningOffset = 0;
    let trailingLeft = TABLE_SELECTION_RAIL_WIDTH + 180;

    orderedColumns.forEach((column, index) => {
      offsets.set(column.id, runningOffset);
      widthMap.set(column.id, widths[index]);
      runningOffset += widths[index];
    });

    return columnTabGroups.map((group) => {
      const orderedGroupIds = orderedColumns
        .map((column) => column.id)
        .filter((columnId) => group.columnIds.includes(columnId));
      if (!orderedGroupIds.length) {
        const nextLayout = {
          id: group.id,
          name: group.name,
          left: trailingLeft,
          width: 180,
        };
        trailingLeft += 170;
        return nextLayout;
      }

      const firstId = orderedGroupIds[0];
      const lastId = orderedGroupIds[orderedGroupIds.length - 1];
      const start = offsets.get(firstId);
      const end = offsets.get(lastId);
      const lastWidth = widthMap.get(lastId);
      if (start === undefined) {
        const nextLayout = {
          id: group.id,
          name: group.name,
          left: trailingLeft,
          width: 180,
        };
        trailingLeft += 170;
        return nextLayout;
      }

      const width = end !== undefined && lastWidth !== undefined
        ? end + lastWidth - start
        : 180;

      trailingLeft = Math.max(trailingLeft, TABLE_SELECTION_RAIL_WIDTH + start + width);
      return {
        id: group.id,
        name: group.name,
        left: TABLE_SELECTION_RAIL_WIDTH + start,
        width,
      };
    });
  }, [columnTabGroups, orderedColumns]);

  const tabTrackWidth = useMemo(
    () =>
      TABLE_SELECTION_RAIL_WIDTH +
      orderedColumns.reduce((sum, column) => sum + (column.width ?? 220), 0) +
      24,
    [orderedColumns],
  );

  const columnTabsContent = (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          className="relative will-change-transform"
          style={{
            width: tabTrackWidth,
            height: TAB_ROW_HEIGHT,
            transform: `translateX(${-tableHorizontalOffset}px)`,
          }}
        >
        <button
          type="button"
          onClick={() => setActiveColumnTab("all")}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const columnId = event.dataTransfer.getData("text/plain");
            if (columnId) handleAssignColumnToGroup(columnId, null);
          }}
          className={`absolute bottom-0 rounded-t-xl border border-border/70 border-b-0 px-4 py-2 text-sm font-medium transition-colors ${
            activeColumnTab === "all"
              ? "bg-card text-foreground shadow-[0_-1px_0_rgba(255,255,255,0.08)]"
              : "bg-black/20 text-muted-foreground hover:bg-black/30 hover:text-foreground"
          }`}
          style={{ left: TABLE_SELECTION_RAIL_WIDTH }}
        >
          All columns
        </button>
          {groupLayouts.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveColumnTab(group.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const columnId = event.dataTransfer.getData("text/plain");
              if (columnId) handleAssignColumnToGroup(columnId, group.id);
            }}
            className={`absolute bottom-0 inline-flex items-center gap-2 rounded-t-xl border border-border/70 border-b-0 px-4 py-2 text-sm font-medium transition-colors ${
              activeColumnTab === group.id
                ? "bg-card text-foreground shadow-[0_-1px_0_rgba(255,255,255,0.08)]"
              : "bg-black/20 text-muted-foreground hover:bg-black/30 hover:text-foreground"
          }`}
            style={{ left: group.left, width: group.width }}
          >
            <span className="truncate">{group.name}</span>
            <span
              role="button"
              aria-label={`Assign columns to ${group.name}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (assignmentGroupId === group.id) {
                  handleAssignSelectedColumnsToGroup(group.id);
                  return;
                }
                setAssignmentGroupId(group.id);
                setSelectedColumns(new Set());
                setActiveColumnTab(group.id);
              }}
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                assignmentGroupId === group.id
                  ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-300"
                  : "border-border/70 text-muted-foreground hover:border-white/70 hover:text-foreground"
              }`}
            >
              <Settings2 className="h-3 w-3" />
            </span>
          </button>
        ))}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mb-2 h-8 gap-2 shrink-0"
        onClick={() => {
          setGroupNameDraft("");
          setShowCreateGroupDialog(true);
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        New tab
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title=""
      secondaryTitle="Tables"
      showSearch={false}
      showBreadcrumb={false}
      disableContentPadding
      leadingButtonContent={
        <span className="text-sm font-semibold text-foreground">
          {currentTable?.label ?? formatTableLabel(activeTable)}
        </span>
      }
      leadingButtonTitle="Open table selector"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh table"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={resetToDefault}
            title="Reset layout"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      }
      secondarySidebar={
        <TableSelectorPanel
          title="Table selector"
          items={selectorItems}
          activeTableName={activeTable}
          onSelectTable={setActiveTable}
          sections={tableSelectorState.sections}
          customGroups={tableSelectorState.customGroups}
          createGroup={tableSelectorState.createGroup}
          updateGroup={tableSelectorState.updateGroup}
          assignTablesToGroup={tableSelectorState.assignTablesToGroup}
          removeTablesFromGroup={tableSelectorState.removeTablesFromGroup}
          setGroupColor={tableSelectorState.setGroupColor}
          reorderCustomGroups={tableSelectorState.reorderCustomGroups}
          deleteGroup={tableSelectorState.deleteGroup}
        />
      }
    >
      <div className="flex h-full flex-col p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="border-b border-border/70 px-3 pt-3">
            <div className="flex flex-wrap items-center justify-end gap-2 pb-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-2">
                      <Columns3 className="h-3.5 w-3.5" />
                      Columns
                      {selectedColumns.size > 0 ? (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-foreground">
                          {selectedColumns.size}
                        </span>
                      ) : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="text-xs">Choose columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {orderedColumns.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="text-xs"
                        checked={selectedColumns.has(column.id)}
                        onCheckedChange={() => toggleColumnSelection(column.id)}
                      >
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onClick={toggleSelectAllColumns}>
                      {selectedColumns.size === orderedColumns.length
                        ? "Clear all selected columns"
                        : "Select all columns"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={!activeColumnGroup}
                  onClick={() => {
                    setGroupNameDraft(activeColumnGroup?.name ?? "");
                    setShowRenameGroupDialog(true);
                  }}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Rename
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={!activeColumnGroup || !selectedColumnIds.length}
                  onClick={handleReplaceActiveColumnGroup}
                >
                  Replace
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-destructive"
                  disabled={!activeColumnGroup}
                  onClick={handleDeleteActiveColumnGroup}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {isCoreTable ? (
              <AdvancedTableView
                key={activeTable}
                data={data}
                columns={visibleColumnsForActiveTab}
                selectedRows={advancedTable.selectedRows}
                selectedColumns={selectedColumns}
                onToggleRowSelection={advancedTable.toggleRowSelection}
                onToggleSelectAll={advancedTable.toggleSelectAll}
                onToggleColumnSelection={toggleColumnSelection}
                onToggleSelectAllColumns={toggleSelectAllColumns}
                onCellEdit={handleCellEdit}
                editingCell={advancedTable.editingCell}
                onStartEdit={(rowId, columnId) => advancedTable.setEditingCell({ rowId, columnId })}
                onCancelEdit={() => advancedTable.setEditingCell(null)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={advancedTable.currentView.filters}
                onAddFilter={advancedTable.addFilter}
                onRemoveFilter={advancedTable.removeFilter}
                onUpdateFilter={advancedTable.updateFilter}
                sorts={advancedTable.currentView.sorts}
                onAddSort={advancedTable.addSort}
                onRemoveSort={advancedTable.removeSort}
                groupBy={advancedTable.currentView.groupBy}
                onSetGroupBy={advancedTable.setGroupBy}
                isLoading={isLoading}
                viewType={advancedTable.currentView.type}
                onViewTypeChange={(type) => advancedTable.updateView({ type: type as typeof advancedTable.currentView.type })}
                onDeleteRows={handleDeleteRows}
                onExport={() => handleExport()}
                tableName={activeTable}
                onAddRow={() => toast.info("Create row is still being wired for core tables.")}
                hiddenColumnIds={hiddenColumnIds}
                onHiddenColumnIdsChange={setHiddenColumnIds}
                onColumnResize={setColumnWidth}
                showGroupBy={false}
                columnBoundaryMap={columnBoundaryMap}
                tableTabsContent={columnTabsContent}
                focusColumnId={activeColumnGroup?.columnIds[0] ?? null}
                multiSelectColumns={assignmentGroupId !== null}
                onHorizontalScroll={setTableHorizontalOffset}
                onColumnHeaderDragStart={(columnId, event) => {
                  event.dataTransfer.setData("text/plain", columnId);
                  event.dataTransfer.effectAllowed = "move";
                }}
              />
            ) : (
              <FileListView
                key={activeTable}
                data={data}
                columns={visibleColumnsForActiveTab}
                tableName={activeTable}
                isLoading={isLoading}
                onRefetch={refetch}
                onCellEdit={handleCellEdit}
                onDeleteRows={handleDeleteRows}
                onExport={handleExport}
                onCreateRecord={handleCreateRecord}
                searchQuery={searchQuery}
                onColumnReorder={reorderColumns}
                columnBoundaryMap={columnBoundaryMap}
                tableTabsContent={columnTabsContent}
                focusColumnId={activeColumnGroup?.columnIds[0] ?? null}
                onHorizontalScroll={setTableHorizontalOffset}
                onColumnHeaderDragStart={(columnId, event) => {
                  event.dataTransfer.setData("text/plain", columnId);
                  event.dataTransfer.effectAllowed = "move";
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create column tab</DialogTitle>
            <DialogDescription>
              Create a tab group. Any currently selected columns will be added to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={groupNameDraft}
              onChange={(event) => setGroupNameDraft(event.target.value)}
              placeholder={`Tab ${columnTabGroups.length + 1}`}
            />
            <p className="text-xs text-muted-foreground">
              {selectedColumnIds.length} selected column{selectedColumnIds.length === 1 ? "" : "s"} will be added.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateColumnGroup}>Create tab</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameGroupDialog} onOpenChange={setShowRenameGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename column tab</DialogTitle>
            <DialogDescription>Update the label for the active saved tab.</DialogDescription>
          </DialogHeader>
          <Input
            value={groupNameDraft}
            onChange={(event) => setGroupNameDraft(event.target.value)}
            placeholder="Tab name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameColumnGroup}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
