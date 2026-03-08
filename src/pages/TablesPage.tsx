import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TableName } from "@/components/datatable/EditableDataTable";

import { toast } from "sonner";
import { FileListView } from "@/components/database/FileListView";
import { useColumnOrder } from "@/hooks/useColumnOrder";
import { useAdvancedTable } from "@/hooks/useAdvancedTable";
import { CreateRecordDialog } from "@/components/database/CreateRecordDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Car,
  Disc3,
  Target,
  Circle,
  Gauge,
  Ruler,
  Palette,
  Users,
  RefreshCw,
  Search,
  RotateCcw,
  Plus
} from "lucide-react";

import { TABLE_CONFIGS } from "@/config/tableConfigs";

const TABLES = [
  { name: "oem_brands", label: "Brands", icon: Package },
  { name: "oem_vehicles", label: "Vehicles", icon: Car },
  { name: "oem_wheels", label: "Wheels", icon: Disc3 },
  { name: "oem_bolt_patterns", label: "Bolt Patterns", icon: Target },
  { name: "oem_center_bores", label: "Center Bores", icon: Circle },
  { name: "oem_colors", label: "Colors", icon: Palette },
  { name: "oem_diameters", label: "Diameters", icon: Ruler },
  { name: "oem_widths", label: "Widths", icon: Gauge },
  { name: "users", label: "Users", icon: Users },
] as const;

const CORE_TABLES = ["oem_brands", "oem_vehicles", "oem_wheels"] as const;
const REF_TABLES = ["oem_bolt_patterns", "oem_center_bores", "oem_colors", "oem_diameters", "oem_widths"] as const;

function mapRefRows<T extends { _id: string }>(rows: T[] | undefined): (T & { id: string })[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({ ...r, id: String(r._id) }));
}

