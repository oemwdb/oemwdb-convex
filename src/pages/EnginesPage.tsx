import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import EngineCard from "@/components/engine/EngineCard";
import { CircleSlash2, Loader2 } from "lucide-react";

const EnginesPage = () => {
    const { data: engines, isLoading, error } = { data: null as any, isLoading: false, error: null };

    if (isLoading) {
        return (
            <DashboardLayout title="Engines" disableContentPadding={true}>
                <div className="flex items-center justify-center py-24 p-2">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title="Engines" disableContentPadding={true}>
                <div className="p-2">
                    <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
                        <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
                        <h2 className="text-2xl font-bold mb-2 text-foreground">Error loading engines</h2>
                        <p className="text-muted-foreground">{error.message}</p>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="OEM Engines" disableContentPadding={true}>
            <div className="p-2 space-y-4">
                {/* Results count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {engines?.length || 0} engines
                    </p>
                </div>

                {/* Engine Grid */}
                {engines && engines.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {engines.map((engine) => (
                            <EngineCard
                                key={engine.id}
                                engine={engine}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center bg-muted/30">
                        <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h2 className="text-xl font-semibold mb-2 text-foreground">No engines found</h2>
                        <p className="text-muted-foreground">There are no engines in the database yet.</p>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EnginesPage;
