import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const allDatabaseTableNames = [
  "oem_bolt_patterns",
  "oem_center_bores",
  "oem_diameters",
  "oem_widths",
  "oem_offsets",
  "oem_color_families",
  "oem_colors",
  "tire_sizes",
  "oem_part_numbers",
  "oem_materials",
  "oem_finish_types",
  "oem_design_styles",
  "oem_markets",
  "oem_body_styles",
  "oem_drive_types",
  "oem_fuel_types",
  "oem_aspiration_types",
  "oem_brands",
  "oem_engines",
  "oem_engine_variants",
  "oem_vehicles",
  "oem_vehicle_variants",
  "oem_wheels",
  "oem_wheel_variants",
  "profiles",
  "user_roles",
  "user_table_preferences",
  "admin_table_selector_layouts",
  "admin_item_page_layouts",
  "saved_brands",
  "saved_vehicles",
  "saved_wheels",
  "vehicle_comments",
  "engine_comments",
  "wheel_comments",
  "brand_comments",
  "user_registered_vehicles",
  "admin_logs",
  "admin_dashboard_snapshots",
  "j_vehicle_brand",
  "j_wheel_brand",
  "j_engine_brand",
  "j_oem_vehicle_variant_brand",
  "j_vehicle_engine",
  "j_oem_vehicle_variant_engine",
  "j_oem_vehicle_variant_engine_variant",
  "j_vehicle_body_style",
  "j_oem_vehicle_variant_body_style",
  "j_vehicle_drive_type",
  "j_oem_vehicle_variant_drive_type",
  "j_vehicle_market",
  "j_oem_vehicle_variant_market",
  "j_wheel_market",
  "j_oem_wheel_variant_market",
  "j_part_number_market",
  "j_wheel_vehicle",
  "j_oem_vehicle_variant_wheel_variant",
  "j_wheel_bolt_pattern",
  "j_wheel_center_bore",
  "j_wheel_diameter",
  "j_wheel_width",
  "j_wheel_offset",
  "j_wheel_color",
  "j_wheel_tire_size",
  "j_wheel_part_number",
  "j_wheel_material",
  "j_wheel_finish_type",
  "j_wheel_design_style",
  "j_vehicle_bolt_pattern",
  "j_vehicle_center_bore",
  "j_vehicle_diameter",
  "j_vehicle_width",
  "j_vehicle_offset",
  "j_vehicle_color",
  "j_vehicle_tire_size",
  "j_vehicle_part_number",
  "j_oem_vehicle_variant_bolt_pattern",
  "j_oem_vehicle_variant_center_bore",
  "j_oem_vehicle_variant_diameter",
  "j_oem_vehicle_variant_width",
  "j_oem_vehicle_variant_offset",
  "j_oem_vehicle_variant_color",
  "j_oem_vehicle_variant_tire_size",
  "j_oem_vehicle_variant_part_number",
  "j_oem_wheel_variant_bolt_pattern",
  "j_oem_wheel_variant_center_bore",
  "j_oem_wheel_variant_diameter",
  "j_oem_wheel_variant_width",
  "j_oem_wheel_variant_offset",
  "j_oem_wheel_variant_color",
  "j_oem_wheel_variant_tire_size",
  "j_oem_wheel_variant_part_number",
  "j_oem_wheel_variant_material",
  "j_oem_wheel_variant_finish_type",
  "j_oem_wheel_variant_design_style",
  "j_engine_fuel_type",
  "j_engine_aspiration",
  "j_engine_part_number",
  "j_registered_vehicle_wheel",
  "j_registered_vehicle_wheel_variant",
  "ws_944racing_wheels",
  "ws_944racing_wheel_variants",
  "ws_944racing_vehicles",
  "ws_944racing_vehicle_variants",
  "ws_944racing_brands",
  "ws_944racing_junction_vehicles_wheels",
  "ws_alfa_romeo_wheels",
  "ws_alfa_romeo_wheel_variants",
  "ws_alfa_romeo_vehicles",
  "ws_alfa_romeo_vehicle_variants",
  "ws_alfa_romeo_brands",
  "ws_alfa_romeo_junction_vehicles_wheels",
  "ws_audi_wheels",
  "ws_audi_wheel_variants",
  "ws_audi_vehicles",
  "ws_audi_vehicle_variants",
  "ws_audi_brands",
  "ws_audi_junction_vehicles_wheels",
  "ws_ferrari_wheels",
  "ws_ferrari_wheel_variants",
  "ws_ferrari_vehicles",
  "ws_ferrari_vehicle_variants",
  "ws_ferrari_brands",
  "ws_ferrari_junction_vehicles_wheels",
  "ws_fiat_wheels",
  "ws_fiat_wheel_variants",
  "ws_fiat_vehicles",
  "ws_fiat_vehicle_variants",
  "ws_fiat_brands",
  "ws_fiat_junction_vehicles_wheels",
  "ws_jaguar_wheels",
  "ws_jaguar_wheel_variants",
  "ws_jaguar_vehicles",
  "ws_jaguar_vehicle_variants",
  "ws_jaguar_brands",
  "ws_jaguar_junction_vehicles_wheels",
  "ws_lamborghini_wheels",
  "ws_lamborghini_wheel_variants",
  "ws_lamborghini_vehicles",
  "ws_lamborghini_vehicle_variants",
  "ws_lamborghini_brands",
  "ws_lamborghini_junction_vehicles_wheels",
  "ws_land_rover_wheels",
  "ws_land_rover_wheel_variants",
  "ws_land_rover_vehicles",
  "ws_land_rover_vehicle_variants",
  "ws_land_rover_brands",
  "ws_land_rover_junction_vehicles_wheels",
  "ws_mercedes_wheels",
  "ws_mercedes_wheel_variants",
  "ws_mercedes_vehicles",
  "ws_mercedes_vehicle_variants",
  "ws_mercedes_brands",
  "ws_mercedes_junction_vehicles_wheels",
  "ws_porsche_wheels",
  "ws_porsche_wheel_variants",
  "ws_porsche_vehicles",
  "ws_porsche_vehicle_variants",
  "ws_porsche_brands",
  "ws_porsche_junction_vehicles_wheels",
  "ws_vw_wheels",
  "ws_vw_wheel_variants",
  "ws_vw_vehicles",
  "ws_vw_vehicle_variants",
  "ws_vw_brands",
  "ws_vw_junction_vehicles_wheels",
  "ws_audi_chassis_groups",
  "ws_audi_chassis_group_urls",
  "ws_alfa_romeo_models",
  "ws_alfa_romeo_variants",
  "ws_fiat_models",
  "ws_fiat_variants",
  "market_listings",
  "market_listing_promotions",
  "oem_brand_images",
  "oem_vehicle_images",
  "oem_wheel_images",
  "oem_wheel_variant_images",
  "oem_file_storage",
] as const;

