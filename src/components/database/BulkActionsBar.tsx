import React from 'react';
import { Trash2, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
  onBulkEdit?: () => void;
}

export function BulkActionsBar({ selectedCount, onDelete, onClearSelection, onBulkEdit }: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-border">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex items-center gap-2">
        {onBulkEdit && (
          <Button size="sm" variant="default" onClick={onBulkEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Bulk Edit
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}