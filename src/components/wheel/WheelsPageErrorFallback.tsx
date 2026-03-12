import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export function WheelsPageErrorFallback({ error, resetErrorBoundary }: Props) {
  const isConvexMissing =
    error?.message?.includes("Could not find public function") ||
    error?.message?.includes("wheelsListOnePage");

  return (
    <div className="flex items-center justify-center min-h-[40vh] p-6">
      <Card className="max-w-md w-full p-6 bg-muted/30 border-amber-500/20">
        <div className="flex flex-col items-center text-center gap-4">
          <Database className="h-12 w-12 text-amber-500/80" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {isConvexMissing ? "Wheels need Convex" : "Something went wrong"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isConvexMissing
                ? "From the project root run: npx convex dev — then refresh."
                : "Try refreshing the page."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  );
}
