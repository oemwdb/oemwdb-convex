import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { collectDatabaseTableRows, isDatabaseTableName } from "./databaseTableAccess";

export const rowsGet = internalQuery({
  args: {
    tableName: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!isDatabaseTableName(args.tableName)) {
      throw new Error("Invalid tableName.");
    }

    const limit = Math.max(1, Math.min(args.limit ?? 250, 1000));
    const offset = Math.max(0, args.offset ?? 0);
    const rows = await collectDatabaseTableRows(ctx, args.tableName);
    const totalCount = Array.isArray(rows) ? rows.length : 0;
    const slicedRows = Array.isArray(rows) ? rows.slice(offset, offset + limit) : [];
    const hasMore = totalCount > offset + limit;

    return {
      rows: slicedRows,
      totalCount,
      hasMore,
      offset,
      limit,
    };
  },
});
