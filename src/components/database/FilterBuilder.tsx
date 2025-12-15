import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TableColumn, Filter, FilterOperator } from '@/types/database';

interface FilterBuilderProps {
  columns: TableColumn[];
  filters: Filter[];
  onAddFilter: (filter: Filter) => void;
  onRemoveFilter: (filterId: string) => void;
  onUpdateFilter: (filterId: string, updates: Partial<Filter>) => void;
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
];

export function FilterBuilder({ columns, filters, onAddFilter, onRemoveFilter, onUpdateFilter }: FilterBuilderProps) {
  return (
    <div className="border-b border-border bg-muted/20 p-4 space-y-2">
      {filters.map((filter, index) => (
        <div key={filter.id} className="flex items-center gap-2">
          {index > 0 && <Badge variant="outline">AND</Badge>}
          <Select
            value={filter.column}
            onValueChange={(value) => onUpdateFilter(filter.id, { column: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(col => (
                <SelectItem key={col.id} value={col.key}>{col.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.operator}
            onValueChange={(value) => onUpdateFilter(filter.id, { operator: value as FilterOperator })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!['is_empty', 'is_not_empty'].includes(filter.operator) && (
            <Input
              value={filter.value || ''}
              onChange={(e) => onUpdateFilter(filter.id, { value: e.target.value })}
              placeholder="Value"
              className="w-40"
            />
          )}
          <Button size="sm" variant="ghost" onClick={() => onRemoveFilter(filter.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAddFilter({
          id: Math.random().toString(),
          column: columns[0]?.key || '',
          operator: 'equals',
          value: ''
        })}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add filter
      </Button>
    </div>
  );
}