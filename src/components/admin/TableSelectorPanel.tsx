import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  TableSelectorCustomGroup,
  TableSelectorGroupColor,
  TableSelectorItem,
  TableSelectorSection,
} from "@/hooks/useTableSelectorState";
import { TABLE_SELECTOR_GROUP_COLORS } from "@/hooks/useTableSelectorState";
import {
  GripVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

interface TableSelectorPanelProps {
  title?: string;
  items: TableSelectorItem[];
  activeTableName: string;
  onSelectTable: (tableName: string) => void;
  sections: TableSelectorSection[];
  customGroups: TableSelectorCustomGroup[];
  createGroup: (name: string, tableNames: string[]) => TableSelectorCustomGroup | null;
  updateGroup: (groupId: string, updates: Partial<Omit<TableSelectorCustomGroup, "id">>) => void;
  assignTablesToGroup: (groupId: string, tableNames: string[]) => void;
  removeTablesFromGroup: (groupId: string, tableNames: string[]) => void;
  setGroupColor: (groupId: string, color: TableSelectorGroupColor) => void;
  reorderCustomGroups: (activeGroupId: string, overGroupId: string) => void;
  deleteGroup: (groupId: string) => void;
  activeSectionId?: string | null;
  onSelectSection?: (sectionId: string | null) => void;
  rightSlot?: React.ReactNode;
}

function SortableCustomSection({
  id,
  children,
}: {
  id: string;
  children: (dragHandleProps: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
    setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"];
    isDragging: boolean;
  }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(isDragging && "opacity-65")}
    >
      {children({ attributes, listeners, setActivatorNodeRef, isDragging })}
    </div>
  );
}

