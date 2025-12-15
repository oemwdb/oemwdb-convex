import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCw, Plus, X, GripVertical, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Field {
  id: string;
  label: string;
  value: string;
}

interface EditableMasterCardProps {
  isFlipped: boolean;
  onFlip: () => void;
  cardData: {
    title: string;
    subtitle: string;
    imageUrl: string;
    fields: Field[];
  };
  onUpdateCardData: (data: any) => void;
}

function SortableField({ field, onUpdate, onRemove }: {
  field: Field;
  onUpdate: (id: string, label: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-background/50 rounded-md"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          value={field.label}
          onChange={(e) => onUpdate(field.id, e.target.value, field.value)}
          placeholder="Label"
          className="h-8 text-xs"
        />
        <Input
          value={field.value}
          onChange={(e) => onUpdate(field.id, field.label, e.target.value)}
          placeholder="Value"
          className="h-8 text-xs"
        />
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(field.id)}
        className="h-8 w-8 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default function EditableMasterCard({
  isFlipped,
  onFlip,
  cardData,
  onUpdateCardData,
}: EditableMasterCardProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [tempTitle, setTempTitle] = useState(cardData.title);
  const [tempSubtitle, setTempSubtitle] = useState(cardData.subtitle);
  const [tempImageUrl, setTempImageUrl] = useState(cardData.imageUrl);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cardData.fields.findIndex((f) => f.id === active.id);
      const newIndex = cardData.fields.findIndex((f) => f.id === over.id);
      
      onUpdateCardData({
        ...cardData,
        fields: arrayMove(cardData.fields, oldIndex, newIndex),
      });
    }
  };

  const handleAddField = () => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      value: 'Value',
    };
    onUpdateCardData({
      ...cardData,
      fields: [...cardData.fields, newField],
    });
  };

  const handleUpdateField = (id: string, label: string, value: string) => {
    onUpdateCardData({
      ...cardData,
      fields: cardData.fields.map(f =>
        f.id === id ? { ...f, label, value } : f
      ),
    });
  };

  const handleRemoveField = (id: string) => {
    onUpdateCardData({
      ...cardData,
      fields: cardData.fields.filter(f => f.id !== id),
    });
  };

  const handleTitleSave = () => {
    onUpdateCardData({ ...cardData, title: tempTitle });
    setEditingTitle(false);
  };

  const handleSubtitleSave = () => {
    onUpdateCardData({ ...cardData, subtitle: tempSubtitle });
    setEditingSubtitle(false);
  };

  const handleImageSave = () => {
    onUpdateCardData({ ...cardData, imageUrl: tempImageUrl });
    setEditingImage(false);
  };

  return (
    <div className="relative w-64 h-80">
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-all duration-700 [transform-style:preserve-3d]",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] overflow-hidden">
          <CardContent className="p-4 h-full flex flex-col">
            <Button
              size="sm"
              variant="ghost"
              onClick={onFlip}
              className="absolute top-2 right-2 z-10"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            {/* Editable Image Area */}
            <div className="relative flex-1 mb-4 group">
              {editingImage ? (
                <div className="flex flex-col gap-2 h-full">
                  <Input
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleImageSave}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setTempImageUrl(cardData.imageUrl);
                      setEditingImage(false);
                    }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div
                  className="h-full bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setEditingImage(true)}
                >
                  {cardData.imageUrl ? (
                    <img
                      src={cardData.imageUrl}
                      alt={cardData.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Click to add image</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Editable Title */}
            <div className="space-y-2">
              {editingTitle ? (
                <div className="flex gap-1">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') {
                        setTempTitle(cardData.title);
                        setEditingTitle(false);
                      }
                    }}
                    className="h-8 text-sm font-semibold"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleTitleSave} className="h-8 px-2">
                    ✓
                  </Button>
                </div>
              ) : (
                <h3
                  className="font-semibold text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors"
                  onClick={() => setEditingTitle(true)}
                >
                  {cardData.title || 'Click to add title'}
                </h3>
              )}

              {/* Editable Subtitle */}
              {editingSubtitle ? (
                <div className="flex gap-1">
                  <Input
                    value={tempSubtitle}
                    onChange={(e) => setTempSubtitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubtitleSave();
                      if (e.key === 'Escape') {
                        setTempSubtitle(cardData.subtitle);
                        setEditingSubtitle(false);
                      }
                    }}
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSubtitleSave} className="h-7 px-2">
                    ✓
                  </Button>
                </div>
              ) : (
                <p
                  className="text-xs text-muted-foreground cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors"
                  onClick={() => setEditingSubtitle(true)}
                >
                  {cardData.subtitle || 'Click to add subtitle'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold">Card Fields</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={onFlip}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={cardData.fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {cardData.fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onUpdate={handleUpdateField}
                      onRemove={handleRemoveField}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAddField}
              className="mt-3 w-full"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Field
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}