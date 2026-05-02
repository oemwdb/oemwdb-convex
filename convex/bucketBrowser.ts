import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  STORAGE_NAMESPACES,
  StorageNamespace,
  buildStoragePath,
  derivePathMetadata,
  isStorageNamespace,
  normalizePath,
  normalizeRelativePath,
} from "./storagePaths";

const IMAGE_FILE_PATTERN = /\.(png|jpe?g|webp|gif|avif|heic|bmp|svg)$/i;
const TARGET_TYPES = ["brand", "vehicle", "wheel", "variant"] as const;
const IMAGE_ROLES = ["brand", "good", "bad", "hero", "gallery", "source"] as const;

type TargetType = (typeof TARGET_TYPES)[number];
type ImageRole = (typeof IMAGE_ROLES)[number];
type FileRow = Doc<"oem_file_storage">;
const UUID_LIKE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONVEX_ID_LIKE_PATTERN = /^[a-z0-9]{20,}$/i;

function buildSyntheticFolderRow(namespace: StorageNamespace, relativePath: string) {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  const segments = normalizedRelativePath.split("/").filter(Boolean);

  return {
    _id: `synthetic:${namespace}:${normalizedRelativePath}` as Id<"oem_file_storage">,
    _creationTime: 0,
    path: buildStoragePath(namespace, normalizedRelativePath),
    relative_path: normalizedRelativePath,
    node_type: "folder",
    namespace,
    name: segments[segments.length - 1] ?? namespace,
    parent_path: segments.slice(0, -1).join("/"),
    storageId: undefined,
    contentType: undefined,
    brand_id: undefined,
    vehicle_id: undefined,
    wheel_id: undefined,
    variant_id: undefined,
  } as FileRow;
}

function getOpaqueNameRank(value: string) {
  if (UUID_LIKE_PATTERN.test(value)) return 2;
  if (CONVEX_ID_LIKE_PATTERN.test(value) && !value.includes("-")) return 1;
  return 0;
}

function getResolvedNodeMetadata(row: FileRow) {
  const derived = derivePathMetadata(row.path, row);
  return {
    normalizedPath: row.path === derived.normalizedPath ? row.path : derived.normalizedPath,
    namespace: row.namespace ?? derived.namespace,
    relativePath: row.relative_path ?? derived.relativePath,
    name: row.name ?? derived.name,
    parentPath: row.parent_path ?? derived.parentPath,
    nodeType: row.node_type ?? (row.storageId ? "file" : "folder"),
  };
}

function assertNamespace(namespace: string): asserts namespace is StorageNamespace {
  if (!isStorageNamespace(namespace)) {
    throw new Error(`Invalid namespace: ${namespace}`);
  }
}

function assertTargetType(value: string): asserts value is TargetType {
  if (!(TARGET_TYPES as readonly string[]).includes(value)) {
    throw new Error(`Invalid target type: ${value}`);
  }
}

function assertImageRole(value: string): asserts value is ImageRole {
  if (!(IMAGE_ROLES as readonly string[]).includes(value)) {
    throw new Error(`Invalid image role: ${value}`);
  }
}

function sanitizeNodeName(name: string) {
  return name
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+$/, "")
    .trim();
}

function sanitizeUploadFileName(name: string) {
  const trimmed = sanitizeNodeName(name);
  return trimmed || `upload-${Date.now()}`;
}

function looksLikeImage(path: string, contentType?: string | null) {
  return Boolean((contentType && contentType.startsWith("image/")) || IMAGE_FILE_PATTERN.test(path));
}

function buildMediaUrl(path: string, storedUrl: string | null) {
  const normalizedPath = normalizePath(path);
  const convexSiteUrl = process.env.CONVEX_SITE_URL?.trim() || "";
  if (convexSiteUrl) {
    return `${convexSiteUrl}/api/media/${normalizedPath}`;
  }
  return storedUrl ?? `/api/media/${normalizedPath}`;
}

function buildBrowserNode(row: FileRow) {
  const metadata = getResolvedNodeMetadata(row);
  return {
    id: row._id,
    name: metadata.name,
    kind: metadata.nodeType === "folder" ? "folder" : "file",
    path: metadata.relativePath,
    full_path: metadata.normalizedPath,
    updated_at: null,
    created_at: null,
    last_accessed_at: null,
    metadata: {
      contentType: row.contentType ?? null,
      mimetype: row.contentType ?? null,
      namespace: metadata.namespace ?? null,
      parent_path: metadata.parentPath ?? null,
      storageId: row.storageId ?? null,
      node_type: metadata.nodeType ?? null,
      brand_id: row.brand_id ?? null,
      vehicle_id: row.vehicle_id ?? null,
      wheel_id: row.wheel_id ?? null,
      variant_id: row.variant_id ?? null,
    },
  };
}

