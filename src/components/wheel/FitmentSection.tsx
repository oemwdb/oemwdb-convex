
import React, { useState } from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";

interface VehicleItem {
  name: string;
  brand?: string;
  wheels?: number;
}

interface FitmentSectionProps {
  wheelName: string;
  compatibleVehicles: VehicleItem[];
}

const FitmentSection = ({ wheelName, compatibleVehicles }: FitmentSectionProps) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {compatibleVehicles.map((vehicle, index) => (
            <VehicleCard
              key={`${vehicle.name}-${index}`}
              vehicle={{
                name: vehicle.name,
                brand: vehicle.brand || "Unknown",
                wheels: vehicle.wheels || 0
              }}
              isFlipped={flippedCards[vehicle.name] || false}
              onFlip={toggleCardFlip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FitmentSection;
