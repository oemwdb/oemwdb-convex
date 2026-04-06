import type { ItemPageFieldLayoutItem } from "@/types/itemPageLayout";

export type WheelHeaderFieldKey =
  | "diameter_refs"
  | "width_ref"
  | "offset_refs"
  | "bolt_pattern_refs"
  | "center_bore_ref"
  | "color_refs"
  | "tire_size_refs";

export const WHEEL_HEADER_FIELD_CONFIG: Record<
  WheelHeaderFieldKey,
  {
    label: string;
    queryParam: string;
    mutationKey:
      | "text_diameters"
      | "text_widths"
      | "text_offsets"
      | "text_bolt_patterns"
      | "text_center_bores"
      | "text_colors"
      | "text_tire_sizes";
    emptyLabel: string;
    suggestionsKey?:
      | "diameters"
      | "widths"
      | "boltPatterns"
      | "centerBores"
      | "tireSizes"
      | "colors";
    className?: string;
  }
> = {
  diameter_refs: {
    label: "Diameter",
    queryParam: "diameter",
    mutationKey: "text_diameters",
    emptyLabel: "N/A",
    suggestionsKey: "diameters",
  },
  width_ref: {
    label: "Width",
    queryParam: "width",
    mutationKey: "text_widths",
    emptyLabel: "N/A",
    suggestionsKey: "widths",
  },
  offset_refs: {
    label: "Offset",
    queryParam: "offset",
    mutationKey: "text_offsets",
    emptyLabel: "Not specified",
  },
  bolt_pattern_refs: {
    label: "Bolt Pattern",
    queryParam: "boltPattern",
    mutationKey: "text_bolt_patterns",
    emptyLabel: "N/A",
    suggestionsKey: "boltPatterns",
  },
  center_bore_ref: {
    label: "Center Bore",
    queryParam: "centerBore",
    mutationKey: "text_center_bores",
    emptyLabel: "N/A",
    suggestionsKey: "centerBores",
  },
  color_refs: {
    label: "Finish",
    queryParam: "color",
    mutationKey: "text_colors",
    emptyLabel: "N/A",
    suggestionsKey: "colors",
  },
  tire_size_refs: {
    label: "Tire Size",
    queryParam: "tireSize",
    mutationKey: "text_tire_sizes",
    emptyLabel: "Not specified",
    suggestionsKey: "tireSizes",
    className: "sm:col-span-2",
  },
};

export const WHEEL_HEADER_FIELD_KEYS = Object.keys(
  WHEEL_HEADER_FIELD_CONFIG,
) as WheelHeaderFieldKey[];

export const DEFAULT_WHEEL_HEADER_FIELD_LAYOUT: ItemPageFieldLayoutItem[] = [
  { kind: "field", key: "diameter_refs" },
  { kind: "field", key: "width_ref" },
  { kind: "field", key: "bolt_pattern_refs" },
  { kind: "field", key: "offset_refs" },
  { kind: "field", key: "center_bore_ref" },
  { kind: "field", key: "color_refs" },
  { kind: "field", key: "tire_size_refs" },
];

export function isWheelHeaderFieldKey(value: string): value is WheelHeaderFieldKey {
  return value in WHEEL_HEADER_FIELD_CONFIG;
}

export function normalizeWheelHeaderFieldLayout(
  layout?: ItemPageFieldLayoutItem[] | null,
): ItemPageFieldLayoutItem[] {
  if (!Array.isArray(layout)) {
    return DEFAULT_WHEEL_HEADER_FIELD_LAYOUT.map((item) => ({ ...item }));
  }

  const normalized = layout.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    if (item.kind === "field") {
      const key = typeof item.key === "string" ? item.key : "";
      if (!isWheelHeaderFieldKey(key)) return [];
      return [{ kind: "field" as const, key }];
    }

    if (item.kind === "placeholder") {
      const key =
        typeof item.key === "string" && item.key.trim()
          ? item.key.trim()
          : `placeholder-${index + 1}`;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      return [
        {
          kind: "placeholder" as const,
          key,
          label: label || "Placeholder",
          emptyLabel:
            typeof item.emptyLabel === "string" && item.emptyLabel.trim()
              ? item.emptyLabel.trim()
              : "Not wired yet",
        },
      ];
    }

    return [];
  });

  return normalized;
}
