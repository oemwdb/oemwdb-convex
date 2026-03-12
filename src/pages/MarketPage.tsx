import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MapPin, Package, DollarSign, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollectionSecondarySidebar } from "@/components/collection/CollectionSecondarySidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface MarketListing {
  id: string;
  user_id: string;
  listing_type: "wheel" | "vehicle" | "part";
  title: string;
  description: string | null;
  price: number | null;
  condition: "new" | "like-new" | "good" | "fair" | "parts" | null;
  location: string | null;
  shipping_available: boolean;
  images: string[] | null;
  status: "active" | "sold";
  created_at: string;
  seller_profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    verification_status: string;
  } | null;
  brand: string;
}

const STATIC_MARKET_LISTINGS: MarketListing[] = [
  {
    id: "mk_1",
    user_id: "u_1",
    listing_type: "wheel",
    title: "BMW Style 32 set, 18 inch",
    description: "Straight set with minor curb rash.",
    price: 980,
    condition: "good",
    location: "Antwerp",
    shipping_available: true,
    images: ["https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80"],
    status: "active",
    created_at: "2026-03-08T10:00:00.000Z",
    brand: "BMW",
    seller_profile: {
      username: "gab",
      display_name: "Gabriel",
      avatar_url: null,
      verification_status: "verified",
    },
  },
  {
    id: "mk_2",
    user_id: "u_2",
    listing_type: "wheel",
    title: "Mini R115 Rib Spoke pair",
    description: "Refinished silver, no cracks.",
    price: 420,
    condition: "like-new",
    location: "Brussels",
    shipping_available: false,
    images: null,
    status: "active",
    created_at: "2026-03-06T16:20:00.000Z",
    brand: "Mini",
    seller_profile: {
      username: "miniworks",
      display_name: "Mini Works",
      avatar_url: null,
      verification_status: "verified",
    },
  },
  {
    id: "mk_3",
    user_id: "u_3",
    listing_type: "vehicle",
    title: "E46 330Ci rolling shell with OEM wheels",
    description: "Track project base, paperwork included.",
    price: 3400,
    condition: "fair",
    location: "Ghent",
    shipping_available: false,
    images: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"],
    status: "active",
    created_at: "2026-03-07T09:45:00.000Z",
    brand: "BMW",
    seller_profile: {
      username: "trackbase",
      display_name: "Track Base",
      avatar_url: null,
      verification_status: "basic",
    },
  },
  {
    id: "mk_4",
    user_id: "u_4",
    listing_type: "part",
    title: "BBS center caps set of 4",
    description: "Used but complete.",
    price: 95,
    condition: "good",
    location: "Liege",
    shipping_available: true,
    images: null,
    status: "active",
    created_at: "2026-03-05T13:15:00.000Z",
    brand: "BBS",
    seller_profile: {
      username: "capsvault",
      display_name: null,
      avatar_url: null,
      verification_status: "basic",
    },
  },
  {
    id: "mk_5",
    user_id: "u_5",
    listing_type: "wheel",
    title: "Porsche twist wheels, restoration project",
    description: "Good base for refurb.",
    price: 250,
    condition: "parts",
    location: "Namur",
    shipping_available: true,
    images: null,
    status: "active",
    created_at: "2026-03-03T11:30:00.000Z",
    brand: "Porsche",
    seller_profile: {
      username: "aircooledbits",
      display_name: "Aircooled Bits",
      avatar_url: null,
      verification_status: "verified",
    },
  },
  {
    id: "mk_6",
    user_id: "u_6",
    listing_type: "part",
    title: "Mercedes locking bolts",
    description: "OEM set with key.",
    price: 60,
    condition: "new",
    location: "Leuven",
    shipping_available: true,
    images: null,
    status: "active",
    created_at: "2026-03-04T08:10:00.000Z",
    brand: "Mercedes-Benz",
    seller_profile: {
      username: "starparts",
      display_name: "Star Parts",
      avatar_url: null,
      verification_status: "verified",
    },
  },
];

const MARKET_FILTER_FIELDS = [
  { label: "Type", category: "type", values: ["Wheel", "Vehicle", "Part"] },
  { label: "Condition", category: "condition", values: ["New", "Like New", "Good", "Fair", "For Parts"] },
  { label: "Brand", category: "brand", values: ["BMW", "Mini", "Porsche", "Mercedes-Benz", "BBS"] },
  { label: "Price", category: "priceRange", values: ["Under $100", "$100-$500", "$500-$1,000", "$1,000+"] },
  { label: "Location", category: "location", values: ["Antwerp", "Brussels", "Ghent", "Liege", "Leuven", "Namur"] },
  { label: "Shipping", category: "shipping", values: ["Ships", "Pickup Only"] },
  { label: "Seller", category: "seller", values: ["Verified", "Standard"] },
] as const;

