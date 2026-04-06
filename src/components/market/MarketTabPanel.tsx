import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package2 } from "lucide-react";
import { ConvexResourceStatusBadge } from "@/components/convex/ConvexResourceStatusBadge";
import { MarketListingCard } from "@/components/market/MarketListingCard";
import type { MarketSurfaceData } from "@/components/market/types";
import type { ConvexResourceStatus } from "@/hooks/useConvexResourceQuery";

interface MarketTabPanelProps {
  data: MarketSurfaceData | null | undefined;
  status: ConvexResourceStatus;
  emptyTitle: string;
  emptyDescription: string;
}

export function MarketTabPanel({
  data,
  status,
  emptyTitle,
  emptyDescription,
}: MarketTabPanelProps) {
  if (status === "initial_loading") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/60" />
            <p className="text-muted-foreground">Loading linked listings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const featuredListings = data?.featuredListings ?? [];
  const organicListings = data?.organicListings ?? [];
  const externalLinks = data?.externalLinks ?? [];
  const isRefreshing = status === "refreshing";

  if (featuredListings.length === 0 && organicListings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Package2 className="h-10 w-10 text-primary/50" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">{emptyTitle}</h3>
              <p className="mx-auto max-w-md text-muted-foreground">{emptyDescription}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/market">Open Marketplace Admin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {featuredListings.length > 0 ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Featured Listings</h3>
            <ConvexResourceStatusBadge
              status={status}
              label="Refreshing market surface"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Sponsored placements currently active on this surface.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredListings.map((listing) => (
              <MarketListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      {organicListings.length > 0 ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Linked Listings</h3>
            {!featuredListings.length ? (
              <ConvexResourceStatusBadge
                status={status}
                label="Refreshing market surface"
              />
            ) : null}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Active listings linked to this catalog target.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {organicListings.map((listing) => (
              <MarketListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      {externalLinks.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>External Market Links</CardTitle>
              {!featuredListings.length && !organicListings.length && isRefreshing ? (
                <ConvexResourceStatusBadge
                  status={status}
                  label="Refreshing market surface"
                />
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
