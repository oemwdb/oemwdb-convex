import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  member_since: string;
  listing_count: number;
  transaction_count: number;
  verification_status: string;
}

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchValue],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchValue) {
        query = query.ilike("username", `%${searchValue}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserProfile[];
    },
  });

  const getInitials = (username: string, displayName: string | null) => {
    const name = displayName || username;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "trusted":
        return (
          <Badge className="gap-1 text-xs bg-primary/10 text-primary">
            <ShieldCheck className="h-3 w-3" />
            Trusted Seller
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderUserCard = (user: UserProfile) => (
    <Card
      key={user.id}
      className="group p-4 border-border/50 hover:border-border transition-all hover:shadow-sm cursor-pointer"
      onClick={() => navigate(`/users/${user.username}`)}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <Avatar className="h-16 w-16 ring-2 ring-background shadow-sm">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="text-sm bg-muted">
            {getInitials(user.username, user.display_name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h3 className="font-medium text-sm">
            {user.display_name || user.username}
          </h3>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>

        {getVerificationBadge(user.verification_status)}

        {user.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {user.bio}
          </p>
        )}

        <div className="flex flex-col gap-2 w-full pt-2 border-t border-border/50">
          {user.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Joined {new Date(user.member_since).toLocaleDateString()}
            </span>
          </div>

          {user.listing_count > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>{user.listing_count} active listings</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const allUsers = users || [];
  const vendors = allUsers.filter((u) => u.listing_count > 0);
  const regularUsers = allUsers.filter((u) => u.listing_count === 0);

  return (
    <DashboardLayout
      title="Community Members"
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search users..."
      showFilterButton={false}
      disableContentPadding={true}
    >
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">{allUsers.length}</div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">{vendors.length}</div>
            <div className="text-xs text-muted-foreground">Active Vendors</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">
              {allUsers.filter((u) => u.verification_status === "verified").length}
            </div>
            <div className="text-xs text-muted-foreground">Verified Users</div>
          </Card>
          <Card className="p-3 border-border/50">
            <div className="text-2xl font-semibold">
              {allUsers.reduce((sum, u) => sum + u.transaction_count, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Transactions</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="all">All Users ({regularUsers.length})</TabsTrigger>
            <TabsTrigger value="vendors">Vendors ({vendors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="p-4 border-border/50">
                    <Skeleton className="h-full w-full min-h-[200px]" />
                  </Card>
                ))
              ) : regularUsers.length > 0 ? (
                regularUsers.map(renderUserCard)
              ) : (
                <div className="col-span-full">
                  <Card className="p-12 text-center border-border/50">
                    <p className="text-sm text-muted-foreground">No users found</p>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="p-4 border-border/50">
                    <Skeleton className="h-full w-full min-h-[200px]" />
                  </Card>
                ))
              ) : vendors.length > 0 ? (
                vendors.map(renderUserCard)
              ) : (
                <div className="col-span-full">
                  <Card className="p-12 text-center border-border/50">
                    <p className="text-sm text-muted-foreground">No vendors found</p>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;