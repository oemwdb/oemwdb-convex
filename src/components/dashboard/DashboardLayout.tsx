import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BackendTargetBadge from "./BackendTargetBadge";
import type { ParsedFilters } from '@/utils/filterParser';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCollectionSidebarContext } from "@/contexts/CollectionSidebarContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  searchDropdown?: React.ReactNode;
  filterSearchDropdown?: React.ReactNode;
  onFilterSearchSubmit?: (filterString: string) => void;
  parsedFilters?: ParsedFilters;
  onRemoveFilter?: (category: string, value: string) => void;
  searchTags?: string[];
  onAddSearchTag?: (tag: string) => void;
  onRemoveSearchTag?: (tag: string) => void;
  topSuggestion?: string;
  hideHeader?: boolean;
  // Secondary sidebar props
  secondarySidebar?: React.ReactNode;
  sortSidebar?: React.ReactNode;
  customSidebar?: React.ReactNode;

  secondaryTitle?: string;
  secondaryHeaderContent?: React.ReactNode;
  sortTitle?: string;
  customTitle?: string;
  secondaryActionIcon?: React.ReactNode;
  customActionIcon?: React.ReactNode;
  customSidebarInteractive?: boolean;
  customSidebarSide?: "left" | "right";
  secondarySidebarContextKey?: string;

  // Header customization
  headerActions?: React.ReactNode;
  headerLeftContent?: React.ReactNode;
  leadingButtonIcon?: React.ReactNode;
  leadingButtonContent?: React.ReactNode;
  onLeadingButtonClick?: () => void;
  leadingButtonTitle?: string;
  showSearch?: boolean;
  showBreadcrumb?: boolean;
  disableContentPadding?: boolean;
}

