import { useMemo, useState } from "react";
import { useConvexAuth } from "convex/react";
import { Link } from "react-router-dom";
import { CircleSlash2, FilterX, Loader2, Package2, ShieldCheck } from "lucide-react";

import { api } from "../../convex/_generated/api";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MarketFeaturedCard } from "@/components/market/MarketFeaturedCard";
import type { MarketFeaturedItem } from "@/components/market/types";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getConvexErrorMessage, isUnauthorizedConvexError } from "@/lib/convexErrors";
import { cn } from "@/lib/utils";

type BrowseResponse = {
  pricing: {
    singlePlacementUsd: number;
    placementDurationDays: number;
    membershipPriceUsd: number;
    membershipIncludedSlots: number;
  };
  items: MarketFeaturedItem[];
};

type AdminIndexResponse = {
  summary: {
    total: number;
    live: number;
    pendingModeration: number;
    membershipCovered: number;
    paidPlacements: number;
  };
  items: MarketFeaturedItem[];
};

export default function MarketPage() {
  const { isAdmin } = useAuth();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const [searchValue, setSearchValue] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const browseResource = useConvexResourceQuery<BrowseResponse>({
    queryKey: ["market", "browseFeaturedItems"],
    queryRef: api.market.browseFeaturedItems,
    args: {},
    staleTime: 30_000,
  });
  const browseData = browseResource.data;
  const canReadAdminMarket = isAdmin && isConvexAuthenticated && !isConvexAuthLoading;
  const adminResource = useConvexResourceQuery<AdminIndexResponse>({
    queryKey: ["market", "adminFeaturedItemsIndex"],
    queryRef: api.market.adminFeaturedItemsIndex,
    args: canReadAdminMarket ? {} : "skip",
    staleTime: 15_000,
  });
  const adminData = adminResource.data;

  const filteredItems = useMemo(() => {
    const items = browseData?.items ?? [];
    const term = searchValue.trim().toLowerCase();

    return items.filter((item) => {
      if (providerFilter !== "all" && item.sourceProvider !== providerFilter) return false;
      if (categoryFilter !== "all" && item.listingType !== categoryFilter) return false;

      if (!term) return true;
      const haystack = [
        item.title,
        item.shortDescription ?? "",
        item.sellerDisplayName ?? "",
        item.location ?? "",
        item.sourceProvider,
        ...item.linkedObjects.map((linkedObject) => linkedObject.label),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [browseData?.items, categoryFilter, providerFilter, searchValue]);

  const providerOptions = useMemo(
    () => [...new Set((browseData?.items ?? []).map((item) => item.sourceProvider).filter(Boolean))],
    [browseData?.items]
  );
  const categoryOptions = useMemo(
    () => [...new Set((browseData?.items ?? []).map((item) => item.listingType).filter(Boolean))],
    [browseData?.items]
  );

  const totalLive = browseData?.items.length ?? 0;
  const hasActiveFilters = !!searchValue || providerFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearchValue("");
    setProviderFilter("all");
    setCategoryFilter("all");
  };

  if (browseResource.isInitialLoading) {
    return (
      <DashboardLayout title="Market" disableContentPadding={true}>
        <div className="flex h-full items-center justify-center p-2">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (browseResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Market" disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <ConvexBackendUnavailableCard
            title="Market is not deployed on cloud dev yet"
            description="The canonical market queries are missing from the cloud dev Convex deployment."
            error={browseResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (browseResource.error) {
    return (
      <DashboardLayout title="Market" disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
              <CircleSlash2 className="h-10 w-10 opacity-40" />
              <div className="space-y-1">
                <div className="text-base font-medium text-foreground">Could not load market</div>
                <div className="text-sm">{getConvexErrorMessage(browseResource.error)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Market"
      disableContentPadding={true}
      headerActions={
        isAdmin ? (
          <Button asChild size="sm">
            <Link to="/market/new">Create Item</Link>
          </Button>
        ) : undefined
      }
    >
      <div className="h-full overflow-y-auto p-2">
        <div className="mx-auto max-w-7xl space-y-4 p-4">
          <Card className="overflow-hidden border-border/60 bg-card/70">
            <CardContent className="space-y-4 p-4">
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search listings, sellers, brands, wheels, vehicles"
                  className="h-11"
                />

                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All providers</SelectItem>
                    {providerOptions.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Package2 className="h-3.5 w-3.5" />
                  {filteredItems.length}/{totalLive} live
                </Badge>
                <Badge variant="outline">
                  ${browseData?.pricing.singlePlacementUsd ?? 1} / {browseData?.pricing.placementDurationDays ?? 30}d
                </Badge>
                <Badge variant="outline">
                  ${browseData?.pricing.membershipPriceUsd ?? 5} / {browseData?.pricing.membershipIncludedSlots ?? 20} live
                </Badge>
                {hasActiveFilters ? (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-muted-foreground">
                    <FilterX className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {isAdmin ? (
            <Card className="border-border/50 bg-muted/15">
              <CardContent className="space-y-3 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </Badge>
                  {!canReadAdminMarket ? (
                    <span className="text-sm text-muted-foreground">Syncing Convex auth…</span>
                  ) : adminData ? (
                    <>
                      <Badge variant="outline">{adminData.summary.live} live</Badge>
                      <Badge variant="outline">{adminData.summary.pendingModeration} pending</Badge>
                      <Badge variant="outline">{adminData.summary.membershipCovered} member</Badge>
                      <Badge variant="outline">{adminData.summary.paidPlacements} paid</Badge>
                    </>
                  ) : adminResource.error ? (
                    <span className="text-sm text-muted-foreground">
                      {isUnauthorizedConvexError(adminResource.error)
                        ? "Admin market summary unavailable for this session"
                        : "Admin market summary failed to load"}
                    </span>
                  ) : null}
                </div>

                {canReadAdminMarket && adminData && adminData.items.length > 0 ? (
                  <div className="grid gap-2 xl:grid-cols-2">
                    {adminData.items.slice(0, 6).map((item) => (
                      <div
                        key={item._id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-card/70 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{item.title}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {item.sourceProvider} • {item.sellerDisplayName ?? "Unknown seller"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[11px] capitalize",
                              item.effectiveStatus === "active" && "border-primary/30 text-primary"
                            )}
                          >
                            {item.effectiveStatus}
                          </Badge>
                          <Button asChild size="sm" variant="ghost">
                            <Link to={`/market/${item._id}`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {browseData === undefined ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading market placements…
              </CardContent>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                <CircleSlash2 className="h-10 w-10 opacity-40" />
                <div className="space-y-1">
                  <div className="text-base font-medium text-foreground">Nothing here yet</div>
                  <div className="text-sm">
                    {hasActiveFilters ? "Try loosening the filters." : "No live featured items right now."}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredItems.map((item) => (
                <MarketFeaturedCard
                  key={item._id}
                  item={item}
                  showAdminEdit={!!canReadAdminMarket}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
