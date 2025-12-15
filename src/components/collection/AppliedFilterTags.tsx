import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParsedFilters } from "@/utils/filterParser";

interface AppliedFilterTagsProps {
  filters: ParsedFilters;
  onRemoveFilter: (category: keyof ParsedFilters, value: string) => void;
  onClearAll: () => void;
}

const CATEGORY_LABELS: Record<keyof ParsedFilters, string> = {
  brand: "Brand",
  diameter: "Diameter",
  width: "Width",
  boltPattern: "Bolt Pattern",
  centerBore: "Center Bore",
  offset: "Offset",
  color: "Color"
};

export function AppliedFilterTags({ filters, onRemoveFilter, onClearAll }: AppliedFilterTagsProps) {
  const hasFilters = Object.values(filters).some(arr => arr && arr.length > 0);

  if (!hasFilters) return null;

  return (
    <div className="border-b border-border bg-muted/30 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
        <span className="text-sm text-muted-foreground font-medium">Filters:</span>
        
        {(Object.keys(filters) as Array<keyof ParsedFilters>).map((category) => {
          const values = filters[category];
          if (!values || values.length === 0) return null;

          return (
            <div key={category} className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[category]}:</span>
              {values.map((value, index) => (
                <Badge 
                  key={`${category}-${value}-${index}`}
                  variant="secondary"
                  className="gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 animate-in fade-in-0 zoom-in-95 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {value}
                  <button
                    onClick={() => onRemoveFilter(category, value)}
                    className="ml-1 hover:text-destructive transition-colors"
                    aria-label={`Remove ${value} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 text-xs ml-auto hover:text-destructive"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
