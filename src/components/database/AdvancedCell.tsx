import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Check, X, ExternalLink, Star, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableColumn, CellType } from '@/types/database';

interface AdvancedCellProps {
  value: any;
  column: TableColumn;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: any) => void;
  onCancel: () => void;
  rowData?: any;
}

export function AdvancedCell({
  value,
  column,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  rowData
}: AdvancedCellProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (column.validation) {
      const { type, pattern, min, max, validator, message } = column.validation;
      let isValid = true;

      switch (type) {
        case 'regex':
          if (pattern) {
            isValid = new RegExp(pattern).test(editValue);
          }
          break;
        case 'range':
          if (min !== undefined && editValue < min) isValid = false;
          if (max !== undefined && editValue > max) isValid = false;
          break;
        case 'length':
          if (min !== undefined && editValue.length < min) isValid = false;
          if (max !== undefined && editValue.length > max) isValid = false;
          break;
        case 'custom':
          if (validator) {
            isValid = validator(editValue);
          }
          break;
      }

      if (!isValid) {
        // Show validation error
        console.error(message || 'Validation failed');
        return;
      }
    }

    onSave(editValue);
  };

  const renderEditor = () => {
    switch (column.type) {
      case 'text':
        return (
          <Input
            ref={inputRef as any}
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="h-8"
          />
        );

      case 'richtext':
        return (
          <Textarea
            ref={inputRef as any}
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="min-h-[100px]"
          />
        );

      case 'number':
        return (
          <Input
            ref={inputRef as any}
            type="number"
            value={editValue || ''}
            onChange={(e) => setEditValue(parseFloat(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="h-8"
          />
        );

      case 'select':
        return (
          <Select value={editValue} onValueChange={(val) => {
            setEditValue(val);
            onSave(val);
          }}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="flex flex-wrap gap-1">
            {column.options?.map(option => (
              <Badge
                key={option.value}
                variant={editValue?.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newValue = editValue?.includes(option.value)
                    ? editValue.filter((v: string) => v !== option.value)
                    : [...(editValue || []), option.value];
                  setEditValue(newValue);
                }}
              >
                {option.label}
              </Badge>
            ))}
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        );

      case 'date':
      case 'datetime':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {editValue ? format(new Date(editValue), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={editValue ? new Date(editValue) : undefined}
                onSelect={(date) => {
                  setEditValue(date?.toISOString());
                  onSave(date?.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'checkbox':
        return (
          <Checkbox
            checked={editValue}
            onCheckedChange={(checked) => {
              setEditValue(checked);
              onSave(checked);
            }}
          />
        );

      case 'url':
      case 'email':
      case 'phone':
        return (
          <Input
            ref={inputRef as any}
            type={column.type === 'email' ? 'email' : column.type === 'url' ? 'url' : 'tel'}
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="h-8"
          />
        );

      case 'progress':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={editValue || 0}
              onChange={(e) => setEditValue(parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
                if (e.key === 'Escape') {
                  onCancel();
                }
              }}
              className="h-8 w-20"
            />
            <span>%</span>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 cursor-pointer",
                  i <= (editValue || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
                onClick={() => {
                  setEditValue(i);
                  onSave(i);
                }}
              />
            ))}
          </div>
        );

      case 'tags':
        return (
          <div className="text-xs text-muted-foreground p-2">
            Tags are read-only. Value: {JSON.stringify(editValue)}
          </div>
        );

      default:
        return (
          <Input
            ref={inputRef as any}
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="h-8"
          />
        );
    }
  };

  const renderValue = () => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    switch (column.type) {
      case 'image':
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={value} />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
        );

      case 'url':
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link2 className="h-3 w-3" />
            {new URL(value).hostname}
          </a>
        );

      case 'email':
        return (
          <a
            href={`mailto:${value}`}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        );

      case 'checkbox':
        return <Checkbox checked={value} disabled />;

      case 'select':
        const option = column.options?.find(opt => opt.value === value);
        return option ? (
          <Badge style={{ backgroundColor: option.color }}>
            {option.label}
          </Badge>
        ) : (
          value
        );

      case 'multiselect':
        return (
          <div className="flex flex-wrap gap-1">
            {(value || []).map((v: string) => {
              const option = column.options?.find(opt => opt.value === v);
              return (
                <Badge
                  key={v}
                  variant="secondary"
                  style={{ backgroundColor: option?.color }}
                >
                  {option?.label || v}
                </Badge>
              );
            })}
          </div>
        );

      case 'date':
        return format(new Date(value), 'PP');

      case 'datetime':
        return format(new Date(value), 'PPp');

      case 'progress':
        return (
          <div className="flex items-center gap-2">
            <Progress value={value} className="flex-1" />
            <span className="text-sm text-muted-foreground">{value}%</span>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
              />
            ))}
          </div>
        );

      case 'number':
        return <span className="font-mono">{value.toLocaleString()}</span>;

      case 'json':
        return (
          <pre className="text-xs bg-muted p-1 rounded max-w-xs overflow-auto">
            {JSON.stringify(value, null, 2)}
          </pre>
        );

      case 'tags':
        const tagArray = Array.isArray(value) ? value : [];
        if (tagArray.length === 0) {
          return <span className="text-muted-foreground text-xs">No tags</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {tagArray.map((tag: string, idx: number) => (
              <Badge
                key={`${tag}-${idx}`}
                variant="secondary"
                className="text-xs px-1.5 py-0 h-5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        );

      default:
        return <span>{String(value)}</span>;
    }
  };

  if (isEditing) {
    return <div className="min-w-[100px]">{renderEditor()}</div>;
  }

  return (
    <div
      className={cn(
        "cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1",
        column.editable !== false && "hover:ring-1 hover:ring-primary/20"
      )}
      onClick={() => column.editable !== false && onEdit()}
    >
      {renderValue()}
    </div>
  );
}