import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleSelectorProps {
  brandId?: string;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function VehicleSelector({ brandId, value, onValueChange, disabled }: VehicleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const vehiclesRaw = useQuery(api.queries.vehiclesGetAllWithBrands, {});
  const allVehicles = useMemo(() => {
    const arr = Array.isArray(vehiclesRaw) ? vehiclesRaw : [];
    return arr.map((v) => ({ ...v, id: String(v._id) }));
  }, [vehiclesRaw]);
  const isLoading = vehiclesRaw === undefined;

  // Filter vehicles by selected brand (brand_id is Convex Id<"oem_brands">)
  const vehicles = useMemo(() => {
    return allVehicles.filter((vehicle) => {
      if (!brandId || !vehicle.brand_id) return false;
      return String(vehicle.brand_id) === brandId;
    });
  }, [allVehicles, brandId]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;
    return vehicles.filter((vehicle) => {
      const searchString = `${vehicle.vehicle_title || vehicle.model_name} ${vehicle.chassis_code || ''} ${vehicle.production_years || ''}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [vehicles, searchTerm]);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === value);

  // Reset selection when brand changes
  useEffect(() => {
    if (brandId && value) {
      const isValidForBrand = vehicles.some((v) => v.id === value);
      if (!isValidForBrand) {
        onValueChange("");
      }
    }
  }, [brandId, value, vehicles, onValueChange]);

  if (!brandId) {
    return (
      <div className="w-full p-2 border rounded-md bg-muted text-muted-foreground">
        Select a brand first
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-2 border rounded-md bg-muted text-muted-foreground">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search vehicles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled || !brandId}
      />
      <Select value={value} onValueChange={onValueChange} disabled={disabled || !brandId}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedVehicle ? (
              <div className="flex items-center gap-2">
                <span className="truncate">
                  {selectedVehicle.vehicle_title || selectedVehicle.model_name}
                  {selectedVehicle.production_years && ` (${selectedVehicle.production_years})`}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {brandId ? "Select vehicle..." : "Select brand first"}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredVehicles.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No vehicles found for this brand
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                <div className="flex flex-col">
                  <span>{vehicle.vehicle_title || vehicle.model_name}</span>
                  {vehicle.production_years && (
                    <span className="text-xs text-muted-foreground">
                      {vehicle.production_years}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
