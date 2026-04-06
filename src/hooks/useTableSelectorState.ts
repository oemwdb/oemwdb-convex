import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  TABLE_GROUP_ORDER,
  classifyTableGroup,
  getTableGroupLabel,
  type TableGroup,
} from "@/lib/tableGroups";

export interface TableSelectorItem {
  name: string;
  label: string;
  baseGroup?: TableGroup;
}

export interface SchemaCanvasNodeSize {
  width: number;
  height: number;
}

export const TABLE_SELECTOR_GROUP_COLORS = {
  slate: {
    label: "Slate",
    stroke: "rgba(148, 163, 184, 0.84)",
    fill: "rgba(148, 163, 184, 0.08)",
    badgeClassName: "border-slate-400/40 bg-slate-500/10 text-slate-100",
  },
  blue: {
    label: "Blue",
    stroke: "rgba(96, 165, 250, 0.9)",
    fill: "rgba(59, 130, 246, 0.1)",
    badgeClassName: "border-blue-400/40 bg-blue-500/10 text-blue-100",
  },
  emerald: {
    label: "Emerald",
    stroke: "rgba(52, 211, 153, 0.9)",
    fill: "rgba(16, 185, 129, 0.1)",
    badgeClassName: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
  },
  amber: {
    label: "Amber",
    stroke: "rgba(251, 191, 36, 0.92)",
    fill: "rgba(245, 158, 11, 0.1)",
    badgeClassName: "border-amber-400/40 bg-amber-500/10 text-amber-100",
  },
  rose: {
    label: "Rose",
    stroke: "rgba(251, 113, 133, 0.9)",
    fill: "rgba(244, 63, 94, 0.1)",
    badgeClassName: "border-rose-400/40 bg-rose-500/10 text-rose-100",
  },
  violet: {
    label: "Violet",
    stroke: "rgba(167, 139, 250, 0.9)",
    fill: "rgba(139, 92, 246, 0.1)",
    badgeClassName: "border-violet-400/40 bg-violet-500/10 text-violet-100",
  },
  cyan: {
    label: "Cyan",
    stroke: "rgba(34, 211, 238, 0.9)",
    fill: "rgba(6, 182, 212, 0.1)",
    badgeClassName: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
  },
} as const;

export type TableSelectorGroupColor = keyof typeof TABLE_SELECTOR_GROUP_COLORS;

export interface TableSelectorCustomGroup {
  id: string;
  name: string;
  tableNames: string[];
  color?: TableSelectorGroupColor;
  canvasPosition?: SchemaCanvasNodePosition;
  canvasSize?: SchemaCanvasNodeSize;
}

export interface TableSelectorSection {
  id: string;
  name: string;
  tables: TableSelectorItem[];
  kind: "custom" | "system";
  baseGroup?: TableGroup;
}

export interface SchemaCanvasNodePosition {
  x: number;
  y: number;
}

export interface SchemaCanvasSectionLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SchemaCanvasViewport {
  x: number;
  y: number;
  scale: number;
}

export interface UseTableSelectorStateOptions {
  visibleTableNames?: string[];
  layoutScope?: string;
}

interface PersistedTableSelectorState {
  customGroups: TableSelectorCustomGroup[];
  hiddenTableNames: string[];
  schemaNodePositions: Record<string, SchemaCanvasNodePosition>;
  schemaSectionLayouts: Record<string, SchemaCanvasSectionLayout>;
  schemaViewport: SchemaCanvasViewport | null;
}

