import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppIcon from "@/components/dev/AppIcon";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ScanLine,
  ChevronDown,
  Search,
  Bot,
  Megaphone,
  Network,
} from "lucide-react";

const DevPage = () => {
  const { data: brandsData } = { data: null as any, isLoading: false, error: null };
  const { data: vehiclesData } = { data: null as any, isLoading: false, error: null };
  const { data: wheelsData } = { data: null as any, isLoading: false, error: null };

  const brands = brandsData ?? [];
  const vehicles = vehiclesData ?? [];
  const wheels = wheelsData ?? [];

  // Calculate stats
  const readyWheels = wheels.filter((w: { status?: string }) => w.status === "Ready for website").length;
  const needsImageWheels = wheels.filter((w: { status?: string }) => w.status === "Needs Good Pic").length;
  const totalBrands = brands.length;
  const totalVehicles = vehicles.length;

  return (
    <DashboardLayout title="Admin Dashboard" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your database and monitor activity</p>
          </div>
        </div>

        {/* Stats Overview */}
        <Collapsible defaultOpen className="rounded-lg border border-border/50 bg-card/30">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 [&[data-state=open]_svg]:rotate-180">
            <span>Stats Overview</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:ring-2 hover:ring-primary/40">
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 pt-0">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Admin Tools Section */}
        <Collapsible defaultOpen className="rounded-lg border border-border/50 bg-card/30">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-semibold text-foreground hover:bg-white/5 transition-colors [&[data-state=open]>svg]:rotate-180">
            <span>Admin Tools</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 pt-0">
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
              to="/dev/advertising"
              icon={Megaphone}
              label="Advertising"
              description="Affiliate and sponsor control"
            />
            <AppIcon
              to="/dev/schema"
              icon={Network}
              label="Schema"
              description="Visualize schema tables and relations"
            />
            <AppIcon
              to="/dev/storage"
              icon={Database}
              label="Storage"
              description="Manage bucket storage"
            />
            <AppIcon
              to="/dev/database"
              icon={Database}
              label="Database"
              description="Database management & data"
            />
            <AppIcon
              to="/dev/billy-dash"
              icon={Bot}
              label="Billy Dash"
              description="Workshop Billy completion and coverage heartbeat"
            />
            <AppIcon
              to="https://dashboard.convex.dev"
              icon={Server}
              label="Convex"
              description="Convex dashboard"
              external
            />
            <AppIcon
              to="/dev/registered-vehicles"
              icon={ClipboardList}
              label="Registered Vehicles"
              description="User vehicle registry"
            />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Data Management Section */}
        <Collapsible defaultOpen className="rounded-lg border border-border/50 bg-card/30">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 [&[data-state=open]_svg]:rotate-180">
            <span>Data Management</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:ring-2 hover:ring-primary/40">
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 pt-0">
            <AppIcon
              to="/dev/garage"
              icon={Package}
              label="Garage"
              description="Vehicle & wheel combinations"
            />
            <AppIcon
              to="/dev/relation-maker"
              icon={Link2}
              label="Relation Maker"
              description="Build data relationships"
            />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Experimental Content Section */}
        <Collapsible defaultOpen className="rounded-lg border border-border/50 bg-card/30">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 [&[data-state=open]_svg]:rotate-180">
            <span>Experimental Content</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:ring-2 hover:ring-primary/40">
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 pt-0">
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
            <AppIcon
              to="/dev/wheel-recogniser"
              icon={Search}
              label="Wheel Recogniser"
              description="Upload, align, and metadata-match wheel photos"
            />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
};

export default DevPage;
