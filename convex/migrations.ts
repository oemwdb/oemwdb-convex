/**
 * One-time migration mutations for backfilling and data fixes.
 * Run via script (e.g. scripts/backfill-slugs.ts) using Convex HTTP API.
 */

import { mutation } from "./_generated/server";

/**
 * Backfill slug on oem_brands where slug is missing. Sets slug = id.
 * Returns count of documents updated.
 */
export const backfillBrandSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_brands").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

/**
 * Backfill slug on oem_vehicles where slug is missing. Sets slug = id.
 */
export const backfillVehicleSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_vehicles").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

/**
 * Backfill slug on oem_wheels where slug is missing. Sets slug = id.
 */
export const backfillWheelSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_wheels").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const value = (doc as { id?: string }).id;
      if (value == null || String(value).trim() === "") continue;
      await ctx.db.patch(doc._id, { slug: String(value).trim() });
      updated += 1;
    }
    return { updated };
  },
});

/**
 * Backfill slug on oem_engines where slug is missing. Sets slug = id, fallback engine_code.
 */
export const backfillEngineSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("oem_engines").collect();
    let updated = 0;
    for (const doc of all) {
      const slug = doc.slug ?? null;
      const hasSlug =
        slug != null && String(slug).trim() !== "";
      if (hasSlug) continue;
      const idVal = (doc as { id?: string }).id;
      const codeVal = doc.engine_code;
      const value =
        idVal != null && String(idVal).trim() !== ""
          ? String(idVal).trim()
          : codeVal != null && String(codeVal).trim() !== ""
            ? String(codeVal).trim()
            : null;
      if (value == null) continue;
      await ctx.db.patch(doc._id, { slug: value });
      updated += 1;
    }
    return { updated };
  },
});
