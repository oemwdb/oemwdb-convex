
import { useState, useRef, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { StorageColumn } from "./StorageColumn";
import { ColumnItem } from "./types";
import { Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MillerColumnsProps {
    bucketName: string;
    onMoveFile?: (fromPath: string, toPath: string) => void;
}

import { useStorageActions } from "@/hooks/useStorage";

export function MillerColumns({ bucketName, onMoveFile }: MillerColumnsProps) {
    // Path navigation state
    // [root, folderA, subfolderB]
    const [activePathToCheck, setActivePathToCheck] = useState<string[]>([]);
    const [activeFile, setActiveFile] = useState<ColumnItem | null>(null);
    const { getPublicUrl } = useStorageActions();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleSelectItem = (item: ColumnItem, depth: number) => {
        // If clicked item is at a depth, we want to slice the path to that depth
        // If it's a folder, append to path
        // If it's a file, define active file but don't append to path (or maybe append to show preview?)

        // Reset path after this depth
        const newPath = activePathToCheck.slice(0, depth);

        if (item.kind === "folder") {
            newPath.push(item.name);
            setActivePathToCheck(newPath);
            setActiveFile(null); // Deselect file if moving to a folder
        } else {
            setActivePathToCheck(newPath); // Keep path same
            setActiveFile(item);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        // active.id is the file name (or full path if we unique it)
        // over.id is the folder path ("root" or "folderA")

        // We need to know the SOURCE path of the dragged item? 
        // Ideally drag data contains the full source path.
        const item = active.data.current as ColumnItem; // We need to pass data
        // Wait, StorageItem passes `item`. But we need the context of "where did this item come from"
        // We can infer it? Or pass it in checks.

        console.log("Dropped", active.id, "over", over.id);
        // onMoveFile logic to come
        if (onMoveFile) {
            // onMoveFile(item.fullPath, over.id as string);
        }
    };

    // Columns to render:
    // Root (depth 0) -> Path ""
    // If activePath has "folderA" -> Render column for "folderA" (depth 1)
    // ...
    const columnsToRender = [
        "", // Root
        ...activePathToCheck
    ];

    // Actually, activePathToCheck represents the *selected folders*.
    // So if path is ["A", "B"], we render:
    // Col 0: root items. (Selected item: "A")
    // Col 1: contents of "A". (Selected item: "B")
    // Col 2: contents of "B". (Selected: null or file)

    // We need to look ahead one step?
    // Let's refine:
    // columns[0] = path ""
    // columns[1] = path "A" (if A is selected in col 0)
    // columns[2] = path "A/B" (if B is selected in col 1)

    // Construct paths
    const columnPaths = [""];
    let currentPath = "";
    for (const segment of activePathToCheck) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        columnPaths.push(currentPath);
    }

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to right when path or active file changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            // Scroll to the end to show new columns
            // Use setTimeout to allow DOM to update first (rendering the new column)
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        left: scrollContainerRef.current.scrollWidth,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [activePathToCheck, activeFile]);

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div
                ref={scrollContainerRef}
                className="flex h-full overflow-x-auto bg-background"
            >
                {columnPaths.map((path, index) => {
                    // Determine which item is selected in this column to highlight it
                    // The selected item is the NEXT segment in activePathToCheck, OR the activeFile if we are at the end
                    const selectedSegment = activePathToCheck[index];
                    const isLastColumn = index === columnPaths.length - 1;
                    const selectedItemName = selectedSegment || (isLastColumn && activeFile ? activeFile.name : undefined);

                    return (
                        <StorageColumn
                            key={path || "root"}
                            bucketName={bucketName}
                            path={path}
                            activeItemName={selectedItemName}
                            onSelectItem={(item) => handleSelectItem(item, index)}
                        />
                    );
                })}
                {/* If activeFile is selected, maybe show a preview column? */}
                {activeFile && (
                    <div className="w-[320px] bg-card border-l p-6 flex flex-col items-center justify-center text-center relative flex-shrink-0 h-full border-border">
                        {/* Render Preview */}
                        {activeFile.kind === 'file' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(activeFile.name) ? (
                            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center">
                                <img
                                    src={getPublicUrl(bucketName, (activePathToCheck.length > 0 ? activePathToCheck.join('/') + '/' : '') + activeFile.name)}
                                    alt={activeFile.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ) : (
                            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        )}

                        <h3 className="font-semibold break-all">{activeFile.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Size: {activeFile.metadata?.size ? (activeFile.metadata.size / 1024).toFixed(1) + ' KB' : 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Type: {activeFile.metadata?.mimetype || 'Unknown'}
                        </p>
                        <div className="mt-6 flex gap-2">
                            <Button size="sm">Download</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                        </div>
                    </div>
                )}
            </div>
            <DragOverlay>
                {/* Render a simple ghost item */}
                <div className="bg-popover border shadow-lg rounded px-3 py-2 flex items-center gap-2 opacity-80">
                    <FileText className="h-4 w-4" />
                    <span>Move item</span>
                </div>
            </DragOverlay>
        </DndContext>
    );
}
