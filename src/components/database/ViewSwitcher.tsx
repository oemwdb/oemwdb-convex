import React from 'react';
import { Table, LayoutGrid, Calendar, Image, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewSwitcherProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const VIEWS = [
  { id: 'table', icon: Table, label: 'Table' },
  { id: 'board', icon: LayoutGrid, label: 'Board' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'gallery', icon: Image, label: 'Gallery' },
  { id: 'list', icon: List, label: 'List' },
];

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      {VIEWS.map(view => (
        <Button
          key={view.id}
          size="sm"
          variant={currentView === view.id ? 'default' : 'ghost'}
          className="h-7 px-2"
          onClick={() => onViewChange(view.id)}
        >
          <view.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}