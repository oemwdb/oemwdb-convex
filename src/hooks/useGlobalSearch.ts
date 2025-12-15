import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectionType } from '@/components/search/CollectionCarouselSelector';

export function useGlobalSearch() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const collection = (searchParams.get('collection') || 'all') as CollectionType;

  // Search brands
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['global-search-brands', searchQuery, collection],
    queryFn: async () => {
      if (!searchQuery || (collection !== 'all' && collection !== 'brands')) {
        return [];
      }

      const { data, error } = await supabase
        .from('oem_brands')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,brand_description.ilike.%${searchQuery}%,subsidiaries.ilike.%${searchQuery}%`)
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchQuery,
  });

  // Search vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['global-search-vehicles', searchQuery, collection],
    queryFn: async () => {
      if (!searchQuery || (collection !== 'all' && collection !== 'vehicles')) {
        return [];
      }

      const { data, error } = await supabase
        .from('oem_vehicles')
        .select('*')
        .or(`vehicle_title.ilike.%${searchQuery}%,model_name.ilike.%${searchQuery}%,chassis_code.ilike.%${searchQuery}%`)
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchQuery,
  });

  // Search wheels
  const { data: wheels, isLoading: wheelsLoading } = useQuery({
    queryKey: ['global-search-wheels', searchQuery, collection],
    queryFn: async () => {
      if (!searchQuery || (collection !== 'all' && collection !== 'wheels')) {
        return [];
      }

      const { data, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .or(`wheel_name.ilike.%${searchQuery}%,wheel_code.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%`)
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchQuery,
  });

  const isLoading = brandsLoading || vehiclesLoading || wheelsLoading;

  return {
    searchQuery,
    collection,
    brands: brands || [],
    vehicles: vehicles || [],
    wheels: wheels || [],
    isLoading,
    hasSearch: !!searchQuery,
  };
}