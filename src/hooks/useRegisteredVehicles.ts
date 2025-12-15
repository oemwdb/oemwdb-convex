import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  ownership_status: 'owned' | 'leased' | 'financed' | 'sold';
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

export const useRegisteredVehicles = () => {
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["registered-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_registered_vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Parse JSONB fields
      return (data || []).map(vehicle => ({
        ...vehicle,
        brand_ref: vehicle.brand_ref ? JSON.parse(vehicle.brand_ref as any) : '',
        vehicle_ref: vehicle.vehicle_ref ? JSON.parse(vehicle.vehicle_ref as any) : '',
      })) as RegisteredVehicle[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await supabase
        .from("user_registered_vehicles")
        .delete()
        .eq("id", vehicleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-vehicles"] });
      toast.success("Vehicle deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete vehicle: " + error.message);
    },
  });

  return {
    vehicles: vehicles || [],
    isLoading,
    error,
    deleteVehicle: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
