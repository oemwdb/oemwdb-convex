import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarClock,
  CircleOff,
  Filter,
  Globe2,
  HandCoins,
  Link2,
  Megaphone,
  PanelTop,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RegionScope = "NA" | "UK" | "EU" | "global";
type PlacementType =
  | "affiliate_link"
  | "cta_stack"
  | "merchant_compare"
  | "sponsored_module"
  | "market_outbound";
type ProductCategory =
  | "wheel"
  | "vehicle"
  | "tire"
  | "engine"
  | "color"
  | "topic"
  | "market";
type PlacementPosition =
  | "card link"
  | "below card/list"
  | "inline block"
  | "rail/sidebar"
  | "after every N rows"
  | "item-page primary CTA"
  | "item-page secondary CTA";
type SurfaceFamily =
  | "collection pages"
  | "item pages"
  | "variant lists"
  | "market tab surfaces"
  | "topic/news pages";
type SlotType = "hero" | "inline" | "related" | "market spotlight" | "topic sponsor";
type RequestStatus = "pending" | "approved" | "rejected";

interface AffiliatePlacement {
  id: string;
  placementName: string;
  surfaceFamily: SurfaceFamily;
  surfaceKey: string;
  placementType: PlacementType;
  position: PlacementPosition;
  enabled: boolean;
  provider: string;
  region: RegionScope;
  categories: ProductCategory[];
  priority: number;
  notes: string;
}

interface SponsorSlot {
  id: string;
  slotName: string;
  surfaceFamily: SurfaceFamily;
  surfaceKey: string;
  slotType: SlotType;
  reservePrice: number;
  durationOptions: number[];
  active: boolean;
  maxWinners: number;
  exclusivity: "exclusive" | "shared";
  region: RegionScope;
  categories: ProductCategory[];
  approvedRelevance: string[];
  notes: string;
}

interface SponsorRequest {
  id: string;
  sponsorName: string;
  requestedSlotId: string;
  requestedStart: string;
  requestedEnd: string;
  bid: number;
  region: RegionScope;
  categories: ProductCategory[];
  status: RequestStatus;
  notes: string;
}

interface ScheduledCampaign {
  id: string;
  sponsorName: string;
  slotId: string;
  startDate: string;
  endDate: string;
  bid: number;
  region: RegionScope;
  categories: ProductCategory[];
  sourceRequestId?: string;
}

const seededPlacements: AffiliatePlacement[] = [
  {
    id: "apl_ebay_wheel_primary",
    placementName: "Wheel detail primary exact-match CTA",
    surfaceFamily: "item pages",
    surfaceKey: "wheel-detail",
    placementType: "affiliate_link",
    position: "item-page primary CTA",
    enabled: true,
    provider: "eBay",
    region: "global",
    categories: ["wheel"],
    priority: 1,
    notes: "Exact OEM wheel intent. Use when part number or family title is specific enough.",
  },
  {
    id: "apl_tirerack_variant_tire",
    placementName: "Variant table tire-size CTA",
    surfaceFamily: "variant lists",
    surfaceKey: "wheel-variants-table",
    placementType: "cta_stack",
    position: "item-page secondary CTA",
    enabled: true,
    provider: "Tire Rack",
    region: "NA",
    categories: ["tire", "wheel"],
    priority: 1,
    notes: "North America only. Replace with Delticom family for EU routing.",
  },
  {
    id: "apl_delticom_variant_tire",
    placementName: "Variant table EU tire CTA",
    surfaceFamily: "variant lists",
    surfaceKey: "wheel-variants-table",
    placementType: "cta_stack",
    position: "item-page secondary CTA",
    enabled: true,
    provider: "Delticom",
    region: "EU",
    categories: ["tire", "wheel"],
    priority: 2,
    notes: "Country-routed tyre storefront family for mainland Europe.",
  },
  {
    id: "apl_market_featured_vendor",
    placementName: "Market tab featured merchant strip",
    surfaceFamily: "market tab surfaces",
    surfaceKey: "market-listings",
    placementType: "market_outbound",
    position: "inline block",
    enabled: false,
    provider: "eBay",
    region: "global",
    categories: ["market", "wheel", "vehicle"],
    priority: 3,
    notes: "Disabled until market surfaces settle.",
  },
  {
    id: "apl_topic_guides_tire",
    placementName: "Topic guide secondary merchant block",
    surfaceFamily: "topic/news pages",
    surfaceKey: "editorial-buying-guides",
    placementType: "merchant_compare",
    position: "after every N rows",
    enabled: true,
    provider: "Tire Rack",
    region: "NA",
    categories: ["topic", "tire"],
    priority: 2,
    notes: "Applies after guide modules, not inside body copy.",
  },
  {
    id: "apl_collection_sidebar",
    placementName: "Collection rail merchant module",
    surfaceFamily: "collection pages",
    surfaceKey: "wheel-collection",
    placementType: "sponsored_module",
    position: "rail/sidebar",
    enabled: false,
    provider: "Reserved",
    region: "global",
    categories: ["wheel", "vehicle"],
    priority: 4,
    notes: "Held back until sponsor inventory is live.",
  },
];

