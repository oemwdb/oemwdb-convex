
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDroppable, DragEndEvent } from "@dnd-kit/core";
import { Loader2, FolderPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StorageItem } from "./StorageItem";
import { StorageGridItem } from "./StorageGridItem";
import { ColumnItem, ViewMode } from "./types";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface StorageColumnProps {
    bucketName: string;
    path: string;
    paneId?: string;
    activeItemName?: string;
    searchQuery?: string;
    viewMode?: ViewMode;
    selectedItems?: Set<string>;
    selectionMode?: boolean;
    showCheckboxes?: boolean;
    onSelectItem: (item: ColumnItem) => void;
    onToggleSelect?: (itemPath: string) => void;
    onDragEnd?: (event: DragEndEvent) => void;
    onCreateFolder?: (parentPath: string) => void;
}

export function StorageColumn({
    bucketName,
    path,
    paneId = "",
    activeItemName,
    searchQuery = "",
    viewMode = "list",
    selectedItems = new Set(),
    selectionMode = false,
    showCheckboxes = false,
    onSelectItem,
    onToggleSelect,
    onCreateFolder
}: StorageColumnProps) {
    const { data: files, isLoading } = useFiles(bucketName, path);
    const { getPublicUrl, moveFile, deleteFile } = useStorageActions();
    const [items, setItems] = useState<ColumnItem[]>([]);

    // Handle rename callback
    const handleRename = useCallback((oldName: string, newName: string) => {
        const oldPath = path ? `${path}/${oldName}` : oldName;
        const newPath = path ? `${path}/${newName}` : newName;
        moveFile.mutate({ bucket: bucketName, fromPath: oldPath, toPath: newPath });
    }, [bucketName, path, moveFile]);

    // Handle delete callback
    const handleDelete = useCallback((itemName: string) => {
        const itemPath = path ? `${path}/${itemName}` : itemName;
        deleteFile.mutate({ bucket: bucketName, path: itemPath });
    }, [bucketName, path, deleteFile]);

    // Handle copy URL callback
    const handleCopyUrl = useCallback((itemName: string) => {
        const url = getPublicUrl(bucketName, `${path ? path + '/' : ''}${itemName}`);
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    }, [bucketName, path, getPublicUrl]);

    // Handle download callback
    const handleDownload = useCallback((itemName: string) => {
        const url = getPublicUrl(bucketName, `${path ? path + '/' : ''}${itemName}`);
        window.open(url, '_blank');
    }, [bucketName, path, getPublicUrl]);

    // We need to act as a droppable zone for this folder path
    // Include paneId in the droppable ID to make it unique across panes
    const droppableId = paneId ? `${paneId}:${path || "root"}` : (path || "root");
    const { setNodeRef, isOver } = useDroppable({
        id: droppableId,
        data: { path, bucketName, paneId }
    });

    useEffect(() => {
        if (files) {
            const processed: ColumnItem[] = files.map(f => ({
                ...f,
                kind: !f.id ? "folder" : "file"
            }));
            setItems(processed);
        }
    }, [files]);

    // Filter items by search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(query));
    }, [items, searchQuery]);

    // Handle toggle select with full path
    const handleToggleSelect = useCallback((itemName: string) => {
        const fullPath = path ? `${path}/${itemName}` : itemName;
        onToggleSelect?.(fullPath);
    }, [path, onToggleSelect]);

    // Check if item is selected
    const isItemSelected = useCallback((itemName: string) => {
        const fullPath = path ? `${path}/${itemName}` : itemName;
        return selectedItems.has(fullPath);
    }, [path, selectedItems]);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={`w-full h-full flex flex-col bg-background/50 transition-colors ${isOver ? 'bg-primary/5' : ''}`}
                    ref={setNodeRef}
                >
                    <ScrollArea className="flex-1">
                        <div className={viewMode === 'grid' ? "grid grid-cols-3 gap-2 p-2" : "flex flex-col"}>
                            {isLoading ? (
                                <div className="flex items-center justify-center p-8 col-span-full">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2 opacity-50 col-span-full">
                                    <span className="text-xs">{searchQuery ? 'No matches' : 'Empty'}</span>
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    viewMode === 'grid' ? (
                                        <StorageGridItem
                                            key={item.name}
                                            item={item}
                                            isActive={item.name === activeItemName}
                                            isSelected={isItemSelected(item.name)}
                                            selectionMode={selectionMode}
                                            onClick={() => onSelectItem(item)}
                                            onToggleSelect={handleToggleSelect}
                                            onRename={handleRename}
                                            onDelete={handleDelete}
                                            onCopyUrl={handleCopyUrl}
                                            onDownload={handleDownload}
                                            bucketName={bucketName}
                                            getPublicUrl={(itemPath) => getPublicUrl(bucketName, `${path ? path + '/' : ''}${itemPath}`)}
                                        />
                                    ) : (
                                        <StorageItem
                                            key={item.name}
                                            item={item}
                                            sourcePath={path}
                                            paneId={paneId}
                                            isActive={item.name === activeItemName}
                                            isSelected={isItemSelected(item.name)}
                                            selectionMode={selectionMode}
                                            onClick={() => onSelectItem(item)}
                                            onToggleSelect={handleToggleSelect}
                                            onRename={handleRename}
                                            onDelete={handleDelete}
                                            onCopyUrl={handleCopyUrl}
                                            onDownload={handleDownload}
                                            bucketName={bucketName}
                                            getPublicUrl={(itemPath) => getPublicUrl(bucketName, `${path ? path + '/' : ''}${itemPath}`)}
                                        />
                                    )
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onCreateFolder?.(path)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
