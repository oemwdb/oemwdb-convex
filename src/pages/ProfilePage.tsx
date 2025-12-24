import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedWheels } from "@/hooks/useSavedWheels";
import { useSavedVehicles } from "@/hooks/useSavedVehicles";
import { useSavedBrands } from "@/hooks/useSavedBrands";
import { useUserComments } from "@/hooks/useUserComments";
import { useUserListings } from "@/hooks/useUserListings";
import WheelCard from "@/components/vehicle/WheelCard";
import VehicleCard from "@/components/vehicle/VehicleCard";
import BrandCard from "@/components/brand/BrandCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Loader2, Plus, Package, Trash2, DollarSign, MapPin, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch saved items
  const { data: savedWheels, isLoading: wheelsLoading } = useSavedWheels();
  const { data: savedVehicles, isLoading: vehiclesLoading } = useSavedVehicles();
  const { data: savedBrands, isLoading: brandsLoading } = useSavedBrands();
  const { data: userComments, isLoading: commentsLoading } = useUserComments();

  // Fetch user's market listings
  const { data: userListings, isLoading: listingsLoading, refetch: refetchListings } = useUserListings(user?.id);

  // Card flip state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleFlipCard = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Update username
      if (username !== profile?.username) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      // Update email
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      // Update password
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError) throw passwordError;
        setCurrentPassword("");
        setNewPassword("");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getUserInitials = () => {
    const name = profile?.display_name || profile?.username || user?.email || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="p-4">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="market">My Listings</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="comments">My Comments</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-semibold">
                        {profile?.display_name || profile?.username || "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Member since {format(new Date(profile?.member_since || profile?.created_at || new Date()), "MMM yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userComments?.length || 0} comments
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card className="mt-6 border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <DeleteAccountDialog userEmail={user?.email} />
                </div>
              </CardContent>
            </Card>

            {/* Legal Links */}
            <div className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:underline">Terms of Service</a>
            </div>
          </TabsContent>

          {/* Market Listings Tab */}
          <TabsContent value="market" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">My Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your marketplace listings
                </p>
              </div>
              <Button onClick={() => navigate("/market/new")} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create Listing
              </Button>
            </div>

            {listingsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : userListings && userListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userListings.map((listing: any) => (
                  <Card
                    key={listing.id}
                    className="group overflow-hidden border-border/50 hover:border-border transition-all hover:shadow-sm"
                  >
                    {/* Image */}
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

                      {/* Type Badge */}
                      <Badge className="absolute top-2 left-2 text-xs capitalize">
                        {listing.listing_type}
                      </Badge>

                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm("Delete this listing?")) {
                            const { error } = await supabase
                              .from("market_listings")
                              .delete()
                              .eq("id", listing.id);

                            if (error) {
                              toast({
                                title: "Error",
                                description: "Failed to delete listing",
                                variant: "destructive"
                              });
                            } else {
                              toast({
                                title: "Deleted",
                                description: "Listing removed"
                              });
                              refetchListings();
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm line-clamp-1 flex-1">
                          {listing.title}
                        </h3>
                        {listing.condition && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {listing.condition}
                          </Badge>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span className="text-sm">
                          {listing.price
                            ? `$${listing.price.toLocaleString()}`
                            : "Contact for price"}
                        </span>
                      </div>

                      {/* Location */}
                      {listing.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.location}</span>
                        </div>
                      )}

                      {/* Status */}
                      <div className="pt-2 border-t border-border/50">
                        <Badge
                          variant={listing.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't created any listings yet
                </p>
                <Button onClick={() => navigate("/market/new")} size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create Your First Listing
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Saved Items Tab */}
          <TabsContent value="saved">
            <Tabs defaultValue="wheels" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wheels">Wheels</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>

              <TabsContent value="wheels" className="mt-6">
                {wheelsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : savedWheels?.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No saved wheels yet.</p>
                      <Button
                        variant="link"
                        onClick={() => navigate("/wheels")}
                        className="mt-2"
                      >
                        Browse wheels
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedWheels?.map((wheel: any) => (
                      <WheelCard
                        key={wheel.id}
                        wheel={wheel}
                        isFlipped={!!flippedCards[wheel.id]}
                        onFlip={handleFlipCard}
                        linkToDetail={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vehicles" className="mt-6">
                {vehiclesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : savedVehicles?.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No saved vehicles yet.</p>
                      <Button
                        variant="link"
                        onClick={() => navigate("/vehicles")}
                        className="mt-2"
                      >
                        Browse vehicles
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedVehicles?.map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isFlipped={!!flippedCards[vehicle.id]}
                        onFlip={handleFlipCard}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="brands" className="mt-6">
                {brandsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : savedBrands?.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No saved brands yet.</p>
                      <Button
                        variant="link"
                        onClick={() => navigate("/brands")}
                        className="mt-2"
                      >
                        Browse brands
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedBrands?.map((brand: any) => (
                      <BrandCard
                        key={brand.id}
                        brand={brand}
                        isFlipped={!!flippedCards[brand.id]}
                        onFlip={handleFlipCard}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* My Comments Tab */}
          <TabsContent value="comments">
            {commentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : userComments?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No comments yet.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/vehicles")}
                    className="mt-2"
                  >
                    Browse vehicles to comment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userComments?.map((comment: any) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {comment.oem_vehicles?.hero_image_url && (
                          <img
                            src={comment.oem_vehicles.hero_image_url}
                            alt={comment.oem_vehicles.model_name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {comment.oem_vehicles?.model_name || "Unknown Vehicle"}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.comment_text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
