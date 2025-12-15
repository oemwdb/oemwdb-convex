import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useSupabaseBrands } from "@/hooks/useSupabaseBrands";
import { useSupabaseVehicles } from "@/hooks/useSupabaseVehicles";
import { useSupabaseWheels } from "@/hooks/useSupabaseWheels";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Link2, Car, CircleDot, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RelationMakerPage() {
  const { data: brands, isLoading: brandsLoading } = useSupabaseBrands();
  const { data: vehicles, isLoading: vehiclesLoading } = useSupabaseVehicles();
  const { data: wheels, isLoading: wheelsLoading } = useSupabaseWheels();

  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState<string>("");
  const [selectedWheel, setSelectedWheel] = useState<string>("");
  const [selectedWheelBrand, setSelectedWheelBrand] = useState<string>("");
  const [selectedWheelForVehicle, setSelectedWheelForVehicle] = useState<string>("");
  const [selectedVehicleForWheel, setSelectedVehicleForWheel] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = "Relation Maker | Admin Tool";
    const link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (link) {
      link.href = `${window.location.origin}/garage`;
    }
  }, []);

  const handleVehicleBrandRelation = async () => {
    if (!selectedVehicle || !selectedVehicleBrand) {
      toast({
        title: "Missing Selection",
        description: "Please select both a vehicle and a brand",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const vehicle = vehicles?.find(v => v.id.toString() === selectedVehicle);
      const brand = brands?.find(b => b.id.toString() === selectedVehicleBrand);
      
      if (!vehicle || !brand) throw new Error("Invalid selection");

      // Create simple brand reference (just the name as a string)
      const newBrandRef = brand.brand_title;
      
      // Update the vehicle's brand_ref (simple string array)
      const { error } = await supabase
        .from("oem_vehicles" as any)
        .update({ 
          brand_ref: [newBrandRef] // Replacing the array, not appending
        })
        .eq("id", vehicle.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Linked ${vehicle.model_name || vehicle.chassis_code} to ${brand.brand_title}`,
      });
      
      setSelectedVehicle("");
      setSelectedVehicleBrand("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create relationship",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWheelBrandRelation = async () => {
    if (!selectedWheel || !selectedWheelBrand) {
      toast({
        title: "Missing Selection",
        description: "Please select both a wheel and a brand",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const wheel = wheels?.find(w => w.id.toString() === selectedWheel);
      const brand = brands?.find(b => b.id.toString() === selectedWheelBrand);
      
      if (!wheel || !brand) throw new Error("Invalid selection");

      // Create simple brand reference (just the name as a string)
      const newBrandRef = brand.brand_title;
      
      // Update the wheel's brand_ref (simple string array)
      const { error: wheelError } = await supabase
        .from("oem_wheels" as any)
        .update({ 
          brand_ref: [newBrandRef] // Replacing the array, not appending
        })
        .eq("id", wheel.id);

      if (wheelError) throw wheelError;

      // Update the brand's wheel count
      const { error: countError } = await supabase
        .rpc("update_brand_wheel_count" as any, {
          brand_id_param: brand.id,
          brand_uuid_param: null
        });

      if (countError) throw countError;

      toast({
        title: "Success",
        description: `Linked ${wheel.wheel_name} to ${brand.brand_title}`,
      });
      
      setSelectedWheel("");
      setSelectedWheelBrand("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create relationship",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWheelVehicleRelation = async () => {
    if (!selectedWheelForVehicle || !selectedVehicleForWheel) {
      toast({
        title: "Missing Selection",
        description: "Please select both a wheel and a vehicle",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const wheel = wheels?.find(w => w.id.toString() === selectedWheelForVehicle);
      const vehicle = vehicles?.find(v => v.id.toString() === selectedVehicleForWheel);
      
      if (!wheel || !vehicle) throw new Error("Invalid selection");

      // Update wheel's vehicle_refs
      const newVehicleRef = { 
        id: vehicle.id, 
        value: vehicle.model_name || vehicle.chassis_code || "Unknown"
      };
      
      const { data: wheelData, error: fetchError } = await supabase
        .from("oem_wheels" as any)
        .select("vehicle_refs")
        .eq("id", wheel.id)
        .single();

      if (fetchError) throw fetchError;

      const existingVehicleRefs = ((wheelData as any)?.vehicle_refs as any[]) || [];
      const updatedVehicleRefs = [...existingVehicleRefs, newVehicleRef];

      const { error: wheelError } = await supabase
        .from("oem_wheels" as any)
        .update({ 
          vehicle_refs: updatedVehicleRefs
        })
        .eq("id", wheel.id);

      if (wheelError) throw wheelError;

      // Update vehicle's wheel_refs
      const newWheelRef = { 
        id: wheel.id, 
        value: wheel.wheel_name
      };
      
      const { data: vehicleData, error: vehicleFetchError } = await supabase
        .from("oem_vehicles" as any)
        .select("wheel_refs")
        .eq("id", vehicle.id)
        .single();

      if (vehicleFetchError) throw vehicleFetchError;

      const existingWheelRefs = ((vehicleData as any)?.wheel_refs as any[]) || [];
      const updatedWheelRefs = [...existingWheelRefs, newWheelRef];

      const { error: vehicleError } = await supabase
        .from("oem_vehicles" as any)
        .update({ 
          wheel_refs: updatedWheelRefs
        })
        .eq("id", vehicle.id);

      if (vehicleError) throw vehicleError;

      toast({
        title: "Success",
        description: `Linked ${wheel.wheel_name} to ${vehicle.model_name || vehicle.chassis_code}`,
      });
      
      setSelectedWheelForVehicle("");
      setSelectedVehicleForWheel("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create relationship",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isLoading = brandsLoading || vehiclesLoading || wheelsLoading;

  return (
    <DashboardLayout title="Relation Maker">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Relationship Manager</CardTitle>
            <CardDescription>
              Manually create and manage relationships between vehicles, wheels, and brands in the database.
              This tool updates the JSONB reference fields to establish connections.
            </CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="vehicle-brand" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicle-brand" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicle-Brand
              </TabsTrigger>
              <TabsTrigger value="wheel-brand" className="flex items-center gap-2">
                <CircleDot className="h-4 w-4" />
                Wheel-Brand
              </TabsTrigger>
              <TabsTrigger value="wheel-vehicle" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Wheel-Vehicle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle-brand" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Link Vehicle to Brand</CardTitle>
                  <CardDescription>
                    Establish a relationship between a vehicle and its manufacturer brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-select">Select Vehicle</Label>
                      <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger id="vehicle-select">
                          <SelectValue placeholder="Choose a vehicle..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {vehicles?.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{vehicle.model_name || vehicle.chassis_code}</span>
                                  {vehicle.brand_name && (
                                    <Badge variant="secondary" className="text-xs">
                                      {vehicle.brand_name}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand-select">Select Brand</Label>
                      <Select value={selectedVehicleBrand} onValueChange={setSelectedVehicleBrand}>
                        <SelectTrigger id="brand-select">
                          <SelectValue placeholder="Choose a brand..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {brands?.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{brand.brand_title}</span>
                                  {brand.subsidiaries && (
                                    <Badge variant="outline" className="text-xs">
                                      {brand.subsidiaries}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleVehicleBrandRelation}
                    disabled={isUpdating || !selectedVehicle || !selectedVehicleBrand}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Relationship...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Link Vehicle to Brand
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wheel-brand" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Link Wheel to Brand</CardTitle>
                  <CardDescription>
                    Establish a relationship between a wheel and its manufacturer brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wheel-select">Select Wheel</Label>
                      <Select value={selectedWheel} onValueChange={setSelectedWheel}>
                        <SelectTrigger id="wheel-select">
                          <SelectValue placeholder="Choose a wheel..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {wheels?.map((wheel) => (
                              <SelectItem key={wheel.id} value={wheel.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{wheel.wheel_name}</span>
                                  {wheel.brand_name && (
                                    <Badge variant="secondary" className="text-xs">
                                      {wheel.brand_name}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wheel-brand-select">Select Brand</Label>
                      <Select value={selectedWheelBrand} onValueChange={setSelectedWheelBrand}>
                        <SelectTrigger id="wheel-brand-select">
                          <SelectValue placeholder="Choose a brand..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {brands?.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{brand.brand_title}</span>
                                  {brand.wheel_count && brand.wheel_count > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {brand.wheel_count} wheels
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleWheelBrandRelation}
                    disabled={isUpdating || !selectedWheel || !selectedWheelBrand}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Relationship...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Link Wheel to Brand
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wheel-vehicle" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Link Wheel to Vehicle</CardTitle>
                  <CardDescription>
                    Establish a compatibility relationship between a wheel and a vehicle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wheel-vehicle-select">Select Wheel</Label>
                      <Select value={selectedWheelForVehicle} onValueChange={setSelectedWheelForVehicle}>
                        <SelectTrigger id="wheel-vehicle-select">
                          <SelectValue placeholder="Choose a wheel..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {wheels?.map((wheel) => (
                              <SelectItem key={wheel.id} value={wheel.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{wheel.wheel_name}</span>
                                  {wheel.diameter && (
                                    <Badge variant="outline" className="text-xs">
                                      {wheel.diameter}"
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicle-wheel-select">Select Vehicle</Label>
                      <Select value={selectedVehicleForWheel} onValueChange={setSelectedVehicleForWheel}>
                        <SelectTrigger id="vehicle-wheel-select">
                          <SelectValue placeholder="Choose a vehicle..." />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {vehicles?.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{vehicle.model_name || vehicle.chassis_code}</span>
                                  {vehicle.production_years && (
                                    <Badge variant="outline" className="text-xs">
                                      {vehicle.production_years}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleWheelVehicleRelation}
                    disabled={isUpdating || !selectedWheelForVehicle || !selectedVehicleForWheel}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Relationship...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Link Wheel to Vehicle
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Brands</p>
                  <p className="text-2xl font-bold">{brands?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl font-bold">{vehicles?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CircleDot className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Wheels</p>
                  <p className="text-2xl font-bold">{wheels?.length || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}