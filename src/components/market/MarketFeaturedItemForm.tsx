import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Link2, Plus, Search, SearchX, X } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type {
  MarketFeaturedItemFormValue,
  MarketLinkedObject,
  MarketLinkedObjectType,
  MarketSellerPlacementSummary,
} from "./types";

const PROVIDER_OPTIONS = ["eBay", "Tire Rack", "Bring a Trailer", "Facebook Marketplace", "External"];
const CATEGORY_OPTIONS = ["wheel", "wheel_set", "vehicle", "part", "tire", "accessory", "other"];

function normalizeSellerKey(rawValue: string, fallback: string) {
  const source = (rawValue || fallback || "seller").trim().toLowerCase();
  return source
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function labelForLinkedType(type: MarketLinkedObjectType) {
  return type.replace(/_/g, " ");
}

interface SearchResults {
  brands: MarketLinkedObject[];
  wheels: MarketLinkedObject[];
  wheelVariants: MarketLinkedObject[];
  vehicles: MarketLinkedObject[];
  vehicleVariants: MarketLinkedObject[];
}

interface MarketFeaturedItemFormProps {
  value: MarketFeaturedItemFormValue;
  onChange: (nextValue: MarketFeaturedItemFormValue) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canUseAdminQueries?: boolean;
  sellerSummary?: MarketSellerPlacementSummary | null;
  submitLabel: string;
}

export function MarketFeaturedItemForm({
  value,
  onChange,
  onSubmit,
  isSubmitting = false,
  canUseAdminQueries = false,
  sellerSummary = null,
  submitLabel,
}: MarketFeaturedItemFormProps) {
  const [linkSearch, setLinkSearch] = useState("");

  const linkResults = useQuery(
    api.market.adminLinkSearch,
    canUseAdminQueries && linkSearch.trim().length >= 2 ? { search: linkSearch.trim() } : "skip"
  ) as SearchResults | undefined;

  const normalizedSellerKey = useMemo(
    () => normalizeSellerKey(value.sellerKey, value.sellerDisplayName),
    [value.sellerDisplayName, value.sellerKey]
  );

  const updateField = <K extends keyof MarketFeaturedItemFormValue>(
    field: K,
    fieldValue: MarketFeaturedItemFormValue[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const addLinkedObject = (linkedObject: MarketLinkedObject) => {
    const nextLinkedObjects = [
      ...value.linkedObjects.filter((existing) => existing.type !== linkedObject.type),
      linkedObject,
    ];

    onChange({
      ...value,
      linkedObjects: nextLinkedObjects,
      title: value.title.trim().length > 0 ? value.title : linkedObject.label,
      imageUrl: value.imageUrl.trim().length > 0 ? value.imageUrl : linkedObject.imageUrl ?? "",
      listingType:
        value.listingType !== "other"
          ? value.listingType
          : linkedObject.type.includes("vehicle")
            ? "vehicle"
            : linkedObject.type.includes("wheel")
              ? "wheel"
              : value.listingType,
    });
  };

  const removeLinkedObject = (linkedObjectType: MarketLinkedObjectType) => {
    updateField(
      "linkedObjects",
      value.linkedObjects.filter((linkedObject) => linkedObject.type !== linkedObjectType)
    );
  };

  const flattenedResults = [
    ...(linkResults?.wheels ?? []),
    ...(linkResults?.wheelVariants ?? []),
    ...(linkResults?.vehicles ?? []),
    ...(linkResults?.vehicleVariants ?? []),
    ...(linkResults?.brands ?? []),
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <Card className="border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Link OEMWDB item</div>
            </div>

            <Input
              value={linkSearch}
              onChange={(event) => setLinkSearch(event.target.value)}
              placeholder="Search brands, wheels, wheel variants, vehicles"
              className="h-11"
            />

            {value.linkedObjects.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {value.linkedObjects.map((linkedObject) => (
                  <div
                    key={`${linkedObject.type}:${linkedObject.id}`}
                    className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-2"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-lg bg-muted">
                      {linkedObject.imageUrl ? (
                        <img
                          src={linkedObject.imageUrl}
                          alt={linkedObject.label}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <Link2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{linkedObject.label}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[11px] capitalize">
                          {labelForLinkedType(linkedObject.type)}
                        </Badge>
                        {linkedObject.subtitle ? (
                          <span className="truncate text-xs text-muted-foreground">
                            {linkedObject.subtitle}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeLinkedObject(linkedObject.type)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {linkSearch.trim().length >= 2 ? (
              flattenedResults.length > 0 ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {flattenedResults.slice(0, 10).map((result) => (
                    <button
                      key={`${result.type}:${result.id}`}
                      type="button"
                      onClick={() => addLinkedObject(result)}
                      className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/70 bg-card px-2 py-2 text-left transition-colors hover:border-primary/30 hover:bg-muted/20"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-lg bg-muted">
                        {result.imageUrl ? (
                          <img
                            src={result.imageUrl}
                            alt={result.label}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Link2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{result.label}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-[11px] capitalize">
                            {labelForLinkedType(result.type)}
                          </Badge>
                          {result.subtitle ? (
                            <span className="truncate text-xs text-muted-foreground">
                              {result.subtitle}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Plus className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/70 px-3 py-4 text-sm text-muted-foreground">
                  <SearchX className="h-4 w-4" />
                  No OEMWDB matches for this search.
                </div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                Search and attach the item this placement should live on.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-destination-url">Destination</Label>
              <Input
                id="market-destination-url"
                value={value.destinationUrl}
                onChange={(event) => updateField("destinationUrl", event.target.value)}
                placeholder="https://www.ebay.com/itm/..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-title">Title</Label>
              <Input
                id="market-title"
                value={value.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="BMW 666M complete wheel set"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-provider">Provider</Label>
              <Select value={value.sourceProvider} onValueChange={(provider) => updateField("sourceProvider", provider)}>
                <SelectTrigger id="market-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_OPTIONS.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-category">Category</Label>
              <Select value={value.listingType} onValueChange={(listingType) => updateField("listingType", listingType)}>
                <SelectTrigger id="market-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-price">Price</Label>
              <Input
                id="market-price"
                value={value.price}
                onChange={(event) => updateField("price", event.target.value)}
                inputMode="decimal"
                placeholder="1200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-currency">Currency</Label>
              <Input
                id="market-currency"
                value={value.currency}
                onChange={(event) => updateField("currency", event.target.value)}
                placeholder="USD"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-short-description">Card copy</Label>
              <Textarea
                id="market-short-description"
                value={value.shortDescription}
                onChange={(event) => updateField("shortDescription", event.target.value)}
                placeholder="Two short lines for the card."
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-image-url">Primary image</Label>
              <Input
                id="market-image-url"
                value={value.imageUrl}
                onChange={(event) => updateField("imageUrl", event.target.value)}
                placeholder="https://i.ebayimg.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-seller-display-name">Seller</Label>
              <Input
                id="market-seller-display-name"
                value={value.sellerDisplayName}
                onChange={(event) => updateField("sellerDisplayName", event.target.value)}
                placeholder="Seller display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-location">Location</Label>
              <Input
                id="market-location"
                value={value.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Belgium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-description">Notes</Label>
              <Textarea
                id="market-description"
                value={value.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Optional internal notes."
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="market-extra-images">Extra images</Label>
              <Textarea
                id="market-extra-images"
                value={value.extraImagesText}
                onChange={(event) => updateField("extraImagesText", event.target.value)}
                placeholder="One image URL per line"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-4">
            <div className="text-sm font-medium">Run</div>

            <div className="space-y-2">
              <Label htmlFor="market-coverage">Coverage</Label>
              <Select
                value={value.placementCoverage}
                onValueChange={(placementCoverage: "paid" | "membership") => updateField("placementCoverage", placementCoverage)}
              >
                <SelectTrigger id="market-coverage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">$1 / 30 days</SelectItem>
                  <SelectItem value="membership">$5 plan / 20 live</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-seller-key">Seller key</Label>
              <Input
                id="market-seller-key"
                value={value.sellerKey}
                onChange={(event) => updateField("sellerKey", event.target.value)}
                placeholder="stable-seller-key"
              />
              <div className="text-xs text-muted-foreground">
                {normalizedSellerKey || "seller"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="market-start-date">Start</Label>
                <Input
                  id="market-start-date"
                  type="date"
                  value={value.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-end-date">End</Label>
                <Input
                  id="market-end-date"
                  type="date"
                  value={value.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-moderation-status">Moderation</Label>
              <Select
                value={value.moderationStatus}
                onValueChange={(moderationStatus: "pending" | "approved" | "rejected") => updateField("moderationStatus", moderationStatus)}
              >
                <SelectTrigger id="market-moderation-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-status">Status</Label>
              <Select
                value={value.status}
                onValueChange={(status: "draft" | "active" | "inactive") => updateField("status", status)}
              >
                <SelectTrigger id="market-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {value.placementCoverage === "membership" ? (
              <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                {sellerSummary ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      {sellerSummary.activeMembershipPlacements}/{sellerSummary.includedMembershipSlots} used
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sellerSummary.remainingMembershipPlacements} remaining
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Enter a seller key to check plan usage.
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Button onClick={onSubmit} disabled={isSubmitting} className="w-full h-11">
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
