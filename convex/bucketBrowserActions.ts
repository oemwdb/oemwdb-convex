"use node";

import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import {
  StorageNamespace,
  buildStoragePath,
  isStorageNamespace,
  normalizeRelativePath,
} from "./storagePaths";

function assertNamespace(namespace: string): asserts namespace is StorageNamespace {
  if (!isStorageNamespace(namespace)) {
    throw new Error(`Invalid namespace: ${namespace}`);
  }
}

function sanitizeUploadFileName(name: string) {
  return name
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || `upload-${Date.now()}`;
}

async function ensureFolderAncestors(
  ctx: any,
  namespace: StorageNamespace,
  parentPath: string
) {
  const segments = normalizeRelativePath(parentPath).split("/").filter(Boolean);

  for (let index = 0; index < segments.length; index += 1) {
    const path = segments.slice(0, index + 1).join("/");
    try {
      await ctx.runMutation(api.bucketBrowser.createFolder, {
        namespace,
        parentPath: segments.slice(0, index).join("/"),
        name: segments[index],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("already exists")) {
        throw error;
      }
    }
  }
}

export const uploadFiles = action({
  args: {
    namespace: v.string(),
    parentPath: v.optional(v.string()),
    files: v.array(
      v.object({
        fileBase64: v.string(),
        fileName: v.string(),
        contentType: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    assertNamespace(args.namespace);
    const parentPath = normalizeRelativePath(args.parentPath ?? "");
    await ensureFolderAncestors(ctx, args.namespace, parentPath);

    const uploaded = [];

    for (const file of args.files) {
      const binaryString = atob(file.fileBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let index = 0; index < binaryString.length; index += 1) {
        bytes[index] = binaryString.charCodeAt(index);
      }

      const blob = new Blob([bytes], {
        type: file.contentType || "application/octet-stream",
      });
      const storageId = await ctx.storage.store(blob);
      const fileName = sanitizeUploadFileName(file.fileName);
      const relativePath = parentPath ? `${parentPath}/${fileName}` : fileName;
      const fullPath = buildStoragePath(args.namespace, relativePath);

      const fileId = await ctx.runMutation(internal.storageInternal.recordFile, {
        path: fullPath,
        storageId,
        contentType: file.contentType,
        node_type: "file",
      });

      uploaded.push({
        fileId,
        fileName,
        path: relativePath,
        fullPath,
        storageId,
      });
    }

    return uploaded;
  },
});
