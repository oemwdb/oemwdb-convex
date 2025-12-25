
import React, { useState } from "react";
import { BucketList } from "./BucketList";
import { MillerColumns } from "./miller-columns/MillerColumns";
import { useBuckets, useStorageActions } from "@/hooks/useStorage";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function StorageExplorer() {
    const { data: buckets, isLoading } = useBuckets();
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
    const { uploadFile } = useStorageActions();
    const queryClient = useQueryClient();

    // Initialize selected bucket if available and none selected
    React.useEffect(() => {
        if (buckets && buckets.length > 0 && !selectedBucket) {
            setSelectedBucket(buckets[0].name);
        }
    }, [buckets, selectedBucket]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                {/* Action Bar - flush with top border */}
                {selectedBucket && (
                    <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-card/50">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{selectedBucket}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["storage", "files"] })}
                                className="text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span className="opacity-75">↻</span> Reload
                            </button>
                            <div className="w-px h-3 bg-border mx-1" />
                            {/* View toggle can be added later, keeping visual */}
                            <button className="text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors opacity-50 cursor-not-allowed">
                                View
                            </button>
                            <div className="w-px h-3 bg-border mx-1" />
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
                                <button className="text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors pointer-events-none">
                                    ↑ Upload files
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    const folderName = prompt("Enter folder name:");
                                    if (folderName) {
                                        // Upload a placeholder to create folder
                                        const placeholderFile = new File([""], ".keep", { type: "text/plain" });
                                        uploadFile.mutate({ bucket: selectedBucket, path: folderName, file: placeholderFile });
                                    }
                                }}
                                className="text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                            >
                                + Create folder
                            </button>
                        </div>
                    </div>
                )}

                {selectedBucket ? (
                    <div className="flex-1 h-full overflow-hidden">
                        <MillerColumns bucketName={selectedBucket} />
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
