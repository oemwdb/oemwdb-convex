
import React from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { Vehicle } from "@/hooks/useVehicles";

interface VehiclesGridProps {
  vehicles: Vehicle[];
  flippedCards: Record<string, boolean>;
  onFlip: (name: string) => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  flippedCards,
  onFlip,
}) => {
  if (!vehicles.length) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-slate-500 mb-2">No vehicles match your filters — or your database is empty.</p>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 mx-auto max-w-xl">
          <span>
            <b>Debugging tips</b>:<br />
            - Ensure you have data in the Supabase <i>OEM Vehicles</i> table.<br />
            - Check the browser dev console for details.<br />
            - If your database is empty, you'll need to add rows manually via Supabase dashboard.<br />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.name}
          vehicle={{
            name: vehicle.name,
            brand: vehicle.brand,
            wheels: vehicle.wheels,
            image: vehicle.image,
            bolt_pattern_ref: (vehicle as any).bolt_pattern_ref,
            center_bore_ref: (vehicle as any).center_bore_ref,
            wheel_diameter_ref: (vehicle as any).wheel_diameter_ref,
            wheel_width_ref: (vehicle as any).wheel_width_ref
          }}
          isFlipped={flippedCards[vehicle.name] || false}
          onFlip={onFlip}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
