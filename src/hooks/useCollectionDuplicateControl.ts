import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseCollectionDuplicateControlOptions {
  itemLabel: string;
  onMerge: (args: { canonicalId: string; duplicateIds: string[] }) => Promise<{ mergedCount?: number } | unknown>;
}

export function useCollectionDuplicateControl({
  itemLabel,
  onMerge,
}: UseCollectionDuplicateControlOptions) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }, []);

  const handleDuplicateControl = useCallback(async () => {
    if (!selectionMode) {
      setSelectionMode(true);
      toast("Duplicate control enabled", {
        description: `Select the ${itemLabel} you want to merge. The first selected item stays.`,
      });
      return;
    }

    if (selectedIds.length < 2) {
      toast("Select at least two items", {
        description: `Pick the keeper first, then select the duplicate ${itemLabel}.`,
      });
      return;
    }

    const canonicalId = selectedIds[0];
    const duplicateIds = selectedIds.slice(1);
    const confirmed = window.confirm(
      `Merge ${selectedIds.length} ${itemLabel}? The first selected item will remain.`
    );
    if (!confirmed) {
      return;
    }

    try {
      setIsMerging(true);
      const result = await onMerge({ canonicalId, duplicateIds });
      const mergedCount =
        typeof result === "object" && result && "mergedCount" in result
          ? Number((result as { mergedCount?: number }).mergedCount ?? duplicateIds.length)
          : duplicateIds.length;
      toast("Merge complete", {
        description: `${mergedCount} ${itemLabel} merged into the first selected item.`,
      });
      clearSelection();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Merge failed.";
      toast("Merge failed", {
        description: message,
      });
    } finally {
      setIsMerging(false);
    }
  }, [clearSelection, itemLabel, onMerge, selectedIds, selectionMode]);

  return {
    selectionMode,
    selectedIds,
    selectedCount: selectedIds.length,
    primarySelectedId: selectedIds[0] ?? null,
    isMerging,
    toggleSelection,
    handleDuplicateControl,
    clearSelection,
  };
}
