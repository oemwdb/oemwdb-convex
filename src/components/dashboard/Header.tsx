import React, { useState, useRef, useEffect } from "react";
import { Search, X, Filter, Package, Car, CircleEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SearchableBreadcrumb from "@/components/navigation/SearchableBreadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CollectionType } from '@/components/search/CollectionCarouselSelector';
import type { ParsedFilters } from '@/utils/filterParser';

interface HeaderProps {
  title?: string;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
  searchDropdown?: React.ReactNode;
  filterSearchDropdown?: React.ReactNode;
  onFilterSearchSubmit?: (filterString: string) => void;
  parsedFilters?: ParsedFilters;
  onRemoveFilter?: (category: keyof ParsedFilters, value: string) => void;
  searchTags?: string[];
  onAddSearchTag?: (tag: string) => void;
  onRemoveSearchTag?: (tag: string) => void;
  topSuggestion?: string;
  sidebarCollapsed?: boolean;
}

const Header = ({
  title = "Overview",
  onFilterClick,
  showFilterButton = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = "Search...",
  className,
  searchDropdown,
  filterSearchDropdown,
  onFilterSearchSubmit,
  parsedFilters = {},
  onRemoveFilter,
  searchTags = [],
  onAddSearchTag,
  onRemoveSearchTag,
  topSuggestion = "",
  sidebarCollapsed = true
}: HeaderProps) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>('all');
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { user, signOut, profile, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on a collection page
  const collectionPages = {
    '/brands': 'brands',
    '/vehicles': 'vehicles',
    '/wheels': 'wheels'
  };
  const currentCollection = collectionPages[location.pathname as keyof typeof collectionPages];
  const isCollectionPage = !!currentCollection;

  // Check if there are any active tags/filters
  const hasActiveTags =
    Object.values(parsedFilters).some(arr => arr && arr.length > 0);

  // Count total tags for "+N more" indicator
  const totalTagCount =
    Object.values(parsedFilters).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  // Get dynamic placeholder based on selected collection
  const getSearchPlaceholder = () => {
    if (isCollectionPage) {
      return searchPlaceholder;
    }
    switch (selectedCollection) {
      case 'brands':
        return 'Search brands...';
      case 'vehicles':
        return 'Search vehicles...';
      case 'wheels':
        return 'Search wheels...';
      default:
        return 'Search across all collections...';
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      setIsTextOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [title]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const toggleSearch = () => {
    const newExpandedState = !isSearchExpanded;

    if (newExpandedState) {
      // Always open dropdown when expanding search bar
      onFilterClick?.();
      setIsSearchExpanded(true);
    } else {
      // Always close dropdown when collapsing via X button
      onFilterClick?.();
      setTempSearchValue("");
      setIsSearchExpanded(false);
    }
  };

  // Helper to detect if input is a spec pattern
  const isSpecPattern = (text: string): boolean => {
    const patterns = [
      /^\d+(\.\d+)?\s*(inch|"|in)$/i,  // diameter: "20 inch", "20\"", "20 in"
      /^\d+(\.\d+)?J?$/,                // width: "9.5", "9.5J"
      /^\d+x\d+(\.\d+)?$/,              // bolt pattern: "5x120"
      /^\d+(\.\d+)?\s*mm$/i,            // center bore: "66.6mm"
      /^(black|silver|chrome|gunmetal|bronze|gold|white|grey|gray|red|blue|green|yellow|orange|purple|pink)$/i // colors
    ];
    return patterns.some(pattern => pattern.test(text.trim()));
  };

  const handleSearchSubmit = () => {
    const searchQuery = isCollectionPage ? searchValue : tempSearchValue;
    if (searchQuery) {
      if (isCollectionPage) {
        // Stay on collection page with search
        onSearchChange?.(searchQuery);
      } else {
        // Navigate to home page with search params and selected collection
        const collection = selectedCollection === 'all' ? '' : selectedCollection;
        const params = new URLSearchParams();
        params.set('search', searchQuery);
        if (collection) params.set('collection', collection);
        navigate(`/?${params.toString()}`);
        setIsSearchExpanded(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tempSearchValue.trim()) {
      const input = tempSearchValue.trim();

      // On collection pages (wheels, vehicles), use smart categorization
      if (location.pathname === '/wheels' || location.pathname === '/vehicles') {
        // Split by comma to handle multiple tags at once
        const tags = input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        tags.forEach(tag => {
          if (isSpecPattern(tag)) {
            // It's a spec filter - route to filter handler
            onFilterSearchSubmit?.(tag);
          } else {
            // It's a general search term - add as search tag
            onAddSearchTag?.(tag);
          }
        });

        setTempSearchValue("");
        setGhostSuggestion("");
      } else {
        // On other pages, use traditional search
        onSearchChange?.(tempSearchValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Accept suggestion with Tab or Right Arrow (when cursor is at end)
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghostSuggestion) {
      const input = e.currentTarget;
      const cursorAtEnd = input.selectionStart === tempSearchValue.length;

      if (e.key === 'Tab' || (e.key === 'ArrowRight' && cursorAtEnd)) {
        e.preventDefault();
        setTempSearchValue(ghostSuggestion);
        setGhostSuggestion("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempSearchValue(value);

    // Update ghost suggestion from dropdown or matched tags
    if (value && value.length >= 2) {
      // Priority 1: Use topSuggestion from dropdown if available
      if (topSuggestion && topSuggestion.toLowerCase().startsWith(value.toLowerCase()) && topSuggestion.toLowerCase() !== value.toLowerCase()) {
        setGhostSuggestion(topSuggestion);
      }
      // Priority 2: Search through existing search tags
      else {
        const inputLower = value.toLowerCase();
        const tagMatch = searchTags.find(tag =>
          tag.toLowerCase().startsWith(inputLower) && tag.toLowerCase() !== inputLower
        );
        if (tagMatch) {
          setGhostSuggestion(tagMatch);
        } else {
          setGhostSuggestion("");
        }
      }
    } else {
      setGhostSuggestion("");
    }
  };

  return (
    <header className={cn("fixed top-4 right-0 z-40 pointer-events-none", sidebarCollapsed ? "left-[88px]" : "left-[272px]", className)}>
      <div className="relative">
        <div className="flex items-start pl-0 pr-4 relative pointer-events-auto">
          {/* Breadcrumb navigation */}
          <div className={cn(
            "transition-all duration-300 ease-out whitespace-nowrap overflow-hidden",
            isSearchExpanded
              ? "w-auto flex-shrink-0 mr-3"
              : hasActiveTags
                ? "flex-1 mr-4"
                : "flex-1 mr-4"
          )}>
            <SearchableBreadcrumb />
          </div>

          {/* Unified Search Bar */}
          <div className={cn(
            "flex items-center transition-all duration-300 ease-out search-container",
            isSearchExpanded
              ? "flex-1 mr-2"
              : hasActiveTags
                ? "w-auto ml-auto mr-2"
                : "w-9 ml-auto mr-2"
          )}>
            {isSearchExpanded ? (
              <div className="flex items-center border border-border rounded-md bg-card w-full h-9 hover:border-muted-foreground/50 focus-within:border-muted-foreground transition-colors duration-200">
                <Search className="ml-3 text-muted-foreground flex-shrink-0" size={16} />

                {/* Search input container with ghost text overlay */}
                <div className="relative flex-1 min-w-[100px]">
                  {/* Ghost suggestion overlay */}
                  {ghostSuggestion && tempSearchValue && (
                    <div
                      className="absolute inset-0 flex items-center px-3 pointer-events-none"
                      style={{ zIndex: 0 }}
                    >
                      <span className="text-sm opacity-0 select-none">{tempSearchValue}</span>
                      <span className="text-sm text-muted-foreground/40 select-none">
                        {ghostSuggestion.slice(tempSearchValue.length)}
                      </span>
                    </div>
                  )}

                  {/* Actual input */}
                  <Input
                    ref={searchInputRef}
                    placeholder={
                      searchTags.length === 0 && Object.keys(parsedFilters).length === 0
                        ? getSearchPlaceholder()
                        : "Add more..."
                    }
                    className="h-9 flex-1 min-w-[100px] text-sm border-0 bg-transparent focus:ring-0 focus:outline-none px-3 relative z-10"
                    value={tempSearchValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onKeyPress={handleKeyPress}
                    onBlur={(e) => {
                      const relatedTarget = e.relatedTarget as HTMLElement;
                      const isClickingDropdown = relatedTarget?.closest('[data-filter-dropdown]');
                      const isClickingBreadcrumb = relatedTarget?.closest('[data-breadcrumb-popover]') || relatedTarget?.closest('[data-breadcrumb-popover-trigger]');
                      const isClickingSearchContainer = relatedTarget?.closest('.search-container');
                      const isClickingFilterButton = relatedTarget?.closest('[data-filter-button]');

                      // Only auto-collapse if:
                      // 1. Input is empty
                      // 2. No active filter tags exist
                      // 3. Not clicking on any related UI elements
                      if (!tempSearchValue &&
                        !hasActiveTags &&
                        !isClickingBreadcrumb &&
                        !isClickingSearchContainer &&
                        !isClickingFilterButton &&
                        !isClickingDropdown) {
                        setTimeout(() => setIsSearchExpanded(false), 200);
                      }
                    }}
                    data-search-input
                  />
                </div>

                {/* Filter tags display */}
                <div className="flex items-center gap-1 px-2 py-2 flex-wrap min-w-0 max-w-[500px]">
                  {/* Filter tags (spec-based) */}
                  {Object.entries(parsedFilters).map(([category, values]) =>
                    values?.map((value, index) => (
                      <span
                        key={`${category}-${index}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-medium whitespace-nowrap"
                      >
                        {value}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFilter?.(category as keyof ParsedFilters, value);
                          }}
                          className="hover:text-primary/70 transition-colors"
                          aria-label={`Remove ${value} filter`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0 hover:bg-transparent"
                  onClick={toggleSearch}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </div>
            ) : hasActiveTags ? (
              // COMPRESSED STATE WITH TAGS
              <button
                onClick={() => {
                  // Expand search bar and ensure dropdown is open
                  setIsSearchExpanded(true);
                  onFilterClick?.();
                }}
                className="flex items-center gap-1 px-2 h-9 border border-border rounded-md bg-card hover:border-muted-foreground/50 transition-colors duration-200 cursor-pointer"
                data-filter-button
              >
                <Search className="text-muted-foreground flex-shrink-0" size={14} />

                {/* Show compressed filter tags */}
                <div className="flex items-center gap-1 max-w-[400px] overflow-hidden">
                  {/* Filter tags */}
                  {Object.entries(parsedFilters).flatMap(([category, values]) =>
                    values?.slice(0, 3).map((value, index) => (
                      <span
                        key={`${category}-${index}`}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium whitespace-nowrap"
                      >
                        {value}
                      </span>
                    ))
                  )}

                  {/* Show +N more if there are additional tags */}
                  {totalTagCount > 3 && (
                    <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                      +{totalTagCount - 3}
                    </span>
                  )}
                </div>
              </button>
            ) : (
              // COLLAPSED STATE WITHOUT TAGS
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-card hover:border hover:border-border rounded-lg"
                onClick={toggleSearch}
                data-filter-button
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Right buttons section - Context actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showFilterButton ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-card hover:border hover:border-border rounded-lg"
                onClick={onFilterClick}
              >
                <Filter className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-card hover:border hover:border-border rounded-lg"
                onClick={() => {
                  // TODO: Implement copy YAML functionality
                  console.log('Copy YAML clicked');
                }}
              >
                <CircleEllipsis className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Unified dropdown - positioned below search bar */}
        {(searchDropdown || filterSearchDropdown) && (
          <div className="relative" data-filter-dropdown>
            {filterSearchDropdown || searchDropdown}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