const MARKET_CREATE_PRESETS = [
  { label: "Wheel Set", helper: "Full sets, singles, OEM take-offs" },
  { label: "Individual Wheel", helper: "Single wheel, spare, replacement rim" },
  { label: "Vehicle", helper: "Cars, shells, rollers, complete builds" },
  { label: "Parts", helper: "Caps, bolts, spacers, trim, hardware" },
];

const MarketPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [parsedFilters, setParsedFilters] = useState<Record<string, string[] | undefined>>({});
  const [createType, setCreateType] = useState("Wheel Set");

  const handleTagClick = (tag: string, category: string) => {
    setParsedFilters((prev) => {
      const existing = prev[category] ?? [];
      const nextValues = existing.includes(tag)
        ? existing.filter((value) => value !== tag)
        : [...existing, tag];

      return {
        ...prev,
        [category]: nextValues.length > 0 ? nextValues : undefined,
      };
    });
  };

  const handleRemoveFilter = (category: string, value: string) => {
    setParsedFilters((prev) => {
      const existing = prev[category] ?? [];
      const nextValues = existing.filter((item) => item !== value);
      return {
        ...prev,
        [category]: nextValues.length > 0 ? nextValues : undefined,
      };
    });
  };

  const handleClearAllFilters = () => {
    setParsedFilters({});
    setSelectedTypeTab("all");
    setSearchValue("");
  };

  const filteredListings = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();

    const matchesPriceRange = (price: number | null, ranges: string[]) => {
      if (!ranges.length) return true;
      const value = price ?? 0;
      return ranges.some((range) => {
        switch (range) {
          case "Under $100":
            return value < 100;
          case "$100-$500":
            return value >= 100 && value <= 500;
          case "$500-$1,000":
            return value > 500 && value <= 1000;
          case "$1,000+":
            return value > 1000;
          default:
            return true;
        }
      });
    };

    const base = STATIC_MARKET_LISTINGS.filter((listing) => {
      if (selectedTypeTab !== "all" && listing.listing_type !== selectedTypeTab) return false;

      if (searchTerm) {
        const haystack = [
          listing.title,
          listing.description ?? "",
          listing.location ?? "",
          listing.brand,
          listing.seller_profile?.display_name ?? "",
          listing.seller_profile?.username ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(searchTerm)) return false;
      }

      if (parsedFilters.type?.length) {
        const matches = parsedFilters.type.some(
          (value) => listing.listing_type === value.toLowerCase()
        );
        if (!matches) return false;
      }

      if (parsedFilters.condition?.length) {
        const normalizedCondition = listing.condition === "like-new" ? "Like New" : listing.condition === "parts" ? "For Parts" : listing.condition ? `${listing.condition.charAt(0).toUpperCase()}${listing.condition.slice(1)}` : "";
        if (!parsedFilters.condition.includes(normalizedCondition)) return false;
      }

      if (parsedFilters.brand?.length && !parsedFilters.brand.includes(listing.brand)) return false;

      if (!matchesPriceRange(listing.price, parsedFilters.priceRange ?? [])) return false;

      if (parsedFilters.location?.length && !parsedFilters.location.includes(listing.location ?? "")) return false;

      if (parsedFilters.shipping?.length) {
        const shippingLabel = listing.shipping_available ? "Ships" : "Pickup Only";
        if (!parsedFilters.shipping.includes(shippingLabel)) return false;
      }

      if (parsedFilters.seller?.length) {
        const sellerLabel = listing.seller_profile?.verification_status === "verified" ? "Verified" : "Standard";
        if (!parsedFilters.seller.includes(sellerLabel)) return false;
      }

      return true;
    });

    return [...base].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-high":
          return (b.price ?? 0) - (a.price ?? 0);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [parsedFilters, searchValue, selectedTypeTab, sortBy]);

  const stats = useMemo(() => {
    const activeListings = filteredListings.length;
    const wheelCount = filteredListings.filter((listing) => listing.listing_type === "wheel").length;
    const vehicleCount = filteredListings.filter((listing) => listing.listing_type === "vehicle").length;
    const totalValue = filteredListings.reduce((sum, listing) => sum + (listing.price ?? 0), 0);
    return { activeListings, wheelCount, vehicleCount, totalValue };
  }, [filteredListings]);

  const getConditionBadge = (condition: MarketListing["condition"]) => {
    if (!condition) return null;

    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      new: "default",
      "like-new": "default",
      good: "secondary",
      fair: "outline",
      parts: "destructive",
    };

    const label = condition === "like-new"
      ? "Like New"
      : condition === "parts"
        ? "For Parts"
        : `${condition.charAt(0).toUpperCase()}${condition.slice(1)}`;

    return (
      <Badge variant={variants[condition] || "outline"} className="text-xs">
        {label}
      </Badge>
    );
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DashboardLayout
      title="Marketplace"
      showSearch={false}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search listings, sellers, brands..."
      parsedFilters={parsedFilters}
      onRemoveFilter={handleRemoveFilter}
      secondaryTitle="Filters"
      secondaryActionIcon={<SlidersHorizontal className="h-4 w-4" />}
      customTitle="Create Listing"
      customActionIcon={<Plus className="h-4 w-4" />}
      customSidebar={
        <div className="flex h-full flex-col">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {MARKET_CREATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setCreateType(preset.label)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    createType === preset.label
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="text-sm font-medium">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">{preset.helper}</div>
                </button>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="market-title">Title</Label>
                <Input id="market-title" placeholder="OEM BBS RC090 set, straight, no welds" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="market-brand">Brand</Label>
                  <Input id="market-brand" placeholder="BMW" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="market-price">Price</Label>
                  <Input id="market-price" placeholder="$950" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="market-location">Location</Label>
                  <Input id="market-location" placeholder="Brussels" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="market-condition">Condition</Label>
                  <Input id="market-condition" placeholder="Good" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="market-desc">Description</Label>
                <Textarea
                  id="market-desc"
                  placeholder="Notes, fitment, condition details, missing caps, offsets, known issues."
                  className="min-h-28"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-3">
                <div>
                  <div className="text-sm font-medium">Shipping available</div>
                  <div className="text-xs text-muted-foreground">Used to drive the marketplace shipping facet.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
            <div className="flex gap-2">
              <Button className="flex-1">Save Draft</Button>
              <Button variant="outline" className="flex-1">
                Preview
              </Button>
            </div>
          </div>
        </div>
      }
      secondarySidebar={
        <CollectionSecondarySidebar
          title="Filters"
          filterFields={MARKET_FILTER_FIELDS.map((field) => ({
            label: field.label,
            category: field.category,
            values: [...field.values],
          }))}
          parsedFilters={parsedFilters}
          onTagClick={handleTagClick}
          onClearAll={handleClearAllFilters}
          totalResults={filteredListings.length}
        />
      }
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Tabs value={selectedTypeTab} onValueChange={setSelectedTypeTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 h-10 bg-muted/60">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="wheel">Wheels</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicles</TabsTrigger>
              <TabsTrigger value="part">Parts</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px] h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 border-border/50 bg-card/80">
            <div className="text-3xl font-semibold">{stats.activeListings}</div>
            <div className="text-xs text-muted-foreground">Active Listings</div>
          </Card>
          <Card className="p-4 border-border/50 bg-card/80">
            <div className="text-3xl font-semibold">{stats.wheelCount}</div>
            <div className="text-xs text-muted-foreground">Wheels</div>
          </Card>
          <Card className="p-4 border-border/50 bg-card/80">
            <div className="text-3xl font-semibold">{stats.vehicleCount}</div>
            <div className="text-xs text-muted-foreground">Vehicles</div>
          </Card>
          <Card className="p-4 border-border/50 bg-card/80">
            <div className="text-3xl font-semibold">{formatPrice(stats.totalValue)}</div>
            <div className="text-xs text-muted-foreground">Visible Value</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="group overflow-hidden border-border/50 hover:border-border transition-all hover:shadow-sm cursor-pointer bg-card/90"
                onClick={() => navigate(`/market/${listing.id}`)}
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}

                  <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
                    <Badge className="text-xs capitalize">
                      {listing.listing_type}
                    </Badge>
                    {listing.shipping_available ? (
                      <Badge variant="secondary" className="text-[10px]">
                        Ships
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="p-3 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm line-clamp-2 flex-1">
                        {listing.title}
                      </h3>
                      {getConditionBadge(listing.condition)}
                    </div>

                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="text-sm">{formatPrice(listing.price)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {listing.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.location}</span>
                        </div>
                      ) : null}
                      <span>{listing.brand}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={listing.seller_profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {listing.seller_profile?.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {listing.seller_profile?.display_name || listing.seller_profile?.username || "Unknown"}
                    </span>
                    {listing.seller_profile?.verification_status === "verified" ? (
                      <Badge variant="outline" className="ml-auto text-[10px] h-5">
                        Verified
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center border-border/50">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No listings match the current filters</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Clear the market filters or adjust the type tab to widen the feed.
                </p>
                <Button onClick={handleClearAllFilters} size="sm" variant="outline">
                  Reset Filters
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPage;
