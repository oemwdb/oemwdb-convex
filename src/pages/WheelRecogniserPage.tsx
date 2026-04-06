import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WheelVariantsTable from "@/components/wheel/WheelVariantsTable";
import WheelRecogniserViewport, {
  type WheelRecogniserTransform,
} from "@/components/wheel-recogniser/WheelRecogniserViewport";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { PUBLIC_WHEEL_FALLBACK_IMAGE } from "@/lib/wheelImageFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { ConvexResourceStatusBadge } from "@/components/convex/ConvexResourceStatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import {
  CircleSlash2,
  Crosshair,
  Disc3,
  ExternalLink,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

type RecogniserFormState = {
  brand: string;
  diameter: string;
  width: string;
  boltPattern: string;
  centerBore: string;
  color: string;
  finish: string;
  spokeCount: string;
  styleTags: string[];
};

type SubmittedCriteria = {
  brand?: string;
  diameter?: string;
  width?: string;
  boltPattern?: string;
  centerBore?: string;
  color?: string;
  finish?: string;
  spokeCount?: number;
  styleTags?: string[];
  limit: number;
};

const INITIAL_FORM: RecogniserFormState = {
  brand: "",
  diameter: "",
  width: "",
  boltPattern: "",
  centerBore: "",
  color: "",
  finish: "",
  spokeCount: "",
  styleTags: [],
};

const INITIAL_TRANSFORM: WheelRecogniserTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

const SEARCH_LIMIT = 12;

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function buildFamilySpecChips(family: {
  tableData: {
    diameter?: string | null;
    width?: string | null;
    boltPattern?: string | null;
    centerBore?: string | null;
  };
}) {
  return [
    family.tableData.diameter ? `Diameter ${family.tableData.diameter}` : null,
    family.tableData.width ? `Width ${family.tableData.width}` : null,
    family.tableData.boltPattern ? `Bolt ${family.tableData.boltPattern}` : null,
    family.tableData.centerBore ? `CB ${family.tableData.centerBore}` : null,
  ].filter(Boolean) as string[];
}

export default function WheelRecogniserPage() {
  const optionsResource = useConvexResourceQuery<any>({
    queryKey: ["wheelRecogniser", "formOptions"],
    queryRef: api.wheelRecogniser.formOptionsGet,
    args: {},
    staleTime: 60_000,
  });
  const [form, setForm] = useState<RecogniserFormState>(INITIAL_FORM);
  const [styleTagDraft, setStyleTagDraft] = useState("");
  const [submittedCriteria, setSubmittedCriteria] = useState<SubmittedCriteria | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [transform, setTransform] = useState<WheelRecogniserTransform>(INITIAL_TRANSFORM);
  const resultsResource = useConvexResourceQuery<any>({
    queryKey: ["wheelRecogniser", "search"],
    queryRef: api.wheelRecogniser.search,
    args: submittedCriteria ?? "skip",
    staleTime: 30_000,
  });
  const options = optionsResource.data;
  const results = resultsResource.data;

  useEffect(() => {
    return () => {
      if (localImageUrl) {
        URL.revokeObjectURL(localImageUrl);
      }
    };
  }, [localImageUrl]);

  useEffect(() => {
    const families = results?.families ?? [];
    if (families.length === 0) {
      setSelectedFamilyId(null);
      return;
    }
    if (!selectedFamilyId || !families.some((family) => family.wheelId === selectedFamilyId)) {
      setSelectedFamilyId(families[0].wheelId);
    }
  }, [results, selectedFamilyId]);

  const selectedFamily = (results?.families ?? []).find(
    (family) => family.wheelId === selectedFamilyId
  ) ?? null;

  const suggestionTags = options?.styleTags ?? [];

  const applyImage = (file: File) => {
    if (localImageUrl) {
      URL.revokeObjectURL(localImageUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setLocalImageUrl(nextUrl);
    setUploadName(file.name);
    setTransform(INITIAL_TRANSFORM);
  };

  const addStyleTag = (rawValue: string) => {
    const next = rawValue.trim();
    if (!next) return;
    setForm((current) => {
      const exists = current.styleTags.some((tag) => normalizeTag(tag) === normalizeTag(next));
      if (exists) return current;
      return { ...current, styleTags: [...current.styleTags, next] };
    });
    setStyleTagDraft("");
  };

  const toggleSuggestionTag = (value: string) => {
    setForm((current) => {
      const exists = current.styleTags.some((tag) => normalizeTag(tag) === normalizeTag(value));
      return {
        ...current,
        styleTags: exists
          ? current.styleTags.filter((tag) => normalizeTag(tag) !== normalizeTag(value))
          : [...current.styleTags, value],
      };
    });
  };

  const removeStyleTag = (value: string) => {
    setForm((current) => ({
      ...current,
      styleTags: current.styleTags.filter((tag) => normalizeTag(tag) !== normalizeTag(value)),
    }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedCriteria({
      ...(form.brand.trim() ? { brand: form.brand.trim() } : {}),
      ...(form.diameter.trim() ? { diameter: form.diameter.trim() } : {}),
      ...(form.width.trim() ? { width: form.width.trim() } : {}),
      ...(form.boltPattern.trim() ? { boltPattern: form.boltPattern.trim() } : {}),
      ...(form.centerBore.trim() ? { centerBore: form.centerBore.trim() } : {}),
      ...(form.color.trim() ? { color: form.color.trim() } : {}),
      ...(form.finish.trim() ? { finish: form.finish.trim() } : {}),
      ...(form.spokeCount.trim() ? { spokeCount: Number(form.spokeCount.trim()) } : {}),
      ...(form.styleTags.length > 0 ? { styleTags: form.styleTags } : {}),
      limit: SEARCH_LIMIT,
    });
  };

  const clearSearch = () => {
    setForm(INITIAL_FORM);
    setStyleTagDraft("");
    setSubmittedCriteria(null);
    setSelectedFamilyId(null);
  };

  const clearImage = () => {
    if (localImageUrl) {
      URL.revokeObjectURL(localImageUrl);
    }
    setLocalImageUrl(null);
    setUploadName(null);
    setTransform(INITIAL_TRANSFORM);
  };

  const matchingFamilies = results?.families ?? [];
  const resultsLoading = submittedCriteria !== null && resultsResource.isInitialLoading;
  const searchMode = results?.searchMode ?? "match";
  const isBrowseMode = searchMode === "browse";
  const appliedCriteriaCount = results?.appliedCriteriaCount ?? 0;
  const activeStatus =
    submittedCriteria !== null && !resultsResource.isIdle
      ? resultsResource.status
      : optionsResource.status;

  if (optionsResource.isInitialLoading) {
    return (
      <DashboardLayout title="Wheel Recogniser" showFilterButton={false} disableContentPadding={true}>
        <div className="flex h-full items-center justify-center p-2">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (optionsResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Wheel Recogniser" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <ConvexBackendUnavailableCard
            title="Wheel recogniser is not deployed on cloud dev yet"
            description="The canonical `wheelRecogniser.formOptionsGet` query is missing from the cloud dev Convex deployment."
            error={optionsResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (optionsResource.error) {
    return (
      <DashboardLayout title="Wheel Recogniser" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto p-2">
          <Card className="border-border/60 bg-card/95">
            <CardContent className="space-y-3 p-8 text-center">
              <CircleSlash2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Could not load wheel recogniser options</h2>
                <p className="text-sm text-muted-foreground">{getConvexErrorMessage(optionsResource.error)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Wheel Recogniser"
      showFilterButton={false}
      disableContentPadding={true}
      headerActions={
        <ConvexResourceStatusBadge
          status={activeStatus}
          label={
            submittedCriteria !== null && !resultsResource.isIdle
              ? "Refreshing recognition results"
              : "Refreshing wheel recogniser"
          }
        />
      }
    >
      <div className="h-full overflow-y-auto p-2 space-y-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_380px]">
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crosshair className="h-5 w-5" />
                Align wheel photo
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload a wheel photo, then drag and scale it until the rim sits cleanly inside the circular guide.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <WheelRecogniserViewport
                imageUrl={localImageUrl}
                transform={transform}
                onTransformChange={setTransform}
                onImageSelect={applyImage}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label>Zoom</Label>
                    <span className="text-muted-foreground">{transform.scale.toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[transform.scale]}
                    min={0.6}
                    max={2.4}
                    step={0.01}
                    onValueChange={([scale]) => setTransform((current) => ({ ...current, scale }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label>Rotate</Label>
                    <span className="text-muted-foreground">{transform.rotation}°</span>
                  </div>
                  <Slider
                    value={[transform.rotation]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={([rotation]) => setTransform((current) => ({ ...current, rotation }))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setTransform(INITIAL_TRANSFORM)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset framing
                </Button>
                {localImageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-muted-foreground hover:text-foreground"
                    onClick={clearImage}
                  >
                    Clear image
                  </Button>
                )}
                {uploadName && (
                  <Badge variant="outline" className="rounded-full border-border/60 px-3 py-1 text-xs">
                    {uploadName}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5" />
                Known wheel attributes
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                V1 matching is metadata-first. The image helps you align and visually compare candidates.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSearch}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-brand">Brand</Label>
                    <Input
                      id="recogniser-brand"
                      list="recogniser-brand-options"
                      value={form.brand}
                      onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
                      placeholder="BMW, Mercedes-Benz..."
                    />
                    <datalist id="recogniser-brand-options">
                      {(options?.brands ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-spokes">Spoke count</Label>
                    <Input
                      id="recogniser-spokes"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      list="recogniser-spoke-options"
                      value={form.spokeCount}
                      onChange={(event) => setForm((current) => ({ ...current, spokeCount: event.target.value }))}
                      placeholder="5, 10, 20..."
                    />
                    <datalist id="recogniser-spoke-options">
                      {(options?.spokeCounts ?? []).map((value) => (
                        <option key={value} value={String(value)} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-diameter">Diameter</Label>
                    <Input
                      id="recogniser-diameter"
                      list="recogniser-diameter-options"
                      value={form.diameter}
                      onChange={(event) => setForm((current) => ({ ...current, diameter: event.target.value }))}
                      placeholder="18"
                    />
                    <datalist id="recogniser-diameter-options">
                      {(options?.diameters ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-width">Width</Label>
                    <Input
                      id="recogniser-width"
                      list="recogniser-width-options"
                      value={form.width}
                      onChange={(event) => setForm((current) => ({ ...current, width: event.target.value }))}
                      placeholder="8.5"
                    />
                    <datalist id="recogniser-width-options">
                      {(options?.widths ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-bolt-pattern">Bolt pattern</Label>
                    <Input
                      id="recogniser-bolt-pattern"
                      list="recogniser-bolt-pattern-options"
                      value={form.boltPattern}
                      onChange={(event) => setForm((current) => ({ ...current, boltPattern: event.target.value }))}
                      placeholder="5x112"
                    />
                    <datalist id="recogniser-bolt-pattern-options">
                      {(options?.boltPatterns ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-center-bore">Center bore</Label>
                    <Input
                      id="recogniser-center-bore"
                      list="recogniser-center-bore-options"
                      value={form.centerBore}
                      onChange={(event) => setForm((current) => ({ ...current, centerBore: event.target.value }))}
                      placeholder="66.6"
                    />
                    <datalist id="recogniser-center-bore-options">
                      {(options?.centerBores ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-color">Color</Label>
                    <Input
                      id="recogniser-color"
                      list="recogniser-color-options"
                      value={form.color}
                      onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                      placeholder="Silver, bronze..."
                    />
                    <datalist id="recogniser-color-options">
                      {(options?.colors ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recogniser-finish">Finish</Label>
                    <Input
                      id="recogniser-finish"
                      list="recogniser-finish-options"
                      value={form.finish}
                      onChange={(event) => setForm((current) => ({ ...current, finish: event.target.value }))}
                      placeholder="Machined, gloss black..."
                    />
                    <datalist id="recogniser-finish-options">
                      {(options?.finishes ?? []).map((value) => (
                        <option key={value} value={value} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recogniser-style-tag">Style clues</Label>
                  <div className="flex gap-2">
                    <Input
                      id="recogniser-style-tag"
                      value={styleTagDraft}
                      onChange={(event) => setStyleTagDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          addStyleTag(styleTagDraft);
                        }
                      }}
                      placeholder="Add clue like mesh, twin spoke, turbine..."
                    />
                    <Button type="button" variant="outline" onClick={() => addStyleTag(styleTagDraft)}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.styleTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-primary/20"
                        onClick={() => removeStyleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {suggestionTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {suggestionTags.map((tag) => {
                        const active = form.styleTags.some((value) => normalizeTag(value) === normalizeTag(tag));
                        return (
                          <Button
                            key={tag}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={active ? "border-primary/50 bg-primary/10" : ""}
                            onClick={() => toggleSuggestionTag(tag)}
                          >
                            {tag}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Textarea
                  value={[
                    "Search notes",
                    "Best confidence comes from diameter, bolt pattern, width, center bore, finish, and spoke clues.",
                    "If you leave everything blank, this falls back to browse mode and surfaces image-backed wheel families first.",
                  ].join("\n")}
                  readOnly
                  className="min-h-[74px] resize-none bg-muted/20 text-xs text-muted-foreground"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" className="rounded-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search wheel database
                  </Button>
                  <Button type="button" variant="ghost" className="rounded-full" onClick={clearSearch}>
                    Clear filters
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {!submittedCriteria ? (
            <Card className="border-dashed border-border/60 bg-card/30">
              <CardContent className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
                <Disc3 className="h-10 w-10 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">Start with what you know</p>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Add a few fitment clues, upload a photo if you have one, and we’ll rank the most likely wheel families with confidence reasons.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : resultsLoading ? (
            <Card className="border-border/60 bg-card/40">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-lg font-semibold text-foreground">Matching against wheel families</p>
                <p className="text-sm text-muted-foreground">
                  We’re ranking wheels and their top variants from the current OEM dataset.
                </p>
              </CardContent>
            </Card>
          ) : resultsResource.isBackendUnavailable ? (
            <ConvexBackendUnavailableCard
              title="Wheel recogniser search is not deployed on cloud dev yet"
              description="The canonical `wheelRecogniser.search` query is missing from the cloud dev Convex deployment."
              error={resultsResource.error}
            />
          ) : resultsResource.error ? (
            <Card className="border-border/60 bg-card/95">
              <CardContent className="space-y-3 p-8 text-center">
                <CircleSlash2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">Could not load wheel matches</h2>
                  <p className="text-sm text-muted-foreground">{getConvexErrorMessage(resultsResource.error)}</p>
                </div>
              </CardContent>
            </Card>
          ) : matchingFamilies.length === 0 ? (
            <Card className="border-border/60 bg-card/40">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground">No confident matches yet</p>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Try loosening one or two fields, or add better fitment clues like bolt pattern and diameter before searching again.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {selectedFamily && (
              <Card className="border-border/60 bg-card/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span>{isBrowseMode ? "Selected family" : "Top comparison"}</span>
                      {isBrowseMode ? (
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                          Browse mode
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="rounded-full border-primary/40 px-3 py-1 text-sm">
                          {selectedFamily.confidence}% confidence
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Your aligned upload</p>
                        <WheelRecogniserViewport
                          imageUrl={localImageUrl}
                          transform={transform}
                          onTransformChange={() => undefined}
                          onImageSelect={() => undefined}
                          interactive={false}
                          title="No upload yet"
                          helperText="You can still search without a photo in v1."
                        />
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/25">
                          <div className="aspect-square bg-muted">
                            <img
                              src={selectedFamily.imageUrl || PUBLIC_WHEEL_FALLBACK_IMAGE}
                              alt={selectedFamily.wheelTitle}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-2xl font-semibold text-foreground">{selectedFamily.wheelTitle}</h2>
                              {selectedFamily.brandName && (
                                <Badge variant="secondary" className="rounded-full">
                                  {selectedFamily.brandName}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isBrowseMode
                                ? "Browse mode surfaces image-backed wheel families first. Add fitment or style clues to turn this into a scored match."
                                : selectedFamily.summary}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {buildFamilySpecChips(selectedFamily).map((chip) => (
                              <Badge key={chip} variant="outline" className="rounded-full border-border/60 bg-background/40">
                                {chip}
                              </Badge>
                            ))}
                            {!isBrowseMode &&
                              selectedFamily.matchedOn.map((reason) => (
                                <Badge key={reason} variant="outline" className="rounded-full border-primary/30 bg-primary/5">
                                  {reason}
                                </Badge>
                              ))}
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                            <p className="mb-3 text-sm font-medium text-foreground">
                              {isBrowseMode ? "Representative variants" : "Top matching variants"}
                            </p>
                            {selectedFamily.topVariants.length > 0 ? (
                              <div className="space-y-3">
                                {selectedFamily.topVariants.map((variant) => (
                                  <div
                                    key={variant.variantId}
                                    className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/10 p-3"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <p className="font-medium text-foreground">{variant.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {[variant.finish, variant.diameter && `${variant.diameter}"`, variant.width && `${variant.width}J`]
                                            .filter(Boolean)
                                          .join(" • ")}
                                        </p>
                                      </div>
                                      {!isBrowseMode && (
                                        <Badge variant="outline" className="rounded-full border-primary/40">
                                          {variant.confidence}%
                                        </Badge>
                                      )}
                                    </div>
                                    {!isBrowseMode && variant.matchedOn.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        {variant.matchedOn.map((reason) => (
                                          <Badge key={reason} variant="secondary" className="rounded-full">
                                            {reason}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {isBrowseMode
                                  ? "No linked variants with useful preview data were found for this family yet."
                                  : "This family matched strongly on its parent-wheel metadata, but no linked variants outscored the family itself."}
                              </p>
                            )}
                          </div>
                          <Button asChild variant="outline" className="rounded-full">
                            <Link to={`/wheel/${encodeURIComponent(String(selectedFamily.wheelRouteId))}`}>
                              Open wheel page
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-foreground">Family variant matrix</h3>
                        <p className="text-sm text-muted-foreground">
                          Wheel families first, with nested variants ranked underneath.
                        </p>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/30 p-4">
                        <WheelVariantsTable
                          wheelName={selectedFamily.wheelTitle}
                          diameter={selectedFamily.tableData.diameter}
                          width={selectedFamily.tableData.width}
                          offset={selectedFamily.tableData.offset}
                          boltPattern={selectedFamily.tableData.boltPattern}
                          centerBore={selectedFamily.tableData.centerBore}
                          weight={selectedFamily.tableData.weight}
                          tireSize={selectedFamily.tableData.tireSize}
                          partNumbers={selectedFamily.tableData.partNumbers}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/60 bg-card/40">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>{isBrowseMode ? "Browse wheel families" : "Ranked wheel families"}</span>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {isBrowseMode
                        ? `${matchingFamilies.length} image-backed families`
                        : `${matchingFamilies.length} matches from ${results?.totalFamiliesConsidered ?? 0} families`}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isBrowseMode
                      ? "This is a visual browse pass. Add known wheel clues to turn the list into scored recognition results."
                      : `${appliedCriteriaCount} recognition clue${appliedCriteriaCount === 1 ? "" : "s"} applied.`}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {matchingFamilies.map((family) => (
                      <button
                        key={family.wheelId}
                        type="button"
                        onClick={() => setSelectedFamilyId(family.wheelId)}
                        className={`overflow-hidden rounded-2xl border text-left transition-all ${
                          family.wheelId === selectedFamilyId
                            ? "border-primary/50 bg-primary/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                            : "border-border/60 bg-background/30 hover:border-primary/25 hover:bg-background/40"
                        }`}
                      >
                        <div className="aspect-[4/3] bg-muted">
                          <img
                            src={family.imageUrl || PUBLIC_WHEEL_FALLBACK_IMAGE}
                            alt={family.wheelTitle}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="line-clamp-2 text-lg font-semibold text-foreground">{family.wheelTitle}</p>
                              {family.brandName && <p className="text-sm text-muted-foreground">{family.brandName}</p>}
                            </div>
                            {isBrowseMode ? (
                              <Badge variant="secondary" className="rounded-full px-3 py-1">
                                Browse
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-full border-primary/40 px-3 py-1">
                                {family.confidence}%
                              </Badge>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {isBrowseMode ? "Image-backed family ready for visual comparison." : family.summary}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {isBrowseMode
                              ? buildFamilySpecChips(family).slice(0, 3).map((chip) => (
                                  <Badge key={chip} variant="secondary" className="rounded-full">
                                    {chip}
                                  </Badge>
                                ))
                              : family.matchedOn.slice(0, 4).map((reason) => (
                                  <Badge key={reason} variant="secondary" className="rounded-full">
                                    {reason}
                                  </Badge>
                                ))}
                          </div>
                          <div className="rounded-xl border border-border/50 bg-muted/10 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              {isBrowseMode ? "Representative variants" : "Best variants"}
                            </p>
                            {family.topVariants.length > 0 ? (
                              <div className="space-y-2">
                                {family.topVariants.map((variant) => (
                                  <div key={variant.variantId} className="flex items-start justify-between gap-3 text-sm">
                                    <div>
                                      <p className="font-medium text-foreground">{variant.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {[variant.finish, variant.offset && `ET ${variant.offset}`].filter(Boolean).join(" • ")}
                                      </p>
                                    </div>
                                    {!isBrowseMode && (
                                      <Badge variant="outline" className="rounded-full text-xs">
                                        {variant.confidence}%
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {isBrowseMode
                                  ? "No linked variants with usable preview data yet."
                                  : "No linked variants scored above the family baseline."}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
