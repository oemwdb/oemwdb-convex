import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RecordEditor } from '@/components/database/RecordEditor';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { TableColumn } from '@/types/database';
import { useColumnOrder } from '@/hooks/useColumnOrder';

// Import table configs from useSupabaseTable
const TABLE_CONFIGS: Record<string, TableColumn[]> = {
  oem_brands: [
    { id: 'id', key: 'id', label: 'ID', type: 'text' },
    { id: 'brand_title', key: 'brand_title', label: 'Brand Title', type: 'text' },
    { id: 'brand_description', key: 'brand_description', label: 'Description', type: 'text' },
    { id: 'brand_image_url', key: 'brand_image_url', label: 'Image URL', type: 'text' },
    { id: 'brand_page', key: 'brand_page', label: 'Brand Page', type: 'text' },
    { id: 'subsidiaries', key: 'subsidiaries', label: 'Subsidiaries', type: 'text' },
    { id: 'wheel_count', key: 'wheel_count', label: 'Wheel Count', type: 'text' },
    { id: 'created_at', key: 'created_at', label: 'Created', type: 'date' },
    { id: 'updated_at', key: 'updated_at', label: 'Updated', type: 'date' },
  ],
  oem_vehicles: [
    { id: 'id', key: 'id', label: 'ID', type: 'text' },
    { id: 'vehicle_title', key: 'vehicle_title', label: 'Vehicle Title', type: 'text' },
    { id: 'vehicle_id_only', key: 'vehicle_id_only', label: 'Vehicle ID Only', type: 'text' },
    { id: 'model_name', key: 'model_name', label: 'Model Name', type: 'text' },
    { id: 'production_years', key: 'production_years', label: 'Production Years', type: 'text' },
    { id: 'production_stats', key: 'production_stats', label: 'Production Stats', type: 'text' },
    { id: 'vehicle_image', key: 'vehicle_image', label: 'Vehicle Image', type: 'text' },
    { id: 'brand_ref', key: 'brand_ref', label: 'Brands', type: 'tags' },
    { id: 'wheel_ref', key: 'wheel_ref', label: 'Wheels', type: 'tags' },
    { id: 'color_ref', key: 'color_ref', label: 'Colors', type: 'tags' },
    { id: 'diameter_ref', key: 'diameter_ref', label: 'Diameters', type: 'tags' },
    { id: 'width_ref', key: 'width_ref', label: 'Widths', type: 'tags' },
    { id: 'bolt_pattern_ref', key: 'bolt_pattern_ref', label: 'Bolt Patterns', type: 'tags' },
    { id: 'center_bore_ref', key: 'center_bore_ref', label: 'Center Bores', type: 'tags' },
    { id: 'created_at', key: 'created_at', label: 'Created', type: 'date' },
    { id: 'updated_at', key: 'updated_at', label: 'Updated', type: 'date' },
  ],
  oem_wheels: [
    { id: 'id', key: 'id', label: 'ID', type: 'text' },
    { id: 'wheel_title', key: 'wheel_title', label: 'Wheel Title', type: 'text' },
    { id: 'part_numbers', key: 'part_numbers', label: 'Part Numbers', type: 'text' },
    { id: 'metal_type', key: 'metal_type', label: 'Metal Type', type: 'text' },
    { id: 'color', key: 'color', label: 'Color', type: 'text' },
    { id: 'weight', key: 'weight', label: 'Weight', type: 'text' },
    { id: 'wheel_offset', key: 'wheel_offset', label: 'Offset', type: 'text' },
    { id: 'good_pic_url', key: 'good_pic_url', label: 'Image URL', type: 'text' },
    { id: 'image_source', key: 'image_source', label: 'Image Source', type: 'text' },
    { id: 'notes', key: 'notes', label: 'Notes', type: 'text' },
    { id: 'brand_ref', key: 'brand_ref', label: 'Brands', type: 'tags' },
    { id: 'vehicle_ref', key: 'vehicle_ref', label: 'Vehicles', type: 'tags' },
    { id: 'diameter_ref', key: 'diameter_ref', label: 'Diameters', type: 'tags' },
    { id: 'width_ref', key: 'width_ref', label: 'Widths', type: 'tags' },
    { id: 'bolt_pattern_ref', key: 'bolt_pattern_ref', label: 'Bolt Patterns', type: 'tags' },
    { id: 'center_bore_ref', key: 'center_bore_ref', label: 'Center Bores', type: 'tags' },
    { id: 'color_ref', key: 'color_ref', label: 'Colors', type: 'tags' },
    { id: 'tire_size_ref', key: 'tire_size_ref', label: 'Tire Sizes', type: 'tags' },
    { id: 'design_style_ref', key: 'design_style_ref', label: 'Design Styles', type: 'tags' },
    { id: 'created_at', key: 'created_at', label: 'Created', type: 'date' },
    { id: 'updated_at', key: 'updated_at', label: 'Updated', type: 'date' },
  ],
};

export default function DatabaseRecordPage() {
  const { tableName, recordId } = useParams<{ tableName: string; recordId: string }>();
  const navigate = useNavigate();

  const defaultColumns = tableName ? TABLE_CONFIGS[tableName] || [] : [];
  const { orderedColumns, reorderColumns } = useColumnOrder(tableName || '', defaultColumns);

  const { data: record, isLoading, refetch } = useQuery({
    queryKey: ['database-record', tableName, recordId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!tableName && !!recordId,
  });

  const handleSave = async (updates: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .update(updates)
        .eq('id', recordId);

      if (error) throw error;

      await refetch();
      toast.success('Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast.success('Record deleted successfully');
      navigate('/dev/database');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  return (
    <DashboardLayout disableContentPadding={true}>
      <div className="h-full p-2 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dev/database')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Database
          </Button>
          <div className="text-sm text-muted-foreground">
            {tableName} / {recordId}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : record ? (
          <RecordEditor
            record={record}
            columns={orderedColumns}
            tableName={tableName!}
            onSave={handleSave}
            onDelete={handleDelete}
            onColumnReorder={reorderColumns}
          />
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Record not found
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
