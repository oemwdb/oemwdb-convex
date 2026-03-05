import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Image } from "lucide-react";
import { cn } from "@/lib/utils";


interface EditableCellProps {
  value: any;
  type: "text" | "image" | "reference" | "array" | "number" | "date" | "badge";
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: any) => void;
  onCancel: () => void;
  columnKey: string;
  tableName: string;
}

export function EditableCell({
  value,
  type,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  columnKey,
  tableName,
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(value);
  const [referenceOptions, setReferenceOptions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Load reference options for reference columns
    if (type === "reference" && columnKey.includes("ref")) {
      loadReferenceOptions();
    }
  }, [type, columnKey]);

  const loadReferenceOptions = async () => {
    // Determine which table to load based on column name
    let targetTable = "";
    let displayField = "name";
    
    if (columnKey.includes("brand")) {
      targetTable = "oem_brands";
    } else if (columnKey.includes("vehicle")) {
      targetTable = "oem_vehicles";
      displayField = "chassis_code";
    } else if (columnKey.includes("wheel")) {
      targetTable = "oem_wheels";
      displayField = "wheel_name";
    } else if (columnKey.includes("bolt_pattern")) {
      targetTable = "oem_bolt_patterns";
      displayField = "bolt_pattern";
    } else if (columnKey.includes("center_bore")) {
      targetTable = "oem_center_bores";
      displayField = "center_bore";
    } else if (columnKey.includes("diameter")) {
      targetTable = "oem_diameters";
      displayField = "diameter";
    } else if (columnKey.includes("width")) {
      targetTable = "oem_widths";
      displayField = "width";
    } else if (columnKey.includes("color")) {
      targetTable = "oem_colors";
      displayField = "color";
    }

    if (targetTable) {
      const { data, error } = await supabase
        .from(targetTable as any)
        .select("*")
        .order(displayField);
      
      if (!error && data) {
        setReferenceOptions(data.map((item: any) => ({
          id: item.id,
          value: item[displayField] || (item as any).name || item.id,
        })));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      onCancel();
    }
  };

  const handleSave = () => {
    if (type === "reference" && editValue && typeof editValue === "string") {
      // Convert string to JSONB reference format
      const selectedOption = referenceOptions.find(opt => opt.value === editValue);
      if (selectedOption) {
        onSave([{ id: selectedOption.id, value: selectedOption.value }]);
      } else {
        onSave(editValue);
      }
    } else {
      onSave(editValue);
    }
  };

  const renderValue = () => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    switch (type) {
      case "image":
        if (value) {
          return (
            <Avatar className="h-8 w-8">
              <AvatarImage src={value} alt="" />
              <AvatarFallback>
                <Image className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          );
        }
        return <span className="text-muted-foreground">No image</span>;

      case "reference":
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((ref, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {ref.value || ref.id}
                </Badge>
              ))}
            </div>
          );
        } else if (typeof value === "object" && value?.value) {
          return (
            <Badge variant="secondary" className="text-xs">
              {value.value}
            </Badge>
          );
        }
        return <span className="text-muted-foreground">—</span>;

      case "badge":
        return (
          <Badge 
            variant={value === "Ready for website" ? "default" : "secondary"}
            className="text-xs"
          >
            {value}
          </Badge>
        );

      case "array":
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          );
        }
        return <span className="text-muted-foreground">—</span>;

      default:
        return <span className="truncate">{value}</span>;
    }
  };

  const renderEditor = () => {
    switch (type) {
      case "reference":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-8 text-xs"
              >
                {editValue
                  ? referenceOptions.find((opt) => opt.value === editValue)?.value
                  : "Select..."}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search..." className="h-8" />
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {referenceOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setEditValue(currentValue === editValue ? "" : currentValue);
                        setOpen(false);
                        handleSave();
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          editValue === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.value}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );

      case "badge":
        return (
          <Select value={editValue} onValueChange={(val) => {
            setEditValue(val);
            onSave(val);
          }}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ready for website">Ready for website</SelectItem>
              <SelectItem value="Needs Good Pic">Needs Good Pic</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            ref={inputRef}
            type={type === "number" ? "number" : "text"}
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="h-8 text-sm"
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "min-h-[32px] flex items-center cursor-pointer",
        isEditing && "ring-2 ring-primary ring-offset-1 rounded"
      )}
      onClick={() => !isEditing && onEdit()}
    >
      {isEditing ? renderEditor() : renderValue()}
    </div>
  );
}