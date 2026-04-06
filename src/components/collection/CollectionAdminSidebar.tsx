import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GitMerge, Loader2, ShieldCheck, X } from "lucide-react";

interface CollectionAdminSidebarProps {
  itemLabel: string;
  selectionMode: boolean;
  selectedCount: number;
  selectedLabels?: string[];
  isMerging?: boolean;
  onDuplicateControl: () => void;
  onClearSelection: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function CollectionAdminSidebar({
  itemLabel,
  selectionMode,
  selectedCount,
  selectedLabels = [],
  isMerging = false,
  onDuplicateControl,
  onClearSelection,
  disabled = false,
  disabledReason,
}: CollectionAdminSidebarProps) {
  const primaryLabel = selectedLabels[0] ?? null;
  const extraSelected = Math.max(0, selectedLabels.length - 4);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Badge variant="secondary" className="gap-1 bg-primary/15 text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin only
        </Badge>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Merge control</h3>
          <p className="text-xs leading-5 text-muted-foreground">
            {disabled
              ? disabledReason ?? `Merge control is not wired for ${itemLabel} yet.`
              : selectionMode
              ? `Pick the ${itemLabel} to collapse. The first selected item is the keeper.`
              : `Open merge mode to select and collapse duplicate ${itemLabel} from this page.`}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/60 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Status
          </span>
          <Badge
            variant="outline"
            className={cn(
              selectionMode && "border-primary/50 text-primary",
              isMerging && "border-amber-500/50 text-amber-500"
            )}
          >
            {isMerging ? "Merging" : selectionMode ? "Selecting" : "Idle"}
          </Badge>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/70 p-3 space-y-1.5">
          <div className="text-xs text-muted-foreground">Selected</div>
          <div className="text-2xl font-semibold text-foreground">{selectedCount}</div>
          {primaryLabel ? (
            <div className="text-xs text-muted-foreground">
              Primary: <span className="text-foreground">{primaryLabel}</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No items selected yet.</div>
          )}
        </div>

        {selectedLabels.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Current selection</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedLabels.slice(0, 4).map((label, index) => (
                <Badge key={`${label}-${index}`} variant="outline" className="max-w-full truncate">
                  {index === 0 ? `1. ${label}` : `${index + 1}. ${label}`}
                </Badge>
              ))}
              {extraSelected > 0 && <Badge variant="outline">+{extraSelected} more</Badge>}
            </div>
          </div>
        )}

        <Button
          type="button"
          className="w-full justify-center gap-2"
          onClick={onDuplicateControl}
          disabled={isMerging || disabled}
        >
          {isMerging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : selectionMode ? (
            <GitMerge className="h-4 w-4" />
          ) : (
            <GitMerge className="h-4 w-4" />
          )}
          {selectionMode ? "Merge Selected" : "Start Merge"}
        </Button>

        {selectionMode && (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={onClearSelection}
            disabled={isMerging}
          >
            <X className="h-4 w-4" />
            Cancel Selection
          </Button>
        )}
      </div>
    </div>
  );
}