function buildFolderAncestorPath(namespace: StorageNamespace, relativePath: string) {
  return buildStoragePath(namespace, relativePath);
}

function listChildNodesFromRows(rows: FileRow[], namespace: StorageNamespace, parentPath: string) {
  const childMap = new Map<string, FileRow>();

  for (const row of rows) {
    const metadata = getResolvedNodeMetadata(row);
    if (metadata.namespace !== namespace) continue;

    if (metadata.parentPath === parentPath) {
      childMap.set(metadata.relativePath, row);
      continue;
    }

    const remainder = parentPath
      ? metadata.relativePath.startsWith(`${parentPath}/`)
        ? metadata.relativePath.slice(parentPath.length + 1)
        : null
      : metadata.relativePath;
    if (!remainder) continue;

    const firstSegment = remainder.split("/")[0];
    if (!firstSegment) continue;

    const childRelativePath = parentPath ? `${parentPath}/${firstSegment}` : firstSegment;
    if (childRelativePath === metadata.relativePath || childMap.has(childRelativePath)) continue;

    childMap.set(childRelativePath, buildSyntheticFolderRow(namespace, childRelativePath));
  }

  return Array.from(childMap.values()).sort((a, b) => {
    const aKind = getResolvedNodeMetadata(a).nodeType === "folder" ? 0 : 1;
    const bKind = getResolvedNodeMetadata(b).nodeType === "folder" ? 0 : 1;
    if (aKind !== bKind) return aKind - bKind;
    const aName = getResolvedNodeMetadata(a).name;
    const bName = getResolvedNodeMetadata(b).name;
    const aOpaqueRank = getOpaqueNameRank(aName);
    const bOpaqueRank = getOpaqueNameRank(bName);
    if (aOpaqueRank !== bOpaqueRank) return aOpaqueRank - bOpaqueRank;
    return aName.localeCompare(bName);
  });
}

async function getNodeByRelativePath(ctx: any, namespace: StorageNamespace, relativePath: string) {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  const indexedMatch = await ctx.db
    .query("oem_file_storage")
    .withIndex("by_namespace_relative_path", (q: any) =>
      q.eq("namespace", namespace).eq("relative_path", normalizedRelativePath)
    )
    .unique();
  if (indexedMatch) return indexedMatch;

  const rows = await ctx.db.query("oem_file_storage").collect();
  const exactMatch = rows.find((row) => {
    const metadata = getResolvedNodeMetadata(row);
    return metadata.namespace === namespace && metadata.relativePath === normalizedRelativePath;
  });
  if (exactMatch) return exactMatch;

  if (
    normalizedRelativePath &&
    rows.some((row) => {
      const metadata = getResolvedNodeMetadata(row);
      return metadata.namespace === namespace && metadata.relativePath.startsWith(`${normalizedRelativePath}/`);
    })
  ) {
    return buildSyntheticFolderRow(namespace, normalizedRelativePath);
  }

  return null;
}

async function ensureFolderAncestors(ctx: any, namespace: StorageNamespace, relativePath: string) {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  const segments = normalizedRelativePath.split("/").filter(Boolean);

  for (let index = 0; index < segments.length - 1; index += 1) {
    const folderRelativePath = segments.slice(0, index + 1).join("/");
    const existing = await getNodeByRelativePath(ctx, namespace, folderRelativePath);
    if (existing) continue;

    await ctx.db.insert("oem_file_storage", {
      path: buildFolderAncestorPath(namespace, folderRelativePath),
      relative_path: folderRelativePath,
      node_type: "folder",
      namespace,
      name: segments[index],
      parent_path: segments.slice(0, index).join("/"),
    });
  }
}

