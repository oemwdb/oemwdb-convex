interface StatusBarProps {
  totalCount: number;
  selectedCount: number;
  filteredCount?: number;
}

export function StatusBar({ totalCount, selectedCount, filteredCount }: StatusBarProps) {
  return (
    <div className="h-7 px-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border bg-muted/20">
      <div className="flex items-center gap-4">
        {filteredCount !== undefined && filteredCount !== totalCount ? (
          <span>Showing {filteredCount} of {totalCount} records</span>
        ) : (
          <span>{totalCount} {totalCount === 1 ? "record" : "records"}</span>
        )}
        {selectedCount > 0 && (
          <span className="text-foreground font-medium">
            {selectedCount} selected
          </span>
        )}
      </div>
    </div>
  );
}
