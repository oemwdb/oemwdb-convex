import { CircleSlash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getConvexErrorMessage } from "@/lib/convexErrors";

interface ConvexBackendUnavailableCardProps {
  title: string;
  description: string;
  error?: unknown;
}

export function ConvexBackendUnavailableCard({
  title,
  description,
  error,
}: ConvexBackendUnavailableCardProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardContent className="space-y-3 p-6 text-center">
        <CircleSlash2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {error ? (
          <p className="text-xs text-muted-foreground">
            {getConvexErrorMessage(error)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
