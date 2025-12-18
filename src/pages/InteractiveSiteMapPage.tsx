import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MermaidDiagram from "@/components/MermaidDiagram";
import {
  Home,
  Car,
  CircleDot,
  Package,
  Database,
  User,
  Settings,
  FileCode,
  Table,
  GitBranch
} from "lucide-react";

const InteractiveSiteMapPage = () => {
  const mermaidDiagram = `
    graph TD
      %% Main Hub
      Index["🏠 Home Page"]
      
      %% Main Navigation
      Index --> Brands["🏢 Brands"]
      Index --> Vehicles["🚗 Vehicles"]
      Index --> Wheels["⭕ Wheels"]
      Index --> Garage["📦 My Garage"]
      Index --> Contribute["➕ Contribute"]
      Index --> Dev["🛠️ Developer"]
      
      %% Authentication Flow
      Index --> Login["🔐 Login"]
      Login --> Profile["👤 Profile"]
      Profile --> Index
      
      %% Brands Flow
      Brands --> BrandDetail["Brand Detail/:id"]
      BrandDetail --> Vehicles
      BrandDetail --> Wheels
      
      %% Vehicles Flow
      Vehicles --> VehicleDetail["Vehicle Detail/:id"]
      VehicleDetail --> Wheels
      VehicleDetail --> BrandDetail
      
      %% Wheels Flow
      Wheels --> WheelDetail["Wheel Detail/:id"]
      Wheels --> WheelItem["Wheel Item/:id"]
      WheelDetail --> Vehicles
      WheelItem --> Vehicles
      
      %% Developer Section
      Dev --> DevDash["Dev Dashboard"]
      Dev --> DataTables["Data Tables"]
      Dev --> Database["Database Mgmt"]
      Dev --> Templates["Templates"]
      Dev --> SiteMap["Site Map - YOU ARE HERE"]
      
      %% Data Management
      
      %% Templates Section
      Templates --> CardSystem["Card System"]
      Templates --> Collections["Collection Templates"]
      Templates --> MasterItems["Master Item Templates"]
      Templates --> PageTemplates["Page Templates"]
      
      %% Contribute Section
      Contribute --> Brands
      Contribute --> Vehicles
      Contribute --> Wheels
      
      %% 404 Handling
      NotFound["404 Not Found"]
      Index -.Invalid URL.-> NotFound
      NotFound --> Index
      
      %% Styling
      classDef mainPage fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      classDef contentPage fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
      classDef detailPage fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      classDef devPage fill:#a855f7,stroke:#9333ea,stroke-width:2px,color:#fff
      classDef authPage fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
      classDef currentPage fill:#ec4899,stroke:#db2777,stroke-width:3px,color:#fff
      
      class Index,NotFound mainPage
      class Brands,Vehicles,Wheels,Garage,Contribute contentPage
      class BrandDetail,VehicleDetail,WheelDetail,WheelItem detailPage
      class Dev,DevDash,DataTables,Database,Templates,CardSystem,Collections,MasterItems,PageTemplates devPage
      class Login,Profile authPage
      class SiteMap currentPage
  `;

  return (
    <DashboardLayout title="Interactive Site Map" showFilterButton={false}>
      <div className="pl-0 pr-4 pt-0 pb-4 space-y-4">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <GitBranch className="h-6 w-6" />
                Site Navigation Map
              </h1>
              <p className="text-muted-foreground mt-1">
                Visual representation of all pages and navigation flows
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary" />
              <span className="text-muted-foreground">Main Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-1/20 border-2 border-chart-1" />
              <span className="text-muted-foreground">Content Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-2/20 border-2 border-chart-2" />
              <span className="text-muted-foreground">Detail Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-3/20 border-2 border-chart-3" />
              <span className="text-muted-foreground">Developer Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-4/20 border-2 border-chart-4" />
              <span className="text-muted-foreground">Auth Pages</span>
            </div>
          </div>
        </Card>

        {/* Site Map Diagram */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Site Map</CardTitle>
            <CardDescription>
              Interactive visualization of site navigation structure
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <MermaidDiagram
              diagram={mermaidDiagram}
              className="min-w-[800px]"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-1/10 rounded-lg">
                <GitBranch className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Navigation Paths</p>
                <p className="text-2xl font-bold text-foreground">38</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Database className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dynamic Routes</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Page Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Main Navigation
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Home (Index)</span>
                <Badge variant="outline" className="text-xs">Hub</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brands</span>
                <Badge variant="outline" className="text-xs">Collection</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicles</span>
                <Badge variant="outline" className="text-xs">Collection</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wheels</span>
                <Badge variant="outline" className="text-xs">Collection</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">My Garage</span>
                <Badge variant="outline" className="text-xs">User</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Developer Tools
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dev Dashboard</span>
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Tables</span>
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Management</span>
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Templates</span>
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site Map</span>
                <Badge variant="outline" className="text-xs">Current</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InteractiveSiteMapPage;