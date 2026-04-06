import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ConvexResourceStatus } from "@/hooks/useConvexResourceQuery";

interface ConvexResourceStatusBadgeProps {
  status: ConvexResourceStatus;
  label?: string;
}

export function ConvexResourceStatusBadge({
  status,
  label = "Refreshing",
}: ConvexResourceStatusBadgeProps) {
  if (status !== "refreshing") return null;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 rounded-full border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground"
    >
      <Loader2 className="h-3 w-3 animate-spin" />
      {label}
    </Badge>
  );
}
