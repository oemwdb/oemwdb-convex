-- Fix Database Script
-- Created: 2025-12-22, Updated: 2025-12-23
-- Purpose: Update bidirectional wheel_ref on vehicles after running seed_data.sql
-- 
-- USAGE: Run this AFTER applying seed_data.sql if wheel_ref on vehicles appears empty
--
-- docker exec -i supabase_db_bclvqqnnyqgzoavgrkke psql -U postgres -d postgres < fix_database.sql

-- ============================================
-- FIX BIDIRECTIONAL wheel_ref ON VEHICLES
-- ============================================
-- This updates each vehicle's wheel_ref JSONB with all wheels that reference it

UPDATE public.oem_vehicles v
SET wheel_ref = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', w.id,
            'title', w.wheel_title
        )
    )
    FROM public.oem_wheels w
    WHERE w.vehicle_ref IS NOT NULL
      AND EXISTS (
          SELECT 1
          FROM jsonb_array_elements(w.vehicle_ref) AS elem
          WHERE elem->>'id' = v.id
      )
);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
    'Vehicles with wheel_ref:' as check, 
    COUNT(*)::text as result 
FROM public.oem_vehicles 
WHERE wheel_ref IS NOT NULL;

