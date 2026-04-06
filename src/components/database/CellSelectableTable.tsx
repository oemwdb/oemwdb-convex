import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

interface CellSelectableTableProps {
  data: any[];
  columns: TableColumn[];
  columnBoundaryMap?: Record<string, { left?: boolean; right?: boolean }>;
  selectedCells: Set<string>; // Format: "rowId:columnId"
  onCellClick: (rowId: string, columnId: string, isShiftKey: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSort: (columnId: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onColumnReorder?: (oldIndex: number, newIndex: number) => void;
  onCellEdit?: (rowId: string, columnId: string, value: any) => void;
}

function SortableHeader({
  column,
  sortColumn,
  sortDirection,
  onSort,
  boundaryShadow,
}: {
  column: TableColumn;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (columnId: string) => void;
  boundaryShadow?: string;
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
      className="px-4 py-3 text-left font-medium text-muted-foreground relative group select-none whitespace-nowrap"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 right-0"
        style={{ boxShadow: boundaryShadow }}
      />
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity -ml-2 p-0.5 hover:bg-muted rounded"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground/50" />
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors flex-1"
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

export function CellSelectableTable({
  data,
  columns,
  columnBoundaryMap = {},
  selectedCells,
  onCellClick,
  onSelectAll,
  onSort,
  sortColumn,
  sortDirection,
  onColumnReorder,
  onCellEdit,
}: CellSelectableTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null); // Format: "rowId:columnId"
  const [editValue, setEditValue] = useState<any>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onColumnReorder) return;

    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);

    onColumnReorder(oldIndex, newIndex);
  };

  const startEditing = (rowId: string, columnId: string, currentValue: any) => {
    const column = columns.find(c => c.id === columnId);
    if (!column?.editable) return;

    setEditingCell(`${rowId}:${columnId}`);
    setEditValue(currentValue ?? "");
  };

  const saveEdit = () => {
    if (!editingCell || !onCellEdit) return;

    const [rowId, columnId] = editingCell.split(":");
    onCellEdit(rowId, columnId, editValue);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
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
          {tagArray.map((tag: any, idx: number) => {
            const displayValue = typeof tag === 'object' ? JSON.stringify(tag) : String(tag);
            return (
              <Badge key={`${displayValue}-${idx}`} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto whitespace-nowrap">
                {displayValue}
              </Badge>
            );
          })}
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

  const getBoundaryShadow = (columnId: string) => {
    const boundary = columnBoundaryMap[columnId];
    if (!boundary) return undefined;

    const shadows: string[] = [];
    if (boundary.left) shadows.push("inset 2px 0 0 rgba(255,255,255,0.78)");
    if (boundary.right) shadows.push("inset -2px 0 0 rgba(255,255,255,0.78)");
    return shadows.length ? shadows.join(", ") : undefined;
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border">
            <th className="w-10 px-4 py-3 text-left">
              <Checkbox
                checked={selectedCells.size === data.length * columns.length && data.length > 0}
                onCheckedChange={onSelectAll}
                className="translate-y-[2px]"
              />
            </th>
            <th className="w-12 px-4 py-3"></th>
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
                    boundaryShadow={getBoundaryShadow(column.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border hover:bg-muted/50 transition-colors group">
              <td className="px-4 py-3">
                <Checkbox
                  className="translate-y-[2px] opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 transition-opacity"
                  checked={selectedCells.has(`row-all:${row.id}`) || columns.some(c => selectedCells.has(`${row.id}:${c.id}`))}
                  onCheckedChange={(checked) => {
                    // Select entire row logic could go here, or we keep current cell selection
                    // For now, let's keep the visual cue but maybe not functional change yet to keep it simple
                    // Actually, user wants row checkboxes usually. 
                    // The current logic is cell-based. Let's keep it cell based for now but visually align.
                    // The opacity-0 on hover suggests row selection. 
                    // Reverting to disabled usage to match previous logic but with better styling
                  }}
                  disabled
                />
              </td>
              <td className="px-4 py-3">
                {getImageUrl(row) ? (
                  <img
                    src={getImageUrl(row)}
                    alt=""
                    className="h-8 w-8 rounded-md object-cover border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
              </td>
              {columns.map((column) => {
                const cellKey = `${row.id}:${column.id}`;
                const isSelected = selectedCells.has(cellKey);
                const isEditing = editingCell === cellKey;
                const cellValue = row[column.key];

                return (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 py-3 text-foreground align-middle cursor-pointer transition-colors relative",
                      isSelected && "bg-muted/50 font-medium"
                    )}
                    style={{ boxShadow: getBoundaryShadow(column.id) }}
                    onClick={(e) => !isEditing && onCellClick(row.id, column.id, e.shiftKey)}
                    onDoubleClick={() => startEditing(row.id, column.id, cellValue)}
                    title={String(cellValue || "")}
                  >
                    {isEditing ? (
                      <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEdit();
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelEdit();
                          }
                        }}
                        onBlur={saveEdit}
                        className="h-8 -ml-2 w-[calc(100%+16px)] px-2 text-sm bg-background shadow-sm border-primary"
                      />
                    ) : (
                      renderCellValue(column, row)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
