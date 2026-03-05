import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TableName } from "@/components/datatable/EditableDataTable";

import { toast } from "sonner";
import { FileListView } from "@/components/database/FileListView";
import { useColumnOrder } from "@/hooks/useColumnOrder";
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

import { TableColumn } from "@/types/database";

// ... (existing imports)

export default function TablesPage() {
  const [activeTable, setActiveTable] = useState<TableName>("oem_brands");
  const { data, columns: rawColumns, isLoading, error, refetch } = { data: null as any, isLoading: false, error: null };

  // Reset search when table changes
  useEffect(() => {
    setSearchQuery("");
  }, [activeTable]);

  const columns: TableColumn[] = rawColumns?.map(col => ({
    ...col,
    id: col.key,
  })) as any[] || [];

  // Hoisted state for FileListView control
  const { orderedColumns, resetToDefault, reorderColumns } = useColumnOrder(activeTable, columns);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCellEdit = async (rowId: string, columnId: string, value: any) => {
    try {
      const { error } = await supabase
        .from(activeTable as any)
        .update({ [columnId]: value })
        .eq("id", rowId);

      if (error) throw error;

      toast.success("Cell updated successfully");
      refetch();
    } catch (error: any) {
      console.error("Cell edit error:", error);
      toast.error(`Failed to update cell: ${error.message}`);
    }
  };

  const handleDeleteRows = async (rowIds: string[]) => {
    try {
      const { error } = await supabase
        .from(activeTable as any)
        .delete()
        .in("id", rowIds);

      if (error) throw error;

      toast.success(`Deleted ${rowIds.length} row(s)`);
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete rows: ${error.message}`);
    }
  };

  const handleExport = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...data.map((row) => columns.map((col) => JSON.stringify(row[col.key] || "")).join(",")),
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

  const handleCreateRecord = async (data: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from(activeTable as any)
        .insert([data]);

      if (error) throw error;

      toast.success("Record created successfully");
      refetch();
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(`Failed to create record: ${error.message}`);
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
