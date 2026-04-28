import type { Id } from "../../../convex/_generated/dataModel";

import SharedItemAssetsPanel from "@/components/item-page/SharedItemAssetsPanel";

interface VehicleAssetsPanelProps {
  vehicleId: Id<"oem_vehicles">;
  vehicleTitle: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

export function VehicleAssetsPanel({
  vehicleId,
  vehicleTitle,
  goodPicUrl,
  badPicUrl,
}: VehicleAssetsPanelProps) {
  return (
    <SharedItemAssetsPanel
      itemType="vehicle"
      itemId={vehicleId}
      itemTitle={vehicleTitle}
      fields={[
        {
          field: "good_pic_url",
          label: "Good Pic",
          value: goodPicUrl,
          uploadLabel: "Drop a processed/primary vehicle image",
        },
        {
          field: "bad_pic_url",
          label: "Bad Pic",
          value: badPicUrl,
          uploadLabel: "Drop a reference/unprocessed vehicle image",
        },
      ]}
    />
  );
}

export default VehicleAssetsPanel;