const seededSlots: SponsorSlot[] = [
  {
    id: "ssl_wheel_hero",
    slotName: "Wheel detail hero sponsor",
    surfaceFamily: "item pages",
    surfaceKey: "wheel-detail",
    slotType: "hero",
    reservePrice: 1800,
    durationOptions: [30, 60, 90],
    active: true,
    maxWinners: 1,
    exclusivity: "exclusive",
    region: "global",
    categories: ["wheel", "tire"],
    approvedRelevance: ["OEM wheel specialists", "Tyre retailers", "Premium detailing"],
    notes: "Premium placement above fold. Human approval only.",
  },
  {
    id: "ssl_variant_inline",
    slotName: "Wheel variants inline sponsor",
    surfaceFamily: "variant lists",
    surfaceKey: "wheel-variants-table",
    slotType: "inline",
    reservePrice: 950,
    durationOptions: [30, 60, 90],
    active: true,
    maxWinners: 1,
    exclusivity: "exclusive",
    region: "EU",
    categories: ["wheel", "tire"],
    approvedRelevance: ["Regional tyre merchants", "Fitment specialists"],
    notes: "Sits under the card block and above the table fold.",
  },
  {
    id: "ssl_market_spotlight",
    slotName: "Market spotlight vendor slot",
    surfaceFamily: "market tab surfaces",
    surfaceKey: "market-home",
    slotType: "market spotlight",
    reservePrice: 1200,
    durationOptions: [30, 60],
    active: true,
    maxWinners: 2,
    exclusivity: "shared",
    region: "global",
    categories: ["market", "wheel", "vehicle"],
    approvedRelevance: ["Verified vendors", "OEM part sellers"],
    notes: "Can run two winners if categories do not conflict.",
  },
  {
    id: "ssl_topic_sponsor",
    slotName: "Buying guide topic sponsor",
    surfaceFamily: "topic/news pages",
    surfaceKey: "buying-guides",
    slotType: "topic sponsor",
    reservePrice: 800,
    durationOptions: [30, 60, 90],
    active: false,
    maxWinners: 1,
    exclusivity: "exclusive",
    region: "NA",
    categories: ["topic", "tire", "wheel"],
    approvedRelevance: ["Tyre retailers", "Wheel retailers", "Fitment tools"],
    notes: "Inactive until editorial surfaces stabilize.",
  },
];

