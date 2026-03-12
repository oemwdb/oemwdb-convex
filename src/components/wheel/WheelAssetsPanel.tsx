import React, { useMemo, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import type { Id } from "../../../convex/_generated/dataModel";

interface WheelAssetsPanelProps {
  wheelId: Id<"oem_wheels">;
  wheelName: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      const [, base64 = ""] = result.split(",", 2);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function WheelAssetsPanel({
  wheelId,
  wheelName,
  goodPicUrl,
  badPicUrl,
}: WheelAssetsPanelProps) {
  const uploadWheelAsset = useAction(api.storage.uploadWheelAsset);
  const [uploadingField, setUploadingField] = useState<"good_pic_url" | "bad_pic_url" | null>(null);

  const currentGoodFiles = useMemo(() => (goodPicUrl ? [goodPicUrl] : []), [goodPicUrl]);
  const currentBadFiles = useMemo(() => (badPicUrl ? [badPicUrl] : []), [badPicUrl]);

  const handleUpload = async (
    field: "good_pic_url" | "bad_pic_url",
    files: File[]
  ) => {
    const file = files[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const fileBase64 = await fileToBase64(file);
      await uploadWheelAsset({
        wheelId,
        field,
        fileBase64,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      });
      toast({
        title: field === "good_pic_url" ? "Good pic updated" : "Bad pic updated",
        description: `${wheelName} now points ${field === "good_pic_url" ? "good" : "bad"} image to ${file.name}.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload asset.",
        variant: "destructive",
      });
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Good Pic</CardTitle>
            <Badge variant="outline">{goodPicUrl ? "Set" : "Empty"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            maxFiles={1}
            maxSize={20}
            uploadedFiles={currentGoodFiles}
            onRemove={() => undefined}
            onUpload={(files) => handleUpload("good_pic_url", files)}
            label={uploadingField === "good_pic_url" ? "Uploading good pic..." : "Drop a processed/primary image"}
            showRemove={false}
          />
          {goodPicUrl ? (
            <p className="text-xs text-muted-foreground break-all">{goodPicUrl}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Bad Pic</CardTitle>
            <Badge variant="outline">{badPicUrl ? "Set" : "Empty"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            maxFiles={1}
            maxSize={20}
            uploadedFiles={currentBadFiles}
            onRemove={() => undefined}
            onUpload={(files) => handleUpload("bad_pic_url", files)}
            label={uploadingField === "bad_pic_url" ? "Uploading bad pic..." : "Drop a reference/unprocessed image"}
            showRemove={false}
          />
          {badPicUrl ? (
            <p className="text-xs text-muted-foreground break-all">{badPicUrl}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default WheelAssetsPanel;
