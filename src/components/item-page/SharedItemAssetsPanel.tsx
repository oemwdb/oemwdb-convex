import React, { useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { Check, Copy, Download, ExternalLink, ImageIcon, Loader2, Pencil, Trash2, Upload, Wand2, X } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDevMode } from "@/contexts/DevModeContext";
import { toast } from "@/hooks/use-toast";
import {
  assetGenerationPromptStorageKey,
  getAssetGenerationPresets,
  type AssetGenerationPreset,
} from "@/lib/assetGenerationPresets";
import { cn } from "@/lib/utils";

type SharedAssetItemType =
  | "brand"
  | "vehicle"
  | "wheel"
  | "engine"
  | "color"
  | "vehicle_variant"
  | "wheel_variant";
type SharedAssetField = "brand_image_url" | "good_pic_url" | "bad_pic_url";
type SharedAssetImageType = "brand" | "good" | "bad" | "source";
type AssetGalleryBucket = "all" | "source" | "generated";
type AssetUploadBucket = "bad" | "source";
type GenerationSupportedItemType = "brand" | "vehicle" | "wheel" | "wheel_variant";

const GENERATION_IMAGE_DRAG_MIME = "application/x-oemwdb-asset-image-id";

type SharedAssetImage = {
  id: string;
  url: string;
  imageType: string;
  role?: string | null;
  visibility?: string | null;
  sortOrder?: number | null;
  isPrimary?: boolean;
  createdAt?: string | null;
  isSynthetic?: boolean;
  storageId?: string | null;
  fileStorageId?: Id<"oem_file_storage"> | string | null;
};

interface SharedAssetFieldConfig {
  field: SharedAssetField;
  label: string;
  value?: string | null;
  uploadLabel: string;
}

interface SharedItemAssetsPanelProps {
  itemType: SharedAssetItemType;
  itemId:
    | Id<"oem_brands">
    | Id<"oem_vehicles">
    | Id<"oem_wheels">
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

function assetFileName(url: string | null | undefined, fallback: string) {
  if (!url) return fallback;

  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? fallback);
  } catch {
    return url.split("/").filter(Boolean).pop() ?? fallback;
  }
}

function isPlaceholderAssetUrl(url: string | null | undefined) {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return (
    normalized.includes("/placeholder") ||
    normalized.includes("placeholder.") ||
    normalized.includes("photo-not-available") ||
    normalized.includes("photo_not_available") ||
    normalized.includes("not-available") ||
    normalized.includes("not_available") ||
    normalized.includes("notavailable") ||
    normalized.includes("no-image") ||
    normalized.includes("no_image") ||
    normalized.includes("noimage")
  );
}

function bucketLabel(bucket: AssetGalleryBucket) {
  if (bucket === "all") return "All";
  if (bucket === "generated") return "Generations";
  return "Source images";
}

function imageTypeLabel(imageType: SharedAssetImageType) {
  if (imageType === "brand") return "Brand";
  if (imageType === "good") return "Good";
  if (imageType === "bad") return "Bad";
  return "Source";
}

function fieldForPromotedImageType(imageType: "good" | "bad"): SharedAssetField {
  return imageType === "good" ? "good_pic_url" : "bad_pic_url";
}

function isCollectionGalleryImageType(imageType: string): imageType is SharedAssetImageType {
  return imageType === "brand" || imageType === "good" || imageType === "bad" || imageType === "source";
}

