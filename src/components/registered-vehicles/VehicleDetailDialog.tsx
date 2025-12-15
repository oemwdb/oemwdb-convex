import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisteredVehicle } from "@/hooks/useRegisteredVehicles";
import { useVehicleDetails } from "@/hooks/useVehicleDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VehicleRegistrationForm from "./VehicleRegistrationForm";

interface VehicleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: RegisteredVehicle | null;
}

const VehicleDetailDialog = ({
  open,
  onOpenChange,
  vehicle,
}: VehicleDetailDialogProps) => {
  const [editMode, setEditMode] = useState(false);
  const { data: vehicleDetails } = useVehicleDetails(vehicle?.brand_ref, vehicle?.vehicle_ref);

  if (!vehicle) return null;

  const displayName = vehicleDetails 
    ? `${vehicleDetails.year || ''} ${vehicleDetails.brand} ${vehicleDetails.model}`.trim()
    : 'Loading...';

  if (editMode) {
    return (
      <VehicleRegistrationForm
        open={editMode}
        onOpenChange={(open) => {
          setEditMode(open);
          if (!open) onOpenChange(false);
        }}
        vehicle={vehicle}
      />
    );
  }

  const statusColors = {
    owned: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    leased: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    financed: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    sold: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{displayName}</span>
            <Button onClick={() => setEditMode(true)} size="sm">
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {vehicle.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Vehicle ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">VIN</p>
                <p className="font-medium">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusColors[vehicle.ownership_status]}>
                  {vehicle.ownership_status.charAt(0).toUpperCase() + vehicle.ownership_status.slice(1)}
                </Badge>
              </div>
              {vehicle.trim && (
                <div>
                  <p className="text-muted-foreground">Trim</p>
                  <p className="font-medium">{vehicle.trim}</p>
                </div>
              )}
              {vehicle.color && (
                <div>
                  <p className="text-muted-foreground">Color</p>
                  <p className="font-medium">{vehicle.color}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Mileage</p>
                <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
              </div>
              {vehicle.license_plate && (
                <div>
                  <p className="text-muted-foreground">License Plate</p>
                  <p className="font-medium">{vehicle.license_plate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ownership Details */}
          {(vehicle.purchase_date || vehicle.purchase_price) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Ownership Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {vehicle.purchase_date && (
                  <div>
                    <p className="text-muted-foreground">Purchase Date</p>
                    <p className="font-medium">{new Date(vehicle.purchase_date).toLocaleDateString()}</p>
                  </div>
                )}
                {vehicle.purchase_price && (
                  <div>
                    <p className="text-muted-foreground">Purchase Price</p>
                    <p className="font-medium">${vehicle.purchase_price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insurance Info */}
          {(vehicle.insurance_provider || vehicle.registration_expiry) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Insurance & Registration</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {vehicle.insurance_provider && (
                  <div>
                    <p className="text-muted-foreground">Insurance Provider</p>
                    <p className="font-medium">{vehicle.insurance_provider}</p>
                  </div>
                )}
                {vehicle.registration_expiry && (
                  <div>
                    <p className="text-muted-foreground">Registration Expiry</p>
                    <p className="font-medium">{new Date(vehicle.registration_expiry).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Maintenance */}
          {(vehicle.last_service_date || vehicle.next_service_due) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Maintenance</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {vehicle.last_service_date && (
                  <div>
                    <p className="text-muted-foreground">Last Service</p>
                    <p className="font-medium">{new Date(vehicle.last_service_date).toLocaleDateString()}</p>
                  </div>
                )}
                {vehicle.next_service_due && (
                  <div>
                    <p className="text-muted-foreground">Next Service Due</p>
                    <p className="font-medium">{new Date(vehicle.next_service_due).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {vehicle.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {vehicle.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailDialog;
