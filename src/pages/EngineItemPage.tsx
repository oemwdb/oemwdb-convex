import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2, CircleSlash2, Zap, Gauge, Car } from "lucide-react";
import VehicleCard from "@/components/vehicle/VehicleCard";

const EngineItemPage = () => {
  const { engineId } = useParams<{ engineId: string }>();
  const [activeTab, setActiveTab] = useState("specs");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const engine = useQuery(
    api.queries.enginesGetById,
    engineId ? { id: engineId } : "skip"
  );
  const vehiclesRaw = useQuery(
    api.queries.vehiclesGetByEngine,
    engine?._id ? { engineId: engine._id } : "skip"
  );

  const vehicles = (vehiclesRaw ?? []).map((v) => ({
    name: v.vehicle_title || v.model_name || "Unknown Vehicle",
    year: v.production_years ?? "",
    brand: v.brand_name ?? "",
    wheels: 0,
    image: v.vehicle_image ?? undefined,
  }));

  const toggleCardFlip = (name: string) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const loading = engineId ? engine === undefined : false;

  if (loading) {
    return (
      <DashboardLayout title="Loading Engine...">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!engine) {
    return (
      <DashboardLayout title="Engine Not Found">
        <Card className="p-12 text-center bg-destructive/5 border-destructive/20">
          <CircleSlash2 className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Engine not found</h2>
          <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the engine you're looking for.</p>
          <Button asChild variant="outline">
            <Link to="/engines">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Engines
            </Link>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const isElectric = engine.fuel_type === "electric";

  const getConfigColor = () => {
    if (isElectric) return "from-blue-500/20 to-cyan-500/20";
    if (engine.configuration === "V12") return "from-amber-500/20 to-orange-500/20";
    if (engine.configuration === "V8") return "from-red-500/20 to-pink-500/20";
    return "from-slate-500/20 to-slate-600/20";
  };

  return (
    <DashboardLayout title={engine.engine_name || engine.engine_code} disableContentPadding={true}>
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className={`w-48 h-48 rounded-lg bg-gradient-to-br ${getConfigColor()} flex flex-col items-center justify-center`}>
                {isElectric ? (
                  <Zap className="h-16 w-16 text-blue-400 mb-2" />
                ) : (
                  <Gauge className="h-16 w-16 text-muted-foreground mb-2" />
                )}
                <span className="text-3xl font-bold text-foreground">
                  {engine.configuration || "Engine"}
                </span>
                {engine.displacement_l != null && engine.displacement_l > 0 && (
                  <span className="text-lg text-muted-foreground">{engine.displacement_l}L</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{engine.engine_name || engine.engine_code}</h1>
                <p className="text-muted-foreground mb-4">{engine.engine_code}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {engine.power_hp != null && (
                    <div>
                      <p className="text-sm text-muted-foreground">Power</p>
                      <p className="font-semibold">{engine.power_hp} HP</p>
                      {engine.power_kw != null && (
                        <p className="text-xs text-muted-foreground">{engine.power_kw} kW</p>
                      )}
                    </div>
                  )}
                  {engine.torque_nm != null && (
                    <div>
                      <p className="text-sm text-muted-foreground">Torque</p>
                      <p className="font-semibold">{engine.torque_nm} Nm</p>
                      {engine.torque_lb_ft != null && (
                        <p className="text-xs text-muted-foreground">{engine.torque_lb_ft} lb-ft</p>
                      )}
                    </div>
                  )}
                  {engine.displacement_cc != null && engine.displacement_cc > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Displacement</p>
                      <p className="font-semibold">{engine.displacement_cc} cc</p>
                    </div>
                  )}
                  {engine.cylinders != null && engine.cylinders > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cylinders</p>
                      <p className="font-semibold">{engine.cylinders}</p>
                    </div>
                  )}
                  {engine.aspiration && (
                    <div>
                      <p className="text-sm text-muted-foreground">Aspiration</p>
                      <p className="font-semibold capitalize">{engine.aspiration}</p>
                    </div>
                  )}
                  {engine.fuel_type && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold capitalize">{engine.fuel_type}</p>
                    </div>
                  )}
                  {(engine.production_years ?? engine.years_produced) && (
                    <div>
                      <p className="text-sm text-muted-foreground">Production</p>
                      <p className="font-semibold">{engine.production_years ?? engine.years_produced}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border rounded-lg p-1">
            <TabsTrigger value="specs" className="flex-1 min-w-fit">
              Specs
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex-1 min-w-fit">
              Vehicles ({vehicles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                {engine.notes ? (
                  <p className="text-muted-foreground">{engine.notes}</p>
                ) : (
                  <p className="text-muted-foreground">No additional notes available for this engine.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="pt-4 text-center py-12">
                  <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No vehicles linked to this engine yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={`${vehicle.name}-${index}`}
                    vehicle={vehicle}
                    isFlipped={flippedCards[vehicle.name] || false}
                    onFlip={toggleCardFlip}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EngineItemPage;
