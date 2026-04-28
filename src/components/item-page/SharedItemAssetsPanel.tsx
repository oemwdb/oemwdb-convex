import React, { useMemo, useState } from "react";
import { useAction, useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/hooks/use-toast";

type SharedAssetItemType =
  | "vehicle"
  | "engine"
  | "color"
  | "vehicle_variant"
  | "wheel_variant";
type SharedAssetField = "good_pic_url" | "bad_pic_url";

interface SharedAssetFieldConfig {
  field: SharedAssetField;
  label: string;
  value?: string | null;
  uploadLabel: string;
}

interface SharedItemAssetsPanelProps {
  itemType: SharedAssetItemType;
  itemId:
    | Id<"oem_vehicles">
    | Id<"oem_engines">
    | Id<"oem_colors">
    | Id<"oem_vehicle_variants">
    | Id<"oem_wheel_variants">;
  itemTitle: string;
  fields: SharedAssetFieldConfig[];
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

export function SharedItemAssetsPanel({
  itemType,
  itemId,
  itemTitle,
  fields,
}: SharedItemAssetsPanelProps) {
  const uploadSharedAsset = useAction(api.storage.uploadSharedAsset);
  const updateAssetUrl = useMutation(api.mutations.adminCollectionItemAssetUrlUpdate);
  const [uploadingField, setUploadingField] = useState<SharedAssetField | null>(null);

  const fieldFiles = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.field, field.value ? [field.value] : []]),
      ) as Record<SharedAssetField, string[]>,
    [fields],
  );

  const handleUpload = async (field: SharedAssetField, files: File[]) => {
    const file = files[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const fileBase64 = await fileToBase64(file);
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const virtualPath = `${itemType}s/${itemId}/${field}/${Date.now()}-${safeName}`;
      const { mediaUrl } = await uploadSharedAsset({
        fileBase64,
        fileName: file.name,
        virtualPath,
        contentType: file.type || "application/octet-stream",
      });

      await updateAssetUrl({
        itemType,
        id: itemId,
        field,
        mediaUrl,
      });

      toast({
        title: "Asset updated",
        description: `${itemTitle} now points ${field.replace(/_/g, " ")} to ${file.name}.`,
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
    <div className={`grid gap-4 ${fields.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
      {fields.map((field) => (
        <Card key={field.field} className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{field.label}</CardTitle>
              <Badge variant="outline">{field.value ? "Set" : "Empty"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload
              maxFiles={1}
              maxSize={20}
              uploadedFiles={fieldFiles[field.field] ?? []}
              onRemove={() => undefined}
              onUpload={(files) => handleUpload(field.field, files)}
              label={
                uploadingField === field.field
                  ? `Uploading ${field.label.toLowerCase()}...`
                  : field.uploadLabel
              }
              showRemove={false}
            />
            {field.value ? (
              <p className="break-all text-xs text-muted-foreground">{field.value}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default SharedItemAssetsPanel;
