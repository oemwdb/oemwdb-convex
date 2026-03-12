import React from "react";
import WheelCard from "@/components/wheel/WheelCard";
import { Card } from "@/components/ui/card";
import { AdBar } from "@/components/AdBar";
import { CircleSlash2 } from "lucide-react";
import type { OemWheel } from "@/types/oem";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";

const GRID_CLASSES =
  "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2";

interface WheelsGridProps {
  wheels: OemWheel[];
  flippedCards: Record<string, boolean>;
  onFlip: (id: string) => void;
  /** Insert a full-width ad after every N items (e.g. 3 * columns). Ensures full rows. */
  insertAdEvery?: number;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
}

function WheelCardCell({
  wheel,
  isFlipped,
  onFlip,
  selectionMode,
  selectedIds,
  onToggleSelection,
}: {
  wheel: OemWheel;
  isFlipped: boolean;
  onFlip: (id: string) => void;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
}) {
  const selectionId = wheel.convexId ?? wheel.id.toString();
  const selectedOrder = (selectedIds ?? []).indexOf(selectionId) + 1 || undefined;

  return (
    <SelectableCollectionCard
      label={wheel.wheel_name}
      selectionMode={selectionMode}
      selectedOrder={selectedOrder}
      onToggleSelection={onToggleSelection ? () => onToggleSelection(selectionId) : undefined}
    >
      <WheelCard
        wheel={{
          id: wheel.id.toString(),
          name: wheel.wheel_name,
          imageUrl: wheel.good_pic_url,
          good_pic_url: wheel.good_pic_url,
          bad_pic_url: wheel.bad_pic_url,
          diameter_ref: wheel.diameter_ref,
          width_ref: wheel.width_ref,
          bolt_pattern_ref: wheel.bolt_pattern_ref,
          center_bore_ref: wheel.center_bore_ref,
          color_ref: wheel.color_ref,
          tire_size_ref: wheel.tire_size_ref,
          vehicle_ref: wheel.vehicle_ref,
          brand_ref: wheel.brand_ref,
        }}
        isFlipped={isFlipped}
        onFlip={onFlip}
      />
    </SelectableCollectionCard>
  );
}

const WheelsGrid = ({
  wheels,
  flippedCards,
  onFlip,
  insertAdEvery,
  selectionMode,
  selectedIds,
  onToggleSelection,
}: WheelsGridProps) => {
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

  if (insertAdEvery != null && insertAdEvery > 0) {
    const children: React.ReactNode[] = [];
    for (let i = 0; i < wheels.length; i += insertAdEvery) {
      const chunk = wheels.slice(i, i + insertAdEvery);
      chunk.forEach((wheel) => {
        children.push(
          <WheelCardCell
            key={wheel.convexId ?? wheel.id}
            wheel={wheel}
            isFlipped={flippedCards[wheel.id.toString()] || false}
            onFlip={onFlip}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            onToggleSelection={onToggleSelection}
          />
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
      {wheels.map((wheel) => (
        <WheelCardCell
          key={wheel.convexId ?? wheel.id}
          wheel={wheel}
          isFlipped={flippedCards[wheel.id.toString()] || false}
          onFlip={onFlip}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </div>
  );
};

export default WheelsGrid;
