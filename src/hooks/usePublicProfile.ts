import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type PublicProfile = {
  id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  member_since?: string | null;
  listing_count?: number | null;
  transaction_count?: number | null;
  verification_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function usePublicProfile(username: string | undefined) {
  const profileRaw = useQuery(
    api.queries.profileGetByUsername,
    username ? { username } : "skip"
  );

  const data: PublicProfile | null | undefined =
    profileRaw === undefined
      ? undefined
      : profileRaw
        ? {
            id: profileRaw.id,
            username: profileRaw.username,
            display_name: profileRaw.display_name ?? null,
            avatar_url: profileRaw.avatar_url ?? null,
            bio: profileRaw.bio ?? null,
            location: profileRaw.location ?? null,
            member_since: profileRaw.member_since ?? null,
            listing_count: profileRaw.listing_count ?? null,
            transaction_count: profileRaw.transaction_count ?? null,
            verification_status: profileRaw.verification_status ?? null,
            created_at: profileRaw.created_at ?? null,
            updated_at: profileRaw.updated_at ?? null,
          }
        : null;

  return {
    data: data === undefined ? undefined : data,
    isLoading: !!username && profileRaw === undefined,
    error: null,
    isError: false,
  };
}
