import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WheelsFilterBarProps {
  showOnlyComplete: boolean;
  setShowOnlyComplete: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const WheelsFilterBar = ({
  showOnlyComplete,
  setShowOnlyComplete,
  searchTerm,
  setSearchTerm,
}: WheelsFilterBarProps) => {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Switch 
              id="show-complete" 
              checked={showOnlyComplete}
              onCheckedChange={setShowOnlyComplete}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="show-complete" className="text-sm font-medium cursor-pointer">
              Complete entries only
            </Label>
          </div>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search wheels..." 
            className="pl-10 w-full sm:w-[320px] bg-background/50 border-border/50 focus:bg-background transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default WheelsFilterBar;