import type { Id } from "../../../convex/_generated/dataModel";

import SharedItemAssetsPanel from "@/components/item-page/SharedItemAssetsPanel";

interface WheelAssetsPanelProps {
  wheelId: Id<"oem_wheels">;
  wheelName: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

export function WheelAssetsPanel({
  wheelId,
  wheelName,
  goodPicUrl,
  badPicUrl,
}: WheelAssetsPanelProps) {
  return (
    <SharedItemAssetsPanel
      itemType="wheel"
      itemId={wheelId}
      itemTitle={wheelName}
      fields={[
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

export default WheelAssetsPanel;
