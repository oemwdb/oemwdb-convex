
import React, { useState, useCallback, useRef } from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, pointerWithin, rectIntersection, CollisionDetection } from "@dnd-kit/core";
import { BucketList } from "./BucketList";
import { MillerColumns } from "./miller-columns/MillerColumns";
import { Loader2, Upload, FolderPlus, RefreshCw, X, Search, LayoutGrid, LayoutList, CheckSquare, Folder, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ViewMode, ColumnItem } from "./miller-columns/types";

export function StorageExplorer() {
    const { data: buckets, isLoading } = useBuckets();
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
    const { uploadFile } = useStorageActions();
    const queryClient = useQueryClient();
    const [isDragging, setIsDragging] = useState(false);

    // Dual pane state
    const [leftPanePath, setLeftPanePath] = useState<string[]>([]);
    const [rightPanePath, setRightPanePath] = useState<string[]>([]);
    const [activePane, setActivePane] = useState<"left" | "right">("left");

    // Resizable panes
    const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Create folder state
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [createFolderPath, setCreateFolderPath] = useState<string>(""); // parent path for new folder
    const folderInputRef = useRef<HTMLInputElement>(null);

    // Search and view mode
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    // DnD for cross-pane moves
    const [draggedItem, setDraggedItem] = useState<ColumnItem | null>(null);
    const { moveFile } = useStorageActions();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    // Custom collision detection that prioritizes folder targets over column targets
    const customCollisionDetection: CollisionDetection = useCallback((args) => {
        // First, get all collisions using pointerWithin
        const collisions = pointerWithin(args);

        if (collisions.length === 0) {
            // Fall back to rect intersection if pointer isn't inside any droppable
            return rectIntersection(args);
        }

        // Prioritize folder droppables over column droppables
        // Folder IDs contain paths like "BADPICS" or "left:BADPICS"
        // Column IDs are like "root" or "left:root" or just paths
        const folderCollisions = collisions.filter(collision => {
            const data = collision.data?.droppableContainer?.data?.current;
            return data?.isFolder === true;
        });

        // If we have folder collisions, prefer those
        if (folderCollisions.length > 0) {
            return folderCollisions;
        }

        return collisions;
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setDraggedItem(null);

        if (!over || !selectedBucket) return;

        const draggedData = active.data.current as { fullPath: string; name: string; kind: string } | undefined;
        if (!draggedData) return;

        // Get the target folder path from data (not over.id which includes paneId prefix)
        const overData = over.data.current as { path: string; bucketName: string; paneId?: string } | undefined;
        const targetPath = overData?.path || "";

        // Build the destination path
        const fromPath = draggedData.fullPath;
        const toPath = targetPath ? `${targetPath}/${draggedData.name}` : draggedData.name;

        if (fromPath !== toPath) {
            moveFile.mutate({
                bucket: selectedBucket,
                fromPath,
                toPath
            });
        }
    }, [selectedBucket, moveFile]);

    // Initialize selected bucket if available and none selected
    React.useEffect(() => {
        if (buckets && buckets.length > 0 && !selectedBucket) {
            setSelectedBucket(buckets[0].name);
        }
    }, [buckets, selectedBucket]);

    // Focus input when create folder dialog opens
    React.useEffect(() => {
        if (showCreateFolder && folderInputRef.current) {
            folderInputRef.current.focus();
        }
    }, [showCreateFolder]);

    // Pane-specific drag states
    const [leftPaneDragging, setLeftPaneDragging] = useState(false);
    const [rightPaneDragging, setRightPaneDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    }, []);

    // Left pane drop handlers
    const handleLeftDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLeftPaneDragging(true);
    }, []);

    const handleLeftDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setLeftPaneDragging(false);
        }
    }, []);

    const handleLeftDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLeftPaneDragging(false);

        if (!selectedBucket) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const uploadPath = leftPanePath.join('/');
            Array.from(files).forEach(file => {
                // Accept all files, not just images
                uploadFile.mutate({ bucket: selectedBucket, path: uploadPath, file });
            });
        }
    }, [selectedBucket, uploadFile, leftPanePath]);

    // Right pane drop handlers
    const handleRightDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRightPaneDragging(true);
    }, []);

    const handleRightDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setRightPaneDragging(false);
        }
    }, []);

    const handleRightDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRightPaneDragging(false);

        if (!selectedBucket) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const uploadPath = rightPanePath.join('/');
            Array.from(files).forEach(file => {
                // Accept all files, not just images
                uploadFile.mutate({ bucket: selectedBucket, path: uploadPath, file });
            });
        }
    }, [selectedBucket, uploadFile, rightPanePath]);

    const handleCreateFolder = useCallback(() => {
        if (!newFolderName.trim() || !selectedBucket) return;

        const pngData = new Uint8Array([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
            0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
        ]);
        const placeholderFile = new File([pngData], ".folder.png", { type: "image/png" });

        // Create folder path: parentPath/folderName
        const fullFolderPath = createFolderPath
            ? `${createFolderPath}/${newFolderName.trim()}`
            : newFolderName.trim();

        uploadFile.mutate({ bucket: selectedBucket, path: fullFolderPath, file: placeholderFile });

        setNewFolderName("");
        setCreateFolderPath("");
        setShowCreateFolder(false);
    }, [newFolderName, selectedBucket, uploadFile, createFolderPath]);

    // Handler for context menu "New Folder"
    const handleContextMenuCreateFolder = useCallback((parentPath: string) => {
        setCreateFolderPath(parentPath);
        setShowCreateFolder(true);
    }, []);

    const handleCreateFolderKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateFolder();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowCreateFolder(false);
            setNewFolderName("");
            setCreateFolderPath("");
        }
    }, [handleCreateFolder]);

    // Pane path updates
    const updateLeftPanePath = useCallback((path: string[]) => {
        setLeftPanePath(path);
    }, []);

    const updateRightPanePath = useCallback((path: string[]) => {
        setRightPanePath(path);
    }, []);

    // Resize handlers - allow panes to collapse when pushed to edges
    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const handleResizeMove = useCallback((e: React.MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newWidth = ((e.clientX - rect.left) / rect.width) * 100;

        // Snap to edges when close enough (collapse pane)
        if (newWidth < 10) newWidth = 0;
        else if (newWidth > 90) newWidth = 100;

        setLeftPaneWidth(newWidth);
    }, [isResizing]);

    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div
            className="flex h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {/* Global drag indicator - but drops handled per-pane */}
            {isDragging && selectedBucket && (
                <div className="absolute inset-0 z-40 pointer-events-none">
                    <div className="h-full w-full flex items-center justify-center bg-primary/5">
                        <div className="flex flex-col items-center gap-2 text-primary/70">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm font-medium">Drop images in a pane to upload</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content for Files */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Action Bar */}
                {selectedBucket && (
                    <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-card/50 gap-3">
                        {/* Left: Bucket name and search */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="font-medium text-sm text-foreground shrink-0">{selectedBucket}</span>

                            {/* Search */}
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Filter files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-7 pl-7 pr-2 text-xs bg-muted/50 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1">
                            {/* View Toggle */}
                            <div className="flex items-center border border-border rounded overflow-hidden">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                    title="List view"
                                >
                                    <LayoutList className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                    title="Grid view"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="w-px h-4 bg-border mx-1" />

                            <button
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["storage", "files"] })}
                                className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </button>

                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            Array.from(e.target.files).forEach(file => {
                                                uploadFile.mutate({ bucket: selectedBucket, path: "", file });
                                            });
                                        }
                                    }}
                                />
                                <button
                                    className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors pointer-events-none"
                                    title="Upload files"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowCreateFolder(true)}
                                className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                                title="New folder"
                            >
                                <FolderPlus className="h-3.5 w-3.5" />
                            </button>

                            <button
                                onClick={() => setShowCheckboxes(!showCheckboxes)}
                                className={`p-1.5 rounded transition-colors ${showCheckboxes ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                                title={showCheckboxes ? "Hide checkboxes" : "Show checkboxes"}
                            >
                                <CheckSquare className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Folder Inline Input */}
                {showCreateFolder && selectedBucket && (
                    <div className="h-10 border-b border-border flex items-center px-3 bg-muted/30 gap-2">
                        <FolderPlus className="h-4 w-4 text-muted-foreground" />
                        <input
                            ref={folderInputRef}
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={handleCreateFolderKeyDown}
                            placeholder={createFolderPath ? `New folder in /${createFolderPath}...` : "Enter folder name..."}
                            className="flex-1 text-sm bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim()}
                            className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => { setShowCreateFolder(false); setNewFolderName(""); setCreateFolderPath(""); }}
                            className="p-1 hover:bg-muted rounded text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {selectedBucket ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={customCollisionDetection}
                        onDragEnd={handleDragEnd}
                    >
                        <div
                            ref={containerRef}
                            className="flex-1 flex overflow-hidden"
                            onMouseMove={isResizing ? handleResizeMove : undefined}
                            onMouseUp={isResizing ? handleResizeEnd : undefined}
                            onMouseLeave={isResizing ? handleResizeEnd : undefined}
                        >
                            {/* Left Pane - hidden when collapsed */}
                            {leftPaneWidth > 0 && (
                                <div
                                    className={`flex flex-col overflow-hidden relative ${activePane === "left" ? "ring-2 ring-primary/30 ring-inset" : ""} ${leftPaneDragging ? "ring-2 ring-blue-500 ring-inset" : ""}`}
                                    style={{ width: leftPaneWidth === 100 ? '100%' : `${leftPaneWidth}%` }}
                                    onClick={() => setActivePane("left")}
                                    onDragOver={handleLeftDragOver}
                                    onDragLeave={handleLeftDragLeave}
                                    onDrop={handleLeftDrop}
                                >
                                    {/* Left pane drop indicator */}
                                    {leftPaneDragging && (
                                        <div className="absolute inset-0 z-50 bg-blue-500/10 flex items-center justify-center pointer-events-none">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="h-8 w-8 text-blue-500" />
                                                <span className="text-sm font-medium text-blue-600">Drop to /{leftPanePath.join('/') || 'root'}</span>
                                            </div>
                                        </div>
                                    )}
                                    <MillerColumns
                                        key="left"
                                        paneId="left"
                                        bucketName={selectedBucket}
                                        searchQuery={searchQuery}
                                        viewMode={viewMode}
                                        showCheckboxes={showCheckboxes}
                                        initialPath={leftPanePath}
                                        onPathChange={updateLeftPanePath}
                                        onCreateFolder={handleContextMenuCreateFolder}
                                    />
                                </div>
                            )}

                            {/* Resizable Divider */}
                            <div
                                className={`w-1.5 flex-shrink-0 cursor-col-resize transition-colors border-x border-border ${isResizing ? "bg-primary" : "bg-muted hover:bg-primary/50"}`}
                                onMouseDown={handleResizeStart}
                            />

                            {/* Right Pane - hidden when collapsed */}
                            {leftPaneWidth < 100 && (
                                <div
                                    className={`flex flex-col overflow-hidden relative ${activePane === "right" ? "ring-2 ring-primary/30 ring-inset" : ""} ${rightPaneDragging ? "ring-2 ring-green-500 ring-inset" : ""}`}
                                    style={{ width: leftPaneWidth === 0 ? '100%' : `${100 - leftPaneWidth}%` }}
                                    onClick={() => setActivePane("right")}
                                    onDragOver={handleRightDragOver}
                                    onDragLeave={handleRightDragLeave}
                                    onDrop={handleRightDrop}
                                >
                                    {/* Right pane drop indicator */}
                                    {rightPaneDragging && (
                                        <div className="absolute inset-0 z-50 bg-green-500/10 flex items-center justify-center pointer-events-none">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="h-8 w-8 text-green-500" />
                                                <span className="text-sm font-medium text-green-600">Drop to /{rightPanePath.join('/') || 'root'}</span>
                                            </div>
                                        </div>
                                    )}
                                    <MillerColumns
                                        key="right"
                                        paneId="right"
                                        bucketName={selectedBucket}
                                        searchQuery={searchQuery}
                                        viewMode={viewMode}
                                        showCheckboxes={showCheckboxes}
                                        initialPath={rightPanePath}
                                        mirrored={true}
                                        onPathChange={updateRightPanePath}
                                        onCreateFolder={handleContextMenuCreateFolder}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Drag overlay */}
                        <DragOverlay>
                            {draggedItem && (
                                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                                    {draggedItem.kind === "folder" ? (
                                        <Folder className="h-4 w-4 text-blue-400" />
                                    ) : (
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="text-sm">{draggedItem.name}</span>
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a bucket to view files
                    </div>
                )}
            </div>
        </div>
    );
}
