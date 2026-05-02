import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  ImagePlus,
  Megaphone,
  PackagePlus,
  PanelTop,
  PauseCircle,
  Plus,
  ReceiptText,
  Rows3,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdType = "item_slots" | "collection_bars" | "market_boosts" | "guide_sponsors";
type PlacementStatus = "active" | "scheduled" | "outbid" | "paused" | "available";

interface AdTypeTab {
  id: AdType;
  label: string;
  shortLabel: string;
  description: string;
}

interface AdPlacement {
  id: string;
  type: AdType;
  title: string;
  itemName: string;
  surface: string;
  region: "NA" | "EU" | "UK" | "Global";
  imageUrl: string;
  placementLabel: string;
  minCredits: number;
  currentLeaderCredits: number;
  activeBidders: number;
  estimatedViews: number;
  subscribed: boolean;
  allocationCredits: number;
  status: PlacementStatus;
  rank?: number;
  daysRemaining?: number;
  categories: string[];
  notes: string;
}

interface CreditTransaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  kind: "purchase" | "allocation" | "release";
}

const adTypeTabs: AdTypeTab[] = [
  {
    id: "item_slots",
    label: "Under Item Slots",
    shortLabel: "Item slots",
    description: "Promoted slots under item cards and item detail media.",
  },
  {
    id: "collection_bars",
    label: "Collection Ad Bars",
    shortLabel: "Ad bars",
    description: "Horizontal ad bars inside vehicle, wheel, and brand collections.",
  },
  {
    id: "market_boosts",
    label: "Market Boosts",
    shortLabel: "Market",
    description: "Boosted market placements for listings and vendor modules.",
  },
  {
    id: "guide_sponsors",
    label: "Guide Sponsors",
    shortLabel: "Guides",
    description: "Sponsored placements on fitment guides and editorial surfaces.",
  },
];

