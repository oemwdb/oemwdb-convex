
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { useWheelImageLoader } from "@/components/vehicle/hooks/useWheelImageLoader";

interface WheelHeaderProps {
  name: string;
  brand: string;
  price: string;
  description: string;
  image?: string;
  specs: {
    diameter_refs: string[];
    width_ref: string[];
    offset: string;
    bolt_pattern_refs: string[];
    center_bore_ref: string[];
    color_refs: string[];
    tire_size_refs?: string[];
  };
  compact?: boolean;
}

const WheelHeader = ({ name, brand, price, description, image, specs, compact = false }: WheelHeaderProps) => {
  const { imageUrl, handleImageError } = useWheelImageLoader(image);
  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-4">
        <div className="flex gap-4 items-start">
          {/* Wheel image - larger and prominent */}
          <div className="flex-shrink-0 w-48 md:w-56">
            <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted group">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
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
              <p className="text-sm text-muted-foreground mt-0.5">{brand}</p>
            </div>

            {/* Compact Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {/* Diameter */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Diameter:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.diameter_refs && specs.diameter_refs.length > 0 ? (
                    specs.diameter_refs.map((diameter, idx) => (
                      <Link key={idx} to={`/wheels?diameter=${encodeURIComponent(diameter)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {diameter}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Width */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Width:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.width_ref && specs.width_ref.length > 0 ? (
                    specs.width_ref.map((width, idx) => (
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

              {/* Bolt Pattern */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Bolt Pattern:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.bolt_pattern_refs && specs.bolt_pattern_refs.length > 0 ? (
                    specs.bolt_pattern_refs.map((pattern, idx) => (
                      <Link key={idx} to={`/wheels?boltPattern=${encodeURIComponent(pattern)}`}>
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

              {/* Offset */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Offset:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.offset ? (
                    <Link to={`/wheels?offset=${encodeURIComponent(specs.offset)}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                        {specs.offset}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">Not specified</Badge>
                  )}
                </div>
              </div>

              {/* Center Bore */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Center Bore:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.center_bore_ref && specs.center_bore_ref.length > 0 ? (
                    specs.center_bore_ref.map((bore, idx) => (
                      <Link key={idx} to={`/wheels?centerBore=${encodeURIComponent(bore)}`}>
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

              {/* Finish */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground min-w-[90px]">Finish:</span>
                <div className="flex flex-wrap gap-1">
                  {specs.color_refs && specs.color_refs.length > 0 ? (
                    specs.color_refs.map((color, idx) => (
                      <Link key={idx} to={`/wheels?color=${encodeURIComponent(color)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {color}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50 text-xs py-0 h-5">N/A</Badge>
                  )}
                </div>
              </div>

              {/* Tire Size (if available) */}
              {specs.tire_size_refs && specs.tire_size_refs.length > 0 && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="font-medium text-muted-foreground min-w-[90px]">Tire Size:</span>
                  <div className="flex flex-wrap gap-1">
                    {specs.tire_size_refs.map((size, idx) => (
                      <Link key={idx} to={`/wheels?tireSize=${encodeURIComponent(size)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-5">
                          {size}
                        </Badge>
                      </Link>
                    ))}
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

export default WheelHeader;
