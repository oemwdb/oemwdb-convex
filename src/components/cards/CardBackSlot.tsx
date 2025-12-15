import React from 'react';
import { cn } from '@/lib/utils';

interface CardBackSlotProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export function CardBackSlot({ label, value, className }: CardBackSlotProps) {
  const displayValue = value !== null && value !== undefined ? String(value) : '-';
  
  return (
    <div className={cn(
      "flex items-center h-8 border-b border-border/50 last:border-b-0",
      className
    )}>
      <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0 px-2">
        {label}
      </span>
      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <span className="text-xs whitespace-nowrap px-2 block">
          {displayValue}
        </span>
      </div>
    </div>
  );
}