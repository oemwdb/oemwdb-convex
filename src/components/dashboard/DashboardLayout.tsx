import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { ParsedFilters } from '@/utils/filterParser';
import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";

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
  secondaryTitle?: string;
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
  secondaryTitle
}: DashboardLayoutProps) => {
  const [showSecondary, setShowSecondary] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Content margin is now always 48px (Primary Sidebar width) because Secondary Sidebar overlays
  const contentMargin = 48;

  return (
    <div className="h-[100dvh] bg-sidebar transition-colors duration-200">
      <Sidebar className="z-50" onHoverChange={setSidebarHovered} />

      <div
        className="h-full flex flex-col overflow-hidden transition-all duration-200 relative"
        style={{ marginLeft: contentMargin }}
      >
        {!hideHeader && (
          <Header
            className={`transition-[padding] duration-200 ease-out ${sidebarHovered ? 'pl-[168px]' : ''}`}
            title={title}
            onFilterClick={onFilterClick}
            showFilterButton={showFilterButton}
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
            sidebarCollapsed={!!secondarySidebar && !showSecondary}
            onSidebarToggle={() => setShowSecondary(!showSecondary)}
          />
        )}

        {/* Secondary Sidebar - Overlay */}
        {secondarySidebar && showSecondary && (
          <aside className="absolute left-0 top-12 bottom-0 w-[240px] bg-sidebar border-r border-border flex flex-col z-40">
            {/* Secondary Header */}
            <div className="h-10 flex items-center justify-between border-b border-border px-3 shrink-0">
              <span className="text-sm font-medium">{secondaryTitle || 'Menu'}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowSecondary(false)}
                title="Collapse Menu"
              >
                <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            {/* Secondary Content */}
            <div className="flex-1 overflow-y-auto">
              {secondarySidebar}
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto p-4 relative z-0">
          <div className="h-full max-w-[1920px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
export { DashboardLayout };
