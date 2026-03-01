/**
 * Convex schema — Pass 1 of 4: Reference tables and Core entities only.
 * No junction tables. No user tables.
 * Naming: slug (URL id), [entity]_title (display name), by_slug / by_[entity]_title indexes.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // =============================================================================
  // REFERENCE TABLES (16)
  // =============================================================================

  oem_bolt_patterns: defineTable({
    bolt_pattern: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_bolt_pattern", ["bolt_pattern"]),

  oem_center_bores: defineTable({
    center_bore: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_center_bore", ["center_bore"]),

  oem_diameters: defineTable({
    diameter: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_diameter", ["diameter"]),

  oem_widths: defineTable({
    width: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_width", ["width"]),

  oem_offsets: defineTable({
    offset: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_offset", ["offset"]),

  oem_colors: defineTable({
    color: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_color", ["color"]),

  tire_sizes: defineTable({
    tire_size: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_tire_size", ["tire_size"]),

  oem_part_numbers: defineTable({
    part_number: v.string(),
    superseded_by: v.optional(v.string()),
    is_current: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_part_number", ["part_number"]),

  oem_materials: defineTable({
    material: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_material", ["material"]),

  oem_finish_types: defineTable({
    finish_type: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_finish_type", ["finish_type"]),

  oem_design_styles: defineTable({
    design_style: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_design_style", ["design_style"]),

  oem_markets: defineTable({
    market: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_market", ["market"]),

  oem_body_styles: defineTable({
    body_style: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_body_style", ["body_style"]),

  oem_drive_types: defineTable({
    drive_type: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_drive_type", ["drive_type"]),

  oem_fuel_types: defineTable({
    fuel_type: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_fuel_type", ["fuel_type"]),

  oem_aspiration_types: defineTable({
    aspiration_type: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_aspiration_type", ["aspiration_type"]),

  // =============================================================================
  // CORE ENTITIES
  // =============================================================================

  oem_brands: defineTable({
    slug: v.optional(v.string()),
    brand_title: v.optional(v.string()),
    brand_description: v.optional(v.string()),
    brand_image_url: v.optional(v.string()),
    brand_page: v.optional(v.string()),
    subsidiaries: v.optional(v.string()),
    good_pic_url: v.optional(v.string()),
    bad_pic_url: v.optional(v.string()),
    country_of_origin: v.optional(v.string()),
    founded_year: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    id: v.optional(v.string()),
    wheel_count: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_brand_title", ["brand_title"]),

  oem_engines: defineTable({
    slug: v.optional(v.string()),
    engine_title: v.optional(v.string()),
    engine_code: v.optional(v.string()),
    configuration: v.optional(v.string()),
    displacement_cc: v.optional(v.number()),
    displacement_l: v.optional(v.number()),
    cylinders: v.optional(v.number()),
    power_hp: v.optional(v.number()),
    power_kw: v.optional(v.number()),
    torque_nm: v.optional(v.number()),
    torque_lb_ft: v.optional(v.number()),
    compression_ratio: v.optional(v.string()),
    engine_layout: v.optional(v.string()),
    production_years: v.optional(v.string()),
    notes: v.optional(v.string()),
    id: v.optional(v.string()),
    brand_id: v.optional(v.id("oem_brands")),
    years_produced: v.optional(v.string()),
    fuel_type: v.optional(v.string()),
    aspiration: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_engine_code", ["engine_code"]),

  oem_vehicles: defineTable({
    slug: v.optional(v.string()),
    vehicle_title: v.optional(v.string()),
    model_name: v.optional(v.string()),
    generation: v.optional(v.string()),
    production_years: v.optional(v.string()),
    year_from: v.optional(v.number()),
    year_to: v.optional(v.number()),
    production_stats: v.optional(v.string()),
    good_pic_url: v.optional(v.string()),
    bad_pic_url: v.optional(v.string()),
    wheelbase_mm: v.optional(v.number()),
    platform_code: v.optional(v.string()),
    is_visible: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    id: v.optional(v.string()),
    brand_id: v.optional(v.id("oem_brands")),
    oem_engine_id: v.optional(v.id("oem_engines")),
    vehicle_image: v.optional(v.string()),
    text_brands: v.optional(v.string()),
    text_widths: v.optional(v.string()),
    text_diameters: v.optional(v.string()),
    text_bolt_patterns: v.optional(v.string()),
    text_center_bores: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_vehicle_title", ["vehicle_title"]),

  vehicle_variants: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    slug: v.optional(v.string()),
    variant_title: v.optional(v.string()),
    trim_level: v.optional(v.string()),
    year_from: v.optional(v.number()),
    year_to: v.optional(v.number()),
    vin_pattern: v.optional(v.string()),
    door_count: v.optional(v.number()),
    seat_count: v.optional(v.number()),
    weight_kg: v.optional(v.number()),
    top_speed_kmh: v.optional(v.number()),
    acceleration_0_100: v.optional(v.number()),
    good_pic_url: v.optional(v.string()),
    bad_pic_url: v.optional(v.string()),
    notes: v.optional(v.string()),
    engine_id: v.optional(v.id("oem_engines")),
    market: v.optional(v.string()),
  })
    .index("by_vehicle_id", ["vehicle_id"])
    .index("by_slug", ["slug"]),

  oem_wheels: defineTable({
    slug: v.optional(v.string()),
    wheel_title: v.optional(v.string()),
    weight: v.optional(v.string()),
    spoke_count: v.optional(v.number()),
    load_rating: v.optional(v.number()),
    is_oem: v.optional(v.boolean()),
    metal_type: v.optional(v.string()),
    part_numbers: v.optional(v.string()),
    notes: v.optional(v.string()),
    good_pic_url: v.optional(v.string()),
    bad_pic_url: v.optional(v.string()),
    image_source: v.optional(v.string()),
    uuid: v.optional(v.string()),
    ai_processing_complete: v.optional(v.boolean()),
    specifications_json: v.optional(v.string()),
    is_visible: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    id: v.optional(v.string()),
    brand_id: v.optional(v.id("oem_brands")),
    color: v.optional(v.string()),
    wheel_offset: v.optional(v.string()),
    design_style_tags: v.optional(v.array(v.string())),
    text_brands: v.optional(v.string()),
    text_widths: v.optional(v.string()),
    text_diameters: v.optional(v.string()),
    text_bolt_patterns: v.optional(v.string()),
    text_center_bores: v.optional(v.string()),
    text_colors: v.optional(v.string()),
    text_offsets: v.optional(v.string()),
    text_tire_sizes: v.optional(v.string()),
    text_vehicles: v.optional(v.string()),
    style_number: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_wheel_title", ["wheel_title"]),

  wheel_variants: defineTable({
    wheel_id: v.id("oem_wheels"),
    slug: v.optional(v.string()),
    variant_title: v.optional(v.string()),
    wheel_title: v.optional(v.string()),
    weight: v.optional(v.string()),
    spoke_count: v.optional(v.number()),
    load_rating: v.optional(v.number()),
    metal_type: v.optional(v.string()),
    part_numbers: v.optional(v.string()),
    notes: v.optional(v.string()),
    good_pic_url: v.optional(v.string()),
    bad_pic_url: v.optional(v.string()),
    year_from: v.optional(v.number()),
    year_to: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_wheel_id", ["wheel_id"])
    .index("by_slug", ["slug"]),

  // =============================================================================
  // USER TABLES (Pass 2 of 4)
  // =============================================================================

  users: defineTable({
    id: v.string(),
    email: v.string(),
    full_name: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  profiles: defineTable({
    id: v.string(),
    username: v.string(),
    display_name: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    member_since: v.optional(v.string()),
    listing_count: v.optional(v.number()),
    transaction_count: v.optional(v.number()),
    verification_status: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_username", ["username"]),

  user_roles: defineTable({
    user_id: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    created_at: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  user_table_preferences: defineTable({
    user_id: v.string(),
    table_name: v.string(),
    column_order_json: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user_table", ["user_id", "table_name"]),

  saved_brands: defineTable({
    user_id: v.string(),
    brand_id: v.id("oem_brands"),
    created_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_brand", ["brand_id"])
    .index("by_user_brand", ["user_id", "brand_id"]),

  saved_vehicles: defineTable({
    user_id: v.string(),
    vehicle_id: v.id("oem_vehicles"),
    created_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_vehicle", ["vehicle_id"])
    .index("by_user_vehicle", ["user_id", "vehicle_id"]),

  saved_wheels: defineTable({
    user_id: v.string(),
    wheel_id: v.id("oem_wheels"),
    created_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_wheel", ["wheel_id"])
    .index("by_user_wheel", ["user_id", "wheel_id"]),

  vehicle_comments: defineTable({
    user_id: v.string(),
    vehicle_id: v.id("oem_vehicles"),
    comment_text: v.string(),
    tag: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_user", ["user_id"]),

  user_registered_vehicles: defineTable({
    user_id: v.string(),
    vin: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    mileage: v.number(),
    trim: v.optional(v.string()),
    color: v.optional(v.string()),
    vehicle_title: v.optional(v.string()),
    ownership_status: v.union(
      v.literal("owned"),
      v.literal("leased"),
      v.literal("financed"),
      v.literal("sold")
    ),
    purchase_date: v.optional(v.string()),
    purchase_price: v.optional(v.number()),
    current_value_estimate: v.optional(v.number()),
    license_plate: v.optional(v.string()),
    insurance_provider: v.optional(v.string()),
    insurance_policy_number: v.optional(v.string()),
    registration_expiry: v.optional(v.string()),
    last_service_date: v.optional(v.string()),
    next_service_due: v.optional(v.string()),
    notes: v.optional(v.string()),
    linked_oem_vehicle_id: v.optional(v.id("oem_vehicles")),
    brand_id: v.optional(v.id("oem_brands")),
    images: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
    created_at: v.string(),
    updated_at: v.string(),
    current_mileage: v.optional(v.number()),
    purchase_mileage: v.optional(v.number()),
    modification_notes: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_linked_vehicle", ["linked_oem_vehicle_id"]),

  admin_logs: defineTable({
    user_id: v.string(),
    action: v.string(),
    table_name: v.string(),
    record_id: v.optional(v.string()),
    old_value_json: v.optional(v.string()),
    new_value_json: v.optional(v.string()),
    created_at: v.string(),
  }).index("by_user", ["user_id"]),

  // =============================================================================
  // JUNCTION TABLES (Pass 3 of 4) — Brand, Engine, Body style, Drive type, Market, Core fitment
  // =============================================================================

  j_vehicle_brand: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    brand_id: v.id("oem_brands"),
    vehicle_title: v.string(),
    brand_title: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_brand", ["brand_id"])
    .index("by_vehicle_brand", ["vehicle_id", "brand_id"]),

  j_wheel_brand: defineTable({
    wheel_id: v.id("oem_wheels"),
    brand_id: v.id("oem_brands"),
    wheel_title: v.string(),
    brand_title: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_brand", ["brand_id"])
    .index("by_wheel_brand", ["wheel_id", "brand_id"]),

  j_engine_brand: defineTable({
    engine_id: v.id("oem_engines"),
    brand_id: v.id("oem_brands"),
    engine_code: v.string(),
    brand_title: v.string(),
  })
    .index("by_engine", ["engine_id"])
    .index("by_brand", ["brand_id"])
    .index("by_engine_brand", ["engine_id", "brand_id"]),

  j_vehicle_variant_brand: defineTable({
    variant_id: v.id("vehicle_variants"),
    brand_id: v.id("oem_brands"),
    variant_title: v.string(),
    brand_title: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_brand", ["brand_id"])
    .index("by_vehicle_variant_brand", ["variant_id", "brand_id"]),

  j_vehicle_engine: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    engine_id: v.id("oem_engines"),
    vehicle_title: v.string(),
    engine_code: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_engine", ["engine_id"])
    .index("by_vehicle_engine", ["vehicle_id", "engine_id"]),

  j_vehicle_variant_engine: defineTable({
    variant_id: v.id("vehicle_variants"),
    engine_id: v.id("oem_engines"),
    variant_title: v.string(),
    engine_code: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_engine", ["engine_id"])
    .index("by_vehicle_variant_engine", ["variant_id", "engine_id"]),

  j_vehicle_body_style: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    body_style_id: v.id("oem_body_styles"),
    vehicle_title: v.string(),
    body_style: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_body_style", ["body_style_id"])
    .index("by_vehicle_body_style", ["vehicle_id", "body_style_id"]),

  j_vehicle_variant_body_style: defineTable({
    variant_id: v.id("vehicle_variants"),
    body_style_id: v.id("oem_body_styles"),
    variant_title: v.string(),
    body_style: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_body_style", ["body_style_id"])
    .index("by_vehicle_variant_body_style", ["variant_id", "body_style_id"]),

  j_vehicle_drive_type: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    drive_type_id: v.id("oem_drive_types"),
    vehicle_title: v.string(),
    drive_type: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_drive_type", ["drive_type_id"])
    .index("by_vehicle_drive_type", ["vehicle_id", "drive_type_id"]),

  j_vehicle_variant_drive_type: defineTable({
    variant_id: v.id("vehicle_variants"),
    drive_type_id: v.id("oem_drive_types"),
    variant_title: v.string(),
    drive_type: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_drive_type", ["drive_type_id"])
    .index("by_vehicle_variant_drive_type", ["variant_id", "drive_type_id"]),

  j_vehicle_market: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    market_id: v.id("oem_markets"),
    vehicle_title: v.string(),
    market: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_market", ["market_id"])
    .index("by_vehicle_market", ["vehicle_id", "market_id"]),

  j_vehicle_variant_market: defineTable({
    variant_id: v.id("vehicle_variants"),
    market_id: v.id("oem_markets"),
    variant_title: v.string(),
    market: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_market", ["market_id"])
    .index("by_vehicle_variant_market", ["variant_id", "market_id"]),

  j_wheel_market: defineTable({
    wheel_id: v.id("oem_wheels"),
    market_id: v.id("oem_markets"),
    wheel_title: v.string(),
    market: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_market", ["market_id"])
    .index("by_wheel_market", ["wheel_id", "market_id"]),

  j_wheel_variant_market: defineTable({
    variant_id: v.id("wheel_variants"),
    market_id: v.id("oem_markets"),
    variant_title: v.string(),
    market: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_market", ["market_id"])
    .index("by_wheel_variant_market", ["variant_id", "market_id"]),

  j_part_number_market: defineTable({
    part_number_id: v.id("oem_part_numbers"),
    market_id: v.id("oem_markets"),
    part_number: v.string(),
    market: v.string(),
  })
    .index("by_part_number", ["part_number_id"])
    .index("by_market", ["market_id"])
    .index("by_part_number_market", ["part_number_id", "market_id"]),

  j_wheel_vehicle: defineTable({
    wheel_id: v.id("oem_wheels"),
    vehicle_id: v.id("oem_vehicles"),
    wheel_title: v.string(),
    vehicle_title: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_vehicle", ["vehicle_id"])
    .index("by_wheel_vehicle", ["wheel_id", "vehicle_id"]),

  j_vehicle_variant_wheel_variant: defineTable({
    vehicle_variant_id: v.id("vehicle_variants"),
    wheel_variant_id: v.id("wheel_variants"),
    variant_title: v.string(),
    wheel_variant_title: v.string(),
  })
    .index("by_vehicle_variant", ["vehicle_variant_id"])
    .index("by_wheel_variant", ["wheel_variant_id"])
    .index("by_vehicle_variant_wheel_variant", ["vehicle_variant_id", "wheel_variant_id"]),

  // =============================================================================
  // JUNCTION TABLES (Pass 4 of 4) — Measurement junctions
  // =============================================================================

  j_wheel_bolt_pattern: defineTable({
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
    wheel_title: v.string(),
    bolt_pattern: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_bolt_pattern", ["bolt_pattern_id"])
    .index("by_wheel_bolt_pattern", ["wheel_id", "bolt_pattern_id"]),

  j_wheel_center_bore: defineTable({
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
    wheel_title: v.string(),
    center_bore: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_center_bore", ["center_bore_id"])
    .index("by_wheel_center_bore", ["wheel_id", "center_bore_id"]),

  j_wheel_diameter: defineTable({
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
    wheel_title: v.string(),
    diameter: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_diameter", ["diameter_id"])
    .index("by_wheel_diameter", ["wheel_id", "diameter_id"]),

  j_wheel_width: defineTable({
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
    wheel_title: v.string(),
    width: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_width", ["width_id"])
    .index("by_wheel_width", ["wheel_id", "width_id"]),

  j_wheel_offset: defineTable({
    wheel_id: v.id("oem_wheels"),
    offset_id: v.id("oem_offsets"),
    wheel_title: v.string(),
    offset: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_offset", ["offset_id"])
    .index("by_wheel_offset", ["wheel_id", "offset_id"]),

  j_wheel_color: defineTable({
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
    wheel_title: v.string(),
    color: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_color", ["color_id"])
    .index("by_wheel_color", ["wheel_id", "color_id"]),

  j_wheel_tire_size: defineTable({
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
    wheel_title: v.string(),
    tire_size: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_tire_size", ["tire_size_id"])
    .index("by_wheel_tire_size", ["wheel_id", "tire_size_id"]),

  j_wheel_part_number: defineTable({
    wheel_id: v.id("oem_wheels"),
    part_number_id: v.id("oem_part_numbers"),
    wheel_title: v.string(),
    part_number: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_part_number", ["part_number_id"])
    .index("by_wheel_part_number", ["wheel_id", "part_number_id"]),

  j_wheel_material: defineTable({
    wheel_id: v.id("oem_wheels"),
    material_id: v.id("oem_materials"),
    wheel_title: v.string(),
    material: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_material", ["material_id"])
    .index("by_wheel_material", ["wheel_id", "material_id"]),

  j_wheel_finish_type: defineTable({
    wheel_id: v.id("oem_wheels"),
    finish_type_id: v.id("oem_finish_types"),
    wheel_title: v.string(),
    finish_type: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_finish_type", ["finish_type_id"])
    .index("by_wheel_finish_type", ["wheel_id", "finish_type_id"]),

  j_wheel_design_style: defineTable({
    wheel_id: v.id("oem_wheels"),
    design_style_id: v.id("oem_design_styles"),
    wheel_title: v.string(),
    design_style: v.string(),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_design_style", ["design_style_id"])
    .index("by_wheel_design_style", ["wheel_id", "design_style_id"]),

  j_vehicle_bolt_pattern: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
    vehicle_title: v.string(),
    bolt_pattern: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_bolt_pattern", ["bolt_pattern_id"])
    .index("by_vehicle_bolt_pattern", ["vehicle_id", "bolt_pattern_id"]),

  j_vehicle_center_bore: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    center_bore_id: v.id("oem_center_bores"),
    vehicle_title: v.string(),
    center_bore: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_center_bore", ["center_bore_id"])
    .index("by_vehicle_center_bore", ["vehicle_id", "center_bore_id"]),

  j_vehicle_diameter: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    diameter_id: v.id("oem_diameters"),
    vehicle_title: v.string(),
    diameter: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_diameter", ["diameter_id"])
    .index("by_vehicle_diameter", ["vehicle_id", "diameter_id"]),

  j_vehicle_width: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    width_id: v.id("oem_widths"),
    vehicle_title: v.string(),
    width: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_width", ["width_id"])
    .index("by_vehicle_width", ["vehicle_id", "width_id"]),

  j_vehicle_offset: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    offset_id: v.id("oem_offsets"),
    vehicle_title: v.string(),
    offset: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_offset", ["offset_id"])
    .index("by_vehicle_offset", ["vehicle_id", "offset_id"]),

  j_vehicle_tire_size: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    tire_size_id: v.id("tire_sizes"),
    vehicle_title: v.string(),
    tire_size: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_tire_size", ["tire_size_id"])
    .index("by_vehicle_tire_size", ["vehicle_id", "tire_size_id"]),

  j_vehicle_part_number: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    part_number_id: v.id("oem_part_numbers"),
    vehicle_title: v.string(),
    part_number: v.string(),
  })
    .index("by_vehicle", ["vehicle_id"])
    .index("by_part_number", ["part_number_id"])
    .index("by_vehicle_part_number", ["vehicle_id", "part_number_id"]),

  j_vehicle_variant_bolt_pattern: defineTable({
    variant_id: v.id("vehicle_variants"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
    variant_title: v.string(),
    bolt_pattern: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_bolt_pattern", ["bolt_pattern_id"])
    .index("by_vehicle_variant_bolt_pattern", ["variant_id", "bolt_pattern_id"]),

  j_vehicle_variant_center_bore: defineTable({
    variant_id: v.id("vehicle_variants"),
    center_bore_id: v.id("oem_center_bores"),
    variant_title: v.string(),
    center_bore: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_center_bore", ["center_bore_id"])
    .index("by_vehicle_variant_center_bore", ["variant_id", "center_bore_id"]),

  j_vehicle_variant_diameter: defineTable({
    variant_id: v.id("vehicle_variants"),
    diameter_id: v.id("oem_diameters"),
    variant_title: v.string(),
    diameter: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_diameter", ["diameter_id"])
    .index("by_vehicle_variant_diameter", ["variant_id", "diameter_id"]),

  j_vehicle_variant_width: defineTable({
    variant_id: v.id("vehicle_variants"),
    width_id: v.id("oem_widths"),
    variant_title: v.string(),
    width: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_width", ["width_id"])
    .index("by_vehicle_variant_width", ["variant_id", "width_id"]),

  j_vehicle_variant_offset: defineTable({
    variant_id: v.id("vehicle_variants"),
    offset_id: v.id("oem_offsets"),
    variant_title: v.string(),
    offset: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_offset", ["offset_id"])
    .index("by_vehicle_variant_offset", ["variant_id", "offset_id"]),

  j_vehicle_variant_tire_size: defineTable({
    variant_id: v.id("vehicle_variants"),
    tire_size_id: v.id("tire_sizes"),
    variant_title: v.string(),
    tire_size: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_tire_size", ["tire_size_id"])
    .index("by_vehicle_variant_tire_size", ["variant_id", "tire_size_id"]),

  j_vehicle_variant_part_number: defineTable({
    variant_id: v.id("vehicle_variants"),
    part_number_id: v.id("oem_part_numbers"),
    variant_title: v.string(),
    part_number: v.string(),
  })
    .index("by_vehicle_variant", ["variant_id"])
    .index("by_part_number", ["part_number_id"])
    .index("by_vehicle_variant_part_number", ["variant_id", "part_number_id"]),

  j_wheel_variant_bolt_pattern: defineTable({
    variant_id: v.id("wheel_variants"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
    variant_title: v.string(),
    bolt_pattern: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_bolt_pattern", ["bolt_pattern_id"])
    .index("by_wheel_variant_bolt_pattern", ["variant_id", "bolt_pattern_id"]),

  j_wheel_variant_center_bore: defineTable({
    variant_id: v.id("wheel_variants"),
    center_bore_id: v.id("oem_center_bores"),
    variant_title: v.string(),
    center_bore: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_center_bore", ["center_bore_id"])
    .index("by_wheel_variant_center_bore", ["variant_id", "center_bore_id"]),

  j_wheel_variant_diameter: defineTable({
    variant_id: v.id("wheel_variants"),
    diameter_id: v.id("oem_diameters"),
    variant_title: v.string(),
    diameter: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_diameter", ["diameter_id"])
    .index("by_wheel_variant_diameter", ["variant_id", "diameter_id"]),

  j_wheel_variant_width: defineTable({
    variant_id: v.id("wheel_variants"),
    width_id: v.id("oem_widths"),
    variant_title: v.string(),
    width: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_width", ["width_id"])
    .index("by_wheel_variant_width", ["variant_id", "width_id"]),

  j_wheel_variant_offset: defineTable({
    variant_id: v.id("wheel_variants"),
    offset_id: v.id("oem_offsets"),
    variant_title: v.string(),
    offset: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_offset", ["offset_id"])
    .index("by_wheel_variant_offset", ["variant_id", "offset_id"]),

  j_wheel_variant_color: defineTable({
    variant_id: v.id("wheel_variants"),
    color_id: v.id("oem_colors"),
    variant_title: v.string(),
    color: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_color", ["color_id"])
    .index("by_wheel_variant_color", ["variant_id", "color_id"]),

  j_wheel_variant_tire_size: defineTable({
    variant_id: v.id("wheel_variants"),
    tire_size_id: v.id("tire_sizes"),
    variant_title: v.string(),
    tire_size: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_tire_size", ["tire_size_id"])
    .index("by_wheel_variant_tire_size", ["variant_id", "tire_size_id"]),

  j_wheel_variant_part_number: defineTable({
    variant_id: v.id("wheel_variants"),
    part_number_id: v.id("oem_part_numbers"),
    variant_title: v.string(),
    part_number: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_part_number", ["part_number_id"])
    .index("by_wheel_variant_part_number", ["variant_id", "part_number_id"]),

  j_wheel_variant_material: defineTable({
    variant_id: v.id("wheel_variants"),
    material_id: v.id("oem_materials"),
    variant_title: v.string(),
    material: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_material", ["material_id"])
    .index("by_wheel_variant_material", ["variant_id", "material_id"]),

  j_wheel_variant_finish_type: defineTable({
    variant_id: v.id("wheel_variants"),
    finish_type_id: v.id("oem_finish_types"),
    variant_title: v.string(),
    finish_type: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_finish_type", ["finish_type_id"])
    .index("by_wheel_variant_finish_type", ["variant_id", "finish_type_id"]),

  j_wheel_variant_design_style: defineTable({
    variant_id: v.id("wheel_variants"),
    design_style_id: v.id("oem_design_styles"),
    variant_title: v.string(),
    design_style: v.string(),
  })
    .index("by_wheel_variant", ["variant_id"])
    .index("by_design_style", ["design_style_id"])
    .index("by_wheel_variant_design_style", ["variant_id", "design_style_id"]),

  j_engine_fuel_type: defineTable({
    engine_id: v.id("oem_engines"),
    fuel_type_id: v.id("oem_fuel_types"),
    engine_code: v.string(),
    fuel_type: v.string(),
  })
    .index("by_engine", ["engine_id"])
    .index("by_fuel_type", ["fuel_type_id"])
    .index("by_engine_fuel_type", ["engine_id", "fuel_type_id"]),

  j_engine_aspiration: defineTable({
    engine_id: v.id("oem_engines"),
    aspiration_id: v.id("oem_aspiration_types"),
    engine_code: v.string(),
    aspiration_type: v.string(),
  })
    .index("by_engine", ["engine_id"])
    .index("by_aspiration", ["aspiration_id"])
    .index("by_engine_aspiration", ["engine_id", "aspiration_id"]),

  j_engine_part_number: defineTable({
    engine_id: v.id("oem_engines"),
    part_number_id: v.id("oem_part_numbers"),
    engine_code: v.string(),
    part_number: v.string(),
  })
    .index("by_engine", ["engine_id"])
    .index("by_part_number", ["part_number_id"])
    .index("by_engine_part_number", ["engine_id", "part_number_id"]),

  j_registered_vehicle_wheel: defineTable({
    registered_vehicle_id: v.id("user_registered_vehicles"),
    wheel_id: v.id("oem_wheels"),
    vehicle_title: v.string(),
    wheel_title: v.string(),
  })
    .index("by_registered_vehicle", ["registered_vehicle_id"])
    .index("by_wheel", ["wheel_id"])
    .index("by_registered_vehicle_wheel", ["registered_vehicle_id", "wheel_id"]),

  j_registered_vehicle_wheel_variant: defineTable({
    registered_vehicle_id: v.id("user_registered_vehicles"),
    wheel_variant_id: v.id("wheel_variants"),
    vehicle_title: v.string(),
    variant_title: v.string(),
  })
    .index("by_registered_vehicle", ["registered_vehicle_id"])
    .index("by_wheel_variant", ["wheel_variant_id"])
    .index("by_registered_vehicle_wheel_variant", ["registered_vehicle_id", "wheel_variant_id"]),
});