async function upsertImageRow(
  ctx: any,
  targetType: TargetType,
  targetId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_wheel_variants">,
  imageRole: ImageRole,
  storageId: string,
  mediaUrl: string
) {
  switch (targetType) {
    case "brand": {
      if (imageRole === "gallery" || imageRole === "source") {
        const rows = await ctx.db
          .query("oem_brand_images")
          .withIndex("by_brand", (q: any) => q.eq("brand_id", targetId))
          .collect();
        return await ctx.db.insert("oem_brand_images", {
          brand_id: targetId as Id<"oem_brands">,
          storage_id: storageId,
          url: mediaUrl,
          image_type: imageRole,
          sort_order: rows.length,
          is_primary: false,
          created_at: new Date().toISOString(),
        });
      }
      const existing = await ctx.db
        .query("oem_brand_images")
        .withIndex("by_brand_type", (q: any) =>
          q.eq("brand_id", targetId).eq("image_type", imageRole)
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          storage_id: storageId,
          url: mediaUrl,
          is_primary: true,
          sort_order: 0,
        });
        return existing._id;
      }
      return await ctx.db.insert("oem_brand_images", {
        brand_id: targetId as Id<"oem_brands">,
        storage_id: storageId,
        url: mediaUrl,
        image_type: imageRole,
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      });
    }
    case "vehicle": {
      if (imageRole === "gallery" || imageRole === "source") {
        const rows = await ctx.db
          .query("oem_vehicle_images")
          .withIndex("by_vehicle", (q: any) => q.eq("vehicle_id", targetId))
          .collect();
        return await ctx.db.insert("oem_vehicle_images", {
          vehicle_id: targetId as Id<"oem_vehicles">,
          storage_id: storageId,
          url: mediaUrl,
          image_type: imageRole,
          sort_order: rows.length,
          is_primary: false,
          created_at: new Date().toISOString(),
        });
      }
      const existing = await ctx.db
        .query("oem_vehicle_images")
        .withIndex("by_vehicle_type", (q: any) =>
          q.eq("vehicle_id", targetId).eq("image_type", imageRole)
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          storage_id: storageId,
          url: mediaUrl,
          is_primary: true,
          sort_order: 0,
        });
        return existing._id;
      }
      return await ctx.db.insert("oem_vehicle_images", {
        vehicle_id: targetId as Id<"oem_vehicles">,
        storage_id: storageId,
        url: mediaUrl,
        image_type: imageRole,
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      });
    }
    case "wheel": {
      if (imageRole === "gallery" || imageRole === "source") {
        const rows = await ctx.db
          .query("oem_wheel_images")
          .withIndex("by_wheel", (q: any) => q.eq("wheel_id", targetId))
          .collect();
        return await ctx.db.insert("oem_wheel_images", {
          wheel_id: targetId as Id<"oem_wheels">,
          storage_id: storageId,
          url: mediaUrl,
          image_type: imageRole,
          sort_order: rows.length,
          is_primary: false,
          created_at: new Date().toISOString(),
        });
      }
      const existing = await ctx.db
        .query("oem_wheel_images")
        .withIndex("by_wheel_type", (q: any) =>
          q.eq("wheel_id", targetId).eq("image_type", imageRole)
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          storage_id: storageId,
          url: mediaUrl,
          is_primary: true,
          sort_order: 0,
        });
        return existing._id;
      }
      return await ctx.db.insert("oem_wheel_images", {
        wheel_id: targetId as Id<"oem_wheels">,
        storage_id: storageId,
        url: mediaUrl,
        image_type: imageRole,
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      });
    }
    case "variant": {
      if (imageRole === "gallery" || imageRole === "source") {
        const rows = await ctx.db
          .query("oem_wheel_variant_images")
          .withIndex("by_variant", (q: any) => q.eq("variant_id", targetId))
          .collect();
        return await ctx.db.insert("oem_wheel_variant_images", {
          variant_id: targetId as Id<"oem_wheel_variants">,
          storage_id: storageId,
          url: mediaUrl,
          image_type: imageRole,
          sort_order: rows.length,
          is_primary: false,
          created_at: new Date().toISOString(),
        });
      }
      const existing = await ctx.db
        .query("oem_wheel_variant_images")
        .withIndex("by_variant_type", (q: any) =>
          q.eq("variant_id", targetId).eq("image_type", imageRole)
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          storage_id: storageId,
          url: mediaUrl,
          is_primary: true,
          sort_order: 0,
        });
        return existing._id;
      }
      return await ctx.db.insert("oem_wheel_variant_images", {
        variant_id: targetId as Id<"oem_wheel_variants">,
        storage_id: storageId,
        url: mediaUrl,
        image_type: imageRole,
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      });
    }
  }
}

