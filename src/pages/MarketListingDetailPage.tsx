import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  ArrowLeft,
  MapPin,
  Package,
  DollarSign,
  FileText,
  MessageCircle,
  Share2,
  Flag,
  CheckCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MarketListing {
  id: string;
  user_id: string;
  listing_type: string;
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  location: string | null;
  shipping_available: boolean;
  images: string[] | null;
  documents: string[] | null;
  status: string;
  created_at: string;
  seller_profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    verification_status: string;
  } | null;
}

export default function MarketListingDetailPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["market-listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error) throw error;
      return data as unknown as MarketListing;
    },
    enabled: !!listingId,
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getConditionBadge = (condition: string | null) => {
    if (!condition) return null;

    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      new: "default",
      "like-new": "default",
      good: "secondary",
      fair: "outline",
      parts: "destructive",
    };

    return (
      <Badge variant={variants[condition] || "outline"}>
        {condition}
      </Badge>
    );
  };

  const handleContactSeller = () => {
    if (listing?.seller_profile?.username) {
      navigate(`/users/${listing.seller_profile.username}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." disableContentPadding={true}>
        <div className="h-full p-2 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 space-y-4">
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout title="Not Found" disableContentPadding={true}>
        <div className="h-full p-2 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Listing not found</h2>
                <p className="text-muted-foreground mb-6">This listing may have been removed or doesn't exist.</p>
                <Button onClick={() => navigate("/market")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={listing.title} disableContentPadding={true}>
      <div className="h-full p-2 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={() => navigate("/market")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-6">
                  {listing.images && listing.images.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {listing.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`${listing.title} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {listing.images.length > 1 && (
                        <>
                          <CarouselPrevious />
                          <CarouselNext />
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{listing.description || "No description provided."}</p>
                </CardContent>
              </Card>

              {/* Documents */}
              {listing.documents && listing.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {listing.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-sm">Document {index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Pricing & Actions */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-3xl font-bold text-primary mb-2">
                      <DollarSign className="h-7 w-7" />
                      {formatPrice(listing.price)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="capitalize">{listing.listing_type}</Badge>
                      {getConditionBadge(listing.condition)}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    {listing.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    {listing.shipping_available && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Shipping available</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.seller_profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {listing.seller_profile?.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {listing.seller_profile?.display_name || listing.seller_profile?.username || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{listing.seller_profile?.username || "unknown"}
                      </div>
                    </div>
                    {listing.seller_profile?.verification_status === "verified" && (
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleContactSeller}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Listing Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Listing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing ID</span>
                    <span className="font-mono text-xs">{listing.id.slice(0, 8)}...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
