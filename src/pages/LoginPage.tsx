import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SignIn, SignUp } from "@clerk/react";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <DashboardLayout title="Sign In">
      <div className="p-3 max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex justify-center">
            <SignIn routing="hash" afterSignInUrl="/" />
          </TabsContent>

          <TabsContent value="register" className="flex justify-center">
            <SignUp routing="hash" afterSignUpUrl="/" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LoginPage;
