import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Plus, X } from 'lucide-react';
import { useReferenceFieldEditor } from '@/hooks/useReferenceFieldEditor';
import { ReferenceFieldConfig } from '@/types/database';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReferenceTagEditorProps {
  config: ReferenceFieldConfig;
  currentValues: string[];
  onChange: (newValues: string[]) => void;
  tableName: string;
  recordId: string;
  fieldName: string;
}

export function ReferenceTagEditor({
  config,
  currentValues,
  onChange,
  tableName,
  recordId,
  fieldName
}: ReferenceTagEditorProps) {
  const { options, isLoading, createNewOption, updateRecordField } = useReferenceFieldEditor(config);
  const [newValue, setNewValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selectedSet = new Set(currentValues || []);
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = filteredOptions.filter(opt => selectedSet.has(opt));
  const availableOptions = filteredOptions.filter(opt => !selectedSet.has(opt));

  const handleToggle = async (value: string) => {
    const newValues = selectedSet.has(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange(newValues);
    await updateRecordField(tableName, recordId, fieldName, newValues);
  };

  const handleCreateNew = async () => {
    if (!newValue.trim()) return;

    setIsCreating(true);
    const success = await createNewOption(newValue.trim());
    
    if (success) {
      const newValues = [...currentValues, newValue.trim()];
      onChange(newValues);
      await updateRecordField(tableName, recordId, fieldName, newValues);
      setNewValue('');
    }
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 border rounded-lg">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-7 w-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      {/* Add New Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Add New {config.labelColumn.replace(/_/g, ' ')}</label>
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new value..."
            onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
            disabled={isCreating}
          />
          <Button
            onClick={handleCreateNew}
            disabled={!newValue.trim() || isCreating}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search options..."
          className="w-full"
        />
      </div>

      {/* Selected Tags */}
      {selectedOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Selected ({selectedOptions.length})
          </label>
          <ScrollArea className="max-h-32">
            <div className="flex flex-wrap gap-2 pr-4">
              {selectedOptions.map(option => (
                <Badge
                  key={option}
                  variant="default"
                  className="cursor-pointer hover:opacity-80 gap-1"
                  onClick={() => handleToggle(option)}
                >
                  {option}
                  <Check className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Available ({availableOptions.length})
        </label>
        <ScrollArea className="max-h-48">
          <div className="flex flex-wrap gap-2 pr-4">
            {availableOptions.map(option => (
              <Badge
                key={option}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleToggle(option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {filteredOptions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No options found
        </p>
      )}
    </div>
  );
}
