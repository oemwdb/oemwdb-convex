import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Car,
  CircleDot,
  Building2,
  Code2,
  Eye,
  Layers,
  Settings,
  Image,
  MessageSquare,
  FileText,
  Grid2x2,
  GripVertical,
  EyeOff,
  Save,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { cn } from '@/lib/utils';

// Import highlightable components
import HighlightableVehicleHeader from '@/components/templates/HighlightableVehicleHeader';
import HighlightableVehicleBrief from '@/components/templates/HighlightableVehicleBrief';
import HighlightableWheelsSection from '@/components/templates/HighlightableWheelsSection';
import HighlightableGallerySection from '@/components/templates/HighlightableGallerySection';
import HighlightableCommentsSection from '@/components/templates/HighlightableCommentsSection';
import HighlightableWheelHeader from '@/components/templates/HighlightableWheelHeader';
import HighlightableFitmentSection from '@/components/templates/HighlightableFitmentSection';
import HighlightableBrandHeader from '@/components/templates/HighlightableBrandHeader';

// Import hook
import { usePageMappings, PageSection, PageSectionField } from '@/hooks/usePageMappings';

interface SortableFieldProps {
  field: PageSectionField;
  onToggleVisibility: () => void;
  isHovered: boolean;
  onHover: (hover: boolean) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, onToggleVisibility, isHovered, onHover }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-2 bg-background border rounded-md",
        isDragging && "opacity-50",
        isHovered && "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400"
      )}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center gap-2 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium">{field.label}</span>
          <Badge variant="outline" className="ml-2 text-xs">
            {field.value}
          </Badge>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleVisibility}
        className="h-6 w-6 p-0"
      >
        {field.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      </Button>
    </div>
  );
};

