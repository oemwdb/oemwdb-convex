import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ConvexAdminAccessStatus } from "@/hooks/useConvexAuthDiagnostics";

interface ConvexAdminAccessCardProps {
  status: ConvexAdminAccessStatus;
  title: string;
  description: string;
  details?: string[];
  fullScreen?: boolean;
}

export function ConvexAdminAccessCard({
  status,
  title,
  description,
  details = [],
  fullScreen = false,
}: ConvexAdminAccessCardProps) {
  const content = (
    <Card className="border-border/60 bg-card/95">
      <CardContent className="space-y-4 p-6 text-center">
        {status === "loading" ? (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500/70" />
        )}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {details.length > 0 ? (
          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3 text-left text-xs text-muted-foreground">
            {details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  if (!fullScreen) return content;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl">{content}</div>
    </div>
  );
}
