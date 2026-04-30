import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import {
  CircleDot,
  Copy,
  FlipHorizontal2,
  Grid2x2,
  Loader2,
  Maximize2,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { parseTireSize } from "@/lib/configuratorMath";
import { cn } from "@/lib/utils";
import type { ConfiguratorMode } from "./configuratorModes";

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
  bolt_pattern?: string | null;
  text_bolt_patterns?: string | null;
  center_bore?: string | null;
  text_center_bores?: string | null;
  diameter?: string | null;
  text_diameters?: string | null;
  width?: string | null;
  text_widths?: string | null;
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
  center_bore?: string | null;
  tire_size?: string | null;
  color?: string | null;
  text_offsets?: string | null;
  wheel_offset?: string | null;
};

type WheelPackage = {
  id: string;
  source: "wheel" | "variant";
  wheelId?: string | null;
  variantId?: string | null;
  label: string;
  variantTitle?: string | null;
  diameter?: string | null;
  diameterIn?: number | null;
  diameterMm?: number | null;
  width?: string | null;
  widths?: string[];
  offset?: string | null;
  offsets?: string[];
  finish?: string | null;
  finishes?: string[];
  tireSizes?: string[];
  allTireSizes?: string[];
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
};

type WheelPackagesResult = {
  packages?: WheelPackage[];
  tireSizes?: string[];
};

type WheelTransform = {
  x: number;
  y: number;
  size: number;
  rotation: number;
};

type CanvasOffset = {
  x: number;
  y: number;
};

type SavedCombo = {
  id: string;
  label: string;
  mode?: ConfiguratorMode;
  vehicleId: string;
  wheelId: string;
  vehicleSource: "good" | "bad";
  wheelSource: "good" | "bad";
  wheelPackageId?: string;
  wheelVariantId?: string | null;
  wheelDiameter?: string | null;
  wheelWidth?: string | null;
  wheelFinish?: string | null;
  vehicleOnCanvas?: boolean;
  wheelsOnCanvas?: boolean;
  vehicleScale?: number;
  vehicleOffset?: CanvasOffset;
  tireSize?: string;
  tireOuterScale?: number;
  wheelPreviewScale?: number;
  front: WheelTransform;
  rear: WheelTransform;
  opacity: number;
};

type ComboMakerProps = {
  mode?: ConfiguratorMode;
  storageKey?: string;
};

const DEFAULT_FRONT: WheelTransform = { x: 38, y: 64, size: 7.5, rotation: 0 };
const DEFAULT_REAR: WheelTransform = { x: 62, y: 64, size: 7.5, rotation: 0 };
const DEFAULT_VEHICLE_OFFSET: CanvasOffset = { x: 0, y: 0 };
const DEFAULT_VEHICLE_SCALE = 68;
const DEFAULT_TIRE_OUTER_SCALE = 34;
const DEFAULT_WHEEL_PREVIEW_SCALE = 70;
const VEHICLE_GROUP_PAN_LIMIT = 42;

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "";
}

function vehicleLabel(vehicle?: VehicleRow | null) {
  if (!vehicle) return "Vehicle";
  return clean(vehicle.vehicle_title) || clean(vehicle.model_name) || clean(vehicle.generation) || "Vehicle";
}

function vehicleBrand(vehicle?: VehicleRow | null) {
  return clean(vehicle?.brand_name) || clean(vehicle?.text_brands) || "Unknown";
}

function wheelLabel(wheel?: WheelRow | null) {
  if (!wheel) return "Wheel";
  return clean(wheel.wheel_title) || clean(wheel.wheel_name) || clean(wheel.model_name) || "Wheel";
}

function wheelBrand(wheel?: WheelRow | null) {
  return clean(wheel?.brand_name) || clean(wheel?.jnc_brands) || "Unknown";
}

function vehicleImage(vehicle?: VehicleRow | null, source: "good" | "bad" = "good") {
  if (!vehicle) return "";
  return source === "bad"
    ? clean(vehicle.bad_pic_url) || clean(vehicle.good_pic_url)
    : clean(vehicle.good_pic_url) || clean(vehicle.bad_pic_url);
}

function wheelImage(wheel?: WheelRow | null, source: "good" | "bad" = "good") {
  if (!wheel) return "";
  return source === "bad"
    ? clean(wheel.bad_pic_url) || clean(wheel.good_pic_url)
    : clean(wheel.good_pic_url) || clean(wheel.bad_pic_url);
}

