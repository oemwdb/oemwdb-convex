interface StatusBarProps {
  totalCount: number;
  selectedCount: number;
  filteredCount?: number;
}

export function StatusBar({ totalCount, selectedCount, filteredCount }: StatusBarProps) {
  return (
    <div className="h-9 px-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
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