export type DatabaseTableName = (typeof allDatabaseTableNames)[number];

export function isDatabaseTableName(value: string): value is DatabaseTableName {
  return (allDatabaseTableNames as readonly string[]).includes(value);
}

export const databaseTableNameValidator = v.union(
  ...allDatabaseTableNames.map((tableName) => v.literal(tableName))
);

export async function collectDatabaseTableRows(ctx: any, tableName: DatabaseTableName) {
  switch (tableName) {
    case "oem_bolt_patterns": return await ctx.db.query("oem_bolt_patterns").collect();
    case "oem_center_bores": return await ctx.db.query("oem_center_bores").collect();
    case "oem_diameters": return await ctx.db.query("oem_diameters").collect();
    case "oem_widths": return await ctx.db.query("oem_widths").collect();
    case "oem_offsets": return await ctx.db.query("oem_offsets").collect();
    case "oem_color_families": return await ctx.db.query("oem_color_families").collect();
    case "oem_colors": return await ctx.db.query("oem_colors").collect();
    case "tire_sizes": return await ctx.db.query("tire_sizes").collect();
    case "oem_part_numbers": return await ctx.db.query("oem_part_numbers").collect();
    case "oem_materials": return await ctx.db.query("oem_materials").collect();
    case "oem_finish_types": return await ctx.db.query("oem_finish_types").collect();
    case "oem_design_styles": return await ctx.db.query("oem_design_styles").collect();
    case "oem_markets": return await ctx.db.query("oem_markets").collect();
    case "oem_body_styles": return await ctx.db.query("oem_body_styles").collect();
    case "oem_drive_types": return await ctx.db.query("oem_drive_types").collect();
    case "oem_fuel_types": return await ctx.db.query("oem_fuel_types").collect();
    case "oem_aspiration_types": return await ctx.db.query("oem_aspiration_types").collect();
    case "oem_brands": return await ctx.db.query("oem_brands").collect();
    case "oem_engines": return await ctx.db.query("oem_engines").collect();
    case "oem_engine_variants": return await ctx.db.query("oem_engine_variants").collect();
    case "oem_vehicles": return await ctx.db.query("oem_vehicles").collect();
    case "oem_vehicle_variants": return await ctx.db.query("oem_vehicle_variants").collect();
    case "oem_wheels": return await ctx.db.query("oem_wheels").collect();
    case "oem_wheel_variants": return await ctx.db.query("oem_wheel_variants").collect();
    case "profiles": return await ctx.db.query("profiles").collect();
    case "user_roles": return await ctx.db.query("user_roles").collect();
    case "user_table_preferences": return await ctx.db.query("user_table_preferences").collect();
    case "admin_table_selector_layouts": return await ctx.db.query("admin_table_selector_layouts").collect();
    case "admin_item_page_layouts": return await ctx.db.query("admin_item_page_layouts").collect();
    case "saved_brands": return await ctx.db.query("saved_brands").collect();
    case "saved_vehicles": return await ctx.db.query("saved_vehicles").collect();
    case "saved_wheels": return await ctx.db.query("saved_wheels").collect();
    case "vehicle_comments": return await ctx.db.query("vehicle_comments").collect();
    case "engine_comments": return await ctx.db.query("engine_comments").collect();
    case "wheel_comments": return await ctx.db.query("wheel_comments").collect();
    case "brand_comments": return await ctx.db.query("brand_comments").collect();
    case "user_registered_vehicles": return await ctx.db.query("user_registered_vehicles").collect();
    case "admin_logs": return await ctx.db.query("admin_logs").collect();
    case "admin_dashboard_snapshots": return await ctx.db.query("admin_dashboard_snapshots").collect();
    case "j_vehicle_brand": return await ctx.db.query("j_vehicle_brand").collect();
    case "j_wheel_brand": return await ctx.db.query("j_wheel_brand").collect();
    case "j_engine_brand": return await ctx.db.query("j_engine_brand").collect();
    case "j_oem_vehicle_variant_brand": return await ctx.db.query("j_oem_vehicle_variant_brand").collect();
    case "j_vehicle_engine": return await ctx.db.query("j_vehicle_engine").collect();
    case "j_oem_vehicle_variant_engine": return await ctx.db.query("j_oem_vehicle_variant_engine").collect();
    case "j_oem_vehicle_variant_engine_variant": return await ctx.db.query("j_oem_vehicle_variant_engine_variant").collect();
    case "j_vehicle_body_style": return await ctx.db.query("j_vehicle_body_style").collect();
    case "j_oem_vehicle_variant_body_style": return await ctx.db.query("j_oem_vehicle_variant_body_style").collect();
    case "j_vehicle_drive_type": return await ctx.db.query("j_vehicle_drive_type").collect();
    case "j_oem_vehicle_variant_drive_type": return await ctx.db.query("j_oem_vehicle_variant_drive_type").collect();
    case "j_vehicle_market": return await ctx.db.query("j_vehicle_market").collect();
    case "j_oem_vehicle_variant_market": return await ctx.db.query("j_oem_vehicle_variant_market").collect();
    case "j_wheel_market": return await ctx.db.query("j_wheel_market").collect();
    case "j_oem_wheel_variant_market": return await ctx.db.query("j_oem_wheel_variant_market").collect();
    case "j_part_number_market": return await ctx.db.query("j_part_number_market").collect();
    case "j_wheel_vehicle": return await ctx.db.query("j_wheel_vehicle").collect();
    case "j_oem_vehicle_variant_wheel_variant": return await ctx.db.query("j_oem_vehicle_variant_wheel_variant").collect();
    case "j_wheel_bolt_pattern": return await ctx.db.query("j_wheel_bolt_pattern").collect();
    case "j_wheel_center_bore": return await ctx.db.query("j_wheel_center_bore").collect();
    case "j_wheel_diameter": return await ctx.db.query("j_wheel_diameter").collect();
    case "j_wheel_width": return await ctx.db.query("j_wheel_width").collect();
    case "j_wheel_offset": return await ctx.db.query("j_wheel_offset").collect();
    case "j_wheel_color": return await ctx.db.query("j_wheel_color").collect();
    case "j_wheel_tire_size": return await ctx.db.query("j_wheel_tire_size").collect();
    case "j_wheel_part_number": return await ctx.db.query("j_wheel_part_number").collect();
    case "j_wheel_material": return await ctx.db.query("j_wheel_material").collect();
    case "j_wheel_finish_type": return await ctx.db.query("j_wheel_finish_type").collect();
    case "j_wheel_design_style": return await ctx.db.query("j_wheel_design_style").collect();
    case "j_vehicle_bolt_pattern": return await ctx.db.query("j_vehicle_bolt_pattern").collect();
    case "j_vehicle_center_bore": return await ctx.db.query("j_vehicle_center_bore").collect();
    case "j_vehicle_diameter": return await ctx.db.query("j_vehicle_diameter").collect();
    case "j_vehicle_width": return await ctx.db.query("j_vehicle_width").collect();
    case "j_vehicle_offset": return await ctx.db.query("j_vehicle_offset").collect();
    case "j_vehicle_color": return await ctx.db.query("j_vehicle_color").collect();
    case "j_vehicle_tire_size": return await ctx.db.query("j_vehicle_tire_size").collect();
    case "j_vehicle_part_number": return await ctx.db.query("j_vehicle_part_number").collect();
    case "j_oem_vehicle_variant_bolt_pattern": return await ctx.db.query("j_oem_vehicle_variant_bolt_pattern").collect();
    case "j_oem_vehicle_variant_center_bore": return await ctx.db.query("j_oem_vehicle_variant_center_bore").collect();
    case "j_oem_vehicle_variant_diameter": return await ctx.db.query("j_oem_vehicle_variant_diameter").collect();
    case "j_oem_vehicle_variant_width": return await ctx.db.query("j_oem_vehicle_variant_width").collect();
    case "j_oem_vehicle_variant_offset": return await ctx.db.query("j_oem_vehicle_variant_offset").collect();
    case "j_oem_vehicle_variant_color": return await ctx.db.query("j_oem_vehicle_variant_color").collect();
    case "j_oem_vehicle_variant_tire_size": return await ctx.db.query("j_oem_vehicle_variant_tire_size").collect();
    case "j_oem_vehicle_variant_part_number": return await ctx.db.query("j_oem_vehicle_variant_part_number").collect();
    case "j_oem_wheel_variant_bolt_pattern": return await ctx.db.query("j_oem_wheel_variant_bolt_pattern").collect();
    case "j_oem_wheel_variant_center_bore": return await ctx.db.query("j_oem_wheel_variant_center_bore").collect();
    case "j_oem_wheel_variant_diameter": return await ctx.db.query("j_oem_wheel_variant_diameter").collect();
    case "j_oem_wheel_variant_width": return await ctx.db.query("j_oem_wheel_variant_width").collect();
    case "j_oem_wheel_variant_offset": return await ctx.db.query("j_oem_wheel_variant_offset").collect();
    case "j_oem_wheel_variant_color": return await ctx.db.query("j_oem_wheel_variant_color").collect();
    case "j_oem_wheel_variant_tire_size": return await ctx.db.query("j_oem_wheel_variant_tire_size").collect();
    case "j_oem_wheel_variant_part_number": return await ctx.db.query("j_oem_wheel_variant_part_number").collect();
    case "j_oem_wheel_variant_material": return await ctx.db.query("j_oem_wheel_variant_material").collect();
    case "j_oem_wheel_variant_finish_type": return await ctx.db.query("j_oem_wheel_variant_finish_type").collect();
    case "j_oem_wheel_variant_design_style": return await ctx.db.query("j_oem_wheel_variant_design_style").collect();
    case "j_engine_fuel_type": return await ctx.db.query("j_engine_fuel_type").collect();
    case "j_engine_aspiration": return await ctx.db.query("j_engine_aspiration").collect();
    case "j_engine_part_number": return await ctx.db.query("j_engine_part_number").collect();
    case "j_registered_vehicle_wheel": return await ctx.db.query("j_registered_vehicle_wheel").collect();
    case "j_registered_vehicle_wheel_variant": return await ctx.db.query("j_registered_vehicle_wheel_variant").collect();
    case "ws_944racing_wheels": return await ctx.db.query("ws_944racing_wheels").collect();
    case "ws_944racing_wheel_variants": return await ctx.db.query("ws_944racing_wheel_variants").collect();
    case "ws_944racing_vehicles": return await ctx.db.query("ws_944racing_vehicles").collect();
    case "ws_944racing_vehicle_variants": return await ctx.db.query("ws_944racing_vehicle_variants").collect();
    case "ws_944racing_brands": return await ctx.db.query("ws_944racing_brands").collect();
    case "ws_944racing_junction_vehicles_wheels": return await ctx.db.query("ws_944racing_junction_vehicles_wheels").collect();
    case "ws_alfa_romeo_wheels": return await ctx.db.query("ws_alfa_romeo_wheels").collect();
    case "ws_alfa_romeo_wheel_variants": return await ctx.db.query("ws_alfa_romeo_wheel_variants").collect();
    case "ws_alfa_romeo_vehicles": return await ctx.db.query("ws_alfa_romeo_vehicles").collect();
    case "ws_alfa_romeo_vehicle_variants": return await ctx.db.query("ws_alfa_romeo_vehicle_variants").collect();
    case "ws_alfa_romeo_brands": return await ctx.db.query("ws_alfa_romeo_brands").collect();
    case "ws_alfa_romeo_junction_vehicles_wheels": return await ctx.db.query("ws_alfa_romeo_junction_vehicles_wheels").collect();
    case "ws_audi_wheels": return await ctx.db.query("ws_audi_wheels").collect();
    case "ws_audi_wheel_variants": return await ctx.db.query("ws_audi_wheel_variants").collect();
    case "ws_audi_vehicles": return await ctx.db.query("ws_audi_vehicles").collect();
    case "ws_audi_vehicle_variants": return await ctx.db.query("ws_audi_vehicle_variants").collect();
    case "ws_audi_brands": return await ctx.db.query("ws_audi_brands").collect();
    case "ws_audi_junction_vehicles_wheels": return await ctx.db.query("ws_audi_junction_vehicles_wheels").collect();
    case "ws_ferrari_wheels": return await ctx.db.query("ws_ferrari_wheels").collect();
    case "ws_ferrari_wheel_variants": return await ctx.db.query("ws_ferrari_wheel_variants").collect();
    case "ws_ferrari_vehicles": return await ctx.db.query("ws_ferrari_vehicles").collect();
    case "ws_ferrari_vehicle_variants": return await ctx.db.query("ws_ferrari_vehicle_variants").collect();
    case "ws_ferrari_brands": return await ctx.db.query("ws_ferrari_brands").collect();
    case "ws_ferrari_junction_vehicles_wheels": return await ctx.db.query("ws_ferrari_junction_vehicles_wheels").collect();
    case "ws_fiat_wheels": return await ctx.db.query("ws_fiat_wheels").collect();
    case "ws_fiat_wheel_variants": return await ctx.db.query("ws_fiat_wheel_variants").collect();
    case "ws_fiat_vehicles": return await ctx.db.query("ws_fiat_vehicles").collect();
    case "ws_fiat_vehicle_variants": return await ctx.db.query("ws_fiat_vehicle_variants").collect();
    case "ws_fiat_brands": return await ctx.db.query("ws_fiat_brands").collect();
    case "ws_fiat_junction_vehicles_wheels": return await ctx.db.query("ws_fiat_junction_vehicles_wheels").collect();
    case "ws_jaguar_wheels": return await ctx.db.query("ws_jaguar_wheels").collect();
    case "ws_jaguar_wheel_variants": return await ctx.db.query("ws_jaguar_wheel_variants").collect();
    case "ws_jaguar_vehicles": return await ctx.db.query("ws_jaguar_vehicles").collect();
    case "ws_jaguar_vehicle_variants": return await ctx.db.query("ws_jaguar_vehicle_variants").collect();
    case "ws_jaguar_brands": return await ctx.db.query("ws_jaguar_brands").collect();
    case "ws_jaguar_junction_vehicles_wheels": return await ctx.db.query("ws_jaguar_junction_vehicles_wheels").collect();
    case "ws_lamborghini_wheels": return await ctx.db.query("ws_lamborghini_wheels").collect();
    case "ws_lamborghini_wheel_variants": return await ctx.db.query("ws_lamborghini_wheel_variants").collect();
    case "ws_lamborghini_vehicles": return await ctx.db.query("ws_lamborghini_vehicles").collect();
    case "ws_lamborghini_vehicle_variants": return await ctx.db.query("ws_lamborghini_vehicle_variants").collect();
    case "ws_lamborghini_brands": return await ctx.db.query("ws_lamborghini_brands").collect();
    case "ws_lamborghini_junction_vehicles_wheels": return await ctx.db.query("ws_lamborghini_junction_vehicles_wheels").collect();
    case "ws_land_rover_wheels": return await ctx.db.query("ws_land_rover_wheels").collect();
    case "ws_land_rover_wheel_variants": return await ctx.db.query("ws_land_rover_wheel_variants").collect();
    case "ws_land_rover_vehicles": return await ctx.db.query("ws_land_rover_vehicles").collect();
    case "ws_land_rover_vehicle_variants": return await ctx.db.query("ws_land_rover_vehicle_variants").collect();
    case "ws_land_rover_brands": return await ctx.db.query("ws_land_rover_brands").collect();
    case "ws_land_rover_junction_vehicles_wheels": return await ctx.db.query("ws_land_rover_junction_vehicles_wheels").collect();
    case "ws_mercedes_wheels": return await ctx.db.query("ws_mercedes_wheels").collect();
    case "ws_mercedes_wheel_variants": return await ctx.db.query("ws_mercedes_wheel_variants").collect();
    case "ws_mercedes_vehicles": return await ctx.db.query("ws_mercedes_vehicles").collect();
    case "ws_mercedes_vehicle_variants": return await ctx.db.query("ws_mercedes_vehicle_variants").collect();
    case "ws_mercedes_brands": return await ctx.db.query("ws_mercedes_brands").collect();
    case "ws_mercedes_junction_vehicles_wheels": return await ctx.db.query("ws_mercedes_junction_vehicles_wheels").collect();
    case "ws_porsche_wheels": return await ctx.db.query("ws_porsche_wheels").collect();
    case "ws_porsche_wheel_variants": return await ctx.db.query("ws_porsche_wheel_variants").collect();
    case "ws_porsche_vehicles": return await ctx.db.query("ws_porsche_vehicles").collect();
    case "ws_porsche_vehicle_variants": return await ctx.db.query("ws_porsche_vehicle_variants").collect();
    case "ws_porsche_brands": return await ctx.db.query("ws_porsche_brands").collect();
    case "ws_porsche_junction_vehicles_wheels": return await ctx.db.query("ws_porsche_junction_vehicles_wheels").collect();
    case "ws_vw_wheels": return await ctx.db.query("ws_vw_wheels").collect();
    case "ws_vw_wheel_variants": return await ctx.db.query("ws_vw_wheel_variants").collect();
    case "ws_vw_vehicles": return await ctx.db.query("ws_vw_vehicles").collect();
    case "ws_vw_vehicle_variants": return await ctx.db.query("ws_vw_vehicle_variants").collect();
    case "ws_vw_brands": return await ctx.db.query("ws_vw_brands").collect();
    case "ws_vw_junction_vehicles_wheels": return await ctx.db.query("ws_vw_junction_vehicles_wheels").collect();
    case "ws_audi_chassis_groups": return await ctx.db.query("ws_audi_chassis_groups").collect();
    case "ws_audi_chassis_group_urls": return await ctx.db.query("ws_audi_chassis_group_urls").collect();
    case "ws_alfa_romeo_models": return await ctx.db.query("ws_alfa_romeo_models").collect();
    case "ws_alfa_romeo_variants": return await ctx.db.query("ws_alfa_romeo_variants").collect();
    case "ws_fiat_models": return await ctx.db.query("ws_fiat_models").collect();
    case "ws_fiat_variants": return await ctx.db.query("ws_fiat_variants").collect();
    case "market_listings": return await ctx.db.query("market_listings").collect();
    case "market_listing_promotions": return await ctx.db.query("market_listing_promotions").collect();
    case "oem_brand_images": return await ctx.db.query("oem_brand_images").collect();
    case "oem_vehicle_images": return await ctx.db.query("oem_vehicle_images").collect();
    case "oem_wheel_images": return await ctx.db.query("oem_wheel_images").collect();
    case "oem_wheel_variant_images": return await ctx.db.query("oem_wheel_variant_images").collect();
    case "oem_file_storage": return await ctx.db.query("oem_file_storage").collect();
  }
}

