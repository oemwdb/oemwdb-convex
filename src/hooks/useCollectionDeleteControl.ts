import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseCollectionDeleteControlOptions {
  itemLabel: string;
  onDelete: (ids: string[]) => Promise<{ deletedCount?: number } | unknown>;
}

export function useCollectionDeleteControl({
  itemLabel,
  onDelete,
}: UseCollectionDeleteControlOptions) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }, []);

  const handleDeleteControl = useCallback(async () => {
    if (!selectionMode) {
      setSelectionMode(true);
      toast("Delete mode enabled", {
        description: `Select the ${itemLabel} you want to remove from this page.`,
      });
      return;
    }

    if (selectedIds.length < 1) {
      clearSelection();
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} ${itemLabel}? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await onDelete(selectedIds);
      const deletedCount =
        typeof result === "object" && result && "deletedCount" in result
          ? Number((result as { deletedCount?: number }).deletedCount ?? selectedIds.length)
          : selectedIds.length;
      toast("Delete complete", {
        description: `${deletedCount} ${itemLabel} deleted.`,
      });
      clearSelection();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      toast("Delete failed", {
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [clearSelection, itemLabel, onDelete, selectedIds, selectionMode]);

  return {
    selectionMode,
    selectedIds,
    selectedCount: selectedIds.length,
    isDeleting,
    toggleSelection,
    clearSelection,
    handleDeleteControl,
  };
}
