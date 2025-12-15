import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RegisteredVehicle } from "./useRegisteredVehicles";

export interface VehicleFormData {
  vin: string;
  vehicle_title: string;
  brand_ref: string;
  vehicle_ref: string;
  year?: number;
  trim?: string;
  color?: string;
  mileage: number;
  ownership_status: 'owned' | 'leased' | 'financed' | 'sold';
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

export const useVehicleRegistration = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: VehicleFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const insertData: any = {
        user_id: user.id,
        vin: formData.vin.toUpperCase(),
        vehicle_title: formData.vehicle_title,
        mileage: formData.mileage,
        ownership_status: formData.ownership_status,
        brand_ref: JSON.stringify(formData.brand_ref),
        vehicle_ref: JSON.stringify(formData.vehicle_ref),
      };

      // Add optional fields
      if (formData.year) insertData.year = formData.year;
      if (formData.trim) insertData.trim = formData.trim;
      if (formData.color) insertData.color = formData.color;
      if (formData.purchase_date) insertData.purchase_date = formData.purchase_date;
      if (formData.purchase_price) insertData.purchase_price = formData.purchase_price;
      if (formData.license_plate) insertData.license_plate = formData.license_plate;
      if (formData.insurance_provider) insertData.insurance_provider = formData.insurance_provider;
      if (formData.insurance_policy_number) insertData.insurance_policy_number = formData.insurance_policy_number;
      if (formData.registration_expiry) insertData.registration_expiry = formData.registration_expiry;
      if (formData.last_service_date) insertData.last_service_date = formData.last_service_date;
      if (formData.next_service_due) insertData.next_service_due = formData.next_service_due;
      if (formData.notes) insertData.notes = formData.notes;
      if (formData.linked_oem_vehicle_id) insertData.linked_oem_vehicle_id = formData.linked_oem_vehicle_id;

      const { data, error } = await supabase
        .from("user_registered_vehicles")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-vehicles"] });
      toast.success("Vehicle registered successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to register vehicle: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...formData }: VehicleFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("user_registered_vehicles")
        .update(formData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-vehicles"] });
      toast.success("Vehicle updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update vehicle: " + error.message);
    },
  });

  const uploadImage = async (file: File, vehicleId: string): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${vehicleId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from("registered-vehicles")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("registered-vehicles")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    createVehicle: createMutation.mutate,
    updateVehicle: updateMutation.mutate,
    uploadImage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
