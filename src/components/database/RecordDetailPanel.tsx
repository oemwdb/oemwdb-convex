import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit, Trash2, Copy, X, Check, X as XIcon, Maximize2, ExternalLink, GripVertical } from "lucide-react";
import { TableColumn, REFERENCE_FIELD_CONFIG, ReferenceFieldKey } from "@/types/database";
import { ReferenceTagEditor } from "./ReferenceTagEditor";
import { RecordEditor } from "./RecordEditor";
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RecordDetailPanelProps {
  record: any | null;
  columns: TableColumn[];
  tableName: string;
  onClose: () => void;
  onEdit: (rowId: string, columnId: string, value: any) => void;
  onDelete: (rowIds: string[]) => void;
  onColumnReorder?: (oldIndex: number, newIndex: number) => void;
}

function SortableField({ 
  column, 
  record,
  editingField,
  editValue,
  formatValue,
  handleFieldClick,
  handleSave,
  handleCancel,
  setEditValue,
  isReferenceField,
  tableName,
}: {
  column: TableColumn;
  record: any;
  editingField: string | null;
  editValue: any;
  formatValue: (value: any, column: TableColumn) => any;
  handleFieldClick: (columnKey: string, currentValue: any) => void;
  handleSave: (columnKey: string) => void;
  handleCancel: () => void;
  setEditValue: (value: any) => void;
  isReferenceField: (key: string) => key is ReferenceFieldKey;
  tableName: string;
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

  const renderEditableField = () => {
    if (editingField !== column.key) {
      return (
        <div 
          className="col-span-2 break-all font-mono text-[11px] cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
          onClick={() => handleFieldClick(column.key, record[column.key])}
        >
          {formatValue(record[column.key], column)}
        </div>
      );
    }

    // Check if this is a reference field
    if (isReferenceField(column.key)) {
      const config = REFERENCE_FIELD_CONFIG[column.key];
      const currentValues = Array.isArray(editValue) ? editValue : [];
      
      return (
        <div className="col-span-2">
          <ReferenceTagEditor
            config={config}
            currentValues={currentValues}
            onChange={setEditValue}
            tableName={tableName}
            recordId={record.id}
            fieldName={column.key}
          />
          <div className="flex gap-1 mt-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleCancel}
            >
              Close
            </Button>
          </div>
        </div>
      );
    }

    // Regular editing mode
    return (
      <div className="col-span-2 flex items-start gap-1">
        {column.type === "tags" ? (
          <Textarea
            value={typeof editValue === 'object' ? JSON.stringify(editValue) : editValue}
            onChange={(e) => {
              try {
                setEditValue(JSON.parse(e.target.value));
              } catch {
                setEditValue(e.target.value);
              }
            }}
            className="text-[11px] font-mono min-h-[60px]"
            autoFocus
          />
        ) : (
          <Input
            type={column.type === "number" ? "number" : "text"}
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-[11px] font-mono h-7"
            autoFocus
          />
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => handleSave(column.key)}
        >
          <Check className="h-3 w-3 text-green-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={handleCancel}
        >
          <XIcon className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    );
  };

  if (column.type === "image") return null;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-border/50 group"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="text-muted-foreground font-medium">{column.label}</div>
      </div>
      {renderEditableField()}
    </div>
  );
}

export function RecordDetailPanel({
  record,
  columns,
  tableName,
  onClose,
  onEdit,
  onDelete,
  onColumnReorder,
}: RecordDetailPanelProps) {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [isExpandedDialog, setIsExpandedDialog] = useState(false);

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

  if (!record) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Select a record to view details
      </div>
    );
  }

  const getImageUrl = (rec: any) => {
    return rec.good_pic_url || rec.hero_image_url || rec.brand_image_url || rec.avatar_url;
  };

  const imageUrl = getImageUrl(record);

  const formatValue = (value: any, column: TableColumn) => {
    if (value === null || value === undefined) return "—";
    
    if (column.type === "tags") {
      const tagArray = Array.isArray(value) ? value : [];
      if (tagArray.length === 0) return "—";
      return (
        <div className="flex flex-wrap gap-1">
          {tagArray.map((tag: string, idx: number) => (
            <Badge key={`${tag}-${idx}`} variant="secondary" className="text-[10px] px-1.5 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      );
    }
    
    if (column.type === "date" || column.type === "datetime") {
      return new Date(value).toLocaleString();
    }
    
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const handleFieldClick = (columnKey: string, currentValue: any) => {
    setEditingField(columnKey);
    setEditValue(currentValue);
  };

  const handleSave = (columnKey: string) => {
    onEdit(record.id, columnKey, editValue);
    setEditingField(null);
    setEditValue(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue(null);
  };

  const isReferenceField = (key: string): key is ReferenceFieldKey => {
    return key in REFERENCE_FIELD_CONFIG;
  };

  const handleOpenFullPage = () => {
    navigate(`/dev/database/${tableName}/${record.id}`);
  };

  const handleSaveFromDialog = async (updates: Record<string, any>) => {
    Object.entries(updates).forEach(([key, value]) => {
      onEdit(record.id, key, value);
    });
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background border-l border-border">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h3 className="text-sm font-medium font-mono">{record.id}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpandedDialog(true)}
              className="h-7 w-7 p-0"
              title="Expand to dialog"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenFullPage}
              className="h-7 w-7 p-0"
              title="Open in full page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {imageUrl && (
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Fields {onColumnReorder && <span className="text-[10px] text-muted-foreground/60">(drag to reorder)</span>}
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map(col => col.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columns.map((column) => (
                    <SortableField
                      key={column.id}
                      column={column}
                      record={record}
                      editingField={editingField}
                      editValue={editValue}
                      formatValue={formatValue}
                      handleFieldClick={handleFieldClick}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                      setEditValue={setEditValue}
                      isReferenceField={isReferenceField}
                      tableName={tableName}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => onDelete([record.id])}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>

      {/* Expanded Dialog */}
      <Dialog open={isExpandedDialog} onOpenChange={setIsExpandedDialog}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0">
          <RecordEditor
            record={record}
            columns={columns}
            tableName={tableName}
            onSave={handleSaveFromDialog}
            onDelete={() => {
              setIsExpandedDialog(false);
              onDelete([record.id]);
            }}
            onClose={() => setIsExpandedDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
