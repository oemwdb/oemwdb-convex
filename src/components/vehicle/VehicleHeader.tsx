
import React from "react";
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
}

const VehicleHeader = ({ 
  name, 
  generation, 
  years, 
  engines, 
  drive, 
  segment, 
  description,
  msrp 
}: VehicleHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
              <img 
                src={`https://source.unsplash.com/featured/?${name.replace(/[()-]/g, '')},car`} 
                alt={`${name} ${generation}`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          <div className="w-full md:w-2/3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-muted-foreground">{generation} • {years}</p>
              </div>
              {msrp && (
                <Badge variant="secondary" className="text-sm">
                  {msrp}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{segment}</Badge>
              <Badge variant="outline">{drive}</Badge>
              {engines.slice(0, 2).map((engine, idx) => (
                <Badge key={idx} variant="outline">{engine}</Badge>
              ))}
              {engines.length > 2 && (
                <Badge variant="outline">+{engines.length - 2} more</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleHeader;
