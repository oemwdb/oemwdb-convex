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
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TableColumn[];
  onSave: (data: Record<string, any>) => Promise<void>;
}

export function CreateRecordDialog({
  open,
  onOpenChange,
  columns,
  onSave,
}: CreateRecordDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  const editableColumns = columns.filter((col) => col.editable && col.key !== "id");

  const handleValueChange = (fieldKey: string, value: any) => {
    setFormData({ ...formData, [fieldKey]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setFormData({});
      onOpenChange(false);
    } catch (error) {
      console.error("Create record error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (column: TableColumn) => {
    const value = formData[column.key] ?? "";

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
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Record</DialogTitle>
          <DialogDescription>
            Fill in the fields below to create a new record.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {editableColumns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col gap-2"
              >
                <Label className="text-sm font-medium">
                  {column.label}
                  <span className="text-xs text-muted-foreground ml-2">({column.type})</span>
                </Label>
                {renderInput(column)}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setFormData({});
              onOpenChange(false);
            }}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Plus className="h-4 w-4 mr-1" />
            {isSaving ? "Creating..." : "Create Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
