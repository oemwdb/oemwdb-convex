
import { useState, useEffect, useCallback, useRef } from "react";
import { DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { StorageColumn } from "./StorageColumn";
import { ColumnItem, ViewMode } from "./types";
import { Folder, FileText, Trash2, X, Copy, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorageActions } from "@/hooks/useStorage";
import { toast } from "sonner";

interface MillerColumnsProps {
    bucketName: string;
    searchQuery?: string;
    viewMode?: ViewMode;
    showCheckboxes?: boolean;
    initialPath?: string[];
    mirrored?: boolean;
    onPathChange?: (path: string[]) => void;
    onMoveFile?: (fromPath: string, toPath: string) => void;
}

export function MillerColumns({
    bucketName,
    searchQuery = "",
    viewMode = "list",
    showCheckboxes = false,
    initialPath = [],
    mirrored = false,
    onPathChange,
    onMoveFile
}: MillerColumnsProps) {
    const [activePathToCheck, setActivePathToCheck] = useState<string[]>(initialPath);
    const [activeFile, setActiveFile] = useState<ColumnItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);

    const { getPublicUrl, deleteFile, moveFile } = useStorageActions();

    // Sync path with parent when using tabs
    useEffect(() => {
        if (onPathChange && activePathToCheck.length > 0) {
            onPathChange(activePathToCheck);
        }
    }, [activePathToCheck, onPathChange]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Miller columns navigation - each folder opens a new column
    const handleSelectItem = (item: ColumnItem, depth: number) => {
        const newPath = activePathToCheck.slice(0, depth);

        if (item.kind === "folder") {
            newPath.push(item.name);
            setActivePathToCheck(newPath);
            setActiveFile(null);
        } else {
            setActivePathToCheck(newPath);
            setActiveFile(item);
        }
    };

    // Toggle item selection
    const handleToggleSelect = useCallback((itemPath: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemPath)) {
                newSet.delete(itemPath);
            } else {
                newSet.add(itemPath);
            }
            // Enable/disable selection mode based on selection count
            setSelectionMode(newSet.size > 0);
            return newSet;
        });
    }, []);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
        setSelectionMode(false);
    }, []);

    // Bulk delete
    const handleBulkDelete = useCallback(async () => {
        const paths = Array.from(selectedItems);
        for (const path of paths) {
            deleteFile.mutate({ bucket: bucketName, path });
        }
        clearSelection();
    }, [selectedItems, bucketName, deleteFile, clearSelection]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        // Get the dragged item data with fullPath included
        const draggedData = active.data.current as ColumnItem & { fullPath?: string; sourcePath?: string };
        if (!draggedData || !draggedData.fullPath) return;

        // Get the target data
        const overData = over.data.current as { path: string; bucketName: string; isFolder?: boolean } | undefined;

        // Determine target path based on what we're dropping onto
        let targetPath: string;

        // IMPORTANT: Check isFolder FIRST - if it's a folder, use its path
        if (overData?.isFolder === true) {
            // Dropping onto a folder - use the folder's path as the target
            targetPath = overData.path;
        } else if (over.id === "root" || over.id === "") {
            // Dropping onto root column
            targetPath = "";
        } else if (overData && overData.isFolder === undefined) {
            // Column droppable (no isFolder property)
            targetPath = overData.path;
        } else {
            // Fallback to over.id
            targetPath = over.id as string;
        }

        // Don't allow dropping a folder into itself or its own children
        if (draggedData.kind === "folder" && targetPath.startsWith(draggedData.fullPath + "/")) {
            toast.error("Cannot move folder into itself");
            return;
        }
        if (draggedData.kind === "folder" && targetPath === draggedData.fullPath) {
            return;
        }

        // Don't allow dropping onto the same parent (unless dropping onto a folder in that parent)
        if (draggedData.sourcePath === targetPath && overData?.isFolder !== true) {
            return;
        }

        // Construct the destination path
        const fromPath = draggedData.fullPath;
        const toPath = targetPath ? `${targetPath}/${draggedData.name}` : draggedData.name;

        // Only move if paths are different
        if (fromPath !== toPath) {
            moveFile.mutate({
                bucket: bucketName,
                fromPath,
                toPath
            });
        }
    };

    // Build column paths for Miller columns layout
    const columnPaths = [""];
    let currentPath = "";
    for (const segment of activePathToCheck) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        columnPaths.push(currentPath);
    }

    // For mirrored mode, reverse the column order
    const displayPaths = mirrored ? [...columnPaths].reverse() : columnPaths;

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        // Mirrored scrolls to left (start), normal scrolls to right (end)
                        left: mirrored ? 0 : scrollContainerRef.current.scrollWidth,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [activePathToCheck, activeFile, mirrored]);

    // Get public URL for preview
    const getFilePublicUrl = useCallback(() => {
        if (!activeFile) return "";
        const filePath = (activePathToCheck.length > 0 ? activePathToCheck.join('/') + '/' : '') + activeFile.name;
        return getPublicUrl(bucketName, filePath);
    }, [activeFile, activePathToCheck, bucketName, getPublicUrl]);

    // Copy URL to clipboard
    const handleCopyUrl = useCallback(() => {
        const url = getFilePublicUrl();
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    }, [getFilePublicUrl]);

    // Download file
    const handleDownload = useCallback(() => {
        const url = getFilePublicUrl();
        window.open(url, '_blank');
    }, [getFilePublicUrl]);

    // Delete single file
    const handleDeleteFile = useCallback(() => {
        if (!activeFile) return;
        const filePath = (activePathToCheck.length > 0 ? activePathToCheck.join('/') + '/' : '') + activeFile.name;
        deleteFile.mutate({ bucket: bucketName, path: filePath });
        setActiveFile(null);
    }, [activeFile, activePathToCheck, bucketName, deleteFile]);

    return (
        <>
            {/* Bulk action bar */}
            {selectedItems.size > 0 && (
                <div className="h-10 bg-primary/10 border-b border-primary/20 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{selectedItems.size} selected</span>
                        <button
                            onClick={clearSelection}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleBulkDelete}
                            className="h-7"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            )}

            <div
                ref={scrollContainerRef}
                className={`flex-1 flex overflow-x-auto bg-background ${mirrored ? "justify-end" : ""}`}
            >
                {displayPaths.map((path, displayIndex) => {
                    // Map display index back to actual column index
                    const actualIndex = mirrored ? columnPaths.length - 1 - displayIndex : displayIndex;
                    const selectedSegment = activePathToCheck[actualIndex];
                    const isLastColumn = actualIndex === columnPaths.length - 1;
                    const selectedItemName = selectedSegment || (isLastColumn && activeFile ? activeFile.name : undefined);

                    return (
                        <StorageColumn
                            key={path || "root"}
                            bucketName={bucketName}
                            path={path}
                            activeItemName={selectedItemName}
                            searchQuery={searchQuery}
                            viewMode={viewMode}
                            selectedItems={selectedItems}
                            selectionMode={selectionMode || showCheckboxes}
                            showCheckboxes={showCheckboxes}
                            onSelectItem={(item) => handleSelectItem(item, actualIndex)}
                            onToggleSelect={handleToggleSelect}
                        />
                    );
                })}

                {/* File Preview Panel */}
                {activeFile && (
                    <div className="w-[320px] bg-card border-l p-6 flex flex-col items-center text-center relative flex-shrink-0 h-full border-border overflow-y-auto">
                        {/* Preview */}
                        {activeFile.kind === 'file' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(activeFile.name) ? (
                            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center">
                                <img
                                    src={getFilePublicUrl()}
                                    alt={activeFile.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ) : (
                            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        )}

                        <h3 className="font-semibold break-all text-sm">{activeFile.name}</h3>

                        {/* Metadata */}
                        <div className="mt-4 space-y-1 text-xs text-muted-foreground w-full">
                            {activeFile.metadata?.size && (
                                <div className="flex justify-between">
                                    <span>Size:</span>
                                    <span>{(activeFile.metadata.size / 1024).toFixed(1)} KB</span>
                                </div>
                            )}
                            {activeFile.metadata?.mimetype && (
                                <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span>{activeFile.metadata.mimetype}</span>
                                </div>
                            )}
                            {activeFile.updated_at && (
                                <div className="flex justify-between">
                                    <span>Modified:</span>
                                    <span>{new Date(activeFile.updated_at).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Public URL */}
                        <div className="mt-4 w-full">
                            <div className="text-xs text-muted-foreground mb-1 text-left">Public URL</div>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    readOnly
                                    value={getFilePublicUrl()}
                                    className="flex-1 text-xs bg-muted/50 border border-border rounded px-2 py-1 truncate"
                                />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCopyUrl}>
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(getFilePublicUrl(), '_blank')}>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-2 w-full">
                            <Button size="sm" className="flex-1" onClick={handleDownload}>
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Download
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleDeleteFile}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}
