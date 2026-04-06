import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, Plus, Filter, SortAsc, Search, Download, 
  Upload, Settings, Eye, EyeOff, MoreVertical, Copy, Trash2, Star,
  GripVertical, ArrowUp, ArrowDown, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TableColumn } from '@/types/database';
import { AdvancedCell } from './AdvancedCell';
import { FilterBuilder } from './FilterBuilder';
import { BulkActionsBar } from './BulkActionsBar';
import { ViewSwitcher } from './ViewSwitcher';
import { toast } from 'sonner';

interface AdvancedTableViewProps {
  data: any[];
  columns: TableColumn[];
  selectedRows: Set<string>;
  selectedColumns: Set<string>;
  onToggleRowSelection: (rowId: string) => void;
  onToggleSelectAll: () => void;
  onToggleColumnSelection: (columnId: string) => void;
  onToggleSelectAllColumns: () => void;
  onCellEdit: (rowId: string, columnId: string, value: any) => void;
  editingCell: { rowId: string; columnId: string } | null;
  onStartEdit: (rowId: string, columnId: string) => void;
  onCancelEdit: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: any[];
  onAddFilter: (filter: any) => void;
  onRemoveFilter: (filterId: string) => void;
  onUpdateFilter: (filterId: string, updates: any) => void;
  sorts: any[];
  onAddSort: (sort: any) => void;
  onRemoveSort: (column: string) => void;
  groupBy?: any;
  onSetGroupBy: (groupBy: any) => void;
  isLoading?: boolean;
  viewType: string;
  onViewTypeChange: (type: string) => void;
  onDeleteRows: (rowIds: string[]) => void;
  onExport: (format: 'csv' | 'json' | 'excel') => void;
  tableName: string;
  onAddRow?: () => void;
  hiddenColumnIds?: string[];
  onHiddenColumnIdsChange?: (columnIds: string[]) => void;
  onColumnResize?: (columnId: string, width: number) => void;
  showGroupBy?: boolean;
  columnBoundaryMap?: Record<string, { left?: boolean; right?: boolean }>;
}

