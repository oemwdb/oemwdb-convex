"use node";

import { v } from "convex/values";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const generationItemType = v.union(
  v.literal("brand"),
  v.literal("vehicle"),
  v.literal("wheel"),
  v.literal("wheel_variant"),
);

const generationItemId = v.union(
  v.id("oem_brands"),
  v.id("oem_vehicles"),
  v.id("oem_wheels"),
  v.id("oem_wheel_variants"),
);

const DEFAULT_MODEL = "gpt-image-1.5";
const DEFAULT_SIZE = "1024x1024";
const DEFAULT_BACKGROUND = "transparent";
const DEFAULT_OUTPUT_FORMAT = "webp";
const MAX_INPUT_IMAGES = 16;
const MAX_OUTPUT_COUNT = 4;

type GenerationItemType = "brand" | "vehicle" | "wheel" | "wheel_variant";
type OutputFormat = "webp" | "png" | "jpeg";

function sanitizeFileName(fileName: string) {
  return (
    fileName
      .trim()
      .toLowerCase()
      .replace(/[\\/]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^\.+/, "")
      .replace(/[.-]+$/g, "") || "asset"
  );
}

function pluralPathForItemType(itemType: GenerationItemType) {
  switch (itemType) {
    case "brand":
      return "brands";
    case "vehicle":
      return "vehicles";
    case "wheel":
      return "wheels";
    case "wheel_variant":
      return "wheel_variants";
    default:
      return `${itemType}s`;
  }
}

function extensionForFormat(format: string): OutputFormat {
  if (format === "png" || format === "jpeg" || format === "webp") return format;
  return DEFAULT_OUTPUT_FORMAT;
}

function contentTypeForFormat(format: OutputFormat) {
  return format === "jpeg" ? "image/jpeg" : `image/${format}`;
}

function buildMediaUrl(convexSiteUrl: string, virtualPath: string, storedUrl: string | null) {
  return convexSiteUrl ? `${convexSiteUrl}/api/media/${virtualPath}` : storedUrl;
}

function isLocalGenerationWorkbenchEnabled() {
  const deployment = process.env.CONVEX_DEPLOYMENT ?? "";
  const siteUrl = process.env.CONVEX_SITE_URL ?? "";
  return (
    process.env.ENABLE_ASSET_GENERATION_WORKBENCH === "true" ||
    deployment.startsWith("local:") ||
    siteUrl.includes("127.0.0.1") ||
    siteUrl.includes("localhost")
  );
}

function stringifyOpenAIError(payload: unknown) {
  if (!payload) return "No response body.";
  if (typeof payload === "string") return payload.slice(0, 3000);
  try {
    return JSON.stringify(payload, null, 2).slice(0, 3000);
  } catch {
    return String(payload).slice(0, 3000);
  }
}