const seededPlacements: AdPlacement[] = [
  {
    id: "ad_item_bmw_style_666",
    type: "item_slots",
    title: "Wheel item card lower slot",
    itemName: "BMW M Style 666M",
    surface: "Wheel detail / item card",
    region: "Global",
    imageUrl: "/ads/wheel_ad.png",
    placementLabel: "Under item image",
    minCredits: 450,
    currentLeaderCredits: 1250,
    activeBidders: 6,
    estimatedViews: 18200,
    subscribed: true,
    allocationCredits: 1400,
    status: "active",
    rank: 1,
    daysRemaining: 18,
    categories: ["wheel", "BMW", "M"],
    notes: "High-intent slot for users already looking at exact wheel data.",
  },
  {
    id: "ad_item_vw_gti",
    type: "item_slots",
    title: "Vehicle item lower slot",
    itemName: "Volkswagen Golf GTI Mk7",
    surface: "Vehicle detail / item card",
    region: "EU",
    imageUrl: "/ads/vehicle_ad.png",
    placementLabel: "Under item image",
    minCredits: 350,
    currentLeaderCredits: 900,
    activeBidders: 4,
    estimatedViews: 12800,
    subscribed: true,
    allocationCredits: 650,
    status: "outbid",
    rank: 3,
    daysRemaining: 9,
    categories: ["vehicle", "Volkswagen"],
    notes: "Good for fitment tools, wheel vendors, and tuning shops.",
  },
  {
    id: "ad_item_rr_style_712",
    type: "item_slots",
    title: "Premium wheel item slot",
    itemName: "Rolls-Royce Style 712",
    surface: "Wheel detail / item card",
    region: "Global",
    imageUrl: "/wheels/rolls-royce/rolls-royce-style-712.webp",
    placementLabel: "Under item image",
    minCredits: 700,
    currentLeaderCredits: 1100,
    activeBidders: 3,
    estimatedViews: 6400,
    subscribed: false,
    allocationCredits: 0,
    status: "available",
    categories: ["wheel", "luxury"],
    notes: "Lower volume but unusually specific purchase intent.",
  },
  {
    id: "ad_collection_wheels",
    type: "collection_bars",
    title: "Wheel collection mid-feed bar",
    itemName: "All wheel collections",
    surface: "Wheel collection pages",
    region: "Global",
    imageUrl: "/ads/wheel_ad.png",
    placementLabel: "Between card rows",
    minCredits: 900,
    currentLeaderCredits: 2600,
    activeBidders: 10,
    estimatedViews: 73500,
    subscribed: true,
    allocationCredits: 2200,
    status: "outbid",
    rank: 2,
    daysRemaining: 12,
    categories: ["wheel", "collection"],
    notes: "Broad reach surface. Best for vendors with wide catalog coverage.",
  },
  {
    id: "ad_collection_vehicle_brand",
    type: "collection_bars",
    title: "Brand collection top ad bar",
    itemName: "Volkswagen vehicles",
    surface: "Brand vehicle collection",
    region: "EU",
    imageUrl: "/ads/brand_ad.png",
    placementLabel: "Top collection bar",
    minCredits: 650,
    currentLeaderCredits: 1500,
    activeBidders: 7,
    estimatedViews: 41400,
    subscribed: false,
    allocationCredits: 0,
    status: "available",
    categories: ["vehicle", "brand"],
    notes: "Sits below filters before the first collection row.",
  },
  {
    id: "ad_collection_tire_fitment",
    type: "collection_bars",
    title: "Tire fitment collection bar",
    itemName: "Fitment-safe tire collections",
    surface: "Filtered tire/wheel collections",
    region: "NA",
    imageUrl: "/ads/vehicle_ad.png",
    placementLabel: "Inline collection bar",
    minCredits: 500,
    currentLeaderCredits: 720,
    activeBidders: 2,
    estimatedViews: 18300,
    subscribed: false,
    allocationCredits: 0,
    status: "available",
    categories: ["tire", "fitment"],
    notes: "Useful for regional tire merchants and installers.",
  },
  {
    id: "ad_market_featured_vendor",
    type: "market_boosts",
    title: "Featured market vendor",
    itemName: "OEM wheel listings",
    surface: "Market landing and listings",
    region: "Global",
    imageUrl: "/ads/wheel_ad.png",
    placementLabel: "Market spotlight",
    minCredits: 800,
    currentLeaderCredits: 1700,
    activeBidders: 8,
    estimatedViews: 32200,
    subscribed: true,
    allocationCredits: 1800,
    status: "scheduled",
    rank: 1,
    daysRemaining: 27,
    categories: ["market", "vendor"],
    notes: "Rotates inside the marketplace with verified seller guardrails.",
  },
  {
    id: "ad_market_listing_boost",
    type: "market_boosts",
    title: "Listing row boost",
    itemName: "Used OEM wheel sets",
    surface: "Market search results",
    region: "UK",
    imageUrl: "/ads/brand_ad.png",
    placementLabel: "Promoted result row",
    minCredits: 300,
    currentLeaderCredits: 620,
    activeBidders: 5,
    estimatedViews: 15600,
    subscribed: false,
    allocationCredits: 0,
    status: "available",
    categories: ["market", "listings"],
    notes: "Smaller slot for inventory-specific sellers.",
  },
  {
    id: "ad_guides_wheel_buying",
    type: "guide_sponsors",
    title: "Wheel buying guide sponsor",
    itemName: "OEM wheel buying guide",
    surface: "Guide header and related blocks",
    region: "NA",
    imageUrl: "/ads/wheel_ad.png",
    placementLabel: "Guide sponsor",
    minCredits: 550,
    currentLeaderCredits: 1150,
    activeBidders: 4,
    estimatedViews: 20700,
    subscribed: true,
    allocationCredits: 950,
    status: "paused",
    rank: 2,
    daysRemaining: 21,
    categories: ["guide", "wheel"],
    notes: "Educational intent. Better for fitment help than direct product pushes.",
  },
  {
    id: "ad_guides_tire_sizing",
    type: "guide_sponsors",
    title: "Tire sizing guide sponsor",
    itemName: "Tire sizing and offset guide",
    surface: "Editorial guide pages",
    region: "Global",
    imageUrl: "/ads/vehicle_ad.png",
    placementLabel: "Topic sponsor",
    minCredits: 500,
    currentLeaderCredits: 780,
    activeBidders: 3,
    estimatedViews: 24600,
    subscribed: false,
    allocationCredits: 0,
    status: "available",
    categories: ["guide", "tire"],
    notes: "Good fit for tire retailers, calculators, and installer networks.",
  },
];

const seededTransactions: CreditTransaction[] = [
  {
    id: "txn_purchase_apr",
    label: "Credit pack purchase",
    amount: 10000,
    date: "Apr 28",
    kind: "purchase",
  },
  {
    id: "txn_alloc_bmw",
    label: "BMW Style 666M allocation",
    amount: -1400,
    date: "Apr 28",
    kind: "allocation",
  },
  {
    id: "txn_alloc_collection",
    label: "Wheel collection bar allocation",
    amount: -2200,
    date: "Apr 27",
    kind: "allocation",
  },
];