function wheelPackageImage(wheel?: WheelRow | null, wheelPackage?: WheelPackage | null, source: "good" | "bad" = "good") {
  if (source === "bad") {
    return clean(wheelPackage?.badPicUrl) || clean(wheelPackage?.goodPicUrl) || wheelImage(wheel, source);
  }
  return clean(wheelPackage?.goodPicUrl) || clean(wheelPackage?.badPicUrl) || wheelImage(wheel, source);
}

function splitSpecList(value: unknown) {
  return String(value ?? "")
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatDiameter(value?: number | null) {
  if (!value) return "";
  return Number.isInteger(value) ? `${value} in` : `${value.toFixed(1)} in`;
}

function tireRimIn(value: unknown) {
  const parsed = parseTireSize(value);
  if (parsed) return parsed.rimIn;
  const match = String(value ?? "").toUpperCase().replace(/\s+/g, "").match(/\d{3}\/\d{2,3}[A-Z]*R(\d{2})(?:\D|$)/);
  return match ? Number(match[1]) : null;
}

function tireMatchesPackage(value: string, wheelPackage?: WheelPackage | null) {
  if (!wheelPackage?.diameterIn || !value) return true;
  const rimIn = tireRimIn(value);
  return rimIn === null || Math.abs(rimIn - wheelPackage.diameterIn) < 0.05;
}

function rimFaceScaleForPackage(tireSize: string, wheelPackage?: WheelPackage | null) {
  const parsed = parseTireSize(tireSize);
  const rimMm = wheelPackage?.diameterMm ?? parsed?.rimMm;
  if (!parsed || !rimMm) return null;
  return clamp((rimMm / parsed.outerDiameterMm) * 100, 42, 88);
}

function spec(value: unknown) {
  return clean(value) || "unknown";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function filterRows<T>(rows: T[], search: string, labelFor: (row: T) => string, brandFor: (row: T) => string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows.slice(0, 48);
  return rows
    .filter((row) => `${brandFor(row)} ${labelFor(row)}`.toLowerCase().includes(needle))
    .slice(0, 48);
}

function readSavedCombos(storageKey: string): SavedCombo[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedCombos(storageKey: string, combos: SavedCombo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(combos));
}

function MiniSpec({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-black/20 px-2 py-1.5">
      <div className="text-[10px] font-medium uppercase text-muted-foreground">{label}</div>
      <div className="truncate text-xs font-medium">{spec(value)}</div>
    </div>
  );
}

function TireOptionChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  if (options.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
        No known tire options.
      </div>
    );
  }

  return (
    <div className="max-h-24 space-y-1 overflow-y-auto rounded-md border border-border bg-black/20 p-1">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            className={cn(
              "w-full rounded px-2 py-1.5 text-left text-xs font-medium transition-colors hover:bg-white/10",
              selected && "bg-white text-black hover:bg-white",
            )}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

type PickerProps<T> = {
  title: string;
  rows: T[];
  value: string;
  search: string;
  onSearchChange: (next: string) => void;
  onChange: (id: string) => void;
  labelFor: (row: T) => string;
  brandFor: (row: T) => string;
  imageFor: (row: T) => string;
  className?: string;
  listClassName?: string;
};

function Picker<T extends { _id: string }>({
  title,
  rows,
  value,
  search,
  onSearchChange,
  onChange,
  labelFor,
  brandFor,
  imageFor,
  className,
  listClassName,
}: PickerProps<T>) {
  const visibleRows = useMemo(
    () => filterRows(rows, search, labelFor, brandFor),
    [rows, search, labelFor, brandFor],
  );

  return (
    <section className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{rows.length}</span>
      </div>
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search" />
      <div className={cn("max-h-56 space-y-1 overflow-y-auto rounded-md border border-border bg-black/20 p-1", listClassName)}>
        {visibleRows.map((row) => {
          const selected = String(row._id) === value;
          return (
            <button
              key={String(row._id)}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-white/10",
                selected && "bg-white text-black hover:bg-white",
              )}
              onClick={() => onChange(String(row._id))}
            >
              <div className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-muted">
                {imageFor(row) ? (
                  <img src={imageFor(row)} alt="" className="h-full w-full object-contain" />
                ) : (
                  <CircleDot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{labelFor(row)}</div>
                <div className={cn("truncate text-xs", selected ? "text-black/60" : "text-muted-foreground")}>
                  {brandFor(row)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function ComboMaker({ mode = "vehicleCombo", storageKey = "oemwdb.comboMaker.v1" }: ComboMakerProps) {
  const vehiclesData = useQuery(api.queries.vehiclesGetAllWithBrands, {}) as VehicleRow[] | undefined;
  const wheelsData = useQuery(api.queries.wheelsGetAllWithBrands, {}) as WheelRow[] | undefined;
  const vehicles = vehiclesData ?? [];
  const wheels = wheelsData ?? [];

  const [vehicleId, setVehicleId] = useState("");
  const [wheelId, setWheelId] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [wheelSearch, setWheelSearch] = useState("");
  const [vehicleSource, setVehicleSource] = useState<"good" | "bad">("bad");
  const [wheelSource, setWheelSource] = useState<"good" | "bad">("bad");
  const [wheelPackageId, setWheelPackageId] = useState("");
  const [vehicleOnCanvas, setVehicleOnCanvas] = useState(false);
  const [wheelsOnCanvas, setWheelsOnCanvas] = useState(false);
  const [showCanvasGrid, setShowCanvasGrid] = useState(true);
  const [activeWheel, setActiveWheel] = useState<"front" | "rear" | "both">("both");
  const [front, setFront] = useState<WheelTransform>(DEFAULT_FRONT);
  const [rear, setRear] = useState<WheelTransform>(DEFAULT_REAR);
  const [vehicleOffset, setVehicleOffset] = useState<CanvasOffset>(DEFAULT_VEHICLE_OFFSET);
  const [vehicleScale, setVehicleScale] = useState(DEFAULT_VEHICLE_SCALE);
  const [tireSize, setTireSize] = useState("");
  const [tireOuterScale, setTireOuterScale] = useState(DEFAULT_TIRE_OUTER_SCALE);
  const [wheelPreviewScale, setWheelPreviewScale] = useState(DEFAULT_WHEEL_PREVIEW_SCALE);
  const [opacity, setOpacity] = useState(100);
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>(() => readSavedCombos(storageKey));
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<"front" | "rear" | null>(null);
  const vehicleDragRef = useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);

  const selectedVehicle = vehicles.find((vehicle) => String(vehicle._id) === vehicleId) ?? vehicles[0] ?? null;
  const selectedWheel = wheels.find((wheel) => String(wheel._id) === wheelId) ?? wheels[0] ?? null;
  const wheelPackagesData = useQuery(
    api.configurator.wheelPackagesForWheel,
    selectedWheel?._id ? { wheelId: selectedWheel._id as Id<"oem_wheels"> } : "skip",
  ) as WheelPackagesResult | undefined;
  const wheelPackages = wheelPackagesData?.packages ?? [];
  const wheelPackageIds = wheelPackages.map((wheelPackage) => wheelPackage.id).join("|");
  const selectedWheelPackage = wheelPackages.find((wheelPackage) => wheelPackage.id === wheelPackageId) ?? wheelPackages[0] ?? null;
  const tireOptions = selectedWheelPackage ? selectedWheelPackage.tireSizes ?? [] : splitSpecList(selectedWheel?.tire_size);
  const tireOptionsKey = tireOptions.join("|");
  const packageRimLabel = selectedWheelPackage?.diameterIn
    ? `R${selectedWheelPackage.diameterIn}`
    : clean(selectedWheelPackage?.diameter) || "Rim";
  const resolvedRimFaceScale = rimFaceScaleForPackage(tireSize, selectedWheelPackage);
  const vehicleUrl = vehicleImage(selectedVehicle, vehicleSource);
  const wheelUrl = wheelPackageImage(selectedWheel, selectedWheelPackage, wheelSource);

  useEffect(() => {
    if (!vehicleId && vehicles[0]) setVehicleId(String(vehicles[0]._id));
  }, [vehicleId, vehicles]);

  useEffect(() => {
    if (!wheelId && wheels[0]) setWheelId(String(wheels[0]._id));
  }, [wheelId, wheels]);

  useEffect(() => {
    writeSavedCombos(storageKey, savedCombos);
  }, [savedCombos, storageKey]);

  useEffect(() => {
    if (!selectedWheel) {
      setWheelPackageId("");
      return;
    }
    if (wheelPackagesData === undefined) return;
    if (wheelPackages.length === 0) {
      setWheelPackageId("");
      return;
    }
    if (!wheelPackages.some((wheelPackage) => wheelPackage.id === wheelPackageId)) {
      setWheelPackageId(wheelPackages[0].id);
    }
  }, [selectedWheel?._id, wheelPackagesData, wheelPackageIds, wheelPackageId]);

  useEffect(() => {
    if (tireOptions.length === 0) {
      if (selectedWheelPackage && tireSize && !tireMatchesPackage(tireSize, selectedWheelPackage)) {
        setTireSize("");
      }
      return;
    }
    if (!tireSize || !tireMatchesPackage(tireSize, selectedWheelPackage)) {
      setTireSize(tireOptions[0]);
    }
  }, [selectedWheelPackage?.id, tireOptionsKey, tireSize]);

  const visibleSavedCombos = savedCombos.filter((combo) => (combo.mode ?? "vehicleCombo") === mode);

  const updateTarget = (patch: Partial<WheelTransform>) => {
    if (activeWheel === "front" || activeWheel === "both") {
      setFront((current) => ({ ...current, ...patch }));
    }
    if (activeWheel === "rear" || activeWheel === "both") {
      setRear((current) => ({ ...current, ...patch }));
    }
  };

  const panVehicleGroup = (deltaX: number, deltaY: number) => {
    setVehicleOffset((current) => ({
      x: clamp(current.x + deltaX, -VEHICLE_GROUP_PAN_LIMIT, VEHICLE_GROUP_PAN_LIMIT),
      y: clamp(current.y + deltaY, -VEHICLE_GROUP_PAN_LIMIT, VEHICLE_GROUP_PAN_LIMIT),
    }));
    setFront((current) => ({
      ...current,
      x: clamp(current.x + deltaX, 0, 100),
      y: clamp(current.y + deltaY, 0, 100),
    }));
    setRear((current) => ({
      ...current,
      x: clamp(current.x + deltaX, 0, 100),
      y: clamp(current.y + deltaY, 0, 100),
    }));
  };

  const handlePointerDown = (wheel: "front" | "rear", event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragRef.current = wheel;
    frameRef.current?.setPointerCapture(event.pointerId);
    setActiveWheel(wheel);
  };

  const handleVehiclePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (mode !== "vehicleCombo") return;
    event.preventDefault();
    vehicleDragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    frameRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const vehicleDrag = vehicleDragRef.current;
    const rect = frameRef.current?.getBoundingClientRect();
    if (vehicleDrag && vehicleDrag.pointerId === event.pointerId && rect) {
      const deltaX = ((event.clientX - vehicleDrag.lastX) / rect.width) * 100;
      const deltaY = ((event.clientY - vehicleDrag.lastY) / rect.height) * 100;
      panVehicleGroup(deltaX, deltaY);
      vehicleDragRef.current = {
        ...vehicleDrag,
        lastX: event.clientX,
        lastY: event.clientY,
      };
      return;
    }

    const dragging = dragRef.current;
    if (!dragging || !rect) return;
    const next = {
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
    };
    if (dragging === "front") setFront((current) => ({ ...current, ...next }));
    if (dragging === "rear") setRear((current) => ({ ...current, ...next }));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (vehicleDragRef.current?.pointerId === event.pointerId) {
      vehicleDragRef.current = null;
    }
    if (!vehicleDragRef.current) {
      dragRef.current = null;
    }
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (mode !== "vehicleCombo") return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('[data-configurator-panel="true"]')) return;

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1;
    const deltaX = ((event.deltaX * deltaScale) / rect.width) * 100;
    const deltaY = ((event.deltaY * deltaScale) / rect.height) * 100;
    if (Math.abs(deltaX) + Math.abs(deltaY) < 0.02) return;

    event.preventDefault();
    panVehicleGroup(deltaX, deltaY);
  };

  const resetWheels = () => {
    setFront(DEFAULT_FRONT);
    setRear(DEFAULT_REAR);
    setVehicleOnCanvas(false);
    setWheelsOnCanvas(false);
    setVehicleScale(DEFAULT_VEHICLE_SCALE);
    setVehicleOffset(DEFAULT_VEHICLE_OFFSET);
    setTireOuterScale(DEFAULT_TIRE_OUTER_SCALE);
    setWheelPreviewScale(DEFAULT_WHEEL_PREVIEW_SCALE);
    setOpacity(100);
    setActiveWheel("both");
  };

  const mirrorWheel = () => {
    updateTarget({ rotation: ((activeWheel === "rear" ? rear.rotation : front.rotation) + 180) % 360 });
  };

  const saveCombo = () => {
    if (!selectedVehicle || !selectedWheel) return;
    const combo: SavedCombo = {
      id: `${Date.now()}`,
      label:
        mode === "wheelTire"
          ? `${wheelBrand(selectedWheel)} ${wheelLabel(selectedWheel)} + ${selectedWheelPackage?.diameter ?? "rim"} + ${tireSize || "tire size"}`
          : `${vehicleBrand(selectedVehicle)} ${vehicleLabel(selectedVehicle)} + ${wheelBrand(selectedWheel)} ${wheelLabel(selectedWheel)}${selectedWheelPackage?.diameter ? ` / ${selectedWheelPackage.diameter}` : ""}`,
      mode,
      vehicleId: String(selectedVehicle._id),
      wheelId: String(selectedWheel._id),
      vehicleSource,
      wheelSource,
      wheelPackageId: selectedWheelPackage?.id,
      wheelVariantId: selectedWheelPackage?.variantId ?? null,
      wheelDiameter: selectedWheelPackage?.diameter ?? null,
      wheelWidth: selectedWheelPackage?.width ?? null,
      wheelFinish: selectedWheelPackage?.finish ?? null,
      vehicleOnCanvas,
      wheelsOnCanvas,
      vehicleScale,
      vehicleOffset,
      tireSize,
      tireOuterScale,
      wheelPreviewScale,
      front,
      rear,
      opacity,
    };
    setSavedCombos((current) => [combo, ...current].slice(0, 12));
    toast({ title: "Combo saved" });
  };

  const loadCombo = (combo: SavedCombo) => {
    setVehicleId(combo.vehicleId);
    setWheelId(combo.wheelId);
    setVehicleSource(combo.vehicleSource);
    setWheelSource(combo.wheelSource);
    setWheelPackageId(combo.wheelPackageId ?? "");
    setVehicleOnCanvas(combo.vehicleOnCanvas ?? true);
    setWheelsOnCanvas(combo.wheelsOnCanvas ?? true);
    setVehicleScale(combo.vehicleScale ?? DEFAULT_VEHICLE_SCALE);
    setVehicleOffset(combo.vehicleOffset ?? DEFAULT_VEHICLE_OFFSET);
    setTireSize(combo.tireSize ?? "");
    setTireOuterScale(combo.tireOuterScale ?? DEFAULT_TIRE_OUTER_SCALE);
    setWheelPreviewScale(combo.wheelPreviewScale ?? DEFAULT_WHEEL_PREVIEW_SCALE);
    setFront(combo.front);
    setRear(combo.rear);
    setOpacity(combo.opacity);
  };

  const copyState = async () => {
    const payload = {
      mode,
      vehicle: selectedVehicle ? { id: selectedVehicle._id, label: vehicleLabel(selectedVehicle), brand: vehicleBrand(selectedVehicle) } : null,
      wheel: selectedWheel ? { id: selectedWheel._id, label: wheelLabel(selectedWheel), brand: wheelBrand(selectedWheel) } : null,
      wheelPackage: selectedWheelPackage
        ? {
            id: selectedWheelPackage.id,
            source: selectedWheelPackage.source,
            variantId: selectedWheelPackage.variantId ?? null,
            label: selectedWheelPackage.label,
            diameter: selectedWheelPackage.diameter ?? null,
            diameterIn: selectedWheelPackage.diameterIn ?? null,
            width: selectedWheelPackage.width ?? null,
            finish: selectedWheelPackage.finish ?? null,
          }
        : null,
      vehicleOnCanvas,
      wheelsOnCanvas,
      vehicleScale,
      vehicleOffset,
      tireSize,
      tireOuterScale,
      wheelPreviewScale,
      front,
      rear,
      opacity,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast({ title: "Combo copied" });
  };

  if (vehiclesData === undefined || wheelsData === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 p-3">
      <div
        ref={frameRef}
        className={cn(
          "relative h-full min-h-[620px] overflow-hidden rounded-xl border border-border bg-card",
          showCanvasGrid &&
            "bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px]",
        )}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleCanvasWheel}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        <div data-configurator-panel="true" className="absolute left-3 top-3 z-30 max-h-[calc(100%-120px)] w-[340px] max-w-[calc(50%-18px)] overflow-y-auto rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
          {mode === "vehicleCombo" ? (
            <>
              <Picker
                title="Vehicle"
                rows={vehicles}
                value={vehicleId}
                search={vehicleSearch}
                onSearchChange={setVehicleSearch}
                onChange={(next) => {
                  setVehicleId(next);
                }}
                labelFor={vehicleLabel}
                brandFor={vehicleBrand}
                imageFor={(row) => vehicleImage(row, vehicleSource)}
                listClassName="max-h-44"
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button type="button" size="sm" variant={vehicleSource === "good" ? "default" : "outline"} onClick={() => setVehicleSource("good")}>
                  Good pic
                </Button>
                <Button type="button" size="sm" variant={vehicleSource === "bad" ? "default" : "outline"} onClick={() => setVehicleSource("bad")}>
                  Bad pic
                </Button>
              </div>

              <Button
                type="button"
                size="sm"
                className="mt-3 w-full"
                variant={vehicleOnCanvas ? "outline" : "default"}
                onClick={() => setVehicleOnCanvas((current) => !current)}
                disabled={!vehicleUrl}
              >
                {vehicleOnCanvas ? "Remove vehicle from canvas" : "Add vehicle to canvas"}
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Vehicle scale</span>
                  <span className="text-muted-foreground">{vehicleScale}%</span>
                </div>
                <Slider value={[vehicleScale]} min={42} max={86} step={1} onValueChange={([value]) => setVehicleScale(value)} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniSpec label="Years" value={selectedVehicle?.production_years} />
                <MiniSpec label="Bolt" value={selectedVehicle?.bolt_pattern ?? selectedVehicle?.text_bolt_patterns} />
              </div>
            </>
          ) : (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Tire size</h2>
                <span className="text-xs text-muted-foreground">{packageRimLabel}</span>
              </div>
              <TireOptionChips options={tireOptions} value={tireSize} onChange={setTireSize} />
              <Input value={tireSize} onChange={(event) => setTireSize(event.target.value)} placeholder="245/35R19" />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tire outer size</span>
                  <span className="text-muted-foreground">{tireOuterScale}%</span>
                </div>
                <Slider value={[tireOuterScale]} min={22} max={48} step={1} onValueChange={([value]) => setTireOuterScale(value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MiniSpec label="Wheel rim" value={selectedWheelPackage?.diameter ?? formatDiameter(selectedWheelPackage?.diameterIn)} />
                <MiniSpec label="Rim fill" value={resolvedRimFaceScale ? `${Math.round(resolvedRimFaceScale)}%` : "manual"} />
              </div>
            </section>
          )}
        </div>

        <div data-configurator-panel="true" className="absolute right-3 top-3 z-30 max-h-[calc(100%-120px)] w-[360px] max-w-[calc(50%-18px)] overflow-y-auto rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
          <Picker
            title="Wheel"
            rows={wheels}
            value={wheelId}
            search={wheelSearch}
            onSearchChange={setWheelSearch}
            onChange={(next) => {
              setWheelId(next);
              setWheelPackageId("");
              setTireSize("");
            }}
            labelFor={wheelLabel}
            brandFor={wheelBrand}
            imageFor={(row) => wheelImage(row, wheelSource)}
            listClassName="max-h-36"
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button type="button" size="sm" variant={wheelSource === "good" ? "default" : "outline"} onClick={() => setWheelSource("good")}>
              Good pic
            </Button>
            <Button type="button" size="sm" variant={wheelSource === "bad" ? "default" : "outline"} onClick={() => setWheelSource("bad")}>
              Bad pic
            </Button>
          </div>

          <section className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>Package</span>
              <span className="text-xs text-muted-foreground">{wheelPackages.length}</span>
            </div>
            <Select value={selectedWheelPackage?.id ?? ""} onValueChange={setWheelPackageId} disabled={wheelPackages.length === 0}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="No package data" />
              </SelectTrigger>
              <SelectContent>
                {wheelPackages.map((wheelPackage) => (
                  <SelectItem key={wheelPackage.id} value={wheelPackage.id}>
                    {wheelPackage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-3 gap-2">
              <MiniSpec label="Rim" value={selectedWheelPackage?.diameter ?? formatDiameter(selectedWheelPackage?.diameterIn)} />
              <MiniSpec label="Width" value={selectedWheelPackage?.width ?? selectedWheelPackage?.widths?.join(", ")} />
              <MiniSpec label="Finish" value={selectedWheelPackage?.finish ?? selectedWheelPackage?.finishes?.join(", ")} />
            </div>
            {mode === "vehicleCombo" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span>Tire</span>
                  <span className="text-xs text-muted-foreground">{packageRimLabel}</span>
                </div>
                <TireOptionChips options={tireOptions} value={tireSize} onChange={setTireSize} />
                <Input value={tireSize} onChange={(event) => setTireSize(event.target.value)} placeholder="245/35R19" />
              </div>
            ) : null}
          </section>

          {mode === "vehicleCombo" ? (
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              variant={wheelsOnCanvas ? "outline" : "default"}
              onClick={() => setWheelsOnCanvas((current) => !current)}
              disabled={!wheelUrl}
            >
              {wheelsOnCanvas ? "Remove wheels from canvas" : "Add wheels to canvas"}
            </Button>
          ) : null}

          <section className="mt-4 space-y-3">
            {mode === "vehicleCombo" ? (
              <Tabs value={activeWheel} onValueChange={(value) => setActiveWheel(value as "front" | "rear" | "both")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="front">Front</TabsTrigger>
                  <TabsTrigger value="rear">Rear</TabsTrigger>
                  <TabsTrigger value="both">Both</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : null}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{mode === "wheelTire" ? "Rim fill" : "Wheel size"}</span>
                <span className="text-muted-foreground">
                  {Math.round(mode === "wheelTire" ? resolvedRimFaceScale ?? wheelPreviewScale : activeWheel === "rear" ? rear.size : front.size)}%
                </span>
              </div>
              <Slider
                value={[mode === "wheelTire" ? resolvedRimFaceScale ?? wheelPreviewScale : activeWheel === "rear" ? rear.size : front.size]}
                min={mode === "wheelTire" ? 48 : 3}
                max={mode === "wheelTire" ? 86 : 18}
                step={mode === "wheelTire" ? 1 : 0.25}
                disabled={mode === "wheelTire" && resolvedRimFaceScale !== null}
                onValueChange={([value]) => {
                  if (mode === "wheelTire") {
                    setWheelPreviewScale(value);
                    return;
                  }
                  updateTarget({ size: value });
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Rotation</span>
                <span className="text-muted-foreground">{Math.round(activeWheel === "rear" ? rear.rotation : front.rotation)}°</span>
              </div>
              <Slider
                value={[activeWheel === "rear" ? rear.rotation : front.rotation]}
                min={-180}
                max={180}
                step={1}
                onValueChange={([value]) => {
                  if (mode === "wheelTire") {
                    setFront((current) => ({ ...current, rotation: value }));
                    return;
                  }
                  updateTarget({ rotation: value });
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Opacity</span>
                <span className="text-muted-foreground">{opacity}%</span>
              </div>
              <Slider value={[opacity]} min={20} max={100} step={1} onValueChange={([value]) => setOpacity(value)} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" size="sm" variant="outline" onClick={mirrorWheel}>
                <FlipHorizontal2 className="mr-2 h-4 w-4" />
                Flip
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={saveCombo}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </section>

          <section className="mt-3 grid grid-cols-2 gap-2">
            <MiniSpec label="Bolt" value={selectedWheel?.bolt_pattern} />
            <MiniSpec label="Center" value={selectedWheel?.center_bore} />
            <MiniSpec label="Diameter" value={selectedWheelPackage?.diameter ?? selectedWheel?.diameter} />
            <MiniSpec label="Tires" value={tireOptions.join(", ")} />
          </section>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0">
          {mode === "vehicleCombo" && vehicleOnCanvas && vehicleUrl ? (
            <img
              src={vehicleUrl}
              alt={vehicleLabel(selectedVehicle)}
              className="pointer-events-auto absolute block max-h-[64%] cursor-grab select-none object-contain drop-shadow-2xl active:cursor-grabbing"
              draggable={false}
              style={{
                left: `${50 + vehicleOffset.x}%`,
                top: `${50 + vehicleOffset.y}%`,
                width: `${vehicleScale}%`,
                transform: "translate(-50%, -50%)",
              }}
              onPointerDown={handleVehiclePointerDown}
            />
          ) : mode === "wheelTire" ? (
            <div
              className="relative aspect-square min-w-[260px] rounded-full border border-white/15 bg-black shadow-2xl"
              style={{ width: `${tireOuterScale}%`, maxWidth: 540 }}
            >
              <div className="absolute inset-[7%] rounded-full border border-white/10 bg-neutral-950 shadow-inner" />
              <div className="absolute inset-[22%] rounded-full border border-white/10 bg-card shadow-inner" />
              {wheelUrl ? (
                <img
                  src={wheelUrl}
                  alt={wheelLabel(selectedWheel)}
                  className="absolute left-1/2 top-1/2 block aspect-square select-none object-contain drop-shadow-xl"
                  draggable={false}
                  style={{
                    width: `${resolvedRimFaceScale ?? wheelPreviewScale}%`,
                    opacity: opacity / 100,
                    transform: `translate(-50%, -50%) rotate(${front.rotation}deg)`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">No wheel image</div>
              )}
              <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-semibold shadow-xl">
                {tireSize || "Tire size unset"}
              </div>
            </div>
          ) : null}
        </div>

        {mode === "vehicleCombo" ? (
          <>
            {([
              ["front", front],
              ["rear", rear],
            ] as const).map(([slot, transform]) => (
              <div
                key={slot}
                className={cn(
                  "absolute z-10 flex aspect-square cursor-grab touch-none items-center justify-center rounded-full active:cursor-grabbing",
                  wheelsOnCanvas && wheelUrl
                    ? showCanvasGrid && "outline outline-1 outline-white/40"
                    : "border border-dashed border-orange-300/80 bg-orange-500/10 text-orange-200 shadow-[0_0_0_1px_rgba(0,0,0,0.45)]",
                  activeWheel === slot &&
                    (wheelsOnCanvas && wheelUrl
                      ? showCanvasGrid && "outline-2 outline-orange-400"
                      : "border-solid border-orange-300 bg-orange-500/20"),
                )}
                style={{
                  left: `${transform.x}%`,
                  top: `${transform.y}%`,
                  width: `${transform.size}%`,
                  opacity: opacity / 100,
                  transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
                }}
                onPointerDown={(event) => handlePointerDown(slot, event)}
                title={slot === "front" ? "Front wheel" : "Rear wheel"}
              >
                {wheelsOnCanvas && wheelUrl ? (
                  <>
                    <div className="absolute inset-[6%] rounded-full bg-black" aria-hidden="true" />
                    <img
                      src={wheelUrl}
                      alt=""
                      className="relative z-10 block aspect-square w-full select-none object-contain"
                      draggable={false}
                    />
                  </>
                ) : (
                  <span className="select-none text-[11px] font-bold uppercase tracking-wider">{slot === "front" ? "F" : "R"}</span>
                )}
              </div>
            ))}
          </>
        ) : null}

        <div data-configurator-panel="true" className="absolute bottom-3 left-3 z-30 w-[340px] max-w-[calc(50%-18px)] rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Saved combos</h2>
            <span className="text-xs text-muted-foreground">{visibleSavedCombos.length}</span>
          </div>
          {visibleSavedCombos.length === 0 ? (
            <div className="rounded-md border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
              No saved combos.
            </div>
          ) : (
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {visibleSavedCombos.map((combo) => (
                <div key={combo.id} className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
                  <button type="button" className="min-w-0 flex-1 truncate text-left text-xs font-medium hover:text-primary" onClick={() => loadCombo(combo)}>
                    {combo.label}
                  </button>
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => loadCombo(combo)}>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Load combo</span>
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSavedCombos((current) => current.filter((item) => item.id !== combo.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove combo</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div data-configurator-panel="true" className="absolute bottom-3 left-1/2 z-30 flex max-w-[calc(100%-720px)] -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/95 p-2 shadow-xl backdrop-blur">
          <div className="hidden max-w-[320px] min-w-0 px-2 text-xs lg:block">
            <div className="truncate font-semibold">
              {mode === "wheelTire" ? "Wheel + tire configurator" : `${vehicleBrand(selectedVehicle)} ${vehicleLabel(selectedVehicle)}`}
            </div>
            <div className="truncate text-muted-foreground">
              {mode === "wheelTire"
                ? `${wheelBrand(selectedWheel)} ${wheelLabel(selectedWheel)}${tireSize ? ` / ${tireSize}` : ""}`
                : `${wheelBrand(selectedWheel)} ${wheelLabel(selectedWheel)}${selectedWheelPackage?.diameter ? ` / ${selectedWheelPackage.diameter}` : ""}${tireSize ? ` / ${tireSize}` : ""}`}
            </div>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={resetWheels}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={copyState}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button
            type="button"
            size="sm"
            variant={showCanvasGrid ? "outline" : "default"}
            onClick={() => setShowCanvasGrid((current) => !current)}
            aria-pressed={!showCanvasGrid}
            title={showCanvasGrid ? "Hide grid lines" : "Show grid lines"}
          >
            <Grid2x2 className="mr-2 h-4 w-4" />
            {showCanvasGrid ? "Clean" : "Grid"}
          </Button>
        </div>
      </div>
    </div>
  );
}