const DashboardLayout = ({
  children,
  title = "OEM Wheel Database",
  onFilterClick,
  showFilterButton = true,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  sidebarCollapsed: externalSidebarCollapsed,
  onSidebarToggle,
  searchDropdown,
  filterSearchDropdown,
  onFilterSearchSubmit,
  parsedFilters,
  onRemoveFilter,
  searchTags,
  onAddSearchTag,
  onRemoveSearchTag,
  topSuggestion,
  hideHeader = false,
  secondarySidebar,
  sortSidebar,
  customSidebar,

  secondaryTitle,
  secondaryHeaderContent,
  sortTitle,
  customTitle,
  secondaryActionIcon,
  customActionIcon,
  customSidebarInteractive = false,
  customSidebarSide = "left",
  secondarySidebarContextKey,
  headerActions,
  headerLeftContent,
  leadingButtonIcon,
  leadingButtonContent,
  onLeadingButtonClick,
  leadingButtonTitle,
  showSearch = false,
  showBreadcrumb = true,
  disableContentPadding = false
}: DashboardLayoutProps) => {
  const location = useLocation();
  const {
    filterPanelOpenByContextKey,
    setFilterPanelOpen,
    setActiveCollectionContext,
  } = useCollectionSidebarContext();
  const [localActivePanel, setLocalActivePanel] = useState<"filter" | "sort" | "custom" | null>(null);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const previousSearchRef = React.useRef(location.search);

  useEffect(() => {
    setActiveCollectionContext(secondarySidebarContextKey);
  }, [secondarySidebarContextKey, setActiveCollectionContext]);

  useEffect(() => {
    if (previousSearchRef.current !== location.search) {
      if (secondarySidebarContextKey) {
        setFilterPanelOpen(secondarySidebarContextKey, false);
      }
      setLocalActivePanel(null);
    }
    previousSearchRef.current = location.search;
  }, [location.search, secondarySidebarContextKey, setFilterPanelOpen]);

  // Content margin is now always 48px (Primary Sidebar width) because Secondary Sidebar overlays
  const contentMargin = 48;

  const filterPanelOpen = secondarySidebarContextKey
    ? (filterPanelOpenByContextKey[secondarySidebarContextKey] ?? false)
    : localActivePanel === "filter";
  const showFilterPanel = !!secondarySidebar && filterPanelOpen;
  const showSortPanel = !!sortSidebar && localActivePanel === "sort";
  const showCustomPanel = !!customSidebar && localActivePanel === "custom";
  const isRightCustomPanel = showCustomPanel && customSidebarSide === "right";
  const activePanelContent =
    localActivePanel === "sort"
      ? sortSidebar
      : localActivePanel === "custom"
        ? customSidebar
        : secondarySidebar;
  const showBackdrop =
    !!activePanelContent &&
    (showFilterPanel || showSortPanel || showCustomPanel) &&
    !(showCustomPanel && customSidebarInteractive);
  const activePanelTitle =
    localActivePanel === "sort"
      ? (sortTitle || "Sort")
      : localActivePanel === "custom"
        ? (customTitle || "Panel")
        : (secondaryTitle || "Filters");
  const activeHeaderContent =
    showFilterPanel && secondaryHeaderContent
      ? secondaryHeaderContent
      : null;
  const customSidebarButton = customSidebar ? (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full border border-border bg-sidebar hover:bg-white/10"
      onClick={() => setLocalActivePanel((prev) => prev === "custom" ? null : "custom")}
      title={customTitle || "Open panel"}
    >
      {customActionIcon || <Search className="h-4 w-4 text-white" />}
    </Button>
  ) : null;

  return (
    <div className="flex h-screen w-full bg-sidebar overflow-hidden p-2 gap-2">
      <Sidebar
        className="shrink-0"
        onHoverChange={setSidebarHovered}
        hasSecondary={!!secondarySidebar}
        isSecondaryOpen={showFilterPanel}
        onToggleSecondary={() => {
          if (secondarySidebarContextKey) {
            setFilterPanelOpen(secondarySidebarContextKey, !filterPanelOpen);
            return;
          }
          setLocalActivePanel((prev) => prev === "filter" ? null : "filter");
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-background rounded-2xl border shadow-sm overflow-hidden relative">
        {hideHeader ? (
          <div className="absolute top-3 right-3 z-50">
            <BackendTargetBadge />
          </div>
        ) : null}
        {!hideHeader && (
          <Header
            className="border-b-0 bg-background/50 backdrop-blur-sm"
            title={title}
            onFilterClick={onFilterClick}
            showFilterButton={!!secondarySidebar || showFilterButton}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            searchDropdown={searchDropdown}
            filterSearchDropdown={filterSearchDropdown}
            onFilterSearchSubmit={onFilterSearchSubmit}
            parsedFilters={parsedFilters}
            onRemoveFilter={onRemoveFilter}
            searchTags={searchTags}
            onAddSearchTag={onAddSearchTag}
            onRemoveSearchTag={onRemoveSearchTag}
            topSuggestion={topSuggestion}
            // Show toggle button if we have secondary sidebar but it's hidden
            sidebarCollapsed={!!secondarySidebar && !showFilterPanel}
            onSidebarToggle={() => {
              if (secondarySidebarContextKey) {
                setFilterPanelOpen(secondarySidebarContextKey, !filterPanelOpen);
                return;
              }
              setLocalActivePanel((prev) => prev === "filter" ? null : "filter");
            }}
            actionIcon={secondaryActionIcon}
            showSortButton={!!sortSidebar}
            onSortClick={() => setLocalActivePanel((prev) => prev === "sort" ? null : "sort")}
            showSearch={showSearch}
            showBreadcrumb={showBreadcrumb}
            leadingButtonIcon={leadingButtonIcon}
            leadingButtonContent={leadingButtonContent}
            onLeadingButtonClick={onLeadingButtonClick}
            leadingButtonTitle={leadingButtonTitle}
            leftActions={
              <>
                {customSidebarSide === "left" ? customSidebarButton : null}
                {headerLeftContent}
              </>
            }
          >
            <>
              {headerActions}
              {customSidebarSide === "right" ? customSidebarButton : null}
            </>
          </Header>
        )}

        <main className="flex-1 overflow-y-auto relative z-0">
          <div className={`h-full ${disableContentPadding ? "" : "p-4"}`}>
            {children}
          </div>
        </main>

        {/* Secondary Sidebar - Floating Filter Panel */}
        {activePanelContent && (showFilterPanel || showSortPanel || showCustomPanel) && (
          <>
            {/* Backdrop behind the floating filter panel, scoped to the main page container (not the left menu) */}
            {showBackdrop && (
              <div
                className="absolute inset-0 z-30 bg-background/40 backdrop-blur-[1px]"
                onClick={() => {
                  if (secondarySidebarContextKey) {
                    setFilterPanelOpen(secondarySidebarContextKey, false);
                  }
                  setLocalActivePanel(null);
                }}
              />
            )}

            {/* Floating panel expanding from header filter button (full height column on left) */}
            <aside
              className={[
                "absolute top-2 bottom-1 w-[320px] bg-sidebar border border-border rounded-2xl shadow-2xl flex flex-col z-40 animate-in zoom-in-95 fade-in-0 duration-200",
                isRightCustomPanel
                  ? "right-2 slide-in-from-right-2"
                  : "left-2 slide-in-from-left-2",
              ].join(" ")}
            >
              {/* Secondary Header with search pill (replaces plain 'Filters' text) */}
              <div className="h-11 flex items-center justify-between border-b border-border px-3 gap-2 shrink-0 rounded-t-2xl">
                <div className="flex-1 flex items-center">
                  {activeHeaderContent ? (
                    activeHeaderContent
                  ) : (
                    <div className="flex items-center h-8 w-full rounded-full border border-border/70 bg-black px-2 text-xs text-muted-foreground">
                      <Search className="h-3.5 w-3.5 mr-2 opacity-70" />
                      <span className="truncate">
                        {activePanelTitle || "Search wheels, brands, specs…"}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border border-border/60 bg-black hover:bg-black/80"
                  onClick={() => {
                    if (showFilterPanel && secondarySidebarContextKey) {
                      setFilterPanelOpen(secondarySidebarContextKey, false);
                      return;
                    }
                    setLocalActivePanel(null);
                  }}
                  title="Close filters"
                >
                  {isRightCustomPanel ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Secondary Content */}
              <div className="flex-1 overflow-y-auto p-3 rounded-b-2xl">
                {activePanelContent}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
export { DashboardLayout };