const seededRequests: SponsorRequest[] = [
  {
    id: "srq_delticom_spring",
    sponsorName: "Delticom Spring Fitment Push",
    requestedSlotId: "ssl_variant_inline",
    requestedStart: "2026-04-15",
    requestedEnd: "2026-05-15",
    bid: 1200,
    region: "EU",
    categories: ["tire", "wheel"],
    status: "pending",
    notes: "Wants EU variant-table coverage for summer tyre season.",
  },
  {
    id: "srq_ebay_exact",
    sponsorName: "eBay Exact Wheel Push",
    requestedSlotId: "ssl_wheel_hero",
    requestedStart: "2026-05-01",
    requestedEnd: "2026-05-31",
    bid: 2100,
    region: "global",
    categories: ["wheel"],
    status: "approved",
    notes: "Strong contextual fit for exact OEM item pages.",
  },
  {
    id: "srq_michelin_na",
    sponsorName: "Michelin Fitment Education",
    requestedSlotId: "ssl_topic_sponsor",
    requestedStart: "2026-04-10",
    requestedEnd: "2026-06-09",
    bid: 950,
    region: "NA",
    categories: ["topic", "tire"],
    status: "pending",
    notes: "Needs review because topic inventory is still inactive.",
  },
  {
    id: "srq_vendor_market",
    sponsorName: "OEM Auto Supply Market Highlight",
    requestedSlotId: "ssl_market_spotlight",
    requestedStart: "2026-04-05",
    requestedEnd: "2026-05-04",
    bid: 1300,
    region: "global",
    categories: ["market", "wheel"],
    status: "approved",
    notes: "Verified seller with high OEM relevance.",
  },
  {
    id: "srq_second_vendor_market",
    sponsorName: "Classic Hub Centre",
    requestedSlotId: "ssl_market_spotlight",
    requestedStart: "2026-04-20",
    requestedEnd: "2026-05-30",
    bid: 900,
    region: "EU",
    categories: ["market", "wheel"],
    status: "pending",
    notes: "Overlaps with current market spotlight request.",
  },
];

const seededCampaigns: ScheduledCampaign[] = [
  {
    id: "cmp_ebay_may",
    sponsorName: "eBay Exact Wheel Push",
    slotId: "ssl_wheel_hero",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    bid: 2100,
    region: "global",
    categories: ["wheel"],
    sourceRequestId: "srq_ebay_exact",
  },
  {
    id: "cmp_vendor_april",
    sponsorName: "OEM Auto Supply Market Highlight",
    slotId: "ssl_market_spotlight",
    startDate: "2026-04-05",
    endDate: "2026-05-04",
    bid: 1300,
    region: "global",
    categories: ["market", "wheel"],
    sourceRequestId: "srq_vendor_market",
  },
];

const surfaceOptions: Array<SurfaceFamily | "all"> = [
  "all",
  "collection pages",
  "item pages",
  "variant lists",
  "market tab surfaces",
  "topic/news pages",
];

const regionOptions: Array<RegionScope | "all"> = ["all", "NA", "UK", "EU", "global"];
const statusOptions = ["all", "enabled", "disabled", "active", "inactive", "pending", "approved", "rejected", "scheduled"] as const;
const slotTypeOptions: Array<SlotType | "all"> = ["all", "hero", "inline", "related", "market spotlight", "topic sponsor"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const rangeOverlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  new Date(aStart).getTime() <= new Date(bEnd).getTime() &&
  new Date(bStart).getTime() <= new Date(aEnd).getTime();

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return `${startDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${endDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })}`;
};

const getCampaignStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Scheduled";
  if (now > end) return "Ended";
  return "Live";
};

const StatusBadge = ({ label }: { label: string }) => {
  const tone =
    label === "enabled" || label === "active" || label === "approved" || label === "Live"
      ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
      : label === "pending" || label === "Scheduled"
        ? "text-amber-300 border-amber-500/30 bg-amber-500/10"
        : label === "disabled" || label === "inactive"
          ? "text-zinc-300 border-zinc-500/30 bg-zinc-500/10"
          : "text-red-300 border-red-500/30 bg-red-500/10";

  return (
    <Badge variant="outline" className={cn("rounded-full capitalize", tone)}>
      {label}
    </Badge>
  );
};

const EmptyStateRow = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

