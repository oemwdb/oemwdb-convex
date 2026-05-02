import type { Doc, Id } from "./_generated/dataModel";
import {
  STORAGE_NAMESPACES,
  type StorageNamespace,
  buildStoragePath,
  derivePathMetadata,
  isStorageNamespace,
  normalizePath,
  normalizeRelativePath,
} from "./storagePaths";

const IMAGE_FILE_PATTERN = /\.(png|jpe?g|webp|gif|avif|heic|bmp|svg)$/i;
export const TARGET_TYPES = ["brand", "vehicle", "wheel", "variant"] as const;
export const IMAGE_ROLES = ["brand", "good", "bad", "hero", "gallery", "source"] as const;

export type TargetType = (typeof TARGET_TYPES)[number];
export type ImageRole = (typeof IMAGE_ROLES)[number];
export type FileRow = Doc<"oem_file_storage">;

const UUID_LIKE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CONVEX_ID_LIKE_PATTERN = /^[a-z0-9]{20,}$/i;

function getOpaqueNameRank(value: string) {
  if (UUID_LIKE_PATTERN.test(value)) return 2;
  if (CONVEX_ID_LIKE_PATTERN.test(value) && !value.includes("-")) return 1;
  return 0;
}

function getValidNamespace(value: string | null | undefined) {
  return value && isStorageNamespace(value) ? value : null;
}

function getOptionalNormalizedPath(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const normalized = normalizeRelativePath(value);
  return normalized.length > 0 ? normalized : null;
}