async function patchDirectEntityField(
  ctx: any,
  targetType: TargetType,
  targetId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_wheel_variants">,
  imageRole: ImageRole,
  mediaUrl: string
) {
  switch (targetType) {
    case "brand":
      if (imageRole === "brand" || imageRole === "hero") {
        await ctx.db.patch(targetId as Id<"oem_brands">, { brand_image_url: mediaUrl });
      } else if (imageRole === "good") {
        await ctx.db.patch(targetId as Id<"oem_brands">, { good_pic_url: mediaUrl });
      } else if (imageRole === "bad") {
        await ctx.db.patch(targetId as Id<"oem_brands">, { bad_pic_url: mediaUrl });
      }
      return;
    case "vehicle":
      if (imageRole === "hero") {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { vehicle_image: mediaUrl });
      } else if (imageRole === "good") {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { good_pic_url: mediaUrl });
      } else if (imageRole === "bad") {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { bad_pic_url: mediaUrl });
      }
      return;
    case "wheel":
      if (imageRole === "good") {
        await ctx.db.patch(targetId as Id<"oem_wheels">, { good_pic_url: mediaUrl });
      } else if (imageRole === "bad") {
        await ctx.db.patch(targetId as Id<"oem_wheels">, { bad_pic_url: mediaUrl });
      }
      return;
    case "variant":
      if (imageRole === "good") {
        await ctx.db.patch(targetId as Id<"oem_wheel_variants">, { good_pic_url: mediaUrl });
      } else if (imageRole === "bad") {
        await ctx.db.patch(targetId as Id<"oem_wheel_variants">, { bad_pic_url: mediaUrl });
      }
      return;
  }
}

async function clearDirectEntityFieldIfMatching(
  ctx: any,
  targetType: TargetType,
  targetId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_wheel_variants">,
  imageRole: ImageRole,
  mediaUrl: string
) {
  switch (targetType) {
    case "brand": {
      const brand = await ctx.db.get(targetId as Id<"oem_brands">);
      if (!brand) return;
      if ((imageRole === "brand" || imageRole === "hero") && brand.brand_image_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_brands">, { brand_image_url: "" });
      } else if (imageRole === "good" && brand.good_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_brands">, { good_pic_url: "" });
      } else if (imageRole === "bad" && brand.bad_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_brands">, { bad_pic_url: "" });
      }
      return;
    }
    case "vehicle": {
      const vehicle = await ctx.db.get(targetId as Id<"oem_vehicles">);
      if (!vehicle) return;
      if (imageRole === "hero" && vehicle.vehicle_image === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { vehicle_image: "" });
      } else if (imageRole === "good" && vehicle.good_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { good_pic_url: "" });
      } else if (imageRole === "bad" && vehicle.bad_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_vehicles">, { bad_pic_url: "" });
      }
      return;
    }
    case "wheel": {
      const wheel = await ctx.db.get(targetId as Id<"oem_wheels">);
      if (!wheel) return;
      if (imageRole === "good" && wheel.good_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_wheels">, { good_pic_url: "" });
      } else if (imageRole === "bad" && wheel.bad_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_wheels">, { bad_pic_url: "" });
      }
      return;
    }
    case "variant": {
      const variant = await ctx.db.get(targetId as Id<"oem_wheel_variants">);
      if (!variant) return;
      if (imageRole === "good" && variant.good_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_wheel_variants">, { good_pic_url: "" });
      } else if (imageRole === "bad" && variant.bad_pic_url === mediaUrl) {
        await ctx.db.patch(targetId as Id<"oem_wheel_variants">, { bad_pic_url: "" });
      }
      return;
    }
  }
}

