export interface VehicleVariantEngineLayers {
  engine_title?: string | null;
  engine_code?: string | null;
  engine_display_title?: string | null;
  engine_family_label?: string | null;
  fuel_type?: string | null;
  aspiration?: string | null;
  displacement_l?: number | null;
  power_hp?: number | null;
  power_kw?: number | null;
  configuration?: string | null;
  engine_layout?: string | null;
  cylinders?: number | null;
  engine_variant_title?: string | null;
  engine_variant_code?: string | null;
  powertrain_designation?: string | null;
  engine_variant_displacement_l?: number | null;
  engine_variant_power_hp?: number | null;
  engine_variant_power_kw?: number | null;
  engine_variant_fuel_type?: string | null;
  engine_variant_aspiration?: string | null;
  engine_variant_electrification?: string | null;
  electrification?: string | null;
}

const normalizeText = (value?: string | null) =>
  value?.replace(/\s+/g, " ").trim() ?? "";

const uniqueText = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeText(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
};

const formatPower = (hp?: number | null, kw?: number | null) => {
  if (hp) return `${hp} hp`;
  if (kw) return `${kw} kW`;
  return null;
};

const formatDisplacement = (liters?: number | null) => {
  if (liters == null || liters <= 0) return null;
  return `${liters}L`;
};

const getFamilyIdentity = (engine: VehicleVariantEngineLayers) =>
  uniqueText([
    engine.engine_display_title,
    engine.engine_family_label,
    engine.engine_title,
    engine.engine_code,
  ]);

const getExactIdentity = (engine: VehicleVariantEngineLayers) =>
  uniqueText([
    engine.engine_variant_code,
    engine.powertrain_designation,
    engine.engine_variant_title,
  ]);

export const buildFamilyEngineLabel = (engine: VehicleVariantEngineLayers) => {
  const identity = getFamilyIdentity(engine);
  if (identity.length === 0) return null;

  return identity[0] ?? null;
};

export const buildExactEngineLabel = (engine: VehicleVariantEngineLayers) => {
  const identity = getExactIdentity(engine);
  if (identity.length === 0) return null;

  return identity[0] ?? null;
};

export const buildPreferredVariantEngineLabel = (
  engine: VehicleVariantEngineLayers
) => buildExactEngineLabel(engine) ?? buildFamilyEngineLabel(engine);

export const buildVariantEngineSignature = (engine: VehicleVariantEngineLayers) =>
  uniqueText([
    ...getExactIdentity(engine),
    formatPower(engine.engine_variant_power_hp, engine.engine_variant_power_kw),
    ...getFamilyIdentity(engine),
    formatDisplacement(engine.displacement_l),
    formatDisplacement(engine.engine_variant_displacement_l),
  ]).join("|");

export const collectFamilyEngineLabels = (
  variants: VehicleVariantEngineLayers[] | undefined | null
) =>
  uniqueText((variants ?? []).map((variant) => buildFamilyEngineLabel(variant))).filter(
    Boolean
  );

export const buildExactEngineSummary = (engine: VehicleVariantEngineLayers) =>
  uniqueText([
    buildExactEngineLabel(engine),
    engine.engine_variant_title,
    formatDisplacement(engine.engine_variant_displacement_l ?? engine.displacement_l),
    engine.engine_variant_fuel_type ?? engine.fuel_type,
    engine.engine_variant_aspiration ?? engine.aspiration,
    engine.engine_variant_electrification ?? engine.electrification,
    formatPower(engine.engine_variant_power_hp, engine.engine_variant_power_kw),
  ]).join(" • ");
