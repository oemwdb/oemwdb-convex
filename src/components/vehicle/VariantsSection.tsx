import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useVehicleVariants } from "@/hooks/useVehicleVariants";
import { Loader2 } from "lucide-react";

interface VariantsSectionProps {
    vehicleId: string;
}

const VariantsSection: React.FC<VariantsSectionProps> = ({ vehicleId }) => {
    const { data: variants, isLoading, error } = useVehicleVariants(vehicleId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !variants || variants.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No variants data available.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {variants.map((variant) => (
                        <Card key={variant.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex flex-col gap-2">
                                {/* Header */}
                                <h4 className="font-semibold text-foreground text-base">
                                    {variant.model_name}
                                </h4>

                                {/* Content */}
                                <div className="space-y-1 text-sm">
                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Years:</span> {variant.year_start}-{variant.year_end || "Present"}
                                    </p>
                                    {variant.engine_summary && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Engine:</span> {variant.engine_summary}
                                        </p>
                                    )}
                                    {variant.power_summary && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Power:</span> {variant.power_summary}
                                        </p>
                                    )}
                                    {variant.body_type && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Body:</span> {variant.body_type}
                                        </p>
                                    )}
                                </div>

                                {/* Find at section */}
                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground mb-2">Find at</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <a
                                            href={`https://www.autoscout24.com/lst?query=${encodeURIComponent(variant.search_term || variant.model_name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Search on AutoScout24"
                                        >
                                            AutoScout
                                        </a>
                                        <a
                                            href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(variant.search_term || variant.model_name)}&_sacat=6001`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Search on eBay Motors"
                                        >
                                            eBay
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default VariantsSection;
