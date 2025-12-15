import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TableColumn } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

// Rehydrate columns from stored keys
const rehydrateColumns = (storedKeys: string[], defaultColumns: TableColumn[]): TableColumn[] => {
  const columnMap = new Map(defaultColumns.map(col => [col.key, col]));
  
  // Build ordered list from stored keys
  const ordered = storedKeys
    .map(key => columnMap.get(key))
    .filter(Boolean) as TableColumn[];
  
  // Add any new columns (from schema changes) to the end
  const orderedKeys = new Set(ordered.map(col => col.key));
  const newColumns = defaultColumns.filter(col => !orderedKeys.has(col.key));
  
  return [...ordered, ...newColumns];
};

export function useColumnOrder(tableName: string, defaultColumns: TableColumn[]) {
  const { user } = useAuth();
  const [orderedColumns, setOrderedColumns] = useState<TableColumn[]>(defaultColumns);
  const [isLoading, setIsLoading] = useState(true);

  // Load column order on mount
  useEffect(() => {
    const loadColumnOrder = async () => {
      try {
        // Try to load from Supabase if user is authenticated
        if (user) {
          const { data, error } = await supabase
            .from('user_table_preferences')
            .select('column_order')
            .eq('user_id', user.id)
            .eq('table_name', tableName)
            .single();

          if (!error && data?.column_order) {
            const storedKeys = data.column_order as string[];
            setOrderedColumns(rehydrateColumns(storedKeys, defaultColumns));
            
            // Sync to localStorage as backup
            localStorage.setItem(
              `table_column_order_${tableName}`,
              JSON.stringify(storedKeys)
            );
            setIsLoading(false);
            return;
          }
        }

        // Fall back to localStorage
        const localStorageKey = `table_column_order_${tableName}`;
        const stored = localStorage.getItem(localStorageKey);
        
        if (stored) {
          const storedKeys = JSON.parse(stored) as string[];
          setOrderedColumns(rehydrateColumns(storedKeys, defaultColumns));
        } else {
          setOrderedColumns(defaultColumns);
        }
      } catch (error) {
        console.error('Error loading column order:', error);
        setOrderedColumns(defaultColumns);
      } finally {
        setIsLoading(false);
      }
    };

    loadColumnOrder();
  }, [tableName, user, defaultColumns]);

  // Reorder columns
  const reorderColumns = useCallback(async (oldIndex: number, newIndex: number) => {
    const newOrder = [...orderedColumns];
    const [removed] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, removed);
    
    setOrderedColumns(newOrder);
    
    const columnKeys = newOrder.map(col => col.key);

    // Always save to localStorage for instant access
    localStorage.setItem(
      `table_column_order_${tableName}`,
      JSON.stringify(columnKeys)
    );

    // Sync to Supabase if user is authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('user_table_preferences')
          .upsert(
            {
              user_id: user.id,
              table_name: tableName,
              column_order: columnKeys,
            },
            {
              onConflict: 'user_id,table_name',
            }
          );

        if (error) {
          console.error('Error syncing column order to Supabase:', error);
        }
      } catch (error) {
        console.error('Error syncing column order:', error);
      }
    }
  }, [orderedColumns, tableName, user]);

  // Reset to default order
  const resetToDefault = useCallback(async () => {
    setOrderedColumns(defaultColumns);
    
    // Clear localStorage
    localStorage.removeItem(`table_column_order_${tableName}`);

    // Clear Supabase if user is authenticated
    if (user) {
      try {
        await supabase
          .from('user_table_preferences')
          .delete()
          .eq('user_id', user.id)
          .eq('table_name', tableName);
      } catch (error) {
        console.error('Error resetting column order:', error);
      }
    }
  }, [defaultColumns, tableName, user]);

  return {
    orderedColumns,
    reorderColumns,
    resetToDefault,
    isLoading,
  };
}