
import React, { useEffect } from "react";
import WheelCard from "./WheelCard";

interface WheelsSectionProps {
  wheels: any[];
  flippedCards: Record<string, boolean>;
  toggleCardFlip: (id: string) => void;
}

const WheelsSection = ({ wheels, flippedCards, toggleCardFlip }: WheelsSectionProps) => {
  // Reset flipped state when wheels change
  useEffect(() => {
    // This is intentionally left empty for a controlled prop pattern
    // The parent component manages the flippedCards state
  }, [wheels]);

  return (
    <div className="space-y-4">

      {wheels.length === 0 ? (
        <p className="text-slate-500 p-4 bg-slate-100 rounded-md">No compatible wheels found for this vehicle.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wheels.map((wheel) => (
            <WheelCard
              key={wheel.id}
              wheel={wheel}
              isFlipped={flippedCards[wheel.id] || false}
              onFlip={toggleCardFlip}
              linkToDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WheelsSection;
