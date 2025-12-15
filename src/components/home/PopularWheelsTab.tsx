
import React from "react";
import { Link } from "react-router-dom";
import WheelCard from "@/components/vehicle/WheelCard";

interface PopularWheelsTabProps {
  wheels: any[];
  flippedCards: Record<string, boolean>;
  toggleCardFlip: (id: string) => void;
}

const PopularWheelsTab = ({ wheels, flippedCards, toggleCardFlip }: PopularWheelsTabProps) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {wheels.map(wheel => (
        <Link to={`/wheel/${wheel.id}`} key={wheel.id} className="block">
          <WheelCard
            wheel={wheel}
            isFlipped={!!flippedCards[wheel.id]}
            onFlip={toggleCardFlip}
            linkToDetail={false}
          />
        </Link>
      ))}
    </div>
  );
};

export default PopularWheelsTab;
