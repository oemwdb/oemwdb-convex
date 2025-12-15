import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleBriefSectionProps {
  chassisCode: string;
  platform: string;
  generation: string;
  bodyType: string;
  productionYears: string;
  productionLocations: string[];
  unitsProduced: string;
  status: string;
  targetMarket: string[];
  priceRange: string;
  competitors: string[];
  engines: any[];
  transmission: string[];
  driveType: string;
  fuelEconomy: any;
  performance: any;
  dimensions: any;
}

const VehicleBriefSection = ({
  chassisCode,
  platform,
  generation,
  bodyType,
  productionYears,
  productionLocations,
  unitsProduced,
  status,
  targetMarket,
  priceRange,
  competitors,
  engines,
  transmission,
  driveType,
  fuelEconomy,
  performance,
  dimensions
}: VehicleBriefSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Vehicle Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicle Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Chassis Code</dt>
              <dd className="text-sm">{chassisCode}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Platform</dt>
              <dd className="text-sm">{platform}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Generation</dt>
              <dd className="text-sm">{generation}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Body Type</dt>
              <dd className="text-sm">{bodyType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Production Years</dt>
              <dd className="text-sm">{productionYears}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-sm">
                <Badge variant={status === "In Production" ? "default" : "secondary"}>
                  {status}
                </Badge>
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Engine Options</dt>
              <dd className="text-sm space-y-1">
                {(engines || []).map((engine, idx) => (
                  <div key={idx}>{engine.displacement} {engine.type} - {engine.power}</div>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Transmission</dt>
              <dd className="text-sm">{(transmission || []).join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Drive Type</dt>
              <dd className="text-sm">{driveType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Fuel Economy</dt>
              <dd className="text-sm">
                City: {fuelEconomy?.city} | Highway: {fuelEconomy?.highway} | Combined: {fuelEconomy?.combined}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Length</span>
              <span className="text-sm">{dimensions?.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Width</span>
              <span className="text-sm">{dimensions?.width}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Height</span>
              <span className="text-sm">{dimensions?.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Wheelbase</span>
              <span className="text-sm">{dimensions?.wheelbase}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Weight</span>
              <span className="text-sm">{dimensions?.curbWeight}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">0-60 mph</span>
              <span className="text-sm">{performance?.acceleration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Top Speed</span>
              <span className="text-sm">{performance?.topSpeed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Power</span>
              <span className="text-sm">{performance?.power}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Torque</span>
              <span className="text-sm">{performance?.torque}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-1">Price Range</dt>
            <dd className="text-sm">{priceRange}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-1">Target Markets</dt>
            <dd className="flex flex-wrap gap-1">
              {(targetMarket || []).map((market) => (
                <Badge key={market} variant="outline" className="text-xs">{market}</Badge>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-1">Main Competitors</dt>
            <dd className="flex flex-wrap gap-1">
              {(competitors || []).map((competitor) => (
                <Badge key={competitor} variant="outline" className="text-xs">{competitor}</Badge>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-1">Units Produced</dt>
            <dd className="text-sm">{unitsProduced}</dd>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleBriefSection;