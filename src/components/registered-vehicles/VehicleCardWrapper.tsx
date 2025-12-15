import { RegisteredVehicle } from "@/hooks/useRegisteredVehicles";
import { useVehicleDetails } from "@/hooks/useVehicleDetails";
import RegisteredVehicleCard from "./RegisteredVehicleCard";

interface VehicleCardWrapperProps {
  vehicle: RegisteredVehicle;
  onManage: () => void;
  onDelete: () => void;
  onBuyParts: () => void;
  onSellVehicle: () => void;
  onFindServices: () => void;
}

const VehicleCardWrapper = (props: VehicleCardWrapperProps) => {
  return <RegisteredVehicleCard {...props} />;
};

export default VehicleCardWrapper;
