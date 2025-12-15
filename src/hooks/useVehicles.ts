
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Vehicle interface simplified to match available data
export interface Vehicle {
  name: string;
  brand: string;
  wheels: number;
  image?: string;
}

const fetchVehicles = async () => {
  console.log("[Vehicles Query] Starting fetch...");
  
  const { data, error } = await supabase
    .from("oem_vehicles" as any)
    .select("chassis_code, model_name, vehicle_title, hero_image_url");

  if (error) {
    console.error(
      "[Vehicles Query] Supabase Error:",
      error.message,
      error.details || "",
      error.hint || ""
    );
    throw error;
  }

  // Log raw vehicle objects for debugging
  console.log("[Vehicles Query] Raw Data:", data);
  console.log("[Vehicles Query] Data length:", data?.length);

  return (data ?? []).map((vehicle: any) => {
    console.log("[Vehicles Query] Processing vehicle:", vehicle);
    // Use model_name if available, otherwise fallback to chassis_code
    const name = String(vehicle.vehicle_title ?? vehicle.model_name ?? vehicle.chassis_code ?? "").trim() || "Unknown vehicle";
    const brand = "Unknown brand"; // oem_vehicles doesn't have brand_name column
    
    return { 
      name, 
      brand, 
      wheels: 0, // Set to 0 since we're not fetching wheel data anymore
      image: vehicle.hero_image_url || undefined
    };
  });
};

export function useVehicles() {
  return useQuery({
    queryKey: ["oem-vehicles-debug"],
    queryFn: fetchVehicles,
    retry: 0,
  });
}
