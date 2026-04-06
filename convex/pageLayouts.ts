import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireAdminUserId } from "./adminAuth";

export const DEFAULT_ITEM_PAGE_LAYOUT_SCOPE = "item_page_builder";

const PAGE_TYPE_VALUES = [
  "vehicle_item",
  "wheel_item",
  "brand_item",
  "engine_item",
  "color_item",
] as const;

const pageTypeValidator = v.union(
  ...PAGE_TYPE_VALUES.map((value) => v.literal(value)),
);

export const getTemplate = query({
  args: {
    pageType: pageTypeValidator,
    layoutScope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await requireAdmin(ctx);
      const userId = requireAdminUserId(identity);
      const layoutScope = args.layoutScope?.trim() || DEFAULT_ITEM_PAGE_LAYOUT_SCOPE;

      return await ctx.db
        .query("admin_item_page_layouts")
        .withIndex("by_user_scope_page_type", (q) =>
          q
            .eq("user_id", userId)
            .eq("layout_scope", layoutScope)
            .eq("page_type", args.pageType),
        )
        .first();
    } catch {
      return null;
    }
  },
});

export const upsertTemplate = mutation({
  args: {
    pageType: pageTypeValidator,
    layoutScope: v.optional(v.string()),
    version: v.number(),
    titleTabLabelMode: v.optional(v.string()),
    defaultActiveTab: v.optional(v.string()),
    containerStyleJson: v.optional(v.string()),
    templateJson: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = requireAdminUserId(identity);
    const layoutScope = args.layoutScope?.trim() || DEFAULT_ITEM_PAGE_LAYOUT_SCOPE;
    const now = new Date().toISOString();

    const sharedFields = {
      layout_scope: layoutScope,
      page_type: args.pageType,
      version: args.version,
      title_tab_label_mode: args.titleTabLabelMode?.trim() || undefined,
      default_active_tab: args.defaultActiveTab?.trim() || undefined,
      container_style_json: args.containerStyleJson,
      template_json: args.templateJson,
    };

    const existing = await ctx.db
      .query("admin_item_page_layouts")
      .withIndex("by_user_scope_page_type", (q) =>
        q
          .eq("user_id", userId)
          .eq("layout_scope", layoutScope)
          .eq("page_type", args.pageType),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...sharedFields,
        updated_at: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("admin_item_page_layouts", {
      user_id: userId,
      ...sharedFields,
      created_at: now,
      updated_at: now,
    });
  },
});

export const resetTemplate = mutation({
  args: {
    pageType: pageTypeValidator,
    layoutScope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const userId = requireAdminUserId(identity);
    const layoutScope = args.layoutScope?.trim() || DEFAULT_ITEM_PAGE_LAYOUT_SCOPE;

    const existing = await ctx.db
      .query("admin_item_page_layouts")
      .withIndex("by_user_scope_page_type", (q) =>
        q
          .eq("user_id", userId)
          .eq("layout_scope", layoutScope)
          .eq("page_type", args.pageType),
      )
      .first();

    if (!existing) {
      return null;
    }

    await ctx.db.delete(existing._id);
    return existing._id;
  },
});
