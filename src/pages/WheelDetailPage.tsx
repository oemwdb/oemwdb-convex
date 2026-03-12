import React, { useState } from "react";
import { useDevMode } from "@/hooks/useDevMode";
import { useWheelByName } from "@/hooks/useWheels";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CircleSlash2, ChevronLeft, Gauge, Palette, MessageSquare, Package2, DollarSign, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import GallerySection from "@/components/vehicle/GallerySection";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";

const WheelDetailPage = () => {
  const { isDevMode } = useDevMode();
  const { wheelName } = useParams<{ wheelName: string }>();
  const [activeTab, setActiveTab] = useState("fitment");

  // Fetch wheel with related vehicles from Convex
  const { data: wheel, isLoading, error } = useWheelByName(wheelName || "");
  const marketListings = useQuery(
    api.queries.marketListingsGetByWheel,
    isDevMode && wheel?._id ? { wheelId: wheel._id } : "skip"
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Loading...">
        <Card className="p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading wheel details...</p>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !wheel) {
    return (
      <DashboardLayout title="Wheel Details">
        <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
          <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Wheel not found</h2>
          <p className="mb-6 text-muted-foreground">Sorry, we couldn't find this wheel in our database.</p>
          <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Link to="/wheels">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Wheels
            </Link>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  // Format compatible vehicles
  const fitmentVehicles = wheel.vehicles ?? [];

  const compatibleVehicles = fitmentVehicles.map(v => ({
    name: v.model_name || v.chassis_code,
    year: v.production_years || "",
    brand: v.brand_name || "",
    fitmentNote: v.fitment_notes || (v.is_oem_fitment ? "OEM Fitment" : "Aftermarket")
  }));

  // Gallery images
  const galleryImages = wheel.good_pic_url ? [{
    id: 1,
    url: wheel.good_pic_url,
    alt: `${wheel.wheel_name} wheel`,
    user: "Official",
    date: "Official Photo"
  }] : [];

  const wheelSpecs = {
    diameter_refs: (wheel.diameter_refs && wheel.diameter_refs.length > 0) ? wheel.diameter_refs : (wheel.diameter ? [wheel.diameter] : []),
    width_ref: (wheel.width_ref && wheel.width_ref.length > 0) ? wheel.width_ref : (wheel.width ? [wheel.width] : []),
    offset: wheel.wheel_offset || "",
    bolt_pattern_refs: (wheel.bolt_pattern_refs && wheel.bolt_pattern_refs.length > 0) ? wheel.bolt_pattern_refs : (wheel.bolt_pattern ? [wheel.bolt_pattern] : []),
    center_bore_ref: (wheel.center_bore_ref && wheel.center_bore_ref.length > 0) ? wheel.center_bore_ref : (wheel.center_bore ? [wheel.center_bore] : []),
    color_refs: (wheel.color_refs && wheel.color_refs.length > 0) ? wheel.color_refs : (wheel.color ? [wheel.color] : []),
    tire_size_refs: (wheel.tire_size_refs && wheel.tire_size_refs.length > 0) ? wheel.tire_size_refs : (wheel.tire_size ? [wheel.tire_size] : [])
  };

  // Generate available sizes based on the wheel model
  const availableSizes = [
    {
      diameter: wheel.diameter || "18\"",
      width: wheel.width || "8.5J",
      offset: wheel.wheel_offset || "ET40",
      finish: wheel.color || "Silver",
      price: "$249.99",
      inStock: wheel.status === "Ready for website"
    }
  ];

  const formatPrice = (price: number | null | undefined) => {
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
      title={`${wheel.wheel_name} Details`}
      secondaryTitle="Comments"
      secondarySidebar={
        <ItemCommentsPanel
          itemType="wheel"
          itemId={wheel._id}
          itemName={wheel.wheel_name}
        />
      }
      secondaryActionIcon={<MessageSquare className="h-4 w-4" />}
      disableContentPadding={true}
    >
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        {/* Hero section with gradient background */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 mb-6">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" asChild className="hover:bg-background/50">
                <Link to="/wheels">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Wheels
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {wheel.wheel_name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {wheel.brand_name || "Unknown Brand"}
                </Badge>
                {wheel.status === "Ready for website" && (
                  <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Available
                  </Badge>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <Package2 className="h-8 w-8 text-primary/50 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-semibold">{wheel.metal_type || "Alloy"}</p>
              </div>
              <div className="text-center">
                <Gauge className="h-8 w-8 text-primary/50 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Diameter</p>
                <p className="font-semibold">{wheel.diameter || "N/A"}</p>
              </div>
              <div className="text-center">
                <Palette className="h-8 w-8 text-primary/50 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Finish</p>
                <p className="font-semibold">{wheel.color || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wheel header section with ad space */}
        <div>
          <WheelHeader
            name={wheel.wheel_name}
            brand={wheel.brand_name || "Unknown"}
            price="$249.99"
            description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel`}
            goodPicUrl={wheel.good_pic_url}
            badPicUrl={wheel.bad_pic_url}
            specs={wheelSpecs}
            itemId={wheel.id}
            convexId={wheel._id}
          />
        </div>

        {/* Tabbed content with enhanced design */}
        <Tabs
          defaultValue="fitment"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 bg-muted/30 p-1">
            <TabsTrigger value="fitment" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Vehicles
              <span className="ml-1 text-xs">({compatibleVehicles.length})</span>
            </TabsTrigger>

            <TabsTrigger value="gallery" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Gallery
            </TabsTrigger>
            {isDevMode && (
              <TabsTrigger value="market" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Market
              </TabsTrigger>
            )}
            <TabsTrigger value="coolboard" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Cool Board
            </TabsTrigger>
            {isDevMode && (
              <TabsTrigger value="dev" className="text-xs sm:text-sm text-green-600 data-[state=active]:bg-background data-[state=active]:shadow-sm font-mono">
                [DEV]
              </TabsTrigger>
            )}
          </TabsList>

          {/* Fixed height content area to prevent layout shifts */}
          <div className="min-h-[50vh]">


            {/* Fitment content */}
            <TabsContent value="fitment" className="space-y-6 mt-0">
              <FitmentSection
                wheelName={wheel.wheel_name}
                compatibleVehicles={compatibleVehicles}
              />
            </TabsContent>

            {/* Comments content */}


            {/* Gallery content */}
            <TabsContent value="gallery" className="mt-0">
              <GallerySection
                vehicleName={wheel.wheel_name}
                images={galleryImages}
              />
            </TabsContent>

            {/* Market content */}
            {isDevMode && (
              <TabsContent value="market" className="mt-0">
                {marketListings === undefined ? (
                  <Card className="p-8 bg-muted/30">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/60" />
                      <p className="text-muted-foreground">Loading wheel listings...</p>
                    </div>
                  </Card>
                ) : marketListings.length === 0 ? (
                  <Card className="p-8 bg-muted/30 border-dashed">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                        <Package2 className="h-10 w-10 text-primary/50" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">No linked listings yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          No marketplace listings are currently tagged to {wheel.wheel_name}.
                        </p>
                      </div>
                      <Button asChild variant="outline" className="mt-4">
                        <Link to="/market">Browse Marketplace</Link>
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {marketListings.map((listing) => (
                      <Card key={listing._id} className="overflow-hidden border-border/50 hover:border-border transition-all hover:shadow-sm">
                        <div className="relative aspect-[4/3] bg-muted">
                          {listing.images && listing.images[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package2 className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                          )}
                          <Badge className="absolute top-2 left-2 text-xs capitalize">
                            {listing.listing_type}
                          </Badge>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-medium line-clamp-2">{listing.title}</h3>
                              {listing.condition ? (
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{listing.condition}</p>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-1 text-primary font-semibold whitespace-nowrap">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatPrice(listing.price)}</span>
                            </div>
                          </div>

                          {(listing.location || listing.shipping_available) && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {listing.location ? (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{listing.location}</span>
                                </div>
                              ) : null}
                              {listing.shipping_available ? (
                                <Badge variant="outline" className="text-xs h-5">Ships</Badge>
                              ) : null}
                            </div>
                          )}

                          {listing.seller_profile ? (
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={listing.seller_profile.avatar_url || undefined} />
                                <AvatarFallback className="text-xs">
                                  {listing.seller_profile.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground truncate">
                                {listing.seller_profile.display_name || listing.seller_profile.username}
                              </span>
                            </div>
                          ) : null}

                          <Button asChild variant="outline" className="w-full">
                            <Link to={`/market/${listing._id}`}>View Listing</Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Cool Board content */}
            <TabsContent value="coolboard" className="mt-0">
              <Card className="p-8 bg-muted/30 border-dashed">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Gauge className="h-10 w-10 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cool Board Ratings</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      See how the community rates these {wheel.wheel_name} wheels.
                      Vote and share your experience with other enthusiasts.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button variant="outline">View Ratings</Button>
                    <Button variant="default">Rate This Wheel</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Dev content */}
            <TabsContent value="dev" className="mt-0">
              <Card className="p-6 bg-slate-950 border-slate-800 text-slate-200 font-mono text-sm overflow-hidden">
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-400 mb-2 border-b border-slate-800 pb-1">GOOD PIC URL</h4>
                      <div className="bg-slate-900/50 p-2 rounded break-all min-h-[3rem] text-xs text-muted-foreground">{wheel.good_pic_url || "NULL"}</div>
                    </div>
                    <div>
                      <h4 className="text-red-400 mb-2 border-b border-slate-800 pb-1">BAD PIC URL / RAW REF</h4>
                      <div className="bg-slate-900/50 p-2 rounded break-all min-h-[3rem] text-xs text-muted-foreground">{wheel.bad_pic_url || "NULL"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-800 rounded p-2 bg-black/20">
                      <p className="text-xs text-center mb-2 text-slate-500">Rendered Good</p>
                      <img src={wheel.good_pic_url || "/placeholder.svg"} className="w-full object-contain h-48" alt="good" />
                    </div>
                    <div className="border border-slate-800 rounded p-2 bg-black/20">
                      <p className="text-xs text-center mb-2 text-slate-500">Rendered Bad (Attempt)</p>
                      <img src={wheel.bad_pic_url ? wheel.bad_pic_url.replace('![[', '').replace(']]', '') : "/placeholder.svg"} className="w-full object-contain h-48 opacity-70" alt="bad" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 mb-2 border-b border-slate-800 pb-1">FULL RECORD JSON</h4>
                    <pre className="bg-slate-900 p-4 rounded overflow-auto max-h-[500px] text-xs">
                      {JSON.stringify(wheel, null, 2)}
                    </pre>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WheelDetailPage;
