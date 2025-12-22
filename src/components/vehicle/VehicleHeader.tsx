
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface VehicleHeaderProps {
  name: string;
  generation: string;
  years: string;
  engines: string[];
  drive: string;
  segment: string;
  description: string;
  msrp?: string;
  image?: string;
  // Chassis spec refs
  specs?: {
    bolt_pattern_ref?: string[];
    center_bore_ref?: string[];
    wheel_diameter_ref?: string[];
    wheel_width_ref?: string[];
  };
}

const VehicleHeader = ({
  name,
  generation,
  years,
  engines,
  drive,
  segment,
  description,
  msrp,
  image,
  specs
}: VehicleHeaderProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4 items-start">
          {/* Vehicle image - larger and prominent */}
          <div className="flex-shrink-0 w-48 md:w-56">
            <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-lg bg-muted group">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-center text-xs px-2">{name}</span>
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-3">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{generation} • {years}</p>
            </div>

            {/* Compact Specs Grid - similar to WheelHeader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {/* Bolt Pattern */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Bolt Pattern:</span>
                <div className="flex flex-wrap gap-1">
                  {specs?.bolt_pattern_ref && specs.bolt_pattern_ref.length > 0 ? (
                    specs.bolt_pattern_ref.map((pattern, idx) => (
                      <Link key={idx} to={`/vehicles?boltPattern=${encodeURIComponent(pattern)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {pattern}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Center Bore */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Center Bore:</span>
                <div className="flex flex-wrap gap-1">
                  {specs?.center_bore_ref && specs.center_bore_ref.length > 0 ? (
                    specs.center_bore_ref.map((bore, idx) => (
                      <Link key={idx} to={`/vehicles?centerBore=${encodeURIComponent(bore)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {bore}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Wheel Diameter */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Wheel Sizes:</span>
                <div className="flex flex-wrap gap-1">
                  {specs?.wheel_diameter_ref && specs.wheel_diameter_ref.length > 0 ? (
                    specs.wheel_diameter_ref.map((diameter, idx) => (
                      <Link key={idx} to={`/wheels?diameter=${encodeURIComponent(diameter)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {diameter}"
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Wheel Width */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Widths:</span>
                <div className="flex flex-wrap gap-1">
                  {specs?.wheel_width_ref && specs.wheel_width_ref.length > 0 ? (
                    specs.wheel_width_ref.map((width, idx) => (
                      <Link key={idx} to={`/wheels?width=${encodeURIComponent(width)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {width}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Segment & Drive */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Segment:</span>
                <Badge variant="outline" className="text-xs py-0 h-5">{segment}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Drive:</span>
                <Badge variant="outline" className="text-xs py-0 h-5">{drive}</Badge>
              </div>

              {/* Engine */}
              {engines.length > 0 && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="font-medium text-muted-foreground min-w-[90px]">Engine:</span>
                  <div className="flex flex-wrap gap-1">
                    {engines.slice(0, 3).map((engine, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                        {engine}
                      </Badge>
                    ))}
                    {engines.length > 3 && (
                      <Badge variant="outline" className="text-xs py-0 h-5 opacity-50">
                        +{engines.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleHeader;
