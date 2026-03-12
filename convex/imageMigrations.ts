"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Download a wheel image from an existing public URL and re-host it in Convex
 * storage, updating the wheel document's URL field (e.g. good_pic_url) to
 * point at the Convex URL.
 */
export const migrateWheelImageFromUrl = action({
  args: {
    wheelId: v.id("oem_wheels"),
    sourceUrl: v.string(),
    field: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { wheelId, sourceUrl } = args;
    const field = args.field ?? "good_pic_url";

    // Basic safety: only handle http/https URLs.
    if (!/^https?:\/\//i.test(sourceUrl)) {
      throw new Error(`migrateWheelImageFromUrl: sourceUrl must be http(s): ${sourceUrl}`);
    }

    // Fetch bytes from the existing URL (some hosts require a browser-like User-Agent).
    const res = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OEMWDB-Migration/1.0)",
        Accept: "image/*,*/*",
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch image (${res.status} ${res.statusText}) from ${sourceUrl}`
      );
    }

    const blob = await res.blob();

    // Store into Convex storage (expects Blob).
    const storageId = await ctx.storage.store(blob);
    const convexUrl = await ctx.storage.getUrl(storageId);

    // Patch the wheel document via internal mutation (actions don't have ctx.db).
    await ctx.runMutation(internal.migrations.patchWheelImageUrl, {
      wheelId,
      field,
      convexUrl: convexUrl ?? "",
      imageSource: sourceUrl,
    });

    return { storageId, convexUrl };
  },
});

/**
 * Download a vehicle image from an existing public URL and re-host it in Convex
 * storage, updating the vehicle document's URL field.
 */
export const migrateVehicleImageFromUrl = action({
  args: {
    vehicleId: v.id("oem_vehicles"),
    sourceUrl: v.string(),
    field: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { vehicleId, sourceUrl } = args;
    const field = args.field ?? "good_pic_url";

    if (!/^https?:\/\//i.test(sourceUrl)) {
      throw new Error(`migrateVehicleImageFromUrl: sourceUrl must be http(s): ${sourceUrl}`);
    }

    const res = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OEMWDB-Migration/1.0)",
        Accept: "image/*,*/*",
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch image (${res.status} ${res.statusText}) from ${sourceUrl}`
      );
    }

    const blob = await res.blob();
    const storageId = await ctx.storage.store(blob);
    const convexUrl = await ctx.storage.getUrl(storageId);

    await ctx.runMutation(internal.storageInternal.updateVehicleImageUrl, {
      vehicleId,
      field: field as "good_pic_url" | "bad_pic_url",
      mediaUrl: convexUrl ?? "",
    });

    return { storageId, convexUrl };
  },
});
