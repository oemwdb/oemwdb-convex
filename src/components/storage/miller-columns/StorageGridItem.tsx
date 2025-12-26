
import React, { useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Folder, FileText, Check, Pencil, Trash2, Copy, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnItem } from "./types";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface StorageGridItemProps {
    item: ColumnItem;
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

export function StorageGridItem({
    item,
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
}: StorageGridItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id || item.name,
        data: item,
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const isImage = item.kind === "file" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (selectionMode || e.metaKey || e.ctrlKey) {
            e.stopPropagation();
            onToggleSelect?.(item.name);
        } else {
            onClick();
        }
    }, [selectionMode, onClick, onToggleSelect, item.name]);

    const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect?.(item.name);
    }, [onToggleSelect, item.name]);

    // Context menu handlers
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
                    {...listeners}
                    {...attributes}
                    onClick={handleClick}
                    className={cn(
                        "relative flex flex-col items-center p-2 rounded-lg cursor-pointer select-none group transition-colors",
                        "hover:bg-muted/50",
                        isActive && "bg-accent/50 ring-1 ring-accent",
                        isSelected && "bg-primary/10 ring-1 ring-primary/30",
                        isDragging && "opacity-50"
                    )}
                >
                    {/* Selection checkbox */}
                    {(selectionMode || isSelected) && (
                        <div
                            onClick={handleCheckboxClick}
                            className={cn(
                                "absolute top-1 left-1 h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors z-10",
                                isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/50 hover:border-primary bg-background/80"
                            )}
                        >
                            {isSelected && <Check className="h-3 w-3" />}
                        </div>
                    )}

                    {/* Thumbnail */}
                    <div className="w-full aspect-square rounded-md overflow-hidden bg-muted/30 border border-border flex items-center justify-center mb-2">
                        {item.kind === "folder" ? (
                            <Folder className="h-10 w-10 text-muted-foreground fill-current" />
                        ) : isImage && getPublicUrl ? (
                            <img
                                src={getPublicUrl(item.name)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>

                    {/* Filename */}
                    <span className="text-xs text-center truncate w-full text-muted-foreground group-hover:text-foreground" title={item.name}>
                        {item.name}
                    </span>
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
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleContextDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
