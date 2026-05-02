import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CLERK_AUTH_REDIRECT_URL = "/";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <DashboardLayout title="Sign In">
      <div className="mx-auto max-w-md p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex justify-center">
            <SignIn
              routing="hash"
              fallbackRedirectUrl={CLERK_AUTH_REDIRECT_URL}
              forceRedirectUrl={CLERK_AUTH_REDIRECT_URL}
            />
          </TabsContent>

          <TabsContent value="register" className="flex justify-center">
            <SignUp
              routing="hash"
              fallbackRedirectUrl={CLERK_AUTH_REDIRECT_URL}
              forceRedirectUrl={CLERK_AUTH_REDIRECT_URL}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LoginPage;
