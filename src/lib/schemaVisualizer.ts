import schemaSource from "../../convex/schema.ts?raw";
import {
  classifyTableGroup,
  getTableGroupLabel,
  TABLE_GROUP_ORDER,
  type TableGroup,
} from "@/lib/tableGroups";

export type SchemaTableGroup = TableGroup;

export type SchemaFieldKind =
  | "relation"
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "union"
  | "object"
  | "other";

export interface SchemaFieldMeta {
  name: string;
  kind: SchemaFieldKind;
  optional: boolean;
  relationTable?: string;
  raw: string;
}

export interface SchemaIndexMeta {
  name: string;
  kind: "index" | "searchIndex";
  fields: string[];
}

export interface SchemaOutboundRelation {
  field: string;
  targetTable: string;
}

export interface SchemaInboundRelation {
  sourceTable: string;
  field: string;
}

export interface SchemaJunctionPath {
  junctionTable: string;
  viaField: string;
  companionTables: string[];
}

export interface SchemaTableMeta {
  name: string;
  group: SchemaTableGroup;
  namespace: string;
  domain: string;
  fields: SchemaFieldMeta[];
  indexes: SchemaIndexMeta[];
  outboundRelations: SchemaOutboundRelation[];
  inboundRelations: SchemaInboundRelation[];
  junctionPaths: SchemaJunctionPath[];
  isJunction: boolean;
  isWorkshop: boolean;
  definedAtLine: number;
}

function countChar(value: string, char: string) {
  return value.split(char).length - 1;
}

function parseFieldKind(raw: string): Omit<SchemaFieldMeta, "name"> {
  const optional = raw.includes("v.optional(");
  const relationTable = raw.match(/v\.id\("([^"]+)"\)/)?.[1];

  if (relationTable) {
    return { kind: "relation", optional, relationTable, raw };
  }
  if (raw.includes("v.array(")) {
    return { kind: "array", optional, raw };
  }
  if (raw.includes("v.union(")) {
    return { kind: "union", optional, raw };
  }
  if (raw.includes("v.boolean(")) {
    return { kind: "boolean", optional, raw };
  }
  if (raw.includes("v.number(")) {
    return { kind: "number", optional, raw };
  }
  if (raw.includes("v.string(")) {
    return { kind: "string", optional, raw };
  }
  if (raw.includes("v.object(")) {
    return { kind: "object", optional, raw };
  }

  return { kind: "other", optional, raw };
}

function getNamespace(name: string) {
  if (name.startsWith("ws_")) return "workshop";
  if (name.startsWith("j_")) return "junction";
  if (name.startsWith("oem_")) return "oem";
  if (name.startsWith("market_")) return "market";
  if (
    name === "profiles" ||
    name.startsWith("user_") ||
    name.startsWith("saved_") ||
    name.endsWith("_comments") ||
    name.startsWith("admin_")
  ) {
    return "user";
  }
  return "system";
}

function getDomain(name: string) {
  if (name.includes("brand")) return "brands";
  if (name.includes("vehicle")) return "vehicles";
  if (name.includes("wheel")) return "wheels";
  if (name.includes("engine")) return "engines";
  if (name.includes("color")) return "colors";
  if (name.includes("market")) return "market";
  if (name.includes("fuel") || name.includes("aspiration")) return "powertrain tags";
  if (name.includes("user") || name === "profiles" || name.endsWith("_comments")) return "users";
  if (name.includes("storage") || name.endsWith("_images")) return "assets";
  return "shared";
}

