import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Zap, Fuel, Gauge } from "lucide-react";

interface EngineCardProps {
    engine: {
        id: string;
        engine_code: string;
        engine_name: string | null;
        brand_ref: string | null;
        displacement_l: number | null;
        cylinders: number | null;
        configuration: string | null;
        aspiration: string | null;
        power_hp: number | null;
        torque_nm: number | null;
        fuel_type: string | null;
        production_years: string | null;
    };
    height?: string;
}

const EngineCard = ({ engine, height = "h-[240px]" }: EngineCardProps) => {
    const isElectric = engine.fuel_type === 'electric';

    // Get display name
    const displayName = engine.engine_name || engine.engine_code;

    // Get configuration icon/color
    const getConfigColor = () => {
        if (isElectric) return 'from-blue-500/20 to-cyan-500/20';
        if (engine.configuration === 'V12') return 'from-amber-500/20 to-orange-500/20';
        if (engine.configuration === 'V8') return 'from-red-500/20 to-pink-500/20';
        return 'from-slate-500/20 to-slate-600/20';
    };

    return (
        <Link
            to={`/engines/${engine.id}`}
            className={cn("group relative block w-full", height)}
        >
            <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0 flex flex-col h-full">
                    {/* Top gradient section with config icon */}
                    <div className={cn(
                        "flex-grow flex flex-col items-center justify-center p-4 bg-gradient-to-br",
                        getConfigColor()
                    )}>
                        {isElectric ? (
                            <Zap className="h-12 w-12 text-blue-400 mb-2" />
                        ) : (
                            <Gauge className="h-12 w-12 text-muted-foreground mb-2" />
                        )}
                        <span className="text-2xl font-bold text-foreground">
                            {engine.configuration || 'Engine'}
                        </span>
                        {engine.displacement_l && engine.displacement_l > 0 && (
                            <span className="text-sm text-muted-foreground">
                                {engine.displacement_l}L
                            </span>
                        )}
                    </div>

                    {/* Specs row */}
                    <div className="px-3 py-2 flex gap-1 flex-wrap justify-center bg-muted/30">
                        {engine.power_hp && (
                            <Badge variant="secondary" className="text-xs">
                                {engine.power_hp} HP
                            </Badge>
                        )}
                        {engine.torque_nm && (
                            <Badge variant="secondary" className="text-xs">
                                {engine.torque_nm} Nm
                            </Badge>
                        )}
                        {engine.aspiration && engine.aspiration !== 'electric' && (
                            <Badge variant="outline" className="text-xs">
                                {engine.aspiration}
                            </Badge>
                        )}
                    </div>

                    {/* Footer with name */}
                    <div className="bg-card p-3 border-t border-border">
                        <p className="text-foreground text-sm font-medium truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {engine.engine_code}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default EngineCard;
