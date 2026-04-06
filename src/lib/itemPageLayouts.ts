import type {
  ItemPageBlockGap,
  ItemPageBlockKind,
  ItemPageFieldLayoutItem,
  ItemPageBlockTemplate,
  ItemPageContainerPadding,
  ItemPageLayoutTemplate,
  ItemPageTabTemplate,
  ItemPageTitleTabLabelMode,
  ItemPageType,
  PersistedItemPageLayoutRecord,
} from "@/types/itemPageLayout";
import { DEFAULT_WHEEL_HEADER_FIELD_LAYOUT } from "@/lib/wheelHeaderFields";

export const DEFAULT_ITEM_PAGE_LAYOUT_SCOPE = "item_page_builder";
export const ITEM_PAGE_LAYOUT_VERSION = 1;

export const ITEM_PAGE_TYPE_LABELS: Record<ItemPageType, string> = {
  vehicle_item: "Vehicle Page",
  wheel_item: "Wheel Page",
  brand_item: "Brand Page",
  engine_item: "Engine Page",
  color_item: "Color Page",
};

export const ITEM_PAGE_BLOCK_LABELS: Record<ItemPageBlockKind, string> = {
  hero: "Hero",
  brief: "Brief",
  facts: "Facts",
  variants: "Variants",
  vehicles_grid: "Vehicles Grid",
  wheels_grid: "Wheels Grid",
  engines_grid: "Engines Grid",
  gallery: "Gallery",
  market: "Market",
  comments: "Comments",
  fitment_table: "Fitment Table",
  rich_text: "Rich Text",
  ad_slot: "Ad Slot",
};

export const ALLOWED_BLOCKS_BY_PAGE_TYPE: Record<ItemPageType, ItemPageBlockKind[]> = {
  vehicle_item: ["hero", "brief", "facts", "variants", "engines_grid", "wheels_grid", "gallery", "market", "comments", "rich_text", "ad_slot"],
  wheel_item: ["hero", "variants", "vehicles_grid", "gallery", "market", "comments", "fitment_table", "rich_text", "ad_slot"],
  brand_item: ["hero", "vehicles_grid", "wheels_grid", "gallery", "market", "comments", "rich_text", "ad_slot"],
  engine_item: ["hero", "variants", "vehicles_grid", "market", "comments", "rich_text", "ad_slot"],
  color_item: ["hero", "variants", "vehicles_grid", "wheels_grid", "rich_text", "ad_slot"],
};

function createBlock(
  id: string,
  kind: ItemPageBlockKind,
  span = 12,
  settings?: ItemPageBlockTemplate["settings"],
  overrides?: Partial<ItemPageBlockTemplate>,
): ItemPageBlockTemplate {
  return {
    id,
    kind,
    span,
    enabled: true,
    settings,
    ...overrides,
  };
}

function createTab(
  id: string,
  label: string,
  blocks: ItemPageBlockTemplate[],
  overrides?: Partial<ItemPageTabTemplate>,
): ItemPageTabTemplate {
  return {
    id,
    label,
    enabled: true,
    blocks,
    ...overrides,
  };
}

