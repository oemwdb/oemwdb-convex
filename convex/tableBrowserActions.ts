"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const rowsGet = action({
  args: {
    tableName: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(internal.tableBrowserInternal.rowsGet, args);
  },
});