export function TableSelectorPanel({
  title = "Tables",
  items,
  activeTableName,
  onSelectTable,
  sections,
  customGroups,
  createGroup,
  updateGroup,
  assignTablesToGroup,
  removeTablesFromGroup,
  setGroupColor,
  reorderCustomGroups,
  deleteGroup,
  activeSectionId,
  onSelectSection,
  rightSlot,
}: TableSelectorPanelProps) {
  const [query, setQuery] = useState("");
  const [selectedTableNames, setSelectedTableNames] = useState<string[]>([]);
  const [draftGroupName, setDraftGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sections;

    return sections
      .map((section) => {
        const matchingTables = section.tables.filter((table) =>
          table.label.toLowerCase().includes(normalizedQuery) ||
          table.name.toLowerCase().includes(normalizedQuery)
        );

        const matchesSectionName = section.name.toLowerCase().includes(normalizedQuery);

        return {
          ...section,
          tables: matchesSectionName ? section.tables : matchingTables,
          __matchesSectionName: matchesSectionName,
        };
      })
      .filter((section) => section.kind === "custom" || section.tables.length > 0);
  }, [query, sections]);

  const selectedCount = selectedTableNames.length;
  const canCreateGroup = draftGroupName.trim().length > 0 || selectedCount > 0;
  const customSections = filteredSections.filter((section) => section.kind === "custom");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleSelectedTable = (tableName: string) => {
    setSelectedTableNames((current) =>
      current.includes(tableName)
        ? current.filter((name) => name !== tableName)
        : [...current, tableName]
    );
  };

  const handleCreateGroup = () => {
    const nextGroup = createGroup(draftGroupName, selectedTableNames);
    if (!nextGroup) return;
    setDraftGroupName("");
    setSelectedTableNames([]);
  };

  const handleStartRename = (group: TableSelectorCustomGroup) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  const handleCommitRename = () => {
    if (!editingGroupId) return;
    updateGroup(editingGroupId, { name: editingGroupName.trim() || "Untitled group" });
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleReplaceGroup = (groupId: string) => {
    if (!selectedTableNames.length) return;
    updateGroup(groupId, { tableNames: selectedTableNames });
    setSelectedTableNames([]);
  };

  const handleAddToGroup = (groupId: string) => {
    if (!selectedTableNames.length) return;
    assignTablesToGroup(groupId, selectedTableNames);
    setSelectedTableNames([]);
  };

  const handleRemoveFromGroup = (groupId: string) => {
    if (!selectedTableNames.length) return;
    removeTablesFromGroup(groupId, selectedTableNames);
    setSelectedTableNames([]);
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || typeof active.id !== "string" || typeof over.id !== "string") return;
    reorderCustomGroups(active.id, over.id);
  };

  const renderSection = (
    section: TableSelectorSection,
    dragHandleProps?: {
      attributes: ReturnType<typeof useSortable>["attributes"];
      listeners: ReturnType<typeof useSortable>["listeners"];
      setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"];
      isDragging: boolean;
    },
  ) => {
    const customGroup = section.kind === "custom"
      ? customGroups.find((group) => group.id === section.id) ?? null
      : null;
    const isActiveSection = section.id === activeSectionId;

    return (
      <div
        key={section.id}
        className={cn("space-y-2", dragHandleProps?.isDragging && "z-10")}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          {editingGroupId === section.id ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Input
                value={editingGroupName}
                onChange={(event) => setEditingGroupName(event.target.value)}
                className="h-8 border-border/70 bg-black/25 text-sm"
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleCommitRename();
                  if (event.key === "Escape") {
                    setEditingGroupId(null);
                    setEditingGroupName("");
                  }
                }}
              />
              <Button type="button" size="sm" className="h-8" onClick={handleCommitRename}>
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex min-w-0 items-center gap-1">
                {dragHandleProps ? (
                  <button
                    type="button"
                    ref={dragHandleProps.setActivatorNodeRef}
                    {...dragHandleProps.attributes}
                    {...dragHandleProps.listeners}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/6 hover:text-foreground"
                    title="Drag to reorder group"
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                ) : null}
                <button
                  type="button"
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-colors",
                    isActiveSection ? "bg-white/6" : "hover:bg-white/4"
                  )}
                  onClick={() => {
                    if (!onSelectSection) return;
                    onSelectSection(isActiveSection ? null : section.id);
                  }}
                >
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
                    {section.name}
                  </p>
                  <Badge variant="outline" className="border-border/70 bg-black/25 text-xs text-foreground">
                    {section.tables.length}
                  </Badge>
                  {customGroup?.color ? (
                    <Badge
                      variant="outline"
                      className={cn("border text-[10px]", TABLE_SELECTOR_GROUP_COLORS[customGroup.color].badgeClassName)}
                    >
                      {TABLE_SELECTOR_GROUP_COLORS[customGroup.color].label}
                    </Badge>
                  ) : null}
                  {isActiveSection ? (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10px] text-foreground">
                      Focused
                    </Badge>
                  ) : null}
                </button>
              </div>

              {section.kind === "custom" && customGroup ? (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    disabled={!selectedCount}
                    onClick={() => handleAddToGroup(customGroup.id)}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    disabled={!selectedCount}
                    onClick={() => handleRemoveFromGroup(customGroup.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    disabled={!selectedCount}
                    onClick={() => handleReplaceGroup(customGroup.id)}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => handleStartRename(customGroup)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteGroup(customGroup.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="space-y-1">
          {customGroup ? (
            <div className="flex flex-wrap gap-1 px-1 pb-1">
              {(Object.keys(TABLE_SELECTOR_GROUP_COLORS) as TableSelectorGroupColor[]).map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "h-5 w-5 rounded-full border transition-transform hover:scale-105",
                    customGroup.color === color ? "border-white/80" : "border-white/20"
                  )}
                  style={{
                    backgroundColor: TABLE_SELECTOR_GROUP_COLORS[color].fill,
                    boxShadow: `inset 0 0 0 1px ${TABLE_SELECTOR_GROUP_COLORS[color].stroke}`,
                  }}
                  title={TABLE_SELECTOR_GROUP_COLORS[color].label}
                  onClick={() => setGroupColor(customGroup.id, color)}
                />
              ))}
            </div>
          ) : null}
          {section.tables.map((table) => {
            const isActive = table.name === activeTableName;
            const isSelected = selectedTableNames.includes(table.name);

            return (
              <div
                key={table.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/60 bg-black/20 hover:bg-white/5"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelectedTable(table.name)}
                  className="h-4 w-4 border-border/70"
                />
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelectTable(table.name)}
                >
                  <p className="truncate text-sm font-medium text-foreground">{table.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{table.name}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">
              Shared selector for tables and schema
            </p>
          </div>
          {rightSlot}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tables..."
            className="h-9 border-border/80 bg-black/25 pl-9"
          />
        </div>

        <div className="rounded-xl border border-border/70 bg-black/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-border/70 bg-black/25 text-foreground">
              {items.length} tables
            </Badge>
            <Badge variant="outline" className="border-border/70 bg-black/25 text-foreground">
              {customGroups.length} custom groups
            </Badge>
            {selectedCount ? (
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-foreground">
                {selectedCount} selected
              </Badge>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              value={draftGroupName}
              onChange={(event) => setDraftGroupName(event.target.value)}
              placeholder="New group name"
              className="h-8 max-w-[180px] border-border/80 bg-black/30 text-sm"
            />
            <Button
              type="button"
              size="sm"
              className="h-8"
              disabled={!canCreateGroup}
              onClick={handleCreateGroup}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create group
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground"
              disabled={!selectedCount}
              onClick={() => setSelectedTableNames([])}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Clear selection
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
          <SortableContext
            items={customSections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredSections.map((section) =>
                section.kind === "custom" ? (
                  <SortableCustomSection key={section.id} id={section.id}>
                    {(dragHandleProps) => renderSection(section, dragHandleProps)}
                  </SortableCustomSection>
                ) : (
                  renderSection(section)
                ),
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
