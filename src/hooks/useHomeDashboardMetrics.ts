import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface DashboardMetrics {
  totalBrands: number;
  totalVehicles: number;
  totalWheels: number;
  wheelsPerBrand: { brand: string; wheels: number; vehicles: number }[];
  boltPatterns: { pattern: string; count: number }[];
}

export function useHomeDashboardMetrics() {
  const metrics = useQuery(api.queries.dashboardMetrics);
  const wheelsByBrand = useQuery(api.queries.wheelsByBrandDistribution);
  const boltPatternsRaw = useQuery(api.queries.boltPatternDistribution);

  const data: DashboardMetrics | undefined =
    metrics && wheelsByBrand && boltPatternsRaw !== undefined
      ? {
          totalBrands: metrics.totalBrands,
          totalVehicles: metrics.totalVehicles,
          totalWheels: metrics.totalWheels,
          wheelsPerBrand: wheelsByBrand.slice(0, 8),
          boltPatterns: boltPatternsRaw,
        }
      : undefined;

  return {
    data,
    isLoading:
      metrics === undefined ||
      wheelsByBrand === undefined ||
      boltPatternsRaw === undefined,
    error: null,
    isError: false,
  };
}
