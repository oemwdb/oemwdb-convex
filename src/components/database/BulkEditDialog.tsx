import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableColumn } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRecords: any[];
  columns: TableColumn[];
  onSave: (updates: Record<string, any>) => Promise<void>;
}

export function BulkEditDialog({
  open,
  onOpenChange,
  selectedRecords,
  columns,
  onSave,
}: BulkEditDialogProps) {
  const [updates, setUpdates] = useState<Record<string, any>>({});
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const editableColumns = columns.filter((col) => col.editable && col.key !== "id");

  const handleFieldToggle = (fieldKey: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldKey)) {
      newSelected.delete(fieldKey);
      const newUpdates = { ...updates };
      delete newUpdates[fieldKey];
      setUpdates(newUpdates);
    } else {
      newSelected.add(fieldKey);
    }
    setSelectedFields(newSelected);
  };

  const handleValueChange = (fieldKey: string, value: any) => {
    setUpdates({ ...updates, [fieldKey]: value });
  };

  const handleSave = async () => {
    if (Object.keys(updates).length === 0) return;

    setIsSaving(true);
    try {
      await onSave(updates);
      setUpdates({});
      setSelectedFields(new Set());
      onOpenChange(false);
    } catch (error) {
      console.error("Bulk edit error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldPreview = (column: TableColumn) => {
    // Show unique values from selected records
    const values = selectedRecords
      .map((r) => r[column.key])
      .filter((v) => v !== null && v !== undefined);
    const uniqueValues = Array.from(new Set(values));

    if (uniqueValues.length === 0) return <span className="text-muted-foreground text-xs">No values</span>;
    if (uniqueValues.length === 1) return <span className="text-xs font-mono">{String(uniqueValues[0])}</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {uniqueValues.slice(0, 3).map((val, idx) => (
          <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
            {String(val).substring(0, 20)}
          </Badge>
        ))}
        {uniqueValues.length > 3 && (
          <span className="text-xs text-muted-foreground">+{uniqueValues.length - 3} more</span>
        )}
      </div>
    );
  };

  const renderInput = (column: TableColumn) => {
    const value = updates[column.key] ?? "";

    switch (column.type) {
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleValueChange(column.key, parseFloat(e.target.value))}
            placeholder={`Enter ${column.label.toLowerCase()}`}
            className="h-9"
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleValueChange(column.key, e.target.value)}
            className="h-9"
          />
        );
      case "boolean":
        return (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) => handleValueChange(column.key, checked)}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(column.key, e.target.value)}
            placeholder={`Enter ${column.label.toLowerCase()}`}
            className="h-9"
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Edit {selectedRecords.length} Records</DialogTitle>
          <DialogDescription>
            Select the fields you want to update and provide new values. Changes will be applied to all selected records.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {editableColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  checked={selectedFields.has(column.key)}
                  onCheckedChange={() => handleFieldToggle(column.key)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{column.label}</Label>
                    <span className="text-xs text-muted-foreground">{column.type}</span>
                  </div>

                  {!selectedFields.has(column.key) && (
                    <div className="text-sm text-muted-foreground">
                      Current: {getFieldPreview(column)}
                    </div>
                  )}

                  {selectedFields.has(column.key) && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        New value for all {selectedRecords.length} records:
                      </div>
                      {renderInput(column)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setUpdates({});
              setSelectedFields(new Set());
              onOpenChange(false);
            }}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || Object.keys(updates).length === 0}
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : `Update ${selectedRecords.length} Records`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
