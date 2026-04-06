import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGarage } from "@/hooks/useGarage";
import { allWheels } from "@/data/wheelsData";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Trash2, PlusCircle } from "lucide-react";
import { getVehicleRoutePath } from "@/lib/vehicleRoutes";

const GaragePage: React.FC = () => {
  const { data: vehicles = [], isLoading, isError } = { data: null as any, isLoading: false, error: null };
  const { items, addCombo, removeCombo, clearAll } = useGarage();

  const [selectedVehicleName, setSelectedVehicleName] = useState<string>("");
  const [selectedWheelId, setSelectedWheelId] = useState<string>("");

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.name === selectedVehicleName),
    [vehicles, selectedVehicleName]
  );

  const wheelsForBrand = allWheels;

  useEffect(() => {
    document.title = "Garage – Save OEM wheel & vehicle combos";
    const href = `${window.location.origin}/garage`;
    const existing = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (existing) existing.href = href; else {
      const l = document.createElement("link");
      l.rel = "canonical";
      l.href = href;
      document.head.appendChild(l);
    }
  }, []);

  const handleAdd = () => {
    const wheel = allWheels.find((w) => String(w.id) === selectedWheelId);
    if (!selectedVehicle || !wheel) {
      toast({ title: "Select a vehicle and a wheel first" });
      return;
    }
    const item = addCombo({
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      brand: selectedVehicle.brand,
      wheelId: String(wheel.id),
      wheelName: wheel.name,
    });
    toast({ title: "Added to your garage", description: `${item.brand} ${item.vehicleName} × ${item.wheelName}` });
    // reset wheel only, keep vehicle for faster adding
    setSelectedWheelId("");
  };

  return (
    <DashboardLayout title="Garage" disableContentPadding={true}>
      <main className="h-full p-2 space-y-4 overflow-y-auto">
        <section aria-labelledby="garage-builder">
          <h1 id="garage-builder" className="text-xl font-semibold">Build a combo</h1>
          <p className="text-muted-foreground text-sm">Select a vehicle and an OEM wheel to save the combo to your garage.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div>
              <label className="text-sm text-muted-foreground">Vehicle</label>
              <Select value={selectedVehicleName} onValueChange={setSelectedVehicleName}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.name} value={v.name}>{v.brand} — {v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">OEM Wheel</label>
              <Select value={selectedWheelId} onValueChange={setSelectedWheelId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose any wheel" />
                </SelectTrigger>
                <SelectContent>
                  {wheelsForBrand.map((w) => (
                    <SelectItem key={String(w.id)} value={String(w.id)}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" /> Add to garage
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        <section aria-labelledby="garage-list">
          <div className="flex items-center justify-between">
            <h2 id="garage-list" className="text-lg font-medium">Your saved combos</h2>
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => clearAll()}>Clear all</Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-muted-foreground text-sm mt-6">No combos yet. Build your first above.</div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
              {items.map((i) => (
                <Card key={i.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{i.brand} {i.vehicleName}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Vehicle</div>
                        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
                          <img
                            src={i.vehicleImageUrl || "/placeholder.svg"}
                            alt={`${i.brand} ${i.vehicleName} image`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </AspectRatio>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Wheel</div>
                        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
                          <img
                            src={i.wheelImageUrl || "/placeholder.svg"}
                            alt={`${i.wheelName} wheel image`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-muted-foreground">Wheel</div>
                      <div className="font-medium">{i.wheelName}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs">
                      <Link to={getVehicleRoutePath({ id: i.vehicleId, name: i.vehicleName })} className="underline">View vehicle</Link>
                      <span>•</span>
                      <Link to={`/wheels/${encodeURIComponent(i.wheelName)}`} className="underline">View wheel</Link>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCombo(i.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </DashboardLayout>
  );
};

export default GaragePage;