async function getLinksByStorageId(ctx: any, storageId: string) {
  const [brandLinks, vehicleLinks, wheelLinks, variantLinks] = await Promise.all([
    ctx.db.query("oem_brand_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_vehicle_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_variant_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
  ]);

  const [brands, vehicles, wheels, variants] = await Promise.all([
    Promise.all(brandLinks.map((row: any) => ctx.db.get(row.brand_id))),
    Promise.all(vehicleLinks.map((row: any) => ctx.db.get(row.vehicle_id))),
    Promise.all(wheelLinks.map((row: any) => ctx.db.get(row.wheel_id))),
    Promise.all(variantLinks.map((row: any) => ctx.db.get(row.variant_id))),
  ]);

  return [
    ...brandLinks.map((row: any, index: number) => ({
      id: row._id,
      targetType: "brand" as const,
      targetId: row.brand_id,
      targetLabel: brands[index]?.brand_title ?? brands[index]?.slug ?? "Brand",
      imageType: row.image_type,
      url: row.url,
      isPrimary: row.is_primary ?? false,
    })),
    ...vehicleLinks.map((row: any, index: number) => ({
      id: row._id,
      targetType: "vehicle" as const,
      targetId: row.vehicle_id,
      targetLabel: vehicles[index]?.vehicle_title ?? vehicles[index]?.slug ?? "Vehicle",
      imageType: row.image_type,
      url: row.url,
      isPrimary: row.is_primary ?? false,
    })),
    ...wheelLinks.map((row: any, index: number) => ({
      id: row._id,
      targetType: "wheel" as const,
      targetId: row.wheel_id,
      targetLabel: wheels[index]?.wheel_title ?? wheels[index]?.slug ?? "Wheel",
      imageType: row.image_type,
      url: row.url,
      isPrimary: row.is_primary ?? false,
    })),
    ...variantLinks.map((row: any, index: number) => ({
      id: row._id,
      targetType: "variant" as const,
      targetId: row.variant_id,
      targetLabel: variants[index]?.variant_title ?? variants[index]?.slug ?? "Variant",
      imageType: row.image_type,
      url: row.url,
      isPrimary: row.is_primary ?? false,
    })),
  ];
}

async function refreshLinkedUrlsForStorageId(ctx: any, storageId: string, mediaUrl: string) {
  const [brandLinks, vehicleLinks, wheelLinks, variantLinks] = await Promise.all([
    ctx.db.query("oem_brand_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_vehicle_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_variant_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
  ]);

  for (const row of brandLinks) {
    await ctx.db.patch(row._id, { url: mediaUrl });
    await patchDirectEntityField(ctx, "brand", row.brand_id, row.image_type, mediaUrl);
  }

  for (const row of vehicleLinks) {
    await ctx.db.patch(row._id, { url: mediaUrl });
    await patchDirectEntityField(ctx, "vehicle", row.vehicle_id, row.image_type, mediaUrl);
  }

  for (const row of wheelLinks) {
    await ctx.db.patch(row._id, { url: mediaUrl });
    await patchDirectEntityField(ctx, "wheel", row.wheel_id, row.image_type, mediaUrl);
  }

  for (const row of variantLinks) {
    await ctx.db.patch(row._id, { url: mediaUrl });
    await patchDirectEntityField(ctx, "variant", row.variant_id, row.image_type, mediaUrl);
  }
}

function buildOwnerHintPatch(
  targetType: TargetType,
  targetId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_wheel_variants">
) {
  switch (targetType) {
    case "brand":
      return { brand_id: targetId as Id<"oem_brands"> };
    case "vehicle":
      return { vehicle_id: targetId as Id<"oem_vehicles"> };
    case "wheel":
      return { wheel_id: targetId as Id<"oem_wheels"> };
    case "variant":
      return { variant_id: targetId as Id<"oem_wheel_variants"> };
  }
}

async function clearLinkedUrlsForStorageId(ctx: any, storageId: string) {
  const [brandLinks, vehicleLinks, wheelLinks, variantLinks] = await Promise.all([
    ctx.db.query("oem_brand_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_vehicle_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
    ctx.db.query("oem_wheel_variant_images").withIndex("by_storage_id", (q: any) => q.eq("storage_id", storageId)).collect(),
  ]);

  for (const row of brandLinks) {
    await clearDirectEntityFieldIfMatching(ctx, "brand", row.brand_id, row.image_type, row.url);
    await ctx.db.delete(row._id);
  }

  for (const row of vehicleLinks) {
    await clearDirectEntityFieldIfMatching(ctx, "vehicle", row.vehicle_id, row.image_type, row.url);
    await ctx.db.delete(row._id);
  }

  for (const row of wheelLinks) {
    await clearDirectEntityFieldIfMatching(ctx, "wheel", row.wheel_id, row.image_type, row.url);
    await ctx.db.delete(row._id);
  }

  for (const row of variantLinks) {
    await clearDirectEntityFieldIfMatching(ctx, "variant", row.variant_id, row.image_type, row.url);
    await ctx.db.delete(row._id);
  }
}

export const ensureFilesystemReady = mutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("oem_file_storage").collect();
    const existingPaths = new Set(rows.map((row) => normalizePath(row.path)));
    const plannedFolderPaths = new Set<string>();
    let patched = 0;
    let insertedFolders = 0;

    for (const row of rows) {
      const metadata = derivePathMetadata(row.path, row);
      const nextNodeType = row.node_type ?? (row.storageId ? "file" : "folder");
      const needsPatch =
        row.path !== metadata.normalizedPath ||
        row.namespace !== metadata.namespace ||
        row.relative_path !== metadata.relativePath ||
        row.name !== metadata.name ||
        row.parent_path !== metadata.parentPath ||
        row.node_type !== nextNodeType;

      if (needsPatch) {
        await ctx.db.patch(row._id, {
          path: metadata.normalizedPath,
          namespace: metadata.namespace,
          relative_path: metadata.relativePath,
          name: metadata.name,
          parent_path: metadata.parentPath,
          node_type: nextNodeType,
        });
        patched += 1;
      }

      const relativeSegments = metadata.relativePath.split("/").filter(Boolean);
      for (let index = 0; index < relativeSegments.length - 1; index += 1) {
        const folderRelativePath = relativeSegments.slice(0, index + 1).join("/");
        const folderFullPath = buildFolderAncestorPath(metadata.namespace, folderRelativePath);
        if (existingPaths.has(folderFullPath) || plannedFolderPaths.has(folderFullPath)) {
          continue;
        }
        plannedFolderPaths.add(folderFullPath);
      }
    }

    for (const folderFullPath of plannedFolderPaths) {
      const metadata = derivePathMetadata(folderFullPath);
      await ctx.db.insert("oem_file_storage", {
        path: folderFullPath,
        namespace: metadata.namespace,
        relative_path: metadata.relativePath,
        name: metadata.name,
        parent_path: metadata.parentPath,
        node_type: "folder",
      });
      insertedFolders += 1;
    }

    return { patched, insertedFolders };
  },
});

export const listNamespaces = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("oem_file_storage").collect();
    return STORAGE_NAMESPACES.map((namespace) => ({
      id: namespace,
      name: namespace,
      owner: "",
      created_at: "",
      updated_at: "",
      public: false,
      fileCount: rows.filter((row) => {
        const metadata = getResolvedNodeMetadata(row);
        return metadata.namespace === namespace && metadata.nodeType === "file";
      }).length,
    }));
  },
});

export const listChildren = query({
  args: {
    namespace: v.string(),
    parentPath: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const parentPath = normalizeRelativePath(args.parentPath ?? "");
    const rows = await ctx.db.query("oem_file_storage").collect();
    const allChildren = listChildNodesFromRows(rows, args.namespace, parentPath);
    const limit = Math.max(1, Math.min(args.limit ?? 120, 500));
    const offset = Math.max(0, args.offset ?? 0);
    const page = allChildren.slice(offset, offset + limit);

    return {
      items: page.map(buildBrowserNode),
      totalCount: allChildren.length,
      hasMore: offset + page.length < allChildren.length,
      nextOffset: offset + page.length,
    };
  },
});

export const getNodeDetails = query({
  args: {
    namespace: v.string(),
    relativePath: v.string(),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const relativePath = normalizeRelativePath(args.relativePath);
    const node = await getNodeByRelativePath(ctx, args.namespace, relativePath);
    if (!node) return null;

    const mediaUrl =
      node.storageId && node.node_type !== "folder"
        ? buildMediaUrl(node.path, await ctx.storage.getUrl(node.storageId))
        : null;
    const links = node.storageId ? await getLinksByStorageId(ctx, node.storageId) : [];
    const allRows = await ctx.db.query("oem_file_storage").collect();
    const childCount =
      getResolvedNodeMetadata(node).nodeType === "folder"
        ? listChildNodesFromRows(allRows, args.namespace, relativePath).length
        : 0;

    return {
      ...buildBrowserNode(node),
      mediaUrl,
      childCount,
      links,
      isImage: looksLikeImage(node.path, node.contentType ?? null),
    };
  },
});

export const searchTargets = query({
  args: {
    query: v.string(),
    targetTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const queryText = args.query.trim().toLowerCase();
    if (!queryText) return [];

    const targetTypes = (args.targetTypes ?? TARGET_TYPES) as string[];
    targetTypes.forEach(assertTargetType);

    const results: Array<{
      id: string;
      targetType: TargetType;
      label: string;
      subtitle: string;
    }> = [];

    if (targetTypes.includes("brand")) {
      const brands = await ctx.db.query("oem_brands").collect();
      brands
        .filter((brand) =>
          [brand.brand_title, brand.slug]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryText))
        )
        .slice(0, 10)
        .forEach((brand) => {
          results.push({
            id: brand._id,
            targetType: "brand",
            label: brand.brand_title ?? brand.slug ?? "Brand",
            subtitle: brand.slug ?? "",
          });
        });
    }

    if (targetTypes.includes("vehicle")) {
      const vehicles = await ctx.db.query("oem_vehicles").collect();
      vehicles
        .filter((vehicle) =>
          [vehicle.vehicle_title, vehicle.slug]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryText))
        )
        .slice(0, 10)
        .forEach((vehicle) => {
          results.push({
            id: vehicle._id,
            targetType: "vehicle",
            label: vehicle.vehicle_title ?? vehicle.slug ?? "Vehicle",
            subtitle: vehicle.slug ?? "",
          });
        });
    }

    if (targetTypes.includes("wheel")) {
      const wheels = await ctx.db.query("oem_wheels").collect();
      wheels
        .filter((wheel) =>
          [wheel.wheel_title, wheel.slug]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryText))
        )
        .slice(0, 10)
        .forEach((wheel) => {
          results.push({
            id: wheel._id,
            targetType: "wheel",
            label: wheel.wheel_title ?? wheel.slug ?? "Wheel",
            subtitle: wheel.slug ?? "",
          });
        });
    }

    if (targetTypes.includes("variant")) {
      const variants = await ctx.db.query("oem_wheel_variants").collect();
      variants
        .filter((variant) =>
          [variant.variant_title, variant.slug]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryText))
        )
        .slice(0, 10)
        .forEach((variant) => {
          results.push({
            id: variant._id,
            targetType: "variant",
            label: variant.variant_title ?? variant.slug ?? "Variant",
            subtitle: variant.slug ?? "",
          });
        });
    }

    return results;
  },
});

