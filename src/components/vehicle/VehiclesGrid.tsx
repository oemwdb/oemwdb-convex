import React from "react";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { AdBar } from "@/components/AdBar";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";

const GRID_CLASSES =
  "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2";

const getVehicleFlipKey = (vehicle: Vehicle) =>
  vehicle.id ||
  (vehicle as Vehicle & { slug?: string }).slug ||
  (vehicle as Vehicle & { routeId?: string }).routeId ||
  vehicle.name;

interface VehiclesGridProps {
  vehicles: Vehicle[];
  flippedCards: Record<string, boolean>;
  onFlip: (name: string) => void;
  /** Insert a full-width ad after every N items (e.g. 3 * columns). Ensures full rows. */
  insertAdEvery?: number;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  selectionTone?: "merge" | "delete";
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  flippedCards,
  onFlip,
  insertAdEvery,
  selectionMode,
  selectedIds,
  onToggleSelection,
  selectionTone = "merge",
}) => {
  if (!vehicles.length) {
    return (
      <CollectionEmptyState
        title="No vehicles found"
        description="Try adjusting your search or filters to see more results."
      />
    );
  }

  if (insertAdEvery != null && insertAdEvery > 0) {
    const children: React.ReactNode[] = [];
    for (let i = 0; i < vehicles.length; i += insertAdEvery) {
      const chunk = vehicles.slice(i, i + insertAdEvery);
      chunk.forEach((vehicle) => {
        const selectionId = vehicle.id ?? vehicle.name;
        const flipKey = getVehicleFlipKey(vehicle);
        const selectedOrder = (selectedIds ?? []).indexOf(selectionId) + 1 || undefined;
        children.push(
          <SelectableCollectionCard
            key={selectionId}
            label={vehicle.name}
            selectionMode={selectionMode}
            selectedOrder={selectedOrder}
            onToggleSelection={onToggleSelection ? () => onToggleSelection(selectionId) : undefined}
            selectionTone={selectionTone}
          >
            <VehicleCard
              vehicle={{
                id: (vehicle as { id?: string }).id,
                slug: (vehicle as { slug?: string }).slug,
                routeId: (vehicle as { routeId?: string }).routeId,
                name: vehicle.name,
                brand: vehicle.brand,
                wheels: vehicle.wheels,
                image: vehicle.image,
                bolt_pattern_ref: (vehicle as any).bolt_pattern_ref,
                center_bore_ref: (vehicle as any).center_bore_ref,
                wheel_diameter_ref: (vehicle as any).wheel_diameter_ref,
                wheel_width_ref: (vehicle as any).wheel_width_ref,
              }}
              isFlipped={flippedCards[flipKey] || false}
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
          selectionTone={selectionTone}
        >
          <VehicleCard
            vehicle={{
              id: (vehicle as { id?: string }).id,
              slug: (vehicle as { slug?: string }).slug,
              routeId: (vehicle as { routeId?: string }).routeId,
              name: vehicle.name,
              brand: vehicle.brand,
              wheels: vehicle.wheels,
              image: vehicle.image,
              bolt_pattern_ref: (vehicle as any).bolt_pattern_ref,
              center_bore_ref: (vehicle as any).center_bore_ref,
              wheel_diameter_ref: (vehicle as any).wheel_diameter_ref,
              wheel_width_ref: (vehicle as any).wheel_width_ref,
            }}
            isFlipped={flippedCards[getVehicleFlipKey(vehicle)] || false}
            onFlip={onFlip}
          />
        </SelectableCollectionCard>
      ))}
    </div>
  );
};

export default VehiclesGrid;
