export type ItemPageType =
  | "vehicle_item"
  | "wheel_item"
  | "brand_item"
  | "engine_item"
  | "color_item";

export type ItemPageBlockKind =
  | "hero"
  | "brief"
  | "facts"
  | "variants"
  | "vehicles_grid"
  | "wheels_grid"
  | "engines_grid"
  | "colors_grid"
  | "gallery"
  | "market"
  | "comments"
  | "fitment_table"
  | "rich_text"
  | "ad_slot";

export type ItemPageTitleTabLabelMode = "item_title" | "custom";

export type ItemPageContainerPadding = "compact" | "default" | "relaxed";
export type ItemPageBlockGap = "sm" | "md" | "lg";

export interface ItemPageContainerStyle {
  panelPadding: ItemPageContainerPadding;
  blockGap: ItemPageBlockGap;
}

export interface ItemPageFieldLayoutItem {
  kind: "field" | "placeholder";
  key: string;
  label?: string;
  emptyLabel?: string;
}

export interface ItemPageBlockSettings {
  title?: string;
  body?: string;
  variantScope?: "default" | "wheel" | "vehicle";
  fieldLayout?: ItemPageFieldLayoutItem[];
}

export interface ItemPageBlockTemplate {
  id: string;
  kind: ItemPageBlockKind;
  span: number;
  minHeight?: number;
  enabled: boolean;
  settings?: ItemPageBlockSettings;
}

export interface ItemPageTabTemplate {
  id: string;
  label: string;
  enabled: boolean;
  triggerClassName?: string;
  blocks: ItemPageBlockTemplate[];
}

export interface ItemPageLayoutTemplate {
  pageType: ItemPageType;
  version: number;
  titleTabLabelMode: ItemPageTitleTabLabelMode;
  defaultActiveTab: string;
  containerStyle: ItemPageContainerStyle;
  headerBlock: ItemPageBlockTemplate | null;
  tabs: ItemPageTabTemplate[];
}

export interface PersistedItemPageLayoutRecord {
  _id?: string;
  page_type?: string | null;
  version?: number | null;
  title_tab_label_mode?: string | null;
  default_active_tab?: string | null;
  container_style_json?: string | null;
  template_json?: string | null;
  updated_at?: string | null;
}
