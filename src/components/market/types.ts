export type MarketLinkedObjectType =
  | "brand"
  | "wheel"
  | "wheel_variant"
  | "vehicle"
  | "vehicle_variant";

export interface MarketLinkedObject {
  type: MarketLinkedObjectType;
  id: string;
  label: string;
  subtitle?: string | null;
  imageUrl?: string | null;
}

export interface MarketFeaturedItem {
  _id: string;
  userId: string;
  listingType: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  imageGallery: string[];
  destinationUrl: string | null;
  sourceProvider: string;
  location: string | null;
  sellerDisplayName: string | null;
  sellerKey: string | null;
  placementCoverage: "paid" | "membership";
  placementPriceUsd: number;
  placementDurationDays: number;
  moderationStatus: "pending" | "approved" | "rejected";
  status: string;
  effectiveStatus: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  linkedObjects: MarketLinkedObject[];
}

export interface MarketSellerPlacementSummary {
  sellerKey: string;
  activeFeaturedPlacements: number;
  activeMembershipPlacements: number;
  includedMembershipSlots: number;
  remainingMembershipPlacements: number;
}

export interface MarketFeaturedItemFormValue {
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  currency: string;
  imageUrl: string;
  extraImagesText: string;
  destinationUrl: string;
  sourceProvider: string;
  listingType: string;
  location: string;
  sellerDisplayName: string;
  sellerKey: string;
  placementCoverage: "paid" | "membership";
  startDate: string;
  endDate: string;
  moderationStatus: "pending" | "approved" | "rejected";
  status: "draft" | "active" | "inactive";
  linkedObjects: MarketLinkedObject[];
}
