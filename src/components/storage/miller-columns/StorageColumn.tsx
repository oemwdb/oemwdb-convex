
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFiles, useStorageActions } from "@/hooks/useStorage";
import { StorageItem } from "./StorageItem";
import { ColumnItem } from "./types";

interface StorageColumnProps {
    bucketName: string;
    path: string;
    activeItemName?: string;
    onSelectItem: (item: ColumnItem) => void;
}

export function StorageColumn({ bucketName, path, activeItemName, onSelectItem }: StorageColumnProps) {
    const { data: files, isLoading } = useFiles(bucketName, path);
    const { getPublicUrl } = useStorageActions();
    const [items, setItems] = useState<ColumnItem[]>([]);

    // We need to act as a droppable zone for this folder path
    const { setNodeRef } = useDroppable({
        id: path || "root", // Use path as ID so we know where items are dropped
        data: { path, bucketName }
    });

    useEffect(() => {
        if (files) {
            // Process files to separate folders (no ID, just metadata is null usually OR conventions)
            // Supabase Storage `list` doesn't explicitly distinguish folder vs file easily without metadata check
            // But typically folders are derived or we use a convention. 
            // Supabase `list` returns objects. If an object is a "placeholder" for a folder it might have size 0.
            // But actually, `transform` in useFiles/Supabase client logic usually handles this? 
            // Wait, `list` returns files in the folder. 
            // If we see a file named `.keep` it might be a folder placeholder.
            // Actually, Supabase Storage folders are virtual. We likely need a recursive strategy or just rely on what's keys?
            // Standard supabase `list()`: NO, standard `list` DOES return folders if they are implicit?
            // Actually, if we use `list(path)` it lists contents.
            // If we rely on the generic response:
            // Objects with `id` are files.
            // If `name` ends with `/` ?? No.

            // Let's assume for now everything is a file unless we implement better folder detection logic.
            // BUT `StorageFile` interface has metadata.
            // Let's check `metadata` to see if it's a folder? 
            // Usually Supabase returns folders as items where `id` is null? 
            // Let's verify this assumption with `debug_files.mjs` later, or just assume standard behavior.
            const processed: ColumnItem[] = files.map(f => ({
                ...f,
                kind: !f.id ? "folder" : "file" // Supabase JS usually returns folders with null ID in list()
            }));
            setItems(processed);
        }
    }, [files]);

    return (
        <div className="w-[360px] min-w-[360px] flex-shrink-0 border-r border-border h-full flex flex-col bg-background/50" ref={setNodeRef}>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2 opacity-50">
                            <span className="text-xs">Empty</span>
                        </div>
                    ) : (
                        items.map((item) => (
                            <StorageItem
                                key={item.name}
                                item={item}
                                isActive={item.name === activeItemName}
                                onClick={() => onSelectItem(item)}
                                bucketName={bucketName}
                                getPublicUrl={(itemPath) => getPublicUrl(bucketName, `${path ? path + '/' : ''}${itemPath}`)}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