export interface TableSelectorStateResult {
  customGroups: TableSelectorCustomGroup[];
  sections: TableSelectorSection[];
  hiddenTableNames: string[];
  setHiddenTableNames: Dispatch<SetStateAction<string[]>>;
  schemaNodePositions: Record<string, SchemaCanvasNodePosition>;
  setSchemaNodePositions: Dispatch<SetStateAction<Record<string, SchemaCanvasNodePosition>>>;
  setSchemaNodePosition: (tableName: string, position: SchemaCanvasNodePosition) => void;
  schemaSectionLayouts: Record<string, SchemaCanvasSectionLayout>;
  setSchemaSectionLayouts: Dispatch<SetStateAction<Record<string, SchemaCanvasSectionLayout>>>;
  setSchemaSectionLayoutPosition: (sectionId: string, position: SchemaCanvasNodePosition) => void;
  setSchemaSectionLayoutSize: (sectionId: string, size: SchemaCanvasNodeSize) => void;
  schemaViewport: SchemaCanvasViewport | null;
  setSchemaViewport: Dispatch<SetStateAction<SchemaCanvasViewport | null>>;
  createGroup: (name: string, tableNames: string[]) => TableSelectorCustomGroup;
  updateGroup: (groupId: string, updates: Partial<Omit<TableSelectorCustomGroup, "id">>) => void;
  assignTablesToGroup: (groupId: string, tableNames: string[]) => void;
  removeTablesFromGroup: (groupId: string, tableNames: string[]) => void;
  setGroupColor: (groupId: string, color: TableSelectorGroupColor) => void;
  reorderCustomGroups: (activeGroupId: string, overGroupId: string) => void;
  deleteGroup: (groupId: string) => void;
}

const DEFAULT_GROUP_COLOR: TableSelectorGroupColor = "slate";
const DEFAULT_LAYOUT_SCOPE = "dev_admin";
const STORAGE_KEY_LEGACY = "oemwdb:table-selector-state:v1";

function uniqueNames(tableNames: string[]) {
  return [...new Set(tableNames)].filter(Boolean);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function layoutsOverlap(a: SchemaCanvasSectionLayout, b: SchemaCanvasSectionLayout) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function sanitizeSchemaSectionLayouts(
  layouts: Record<string, SchemaCanvasSectionLayout>,
): Record<string, SchemaCanvasSectionLayout> {
  const entries = Object.entries(layouts);
  for (let i = 0; i < entries.length; i += 1) {
    const [, a] = entries[i];
    for (let j = i + 1; j < entries.length; j += 1) {
      const [, b] = entries[j];
      if (layoutsOverlap(a, b)) {
        return {};
      }
    }
  }
  return layouts;
}

function buildStorageKey(layoutScope: string) {
  return `oemwdb:table-selector-state:v2:${layoutScope}`;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function parseCustomGroups(value: unknown): TableSelectorCustomGroup[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((group) => {
    if (!group || typeof group !== "object") return [];
    const candidate = group as Partial<TableSelectorCustomGroup>;
    if (typeof candidate.id !== "string" || typeof candidate.name !== "string") return [];
    if (!Array.isArray(candidate.tableNames)) return [];
    const canvasPosition =
      candidate.canvasPosition &&
      typeof candidate.canvasPosition === "object" &&
      !Array.isArray(candidate.canvasPosition) &&
      typeof candidate.canvasPosition.x === "number" &&
      typeof candidate.canvasPosition.y === "number"
        ? { x: candidate.canvasPosition.x, y: candidate.canvasPosition.y }
        : undefined;
    const canvasSize =
      candidate.canvasSize &&
      typeof candidate.canvasSize === "object" &&
      !Array.isArray(candidate.canvasSize) &&
      typeof candidate.canvasSize.width === "number" &&
      typeof candidate.canvasSize.height === "number"
        ? { width: candidate.canvasSize.width, height: candidate.canvasSize.height }
        : undefined;

    return [{
      id: candidate.id,
      name: candidate.name,
      tableNames: candidate.tableNames.filter((name): name is string => typeof name === "string"),
      color:
        typeof candidate.color === "string" && candidate.color in TABLE_SELECTOR_GROUP_COLORS
          ? candidate.color
          : DEFAULT_GROUP_COLOR,
      canvasPosition,
      canvasSize,
    }];
  });
}

function parseSchemaNodePositions(
  value: unknown,
): Record<string, SchemaCanvasNodePosition> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, position]) => {
      if (!position || typeof position !== "object" || Array.isArray(position)) return [];
      const x = (position as { x?: unknown }).x;
      const y = (position as { y?: unknown }).y;
      if (typeof x !== "number" || typeof y !== "number") return [];
      return [[key, { x, y }]];
    }),
  );
}