export default function TablesPage() {
  const [activeTable, setActiveTable] = useState<TableName>("oem_brands");
  const [refSearchQuery, setRefSearchQuery] = useState("");

  const isCoreTable = CORE_TABLES.includes(activeTable as (typeof CORE_TABLES)[number]);
  const isRefTable = REF_TABLES.includes(activeTable as (typeof REF_TABLES)[number]);
  const isUsersTable = activeTable === "users";

  const advancedTable = useAdvancedTable({
    tableName: isCoreTable ? (activeTable as "oem_brands" | "oem_vehicles" | "oem_wheels") : "oem_brands",
    defaultView: { type: "table", groupBy: undefined },
  });

  const boltPatterns = useQuery(
    activeTable === "oem_bolt_patterns" ? api.queries.boltPatternsGetAll : "skip",
    {}
  );
  const centerBores = useQuery(
    activeTable === "oem_center_bores" ? api.queries.centerBoresGetAll : "skip",
    {}
  );
  const colors = useQuery(activeTable === "oem_colors" ? api.queries.colorsGetAll : "skip", {});
  const diameters = useQuery(activeTable === "oem_diameters" ? api.queries.diametersGetAll : "skip", {});
  const widths = useQuery(activeTable === "oem_widths" ? api.queries.widthsGetAll : "skip", {});
  const profiles = useQuery(
    activeTable === "users" ? api.queries.profilesList : "skip",
    { search: refSearchQuery || undefined }
  );

  const refData = useMemo(() => {
    if (activeTable === "oem_bolt_patterns") return mapRefRows(boltPatterns);
    if (activeTable === "oem_center_bores") return mapRefRows(centerBores);
    if (activeTable === "oem_colors") return mapRefRows(colors);
    if (activeTable === "oem_diameters") return mapRefRows(diameters);
    if (activeTable === "oem_widths") return mapRefRows(widths);
    if (activeTable === "users") {
      if (!Array.isArray(profiles)) return [];
      return profiles.map((p) => ({ ...p, id: p.id ?? (p as { _id?: string })._id ?? "" }));
    }
    return [];
  }, [activeTable, boltPatterns, centerBores, colors, diameters, widths, profiles]);

  const refIsLoading =
    (activeTable === "oem_bolt_patterns" && boltPatterns === undefined) ||
    (activeTable === "oem_center_bores" && centerBores === undefined) ||
    (activeTable === "oem_colors" && colors === undefined) ||
    (activeTable === "oem_diameters" && diameters === undefined) ||
    (activeTable === "oem_widths" && widths === undefined) ||
    (activeTable === "users" && profiles === undefined);

  const { data, isLoading, refetch, updateCell, deleteRows, searchQuery, setSearchQuery } = isCoreTable
    ? advancedTable
    : {
        data: refData,
        isLoading: refIsLoading,
        refetch: () => {},
        updateCell: async () => {
          toast.info("Ref table edits not yet supported.");
        },
        deleteRows: async () => {
          toast.info("Ref table delete not yet supported.");
        },
        searchQuery: refSearchQuery,
        setSearchQuery: setRefSearchQuery,
      };

  const defaultColumns = TABLE_CONFIGS[activeTable] ?? [];
  const { orderedColumns, resetToDefault, reorderColumns } = useColumnOrder(activeTable, defaultColumns);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!isCoreTable) setRefSearchQuery("");
  }, [activeTable, isCoreTable]);

  const handleCellEdit = async (rowId: string, columnId: string, value: unknown) => {
    if (isCoreTable) {
      await updateCell({ rowId, column: columnId, value });
    } else {
      await updateCell();
    }
  };

  const handleDeleteRows = async (rowIds: string[]) => {
    if (isCoreTable) {
      await deleteRows(rowIds);
    } else {
      await deleteRows();
    }
  };

  const handleExport = () => {
    const cols = orderedColumns;
    const rows = data ?? [];
    const csv = [
      cols.map((col) => col.label).join(","),
      ...rows.map((row) => cols.map((col) => JSON.stringify(row[col.key] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleCreateRecord = async (_data: Record<string, unknown>) => {
    try {
      toast.info("Create uses Convex mutations when wired.");
      refetch();
    } catch (error: unknown) {
      console.error("Create error:", error);
      toast.error(`Failed to create record: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  };

  const currentTableData = TABLES.find((t) => t.name === activeTable);

  return (
    <DashboardLayout
      title="Database Tables"
      secondaryTitle="Tables"
      showSearch={false}
      showBreadcrumb={false}
      headerActions={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-sm w-[240px] bg-muted/30 border-none focus-visible:ring-1"
            />
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            title="Reset column order"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            title="Create new record"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      }
      secondarySidebar={
        <div className="flex flex-col h-full">
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {TABLES.map((table) => {
              const Icon = table.icon;
              const isActive = activeTable === table.name;
              return (
                <button
                  key={table.name}
                  onClick={() => setActiveTable(table.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive
                    ? "bg-white text-black shadow-sm font-medium"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {table.label}
                </button>
              );
            })}
          </div>
          <div className="p-2 border-t border-border">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border"
            >
              Export CSV
            </button>
          </div>
        </div>
      }
      disableContentPadding={true}
    >
      <div className="flex h-full flex-col overflow-hidden p-2">
        <div className="flex-1 overflow-hidden">
          <FileListView
            key={activeTable}
            data={data}
            columns={orderedColumns} // Pass the externally controlled columns
            tableName={activeTable}
            isLoading={isLoading}
            onRefetch={refetch}
            onCellEdit={handleCellEdit}
            onDeleteRows={handleDeleteRows}
            onExport={handleExport}
            onCreateRecord={handleCreateRecord}
            // Pass external controls
            searchQuery={searchQuery}
            onColumnReorder={reorderColumns}
          />
        </div>
      </div>

      <CreateRecordDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        columns={orderedColumns}
        onSave={handleCreateRecord}
      />
    </DashboardLayout>
  );
}
