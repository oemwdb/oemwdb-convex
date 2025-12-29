import React, { useState, useRef, useEffect } from "react";
import { Search, X, Filter, Copy, LogOut, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SearchableBreadcrumb from "@/components/navigation/SearchableBreadcrumb";
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
  onSidebarToggle?: () => void;
}

const Header = ({
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
  topSuggestion = "",
  sidebarCollapsed = true,
  onSidebarToggle
}: HeaderProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hasActiveTags = Object.values(parsedFilters).some(arr => arr && arr.length > 0);
  const totalTagCount = Object.values(parsedFilters).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  const collectionPages = { '/brands': 'brands', '/vehicles': 'vehicles', '/wheels': 'wheels' };
  const isCollectionPage = !!collectionPages[location.pathname as keyof typeof collectionPages];

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const isSpecPattern = (text: string): boolean => {
    const patterns = [
      /^\d+(\.\d+)?\s*(inch|"|in)$/i,
      /^\d+(\.\d+)?J?$/,
      /^\d+x\d+(\.\d+)?$/,
      /^\d+(\.\d+)?\s*mm$/i,
      /^(black|silver|chrome|gunmetal|bronze|gold|white|grey|gray)$/i
    ];
    return patterns.some(pattern => pattern.test(text.trim()));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tempSearchValue.trim()) {
      const input = tempSearchValue.trim();
      if (isCollectionPage) {
        const tags = input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        tags.forEach(tag => {
          if (isSpecPattern(tag)) {
            onFilterSearchSubmit?.(tag);
          } else {
            onAddSearchTag?.(tag);
          }
        });
        setTempSearchValue("");
        setGhostSuggestion("");
      } else {
        onSearchChange?.(tempSearchValue);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempSearchValue(value);

    if (value && value.length >= 2 && topSuggestion) {
      if (topSuggestion.toLowerCase().startsWith(value.toLowerCase())) {
        setGhostSuggestion(topSuggestion);
      } else {
        setGhostSuggestion("");
      }
    } else {
      setGhostSuggestion("");
    }
  };

  return (
    <header className={cn(
      "h-12 flex items-center border-b border-border bg-sidebar px-4 gap-4 flex-shrink-0",
      className
    )}>
      {/* Breadcrumb */}
      <div className="flex-1 min-w-0 overflow-hidden flex items-center">


        <SearchableBreadcrumb />
      </div>

      {/* Search */}
      <div className="flex items-center">
        {isSearchExpanded ? (
          <div className="flex items-center h-8 border border-border rounded-full bg-card hover:border-muted-foreground/30 focus-within:border-muted-foreground/50 transition-colors w-[300px]">
            <Search className="ml-3 text-muted-foreground flex-shrink-0" size={14} />
            <div className="relative flex-1">
              {ghostSuggestion && tempSearchValue && (
                <div className="absolute inset-0 flex items-center px-2 pointer-events-none">
                  <span className="text-sm opacity-0">{tempSearchValue}</span>
                  <span className="text-sm text-muted-foreground/40">
                    {ghostSuggestion.slice(tempSearchValue.length)}
                  </span>
                </div>
              )}
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 px-2"
                value={tempSearchValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onBlur={() => {
                  if (!tempSearchValue && !hasActiveTags) {
                    setTimeout(() => setIsSearchExpanded(false), 150);
                  }
                }}
              />
            </div>
            {/* Tags */}
            {hasActiveTags && (
              <div className="flex items-center gap-1 px-2">
                {Object.entries(parsedFilters).flatMap(([category, values]) =>
                  values?.slice(0, 2).map((value, index) => (
                    <span
                      key={`${category}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-transparent text-foreground text-xs"
                    >
                      {value}
                      <button
                        onClick={() => onRemoveFilter?.(category as keyof ParsedFilters, value)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
                {totalTagCount > 2 && (
                  <span className="text-xs text-muted-foreground">+{totalTagCount - 2}</span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-transparent"
              onClick={() => {
                setTempSearchValue("");
                setIsSearchExpanded(false);
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ) : hasActiveTags ? (
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="flex items-center gap-2 h-8 px-3 border border-border rounded-full bg-card hover:border-muted-foreground/30"
          >
            <Search size={14} className="text-muted-foreground" />
            {Object.entries(parsedFilters).flatMap(([category, values]) =>
              values?.slice(0, 2).map((value, index) => (
                <span
                  key={`${category}-${index}`}
                  className="px-2 py-0.5 rounded-full border border-white/20 bg-transparent text-foreground text-[10px]"
                >
                  {value}
                </span>
              ))
            )}
            {totalTagCount > 2 && (
              <span className="text-[10px] text-muted-foreground">+{totalTagCount - 2}</span>
            )}
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-accent"
            onClick={() => setIsSearchExpanded(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {location.pathname === '/profile' ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : showFilterButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-accent"
            onClick={onSidebarToggle || onFilterClick}
          >
            <Filter className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-accent"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {(searchDropdown || filterSearchDropdown) && (
        <div className="absolute top-12 left-0 right-0 px-4 z-50">
          {filterSearchDropdown || searchDropdown}
        </div>
      )}
    </header>
  );
};

export default Header;
