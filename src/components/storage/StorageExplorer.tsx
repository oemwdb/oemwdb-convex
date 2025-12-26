
import React, { useState, useCallback, useRef } from "react";
import { BucketList } from "./BucketList";
import { MillerColumns } from "./miller-columns/MillerColumns";
import { useBuckets, useStorageActions } from "@/hooks/useStorage";
import { Loader2, Upload, FolderPlus, RefreshCw, X, Search, LayoutGrid, LayoutList } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ViewMode } from "./miller-columns/types";

export function StorageExplorer() {
    const { data: buckets, isLoading } = useBuckets();
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
    const { uploadFile } = useStorageActions();
    const queryClient = useQueryClient();
    const [isDragging, setIsDragging] = useState(false);

    // Create folder state
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const folderInputRef = useRef<HTMLInputElement>(null);

    // Search and view mode
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("list");

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

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!selectedBucket) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                uploadFile.mutate({ bucket: selectedBucket, path: "", file });
            });
        }
    }, [selectedBucket, uploadFile]);

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
        uploadFile.mutate({ bucket: selectedBucket, path: newFolderName.trim(), file: placeholderFile });

        setNewFolderName("");
        setShowCreateFolder(false);
    }, [newFolderName, selectedBucket, uploadFile]);

    const handleCreateFolderKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateFolder();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowCreateFolder(false);
            setNewFolderName("");
        }
    }, [handleCreateFolder]);

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
            onDrop={handleDrop}
        >
            {/* Drop Zone Overlay */}
            {isDragging && selectedBucket && (
                <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-primary">
                        <Upload className="h-12 w-12" />
                        <span className="text-lg font-medium">Drop files to upload</span>
                        <span className="text-sm text-muted-foreground">Files will be uploaded to {selectedBucket}</span>
                    </div>
                </div>
            )}

            {/* Sidebar for Buckets */}
            <div className="w-56 border-r border-border bg-muted/10 flex flex-col">
                <div className="p-3 border-b border-border bg-background/50 backdrop-blur-sm">
                    <h2 className="font-semibold text-sm px-1">Buckets</h2>
                </div>
                <BucketList
                    buckets={buckets || []}
                    selectedBucket={selectedBucket}
                    onSelect={setSelectedBucket}
                />
            </div>

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
                            placeholder="Enter folder name..."
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
                            onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }}
                            className="p-1 hover:bg-muted rounded text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {selectedBucket ? (
                    <div className="flex-1 h-full overflow-hidden">
                        <MillerColumns
                            bucketName={selectedBucket}
                            searchQuery={searchQuery}
                            viewMode={viewMode}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a bucket to view files
                    </div>
                )}
            </div>
        </div>
    );
}
