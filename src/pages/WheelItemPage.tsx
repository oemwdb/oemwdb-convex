import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, CircleSlash2, Package, MessageSquare, Image, ImageOff, ShoppingCart, Award, Info, TrendingUp, Car, Megaphone, Layers } from "lucide-react";
import { useWheelWithVehicles } from "@/hooks/useWheelWithVehicles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigation } from "@/contexts/NavigationContext";

// Import our components
import WheelHeader from "@/components/wheel/WheelHeader";
import FitmentSection from "@/components/wheel/FitmentSection";
import { SaveButton } from "@/components/SaveButton";
import WheelVariantsTable from "@/components/wheel/WheelVariantsTable";
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
  const compatibleVehicles = (wheel.vehicles || []).map(v => {
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
    <DashboardLayout
      title={pageTitle}
      showFilterButton={false}
      secondaryTitle="Comments"
      secondarySidebar={
        <div className="p-2">
          <CommentsSection
            vehicleName={wheel.wheel_name}
            comments={comments}
          />
        </div>
      }
      secondaryActionIcon={<MessageSquare className="h-4 w-4" />}
      disableContentPadding={true}
    >
      <div className="h-full p-2 overflow-y-auto space-y-2">
        {/* Grid layout with wheel header and ad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Wheel Header - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <WheelHeader
                name={wheel.wheel_name}
                brand={wheel.brand_name || "Unknown Brand"}
              price="$249.99"
              description={wheel.notes || `High-quality ${wheel.metal_type || "alloy"} wheel with exceptional performance and style.`}
              goodPicUrl={wheel.good_pic_url}
              badPicUrl={wheel.bad_pic_url}
              specs={wheelSpecs}
              />
            </div>
            <SaveButton
              itemId={wheel.id}
              itemType="wheel"
              convexId={wheel._id}
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
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1">
            <TabsTrigger value="fitment" className="flex-1 min-w-fit">Vehicles ({compatibleVehicles.length})</TabsTrigger>
            <TabsTrigger value="variants" className="flex-1 min-w-fit">Variants</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 min-w-fit">Gallery</TabsTrigger>
            <TabsTrigger value="badpic" className="flex-1 min-w-fit">Bad Pic</TabsTrigger>

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
                      tireSize={wheel.tire_size_refs?.[0] || null}
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

          {/* Bad Pic content */}
          <TabsContent value="badpic" className="space-y-4">
            <Card>
              <CardContent className="pt-4">

                {wheel.bad_pic_url ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={wheel.bad_pic_url}
                        alt={`${wheel.wheel_name} reference`}
                        className="w-full max-h-[600px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is the unprocessed reference image from Notion. Path: <code className="text-xs bg-muted px-1 py-0.5 rounded">{wheel.bad_pic_url}</code>
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageOff className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>No reference image available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>

      </div>
    </DashboardLayout>
  );
};

export default WheelItemPage;