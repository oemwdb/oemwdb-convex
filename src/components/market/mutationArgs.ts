import type { Id } from "../../../convex/_generated/dataModel";
import type {
  MarketListingMutationInput,
  MarketPromotionMutationInput,
} from "@/components/market/types";

export function toListingMutationArgs(input: MarketListingMutationInput) {
  return {
    ...input,
    brand_id: input.brand_id as Id<"oem_brands"> | undefined,
    vehicle_id: input.vehicle_id as Id<"oem_vehicles"> | undefined,
    wheel_id: input.wheel_id as Id<"oem_wheels"> | undefined,
    wheel_variant_id: input.wheel_variant_id as Id<"oem_wheel_variants"> | undefined,
  };
}

export function toPromotionMutationArgs(input: MarketPromotionMutationInput) {
  return {
    ...input,
    brand_id: input.brand_id as Id<"oem_brands"> | undefined,
    vehicle_id: input.vehicle_id as Id<"oem_vehicles"> | undefined,
    wheel_id: input.wheel_id as Id<"oem_wheels"> | undefined,
    wheel_variant_id: input.wheel_variant_id as Id<"oem_wheel_variants"> | undefined,
  };
}
