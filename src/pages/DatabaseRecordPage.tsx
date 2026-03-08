import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

import { RecordEditor } from '@/components/database/RecordEditor';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useColumnOrder } from '@/hooks/useColumnOrder';
import { TABLE_CONFIGS } from '@/config/tableConfigs';

export default function DatabaseRecordPage() {
  const { tableName, recordId } = useParams<{ tableName: string; recordId: string }>();
  const navigate = useNavigate();

  const defaultColumns = tableName ? TABLE_CONFIGS[tableName] || [] : [];
  const { orderedColumns, reorderColumns } = useColumnOrder(tableName || '', defaultColumns);

  const record = useQuery(
    api.queries.databaseRecordGet,
    tableName && recordId ? { tableName, recordId } : "skip"
  );

  const brandsUpdate = useMutation(api.mutations.brandsUpdate);
  const vehiclesUpdate = useMutation(api.mutations.vehiclesUpdate);
  const wheelsUpdate = useMutation(api.mutations.wheelsUpdate);
  const brandsDelete = useMutation(api.mutations.brandsDelete);
  const vehiclesDelete = useMutation(api.mutations.vehiclesDelete);
  const wheelsDelete = useMutation(api.mutations.wheelsDelete);

  const isLoading = record === undefined;

  const handleSave = async (updates: Record<string, unknown>) => {
    if (!record || !recordId || !tableName) return;
    try {
      const doc = record as { _id: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> };
      const id = doc._id;
      const payload = { id, ...updates } as Record<string, unknown>;
      if (tableName === "oem_brands") {
        await brandsUpdate(payload as Parameters<typeof brandsUpdate>[0]);
      } else if (tableName === "oem_vehicles") {
        await vehiclesUpdate(payload as Parameters<typeof vehiclesUpdate>[0]);
      } else if (tableName === "oem_wheels") {
        await wheelsUpdate(payload as Parameters<typeof wheelsUpdate>[0]);
      } else {
        toast.info("Updates not supported for this table.");
        return;
      }
      toast.success("Record updated");
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    if (!record || !recordId || !tableName) return;

    try {
      const doc = record as { _id: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> };
      const id = doc._id;
      if (tableName === "oem_brands") {
        await brandsDelete({ id: id as Id<"oem_brands"> });
      } else if (tableName === "oem_vehicles") {
        await vehiclesDelete({ id: id as Id<"oem_vehicles"> });
      } else if (tableName === "oem_wheels") {
        await wheelsDelete({ id: id as Id<"oem_wheels"> });
      } else {
        toast.info("Delete not supported for this table.");
        return;
      }
      toast.success("Record deleted");
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
