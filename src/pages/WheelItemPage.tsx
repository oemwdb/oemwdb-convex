import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useWheelByName } from "@/hooks/useWheels";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, CircleSlash2, MessageSquare, Image, ImageOff, ShoppingCart, Award, Info, TrendingUp, Car, Megaphone, Layers, Package2, DollarSign, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigation } from "@/contexts/NavigationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import WheelVariantsTable from "@/components/wheel/WheelVariantsTable";
import WheelAssetsPanel from "@/components/wheel/WheelAssetsPanel";
import GallerySection from "@/components/vehicle/GallerySection";
import ItemCommentsPanel from "@/components/comments/ItemCommentsPanel";


const WheelItemPage = () => {
  const { wheelId } = useParams<{ wheelId: string }>();
  const [activeTab, setActiveTab] = useState("fitment");
  const { updateCurrentLabel } = useNavigation();
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const showAdminAssets = isAdmin && isDevMode;

  // Fetch wheel with related vehicles from Convex
  const { data: wheel, isLoading, error } = useWheelByName(wheelId || "");
  const marketListings = useQuery(
    api.queries.marketListingsGetByWheel,
    isDevMode && wheel?._id ? { wheelId: wheel._id } : "skip"
  );

  // Update breadcrumb label when wheel data is loaded
  useEffect(() => {
    if (wheel?.wheel_name) {
      updateCurrentLabel(wheel.wheel_name);
    }
  }, [wheel?.wheel_name, updateCurrentLabel]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." disableContentPadding={true}>
        <Card className="p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading wheel details...</p>
        </Card>
      </DashboardLayout>
    );
  }

  // If wheel not found or error, show error message
  if (!wheel || error) {
    return (
      <DashboardLayout title="Wheel Not Found" disableContentPadding={true}>
        <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
          <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Wheel not found</h2>
          <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the wheel you're looking for.</p>
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

  // Use wheel name for the dashboard title
  const pageTitle = wheel.wheel_name || `Wheel #${wheelId}`;

  // Format compatible vehicles from vehicle_refs
  const fitmentVehicles = wheel.vehicles ?? [];

  const compatibleVehicles = fitmentVehicles.map(v => {
    // Build name in "FXX: ModelName" format
    const chassisCode = v.chassis_code || '';
    const modelName = v.model_name || v.vehicle_title || '';
    let displayName = '';

    if (chassisCode && modelName) {
      displayName = `${chassisCode}: ${modelName}`;
    } else if (chassisCode) {
      displayName = chassisCode;
    } else {
      displayName = modelName || 'Unknown';
    }

    return {
      id: v.id,
      name: displayName,
      brand: v.brand_name || "Unknown",
      wheels: 0,
      image: v.hero_image_url,
      bolt_pattern_ref: v.bolt_pattern_ref,
      center_bore_ref: v.center_bore_ref,
      wheel_diameter_ref: v.wheel_diameter_ref,
      wheel_width_ref: v.wheel_width_ref,
    };
  });

  // Sample gallery images
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
      title={pageTitle}
      showFilterButton={false}
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
      <div className="h-full p-2 overflow-y-auto space-y-2">
        <div className="flex gap-2 items-start">
          <div className="flex-1 min-w-0">
            <WheelHeader
              name={wheel.wheel_name}
              brand={wheel.brand_name || "Unknown Brand"}
              price="$249.99"
              description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel with exceptional performance and style.`}
              goodPicUrl={wheel.good_pic_url}
              badPicUrl={wheel.bad_pic_url}
              specs={wheelSpecs}
              itemId={wheel.id}
              convexId={wheel._id}
            />
          </div>
        </div>
        {/* Tabbed content */}
        <Tabs
          defaultValue="fitment"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1">
            <TabsTrigger value="fitment" className="flex-1 min-w-fit">Vehicles ({compatibleVehicles.length})</TabsTrigger>
            <TabsTrigger value="variants" className="flex-1 min-w-fit">Variants</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 min-w-fit">Gallery</TabsTrigger>
            {isDevMode && (
              <TabsTrigger value="market" className="flex-1 min-w-fit">Market</TabsTrigger>
            )}
            {showAdminAssets && (
              <TabsTrigger value="assets" className="flex-1 min-w-fit">Assets</TabsTrigger>
            )}
          </TabsList>


          {/* Fitment content */}
          <TabsContent value="fitment" className="space-y-4">
            <FitmentSection
              wheelName={wheel.wheel_name}
              compatibleVehicles={compatibleVehicles}
            />
          </TabsContent>

          {/* Variants content */}
          <TabsContent value="variants" className="space-y-4">
            <div className="grid gap-6">
              <Card>
                <CardContent className="pt-4">
                  {/* Variant cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                    {(() => {
                      const variants: any[] = [];
                      const colors = wheel.color ? wheel.color.split(',').map((c: string) => c.trim()) : ['Standard'];
                      const diameters = (wheel.diameter_refs || []) as any[];
                      const widths = (wheel.width_ref || []) as any[];
                      const boltPatterns = (wheel.bolt_pattern_refs || []) as any[];
                      const partNumbersText = wheel.part_numbers || '';

                      const partNumbers = partNumbersText
                        .split(/[,;]/)
                        .map((p: string) => p.trim())
                        .filter((p: string) => p && p.length > 0);

                      colors.slice(0, 4).forEach((color: string, idx: number) => {
                        const diameter = diameters[0]?.raw || diameters[0]?.value || '21"';
                        const width = widths[idx] || widths[0];
                        const widthStr = width?.raw || (width?.value ? `${width.value}J` : '8.5J');
                        const boltPattern = boltPatterns[0]?.value || '5x120';
                        const partNumber = partNumbers[idx] || partNumbers[0] || wheel.wheel_name?.replace(/\s+/g, '');

                        variants.push({
                          color,
                          size: `${widthStr} x ${diameter}`,
                          pcd: boltPattern,
                          partNumber: partNumber.substring(0, 30),
                          offset: wheel.wheel_offset || 'ET35',
                          available: true
                        });
                      });

                      return variants.length > 0 ? variants : [{
                        color: 'Standard',
                        size: `${wheel.diameter || 'N/A'} x ${wheel.width || 'N/A'}`,
                        pcd: wheel.bolt_pattern || 'N/A',
                        partNumber: wheel.wheel_name?.replace(/\s+/g, '') || 'N/A',
                        offset: wheel.wheel_offset || 'N/A',
                        available: true
                      }];
                    })().map((variant: any, idx: number) => (
                      <Card key={idx} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col gap-2">
                          <h4 className="font-semibold text-foreground text-base">
                            {variant.color}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Size:</span> {variant.size}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">PCD:</span> {variant.pcd}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">Offset:</span> {variant.offset}
                            </p>
                            <p className="text-foreground">
                              <span className="text-muted-foreground">P/N:</span>{' '}
                              <span className="text-blue-500 font-mono text-xs">{variant.partNumber}</span>
                            </p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Search</p>
                            <div className="flex gap-2">
                              <a
                                href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(wheel.wheel_name + ' ' + variant.color)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                eBay
                              </a>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(variant.partNumber + ' Rolls-Royce wheel')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Google
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Wheel Variants Table */}
                  <div className="mt-6">

                    <WheelVariantsTable
                      wheelName={wheel.wheel_name}
                      diameter={wheel.diameter}
                      width={wheel.width}
                      offset={wheel.wheel_offset}
                      boltPattern={wheel.bolt_pattern}
                      centerBore={wheel.center_bore}
                      weight={wheel.weight}
                      tireSize={wheel.tire_size || wheel.tire_size_refs?.[0] || null}
                      partNumbers={wheel.part_numbers}
                      vehicles={wheel.vehicles}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>



          {/* Gallery content */}
          <TabsContent value="gallery" className="space-y-4">
            <GallerySection
              vehicleName={wheel.wheel_name}
              images={galleryImages}
            />
          </TabsContent>

          {isDevMode && (
            <TabsContent value="market" className="space-y-4">
              {marketListings === undefined ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/60" />
                      <p className="text-muted-foreground">Loading wheel listings...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : marketListings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
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
                      <Button asChild variant="outline">
                        <Link to="/market">Browse Marketplace</Link>
                      </Button>
                    </div>
                  </CardContent>
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
                      <CardContent className="pt-4 space-y-3">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {showAdminAssets && (
            <TabsContent value="assets" className="space-y-4">
              <WheelAssetsPanel
                wheelId={wheel._id}
                wheelName={wheel.wheel_name}
                goodPicUrl={wheel.good_pic_url}
                badPicUrl={wheel.bad_pic_url}
              />
            </TabsContent>
          )}


        </Tabs>

      </div>
    </DashboardLayout>
  );
};

export default WheelItemPage;