const AdvertisingPage = () => {
  const [placements, setPlacements] = useState(seededPlacements);
  const [slots, setSlots] = useState(seededSlots);
  const [requests, setRequests] = useState(seededRequests);
  const [campaigns, setCampaigns] = useState(seededCampaigns);

  const [searchValue, setSearchValue] = useState("");
  const [surfaceFilter, setSurfaceFilter] = useState<(typeof surfaceOptions)[number]>("all");
  const [regionFilter, setRegionFilter] = useState<(typeof regionOptions)[number]>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [slotTypeFilter, setSlotTypeFilter] = useState<(typeof slotTypeOptions)[number]>("all");

  const slotById = useMemo(
    () =>
      slots.reduce<Record<string, SponsorSlot>>((acc, slot) => {
        acc[slot.id] = slot;
        return acc;
      }, {}),
    [slots]
  );

  const providerOptions = useMemo(() => {
    const values = new Set<string>();
    placements.forEach((placement) => values.add(placement.provider));
    requests.forEach((request) => values.add(request.sponsorName));
    campaigns.forEach((campaign) => values.add(campaign.sponsorName));
    return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [campaigns, placements, requests]);

  const requestRows = useMemo(() => {
    return requests.map((request) => {
      const slot = slotById[request.requestedSlotId];
      const overlappingRequests = requests.filter(
        (other) =>
          other.id !== request.id &&
          other.requestedSlotId === request.requestedSlotId &&
          other.status !== "rejected" &&
          rangeOverlaps(request.requestedStart, request.requestedEnd, other.requestedStart, other.requestedEnd)
      );
      const overlappingCampaigns = campaigns.filter(
        (campaign) =>
          campaign.slotId === request.requestedSlotId &&
          rangeOverlaps(request.requestedStart, request.requestedEnd, campaign.startDate, campaign.endDate)
      );

      return {
        ...request,
        slot,
        overlapCount: overlappingRequests.length + overlappingCampaigns.length,
        hasConflict:
          overlappingRequests.length > 0 ||
          (slot ? slot.maxWinners <= overlappingCampaigns.length : false),
      };
    });
  }, [campaigns, requests, slotById]);

  const filteredPlacements = useMemo(() => {
    return placements.filter((placement) => {
      if (
        searchValue &&
        !`${placement.placementName} ${placement.notes} ${placement.provider} ${placement.surfaceKey}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      if (surfaceFilter !== "all" && placement.surfaceFamily !== surfaceFilter) return false;
      if (regionFilter !== "all" && placement.region !== regionFilter) return false;
      if (providerFilter !== "all" && placement.provider !== providerFilter) return false;
      if (slotTypeFilter !== "all") return false;
      if (statusFilter !== "all") {
        const status = placement.enabled ? "enabled" : "disabled";
        if (status !== statusFilter) return false;
      }
      return true;
    });
  }, [placements, providerFilter, regionFilter, searchValue, slotTypeFilter, statusFilter, surfaceFilter]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (
        searchValue &&
        !`${slot.slotName} ${slot.notes} ${slot.surfaceKey} ${slot.approvedRelevance.join(" ")}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      if (surfaceFilter !== "all" && slot.surfaceFamily !== surfaceFilter) return false;
      if (regionFilter !== "all" && slot.region !== regionFilter) return false;
      if (slotTypeFilter !== "all" && slot.slotType !== slotTypeFilter) return false;
      if (providerFilter !== "all") return false;
      if (statusFilter !== "all") {
        const status = slot.active ? "active" : "inactive";
        if (status !== statusFilter) return false;
      }
      return true;
    });
  }, [providerFilter, regionFilter, searchValue, slotTypeFilter, slots, statusFilter, surfaceFilter]);

  const filteredRequests = useMemo(() => {
    return requestRows.filter((request) => {
      if (
        searchValue &&
        !`${request.sponsorName} ${request.notes} ${request.slot?.slotName ?? ""}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      if (surfaceFilter !== "all" && request.slot?.surfaceFamily !== surfaceFilter) return false;
      if (regionFilter !== "all" && request.region !== regionFilter) return false;
      if (providerFilter !== "all" && request.sponsorName !== providerFilter) return false;
      if (slotTypeFilter !== "all" && request.slot?.slotType !== slotTypeFilter) return false;
      if (statusFilter !== "all" && request.status !== statusFilter) return false;
      return true;
    });
  }, [providerFilter, regionFilter, requestRows, searchValue, slotTypeFilter, statusFilter, surfaceFilter]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const slot = slotById[campaign.slotId];
      const campaignStatus = getCampaignStatus(campaign.startDate, campaign.endDate);
      if (
        searchValue &&
        !`${campaign.sponsorName} ${slot?.slotName ?? ""} ${campaign.categories.join(" ")}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      if (surfaceFilter !== "all" && slot?.surfaceFamily !== surfaceFilter) return false;
      if (regionFilter !== "all" && campaign.region !== regionFilter) return false;
      if (providerFilter !== "all" && campaign.sponsorName !== providerFilter) return false;
      if (slotTypeFilter !== "all" && slot?.slotType !== slotTypeFilter) return false;
      if (statusFilter !== "all" && campaignStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [campaigns, providerFilter, regionFilter, searchValue, slotById, slotTypeFilter, statusFilter, surfaceFilter]);

  const handlePlacementToggle = (placementId: string, enabled: boolean) => {
    setPlacements((current) =>
      current.map((placement) => (placement.id === placementId ? { ...placement, enabled } : placement))
    );
  };

  const handleSlotToggle = (slotId: string, active: boolean) => {
    setSlots((current) => current.map((slot) => (slot.id === slotId ? { ...slot, active } : slot)));
  };

  const handleRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((current) => current.map((request) => (request.id === requestId ? { ...request, status } : request)));
    if (status === "rejected") {
      setCampaigns((current) => current.filter((campaign) => campaign.sourceRequestId !== requestId));
    }
  };

  const handleAssignRequest = (requestId: string) => {
    const request = requests.find((entry) => entry.id === requestId);
    if (!request) return;

    setRequests((current) =>
      current.map((entry) => (entry.id === requestId ? { ...entry, status: "approved" } : entry))
    );

    setCampaigns((current) => {
      const nextCampaign: ScheduledCampaign = {
        id: `cmp_${requestId}`,
        sponsorName: request.sponsorName,
        slotId: request.requestedSlotId,
        startDate: request.requestedStart,
        endDate: request.requestedEnd,
        bid: request.bid,
        region: request.region,
        categories: request.categories,
        sourceRequestId: request.id,
      };

      const existingIndex = current.findIndex((campaign) => campaign.sourceRequestId === requestId);
      if (existingIndex === -1) return [nextCampaign, ...current];

      const clone = [...current];
      clone[existingIndex] = nextCampaign;
      return clone;
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    setSurfaceFilter("all");
    setRegionFilter("all");
    setProviderFilter("all");
    setStatusFilter("all");
    setSlotTypeFilter("all");
  };

  const activePlacementsCount = placements.filter((placement) => placement.enabled).length;
  const activeSlotsCount = slots.filter((slot) => slot.active).length;
  const pendingRequestsCount = requests.filter((request) => request.status === "pending").length;
  const scheduledCampaignCount = campaigns.filter((campaign) => getCampaignStatus(campaign.startDate, campaign.endDate) !== "Ended").length;
  const disabledPlacementsCount = placements.filter((placement) => !placement.enabled).length;

  return (
    <DashboardLayout title="Advertising" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-2 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Advertising</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Contextual monetization control board for affiliate placements, sponsor inventory, and adjudicated reservations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
              Admin only
            </Badge>
            <Badge variant="outline" className="rounded-full border-border/60 bg-card/50 text-muted-foreground">
              Seeded admin data
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatsCard title="Active Affiliate Placements" value={activePlacementsCount} description="Currently enabled merchant placements" icon={Link2} />
          <StatsCard title="Active Sponsor Slots" value={activeSlotsCount} description="Sellable contextual inventory" icon={Megaphone} />
          <StatsCard title="Pending Sponsor Requests" value={pendingRequestsCount} description="Waiting for manual review" icon={TriangleAlert} />
          <StatsCard title="Scheduled Campaigns" value={scheduledCampaignCount} description="Approved placements on the calendar" icon={CalendarClock} />
          <StatsCard title="Disabled Placements" value={disabledPlacementsCount} description="Paused or held-back affiliate surfaces" icon={CircleOff} />
        </div>

        <Card className="border-border/50 bg-card/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Control Filters
            </CardTitle>
            <CardDescription>
              Narrow the control board by surface, region, merchant/provider, status, or slot type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search placement, sponsor, slot, note…"
                className="xl:col-span-2"
              />

              <Select value={surfaceFilter} onValueChange={(value) => setSurfaceFilter(value as (typeof surfaceOptions)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Surface" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All surfaces" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value as (typeof regionOptions)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All regions" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider / sponsor" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All providers / sponsors" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as (typeof statusOptions)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All statuses" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={slotTypeFilter} onValueChange={(value) => setSlotTypeFilter(value as (typeof slotTypeOptions)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Slot type" />
                </SelectTrigger>
                <SelectContent>
                  {slotTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All slot types" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="rounded-full">
                  {filteredPlacements.length} placements
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {filteredSlots.length} sponsor slots
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {filteredRequests.length} requests
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {filteredCampaigns.length} campaigns
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                Affiliate Placements
              </CardTitle>
              <CardDescription>
                Manage contextual merchant placements by surface, position, region, and product intent.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placement</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlacements.length === 0 ? (
                    <EmptyStateRow colSpan={7} message="No affiliate placements match the current filters." />
                  ) : (
                    filteredPlacements.map((placement) => (
                      <TableRow key={placement.id}>
                        <TableCell className="align-top">
                          <div className="space-y-2">
                            <div className="font-medium text-foreground">{placement.placementName}</div>
                            <div className="flex flex-wrap gap-1.5 text-xs">
                              <Badge variant="outline" className="rounded-full">{placement.surfaceFamily}</Badge>
                              <Badge variant="outline" className="rounded-full">{placement.position}</Badge>
                              <Badge variant="outline" className="rounded-full">{placement.placementType.replaceAll("_", " ")}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium">{placement.provider}</div>
                          <div className="text-xs text-muted-foreground">{placement.surfaceKey}</div>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant="outline" className="rounded-full">
                            <Globe2 className="mr-1 h-3 w-3" />
                            {placement.region}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {placement.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="rounded-full capitalize">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">#{placement.priority}</TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">{placement.notes}</TableCell>
                        <TableCell className="align-top">
                          <div className="flex justify-end">
                            <Switch
                              checked={placement.enabled}
                              onCheckedChange={(checked) => handlePlacementToggle(placement.id, checked)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                Placement Rules
              </CardTitle>
              <CardDescription>
                Keep monetization contextual, regional, and curated. This board assumes one primary merchant intent per surface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 text-sm">
              <div className="rounded-2xl border border-border/60 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Primary rule</div>
                <div className="mt-2 font-medium text-foreground">Exact item intent and tire-size intent should not compete in the same cell.</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-emerald-400" />Affiliate quality</div>
                  <p className="mt-2 text-muted-foreground">Use region-aware merchants and keep positions explicit: primary CTA, secondary CTA, rail, or inline module.</p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center gap-2 font-medium"><PanelTop className="h-4 w-4 text-amber-400" />Sponsor relevance</div>
                  <p className="mt-2 text-muted-foreground">Slots are contextual inventory, not generic banner junk. Relevance must be approved before a sponsor can win inventory.</p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center gap-2 font-medium"><TriangleAlert className="h-4 w-4 text-red-400" />Conflict watch</div>
                  <p className="mt-2 text-muted-foreground">Overlapping requests are surfaced below so reservations can be adjudicated manually before anything goes live.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-4 w-4 text-muted-foreground" />
              Sponsor Inventory
            </CardTitle>
            <CardDescription>
              Curated slot definitions tied to specific site contexts, with reserve pricing and approved relevance guardrails.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Reserve</TableHead>
                  <TableHead>Durations</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead>Approved relevance</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSlots.length === 0 ? (
                  <EmptyStateRow colSpan={8} message="No sponsor slots match the current filters." />
                ) : (
                  filteredSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell className="align-top">
                        <div className="space-y-2">
                          <div className="font-medium text-foreground">{slot.slotName}</div>
                          <div className="flex flex-wrap gap-1.5 text-xs">
                            <Badge variant="outline" className="rounded-full">{slot.surfaceFamily}</Badge>
                            <Badge variant="outline" className="rounded-full">{slot.surfaceKey}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className="w-fit rounded-full capitalize">{slot.slotType}</Badge>
                          <StatusBadge label={slot.active ? "active" : "inactive"} />
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="outline" className="rounded-full">{slot.region}</Badge>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {slot.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="rounded-full capitalize">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="align-top font-medium">{formatCurrency(slot.reservePrice)}</TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {slot.durationOptions.map((duration) => (
                            <Badge key={duration} variant="outline" className="rounded-full">
                              {duration} days
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {slot.maxWinners} max / {slot.exclusivity}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {slot.approvedRelevance.map((value) => (
                            <Badge key={value} variant="outline" className="rounded-full">
                              {value}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{slot.notes}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex justify-end">
                          <Switch checked={slot.active} onCheckedChange={(checked) => handleSlotToggle(slot.id, checked)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HandCoins className="h-4 w-4 text-muted-foreground" />
                Sponsor Requests
              </CardTitle>
              <CardDescription>
                Manual adjudication workflow for incoming sponsor requests, with conflict awareness and explicit assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Requested slot</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Bid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Conflict</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <EmptyStateRow colSpan={7} message="No sponsor requests match the current filters." />
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="align-top">
                          <div className="font-medium">{request.sponsorName}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {request.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="rounded-full capitalize">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">{request.notes}</div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium">{request.slot?.slotName ?? "Unknown slot"}</div>
                          <div className="text-xs text-muted-foreground">{request.slot?.surfaceFamily ?? "Unknown surface"}</div>
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {formatDateRange(request.requestedStart, request.requestedEnd)}
                        </TableCell>
                        <TableCell className="align-top font-medium">{formatCurrency(request.bid)}</TableCell>
                        <TableCell className="align-top">
                          <StatusBadge label={request.status} />
                        </TableCell>
                        <TableCell className="align-top">
                          {request.hasConflict ? (
                            <Badge variant="outline" className="rounded-full border-red-500/30 bg-red-500/10 text-red-300">
                              {request.overlapCount} overlap{request.overlapCount === 1 ? "" : "s"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                              clear
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestStatus(request.id, "approved")}
                              disabled={request.status === "approved"}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestStatus(request.id, "rejected")}
                              disabled={request.status === "rejected"}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAssignRequest(request.id)}
                              disabled={request.status === "rejected"}
                            >
                              Assign
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TicketPercent className="h-4 w-4 text-muted-foreground" />
                Scheduled Campaigns
              </CardTitle>
              <CardDescription>
                Upcoming and live placements that have already won inventory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {filteredCampaigns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 px-4 py-10 text-center text-sm text-muted-foreground">
                  No scheduled campaigns match the current filters.
                </div>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const slot = slotById[campaign.slotId];
                  const campaignStatus = getCampaignStatus(campaign.startDate, campaign.endDate);

                  return (
                    <div key={campaign.id} className="rounded-2xl border border-border/60 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-foreground">{campaign.sponsorName}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{slot?.slotName ?? "Unknown slot"}</div>
                        </div>
                        <StatusBadge label={campaignStatus} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {formatDateRange(campaign.startDate, campaign.endDate)}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {campaign.region}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {formatCurrency(campaign.bid)}
                        </Badge>
                        {campaign.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="rounded-full capitalize">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvertisingPage;
