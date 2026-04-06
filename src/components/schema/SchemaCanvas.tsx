import {
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TABLE_SELECTOR_GROUP_COLORS,
  type SchemaCanvasNodePosition,
  type SchemaCanvasSectionLayout,
  type SchemaCanvasNodeSize,
  type SchemaCanvasViewport,
  type TableSelectorCustomGroup,
  type TableSelectorSection,
} from "@/hooks/useTableSelectorState";
import { TABLE_GROUP_ACCENTS, TABLE_GROUP_ORDER } from "@/lib/tableGroups";
import { cn } from "@/lib/utils";
import {
  type SchemaTableGroup,
  type SchemaTableMeta,
} from "@/lib/schemaVisualizer";
import {
  ArrowRightLeft,
  Boxes,
  Crosshair,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

export type TableColorMode = "group" | "domain" | "namespace" | "structure" | "none";
export type LinkColorMode = "neutral" | "source-group" | "target-group" | "matching";

interface SchemaCanvasProps {
  tables: SchemaTableMeta[];
  sections: TableSelectorSection[];
  selectedTableName: string | null;
  onSelectTable: (tableName: string) => void;
  tableColorMode: TableColorMode;
  linkColorMode: LinkColorMode;
  customGroups: TableSelectorCustomGroup[];
  activeSectionId: string | null;
  activeCustomGroupId: string | null;
  nodePositions: Record<string, SchemaCanvasNodePosition>;
  sectionLayouts: Record<string, SchemaCanvasSectionLayout>;
  onNodePositionsChange: Dispatch<SetStateAction<Record<string, SchemaCanvasNodePosition>>>;
  onSectionLayoutsChange: Dispatch<SetStateAction<Record<string, SchemaCanvasSectionLayout>>>;
  viewport: SchemaCanvasViewport | null;
  onViewportChange: Dispatch<SetStateAction<SchemaCanvasViewport | null>>;
  onAssignTablesToGroup: (groupId: string, tableNames: string[]) => void;
  onRemoveTablesFromGroup: (groupId: string, tableNames: string[]) => void;
  onSetSectionCanvasPosition: (sectionId: string, position: SchemaCanvasNodePosition) => void;
  onSetSectionCanvasSize: (sectionId: string, size: SchemaCanvasNodeSize) => void;
  onFocusSection: (sectionId: string | null) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  className?: string;
}

type NodePosition = SchemaCanvasNodePosition;
type ViewportState = SchemaCanvasViewport;
type GroupBounds = {
  groupId: string;
  kind: "custom" | "system";
  name: string;
  color?: keyof typeof TABLE_SELECTOR_GROUP_COLORS;
  baseGroup?: SchemaTableGroup;
  memberNames: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  empty: boolean;
  isActive: boolean;
};

const NODE_WIDTH = 220;
const NODE_HEIGHT = 116;
const GROUP_COLUMN_WIDTH = 300;
const ROW_HEIGHT = 150;
const MAX_ROWS_PER_COLUMN = 7;
const MIN_SCALE = 0.2;
const MAX_SCALE = 1.8;
const GRID_SIZE = 24;
const DEFAULT_VIEWPORT: ViewportState = { x: 470, y: 120, scale: 0.88 };
const EMPTY_GROUP_WIDTH = 360;
const EMPTY_GROUP_HEIGHT = 180;
const GROUP_PADDING_X = 44;
const GROUP_PADDING_Y = 38;
const GROUP_RESIZE_EDGE_HIT = 16;

const DOMAIN_ACCENTS: Record<string, { className: string; stroke: string }> = {
  brands: {
    className: "border-orange-500/25 bg-orange-500/10 text-orange-200",
    stroke: "rgba(251, 146, 60, 0.58)",
  },
  vehicles: {
    className: "border-blue-500/25 bg-blue-500/10 text-blue-200",
    stroke: "rgba(96, 165, 250, 0.58)",
  },
  wheels: {
    className: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
    stroke: "rgba(34, 211, 238, 0.58)",
  },
  engines: {
    className: "border-red-500/25 bg-red-500/10 text-red-200",
    stroke: "rgba(248, 113, 113, 0.6)",
  },
  colors: {
    className: "border-violet-500/25 bg-violet-500/10 text-violet-200",
    stroke: "rgba(167, 139, 250, 0.58)",
  },
  market: {
    className: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    stroke: "rgba(251, 113, 133, 0.58)",
  },
  "powertrain tags": {
    className: "border-lime-500/25 bg-lime-500/10 text-lime-200",
    stroke: "rgba(163, 230, 53, 0.58)",
  },
  users: {
    className: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200",
    stroke: "rgba(232, 121, 249, 0.58)",
  },
  assets: {
    className: "border-violet-500/25 bg-violet-500/10 text-violet-200",
    stroke: "rgba(167, 139, 250, 0.58)",
  },
  shared: {
    className: "border-zinc-500/25 bg-zinc-500/10 text-zinc-200",
    stroke: "rgba(161, 161, 170, 0.5)",
  },
};

const NAMESPACE_ACCENTS: Record<string, { className: string; stroke: string }> = {
  oem: {
    className: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    stroke: "rgba(56, 189, 248, 0.58)",
  },
  junction: {
    className: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    stroke: "rgba(251, 191, 36, 0.62)",
  },
  user: {
    className: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200",
    stroke: "rgba(232, 121, 249, 0.58)",
  },
  market: {
    className: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    stroke: "rgba(251, 113, 133, 0.58)",
  },
  workshop: {
    className: "border-red-500/25 bg-red-500/10 text-red-200",
    stroke: "rgba(248, 113, 113, 0.62)",
  },
  system: {
    className: "border-zinc-500/25 bg-zinc-500/10 text-zinc-200",
    stroke: "rgba(161, 161, 170, 0.5)",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getInitialNodePositions(tables: SchemaTableMeta[]): Record<string, NodePosition> {
  const byGroup = new Map<SchemaTableGroup, SchemaTableMeta[]>();

  for (const table of tables) {
    const bucket = byGroup.get(table.group) ?? [];
    bucket.push(table);
    byGroup.set(table.group, bucket);
  }

  const positions: Record<string, NodePosition> = {};
  let currentX = 72;

  TABLE_GROUP_ORDER.forEach((group) => {
    const groupTables = (byGroup.get(group) ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
    const columnCount = Math.max(1, Math.ceil(groupTables.length / MAX_ROWS_PER_COLUMN));

    groupTables.forEach((table, index) => {
      const subColumn = Math.floor(index / MAX_ROWS_PER_COLUMN);
      const row = index % MAX_ROWS_PER_COLUMN;

      positions[table.name] = {
        x: snapToGrid(currentX + subColumn * (NODE_WIDTH + 44)),
        y: snapToGrid(row * ROW_HEIGHT + 72),
      };
    });

    const laneWidth = Math.max(
      GROUP_COLUMN_WIDTH,
      columnCount * (NODE_WIDTH + 44) + GROUP_PADDING_X * 2,
    );
    currentX += laneWidth + 180;
  });

  return positions;
}

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function isPointInsideBounds(
  point: { x: number; y: number },
  bounds: { x: number; y: number; width: number; height: number },
) {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

function doBoundsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resolveNonOverlappingBounds(
  targetBounds: { x: number; y: number; width: number; height: number },
  otherBounds: Array<{ x: number; y: number; width: number; height: number }>,
  deltaX: number,
  deltaY: number,
) {
  if (!otherBounds.some((bounds) => doBoundsOverlap(targetBounds, bounds))) {
    return targetBounds;
  }

  const primaryAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? "x" : "y";
  const secondaryAxis = primaryAxis === "x" ? "y" : "x";
  const primaryDirection = (primaryAxis === "x" ? deltaX : deltaY) >= 0 ? 1 : -1;
  const secondaryDirection = (secondaryAxis === "x" ? deltaX : deltaY) >= 0 ? 1 : -1;
  const maxSteps = 180;

  const tryCandidate = (x: number, y: number) => {
    const candidate = {
      ...targetBounds,
      x: snapToGrid(x),
      y: snapToGrid(y),
    };
    return otherBounds.some((bounds) => doBoundsOverlap(candidate, bounds)) ? null : candidate;
  };

  for (let primaryStep = 0; primaryStep <= maxSteps; primaryStep += 1) {
    const primaryOffset = primaryStep * GRID_SIZE * primaryDirection;
    const baseX = primaryAxis === "x" ? targetBounds.x + primaryOffset : targetBounds.x;
    const baseY = primaryAxis === "y" ? targetBounds.y + primaryOffset : targetBounds.y;

    const straight = tryCandidate(baseX, baseY);
    if (straight) return straight;

    for (let secondaryStep = 1; secondaryStep <= maxSteps; secondaryStep += 1) {
      const secondaryOffset = secondaryStep * GRID_SIZE * secondaryDirection;
      const altA = tryCandidate(
        secondaryAxis === "x" ? baseX + secondaryOffset : baseX,
        secondaryAxis === "y" ? baseY + secondaryOffset : baseY,
      );
      if (altA) return altA;

      const altB = tryCandidate(
        secondaryAxis === "x" ? baseX - secondaryOffset : baseX,
        secondaryAxis === "y" ? baseY - secondaryOffset : baseY,
      );
      if (altB) return altB;
    }
  }

  return targetBounds;
}

export default function SchemaCanvas({
  tables,
  sections = [],
  selectedTableName,
  onSelectTable,
  tableColorMode,
  linkColorMode,
  customGroups,
  activeSectionId,
  activeCustomGroupId,
  nodePositions,
  sectionLayouts,
  onNodePositionsChange,
  onSectionLayoutsChange,
  viewport,
  onViewportChange,
  onAssignTablesToGroup,
  onRemoveTablesFromGroup,
  onSetSectionCanvasPosition,
  onSetSectionCanvasSize,
  onFocusSection,
  onRenameGroup,
  className,
}: SchemaCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const dragStateRef = useRef<
    | {
        type: "node";
        tableName: string;
        pointerId: number;
        offsetX: number;
        offsetY: number;
      }
    | {
        type: "group";
        groupId: string;
        pointerId: number;
        startWorldX: number;
        startWorldY: number;
        groupStartPosition: SchemaCanvasNodePosition;
        memberNames: string[];
        memberStartPositions: Record<string, SchemaCanvasNodePosition>;
      }
    | {
        type: "group-resize";
        groupId: string;
        pointerId: number;
        startWorldX: number;
        startWorldY: number;
        startPosition: SchemaCanvasNodePosition;
        startWidth: number;
        startHeight: number;
        minWidth: number;
        minHeight: number;
        resizeLeft: boolean;
        resizeRight: boolean;
        resizeTop: boolean;
        resizeBottom: boolean;
      }
    | {
        type: "pan";
        pointerId: number;
        startClientX: number;
        startClientY: number;
        startViewportX: number;
        startViewportY: number;
      }
    | null
  >(null);

  const initialNodePositions = useMemo(() => getInitialNodePositions(tables), [tables]);
  const effectiveNodePositions = useMemo(
    () => ({ ...initialNodePositions, ...nodePositions }),
    [initialNodePositions, nodePositions],
  );
  const effectiveViewport = viewport ?? DEFAULT_VIEWPORT;

  const tableByName = useMemo(
    () => new Map(tables.map((table) => [table.name, table])),
    [tables]
  );

  const selectedTable = selectedTableName ? tableByName.get(selectedTableName) ?? null : null;

  const connectedTables = useMemo(() => {
    if (!selectedTable) return new Set<string>();

    const names = new Set<string>();
    names.add(selectedTable.name);

    for (const relation of selectedTable.outboundRelations) names.add(relation.targetTable);
    for (const relation of selectedTable.inboundRelations) names.add(relation.sourceTable);
    for (const path of selectedTable.junctionPaths) {
      names.add(path.junctionTable);
      for (const companion of path.companionTables) names.add(companion);
    }

    return names;
  }, [selectedTable]);

  const edges = useMemo(() => {
    const visibleNames = new Set(tables.map((table) => table.name));
    const focused = !!selectedTable;

    return tables.flatMap((table) =>
      table.outboundRelations
        .filter((relation) => visibleNames.has(relation.targetTable))
        .filter((relation) => {
          if (!focused) return true;
          return table.name === selectedTable?.name || relation.targetTable === selectedTable?.name;
        })
        .map((relation) => ({
          key: `${table.name}:${relation.field}:${relation.targetTable}`,
          sourceTable: table.name,
          targetTable: relation.targetTable,
          field: relation.field,
        }))
    );
  }, [selectedTable, tables]);

  const startEditingGroup = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditingGroupName(currentName);
  };

  const commitGroupRename = () => {
    if (!editingGroupId) return;
    onRenameGroup(editingGroupId, editingGroupName.trim() || "Untitled group");
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const cancelGroupRename = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const canvasGroups = useMemo<GroupBounds[]>(() => {
    const focusedCustomTableNames = new Set(
      (
        customGroups.find((group) => group.id === activeCustomGroupId)?.tableNames ?? []
      ).filter((tableName) => tableByName.has(tableName)),
    );
    const systemDerivedRightEdge = sections.reduce((maxRight, section) => {
      if (section.kind !== "system") return maxRight;

      const memberNames = section.tables
        .map((table) => table.name)
        .filter((tableName) => tableByName.has(tableName))
        .filter((tableName) => !focusedCustomTableNames.has(tableName));
      const layout = sectionLayouts[section.id];

      if (!memberNames.length) {
        return layout ? Math.max(maxRight, layout.x + layout.width) : maxRight;
      }

      const xs = memberNames.map((tableName) => effectiveNodePositions[tableName].x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const derivedX = snapToGrid(minX - GROUP_PADDING_X);
      const derivedWidth = snapToGrid(
        maxX - minX + NODE_WIDTH + GROUP_PADDING_X * 2,
      );

      return Math.max(
        maxRight,
        (layout?.x ?? derivedX) + (layout?.width ?? Math.max(derivedWidth, 320)),
      );
    }, 0);
    const customFallbackStartX = snapToGrid(Math.max(systemDerivedRightEdge + 180, 72));

    let customIndex = 0;

    return sections.flatMap((section) => {
      const candidateMemberNames = section.tables
        .map((table) => table.name)
        .filter((tableName) => tableByName.has(tableName));

      const memberNames =
        section.kind === "custom"
          ? section.id === activeCustomGroupId
            ? candidateMemberNames
            : []
          : candidateMemberNames.filter((tableName) => !focusedCustomTableNames.has(tableName));

      const sectionLayout = sectionLayouts[section.id];
      const isCustom = section.kind === "custom";
      const fallbackX = snapToGrid(
        (isCustom ? customFallbackStartX : 72) + (customIndex % 2) * 420,
      );
      const fallbackY = snapToGrid(72 + Math.floor(customIndex / 2) * 220);
      const minWidth = isCustom ? EMPTY_GROUP_WIDTH : 320;
      const minHeight = isCustom ? EMPTY_GROUP_HEIGHT : 180;

      if (isCustom) {
        customIndex += 1;
      }

      if (!memberNames.length) {
        if (!isCustom && !sectionLayout) {
          return [];
        }

        return {
          groupId: section.id,
          kind: isCustom ? "custom" : "system",
          name: section.name,
          color: isCustom
            ? customGroups.find((group) => group.id === section.id)?.color ?? "slate"
            : undefined,
          baseGroup: section.baseGroup,
          memberNames,
          x: snapToGrid(sectionLayout?.x ?? fallbackX),
          y: snapToGrid(sectionLayout?.y ?? fallbackY),
          width: snapToGrid(Math.max(sectionLayout?.width ?? EMPTY_GROUP_WIDTH, minWidth)),
          height: snapToGrid(Math.max(sectionLayout?.height ?? EMPTY_GROUP_HEIGHT, minHeight)),
          minWidth,
          minHeight,
          empty: true,
          isActive: section.id === activeSectionId,
        };
      }

      const xs = memberNames.map((tableName) => effectiveNodePositions[tableName].x);
      const ys = memberNames.map((tableName) => effectiveNodePositions[tableName].y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      const contentX = snapToGrid(minX - GROUP_PADDING_X);
      const contentY = snapToGrid(minY - GROUP_PADDING_Y);
      const defaultWidth = snapToGrid(maxX - minX + NODE_WIDTH + GROUP_PADDING_X * 2);
      const defaultHeight = snapToGrid(maxY - minY + NODE_HEIGHT + GROUP_PADDING_Y * 2);

      return {
        groupId: section.id,
        kind: isCustom ? "custom" : "system",
        name: section.name,
        color: isCustom
          ? customGroups.find((group) => group.id === section.id)?.color ?? "slate"
          : undefined,
        baseGroup: section.baseGroup,
        memberNames,
        x: snapToGrid(sectionLayout?.x ?? contentX),
        y: snapToGrid(sectionLayout?.y ?? contentY),
        width: snapToGrid(Math.max(sectionLayout?.width ?? defaultWidth, minWidth)),
        height: snapToGrid(Math.max(sectionLayout?.height ?? defaultHeight, minHeight)),
        minWidth,
        minHeight,
        empty: false,
        isActive: section.id === activeSectionId,
      };
    });
  }, [
    activeCustomGroupId,
    activeSectionId,
    customGroups,
    effectiveNodePositions,
    sectionLayouts,
    sections,
    tableByName,
  ]);

  const customGroupBounds = useMemo(
    () => canvasGroups.filter((group) => group.kind === "custom"),
    [canvasGroups],
  );

  const sceneBounds = useMemo(() => {
    const positions = tables.map((table) => effectiveNodePositions[table.name]).filter(Boolean);
    const maxX = positions.length ? Math.max(...positions.map((position) => position.x)) : 0;
    const maxY = positions.length ? Math.max(...positions.map((position) => position.y)) : 0;
    const groupMaxX = canvasGroups.length
      ? Math.max(...canvasGroups.map((bounds) => bounds.x + bounds.width))
      : 0;
    const groupMaxY = canvasGroups.length
      ? Math.max(...canvasGroups.map((bounds) => bounds.y + bounds.height))
      : 0;

    return {
      width: Math.max(maxX + NODE_WIDTH + 240, groupMaxX + 240, 1800),
      height: Math.max(maxY + NODE_HEIGHT + 240, groupMaxY + 240, 1100),
    };
  }, [canvasGroups, effectiveNodePositions, tables]);

  const getWorldPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    return {
      x: (clientX - rect.left - effectiveViewport.x) / effectiveViewport.scale,
      y: (clientY - rect.top - effectiveViewport.y) / effectiveViewport.scale,
    };
  };

  const resetLayout = () => {
    onNodePositionsChange(getInitialNodePositions(tables));
    onSectionLayoutsChange({});
    onFocusSection(null);
    onViewportChange(DEFAULT_VIEWPORT);
  };

  const focusSelectedTable = () => {
    if (!selectedTable) return;
    const position = effectiveNodePositions[selectedTable.name];
    if (!position) return;

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;
    const targetScale = effectiveViewport.scale;

    onViewportChange({
      x: width / 2 - (position.x + NODE_WIDTH / 2) * targetScale,
      y: height / 2 - (position.y + NODE_HEIGHT / 2) * targetScale,
      scale: targetScale,
    });
  };

  const handleCanvasPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    dragStateRef.current = {
      type: "pan",
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startViewportX: effectiveViewport.x,
      startViewportY: effectiveViewport.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCanvasPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (dragState.type === "pan") {
      onViewportChange((current) => ({
        ...(current ?? DEFAULT_VIEWPORT),
        x: dragState.startViewportX + (event.clientX - dragState.startClientX),
        y: dragState.startViewportY + (event.clientY - dragState.startClientY),
      }));
      return;
    }

    if (dragState.type === "group") {
      const worldPoint = getWorldPoint(event.clientX, event.clientY);
      const deltaX = snapToGrid(worldPoint.x - dragState.startWorldX);
      const deltaY = snapToGrid(worldPoint.y - dragState.startWorldY);
      const nextGroupPosition = {
        x: snapToGrid(dragState.groupStartPosition.x + deltaX),
        y: snapToGrid(dragState.groupStartPosition.y + deltaY),
      };

      if (dragState.memberNames.length) {
        onNodePositionsChange((current) => {
          const next = { ...current };

          dragState.memberNames.forEach((tableName) => {
            const base =
              dragState.memberStartPositions[tableName] ?? effectiveNodePositions[tableName];
            if (!base) return;
            next[tableName] = {
              x: snapToGrid(base.x + deltaX),
              y: snapToGrid(base.y + deltaY),
            };
          });

          return next;
        });
      }

      onSetSectionCanvasPosition(dragState.groupId, nextGroupPosition);
      return;
    }

    if (dragState.type === "group-resize") {
      const worldPoint = getWorldPoint(event.clientX, event.clientY);
      const deltaX = snapToGrid(worldPoint.x - dragState.startWorldX);
      const deltaY = snapToGrid(worldPoint.y - dragState.startWorldY);

      let nextX = dragState.startPosition.x;
      let nextY = dragState.startPosition.y;
      let nextWidth = dragState.startWidth;
      let nextHeight = dragState.startHeight;

      if (dragState.resizeRight) {
        nextWidth = Math.max(dragState.minWidth, dragState.startWidth + deltaX);
      }
      if (dragState.resizeBottom) {
        nextHeight = Math.max(dragState.minHeight, dragState.startHeight + deltaY);
      }
      if (dragState.resizeLeft) {
        const proposedWidth = dragState.startWidth - deltaX;
        nextWidth = Math.max(dragState.minWidth, proposedWidth);
        nextX = snapToGrid(dragState.startPosition.x + (dragState.startWidth - nextWidth));
      }
      if (dragState.resizeTop) {
        const proposedHeight = dragState.startHeight - deltaY;
        nextHeight = Math.max(dragState.minHeight, proposedHeight);
        nextY = snapToGrid(dragState.startPosition.y + (dragState.startHeight - nextHeight));
      }

      onSetSectionCanvasPosition(dragState.groupId, {
        x: nextX,
        y: nextY,
      });
      onSetSectionCanvasSize(dragState.groupId, {
        width: snapToGrid(nextWidth),
        height: snapToGrid(nextHeight),
      });
      return;
    }

    const worldPoint = getWorldPoint(event.clientX, event.clientY);
    onNodePositionsChange((current) => ({
      ...current,
      [dragState.tableName]: {
        x: snapToGrid(worldPoint.x - dragState.offsetX),
        y: snapToGrid(worldPoint.y - dragState.offsetY),
      },
    }));
  };

  const handleCanvasPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    const dragState = dragStateRef.current;

    if (dragState?.type === "group" || dragState?.type === "group-resize") {
      const currentBounds = canvasGroups.find((group) => group.groupId === dragState.groupId);
      if (currentBounds) {
        const otherBounds = canvasGroups
          .filter((group) => group.groupId !== dragState.groupId)
          .map((group) => ({
            x: group.x,
            y: group.y,
            width: group.width,
            height: group.height,
          }));
        const startPosition =
          dragState.type === "group" ? dragState.groupStartPosition : dragState.startPosition;
        const resolvedBounds = resolveNonOverlappingBounds(
          {
            x: currentBounds.x,
            y: currentBounds.y,
            width: currentBounds.width,
            height: currentBounds.height,
          },
          otherBounds,
          currentBounds.x - startPosition.x,
          currentBounds.y - startPosition.y,
        );

        if (resolvedBounds.x !== currentBounds.x || resolvedBounds.y !== currentBounds.y) {
          onSetSectionCanvasPosition(dragState.groupId, {
            x: resolvedBounds.x,
            y: resolvedBounds.y,
          });

          if (dragState.type === "group" && dragState.memberNames.length) {
            const offsetX = resolvedBounds.x - currentBounds.x;
            const offsetY = resolvedBounds.y - currentBounds.y;
            if (offsetX || offsetY) {
              onNodePositionsChange((current) => {
                const next = { ...current };

                dragState.memberNames.forEach((tableName) => {
                  const base = current[tableName] ?? effectiveNodePositions[tableName];
                  if (!base) return;
                  next[tableName] = {
                    x: snapToGrid(base.x + offsetX),
                    y: snapToGrid(base.y + offsetY),
                  };
                });

                return next;
              });
            }
          }
        }
      }
    }

    if (dragState?.type === "node") {
      const position = effectiveNodePositions[dragState.tableName];
      if (position) {
        const centerX = position.x + NODE_WIDTH / 2;
        const centerY = position.y + NODE_HEIGHT / 2;
        const matchingBounds = customGroupBounds.filter(
          (bounds) =>
            centerX >= bounds.x &&
            centerX <= bounds.x + bounds.width &&
            centerY >= bounds.y &&
            centerY <= bounds.y + bounds.height,
        );

        const preferredGroup =
          matchingBounds.length
            ? ((activeCustomGroupId
                ? matchingBounds.find((bounds) => bounds.groupId === activeCustomGroupId)
                : null) ??
              matchingBounds[matchingBounds.length - 1])
            : null;

        const currentGroups = customGroups.filter((group) =>
          group.tableNames.includes(dragState.tableName),
        );

        if (preferredGroup) {
          if (!currentGroups.some((group) => group.id === preferredGroup.groupId)) {
            onAssignTablesToGroup(preferredGroup.groupId, [dragState.tableName]);
          }
          onFocusSection(preferredGroup.groupId);
        }

        if (activeCustomGroupId && currentGroups.some((group) => group.id === activeCustomGroupId)) {
          const focusedBounds = customGroupBounds.find(
            (candidate) => candidate.groupId === activeCustomGroupId,
          );
          const isInsideFocusedGroup = focusedBounds
            ? isPointInsideBounds(
                { x: centerX, y: centerY },
                {
                  x: focusedBounds.x,
                  y: focusedBounds.y,
                  width: focusedBounds.width,
                  height: focusedBounds.height,
                },
              )
            : false;

          if (!isInsideFocusedGroup) {
            onRemoveTablesFromGroup(activeCustomGroupId, [dragState.tableName]);
          }
        }
      }
    }
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleGroupPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    groupId: string,
    memberNames: string[],
    position: SchemaCanvasNodePosition,
  ) => {
    event.stopPropagation();
    onFocusSection(groupId);

    const worldPoint = getWorldPoint(event.clientX, event.clientY);
    const memberStartPositions = Object.fromEntries(
      memberNames
        .map((tableName) => {
          const tablePosition = effectiveNodePositions[tableName];
          return tablePosition ? [tableName, tablePosition] : null;
        })
        .filter(Boolean) as Array<[string, SchemaCanvasNodePosition]>,
    );

    dragStateRef.current = {
      type: "group",
      groupId,
      pointerId: event.pointerId,
      startWorldX: worldPoint.x,
      startWorldY: worldPoint.y,
      groupStartPosition: position,
      memberNames,
      memberStartPositions,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGroupResizePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    bounds: GroupBounds,
  ) => {
    event.stopPropagation();
    onFocusSection(bounds.groupId);

    const worldPoint = getWorldPoint(event.clientX, event.clientY);
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const resizeLeft = localX <= GROUP_RESIZE_EDGE_HIT;
    const resizeRight = rect.width - localX <= GROUP_RESIZE_EDGE_HIT;
    const resizeTop = localY <= GROUP_RESIZE_EDGE_HIT;
    const resizeBottom = rect.height - localY <= GROUP_RESIZE_EDGE_HIT;

    if (!(resizeLeft || resizeRight || resizeTop || resizeBottom)) {
      handleGroupPointerDown(event, bounds.groupId, bounds.memberNames, {
        x: bounds.x,
        y: bounds.y,
      });
      return;
    }

    dragStateRef.current = {
      type: "group-resize",
      groupId: bounds.groupId,
      pointerId: event.pointerId,
      startWorldX: worldPoint.x,
      startWorldY: worldPoint.y,
      startPosition: { x: bounds.x, y: bounds.y },
      startWidth: bounds.width,
      startHeight: bounds.height,
      minWidth: bounds.minWidth,
      minHeight: bounds.minHeight,
      resizeLeft,
      resizeRight,
      resizeTop,
      resizeBottom,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleNodePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    tableName: string
  ) => {
    event.stopPropagation();
    onSelectTable(tableName);

    const worldPoint = getWorldPoint(event.clientX, event.clientY);
    const position = effectiveNodePositions[tableName];
    if (!position) return;

    dragStateRef.current = {
      type: "node",
      tableName,
      pointerId: event.pointerId,
      offsetX: worldPoint.x - position.x,
      offsetY: worldPoint.y - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isZoomGesture = event.ctrlKey || event.metaKey;
    if (!isZoomGesture) {
      onViewportChange((current) => {
        const base = current ?? DEFAULT_VIEWPORT;
        return {
          ...base,
          x: base.x - event.deltaX,
          y: base.y - event.deltaY,
        };
      });
      return;
    }

    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08;

    onViewportChange((current) => {
      const base = current ?? DEFAULT_VIEWPORT;
      const nextScale = clamp(base.scale * zoomFactor, MIN_SCALE, MAX_SCALE);
      const worldX = (pointerX - base.x) / base.scale;
      const worldY = (pointerY - base.y) / base.scale;

      return {
        x: pointerX - worldX * nextScale,
        y: pointerY - worldY * nextScale,
        scale: nextScale,
      };
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedTableName) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      let deltaX = 0;
      let deltaY = 0;
      const step = event.shiftKey ? GRID_SIZE * 4 : GRID_SIZE;

      if (event.key === "ArrowLeft") deltaX = -step;
      else if (event.key === "ArrowRight") deltaX = step;
      else if (event.key === "ArrowUp") deltaY = -step;
      else if (event.key === "ArrowDown") deltaY = step;
      else return;

      event.preventDefault();

      onNodePositionsChange((current) => {
        const base = current[selectedTableName] ?? effectiveNodePositions[selectedTableName];
        if (!base) return current;

        return {
          ...current,
          [selectedTableName]: {
            x: snapToGrid(base.x + deltaX),
            y: snapToGrid(base.y + deltaY),
          },
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveNodePositions, onNodePositionsChange, selectedTableName]);

  const getAccent = (table: SchemaTableMeta) => {
    if (tableColorMode === "none") {
      return {
        className: "border-zinc-500/20 bg-zinc-500/5 text-zinc-200",
        stroke: "rgba(161, 161, 170, 0.42)",
      };
    }

    if (tableColorMode === "group") return TABLE_GROUP_ACCENTS[table.group];
    if (tableColorMode === "namespace") {
      return NAMESPACE_ACCENTS[table.namespace] ?? NAMESPACE_ACCENTS.system;
    }
    if (tableColorMode === "domain") {
      return DOMAIN_ACCENTS[table.domain] ?? DOMAIN_ACCENTS.shared;
    }

    if (table.isJunction) return TABLE_GROUP_ACCENTS.junction;
    if (table.outboundRelations.length + table.inboundRelations.length >= 6) return TABLE_GROUP_ACCENTS.market;
    if (table.outboundRelations.length + table.inboundRelations.length >= 3) return TABLE_GROUP_ACCENTS.core;
    return TABLE_GROUP_ACCENTS.system;
  };

  const getLinkStroke = (sourceTable: string, targetTable: string, selectedEdge: boolean) => {
    if (selectedEdge) return "rgba(125, 211, 252, 0.86)";

    const source = tableByName.get(sourceTable);
    const target = tableByName.get(targetTable);
    if (!source || !target) return "rgba(161, 161, 170, 0.28)";

    if (linkColorMode === "neutral") return "rgba(161, 161, 170, 0.28)";
    if (linkColorMode === "matching") return getAccent(source).stroke;
    if (linkColorMode === "source-group") return TABLE_GROUP_ACCENTS[source.group].stroke;
    if (linkColorMode === "target-group") return TABLE_GROUP_ACCENTS[target.group].stroke;
    return "rgba(161, 161, 170, 0.28)";
  };

  return (
    <div className={cn("relative h-full", className)}>
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-2xl border border-border/70 bg-black/70 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground"
            onClick={() =>
              onViewportChange((current) => {
                const base = current ?? DEFAULT_VIEWPORT;
                return { ...base, scale: clamp(base.scale - 0.1, MIN_SCALE, MAX_SCALE) };
              })
            }
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground"
            onClick={() =>
              onViewportChange((current) => {
                const base = current ?? DEFAULT_VIEWPORT;
                return { ...base, scale: clamp(base.scale + 0.1, MIN_SCALE, MAX_SCALE) };
              })
            }
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-40"
            onClick={focusSelectedTable}
            disabled={!selectedTable}
            title="Focus selected table"
          >
            <Crosshair className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground"
            onClick={resetLayout}
            title="Reset layout"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
      </div>

      <div
        ref={containerRef}
        className="relative h-full min-h-0 overflow-hidden rounded-none bg-[#0e1014]"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
        onWheel={handleWheel}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: `${GRID_SIZE * effectiveViewport.scale}px ${GRID_SIZE * effectiveViewport.scale}px`,
            backgroundPosition: `${effectiveViewport.x}px ${effectiveViewport.y}px`,
          }}
        />

        <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2 rounded-full border border-border/70 bg-black/55 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-xl">
          Two-finger pan • pinch or Cmd-scroll to zoom • drag borders to resize • arrows nudge • Shift = fast
          <span className="text-foreground">{Math.round(effectiveViewport.scale * 100)}%</span>
        </div>

        <div
          className="absolute left-0 top-0"
          style={{
            width: sceneBounds.width,
            height: sceneBounds.height,
            transform: `translate(${effectiveViewport.x}px, ${effectiveViewport.y}px) scale(${effectiveViewport.scale})`,
            transformOrigin: "top left",
          }}
        >
          {[...canvasGroups]
            .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "system" ? -1 : 1))
            .map((bounds) => {
            const customAccent =
              bounds.kind === "custom"
                ? TABLE_SELECTOR_GROUP_COLORS[bounds.color ?? "slate"]
                : null;
            const systemAccent =
              bounds.kind === "system"
                ? TABLE_GROUP_ACCENTS[bounds.baseGroup ?? "system"]
                : null;
            const stroke = customAccent?.stroke ?? systemAccent?.stroke ?? "rgba(161, 161, 170, 0.5)";
            const background = bounds.kind === "custom"
              ? (customAccent?.fill ?? "rgba(148, 163, 184, 0.08)")
              : "rgba(255,255,255,0.01)";
            return (
              <div
                key={bounds.groupId}
                className={cn(
                  "absolute rounded-[28px] border-2 border-dashed transition-opacity",
                  bounds.kind === "custom"
                    ? bounds.isActive
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-90"
                    : "opacity-45 hover:opacity-65",
                )}
                style={{
                  left: bounds.x,
                  top: bounds.y,
                  width: bounds.width,
                  height: bounds.height,
                  borderColor: stroke,
                  background,
                  boxShadow:
                    bounds.kind === "custom" && bounds.isActive
                      ? `0 0 0 1px ${stroke} inset, 0 0 0 1px rgba(255,255,255,0.06)`
                      : `0 0 0 1px ${stroke} inset`,
                }}
                onPointerDown={
                  (event) => handleGroupResizePointerDown(event, bounds)
                }
              >
                {bounds.kind === "custom" && editingGroupId === bounds.groupId ? (
                  <div
                    className="absolute left-5 top-0 z-10 -translate-y-1/2"
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <Input
                      autoFocus
                      value={editingGroupName}
                      onChange={(event) => setEditingGroupName(event.target.value)}
                      onBlur={commitGroupRename}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitGroupRename();
                        } else if (event.key === "Escape") {
                          event.preventDefault();
                          cancelGroupRename();
                        }
                      }}
                      className="h-8 min-w-[160px] rounded-xl border border-white/20 bg-[#111319] px-3 text-sm font-semibold text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                ) : (
                  bounds.kind === "custom" ? (
                    <button
                      type="button"
                      className="absolute left-5 top-0 z-10 -translate-y-1/2 rounded-xl border px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur"
                      style={{
                        borderColor: stroke,
                        background: `linear-gradient(180deg, rgba(17,19,25,0.98), rgba(17,19,25,0.92)), ${background}`,
                        boxShadow: `0 0 0 1px ${stroke} inset, 0 10px 30px rgba(0,0,0,0.28)`,
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        startEditingGroup(bounds.groupId, bounds.name);
                      }}
                      title="Double-click to rename group"
                    >
                      {bounds.name}
                    </button>
                  ) : (
                    <div
                      className="absolute left-5 top-0 z-10 -translate-y-1/2 rounded-xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                      style={{
                        borderColor: stroke,
                        background: "rgba(14,16,20,0.92)",
                        color: "rgba(255,255,255,0.88)",
                        boxShadow: `0 0 0 1px ${stroke} inset, 0 10px 30px rgba(0,0,0,0.2)`,
                      }}
                    >
                      {bounds.name}
                    </div>
                  )
                )}
                {bounds.empty ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Drag this group or drop tables here
                  </div>
                ) : null}
              </div>
            );
          })}

          <svg
            className="absolute left-0 top-0 overflow-visible"
            width={sceneBounds.width}
            height={sceneBounds.height}
          >
            {edges.map((edge) => {
              const sourcePosition = effectiveNodePositions[edge.sourceTable];
              const targetPosition = effectiveNodePositions[edge.targetTable];
              if (!sourcePosition || !targetPosition) return null;

              const sourceX = sourcePosition.x + NODE_WIDTH / 2;
              const sourceY = sourcePosition.y + NODE_HEIGHT / 2;
              const targetX = targetPosition.x + NODE_WIDTH / 2;
              const targetY = targetPosition.y + NODE_HEIGHT / 2;
              const deltaX = Math.abs(targetX - sourceX);
              const controlOffset = Math.max(48, Math.min(180, deltaX * 0.4));

              const selectedEdge =
                edge.sourceTable === selectedTableName || edge.targetTable === selectedTableName;

              return (
                <g key={edge.key}>
                  <path
                    d={`M ${sourceX} ${sourceY} C ${sourceX + controlOffset} ${sourceY}, ${targetX - controlOffset} ${targetY}, ${targetX} ${targetY}`}
                    fill="none"
                    stroke={getLinkStroke(edge.sourceTable, edge.targetTable, selectedEdge)}
                    strokeWidth={selectedEdge ? 2.2 : 1.2}
                  />
                </g>
              );
            })}
          </svg>

          {tables.map((table) => {
            const position = effectiveNodePositions[table.name];
            if (!position) return null;

            const isSelected = table.name === selectedTableName;
            const isConnected = connectedTables.has(table.name);
            const accent = getAccent(table);

            return (
              <button
                key={table.name}
                type="button"
                onClick={() => onSelectTable(table.name)}
                onPointerDown={(event) => handleNodePointerDown(event, table.name)}
                className={cn(
                  "absolute overflow-hidden rounded-2xl border p-0 text-left shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-shadow",
                  isSelected
                    ? "border-sky-400/75 bg-[#1a1e25]"
                    : isConnected
                      ? "border-border/80 bg-[#17191d]"
                      : "border-border/60 bg-[#15171b]",
                  !isConnected && selectedTableName ? "opacity-40" : "opacity-100",
                  "hover:shadow-[0_18px_48px_rgba(0,0,0,0.34)]"
                )}
                style={{
                  left: position.x,
                  top: position.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
              >
                <div className={cn("absolute inset-x-0 top-0 h-1.5", accent.className)} />
                <div className="flex h-full flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{table.name}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{table.domain}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 border text-[10px]", accent.className)}
                    >
                      {tableColorMode === "domain"
                        ? table.domain
                        : tableColorMode === "namespace"
                          ? table.namespace
                          : tableColorMode === "structure"
                            ? table.isJunction
                              ? "junction"
                              : "table"
                            : tableColorMode === "none"
                              ? "table"
                              : table.group}
                    </Badge>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Boxes className="h-3.5 w-3.5" />
                        {table.fields.length} fields
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        {table.outboundRelations.length} refs
                      </div>
                    </div>
                    {table.isJunction ? (
                      <div className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                        junction
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
