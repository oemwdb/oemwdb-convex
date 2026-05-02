import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useQuery } from "convex/react";
import {
  CarFront,
  Copy,
  Disc3,
  Download,
  Image as ImageIcon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";
import { cn } from "@/lib/utils";

type AssetKind = "vehicle" | "wheel";
type AssetSource = "good" | "bad";
type MatteMode = "grid" | "black" | "white" | "transparent";

type VehicleRow = {
  _id: string;
  vehicle_title?: string | null;
  model_name?: string | null;
  generation?: string | null;
  brand_name?: string | null;
  text_brands?: string | null;
  production_years?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  text_bolt_patterns?: string | null;
  text_diameters?: string | null;
};

type WheelRow = {
  _id: string;
  wheel_title?: string | null;
  wheel_name?: string | null;
  model_name?: string | null;
  brand_name?: string | null;
  jnc_brands?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  diameter?: string | null;
  width?: string | null;
  bolt_pattern?: string | null;
};

type AssetRow = {
  id: string;
  kind: AssetKind;
  title: string;
  subtitle: string;
  detailA: string;
  detailB: string;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
};

type LocalAsset = {
  name: string;
  url: string;
};

type EditState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  cropX: number;
  cropY: number;
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
};

const DEFAULT_EDIT: EditState = {
  zoom: 100,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  cropX: 0,
  cropY: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
};

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "";
}

function vehicleTitle(row: VehicleRow) {
  return clean(row.vehicle_title) || clean(row.model_name) || clean(row.generation) || "Untitled vehicle";
}

function vehicleBrand(row: VehicleRow) {
  return clean(row.brand_name) || clean(row.text_brands) || "Unknown brand";
}

function wheelTitle(row: WheelRow) {
  return clean(row.wheel_title) || clean(row.wheel_name) || clean(row.model_name) || "Untitled wheel";
}

function wheelBrand(row: WheelRow) {
  return clean(row.brand_name) || clean(row.jnc_brands) || "Unknown brand";
}

function toVehicleAsset(row: VehicleRow): AssetRow {
  return {
    id: row._id,
    kind: "vehicle",
    title: vehicleTitle(row),
    subtitle: vehicleBrand(row),
    detailA: clean(row.production_years) || "years unknown",
    detailB: clean(row.text_bolt_patterns) || clean(row.text_diameters) || "specs unknown",
    good_pic_url: row.good_pic_url,
    bad_pic_url: row.bad_pic_url,
  };
}

function toWheelAsset(row: WheelRow): AssetRow {
  const size = [clean(row.diameter), clean(row.width)].filter(Boolean).join(" x ");
  return {
    id: row._id,
    kind: "wheel",
    title: wheelTitle(row),
    subtitle: wheelBrand(row),
    detailA: size || "size unknown",
    detailB: clean(row.bolt_pattern) || "bolt unknown",
    good_pic_url: row.good_pic_url,
    bad_pic_url: row.bad_pic_url,
  };
}

function rawAssetUrl(row: AssetRow, source: AssetSource) {
  return source === "good" ? clean(row.good_pic_url) : clean(row.bad_pic_url);
}

function resolveMediaUrl(url: string, source: AssetSource) {
  if (!url) return "";
  const bucketHint = source === "bad" ? "BADPICS" : "oemwdb images";
  return getMediaUrlCandidates(url, bucketHint)[0] ?? url;
}

function filterRows(rows: AssetRow[], search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows.slice(0, 72);

  return rows
    .filter((row) =>
      [
        row.title,
        row.subtitle,
        row.detailA,
        row.detailB,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    )
    .slice(0, 72);
}

function matteStyle(mode: MatteMode): CSSProperties {
  if (mode === "grid") {
    return {
      backgroundColor: "#111",
      backgroundImage:
        "linear-gradient(45deg, #242424 25%, transparent 25%), linear-gradient(-45deg, #242424 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #242424 75%), linear-gradient(-45deg, transparent 75%, #242424 75%)",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
      backgroundSize: "20px 20px",
    };
  }

  if (mode === "white") return { backgroundColor: "#f7f7f7" };
  if (mode === "transparent") return { backgroundColor: "transparent" };
  return { backgroundColor: "#050505" };
}

function imageFilter(edit: EditState) {
  const sharpenBoost = edit.sharpness * 0.12;
  return [
    `brightness(${edit.brightness}%)`,
    `contrast(${edit.contrast + sharpenBoost}%)`,
    `saturate(${edit.saturation}%)`,
  ].join(" ");
}

function imageTransform(edit: EditState) {
  return [
    `translate(${edit.offsetX}%, ${edit.offsetY}%)`,
    `scale(${edit.zoom / 100})`,
    `rotate(${edit.rotation}deg)`,
  ].join(" ");
}

function downloadUrl(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function loadImage(url: string) {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return image;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "%",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next ?? value)}
      />
    </label>
  );
}

