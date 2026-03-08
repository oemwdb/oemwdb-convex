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
import type { OemWheel } from "@/types/oem";

export function WheelsDataTable() {
  const { data: wheels = [], isLoading } = { data: null as any, isLoading: false, error: null };

  const columns: ColumnDef<OemWheel>[] = [
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
      accessorKey: "good_pic_url",
      header: "Image",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10 rounded">
          <AvatarImage src={row.original.good_pic_url || ""} alt={row.original.wheel_name} />
          <AvatarFallback className="rounded">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "wheel_name",
      header: "Wheel Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("wheel_name")}</div>
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
      accessorKey: "diameter",
      header: "Diameter",
      cell: ({ row }) => {
        const diameter = row.getValue("diameter") as string;
        return diameter ? (
          <Badge variant="secondary">{diameter}"</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "width",
      header: "Width",
      cell: ({ row }) => {
        const width = row.getValue("width") as string;
        return width ? (
          <Badge variant="secondary">{width}"</Badge>
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
      accessorKey: "wheel_offset",
      header: "Offset",
      cell: ({ row }) => {
        const offset = row.getValue("wheel_offset") as string;
        return offset ? (
          <span className="font-mono text-sm">{offset}mm</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.getValue("color") as string;
        return color ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-muted border" />
            <span className="text-sm">{color}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "Ready for website" ? "default" : "destructive";
        return (
          <Badge variant={variant}>{status}</Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const wheel = row.original;
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
                onClick={() => navigator.clipboard.writeText(wheel.wheel_name)}
              >
                Copy wheel name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit wheel</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete wheel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading wheels...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={wheels}
      searchKey="wheel_name"
      title="Wheels Database"
      description="Comprehensive database of all OEM wheels and specifications"
    />
  );
}