import React from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabaseBrands, SupabaseBrand } from "@/hooks/useSupabaseBrands";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function BrandsDataTable() {
  const { data: brands = [], isLoading } = useSupabaseBrands();

  const columns: ColumnDef<SupabaseBrand>[] = [
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
      accessorKey: "brand_image_url",
      header: "Logo",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.brand_image_url || ""} alt={row.original.brand_title} />
          <AvatarFallback>{row.original.brand_title.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "brand_title",
      header: "Brand Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("brand_title")}</div>
      ),
    },
    {
      accessorKey: "wheel_count",
      header: "Wheels",
      cell: ({ row }) => {
        const count = row.original.wheel_count || 0;
        return (
          <Badge variant={count > 0 ? "default" : "secondary"}>
            {count} wheels
          </Badge>
        );
      },
    },
    {
      accessorKey: "subsidiaries",
      header: "Subsidiaries",
      cell: ({ row }) => {
        const subsidiaries = row.original.subsidiaries;
        if (!subsidiaries) return <span className="text-muted-foreground">—</span>;
        const subsidiaryList = subsidiaries.split(",").map(s => s.trim());
        return (
          <div className="flex flex-wrap gap-1">
            {subsidiaryList.slice(0, 2).map((sub) => (
              <Badge key={sub} variant="outline" className="text-xs">
                {sub}
              </Badge>
            ))}
            {subsidiaryList.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{subsidiaryList.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "brand_page",
      header: "Website",
      cell: ({ row }) => {
        const url = row.original.brand_page;
        if (!url) return <span className="text-muted-foreground">—</span>;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => window.open(url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const brand = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(brand.brand_title)}>
                Copy brand name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit brand</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete brand</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading brands...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={brands}
      searchKey="brand_title"
      title="Brands Database"
      description="Manage and view all automotive brands in the system"
    />
  );
}