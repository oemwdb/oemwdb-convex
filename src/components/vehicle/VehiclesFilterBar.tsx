
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface VehiclesFilterBarProps {
  showOnlyWithItems: boolean;
  setShowOnlyWithItems: (val: boolean) => void;
  filterText: string;
  setFilterText: (val: string) => void;
}

const VehiclesFilterBar: React.FC<VehiclesFilterBarProps> = ({
  showOnlyWithItems,
  setShowOnlyWithItems,
  filterText,
  setFilterText
}) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
    <div className="flex items-center gap-2">
      <Switch
        id="show-with-items"
        checked={showOnlyWithItems}
        onCheckedChange={setShowOnlyWithItems}
      />
      <Label htmlFor="show-with-items">
        Show only vehicles with items
      </Label>
    </div>
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <Input
        placeholder="Filter vehicles..."
        className="pl-10 w-full sm:w-[300px]"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  </div>
);
export default VehiclesFilterBar;
