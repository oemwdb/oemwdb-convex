import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@clerk/react";

const AccountPage = () => {
  return (
    <DashboardLayout title="Account" disableContentPadding={true}>
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your profile, email addresses, sign-in methods, and security settings.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background">
            <div className="overflow-x-auto p-2 md:p-4">
              <UserProfile
                routing="path"
                path="/account"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "w-full max-w-none",
                    card: "w-full max-w-none border-0 shadow-none bg-transparent",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountPage;