export function AdvancedTableView({
  data,
  columns,
  selectedRows,
  selectedColumns,
  onToggleRowSelection,
  onToggleSelectAll,
  onToggleColumnSelection,
  onToggleSelectAllColumns,
  onCellEdit,
  editingCell,
  onStartEdit,
  onCancelEdit,
  searchQuery,
  onSearchChange,
  filters,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter,
  sorts,
  onAddSort,
  onRemoveSort,
  groupBy,
  onSetGroupBy,
  isLoading,
  viewType,
  onViewTypeChange,
  onDeleteRows,
  onExport,
  tableName,
  onAddRow,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  onColumnResize,
  showGroupBy = true,
  columnBoundaryMap = {},
}: AdvancedTableViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localHiddenColumnIds, setLocalHiddenColumnIds] = useState<string[]>([]);
  const [localColumnWidths, setLocalColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [lastSelectedRow, setLastSelectedRow] = useState<string | null>(null);
  const [lastSelectedColumn, setLastSelectedColumn] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const effectiveHiddenColumnIds = hiddenColumnIds ?? localHiddenColumnIds;
  const hiddenColumns = useRef<Set<string>>(new Set());

  useEffect(() => {
    hiddenColumns.current = new Set(effectiveHiddenColumnIds);
  }, [effectiveHiddenColumnIds]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Select all with Cmd/Ctrl + A
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !editingCell) {
        e.preventDefault();
        onToggleSelectAll();
        return;
      }

      // Delete selected rows with Delete key
      if (e.key === 'Delete' && selectedRows.size > 0 && !editingCell) {
        e.preventDefault();
        onDeleteRows(Array.from(selectedRows));
        return;
      }

      if (!editingCell) return;

      switch (e.key) {
        case 'Escape':
          onCancelEdit();
          break;
        case 'Tab':
          e.preventDefault();
          // Move to next cell
          break;
        case 'Enter':
          if (!e.shiftKey) {
            // Save and move down
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingCell, onCancelEdit, selectedRows, onDeleteRows, onToggleSelectAll]);

  // Column resize handler
  const handleColumnResize = useCallback((columnId: string, delta: number) => {
    const activeColumn = columns.find((column) => column.id === columnId);
    const currentWidth = activeColumn?.width ?? localColumnWidths[columnId] ?? 150;
    const nextWidth = Math.max(50, currentWidth + delta);

    if (onColumnResize) {
      onColumnResize(columnId, nextWidth);
      return;
    }

    setLocalColumnWidths((prev) => ({
      ...prev,
      [columnId]: nextWidth,
    }));
  }, [columns, localColumnWidths, onColumnResize]);

  const setHiddenColumns = useCallback((updater: (current: Set<string>) => Set<string>) => {
    const next = updater(new Set(effectiveHiddenColumnIds));
    const nextIds = Array.from(next);
    if (onHiddenColumnIdsChange) {
      onHiddenColumnIdsChange(nextIds);
      return;
    }
    setLocalHiddenColumnIds(nextIds);
  }, [effectiveHiddenColumnIds, onHiddenColumnIdsChange]);

  const visibleColumns = columns.filter(col => !hiddenColumns.current.has(col.id));

  const getBoundaryShadow = useCallback((columnId: string) => {
    const boundary = columnBoundaryMap[columnId];
    if (!boundary) return undefined;

    const shadows: string[] = [];
    if (boundary.left) shadows.push("inset 2px 0 0 rgba(255,255,255,0.78)");
    if (boundary.right) shadows.push("inset -2px 0 0 rgba(255,255,255,0.78)");
    return shadows.length ? shadows.join(", ") : undefined;
  }, [columnBoundaryMap]);

  // Handle row selection with Shift for range selection
  const handleRowSelection = useCallback((rowId: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedRow) {
      // Range selection
      const allRowIds = data.map(row => row.id);
      const lastIndex = allRowIds.indexOf(lastSelectedRow);
      const currentIndex = allRowIds.indexOf(rowId);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      
      for (let i = start; i <= end; i++) {
        selectedRows.add(allRowIds[i]);
      }
      onToggleRowSelection(rowId); // Trigger re-render
    } else {
      onToggleRowSelection(rowId);
      setLastSelectedRow(rowId);
    }
  }, [data, lastSelectedRow, onToggleRowSelection, selectedRows]);

  // Handle column selection with Shift for range selection
  const handleColumnSelection = useCallback((columnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const currentVisibleColumns = columns.filter(col => !hiddenColumns.current.has(col.id));
    
    if (e.shiftKey && lastSelectedColumn) {
      // Range selection
      const allColumnIds = currentVisibleColumns.map(col => col.id);
      const lastIndex = allColumnIds.indexOf(lastSelectedColumn);
      const currentIndex = allColumnIds.indexOf(columnId);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      
      const newSet = new Set(selectedColumns);
      for (let i = start; i <= end; i++) {
        newSet.add(allColumnIds[i]);
      }
      // Update parent state by toggling all columns in range
      for (let i = start; i <= end; i++) {
        if (!selectedColumns.has(allColumnIds[i])) {
          onToggleColumnSelection(allColumnIds[i]);
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click for multi-select
      onToggleColumnSelection(columnId);
      setLastSelectedColumn(columnId);
    } else {
      // Clear other selections and select this one
      if (selectedColumns.size > 1 || !selectedColumns.has(columnId)) {
        // Clear all first
        selectedColumns.forEach(id => {
          if (id !== columnId) onToggleColumnSelection(id);
        });
      }
      onToggleColumnSelection(columnId);
      setLastSelectedColumn(columnId);
    }
  }, [columns, effectiveHiddenColumnIds, lastSelectedColumn, onToggleColumnSelection, selectedColumns]);

  // Handle row actions
  const handleDuplicateRow = (row: any) => {
    toast.success('Row duplicated');
    // Implementation would go here
  };

  const handleCopyLink = (rowId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${rowId}`);
    toast.success('Link copied to clipboard');
  };

  const handleAddToFavorites = (rowId: string) => {
    toast.success('Added to favorites');
    // Implementation would go here
  };

  // Group data if groupBy is set
  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;
    
    const groups = new Map<string, any[]>();
    data.forEach(row => {
      const groupValue = row[groupBy.column] || 'Uncategorized';
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(row);
    });
    
    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      items,
      collapsed: false
    }));
  }, [data, groupBy]);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header Toolbar */}
      <div className="border-b border-border/70 bg-card px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs font-medium"
              onClick={onAddRow}
            >
              <Plus className="h-3 w-3 mr-1" />
              New
            </Button>

            {/* Search */}
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${tableName}...`}
                className="h-8 pl-7 text-xs bg-black/20 border-border/70 hover:border-border focus:border-primary"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-8 px-3 text-xs",
                filters.length > 0 && "text-primary"
              )}
            >
              <Filter className="h-3 w-3 mr-1" />
              Filter
              {filters.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {filters.length}
                </Badge>
              )}
            </Button>

            {/* Sort Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  <SortAsc className="h-3 w-3 mr-1" />
                  Sort
                  {sorts.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {sorts.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map(column => (
                  <DropdownMenuItem
                    key={column.id}
                    className="text-xs"
                    onClick={() => {
                      const existingSort = sorts.find(s => s.column === column.key);
                      if (existingSort) {
                        if (existingSort.direction === 'asc') {
                          onAddSort({ column: column.key, direction: 'desc' });
                        } else {
                          onRemoveSort(column.key);
                        }
                      } else {
                        onAddSort({ column: column.key, direction: 'asc' });
                      }
                    }}
                  >
                    <span className="flex-1">{column.label}</span>
                    {sorts.find(s => s.column === column.key)?.direction === 'asc' && '↑'}
                    {sorts.find(s => s.column === column.key)?.direction === 'desc' && '↓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {showGroupBy && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                    Group
                    {groupBy && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                        {columns.find(c => c.key === groupBy.column)?.label}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel className="text-xs">Group by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs" onClick={() => onSetGroupBy(undefined)}>
                    None
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {columns.map(column => (
                    <DropdownMenuItem
                      key={column.id}
                      className="text-xs"
                      onClick={() => onSetGroupBy({ column: column.key })}
                    >
                      {column.label}
                      {groupBy?.column === column.key && ' ✓'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* View Switcher */}
            <ViewSwitcher
              currentView={viewType}
              onViewChange={onViewTypeChange}
            />

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  <Eye className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="text-xs"
                    checked={!hiddenColumns.current.has(column.id)}
                    onCheckedChange={() => {
                      setHiddenColumns(prev => {
                        const next = new Set(prev);
                        if (next.has(column.id)) {
                          next.delete(column.id);
                        } else {
                          next.add(column.id);
                        }
                        return next;
                      });
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  <Download className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs" onClick={() => onExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs" onClick={() => onExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs" onClick={() => onExport('excel')}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Builder */}
      {showFilters && (
        <FilterBuilder
          columns={columns}
          filters={filters}
          onAddFilter={onAddFilter}
          onRemoveFilter={onRemoveFilter}
          onUpdateFilter={onUpdateFilter}
        />
      )}

      {/* Bulk Actions Bar */}
      {(selectedRows.size > 0 || selectedColumns.size > 0) && (
        <BulkActionsBar
          selectedCount={selectedRows.size > 0 && selectedColumns.size > 0 
            ? selectedRows.size * selectedColumns.size 
            : selectedRows.size > 0 
              ? selectedRows.size 
              : selectedColumns.size}
          onDelete={() => onDeleteRows(Array.from(selectedRows))}
          onClearSelection={() => {
            selectedRows.clear();
            selectedColumns.clear();
          }}
        />
      )}

      {/* Table */}
      <div ref={tableRef} className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-card border-b border-border/70">
            <tr>
              <th className="w-8 px-2 py-2">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={onToggleSelectAll}
                  className="h-3.5 w-3.5 border-muted-foreground/30"
                />
              </th>
              <th className="w-8 px-2 py-2">
                <Checkbox
                  checked={selectedColumns.size === visibleColumns.length && visibleColumns.length > 0}
                  onCheckedChange={onToggleSelectAllColumns}
                  className="h-3.5 w-3.5 border-muted-foreground/30"
                />
              </th>
              {visibleColumns.map(column => (
                <th
                  key={column.id}
                  className={cn(
                    "relative text-left px-3 py-2 text-xs font-medium cursor-pointer select-none transition-colors",
                    selectedColumns.has(column.id) 
                      ? "bg-primary/20 text-foreground font-medium" 
                      : "text-muted-foreground hover:bg-white/[0.03]"
                  )}
                  style={{ width: column.width ?? localColumnWidths[column.id] ?? 150 }}
                  onClick={(e) => handleColumnSelection(column.id, e)}
                  data-column-boundary={columnBoundaryMap[column.id] ? "true" : undefined}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sorts.find(s => s.column === column.key) && (
                      <span className="text-primary text-[10px]">
                        {sorts.find(s => s.column === column.key)?.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  {/* Column Resize Handle */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-0.5 hover:bg-primary/50 cursor-col-resize opacity-0 hover:opacity-100"
                    onMouseDown={(e) => {
                      setResizingColumn(column.id);
                      const startX = e.clientX;
                      const startWidth = column.width ?? localColumnWidths[column.id] ?? 150;
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const delta = e.clientX - startX;
                        handleColumnResize(column.id, delta);
                      };
                      
                      const handleMouseUp = () => {
                        setResizingColumn(null);
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 right-0"
                    style={{ boxShadow: getBoundaryShadow(column.id) }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {groupedData ? (
              // Render grouped data
              groupedData.map(group => (
                <React.Fragment key={group.key}>
                  <tr className="bg-muted/30 border-b border-border">
                    <td colSpan={visibleColumns.length + 1} className="px-3 py-2">
                      <button
                        className="flex items-center gap-2 font-medium"
                        onClick={() => {
                          // Toggle group collapse
                        }}
                      >
                        {group.collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {group.key}
                        <Badge variant="secondary">{group.items.length}</Badge>
                      </button>
                    </td>
                  </tr>
                  {!group.collapsed && group.items.map((row: any) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border hover:bg-muted/50 transition-colors",
                        selectedRows.has(row.id) && "bg-muted"
                      )}
                    >
                      <td className="px-2 py-2">
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={(e) => handleRowSelection(row.id, e as any)}
                          className="h-3.5 w-3.5"
                        />
                      </td>
                      <td className="w-8"></td>
                      {visibleColumns.map(column => (
                        <td 
                          key={column.id} 
                          className={cn(
                            "px-3 py-2 transition-colors",
                            selectedColumns.has(column.id) && "bg-primary/10",
                            selectedRows.has(row.id) && selectedColumns.has(column.id) && "bg-primary/25"
                          )}
                          style={{ boxShadow: getBoundaryShadow(column.id) }}
                        >
                          <AdvancedCell
                            value={row[column.key]}
                            column={column}
                            isEditing={editingCell?.rowId === row.id && editingCell?.columnId === column.id}
                            onEdit={() => onStartEdit(row.id, column.id)}
                            onSave={(value) => onCellEdit(row.id, column.key, value)}
                            onCancel={onCancelEdit}
                            rowData={row}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              // Render flat data
              data.map((row: any) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/60 hover:bg-muted/40 transition-colors",
                    selectedRows.has(row.id) && "bg-muted"
                  )}
                >
                  <td className="px-2 py-2">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={(e) => handleRowSelection(row.id, e as any)}
                      className="h-3.5 w-3.5"
                    />
                  </td>
                  <td className="w-8"></td>
                  {visibleColumns.map(column => (
                    <td 
                      key={column.id} 
                      className={cn(
                        "px-3 py-2 transition-colors",
                        selectedColumns.has(column.id) && "bg-primary/10",
                        selectedRows.has(row.id) && selectedColumns.has(column.id) && "bg-primary/25"
                      )}
                      style={{ boxShadow: getBoundaryShadow(column.id) }}
                    >
                      <AdvancedCell
                        value={row[column.key]}
                        column={column}
                        isEditing={editingCell?.rowId === row.id && editingCell?.columnId === column.id}
                        onEdit={() => onStartEdit(row.id, column.id)}
                        onSave={(value) => onCellEdit(row.id, column.key, value)}
                        onCancel={onCancelEdit}
                        rowData={row}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
