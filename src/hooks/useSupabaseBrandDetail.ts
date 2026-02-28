/**
 * @deprecated Use useBrandVehicles and useBrandWheels from useBrandDetail instead.
 * Re-exports for backwards compatibility.
 */
export {
  useBrandVehicles as useSupabaseBrandVehicles,
  useBrandWheels as useSupabaseBrandWheels,
  type BrandVehicle,
  type BrandWheel,
} from "./useBrandDetail";