function parseSchemaViewport(value: unknown): SchemaCanvasViewport | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const x = (value as { x?: unknown }).x;
  const y = (value as { y?: unknown }).y;
  const scale = (value as { scale?: unknown }).scale;
  if (typeof x !== "number" || typeof y !== "number" || typeof scale !== "number") {
    return null;
  }
  return { x, y, scale };
}

function parseSchemaSectionLayouts(
  value: unknown,
): Record<string, SchemaCanvasSectionLayout> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, layout]) => {
      if (!layout || typeof layout !== "object" || Array.isArray(layout)) return [];
      const x = (layout as { x?: unknown }).x;
      const y = (layout as { y?: unknown }).y;
      const width = (layout as { width?: unknown }).width;
      const height = (layout as { height?: unknown }).height;
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof width !== "number" ||
        typeof height !== "number"
      ) {
        return [];
      }
      return [[key, { x, y, width, height }]];
    }),
  );
}

function safeParseJson<T>(
  value: string | undefined,
  parser: (input: unknown) => T,
  fallback: T,
): T {
  if (!value) return fallback;
  try {
    return parser(JSON.parse(value));
  } catch {
    return fallback;
  }
}

function readPersistedState(layoutScope: string): PersistedTableSelectorState {
  if (typeof window === "undefined") {
    return {
      customGroups: [],
      hiddenTableNames: [],
      schemaNodePositions: {},
      schemaSectionLayouts: {},
      schemaViewport: null,
    };
  }

  const storageKey = buildStorageKey(layoutScope);

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedTableSelectorState>;
      const customGroups = parseCustomGroups(parsed.customGroups);
      return {
        customGroups,
        hiddenTableNames: parseStringArray(parsed.hiddenTableNames),
        schemaNodePositions: parseSchemaNodePositions(parsed.schemaNodePositions),
        schemaSectionLayouts: sanitizeSchemaSectionLayouts(
          migrateLegacyCustomGroupLayouts(
            customGroups,
            parseSchemaSectionLayouts(
              (parsed as Partial<PersistedTableSelectorState>).schemaSectionLayouts,
            ),
          ),
        ),
        schemaViewport: parseSchemaViewport(parsed.schemaViewport),
      };
    }

    const legacyRaw = window.localStorage.getItem(STORAGE_KEY_LEGACY);
    if (!legacyRaw) {
      return {
        customGroups: [],
        hiddenTableNames: [],
        schemaNodePositions: {},
        schemaSectionLayouts: {},
        schemaViewport: null,
      };
    }

    const parsedLegacy = JSON.parse(legacyRaw) as { customGroups?: unknown };
    const customGroups = parseCustomGroups(parsedLegacy.customGroups);
    return {
      customGroups,
      hiddenTableNames: [],
      schemaNodePositions: {},
      schemaSectionLayouts: sanitizeSchemaSectionLayouts(
        migrateLegacyCustomGroupLayouts(customGroups, {}),
      ),
      schemaViewport: null,
    };
  } catch {
    return {
      customGroups: [],
      hiddenTableNames: [],
      schemaNodePositions: {},
      schemaSectionLayouts: {},
      schemaViewport: null,
    };
  }
}

