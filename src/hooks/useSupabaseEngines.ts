import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface SupabaseEngine {
  id: string;
  engine_code: string;
  engine_name: string | null;
  brand_ref: string | null;
  displacement_cc: number | null;
  displacement_l: number | null;
  cylinders: number | null;
  configuration: string | null;
  aspiration: string | null;
  power_hp: number | null;
  power_kw: number | null;
  torque_nm: number | null;
  torque_lb_ft: number | null;
  fuel_type: string | null;
  production_years: string | null;
  vehicle_ref: unknown;
  notes: string | null;
}

function mapEngine(doc: {
  _id: unknown;
  id?: string | null;
  engine_code: string;
  engine_name?: string | null;
  displacement_cc?: number | null;
  displacement_l?: number | null;
  cylinders?: number | null;
  configuration?: string | null;
  aspiration?: string | null;
  power_hp?: number | null;
  power_kw?: number | null;
  torque_nm?: number | null;
  torque_lb_ft?: number | null;
  fuel_type?: string | null;
  production_years?: string | null;
  years_produced?: string | null;
  notes?: string | null;
}): SupabaseEngine {
  return {
    id: doc.id ?? String(doc._id),
    engine_code: doc.engine_code,
    engine_name: doc.engine_name ?? null,
    brand_ref: null,
    displacement_cc: doc.displacement_cc ?? null,
    displacement_l: doc.displacement_l ?? null,
    cylinders: doc.cylinders ?? null,
    configuration: doc.configuration ?? null,
    aspiration: doc.aspiration ?? null,
    power_hp: doc.power_hp ?? null,
    power_kw: doc.power_kw ?? null,
    torque_nm: doc.torque_nm ?? null,
    torque_lb_ft: doc.torque_lb_ft ?? null,
    fuel_type: doc.fuel_type ?? null,
    production_years: doc.production_years ?? doc.years_produced ?? null,
    vehicle_ref: null,
    notes: doc.notes ?? null,
  };
}

export function useSupabaseEngines() {
  const raw = useQuery(api.queries.enginesGetAll);
  const data = raw?.map(mapEngine) ?? [];
  const isLoading = raw === undefined;
  const isError = false;
  return { data, isLoading, isError, error: null };
}
