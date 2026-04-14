import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  getItemPageGapClass,
  getItemPagePaddingClass,
  getItemPageSpanClass,
} from "@/lib/itemPageLayouts";
import type {
  ItemPageBlockTemplate,
  ItemPageLayoutTemplate,
  ItemPageTabTemplate,
} from "@/types/itemPageLayout";

interface AdditionalItemPageTab {
  id: string;
  label: string;
  content: ReactNode;
  triggerClassName?: string;
}

interface ItemPageTabsShellProps {
  titleTabLabel: string;
  template: ItemPageLayoutTemplate;
  activeTab: string;
  onActiveTabChange: (value: string) => void;
  onBack: () => void;
  renderBlock: (block: ItemPageBlockTemplate, tab: ItemPageTabTemplate, blockIndex: number) => ReactNode;
  additionalTabs?: AdditionalItemPageTab[];
  persistentHeaderContent?: ReactNode;
  tabPlacement?: "header" | "content";
  useItemTitleForFirstTab?: boolean;
}

export default function ItemPageTabsShell({
  titleTabLabel,
  template,
  activeTab,
  onActiveTabChange,
  onBack,
  renderBlock,
  additionalTabs = [],
  persistentHeaderContent,
  tabPlacement = "header",
  useItemTitleForFirstTab = true,
}: ItemPageTabsShellProps) {
  const enabledTabs = template.tabs.filter((tab) => tab.enabled);
  const paddingClass = getItemPagePaddingClass(template.containerStyle.panelPadding);
  const gapClass = getItemPageGapClass(template.containerStyle.blockGap);
  const showPersistentHeader =
    tabPlacement === "content" && template.headerBlock?.enabled && persistentHeaderContent;

  const tabsList = (
    <TabsList
      className={
        tabPlacement === "header"
          ? "!ml-1 !inline-flex !h-auto !w-auto !justify-start gap-0.5 !rounded-none !border-0 !bg-transparent !p-0 text-muted-foreground shadow-none"
          : "!flex !h-auto !w-auto !justify-start gap-2 !rounded-none !border-0 !bg-transparent !p-0 text-muted-foreground shadow-none"
      }
    >
      {enabledTabs.map((tab, index) => {
        const isTitleTab = index === 0 && template.titleTabLabelMode === "item_title" && useItemTitleForFirstTab;
        return (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              tabPlacement === "header"
                ? "min-w-fit rounded-md border border-transparent !bg-transparent px-2.5 py-1 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-white/10 data-[state=active]:!bg-[#242424] data-[state=active]:text-foreground data-[state=active]:shadow-none"
                : "min-w-fit rounded-full border border-white/12 !bg-transparent px-4 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-white/90 hover:text-foreground data-[state=active]:border-white/20 data-[state=active]:!bg-[#242424] data-[state=active]:text-foreground data-[state=active]:shadow-none"
              ,
              tab.triggerClassName
            )}
          >
            {isTitleTab ? titleTabLabel : tab.label}
          </TabsTrigger>
        );
      })}
      {additionalTabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className={
            tabPlacement === "header"
              ? cn(
                  "min-w-fit rounded-md border border-transparent !bg-transparent px-2.5 py-1 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-white/10 data-[state=active]:!bg-[#242424] data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  tab.triggerClassName,
                )
              : cn(
                  "min-w-fit rounded-full border border-white/12 !bg-transparent px-4 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-white/90 hover:text-foreground data-[state=active]:border-white/20 data-[state=active]:!bg-[#242424] data-[state=active]:text-foreground data-[state=active]:shadow-none",
                  tab.triggerClassName,
                )
          }
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange}>
      <DashboardLayout
        title=""
        showBreadcrumb={false}
        showFilterButton={false}
        disableContentPadding={true}
        leadingButtonIcon={<ChevronLeft className="h-4 w-4 text-white" />}
        onLeadingButtonClick={onBack}
        leadingButtonTitle="Back"
        headerLeftContent={tabPlacement === "header" ? tabsList : undefined}
      >
        <div className={cn("h-full overflow-y-auto px-2 pb-2 pt-0", tabPlacement === "header" ? "" : "space-y-2")}>
          {showPersistentHeader ? persistentHeaderContent : null}
          <div
            className={cn(
              "rounded-[24px] border border-border bg-card",
              tabPlacement === "header" ? "min-h-[calc(100vh-180px)]" : "min-h-[calc(100vh-340px)] overflow-hidden"
            )}
          >
            {tabPlacement === "content" ? (
              <div className="px-4 pt-3">
                {tabsList}
              </div>
            ) : null}
              <div className={cn(paddingClass, tabPlacement === "content" ? "pt-4" : undefined)}>
            {enabledTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 hidden data-[state=active]:block">
                <div className={cn("grid grid-cols-1 md:grid-cols-12", gapClass)}>
                  {tab.blocks
                    .filter((block) => block.enabled)
                    .map((block, blockIndex) => (
                    <div
                      key={block.id}
                      className={getItemPageSpanClass(block.span)}
                      style={block.minHeight ? { minHeight: `${block.minHeight}px` } : undefined}
                    >
                      {renderBlock(block, tab, blockIndex)}
                    </div>
                    ))}
                </div>
              </TabsContent>
            ))}

            {additionalTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 hidden data-[state=active]:block">
                {tab.content}
              </TabsContent>
            ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Tabs>
  );
}
