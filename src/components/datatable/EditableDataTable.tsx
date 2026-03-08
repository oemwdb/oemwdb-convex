import React, { useState, useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { EditableCell } from "./EditableCell";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  type: "text" | "image" | "reference" | "array" | "number" | "date" | "badge";
  width?: string;
}

export type TableName = 
  | "oem_brands" 
  | "oem_vehicles" 
  | "oem_wheels" 
  | "oem_bolt_patterns" 
  | "oem_center_bores" 
  | "oem_colors" 
  | "oem_diameters" 
  | "oem_widths" 
  | "users";

interface EditableDataTableProps {
  tableName: TableName;
  columns: Column[];
  data: any[];
  isLoading: boolean;
  onDataChange: () => void;
}

export function EditableDataTable({
  tableName,
  columns,
  data,
  isLoading,
  onDataChange,
}: EditableDataTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleCellEdit = async (rowIndex: number, columnKey: string, newValue: any) => {
    const row = localData[rowIndex];
    if (!row.id) {
      toast({
        title: "Error",
        description: "Row ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update local state optimistically
      const updatedData = [...localData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [columnKey]: newValue };
      setLocalData(updatedData);

      // TODO: use Convex mutation when wired
      toast({
        title: "Success",
        description: "Cell updated successfully",
      });
      
      setEditingCell(null);
      onDataChange();
    } catch (error: any) {
      console.error("Error updating cell:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update cell",
        variant: "destructive",
      });
      // Revert local state on error
      setLocalData(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "text-left px-3 py-2 text-sm font-medium text-muted-foreground",
                  column.width
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {localData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-2 text-sm",
                    column.width
                  )}
                >
                  <EditableCell
                    value={row[column.key]}
                    type={column.type}
                    isEditing={editingCell?.row === rowIndex && editingCell?.col === column.key}
                    onEdit={() => setEditingCell({ row: rowIndex, col: column.key })}
                    onSave={(newValue) => handleCellEdit(rowIndex, column.key, newValue)}
                    onCancel={() => setEditingCell(null)}
                    columnKey={column.key}
                    tableName={tableName}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}