function parseBackendLayout(
  doc: unknown,
): PersistedTableSelectorState | null {
  if (!doc || typeof doc !== "object") return null;

  const candidate = doc as {
    custom_groups_json?: string;
    hidden_tables_json?: string;
    schema_node_positions_json?: string;
    schema_section_layouts_json?: string;
    schema_viewport_json?: string;
  };

  const customGroups = safeParseJson(candidate.custom_groups_json, parseCustomGroups, []);

  return {
    customGroups,
    hiddenTableNames: safeParseJson(candidate.hidden_tables_json, parseStringArray, []),
    schemaNodePositions: safeParseJson(
      candidate.schema_node_positions_json,
      parseSchemaNodePositions,
      {},
    ),
    schemaSectionLayouts: sanitizeSchemaSectionLayouts(
      migrateLegacyCustomGroupLayouts(
        customGroups,
        safeParseJson(
          candidate.schema_section_layouts_json,
          parseSchemaSectionLayouts,
          {},
        ),
      ),
    ),
    schemaViewport: safeParseJson(
      candidate.schema_viewport_json,
      parseSchemaViewport,
      null,
    ),
  };
}

function normalizeCustomGroups(
  groups: TableSelectorCustomGroup[],
  validTableNames: Set<string>,
) {
  return groups.map((group) => ({
    ...group,
    name: group.name.trim() || "Untitled group",
    tableNames: uniqueNames(group.tableNames.filter((tableName) => validTableNames.has(tableName))),
    color:
      group.color && group.color in TABLE_SELECTOR_GROUP_COLORS
        ? group.color
        : DEFAULT_GROUP_COLOR,
  }));
}

function migrateLegacyCustomGroupLayouts(
  groups: TableSelectorCustomGroup[],
  layouts: Record<string, SchemaCanvasSectionLayout>,
) {
  const nextLayouts = { ...layouts };

  groups.forEach((group) => {
    if (nextLayouts[group.id]) return;
    if (
      typeof group.canvasPosition?.x !== "number" ||
      typeof group.canvasPosition?.y !== "number" ||
      typeof group.canvasSize?.width !== "number" ||
      typeof group.canvasSize?.height !== "number"
    ) {
      return;
    }

    nextLayouts[group.id] = {
      x: group.canvasPosition.x,
      y: group.canvasPosition.y,
      width: group.canvasSize.width,
      height: group.canvasSize.height,
    };
  });

  return nextLayouts;
}

