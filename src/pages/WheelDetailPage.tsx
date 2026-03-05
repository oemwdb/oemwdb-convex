import React, { useState } from "react";
import { useDevMode } from "@/hooks/useDevMode";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CircleSlash2, ChevronLeft, Package2, Gauge, Palette } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import { SaveButton } from "@/components/SaveButton";
import CommentsSection from "@/components/vehicle/CommentsSection";
import GallerySection from "@/components/vehicle/GallerySection";

const WheelDetailPage = () => {
  const { isDevMode } = useDevMode();
  const { wheelName } = useParams<{ wheelName: string }>();
  const [activeTab, setActiveTab] = useState("fitment");

  // Fetch wheel with related vehicles from Supabase
  const { data: wheel, isLoading, error } = useWheelByName(wheelName || "");

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
  const compatibleVehicles = (wheel.vehicles || []).map(v => ({
    name: v.model_name || v.chassis_code,
    year: v.production_years || "",
    brand: v.brand_name || "",
    fitmentNote: v.fitment_notes || (v.is_oem_fitment ? "OEM Fitment" : "Aftermarket")
  }));

  // Sample comments
  const comments = [
    { id: 1, user: "WheelExpert", comment: `These ${wheel.wheel_name} wheels look amazing on my car!`, date: "3 days ago" },
    { id: 2, user: "Driver", comment: "What's the weight of these wheels?", date: "1 week ago" },
    { id: 3, user: "ModEnthusiast", comment: "Do these clear the M Sport brakes?", date: "2 weeks ago" }
  ];

  // Gallery images
  const galleryImages = wheel.good_pic_url ? [{
    id: 1,
    url: wheel.good_pic_url,
    alt: `${wheel.wheel_name} wheel`,
    user: "Official",
    date: "Official Photo"
  }] : [];

  const wheelSpecs = {
    diameter_refs: wheel.diameter_refs || [],
    width_ref: wheel.width_ref || [],
    offset: wheel.wheel_offset || "",
    bolt_pattern_refs: wheel.bolt_pattern_refs || [],
    center_bore_ref: wheel.center_bore_ref || [],
    color_refs: wheel.color_refs || [],
    tire_size_refs: wheel.tire_size_refs || []
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

  return (
    <DashboardLayout
      title={`${wheel.wheel_name} Details`}
      secondaryTitle="Comments"
      secondarySidebar={
        <div className="p-2">
          <CommentsSection
            vehicleName={wheel.wheel_name}
            comments={comments}
          />
        </div>
      }
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
                <SaveButton
                  itemId={wheel.id}
                  itemType="wheel"
                  convexId={wheel._id}
                />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Wheel Header - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <WheelHeader
              name={wheel.wheel_name}
              brand={wheel.brand_name || "Unknown"}
              price="$249.99"
              description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel`}
              goodPicUrl={wheel.good_pic_url}
              badPicUrl={wheel.bad_pic_url}
              specs={wheelSpecs}
            />
          </div>

          {/* Ad Space Block */}
          <div className="lg:col-span-1">
            <Card className="h-full min-h-[400px] bg-muted/30 border-dashed flex items-center justify-center">
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <Package2 className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground">Advertisement Space</h3>
                <p className="text-sm text-muted-foreground/70">300x400 Ad Block</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Optional Horizontal Ad Banner */}
        <Card className="p-4 bg-muted/20 border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Horizontal Ad Banner Space - 728x90</p>
          </div>
        </Card>

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
            <TabsTrigger value="market" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Market
            </TabsTrigger>
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
            <TabsContent value="market" className="mt-0">
              <Card className="p-8 bg-muted/30 border-dashed">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Package2 className="h-10 w-10 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Market Listings</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Browse current market listings for {wheel.wheel_name} wheels.
                      Find deals from verified sellers and compare prices.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    View All Listings
                  </Button>
                </div>
              </Card>
            </TabsContent>

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