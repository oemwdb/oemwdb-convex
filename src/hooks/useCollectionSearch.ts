import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionType, COLLECTION_CONFIGS } from '@/types/collection';

export interface CollectionFilters {
  [key: string]: any;
}

export function useCollectionSearch(collectionType: CollectionType) {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<CollectionFilters>({});
  
  const config = COLLECTION_CONFIGS[collectionType];

  // Fetch filter options for dropdown fields
  const { data: filterOptions } = useQuery({
    queryKey: ['collection-filter-options', collectionType],
    queryFn: async () => {
      const dropdownFields = config.filterableFields.filter(f => f.type === 'dropdown');
      const options: Record<string, string[]> = {};
      
      if (dropdownFields.length === 0) return options;

      // For fields with predefined options, use those instead of fetching from Supabase
      dropdownFields.forEach(field => {
        if (field.options) {
          options[field.key] = field.options;
        }
      });

      // For fields without predefined options, fetch from Supabase
      const fieldsToFetch = dropdownFields.filter(f => !f.options);
      if (fieldsToFetch.length > 0) {
        const { data } = await supabase
          .from(config.tableName as any)
          .select(fieldsToFetch.map(f => `"${f.key}"`).join(', '));

        fieldsToFetch.forEach(field => {
          const values = data?.map(row => row[field.key])
            .filter((value, index, self) => value && self.indexOf(value) === index)
            .sort() || [];
          options[field.key] = values;
        });
      }

      return options;
    },
  });

  // Build search query
  const searchQuery = useMemo(() => {
    if (!searchText.trim()) return '';
    
    const searchableFields = config.searchableFields.map(f => f.key);
    const conditions = searchableFields.map(field => 
      `"${field}".ilike.%${searchText}%`
    );
    
    return conditions.length > 0 ? `or(${conditions.join(',')})` : '';
  }, [searchText, config.searchableFields]);

  // Update search text
  const updateSearchText = (text: string) => {
    setSearchText(text);
  };

  // Update filters
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchText('');
  };

  return {
    searchText,
    updateSearchText,
    filters,
    updateFilter,
    clearFilters,
    searchQuery,
    filterOptions: filterOptions || {},
    config,
  };
}