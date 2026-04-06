import React from "react";
import { CircleSlash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CollectionEmptyStateProps {
  title: string;
  description: string;
}

export default function CollectionEmptyState({
  title,
  description,
}: CollectionEmptyStateProps) {
  return (
    <Card className="border-dashed bg-muted/10">
      <CardContent className="p-12 text-center">
        <CircleSlash2 className="mx-auto mb-4 h-14 w-14 text-muted-foreground/45" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">{title}</h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
