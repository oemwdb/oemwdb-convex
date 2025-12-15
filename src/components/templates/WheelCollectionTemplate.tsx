import React, { useState } from "react";
import WheelCard from "@/components/vehicle/WheelCard";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface WheelCollectionTemplateProps {
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

const sampleWheels = [
  {
    id: "1",
    name: "Volk Racing TE37",
    diameter: "18",
    boltPattern: "5x114.3",
    specs: ["Width: 9.5", "Offset: +38", "Bronze"],
    imageUrl: "/lovable-uploads/50f5b2f3-2c0d-41c6-b63c-3ea6530df342.png",
  },
  {
    id: "2",
    name: "BBS LM",
    diameter: "19",
    boltPattern: "5x120",
    specs: ["Width: 10", "Offset: +25", "Silver"],
    imageUrl: "/lovable-uploads/8d35ac01-bad8-4213-b327-771cb24ad936.png",
  },
  {
    id: "3",
    name: "Work Meister S1R",
    diameter: "17",
    boltPattern: "5x100",
    specs: ["Width: 9", "Offset: +35", "White"],
    imageUrl: "/lovable-uploads/a4a8da67-64be-44c1-802c-5464a736253e.png",
  },
  {
    id: "4",
    name: "Enkei RPF1",
    diameter: "18",
    boltPattern: "5x114.3",
    specs: ["Width: 9.5", "Offset: +38", "Gold"],
    imageUrl: "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png",
  },
];

const WheelCollectionTemplate: React.FC<WheelCollectionTemplateProps> = ({ config }) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredWheels = sampleWheels
    .filter(w => {
      if (searchText && !w.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });

  const handleFlip = (id: string) => {
    if (config.enableCardFlip) {
      setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
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
                id="show-active"
                checked={showOnlyActive}
                onCheckedChange={setShowOnlyActive}
              />
              <Label htmlFor="show-active">
                Show only active wheels
              </Label>
            </div>
          )}
          {config.showSearch && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search wheels..."
                className="pl-10 w-full sm:w-[300px]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Wheel Grid */}
      <div className={getGridClasses()}>
        {filteredWheels.map(wheel => (
          <div key={wheel.id} className={`transform transition-transform ${getCardScale()}`}>
            <WheelCard
              wheel={wheel}
              isFlipped={flippedCards[wheel.id] || false}
              onFlip={handleFlip}
            />
          </div>
        ))}
      </div>

      {filteredWheels.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No wheels match your filters</p>
        </div>
      )}
    </div>
  );
};

export default WheelCollectionTemplate;