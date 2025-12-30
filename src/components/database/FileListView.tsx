import { useState, useEffect } from "react";
import { CellSelectableTable } from "./CellSelectableTable";
import { StatusBar } from "./StatusBar";
import { BulkActionsBar } from "./BulkActionsBar";
import { BulkEditDialog } from "./BulkEditDialog";
import { CreateRecordDialog } from "./CreateRecordDialog";
import { TableColumn } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Plus, Download, RotateCcw } from "lucide-react";

import { toast } from "sonner";

interface FileListViewProps {
  data: any[];
  columns: TableColumn[];
  tableName: string;
  isLoading: boolean;
  onRefetch: () => void;
  onCellEdit: (rowId: string, columnId: string, value: any) => void;
  onDeleteRows: (rowIds: string[]) => void;
  onExport: () => void;
  onCreateRecord?: (data: Record<string, any>) => Promise<void>;
  searchQuery: string;
  onColumnReorder: (oldIndex: number, newIndex: number) => void;
}

export function FileListView({
  data,
  columns,
  tableName,
  isLoading,
  onRefetch,
  onCellEdit,
  onDeleteRows,
  onExport,
  onCreateRecord,
  searchQuery,
  onColumnReorder,
}: FileListViewProps) {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set()); // Format: "rowId:columnId"
  const [lastSelectedCell, setLastSelectedCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [anchorCell, setAnchorCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredData = (data || []).filter((row) => {
    if (!searchQuery) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (aVal < bVal) return -1 * modifier;
    if (aVal > bVal) return 1 * modifier;
    return 0;
  });

  const handleCellClick = (rowId: string, columnId: string, isShiftKey: boolean) => {
    const cellKey = `${rowId}:${columnId}`;

    if (isShiftKey && anchorCell) {
      // Range selection from anchor to clicked cell
      const newSelected = new Set<string>();

      const rowIndexStart = sortedData.findIndex((r) => r.id === anchorCell.rowId);
      const rowIndexEnd = sortedData.findIndex((r) => r.id === rowId);
      const colIndexStart = columns.findIndex((c) => c.id === anchorCell.columnId);
      const colIndexEnd = columns.findIndex((c) => c.id === columnId);

      const minRow = Math.min(rowIndexStart, rowIndexEnd);
      const maxRow = Math.max(rowIndexStart, rowIndexEnd);
      const minCol = Math.min(colIndexStart, colIndexEnd);
      const maxCol = Math.max(colIndexStart, colIndexEnd);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newSelected.add(`${sortedData[r].id}:${columns[c].id}`);
        }
      }

      setSelectedCells(newSelected);
      setLastSelectedCell({ rowId, columnId });
    } else {
      // Single cell selection - set new anchor
      setSelectedCells(new Set([cellKey]));
      setLastSelectedCell({ rowId, columnId });
      setAnchorCell({ rowId, columnId });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCells = new Set<string>();
      sortedData.forEach((row) => {
        columns.forEach((col) => {
          allCells.add(`${row.id}:${col.id}`);
        });
      });
      setSelectedCells(allCells);
    } else {
      setSelectedCells(new Set());
    }
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Copy selected cells to clipboard
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (selectedCells.size === 0) return;

      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      e.preventDefault();

      // Get all selected cells organized by row and column
      const cellsByRow = new Map<string, Map<string, any>>();

      selectedCells.forEach(cellKey => {
        const [rowId, columnId] = cellKey.split(':');
        if (!cellsByRow.has(rowId)) {
          cellsByRow.set(rowId, new Map());
        }
        const row = sortedData.find(r => r.id === rowId);
        const column = columns.find(c => c.id === columnId);
        if (row && column) {
          cellsByRow.get(rowId)!.set(columnId, row[column.key]);
        }
      });

      // Convert to TSV format - sort rows and columns by their visual order
      const rowIds = Array.from(cellsByRow.keys()).sort((a, b) => {
        const aIndex = sortedData.findIndex(r => r.id === a);
        const bIndex = sortedData.findIndex(r => r.id === b);
        return aIndex - bIndex;
      });

      const colIds = new Set<string>();
      cellsByRow.forEach(cols => cols.forEach((_, colId) => colIds.add(colId)));
      const sortedColIds = columns.filter(c => colIds.has(c.id)).map(c => c.id);

      const tsvData = rowIds.map(rowId => {
        const rowCells = cellsByRow.get(rowId)!;
        return sortedColIds.map(colId => {
          const value = rowCells.get(colId);
          if (Array.isArray(value)) return value.join(', ');
          return String(value ?? '');
        }).join('\t');
      }).join('\n');

      e.clipboardData?.setData('text/plain', tsvData);

      // Show success notification
      const cellCount = selectedCells.size;
      const rowCount = rowIds.length;
      toast.success(`Copied ${cellCount} cell${cellCount > 1 ? 's' : ''} (${rowCount} row${rowCount > 1 ? 's' : ''})`);
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [selectedCells, sortedData, columns]);

  // Keyboard navigation with shift support (all 4 directions)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      if (!sortedData.length || !columns.length) return;

      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      e.preventDefault();

      // Start position (from last selected cell)
      let currentRowIndex = 0;
      let currentColIndex = 0;

      if (lastSelectedCell) {
        currentRowIndex = sortedData.findIndex((r) => r.id === lastSelectedCell.rowId);
        currentColIndex = columns.findIndex((c) => c.id === lastSelectedCell.columnId);
      }

      // Calculate new position
      let newRowIndex = currentRowIndex;
      let newColIndex = currentColIndex;

      if (e.key === 'ArrowDown') {
        newRowIndex = Math.min(currentRowIndex + 1, sortedData.length - 1);
      } else if (e.key === 'ArrowUp') {
        newRowIndex = Math.max(currentRowIndex - 1, 0);
      } else if (e.key === 'ArrowRight') {
        newColIndex = Math.min(currentColIndex + 1, columns.length - 1);
      } else if (e.key === 'ArrowLeft') {
        newColIndex = Math.max(currentColIndex - 1, 0);
      }

      const newRowId = sortedData[newRowIndex].id;
      const newColId = columns[newColIndex].id;

      if (e.shiftKey && anchorCell) {
        // Shift + Arrow: Range selection from anchor to new position
        const anchorRowIndex = sortedData.findIndex((r) => r.id === anchorCell.rowId);
        const anchorColIndex = columns.findIndex((c) => c.id === anchorCell.columnId || c.id === anchorCell.columnId);

        const minRow = Math.min(anchorRowIndex, newRowIndex);
        const maxRow = Math.max(anchorRowIndex, newRowIndex);
        const minCol = Math.min(anchorColIndex, newColIndex);
        const maxCol = Math.max(anchorColIndex, newColIndex);

        const newSelected = new Set<string>();
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            newSelected.add(`${sortedData[r].id}:${columns[c].id}`);
          }
        }
        setSelectedCells(newSelected);
        setLastSelectedCell({ rowId: newRowId, columnId: newColId });
      } else {
        // Just Arrow: Single cell selection - set new anchor
        setSelectedCells(new Set([`${newRowId}:${newColId}`]));
        setLastSelectedCell({ rowId: newRowId, columnId: newColId });
        setAnchorCell({ rowId: newRowId, columnId: newColId });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedData, columns, lastSelectedCell, anchorCell]);

  // Extract unique row IDs from selected cells
  const getSelectedRowIds = (): Set<string> => {
    const rowIds = new Set<string>();
    selectedCells.forEach((cellKey) => {
      const [rowId] = cellKey.split(":");
      rowIds.add(rowId);
    });
    return rowIds;
  };

  const handleBulkDelete = () => {
    const selectedRowIds = getSelectedRowIds();
    if (selectedRowIds.size === 0) return;
    onDeleteRows(Array.from(selectedRowIds));
    setSelectedCells(new Set());
    setLastSelectedCell(null);
    setAnchorCell(null);
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    const selectedRowIds = getSelectedRowIds();
    if (selectedRowIds.size === 0) return;

    const selectedRecordsArray = Array.from(selectedRowIds);

    // Apply all updates
    for (const rowId of selectedRecordsArray) {
      for (const [columnId, value] of Object.entries(updates)) {
        await onCellEdit(rowId, columnId, value);
      }
    }

    // Refetch to show updated data
    onRefetch();
  };

  const handleCreateRecord = async (data: Record<string, any>) => {
    if (!onCreateRecord) return;
    await onCreateRecord(data);
    onRefetch();
  };

  const selectedRowIds = getSelectedRowIds();
  const selectedRecordsData = data.filter((row) => selectedRowIds.has(row.id));

  return (
    <div className="flex flex-col h-full">
      {/* Header removed as controls are hoisted */}

      {selectedCells.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRowIds.size}
          onDelete={handleBulkDelete}
          onClearSelection={() => {
            setSelectedCells(new Set());
            setLastSelectedCell(null);
            setAnchorCell(null);
          }}
          onBulkEdit={() => setShowBulkEdit(true)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden border border-border rounded-xl shadow-sm bg-card">
        <CellSelectableTable
          data={sortedData}
          columns={columns}
          selectedCells={selectedCells}
          onCellClick={handleCellClick}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onColumnReorder={onColumnReorder}
          onCellEdit={onCellEdit}
        />
        <StatusBar
          totalCount={data.length}
          selectedCount={selectedCells.size}
          filteredCount={filteredData.length !== data.length ? filteredData.length : undefined}
        />
      </div>

      <BulkEditDialog
        open={showBulkEdit}
        onOpenChange={setShowBulkEdit}
        selectedRecords={selectedRecordsData}
        columns={columns}
        onSave={handleBulkUpdate}
      />

      <CreateRecordDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        columns={columns}
        onSave={handleCreateRecord}
      />
    </div>
  );
}
