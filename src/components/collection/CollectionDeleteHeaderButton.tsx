import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";

interface CollectionDeleteHeaderButtonProps {
  itemLabel: string;
  selectionMode: boolean;
  selectedCount: number;
  isDeleting?: boolean;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function CollectionDeleteHeaderButton({
  itemLabel,
  selectionMode,
  selectedCount,
  isDeleting = false,
  onClick,
  disabled = false,
  disabledReason,
}: CollectionDeleteHeaderButtonProps) {
  if (!selectionMode) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full border border-border bg-sidebar hover:bg-white/10"
        onClick={onClick}
        title={disabled ? (disabledReason ?? `${itemLabel} delete unavailable`) : `Delete ${itemLabel}`}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4 text-red-400" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-8 rounded-full border border-red-500/60 bg-red-500/15 px-3 text-red-100 hover:bg-red-500/20",
        selectedCount > 0 && "animate-pulse"
      )}
      onClick={onClick}
      title={selectedCount > 0 ? `Delete ${selectedCount} ${itemLabel}` : "Exit delete mode"}
      disabled={isDeleting || disabled}
    >
      {isDeleting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      {selectedCount > 0 ? `Delete ${selectedCount}` : "Delete"}
    </Button>
  );
}
