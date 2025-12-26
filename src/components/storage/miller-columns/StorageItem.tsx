
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Folder, FileText, ChevronRight, Check, X, Pencil, Trash2, Copy, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnItem } from "./types";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface StorageItemProps {
    item: ColumnItem;
    sourcePath: string; // Full path to this item's parent folder
    isActive: boolean;
    isSelected?: boolean;
    selectionMode?: boolean;
    onClick: () => void;
    onToggleSelect?: (itemName: string) => void;
    onRename?: (oldName: string, newName: string) => void;
    onDelete?: (itemName: string) => void;
    onCopyUrl?: (itemName: string) => void;
    onDownload?: (itemName: string) => void;
    getPublicUrl?: (path: string) => string;
    bucketName?: string;
}

export function StorageItem({
    item,
    sourcePath,
    isActive,
    isSelected = false,
    selectionMode = false,
    onClick,
    onToggleSelect,
    onRename,
    onDelete,
    onCopyUrl,
    onDownload,
    getPublicUrl,
    bucketName
}: StorageItemProps) {
    // Full path for this item
    const fullPath = sourcePath ? `${sourcePath}/${item.name}` : item.name;

    // Draggable - include full path in data
    const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
        id: `drag-${fullPath}`,
        data: {
            ...item,
            fullPath,
            sourcePath
        },
    });

    // Droppable - only folders can be drop targets
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: fullPath,
        data: { path: fullPath, bucketName, isFolder: item.kind === "folder" },
        disabled: item.kind !== "folder",
    });

    // Combine refs
    const setNodeRef = useCallback((node: HTMLDivElement | null) => {
        setDragRef(node);
        setDropRef(node);
    }, [setDragRef, setDropRef]);

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const isImage = item.kind === "file" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);

    // Focus input when renaming starts
    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            const dotIndex = item.name.lastIndexOf('.');
            if (dotIndex > 0) {
                inputRef.current.setSelectionRange(0, dotIndex);
            } else {
                inputRef.current.select();
            }
        }
    }, [isRenaming, item.name]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectionMode) {
            setNewName(item.name);
            setIsRenaming(true);
        }
    }, [item.name, selectionMode]);

    const handleRenameSubmit = useCallback(() => {
        if (newName && newName !== item.name && onRename) {
            onRename(item.name, newName);
        }
        setIsRenaming(false);
    }, [newName, item.name, onRename]);

    const handleRenameCancel = useCallback(() => {
        setNewName(item.name);
        setIsRenaming(false);
    }, [item.name]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleRenameCancel();
        }
    }, [handleRenameSubmit, handleRenameCancel]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (isRenaming) return;

        if (selectionMode || e.metaKey || e.ctrlKey) {
            e.stopPropagation();
            onToggleSelect?.(item.name);
        } else {
            onClick();
        }
    }, [isRenaming, selectionMode, onClick, onToggleSelect, item.name]);

    const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect?.(item.name);
    }, [onToggleSelect, item.name]);

    // Context menu handlers
    const handleContextRename = useCallback(() => {
        setNewName(item.name);
        setIsRenaming(true);
    }, [item.name]);

    const handleContextDelete = useCallback(() => {
        onDelete?.(item.name);
    }, [onDelete, item.name]);

    const handleContextCopyUrl = useCallback(() => {
        onCopyUrl?.(item.name);
    }, [onCopyUrl, item.name]);

    const handleContextDownload = useCallback(() => {
        onDownload?.(item.name);
    }, [onDownload, item.name]);

    const handleContextOpenInNewTab = useCallback(() => {
        if (getPublicUrl) {
            window.open(getPublicUrl(item.name), '_blank');
        }
    }, [getPublicUrl, item.name]);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    ref={setNodeRef}
                    style={style}
                    {...(isRenaming ? {} : { ...listeners, ...attributes })}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    className={cn(
                        "flex items-center justify-between px-3 h-12 text-sm cursor-pointer select-none group transition-colors border-b border-border/40",
                        "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                        isActive && "bg-accent/50 text-accent-foreground border-border",
                        isSelected && "bg-primary/10 border-primary/30",
                        isDragging && "opacity-50",
                        isRenaming && "bg-muted/50",
                        // Highlight when being dragged over (for folders)
                        isOver && item.kind === "folder" && "bg-primary/20 ring-2 ring-primary/50"
                    )}
                >
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                        {/* Selection checkbox */}
                        {(selectionMode || isSelected) && (
                            <div
                                onClick={handleCheckboxClick}
                                className={cn(
                                    "h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors",
                                    isSelected
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-muted-foreground/50 hover:border-primary"
                                )}
                            >
                                {isSelected && <Check className="h-3 w-3" />}
                            </div>
                        )}

                        {item.kind === "folder" ? (
                            <Folder className={cn("h-5 w-5 shrink-0 fill-current", isActive ? "text-foreground" : "text-muted-foreground", isOver && "text-primary")} />
                        ) : isImage && getPublicUrl ? (
                            <img
                                src={getPublicUrl(item.name)}
                                alt={item.name}
                                className="h-9 w-9 rounded-sm object-cover border border-border bg-muted/50"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                }}
                            />
                        ) : (
                            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                        )}

                        {isRenaming ? (
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleRenameSubmit}
                                    className="flex-1 min-w-0 px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRenameSubmit(); }}
                                    className="p-1 hover:bg-muted rounded text-green-500"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRenameCancel(); }}
                                    className="p-1 hover:bg-muted rounded text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <span className="truncate flex-1 min-w-0 font-medium text-foreground/80" title={item.name}>{item.name}</span>
                        )}

                        {item.kind === "folder" && !isRenaming && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground/30 ml-auto shrink-0" />
                        )}
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-48">
                {item.kind === "file" && (
                    <>
                        <ContextMenuItem onClick={handleContextOpenInNewTab}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open in new tab
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleContextDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleContextCopyUrl}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}
                <ContextMenuItem onClick={handleContextRename}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleContextDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
