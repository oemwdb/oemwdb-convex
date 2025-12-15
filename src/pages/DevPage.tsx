import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppIcon from "@/components/dev/AppIcon";
import { StatsCard } from "@/components/admin/StatsCard";
import { useSupabaseBrands } from "@/hooks/useSupabaseBrands";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { useSupabaseWheels } from "@/hooks/useSupabaseWheels";
import {
  Link2,
  FileCode,
  Database,
  Package,
  Car,
  Disc3,
  Activity,
  Server,
  ClipboardList,
  Users,
  ShoppingCart,
  Zap,
  FileEdit,
  Terminal,
  ScanLine
} from "lucide-react";

const DevPage = () => {
  const { data: brands = [] } = useSupabaseBrands();
  const { data: vehicles = [] } = useSupabaseVehicles();
  const { data: wheels = [] } = useSupabaseWheels();

  // Calculate stats
  const readyWheels = wheels.filter(w => w.status === "Ready for website").length;
  const needsImageWheels = wheels.filter(w => w.status === "Needs Good Pic").length;
  const totalBrands = brands.length;
  const totalVehicles = vehicles.length;

  return (
    <DashboardLayout title="Admin Dashboard" showFilterButton={false}>
      <div className="p-3 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your database and monitor activity</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Brands"
            value={totalBrands}
            description="Active automotive brands"
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Vehicles"
            value={totalVehicles}
            description="Vehicle models in database"
            icon={Car}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Ready Wheels"
            value={readyWheels}
            description="Wheels with images"
            icon={Disc3}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Needs Images"
            value={needsImageWheels}
            description="Wheels pending photos"
            icon={Activity}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Admin Tools Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Admin Tools</h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AppIcon
              to="/users"
              icon={Users}
              label="Users"
              description="Manage user accounts"
            />
            <AppIcon
              to="/market"
              icon={ShoppingCart}
              label="Market"
              description="Marketplace listings"
            />
            <AppIcon
              to="/dev"
              icon={Terminal}
              label="DEV"
              description="Developer tools"
            />
            <AppIcon
              to="/dev/database"
              icon={Database}
              label="Database"
              description="Database management & data"
            />
            <AppIcon
              to="https://supabase.com/dashboard/project/bclvqqnnyqgzoavgrkke"
              icon={Server}
              label="Supabase"
              description="Supabase platform dashboard"
              external
            />
            <AppIcon
              to="/dev/registered-vehicles"
              icon={ClipboardList}
              label="Registered Vehicles"
              description="User vehicle registry"
            />
          </div>
        </div>

        {/* Experimental Content Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Experimental Content</h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AppIcon
              to="/dev/vin-decoder"
              icon={ScanLine}
              label="VIN Decoder"
              description="Decode VINs & generate schema"
            />
            <AppIcon
              to="/cool-board"
              icon={Zap}
              label="Cool Board"
              description="Interactive content board"
            />
            <AppIcon
              to="/contribute"
              icon={FileEdit}
              label="Contribute"
              description="Submit wheel data"
            />
            <AppIcon
              to="/dev/templates"
              icon={FileCode}
              label="Components"
              description="Component & page templates"
            />
            <AppIcon
              to="/dev/site-map"
              icon={Link2}
              label="Site Map"
              description="Interactive navigation map"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DevPage;