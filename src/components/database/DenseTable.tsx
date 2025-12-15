import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TableColumn } from "@/types/database";
import { ChevronDown, ChevronUp, Image as ImageIcon, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DenseTableProps {
  data: any[];
  columns: TableColumn[];
  selectedRows: Set<string>;
  selectedRecordId: string | null;
  onRowClick: (rowId: string) => void;
  onRowDoubleClick: (rowId: string) => void;
  onSelectRow: (rowId: string, isCtrlKey: boolean, isShiftKey: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSort: (columnId: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onColumnReorder?: (oldIndex: number, newIndex: number) => void;
}

function SortableHeader({ 
  column, 
  sortColumn, 
  sortDirection, 
  onSort 
}: { 
  column: TableColumn; 
  sortColumn: string | null; 
  sortDirection: "asc" | "desc"; 
  onSort: (columnId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-2 py-1.5 text-left font-medium text-muted-foreground relative group border-r border-border bg-muted/30"
    >
      <div className="flex items-center gap-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-3 w-3" />
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
          onClick={() => onSort(column.id)}
        >
          {column.label}
          {sortColumn === column.id && (
            sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          )}
        </div>
      </div>
    </th>
  );
}

export function DenseTable({
  data,
  columns,
  selectedRows,
  selectedRecordId,
  onRowClick,
  onRowDoubleClick,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumn,
  sortDirection,
  onColumnReorder,
}: DenseTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onColumnReorder) return;

    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);

    onColumnReorder(oldIndex, newIndex);
  };

  const getImageUrl = (row: any) => {
    return row.good_pic_url || row.hero_image_url || row.brand_image_url || row.avatar_url;
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const renderCellValue = (column: TableColumn, row: any) => {
    const value = row[column.key];
    
    if (column.type === "tags") {
      const tagArray = Array.isArray(value) ? value : [];
      if (tagArray.length === 0) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1 py-1">
          {tagArray.map((tag: string, idx: number) => (
            <Badge key={`${tag}-${idx}`} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto whitespace-nowrap">
              {tag}
            </Badge>
          ))}
        </div>
      );
    }
    
    if (column.type === "image" && value) {
      return <img src={value} alt="" className="h-6 w-6 rounded object-cover" />;
    }
    
    if (column.type === "date" && value) {
      return <span className="font-mono text-[10px]">{new Date(value).toLocaleDateString()}</span>;
    }
    
    if (column.type === "number") {
      return <span className="font-mono">{value}</span>;
    }
    
    return truncateText(String(value || "—"));
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0 bg-background border-b-2 border-border z-10">
          <tr>
            <th className="w-10 px-2 py-1.5 text-left border-r border-border bg-muted/30">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={onSelectAll}
                className="h-3.5 w-3.5"
              />
            </th>
            <th className="w-12 px-2 py-1.5 border-r border-border bg-muted/30"></th>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map(col => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {columns.map((column) => (
                  <SortableHeader
                    key={column.id}
                    column={column}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-border cursor-pointer transition-colors hover:bg-muted/50",
                selectedRecordId === row.id && "bg-accent/20",
                selectedRows.has(row.id) && "bg-primary/5 border-primary/20"
              )}
              onClick={() => onRowClick(row.id)}
              onDoubleClick={() => onRowDoubleClick(row.id)}
            >
              <td className="px-2 py-1.5 border-r border-border" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(checked) => {
                    const event = (window.event || {}) as any;
                    onSelectRow(row.id, event.ctrlKey || event.metaKey, event.shiftKey);
                  }}
                  className="h-3.5 w-3.5"
                />
              </td>
              <td className="px-2 py-1.5 border-r border-border">
                {getImageUrl(row) ? (
                  <img
                    src={getImageUrl(row)}
                    alt=""
                    className="h-6 w-6 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-6 w-6 rounded bg-muted/50 flex items-center justify-center">
                    <ImageIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </td>
              {columns.map((column) => (
                <td key={column.id} className="px-2 py-1.5 text-muted-foreground border-r border-border align-top" title={String(row[column.key] || "")}>
                  {renderCellValue(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
