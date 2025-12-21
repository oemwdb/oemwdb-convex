import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VehicleBriefSectionProps {
  chassisCode: string;
  generation: string;
  productionYears: string;
  bodyType: string;
  platform: string;
  dimensions: any;
  performance: any;
  fuelEconomy: any;
  competitors: string[];
  priceRange: string;
  engineDetails: string;
  productionStats: string;
}

const VehicleBriefSection = ({
  chassisCode,
  generation,
  productionYears,
  bodyType,
  platform,
  dimensions,
  performance,
  fuelEconomy,
  competitors,
  priceRange,
  engineDetails,
  productionStats
}: VehicleBriefSectionProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-lg">Vehicle Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Identity & Body */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              Identity & Body
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Chassis</span>
                <span className="font-medium">{chassisCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Years</span>
                <span>{productionYears}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Body</span>
                <span>{bodyType || "-"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Platform</span>
                <span>{platform || "-"}</span>
              </div>
              {dimensions && (
                <>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Length</span>
                    <span>{dimensions.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Weight</span>
                    <span>{dimensions.weight}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Performance & Engine */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              Performance
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Engine</span>
                <span className="font-medium">{engineDetails || "-"}</span>
              </div>
              {performance && (
                <>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Power</span>
                    <span>{performance.power}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">0-60 mph</span>
                    <span>{performance.acceleration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Top Speed</span>
                    <span>{performance.topSpeed}</span>
                  </div>
                </>
              )}
              {fuelEconomy && (
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Combined MPG</span>
                  <span>{fuelEconomy.combined}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Production</span>
                <span>{productionStats || "-"}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Market */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              Market
            </h4>
            <div className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Price Range</dt>
                <dd className="font-medium">{priceRange || "N/A"}</dd>
              </div>
              {competitors && competitors.length > 0 && (
                <div>
                  <dt className="text-muted-foreground mb-2">Key Competitors</dt>
                  <dd className="flex flex-wrap gap-2">
                    {competitors.map((comp) => (
                      <Badge key={comp} variant="outline" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleBriefSection;