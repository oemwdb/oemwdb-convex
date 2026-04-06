import type {
  OemEngineFamilyBrowseRow,
  OemEngineFamilyBrowseVariant,
} from "@/types/oem";

const normalize = (value?: string | null) => value?.trim() || null;

export const normalizeEngineText = normalize;

export const uniqueEngineValues = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  return values.filter((value): value is string => {
    const normalized = normalize(value);
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getEngineFamilyTitle = (engine: OemEngineFamilyBrowseRow) =>
  normalize(engine.family_title) ||
  normalize(engine.engine_family_name) ||
  normalize(engine.engine_display_title) ||
  normalize(engine.family_code) ||
  "Engine";

export const getEngineFamilyCode = (engine: OemEngineFamilyBrowseRow) => {
  const familyCode = normalize(engine.family_code);
  const familyTitle = getEngineFamilyTitle(engine);
  if (!familyCode) return null;
  return familyCode.toLowerCase() === familyTitle.toLowerCase() ? null : familyCode;
};

export const getEngineFamilyDescriptor = (engine: OemEngineFamilyBrowseRow) => {
  const configuration = normalize(engine.configuration);
  if (configuration) {
    return configuration.toLowerCase().includes("family")
      ? configuration
      : `${configuration} family`;
  }

  const layout = normalize(engine.engine_layout);
  if (layout) {
    return layout.toLowerCase().includes("family") ? layout : `${layout} family`;
  }

  if (engine.cylinders) {
    return `${engine.cylinders}-cylinder family`;
  }

  return null;
};

export const getEngineFamilyMeta = (engine: OemEngineFamilyBrowseRow) =>
  uniqueEngineValues([
    engine.brand_ref,
    engine.fuel_summary,
    engine.aspiration_summary,
  ]);

export const getEngineVariantTitle = (variant: OemEngineFamilyBrowseVariant) =>
  normalize(variant.engine_variant_code) ||
  normalize(variant.powertrain_designation) ||
  normalize(variant.label) ||
  normalize(variant.title) ||
  "Exact variant";

export const getEngineVariantSubtitle = (variant: OemEngineFamilyBrowseVariant) => {
  const displayTitle = getEngineVariantTitle(variant);
  const descriptiveTitle = normalize(variant.title);
  if (descriptiveTitle && descriptiveTitle.toLowerCase() !== displayTitle.toLowerCase()) {
    return descriptiveTitle;
  }

  const fallback = uniqueEngineValues([
    variant.displacement_l != null ? `${variant.displacement_l}L` : null,
    variant.fuel_type,
    variant.aspiration,
    variant.power_hp != null ? `${variant.power_hp} hp` : null,
    variant.power_hp == null && variant.power_kw != null ? `${variant.power_kw} kW` : null,
  ]);

  return fallback.length > 0 ? fallback.join(" • ") : null;
};

export const getEngineVariantMeta = (variant: OemEngineFamilyBrowseVariant) =>
  uniqueEngineValues([
    variant.displacement_l != null ? `${variant.displacement_l}L` : null,
    variant.fuel_type,
    variant.aspiration,
    variant.power_hp != null ? `${variant.power_hp} hp` : null,
    variant.power_hp == null && variant.power_kw != null ? `${variant.power_kw} kW` : null,
  ]);
