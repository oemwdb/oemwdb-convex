import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, X, Trash2, GripVertical } from 'lucide-react';
import { TableColumn } from '@/types/database';
import { REFERENCE_FIELD_CONFIG, ReferenceFieldKey } from '@/types/database';
import { ReferenceTagEditor } from './ReferenceTagEditor';
import { toast } from 'sonner';
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

interface RecordEditorProps {
  record: any;
  columns: TableColumn[];
  tableName: string;
  onSave?: (updates: Record<string, any>) => Promise<void>;
  onDelete?: () => void;
  onClose?: () => void;
  onColumnReorder?: (oldIndex: number, newIndex: number) => void;
}

function SortableFieldCard({ 
  column, 
  record,
  editingField,
  editValue,
  isSaving,
  formatValue,
  setEditingField,
  setEditValue,
  handleSaveField,
  isReferenceField,
  tableName,
}: {
  column: TableColumn;
  record: any;
  editingField: string | null;
  editValue: any;
  isSaving: boolean;
  formatValue: (value: any, column: TableColumn) => any;
  setEditingField: (field: string | null) => void;
  setEditValue: (value: any) => void;
  handleSaveField: (key: string, value: any) => Promise<void>;
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

  const value = record[column.key];
  const isEditing = editingField === column.key;

  const renderContent = () => {
    if (isEditing) {
      // Handle reference fields
      if (isReferenceField(column.key)) {
        const config = REFERENCE_FIELD_CONFIG[column.key];
        const currentValues = Array.isArray(value) ? value : [];

        return (
          <div className="space-y-2">
            <ReferenceTagEditor
              config={config}
              currentValues={currentValues}
              onChange={(newValues) => {
                handleSaveField(column.key, newValues);
              }}
              tableName={tableName}
              recordId={record.id}
              fieldName={column.key}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingField(null)}
            >
              Close
            </Button>
          </div>
        );
      }

      // Handle other field types
      const inputComponent = column.type === 'tags' || typeof value === 'object' ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          type={column.type === 'date' ? 'datetime-local' : 'text'}
        />
      );

      return (
        <div className="space-y-2">
          {inputComponent}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleSaveField(column.key, editValue)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingField(null)}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors"
        onClick={() => {
          setEditingField(column.key);
          setEditValue(typeof value === 'object' ? JSON.stringify(value, null, 2) : value);
        }}
      >
        <div className="text-sm text-muted-foreground">
          {formatValue(value, column)}
        </div>
      </div>
    );
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <label className="text-sm font-medium">
            {column.label}
          </label>
        </div>
        {editingField !== column.key && (
          <Badge variant="outline" className="text-xs">
            {column.type}
          </Badge>
        )}
      </div>
      {renderContent()}
    </div>
  );
}

export function RecordEditor({
  record,
  columns,
  tableName,
  onSave,
  onDelete,
  onClose,
  onColumnReorder,
}: RecordEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [isSaving, setIsSaving] = useState(false);

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

  const formatValue = (value: any, column: TableColumn) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (column.type === 'tags' && Array.isArray(value)) {
      return value.map((tag, idx) => (
        <Badge key={idx} variant="secondary" className="mr-1">
          {tag}
        </Badge>
      ));
    }
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleString();
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const handleSaveField = async (key: string, value: any) => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave({ [key]: value });
      setEditingField(null);
      toast.success('Field updated successfully');
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error('Failed to save field');
    } finally {
      setIsSaving(false);
    }
  };

  const isReferenceField = (key: string): key is ReferenceFieldKey => {
    return key in REFERENCE_FIELD_CONFIG;
  };

  const imageUrl = record.good_pic_url || record.vehicle_image || record.brand_image_url;

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {record.wheel_title || record.vehicle_title || record.brand_title || record.id}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Table: {tableName} • ID: {record.id}
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Section (if exists) */}
            {imageUrl && (
              <div className="lg:col-span-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt="Record"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Fields Section */}
            <div className={imageUrl ? "lg:col-span-2" : "lg:col-span-3"}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={columns.map(col => col.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {onColumnReorder && (
                      <p className="text-xs text-muted-foreground">
                        Drag fields to reorder them
                      </p>
                    )}
                    {columns.map(column => (
                      <SortableFieldCard
                        key={column.id}
                        column={column}
                        record={record}
                        editingField={editingField}
                        editValue={editValue}
                        isSaving={isSaving}
                        formatValue={formatValue}
                        setEditingField={setEditingField}
                        setEditValue={setEditValue}
                        handleSaveField={handleSaveField}
                        isReferenceField={isReferenceField}
                        tableName={tableName}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t p-4 flex justify-between items-center bg-background">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isSaving}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Record
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
