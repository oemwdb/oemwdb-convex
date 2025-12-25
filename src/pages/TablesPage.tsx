import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { TableName } from "@/components/datatable/EditableDataTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileListView } from "@/components/database/FileListView";
import { DatabaseBreadcrumb } from "@/components/database/DatabaseBreadcrumb";
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
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

export default function TablesPage() {
  const [activeTable, setActiveTable] = useState<TableName>("oem_brands");
  const { data, columns, isLoading, error, refetch } = useSupabaseTable(activeTable);

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
    <DashboardLayout hideHeader={true}>
      <div className="flex h-[calc(100vh-2rem)] flex-col my-4 mr-4 ml-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar: Table List */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r border-border bg-muted/10">
            <div className="flex flex-col h-full">
              <div className="h-14 flex items-center px-4 border-b border-border bg-background/50 backdrop-blur-sm">
                <h2 className="font-semibold text-sm">Tables</h2>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {TABLES.map((table) => {
                  const Icon = table.icon;
                  return (
                    <button
                      key={table.name}
                      onClick={() => setActiveTable(table.name)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${activeTable === table.name
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {table.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content: Table View */}
          <ResizablePanel defaultSize={80}>
            <div className="flex flex-col h-full bg-background">
              <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-muted/5">
                <div className="flex items-center gap-2">
                  <currentTableData.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{currentTableData?.label}</span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <FileListView
                  key={activeTable}
                  data={data}
                  columns={columns.map((col) => ({
                    id: col.key,
                    key: col.key,
                    label: col.label,
                    type: col.type as any,
                    editable: true,
                  }))}
                  tableName={activeTable}
                  isLoading={isLoading}
                  onRefetch={refetch}
                  onCellEdit={handleCellEdit}
                  onDeleteRows={handleDeleteRows}
                  onExport={handleExport}
                  onCreateRecord={handleCreateRecord}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DashboardLayout>
  );
}
