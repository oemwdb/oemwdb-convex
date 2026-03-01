/**
 * Convex schema — normalized design with junction tables and foreign keys.
 * No v.any() ref fields. Many-to-many via junction tables, many-to-one via id fields.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // =============================================================================
  // REFERENCE / LOOKUP TABLES
  // =============================================================================

  oem_bolt_patterns: defineTable({
    bolt_pattern: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  oem_center_bores: defineTable({
    center_bore: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  oem_colors: defineTable({
    color: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  oem_diameters: defineTable({
    diameter: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  oem_widths: defineTable({
    width: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  tire_sizes: defineTable({
    tire_size: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  cached_timezone_names: defineTable({
    name: v.string(),
    cached_at: v.optional(v.string()),
  }),

  // =============================================================================
  // CORE DOMAIN TABLES
  // =============================================================================

  oem_brands: defineTable({
    id: v.string(), // Business key e.g. "bmw"
    brand_title: v.string(),
    brand_description: v.optional(v.string()),
    brand_image_url: v.optional(v.string()),
    brand_page: v.optional(v.string()),
    subsidiaries: v.optional(v.string()),
    wheel_count: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_business_id", ["id"])
    .index("by_brand_title", ["brand_title"]),

  oem_engines: defineTable({
    id: v.optional(v.string()), // Business id for URL routing
    brand_id: v.id("oem_brands"),
    engine_code: v.string(),
    engine_name: v.optional(v.string()),
    configuration: v.optional(v.string()), // e.g. "V", "Inline", "Flat"
    aspiration: v.optional(v.string()),   // e.g. "Naturally Aspirated", "Turbo"
    displacement_cc: v.optional(v.number()),
    displacement_l: v.optional(v.number()),
    cylinders: v.optional(v.number()),
    fuel_type: v.optional(v.string()),
    power_hp: v.optional(v.number()),
    power_kw: v.optional(v.number()),
    torque_nm: v.optional(v.number()),
    torque_lb_ft: v.optional(v.number()),
    production_years: v.optional(v.string()),
    years_produced: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_brand_id", ["brand_id"])
    .index("by_business_id", ["id"])
    .index("by_engine_code", ["engine_code"]),

  oem_vehicles: defineTable({
    id: v.string(), // Business key e.g. "bmw-e46"
    brand_id: v.id("oem_brands"),
    vehicle_id_only: v.optional(v.string()),
    model_name: v.optional(v.string()),
    vehicle_title: v.optional(v.string()),
    generation: v.optional(v.string()),
    production_years: v.optional(v.string()),
    production_stats: v.optional(v.string()),
    vehicle_image: v.optional(v.string()),
    oem_engine_id: v.optional(v.id("oem_engines")),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_business_id", ["id"])
    .index("by_brand_id", ["brand_id"]),

  vehicle_variants: defineTable({
    vehicle_id: v.id("oem_vehicles"),
    variant_name: v.string(),
    engine_id: v.optional(v.id("oem_engines")),
    trim_level: v.optional(v.string()),
    market: v.optional(v.string()),
    year_from: v.optional(v.number()),
    year_to: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_vehicle_id", ["vehicle_id"]),

  oem_wheels: defineTable({
    id: v.string(), // Business key
    brand_id: v.id("oem_brands"),
    wheel_title: v.string(),
    color: v.optional(v.string()),
    wheel_offset: v.optional(v.string()),
    weight: v.optional(v.string()),
    metal_type: v.optional(v.string()),
    part_numbers: v.optional(v.string()),
    notes: v.optional(v.string()),
    good_pic_url: v.optional(v.string()),
    image_source: v.optional(v.string()),
    uuid: v.optional(v.string()),
    ai_processing_complete: v.optional(v.boolean()),
    design_style_tags: v.optional(v.array(v.string())),
    specifications_json: v.optional(v.string()), // JSON string for flexible specs
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_business_id", ["id"])
    .index("by_brand_id", ["brand_id"]),

  // =============================================================================
  // WHEEL JUNCTION TABLES (many-to-many)
  // =============================================================================

  wheel_vehicles: defineTable({
    wheel_id: v.id("oem_wheels"),
    vehicle_id: v.id("oem_vehicles"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_vehicle", ["vehicle_id"])
    .index("by_wheel_vehicle", ["wheel_id", "vehicle_id"]),

  wheel_bolt_patterns: defineTable({
    wheel_id: v.id("oem_wheels"),
    bolt_pattern_id: v.id("oem_bolt_patterns"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_bolt_pattern", ["bolt_pattern_id"])
    .index("by_wheel_bolt_pattern", ["wheel_id", "bolt_pattern_id"]),

  wheel_diameters: defineTable({
    wheel_id: v.id("oem_wheels"),
    diameter_id: v.id("oem_diameters"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_diameter", ["diameter_id"])
    .index("by_wheel_diameter", ["wheel_id", "diameter_id"]),

  wheel_widths: defineTable({
    wheel_id: v.id("oem_wheels"),
    width_id: v.id("oem_widths"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_width", ["width_id"])
    .index("by_wheel_width", ["wheel_id", "width_id"]),

  wheel_center_bores: defineTable({
    wheel_id: v.id("oem_wheels"),
    center_bore_id: v.id("oem_center_bores"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_center_bore", ["center_bore_id"])
    .index("by_wheel_center_bore", ["wheel_id", "center_bore_id"]),

  wheel_colors: defineTable({
    wheel_id: v.id("oem_wheels"),
    color_id: v.id("oem_colors"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_color", ["color_id"])
    .index("by_wheel_color", ["wheel_id", "color_id"]),

  wheel_tire_sizes: defineTable({
    wheel_id: v.id("oem_wheels"),
    tire_size_id: v.id("tire_sizes"),
  })
    .index("by_wheel", ["wheel_id"])
    .index("by_tire_size", ["tire_size_id"])
    .index("by_wheel_tire_size", ["wheel_id", "tire_size_id"]),

  // =============================================================================
  // USER & AUTH
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

  // =============================================================================
  // USER SAVED ITEMS
  // =============================================================================

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

  // =============================================================================
  // USER CONTENT
  // =============================================================================

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
  })
    .index("by_user", ["user_id"])
    .index("by_linked_vehicle", ["linked_oem_vehicle_id"]),

  market_listings: defineTable({
    user_id: v.string(),
    title: v.string(),
    listing_type: v.string(),
    linked_item_id: v.number(),
    status: v.optional(v.string()),
    condition: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    location: v.optional(v.string()),
    shipping_available: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
    seller_profile_json: v.optional(v.string()), // JSON string
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_status", ["status"]),

  // =============================================================================
  // UI / CONFIG (JSON stored as string to avoid v.any())
  // =============================================================================

  card_mappings: defineTable({
    card_type: v.string(),
    mappings_json: v.string(),
    user_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  custom_card_templates: defineTable({
    template_name: v.string(),
    card_data_json: v.string(),
    field_mappings_json: v.optional(v.string()),
    is_public: v.optional(v.boolean()),
    user_id: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  }),

  page_mappings: defineTable({
    page_type: v.string(),
    mappings_json: v.string(),
    user_id: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_page_user", ["page_type", "user_id"]),

  user_table_preferences: defineTable({
    user_id: v.string(),
    table_name: v.string(),
    column_order_json: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user_table", ["user_id", "table_name"]),

  // =============================================================================
  // COOL BOARD / RATINGS
  // =============================================================================

  cool_board_queue: defineTable({
    item_id: v.string(), // References _id of brand/vehicle/wheel
    item_type: v.string(),
    average_rating: v.optional(v.number()),
    total_ratings: v.optional(v.number()),
    last_shown_at: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  }),

  cool_ratings: defineTable({
    user_id: v.string(),
    item_id: v.string(),
    item_type: v.string(),
    rating: v.number(),
    justification: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_item", ["item_id", "item_type"])
    .index("by_user", ["user_id"]),

  // =============================================================================
  // MEDIA / STORAGE METADATA
  // =============================================================================

  image_crops: defineTable({
    filename: v.string(),
    original_url: v.optional(v.string()),
    cropped_url: v.optional(v.string()),
    crop_settings_json: v.optional(v.string()),
    user_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),

  // =============================================================================
  // LOGGING
  // =============================================================================

  performance_logs: defineTable({
    query_name: v.string(),
    execution_time_ms: v.number(),
    query_params_json: v.optional(v.string()),
    user_id: v.optional(v.string()),
    logged_at: v.optional(v.string()),
  }),

  // =============================================================================
  // TEST TABLES
  // =============================================================================

  test: defineTable({
    created_at: v.optional(v.string()),
  }),

  test5: defineTable({
    created_at: v.optional(v.string()),
  }),
});
