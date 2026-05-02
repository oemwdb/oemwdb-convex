import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const AccountPage = () => {
  const { actualUser, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const displayName = profile?.display_name || actualUser?.fullName || actualUser?.username || "OEMWDB user";
  const email = actualUser?.email || actualUser?.emailAddresses?.[0]?.emailAddress || "";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <DashboardLayout title="Account" disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage the account used by this local workshop.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border/60">
                  <AvatarImage src={actualUser?.imageUrl || ""} alt={displayName} />
                  <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">{displayName}</h2>
                    {isAdmin ? (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                        Admin
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">User ID</p>
                  <p className="mt-1 truncate font-mono text-xs">{actualUser?.id}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Sign-in Method</p>
                  <p className="mt-1 flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                    Email and password
                  </p>
                </div>
              </div>

              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountPage;