function getOptionalName(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getResolvedNodeMetadata(row: FileRow) {
  const derived = derivePathMetadata(row.path, row);
  const normalizedPath = row.path === derived.normalizedPath ? row.path : derived.normalizedPath;
  const namespace = getValidNamespace(row.namespace) ?? derived.namespace;
  const explicitRelativePath = getOptionalNormalizedPath(row.relative_path);
  const relativePath =
    explicitRelativePath &&
    (explicitRelativePath === derived.relativePath || normalizedPath.endsWith(explicitRelativePath))
      ? explicitRelativePath
      : derived.relativePath;
  const parentPath = relativePath
    ? relativePath
        .split("/")
        .filter(Boolean)
        .slice(0, -1)
        .join("/")
    : "";
  const explicitName = getOptionalName(row.name);
  const derivedName =
    relativePath.split("/").filter(Boolean).at(-1) ?? derived.name ?? namespace;

  return {
    normalizedPath,
    namespace,
    relativePath,
    name: explicitName ?? derivedName,
    parentPath,
    nodeType: row.node_type === "folder" || row.node_type === "file" ? row.node_type : row.storageId ? "file" : "folder",
  };
}

export function buildSyntheticFolderRow(namespace: StorageNamespace, relativePath: string) {
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

export function listChildNodesFromRows(rows: FileRow[], namespace: StorageNamespace, parentPath: string) {
  const normalizedParentPath = normalizeRelativePath(parentPath);
  const childMap = new Map<string, FileRow>();

  for (const row of rows) {
    const metadata = getResolvedNodeMetadata(row);
    if (metadata.namespace !== namespace) continue;

    if (metadata.parentPath === normalizedParentPath && metadata.relativePath) {
      childMap.set(metadata.relativePath, row);
      continue;
    }

    const remainder = normalizedParentPath
      ? metadata.relativePath.startsWith(`${normalizedParentPath}/`)
        ? metadata.relativePath.slice(normalizedParentPath.length + 1)
        : null
      : metadata.relativePath;
    if (!remainder) continue;

    const firstSegment = remainder.split("/")[0];
    if (!firstSegment) continue;

    const childRelativePath = normalizedParentPath
      ? `${normalizedParentPath}/${firstSegment}`
      : firstSegment;
    if (childRelativePath === metadata.relativePath || childMap.has(childRelativePath)) continue;

    childMap.set(childRelativePath, buildSyntheticFolderRow(namespace, childRelativePath));
  }

  return Array.from(childMap.values()).sort((a, b) => {
    const aMeta = getResolvedNodeMetadata(a);
    const bMeta = getResolvedNodeMetadata(b);
    const aKind = aMeta.nodeType === "folder" ? 0 : 1;
    const bKind = bMeta.nodeType === "folder" ? 0 : 1;
    if (aKind !== bKind) return aKind - bKind;
    const aOpaqueRank = getOpaqueNameRank(aMeta.name);
    const bOpaqueRank = getOpaqueNameRank(bMeta.name);
    if (aOpaqueRank !== bOpaqueRank) return aOpaqueRank - bOpaqueRank;
    return aMeta.name.localeCompare(bMeta.name);
  });
}

export function assertNamespace(namespace: string): asserts namespace is StorageNamespace {
  if (!isStorageNamespace(namespace)) {
    throw new Error(`Invalid namespace: ${namespace}`);
  }
}

export function assertTargetType(value: string): asserts value is TargetType {
  if (!(TARGET_TYPES as readonly string[]).includes(value)) {
    throw new Error(`Invalid target type: ${value}`);
  }
}

export function assertImageRole(value: string): asserts value is ImageRole {
  if (!(IMAGE_ROLES as readonly string[]).includes(value)) {
    throw new Error(`Invalid image role: ${value}`);
  }
}

export function sanitizeNodeName(name: string) {
  return name
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+$/, "")
    .trim();
}

export function sanitizeUploadFileName(name: string) {
  const trimmed = sanitizeNodeName(name);
  return trimmed || `upload-${Date.now()}`;
}

export function looksLikeImageAsset(path: string, contentType?: string | null) {
  return Boolean((contentType && contentType.startsWith("image/")) || IMAGE_FILE_PATTERN.test(path));
}

export function buildMediaUrl(path: string, storedUrl: string | null) {
  const normalizedPath = normalizePath(path);
  const convexSiteUrl = process.env.CONVEX_SITE_URL?.trim() || "";
  return convexSiteUrl ? `${convexSiteUrl}/api/media/${normalizedPath}` : storedUrl;
}

export function buildBrowserNode(row: FileRow) {
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

export async function getNodeByRelativePath(ctx: any, namespace: StorageNamespace, relativePath: string) {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  const indexedMatch = await ctx.db
    .query("oem_file_storage")
    .withIndex("by_namespace_relative_path", (q: any) =>
      q.eq("namespace", namespace).eq("relative_path", normalizedRelativePath)
    )
    .unique();
  if (indexedMatch) return indexedMatch;

  const rows = await ctx.db.query("oem_file_storage").collect();
  return (
    rows.find((row: FileRow) => {
      const metadata = getResolvedNodeMetadata(row);
      return metadata.namespace === namespace && metadata.relativePath === normalizedRelativePath;
    }) ??
    (normalizedRelativePath &&
    rows.some((row: FileRow) => {
      const metadata = getResolvedNodeMetadata(row);
      return metadata.namespace === namespace && metadata.relativePath.startsWith(`${normalizedRelativePath}/`);
    })
      ? buildSyntheticFolderRow(namespace, normalizedRelativePath)
      : null)
  );
}

export async function ensureFolderAncestors(ctx: any, namespace: StorageNamespace, relativePath: string) {
  const normalizedRelativePath = normalizeRelativePath(relativePath);
  const segments = normalizedRelativePath.split("/").filter(Boolean);

  for (let index = 0; index < segments.length - 1; index += 1) {
    const folderRelativePath = segments.slice(0, index + 1).join("/");
    const existing = await getNodeByRelativePath(ctx, namespace, folderRelativePath);
    if (existing) continue;

    await ctx.db.insert("oem_file_storage", {
      path: buildStoragePath(namespace, folderRelativePath),
      relative_path: folderRelativePath,
      node_type: "folder",
      namespace,
      name: segments[index],
      parent_path: segments.slice(0, index).join("/"),
    });
  }
}

export async function upsertImageRow(
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
        .withIndex("by_brand_type", (q: any) => q.eq("brand_id", targetId).eq("image_type", imageRole))
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
        .withIndex("by_vehicle_type", (q: any) => q.eq("vehicle_id", targetId).eq("image_type", imageRole))
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
        .withIndex("by_wheel_type", (q: any) => q.eq("wheel_id", targetId).eq("image_type", imageRole))
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
        .withIndex("by_variant_type", (q: any) => q.eq("variant_id", targetId).eq("image_type", imageRole))
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

export async function patchDirectEntityField(
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

export async function clearDirectEntityFieldIfMatching(
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

export async function getLinksByStorageId(ctx: any, storageId: string) {
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

export async function refreshLinkedUrlsForStorageId(ctx: any, storageId: string, mediaUrl: string) {
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

export function buildOwnerHintPatch(
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

export async function clearLinkedUrlsForStorageId(ctx: any, storageId: string) {
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

export function buildBucketNamespaceRows(rows: FileRow[]) {
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
}
