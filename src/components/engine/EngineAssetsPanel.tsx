import type { Id } from "../../../convex/_generated/dataModel";

import SharedItemAssetsPanel from "@/components/item-page/SharedItemAssetsPanel";

interface EngineAssetsPanelProps {
  engineId: Id<"oem_engines">;
  engineTitle: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

export function EngineAssetsPanel({
  engineId,
  engineTitle,
  goodPicUrl,
  badPicUrl,
}: EngineAssetsPanelProps) {
  return (
    <SharedItemAssetsPanel
      itemType="engine"
      itemId={engineId}
      itemTitle={engineTitle}
      fields={[
        {
          field: "good_pic_url",
          label: "Good Pic",
          value: goodPicUrl,
          uploadLabel: "Drop a processed/primary engine image",
        },
        {
          field: "bad_pic_url",
          label: "Bad Pic",
          value: badPicUrl,
          uploadLabel: "Drop a reference/unprocessed engine image",
        },
      ]}
    />
  );
}

export default EngineAssetsPanel;
