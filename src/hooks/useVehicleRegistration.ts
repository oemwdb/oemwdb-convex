import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
export interface VehicleFormData {
  vin: string;
  vehicle_title: string;
  brand_ref: string;
  vehicle_ref: string;
  year?: number;
  trim?: string;
  color?: string;
  mileage: number;
  ownership_status: "owned" | "leased" | "financed" | "sold";
  purchase_date?: string;
  purchase_price?: number;
  license_plate?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  registration_expiry?: string;
  last_service_date?: string;
  next_service_due?: string;
  notes?: string;
  linked_oem_vehicle_id?: string;
}

export function useVehicleRegistration() {
  const { user } = useAuth();
  const createMutation = useMutation(api.mutations.registeredVehicleInsert);
  const updateMutation = useMutation(api.mutations.registeredVehicleUpdate);

  const createVehicle = (formData: VehicleFormData) => {
    if (!user?.id) {
      toast.error("You must be logged in to register a vehicle");
      return;
    }
    const year = formData.year ?? new Date().getFullYear();
    createMutation({
      userId: user.id,
      vin: formData.vin,
      vehicle_title: formData.vehicle_title,
      brand_ref: formData.brand_ref,
      vehicle_ref: formData.vehicle_ref,
      year,
      mileage: formData.mileage,
      ownership_status: formData.ownership_status,
      trim: formData.trim,
      color: formData.color,
      purchase_date: formData.purchase_date,
      purchase_price: formData.purchase_price,
      license_plate: formData.license_plate,
      insurance_provider: formData.insurance_provider,
      insurance_policy_number: formData.insurance_policy_number,
      registration_expiry: formData.registration_expiry,
      last_service_date: formData.last_service_date,
      next_service_due: formData.next_service_due,
      notes: formData.notes,
    })
      .then(() => toast.success("Vehicle registered successfully"))
      .catch((err) => toast.error("Failed to register vehicle: " + (err?.message ?? err)));
  };

  const updateVehicle = (payload: VehicleFormData & { id: string }) => {
    const { id, ...rest } = payload;
    updateMutation({
      id: id as any,
      vehicle_title: rest.vehicle_title,
      brand_ref: rest.brand_ref,
      vehicle_ref: rest.vehicle_ref,
      year: rest.year,
      mileage: rest.mileage,
      ownership_status: rest.ownership_status,
      trim: rest.trim,
      color: rest.color,
      purchase_date: rest.purchase_date,
      purchase_price: rest.purchase_price,
      license_plate: rest.license_plate,
      insurance_provider: rest.insurance_provider,
      insurance_policy_number: rest.insurance_policy_number,
      registration_expiry: rest.registration_expiry,
      last_service_date: rest.last_service_date,
      next_service_due: rest.next_service_due,
      notes: rest.notes,
    })
      .then(() => toast.success("Vehicle updated successfully"))
      .catch((err) => toast.error("Failed to update vehicle: " + (err?.message ?? err)));
  };

  /** Image upload still uses Supabase storage; Convex file storage to be added later. */
  const uploadImage = async (file: File, vehicleId: string): Promise<string> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("User not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${authUser.id}/${vehicleId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("registered-vehicles")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("registered-vehicles")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    createVehicle,
    updateVehicle,
    uploadImage,
    isCreating: false,
    isUpdating: false,
  };
}
