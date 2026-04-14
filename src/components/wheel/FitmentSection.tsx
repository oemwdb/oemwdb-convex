import React, { useState } from "react";
import VehiclesGrid from "@/components/vehicle/VehiclesGrid";
import { useVehicleGridColumns } from "@/hooks/useWheelsGridColumns";

interface VehicleItem {
  id?: string;
  name: string;
  brand?: string;
  wheels?: number;
  image?: string;
  bolt_pattern_ref?: any;
  center_bore_ref?: any;
  wheel_diameter_ref?: any;
  wheel_width_ref?: any;
}

interface FitmentSectionProps {
  wheelName: string;
  compatibleVehicles: VehicleItem[];
}

const FitmentSection = ({ wheelName, compatibleVehicles }: FitmentSectionProps) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const vehicleColumns = useVehicleGridColumns();

  // Toggle card flip
  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="space-y-4">
      {compatibleVehicles.length === 0 ? (
        <p className="text-slate-500 p-4 bg-slate-100 rounded-md">No compatible vehicles found for this wheel.</p>
      ) : (
        <VehiclesGrid
          vehicles={compatibleVehicles.map((vehicle) => ({
            id: vehicle.id,
            name: vehicle.name,
            brand: vehicle.brand || "Unknown",
            wheels: vehicle.wheels || 0,
            image: vehicle.image,
            bolt_pattern_ref: vehicle.bolt_pattern_ref,
            center_bore_ref: vehicle.center_bore_ref,
            wheel_diameter_ref: vehicle.wheel_diameter_ref,
            wheel_width_ref: vehicle.wheel_width_ref,
          }))}
          flippedCards={flippedCards}
          onFlip={toggleCardFlip}
          insertAdEvery={vehicleColumns * 3}
        />
      )}
    </div>
  );
};

export default FitmentSection;
