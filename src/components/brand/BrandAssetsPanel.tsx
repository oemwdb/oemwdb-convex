import type { Id } from "../../../convex/_generated/dataModel";

import SharedItemAssetsPanel from "@/components/item-page/SharedItemAssetsPanel";

interface BrandAssetsPanelProps {
  brandId: Id<"oem_brands">;
  brandTitle: string;
  brandImageUrl?: string | null;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

export function BrandAssetsPanel({
  brandId,
  brandTitle,
  brandImageUrl,
  goodPicUrl,
  badPicUrl,
}: BrandAssetsPanelProps) {
  return (
    <SharedItemAssetsPanel
      itemType="brand"
      itemId={brandId}
      itemTitle={brandTitle}
      fields={[
        {
          field: "brand_image_url",
          label: "Brand Image",
          value: brandImageUrl,
          uploadLabel: "Primary brand image used for brand surfaces.",
        },
        {
          field: "good_pic_url",
          label: "Good Pic",
          value: goodPicUrl,
          uploadLabel: "Primary processed image used on cards and detail pages.",
        },
        {
          field: "bad_pic_url",
          label: "Bad Pics",
          value: badPicUrl,
          uploadLabel: "Reference or unprocessed source images kept for audit and repair.",
        },
      ]}
    />
  );
}

export default BrandAssetsPanel;
