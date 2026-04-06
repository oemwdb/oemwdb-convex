import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectableCollectionCardProps {
  children: ReactNode;
  label: string;
  selectionMode?: boolean;
  selectedOrder?: number;
  onToggleSelection?: () => void;
  selectionTone?: "merge" | "delete";
}

export function SelectableCollectionCard({
  children,
  label,
  selectionMode = false,
  selectedOrder,
  onToggleSelection,
  selectionTone = "merge",
}: SelectableCollectionCardProps) {
  if (!selectionMode || !onToggleSelection) {
    return <div className="relative">{children}</div>;
  }

  const isSelected = typeof selectedOrder === "number" && selectedOrder > 0;
  const isDeleteTone = selectionTone === "delete";

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        aria-label={`${isSelected ? "Deselect" : "Select"} ${label}`}
        aria-pressed={isSelected}
        className={cn(
          "absolute inset-0 z-20 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60",
          isSelected
            ? isDeleteTone
              ? "border-red-500 bg-red-500/12"
              : selectedOrder === 1
                ? "border-amber-500 bg-amber-500/12"
                : "border-primary bg-primary/12"
            : "border-white/10 bg-black/5 hover:bg-black/15"
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleSelection();
        }}
      >
        <span
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold shadow-lg",
            isSelected
              ? isDeleteTone
                ? "border-red-400 bg-red-500 text-white"
                : selectedOrder === 1
                  ? "border-amber-400 bg-amber-500 text-black"
                  : "border-primary bg-primary text-primary-foreground"
              : "border-white/20 bg-black/70 text-white"
          )}
        >
          {isSelected ? (isDeleteTone ? "×" : selectedOrder) : "+"}
        </span>
        {isSelected && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
              isDeleteTone
                ? "bg-red-500 text-white"
                : selectedOrder === 1
                  ? "bg-amber-500 text-black"
                  : "bg-primary text-primary-foreground"
            )}
          >
            {isDeleteTone ? "Delete" : selectedOrder === 1 ? "Primary" : "Selected"}
          </span>
        )}
      </button>
    </div>
  );
}
