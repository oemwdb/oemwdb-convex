export type TableGroup =
  | "core"
  | "reference"
  | "junction"
  | "user-admin"
  | "market"
  | "assets"
  | "workshop"
  | "system";

export const TABLE_GROUP_ORDER: TableGroup[] = [
  "core",
  "reference",
  "junction",
  "user-admin",
  "market",
  "assets",
  "workshop",
  "system",
];

export const TABLE_GROUP_ACCENTS: Record<
  TableGroup,
  { className: string; stroke: string }
> = {
  core: {
    className: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    stroke: "rgba(56, 189, 248, 0.58)",
  },
  reference: {
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    stroke: "rgba(52, 211, 153, 0.58)",
  },
  junction: {
    className: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    stroke: "rgba(251, 191, 36, 0.62)",
  },
  "user-admin": {
    className: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200",
    stroke: "rgba(232, 121, 249, 0.58)",
  },
  market: {
    className: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    stroke: "rgba(251, 113, 133, 0.58)",
  },
  assets: {
    className: "border-violet-500/25 bg-violet-500/10 text-violet-200",
    stroke: "rgba(167, 139, 250, 0.58)",
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

const REFERENCE_TABLES = new Set([
  "oem_bolt_patterns",
  "oem_center_bores",
  "oem_diameters",
  "oem_widths",
  "oem_offsets",
  "oem_color_families",
  "oem_colors",
  "tire_sizes",
  "oem_part_numbers",
  "oem_materials",
  "oem_finish_types",
  "oem_design_styles",
  "oem_markets",
  "oem_body_styles",
  "oem_drive_types",
  "oem_fuel_types",
  "oem_aspiration_types",
]);

export function classifyTableGroup(name: string): TableGroup {
  if (name.startsWith("ws_")) return "workshop";
  if (name.startsWith("j_")) return "junction";
  if (name.startsWith("market_")) return "market";
  if (
    name === "profiles" ||
    name === "users" ||
    name.startsWith("user_") ||
    name.startsWith("saved_") ||
    name.endsWith("_comments") ||
    name.startsWith("admin_")
  ) {
    return "user-admin";
  }
  if (name === "oem_file_storage" || name.endsWith("_images")) return "assets";
  if (REFERENCE_TABLES.has(name)) return "reference";
  if (name.startsWith("oem_")) return "core";
  return "system";
}

export function getTableGroupLabel(group: TableGroup) {
  switch (group) {
    case "core":
      return "Core";
    case "reference":
      return "Reference";
    case "junction":
      return "Junction";
    case "user-admin":
      return "User/Admin";
    case "market":
      return "Market";
    case "assets":
      return "Assets";
    case "workshop":
      return "Workshop";
    case "system":
      return "System";
  }
}
