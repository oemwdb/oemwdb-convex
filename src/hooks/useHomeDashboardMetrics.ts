import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
    totalBrands: number;
    totalVehicles: number;
    totalWheels: number;
    wheelsPerBrand: { brand: string; wheels: number; vehicles: number }[];
    boltPatterns: { pattern: string; count: number }[];
}

export function useHomeDashboardMetrics() {
    return useQuery({
        queryKey: ['home-dashboard-metrics'],
        queryFn: async (): Promise<DashboardMetrics> => {
            // Fetch total counts
            const [brandsCount, vehiclesCount, wheelsCount] = await Promise.all([
                supabase.from('oem_brands').select('*', { count: 'exact', head: true }),
                supabase.from('oem_vehicles').select('*', { count: 'exact', head: true }),
                supabase.from('oem_wheels').select('*', { count: 'exact', head: true }),
            ]);

            // Fetch wheels per brand (top 10)
            const { data: brandsData } = await supabase
                .from('oem_brands')
                .select('id, brand_name')
                .limit(50);

            // Get wheel counts per brand
            const wheelsPerBrand: { brand: string; wheels: number; vehicles: number }[] = [];

            if (brandsData) {
                // Fetch wheel counts for each brand
                const brandCounts = await Promise.all(
                    brandsData.slice(0, 10).map(async (brand) => {
                        const [wheelCount, vehicleCount] = await Promise.all([
                            supabase
                                .from('oem_wheels')
                                .select('*', { count: 'exact', head: true })
                                .eq('brand_id', brand.id),
                            supabase
                                .from('oem_vehicles')
                                .select('*', { count: 'exact', head: true })
                                .eq('brand_id', brand.id),
                        ]);

                        return {
                            brand: brand.brand_name || 'Unknown',
                            wheels: wheelCount.count || 0,
                            vehicles: vehicleCount.count || 0,
                        };
                    })
                );

                // Sort by wheel count and take top 8
                wheelsPerBrand.push(
                    ...brandCounts
                        .sort((a, b) => b.wheels - a.wheels)
                        .slice(0, 8)
                );
            }

            // Fetch bolt pattern distribution
            const { data: wheelsWithPatterns } = await supabase
                .from('oem_wheels')
                .select('bolt_pattern')
                .not('bolt_pattern', 'is', null)
                .limit(500);

            // Count bolt patterns
            const patternCounts: Record<string, number> = {};
            wheelsWithPatterns?.forEach((wheel) => {
                const pattern = wheel.bolt_pattern;
                if (pattern) {
                    patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
                }
            });

            const boltPatterns = Object.entries(patternCounts)
                .map(([pattern, count]) => ({ pattern, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);

            return {
                totalBrands: brandsCount.count || 0,
                totalVehicles: vehiclesCount.count || 0,
                totalWheels: wheelsCount.count || 0,
                wheelsPerBrand,
                boltPatterns,
            };
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
}