export const FALLBACK_ITEM_PAGE_TEMPLATES: Record<ItemPageType, ItemPageLayoutTemplate> = {
  vehicle_item: {
    pageType: "vehicle_item",
    version: ITEM_PAGE_LAYOUT_VERSION,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "overview",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    tabs: [
      createTab("overview", "Overview", [
        createBlock("vehicle-hero", "hero"),
        createBlock("vehicle-brief", "brief"),
        createBlock("vehicle-variants", "variants"),
      ]),
      createTab("engines", "Engines", [createBlock("vehicle-engines-grid", "engines_grid")]),
      createTab("wheels", "Wheels", [createBlock("vehicle-wheels-grid", "wheels_grid")]),
      createTab("market", "Market", [createBlock("vehicle-market", "market")]),
      createTab("gallery", "Gallery", [createBlock("vehicle-gallery", "gallery")]),
      createTab("comments", "Comments", [createBlock("vehicle-comments", "comments")]),
    ],
  },
  wheel_item: {
    pageType: "wheel_item",
    version: ITEM_PAGE_LAYOUT_VERSION,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "fitment",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    tabs: [
      createTab("fitment", "Fitment", [
        createBlock("wheel-hero", "hero", 12, { fieldLayout: DEFAULT_WHEEL_HEADER_FIELD_LAYOUT }),
        createBlock("wheel-variant-grid", "variants", 12, { variantScope: "wheel" }),
        createBlock("wheel-fitment-table", "fitment_table"),
      ]),
      createTab("vehicles", "Vehicles", [createBlock("wheel-vehicles-grid", "vehicles_grid")]),
      createTab("gallery", "Gallery", [createBlock("wheel-gallery", "gallery")]),
      createTab("market", "Market", [createBlock("wheel-market", "market")]),
      createTab("comments", "Comments", [createBlock("wheel-comments", "comments")]),
    ],
  },
  brand_item: {
    pageType: "brand_item",
    version: ITEM_PAGE_LAYOUT_VERSION,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "brand",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    tabs: [
      createTab("brand", "Brand", [
        createBlock("brand-hero", "hero"),
        createBlock("brand-vehicles-grid", "vehicles_grid"),
      ]),
      createTab("wheels", "Wheels", [createBlock("brand-wheels-grid", "wheels_grid")]),
      createTab("market", "Market", [createBlock("brand-market", "market")]),
      createTab("gallery", "Bad Pic", [createBlock("brand-gallery", "gallery")]),
      createTab("comments", "Comments", [createBlock("brand-comments", "comments")]),
    ],
  },
  engine_item: {
    pageType: "engine_item",
    version: ITEM_PAGE_LAYOUT_VERSION,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "specs",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    tabs: [
      createTab("specs", "Family", [
        createBlock("engine-hero", "hero"),
        createBlock("engine-copy", "rich_text", 12, {
          body:
            "This page represents an engine family, not a single exact tune. Exact searchable sub-engines sit below the advertising slot, while linked vehicles stay attached at the family lane unless a stronger exact-engine source exists.",
        }),
        createBlock("engine-ad", "ad_slot"),
        createBlock("engine-variants", "variants"),
      ]),
      createTab("vehicles", "Vehicles", [createBlock("engine-vehicles-grid", "vehicles_grid"), createBlock("engine-vehicles-ad", "ad_slot")]),
      createTab("market", "Market", [createBlock("engine-market", "market")]),
      createTab("comments", "Comments", [createBlock("engine-comments", "comments")]),
    ],
  },
  color_item: {
    pageType: "color_item",
    version: ITEM_PAGE_LAYOUT_VERSION,
    titleTabLabelMode: "item_title",
    defaultActiveTab: "color",
    containerStyle: { panelPadding: "default", blockGap: "lg" },
    tabs: [
      createTab("color", "Color", [
        createBlock("color-hero", "hero"),
        createBlock("color-wheels-grid", "wheels_grid"),
      ]),
      createTab("wheelVariants", "Wheel Variants", [
        createBlock("color-wheel-variants", "variants", 12, { variantScope: "wheel" }),
      ]),
      createTab("vehicles", "Vehicles", [createBlock("color-vehicles-grid", "vehicles_grid")]),
      createTab("vehicleVariants", "Vehicle Variants", [
        createBlock("color-vehicle-variants", "variants", 12, { variantScope: "vehicle" }),
      ]),
    ],
  },
};

