import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollectionSortOption {
  label: string;
  value: string;
}

interface CollectionSortSidebarProps {
  title?: string;
  options: CollectionSortOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  totalResults?: number;
}

export const CollectionSortSidebar = ({
  title = "Sort",
  options,
  selectedValue,
  onChange,
  totalResults,
}: CollectionSortSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b border-border/60">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {options.map((option) => {
            const isActive = option.value === selectedValue;
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={cn(
                  "w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="text-sm">{option.label}</span>
                <Check
                  className={cn(
                    "h-4 w-4 transition-opacity",
                    isActive ? "opacity-100 text-primary" : "opacity-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <span
          className={cn(
            "block w-full px-3 py-1.5 rounded-full border border-border bg-card/80 text-right text-xs text-muted-foreground",
            totalResults === undefined && "invisible"
          )}
        >
          {totalResults !== undefined ? `${totalResults} results` : ""}
        </span>
      </div>
    </div>
  );
};

export default CollectionSortSidebar;
