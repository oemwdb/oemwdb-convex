import React from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Image as ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function VehiclesDataTable() {
  const { data: vehicles = [], isLoading } = { data: null as any, isLoading: false, error: null };

  const columns: ColumnDef<SupabaseVehicle>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vehicle_image",
      header: "Image",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10 rounded">
          <AvatarImage src={row.original.vehicle_image || ""} alt={row.original.model_name || ""} />
          <AvatarFallback className="rounded">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "chassis_code",
      header: "Chassis Code",
      cell: ({ row }) => (
        <div className="font-mono font-medium">{row.getValue("chassis_code")}</div>
      ),
    },
    {
      accessorKey: "brand_name",
      header: "Brand",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("brand_name") || "Unknown"}</Badge>
      ),
    },
    {
      accessorKey: "model_name",
      header: "Model",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("model_name") || "—"}</div>
      ),
    },
    {
      accessorKey: "production_years",
      header: "Years",
      cell: ({ row }) => {
        const years = row.getValue("production_years") as string;
        return years ? (
          <Badge variant="secondary">{years}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "bolt_pattern",
      header: "Bolt Pattern",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.getValue("bolt_pattern") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "center_bore",
      header: "Center Bore",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.getValue("center_bore") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "Ready for website" ? "default" : 
                       status === "Needs Good Pic" ? "destructive" : "secondary";
        return status ? (
          <Badge variant={variant}>{status}</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(vehicle.chassis_code)}
              >
                Copy chassis code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit vehicle</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete vehicle</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading vehicles...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      searchKey="model_name"
      title="Vehicles Database"
      description="Browse and manage all vehicle models and their specifications"
    />
  );
}