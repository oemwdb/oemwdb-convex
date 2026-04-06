import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
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
import { Plus, X } from "lucide-react";
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

const WheelHeader = ({
  name,
  brand,
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
  const wheelsUpdate = useMutation(api.mutations.wheelsUpdate);
  const [imageError, setImageError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [localName, setLocalName] = useState(name);
  const [localSpecs, setLocalSpecs] = useState<WheelSpecState>(() => normalizeSpecState(specs));
  const [openEditorField, setOpenEditorField] = useState<SpecFieldKey | null>(null);
  const [tagSearch, setTagSearch] = useState("");

  const filterOptions = useQuery(
    api.queries.wheelsFilterOptions,
    showAdminControls ? {} : "skip"
  ) ?? DEFAULT_FILTER_OPTIONS;

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  useEffect(() => {
    setLocalSpecs(normalizeSpecState(specs));
  }, [specs]);

  const candidates =
    getMediaUrlCandidates(goodPicUrl, "oemwdb images").length > 0
      ? getMediaUrlCandidates(goodPicUrl, "oemwdb images")
      : isDevMode && getMediaUrlCandidates(badPicUrl, "BADPICS").length > 0
        ? getMediaUrlCandidates(badPicUrl, "BADPICS")
        : getMediaUrlCandidates(image, "oemwdb images");

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

  const handleWheelTitleEdit = async (event: React.MouseEvent) => {
    if (!showAdminControls || !convexId) return;
    event.preventDefault();
    event.stopPropagation();
    const nextValue = window.prompt("Edit wheel title", localName);
    if (nextValue == null) return;
    const cleanedValue = nextValue.trim();
    if (!cleanedValue || cleanedValue === localName) return;
    const previous = localName;
    setLocalName(cleanedValue);
    try {
      await wheelsUpdate({
        id: convexId as Id<"oem_wheels">,
        wheel_title: cleanedValue,
      });
    } catch (error) {
      setLocalName(previous);
      toast.error(error instanceof Error ? error.message : "Failed to update wheel title.");
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
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-4">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-48 md:w-56">
            <AspectRatio ratio={1} className="relative overflow-hidden rounded-lg bg-muted group">
              {finalImageUrl ? (
                <img
                  src={finalImageUrl}
                  alt={localName}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-center text-xs px-2">No image available</span>
                </div>
              )}
            </AspectRatio>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <div className="flex items-start gap-2">
                <h1
                  className={showAdminControls ? "cursor-text text-2xl md:text-3xl font-bold leading-tight" : "text-2xl md:text-3xl font-bold leading-tight"}
                  onDoubleClick={handleWheelTitleEdit}
                  title={showAdminControls ? "Double-click to edit title" : undefined}
                >
                  {localName}
                </h1>
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
              <p className="text-sm text-muted-foreground mt-0.5">{brand}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {specRows.map((row) => {
                if (row.kind === "placeholder") {
                  return (
                    <div key={row.key} className="flex items-start gap-2">
                      <span className="font-medium text-muted-foreground min-w-[90px]">
                        {row.label || "Placeholder"}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="opacity-50 text-xs py-0 h-8">
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
                  <div key={field} className={`flex items-start gap-2 ${config.className ?? ""}`}>
                    <span className="font-medium text-muted-foreground min-w-[90px]">{config.label}:</span>
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
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/15 text-orange-300 transition-colors hover:bg-orange-500/25"
                            title={`Add ${config.label.toLowerCase()}`}
                          >
                            <Plus className="h-4 w-4" />
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
                              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs h-8"
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
                              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-0 h-8">
                                {value}
                              </Badge>
                            </Link>
                          )
                        )
                      ) : (
                        <Badge variant="outline" className="opacity-50 text-xs py-0 h-8">
                          {config.emptyLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelHeader;