async function responseToImageBytes(item: any, outputFormat: OutputFormat) {
  if (typeof item?.b64_json === "string" && item.b64_json.length > 0) {
    return new Uint8Array(Buffer.from(item.b64_json, "base64"));
  }

  if (typeof item?.url === "string" && item.url.length > 0) {
    const response = await fetch(item.url);
    if (!response.ok) {
      throw new Error(`OpenAI returned an image URL, but fetching it failed (${response.status}).`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  throw new Error(`OpenAI did not return image data for a ${outputFormat} output.`);
}

function sourceFileName(source: { fileName?: string; url: string }, index: number) {
  const fromName = source.fileName?.trim();
  if (fromName) return sanitizeFileName(fromName);

  try {
    const parsed = new URL(source.url);
    const urlName = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
    if (urlName) return sanitizeFileName(urlName);
  } catch {
    // Fall back to the stable index below.
  }

  return `source-${index + 1}.webp`;
}

function ownerArgs(itemType: GenerationItemType, id: any) {
  switch (itemType) {
    case "brand":
      return { brand_id: id as Id<"oem_brands"> };
    case "vehicle":
      return { vehicle_id: id as Id<"oem_vehicles"> };
    case "wheel":
      return { wheel_id: id as Id<"oem_wheels"> };
    case "wheel_variant":
      return { variant_id: id as Id<"oem_wheel_variants"> };
    default:
      return {};
  }
}

export const generateCollectionAssetFromSources = action({
  args: {
    itemType: generationItemType,
    id: generationItemId,
    presetKey: v.string(),
    prompt: v.string(),
    sources: v.array(
      v.object({
        imageId: v.optional(v.string()),
        url: v.string(),
        storageId: v.optional(v.string()),
        fileStorageId: v.optional(v.id("oem_file_storage")),
        fileName: v.optional(v.string()),
      }),
    ),
    outputCount: v.optional(v.number()),
    model: v.optional(v.string()),
    size: v.optional(v.string()),
    background: v.optional(v.string()),
    outputFormat: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runQuery(internal.assetGenerationInternal.requireAdminForAssetGeneration, {});
    if (!isLocalGenerationWorkbenchEnabled()) {
      throw new Error(
        "Asset generation workbench is disabled outside local Convex. Set ENABLE_ASSET_GENERATION_WORKBENCH=true to override.",
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing in the Convex action environment.");
    }

    const prompt = args.prompt.trim();
    if (!prompt) throw new Error("Prompt cannot be empty.");
    if (args.sources.length === 0) throw new Error("Select at least one source image.");
    if (args.sources.length > MAX_INPUT_IMAGES) {
      throw new Error(`Select ${MAX_INPUT_IMAGES} or fewer source images.`);
    }

    const outputCount = Math.max(1, Math.min(MAX_OUTPUT_COUNT, Math.floor(args.outputCount ?? 1)));
    const model = args.model?.trim() || DEFAULT_MODEL;
    const size = args.size?.trim() || DEFAULT_SIZE;
    const background = args.background?.trim() || DEFAULT_BACKGROUND;
    const outputFormat = extensionForFormat(args.outputFormat ?? DEFAULT_OUTPUT_FORMAT);
    const contentType = contentTypeForFormat(outputFormat);

    const formData = new FormData();
    formData.append("model", model);
    formData.append("prompt", prompt);
    formData.append("n", String(outputCount));
    formData.append("size", size);
    formData.append("background", background);
    formData.append("output_format", outputFormat);
    formData.append("quality", "high");

    for (let index = 0; index < args.sources.length; index += 1) {
      const source = args.sources[index];
      const url = source.url.trim();
      if (!url) throw new Error(`Source ${index + 1} is missing a URL.`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch source image ${index + 1} (${response.status}): ${url}`);
      }

      const sourceType = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/webp";
      if (!sourceType.startsWith("image/")) {
        throw new Error(`Source ${index + 1} is not an image (${sourceType}): ${url}`);
      }

      const blob = new Blob([await response.arrayBuffer()], { type: sourceType });
      formData.append("image", blob, sourceFileName(source, index));
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const responseText = await openAIResponse.text();
    let responsePayload: any = null;
    try {
      responsePayload = responseText ? JSON.parse(responseText) : null;
    } catch {
      responsePayload = responseText;
    }

    if (!openAIResponse.ok) {
      throw new Error(
        `OpenAI image edit failed (${openAIResponse.status}): ${stringifyOpenAIError(responsePayload)}`,
      );
    }

    const images = Array.isArray(responsePayload?.data) ? responsePayload.data : [];
    if (images.length === 0) {
      throw new Error(`OpenAI returned no generated images: ${stringifyOpenAIError(responsePayload)}`);
    }

    const generated = [];
    const now = Date.now();
    const safePresetKey = sanitizeFileName(args.presetKey || "generated");
    const basePath = `${pluralPathForItemType(args.itemType)}/${args.id}/generated/public`;
    const convexSiteUrl = process.env.CONVEX_SITE_URL || "";

    for (let index = 0; index < images.length; index += 1) {
      const imageBytes = await responseToImageBytes(images[index], outputFormat);
      const blob = new Blob([imageBytes], { type: contentType });
      const storageId = await ctx.storage.store(blob);
      const fileName = `${now}-${index + 1}-${safePresetKey}.${outputFormat}`;
      const virtualPath = `${basePath}/${fileName}`;
      const fileStorageId = await ctx.runMutation(internal.storageInternal.recordFile, {
        path: virtualPath,
        storageId,
        contentType,
        ...ownerArgs(args.itemType, args.id),
      });
      const storedUrl = await ctx.storage.getUrl(storageId);
      const mediaUrl = buildMediaUrl(convexSiteUrl, virtualPath, storedUrl);
      if (!mediaUrl) throw new Error("Failed to build a generated asset media URL.");

      const imageId = await ctx.runMutation(internal.assetGenerationInternal.insertGeneratedSourceImage, {
        itemType: args.itemType,
        id: args.id,
        mediaUrl,
        storageId,
        fileStorageId,
      });

      generated.push({
        imageId,
        mediaUrl,
        storageId,
        fileStorageId,
        fileName,
      });
    }

    return { generated };
  },
});
