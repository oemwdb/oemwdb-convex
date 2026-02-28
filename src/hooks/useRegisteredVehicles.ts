import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface RegisteredVehicle {
  id: string;
  user_id: string;
  vin: string;
  vehicle_title?: string;
  brand_ref: string;
  vehicle_ref: string;
  year?: number;
  trim?: string;
  color?: string;
  mileage: number;
  purchase_date?: string;
  purchase_price?: number;
  current_value_estimate?: number;
  ownership_status: "owned" | "leased" | "financed" | "sold";
  license_plate?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  registration_expiry?: string;
  last_service_date?: string;
  next_service_due?: string;
  notes?: string;
  images?: string[];
  documents?: string[];
  linked_oem_vehicle_id?: string;
  created_at: string;
  updated_at: string;
}

export function useRegisteredVehicles() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const rows = useQuery(
    api.queries.registeredVehiclesGetByUser,
    userId ? { userId } : "skip"
  );
  const deleteMutation = useMutation(api.mutations.registeredVehicleDelete);

  const vehicles: RegisteredVehicle[] =
    rows?.map((r) => ({
      id: String(r._id),
      user_id: r.user_id,
      vin: r.vin,
      vehicle_title: r.vehicle_title,
      brand_ref: r.brand_ref,
      vehicle_ref: r.vehicle_ref,
      year: r.year,
      trim: r.trim,
      color: r.color,
      mileage: r.mileage,
      purchase_date: r.purchase_date,
      purchase_price: r.purchase_price,
      current_value_estimate: r.current_value_estimate,
      ownership_status: r.ownership_status,
      license_plate: r.license_plate,
      insurance_provider: r.insurance_provider,
      insurance_policy_number: r.insurance_policy_number,
      registration_expiry: r.registration_expiry,
      last_service_date: r.last_service_date,
      next_service_due: r.next_service_due,
      notes: r.notes,
      images: r.images,
      documents: r.documents,
      linked_oem_vehicle_id: r.linked_oem_vehicle_id ? String(r.linked_oem_vehicle_id) : undefined,
      created_at: r.created_at,
      updated_at: r.updated_at,
    })) ?? [];

  const deleteVehicle = (vehicleId: string) => {
    deleteMutation({ id: vehicleId as any })
      .then(() => toast.success("Vehicle deleted successfully"))
      .catch((err) => toast.error("Failed to delete vehicle: " + (err?.message ?? err)));
  };

  return {
    vehicles,
    isLoading: !!userId && rows === undefined,
    error: null,
    deleteVehicle,
    isDeleting: false,
  };
}
