import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useUserListings } from "@/hooks/useUserListings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Package, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(username);
  const { data: listings = [], isLoading: listingsLoading } = useUserListings(profile?.id);

  const getInitials = (displayName: string | null, username: string) => {
    if (displayName) {
      const parts = displayName.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default">Verified</Badge>;
      case "trusted_vendor":
        return <Badge className="bg-green-600">Trusted Vendor</Badge>;
      default:
        return null;
    }
  };

  if (profileLoading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="User Not Found">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              The user you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={profile.display_name || profile.username}>
      <div className="p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile.display_name, profile.username)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold">
                      {profile.display_name || profile.username}
                    </h2>
                    {getVerificationBadge(profile.verification_status)}
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                {profile.bio && (
                  <p className="text-sm">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.member_since && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {format(new Date(profile.member_since), "MMMM yyyy")}
                    </div>
                  )}
                </div>

                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">{profile.listing_count}</span>
                    <span className="text-muted-foreground">Listings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="font-semibold">{profile.transaction_count}</span>
                    <span className="text-muted-foreground">Transactions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="market" className="w-full">
          <TabsList>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="mt-6">
            {listingsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active listings</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This user hasn't posted any items for sale yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      {listing.images && listing.images.length > 0 && (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
                          <Badge variant="secondary" className="shrink-0">
                            {listing.listing_type}
                          </Badge>
                        </div>
                        {listing.price && (
                          <p className="text-lg font-bold text-primary">
                            ${parseFloat(listing.price.toString()).toFixed(2)}
                          </p>
                        )}
                        {listing.condition && (
                          <p className="text-sm text-muted-foreground">
                            Condition: {listing.condition}
                          </p>
                        )}
                        {listing.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {listing.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Member Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{profile.listing_count}</p>
                      <p className="text-sm text-muted-foreground">Total Listings</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{profile.transaction_count}</p>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">
                        {profile.member_since
                          ? Math.floor(
                              (Date.now() - new Date(profile.member_since).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Days Active</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold capitalize">{profile.verification_status}</p>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-center mt-6">
                    More profile information coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">User reviews and ratings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PublicProfilePage;
