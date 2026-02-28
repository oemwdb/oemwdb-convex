import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type ListingItem = {
  id: string;
  user_id: string;
  title: string;
  listing_type: string;
  linked_item_id: number;
  status?: string;
  condition?: string;
  description?: string;
  price?: number;
  location?: string;
  shipping_available?: boolean;
  images?: string[];
  documents?: string[];
  seller_profile_json?: string;
  created_at?: string;
  updated_at?: string;
};

export function useUserListings(userId: string | undefined) {
  const listingsRaw = useQuery(
    api.queries.userListingsGetByUser,
    userId ? { userId } : "skip"
  );

  const data: ListingItem[] =
    listingsRaw?.map((l) => ({
      ...l,
      id: String(l._id),
    })) ?? [];

  return {
    data,
    isLoading: !!userId && listingsRaw === undefined,
    error: null,
    isError: false,
    refetch: () => {},
  };
}
