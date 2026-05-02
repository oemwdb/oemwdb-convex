export type AssetGenerationItemType = "brand" | "vehicle" | "wheel" | "wheel_variant";

export type AssetGenerationPreset = {
  key: string;
  label: string;
  itemTypes: AssetGenerationItemType[];
  prompt: string;
  model: string;
  size: string;
  background: "transparent" | "opaque" | "auto";
  outputFormat: "webp" | "png" | "jpeg";
  outputCount: number;
};

export const ASSET_GENERATION_PRESETS: AssetGenerationPreset[] = [
  {
    key: "wheel_product_photo",
    label: "Wheel product photo",
    itemTypes: ["wheel", "wheel_variant"],
    model: "gpt-image-1.5",
    size: "1024x1024",
    background: "transparent",
    outputFormat: "webp",
    outputCount: 1,
    prompt: [
      "Create a clean rim-only OEM wheel product photo from the selected reference image(s).",
      "Preserve the exact spoke shape, lug pattern, center cap, finish color, machining, and proportions.",
      "Remove the tire, vehicle, floor, shadows from the source scene, text, watermarks, clutter, and background.",
      "Center the wheel straight-on as a square ecommerce product image with crisp edges and even studio lighting.",
      "Use a transparent background when possible; otherwise use a clean neutral product background.",
      "Do not invent extra spokes, badges, bolts, logos, or decorative details.",
    ].join("\n"),
  },
  {
    key: "brand_clean_logo",
    label: "Brand clean logo",
    itemTypes: ["brand"],
    model: "gpt-image-1.5",
    size: "1024x1024",
    background: "transparent",
    outputFormat: "webp",
    outputCount: 1,
    prompt: [
      "Create a clean, centered product-style brand mark from the selected reference image(s).",
      "Preserve the logo geometry and proportions exactly.",
      "Remove backgrounds, compression artifacts, extra text, watermarks, and clutter.",
      "Return a transparent background when possible.",
    ].join("\n"),
  },
  {
    key: "vehicle_clean_side_profile",
    label: "Vehicle clean side profile",
    itemTypes: ["vehicle"],
    model: "gpt-image-1.5",
    size: "1024x1024",
    background: "transparent",
    outputFormat: "webp",
    outputCount: 1,
    prompt: [
      "Create a clean vehicle product image from the selected reference image(s).",
      "Preserve the exact vehicle body shape, trim, wheels, color, and visible details.",
      "Remove the road, building, people, watermarks, and background clutter.",
      "Center the vehicle in a side-profile product-photo composition with clean lighting.",
      "Use a transparent background when possible; otherwise use a neutral product background.",
    ].join("\n"),
  },
];

export function getAssetGenerationPresets(itemType: string) {
  return ASSET_GENERATION_PRESETS.filter((preset) =>
    preset.itemTypes.includes(itemType as AssetGenerationItemType),
  );
}

export function assetGenerationPromptStorageKey(itemType: string, presetKey: string) {
  return `oemwdb.assetGenerationPrompt.${itemType}.${presetKey}`;
}
