import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegisteredVehicle } from "@/hooks/useRegisteredVehicles";
import { useVehicleDetails } from "@/hooks/useVehicleDetails";
import { ShoppingCart, DollarSign, Wrench, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

interface RegisteredVehicleCardProps {
  vehicle: RegisteredVehicle;
  onManage: () => void;
  onDelete: () => void;
  onBuyParts: () => void;
  onSellVehicle: () => void;
  onFindServices: () => void;
}

const RegisteredVehicleCard = ({
  vehicle,
  onManage,
  onDelete,
  onBuyParts,
  onSellVehicle,
  onFindServices,
}: RegisteredVehicleCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { data: vehicleDetails } = useVehicleDetails(vehicle.brand_ref, vehicle.vehicle_ref);
  const primaryImage = vehicle.images?.[0];
  const maskedVin = `*******${vehicle.vin.slice(-5)}`;

  const displayName = vehicleDetails 
    ? `${vehicleDetails.year || ''} ${vehicleDetails.brand} ${vehicleDetails.model}`.trim()
    : 'Loading...';

  const statusColors = {
    owned: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    leased: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    financed: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    sold: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Section */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & Status */}
        <div className="space-y-2">
          {vehicle.vehicle_title && (
            <h3 className="font-semibold text-lg line-clamp-1">
              {vehicle.vehicle_title}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            {displayName}
          </p>
          {vehicle.trim && (
            <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
          )}
          <Badge variant="outline" className={statusColors[vehicle.ownership_status]}>
            {vehicle.ownership_status.charAt(0).toUpperCase() + vehicle.ownership_status.slice(1)}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>VIN: {maskedVin}</p>
          <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>
          {vehicle.license_plate && <p>Plate: {vehicle.license_plate}</p>}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBuyParts}
            className="flex items-center gap-1"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Parts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSellVehicle}
            className="flex items-center gap-1"
          >
            <DollarSign className="h-3.5 w-3.5" />
            Sell
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onFindServices}
            className="flex items-center gap-1"
          >
            <Wrench className="h-3.5 w-3.5" />
            Services
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onManage}
            className="flex items-center gap-1"
          >
            <Settings className="h-3.5 w-3.5" />
            Manage
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Vehicle
        </Button>
      </div>
    </Card>
  );
};

export default RegisteredVehicleCard;
