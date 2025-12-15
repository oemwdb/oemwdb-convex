
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { ParsedFilters } from '@/utils/filterParser';

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
  topSuggestion
}: DashboardLayoutProps) => {
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(true);
  
  const sidebarCollapsed = externalSidebarCollapsed ?? internalSidebarCollapsed;
  
  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsed);
    } else {
      setInternalSidebarCollapsed(newCollapsed);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-background transition-colors duration-200">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
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
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
export { DashboardLayout };