export function useTableSelectorState(
  tables: TableSelectorItem[],
  options: UseTableSelectorStateOptions = {},
): TableSelectorStateResult {
  const layoutScope = options.layoutScope?.trim() || DEFAULT_LAYOUT_SCOPE;
  const storageKey = useMemo(() => buildStorageKey(layoutScope), [layoutScope]);
  const initialLocalState = useMemo(() => readPersistedState(layoutScope), [layoutScope]);

  const [customGroups, setCustomGroups] = useState<TableSelectorCustomGroup[]>(initialLocalState.customGroups);
  const [hiddenTableNames, setHiddenTableNames] = useState<string[]>(initialLocalState.hiddenTableNames);
  const [schemaNodePositions, setSchemaNodePositions] = useState<Record<string, SchemaCanvasNodePosition>>(
    initialLocalState.schemaNodePositions,
  );
  const [schemaSectionLayouts, setSchemaSectionLayouts] = useState<
    Record<string, SchemaCanvasSectionLayout>
  >(initialLocalState.schemaSectionLayouts);
  const [schemaViewport, setSchemaViewport] = useState<SchemaCanvasViewport | null>(
    initialLocalState.schemaViewport,
  );

  const layoutDoc = useQuery(api.queries.adminTableSelectorLayoutGet, { layoutScope });
  const upsertLayout = useMutation(api.mutations.adminTableSelectorLayoutUpsert);
  const validTableNames = useMemo(() => new Set(tables.map((table) => table.name)), [tables]);
  const visibleNameSet = useMemo(
    () => (options.visibleTableNames ? new Set(options.visibleTableNames) : null),
    [options.visibleTableNames],
  );
  const isBackendHydratedRef = useRef(false);
  const lastPersistedSignatureRef = useRef("");

  useEffect(() => {
    setCustomGroups((current) => normalizeCustomGroups(current, validTableNames));
    setHiddenTableNames((current) => current.filter((tableName) => validTableNames.has(tableName)));
    setSchemaNodePositions((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([tableName]) => validTableNames.has(tableName)),
      ),
    );
  }, [validTableNames]);

  useEffect(() => {
    if (layoutDoc === undefined || isBackendHydratedRef.current) return;

    const backend = parseBackendLayout(layoutDoc);
    if (!backend) {
      isBackendHydratedRef.current = true;
      return;
    }

    const normalizedCustomGroups = normalizeCustomGroups(backend.customGroups, validTableNames);
    setCustomGroups(normalizedCustomGroups);
    setHiddenTableNames(backend.hiddenTableNames.filter((tableName) => validTableNames.has(tableName)));
    setSchemaNodePositions(
      Object.fromEntries(
        Object.entries(backend.schemaNodePositions).filter(([tableName]) => validTableNames.has(tableName)),
      ),
    );
    setSchemaSectionLayouts(
      sanitizeSchemaSectionLayouts(
        migrateLegacyCustomGroupLayouts(normalizedCustomGroups, backend.schemaSectionLayouts),
      ),
    );
    setSchemaViewport(backend.schemaViewport);
    isBackendHydratedRef.current = true;
  }, [layoutDoc, validTableNames]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload: PersistedTableSelectorState = {
      customGroups,
      hiddenTableNames,
      schemaNodePositions,
      schemaSectionLayouts,
      schemaViewport,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [customGroups, hiddenTableNames, schemaNodePositions, schemaSectionLayouts, schemaViewport, storageKey]);

  useEffect(() => {
    if (layoutDoc === undefined && !isBackendHydratedRef.current) return;

    const signature = JSON.stringify({
      customGroups,
      hiddenTableNames,
      schemaNodePositions,
      schemaSectionLayouts,
      schemaViewport,
    });

    if (signature === lastPersistedSignatureRef.current) return;

    const timeout = window.setTimeout(async () => {
      try {
        await upsertLayout({
          layoutScope,
          customGroupsJson: JSON.stringify(customGroups),
          hiddenTablesJson: JSON.stringify(hiddenTableNames),
          schemaNodePositionsJson: JSON.stringify(schemaNodePositions),
          schemaSectionLayoutsJson: JSON.stringify(schemaSectionLayouts),
          schemaViewportJson: schemaViewport ? JSON.stringify(schemaViewport) : undefined,
        });
        lastPersistedSignatureRef.current = signature;
      } catch (error) {
        console.error("Failed to persist admin table selector layout:", error);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [
    customGroups,
    hiddenTableNames,
    layoutScope,
    schemaNodePositions,
    schemaSectionLayouts,
    schemaViewport,
    upsertLayout,
  ]);

  const sections = useMemo(() => {
    const tableByName = new Map(tables.map((table) => [table.name, table]));

    const customSections: TableSelectorSection[] = customGroups.map((group) => ({
      id: group.id,
      name: group.name,
      kind: "custom",
      tables: group.tableNames
        .map((tableName) => tableByName.get(tableName))
        .filter(Boolean)
        .filter((table) => !visibleNameSet || visibleNameSet.has(table.name)) as TableSelectorItem[],
    }));

    const systemSections: TableSelectorSection[] = TABLE_GROUP_ORDER
      .map((group) => ({
        id: `system:${group}`,
        name: getTableGroupLabel(group),
        baseGroup: group,
        kind: "system" as const,
        tables: tables.filter((table) => {
          const baseGroup = table.baseGroup ?? classifyTableGroup(table.name);
          const visible = visibleNameSet ? visibleNameSet.has(table.name) : true;
          return baseGroup === group && visible;
        }),
      }))
      .filter((section) => section.tables.length > 0);

    return [...systemSections, ...customSections];
  }, [customGroups, tables, visibleNameSet]);

  const createGroup = (name: string, tableNames: string[]) => {
    const nextGroup: TableSelectorCustomGroup = {
      id: `group-${Date.now()}`,
      name: name.trim() || `Group ${customGroups.length + 1}`,
      tableNames: uniqueNames(tableNames.filter((tableName) => validTableNames.has(tableName))),
      color: DEFAULT_GROUP_COLOR,
    };

    setCustomGroups((current) => [...current, nextGroup]);
    return nextGroup;
  };

  const updateGroup = (groupId: string, updates: Partial<Omit<TableSelectorCustomGroup, "id">>) => {
    setCustomGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              ...updates,
              name: (updates.name ?? group.name).trim() || "Untitled group",
              tableNames: updates.tableNames
                ? uniqueNames(updates.tableNames.filter((tableName) => validTableNames.has(tableName)))
                : group.tableNames,
              color:
                typeof updates.color === "string" && updates.color in TABLE_SELECTOR_GROUP_COLORS
                  ? updates.color
                  : group.color ?? DEFAULT_GROUP_COLOR,
            }
          : group,
      ),
    );
  };

  const assignTablesToGroup = (groupId: string, tableNames: string[]) => {
    const nextNames = uniqueNames(tableNames.filter((tableName) => validTableNames.has(tableName)));
    if (!nextNames.length) return;

    setCustomGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tableNames: uniqueNames([...group.tableNames, ...nextNames]),
            }
          : group,
      ),
    );
  };

  const removeTablesFromGroup = (groupId: string, tableNames: string[]) => {
    const nextNameSet = new Set(uniqueNames(tableNames));
    if (!nextNameSet.size) return;

    setCustomGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tableNames: group.tableNames.filter((tableName) => !nextNameSet.has(tableName)),
            }
          : group,
      ),
    );
  };

  const setGroupColor = (groupId: string, color: TableSelectorGroupColor) => {
    updateGroup(groupId, { color });
  };

  const reorderCustomGroups = (activeGroupId: string, overGroupId: string) => {
    if (!activeGroupId || !overGroupId || activeGroupId === overGroupId) return;

    setCustomGroups((current) => {
      const fromIndex = current.findIndex((group) => group.id === activeGroupId);
      const toIndex = current.findIndex((group) => group.id === overGroupId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return current;
      return moveItem(current, fromIndex, toIndex);
    });
  };

  const deleteGroup = (groupId: string) => {
    setCustomGroups((current) => current.filter((group) => group.id !== groupId));
  };

  const setSchemaNodePosition = (tableName: string, position: SchemaCanvasNodePosition) => {
    setSchemaNodePositions((current) => ({
      ...current,
      [tableName]: position,
    }));
  };

  const setSchemaSectionLayoutPosition = (sectionId: string, position: SchemaCanvasNodePosition) => {
    setSchemaSectionLayouts((current) => ({
      ...current,
      [sectionId]: {
        ...(current[sectionId] ?? { width: 0, height: 0 }),
        x: position.x,
        y: position.y,
      },
    }));
  };

  const setSchemaSectionLayoutSize = (sectionId: string, size: SchemaCanvasNodeSize) => {
    setSchemaSectionLayouts((current) => ({
      ...current,
      [sectionId]: {
        ...(current[sectionId] ?? { x: 0, y: 0 }),
        width: size.width,
        height: size.height,
      },
    }));
  };

  return {
    customGroups,
    sections,
    hiddenTableNames,
    setHiddenTableNames,
    schemaNodePositions,
    setSchemaNodePositions,
    setSchemaNodePosition,
    schemaSectionLayouts,
    setSchemaSectionLayouts,
    setSchemaSectionLayoutPosition,
    setSchemaSectionLayoutSize,
    schemaViewport,
    setSchemaViewport,
    createGroup,
    updateGroup,
    assignTablesToGroup,
    removeTablesFromGroup,
    setGroupColor,
    reorderCustomGroups,
    deleteGroup,
  };
}