export async function patchDatabaseTableRow(
  ctx: any,
  tableName: DatabaseTableName,
  id: string,
  patch: Record<string, unknown>
) {
  switch (tableName) {
    case "oem_bolt_patterns": return await ctx.db.patch(id as any, patch);
    case "oem_center_bores": return await ctx.db.patch(id as any, patch);
    case "oem_diameters": return await ctx.db.patch(id as any, patch);
    case "oem_widths": return await ctx.db.patch(id as any, patch);
    case "oem_offsets": return await ctx.db.patch(id as any, patch);
    case "oem_color_families": return await ctx.db.patch(id as any, patch);
    case "oem_colors": return await ctx.db.patch(id as any, patch);
    case "tire_sizes": return await ctx.db.patch(id as any, patch);
    case "oem_part_numbers": return await ctx.db.patch(id as any, patch);
    case "oem_materials": return await ctx.db.patch(id as any, patch);
    case "oem_finish_types": return await ctx.db.patch(id as any, patch);
    case "oem_design_styles": return await ctx.db.patch(id as any, patch);
    case "oem_markets": return await ctx.db.patch(id as any, patch);
    case "oem_body_styles": return await ctx.db.patch(id as any, patch);
    case "oem_drive_types": return await ctx.db.patch(id as any, patch);
    case "oem_fuel_types": return await ctx.db.patch(id as any, patch);
    case "oem_aspiration_types": return await ctx.db.patch(id as any, patch);
    case "oem_brands": return await ctx.db.patch(id as any, patch);
    case "oem_engines": return await ctx.db.patch(id as any, patch);
    case "oem_engine_variants": return await ctx.db.patch(id as any, patch);
    case "oem_vehicles": return await ctx.db.patch(id as any, patch);
    case "oem_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "oem_wheels": return await ctx.db.patch(id as any, patch);
    case "oem_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "profiles": return await ctx.db.patch(id as any, patch);
    case "user_roles": return await ctx.db.patch(id as any, patch);
    case "user_table_preferences": return await ctx.db.patch(id as any, patch);
    case "admin_table_selector_layouts": return await ctx.db.patch(id as any, patch);
    case "admin_item_page_layouts": return await ctx.db.patch(id as any, patch);
    case "saved_brands": return await ctx.db.patch(id as any, patch);
    case "saved_vehicles": return await ctx.db.patch(id as any, patch);
    case "saved_wheels": return await ctx.db.patch(id as any, patch);
    case "vehicle_comments": return await ctx.db.patch(id as any, patch);
    case "engine_comments": return await ctx.db.patch(id as any, patch);
    case "wheel_comments": return await ctx.db.patch(id as any, patch);
    case "brand_comments": return await ctx.db.patch(id as any, patch);
    case "user_registered_vehicles": return await ctx.db.patch(id as any, patch);
    case "admin_logs": return await ctx.db.patch(id as any, patch);
    case "admin_dashboard_snapshots": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_brand": return await ctx.db.patch(id as any, patch);
    case "j_wheel_brand": return await ctx.db.patch(id as any, patch);
    case "j_engine_brand": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_brand": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_engine": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_engine": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_engine_variant": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_body_style": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_body_style": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_drive_type": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_drive_type": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_market": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_market": return await ctx.db.patch(id as any, patch);
    case "j_wheel_market": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_market": return await ctx.db.patch(id as any, patch);
    case "j_part_number_market": return await ctx.db.patch(id as any, patch);
    case "j_wheel_vehicle": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_wheel_variant": return await ctx.db.patch(id as any, patch);
    case "j_wheel_bolt_pattern": return await ctx.db.patch(id as any, patch);
    case "j_wheel_center_bore": return await ctx.db.patch(id as any, patch);
    case "j_wheel_diameter": return await ctx.db.patch(id as any, patch);
    case "j_wheel_width": return await ctx.db.patch(id as any, patch);
    case "j_wheel_offset": return await ctx.db.patch(id as any, patch);
    case "j_wheel_color": return await ctx.db.patch(id as any, patch);
    case "j_wheel_tire_size": return await ctx.db.patch(id as any, patch);
    case "j_wheel_part_number": return await ctx.db.patch(id as any, patch);
    case "j_wheel_material": return await ctx.db.patch(id as any, patch);
    case "j_wheel_finish_type": return await ctx.db.patch(id as any, patch);
    case "j_wheel_design_style": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_bolt_pattern": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_center_bore": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_diameter": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_width": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_offset": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_color": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_tire_size": return await ctx.db.patch(id as any, patch);
    case "j_vehicle_part_number": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_bolt_pattern": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_center_bore": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_diameter": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_width": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_offset": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_color": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_tire_size": return await ctx.db.patch(id as any, patch);
    case "j_oem_vehicle_variant_part_number": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_bolt_pattern": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_center_bore": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_diameter": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_width": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_offset": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_color": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_tire_size": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_part_number": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_material": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_finish_type": return await ctx.db.patch(id as any, patch);
    case "j_oem_wheel_variant_design_style": return await ctx.db.patch(id as any, patch);
    case "j_engine_fuel_type": return await ctx.db.patch(id as any, patch);
    case "j_engine_aspiration": return await ctx.db.patch(id as any, patch);
    case "j_engine_part_number": return await ctx.db.patch(id as any, patch);
    case "j_registered_vehicle_wheel": return await ctx.db.patch(id as any, patch);
    case "j_registered_vehicle_wheel_variant": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_brands": return await ctx.db.patch(id as any, patch);
    case "ws_944racing_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_brands": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_audi_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_audi_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_audi_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_audi_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_audi_brands": return await ctx.db.patch(id as any, patch);
    case "ws_audi_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_brands": return await ctx.db.patch(id as any, patch);
    case "ws_ferrari_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_brands": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_brands": return await ctx.db.patch(id as any, patch);
    case "ws_jaguar_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_brands": return await ctx.db.patch(id as any, patch);
    case "ws_lamborghini_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_brands": return await ctx.db.patch(id as any, patch);
    case "ws_land_rover_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_brands": return await ctx.db.patch(id as any, patch);
    case "ws_mercedes_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_brands": return await ctx.db.patch(id as any, patch);
    case "ws_porsche_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_vw_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_vw_wheel_variants": return await ctx.db.patch(id as any, patch);
    case "ws_vw_vehicles": return await ctx.db.patch(id as any, patch);
    case "ws_vw_vehicle_variants": return await ctx.db.patch(id as any, patch);
    case "ws_vw_brands": return await ctx.db.patch(id as any, patch);
    case "ws_vw_junction_vehicles_wheels": return await ctx.db.patch(id as any, patch);
    case "ws_audi_chassis_groups": return await ctx.db.patch(id as any, patch);
    case "ws_audi_chassis_group_urls": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_models": return await ctx.db.patch(id as any, patch);
    case "ws_alfa_romeo_variants": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_models": return await ctx.db.patch(id as any, patch);
    case "ws_fiat_variants": return await ctx.db.patch(id as any, patch);
    case "market_listings": return await ctx.db.patch(id as any, patch);
    case "market_listing_promotions": return await ctx.db.patch(id as any, patch);
    case "oem_brand_images": return await ctx.db.patch(id as any, patch);
    case "oem_vehicle_images": return await ctx.db.patch(id as any, patch);
    case "oem_wheel_images": return await ctx.db.patch(id as any, patch);
    case "oem_wheel_variant_images": return await ctx.db.patch(id as any, patch);
    case "oem_file_storage": return await ctx.db.patch(id as any, patch);
  }
}

export async function insertDatabaseTableRow(
  ctx: any,
  tableName: DatabaseTableName,
  value: Record<string, unknown>
) {
  const sanitizedValue = Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  );
  return await ctx.db.insert(tableName as any, sanitizedValue as any);
}

export async function deleteDatabaseTableRows(
  ctx: any,
  _tableName: DatabaseTableName,
  ids: string[]
) {
  for (const id of ids) {
    await ctx.db.delete(id as any);
  }
  return ids;
}
