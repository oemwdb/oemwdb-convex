import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { useRegisteredVehicles, RegisteredVehicle } from "@/hooks/useRegisteredVehicles";
import { useVehicleDetails } from "@/hooks/useVehicleDetails";
import RegisteredVehicleCard from "@/components/registered-vehicles/RegisteredVehicleCard";
import VehicleRegistrationForm from "@/components/registered-vehicles/VehicleRegistrationForm";
import VehicleDetailDialog from "@/components/registered-vehicles/VehicleDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const RegisteredVehiclesPage = () => {
  const navigate = useNavigate();
  const { vehicles, isLoading, deleteVehicle } = useRegisteredVehicles();
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<RegisteredVehicle | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<RegisteredVehicle | null>(null);

  const handleBuyParts = (vehicle: RegisteredVehicle) => {
    // We'll navigate to market without filtering for now
    // Or you could open the vehicle details first to get the data
    navigate('/market');
  };

  const handleSellVehicle = (vehicle: RegisteredVehicle) => {
    navigate("/market/new", {
      state: {
        fromRegisteredVehicle: true,
        vehicleData: vehicle,
      },
    });
  };

  const handleFindServices = () => {
    toast.info("Service directory coming soon!");
  };

  const handleManage = (vehicle: RegisteredVehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailDialog(true);
  };

  const handleDeleteClick = (vehicle: RegisteredVehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <DashboardLayout title="Registered Vehicles" showFilterButton={false}>
      <div className="min-h-[calc(100vh-120px)] p-3">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Registered Vehicles</h2>
            <p className="text-muted-foreground">
              Manage your personal vehicle collection
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Vehicle
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && vehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Car className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles registered yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start building your digital garage by registering your first vehicle.
              Track maintenance, manage ownership, and more!
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Register Your First Vehicle
            </Button>
          </div>
        )}

        {/* Vehicle Grid */}
        {!isLoading && vehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
              <RegisteredVehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onManage={() => handleManage(vehicle)}
                onDelete={() => handleDeleteClick(vehicle)}
                onBuyParts={() => handleBuyParts(vehicle)}
                onSellVehicle={() => handleSellVehicle(vehicle)}
                onFindServices={handleFindServices}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <VehicleRegistrationForm
        open={showForm}
        onOpenChange={setShowForm}
      />

      <VehicleDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        vehicle={selectedVehicle}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vehicle. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default RegisteredVehiclesPage;
