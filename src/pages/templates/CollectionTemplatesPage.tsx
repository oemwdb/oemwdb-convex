import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Circle, Package, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VehicleCollectionTemplate from "@/components/templates/VehicleCollectionTemplate";
import WheelCollectionTemplate from "@/components/templates/WheelCollectionTemplate";
import BrandCollectionTemplate from "@/components/templates/BrandCollectionTemplate";
import { toast } from "sonner";

interface CollectionConfig {
  gridCols: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
  };
  showFilters: boolean;
  showSearch: boolean;
  enableCardFlip: boolean;
  filterPosition: "top" | "sidebar";
  cardSize: "small" | "medium" | "large";
  gapSize: number;
  dataSource: "sample" | "live";
}

const CollectionTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [config, setConfig] = useState<CollectionConfig>({
    gridCols: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      "2xl": 6
    },
    showFilters: true,
    showSearch: true,
    enableCardFlip: true,
    filterPosition: "top",
    cardSize: "medium",
    gapSize: 4,
    dataSource: "sample"
  });

  const updateGridCol = (breakpoint: keyof typeof config.gridCols, value: string) => {
    setConfig(prev => ({
      ...prev,
      gridCols: {
        ...prev.gridCols,
        [breakpoint]: parseInt(value)
      }
    }));
  };

  const generateCode = () => {
    const gridClasses = `grid-cols-${config.gridCols.xs} xs:grid-cols-${config.gridCols.xs} sm:grid-cols-${config.gridCols.sm} md:grid-cols-${config.gridCols.md} lg:grid-cols-${config.gridCols.lg} xl:grid-cols-${config.gridCols.xl} 2xl:grid-cols-${config.gridCols["2xl"]}`;
    
    return `import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCollectionSearch } from "@/hooks/useCollectionSearch";
import { CollectionFilterDropdown } from "@/components/collection/CollectionFilterDropdown";

const ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Page: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  const {
    searchText,
    filters,
    updateSearchText,
    updateFilter,
    clearFilters,
    searchQuery,
    filterOptions,
    config: collectionConfig
  } = useCollectionSearch("${activeTab}");

  return (
    <DashboardLayout
      title="${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}"
      showSearch={${config.showSearch}}
      searchValue={searchText}
      onSearchChange={updateSearchText}
      showFilter={${config.showFilters}}
      onFilterClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
    >
      <div className="grid ${gridClasses} gap-${config.gapSize}">
        {/* Your collection items here */}
      </div>
      
      ${config.showFilters ? `<CollectionFilterDropdown
        isOpen={isFilterDropdownOpen}
        onClose={() => setIsFilterDropdownOpen(false)}
        config={collectionConfig}
        filters={filters}
        filterOptions={filterOptions}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
      />` : ''}
    </DashboardLayout>
  );
};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Collection Templates">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dev/templates")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Collection Page Templates</h1>
            <p className="text-muted-foreground">
              Configure and preview collection page layouts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Configuration</h2>
            
            {/* Grid Layout Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Grid Layout</h3>
              <div className="space-y-2">
                {Object.entries(config.gridCols).map(([breakpoint, value]) => (
                  <div key={breakpoint} className="flex items-center justify-between">
                    <Label className="text-xs">{breakpoint.toUpperCase()}</Label>
                    <Select
                      value={value.toString()}
                      onValueChange={(val) => updateGridCol(breakpoint as keyof typeof config.gridCols, val)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Display Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-filters">Show Filters</Label>
                  <Switch
                    id="show-filters"
                    checked={config.showFilters}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showFilters: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-search">Show Search</Label>
                  <Switch
                    id="show-search"
                    checked={config.showSearch}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showSearch: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="card-flip">Enable Card Flip</Label>
                  <Switch
                    id="card-flip"
                    checked={config.enableCardFlip}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableCardFlip: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Layout Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label>Filter Position</Label>
                  <Select
                    value={config.filterPosition}
                    onValueChange={(value: "top" | "sidebar") => setConfig(prev => ({ ...prev, filterPosition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Card Size</Label>
                  <Select
                    value={config.cardSize}
                    onValueChange={(value: "small" | "medium" | "large") => setConfig(prev => ({ ...prev, cardSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gap Size</Label>
                  <Select
                    value={config.gapSize.toString()}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, gapSize: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 8].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Source */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data Source</h3>
              <Select
                value={config.dataSource}
                onValueChange={(value: "sample" | "live") => setConfig(prev => ({ ...prev, dataSource: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sample">Sample Data</SelectItem>
                  <SelectItem value="live">Live Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Preview Area */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="vehicles">
                    <Car className="h-4 w-4 mr-2" />
                    Vehicles
                  </TabsTrigger>
                  <TabsTrigger value="wheels">
                    <Circle className="h-4 w-4 mr-2" />
                    Wheels
                  </TabsTrigger>
                  <TabsTrigger value="brands">
                    <Package className="h-4 w-4 mr-2" />
                    Brands
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="border rounded-lg p-4 min-h-[400px] bg-background/50">
              <Tabs value={activeTab}>
                <TabsContent value="vehicles">
                  <VehicleCollectionTemplate config={config} />
                </TabsContent>
                <TabsContent value="wheels">
                  <WheelCollectionTemplate config={config} />
                </TabsContent>
                <TabsContent value="brands">
                  <BrandCollectionTemplate 
                    brands={[
                      { id: 1, name: 'Mercedes-Benz', brand_description: 'German luxury automobile manufacturer', wheel_count: 45, vehicle_count: 12 },
                      { id: 2, name: 'BMW', brand_description: 'Bavarian Motor Works', wheel_count: 38, vehicle_count: 10 },
                      { id: 3, name: 'Audi', brand_description: 'German automotive manufacturer', wheel_count: 32, vehicle_count: 8 }
                    ]}
                    layout="grid"
                    showStats={true}
                    columnsPerRow={config.gridCols.md}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Code Generation */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated Code</h2>
            <Button onClick={copyToClipboard} size="sm">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
            <code className="text-sm">{generateCode()}</code>
          </pre>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CollectionTemplatesPage;