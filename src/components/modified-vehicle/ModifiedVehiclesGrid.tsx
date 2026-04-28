import React from "react";

import { AdBar } from "@/components/AdBar";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";
import type { ModifiedVehicleRecord } from "@/data/modifiedVehicles";
import ModifiedVehicleCard from "@/components/modified-vehicle/ModifiedVehicleCard";

const GRID_CLASSES =
  "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2";

interface ModifiedVehiclesGridProps {
  builds: ModifiedVehicleRecord[];
  flippedCards: Record<string, boolean>;
  onFlip: (slug: string) => void;
  insertAdEvery?: number;
}

export default function ModifiedVehiclesGrid({
  builds,
  flippedCards,
  onFlip,
  insertAdEvery,
}: ModifiedVehiclesGridProps) {
  if (!builds.length) {
    return (
      <CollectionEmptyState
        title="No builds found"
        description="Try adjusting your search or filters to see more results."
      />
    );
  }

  if (insertAdEvery != null && insertAdEvery > 0) {
    const children: React.ReactNode[] = [];
    for (let i = 0; i < builds.length; i += insertAdEvery) {
      const chunk = builds.slice(i, i + insertAdEvery);
      chunk.forEach((build) => {
        children.push(
          <ModifiedVehicleCard
            key={build.id}
            build={build}
            isFlipped={flippedCards[build.slug] || false}
            onFlip={onFlip}
          />,
        );
      });
      if (chunk.length === insertAdEvery) {
        children.push(
          <div key={`ad-${i}`} className="col-span-full">
            <AdBar />
          </div>,
        );
      }
    }
    return <div className={GRID_CLASSES}>{children}</div>;
  }

  return (
    <div className={GRID_CLASSES}>
      {builds.map((build) => (
        <ModifiedVehicleCard
          key={build.id}
          build={build}
          isFlipped={flippedCards[build.slug] || false}
          onFlip={onFlip}
        />
      ))}
    </div>
  );
}
