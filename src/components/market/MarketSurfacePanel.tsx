import { Loader2, SearchX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MarketFeaturedCard } from "./MarketFeaturedCard";
import type { MarketFeaturedItem } from "./types";

interface MarketSurfacePanelProps {
  title: string;
  description?: string;
  items: MarketFeaturedItem[] | undefined;
  emptyTitle?: string;
  emptyDescription?: string;
  showAdminEdit?: boolean;
  externalLinks?: Array<{ provider: string; url: string }>;
}

export function MarketSurfacePanel({
  title,
  description,
  items,
  emptyTitle = "No featured items yet",
  emptyDescription = "No active external placements are currently linked here.",
  showAdminEdit = false,
  externalLinks = [],
}: MarketSurfacePanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>
        <CardContent>
          {items === undefined ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading featured items…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
              <SearchX className="h-10 w-10 opacity-50" />
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{emptyTitle}</h3>
                <p>{emptyDescription}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <MarketFeaturedCard
                  key={item._id}
                  item={item}
                  showAdminEdit={showAdminEdit}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {externalLinks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Search Elsewhere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {externalLinks.map((externalLink) => (
                <a
                  key={`${externalLink.provider}:${externalLink.url}`}
                  href={externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted-foreground/15 hover:text-foreground"
                >
                  {externalLink.provider}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
