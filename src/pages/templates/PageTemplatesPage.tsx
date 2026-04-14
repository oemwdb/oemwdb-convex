import React, { useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Eye,
  EyeOff,
  FilePlus2,
  GripVertical,
  LayoutPanelTop,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import { api } from "../../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { useItemPageLayoutTemplateEditor } from "@/hooks/useItemPageLayoutTemplate";
import {
  ALLOWED_BLOCKS_BY_PAGE_TYPE,
  getItemPageGapClass,
  getItemPagePaddingClass,
  getItemPageSpanClass,
  ITEM_PAGE_BLOCK_LABELS,
  ITEM_PAGE_TYPE_LABELS,
  normalizeItemPageTemplate,
} from "@/lib/itemPageLayouts";
import { cn } from "@/lib/utils";
import {
  normalizeWheelHeaderFieldLayout,
  WHEEL_HEADER_FIELD_CONFIG,
  WHEEL_HEADER_FIELD_KEYS,
  type WheelHeaderFieldKey,
} from "@/lib/wheelHeaderFields";
import type {
  ItemPageBlockKind,
  ItemPageBlockTemplate,
  ItemPageFieldLayoutItem,
  ItemPageLayoutTemplate,
  ItemPageType,
} from "@/types/itemPageLayout";

type SortableKind = "tab" | "block";

interface PreviewSample {
  title: string;
  subtitle?: string;
  badges: string[];
  stats: Array<{ label: string; value: string }>;
  cards: Array<{ title: string; subtitle?: string }>;
  fitmentRows: Array<{ label: string; value: string }>;
}

function cloneTemplate(template: ItemPageLayoutTemplate): ItemPageLayoutTemplate {
  return JSON.parse(JSON.stringify(template)) as ItemPageLayoutTemplate;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createUniqueTabId(template: ItemPageLayoutTemplate, label: string) {
  const base = slugify(label) || "tab";
  const existing = new Set(template.tabs.map((tab) => tab.id));
  if (!existing.has(base)) return base;
  let index = 2;
  while (existing.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

function createBlockId(tabId: string, kind: ItemPageBlockKind, blocks: ItemPageBlockTemplate[]) {
  const base = `${tabId}-${kind}`;
  const existing = new Set(blocks.map((block) => block.id));
  if (!existing.has(base)) return base;
  let index = 2;
  while (existing.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

function createPlaceholderFieldKey(layout: ItemPageFieldLayoutItem[], label: string) {
  const base = slugify(label) || "placeholder";
  const existing = new Set(layout.map((item) => item.key));
  const initial = `placeholder-${base}`;
  if (!existing.has(initial)) return initial;
  let index = 2;
  while (existing.has(`placeholder-${base}-${index}`)) {
    index += 1;
  }
  return `placeholder-${base}-${index}`;
}

function createDefaultBlock(
  pageType: ItemPageType,
  tabId: string,
  kind: ItemPageBlockKind,
  existingBlocks: ItemPageBlockTemplate[],
): ItemPageBlockTemplate {
  const defaultSpan =
    kind === "brief" || kind === "facts"
      ? 6
      : kind === "gallery" || kind === "comments" || kind === "market"
        ? 12
        : 12;

  const settings: ItemPageBlockTemplate["settings"] =
    kind === "rich_text"
      ? {
          title: "Builder copy",
          body: "Use this block for supporting copy, notes, or inline guidance inside the page layout.",
        }
      : kind === "variants"
        ? {
            variantScope:
              pageType === "wheel_item"
                ? "wheel"
                : pageType === "color_item"
                  ? "wheel"
                  : "default",
          }
        : undefined;

  return {
    id: createBlockId(tabId, kind, existingBlocks),
    kind,
    span: defaultSpan,
    enabled: true,
    settings,
  };
}

function SortableEditorRow({
  id,
  kind,
  selected,
  children,
}: {
  id: string;
  kind: SortableKind;
  selected?: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { kind },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "rounded-xl border border-border/70 bg-background/80",
        selected && "border-primary/40 bg-primary/5",
        isDragging && "opacity-60 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function usePageBuilderPreviewSample(pageType: ItemPageType): PreviewSample {
  const brands = useConvexResourceQuery<any[]>({
    queryKey: ["builder-preview", "brands"],
    queryRef: api.queries.brandsGetAllWithCounts,
    args: {},
    enabled: pageType === "brand_item",
  });
  const vehicles = useConvexResourceQuery<any[]>({
    queryKey: ["builder-preview", "vehicles"],
    queryRef: api.queries.vehiclesGetAllWithBrands,
    args: {},
    enabled: pageType === "vehicle_item",
  });
  const wheels = useConvexResourceQuery<any[]>({
    queryKey: ["builder-preview", "wheels"],
    queryRef: api.queries.wheelsGetAllWithBrands,
    args: {},
    enabled: pageType === "wheel_item",
  });
  const engines = useConvexResourceQuery<any[]>({
    queryKey: ["builder-preview", "engines"],
    queryRef: api.queries.engineFamiliesBrowse,
    args: {},
    enabled: pageType === "engine_item",
  });
  const colors = useConvexResourceQuery<any[]>({
    queryKey: ["builder-preview", "colors"],
    queryRef: api.colors.collectionGet,
    args: {},
    enabled: pageType === "color_item",
  });

  return useMemo(() => {
    switch (pageType) {
      case "vehicle_item": {
        const vehicle = vehicles.data?.[0] ?? {};
        const title = String(vehicle.vehicle_title ?? vehicle.model_name ?? "Vehicle preview");
        const subtitle = [vehicle.brand_name, vehicle.generation].filter(Boolean).join(" ");
        return {
          title,
          subtitle,
          badges: [vehicle.segment, vehicle.drive_type, vehicle.market].filter(Boolean),
          stats: [
            { label: "Variants", value: String(vehicle.variant_count ?? 4) },
            { label: "Wheels", value: String(vehicle.wheel_count ?? 12) },
            { label: "Engines", value: String(vehicle.engine_count ?? 3) },
          ],
          cards: [
            { title: "Overview facts", subtitle: subtitle || "Real vehicle metadata renders here." },
            { title: "Factory variants", subtitle: "Variants block uses the live vehicle variant surface." },
            { title: "Linked wheels", subtitle: "Wheel cards render here when the Wheels tab is enabled." },
          ],
          fitmentRows: [
            { label: "Bolt Pattern", value: String(vehicle.bolt_pattern ?? "5x120") },
            { label: "Center Bore", value: String(vehicle.center_bore ?? "72.6") },
          ],
        };
      }
      case "wheel_item": {
        const wheel = wheels.data?.[0] ?? {};
        const title = String(wheel.wheel_name ?? "Wheel preview");
        const subtitle = [wheel.brand_name, wheel.color].filter(Boolean).join(" • ");
        return {
          title,
          subtitle,
          badges: [wheel.diameter, wheel.width, wheel.bolt_pattern].filter(Boolean),
          stats: [
            { label: "Fitments", value: String(wheel.vehicle_count ?? 18) },
            { label: "Variants", value: String(wheel.variant_count ?? 6) },
            { label: "Assets", value: String((wheel.good_pic_url ? 1 : 0) + (wheel.bad_pic_url ? 1 : 0) || 2) },
          ],
          cards: [
            { title: "Variant grid", subtitle: "Finish and size cards show here." },
            { title: "Fitment table", subtitle: "The wheel fitment matrix sits here." },
            { title: "Linked vehicles", subtitle: "Vehicle cards render here when that tab is active." },
          ],
          fitmentRows: [
            { label: "Diameter", value: String(wheel.diameter ?? '19"') },
            { label: "Offset", value: String(wheel.wheel_offset ?? "ET35") },
          ],
        };
      }
      case "brand_item": {
        const brand = brands.data?.[0] ?? {};
        const title = String(brand.brand_title ?? "Brand preview");
        return {
          title,
          subtitle: String(brand.description ?? "").slice(0, 80) || "Brand hero and counts render here.",
          badges: [brand.country, brand.status].filter(Boolean),
          stats: [
            { label: "Vehicles", value: String(brand.vehicle_count ?? 32) },
            { label: "Wheels", value: String(brand.wheel_count ?? 14) },
            { label: "Subsidiaries", value: String(brand.subsidiary_count ?? 2) },
          ],
          cards: [
            { title: "Brand overview", subtitle: "Hero and summary content." },
            { title: "Vehicle grid", subtitle: "Linked vehicle cards render here." },
            { title: "Wheel grid", subtitle: "Linked wheel cards render here." },
          ],
          fitmentRows: [],
        };
      }
      case "engine_item": {
        const engine = engines.data?.[0] ?? {};
        const title = String(engine.family_title ?? engine.family_code ?? "Engine preview");
        const subtitle = String(engine.configuration ?? engine.engine_layout ?? "Engine family summary");
        return {
          title,
          subtitle,
          badges: [engine.brand_ref, engine.fuel_summary, engine.aspiration_summary].filter(Boolean),
          stats: [
            { label: "Variants", value: String(engine.variant_count ?? 4) },
            { label: "Vehicles", value: String(engine.linked_vehicle_count ?? 9) },
            { label: "Cylinders", value: String(engine.cylinders ?? 6) },
          ],
          cards: [
            { title: "Family summary", subtitle: "Hero and family facts render here." },
            { title: "Exact variants", subtitle: "Variant cards sit in this block." },
            { title: "Linked vehicles", subtitle: "Vehicle cards sit in this block." },
          ],
          fitmentRows: [
            { label: "Layout", value: String(engine.engine_layout ?? "Inline-6") },
            { label: "Covered displacement", value: String(engine.displacement_summary ?? "3.0L") },
          ],
        };
      }
      case "color_item":
      default: {
        const color = colors.data?.[0] ?? {};
        const title = String(color.color_title ?? "Color preview");
        return {
          title,
          subtitle: [color.brand_title, color.family_title, color.finish].filter(Boolean).join(" • "),
          badges: [color.swatch_hex, color.manufacturer_code].filter(Boolean),
          stats: [
            { label: "Wheels", value: String(color.wheelCount ?? 12) },
            { label: "Vehicles", value: String(color.vehicleCount ?? 6) },
            { label: "Variants", value: String((color.wheelVariantCount ?? 0) + (color.vehicleVariantCount ?? 0) || 8) },
          ],
          cards: [
            { title: "Wheel variants", subtitle: "Variant cards for wheel colors." },
            { title: "Linked vehicles", subtitle: "Vehicle cards for the color." },
            { title: "Linked wheels", subtitle: "Wheel cards for the color." },
          ],
          fitmentRows: [],
        };
      }
    }
  }, [brands.data, colors.data, engines.data, pageType, vehicles.data, wheels.data]);
}

function PreviewBlockCard({
  block,
  pageType,
  sample,
  selected,
  onSelect,
}: {
  block: ItemPageBlockTemplate;
  pageType: ItemPageType;
  sample: PreviewSample;
  selected: boolean;
  onSelect: () => void;
}) {
  const variantLabel =
    block.kind === "variants" && block.settings?.variantScope && block.settings.variantScope !== "default"
      ? ` (${block.settings.variantScope})`
      : "";

  const header = (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {ITEM_PAGE_BLOCK_LABELS[block.kind]}
          {variantLabel}
        </p>
        <p className="text-xs text-muted-foreground">Span {block.span}/12</p>
      </div>
      <Badge variant="outline">{block.enabled ? "Enabled" : "Hidden"}</Badge>
    </div>
  );

  let body: React.ReactNode = null;

  switch (block.kind) {
    case "hero":
      if (pageType === "wheel_item") {
        const wheelFieldLayout = normalizeWheelHeaderFieldLayout(block.settings?.fieldLayout);
        body = (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-2xl border border-border/70 bg-gradient-to-br from-primary/25 to-background" />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h3 className="truncate text-2xl font-bold text-foreground">{sample.title}</h3>
                  {sample.subtitle ? <p className="mt-1 text-sm text-muted-foreground">{sample.subtitle}</p> : null}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {wheelFieldLayout.map((item, index) => {
                if (item.kind === "placeholder") {
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <span className="min-w-[100px] text-sm font-medium text-muted-foreground">
                        {item.label || "Placeholder"}:
                      </span>
                      <Badge variant="outline" className="h-8 text-xs opacity-60">
                        {item.emptyLabel || "Not wired yet"}
                      </Badge>
                    </div>
                  );
                }

                const config = WHEEL_HEADER_FIELD_CONFIG[item.key];
                const fallbackValue =
                  sample.fitmentRows[index % Math.max(sample.fitmentRows.length, 1)]?.value ||
                  sample.badges[index % Math.max(sample.badges.length, 1)] ||
                  config.emptyLabel;
                return (
                  <div key={item.key} className={cn("flex items-center gap-2", config.className)}>
                    <span className="min-w-[100px] text-sm font-medium text-muted-foreground">{config.label}:</span>
                    <Badge variant="outline" className="h-8 text-xs">
                      {fallbackValue}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else {
        body = (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-2xl border border-border/70 bg-gradient-to-br from-primary/25 to-background" />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h3 className="truncate text-2xl font-bold text-foreground">{sample.title}</h3>
                  {sample.subtitle ? <p className="mt-1 text-sm text-muted-foreground">{sample.subtitle}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sample.badges.slice(0, 4).map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {sample.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      break;
    case "brief":
    case "facts":
      body = (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sample.stats.concat(sample.fitmentRows).slice(0, 4).map((item) => (
            <div key={item.label} className="rounded-xl border border-border/70 bg-background/60 px-3 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      );
      break;
    case "variants":
    case "vehicles_grid":
    case "wheels_grid":
    case "engines_grid":
    case "colors_grid":
      body = (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sample.cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-border/70 bg-background/60 p-4">
              <p className="text-base font-semibold text-foreground">{card.title}</p>
              {card.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{card.subtitle}</p> : null}
            </div>
          ))}
        </div>
      );
      break;
    case "gallery":
      body = (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] rounded-xl border border-border/70 bg-gradient-to-br from-muted/50 to-background"
            />
          ))}
        </div>
      );
      break;
    case "market":
      body = (
        <div className="rounded-xl border border-dashed border-border/70 bg-background/50 px-4 py-8 text-sm text-muted-foreground">
          Safe market panel placeholder. On the live page this block uses the active backend’s market surface if available.
        </div>
      );
      break;
    case "comments":
      body = (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Comment composer preview</p>
          </div>
          <div className="rounded-xl border border-dashed border-border/70 bg-background/50 px-4 py-8 text-sm text-muted-foreground">
            Empty comments state preview.
          </div>
        </div>
      );
      break;
    case "fitment_table":
      body = (
        <div className="rounded-xl border border-border/70 bg-background/60">
          {sample.fitmentRows.length > 0 ? (
            <div className="divide-y divide-border/60">
              {sample.fitmentRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-sm text-muted-foreground">Fitment rows render here for wheel/vehicle layouts.</div>
          )}
        </div>
      );
      break;
    case "rich_text":
      body = (
        <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-4">
          {block.settings?.title ? <p className="text-base font-semibold text-foreground">{block.settings.title}</p> : null}
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {block.settings?.body || "Rich text block preview."}
          </p>
        </div>
      );
      break;
    case "ad_slot":
      body = (
        <div className="rounded-xl border border-dashed border-border/70 bg-background/50 px-4 py-10 text-center text-sm text-muted-foreground">
          Advertising slot
        </div>
      );
      break;
    default:
      body = null;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "h-full w-full rounded-2xl border border-border/70 bg-card text-left transition-colors",
        selected && "border-primary/40 ring-1 ring-primary/30",
      )}
    >
      <div className="p-4">{header}{body}</div>
    </button>
  );
}

function BuilderPreviewShell({
  template,
  pageType,
  activeTab,
  onActiveTabChange,
  selectedBlockId,
  onSelectBlock,
  sample,
}: {
  template: ItemPageLayoutTemplate;
  pageType: ItemPageType;
  activeTab: string;
  onActiveTabChange: (value: string) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  sample: PreviewSample;
}) {
  const enabledTabs = template.tabs.filter((tab) => tab.enabled);
  const headerBlock = template.headerBlock?.enabled ? template.headerBlock : null;

  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="flex h-full flex-col">
      <div className="h-full overflow-y-auto px-2 pb-2 pt-0">
        <div className="space-y-2">
          {headerBlock ? (
            <PreviewBlockCard
              block={headerBlock}
              pageType={pageType}
              sample={sample}
              selected={selectedBlockId === headerBlock.id}
              onSelect={() => onSelectBlock(headerBlock.id)}
            />
          ) : null}

          <div className="overflow-hidden rounded-[24px] border border-border bg-card">
            <div className="px-4 pt-3">
              <TabsList className="inline-flex h-auto w-auto justify-start gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
                {enabledTabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="min-w-fit rounded-full border border-white/12 !bg-transparent px-4 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-white/18 hover:text-foreground data-[state=active]:border-white/20 data-[state=active]:!bg-[#242424] data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    {index === 0 && template.titleTabLabelMode === "item_title" ? sample.title : tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className={cn(getItemPagePaddingClass(template.containerStyle.panelPadding), "pt-4")}>
              {enabledTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0 hidden data-[state=active]:block">
                  <div className={cn("grid grid-cols-1 md:grid-cols-12", getItemPageGapClass(template.containerStyle.blockGap))}>
                    {tab.blocks.filter((block) => block.enabled).map((block) => (
                      <div
                        key={block.id}
                        className={getItemPageSpanClass(block.span)}
                        style={block.minHeight ? { minHeight: `${block.minHeight}px` } : undefined}
                      >
                        <PreviewBlockCard
                          block={block}
                          pageType={pageType}
                          sample={sample}
                          selected={selectedBlockId === block.id}
                          onSelect={() => onSelectBlock(block.id)}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}

export default function PageTemplatesPage() {
  const [pageType, setPageType] = useState<ItemPageType>("vehicle_item");
  const {
    draftTemplate,
    setDraftTemplate,
    resolvedTemplate,
    isDirty,
    isLoading,
    isBackendUnavailable,
    error,
    save,
    reset,
  } = useItemPageLayoutTemplateEditor(pageType);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewTabId, setPreviewTabId] = useState<string>("");
  const [newTabLabel, setNewTabLabel] = useState("");
  const [pendingBlockKind, setPendingBlockKind] = useState<ItemPageBlockKind | "">("");
  const [newPlaceholderLabel, setNewPlaceholderLabel] = useState("");
  const [newPlaceholderEmptyLabel, setNewPlaceholderEmptyLabel] = useState("Not wired yet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewSample = usePageBuilderPreviewSample(pageType);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const enabledTabs = useMemo(() => draftTemplate.tabs.filter((tab) => tab.enabled), [draftTemplate.tabs]);
  const headerBlock = draftTemplate.headerBlock;
  const selectedTab = useMemo(
    () => draftTemplate.tabs.find((tab) => tab.id === selectedTabId) ?? draftTemplate.tabs[0] ?? null,
    [draftTemplate.tabs, selectedTabId],
  );
  const selectedBlock = useMemo(
    () =>
      (headerBlock?.id === selectedBlockId ? headerBlock : null) ??
      selectedTab?.blocks.find((block) => block.id === selectedBlockId) ??
      selectedTab?.blocks[0] ??
      headerBlock ??
      null,
    [headerBlock, selectedBlockId, selectedTab],
  );
  const selectedHeaderBlock = selectedBlock?.id === headerBlock?.id ? selectedBlock : null;
  const selectedWheelHeroFieldLayout = useMemo(
    () =>
      pageType === "wheel_item" && selectedHeaderBlock?.kind === "hero"
        ? normalizeWheelHeaderFieldLayout(selectedHeaderBlock.settings?.fieldLayout)
        : [],
    [pageType, selectedHeaderBlock],
  );

  useEffect(() => {
    const fallbackTabId = draftTemplate.tabs[0]?.id ?? "";
    if (!selectedTabId || !draftTemplate.tabs.some((tab) => tab.id === selectedTabId)) {
      setSelectedTabId(fallbackTabId);
    }
    if (!previewTabId || !enabledTabs.some((tab) => tab.id === previewTabId)) {
      setPreviewTabId(draftTemplate.defaultActiveTab || enabledTabs[0]?.id || fallbackTabId);
    }
  }, [draftTemplate.defaultActiveTab, draftTemplate.tabs, enabledTabs, previewTabId, selectedTabId]);

  useEffect(() => {
    const availableBlockIds = new Set([
      ...(headerBlock ? [headerBlock.id] : []),
      ...(selectedTab?.blocks.map((block) => block.id) ?? []),
    ]);
    const fallbackBlockId = selectedTab?.blocks[0]?.id ?? headerBlock?.id ?? null;
    if (!selectedBlockId || !availableBlockIds.has(selectedBlockId)) {
      setSelectedBlockId(fallbackBlockId);
    }
  }, [headerBlock, selectedBlockId, selectedTab]);

  const updateTemplate = (mutator: (template: ItemPageLayoutTemplate) => void) => {
    setDraftTemplate((current) => {
      const next = cloneTemplate(current);
      mutator(next);
      return normalizeItemPageTemplate(pageType, next);
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await save();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    try {
      await reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTab = () => {
    const label = newTabLabel.trim() || `New Tab ${draftTemplate.tabs.length + 1}`;
    updateTemplate((template) => {
      const id = createUniqueTabId(template, label);
      template.tabs.push({
        id,
        label,
        enabled: true,
        blocks: [],
      });
      template.defaultActiveTab = template.defaultActiveTab || id;
    });
    const createdId = createUniqueTabId(draftTemplate, label);
    setSelectedTabId(createdId);
    setPreviewTabId(createdId);
    setNewTabLabel("");
  };

  const handleAddBlock = () => {
    if (!selectedTab || !pendingBlockKind) return;
    const nextBlock = createDefaultBlock(pageType, selectedTab.id, pendingBlockKind, selectedTab.blocks);
    updateTemplate((template) => {
      const tab = template.tabs.find((item) => item.id === selectedTab.id);
      if (!tab) return;
      tab.blocks.push(nextBlock);
    });
    setSelectedBlockId(nextBlock.id);
    setPendingBlockKind("");
  };

  const updateSelectedBlockFieldLayout = (nextLayout: ItemPageFieldLayoutItem[]) => {
    if (!selectedBlock) return;
    updateTemplate((template) => {
      const block =
        template.headerBlock?.id === selectedBlock.id
          ? template.headerBlock
          : template.tabs
              .flatMap((tab) => tab.blocks)
              .find((item) => item.id === selectedBlock.id);
      if (!block) return;
      block.settings = {
        ...block.settings,
        fieldLayout: nextLayout,
      };
    });
  };

  const updateBlockById = (
    blockId: string,
    mutator: (block: ItemPageBlockTemplate) => void,
  ) => {
    updateTemplate((template) => {
      const block =
        template.headerBlock?.id === blockId
          ? template.headerBlock
          : template.tabs
              .flatMap((tab) => tab.blocks)
              .find((item) => item.id === blockId);
      if (!block) return;
      mutator(block);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeKind = active.data.current?.kind as SortableKind | undefined;
    const overKind = over.data.current?.kind as SortableKind | undefined;

    if (activeKind === "tab" && overKind === "tab") {
      const oldIndex = draftTemplate.tabs.findIndex((tab) => `tab:${tab.id}` === activeId);
      const newIndex = draftTemplate.tabs.findIndex((tab) => `tab:${tab.id}` === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      updateTemplate((template) => {
        template.tabs = arrayMove(template.tabs, oldIndex, newIndex);
      });
      return;
    }

    if (activeKind === "block" && overKind === "block" && selectedTab) {
      const oldIndex = selectedTab.blocks.findIndex((block) => `block:${selectedTab.id}:${block.id}` === activeId);
      const newIndex = selectedTab.blocks.findIndex((block) => `block:${selectedTab.id}:${block.id}` === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      updateTemplate((template) => {
        const tab = template.tabs.find((item) => item.id === selectedTab.id);
        if (!tab) return;
        tab.blocks = arrayMove(tab.blocks, oldIndex, newIndex);
      });
    }
  };

  return (
    <DashboardLayout title="Page Builder" showFilterButton={false} disableContentPadding={true}>
      <div className="flex h-full min-h-0 flex-col p-2">
        <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Item Page Builder</h1>
              <p className="text-sm text-muted-foreground">
                Page-type templates that persist on the active backend and feed the public item pages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{ITEM_PAGE_TYPE_LABELS[pageType]}</Badge>
            {isDirty ? <Badge variant="secondary">Unsaved changes</Badge> : <Badge variant="outline">Saved</Badge>}
            <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting || !isDirty}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save template
            </Button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <Card className="min-h-0 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Structure</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-64px)] min-h-0 flex-col gap-4">
              <div className="space-y-2">
                <Label>Page type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ITEM_PAGE_TYPE_LABELS) as ItemPageType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={pageType === type ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setPageType(type)}
                    >
                      {ITEM_PAGE_TYPE_LABELS[type]}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Persistent header</Label>
                  <Badge variant="outline">{draftTemplate.headerBlock?.enabled ? "Visible" : "Hidden"}</Badge>
                </div>
                {draftTemplate.headerBlock ? (
                  <div className="rounded-xl border border-border/70 bg-background/80">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground">
                        <LayoutPanelTop className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => setSelectedBlockId(draftTemplate.headerBlock?.id ?? null)}
                      >
                        <p className="truncate text-sm font-medium text-foreground">Header</p>
                        <p className="text-xs text-muted-foreground">
                          {draftTemplate.headerBlock.enabled ? "Visible" : "Hidden"} • persistent top card
                        </p>
                      </button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          updateBlockById(draftTemplate.headerBlock!.id, (block) => {
                            block.enabled = !block.enabled;
                          })
                        }
                      >
                        {draftTemplate.headerBlock.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tabs</Label>
                  <Badge variant="outline">{draftTemplate.tabs.length}</Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTabLabel}
                    onChange={(event) => setNewTabLabel(event.target.value)}
                    placeholder="New tab label"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTab}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                <ScrollArea className="h-60 rounded-xl border border-border/70 p-2">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={draftTemplate.tabs.map((tab) => `tab:${tab.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {draftTemplate.tabs.map((tab) => (
                          <SortableEditorRow
                            key={tab.id}
                            id={`tab:${tab.id}`}
                            kind="tab"
                            selected={selectedTabId === tab.id}
                          >
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="min-w-0 flex-1 text-left"
                                onClick={() => {
                                  setSelectedTabId(tab.id);
                                  setPreviewTabId(tab.id);
                                }}
                              >
                                <p className="truncate text-sm font-medium text-foreground">
                                  {tab.id === "comments"
                                    ? "Comments"
                                    : tab.id === "market"
                                      ? "Market"
                                      : tab.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {tab.enabled ? "Visible" : "Hidden"} • {tab.blocks.length} blocks
                                </p>
                              </button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  updateTemplate((template) => {
                                    const target = template.tabs.find((item) => item.id === tab.id);
                                    if (!target) return;
                                    target.enabled = !target.enabled;
                                  })
                                }
                              >
                                {tab.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={draftTemplate.tabs.length <= 1}
                                onClick={() =>
                                  updateTemplate((template) => {
                                    template.tabs = template.tabs.filter((item) => item.id !== tab.id);
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </SortableEditorRow>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </ScrollArea>
              </div>

              <Separator />

              <div className="space-y-2 min-h-0 flex-1">
                <div className="flex items-center justify-between">
                  <Label>Block library</Label>
                  <Badge variant="outline">{selectedTab?.blocks.length ?? 0}</Badge>
                </div>
                <div className="flex gap-2">
                  <Select value={pendingBlockKind} onValueChange={(value) => setPendingBlockKind(value as ItemPageBlockKind | "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose block kind" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_BLOCKS_BY_PAGE_TYPE[pageType].map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {ITEM_PAGE_BLOCK_LABELS[kind]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" disabled={!selectedTab || !pendingBlockKind} onClick={handleAddBlock}>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Insert
                  </Button>
                </div>
                <ScrollArea className="h-full rounded-xl border border-border/70 p-2">
                  {selectedTab ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={selectedTab.blocks.map((block) => `block:${selectedTab.id}:${block.id}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {selectedTab.blocks.map((block) => (
                            <SortableEditorRow
                              key={block.id}
                              id={`block:${selectedTab.id}:${block.id}`}
                              kind="block"
                              selected={selectedBlockId === block.id}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="min-w-0 flex-1 text-left"
                                  onClick={() => setSelectedBlockId(block.id)}
                                >
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {ITEM_PAGE_BLOCK_LABELS[block.kind]}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Span {block.span}/12{block.minHeight ? ` • Min ${block.minHeight}px` : ""}
                                  </p>
                                </button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    updateTemplate((template) => {
                                      const tab = template.tabs.find((item) => item.id === selectedTab.id);
                                      const target = tab?.blocks.find((item) => item.id === block.id);
                                      if (!target) return;
                                      target.enabled = !target.enabled;
                                    })
                                  }
                                >
                                  {block.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    updateTemplate((template) => {
                                      const tab = template.tabs.find((item) => item.id === selectedTab.id);
                                      if (!tab) return;
                                      tab.blocks = tab.blocks.filter((item) => item.id !== block.id);
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </SortableEditorRow>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">Select a tab to edit its block stack.</div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-0 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Live template preview</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Uses the same tab shell as the public item pages, with live backend sample labels where available.
                  </p>
                </div>
                <Badge variant="outline">{previewSample.title}</Badge>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-72px)] min-h-0 overflow-hidden p-0">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-full overflow-hidden rounded-t-2xl border-t border-border/70 bg-card">
                  <BuilderPreviewShell
                    template={draftTemplate}
                    pageType={pageType}
                    activeTab={previewTabId}
                    onActiveTabChange={setPreviewTabId}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={setSelectedBlockId}
                    sample={previewSample}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="min-h-0 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Inspector</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0">
              <ScrollArea className="h-[calc(100vh-190px)] pr-3">
                <div className="space-y-6">
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Template</h3>
                    <div className="space-y-2">
                      <Label>Title tab label</Label>
                      <Select
                        value={draftTemplate.titleTabLabelMode}
                        onValueChange={(value) =>
                          updateTemplate((template) => {
                            template.titleTabLabelMode = value as ItemPageLayoutTemplate["titleTabLabelMode"];
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="item_title">Use item title</SelectItem>
                          <SelectItem value="custom">Use custom tab label</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default active tab</Label>
                      <Select
                        value={draftTemplate.defaultActiveTab}
                        onValueChange={(value) =>
                          updateTemplate((template) => {
                            template.defaultActiveTab = value;
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {draftTemplate.tabs.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id}>
                              {tab.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Panel padding</Label>
                      <Select
                        value={draftTemplate.containerStyle.panelPadding}
                        onValueChange={(value) =>
                          updateTemplate((template) => {
                            template.containerStyle.panelPadding = value as ItemPageLayoutTemplate["containerStyle"]["panelPadding"];
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="relaxed">Relaxed</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{getItemPagePaddingClass(draftTemplate.containerStyle.panelPadding)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Block gap</Label>
                      <Select
                        value={draftTemplate.containerStyle.blockGap}
                        onValueChange={(value) =>
                          updateTemplate((template) => {
                            template.containerStyle.blockGap = value as ItemPageLayoutTemplate["containerStyle"]["blockGap"];
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{getItemPageGapClass(draftTemplate.containerStyle.blockGap)}</p>
                    </div>
                  </section>

                  <Separator />

                  {selectedTab ? (
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Selected tab</h3>
                      <div className="space-y-2">
                        <Label>Tab label</Label>
                        <Input
                          value={selectedTab.label}
                          onChange={(event) =>
                            updateTemplate((template) => {
                              const target = template.tabs.find((tab) => tab.id === selectedTab.id);
                              if (!target) return;
                              target.label = event.target.value;
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">Visible</p>
                          <p className="text-xs text-muted-foreground">Hidden tabs stay in the template but do not render publicly.</p>
                        </div>
                        <Switch
                          checked={selectedTab.enabled}
                          onCheckedChange={(checked) =>
                            updateTemplate((template) => {
                              const target = template.tabs.find((tab) => tab.id === selectedTab.id);
                              if (!target) return;
                              target.enabled = checked;
                            })
                          }
                        />
                      </div>
                    </section>
                  ) : null}

                  <Separator />

                  {selectedBlock ? (
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {selectedHeaderBlock ? "Persistent header" : "Selected block"}
                      </h3>
                      <div className="rounded-xl border border-border/70 px-3 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {selectedHeaderBlock ? "Header" : ITEM_PAGE_BLOCK_LABELS[selectedBlock.kind]}
                        </p>
                        <p className="text-xs text-muted-foreground">{selectedBlock.id}</p>
                      </div>
                      {!selectedHeaderBlock ? (
                        <>
                          <div className="space-y-2">
                            <Label>Width span</Label>
                            <Select
                              value={String(selectedBlock.span)}
                              onValueChange={(value) =>
                                updateBlockById(selectedBlock.id, (block) => {
                                  block.span = Number(value);
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }).map((_, index) => {
                                  const span = index + 1;
                                  return (
                                    <SelectItem key={span} value={String(span)}>
                                      {span}/12
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">{getItemPageSpanClass(selectedBlock.span)}</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Minimum height (px)</Label>
                            <Input
                              type="number"
                              min={0}
                              step={10}
                              value={selectedBlock.minHeight ?? ""}
                              onChange={(event) =>
                                updateBlockById(selectedBlock.id, (block) => {
                                  const raw = Number(event.target.value);
                                  block.minHeight = Number.isFinite(raw) && raw > 0 ? raw : undefined;
                                })
                              }
                            />
                          </div>
                        </>
                      ) : null}
                      <div className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">Visible</p>
                          <p className="text-xs text-muted-foreground">Hidden blocks stay saved but do not render.</p>
                        </div>
                        <Switch
                          checked={selectedBlock.enabled}
                          onCheckedChange={(checked) =>
                            updateBlockById(selectedBlock.id, (block) => {
                              block.enabled = checked;
                            })
                          }
                        />
                      </div>

                      {selectedBlock.kind === "variants" ? (
                        <div className="space-y-2">
                          <Label>Variant scope</Label>
                          <Select
                            value={selectedBlock.settings?.variantScope ?? "default"}
                            onValueChange={(value) =>
                              updateBlockById(selectedBlock.id, (block) => {
                                block.settings = {
                                  ...block.settings,
                                  variantScope: value as ItemPageBlockTemplate["settings"]["variantScope"],
                                };
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="wheel">Wheel variants</SelectItem>
                              <SelectItem value="vehicle">Vehicle variants</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : null}

                      {pageType === "wheel_item" && selectedHeaderBlock?.kind === "hero" ? (
                        <div className="space-y-3">
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground">Header fields</h4>
                            <p className="text-xs text-muted-foreground">
                              These rows stay inside the existing wheel header. Add built-in fields or placeholder rows you can wire later.
                            </p>
                          </div>
                          <div className="space-y-2">
                            {selectedWheelHeroFieldLayout.map((item, index) => (
                              <div
                                key={item.key}
                                className="rounded-xl border border-border/70 bg-background/70 px-3 py-3"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-foreground">
                                        {item.kind === "field"
                                          ? WHEEL_HEADER_FIELD_CONFIG[item.key as WheelHeaderFieldKey].label
                                          : item.label || "Placeholder"}
                                      </p>
                                      <Badge variant="outline">{item.kind}</Badge>
                                    </div>
                                    {item.kind === "placeholder" ? (
                                      <div className="mt-3 space-y-2">
                                        <Input
                                          value={item.label || ""}
                                          onChange={(event) => {
                                            const next = selectedWheelHeroFieldLayout.map((row, rowIndex) =>
                                              rowIndex === index
                                                ? { ...row, label: event.target.value }
                                                : row,
                                            );
                                            updateSelectedBlockFieldLayout(next);
                                          }}
                                          placeholder="Placeholder label"
                                        />
                                        <Input
                                          value={item.emptyLabel || ""}
                                          onChange={(event) => {
                                            const next = selectedWheelHeroFieldLayout.map((row, rowIndex) =>
                                              rowIndex === index
                                                ? { ...row, emptyLabel: event.target.value }
                                                : row,
                                            );
                                            updateSelectedBlockFieldLayout(next);
                                          }}
                                          placeholder="Placeholder badge text"
                                        />
                                      </div>
                                    ) : (
                                      <p className="mt-2 text-xs text-muted-foreground">
                                        Built-in wheel field
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      disabled={index === 0}
                                      onClick={() => {
                                        const next = arrayMove(selectedWheelHeroFieldLayout, index, index - 1);
                                        updateSelectedBlockFieldLayout(next);
                                      }}
                                    >
                                      ↑
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      disabled={index === selectedWheelHeroFieldLayout.length - 1}
                                      onClick={() => {
                                        const next = arrayMove(selectedWheelHeroFieldLayout, index, index + 1);
                                        updateSelectedBlockFieldLayout(next);
                                      }}
                                    >
                                      ↓
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => {
                                        const next = selectedWheelHeroFieldLayout.filter((_, rowIndex) => rowIndex !== index);
                                        updateSelectedBlockFieldLayout(next);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <Label>Add built-in field</Label>
                            <div className="flex flex-wrap gap-2">
                              {WHEEL_HEADER_FIELD_KEYS.filter(
                                (fieldKey) =>
                                  !selectedWheelHeroFieldLayout.some(
                                    (item) => item.kind === "field" && item.key === fieldKey,
                                  ),
                              ).map((fieldKey) => (
                                <Button
                                  key={fieldKey}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateSelectedBlockFieldLayout([
                                      ...selectedWheelHeroFieldLayout,
                                      { kind: "field", key: fieldKey },
                                    ])
                                  }
                                >
                                  <Plus className="mr-2 h-3.5 w-3.5" />
                                  {WHEEL_HEADER_FIELD_CONFIG[fieldKey].label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2 rounded-xl border border-dashed border-border/70 px-3 py-3">
                            <Label>Create placeholder row</Label>
                            <Input
                              value={newPlaceholderLabel}
                              onChange={(event) => setNewPlaceholderLabel(event.target.value)}
                              placeholder="e.g. Material"
                            />
                            <Input
                              value={newPlaceholderEmptyLabel}
                              onChange={(event) => setNewPlaceholderEmptyLabel(event.target.value)}
                              placeholder="e.g. Not wired yet"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              disabled={!newPlaceholderLabel.trim()}
                              onClick={() => {
                                const nextLayout = [
                                  ...selectedWheelHeroFieldLayout,
                                  {
                                    kind: "placeholder" as const,
                                    key: createPlaceholderFieldKey(
                                      selectedWheelHeroFieldLayout,
                                      newPlaceholderLabel,
                                    ),
                                    label: newPlaceholderLabel.trim(),
                                    emptyLabel: newPlaceholderEmptyLabel.trim() || "Not wired yet",
                                  },
                                ];
                                updateSelectedBlockFieldLayout(nextLayout);
                                setNewPlaceholderLabel("");
                                setNewPlaceholderEmptyLabel("Not wired yet");
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add placeholder
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {selectedBlock.kind === "rich_text" ? (
                        <>
                          <div className="space-y-2">
                            <Label>Title</Label>
                          <Input
                            value={selectedBlock.settings?.title ?? ""}
                            onChange={(event) =>
                              updateBlockById(selectedBlock.id, (block) => {
                                block.settings = {
                                  ...block.settings,
                                  title: event.target.value,
                                };
                              })
                            }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Body</Label>
                          <Textarea
                            value={selectedBlock.settings?.body ?? ""}
                            onChange={(event) =>
                              updateBlockById(selectedBlock.id, (block) => {
                                block.settings = {
                                  ...block.settings,
                                  body: event.target.value,
                                };
                              })
                            }
                              rows={6}
                            />
                          </div>
                        </>
                      ) : null}
                    </section>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground">
                      Select a block to edit its settings.
                    </div>
                  )}

                  {isBackendUnavailable ? (
                    <>
                      <Separator />
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                        The active backend does not have the `pageLayouts` functions yet. The builder is running against the fallback template locally until the backend is updated.
                      </div>
                    </>
                  ) : null}

                  {error ? (
                    <>
                      <Separator />
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                        {error.message}
                      </div>
                    </>
                  ) : null}

                  <Separator />

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Resolved template</h3>
                    <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
                      <p className="text-xs text-muted-foreground">Public fallback still exists.</p>
                      <p className="mt-2 text-sm text-foreground">
                        {resolvedTemplate.tabs.filter((tab) => tab.enabled).length} enabled tabs • {(resolvedTemplate.headerBlock?.enabled ? 1 : 0) + resolvedTemplate.tabs.flatMap((tab) => tab.blocks).filter((block) => block.enabled).length} enabled regions
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
