import { mutation, query } from "./_generated/server";
import { buildOverview, SNAPSHOT_KEY } from "./billyDashShared";

export { buildOverview, SNAPSHOT_KEY } from "./billyDashShared";

export const overviewGet = query({
  args: {},
  handler: async (ctx) => {
    const snapshot = await ctx.db
      .query("admin_dashboard_snapshots")
      .withIndex("by_key", (q) => q.eq("key", SNAPSHOT_KEY))
      .unique();

    if (!snapshot) return null;

    try {
      const payload = JSON.parse(snapshot.payload_json) as {
        refreshedAt?: string;
        snapshotVersion?: string;
      } & Record<string, unknown>;
      return {
        ...payload,
        refreshedAt: snapshot.refreshed_at || payload.refreshedAt,
        snapshotVersion: snapshot.snapshot_version || payload.snapshotVersion || "v2",
      };
    } catch {
      return null;
    }
  },
});

export const refreshOverview = mutation({
  args: {},
  handler: async (ctx) => {
    const payload = await buildOverview(ctx);
    const existing = await ctx.db
      .query("admin_dashboard_snapshots")
      .withIndex("by_key", (q) => q.eq("key", SNAPSHOT_KEY))
      .unique();

    const doc = {
      key: SNAPSHOT_KEY,
      payload_json: JSON.stringify(payload),
      refreshed_at: payload.refreshedAt,
      snapshot_version: payload.snapshotVersion,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("admin_dashboard_snapshots", doc);
    }

    return payload;
  },
});