function IconSegment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string; icon?: typeof ImageIcon }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-black p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              "flex h-9 items-center justify-center gap-2 rounded-sm px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground",
              active && "bg-white text-black hover:bg-white hover:text-black",
            )}
            onClick={() => onChange(option.value)}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AssetStudioPage() {
  const vehiclesData = useQuery(api.queries.vehiclesGetAllWithBrands, {}) as VehicleRow[] | undefined;
  const wheelsData = useQuery(api.queries.wheelsGetAllWithBrands, {}) as WheelRow[] | undefined;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [kind, setKind] = useState<AssetKind>("vehicle");
  const [source, setSource] = useState<AssetSource>("bad");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [matte, setMatte] = useState<MatteMode>("grid");
  const [edit, setEdit] = useState<EditState>(DEFAULT_EDIT);
  const [localAsset, setLocalAsset] = useState<LocalAsset | null>(null);
  const [activeInput, setActiveInput] = useState<"catalog" | "local">("catalog");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (localAsset?.url) URL.revokeObjectURL(localAsset.url);
    };
  }, [localAsset]);

  const catalogRows = useMemo(() => {
    const vehicles = (vehiclesData ?? []).map(toVehicleAsset);
    const wheels = (wheelsData ?? []).map(toWheelAsset);
    return kind === "vehicle" ? vehicles : wheels;
  }, [kind, vehiclesData, wheelsData]);

  const sourceRows = useMemo(
    () => catalogRows.filter((row) => rawAssetUrl(row, source)),
    [catalogRows, source],
  );

  const visibleRows = useMemo(
    () => filterRows(sourceRows, search),
    [sourceRows, search],
  );

  useEffect(() => {
    if (!visibleRows.length) {
      setSelectedId("");
      return;
    }

    if (!selectedId || !visibleRows.some((row) => row.id === selectedId)) {
      setSelectedId(visibleRows[0].id);
    }
  }, [selectedId, visibleRows]);

  const selectedRow = useMemo(
    () => visibleRows.find((row) => row.id === selectedId) ?? visibleRows[0] ?? null,
    [selectedId, visibleRows],
  );

  const selectedRawUrl = selectedRow ? rawAssetUrl(selectedRow, source) : "";
  const selectedUrl = selectedRawUrl ? resolveMediaUrl(selectedRawUrl, source) : "";
  const activeUrl = activeInput === "local" ? localAsset?.url ?? "" : selectedUrl;
  const activeTitle = activeInput === "local" ? localAsset?.name ?? "Local image" : selectedRow?.title ?? "No image";
  const activeSubtitle =
    activeInput === "local"
      ? "Local file"
      : [selectedRow?.subtitle, source === "bad" ? "Bad pic" : "Good pic"].filter(Boolean).join(" • ");

  const setEditValue = (key: keyof EditState, value: number) => {
    setEdit((current) => ({ ...current, [key]: value }));
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setLocalAsset((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return { name: file.name, url: URL.createObjectURL(file) };
    });
    setActiveInput("local");
  };

  const copyActiveUrl = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    toast.success("Image URL copied");
  };

  const downloadSource = () => {
    if (!activeUrl) return;
    const safeName = activeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
    downloadUrl(activeUrl, `${safeName}-${source}.png`);
  };

  const downloadPreview = async () => {
    if (!activeUrl) return;

    try {
      const image = await loadImage(activeUrl);
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      if (matte === "black") {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (matte === "white") {
        ctx.fillStyle = "#f7f7f7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const cropInsetX = canvas.width * (edit.cropX / 100);
      const cropInsetY = canvas.height * (edit.cropY / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        cropInsetX,
        cropInsetY,
        canvas.width - cropInsetX * 2,
        canvas.height - cropInsetY * 2,
      );
      ctx.clip();

      const maxWidth = canvas.width * 0.82;
      const maxHeight = canvas.height * 0.72;
      const fit = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
      const width = image.naturalWidth * fit * (edit.zoom / 100);
      const height = image.naturalHeight * fit * (edit.zoom / 100);
      const x = canvas.width / 2 + canvas.width * (edit.offsetX / 100);
      const y = canvas.height / 2 + canvas.height * (edit.offsetY / 100);

      ctx.translate(x, y);
      ctx.rotate((edit.rotation * Math.PI) / 180);
      ctx.filter = imageFilter(edit);
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      const safeName = activeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
      downloadUrl(dataUrl, `${safeName}-preview.png`);
      toast.success("Preview exported");
    } catch {
      toast.error("Preview export failed");
    }
  };

  const isLoading = vehiclesData === undefined || wheelsData === undefined;

  return (
    <DashboardLayout
      title="Asset Studio"
      showSearch={false}
      disableContentPadding
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full border-border bg-black"
            onClick={() => setEdit(DEFAULT_EDIT)}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-full"
            onClick={downloadPreview}
            disabled={!activeUrl}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      }
    >
      <div className="grid h-full min-h-0 grid-cols-[320px_minmax(0,1fr)_320px] overflow-hidden bg-background">
        <aside className="flex min-h-0 flex-col border-r border-border bg-black">
          <div className="space-y-3 border-b border-border p-3">
            <IconSegment
              value={kind}
              onChange={(next) => {
                setKind(next);
                setActiveInput("catalog");
              }}
              options={[
                { value: "vehicle", label: "Vehicles", icon: CarFront },
                { value: "wheel", label: "Wheels", icon: Disc3 },
              ]}
            />

            <IconSegment
              value={source}
              onChange={(next) => {
                setSource(next);
                setActiveInput("catalog");
              }}
              options={[
                { value: "bad", label: "Bad pic" },
                { value: "good", label: "Good pic" },
              ]}
            />

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-10 rounded-md border-border bg-background pl-9"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading images
              </div>
            ) : visibleRows.length ? (
              <div className="space-y-1">
                {visibleRows.map((row) => {
                  const thumbUrl = resolveMediaUrl(rawAssetUrl(row, source), source);
                  const active = activeInput === "catalog" && row.id === selectedRow?.id;

                  return (
                    <button
                      key={row.id}
                      type="button"
                      className={cn(
                        "grid w-full grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-md border border-transparent p-2 text-left transition-colors hover:bg-white/10",
                        active && "border-white bg-white text-black hover:bg-white",
                      )}
                      onClick={() => {
                        setSelectedId(row.id);
                        setActiveInput("catalog");
                      }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-border bg-neutral-900">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 self-center">
                        <div className="truncate text-sm font-semibold">{row.title}</div>
                        <div className={cn("truncate text-xs text-muted-foreground", active && "text-black/60")}>
                          {row.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                No {source === "bad" ? "bad" : "good"} pics found
              </div>
            )}
          </div>

          <div
            className={cn(
              "m-3 rounded-md border border-dashed border-border bg-background/60 p-3 transition-colors",
              isDragging && "border-orange-400 bg-orange-500/10",
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full border-border bg-black"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Browse image
            </Button>
          </div>
        </aside>

        <section className="relative flex min-h-0 flex-col overflow-hidden bg-[#141414]">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">{activeTitle}</h1>
              <p className="truncate text-xs text-muted-foreground">{activeSubtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-border bg-black"
                onClick={copyActiveUrl}
                disabled={!activeUrl}
                title="Copy URL"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-border bg-black"
                onClick={downloadSource}
                disabled={!activeUrl}
                title="Download source"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="relative m-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md border border-border"
            style={matteStyle(matte)}
          >
            <div
              className="relative h-[78%] w-[84%] overflow-hidden"
              style={{ clipPath: `inset(${edit.cropY}% ${edit.cropX}%)` }}
            >
              {activeUrl ? (
                <img
                  src={activeUrl}
                  alt={activeTitle}
                  className="h-full w-full object-contain will-change-transform"
                  style={{
                    filter: imageFilter(edit),
                    transform: imageTransform(edit),
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Select an image
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute inset-12 rounded border border-white/10" />
            <div className="pointer-events-none absolute left-1/2 top-8 h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-white/10" />
            <div className="pointer-events-none absolute left-8 top-1/2 h-px w-[calc(100%-4rem)] -translate-y-1/2 bg-white/10" />
          </div>
        </section>

        <aside className="flex min-h-0 flex-col overflow-y-auto border-l border-border bg-black p-3">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-orange-300" />
            Adjustments
          </div>

          <div className="space-y-5">
            <section className="space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Matte</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["grid", "Grid"],
                  ["black", "Black"],
                  ["white", "White"],
                  ["transparent", "Clear"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "h-9 rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground",
                      matte === value && "border-orange-400 bg-orange-500/15 text-orange-200",
                    )}
                    onClick={() => setMatte(value as MatteMode)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Frame
              </div>
              <SliderControl label="Zoom" value={edit.zoom} min={40} max={220} onChange={(value) => setEditValue("zoom", value)} />
              <SliderControl label="X" value={edit.offsetX} min={-50} max={50} suffix="" onChange={(value) => setEditValue("offsetX", value)} />
              <SliderControl label="Y" value={edit.offsetY} min={-50} max={50} suffix="" onChange={(value) => setEditValue("offsetY", value)} />
              <SliderControl label="Rotation" value={edit.rotation} min={-12} max={12} step={0.25} suffix="deg" onChange={(value) => setEditValue("rotation", value)} />
              <SliderControl label="Crop X" value={edit.cropX} min={0} max={28} onChange={(value) => setEditValue("cropX", value)} />
              <SliderControl label="Crop Y" value={edit.cropY} min={0} max={28} onChange={(value) => setEditValue("cropY", value)} />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                <Wand2 className="h-3.5 w-3.5" />
                Polish
              </div>
              <SliderControl label="Brightness" value={edit.brightness} min={60} max={140} onChange={(value) => setEditValue("brightness", value)} />
              <SliderControl label="Contrast" value={edit.contrast} min={60} max={160} onChange={(value) => setEditValue("contrast", value)} />
              <SliderControl label="Saturation" value={edit.saturation} min={0} max={180} onChange={(value) => setEditValue("saturation", value)} />
              <SliderControl label="Crisp" value={edit.sharpness} min={0} max={100} onChange={(value) => setEditValue("sharpness", value)} />
            </section>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
