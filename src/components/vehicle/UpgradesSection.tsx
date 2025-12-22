import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Settings } from "lucide-react";
import { useVehicleUpgrades } from "@/hooks/useVehicleUpgrades";
import { Loader2 } from "lucide-react";

interface UpgradesSectionProps {
    vehicleId: string;
}

const levelConfig = {
    STOCK: { label: "Stock+", icon: Settings, color: "text-green-500", borderColor: "border-green-500/50" },
    LIGHT: { label: "Light", icon: TrendingUp, color: "text-blue-500", borderColor: "border-blue-500/50" },
    HEAVY: { label: "Heavy", icon: Zap, color: "text-orange-500", borderColor: "border-orange-500/50" },
};


const UpgradesSection: React.FC<UpgradesSectionProps> = ({ vehicleId }) => {
    const { data: items, isLoading, error } = useVehicleUpgrades(vehicleId);

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
                    No upgrade options available for this vehicle.
                </CardContent>
            </Card>
        );
    }

    // Group by source unique key
    const oemPlusItems = items.filter(i => !i.source || i.source === 'oem_plus');
    const aftermarketItems = items.filter(i => i.source === 'aftermarket');

    const renderUpgradeGroup = (groupItems: typeof items, title: string, icon: React.ElementType, headerColor: string) => {
        if (!groupItems.length) return null;

        // Secondary grouping by level within source
        // Sort/Order by level: STOCK -> LIGHT -> HEAVY
        const levelOrder = { STOCK: 0, LIGHT: 1, HEAVY: 2 };
        const sortedItems = [...groupItems].sort((a, b) => {
            const la = levelOrder[a.level || 'STOCK'] || 0;
            const lb = levelOrder[b.level || 'STOCK'] || 0;
            if (la !== lb) return la - lb;
            return a.title.localeCompare(b.title);
        });

        const Icon = icon;

        return (
            <Card className="mb-4">
                <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{title}</span>
                    </div>
                    <div className="grid gap-3">
                        {sortedItems.map((item) => {
                            // Determine style based on level
                            const config = levelConfig[item.level || 'STOCK'];

                            return (
                                <div
                                    key={item.id}
                                    className={`border-l-2 ${config.borderColor} pl-4 py-2 hover:bg-muted/30 rounded-r-md transition-colors`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium text-sm text-foreground">{item.title}</p>
                                        <Badge variant="secondary" className="text-xs capitalize shrink-0">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {renderUpgradeGroup(oemPlusItems, "OEM+ Enhancements", Settings, "text-foreground")}
            {renderUpgradeGroup(aftermarketItems, "Aftermarket & Performance", Zap, "text-foreground")}
        </div>
    );
};

export default UpgradesSection;
