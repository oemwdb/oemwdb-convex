import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, CircleSlash2, Package, MessageSquare, Image, ShoppingCart, Award, Info, TrendingUp, Car, Megaphone } from "lucide-react";
import { useWheelWithVehicles } from "@/hooks/useWheelWithVehicles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigation } from "@/contexts/NavigationContext";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import CommentsSection from "@/components/vehicle/CommentsSection";
import GallerySection from "@/components/vehicle/GallerySection";

const WheelItemPage = () => {
  const { wheelId } = useParams<{ wheelId: string }>();
  const [activeTab, setActiveTab] = useState("fitment");
  const { updateCurrentLabel } = useNavigation();

  // Fetch wheel with related vehicles from Supabase
  const { data: wheel, isLoading, error } = useWheelWithVehicles(wheelId || "");

  // Update breadcrumb label when wheel data is loaded
  useEffect(() => {
    if (wheel?.wheel_name) {
      updateCurrentLabel(wheel.wheel_name);
    }
  }, [wheel?.wheel_name, updateCurrentLabel]);

  // If loading, show loading state
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

  // If wheel not found or error, show error message
  if (!wheel || error) {
    return (
      <DashboardLayout title="Wheel Not Found">
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
  const compatibleVehicles = (wheel.vehicles || []).map(v => ({
    name: v.vehicle_title || v.model_name || v.chassis_code,
    brand: v.brand_name || "Unknown",
    wheels: 0, // Will be updated with actual wheel count later
    image: v.hero_image_url
  }));

  // Sample comments
  const comments = [
    { id: 1, user: "WheelExpert", comment: `These ${wheel.wheel_name} wheels look amazing on my car!`, date: "3 days ago" },
    { id: 2, user: "Driver", comment: "What's the weight of these wheels?", date: "1 week ago" },
    { id: 3, user: "ModEnthusiast", comment: "Do these clear the M Sport brakes?", date: "2 weeks ago" }
  ];

  // Sample gallery images
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
    <DashboardLayout title={pageTitle} showFilterButton={false}>
      <div className="pl-0 pr-4 pt-0 pb-4 space-y-4">
        {/* Grid layout with wheel header and ad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Wheel Header - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <WheelHeader
              name={wheel.wheel_name}
              brand={wheel.brand_name || "Unknown Brand"}
              price="$249.99"
              description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel with exceptional performance and style.`}
              image={wheel.good_pic_url || wheel.bad_pic_url || "/placeholder.svg"}
              specs={wheelSpecs}
            />
          </div>

          {/* Ad Box - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <Card className="h-full min-h-[240px] bg-muted/30 border-dashed flex items-center justify-center">
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground">Ad Box Here</h3>
                <p className="text-sm text-muted-foreground/70">Advertisement Space</p>
              </div>
            </Card>
          </div>
        </div>
        {/* Tabbed content */}
        <Tabs
          defaultValue="fitment"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex w-full h-auto gap-2 bg-muted/50 p-2 rounded-lg overflow-x-auto">
            <TabsTrigger value="fitment" className="flex items-center justify-center gap-2 py-3 whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm">
              <Car className="h-4 w-4" />
              <span>Vehicles</span>
              <Badge variant="secondary" className="ml-1 text-xs">{compatibleVehicles.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center justify-center gap-2 py-3 whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm">
              <Image className="h-4 w-4" />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center justify-center gap-2 py-3 whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Comments</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center justify-center gap-2 py-3 whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm">
              <ShoppingCart className="h-4 w-4" />
              <span>Market</span>
            </TabsTrigger>
            <TabsTrigger value="coolboard" className="flex items-center justify-center gap-2 py-3 whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm">
              <Award className="h-4 w-4" />
              <span>Cool Board</span>
            </TabsTrigger>
          </TabsList>

          {/* Fitment content */}
          <TabsContent value="fitment" className="mt-6 animate-fade-in">
            <FitmentSection
              wheelName={wheel.wheel_name}
              compatibleVehicles={compatibleVehicles}
            />
          </TabsContent>

          {/* Gallery content */}
          <TabsContent value="gallery" className="mt-6 animate-fade-in">
            <GallerySection
              vehicleName={wheel.wheel_name}
              images={galleryImages}
            />
          </TabsContent>

          {/* Comments content */}
          <TabsContent value="comments" className="mt-6 animate-fade-in">
            <CommentsSection
              vehicleName={wheel.wheel_name}
              comments={comments}
            />
          </TabsContent>

          {/* Market content */}
          <TabsContent value="market" className="mt-6 animate-fade-in">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Marketplace Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {availableSizes.map((size, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{size.diameter} x {size.width}</p>
                            <p className="text-sm text-muted-foreground">Offset: {size.offset} | {size.finish}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{size.price}</p>
                            {size.inStock ? (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">In Stock</Badge>
                            ) : (
                              <Badge variant="secondary">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>More marketplace listings coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cool Board content */}
          <TabsContent value="coolboard" className="mt-6 animate-fade-in">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Cool Board Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-lg font-bold">🏆</span>
                        </div>
                        <div>
                          <p className="font-medium">Top Rated Wheel</p>
                          <p className="text-sm text-muted-foreground">Based on community votes</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        #1 Trending
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-primary">92%</p>
                        <p className="text-sm text-muted-foreground">Cool Rating</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-primary">1.2k</p>
                        <p className="text-sm text-muted-foreground">Votes</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-primary">Top 5</p>
                        <p className="text-sm text-muted-foreground">Category</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" variant="outline">
                        View Full Cool Board →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WheelItemPage;