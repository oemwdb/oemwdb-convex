import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Wrench } from "lucide-react";
import { useVehicleMaintenance } from "@/hooks/useVehicleMaintenance";
import { Loader2 } from "lucide-react";

interface MaintenanceSectionProps {
    vehicleId: string;
}

const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ vehicleId }) => {
    const { data: items, isLoading, error } = useVehicleMaintenance(vehicleId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !items || items.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No maintenance data available for this vehicle.
                </CardContent>
            </Card>
        );
    }

    // Group by type
    const knownIssues = items.filter(i => i.type === "known_issue");
    const schedules = items.filter(i => i.type === "schedule");

    // Group by category
    const groupByCategory = (arr: typeof items) => {
        return arr.reduce((acc, item) => {
            const cat = item.category || "general";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {} as Record<string, typeof items>);
    };

    const issuesByCategory = groupByCategory(knownIssues);
    const schedulesByCategory = groupByCategory(schedules);

    return (
        <div className="space-y-6">
            {/* Known Issues */}
            {knownIssues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Known Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(issuesByCategory).map(([category, items]) => (
                            <div key={category}>
                                <h4 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                                    {category.replace(/_/g, " ")}
                                </h4>
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="border-l-2 border-amber-500/50 pl-4 py-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-sm">{item.title}</p>
                                                {item.engine_variant && (
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {item.engine_variant}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Maintenance Schedule */}
            {schedules.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Maintenance Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(schedulesByCategory).map(([category, items]) => (
                            <div key={category}>
                                <h4 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                                    {category.replace(/_/g, " ")}
                                </h4>
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="border-l-2 border-blue-500/50 pl-4 py-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-sm">{item.title}</p>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {item.interval_miles && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {item.interval_miles.toLocaleString()} mi
                                                        </Badge>
                                                    )}
                                                    {item.engine_variant && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.engine_variant}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MaintenanceSection;
