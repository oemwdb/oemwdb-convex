import React from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { ConvexResourceStatusBadge } from "@/components/convex/ConvexResourceStatusBadge";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import {
  Activity,
  Database,
  Disc3,
  GitBranch,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

type CoverageMetric = {
  current: number;
  total: number;
  percent: number;
};

type BrandSnapshot = {
  brandId: string;
  brand: string;
  slug: string | null;
  updatedAt: string | null;
  vehicleFamilies: number;
  vehicleVariants: number;
  wheelFamilies: number;
  wheelVariants: number;
  wheelVehicleLinks: number;
  exactLinks: number;
  zeroLinkFamilies: number;
  parentlessVariants: number;
  badPicRows: number;
  brandImageCoverage: CoverageMetric;
  vehicleImageCoverage: CoverageMetric;
  vehicleVariantImageCoverage: CoverageMetric;
  wheelImageCoverage: CoverageMetric;
  wheelVariantImageCoverage: CoverageMetric;
  stateScore: number;
};

type SortKey =
  | "updated"
  | "status"
  | "wheelCoverage"
  | "variantCoverage"
  | "wheelVariants"
  | "vehicleVariants"
  | "brand";

type DashboardOverview = {
  brands: BrandSnapshot[];
  refreshedAt: string;
  snapshotVersion: string;
} | null;

function formatRatio(coverage: CoverageMetric) {
  if (!coverage.total) return "—";
  return `${coverage.current}/${coverage.total}`;
}

function formatPercent(coverage: CoverageMetric) {
  if (!coverage.total) return "—";
  return `${coverage.percent}%`;
}

function getLinkHealthPercent(snapshot: BrandSnapshot) {
  if (!snapshot.wheelFamilies) return 0;
  return Math.round(((snapshot.wheelFamilies - snapshot.zeroLinkFamilies) / snapshot.wheelFamilies) * 100);
}

function getBrandStatus(snapshot: BrandSnapshot) {
  const totalTracked =
    snapshot.vehicleFamilies +
    snapshot.vehicleVariants +
    snapshot.wheelFamilies +
    snapshot.wheelVariants;
  const wheelCoverage = snapshot.wheelImageCoverage.percent;
  const variantCoverage = snapshot.wheelVariantImageCoverage.percent;
  const linkHealth = getLinkHealthPercent(snapshot);

  if (!totalTracked) {
    return { label: "Scaffold", rank: 0, className: "border-border/60 bg-black/20 text-muted-foreground" };
  }
  if (linkHealth === 0 && snapshot.exactLinks === 0) {
    return { label: "Unlinked", rank: 1, className: "border-red-500/30 bg-red-500/10 text-red-200" };
  }
  if (snapshot.parentlessVariants > 0) {
    return { label: "Broken links", rank: 2, className: "border-red-500/30 bg-red-500/10 text-red-200" };
  }
  if (wheelCoverage === 0 && variantCoverage === 0) {
    return { label: "Needs images", rank: 3, className: "border-amber-500/30 bg-amber-500/10 text-amber-100" };
  }
  if (snapshot.zeroLinkFamilies > 0 || snapshot.badPicRows > 0) {
    return { label: "Needs cleanup", rank: 4, className: "border-amber-500/30 bg-amber-500/10 text-amber-100" };
  }
  if (wheelCoverage >= 60 && variantCoverage >= 40 && linkHealth >= 85) {
    return { label: "Healthy", rank: 6, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" };
  }
  return { label: "Building", rank: 5, className: "border-blue-500/30 bg-blue-500/10 text-blue-100" };
}

function formatTimestamp(value: string | null) {
  if (!value) return "Never refreshed";
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Date(timestamp).toLocaleString();
}

function parseUpdatedAtValue(value: string | null) {
  if (!value) return 0;
  const normalized = value
    .replace(" CEST", "+02:00")
    .replace(" CET", "+01:00")
    .replace(" UTC", "Z")
    .replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sumMetric(brands: BrandSnapshot[], key: keyof Pick<
  BrandSnapshot,
  | "vehicleFamilies"
  | "vehicleVariants"
  | "wheelFamilies"
  | "wheelVariants"
  | "wheelVehicleLinks"
  | "exactLinks"
>) {
  return brands.reduce((sum, brand) => sum + brand[key], 0);
}

function sumCoverage(brands: BrandSnapshot[], key: keyof Pick<
  BrandSnapshot,
  "brandImageCoverage" | "vehicleImageCoverage" | "vehicleVariantImageCoverage" | "wheelImageCoverage" | "wheelVariantImageCoverage"
>): CoverageMetric {
  const current = brands.reduce((sum, brand) => sum + brand[key].current, 0);
  const total = brands.reduce((sum, brand) => sum + brand[key].total, 0);
  return {
    current,
    total,
    percent: total > 0 ? Math.round((current / total) * 100) : 0,
  };
}

function sortSnapshots(snapshots: BrandSnapshot[], sortKey: SortKey) {
  return [...snapshots].sort((a, b) => {
    if (sortKey === "brand") return a.brand.localeCompare(b.brand);
    if (sortKey === "updated") return parseUpdatedAtValue(b.updatedAt) - parseUpdatedAtValue(a.updatedAt);
    if (sortKey === "status") return getBrandStatus(b).rank - getBrandStatus(a).rank;
    if (sortKey === "wheelCoverage") return b.wheelImageCoverage.percent - a.wheelImageCoverage.percent;
    if (sortKey === "variantCoverage") return b.wheelVariantImageCoverage.percent - a.wheelVariantImageCoverage.percent;
    if (sortKey === "wheelVariants") return b.wheelVariants - a.wheelVariants;
    if (sortKey === "vehicleVariants") return b.vehicleVariants - a.vehicleVariants;
    return 0;
  });
}

function BillyBrandCard({ snapshot }: { snapshot: BrandSnapshot }) {
  const status = getBrandStatus(snapshot);
  const linkHealth = getLinkHealthPercent(snapshot);
  const pressurePoints = [
    snapshot.zeroLinkFamilies ? `${snapshot.zeroLinkFamilies} zero-link families` : null,
    snapshot.parentlessVariants ? `${snapshot.parentlessVariants} parentless variants` : null,
    snapshot.badPicRows ? `${snapshot.badPicRows} bad-pic rows` : null,
  ].filter(Boolean) as string[];

  return (
    <Card className="border-border/60 bg-card/30">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-xl text-foreground">{snapshot.brand}</CardTitle>
            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {snapshot.slug || "no slug"}
            </p>
          </div>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div>{snapshot.updatedAt || "No recent update recorded"}</div>
          <div className="text-foreground/80">
            {snapshot.vehicleFamilies.toLocaleString()} vehicle families • {snapshot.wheelFamilies.toLocaleString()} wheel families
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Vehicle Variants", value: snapshot.vehicleVariants },
            { label: "Wheel Variants", value: snapshot.wheelVariants },
            { label: "Family Links", value: snapshot.wheelVehicleLinks },
            { label: "Exact Links", value: snapshot.exactLinks },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border/50 bg-black/20 p-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{metric.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Coverage</div>
          {[
            { label: "Link Health", coverage: { current: snapshot.wheelFamilies - snapshot.zeroLinkFamilies, total: snapshot.wheelFamilies, percent: linkHealth } },
            { label: "Brand", coverage: snapshot.brandImageCoverage },
            { label: "Vehicles", coverage: snapshot.vehicleImageCoverage },
            { label: "Vehicle Variants", coverage: snapshot.vehicleVariantImageCoverage },
            { label: "Wheels", coverage: snapshot.wheelImageCoverage },
            { label: "Wheel Variants", coverage: snapshot.wheelVariantImageCoverage },
          ].map(({ label, coverage }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground/90">{label}</span>
                <span className="text-muted-foreground">{formatRatio(coverage)}</span>
              </div>
              <Progress value={coverage.percent} className="h-2 bg-white/10 [&>div]:bg-white" />
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-border/50 pt-4">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Pressure Points</div>
          {pressurePoints.length ? (
            <div className="flex flex-wrap gap-2">
              {pressurePoints.map((point) => (
                <Badge key={`${snapshot.brandId}-${point}`} variant="outline" className="border-border/60 bg-black/20 px-3 py-1 text-xs">
                  {point}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No obvious blockers in the current Convex counts.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const BillyDashPage = () => {
  const overviewResource = useConvexResourceQuery<DashboardOverview>({
    queryKey: ["billyDashBrowser", "overview"],
    queryRef: api.billyDashBrowser.overviewGet,
    args: {},
    staleTime: 20_000,
  });
  const overview = overviewResource.data;
  const refreshOverview = useMutation(api.billyDashBrowser.refreshOverview);
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("updated");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const brands = React.useMemo(() => overview?.brands ?? [], [overview]);

  const filteredSnapshots = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const visible = normalizedSearch
      ? brands.filter((snapshot) => {
          const haystack = [snapshot.brand, snapshot.slug, snapshot.updatedAt]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedSearch);
        })
      : brands;

    return sortSnapshots(visible, sortKey);
  }, [brands, search, sortKey]);

  const aggregateStats = React.useMemo(() => {
    const wheelCoverage = sumCoverage(brands, "wheelImageCoverage");
    const variantCoverage = sumCoverage(brands, "wheelVariantImageCoverage");
    return [
      {
        title: "Brands",
        value: brands.length.toLocaleString(),
        description: "Brand rows currently tracked in Convex",
        icon: Database,
      },
      {
        title: "Vehicle Families",
        value: sumMetric(brands, "vehicleFamilies").toLocaleString(),
        description: "Canonical vehicle family rows linked to brands",
        icon: Database,
      },
      {
        title: "Wheel Families",
        value: sumMetric(brands, "wheelFamilies").toLocaleString(),
        description: "Parent wheel families linked to brands",
        icon: Disc3,
      },
      {
        title: "Wheel Variants",
        value: sumMetric(brands, "wheelVariants").toLocaleString(),
        description: "Wheel variants currently live in Convex",
        icon: Activity,
      },
      {
        title: "Wheel Links",
        value: sumMetric(brands, "wheelVehicleLinks").toLocaleString(),
        description: "j_wheel_vehicle family links",
        icon: Link2,
      },
      {
        title: "Exact Links",
        value: sumMetric(brands, "exactLinks").toLocaleString(),
        description: "Vehicle variant ↔ wheel variant exact links",
        icon: GitBranch,
      },
      {
        title: "Wheel Coverage",
        value: formatRatio(wheelCoverage),
        description: `${wheelCoverage.percent}% wheel image coverage`,
        icon: ImageIcon,
      },
      {
        title: "Variant Coverage",
        value: formatRatio(variantCoverage),
        description: `${variantCoverage.percent}% wheel variant image coverage`,
        icon: ShieldAlert,
      },
    ];
  }, [brands]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshOverview({});
    } catch (error) {
      toast.error("Could not refresh Billy Dash", {
        description: getConvexErrorMessage(error),
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshOverview]);

  if (overviewResource.isInitialLoading) {
    return (
      <DashboardLayout title="Billy Dash" showFilterButton={false} disableContentPadding={true}>
        <div className="flex h-full items-center justify-center p-2">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (overviewResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Billy Dash" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <ConvexBackendUnavailableCard
            title="Billy Dash is not deployed on cloud dev yet"
            description="The canonical `billyDashBrowser.overviewGet` query is missing from the cloud dev Convex deployment."
            error={overviewResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (overviewResource.error) {
    return (
      <DashboardLayout title="Billy Dash" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <Card className="border-border/60 bg-card/95">
            <CardContent className="space-y-3 p-8 text-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Could not load Billy Dash</h2>
                <p className="text-sm text-muted-foreground">
                  {getConvexErrorMessage(overviewResource.error)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Billy Dash" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-card/30 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Billy Dash</h1>
                <p className="mt-1 text-muted-foreground">
                  Cached brand-by-brand Convex database state with manual refresh for links, media coverage, and missing surfaces.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ConvexResourceStatusBadge
                  status={overviewResource.status}
                  label="Refreshing Billy Dash"
                />
                <Badge variant="outline" className="border-border/60 bg-black/20 text-sm text-muted-foreground">
                  {brands.length} brands in Convex
                </Badge>
                <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Refresh snapshot
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Last refreshed: {overview ? formatTimestamp(overview.refreshedAt) : "No snapshot yet"}
            </div>
          </div>

          {!overview ? (
            <Card className="border-border/50 bg-card/30">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                <div className="text-xl font-semibold text-foreground">No Billy snapshot yet</div>
                <p className="max-w-2xl text-muted-foreground">
                  Billy Dash now reads a cached Convex snapshot so the page stays cheap. Hit refresh once to build the first dashboard snapshot.
                </p>
                <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Build first snapshot
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {overview ? (
          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">Brand State Matrix</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Compare explicit database signals across brands: structure, links, media coverage, and blockers.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search brand"
                      className="pl-9"
                    />
                  </div>
                  <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                    <SelectTrigger className="w-full sm:w-52">
                      <SelectValue placeholder="Sort brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Most recently updated</SelectItem>
                      <SelectItem value="status">Strongest status</SelectItem>
                      <SelectItem value="wheelCoverage">Best wheel coverage</SelectItem>
                      <SelectItem value="variantCoverage">Best variant coverage</SelectItem>
                      <SelectItem value="wheelVariants">Most wheel variants</SelectItem>
                      <SelectItem value="vehicleVariants">Most vehicle variants</SelectItem>
                      <SelectItem value="brand">Brand name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto rounded-xl border border-border/50 bg-black/20">
                <table className="w-full min-w-[1120px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">Brand</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Vehicle Families</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Vehicle Variants</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Wheel Families</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Wheel Variants</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Link Health</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Wheel Media</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Variant Media</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Blockers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSnapshots.map((snapshot) => {
                      const status = getBrandStatus(snapshot);
                      const linkHealth = getLinkHealthPercent(snapshot);
                      const pressurePoints = [
                        snapshot.zeroLinkFamilies ? `${snapshot.zeroLinkFamilies} zero-link` : null,
                        snapshot.parentlessVariants ? `${snapshot.parentlessVariants} parentless` : null,
                        snapshot.badPicRows ? `${snapshot.badPicRows} bad-pic` : null,
                      ].filter(Boolean) as string[];

                      return (
                        <tr key={snapshot.brandId} className="border-b border-border/40 last:border-b-0">
                          <td className="px-4 py-3 align-top">
                            <div className="font-medium text-foreground">{snapshot.brand}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{snapshot.updatedAt || "No update stamp"}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                          </td>
                          <td className="px-4 py-3 align-top text-foreground">{snapshot.vehicleFamilies.toLocaleString()}</td>
                          <td className="px-4 py-3 align-top text-foreground">{snapshot.vehicleVariants.toLocaleString()}</td>
                          <td className="px-4 py-3 align-top text-foreground">{snapshot.wheelFamilies.toLocaleString()}</td>
                          <td className="px-4 py-3 align-top text-foreground">{snapshot.wheelVariants.toLocaleString()}</td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-foreground">{linkHealth}%</div>
                            <div className="text-xs text-muted-foreground">
                              {snapshot.wheelFamilies - snapshot.zeroLinkFamilies}/{snapshot.wheelFamilies || 0} linked families
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-foreground">{formatPercent(snapshot.wheelImageCoverage)}</div>
                            <div className="text-xs text-muted-foreground">{formatRatio(snapshot.wheelImageCoverage)}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-foreground">{formatPercent(snapshot.wheelVariantImageCoverage)}</div>
                            <div className="text-xs text-muted-foreground">{formatRatio(snapshot.wheelVariantImageCoverage)}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            {pressurePoints.length ? (
                              <div className="flex flex-wrap gap-2">
                                {pressurePoints.map((point) => (
                                  <Badge key={`${snapshot.brandId}-${point}`} variant="outline" className="border-border/60 bg-black/20 text-xs">
                                    {point}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Stable</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          ) : null}

          {overview ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aggregateStats.map((stat) => (
              <Card key={stat.title} className="border-border/50 bg-card/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : null}

          {overview ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredSnapshots.map((snapshot) => (
              <BillyBrandCard key={snapshot.brandId} snapshot={snapshot} />
            ))}
          </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillyDashPage;
