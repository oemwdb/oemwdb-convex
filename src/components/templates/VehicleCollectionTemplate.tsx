import React, { useState } from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface VehicleCollectionTemplateProps {
  config: {
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
  };
}

const sampleVehicles = [
  { name: "BMW M3 E92", brand: "BMW", wheels: 12, image: "/lovable-uploads/50f5b2f3-2c0d-41c6-b63c-3ea6530df342.png" },
  { name: "Toyota Supra A80", brand: "Toyota", wheels: 8, image: "/lovable-uploads/8d35ac01-bad8-4213-b327-771cb24ad936.png" },
  { name: "Nissan GT-R R35", brand: "Nissan", wheels: 15, image: "/lovable-uploads/a4a8da67-64be-44c1-802c-5464a736253e.png" },
  { name: "Honda NSX NA1", brand: "Honda", wheels: 6, image: "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png" },
  { name: "Mazda RX-7 FD", brand: "Mazda", wheels: 10, image: "/lovable-uploads/b73ff96c-01a1-4e9c-8c62-073cbc4450e7.png" },
];

const VehicleCollectionTemplate: React.FC<VehicleCollectionTemplateProps> = ({ config }) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [showOnlyWithWheels, setShowOnlyWithWheels] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredVehicles = sampleVehicles
    .filter(v => {
      if (showOnlyWithWheels && v.wheels === 0) return false;
      if (searchText && !v.name.toLowerCase().includes(searchText.toLowerCase()) && 
          !v.brand.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });

  const handleFlip = (name: string) => {
    if (config.enableCardFlip) {
      setFlippedCards(prev => ({ ...prev, [name]: !prev[name] }));
    }
  };

  const getGridClasses = () => {
    return `grid grid-cols-${config.gridCols.xs} xs:grid-cols-${config.gridCols.xs} sm:grid-cols-${config.gridCols.sm} md:grid-cols-${config.gridCols.md} lg:grid-cols-${config.gridCols.lg} xl:grid-cols-${config.gridCols.xl} 2xl:grid-cols-${config.gridCols["2xl"]} gap-${config.gapSize}`;
  };

  const getCardScale = () => {
    switch (config.cardSize) {
      case "small": return "scale-90";
      case "large": return "scale-110";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      {(config.showFilters || config.showSearch) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {config.showFilters && (
            <div className="flex items-center gap-2">
              <Switch
                id="show-with-wheels"
                checked={showOnlyWithWheels}
                onCheckedChange={setShowOnlyWithWheels}
              />
              <Label htmlFor="show-with-wheels">
                Show only vehicles with wheels
              </Label>
            </div>
          )}
          {config.showSearch && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search vehicles..."
                className="pl-10 w-full sm:w-[300px]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Vehicle Grid */}
      <div className={getGridClasses()}>
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.name} className={`transform transition-transform ${getCardScale()}`}>
            <VehicleCard
              vehicle={vehicle}
              isFlipped={flippedCards[vehicle.name] || false}
              onFlip={handleFlip}
            />
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No vehicles match your filters</p>
        </div>
      )}
    </div>
  );
};

export default VehicleCollectionTemplate;