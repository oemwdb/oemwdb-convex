import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, MapPin, Package2, Star } from "lucide-react";
import type { MarketListingSummary } from "@/components/market/types";

function formatPrice(price: number | null) {
  if (!price) return "Contact for price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCondition(condition: MarketListingSummary["condition"]) {
  if (!condition) return null;
  if (condition === "like-new") return "Like New";
  if (condition === "parts") return "For Parts";
  return `${condition.charAt(0).toUpperCase()}${condition.slice(1)}`;
}

function formatStatus(status: MarketListingSummary["status"]) {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function promotionLabel(slotType: "top_slot" | "featured_row" | "boosted") {
  switch (slotType) {
    case "top_slot":
      return "Top Slot";
    case "featured_row":
      return "Featured";
    case "boosted":
      return "Boosted";
    default:
      return "Promoted";
  }
}

interface MarketListingCardProps {
  listing: MarketListingSummary;
}

export function MarketListingCard({ listing }: MarketListingCardProps) {
  const conditionLabel = formatCondition(listing.condition);
  const targetBadges = [
    listing.linkedTargets.brand?.label,
    listing.linkedTargets.vehicle?.label,
    listing.linkedTargets.wheel?.label,
    listing.linkedTargets.wheelVariant?.label,
  ].filter(Boolean);

  return (
    <Card className="overflow-hidden border-border/50 bg-card/90 hover:border-border transition-all hover:shadow-sm">
      <div className="relative aspect-[4/3] bg-muted">
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package2 className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          <Badge className="text-xs capitalize">{listing.listing_type}</Badge>
          <Badge variant="outline" className="text-xs">
            {formatStatus(listing.status)}
          </Badge>
          {listing.surfacePromotion ? (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Star className="h-3 w-3" />
              {promotionLabel(listing.surfacePromotion.slot_type)}
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-medium">{listing.title}</h3>
            {conditionLabel ? (
              <p className="mt-1 text-xs text-muted-foreground">{conditionLabel}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(listing.price)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {targetBadges.map((target) => (
            <Badge key={target} variant="outline" className="text-xs">
              {target}
            </Badge>
          ))}
          {listing.activePromotionCount ? (
            <Badge variant="secondary" className="text-xs">
              {listing.activePromotionCount} active promo{listing.activePromotionCount === 1 ? "" : "s"}
            </Badge>
          ) : null}
          {listing.scheduledPromotionCount ? (
            <Badge variant="outline" className="text-xs">
              {listing.scheduledPromotionCount} scheduled
            </Badge>
          ) : null}
        </div>

        {(listing.location || listing.shipping_available) ? (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {listing.location ? (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{listing.location}</span>
              </div>
            ) : null}
            {listing.shipping_available ? (
              <Badge variant="outline" className="h-5 text-xs">Ships</Badge>
            ) : null}
          </div>
        ) : null}

        {listing.seller_profile ? (
          <div className="flex items-center gap-2 border-t border-border/50 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={listing.seller_profile.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {listing.seller_profile.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              {listing.seller_profile.display_name || listing.seller_profile.username}
            </span>
          </div>
        ) : null}

        <Button asChild variant="outline" className="w-full">
          <Link to={`/market/${listing._id}`}>Manage Listing</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
