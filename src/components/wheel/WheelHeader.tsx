import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { AdminEditableItemTitle } from "@/components/item-page/AdminEditableItemTitle";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useDevMode } from "@/contexts/DevModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { SaveButton } from "@/components/SaveButton";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";
import { useWheelRotation } from "@/hooks/useWheelRotation";
import { Copy, Download, Plus, X } from "lucide-react";
import type { ItemPageFieldLayoutItem } from "@/types/itemPageLayout";
import {
  normalizeWheelHeaderFieldLayout,
  type WheelHeaderFieldKey,
  WHEEL_HEADER_FIELD_CONFIG,
} from "@/lib/wheelHeaderFields";

interface WheelHeaderProps {
  name: string;
  brand: string;
  price: string;
  description: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
  image?: string;
  specs: {
    diameter_refs: string[];
    width_ref: string[];
    offset: string;
    offset_refs?: string[];
    bolt_pattern_refs: string[];
    center_bore_ref: string[];
    color_refs: string[];
    tire_size_refs?: string[];
  };
  itemId?: string;
  convexId?: string;
  compact?: boolean;
  fieldLayout?: ItemPageFieldLayoutItem[];
}

type WheelSpecState = Record<WheelHeaderFieldKey, string[]>;

const DEFAULT_FILTER_OPTIONS = {
  brands: [] as string[],
  diameters: [] as string[],
  widths: [] as string[],
  boltPatterns: [] as string[],
  centerBores: [] as string[],
  tireSizes: [] as string[],
  colors: [] as string[],
};

