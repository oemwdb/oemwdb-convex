import React, { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, CircleDot, Circle as CircleIcon, Calendar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParsedVehicleFilters } from "@/utils/vehicleFilterParser";
import { cn } from "@/lib/utils";

interface TagSuggestion {
  tag: string;
  category: string;
  categoryLabel: string;
  icon: React.ElementType;
  matchScore: number;
  count: number;
  searchParam: string;
}

interface VehicleTagSuggestionDropdownProps {
  allVehicles: SupabaseVehicle[];
  onTagClick: (tag: string, category: string) => void;
  isOpen: boolean;
  selectedTags: ParsedVehicleFilters;
  onTopSuggestionChange?: (suggestion: string) => void;
}

const calculateMatchScore = (tag: string, query: string): number => {
  const tagLower = tag.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (tagLower === queryLower) return 1000; // Exact match
  if (tagLower.startsWith(queryLower)) return 500; // Starts with
  if (tagLower.includes(queryLower)) return 100; // Contains
  
  // Character-by-character fuzzy match
  let score = 0;
  let queryIndex = 0;
  for (let i = 0; i < tagLower.length && queryIndex < queryLower.length; i++) {
    if (tagLower[i] === queryLower[queryIndex]) {
      score += 10;
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length ? score : 0;
};

const CATEGORY_CONFIG = [
  { key: 'brand', label: 'Brand', icon: Package, searchParam: 'brand' },
  { key: 'boltPattern', label: 'Bolt Pattern', icon: CircleDot, searchParam: 'boltPattern' },
  { key: 'centerBore', label: 'Center Bore', icon: CircleIcon, searchParam: 'centerBore' },
  { key: 'productionYears', label: 'Production Years', icon: Calendar, searchParam: 'productionYears' },
];

// Helper to safely extract values from JSONB fields (can be array or scalar string)
const extractJsonbValues = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field.filter(Boolean);
  if (typeof field === 'string') return [field];
  if (typeof field === 'object') return Object.values(field).filter(Boolean) as string[];
  return [];
};

export const VehicleTagSuggestionDropdown: React.FC<VehicleTagSuggestionDropdownProps> = ({
  allVehicles,
  onTagClick,
  isOpen,
  selectedTags,
  onTopSuggestionChange,
}) => {
  const suggestions = useMemo(() => {
    const tagMap = new Map<string, { category: string; count: number }>();

    // Extract all tags from all vehicles
    allVehicles.forEach(vehicle => {
      // Brand (extract from brand_name or brand_ref JSONB)
      if (vehicle.brand_name) {
        const key = `brand:${vehicle.brand_name}`;
        tagMap.set(key, { 
          category: 'brand', 
          count: (tagMap.get(key)?.count || 0) + 1 
        });
      }

      // Bolt Pattern (extract from JSONB)
      const boltPatternValues = extractJsonbValues(vehicle.bolt_pattern);
      boltPatternValues.forEach(tag => {
        if (tag) {
          const key = `boltPattern:${tag}`;
          tagMap.set(key, { 
            category: 'boltPattern', 
            count: (tagMap.get(key)?.count || 0) + 1 
          });
        }
      });

      // Center Bore (extract from JSONB)
      const centerBoreValues = extractJsonbValues(vehicle.center_bore);
      centerBoreValues.forEach(tag => {
        if (tag) {
          const key = `centerBore:${tag}`;
          tagMap.set(key, { 
            category: 'centerBore', 
            count: (tagMap.get(key)?.count || 0) + 1 
          });
        }
      });

      // Production Years
      if (vehicle.production_years) {
        const key = `productionYears:${vehicle.production_years}`;
        tagMap.set(key, { 
          category: 'productionYears', 
          count: (tagMap.get(key)?.count || 0) + 1 
        });
      }
    });

    // Convert to array of suggestions
    const allTags: TagSuggestion[] = [];
    tagMap.forEach((data, key) => {
      const [category, tag] = key.split(':');
      const config = CATEGORY_CONFIG.find(c => c.key === category);
      if (config) {
        allTags.push({
          tag,
          category,
          categoryLabel: config.label,
          icon: config.icon,
          matchScore: data.count, // Use count as score
          count: data.count,
          searchParam: config.searchParam,
        });
      }
    });

    // Group by category and take top items from each
    const byCategory = allTags.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {} as Record<string, TagSuggestion[]>);

    const topPerCategory: TagSuggestion[] = [];
    Object.values(byCategory).forEach(categoryTags => {
      topPerCategory.push(...categoryTags.sort((a, b) => b.count - a.count).slice(0, 10));
    });

    return topPerCategory;
  }, [allVehicles]);

  // Expose top suggestion to parent component
  useEffect(() => {
    if (suggestions.length > 0 && onTopSuggestionChange) {
      onTopSuggestionChange(suggestions[0].tag);
    } else if (onTopSuggestionChange) {
      onTopSuggestionChange("");
    }
  }, [suggestions, onTopSuggestionChange]);

  if (!isOpen || suggestions.length === 0) return null;

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, TagSuggestion[]>);

  return (
    <div className="mx-2 mb-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 z-50">
      <div className="flex flex-row gap-3 p-3 overflow-x-auto">
        {CATEGORY_CONFIG.map(config => {
          const categoryTags = groupedSuggestions[config.key];
          if (!categoryTags || categoryTags.length === 0) return null;

          const Icon = config.icon;
          const selectedCount = selectedTags[config.key as keyof ParsedVehicleFilters]?.length || 0;

          return (
            <div key={config.key} className="flex-shrink-0 w-[150px] relative">
              {/* Category Header */}
              <div className="w-full flex items-center gap-1.5 px-2 py-1 mb-2 border-b border-border">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {config.label}
                </span>
                {selectedCount > 0 && (
                  <Badge variant="default" className="text-[10px] h-3.5 px-1 ml-auto">
                    {selectedCount}
                  </Badge>
                )}
              </div>
              
              {/* Scrollable Tags */}
              <ScrollArea className="h-[120px]">
                <div className="space-y-0.5 pr-2">
                  {categoryTags.map((suggestion) => {
                    const isSelected = selectedTags[config.key as keyof ParsedVehicleFilters]?.includes(suggestion.tag);
                    
                    return (
                      <Link
                        key={`${suggestion.category}:${suggestion.tag}`}
                        to={`/vehicles?${suggestion.searchParam}=${encodeURIComponent(suggestion.tag)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onTagClick(suggestion.tag, suggestion.category);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer group",
                          isSelected ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent'
                        )}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isSelected && (
                            <Check className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                          <span className={cn(
                            "text-xs font-medium transition-colors truncate",
                            isSelected ? 'text-primary' : 'group-hover:text-primary'
                          )}>
                            {suggestion.tag}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-1 flex-shrink-0">
                          {suggestion.count}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};
