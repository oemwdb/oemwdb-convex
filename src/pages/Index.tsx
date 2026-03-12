import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchResults } from "@/components/search/SearchResults";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useWheels } from "@/hooks/useWheels";
import { useHomeDashboardMetrics } from "@/hooks/useHomeDashboardMetrics";
import WheelCard from "@/components/vehicle/WheelCard";
import {
  ArrowRight,
  CircleDot,
  Car,
  Database,
  Loader2,
  Store,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type HomeWheelCard = {
  id: string;
  name: string;
  diameter: string;
  boltPattern: string;
  specs: string[];
  imageUrl: string | null;
  brand: string;
};

const Index = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const {
    searchQuery,
    collection,
    brands,
    vehicles,
    wheels: searchWheels,
    isLoading: searchLoading,
    hasSearch,
  } = useGlobalSearch();
  const { data: wheels, isLoading, error } = useWheels();
  const {
    data: metrics,
    isLoading: metricsLoading,
  } = useHomeDashboardMetrics();

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatWheelForCard = (wheel: any): HomeWheelCard => {
    const specs = [];
    if (wheel.brand_name) specs.push(`Brand: ${wheel.brand_name}`);
    if (wheel.diameter) specs.push(`Diameter: ${wheel.diameter}`);
    if (wheel.width) specs.push(`Width: ${wheel.width}`);
    if (wheel.color) specs.push(`Finish: ${wheel.color}`);

    return {
      id: String(wheel.id),
      name: wheel.wheel_name,
      diameter: wheel.diameter || "N/A",
      boltPattern: wheel.bolt_pattern || "N/A",
      specs,
      imageUrl: wheel.good_pic_url || wheel.bad_pic_url || null,
      brand: wheel.brand_name || "Unknown",
    };
  };

  const curated = useMemo(() => {
    const all = (wheels || []).map(formatWheelForCard);
    const withImages = all.filter((wheel) => wheel.imageUrl);
    const withoutImages = all.filter((wheel) => !wheel.imageUrl);

    return {
      hero: withImages.slice(0, 3),
      newest: withImages.slice(0, 12),
      rareFinds: [...withImages.slice(12, 18), ...withoutImages.slice(0, 6)].slice(0, 12),
      workshop: withoutImages.slice(0, 12),
    };
  }, [wheels]);

  if (hasSearch) {
    return (
      <DashboardLayout title="Search Results" disableContentPadding={true}>
        <div className="h-full p-2 overflow-y-auto">
          <SearchResults
            searchQuery={searchQuery}
            collection={collection}
            brands={brands}
            vehicles={vehicles}
            wheels={searchWheels}
            isLoading={searchLoading}
          />
        </div>
      </DashboardLayout>
    );
  }

  const renderWheelGrid = (items: HomeWheelCard[]) => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {items.map((wheel) => (
        <Link to={`/wheel/${wheel.id}`} key={wheel.id} className="block">
          <WheelCard
            wheel={wheel}
            isFlipped={!!flippedCards[wheel.id]}
            onFlip={toggleCardFlip}
            linkToDetail={false}
          />
        </Link>
      ))}
    </div>
  );

  return (
    <DashboardLayout title="Home" disableContentPadding={true}>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-[1800px] p-3 md:p-5 space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <Card className="overflow-hidden border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_36%),radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.98),rgba(10,10,10,1))]">
              <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-200">
                    OEMWDB Control Surface
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="max-w-2xl text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                      Browse the wheel database like an inventory system, not a blog.
                    </h1>
                    <p className="max-w-xl text-sm text-zinc-300 sm:text-base">
                      Jump straight into brands, vehicles, wheels, and market listings. The homepage should orient quickly and surface useful inventory, not waste vertical space.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <Link to="/wheels">
                        Explore Wheels
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2 border-white/15 bg-black/20">
                      <Link to="/vehicles">
                        Vehicles
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2 border-white/15 bg-black/20">
                      <Link to="/market">
                        Marketplace
                        <Store className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                        <Database className="h-3.5 w-3.5" />
                        Brands
                      </div>
                      <div className="text-3xl font-semibold">
                        {metricsLoading ? "..." : metrics?.totalBrands.toLocaleString() || "0"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                        <Car className="h-3.5 w-3.5" />
                        Vehicles
                      </div>
                      <div className="text-3xl font-semibold">
                        {metricsLoading ? "..." : metrics?.totalVehicles.toLocaleString() || "0"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                        <CircleDot className="h-3.5 w-3.5" />
                        Wheels
                      </div>
                      <div className="text-3xl font-semibold">
                        {metricsLoading ? "..." : metrics?.totalWheels.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {(curated.hero.length > 0 ? curated.hero : curated.newest.slice(0, 3)).map((wheel, index) => (
                    <Link key={wheel.id} to={`/wheel/${wheel.id}`}>
                      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3 transition-colors hover:border-white/20">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                            Spot {index + 1}
                          </span>
                          <Sparkles className="h-3.5 w-3.5 text-amber-300/70" />
                        </div>
                        <div className="aspect-[16/11] overflow-hidden rounded-xl bg-zinc-900">
                          {wheel.imageUrl ? (
                            <img
                              src={wheel.imageUrl}
                              alt={wheel.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                              No image available
                            </div>
                          )}
                        </div>
                        <div className="mt-3 space-y-1">
                          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{wheel.brand}</p>
                          <h3 className="line-clamp-1 text-base font-medium">{wheel.name}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              <Card className="border-border/60 bg-card/80 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Brand Pressure</p>
                    <h2 className="text-lg font-semibold">Most wheel-heavy brands</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {(metrics?.wheelsPerBrand || []).slice(0, 5).map((entry, index) => (
                    <div key={entry.brand} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-200">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{entry.brand}</p>
                            <p className="text-xs text-muted-foreground">{entry.vehicles.toLocaleString()} vehicles mapped</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{entry.wheels.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">wheels</div>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-black/30">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                          style={{
                            width: `${Math.min(100, (entry.wheels / Math.max(...(metrics?.wheelsPerBrand || [{ wheels: 1 }]).map((item) => item.wheels))) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-border/60 bg-card/80 p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">Bolt Pattern Radar</p>
                <div className="flex flex-wrap gap-2">
                  {(metrics?.boltPatterns || []).slice(0, 12).map((pattern) => (
                    <Badge key={pattern.pattern} variant="outline" className="gap-2 rounded-full px-3 py-1.5 text-xs">
                      <span>{pattern.pattern}</span>
                      <span className="text-muted-foreground">{pattern.count}</span>
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-border/60 bg-card/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Market Watch</p>
                  <h2 className="text-lg font-semibold">Marketplace is ready for better inventory surfacing</h2>
                </div>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/market">
                    Open Market
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border/50 bg-[linear-gradient(135deg,rgba(8,47,73,0.4),rgba(17,24,39,0.2))] p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-200/70">Need</p>
                  <h3 className="mb-2 text-base font-medium">Featured listings with images</h3>
                  <p className="text-sm text-muted-foreground">Use the market page to start curating visible inventory blocks instead of leaving dead space.</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-[linear-gradient(135deg,rgba(63,63,70,0.35),rgba(17,24,39,0.2))] p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-zinc-300/70">Need</p>
                  <h3 className="mb-2 text-base font-medium">Single wheel listings</h3>
                  <p className="text-sm text-muted-foreground">The creation UI now supports individual wheels. That should become a first-class listing type in the backend too.</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-[linear-gradient(135deg,rgba(74,20,140,0.35),rgba(17,24,39,0.2))] p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">Need</p>
                  <h3 className="mb-2 text-base font-medium">Better homepage rotation</h3>
                  <p className="text-sm text-muted-foreground">Once market data is real, swap this block from static messaging to live featured listings without changing layout.</p>
                </div>
              </div>
            </Card>

            <Card className="border-border/60 bg-card/80 p-5">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Quick Routes</p>
                <h2 className="text-lg font-semibold">Jump where the work is</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Brands", href: "/brands", copy: "Normalize brand records and image coverage." },
                  { label: "Vehicles", href: "/vehicles", copy: "Review chassis fitment and production ranges." },
                  { label: "Wheels", href: "/wheels", copy: "Audit wheel cards, detail pages, and gallery coverage." },
                  { label: "Marketplace", href: "/market", copy: "Build out listing workflows and admin moderation." },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/35"
                  >
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.copy}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Wheel Radar</p>
                <h2 className="text-2xl font-semibold">Curated wheel surfaces</h2>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card className="p-8 text-center border-border/60">
                <p className="text-muted-foreground">Failed to load wheels. Please try again later.</p>
              </Card>
            ) : (
              <Tabs defaultValue="newest" className="w-full">
                <TabsList className="mb-6 h-11 bg-card/70">
                  <TabsTrigger value="newest">Front Row</TabsTrigger>
                  <TabsTrigger value="rare">Rare Finds</TabsTrigger>
                  <TabsTrigger value="workshop">Needs Image Work</TabsTrigger>
                </TabsList>

                <TabsContent value="newest" className="mt-0">
                  {renderWheelGrid(curated.newest)}
                </TabsContent>

                <TabsContent value="rare" className="mt-0">
                  {renderWheelGrid(curated.rareFinds)}
                </TabsContent>

                <TabsContent value="workshop" className="mt-0">
                  {renderWheelGrid(curated.workshop)}
                </TabsContent>
              </Tabs>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
