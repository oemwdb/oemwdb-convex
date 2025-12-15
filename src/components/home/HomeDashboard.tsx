import { useHomeDashboardMetrics } from '@/hooks/useHomeDashboardMetrics';
import { Loader2, Database, Car, CircleDot } from 'lucide-react';

export default function HomeDashboard() {
    const { data, isLoading, error } = useHomeDashboardMetrics();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return null;
    }

    return (
        <div className="flex gap-3 mb-6">
            {/* Brands */}
            <div className="flex-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 rounded-lg px-4 py-3 border border-blue-500/20 flex items-center gap-3">
                <Database className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Brands</p>
                    <p className="text-lg font-bold text-foreground">{data.totalBrands.toLocaleString()}</p>
                </div>
            </div>

            {/* Vehicles */}
            <div className="flex-1 bg-gradient-to-r from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-600/10 rounded-lg px-4 py-3 border border-green-500/20 flex items-center gap-3">
                <Car className="h-4 w-4 text-green-500 shrink-0" />
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Vehicles</p>
                    <p className="text-lg font-bold text-foreground">{data.totalVehicles.toLocaleString()}</p>
                </div>
            </div>

            {/* Wheels */}
            <div className="flex-1 bg-gradient-to-r from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/10 rounded-lg px-4 py-3 border border-purple-500/20 flex items-center gap-3">
                <CircleDot className="h-4 w-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Wheels</p>
                    <p className="text-lg font-bold text-foreground">{data.totalWheels.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
