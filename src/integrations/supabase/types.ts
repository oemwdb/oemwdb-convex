export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cached_timezone_names: {
        Row: {
          cached_at: string | null
          name: string
        }
        Insert: {
          cached_at?: string | null
          name: string
        }
        Update: {
          cached_at?: string | null
          name?: string
        }
        Relationships: []
      }
      card_mappings: {
        Row: {
          card_type: string
          created_at: string | null
          id: string
          mappings: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          card_type: string
          created_at?: string | null
          id?: string
          mappings: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          card_type?: string
          created_at?: string | null
          id?: string
          mappings?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cool_board_queue: {
        Row: {
          average_rating: number | null
          created_at: string
          id: string
          item_id: number
          item_type: string
          last_shown_at: string | null
          total_ratings: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          id?: string
          item_id: number
          item_type: string
          last_shown_at?: string | null
          total_ratings?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          id?: string
          item_id?: number
          item_type?: string
          last_shown_at?: string | null
          total_ratings?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cool_ratings: {
        Row: {
          created_at: string
          id: string
          item_id: number
          item_type: string
          justification: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: number
          item_type: string
          justification?: string | null
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: number
          item_type?: string
          justification?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_card_templates: {
        Row: {
          card_data: Json
          created_at: string
          field_mappings: Json | null
          id: string
          is_public: boolean | null
          template_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          card_data: Json
          created_at?: string
          field_mappings?: Json | null
          id?: string
          is_public?: boolean | null
          template_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          card_data?: Json
          created_at?: string
          field_mappings?: Json | null
          id?: string
          is_public?: boolean | null
          template_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      image_crops: {
        Row: {
          created_at: string | null
          crop_settings: Json | null
          cropped_url: string | null
          filename: string
          id: string
          original_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          crop_settings?: Json | null
          cropped_url?: string | null
          filename: string
          id?: string
          original_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          crop_settings?: Json | null
          cropped_url?: string | null
          filename?: string
          id?: string
          original_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      market_listings: {
        Row: {
          condition: string | null
          created_at: string | null
          description: string | null
          documents: string[] | null
          id: string
          images: string[] | null
          linked_item_id: number
          listing_type: string
          location: string | null
          price: number | null
          seller_profile: Json | null
          shipping_available: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          linked_item_id: number
          listing_type: string
          location?: string | null
          price?: number | null
          seller_profile?: Json | null
          shipping_available?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          linked_item_id?: number
          listing_type?: string
          location?: string | null
          price?: number | null
          seller_profile?: Json | null
          shipping_available?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      oem_bolt_patterns: {
        Row: {
          bolt_pattern: string
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          bolt_pattern: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          bolt_pattern?: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      oem_brands: {
        Row: {
          brand_description: string | null
          brand_image_url: string | null
          brand_page: string | null
          brand_title: string
          brand_type_ref: Json | null
          brands_tuned_ref: Json | null
          country_ref: Json | null
          created_at: string | null
          founded_year_ref: Json | null
          headquarters_ref: Json | null
          id: string
          parent_company_ref: Json | null
          specialties_ref: Json | null
          subsidiaries: string | null
          updated_at: string | null
          wheel_count: number | null
        }
        Insert: {
          brand_description?: string | null
          brand_image_url?: string | null
          brand_page?: string | null
          brand_title: string
          brand_type_ref?: Json | null
          brands_tuned_ref?: Json | null
          country_ref?: Json | null
          created_at?: string | null
          founded_year_ref?: Json | null
          headquarters_ref?: Json | null
          id: string
          parent_company_ref?: Json | null
          specialties_ref?: Json | null
          subsidiaries?: string | null
          updated_at?: string | null
          wheel_count?: number | null
        }
        Update: {
          brand_description?: string | null
          brand_image_url?: string | null
          brand_page?: string | null
          brand_title?: string
          brand_type_ref?: Json | null
          brands_tuned_ref?: Json | null
          country_ref?: Json | null
          created_at?: string | null
          founded_year_ref?: Json | null
          headquarters_ref?: Json | null
          id?: string
          parent_company_ref?: Json | null
          specialties_ref?: Json | null
          subsidiaries?: string | null
          updated_at?: string | null
          wheel_count?: number | null
        }
        Relationships: []
      }
      oem_center_bores: {
        Row: {
          center_bore: string
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          center_bore: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          center_bore?: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      oem_colors: {
        Row: {
          brand_ref: Json | null
          color: string
          color_category_ref: Json | null
          color_family_ref: Json | null
          created_at: string | null
          generic_code_ref: Json | null
          hex_code_ref: Json | null
          id: number
          ral_code_ref: Json | null
          related_colors_ref: Json | null
          rgb_code_ref: Json | null
          updated_at: string | null
        }
        Insert: {
          brand_ref?: Json | null
          color: string
          color_category_ref?: Json | null
          color_family_ref?: Json | null
          created_at?: string | null
          generic_code_ref?: Json | null
          hex_code_ref?: Json | null
          id?: number
          ral_code_ref?: Json | null
          related_colors_ref?: Json | null
          rgb_code_ref?: Json | null
          updated_at?: string | null
        }
        Update: {
          brand_ref?: Json | null
          color?: string
          color_category_ref?: Json | null
          color_family_ref?: Json | null
          created_at?: string | null
          generic_code_ref?: Json | null
          hex_code_ref?: Json | null
          id?: number
          ral_code_ref?: Json | null
          related_colors_ref?: Json | null
          rgb_code_ref?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      oem_diameters: {
        Row: {
          created_at: string | null
          diameter: string
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diameter: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diameter?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      oem_vehicles: {
        Row: {
          bolt_pattern_ref: Json | null
          brand_ref: Json | null
          center_bore_ref: Json | null
          color_ref: Json | null
          created_at: string | null
          diameter_ref: Json | null
          generation: string | null
          id: string
          model_name: string | null
          oem_engine_ref: string | null
          production_stats: string | null
          production_years: string | null
          updated_at: string | null
          vehicle_id_only: string | null
          vehicle_image: string | null
          vehicle_title: string | null
          wheel_ref: Json | null
          width_ref: Json | null
        }
        Insert: {
          bolt_pattern_ref?: Json | null
          brand_ref?: Json | null
          center_bore_ref?: Json | null
          color_ref?: Json | null
          created_at?: string | null
          diameter_ref?: Json | null
          generation?: string | null
          id: string
          model_name?: string | null
          oem_engine_ref?: string | null
          production_stats?: string | null
          production_years?: string | null
          updated_at?: string | null
          vehicle_id_only?: string | null
          vehicle_image?: string | null
          vehicle_title?: string | null
          wheel_ref?: Json | null
          width_ref?: Json | null
        }
        Update: {
          bolt_pattern_ref?: Json | null
          brand_ref?: Json | null
          center_bore_ref?: Json | null
          color_ref?: Json | null
          created_at?: string | null
          diameter_ref?: Json | null
          generation?: string | null
          id?: string
          model_name?: string | null
          oem_engine_ref?: string | null
          production_stats?: string | null
          production_years?: string | null
          updated_at?: string | null
          vehicle_id_only?: string | null
          vehicle_image?: string | null
          vehicle_title?: string | null
          wheel_ref?: Json | null
          width_ref?: Json | null
        }
        Relationships: []
      }
      oem_wheels: {
        Row: {
          ai_processing_complete: boolean | null
          bolt_pattern_ref: Json | null
          brand_ref: Json | null
          center_bore_ref: Json | null
          color: string | null
          color_ref: Json | null
          created_at: string | null
          design_style_ref: string[] | null
          diameter_ref: Json | null
          good_pic_url: string | null
          id: string
          image_source: string | null
          metal_type: string | null
          notes: string | null
          part_numbers: string | null
          specifications: Json | null
          tire_size_ref: Json | null
          updated_at: string | null
          uuid: string | null
          vehicle_ref: Json | null
          weight: string | null
          wheel_offset: string | null
          wheel_title: string
          width_ref: Json | null
        }
        Insert: {
          ai_processing_complete?: boolean | null
          bolt_pattern_ref?: Json | null
          brand_ref?: Json | null
          center_bore_ref?: Json | null
          color?: string | null
          color_ref?: Json | null
          created_at?: string | null
          design_style_ref?: string[] | null
          diameter_ref?: Json | null
          good_pic_url?: string | null
          id: string
          image_source?: string | null
          metal_type?: string | null
          notes?: string | null
          part_numbers?: string | null
          specifications?: Json | null
          tire_size_ref?: Json | null
          updated_at?: string | null
          uuid?: string | null
          vehicle_ref?: Json | null
          weight?: string | null
          wheel_offset?: string | null
          wheel_title: string
          width_ref?: Json | null
        }
        Update: {
          ai_processing_complete?: boolean | null
          bolt_pattern_ref?: Json | null
          brand_ref?: Json | null
          center_bore_ref?: Json | null
          color?: string | null
          color_ref?: Json | null
          created_at?: string | null
          design_style_ref?: string[] | null
          diameter_ref?: Json | null
          good_pic_url?: string | null
          id?: string
          image_source?: string | null
          metal_type?: string | null
          notes?: string | null
          part_numbers?: string | null
          specifications?: Json | null
          tire_size_ref?: Json | null
          updated_at?: string | null
          uuid?: string | null
          vehicle_ref?: Json | null
          weight?: string | null
          wheel_offset?: string | null
          wheel_title?: string
          width_ref?: Json | null
        }
        Relationships: []
      }
      oem_widths: {
        Row: {
          created_at: string | null
          id: number
          updated_at: string | null
          width: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          updated_at?: string | null
          width: string
        }
        Update: {
          created_at?: string | null
          id?: number
          updated_at?: string | null
          width?: string
        }
        Relationships: []
      }
      page_mappings: {
        Row: {
          created_at: string
          id: string
          mappings: Json
          page_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mappings: Json
          page_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mappings?: Json
          page_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_logs: {
        Row: {
          execution_time_ms: number
          id: string
          logged_at: string | null
          query_name: string
          query_params: Json | null
          user_id: string | null
        }
        Insert: {
          execution_time_ms: number
          id?: string
          logged_at?: string | null
          query_name: string
          query_params?: Json | null
          user_id?: string | null
        }
        Update: {
          execution_time_ms?: number
          id?: string
          logged_at?: string | null
          query_name?: string
          query_params?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          listing_count: number | null
          location: string | null
          member_since: string | null
          transaction_count: number | null
          updated_at: string | null
          username: string
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          listing_count?: number | null
          location?: string | null
          member_since?: string | null
          transaction_count?: number | null
          updated_at?: string | null
          username: string
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          listing_count?: number | null
          location?: string | null
          member_since?: string | null
          transaction_count?: number | null
          updated_at?: string | null
          username?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      saved_brands: {
        Row: {
          brand_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_brands_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "oem_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_vehicles: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "oem_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_wheels: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          wheel_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          wheel_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          wheel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_wheels_wheel_fkey"
            columns: ["wheel_id"]
            isOneToOne: false
            referencedRelation: "oem_wheels"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      test5: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      tire_sizes: {
        Row: {
          aspect_ratio_ref: Json | null
          construction_ref: Json | null
          created_at: string | null
          diameter_ref: Json | null
          id: number
          performance_class_ref: Json | null
          tire_category_ref: Json | null
          tire_size: string
          updated_at: string | null
          vehicle_type_ref: Json | null
          width_ref: Json | null
        }
        Insert: {
          aspect_ratio_ref?: Json | null
          construction_ref?: Json | null
          created_at?: string | null
          diameter_ref?: Json | null
          id?: number
          performance_class_ref?: Json | null
          tire_category_ref?: Json | null
          tire_size: string
          updated_at?: string | null
          vehicle_type_ref?: Json | null
          width_ref?: Json | null
        }
        Update: {
          aspect_ratio_ref?: Json | null
          construction_ref?: Json | null
          created_at?: string | null
          diameter_ref?: Json | null
          id?: number
          performance_class_ref?: Json | null
          tire_category_ref?: Json | null
          tire_size?: string
          updated_at?: string | null
          vehicle_type_ref?: Json | null
          width_ref?: Json | null
        }
        Relationships: []
      }
      user_registered_vehicles: {
        Row: {
          brand_ref: Json | null
          color: string | null
          created_at: string
          current_value_estimate: number | null
          documents: string[] | null
          id: string
          images: string[] | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_service_date: string | null
          license_plate: string | null
          linked_oem_vehicle_id: string | null
          make: string
          mileage: number
          model: string
          next_service_due: string | null
          notes: string | null
          ownership_status: Database["public"]["Enums"]["ownership_status"]
          purchase_date: string | null
          purchase_price: number | null
          registration_expiry: string | null
          trim: string | null
          updated_at: string
          user_id: string
          vehicle_ref: Json | null
          vehicle_title: string | null
          vin: string
          year: number
        }
        Insert: {
          brand_ref?: Json | null
          color?: string | null
          created_at?: string
          current_value_estimate?: number | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_service_date?: string | null
          license_plate?: string | null
          linked_oem_vehicle_id?: string | null
          make: string
          mileage: number
          model: string
          next_service_due?: string | null
          notes?: string | null
          ownership_status?: Database["public"]["Enums"]["ownership_status"]
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          trim?: string | null
          updated_at?: string
          user_id: string
          vehicle_ref?: Json | null
          vehicle_title?: string | null
          vin: string
          year: number
        }
        Update: {
          brand_ref?: Json | null
          color?: string | null
          created_at?: string
          current_value_estimate?: number | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_service_date?: string | null
          license_plate?: string | null
          linked_oem_vehicle_id?: string | null
          make?: string
          mileage?: number
          model?: string
          next_service_due?: string | null
          notes?: string | null
          ownership_status?: Database["public"]["Enums"]["ownership_status"]
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          trim?: string | null
          updated_at?: string
          user_id?: string
          vehicle_ref?: Json | null
          vehicle_title?: string | null
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_linked_vehicle"
            columns: ["linked_oem_vehicle_id"]
            isOneToOne: false
            referencedRelation: "oem_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_table_preferences: {
        Row: {
          column_order: Json
          created_at: string
          id: string
          table_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          column_order: Json
          created_at?: string
          id?: string
          table_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          column_order?: Json
          created_at?: string
          id?: string
          table_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          vehicle_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          vehicle_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_comments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "oem_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_column: {
        Args: { column_name: string; column_type?: string; table_name: string }
        Returns: undefined
      }
      add_standard_reference: {
        Args: { ref_id: number; ref_value: string; refs_column: Json }
        Returns: Json
      }
      add_wheel_vehicle_compatibility: {
        Args: {
          p_chassis_code: string
          p_is_oem?: boolean
          p_notes?: string
          p_wheel_name: string
        }
        Returns: boolean
      }
      create_table: {
        Args: { columns: Json; table_name: string }
        Returns: undefined
      }
      delete_column: {
        Args: { column_name: string; table_name: string }
        Returns: undefined
      }
      extract_ref_values: {
        Args: { field?: string; refs: Json }
        Returns: string[]
      }
      generate_slug: { Args: { text_input: string }; Returns: string }
      get_available_vehicles: {
        Args: never
        Returns: {
          brand_refs: Json
          chassis_code: string
          id: number
          model_name: string
          vehicle_title: string
        }[]
      }
      get_brand_vehicle_count: {
        Args: { brand_name_param: string }
        Returns: number
      }
      get_brands_paginated: {
        Args: {
          page_offset?: number
          page_size?: number
          requesting_user_id?: string
        }
        Returns: {
          brand_image_url: string
          brand_title: string
          created_at: string
          id: string
          is_saved: boolean
          total_count: number
          wheel_count: number
        }[]
      }
      get_standard_reference_ids: {
        Args: { refs_column: Json }
        Returns: number[]
      }
      get_standard_reference_values: {
        Args: { refs_column: Json }
        Returns: string[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_saved_vehicles: {
        Args: {
          page_offset?: number
          page_size?: number
          requesting_user_id: string
        }
        Returns: {
          brand_ref: Json
          comment_count: number
          hero_image_url: string
          id: string
          model_name: string
          production_years: string
          saved_at: string
          total_count: number
          vehicle_title: string
        }[]
      }
      get_vehicles_by_brand: {
        Args: { brand_name_param: string }
        Returns: {
          bolt_pattern: string
          brand_name: string
          center_bore: string
          chassis_code: string
          hero_image_url: string
          id: string
          model_name: string
          production_years: string
          status: string
        }[]
      }
      get_vehicles_paginated: {
        Args: {
          filter_brand_id?: string
          page_offset?: number
          page_size?: number
          requesting_user_id?: string
          search_query?: string
        }
        Returns: {
          brand_ref: Json
          comment_count: number
          created_at: string
          hero_image_url: string
          id: string
          is_saved: boolean
          model_name: string
          production_years: string
          total_count: number
          vehicle_title: string
        }[]
      }
      get_vehicles_with_brands: {
        Args: never
        Returns: {
          bolt_pattern: string
          brand_id: string
          brand_name: string
          center_bore: string
          chassis_code: string
          id: string
          model_name: string
          production_years: string
          status: string
          vehicle_image: string
          vehicle_title: string
        }[]
      }
      get_wheel_compatibility_stats: {
        Args: { p_wheel_id: number }
        Returns: {
          aftermarket_fitments: number
          oem_fitments: number
          total_vehicles: number
        }[]
      }
      get_wheel_complete: {
        Args: { wheel_id_param: number }
        Returns: {
          brand_info: Json
          compatible_vehicles: Json
          wheel_info: Json
        }[]
      }
      get_wheels_by_brand: {
        Args: { brand_name_param: string }
        Returns: {
          bolt_pattern: string
          brand_name: string
          center_bore: string
          color: string
          diameter: string
          good_pic_url: string
          id: string
          status: string
          wheel_name: string
          wheel_offset: string
          width: string
        }[]
      }
      get_wheels_paginated: {
        Args: {
          filter_brand_id?: string
          filter_diameter?: string
          page_offset?: number
          page_size?: number
          requesting_user_id?: string
        }
        Returns: {
          brand_ref: Json
          created_at: string
          diameter_ref: Json
          good_pic_url: string
          id: string
          is_saved: boolean
          total_count: number
          wheel_title: string
          width_ref: Json
        }[]
      }
      get_wheels_with_brands: {
        Args: never
        Returns: {
          bolt_pattern: string
          bolt_pattern_ref: Json
          brand_name: string
          brand_ref: Json
          center_bore: string
          center_bore_ref: Json
          color: string
          color_ref: Json
          design_style_ref: string[]
          diameter: string
          diameter_ref: Json
          good_pic_url: string
          id: string
          status: string
          tire_size_ref: Json
          vehicle_ref: Json
          wheel_name: string
          wheel_offset: string
          width: string
          width_ref: Json
        }[]
      }
      get_wheels_without_vehicle_refs: {
        Args: never
        Returns: {
          brand_refs: Json
          vehicle_refs: Json
          wheel_code: string
          wheel_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_standard_reference: {
        Args: { ref_id: number; refs_column: Json }
        Returns: boolean
      }
      log_slow_query: {
        Args: {
          execution_time_ms: number
          query_name: string
          query_params?: Json
          user_id?: string
        }
        Returns: undefined
      }
      refresh_timezone_cache: { Args: never; Returns: undefined }
      remove_standard_reference: {
        Args: { ref_id: number; refs_column: Json }
        Returns: Json
      }
      rename_column: {
        Args: { new_name: string; old_name: string; table_name: string }
        Returns: undefined
      }
      search_wheels: {
        Args: {
          search_bolt_pattern?: string
          search_brand?: string
          search_diameter?: string
          search_width?: string
        }
        Returns: {
          bolt_pattern: string
          brand_name: string
          center_bore: string
          diameter: string
          good_pic_url: string
          id: number
          status: string
          wheel_name: string
          width: string
        }[]
      }
      update_brand_wheel_count: {
        Args: { brand_id_param: number; brand_uuid_param: string }
        Returns: undefined
      }
      vehicle_refs_summary: {
        Args: never
        Returns: {
          total_wheels: number
          wheels_with_refs: number
          wheels_without_refs: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      ownership_status: "owned" | "leased" | "financed" | "sold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      ownership_status: ["owned", "leased", "financed", "sold"],
    },
  },
} as const