export const createFolder = mutation({
  args: {
    namespace: v.string(),
    parentPath: v.optional(v.string()),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const name = sanitizeNodeName(args.name);
    if (!name) {
      throw new Error("Folder name is required.");
    }

    const parentPath = normalizeRelativePath(args.parentPath ?? "");
    const relativePath = parentPath ? `${parentPath}/${name}` : name;
    const existing = await getNodeByRelativePath(ctx, args.namespace, relativePath);
    if (existing) {
      throw new Error("A node with that name already exists in this folder.");
    }

    await ensureFolderAncestors(ctx, args.namespace, relativePath);

    return await ctx.db.insert("oem_file_storage", {
      path: buildStoragePath(args.namespace, relativePath),
      relative_path: relativePath,
      node_type: "folder",
      namespace: args.namespace,
      name,
      parent_path: parentPath,
    });
  },
});

export const moveNode = mutation({
  args: {
    namespace: v.string(),
    fromPath: v.string(),
    toPath: v.string(),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const fromPath = normalizeRelativePath(args.fromPath);
    const toPath = normalizeRelativePath(args.toPath);
    if (!fromPath || !toPath) {
      throw new Error("Source and destination paths are required.");
    }
    if (fromPath === toPath) {
      return { moved: 0 };
    }
    if (toPath.startsWith(`${fromPath}/`)) {
      throw new Error("Cannot move a folder into itself.");
    }

    const sourceNode = await getNodeByRelativePath(ctx, args.namespace, fromPath);
    if (!sourceNode) {
      throw new Error("Source node not found.");
    }

    const existingDestination = await getNodeByRelativePath(ctx, args.namespace, toPath);
    if (existingDestination) {
      throw new Error("A node already exists at the destination path.");
    }

    await ensureFolderAncestors(ctx, args.namespace, toPath);

    const namespaceRows = await ctx.db.query("oem_file_storage").collect();
    const affectedRows = namespaceRows.filter((row) => {
      const metadata = getResolvedNodeMetadata(row);
      return (
        metadata.namespace === args.namespace &&
        (metadata.relativePath === fromPath || metadata.relativePath.startsWith(`${fromPath}/`))
      );
    });

    affectedRows.sort((a, b) => {
      const aDepth = (a.relative_path ?? "").split("/").filter(Boolean).length;
      const bDepth = (b.relative_path ?? "").split("/").filter(Boolean).length;
      return aDepth - bDepth;
    });

    for (const row of affectedRows) {
      const currentRelativePath = getResolvedNodeMetadata(row).relativePath;
      const suffix = currentRelativePath === fromPath
        ? ""
        : currentRelativePath.slice(fromPath.length + 1);
      const nextRelativePath = suffix ? `${toPath}/${suffix}` : toPath;
      const nextPath = buildStoragePath(args.namespace, nextRelativePath);
      const nextMetadata = derivePathMetadata(nextPath, row);

      await ctx.db.patch(row._id, {
        path: nextPath,
        namespace: args.namespace,
        relative_path: nextRelativePath,
        name: nextMetadata.name,
        parent_path: nextMetadata.parentPath,
      });

      if (row.storageId) {
        const mediaUrl = buildMediaUrl(nextPath, await ctx.storage.getUrl(row.storageId));
        await refreshLinkedUrlsForStorageId(ctx, row.storageId, mediaUrl);
      }
    }

    return { moved: affectedRows.length };
  },
});