function splitTagValues(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .flatMap((value) => String(value ?? "").split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function normalizeSpecState(specs: WheelHeaderProps["specs"]): WheelSpecState {
  return {
    diameter_refs: splitTagValues(specs.diameter_refs),
    width_ref: splitTagValues(specs.width_ref),
    offset_refs: splitTagValues([...(specs.offset_refs ?? []), specs.offset]),
    bolt_pattern_refs: splitTagValues(specs.bolt_pattern_refs),
    center_bore_ref: splitTagValues(specs.center_bore_ref),
    color_refs: splitTagValues(specs.color_refs),
    tire_size_refs: splitTagValues(specs.tire_size_refs ?? []),
  };
}

function imageFilename(name: string, imageUrl: string, contentType?: string | null) {
  const fromUrl = imageUrl.split("?")[0]?.split("/").pop() ?? "";
  const urlExtension = fromUrl.includes(".") ? fromUrl.split(".").pop() : "";
  const typeExtension = contentType?.split("/")[1]?.split(";")[0];
  const extension = (urlExtension || typeExtension || "png").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const safeName = (name || "wheel-image")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "wheel-image"}.${extension || "png"}`;
}

const WheelHeader = ({
  name,
  brand,
  description,
  goodPicUrl,
  badPicUrl,
  image,
  specs,
  itemId,
  convexId,
  fieldLayout,
}: WheelHeaderProps) => {
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const showAdminControls = isAdmin && isDevMode && Boolean(convexId);
  const { handleMouseEnter: handleWheelMouseEnter, handleMouseLeave: handleWheelMouseLeave, wheelImageRef } = useWheelRotation();
  const wheelsUpdate = useMutation(api.mutations.wheelsUpdate);
  const [imageError, setImageError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [localSpecs, setLocalSpecs] = useState<WheelSpecState>(() => normalizeSpecState(specs));
  const [openEditorField, setOpenEditorField] = useState<WheelHeaderFieldKey | null>(null);
  const [tagSearch, setTagSearch] = useState("");

  const filterOptions = useQuery(
    api.queries.wheelsFilterOptions,
    showAdminControls ? {} : "skip"
  ) ?? DEFAULT_FILTER_OPTIONS;

  useEffect(() => {
    setLocalSpecs(normalizeSpecState(specs));
  }, [specs]);

  const candidates = [
    ...getMediaUrlCandidates(goodPicUrl, "oemwdb images"),
    ...getMediaUrlCandidates(badPicUrl, "BADPICS"),
    ...getMediaUrlCandidates(image, "oemwdb images"),
  ].filter((candidate, index, all) => all.indexOf(candidate) === index);

  const handleImageError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      setImageError(false);
      return;
    }
    setImageError(true);
  };

  useEffect(() => {
    setCandidateIndex(0);
    setImageError(false);
  }, [goodPicUrl, badPicUrl, image, isDevMode]);

  const finalImageUrl = !imageError ? candidates[candidateIndex] ?? null : null;

  const fetchImageBlob = async () => {
    if (!finalImageUrl) return null;
    const response = await fetch(finalImageUrl);
    if (!response.ok) {
      throw new Error(`Image request failed (${response.status})`);
    }
    return await response.blob();
  };

  const handleCopyImage = async () => {
    if (!finalImageUrl) return;

    try {
      const blob = await fetchImageBlob();
      if (!blob || !navigator.clipboard || typeof window.ClipboardItem === "undefined") {
        throw new Error("Image clipboard is unavailable");
      }
      await navigator.clipboard.write([
        new window.ClipboardItem({
          [blob.type || "image/png"]: blob,
        }),
      ]);
      toast.success("Image copied");
    } catch {
      try {
        await navigator.clipboard.writeText(finalImageUrl);
        toast.success("Image URL copied");
      } catch {
        toast.error("Could not copy image");
      }
    }
  };

  const handleDownloadImage = async () => {
    if (!finalImageUrl) return;

    try {
      const blob = await fetchImageBlob();
      if (!blob) throw new Error("No image data");
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = imageFilename(name, finalImageUrl, blob.type);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const anchor = document.createElement("a");
      anchor.href = finalImageUrl;
      anchor.download = imageFilename(name, finalImageUrl);
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }
  };

  const saveSpecField = async (field: WheelHeaderFieldKey, nextValues: string[]) => {
    if (!convexId) return;
    const cleanedValues = splitTagValues(nextValues);
    const previous = localSpecs[field];
    setLocalSpecs((current) => ({ ...current, [field]: cleanedValues }));
    try {
      await wheelsUpdate({
        id: convexId as Id<"oem_wheels">,
        [WHEEL_HEADER_FIELD_CONFIG[field].mutationKey]: cleanedValues.join(", "),
      } as Parameters<typeof wheelsUpdate>[0]);
    } catch (error) {
      setLocalSpecs((current) => ({ ...current, [field]: previous }));
      toast.error(error instanceof Error ? error.message : "Failed to update wheel specs.");
    }
  };

  const handleTagEdit = async (field: WheelHeaderFieldKey, index: number) => {
    const currentValue = localSpecs[field][index];
    const nextValue = window.prompt(`Edit ${WHEEL_HEADER_FIELD_CONFIG[field].label.toLowerCase()}`, currentValue);
    if (nextValue == null) return;
    const replacementValues = splitTagValues([nextValue]);
    const nextValues = [...localSpecs[field]];
    nextValues.splice(index, 1, ...replacementValues);
    await saveSpecField(field, nextValues);
  };

  const handleTagDelete = async (field: WheelHeaderFieldKey, index: number) => {
    const nextValues = localSpecs[field].filter((_, valueIndex) => valueIndex !== index);
    await saveSpecField(field, nextValues);
  };

  const handleTagAdd = async (field: WheelHeaderFieldKey, rawValue: string) => {
    const nextValues = [...localSpecs[field], rawValue];
    await saveSpecField(field, nextValues);
    setTagSearch("");
    setOpenEditorField(null);
  };

  const availableOptionsByField = useMemo(
    () => ({
      diameter_refs: filterOptions.diameters,
      width_ref: filterOptions.widths,
      offset_refs: [] as string[],
      bolt_pattern_refs: filterOptions.boltPatterns,
      center_bore_ref: filterOptions.centerBores,
      color_refs: filterOptions.colors,
      tire_size_refs: filterOptions.tireSizes,
    }),
    [filterOptions]
  );

  const specRows = normalizeWheelHeaderFieldLayout(fieldLayout);

  return (
    <Card className="overflow-hidden rounded-[24px] animate-fade-in">
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-5">
              <div className="flex items-start gap-2">
                <AdminEditableItemTitle
                  title={name}
                  itemType="wheel"
                  convexId={convexId}
                  className="text-2xl font-bold leading-tight md:text-3xl"
                  inputClassName="h-11 rounded-xl border-white/15 bg-black/30 text-2xl font-bold leading-tight md:text-3xl"
                  placeholder="Untitled wheel"
                />
                {itemId && convexId ? (
                  <SaveButton
                    itemId={itemId}
                    itemType="wheel"
                    convexId={convexId}
                    iconStyle="heart"
                    className="mt-1 h-8 w-8 p-0 text-muted-foreground hover:!bg-transparent hover:text-foreground"
                  />
                ) : null}
              </div>
              <p className="mt-1 text-base text-muted-foreground">{brand}</p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {specRows.map((row) => {
                if (row.kind === "placeholder") {
                  return (
                    <div key={row.key} className="flex items-start gap-2 border-b border-border/60 pb-3">
                      <span className="min-w-[110px] font-medium text-muted-foreground">
                        {row.label || "Placeholder"}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="h-7 rounded-full px-2.5 py-0 text-[11px] opacity-50 transition-colors hover:border-white/70">
                          {row.emptyLabel || "Not wired yet"}
                        </Badge>
                      </div>
                    </div>
                  );
                }

                const field = row.key;
                const config = WHEEL_HEADER_FIELD_CONFIG[field];
                const values = localSpecs[field];
                const fieldOptions = availableOptionsByField[field] ?? [];
                const filteredSuggestions = fieldOptions.filter((value) => {
                  const normalizedSearch = tagSearch.trim().toLowerCase();
                  const normalizedValue = value.toLowerCase();
                  return (
                    (!normalizedSearch || normalizedValue.includes(normalizedSearch)) &&
                    !values.some((existing) => existing.toLowerCase() === normalizedValue)
                  );
                });

                return (
                  <div key={field} className={`flex items-start gap-2 border-b border-border/60 pb-3 ${config.className ?? ""}`}>
                    <span className="min-w-[110px] font-medium text-muted-foreground">{config.label}:</span>
                    {showAdminControls && (
                      <Popover
                        open={openEditorField === field}
                        onOpenChange={(open) => {
                          setOpenEditorField(open ? field : null);
                          if (!open) setTagSearch("");
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/15 text-orange-300 transition-colors hover:bg-orange-500/25"
                            title={`Add ${config.label.toLowerCase()}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[250px] p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder={`Search ${config.label.toLowerCase()}...`}
                              value={tagSearch}
                              onValueChange={setTagSearch}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="px-3 py-4 text-sm text-muted-foreground">
                                  Type a value and press the add row below.
                                </div>
                              </CommandEmpty>
                              {tagSearch.trim() && (
                                <CommandGroup heading="Add new">
                                  <CommandItem onSelect={() => void handleTagAdd(field, tagSearch.trim())}>
                                    Add "{tagSearch.trim()}"
                                  </CommandItem>
                                </CommandGroup>
                              )}
                              {filteredSuggestions.length > 0 && (
                                <CommandGroup heading="Suggestions">
                                  {filteredSuggestions.slice(0, 12).map((option) => (
                                    <CommandItem key={option} onSelect={() => void handleTagAdd(field, option)}>
                                      {option}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {values.length > 0 ? (
                        values.map((value, index) =>
                          showAdminControls ? (
                            <div
                              key={`${field}-${value}-${index}`}
                              className="inline-flex h-7 items-center gap-1 rounded-full border border-border px-2.5 py-0 text-[11px] transition-colors hover:border-white/90"
                            >
                              <button
                                type="button"
                                className="font-medium"
                                onDoubleClick={() => void handleTagEdit(field, index)}
                                title="Double-click to edit"
                              >
                                {value}
                              </button>
                              <button
                                type="button"
                                className="text-muted-foreground transition-colors hover:text-destructive"
                                onClick={() => void handleTagDelete(field, index)}
                                title={`Delete ${value}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <Link key={`${field}-${value}-${index}`} to={`/wheels?${config.queryParam}=${encodeURIComponent(value)}`}>
                              <Badge variant="outline" className="h-7 cursor-pointer rounded-full px-2.5 py-0 text-[11px] transition-colors hover:border-white/90">
                                {value}
                              </Badge>
                            </Link>
                          )
                        )
                      ) : (
                        <Badge variant="outline" className="h-7 rounded-full px-2.5 py-0 text-[11px] opacity-50 transition-colors hover:border-white/70">
                          {config.emptyLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="w-full">
            <AspectRatio ratio={1} className="relative overflow-hidden rounded-[24px] group">
              {finalImageUrl ? (
                <div className="flex h-full w-full items-center justify-center pt-[5%]">
                  {showAdminControls ? (
                    <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-black/75 text-white shadow-lg hover:bg-black"
                        title="Copy image"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void handleCopyImage();
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-black/75 text-white shadow-lg hover:bg-black"
                        title="Download image"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void handleDownloadImage();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                  <img
                    ref={wheelImageRef}
                    src={finalImageUrl}
                    alt={name}
                    className="max-h-[105%] max-w-[105%] object-contain will-change-transform"
                    onError={handleImageError}
                    onMouseEnter={handleWheelMouseEnter}
                    onMouseLeave={handleWheelMouseLeave}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-center text-xs px-2">No image available</span>
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelHeader;
