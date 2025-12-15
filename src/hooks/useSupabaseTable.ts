import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/components/datatable/EditableDataTable";

const TABLE_CONFIGS: Record<TableName, { columns: Array<{ key: string; label: string; type: "text" | "image" | "reference" | "array" | "number" | "date" | "badge" | "tags"; width?: string }> }> = {
  oem_brands: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "brand_image_url", label: "Logo", type: "image" as const, width: "w-20" },
      { key: "name", label: "Name", type: "text" as const },
      { key: "wheel_count", label: "Wheels", type: "number" as const, width: "w-24" },
      { key: "subsidiaries", label: "Subsidiaries", type: "text" as const },
      { key: "brand_page", label: "Website", type: "text" as const },
    ],
  },
  oem_vehicles: {
    columns: [
      { key: "id", label: "ID", type: "text" as const, width: "w-32" },
      { key: "vehicle_image", label: "Image", type: "image" as const, width: "w-20" },
      { key: "vehicle_id_only", label: "Chassis", type: "text" as const },
      { key: "model_name", label: "Model", type: "text" as const },
      { key: "vehicle_title", label: "Title", type: "text" as const },
      { key: "production_years", label: "Years", type: "text" as const },
      { key: "brand_ref", label: "Brands", type: "tags" as const },
      { key: "bolt_pattern_ref", label: "Bolt Patterns", type: "tags" as const },
      { key: "center_bore_ref", label: "Center Bores", type: "tags" as const },
      { key: "diameter_ref", label: "Diameters", type: "tags" as const },
      { key: "width_ref", label: "Widths", type: "tags" as const },
      { key: "color_ref", label: "Colors", type: "tags" as const },
      { key: "wheel_ref", label: "Wheels", type: "tags" as const },
    ],
  },
  oem_wheels: {
    columns: [
      { key: "id", label: "ID", type: "text" as const, width: "w-32" },
      { key: "good_pic_url", label: "Image", type: "image" as const, width: "w-20" },
      { key: "wheel_title", label: "Name", type: "text" as const },
      { key: "wheel_offset", label: "Offset", type: "text" as const },
      { key: "color", label: "Color", type: "text" as const },
      { key: "brand_ref", label: "Brands", type: "tags" as const },
      { key: "diameter_ref", label: "Diameters", type: "tags" as const },
      { key: "width_ref", label: "Widths", type: "tags" as const },
      { key: "bolt_pattern_ref", label: "Bolt Patterns", type: "tags" as const },
      { key: "center_bore_ref", label: "Center Bores", type: "tags" as const },
      { key: "color_ref", label: "Colors", type: "tags" as const },
      { key: "tire_size_ref", label: "Tire Sizes", type: "tags" as const },
      { key: "vehicle_ref", label: "Vehicles", type: "tags" as const },
      { key: "design_style_ref", label: "Design Styles", type: "tags" as const },
    ],
  },
  oem_bolt_patterns: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "bolt_pattern", label: "Bolt Pattern", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
      { key: "updated_at", label: "Updated", type: "date" as const },
    ],
  },
  oem_center_bores: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "center_bore", label: "Center Bore", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
      { key: "updated_at", label: "Updated", type: "date" as const },
    ],
  },
  oem_colors: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "color", label: "Color", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
      { key: "updated_at", label: "Updated", type: "date" as const },
    ],
  },
  oem_diameters: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "diameter", label: "Diameter", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
      { key: "updated_at", label: "Updated", type: "date" as const },
    ],
  },
  oem_widths: {
    columns: [
      { key: "id", label: "ID", type: "number" as const, width: "w-16" },
      { key: "width", label: "Width", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
      { key: "updated_at", label: "Updated", type: "date" as const },
    ],
  },
  users: {
    columns: [
      { key: "id", label: "ID", type: "text" as const, width: "w-32" },
      { key: "avatar_url", label: "Avatar", type: "image" as const, width: "w-20" },
      { key: "email", label: "Email", type: "text" as const },
      { key: "full_name", label: "Name", type: "text" as const },
      { key: "created_at", label: "Created", type: "date" as const },
    ],
  },
};

export function useSupabaseTable(tableName: TableName) {
  const config = TABLE_CONFIGS[tableName];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["table", tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .order("id", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data || [],
    columns: config.columns,
    isLoading,
    error,
    refetch,
  };
}