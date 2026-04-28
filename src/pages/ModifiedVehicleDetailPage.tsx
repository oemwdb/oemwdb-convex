import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Wrench } from "lucide-react";

import ItemPageTabsShell from "@/components/item-page/ItemPageTabsShell";
import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";
import { ItemPageEmptyState, ItemPagePanel, ItemPageRichText } from "@/components/item-page/ItemPageCommonBlocks";
import { getModifiedVehicleBySlug } from "@/data/modifiedVehicles";
import type { ItemPageBlockTemplate, ItemPageLayoutTemplate, ItemPageTabTemplate } from "@/types/itemPageLayout";

const BUILD_PAGE_TEMPLATE: ItemPageLayoutTemplate = {
  pageType: "vehicle_item",
  version: 2,
  titleTabLabelMode: "item_title",
  defaultActiveTab: "brief",
  containerStyle: { panelPadding: "default", blockGap: "lg" },
  headerBlock: {
    id: "build-header",
    kind: "hero",
    span: 12,
    enabled: true,
  },
  tabs: [
    {
      id: "brief",
      label: "Brief",
      enabled: true,
      blocks: [{ id: "build-brief", kind: "brief", span: 12, enabled: true }],
    },
    {
      id: "sources",
      label: "Sources",
      enabled: true,
      blocks: [{ id: "build-sources", kind: "facts", span: 12, enabled: true }],
    },
    {
      id: "base-vehicle",
      label: "Base Vehicle",
      enabled: true,
      blocks: [{ id: "build-base-vehicle", kind: "rich_text", span: 12, enabled: true }],
    },
    {
      id: "market",
      label: "Market",
      enabled: true,
      blocks: [{ id: "build-market", kind: "market", span: 12, enabled: true }],
    },
    {
      id: "comments",
      label: "Comments",
      enabled: true,
      blocks: [{ id: "build-comments", kind: "comments", span: 12, enabled: true }],
    },
  ],
};

export default function ModifiedVehicleDetailPage() {
  const navigate = useNavigate();
  const { buildSlug } = useParams<{ buildSlug: string }>();
  const [activeTab, setActiveTab] = useState("brief");
  const build = buildSlug ? getModifiedVehicleBySlug(buildSlug) : null;

  const rows = useMemo(() => {
    if (!build) return [];
    return [
      { label: "Base", values: [{ label: build.baseVehicle }] },
      { label: "Builder", values: [{ label: build.builder }] },
      { label: "Style", values: [{ label: build.style }] },
      { label: "Era", values: [{ label: build.era }] },
    ];
  }, [build]);

  if (!build) {
    return (
      <ItemPageTabsShell
        titleTabLabel="Modified Build"
        template={BUILD_PAGE_TEMPLATE}
        activeTab="brief"
        onActiveTabChange={() => {}}
        onBack={() => navigate(-1)}
        tabPlacement="content"
        useItemTitleForFirstTab={false}
        persistentHeaderContent={
          <ItemPageEmptyState
            title="Build not found"
            description="This modified vehicle record is missing or has not been defined yet."
            icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
          />
        }
        renderBlock={() => null}
      />
    );
  }

  const persistentHeaderContent = (
    <ItemPageHeaderCard
      title={build.title}
      subtitle={`${build.brand} / ${build.builder}`}
      description={build.summary}
      rows={rows}
      media={
        <HeaderMediaImage
          alt={build.title}
          sources={[{ value: build.image, bucketHint: "oemwdb images" }]}
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image available
            </div>
          }
        />
      }
    />
  );

  const renderBlock = (block: ItemPageBlockTemplate, tab: ItemPageTabTemplate) => {
    switch (tab.id) {
      case "brief":
        return (
          <ItemPagePanel title="Build Summary">
            <div className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">{build.summary}</p>
              <div className="flex flex-wrap gap-2">
                {build.featureTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ItemPagePanel>
        );
      case "sources":
        return (
          <ItemPagePanel title="Tracked Sources">
            <div className="space-y-3">
              {build.sources.map((source) => (
                <div key={source} className="flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{source}</span>
                </div>
              ))}
              <p className="text-sm leading-7 text-muted-foreground">{build.notes}</p>
            </div>
          </ItemPagePanel>
        );
      case "base-vehicle":
        return (
          <ItemPageRichText
            title="Base Vehicle Context"
            body={`This build is currently attached to ${build.baseVehicle}. Once build features are normalized, this tab should render build-feature groups, linked wheel families, linked engine context, and provenance notes instead of static placeholder copy.\n\nCurrent notes: ${build.notes}`}
          />
        );
      case "market":
        return (
          <ItemPageEmptyState
            title="Build market surface coming later"
            description="This slot is reserved for builder-linked inventory, featured listings, and ad placements for specific modified builds."
          />
        );
      case "comments":
        return (
          <ItemPageEmptyState
            title="Comments not wired yet"
            description="We can add a dedicated modified-build discussion lane once these records are backed by real Convex ids."
          />
        );
      default:
        return null;
    }
  };

  return (
    <ItemPageTabsShell
      titleTabLabel={build.title}
      template={BUILD_PAGE_TEMPLATE}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onBack={() => navigate(-1)}
      tabPlacement="content"
      useItemTitleForFirstTab={false}
      persistentHeaderContent={persistentHeaderContent}
      renderBlock={renderBlock}
    />
  );
}
