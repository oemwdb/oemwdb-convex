import React from "react";
import BrandCard from "@/components/brand/BrandCard";
import { AdBar } from "@/components/AdBar";
import { SelectableCollectionCard } from "@/components/collection/SelectableCollectionCard";

const GRID_CLASSES =
  "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2";

interface BrandGridItem {
  id?: string;
  name: string;
  wheelCount: number;
  vehicleCount?: number;
  description?: string | null;
  imagelink?: string | null;
}

interface BrandsGridProps {
  brands: BrandGridItem[];
  flippedCards: Record<string, boolean>;
  onFlip: (name: string) => void;
  insertAdEvery?: number;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
}

export default function BrandsGrid({
  brands,
  flippedCards,
  onFlip,
  insertAdEvery,
  selectionMode,
  selectedIds,
  onToggleSelection,
}: BrandsGridProps) {
  if (insertAdEvery != null && insertAdEvery > 0) {
    const children: React.ReactNode[] = [];

    for (let i = 0; i < brands.length; i += insertAdEvery) {
      const chunk = brands.slice(i, i + insertAdEvery);

      chunk.forEach((brand) => {
        const selectionId = brand.id ?? brand.name;
        const selectedOrder = (selectedIds ?? []).indexOf(selectionId) + 1 || undefined;
        children.push(
          <SelectableCollectionCard
            key={selectionId}
            label={brand.name}
            selectionMode={selectionMode}
            selectedOrder={selectedOrder}
            onToggleSelection={onToggleSelection ? () => onToggleSelection(selectionId) : undefined}
          >
            <BrandCard
              brand={brand}
              isFlipped={flippedCards[brand.name] || false}
              onFlip={onFlip}
            />
          </SelectableCollectionCard>
        );
      });

      if (chunk.length === insertAdEvery) {
        children.push(
          <div key={`ad-${i}`} className="col-span-full">
            <AdBar />
          </div>
        );
      }
    }

    return <div className={GRID_CLASSES}>{children}</div>;
  }

  return (
    <div className={GRID_CLASSES}>
      {brands.map((brand) => (
        <SelectableCollectionCard
          key={brand.id ?? brand.name}
          label={brand.name}
          selectionMode={selectionMode}
          selectedOrder={(selectedIds ?? []).indexOf(brand.id ?? brand.name) + 1 || undefined}
          onToggleSelection={onToggleSelection ? () => onToggleSelection(brand.id ?? brand.name) : undefined}
        >
          <BrandCard
            brand={brand}
            isFlipped={flippedCards[brand.name] || false}
            onFlip={onFlip}
          />
        </SelectableCollectionCard>
      ))}
    </div>
  );
}
