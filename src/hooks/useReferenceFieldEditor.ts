import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReferenceFieldConfig } from '@/types/database';
import { toast } from 'sonner';

export function useReferenceFieldEditor(config: ReferenceFieldConfig) {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, [config.table, config.valueColumn]);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(config.table as any)
        .select(config.valueColumn)
        .order(config.valueColumn, { ascending: true });

      if (error) throw error;

      const uniqueValues = Array.from(
        new Set(data.map((row: any) => row[config.valueColumn]).filter(Boolean))
      ) as string[];
      
      setOptions(uniqueValues);
    } catch (error) {
      console.error('Error fetching reference options:', error);
      toast.error('Failed to load options');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewOption = async (value: string): Promise<boolean> => {
    try {
      // Check if value already exists
      if (options.includes(value)) {
        toast.error('This value already exists');
        return false;
      }

      const { error } = await supabase
        .from(config.table as any)
        .insert({ [config.valueColumn]: value });

      if (error) throw error;

      // Add to local options immediately
      setOptions(prev => [...prev, value].sort());
      toast.success('New option created');
      return true;
    } catch (error) {
      console.error('Error creating new option:', error);
      toast.error('Failed to create new option');
      return false;
    }
  };

  const updateRecordField = async (
    mainTable: string,
    recordId: string,
    fieldName: string,
    newValues: string[]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(mainTable as any)
        .update({ [fieldName]: newValues })
        .eq('id', recordId);

      if (error) throw error;

      toast.success('References updated');
      return true;
    } catch (error) {
      console.error('Error updating reference field:', error);
      toast.error('Failed to update references');
      return false;
    }
  };

  return {
    options,
    isLoading,
    createNewOption,
    updateRecordField,
    refetch: fetchOptions
  };
}