function validateAssetFiles(files: File[]) {
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds the 20MB limit.`,
        variant: "destructive",
      });
      return false;
    }
  }

  return true;
}

async function copyAssetUrl(url: string) {
  await navigator.clipboard.writeText(url);
  toast({ title: "Copied", description: "Image URL copied to clipboard." });
}

async function downloadAsset(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.download = fileName;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    anchor.href = objectUrl;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.click();
  }
}

function imageTypeForField(field: SharedAssetField): SharedAssetImageType {
  if (field === "brand_image_url") return "brand";
  if (field === "good_pic_url") return "good";
  return "bad";
}

function uploadOwnerArgs(itemType: SharedAssetItemType, itemId: SharedItemAssetsPanelProps["itemId"]) {
  switch (itemType) {
    case "brand":
      return { brandId: itemId as Id<"oem_brands"> };
    case "vehicle":
      return { vehicleId: itemId as Id<"oem_vehicles"> };
    case "wheel":
      return { wheelId: itemId as Id<"oem_wheels"> };
    case "wheel_variant":
      return { wheelVariantId: itemId as Id<"oem_wheel_variants"> };
    default:
      return {};
  }
}

function pluralPathForItemType(itemType: SharedAssetItemType) {
  switch (itemType) {
    case "brand":
      return "brands";
    case "vehicle":
      return "vehicles";
    case "wheel":
      return "wheels";
    case "engine":
      return "engines";
    case "color":
      return "colors";
    case "vehicle_variant":
      return "vehicle_variants";
    case "wheel_variant":
      return "wheel_variants";
    default:
      return `${itemType}s`;
  }
}

function stableImageId(image: SharedAssetImage) {
  return image.isSynthetic ? undefined : image.id;
}

function galleryImageKey(image: SharedAssetImage) {
  return image.id || image.url;
}

function isGenerationSupportedItemType(itemType: SharedAssetItemType): itemType is GenerationSupportedItemType {
  return itemType === "brand" || itemType === "vehicle" || itemType === "wheel" || itemType === "wheel_variant";
}

function canRenameStoredAsset(image: SharedAssetImage | null | undefined) {
  if (!image?.url) return false;
  return Boolean(image.fileStorageId || image.storageId || image.url.includes("/api/media/"));
}

interface AssetFileNameBarProps {
  fileName: string;
  canRename: boolean;
  isRenaming: boolean;
  compact?: boolean;
  className?: string;
  onRename: (fileName: string) => Promise<void>;
}

function AssetFileNameBar({
  fileName,
  canRename,
  isRenaming,
  compact,
  className,
  onRename,
}: AssetFileNameBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(fileName);

  useEffect(() => {
    if (!isEditing) setDraftName(fileName);
  }, [fileName, isEditing]);

  const submitRename = async () => {
    const nextName = draftName.trim();
    if (!nextName || nextName === fileName) {
      setIsEditing(false);
      setDraftName(fileName);
      return;
    }

    try {
      await onRename(nextName);
      setIsEditing(false);
    } catch {
      // The caller owns the toast; leave the editor open so the name can be fixed.
    }
  };

  if (isEditing) {
    return (
      <form
        className={cn("flex items-center gap-1 rounded-lg border border-border/60 bg-black/85 p-1", className)}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          void submitRename();
        }}
      >
        <Input
          value={draftName}
          autoFocus
          disabled={isRenaming}
          className={cn(
            "h-7 min-w-0 flex-1 border-white/20 bg-white/10 px-2 font-mono text-xs text-white placeholder:text-white/50",
            compact && "h-6 text-[11px]",
          )}
          onChange={(event) => setDraftName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setDraftName(fileName);
              setIsEditing(false);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          variant="secondary"
          className={cn("h-7 w-7 bg-white/15 text-white hover:bg-white/25", compact && "h-6 w-6")}
          disabled={isRenaming}
          title="Save file name"
        >
          {isRenaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className={cn("h-7 w-7 bg-white/15 text-white hover:bg-white/25", compact && "h-6 w-6")}
          disabled={isRenaming}
          title="Cancel rename"
          onClick={() => {
            setDraftName(fileName);
            setIsEditing(false);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </form>
    );
  }

  return (
    <div
      className={cn("flex min-w-0 items-center gap-1 rounded-lg border border-border/50 bg-black/70 px-2 py-1", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/90" title={fileName}>
        {fileName}
      </span>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className={cn("h-7 w-7 bg-white/10 text-white hover:bg-white/20", compact && "h-6 w-6")}
        disabled={!canRename || isRenaming}
        title={canRename ? "Rename file" : "Stored file required to rename"}
        onClick={() => setIsEditing(true)}
      >
        {isRenaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

interface SharedAssetCardProps {
  field: SharedAssetFieldConfig;
  activeImage?: SharedAssetImage | null;
  galleryImages?: SharedAssetImage[];
  supportsBadGallery: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  deletingImageId?: string | null;
  selectingImageId?: string | null;
  onUpload: (field: SharedAssetField, files: File[]) => Promise<void>;
  onDelete: (field: SharedAssetField) => Promise<void>;
  onSelectImage: (field: SharedAssetField, image: SharedAssetImage) => Promise<void>;
  onDeleteImage: (field: SharedAssetField, image: SharedAssetImage) => Promise<void>;
}

function SharedAssetCard({
  field,
  activeImage,
  galleryImages = [],
  supportsBadGallery,
  isUploading,
  isDeleting,
  deletingImageId,
  selectingImageId,
  onUpload,
  onDelete,
  onSelectImage,
  onDeleteImage,
}: SharedAssetCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isBadGallery = supportsBadGallery && field.field === "bad_pic_url";
  const displayUrl = activeImage?.url ?? field.value ?? null;
  const fileName = assetFileName(displayUrl, `${field.field}.jpg`);
  const hasImage = Boolean(displayUrl);
  const galleryCount = isBadGallery ? galleryImages.length : 0;

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const selectedFiles = isBadGallery ? files : files.slice(0, 1);
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit.`,
          variant: "destructive",
        });
        return;
      }
    }

    await onUpload(field.field, selectedFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!displayUrl || isDeleting) return;
    const confirmed = window.confirm(
      field.field === "good_pic_url"
        ? `Move ${field.label} back to Bad Pics?`
        : `Delete ${field.label} for this item?`,
    );
    if (!confirmed) return;
    await onDelete(field.field);
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card/60">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{field.label}</CardTitle>
            <p className="text-xs text-muted-foreground">{field.uploadLabel}</p>
          </div>
          <Badge variant={hasImage ? "secondary" : "outline"}>
            {isBadGallery && galleryCount > 0 ? `${galleryCount} ${galleryCount === 1 ? "pic" : "pics"}` : hasImage ? "Live" : "Empty"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="relative overflow-hidden rounded-md border border-border/70 bg-black">
          <div className="flex aspect-[16/9] items-center justify-center">
            {displayUrl ? (
              <img src={displayUrl} alt={field.label} className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          {displayUrl ? (
            <div className="absolute right-2 top-2 flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 bg-black/80 px-2 text-xs text-white hover:bg-black"
                onClick={() => void downloadAsset(displayUrl, fileName)}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-black/80 text-white hover:bg-black"
                title="Copy image URL"
                onClick={() => void copyAssetUrl(displayUrl)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-black/80 text-white hover:bg-black"
                title="Open image"
                onClick={() => window.open(displayUrl, "_blank", "noreferrer")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                title="Delete image"
                disabled={isDeleting}
                onClick={() => void handleDelete()}
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={isBadGallery}
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void handleFiles(event.target.files);
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border/80 px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-accent/30",
            isDragging && "border-primary bg-accent/40",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Uploading..." : isBadGallery ? "Drop images or browse" : "Drop image or browse"}
        </button>

        {isBadGallery && galleryImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
            {galleryImages.map((image) => {
              const isActive = Boolean(image.isPrimary) || image.url === displayUrl;
              const imageKey = image.id || image.url;
              return (
                <div
                  key={imageKey}
                  className={cn(
                    "group relative overflow-hidden rounded-md border bg-black",
                    isActive ? "border-primary ring-1 ring-primary" : "border-border/70",
                  )}
                >
                  <button
                    type="button"
                    className="flex aspect-square w-full items-center justify-center"
                    title="Use as active bad pic"
                    disabled={selectingImageId === imageKey}
                    onClick={() => void onSelectImage(field.field, image)}
                  >
                    <img src={image.url} alt="Bad pic option" className="h-full w-full object-contain" />
                  </button>
                  <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    {!isActive ? (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-black/80 text-white hover:bg-black"
                        title="Make active"
                        disabled={selectingImageId === imageKey}
                        onClick={() => void onSelectImage(field.field, image)}
                      >
                        {selectingImageId === imageKey ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                      title="Delete bad pic"
                      disabled={deletingImageId === imageKey}
                      onClick={() => void onDeleteImage(field.field, image)}
                    >
                      {deletingImageId === imageKey ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {displayUrl ? (
          <div className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2">
            <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{fileName}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => void copyAssetUrl(displayUrl)}
            >
              Copy URL
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface PrimaryAssetTileProps {
  field: SharedAssetFieldConfig;
  activeImage?: SharedAssetImage | null;
  isUploading: boolean;
  isDeleting: boolean;
  isRenaming: boolean;
  onUpload: (field: SharedAssetField, files: File[]) => Promise<void>;
  onDelete: (field: SharedAssetField) => Promise<void>;
  onRenameImage: (imageType: SharedAssetImageType, image: SharedAssetImage, fileName: string) => Promise<void>;
}

function PrimaryAssetTile({
  field,
  activeImage,
  isUploading,
  isDeleting,
  isRenaming,
  onUpload,
  onDelete,
  onRenameImage,
}: PrimaryAssetTileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const displayUrl = activeImage?.url ?? field.value ?? null;
  const fileName = assetFileName(displayUrl, `${field.field}.jpg`);
  const actionLabel = displayUrl ? "Replace" : "Upload";

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).slice(0, 1);
    if (files.length === 0 || !validateAssetFiles(files)) return;

    await onUpload(field.field, files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-border/70 bg-card/45 p-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void handleFiles(event.target.files);
        }}
      />
      <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs font-semibold text-foreground">{field.label}</span>
        <Badge variant={displayUrl ? "secondary" : "outline"} className="h-5 rounded-full px-2 text-[10px]">
          {displayUrl ? "Live" : "Empty"}
        </Badge>
      </div>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "group relative flex aspect-square w-full min-w-0 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-black/80 transition-colors",
          isDragging && "border-primary ring-1 ring-primary",
          isUploading && "pointer-events-none opacity-60",
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        {displayUrl ? (
          <img src={displayUrl} alt={field.label} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">Empty</span>
          </div>
        )}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        ) : null}
        {displayUrl ? (
          <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/80 text-white hover:bg-black"
              title="Download"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void downloadAsset(displayUrl, fileName);
              }}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/80 text-white hover:bg-black"
              title="Copy image URL"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void copyAssetUrl(displayUrl);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/80 text-white hover:bg-black"
              title="Open image"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                window.open(displayUrl, "_blank", "noreferrer");
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
              title={field.field === "good_pic_url" ? "Move to Bad Pics" : "Delete image"}
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void onDelete(field.field);
              }}
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        ) : null}
      </div>
      {displayUrl ? (
        <AssetFileNameBar
          fileName={fileName}
          canRename={canRenameStoredAsset(activeImage)}
          isRenaming={isRenaming}
          compact
          className="mt-2 w-full bg-black/45"
          onRename={(nextName) =>
            activeImage
              ? onRenameImage(imageTypeForField(field.field), activeImage, nextName)
              : Promise.reject(new Error("Stored asset row required to rename this file."))
          }
        />
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="mt-2 flex h-7 w-full justify-center rounded-lg text-[11px] font-semibold"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-1 h-3 w-3" />
        {actionLabel}
      </Button>
    </div>
  );
}

interface GalleryUploadTileProps {
  bucket: AssetUploadBucket;
  isUploading: boolean;
  disabled?: boolean;
  onUpload: (bucket: AssetUploadBucket, files: File[]) => Promise<void>;
}

function GalleryUploadTile({ bucket, isUploading, disabled, onUpload }: GalleryUploadTileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0 || !validateAssetFiles(files)) return;

    await onUpload(bucket, files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <button
      type="button"
      disabled={disabled || isUploading}
      className={cn(
        "relative flex h-[148px] w-full items-center justify-center rounded-lg border border-dashed border-border/80 bg-black/25 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-accent/20",
        isDragging && "border-primary bg-accent/30",
        (disabled || isUploading) && "pointer-events-none opacity-60",
      )}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void handleFiles(event.target.files);
        }}
      />
      <span className="flex flex-col items-center gap-2 text-xs">
        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        {isUploading ? "Uploading" : "Add images"}
      </span>
    </button>
  );
}

interface GalleryImageTileProps {
  image: SharedAssetImage;
  imageType: SharedAssetImageType;
  isActiveGood?: boolean;
  isActiveBad?: boolean;
  canUseAsGenerationInput?: boolean;
  isGenerationInput?: boolean;
  isLatestGenerated?: boolean;
  isSelectingGood?: boolean;
  isSelectingBad?: boolean;
  isDeleting?: boolean;
  isRenaming?: boolean;
  onToggleGenerationInput?: (image: SharedAssetImage) => void;
  onPromoteImage: (imageType: "good" | "bad", image: SharedAssetImage) => Promise<void>;
  onDeleteImage: (imageType: SharedAssetImageType, image: SharedAssetImage) => Promise<void>;
  onRenameImage: (imageType: SharedAssetImageType, image: SharedAssetImage, fileName: string) => Promise<void>;
}

function GalleryImageTile({
  image,
  imageType,
  isActiveGood,
  isActiveBad,
  canUseAsGenerationInput,
  isGenerationInput,
  isLatestGenerated,
  isSelectingGood,
  isSelectingBad,
  isDeleting,
  isRenaming,
  onToggleGenerationInput,
  onPromoteImage,
  onDeleteImage,
  onRenameImage,
}: GalleryImageTileProps) {
  const fileName = assetFileName(image.url, `${imageType}-image.jpg`);
  const isActive = Boolean(isActiveGood || isActiveBad);
  const isSelecting = Boolean(isSelectingGood || isSelectingBad);

  return (
    <div
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card/55",
        isActive ? "border-primary ring-1 ring-primary" : "border-border/70 hover:border-border",
        isGenerationInput && "border-sky-400 ring-1 ring-sky-400",
        isLatestGenerated && !isGenerationInput && "border-emerald-400 ring-1 ring-emerald-400",
      )}
      draggable={Boolean(canUseAsGenerationInput)}
      onDragStart={(event) => {
        if (!canUseAsGenerationInput) return;
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(GENERATION_IMAGE_DRAG_MIME, galleryImageKey(image));
        event.dataTransfer.setData("text/uri-list", image.url);
        event.dataTransfer.setData("text/plain", image.url);
      }}
    >
      <div className="flex h-[104px] w-full items-center justify-center bg-black">
        <img src={image.url} alt={`${imageTypeLabel(imageType)} image`} className="h-full w-full object-contain" />
      </div>
      <AssetFileNameBar
        fileName={fileName}
        canRename={canRenameStoredAsset(image)}
        isRenaming={Boolean(isRenaming)}
        compact
        className="mx-2 mt-2 border-border/40 bg-black/35"
        onRename={(nextName) => onRenameImage(imageType, image, nextName)}
      />
      <Badge variant={isActive ? "default" : "secondary"} className="absolute left-2 top-2 h-5 rounded-full px-2 text-[10px]">
        {isActiveGood ? "Good" : isActiveBad ? "Bad" : imageTypeLabel(imageType)}
      </Badge>
      {canUseAsGenerationInput ? (
        <Button
          type="button"
          size="sm"
          variant={isGenerationInput ? "secondary" : "outline"}
          className={cn(
            "absolute left-2 top-8 h-5 rounded-full border-white/20 bg-black/75 px-2 text-[10px] font-semibold text-white hover:bg-black",
            isGenerationInput && "bg-sky-500 text-white hover:bg-sky-500",
          )}
          onClick={() => onToggleGenerationInput?.(image)}
        >
          Input
        </Button>
      ) : null}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-6 w-6 bg-black/80 text-white hover:bg-black"
          title="Download"
          onClick={() => void downloadAsset(image.url, fileName)}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-6 w-6 bg-black/80 text-white hover:bg-black"
          title="Open image"
          onClick={() => window.open(image.url, "_blank", "noreferrer")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-6 w-6 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          title="Delete image"
          disabled={isDeleting}
          onClick={() => void onDeleteImage(imageType, image)}
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-1 p-2">
        <Button
          type="button"
          size="sm"
          variant={isActiveGood ? "secondary" : "outline"}
          className="h-7 rounded-md px-2 text-[11px] font-semibold"
          disabled={isSelecting || isActiveGood}
          onClick={() => void onPromoteImage("good", image)}
        >
          {isSelectingGood ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Check className="mr-1 h-3 w-3" />}
          Good
        </Button>
        <Button
          type="button"
          size="sm"
          variant={isActiveBad ? "secondary" : "outline"}
          className="h-7 rounded-md px-2 text-[11px] font-semibold"
          disabled={isSelecting || isActiveBad}
          onClick={() => void onPromoteImage("bad", image)}
        >
          {isSelectingBad ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Check className="mr-1 h-3 w-3" />}
          Bad
        </Button>
      </div>
    </div>
  );
}

interface AssetGenerationWorkbenchProps {
  presets: AssetGenerationPreset[];
  selectedPresetKey: string;
  prompt: string;
  outputCount: number;
  selectedImages: SharedAssetImage[];
  isGenerating: boolean;
  error?: string | null;
  onPresetChange: (presetKey: string) => void;
  onPromptChange: (prompt: string) => void;
  onOutputCountChange: (outputCount: number) => void;
  onGenerate: () => Promise<void>;
  onClearInputs: () => void;
  onRemoveInput: (image: SharedAssetImage) => void;
  onDropAssetImage: (imageKey: string) => void;
}

function AssetGenerationWorkbench({
  presets,
  selectedPresetKey,
  prompt,
  outputCount,
  selectedImages,
  isGenerating,
  error,
  onPresetChange,
  onPromptChange,
  onOutputCountChange,
  onGenerate,
  onClearInputs,
  onRemoveInput,
  onDropAssetImage,
}: AssetGenerationWorkbenchProps) {
  const [isDraggingInput, setIsDraggingInput] = useState(false);
  const selectedCount = selectedImages.length;
  const canGenerate = selectedCount > 0 && prompt.trim().length > 0 && !isGenerating && presets.length > 0;

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingInput(false);
    const imageKey = event.dataTransfer.getData(GENERATION_IMAGE_DRAG_MIME);
    if (imageKey) {
      onDropAssetImage(imageKey);
      return;
    }

    const droppedUrl = event.dataTransfer.getData("text/uri-list") || event.dataTransfer.getData("text/plain");
    if (droppedUrl) onDropAssetImage(droppedUrl);
  };

  const dropZoneHandlers = {
    onDragEnter: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingInput(true);
    },
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingInput(false);
    },
    onDrop: handleDrop,
  };

  return (
    <div className="mb-3 rounded-lg border border-border/80 bg-black/25 p-3">
      <div className="grid gap-3 xl:grid-cols-[156px_minmax(0,1fr)]">
        <div
          className={cn(
            "flex min-h-[116px] min-w-0 flex-col gap-2 rounded-lg border border-dashed border-border/70 bg-background/35 p-2",
            isDraggingInput && "border-sky-400 bg-sky-500/10",
          )}
          {...dropZoneHandlers}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Inputs</span>
            <Badge variant="outline" className="h-5 rounded-full px-1.5 text-[10px]">
              {selectedCount}
            </Badge>
          </div>
          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {selectedImages.slice(0, 4).map((image) => (
                <button
                  key={galleryImageKey(image)}
                  type="button"
                  className="relative flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-black"
                  title="Remove input"
                  onClick={() => onRemoveInput(image)}
                >
                  <img src={image.url} alt="Generation input" className="h-full w-full object-contain" />
                  <span className="absolute right-1 top-1 rounded-full bg-black/80 p-0.5 text-white">
                    <X className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-md bg-black/25 text-center text-[11px] text-muted-foreground">
              Drop images here
            </div>
          )}
          {selectedImages.length > 4 ? (
            <div className="text-[11px] text-muted-foreground">+{selectedImages.length - 4} more inputs</div>
          ) : null}
          {selectedImages.length > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 rounded-md px-2 text-[11px]"
              disabled={isGenerating}
              onClick={onClearInputs}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <div
          className={cn(
            "min-w-0 rounded-lg border border-border/70 bg-background/45 p-3",
            isDraggingInput && "border-sky-400",
          )}
          {...dropZoneHandlers}
        >
          <div className="mb-2 grid gap-2 md:grid-cols-[minmax(180px,260px)_96px_minmax(104px,auto)]">
            <Select value={selectedPresetKey} onValueChange={onPresetChange} disabled={isGenerating || presets.length === 0}>
              <SelectTrigger className="h-8 rounded-md bg-black/25 text-xs">
                <SelectValue placeholder="Preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.key} value={preset.key}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(outputCount)}
              onValueChange={(value) => onOutputCountChange(Number(value))}
              disabled={isGenerating}
            >
              <SelectTrigger className="h-8 rounded-md bg-black/25 text-xs">
                <SelectValue placeholder="Count" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((count) => (
                  <SelectItem key={count} value={String(count)}>
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              className="h-8 justify-center rounded-md px-3 text-xs font-semibold"
              disabled={!canGenerate}
              onClick={() => void onGenerate()}
            >
              {isGenerating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Wand2 className="mr-1.5 h-3.5 w-3.5" />}
              Generate
            </Button>
          </div>
          <Textarea
            value={prompt}
            disabled={isGenerating || presets.length === 0}
            className="min-h-[82px] resize-y border-border/70 bg-black/25 font-mono text-xs leading-5"
            placeholder="Generation prompt"
            onChange={(event) => onPromptChange(event.target.value)}
            {...dropZoneHandlers}
          />
          {error ? (
            <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-2 text-[11px] text-destructive">
              {error}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface AssetGalleryPanelProps {
  activeBucket: AssetGalleryBucket;
  onBucketChange: (bucket: AssetGalleryBucket) => void;
  allImages: SharedAssetImage[];
  sourceImages: SharedAssetImage[];
  generatedImages: SharedAssetImage[];
  activeGoodImage?: SharedAssetImage | null;
  activeBadImage?: SharedAssetImage | null;
  supportsSourceGallery: boolean;
  canUseGeneration: boolean;
  generationWorkbench?: AssetGenerationWorkbenchProps | null;
  selectedGenerationInputIds: string[];
  latestGeneratedImageIds: string[];
  hiddenPlaceholderCount: number;
  uploadingBucket?: AssetUploadBucket | null;
  deletingImageId?: string | null;
  selectingImageId?: string | null;
  selectingImageType?: "good" | "bad" | null;
  renamingImageId?: string | null;
  onToggleGenerationInput: (image: SharedAssetImage) => void;
  onUpload: (bucket: AssetUploadBucket, files: File[]) => Promise<void>;
  onPromoteImage: (imageType: "good" | "bad", image: SharedAssetImage) => Promise<void>;
  onDeleteImage: (imageType: SharedAssetImageType, image: SharedAssetImage) => Promise<void>;
  onRenameImage: (imageType: SharedAssetImageType, image: SharedAssetImage, fileName: string) => Promise<void>;
}

function AssetGalleryPanel({
  activeBucket,
  onBucketChange,
  allImages,
  sourceImages,
  generatedImages,
  activeGoodImage,
  activeBadImage,
  supportsSourceGallery,
  canUseGeneration,
  generationWorkbench,
  selectedGenerationInputIds,
  latestGeneratedImageIds,
  hiddenPlaceholderCount,
  uploadingBucket,
  deletingImageId,
  selectingImageId,
  selectingImageType,
  renamingImageId,
  onToggleGenerationInput,
  onUpload,
  onPromoteImage,
  onDeleteImage,
  onRenameImage,
}: AssetGalleryPanelProps) {
  const images = activeBucket === "all" ? allImages : activeBucket === "generated" ? generatedImages : sourceImages;
  const activeGoodUrl = activeGoodImage?.url ?? null;
  const activeBadUrl = activeBadImage?.url ?? null;

  return (
    <div className="min-w-0 rounded-lg border border-border/80 bg-card/35 p-3">
      {canUseGeneration && generationWorkbench ? <AssetGenerationWorkbench {...generationWorkbench} /> : null}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/70 bg-black/30 p-1">
          <Button
            type="button"
            size="sm"
            variant={activeBucket === "all" ? "secondary" : "ghost"}
            className="h-7 rounded-md px-4 text-xs font-semibold lowercase"
            onClick={() => onBucketChange("all")}
          >
            all
            <Badge variant="outline" className="ml-2 h-5 rounded-full px-1.5 text-[10px]">
              {allImages.length}
            </Badge>
          </Button>
          {supportsSourceGallery ? (
            <Button
              type="button"
              size="sm"
              variant={activeBucket === "source" ? "secondary" : "ghost"}
              className="h-7 rounded-md px-3 text-xs font-semibold lowercase"
              onClick={() => onBucketChange("source")}
            >
              source images
              <Badge variant="outline" className="ml-2 h-5 rounded-full px-1.5 text-[10px]">
                {sourceImages.length}
              </Badge>
            </Button>
          ) : null}
          {canUseGeneration ? (
            <Button
              type="button"
              size="sm"
              variant={activeBucket === "generated" ? "secondary" : "ghost"}
              className="h-7 rounded-md px-3 text-xs font-semibold lowercase"
              onClick={() => onBucketChange("generated")}
            >
              generations
              <Badge variant="outline" className="ml-2 h-5 rounded-full px-1.5 text-[10px]">
                {generatedImages.length}
              </Badge>
            </Button>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">
          {images.length} {images.length === 1 ? "image" : "images"}
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(128px,148px))] justify-start gap-3">
        {images.map((image) => {
          const imageKey = image.id || image.url;
          const imageType = isCollectionGalleryImageType(image.imageType) ? image.imageType : "source";
          const isActiveGood = imageType === "good" && (Boolean(image.isPrimary) || image.url === activeGoodUrl);
          const isActiveBad = imageType === "bad" && (Boolean(image.isPrimary) || image.url === activeBadUrl);
          return (
            <GalleryImageTile
              key={imageKey}
              image={image}
              imageType={imageType}
              isActiveGood={isActiveGood}
              isActiveBad={isActiveBad}
              canUseAsGenerationInput={canUseGeneration}
              isGenerationInput={selectedGenerationInputIds.includes(imageKey)}
              isLatestGenerated={latestGeneratedImageIds.includes(imageKey)}
              isSelectingGood={selectingImageId === imageKey && selectingImageType === "good"}
              isSelectingBad={selectingImageId === imageKey && selectingImageType === "bad"}
              isDeleting={deletingImageId === imageKey}
              isRenaming={renamingImageId === imageKey}
              onToggleGenerationInput={onToggleGenerationInput}
              onPromoteImage={onPromoteImage}
              onDeleteImage={onDeleteImage}
              onRenameImage={onRenameImage}
            />
          );
        })}
        {activeBucket !== "generated" ? (
          <GalleryUploadTile
            bucket="source"
            isUploading={uploadingBucket === "source"}
            disabled={!supportsSourceGallery}
            onUpload={onUpload}
          />
        ) : null}
      </div>
      {images.length === 0 ? (
        <div className="mt-3 rounded-xl border border-border/50 bg-black/20 px-3 py-2 text-xs text-muted-foreground">
          No {bucketLabel(activeBucket).toLowerCase()} yet.
        </div>
      ) : null}
      {hiddenPlaceholderCount > 0 ? (
        <div className="mt-3 rounded-xl border border-border/50 bg-black/20 px-3 py-2 text-xs text-muted-foreground">
          {hiddenPlaceholderCount} placeholder {hiddenPlaceholderCount === 1 ? "image" : "images"} hidden.
        </div>
      ) : null}
    </div>
  );
}

export function SharedItemAssetsPanel({
  itemType,
  itemId,
  itemTitle,
  fields,
}: SharedItemAssetsPanelProps) {
  const uploadSharedAsset = useAction(api.storage.uploadSharedAsset);
  const generateAssetFromSources = useAction(api.assetGeneration.generateCollectionAssetFromSources);
  const { isAdmin, isDevMode } = useDevMode();
  const assetImages = useQuery(api.queries.collectionItemAssetImages, {
    itemType,
    id: itemId,
  }) as SharedAssetImage[] | undefined;
  const updateAssetUrl = useMutation(api.mutations.adminCollectionItemAssetUrlUpdate);
  const addAssetImage = useMutation(api.mutations.adminCollectionItemAssetImageAdd);
  const clearAssetUrl = useMutation(api.mutations.adminCollectionItemAssetUrlClear);
  const selectAssetImage = useMutation(api.mutations.adminCollectionItemAssetImageSelect);
  const deleteAssetImage = useMutation(api.mutations.adminCollectionItemAssetImageDelete);
  const renameAssetImage = useMutation(api.mutations.adminCollectionItemAssetImageRename);
  const demoteGoodPic = useMutation(api.mutations.adminCollectionItemGoodPicDemoteToBad);
  const [uploadingField, setUploadingField] = useState<SharedAssetField | null>(null);
  const [uploadingBucket, setUploadingBucket] = useState<AssetUploadBucket | null>(null);
  const [deletingField, setDeletingField] = useState<SharedAssetField | null>(null);
  const [selectingImageId, setSelectingImageId] = useState<string | null>(null);
  const [selectingImageType, setSelectingImageType] = useState<"good" | "bad" | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [renamingImageId, setRenamingImageId] = useState<string | null>(null);
  const [activeGalleryBucket, setActiveGalleryBucket] = useState<AssetGalleryBucket>("all");
  const [selectedGenerationInputIds, setSelectedGenerationInputIds] = useState<string[]>([]);
  const [generationPresetKey, setGenerationPresetKey] = useState("");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generationOutputCount, setGenerationOutputCount] = useState(1);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [latestGeneratedImageIds, setLatestGeneratedImageIds] = useState<string[]>([]);
  const supportsBadGallery =
    itemType === "brand" || itemType === "vehicle" || itemType === "wheel" || itemType === "wheel_variant";
  const supportsSourceGallery = supportsBadGallery;
  const canUseGeneration = supportsSourceGallery && isGenerationSupportedItemType(itemType) && isAdmin && isDevMode;
  const generationPresets = canUseGeneration ? getAssetGenerationPresets(itemType) : [];
  const generationPresetKeys = generationPresets.map((preset) => preset.key).join("|");
  const firstGenerationPresetKey = generationPresets[0]?.key ?? "";
  const selectedGenerationPreset =
    generationPresets.find((preset) => preset.key === generationPresetKey) ?? generationPresets[0] ?? null;

  useEffect(() => {
    if (!canUseGeneration || generationPresets.length === 0) {
      if (generationPresetKey) setGenerationPresetKey("");
      return;
    }

    if (!generationPresets.some((preset) => preset.key === generationPresetKey)) {
      setGenerationPresetKey(firstGenerationPresetKey);
    }
  }, [canUseGeneration, firstGenerationPresetKey, generationPresetKey, generationPresetKeys]);

  useEffect(() => {
    if (!canUseGeneration || !selectedGenerationPreset) {
      setGenerationPrompt("");
      setGenerationOutputCount(1);
      return;
    }

    const storedPrompt = window.localStorage.getItem(
      assetGenerationPromptStorageKey(itemType, selectedGenerationPreset.key),
    );
    setGenerationPrompt(storedPrompt ?? selectedGenerationPreset.prompt);
    setGenerationOutputCount(selectedGenerationPreset.outputCount);
    setGenerationError(null);
  }, [canUseGeneration, itemType, selectedGenerationPreset?.key]);

  useEffect(() => {
    if (!canUseGeneration || !selectedGenerationPreset) return;
    window.localStorage.setItem(
      assetGenerationPromptStorageKey(itemType, selectedGenerationPreset.key),
      generationPrompt,
    );
  }, [canUseGeneration, generationPrompt, itemType, selectedGenerationPreset?.key]);

  useEffect(() => {
    if (activeGalleryBucket === "generated" && !canUseGeneration) {
      setActiveGalleryBucket("all");
    }
  }, [activeGalleryBucket, canUseGeneration]);

  const getImagesForField = (field: SharedAssetField) => {
    const imageType = imageTypeForField(field);
    return (assetImages ?? []).filter((image) => image.imageType === imageType && image.url);
  };

  const getImagesForImageType = (imageType: SharedAssetImageType) => {
    return (assetImages ?? []).filter((image) => image.imageType === imageType && image.url);
  };

  const getActiveImageForField = (field: SharedAssetField) => {
    const images = getImagesForField(field);
    return images.find((image) => image.isPrimary) ?? images[0] ?? null;
  };

  const handleUpload = async (field: SharedAssetField, files: File[]) => {
    if (files.length === 0) return;

    setUploadingField(field);
    try {
      let lastFileName = "";
      for (const file of files) {
        const fileBase64 = await fileToBase64(file);
        const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
        const virtualPath = `${pluralPathForItemType(itemType)}/${itemId}/${imageTypeForField(field)}/public/${Date.now()}-${safeName}`;
        const { mediaUrl, storageId, fileStorageId } = await uploadSharedAsset({
          fileBase64,
          fileName: file.name,
          virtualPath,
          contentType: file.type || "application/octet-stream",
          ...uploadOwnerArgs(itemType, itemId),
        });

        await updateAssetUrl({
          itemType,
          id: itemId,
          field,
          mediaUrl,
          storageId,
          fileStorageId,
        });
        lastFileName = file.name;
      }

      toast({
        title: files.length > 1 ? "Assets updated" : "Asset updated",
        description:
          files.length > 1
            ? `${itemTitle} added ${files.length} ${field === "bad_pic_url" ? "bad pics" : "assets"}.`
            : `${itemTitle} now points ${field.replace(/_/g, " ")} to ${lastFileName}.`,
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

  const handleDelete = async (field: SharedAssetField) => {
    setDeletingField(field);
    try {
      const activeImage = getActiveImageForField(field);
      if (field === "good_pic_url" && (activeImage?.url ?? fields.find((item) => item.field === field)?.value)) {
        await demoteGoodPic({
          itemType,
          id: itemId,
          mediaUrl: activeImage?.url ?? fields.find((item) => item.field === field)?.value ?? "",
        });
      } else if (field === "bad_pic_url" && activeImage?.url) {
        await deleteAssetImage({
          itemType,
          id: itemId,
          imageType: "bad",
          imageId: stableImageId(activeImage),
          mediaUrl: activeImage.url,
        });
      } else {
        await clearAssetUrl({
          itemType,
          id: itemId,
          field,
        });
      }

      toast({
        title: field === "good_pic_url" ? "Good pic moved" : "Asset deleted",
        description:
          field === "good_pic_url"
            ? `${itemTitle} moved the good pic back to Bad Pics.`
            : `${itemTitle} no longer has that ${field.replace(/_/g, " ")} active.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete asset.",
        variant: "destructive",
      });
    } finally {
      setDeletingField(null);
    }
  };

  const handleSelectImage = async (field: SharedAssetField, image: SharedAssetImage) => {
    const imageKey = image.id || image.url;
    const nextImageType = imageTypeForField(field);
    setSelectingImageId(imageKey);
    setSelectingImageType(nextImageType === "good" || nextImageType === "bad" ? nextImageType : null);
    try {
      await selectAssetImage({
        itemType,
        id: itemId,
        imageType: nextImageType,
        imageId: stableImageId(image),
        mediaUrl: image.url,
        storageId: image.storageId ?? undefined,
        fileStorageId: image.fileStorageId ? (image.fileStorageId as Id<"oem_file_storage">) : undefined,
      });
      toast({
        title: field === "good_pic_url" ? "Good pic selected" : "Bad pic selected",
        description: `${itemTitle} now uses that image as the active ${field === "good_pic_url" ? "good" : "bad"} pic.`,
      });
    } catch (error) {
      toast({
        title: "Selection failed",
        description: error instanceof Error ? error.message : "Could not select that image.",
        variant: "destructive",
      });
    } finally {
      setSelectingImageId(null);
      setSelectingImageType(null);
    }
  };

  const handleDeleteImage = async (field: SharedAssetField, image: SharedAssetImage) => {
    const confirmed = window.confirm(`Delete this ${field === "bad_pic_url" ? "bad pic" : "image"}?`);
    if (!confirmed) return;

    const imageKey = image.id || image.url;
    setDeletingImageId(imageKey);
    try {
      await deleteAssetImage({
        itemType,
        id: itemId,
        imageType: imageTypeForField(field),
        imageId: stableImageId(image),
        mediaUrl: image.url,
      });
      toast({
        title: "Image deleted",
        description: `${itemTitle} removed that image from the gallery.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete that image.",
        variant: "destructive",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleGalleryUpload = async (bucket: AssetUploadBucket, files: File[]) => {
    if (files.length === 0) return;

    if (bucket === "bad") {
      await handleUpload("bad_pic_url", supportsBadGallery ? files : files.slice(0, 1));
      return;
    }

    if (!supportsSourceGallery) {
      toast({
        title: "Source images unavailable",
        description: "This item type does not have a source image gallery yet.",
        variant: "destructive",
      });
      return;
    }

    setUploadingBucket(bucket);
    try {
      for (const file of files) {
        const fileBase64 = await fileToBase64(file);
        const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
        const virtualPath = `${pluralPathForItemType(itemType)}/${itemId}/source/public/${Date.now()}-${safeName}`;
        const { mediaUrl, storageId, fileStorageId } = await uploadSharedAsset({
          fileBase64,
          fileName: file.name,
          virtualPath,
          contentType: file.type || "application/octet-stream",
          ...uploadOwnerArgs(itemType, itemId),
        });

        await addAssetImage({
          itemType: itemType as "brand" | "vehicle" | "wheel" | "wheel_variant",
          id: itemId as Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_wheel_variants">,
          imageType: "source",
          mediaUrl,
          storageId,
          fileStorageId,
        });
      }

      toast({
        title: files.length > 1 ? "Source images added" : "Source image added",
        description: `${itemTitle} added ${files.length} source ${files.length === 1 ? "image" : "images"}.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload source images.",
        variant: "destructive",
      });
    } finally {
      setUploadingBucket(null);
    }
  };

  const handlePromoteGalleryImage = async (imageType: "good" | "bad", image: SharedAssetImage) => {
    await handleSelectImage(fieldForPromotedImageType(imageType), image);
  };

  const handleDeleteGalleryImage = async (imageType: SharedAssetImageType, image: SharedAssetImage) => {
    const confirmed = window.confirm(`Delete this ${imageTypeLabel(imageType).toLowerCase()} image?`);
    if (!confirmed) return;

    const imageKey = image.id || image.url;
    setDeletingImageId(imageKey);
    try {
      await deleteAssetImage({
        itemType,
        id: itemId,
        imageType,
        imageId: stableImageId(image),
        mediaUrl: image.url,
      });
      toast({
        title: "Image deleted",
        description: `${itemTitle} removed that ${imageTypeLabel(imageType).toLowerCase()} image.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete that image.",
        variant: "destructive",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleRenameImage = async (imageType: SharedAssetImageType, image: SharedAssetImage, fileName: string) => {
    const imageKey = image.id || image.url;
    setRenamingImageId(imageKey);
    try {
      await renameAssetImage({
        itemType,
        id: itemId,
        imageType,
        imageId: stableImageId(image),
        mediaUrl: image.url,
        storageId: image.storageId ?? undefined,
        fileStorageId: image.fileStorageId ? (image.fileStorageId as Id<"oem_file_storage">) : undefined,
        newFileName: fileName,
      });
      toast({
        title: "File renamed",
        description: `${itemTitle} asset is now ${fileName}.`,
      });
    } catch (error) {
      toast({
        title: "Rename failed",
        description: error instanceof Error ? error.message : "Could not rename that file.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setRenamingImageId(null);
    }
  };

  const primaryFields = fields;
  const allGalleryImagesRaw = (assetImages ?? []).filter(
    (image) => isCollectionGalleryImageType(image.imageType) && image.url,
  );
  const allSourceImages = getImagesForImageType("source");
  const manualSourceImagesRaw = allSourceImages.filter((image) => image.role !== "generated");
  const generatedImagesRaw = allSourceImages.filter((image) => image.role === "generated");
  const allGalleryImages = allGalleryImagesRaw.filter((image) => !isPlaceholderAssetUrl(image.url));
  const sourceImages = manualSourceImagesRaw.filter((image) => !isPlaceholderAssetUrl(image.url));
  const generatedImages = generatedImagesRaw.filter((image) => !isPlaceholderAssetUrl(image.url));
  const hiddenPlaceholderCount =
    activeGalleryBucket === "all"
      ? allGalleryImagesRaw.length - allGalleryImages.length
      : activeGalleryBucket === "generated"
        ? generatedImagesRaw.length - generatedImages.length
        : manualSourceImagesRaw.length - sourceImages.length;
  const activeBadImage = getActiveImageForField("bad_pic_url");
  const activeGoodImage = getActiveImageForField("good_pic_url");
  const selectedGenerationImages = selectedGenerationInputIds
    .map((imageKey) => allGalleryImages.find((image) => galleryImageKey(image) === imageKey || image.url === imageKey))
    .filter((image): image is SharedAssetImage => Boolean(image));

  const handleToggleGenerationInput = (image: SharedAssetImage) => {
    const imageKey = galleryImageKey(image);
    setSelectedGenerationInputIds((current) =>
      current.includes(imageKey) ? current.filter((id) => id !== imageKey) : [...current, imageKey],
    );
  };

  const handleDropGenerationImage = (imageKeyOrUrl: string) => {
    const image = allGalleryImages.find(
      (candidate) => galleryImageKey(candidate) === imageKeyOrUrl || candidate.url === imageKeyOrUrl,
    );
    if (!image) return;

    const imageKey = galleryImageKey(image);
    setSelectedGenerationInputIds((current) => (current.includes(imageKey) ? current : [...current, imageKey]));
  };

  const handleGenerateAsset = async () => {
    if (!canUseGeneration || !selectedGenerationPreset || selectedGenerationImages.length === 0) return;

    const trimmedPrompt = generationPrompt.trim();
    if (!trimmedPrompt) {
      setGenerationError("Prompt cannot be empty.");
      return;
    }

    setIsGeneratingAsset(true);
    setGenerationError(null);
    try {
      const result = await generateAssetFromSources({
        itemType: itemType as GenerationSupportedItemType,
        id: itemId as
          | Id<"oem_brands">
          | Id<"oem_vehicles">
          | Id<"oem_wheels">
          | Id<"oem_wheel_variants">,
        presetKey: selectedGenerationPreset.key,
        prompt: trimmedPrompt,
        sources: selectedGenerationImages.map((image) => ({
          imageId: stableImageId(image),
          url: image.url,
          storageId: image.storageId ?? undefined,
          fileStorageId: image.fileStorageId ? (image.fileStorageId as Id<"oem_file_storage">) : undefined,
          fileName: assetFileName(image.url, "source.webp"),
        })),
        outputCount: generationOutputCount,
        model: selectedGenerationPreset.model,
        size: selectedGenerationPreset.size,
        background: selectedGenerationPreset.background,
        outputFormat: selectedGenerationPreset.outputFormat,
      });

      const nextGeneratedIds = ((result as any)?.generated ?? []).map((image: any) => String(image.imageId));
      setLatestGeneratedImageIds(nextGeneratedIds);
      setActiveGalleryBucket("generated");
      toast({
        title: "Generation complete",
        description: `${nextGeneratedIds.length || generationOutputCount} generated ${generationOutputCount === 1 ? "image" : "images"} added to source assets.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate asset images.";
      setGenerationError(message);
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-background/20 p-3 md:p-4">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[168px_minmax(0,1fr)]">
        <div className="grid w-full min-w-0 content-start gap-3 lg:max-w-[168px]">
          {primaryFields.map((field) => {
            const activeImage = getActiveImageForField(field.field);
            const activeImageKey = activeImage?.id || activeImage?.url || null;
            return (
            <PrimaryAssetTile
              key={field.field}
              field={field}
              activeImage={activeImage}
              isUploading={uploadingField === field.field}
              isDeleting={deletingField === field.field}
              isRenaming={renamingImageId === activeImageKey}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onRenameImage={handleRenameImage}
            />
            );
          })}
        </div>
        <AssetGalleryPanel
          activeBucket={activeGalleryBucket}
          onBucketChange={setActiveGalleryBucket}
          allImages={allGalleryImages}
          sourceImages={sourceImages}
          generatedImages={generatedImages}
          activeGoodImage={activeGoodImage}
          activeBadImage={activeBadImage}
          supportsSourceGallery={supportsSourceGallery}
          canUseGeneration={canUseGeneration}
          generationWorkbench={
            canUseGeneration
              ? {
                  presets: generationPresets,
                  selectedPresetKey: selectedGenerationPreset?.key ?? "",
                  prompt: generationPrompt,
                  outputCount: generationOutputCount,
                  selectedImages: selectedGenerationImages,
                  isGenerating: isGeneratingAsset,
                  error: generationError,
                  onPresetChange: setGenerationPresetKey,
                  onPromptChange: setGenerationPrompt,
                  onOutputCountChange: setGenerationOutputCount,
                  onGenerate: handleGenerateAsset,
                  onClearInputs: () => setSelectedGenerationInputIds([]),
                  onRemoveInput: handleToggleGenerationInput,
                  onDropAssetImage: handleDropGenerationImage,
                }
              : null
          }
          selectedGenerationInputIds={selectedGenerationInputIds}
          latestGeneratedImageIds={latestGeneratedImageIds}
          hiddenPlaceholderCount={hiddenPlaceholderCount}
          uploadingBucket={uploadingBucket ?? (uploadingField === "bad_pic_url" ? "bad" : null)}
          deletingImageId={deletingImageId}
          selectingImageId={selectingImageId}
          selectingImageType={selectingImageType}
          renamingImageId={renamingImageId}
          onToggleGenerationInput={handleToggleGenerationInput}
          onUpload={handleGalleryUpload}
          onPromoteImage={handlePromoteGalleryImage}
          onDeleteImage={handleDeleteGalleryImage}
          onRenameImage={handleRenameImage}
        />
      </div>
    </div>
  );
}

export default SharedItemAssetsPanel;
