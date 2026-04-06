import { ArrowUpRight, CalendarClock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { MarketFeaturedItem } from "./types";

function formatPrice(price: number | null, currency: string) {
  if (price === null || Number.isNaN(price)) return "Price on destination";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency || "USD"} ${price}`;
  }
}

function formatDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString();
}

interface MarketFeaturedCardProps {
  item: MarketFeaturedItem;
  showAdminEdit?: boolean;
}

export function MarketFeaturedCard({ item, showAdminEdit = false }: MarketFeaturedCardProps) {
  const providerLabel = item.sourceProvider || "External";
  const locationLabel = item.location?.trim() || null;
  const expiresLabel = formatDate(item.endDate);
  const linkedObjects = item.linkedObjects.slice(0, 3);
  const hasPrice = item.price !== null && !Number.isNaN(item.price);
  const categoryLabel = item.listingType.replace(/_/g, " ");

  return (
    <Card className="group overflow-hidden border-border/60 bg-card/80 transition-colors hover:border-primary/30">
      <div className="relative aspect-[4/3] bg-muted/40">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Tag className="h-10 w-10 opacity-40" />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-2">
            <Badge className="border border-white/10 bg-background/85 capitalize text-foreground backdrop-blur">
              {providerLabel}
            </Badge>
            <Badge variant="outline" className="border-white/10 bg-background/70 capitalize text-foreground backdrop-blur">
              {categoryLabel}
            </Badge>
          </div>

          {hasPrice ? (
            <div className="rounded-full border border-white/10 bg-background/90 px-3 py-1 text-sm font-semibold tracking-tight shadow-sm backdrop-blur">
              {formatPrice(item.price, item.currency)}
            </div>
          ) : null}
        </div>
      </div>

      <CardContent className="space-y-3 p-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-5">{item.title}</h3>
              {item.shortDescription ? (
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.shortDescription}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            {item.sellerDisplayName ? (
              <span className="rounded-full bg-muted/50 px-2 py-1 text-foreground/85">
                {item.sellerDisplayName}
              </span>
            ) : null}
            {locationLabel ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
                <MapPin className="h-3.5 w-3.5" />
                {locationLabel}
              </span>
            ) : null}
            {expiresLabel ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {expiresLabel}
              </span>
            ) : null}
          </div>
        </div>

        {linkedObjects.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {linkedObjects.map((linkedObject) => (
              <Badge
                key={`${linkedObject.type}:${linkedObject.id}`}
                variant="outline"
                className="max-w-full border-border/70 text-[11px] text-muted-foreground"
              >
                <span className="truncate">{linkedObject.label}</span>
              </Badge>
            ))}
          </div>
        ) : null}

        {showAdminEdit ? (
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className={cn(
                "text-[11px]",
                item.placementCoverage === "membership" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {item.placementCoverage === "membership" ? "member" : `$${item.placementPriceUsd} spot`}
            </Badge>
            <Badge variant="outline" className="text-[11px] capitalize">
              {item.effectiveStatus}
            </Badge>
            {item.moderationStatus !== "approved" ? (
              <Badge variant="outline" className="text-[11px] capitalize">
                {item.moderationStatus}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div className={cn("grid gap-2", showAdminEdit ? "grid-cols-[1fr_auto]" : "grid-cols-1")}>
          {item.destinationUrl ? (
            <Button asChild className="w-full justify-between">
              <a href={item.destinationUrl} target="_blank" rel="noopener noreferrer">
                <span>Open listing</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}

          {showAdminEdit ? (
            <Button asChild variant="outline" className="px-3">
              <Link to={`/market/${item._id}`}>Manage</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
