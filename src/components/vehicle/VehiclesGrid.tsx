import React from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { AdBar } from "@/components/AdBar";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";

const GRID_CLASSES =
  "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2";

interface VehiclesGridProps {
  vehicles: Vehicle[];
  flippedCards: Record<string, boolean>;
  onFlip: (name: string) => void;
  /** Insert a full-width ad after every N items (e.g. 3 * columns). Ensures full rows. */
  insertAdEvery?: number;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  flippedCards,
  onFlip,
  insertAdEvery,
  selectionMode,
  selectedIds,
  onToggleSelection,
}) => {
  if (!vehicles.length) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-slate-500 mb-2">No vehicles match your filters — or your database is empty.</p>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 mx-auto max-w-xl">
          <span>
            <b>Debugging tips</b>:<br />
            - Ensure you have data in the Convex <i>OEM Vehicles</i> table.<br />
            - Check the browser dev console for details.<br />
            - If your database is empty, add rows via Convex dashboard or migrations.<br />
          </span>
        </div>
      </div>
    );
  }

  if (insertAdEvery != null && insertAdEvery > 0) {
    const children: React.ReactNode[] = [];
    for (let i = 0; i < vehicles.length; i += insertAdEvery) {
      const chunk = vehicles.slice(i, i + insertAdEvery);
      chunk.forEach((vehicle) => {
        const selectionId = vehicle.id ?? vehicle.name;
        const selectedOrder = (selectedIds ?? []).indexOf(selectionId) + 1 || undefined;
        children.push(
          <SelectableCollectionCard
            key={selectionId}
            label={vehicle.name}
            selectionMode={selectionMode}
            selectedOrder={selectedOrder}
            onToggleSelection={onToggleSelection ? () => onToggleSelection(selectionId) : undefined}
          >
            <VehicleCard
              vehicle={{
                id: (vehicle as { id?: string }).id,
                name: vehicle.name,
                brand: vehicle.brand,
                wheels: vehicle.wheels,
                image: vehicle.image,
                bolt_pattern_ref: (vehicle as any).bolt_pattern_ref,
                center_bore_ref: (vehicle as any).center_bore_ref,
                wheel_diameter_ref: (vehicle as any).wheel_diameter_ref,
                wheel_width_ref: (vehicle as any).wheel_width_ref,
              }}
              isFlipped={flippedCards[vehicle.name] || false}
              onFlip={onFlip}
            />
          </SelectableCollectionCard>
        );
      });
      if (chunk.length === insertAdEvery) {
        children.push(<div key={`ad-${i}`} className="col-span-full"><AdBar /></div>);
      }
    }
    return <div className={GRID_CLASSES}>{children}</div>;
  }

  return (
    <div className={GRID_CLASSES}>
      {vehicles.map((vehicle) => (
        <SelectableCollectionCard
          key={vehicle.id ?? vehicle.name}
          label={vehicle.name}
          selectionMode={selectionMode}
          selectedOrder={(selectedIds ?? []).indexOf(vehicle.id ?? vehicle.name) + 1 || undefined}
          onToggleSelection={onToggleSelection ? () => onToggleSelection(vehicle.id ?? vehicle.name) : undefined}
        >
          <VehicleCard
            vehicle={{
              id: (vehicle as { id?: string }).id,
              name: vehicle.name,
              brand: vehicle.brand,
              wheels: vehicle.wheels,
              image: vehicle.image,
              bolt_pattern_ref: (vehicle as any).bolt_pattern_ref,
              center_bore_ref: (vehicle as any).center_bore_ref,
              wheel_diameter_ref: (vehicle as any).wheel_diameter_ref,
              wheel_width_ref: (vehicle as any).wheel_width_ref,
            }}
            isFlipped={flippedCards[vehicle.name] || false}
            onFlip={onFlip}
          />
        </SelectableCollectionCard>
      ))}
    </div>
  );
};

export default VehiclesGrid;
