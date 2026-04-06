import type { MutationCtx, QueryCtx } from "./_generated/server";

const ADMIN_EMAILS = new Set(["gabrielvarzaru96@gmail.com"]);

export const DEFAULT_ADMIN_TABLE_SELECTOR_LAYOUT_SCOPE = "dev_admin";

type AdminCtx = QueryCtx | MutationCtx;

function normalizeEmailCandidate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.includes("@") ? normalized : null;
}

function getIdentityEmailCandidates(identity: any): string[] {
  const candidates = new Set<string>();
  const direct = [identity?.email, identity?.preferredUsername, identity?.nickname];

  for (const candidate of direct) {
    const normalized = normalizeEmailCandidate(candidate);
    if (normalized) candidates.add(normalized);
  }

  const tokenIdentifier = typeof identity?.tokenIdentifier === "string"
    ? identity.tokenIdentifier
    : "";

  for (const piece of tokenIdentifier.split(/[|,\s:;]+/)) {
    const normalized = normalizeEmailCandidate(piece);
    if (normalized) candidates.add(normalized);
  }

  return [...candidates];
}

export async function requireAdmin(ctx: AdminCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const adminRole = identity.subject
    ? await ctx.db
      .query("user_roles")
      .withIndex("by_user", (q) => q.eq("user_id", identity.subject as string))
      .first()
    : null;

  const emailCandidates = getIdentityEmailCandidates(identity);
  const isAdminByEmail = emailCandidates.some((candidate) => ADMIN_EMAILS.has(candidate));
  const isAdminByRole = adminRole?.role === "admin";

  if (!isAdminByEmail && !isAdminByRole) {
    throw new Error("Unauthorized");
  }

  return identity;
}

export function requireAdminUserId(identity: { subject?: string | null }) {
  if (!identity.subject || typeof identity.subject !== "string") {
    throw new Error("Unauthorized");
  }
  return identity.subject;
}
