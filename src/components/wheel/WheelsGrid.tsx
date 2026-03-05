import React from "react";
import WheelCard from "@/components/wheel/WheelCard";
import { Card } from "@/components/ui/card";
import { CircleSlash2 } from "lucide-react";

interface WheelsGridProps {
  wheels: SupabaseWheel[];
  flippedCards: Record<string, boolean>;
  onFlip: (id: string) => void;
}

const WheelsGrid = ({ wheels, flippedCards, onFlip }: WheelsGridProps) => {
  if (wheels.length === 0) {
    return (
      <Card className="p-12 text-center bg-muted/10 border-dashed">
        <CircleSlash2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2">No Wheels Found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters to see more results
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
      {wheels.map((wheel) => {
        return (
          <div key={wheel.id}>
            <WheelCard
              wheel={{
                id: wheel.id.toString(),
                name: wheel.wheel_name,
                imageUrl: wheel.good_pic_url,
                good_pic_url: wheel.good_pic_url,
                bad_pic_url: wheel.bad_pic_url,
                // Pass all reference fields
                diameter_ref: wheel.diameter_ref,
                width_ref: wheel.width_ref,
                bolt_pattern_ref: wheel.bolt_pattern_ref,
                center_bore_ref: wheel.center_bore_ref,
                color_ref: wheel.color_ref,
                tire_size_ref: wheel.tire_size_ref,
                vehicle_ref: wheel.vehicle_ref,
                brand_ref: wheel.brand_ref,
              }}
              isFlipped={flippedCards[wheel.id.toString()] || false}
              onFlip={onFlip}
            />
          </div>
        );
      })}
    </div>
  );
};

export default WheelsGrid;