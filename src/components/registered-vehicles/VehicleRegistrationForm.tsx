import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RegisteredVehicle } from "@/hooks/useRegisteredVehicles";
import { BrandSelector } from "./BrandSelector";
import { VehicleSelector } from "./VehicleSelector";


const formSchema = z.object({
  vin: z.string().length(17, "VIN must be exactly 17 characters"),
  vehicle_title: z.string().min(1, "Title is required").max(100, "Title too long"),
  brand_ref: z.string().min(1, "Please select a brand"),
  vehicle_ref: z.string().min(1, "Please select a vehicle"),
  year: z.coerce.number().min(1900).max(2026).optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
  mileage: z.coerce.number().min(0),
  ownership_status: z.enum(["owned", "leased", "financed", "sold"]),
  purchase_date: z.string().optional(),
  purchase_price: z.coerce.number().optional(),
  license_plate: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional(),
  registration_expiry: z.string().optional(),
  last_service_date: z.string().optional(),
  next_service_due: z.string().optional(),
  notes: z.string().optional(),
  linked_oem_vehicle_id: z.string().optional(),
});

interface VehicleRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: RegisteredVehicle;
}

const VehicleRegistrationForm = ({
  open,
  onOpenChange,
  vehicle,
}: VehicleRegistrationFormProps) => {
  const { createVehicle, updateVehicle, isCreating, isUpdating } = { data: null as any, isLoading: false, error: null };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: vehicle || {
      vin: "",
      vehicle_title: "",
      brand_ref: "",
      vehicle_ref: "",
      mileage: 0,
      ownership_status: "owned",
      year: new Date().getFullYear(),
    },
  });

  // Watch brand selection to enable vehicle selector
  const brandRef = form.watch('brand_ref');
  const vehicleRef = form.watch('vehicle_ref');

  // Auto-populate fields when vehicle is selected
  useEffect(() => {
    if (vehicleRef) {
      const fetchVehicleDetails = async () => {
        const { data } = await supabase
          .from('oem_vehicles')
          .select('*')
          .eq('id', vehicleRef)
          .single();
        
        if (data) {
          // Extract first year from production_years
          const yearMatch = data.production_years?.match(/\d{4}/);
          if (yearMatch) {
            form.setValue('year', parseInt(yearMatch[0]));
          }
        }
      };
      fetchVehicleDetails();
    }
  }, [vehicleRef, form]);

  // Clear vehicle when brand changes
  useEffect(() => {
    if (brandRef) {
      const currentVehicleRef = form.getValues('vehicle_ref');
      if (currentVehicleRef) {
        form.setValue('vehicle_ref', '');
      }
    }
  }, [brandRef, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (vehicle) {
      updateVehicle({ ...values, id: vehicle.id } as any);
    } else {
      createVehicle(values as any);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Edit Vehicle" : "Register New Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="17-character VIN"
                        {...field}
                        maxLength={17}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        disabled={!!vehicle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., My Daily Driver, Dad's Truck, Weekend Car" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehicle Selection from Database */}
              <FormField
                control={form.control}
                name="brand_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <BrandSelector
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle *</FormLabel>
                    <FormControl>
                      <VehicleSelector
                        brandId={brandRef}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trim</FormLabel>
                      <FormControl>
                        <Input placeholder="SE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ownership Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Ownership Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownership_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ownership Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="leased">Leased</SelectItem>
                          <SelectItem value="financed">Financed</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mileage *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="license_plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this vehicle..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {vehicle ? "Update" : "Register"} Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleRegistrationForm;
