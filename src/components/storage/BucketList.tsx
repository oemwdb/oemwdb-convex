import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BucketListProps {
    buckets: StorageBucket[];
    selectedBucket: string | null;
    onSelect: (bucketName: string) => void;
}

export function BucketList({ buckets, selectedBucket, onSelect }: BucketListProps) {
    if (buckets.length === 0) {
        return <div className="p-4 text-sm text-muted-foreground">No buckets found</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {buckets.map((bucket) => (
                <Button
                    key={bucket.id}
                    variant={selectedBucket === bucket.name ? "secondary" : "ghost"}
                    className={cn(
                        "w-full justify-start gap-2 h-9 px-3 font-normal",
                        selectedBucket === bucket.name && "bg-secondary"
                    )}
                    onClick={() => onSelect(bucket.name)}
                >
                    <span className="truncate flex-1 text-left">{bucket.name}</span>
                </Button>
            ))}
        </div>
    );
}
