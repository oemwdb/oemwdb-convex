import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { CollectionFilters } from '@/hooks/useCollectionSearch';
import { CollectionConfig } from '@/types/collection';

interface CollectionFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  config: CollectionConfig;
  filters: CollectionFilters;
  filterOptions: Record<string, string[]>;
  onUpdateFilter: (key: string, value: any) => void;
  onClearFilters: () => void;
  sidebarCollapsed?: boolean;
}

export function CollectionFilterDropdown({
  isOpen,
  onClose,
  config,
  filters,
  filterOptions,
  onUpdateFilter,
  onClearFilters,
  sidebarCollapsed = true,
}: CollectionFilterDropdownProps) {
  if (!isOpen) return null;

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== undefined && filters[key] !== '' && filters[key] !== false
  );

  return (
    <div className="pb-2 mt-1">
      <div className="bg-card border border-border rounded-lg shadow-lg">
        <div className="p-2 max-h-[40vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground">Filters</h3>
          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-xs h-6 px-2"
              >
                Clear
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {config.filterableFields.map((field) => (
            <div key={field.key} className="space-y-1">
              {field.type === 'boolean' ? (
                <div className="flex items-center space-x-2 h-7">
                  <Switch
                    id={field.key}
                    checked={filters[field.key] || false}
                    onCheckedChange={(checked) => onUpdateFilter(field.key, checked)}
                    className="h-4 w-8"
                  />
                  <Label htmlFor={field.key} className="text-xs cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ) : (
                <>
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  <Select
                    value={filters[field.key] || ''}
                    onValueChange={(value) => onUpdateFilter(field.key, value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {(filterOptions[field.key] || []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}