const formatCredits = (value: number) => new Intl.NumberFormat("en-US").format(Math.max(0, value));

const getStatusTone = (status: PlacementStatus) => {
  if (status === "active") return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
  if (status === "scheduled") return "border-sky-500/35 bg-sky-500/10 text-sky-300";
  if (status === "outbid") return "border-amber-500/35 bg-amber-500/10 text-amber-300";
  if (status === "paused") return "border-zinc-500/35 bg-zinc-500/10 text-zinc-300";
  return "border-white/12 bg-white/5 text-muted-foreground";
};

const getTabIcon = (type: AdType) => {
  if (type === "item_slots") return ImagePlus;
  if (type === "collection_bars") return Rows3;
  if (type === "market_boosts") return Megaphone;
  return Sparkles;
};

const tabTriggerClass =
  "min-w-fit rounded-full border border-white/12 !bg-transparent px-4 py-2 text-[13px] font-semibold text-muted-foreground shadow-none transition-colors hover:border-white/60 hover:text-foreground data-[state=active]:!bg-[#242424] data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-none";

const PlacementStatusBadge = ({ status }: { status: PlacementStatus }) => (
  <Badge variant="outline" className={cn("rounded-full capitalize", getStatusTone(status))}>
    {status}
  </Badge>
);

const MetricTile = ({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) => (
  <div className="rounded-lg border border-border/70 bg-card/40 p-3">
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="mt-2 text-xl font-semibold text-foreground">{value}</div>
    <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
  </div>
);

const PlacementCard = ({
  placement,
  onOpen,
  onPauseToggle,
}: {
  placement: AdPlacement;
  onOpen: (placement: AdPlacement) => void;
  onPauseToggle: (placementId: string) => void;
}) => {
  const bidPressure = Math.min(100, Math.round((placement.currentLeaderCredits / Math.max(placement.minCredits, 1)) * 28));
  const isSubscribed = placement.subscribed;

  return (
    <Card className="overflow-hidden border-border/70 bg-card/35">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border/70 bg-muted/20">
        <img src={placement.imageUrl} alt="" className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-black/20" />
        <Badge variant="outline" className="absolute left-3 top-3 rounded-full border-black/30 bg-black/45 text-white">
          {placement.placementLabel}
        </Badge>
        <button
          type="button"
          onClick={() => onOpen(placement)}
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-lg transition hover:scale-105 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isSubscribed ? `Manage ${placement.itemName}` : `Subscribe to ${placement.itemName}`}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <CardHeader className="space-y-2 p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{placement.itemName}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{placement.title}</CardDescription>
          </div>
          <PlacementStatusBadge status={placement.status} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="rounded-full">
            {placement.region}
          </Badge>
          {placement.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline" className="rounded-full capitalize">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Allocated</div>
            <div className="font-semibold text-foreground">{formatCredits(placement.allocationCredits)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Leader</div>
            <div className="font-semibold text-foreground">{formatCredits(placement.currentLeaderCredits)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Views</div>
            <div className="font-semibold text-foreground">{formatCredits(placement.estimatedViews)}</div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Bid pressure</span>
            <span>{placement.activeBidders} bidders</span>
          </div>
          <Progress value={bidPressure} className="h-2" />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div className="text-xs text-muted-foreground">
            {isSubscribed
              ? `Rank ${placement.rank ?? "-"}${placement.daysRemaining ? ` / ${placement.daysRemaining} days left` : ""}`
              : `Minimum ${formatCredits(placement.minCredits)} credits`}
          </div>
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <Button size="sm" variant="ghost" onClick={() => onPauseToggle(placement.id)}>
                <PauseCircle className="mr-2 h-4 w-4" />
                {placement.status === "paused" ? "Resume" : "Pause"}
              </Button>
            ) : null}
            <Button size="sm" variant={isSubscribed ? "outline" : "default"} onClick={() => onOpen(placement)}>
              {isSubscribed ? "Manage" : "Bid"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdvertisingPage = () => {
  const [activeTab, setActiveTab] = useState<AdType>("item_slots");
  const [placements, setPlacements] = useState(seedPlacementsWithStatus(seededPlacements));
  const [baseCredits, setBaseCredits] = useState(10000);
  const [transactions, setTransactions] = useState(seededTransactions);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [durationDays, setDurationDays] = useState("30");
  const [bidNotes, setBidNotes] = useState("");

  const selectedPlacement = useMemo(
    () => placements.find((placement) => placement.id === selectedPlacementId) ?? null,
    [placements, selectedPlacementId]
  );

  const activeTabMeta = adTypeTabs.find((tab) => tab.id === activeTab) ?? adTypeTabs[0];
  const tabPlacements = placements.filter((placement) => placement.type === activeTab);
  const subscribedPlacements = tabPlacements.filter((placement) => placement.subscribed);
  const availablePlacements = tabPlacements.filter((placement) => !placement.subscribed);
  const allSubscribedPlacements = placements.filter((placement) => placement.subscribed);
  const reservedCredits = allSubscribedPlacements.reduce((total, placement) => total + placement.allocationCredits, 0);
  const availableCredits = Math.max(0, baseCredits - reservedCredits);
  const activePlacements = allSubscribedPlacements.filter((placement) => placement.status === "active" || placement.status === "scheduled");
  const attentionPlacements = allSubscribedPlacements.filter((placement) => placement.status === "outbid" || placement.status === "paused");
  const selectedExistingAllocation = selectedPlacement?.allocationCredits ?? 0;
  const selectedCreditDelta = Math.max(0, bidAmount - selectedExistingAllocation);
  const canSubmitBid =
    !!selectedPlacement &&
    bidAmount >= selectedPlacement.minCredits &&
    selectedCreditDelta <= availableCredits + selectedExistingAllocation;

  const openBidPanel = (placement: AdPlacement) => {
    setSelectedPlacementId(placement.id);
    setBidAmount(Math.max(placement.allocationCredits || placement.minCredits, placement.minCredits));
    setDurationDays(String(placement.daysRemaining && placement.daysRemaining > 30 ? placement.daysRemaining : 30));
    setBidNotes("");
  };

  const handleBuyCredits = (amount: number) => {
    setBaseCredits((current) => current + amount);
    setTransactions((current) => [
      {
        id: `txn_purchase_${Date.now()}`,
        label: `Credit pack purchase`,
        amount,
        date: "Today",
        kind: "purchase",
      },
      ...current,
    ]);
  };

  const handlePauseToggle = (placementId: string) => {
    setPlacements((current) =>
      current.map((placement) => {
        if (placement.id !== placementId) return placement;
        const nextStatus: PlacementStatus = placement.status === "paused" ? "active" : "paused";
        return { ...placement, status: nextStatus };
      })
    );
  };

  const handleSubmitBid = () => {
    if (!selectedPlacement || !canSubmitBid) return;

    setPlacements((current) =>
      current.map((placement) => {
        if (placement.id !== selectedPlacement.id) return placement;
        const beatsLeader = bidAmount >= placement.currentLeaderCredits;
        return {
          ...placement,
          subscribed: true,
          allocationCredits: bidAmount,
          currentLeaderCredits: Math.max(placement.currentLeaderCredits, bidAmount),
          status: beatsLeader ? "active" : "outbid",
          rank: beatsLeader ? 1 : Math.max(2, placement.rank ?? 2),
          daysRemaining: Number(durationDays),
        };
      })
    );

    const delta = bidAmount - selectedExistingAllocation;
    setTransactions((current) => [
      {
        id: `txn_alloc_${selectedPlacement.id}_${Date.now()}`,
        label: `${selectedPlacement.itemName} allocation`,
        amount: -delta,
        date: "Today",
        kind: delta >= 0 ? "allocation" : "release",
      },
      ...current,
    ]);

    setSelectedPlacementId(null);
  };

  return (
    <DashboardLayout title="Advertising" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-2">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Advertising Dashboard</h1>
                <Badge variant="outline" className="rounded-full border-primary/35 bg-primary/10 text-primary">
                  Credit marketplace
                </Badge>
              </div>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                Buy credits, subscribe to ad placements, and manage how your credits are allocated across OEMWDB item and collection surfaces.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[1000, 5000, 15000].map((amount) => (
                <Button key={amount} size="sm" variant="outline" onClick={() => handleBuyCredits(amount)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy {formatCredits(amount)}
                </Button>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdType)}>
            <TabsList className="!inline-flex !h-auto !w-full !justify-start gap-2 overflow-x-auto !rounded-none !border-0 !bg-transparent !p-0 text-muted-foreground shadow-none">
              {adTypeTabs.map((tab) => {
                const Icon = getTabIcon(tab.id);
                const count = placements.filter((placement) => placement.type === tab.id && placement.subscribed).length;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className={tabTriggerClass}>
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.label}
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">{count}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                icon={WalletCards}
                label="Wallet"
                value={`${formatCredits(availableCredits)} credits`}
                detail={`${formatCredits(baseCredits)} purchased / ${formatCredits(reservedCredits)} reserved`}
              />
              <MetricTile
                icon={Target}
                label="Subscribed"
                value={`${allSubscribedPlacements.length} placements`}
                detail={`${activePlacements.length} active or scheduled`}
              />
              <MetricTile
                icon={TrendingUp}
                label="Estimated Reach"
                value={formatCredits(activePlacements.reduce((total, placement) => total + placement.estimatedViews, 0))}
                detail="Projected views on active placements"
              />
              <MetricTile
                icon={ShieldCheck}
                label="Needs Attention"
                value={`${attentionPlacements.length} placements`}
                detail="Outbid or paused allocations"
              />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                {adTypeTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-4">
                    <section className="rounded-lg border border-border/70 bg-card/25">
                      <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <PanelTop className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-base font-semibold text-foreground">{tab.shortLabel} subscriptions</h2>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{tab.description}</p>
                        </div>
                        <Badge variant="outline" className="w-fit rounded-full">
                          {subscribedPlacements.length} subscribed / {availablePlacements.length} available
                        </Badge>
                      </div>

                      <div className="p-4">
                        {subscribedPlacements.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center">
                            <PackagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                            <div className="mt-3 text-sm font-medium text-foreground">No subscriptions in this ad type yet</div>
                            <p className="mt-1 text-sm text-muted-foreground">Use the centered plus on an available placement to start allocating credits.</p>
                          </div>
                        ) : (
                          <div className="grid gap-3 lg:grid-cols-2">
                            {subscribedPlacements.map((placement) => (
                              <PlacementCard
                                key={placement.id}
                                placement={placement}
                                onOpen={openBidPanel}
                                onPauseToggle={handlePauseToggle}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="rounded-lg border border-border/70 bg-card/25">
                      <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-base font-semibold text-foreground">Available {tab.shortLabel.toLowerCase()}</h2>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">Click the centered plus on any image to open the credit allocation panel.</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <SlidersHorizontal className="h-4 w-4" />
                          Minimum bids and leader pressure are mocked for this V1 shell.
                        </div>
                      </div>

                      <div className="grid gap-3 p-4 lg:grid-cols-2">
                        {availablePlacements.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground lg:col-span-2">
                            Every placement in this ad type is already subscribed.
                          </div>
                        ) : (
                          availablePlacements.map((placement) => (
                            <PlacementCard
                              key={placement.id}
                              placement={placement}
                              onOpen={openBidPanel}
                              onPauseToggle={handlePauseToggle}
                            />
                          ))
                        )}
                      </div>
                    </section>
                  </TabsContent>
                ))}
              </div>

              <aside className="space-y-4">
                <Card className="border-border/70 bg-card/35">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                      Credit Wallet
                    </CardTitle>
                    <CardDescription>Available credits power bids across every advertising type.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reserved</span>
                        <span className="font-medium text-foreground">{formatCredits(reservedCredits)} / {formatCredits(baseCredits)}</span>
                      </div>
                      <Progress value={baseCredits ? (reservedCredits / baseCredits) * 100 : 0} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-lg border border-border/70 p-3">
                        <div className="text-xs text-muted-foreground">Available</div>
                        <div className="mt-1 text-lg font-semibold">{formatCredits(availableCredits)}</div>
                      </div>
                      <div className="rounded-lg border border-border/70 p-3">
                        <div className="text-xs text-muted-foreground">Reserved</div>
                        <div className="mt-1 text-lg font-semibold">{formatCredits(reservedCredits)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-card/35">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      {activeTabMeta.shortLabel} Snapshot
                    </CardTitle>
                    <CardDescription>{activeTabMeta.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subscribed</span>
                      <span className="font-medium">{subscribedPlacements.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Available inventory</span>
                      <span className="font-medium">{availablePlacements.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reserved here</span>
                      <span className="font-medium">
                        {formatCredits(subscribedPlacements.reduce((total, placement) => total + placement.allocationCredits, 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Needs attention</span>
                      <span className="font-medium">
                        {subscribedPlacements.filter((placement) => placement.status === "outbid" || placement.status === "paused").length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-card/35">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ReceiptText className="h-4 w-4 text-muted-foreground" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {transactions.slice(0, 6).map((transaction) => (
                      <div key={transaction.id} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
                        <div>
                          <div className="text-sm font-medium text-foreground">{transaction.label}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            {transaction.date}
                          </div>
                        </div>
                        <div className={cn("text-sm font-semibold", transaction.amount >= 0 ? "text-emerald-300" : "text-muted-foreground")}>
                          {transaction.amount >= 0 ? "+" : ""}
                          {formatCredits(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedPlacement} onOpenChange={(open) => (!open ? setSelectedPlacementId(null) : undefined)}>
        {selectedPlacement ? (
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPlacement.subscribed ? "Manage credit allocation" : "Subscribe to ad placement"}</DialogTitle>
              <DialogDescription>
                Allocate credits to this placement. Higher allocations improve rank, but only reserved credits are committed.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/70 bg-muted/20">
                  <img src={selectedPlacement.imageUrl} alt="" className="h-full w-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white">
                    <Plus className="h-6 w-6" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/70 p-3 text-sm">
                  <div className="font-medium text-foreground">{selectedPlacement.itemName}</div>
                  <div className="mt-1 text-muted-foreground">{selectedPlacement.surface}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <PlacementStatusBadge status={selectedPlacement.status} />
                    <Badge variant="outline" className="rounded-full">
                      {selectedPlacement.region}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/70 p-3">
                    <div className="text-xs text-muted-foreground">Minimum</div>
                    <div className="mt-1 text-lg font-semibold">{formatCredits(selectedPlacement.minCredits)}</div>
                  </div>
                  <div className="rounded-lg border border-border/70 p-3">
                    <div className="text-xs text-muted-foreground">Leader</div>
                    <div className="mt-1 text-lg font-semibold">{formatCredits(selectedPlacement.currentLeaderCredits)}</div>
                  </div>
                  <div className="rounded-lg border border-border/70 p-3">
                    <div className="text-xs text-muted-foreground">Wallet free</div>
                    <div className="mt-1 text-lg font-semibold">{formatCredits(availableCredits)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="bid-credits" className="text-sm font-medium text-foreground">
                      Credit allocation
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {selectedCreditDelta > 0 ? `${formatCredits(selectedCreditDelta)} new credits` : "No new credits needed"}
                    </span>
                  </div>
                  <Input
                    id="bid-credits"
                    type="number"
                    min={selectedPlacement.minCredits}
                    value={bidAmount}
                    onChange={(event) => setBidAmount(Number(event.target.value))}
                  />
                  <Slider
                    value={[bidAmount]}
                    min={selectedPlacement.minCredits}
                    max={Math.max(selectedPlacement.currentLeaderCredits + 2500, selectedPlacement.minCredits + availableCredits + selectedExistingAllocation)}
                    step={50}
                    onValueChange={(value) => setBidAmount(value[0] ?? selectedPlacement.minCredits)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Run length</label>
                    <Select value={durationDays} onValueChange={setDurationDays}>
                      <SelectTrigger>
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[7, 14, 30, 60, 90].map((days) => (
                          <SelectItem key={days} value={String(days)}>
                            {days} days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-border/70 p-3 text-sm">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      {bidAmount >= selectedPlacement.currentLeaderCredits ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <CalendarClock className="h-4 w-4 text-amber-300" />
                      )}
                      {bidAmount >= selectedPlacement.currentLeaderCredits ? "Likely winning" : "Below current leader"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Current leader is {formatCredits(selectedPlacement.currentLeaderCredits)} credits.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Internal note</label>
                  <Textarea
                    value={bidNotes}
                    onChange={(event) => setBidNotes(event.target.value)}
                    placeholder="Optional campaign note for this allocation"
                    rows={3}
                  />
                </div>

                {!canSubmitBid ? (
                  <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-3 text-sm text-amber-200">
                    Increase the bid above the minimum or buy more credits before submitting this allocation.
                  </div>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPlacementId(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitBid} disabled={!canSubmitBid}>
                {selectedPlacement.subscribed ? "Update allocation" : "Subscribe with credits"}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </DashboardLayout>
  );
};

const seedPlacementsWithStatus = (placements: AdPlacement[]) =>
  placements.map((placement) => ({
    ...placement,
    status: placement.subscribed ? placement.status : "available",
  }));

export default AdvertisingPage;