const SPAN_VALUES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const PADDING_VALUES = new Set<ItemPageContainerPadding>(["compact", "default", "relaxed"]);
const GAP_VALUES = new Set<ItemPageBlockGap>(["sm", "md", "lg"]);
const TITLE_MODE_VALUES = new Set<ItemPageTitleTabLabelMode>(["item_title", "custom"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneTemplate(template: ItemPageLayoutTemplate): ItemPageLayoutTemplate {
  return {
    ...template,
    containerStyle: { ...template.containerStyle },
    tabs: template.tabs.map((tab) => ({
      ...tab,
      blocks: tab.blocks.map((block) => ({
        ...block,
        settings: block.settings ? { ...block.settings } : undefined,
      })),
    })),
  };
}

function normalizeFieldLayoutItem(
  value: unknown,
  fallbackItem?: ItemPageFieldLayoutItem,
): ItemPageFieldLayoutItem | null {
  if (!isObject(value)) {
    return fallbackItem ? { ...fallbackItem } : null;
  }

  const kind =
    value.kind === "field" || value.kind === "placeholder"
      ? value.kind
      : fallbackItem?.kind;
  const key =
    typeof value.key === "string" && value.key.trim()
      ? value.key.trim()
      : fallbackItem?.key;

  if (!kind || !key) return fallbackItem ? { ...fallbackItem } : null;

  return {
    kind,
    key,
    label:
      typeof value.label === "string"
        ? value.label
        : fallbackItem?.label,
    emptyLabel:
      typeof value.emptyLabel === "string"
        ? value.emptyLabel
        : fallbackItem?.emptyLabel,
  };
}

function normalizeBlock(
  value: unknown,
  fallbackBlock: ItemPageBlockTemplate | undefined,
  pageType: ItemPageType,
  tabId: string,
  index: number,
): ItemPageBlockTemplate | null {
  if (!isObject(value)) return fallbackBlock ? { ...fallbackBlock } : null;
  const kind = typeof value.kind === "string" ? (value.kind as ItemPageBlockKind) : fallbackBlock?.kind;
  if (!kind || !ALLOWED_BLOCKS_BY_PAGE_TYPE[pageType].includes(kind)) return fallbackBlock ? { ...fallbackBlock } : null;

  const rawSpan = typeof value.span === "number" ? Math.round(value.span) : fallbackBlock?.span ?? 12;
  const span = SPAN_VALUES.has(rawSpan) ? rawSpan : 12;
  const enabled = typeof value.enabled === "boolean" ? value.enabled : fallbackBlock?.enabled ?? true;
  const minHeight = typeof value.minHeight === "number" ? value.minHeight : fallbackBlock?.minHeight;
  const settings = isObject(value.settings)
    ? {
        title: typeof value.settings.title === "string" ? value.settings.title : fallbackBlock?.settings?.title,
        body: typeof value.settings.body === "string" ? value.settings.body : fallbackBlock?.settings?.body,
        variantScope:
          value.settings.variantScope === "wheel" || value.settings.variantScope === "vehicle" || value.settings.variantScope === "default"
            ? value.settings.variantScope
            : fallbackBlock?.settings?.variantScope,
        fieldLayout: Array.isArray(value.settings.fieldLayout)
          ? value.settings.fieldLayout
              .map((item, itemIndex) =>
                normalizeFieldLayoutItem(
                  item,
                  fallbackBlock?.settings?.fieldLayout?.[itemIndex],
                ),
              )
              .filter((item): item is ItemPageFieldLayoutItem => Boolean(item))
          : fallbackBlock?.settings?.fieldLayout
            ? fallbackBlock.settings.fieldLayout.map((item) => ({ ...item }))
            : undefined,
      }
    : fallbackBlock?.settings
      ? { ...fallbackBlock.settings }
      : undefined;

  return {
    id: typeof value.id === "string" ? value.id : fallbackBlock?.id ?? `${tabId}-${kind}-${index}`,
    kind,
    span,
    enabled,
    minHeight,
    settings,
  };
}

function normalizeTab(
  value: unknown,
  fallbackTab: ItemPageTabTemplate | undefined,
  pageType: ItemPageType,
  index: number,
): ItemPageTabTemplate | null {
  if (!isObject(value)) return fallbackTab ? cloneTemplate({ ...FALLBACK_ITEM_PAGE_TEMPLATES[pageType], tabs: [fallbackTab] }).tabs[0] : null;
  const id = typeof value.id === "string" ? value.id : fallbackTab?.id ?? `tab-${index + 1}`;
  const label = typeof value.label === "string" ? value.label : fallbackTab?.label ?? `Tab ${index + 1}`;
  const enabled = typeof value.enabled === "boolean" ? value.enabled : fallbackTab?.enabled ?? true;
  const rawBlocks = Array.isArray(value.blocks) ? value.blocks : fallbackTab?.blocks ?? [];
  const fallbackBlocks = fallbackTab?.blocks ?? [];
  const blocks = rawBlocks
    .map((block, blockIndex) => normalizeBlock(block, fallbackBlocks[blockIndex], pageType, id, blockIndex))
    .filter((block): block is ItemPageBlockTemplate => Boolean(block));

  return {
    id,
    label,
    enabled,
    blocks,
  };
}

function orderSpecialTabs(tabs: ItemPageTabTemplate[]) {
  const withoutComments = tabs.filter((tab) => tab.id !== "comments");
  const comments = tabs.filter((tab) => tab.id === "comments");
  const withoutMarket = withoutComments.filter((tab) => tab.id !== "market");
  const market = withoutComments.filter((tab) => tab.id === "market");
  return [...withoutMarket, ...market, ...comments];
}

export function normalizeItemPageTemplate(
  pageType: ItemPageType,
  candidate: unknown,
): ItemPageLayoutTemplate {
  const fallback = FALLBACK_ITEM_PAGE_TEMPLATES[pageType];
  if (!isObject(candidate)) {
    return cloneTemplate(fallback);
  }

  const rawTabs = Array.isArray(candidate.tabs) ? candidate.tabs : fallback.tabs;
  const tabs = orderSpecialTabs(
    rawTabs
      .map((tab, index) => normalizeTab(tab, fallback.tabs[index], pageType, index))
      .filter((tab): tab is ItemPageTabTemplate => Boolean(tab)),
  );

  const titleTabLabelMode =
    typeof candidate.titleTabLabelMode === "string" && TITLE_MODE_VALUES.has(candidate.titleTabLabelMode as ItemPageTitleTabLabelMode)
      ? (candidate.titleTabLabelMode as ItemPageTitleTabLabelMode)
      : fallback.titleTabLabelMode;

  const defaultActiveTabCandidate =
    typeof candidate.defaultActiveTab === "string" ? candidate.defaultActiveTab : fallback.defaultActiveTab;
  const enabledTabs = tabs.filter((tab) => tab.enabled);
  const defaultActiveTab =
    enabledTabs.find((tab) => tab.id === defaultActiveTabCandidate)?.id ??
    enabledTabs[0]?.id ??
    fallback.defaultActiveTab;

  const containerStyle = isObject(candidate.containerStyle)
    ? {
        panelPadding:
          typeof candidate.containerStyle.panelPadding === "string" && PADDING_VALUES.has(candidate.containerStyle.panelPadding as ItemPageContainerPadding)
            ? (candidate.containerStyle.panelPadding as ItemPageContainerPadding)
            : fallback.containerStyle.panelPadding,
        blockGap:
          typeof candidate.containerStyle.blockGap === "string" && GAP_VALUES.has(candidate.containerStyle.blockGap as ItemPageBlockGap)
            ? (candidate.containerStyle.blockGap as ItemPageBlockGap)
            : fallback.containerStyle.blockGap,
      }
    : { ...fallback.containerStyle };

  return {
    pageType,
    version:
      typeof candidate.version === "number"
        ? candidate.version
        : fallback.version,
    titleTabLabelMode,
    defaultActiveTab,
    containerStyle,
    tabs: tabs.length > 0 ? tabs : cloneTemplate(fallback).tabs,
  };
}

export function parseItemPageLayoutRecord(
  pageType: ItemPageType,
  record: PersistedItemPageLayoutRecord | null | undefined,
): ItemPageLayoutTemplate {
  if (!record?.template_json) {
    return cloneTemplate(FALLBACK_ITEM_PAGE_TEMPLATES[pageType]);
  }

  try {
    const parsed = JSON.parse(record.template_json);
    return normalizeItemPageTemplate(pageType, {
      ...parsed,
      version: record.version ?? parsed?.version,
      titleTabLabelMode: record.title_tab_label_mode ?? parsed?.titleTabLabelMode,
      defaultActiveTab: record.default_active_tab ?? parsed?.defaultActiveTab,
      containerStyle: record.container_style_json
        ? JSON.parse(record.container_style_json)
        : parsed?.containerStyle,
    });
  } catch {
    return cloneTemplate(FALLBACK_ITEM_PAGE_TEMPLATES[pageType]);
  }
}

export function serializeItemPageLayoutTemplate(template: ItemPageLayoutTemplate) {
  return {
    version: template.version,
    titleTabLabelMode: template.titleTabLabelMode,
    defaultActiveTab: template.defaultActiveTab,
    containerStyle: template.containerStyle,
    templateJson: JSON.stringify(template),
    containerStyleJson: JSON.stringify(template.containerStyle),
  };
}

export function getItemPagePaddingClass(padding: ItemPageContainerPadding) {
  switch (padding) {
    case "compact":
      return "p-4";
    case "relaxed":
      return "p-6";
    case "default":
    default:
      return "p-5";
  }
}

export function getItemPageGapClass(gap: ItemPageBlockGap) {
  switch (gap) {
    case "sm":
      return "gap-4";
    case "lg":
      return "gap-8";
    case "md":
    default:
      return "gap-6";
  }
}

export function getItemPageSpanClass(span: number) {
  const normalized = SPAN_VALUES.has(span) ? span : 12;
  const spanMap: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  };

  return `col-span-1 ${spanMap[normalized]}`;
}
