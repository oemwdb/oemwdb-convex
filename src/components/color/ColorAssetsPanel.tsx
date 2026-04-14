import type { Id } from "../../../convex/_generated/dataModel";

import SharedItemAssetsPanel from "@/components/item-page/SharedItemAssetsPanel";

interface ColorAssetsPanelProps {
  colorId: Id<"oem_colors">;
  colorTitle: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

export function ColorAssetsPanel({
  colorId,
  colorTitle,
  goodPicUrl,
  badPicUrl,
}: ColorAssetsPanelProps) {
  return (
    <SharedItemAssetsPanel
      itemType="color"
      itemId={colorId}
      itemTitle={colorTitle}
      fields={[
        {
          field: "good_pic_url",
          label: "Good Pic",
          value: goodPicUrl,
          uploadLabel: "Drop a processed/primary color image",
        },
        {
          field: "bad_pic_url",
          label: "Bad Pic",
          value: badPicUrl,
          uploadLabel: "Drop a reference/unprocessed color image",
        },
      ]}
    />
  );
}

export default ColorAssetsPanel;
