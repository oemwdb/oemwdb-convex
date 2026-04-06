import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SchemaCanvas, {
  type LinkColorMode,
  type TableColorMode,
} from "@/components/schema/SchemaCanvas";
import { TableSelectorPanel } from "@/components/admin/TableSelectorPanel";
import { useTableSelectorState } from "@/hooks/useTableSelectorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SCHEMA_CATALOG,
  type SchemaTableMeta,
} from "@/lib/schemaVisualizer";
import { HardDrive, PanelLeftOpen } from "lucide-react";

const TABLE_COLOR_MODE: TableColorMode = "group";
const LINK_COLOR_MODE: LinkColorMode = "source-group";

export default function SchemaVisualizerPage() {
  const [showWorkshopTables, setShowWorkshopTables] = useState(false);
  const [selectedTableName, setSelectedTableName] = useState("oem_vehicles");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const selectorItems = useMemo(
    () =>
      SCHEMA_CATALOG.map((table) => ({
        name: table.name,
        label: table.name,
        baseGroup: table.group,
      })),
    [],
  );

  const visibleTables = useMemo<SchemaTableMeta[]>(
    () => SCHEMA_CATALOG.filter((table) => showWorkshopTables || !table.isWorkshop),
    [showWorkshopTables],
  );

  useEffect(() => {
    if (!visibleTables.length) return;
    if (!visibleTables.some((table) => table.name === selectedTableName)) {
      setSelectedTableName(visibleTables[0].name);
    }
  }, [selectedTableName, visibleTables]);

  const tableSelectorState = useTableSelectorState(selectorItems, {
    visibleTableNames: visibleTables.map((table) => table.name),
  });

  useEffect(() => {
    if (!activeSectionId) return;
    if (!tableSelectorState.sections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(null);
    }
  }, [activeSectionId, tableSelectorState.sections]);

  const activeSection = tableSelectorState.sections.find(
    (section) => section.id === activeSectionId,
  ) ?? null;

  const activeCustomGroup =
    activeSection?.kind === "custom"
      ? tableSelectorState.customGroups.find((group) => group.id === activeSection.id) ?? null
      : null;

  useEffect(() => {
    if (!activeCustomGroup) {
      if (activeSection?.kind !== "custom") return;
      setActiveSectionId(null);
      return;
    }
  }, [activeCustomGroup, activeSection]);

  const selectedTable =
    visibleTables.find((table) => table.name === selectedTableName) ??
    SCHEMA_CATALOG.find((table) => table.name === selectedTableName) ??
    null;

  return (
    <DashboardLayout
      title="Schema Visualizer"
      showFilterButton={false}
      customTitle="Table selector"
      customActionIcon={<PanelLeftOpen className="h-4 w-4 text-white" />}
      customSidebarSide="left"
      customSidebarInteractive={false}
      customSidebar={
        <TableSelectorPanel
          title="Table selector"
          items={selectorItems}
          activeTableName={selectedTableName}
          onSelectTable={setSelectedTableName}
          sections={tableSelectorState.sections}
          customGroups={tableSelectorState.customGroups}
          createGroup={tableSelectorState.createGroup}
          updateGroup={tableSelectorState.updateGroup}
          assignTablesToGroup={tableSelectorState.assignTablesToGroup}
          removeTablesFromGroup={tableSelectorState.removeTablesFromGroup}
          setGroupColor={tableSelectorState.setGroupColor}
          reorderCustomGroups={tableSelectorState.reorderCustomGroups}
          deleteGroup={tableSelectorState.deleteGroup}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
          rightSlot={
            <Button
              type="button"
              variant={showWorkshopTables ? "secondary" : "outline"}
              size="sm"
              className="h-8 border-border/80"
              onClick={() => setShowWorkshopTables((current) => !current)}
            >
              <HardDrive className="mr-1.5 h-3.5 w-3.5" />
              {showWorkshopTables ? "Workshop" : "Control"}
            </Button>
          }
        />
      }
    >
      <div className="relative h-full min-h-[720px] overflow-hidden rounded-2xl border border-border bg-[#0e1014] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          {selectedTable ? (
            <Badge variant="outline" className="border-border/70 bg-black/55 text-foreground backdrop-blur">
              {selectedTable.name}
            </Badge>
          ) : null}
          {activeCustomGroup ? (
            <Badge variant="outline" className="border-border/70 bg-black/55 text-foreground backdrop-blur">
              Group: {activeCustomGroup.name}
            </Badge>
          ) : activeSection ? (
            <Badge variant="outline" className="border-border/70 bg-black/55 text-foreground backdrop-blur">
              Section: {activeSection.name}
            </Badge>
          ) : null}
          {showWorkshopTables ? (
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-100 backdrop-blur">
              Workshop tables visible
            </Badge>
          ) : null}
        </div>

        <SchemaCanvas
          className="h-full"
          tables={visibleTables}
          sections={tableSelectorState.sections}
          selectedTableName={selectedTable?.name ?? null}
          onSelectTable={setSelectedTableName}
          tableColorMode={TABLE_COLOR_MODE}
          linkColorMode={LINK_COLOR_MODE}
          customGroups={tableSelectorState.customGroups}
          activeSectionId={activeSectionId}
          activeCustomGroupId={activeCustomGroup?.id ?? null}
          nodePositions={tableSelectorState.schemaNodePositions}
          sectionLayouts={tableSelectorState.schemaSectionLayouts}
          onNodePositionsChange={tableSelectorState.setSchemaNodePositions}
          onSectionLayoutsChange={tableSelectorState.setSchemaSectionLayouts}
          viewport={tableSelectorState.schemaViewport}
          onViewportChange={tableSelectorState.setSchemaViewport}
          onAssignTablesToGroup={tableSelectorState.assignTablesToGroup}
          onRemoveTablesFromGroup={tableSelectorState.removeTablesFromGroup}
          onSetSectionCanvasPosition={tableSelectorState.setSchemaSectionLayoutPosition}
          onSetSectionCanvasSize={tableSelectorState.setSchemaSectionLayoutSize}
          onFocusSection={setActiveSectionId}
          onRenameGroup={(groupId, name) => tableSelectorState.updateGroup(groupId, { name })}
        />
      </div>
    </DashboardLayout>
  );
}
