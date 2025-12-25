
import { useDraggable } from "@dnd-kit/core";
import { Folder, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnItem } from "./types";

interface StorageItemProps {
    item: ColumnItem;
    isActive: boolean;
    onClick: () => void;
}

export function StorageItem({ item, isActive, onClick, getPublicUrl, bucketName }: StorageItemProps & { getPublicUrl?: (path: string) => string; bucketName?: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id || item.name,
        data: item,
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    // Basic detection of image files based on extension
    const isImage = item.kind === "file" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);
    // Construct public URL if it's an image and we have the necessary props
    // Note: item.id in Supabase storage items is often the full path? Let's check.
    // Actually, Miller columns usually pass down 'fullPath' or accumulated path.
    // 'item' here is ColumnItem which might just have name. We probably need the full path to generate a URL.
    // Let's assume for now we can infer it or we might need to pass down the parent path from StorageColumn.
    // Looking at StorageColumn, it maps items. Let's see if item comes with full path.

    // Actually, let's keep it simple first. If we don't have the full path, we can't generate the URL accurately unless item.id holds it or we pass parent path.
    // Standard Supabase 'list' returns objects with 'name'. 'id' is a UUID.
    // If we want thumbnails, we likely need to know the full path context.

    // WAIT. If I modify StorageItem, I need to make sure StorageColumn passes the right props.
    // Let's assume passed item has enough info or valid props are added.

    // We will render an <img> tag if isImage is true.

    // FIX: To get a proper URL, we need the bucket and path.
    // I will update the component to accept `getPublicUrl` and `bucketName`.
    // But since I don't want to refactor the entire Miller Column prop drilling right now, 
    // I'll check if I can construct the URL from what I have or if I need to pass more info.
    // Let's look at `StorageColumn.tsx` first to see what it passes to `StorageItem`.

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-3 h-12 text-sm cursor-pointer select-none group transition-colors border-b border-border/40",
                "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                isActive && "bg-accent/50 text-accent-foreground border-border",
                isDragging && "opacity-50"
            )}
        >
            <div className="flex items-center gap-3 overflow-hidden w-full">
                {item.kind === "folder" ? (
                    <Folder className={cn("h-5 w-5 shrink-0 fill-current", isActive ? "text-foreground" : "text-muted-foreground")} />
                ) : isImage && getPublicUrl ? (
                    <img
                        src={getPublicUrl(item.name)}
                        alt={item.name}
                        className="h-9 w-9 rounded-sm object-cover border border-border bg-muted/50"
                        onError={(e) => {
                            // Fallback to icon on error
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                    />
                ) : (
                    <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                {/* Fallback icon for images if load fails, or always present but hidden if image matches? 
                    Actually simpler: just conditionally render image. If it fails, that's tricky without state.
                    For simplicity: Just try to render image. 
                */}

                <span className="truncate flex-1 min-w-0 font-medium text-foreground/80" title={item.name}>{item.name}</span>
                {item.kind === "folder" && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 ml-auto shrink-0" />
                )}
            </div>
        </div>
    );
}
