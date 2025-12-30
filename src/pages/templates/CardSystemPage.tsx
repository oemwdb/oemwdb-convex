import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Code, Database, Grid3x3, Sparkles, Eye, EyeOff, GripVertical, Edit2, Loader2, Save, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HighlightableBrandCard from "@/components/cards/HighlightableBrandCard";
import HighlightableVehicleCard from "@/components/cards/HighlightableVehicleCard";
import HighlightableWheelCard from "@/components/cards/HighlightableWheelCard";
import HighlightableMasterCard from "@/components/cards/HighlightableMasterCard";
import EditableMasterCard from "@/components/cards/EditableMasterCard";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <div {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {children}
      </div>
    </div>
  );
}

const CardSystemPage = () => {
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardType, setCardType] = useState<"create" | "master" | "brand" | "vehicle" | "wheel">("create");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredMapping, setHoveredMapping] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Custom card data for CREATE tab
  const [customCardData, setCustomCardData] = useState({
    title: "Custom Card Title",
    subtitle: "Card Subtitle",
    imageUrl: "",
    fields: [
      { id: "field-1", label: "Field 1", value: "Value 1" },
      { id: "field-2", label: "Field 2", value: "Value 2" },
    ]
  });

  // Enhanced data mappings with order and location
  const [dataMappings, setDataMappings] = useState({
    master: [
      { id: "title", field: "title", value: "master.title", location: "front", order: 0, label: "Title" },
      { id: "subtitle", field: "subtitle", value: "master.subtitle", location: "front", order: 1, label: "Subtitle" },
      { id: "description", field: "description", value: "master.description", location: "back", order: 0, label: "Description" },
      { id: "metadata", field: "metadata", value: "master.metadata", location: "back", order: 1, label: "Metadata" }
    ],
    brand: [
      { id: "name", field: "name", value: "oem_brands.name", location: "front", order: 0, label: "Name" },
      { id: "imageUrl", field: "imageUrl", value: "oem_brands.brand_image_url", location: "front", order: 1, label: "Image URL" },
      { id: "description", field: "description", value: "oem_brands.brand_description", location: "back", order: 0, label: "Description" },
      { id: "wheelCount", field: "wheelCount", value: "oem_brands.wheel_count", location: "back", order: 1, label: "Wheel Count" }
    ],
    vehicle: [
      { id: "modelName", field: "modelName", value: "oem_vehicles.model_name", location: "front", order: 0, label: "Model Name" },
      { id: "brandName", field: "brandName", value: "oem_brands.name (via brand_refs)", location: "front", order: 1, label: "Brand Name" },
      { id: "heroImageUrl", field: "heroImageUrl", value: "oem_vehicles.hero_image_url", location: "front", order: 2, label: "Hero Image URL" },
      { id: "chassisCode", field: "chassisCode", value: "oem_vehicles.chassis_code", location: "back", order: 0, label: "Chassis Code" },
      { id: "productionYears", field: "productionYears", value: "oem_vehicles.production_years", location: "back", order: 1, label: "Production Years" },
      { id: "boltPattern", field: "boltPattern", value: "oem_vehicles.bolt_pattern", location: "back", order: 2, label: "Bolt Pattern" }
    ],
    wheel: [
      { id: "wheelName", field: "wheelName", value: "oem_wheels.wheel_name", location: "front", order: 0, label: "Wheel Name" },
      { id: "goodPicUrl", field: "goodPicUrl", value: "oem_wheels.good_pic_url", location: "front", order: 1, label: "Good Pic URL" },
      { id: "diameter", field: "diameter", value: "oem_diameters.diameter (via diameter_refs)", location: "back", order: 0, label: "Diameter" },
      { id: "width", field: "width", value: "oem_widths.width (via width_refs)", location: "back", order: 1, label: "Width" },
      { id: "wheelOffset", field: "wheelOffset", value: "oem_wheels.wheel_offset", location: "back", order: 2, label: "Wheel Offset" },
      { id: "boltPattern", field: "boltPattern", value: "oem_bolt_patterns.bolt_pattern (via bolt_pattern_refs)", location: "back", order: 3, label: "Bolt Pattern" }
    ]
  });

  // Load mappings from Supabase on mount and when card type changes
  useEffect(() => {
    const loadMappings = async () => {
      const { data, error } = await supabase
        .from('card_mappings')
        .select('mappings')
        .eq('card_type', cardType)
        .maybeSingle();

      if (data?.mappings) {
        setDataMappings(prev => ({
          ...prev,
          [cardType]: data.mappings
        }));
      }
    };

    loadMappings();
  }, [cardType]);

  // Save mappings to Supabase with debouncing
  const saveMappings = useCallback(async (type: string, mappings: any[]) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('card_mappings')
      .upsert({
        card_type: type,
        mappings: mappings,
        user_id: null // For now, null means global settings
      }, {
        onConflict: 'card_type,user_id'
      });

    setIsSaving(false);

    if (error) {
      console.error('Error saving mappings:', error);
      toast({
        title: "Error saving changes",
        description: "Your changes could not be saved to the database.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Changes saved",
        description: "Your card mapping changes have been saved.",
      });
    }
  }, [toast]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleElementClick = (elementName: string) => {
    setSelectedElement(elementName);
  };

  const handleMappingChange = (element: string, newMapping: string) => {
    const updatedMappings = dataMappings[cardType as keyof typeof dataMappings].map(item =>
      item.field === element ? { ...item, value: newMapping } : item
    );

    setDataMappings(prev => ({
      ...prev,
      [cardType]: updatedMappings
    }));

    setSelectedElement(null);

    // Save to Supabase
    saveMappings(cardType, updatedMappings);
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    const updatedMappings = dataMappings[cardType as keyof typeof dataMappings].map(item =>
      item.id === id ? { ...item, label: newLabel } : item
    );

    setDataMappings(prev => ({
      ...prev,
      [cardType]: updatedMappings
    }));

    // Save to Supabase
    saveMappings(cardType, updatedMappings);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Get current mappings
    const currentMappings = [...dataMappings[cardType as keyof typeof dataMappings]];

    // Find the active item (could be from mapped or unmapped)
    let activeItem = currentMappings.find(item => item.id === activeId);

    // If not found in mappings, it's from unmapped columns
    if (!activeItem) {
      const unmappedColumn = activeId;
      const columnType = allTableColumns[cardType as keyof typeof allTableColumns][unmappedColumn] || 'text';

      // Create new mapping for unmapped column
      activeItem = {
        id: unmappedColumn.replace(/\./g, '_'),
        field: unmappedColumn.split('.').pop() || unmappedColumn,
        value: unmappedColumn,
        location: 'back',
        order: 999, // Will be adjusted
        label: unmappedColumn.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || unmappedColumn
      };
    }

    // Determine the target section based on the over ID
    if (overId === 'droppable-back' || overId === 'droppable-unmapped') {
      // Dropped on a section header
      const targetLocation = overId === 'droppable-back' ? 'back' : 'hidden';

      // Update or add the item
      const existingIndex = currentMappings.findIndex(item => item.id === activeItem.id);

      if (existingIndex !== -1) {
        // Update existing item's location
        currentMappings[existingIndex] = { ...activeItem, location: targetLocation };
      } else {
        // Add new item
        activeItem.location = targetLocation;
        currentMappings.push(activeItem);
      }
    } else {
      // Dropped on another item - reorder within section
      const overItem = currentMappings.find(item => item.id === overId);

      if (overItem) {
        // Determine target location from the over item
        const targetLocation = overItem.location;

        // Remove active item if it exists
        const filteredMappings = currentMappings.filter(item => item.id !== activeItem.id);

        // Update active item's location
        activeItem.location = targetLocation;

        // Find where to insert
        const overIndex = filteredMappings.findIndex(item => item.id === overId);

        if (overIndex !== -1) {
          // Insert at the over position
          filteredMappings.splice(overIndex, 0, activeItem);
        } else {
          // Add to end
          filteredMappings.push(activeItem);
        }

        // Update mappings
        currentMappings.length = 0;
        currentMappings.push(...filteredMappings);
      }
    }

    // Update order for all items in their respective sections
    const backItems = currentMappings.filter(item => item.location === 'back');
    const hiddenItems = currentMappings.filter(item => item.location === 'hidden');
    const frontItems = currentMappings.filter(item => item.location === 'front');

    backItems.forEach((item, index) => {
      item.order = index;
    });

    hiddenItems.forEach((item, index) => {
      item.order = index;
    });

    frontItems.forEach((item, index) => {
      item.order = index;
    });

    const updatedMappings = [...frontItems, ...backItems, ...hiddenItems];

    setDataMappings(prev => ({
      ...prev,
      [cardType]: updatedMappings
    }));

    // Save to Supabase
    saveMappings(cardType, updatedMappings);
  };

  const toggleVisibility = (id: string) => {
    const updatedMappings = dataMappings[cardType as keyof typeof dataMappings].map(item =>
      item.id === id ? {
        ...item,
        location: item.location === 'hidden' ? 'back' : 'hidden'
      } : item
    );

    setDataMappings(prev => ({
      ...prev,
      [cardType]: updatedMappings
    }));

    // Save to Supabase
    saveMappings(cardType, updatedMappings);
  };

  // Template data with clickable elements
  const sampleBrand = {
    id: 1,
    name: "[BRAND NAME]",
    description: "[BRAND DESCRIPTION]",
    wheelCount: 99,
    imagelink: null
  };

  const sampleVehicle = {
    modelName: "[VEHICLE MODEL]",
    brandName: "[BRAND]",
    chassisCode: "[CHASSIS]",
    productionYears: "[YEARS]",
    boltPattern: "[PATTERN]",
    heroImageUrl: null
  };

  const sampleWheel = {
    id: "wheel-1",
    wheelName: "[WHEEL NAME]",
    diameter: "[SIZE]",
    width: "[WIDTH]",
    wheelOffset: "[OFFSET]",
    boltPattern: "[PATTERN]",
    goodPicUrl: null
  };

  // Define all available columns with their types
  const allTableColumns = {
    brand: {
      "oem_brands.id": "number",
      "oem_brands.name": "text",
      "oem_brands.brand_description": "text",
      "oem_brands.wheel_count": "number",
      "oem_brands.brand_image_url": "text",
      "oem_brands.subsidiaries": "text",
      "oem_brands.brand_page": "text",
      "oem_brands.uuid": "uuid",
      "oem_brands.created_at": "timestamp",
      "oem_brands.updated_at": "timestamp"
    },
    vehicle: {
      "oem_vehicles.id": "number",
      "oem_vehicles.chassis_code": "text",
      "oem_vehicles.model_name": "text",
      "oem_vehicles.vehicle_title": "text",
      "oem_vehicles.production_years": "text",
      "oem_vehicles.production_stats": "text",
      "oem_vehicles.center_bore": "text",
      "oem_vehicles.bolt_pattern": "text",
      "oem_vehicles.hero_image_url": "text",
      "oem_vehicles.oem_engines_relation": "text",
      "oem_vehicles.uuid": "uuid",
      "oem_vehicles.created_at": "timestamp",
      "oem_vehicles.updated_at": "timestamp",
      "oem_vehicles.brand_refs": "tags",
      "oem_vehicles.wheel_refs": "tags",
      "oem_vehicles.width_refs": "tags",
      "oem_vehicles.diameter_refs": "tags",
      "oem_vehicles.bolt_pattern_refs": "tags",
      "oem_vehicles.center_bore_refs": "tags",
      "oem_vehicles.color_refs": "tags"
    },
    wheel: {
      "oem_wheels.id": "number",
      "oem_wheels.wheel_name": "text",
      "oem_wheels.wheel_code": "text",
      "oem_wheels.wheel_offset": "text",
      "oem_wheels.weight": "text",
      "oem_wheels.metal_type": "text",
      "oem_wheels.color": "text",
      "oem_wheels.good_pic_url": "text",
      "oem_wheels.part_numbers": "text",
      "oem_wheels.notes": "text",
      "oem_wheels.design_style_tags": "array",
      "oem_wheels.ai_processing_complete": "boolean",
      "oem_wheels.uuid": "uuid",
      "oem_wheels.created_at": "timestamp",
      "oem_wheels.updated_at": "timestamp",
      "oem_wheels.specifications": "tags",
      "oem_wheels.brand_refs": "tags",
      "oem_wheels.diameter_refs": "tags",
      "oem_wheels.width_refs": "tags",
      "oem_wheels.bolt_pattern_refs": "tags",
      "oem_wheels.center_bore_refs": "tags",
      "oem_wheels.color_refs": "tags",
      "oem_wheels.vehicle_refs": "tags"
    }
  };

  // Available columns for dropdown (only user-friendly ones)
  const availableColumns = {
    brand: Object.keys(allTableColumns.brand || {}).filter(col =>
      !col.includes('uuid') && !col.includes('created_at') && !col.includes('updated_at')
    ),
    vehicle: Object.keys(allTableColumns.vehicle || {}).filter(col =>
      !col.includes('uuid') && !col.includes('created_at') && !col.includes('updated_at')
    ),
    wheel: Object.keys(allTableColumns.wheel || {}).filter(col =>
      !col.includes('uuid') && !col.includes('created_at') && !col.includes('updated_at')
    )
  };

  // Load custom templates
  useEffect(() => {
    const loadTemplates = async () => {
      const { data, error } = await supabase
        .from('custom_card_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setCustomTemplates(data);
      }
    };

    loadTemplates();
  }, []);

  // Save custom template
  const saveCustomTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('custom_card_templates')
      .insert({
        template_name: templateName,
        card_data: customCardData,
        is_public: false
      });

    if (error) {
      toast({
        title: "Error saving template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template saved",
        description: "Your custom card template has been saved",
      });
      setShowSaveDialog(false);
      setTemplateName("");
      // Reload templates
      const { data } = await supabase
        .from('custom_card_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setCustomTemplates(data);
    }
  };

  // Load selected template
  const loadTemplate = async (templateId: string) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (template && template.card_data) {
      setCustomCardData(template.card_data);
      setSelectedTemplate(templateId);
    }
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('custom_card_templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template deleted",
        description: "The custom card template has been deleted",
      });
      // Reload templates
      const { data } = await supabase
        .from('custom_card_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setCustomTemplates(data);
      if (selectedTemplate === templateId) {
        setSelectedTemplate(null);
      }
    }
  };

  // Helper function to get data type badge variant
  const getDataTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'tags': return 'default';
      case 'array': return 'secondary';
      case 'boolean': return 'outline';
      case 'number': return 'outline';
      case 'timestamp': return 'outline';
      case 'uuid': return 'outline';
      default: return 'outline';
    }
  };

  const renderClickableCard = () => {
    if (cardType === 'create') {
      return (
        <EditableMasterCard
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          cardData={customCardData}
          onUpdateCardData={setCustomCardData}
        />
      );
    }

    const currentMappings = dataMappings[cardType as keyof typeof dataMappings] || [];
    const backMappings = currentMappings.filter(m => m.location === 'back').sort((a, b) => a.order - b.order);

    switch (cardType) {
      case "brand":
        return (
          <HighlightableBrandCard
            brand={sampleBrand}
            isFlipped={isFlipped}
            onFlip={(name) => setIsFlipped(!isFlipped)}
            hoveredMapping={hoveredMapping}
            onElementClick={handleElementClick}
            onElementHover={setHoveredMapping}
            dataMapping={dataMappings.brand}
          />
        );

      case "vehicle":
        return (
          <HighlightableVehicleCard
            vehicle={{
              name: sampleVehicle.modelName,
              brand: sampleVehicle.brandName,
              wheels: 99,
              image: sampleVehicle.heroImageUrl || undefined
            }}
            isFlipped={isFlipped}
            onFlip={(name) => setIsFlipped(!isFlipped)}
            hoveredMapping={hoveredMapping}
            onElementClick={handleElementClick}
            onElementHover={setHoveredMapping}
            dataMapping={dataMappings.vehicle}
          />
        );

      case "wheel":
        return (
          <HighlightableWheelCard
            wheel={{
              id: sampleWheel.id,
              name: sampleWheel.wheelName,
              diameter: sampleWheel.diameter,
              boltPattern: sampleWheel.boltPattern,
              specs: [
                `${sampleWheel.diameter}" x ${sampleWheel.width}"`,
                `Offset: ${sampleWheel.wheelOffset}`,
                `PCD: ${sampleWheel.boltPattern}`
              ],
              imageUrl: sampleWheel.goodPicUrl
            }}
            isFlipped={isFlipped}
            onFlip={(id) => setIsFlipped(!isFlipped)}
            hoveredMapping={hoveredMapping}
            onElementClick={handleElementClick}
            onElementHover={setHoveredMapping}
            dataMapping={dataMappings.wheel}
          />
        );

      default:
        return (
          <HighlightableMasterCard
            data={{
              id: "master-1",
              title: "Master Template",
              subtitle: "Universal Card System",
              description: "A flexible card template that can adapt to any data type",
              imageUrl: null,
              specs: [
                "Responsive design",
                "Flippable interface",
                "Dynamic data binding",
                "Hover interactions"
              ],
              metadata: "Adaptable to any type"
            }}
            isFlipped={isFlipped}
            onFlip={(id) => setIsFlipped(!isFlipped)}
            hoveredMapping={hoveredMapping}
            onElementClick={handleElementClick}
            onElementHover={setHoveredMapping}
            dataMapping={dataMappings.master}
          />
        );
    }
  };

  const gridClasses = `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4`;

  return (
    <DashboardLayout title="Card System Documentation" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full p-2 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dev/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving changes...</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="showcase" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="showcase">
              <Database className="h-4 w-4 mr-2" />
              Data Mapper
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid Patterns
            </TabsTrigger>
            <TabsTrigger value="specs">
              <Sparkles className="h-4 w-4 mr-2" />
              Specifications
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              Code Snippets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="showcase" className="space-y-6">
            <Card className="p-6">
              {/* Card Type Selector */}
              <div className="mb-6">
                <Tabs value={cardType} onValueChange={(value: any) => setCardType(value)} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="create">
                      <Plus className="h-3 w-3 mr-1" />
                      Create
                    </TabsTrigger>
                    <TabsTrigger value="master">Master</TabsTrigger>
                    <TabsTrigger value="brand">Brand</TabsTrigger>
                    <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                    <TabsTrigger value="wheel">Wheel</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Custom Template Controls for CREATE tab */}
              {cardType === 'create' && (
                <div className="mb-6 flex gap-4">
                  <Select value={selectedTemplate || ""} onValueChange={loadTemplate}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Load template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(customTemplates || []).map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.template_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Save className="h-3 w-3 mr-1" />
                        Save Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Card Template</DialogTitle>
                        <DialogDescription>
                          Save your custom card design as a reusable template
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveCustomTemplate}>
                          Save Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {selectedTemplate && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTemplate(selectedTemplate)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}

              {/* Combined Card and Mapping Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card Display */}
                <div className="lg:col-span-1">
                  <div className="flex justify-center items-center py-8">
                    <div
                      className="perspective-1000 w-full max-w-xs"
                      style={{ perspective: "1000px" }}
                    >
                      {renderClickableCard()}
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground">
                      Click elements to change their data source
                    </p>
                  </div>
                </div>

                {/* Data Mapping */}
                <div className="lg:col-span-2">
                  {selectedElement && (
                    <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        Select data source for: {selectedElement}
                      </p>
                      <Select
                        value={dataMappings[cardType as keyof typeof dataMappings].find(m => m.field === selectedElement)?.value || ""}
                        onValueChange={(value) => handleMappingChange(selectedElement, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a database field" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns[cardType as keyof typeof availableColumns]?.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setSelectedElement(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <DragOverlay>
                      {activeDragId ? (
                        <div className="p-3 rounded-lg bg-background shadow-lg border">
                          <p className="text-sm font-medium">
                            {dataMappings[cardType as keyof typeof dataMappings].find(m => m.id === activeDragId)?.label ||
                              activeDragId.split('.')[1]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
                              activeDragId}
                          </p>
                        </div>
                      ) : null}
                    </DragOverlay>
                    <div className="space-y-6">
                      {/* Front of Card Section */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Front of Card
                        </h3>
                        <div className="space-y-2">
                          {dataMappings[cardType as keyof typeof dataMappings]
                            .filter(m => m.location === 'front')
                            .map((mapping) => (
                              <div
                                key={mapping.id}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer transition-colors hover:bg-muted",
                                  selectedElement === mapping.field && "ring-2 ring-primary bg-primary/10",
                                  hoveredMapping === mapping.field && "bg-yellow-200/30"
                                )}
                                onClick={() => handleElementClick(mapping.field)}
                                onMouseEnter={() => setHoveredMapping(mapping.field)}
                                onMouseLeave={() => setHoveredMapping(null)}
                              >
                                <div className="flex-1">
                                  {editingLabel === mapping.id ? (
                                    <Input
                                      value={mapping.label}
                                      onChange={(e) => handleLabelChange(mapping.id, e.target.value)}
                                      onBlur={() => setEditingLabel(null)}
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') setEditingLabel(null);
                                        e.stopPropagation();
                                      }}
                                      className="h-6 text-sm font-medium"
                                      autoFocus
                                    />
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{mapping.label}</p>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingLabel(mapping.id);
                                        }}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  <p className="text-xs text-muted-foreground">{mapping.value}</p>
                                </div>
                                <Badge variant="outline" className="text-xs ml-2">
                                  {mapping.value.split('.')[0]}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Back of Card Section */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Back of Card (Drop Zone)
                        </h3>
                        <div
                          id="droppable-back"
                          className={cn(
                            "min-h-[100px] rounded-lg border-2 border-dashed p-2",
                            activeDragId ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                          )}
                        >
                          <SortableContext
                            items={dataMappings[cardType as keyof typeof dataMappings]
                              .filter(m => m.location === 'back')
                              .map(m => m.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {dataMappings[cardType as keyof typeof dataMappings]
                                .filter(m => m.location === 'back')
                                .sort((a, b) => a.order - b.order)
                                .map((mapping) => (
                                  <SortableItem key={mapping.id} id={mapping.id}>
                                    <div
                                      className={cn(
                                        "flex-1 flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer transition-colors hover:bg-muted",
                                        selectedElement === mapping.field && "ring-2 ring-primary bg-primary/10",
                                        hoveredMapping === mapping.field && "bg-yellow-200/30"
                                      )}
                                      onClick={() => handleElementClick(mapping.field)}
                                      onMouseEnter={() => setHoveredMapping(mapping.field)}
                                      onMouseLeave={() => setHoveredMapping(null)}
                                    >
                                      <div className="flex-1">
                                        {editingLabel === mapping.id ? (
                                          <Input
                                            value={mapping.label}
                                            onChange={(e) => handleLabelChange(mapping.id, e.target.value)}
                                            onBlur={() => setEditingLabel(null)}
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') setEditingLabel(null);
                                              e.stopPropagation();
                                            }}
                                            className="h-6 text-sm font-medium"
                                            autoFocus
                                          />
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{mapping.label}</p>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-5 w-5 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingLabel(mapping.id);
                                              }}
                                            >
                                              <Edit2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">{mapping.value}</p>
                                      </div>
                                      <div className="flex items-center gap-2 ml-4">
                                        <Badge variant="outline" className="text-xs">
                                          {mapping.value.split('.')[0]}
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleVisibility(mapping.id);
                                          }}
                                        >
                                          <EyeOff className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </SortableItem>
                                ))}
                            </div>
                          </SortableContext>
                        </div>
                      </div>

                      {/* Not Shown Section */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Not Shown on Card (Drag to Back of Card)
                        </h3>
                        <div
                          id="droppable-unmapped"
                          className={cn(
                            "min-h-[100px] rounded-lg border-2 border-dashed p-2",
                            activeDragId ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                          )}
                        >
                          <SortableContext
                            items={(() => {
                              // Get all mapped field values
                              const mappedFields = dataMappings[cardType as keyof typeof dataMappings]
                                .filter(m => m.location !== 'hidden')
                                .map(m => m.value);

                              // Get all columns from the current table
                              const tableColumns = allTableColumns[cardType as keyof typeof allTableColumns] || {};

                              // Filter out already mapped columns  
                              const unmappedColumns = Object.keys(tableColumns).filter(col =>
                                !mappedFields.includes(col)
                              );

                              // Get hidden mappings
                              const hiddenMappings = dataMappings[cardType as keyof typeof dataMappings]
                                .filter(m => m.location === 'hidden');

                              return [...hiddenMappings.map(m => m.id), ...unmappedColumns];
                            })()}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {(() => {
                                // Get all mapped field values
                                const mappedFields = dataMappings[cardType as keyof typeof dataMappings]
                                  .filter(m => m.location !== 'hidden')
                                  .map(m => m.value);

                                // Get all columns from the current table - add null check
                                const tableColumns = allTableColumns[cardType as keyof typeof allTableColumns] || {};

                                // Filter out already mapped columns - now safe with empty object
                                const unmappedColumns = Object.entries(tableColumns).filter(([col, type]) =>
                                  !mappedFields.includes(col)
                                );

                                // First show any manually hidden mappings
                                const hiddenMappings = dataMappings[cardType as keyof typeof dataMappings]
                                  .filter(m => m.location === 'hidden');

                                return (
                                  <>
                                    {hiddenMappings.map((mapping) => (
                                      <SortableItem key={mapping.id} id={mapping.id}>
                                        <div
                                          className={cn(
                                            "flex-1 flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer transition-colors hover:bg-muted opacity-50",
                                            selectedElement === mapping.field && "ring-2 ring-primary bg-primary/10",
                                            hoveredMapping === mapping.field && "bg-yellow-200/30"
                                          )}
                                          onClick={() => handleElementClick(mapping.field)}
                                          onMouseEnter={() => setHoveredMapping(mapping.field)}
                                          onMouseLeave={() => setHoveredMapping(null)}
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm font-medium capitalize">{mapping.field.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <p className="text-xs text-muted-foreground">{mapping.value}</p>
                                          </div>
                                          <div className="flex items-center gap-2 ml-4">
                                            <Badge variant={getDataTypeBadgeVariant(tableColumns[mapping.value] || 'text')} className="text-xs">
                                              {tableColumns[mapping.value] || 'text'}
                                            </Badge>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleVisibility(mapping.id);
                                              }}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </SortableItem>
                                    ))}

                                    {/* Show all unmapped columns from the database */}
                                    {unmappedColumns.map(([column, type]) => (
                                      <SortableItem key={column} id={column}>
                                        <div
                                          className="flex-1 flex items-center justify-between p-3 rounded-lg bg-muted/30 opacity-50"
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm font-medium">{column.split('.')[1]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || column}</p>
                                            <p className="text-xs text-muted-foreground">{column}</p>
                                          </div>
                                          <Badge variant={getDataTypeBadgeVariant(type as string)} className="text-xs ml-2">
                                            {type as string}
                                          </Badge>
                                        </div>
                                      </SortableItem>
                                    ))}
                                  </>
                                );
                              })()}
                            </div>
                          </SortableContext>
                        </div>
                      </div>
                    </div>
                  </DndContext>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-sm mb-3">Available Tables:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>oem_brands</Badge>
                  <Badge>oem_vehicles</Badge>
                  <Badge>oem_wheels</Badge>
                  <Badge>oem_diameters</Badge>
                  <Badge>oem_widths</Badge>
                  <Badge>oem_bolt_patterns</Badge>
                  <Badge>oem_center_bores</Badge>
                  <Badge>oem_colors</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Grid Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Standard Collection Grid</h4>
                  <code className="text-sm text-primary">
                    {gridClasses}
                  </code>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Breakpoint Configuration:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Badge variant="outline">Mobile: 1 column</Badge>
                    <Badge variant="outline">xs (475px): 2 columns</Badge>
                    <Badge variant="outline">sm (640px): 2 columns</Badge>
                    <Badge variant="outline">md (768px): 3 columns</Badge>
                    <Badge variant="outline">lg (1024px): 4 columns</Badge>
                    <Badge variant="outline">xl (1280px): 5 columns</Badge>
                    <Badge variant="outline">2xl (1536px): 6 columns</Badge>
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-muted rounded-lg">
                  <p className="text-center text-muted-foreground">
                    Grid Preview Area - Resize browser to see responsive behavior
                  </p>
                  <div className={`${gridClasses} mt-4`}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded flex items-center justify-center">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Common Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge className="mb-2">Dimensions</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Fixed height: 240px</li>
                        <li>• Width: Responsive to grid</li>
                        <li>• Aspect ratio: Maintained</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <Badge className="mb-2">Interactions</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• 3D flip animation</li>
                        <li>• Favorite toggle</li>
                        <li>• Hover effects</li>
                        <li>• Text overflow scrolling</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Card Structure</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium">Front Side</p>
                      <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>• Main image or text display</li>
                        <li>• Title/Name with scroll animation</li>
                        <li>• Favorite button (bottom-right)</li>
                        <li>• Flip button (top-right)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium">Back Side</p>
                      <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>• Detailed information</li>
                        <li>• Specifications or description</li>
                        <li>• Same control buttons</li>
                        <li>• Additional metadata</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Special Behaviors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium text-sm">Text Overflow Animation</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        Automatically scrolls long text on hover
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium text-sm">3D Perspective</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        CSS transform with backface visibility
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium text-sm">Responsive Sizing</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        Adapts to container width while maintaining ratio
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium text-sm">State Persistence</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        Maintains flip and favorite states
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Grid Container</h4>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 
  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
  2xl:grid-cols-6 gap-4">
  {items.map(item => (
    <CardComponent key={item.id} data={item} />
  ))}
</div>`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Data Mapping Hook</h4>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const useCardData = (type: CardType) => {
  const [mappings, setMappings] = useState({
    title: 'table.column',
    description: 'table.description',
    // ... other mappings
  });

  const mapDataToCard = (data: any) => {
    return Object.entries(mappings).reduce((acc, [key, path]) => {
      acc[key] = getValueByPath(data, path);
      return acc;
    }, {});
  };

  return { mappings, setMappings, mapDataToCard };
};`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Clickable Elements</h4>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const HighlightableCard = ({ onElementClick, hoveredMapping }) => {
  return (
    <div className="relative">
      <BaseCard />
      
      {/* Overlay for clickable areas */}
      <div 
        className="absolute top-0 left-0 w-full h-32 cursor-pointer"
        onClick={() => onElementClick('title')}
      />
      
      {/* Highlight overlay */}
      {hoveredMapping === 'title' && (
        <div className="absolute top-0 left-0 w-full h-32 
          bg-yellow-300/40 pointer-events-none" />
      )}
    </div>
  );
};`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Database Query</h4>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// Supabase query with joins
const { data, error } = await supabase
  .from('oem_vehicles')
  .select(\`
    *,
    brand:brand_refs!inner(
      brand:oem_brands(*)
    ),
    wheels:wheel_refs(
      wheel:oem_wheels(*)
    )
  \`)
  .order('model_name', { ascending: true });`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CardSystemPage;