function parseSchemaTables(source: string) {
  const lines = source.split(/\r?\n/);
  const tables: Array<{
    name: string;
    fields: SchemaFieldMeta[];
    indexes: SchemaIndexMeta[];
    definedAtLine: number;
  }> = [];

  let current: {
    name: string;
    fields: SchemaFieldMeta[];
    indexes: SchemaIndexMeta[];
    definedAtLine: number;
  } | null = null;
  let objectDepth = 0;
  let objectClosed = false;

  const startTable = (line: string, lineNumber: number) => {
    const match = line.match(/^\s{2}([A-Za-z0-9_]+):\s*defineTable\(\{$/);
    if (!match) return false;
    current = {
      name: match[1],
      fields: [],
      indexes: [],
      definedAtLine: lineNumber,
    };
    objectDepth = 1;
    objectClosed = false;
    return true;
  };

  const finalizeCurrent = () => {
    if (!current) return;
    tables.push(current);
    current = null;
    objectDepth = 0;
    objectClosed = false;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;

    if (!current) {
      startTable(line, lineNumber);
      continue;
    }

    if (objectClosed) {
      const nextTableMatch = line.match(/^\s{2}([A-Za-z0-9_]+):\s*defineTable\(\{$/);
      if (nextTableMatch) {
        finalizeCurrent();
        startTable(line, lineNumber);
        continue;
      }
    }

    const fieldMatch = !objectClosed
      ? line.match(/^\s{4}([A-Za-z0-9_]+):\s*(.+)$/)
      : null;

    if (fieldMatch) {
      current.fields.push({
        name: fieldMatch[1],
        ...parseFieldKind(fieldMatch[2].trim().replace(/,$/, "")),
      });
    }

    const indexMatches = line.matchAll(/\.(searchIndex|index)\("([^"]+)",\s*\[([^\]]*)\]\)/g);
    for (const match of indexMatches) {
      const fields = match[3]
        .split(",")
        .map((field) => field.replace(/["'\s]/g, ""))
        .filter(Boolean);

      current.indexes.push({
        kind: match[1] as "index" | "searchIndex",
        name: match[2],
        fields,
      });
    }

    if (!objectClosed) {
      objectDepth += countChar(line, "{");
      objectDepth -= countChar(line, "}");
      if (objectDepth <= 0) {
        objectClosed = true;
      }
      continue;
    }

    if (/^\s*$/.test(line) || /^\s*\/\//.test(line) || /^\s*\*\//.test(line)) {
      continue;
    }
  }

  finalizeCurrent();

  return tables;
}

function buildSchemaCatalog(source: string): SchemaTableMeta[] {
  const parsedTables = parseSchemaTables(source);

  const baseTables: SchemaTableMeta[] = parsedTables.map((table) => {
    const outboundRelations = table.fields
      .filter((field) => field.kind === "relation" && field.relationTable)
      .map((field) => ({
        field: field.name,
        targetTable: field.relationTable as string,
      }));

    return {
      name: table.name,
      group: classifyTableGroup(table.name),
      namespace: getNamespace(table.name),
      domain: getDomain(table.name),
      fields: table.fields,
      indexes: table.indexes,
      outboundRelations,
      inboundRelations: [],
      junctionPaths: [],
      isJunction: table.name.startsWith("j_"),
      isWorkshop: table.name.startsWith("ws_"),
      definedAtLine: table.definedAtLine,
    };
  });

  const byName = new Map(baseTables.map((table) => [table.name, table]));

  for (const table of baseTables) {
    for (const relation of table.outboundRelations) {
      const target = byName.get(relation.targetTable);
      if (!target) continue;
      target.inboundRelations.push({
        sourceTable: table.name,
        field: relation.field,
      });
    }
  }

  for (const table of baseTables) {
    if (table.isJunction) continue;

    const junctionPaths = baseTables
      .filter((candidate) => candidate.isJunction)
      .flatMap((junctionTable) => {
        const viaField = junctionTable.outboundRelations.find(
          (relation) => relation.targetTable === table.name
        );

        if (!viaField) return [];

        const companionTables = junctionTable.outboundRelations
          .map((relation) => relation.targetTable)
          .filter((targetTable) => targetTable !== table.name);

        return companionTables.length
          ? [
              {
                junctionTable: junctionTable.name,
                viaField: viaField.field,
                companionTables: [...new Set(companionTables)],
              },
            ]
          : [];
      });

    table.junctionPaths = junctionPaths;
  }

  return baseTables.sort((a, b) => a.name.localeCompare(b.name));
}

export const SCHEMA_CATALOG = buildSchemaCatalog(schemaSource);

export function getSchemaGroupLabel(group: SchemaTableGroup) {
  return getTableGroupLabel(group);
}

export const SCHEMA_GROUP_ORDER: SchemaTableGroup[] = TABLE_GROUP_ORDER;