export const deleteNode = mutation({
  args: {
    namespace: v.string(),
    path: v.string(),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const path = normalizeRelativePath(args.path);
    const sourceNode = await getNodeByRelativePath(ctx, args.namespace, path);
    if (!sourceNode) {
      throw new Error("Node not found.");
    }

    const namespaceRows = await ctx.db.query("oem_file_storage").collect();
    const affectedRows = namespaceRows.filter((row) => {
      const metadata = getResolvedNodeMetadata(row);
      return (
        metadata.namespace === args.namespace &&
        (metadata.relativePath === path || metadata.relativePath.startsWith(`${path}/`))
      );
    });

    affectedRows.sort((a, b) => b.path.localeCompare(a.path));

    for (const row of affectedRows) {
      if (row.storageId) {
        await clearLinkedUrlsForStorageId(ctx, row.storageId);
        await ctx.storage.delete(row.storageId);
      }
      await ctx.db.delete(row._id);
    }

    return { deleted: affectedRows.length };
  },
});

export const linkAsset = mutation({
  args: {
    fileId: v.id("oem_file_storage"),
    targetType: v.string(),
    targetId: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_wheel_variants")
    ),
    imageRole: v.string(),
  },
  handler: async (ctx, args) => {
    assertTargetType(args.targetType);
    assertImageRole(args.imageRole);

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found.");
    }
    if (!file.storageId) {
      throw new Error("Only stored files can be linked.");
    }

    const mediaUrl = buildMediaUrl(file.path, await ctx.storage.getUrl(file.storageId));

    await ctx.db.patch(file._id, buildOwnerHintPatch(args.targetType, args.targetId));

    await upsertImageRow(ctx, args.targetType, args.targetId, args.imageRole, file.storageId, mediaUrl);
    await patchDirectEntityField(ctx, args.targetType, args.targetId, args.imageRole, mediaUrl);

    return {
      ok: true,
      mediaUrl,
    };
  },
});

export const unlinkAsset = mutation({
  args: {
    fileId: v.id("oem_file_storage"),
    targetType: v.string(),
    targetId: v.union(
      v.id("oem_brands"),
      v.id("oem_vehicles"),
      v.id("oem_wheels"),
      v.id("oem_wheel_variants")
    ),
    imageRole: v.string(),
  },
  handler: async (ctx, args) => {
    assertTargetType(args.targetType);
    assertImageRole(args.imageRole);

    const file = await ctx.db.get(args.fileId);
    if (!file?.storageId) {
      throw new Error("File not found.");
    }

    switch (args.targetType) {
      case "brand": {
        const rows = await ctx.db
          .query("oem_brand_images")
          .withIndex("by_brand_type", (q: any) =>
            q.eq("brand_id", args.targetId).eq("image_type", args.imageRole)
          )
          .collect();
        for (const row of rows.filter((row: any) => row.storage_id === file.storageId)) {
          await clearDirectEntityFieldIfMatching(ctx, "brand", args.targetId, args.imageRole, row.url);
          await ctx.db.delete(row._id);
        }
        break;
      }
      case "vehicle": {
        const rows = await ctx.db
          .query("oem_vehicle_images")
          .withIndex("by_vehicle_type", (q: any) =>
            q.eq("vehicle_id", args.targetId).eq("image_type", args.imageRole)
          )
          .collect();
        for (const row of rows.filter((row: any) => row.storage_id === file.storageId)) {
          await clearDirectEntityFieldIfMatching(ctx, "vehicle", args.targetId, args.imageRole, row.url);
          await ctx.db.delete(row._id);
        }
        break;
      }
      case "wheel": {
        const rows = await ctx.db
          .query("oem_wheel_images")
          .withIndex("by_wheel_type", (q: any) =>
            q.eq("wheel_id", args.targetId).eq("image_type", args.imageRole)
          )
          .collect();
        for (const row of rows.filter((row: any) => row.storage_id === file.storageId)) {
          await clearDirectEntityFieldIfMatching(ctx, "wheel", args.targetId, args.imageRole, row.url);
          await ctx.db.delete(row._id);
        }
        break;
      }
      case "variant": {
        const rows = await ctx.db
          .query("oem_wheel_variant_images")
          .withIndex("by_variant_type", (q: any) =>
            q.eq("variant_id", args.targetId).eq("image_type", args.imageRole)
          )
          .collect();
        for (const row of rows.filter((row: any) => row.storage_id === file.storageId)) {
          await clearDirectEntityFieldIfMatching(ctx, "variant", args.targetId, args.imageRole, row.url);
          await ctx.db.delete(row._id);
        }
        break;
      }
    }
    return { ok: true };
  },
});