export default function PageTemplatesPage() {
  const [activeTemplate, setActiveTemplate] = useState<'vehicle' | 'wheel' | 'brand'>('vehicle');
  const [showCode, setShowCode] = useState(false);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const { mappings, loading, saving, saveMappings } = usePageMappings(activeTemplate);
  const [localMappings, setLocalMappings] = useState(mappings);

  useEffect(() => {
    setLocalMappings(mappings);
  }, [mappings]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && localMappings) {
      const activeSection = localMappings.sections.find(s =>
        s.fields.some(f => f.id === active.id)
      );

      if (activeSection) {
        const oldIndex = activeSection.fields.findIndex(f => f.id === active.id);
        const newIndex = activeSection.fields.findIndex(f => f.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newFields = arrayMove(activeSection.fields, oldIndex, newIndex);
          const newSections = localMappings.sections.map(s =>
            s.id === activeSection.id ? { ...s, fields: newFields } : s
          );

          const newMappings = { ...localMappings, sections: newSections };
          setLocalMappings(newMappings);
          saveMappings(newMappings);
        }
      }
    }

    setActiveId(null);
  };

  const toggleSection = (sectionId: string) => {
    if (!localMappings) return;

    const newSections = localMappings.sections.map(section =>
      section.id === sectionId ? { ...section, enabled: !section.enabled } : section
    );

    const newMappings = { ...localMappings, sections: newSections };
    setLocalMappings(newMappings);
    saveMappings(newMappings);
  };

  const toggleFieldVisibility = (sectionId: string, fieldId: string) => {
    if (!localMappings) return;

    const newSections = localMappings.sections.map(section => {
      if (section.id === sectionId) {
        const newFields = section.fields.map(field =>
          field.id === fieldId ? { ...field, visible: !field.visible } : field
        );
        return { ...section, fields: newFields };
      }
      return section;
    });

    const newMappings = { ...localMappings, sections: newSections };
    setLocalMappings(newMappings);
    saveMappings(newMappings);
  };

  const updateSectionName = (sectionId: string, newName: string) => {
    if (!localMappings) return;

    const newSections = localMappings.sections.map(section =>
      section.id === sectionId ? { ...section, name: newName } : section
    );

    const newMappings = { ...localMappings, sections: newSections };
    setLocalMappings(newMappings);
    saveMappings(newMappings);
    setEditingSectionId(null);
  };

  const generateCode = () => {
    if (!localMappings) return '';

    const enabledSections = localMappings.sections.filter(s => s.enabled);

    return `// ${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Detail Page Template
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
${enabledSections.map(s => `import { ${s.name.replace(/\s+/g, '')} } from '@/components/${activeTemplate}/${s.name.replace(/\s+/g, '')}';`).join('\n')}

export function ${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)}DetailPage({ data }) {
  return (
    <DashboardLayout>
      ${enabledSections.map(section => {
      const visibleFields = section.fields.filter(f => f.visible);
      return `
      {/* ${section.name} */}
      <${section.name.replace(/\s+/g, '')} 
        ${visibleFields.map(field => `${field.field}={data.${field.value}}`).join('\n        ')}
      />`;
    }).join('\n      ')}
    </DashboardLayout>
  );
}`;
  };

  const renderPreview = () => {
    if (!localMappings) return null;

    const enabledSections = localMappings.sections.filter(s => s.enabled);
    const fields = enabledSections.flatMap(s =>
      s.fields.filter(f => f.visible).map(f => ({
        id: f.id,
        value: f.value,
        label: f.label
      }))
    );

    switch (activeTemplate) {
      case 'vehicle':
        return (
          <div className="space-y-6">
            {enabledSections.map(section => {
              switch (section.id) {
                case 'header':
                  return (
                    <HighlightableVehicleHeader
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'brief':
                  return (
                    <HighlightableVehicleBrief
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'wheels':
                  return (
                    <HighlightableWheelsSection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'gallery':
                  return (
                    <HighlightableGallerySection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'comments':
                  return (
                    <HighlightableCommentsSection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        );

      case 'wheel':
        return (
          <div className="space-y-6">
            {enabledSections.map(section => {
              switch (section.id) {
                case 'header':
                  return (
                    <HighlightableWheelHeader
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'fitment':
                  return (
                    <HighlightableFitmentSection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'gallery':
                  return (
                    <HighlightableGallerySection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                case 'comments':
                  return (
                    <HighlightableCommentsSection
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        );

      case 'brand':
        return (
          <div className="space-y-6">
            {enabledSections.map(section => {
              switch (section.id) {
                case 'header':
                  return (
                    <HighlightableBrandHeader
                      key={section.id}
                      fields={fields}
                      hoveredMapping={hoveredFieldId}
                      onElementClick={(id) => console.log('Clicked:', id)}
                      onElementHover={setHoveredFieldId}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Page Templates" showFilterButton={false}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Page Templates"
      showFilterButton={false}
      disableContentPadding={true}
    >
      <div className="h-full overflow-hidden flex flex-col p-2">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Page Templates</h1>
          <p className="text-sm text-muted-foreground">
            Configure and map data to individual item detail pages
          </p>
        </div>

        <Tabs value={activeTemplate} onValueChange={(v) => setActiveTemplate(v as any)} className="flex-1 flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="vehicle" className="gap-2">
              <Car className="w-4 h-4" />
              Vehicle Pages
            </TabsTrigger>
            <TabsTrigger value="wheel" className="gap-2">
              <CircleDot className="w-4 h-4" />
              Wheel Pages
            </TabsTrigger>
            <TabsTrigger value="brand" className="gap-2">
              <Building2 className="w-4 h-4" />
              Brand Pages
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Preview/Code Panel */}
            <div className="col-span-8 min-h-0">
              <Card className="h-full flex flex-col">
                {showCode ? (
                  <div className="p-4 flex-1 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Generated Code</h3>
                      <Button size="sm" variant="outline">
                        Copy Code
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{generateCode()}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="p-3 border-b bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span className="text-sm font-medium">Live Preview</span>
                      </div>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-4">
                        {renderPreview()}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </Card>
            </div>

            {/* Configuration Panel */}
            <div className="col-span-4 min-h-0">
              <Card className="h-full overflow-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">Configuration</h2>
                  <div className="flex gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCode(!showCode)}
                      className="gap-2"
                    >
                      {showCode ? <Eye className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                      {showCode ? 'Preview' : 'Code'}
                    </Button>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Sections */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Page Sections</Label>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="space-y-4">
                      {localMappings?.sections.map((section) => (
                        <div key={section.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            {editingSectionId === section.id ? (
                              <Input
                                value={section.name}
                                onChange={(e) => {
                                  const newSections = localMappings.sections.map(s =>
                                    s.id === section.id ? { ...s, name: e.target.value } : s
                                  );
                                  setLocalMappings({ ...localMappings, sections: newSections });
                                }}
                                onBlur={() => updateSectionName(section.id, section.name)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateSectionName(section.id, section.name);
                                  }
                                }}
                                className="h-7 text-sm font-medium"
                              />
                            ) : (
                              <span
                                className="text-sm font-medium cursor-pointer hover:underline"
                                onClick={() => setEditingSectionId(section.id)}
                              >
                                {section.name}
                              </span>
                            )}
                            <Switch
                              checked={section.enabled}
                              onCheckedChange={() => toggleSection(section.id)}
                            />
                          </div>

                          {section.enabled && section.fields.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <SortableContext
                                items={section.fields.map(f => f.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                {section.fields.map(field => (
                                  <SortableField
                                    key={field.id}
                                    field={field}
                                    onToggleVisibility={() => toggleFieldVisibility(section.id, field.id)}
                                    isHovered={hoveredFieldId === field.id}
                                    onHover={(hover) => setHoveredFieldId(hover ? field.id : null)}
                                  />
                                ))}
                              </SortableContext>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <DragOverlay>
                      {activeId ? (
                        <div className="p-2 bg-background border rounded-md shadow-lg">
                          <span className="text-sm">Moving field...</span>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}