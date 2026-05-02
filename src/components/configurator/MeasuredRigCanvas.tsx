import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Ruler } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type VehicleRigDraft = {
  imageWidthPx?: number;
  imageHeightPx?: number;
  vehicleLengthMm?: number;
  wheelbaseMm?: number;
  frontX?: number;
  rearX?: number;
  frontAxleX?: number;
  frontAxleY?: number;
  rearAxleX?: number;
  rearAxleY?: number;
  groundY?: number;
  pxPerMm?: number;
};

export type WheelRigDraft = {
  imageWidthPx?: number;
  imageHeightPx?: number;
  wheelCenterX?: number;
  wheelCenterY?: number;
  wheelRadiusPx?: number;
  wheelDiameterMm?: number;
  pxPerMm?: number;
};

type VehicleAnchorKey =
  | "frontX"
  | "rearX"
  | "frontAxle"
  | "rearAxle"
  | "groundY";
type WheelAnchorKey = "wheelCenter" | "wheelRadius";

type MeasuredRigCanvasProps =
  | {
      kind: "vehicle";
      imageUrl?: string | null;
      value: VehicleRigDraft;
      onChange: (next: VehicleRigDraft) => void;
      className?: string;
    }
  | {
      kind: "wheel";
      imageUrl?: string | null;
      value: WheelRigDraft;
      onChange: (next: WheelRigDraft) => void;
      className?: string;
    };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function numberOr(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function vehicleDefaults(width: number, height: number): VehicleRigDraft {
  return {
    imageWidthPx: width,
    imageHeightPx: height,
    frontX: width * 0.08,
    rearX: width * 0.92,
    frontAxleX: width * 0.28,
    frontAxleY: height * 0.72,
    rearAxleX: width * 0.72,
    rearAxleY: height * 0.72,
    groundY: height * 0.82,
  };
}

function wheelDefaults(width: number, height: number): WheelRigDraft {
  const radius = Math.min(width, height) * 0.36;
  return {
    imageWidthPx: width,
    imageHeightPx: height,
    wheelCenterX: width / 2,
    wheelCenterY: height / 2,
    wheelRadiusPx: radius,
  };
}

export default function MeasuredRigCanvas(props: MeasuredRigCanvasProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    key: VehicleAnchorKey | WheelAnchorKey;
  } | null>(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  const width = numberOr(props.value.imageWidthPx, imageRef.current?.naturalWidth || 1);
  const height = numberOr(props.value.imageHeightPx, imageRef.current?.naturalHeight || 1);
  const displayScale = displayWidth > 0 && width > 0 ? displayWidth / width : 1;
  const displayHeight = height * displayScale;

  const updateDisplaySize = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;
    setDisplayWidth(node.clientWidth || 0);
  }, []);

  useEffect(() => {
    updateDisplaySize();
    window.addEventListener("resize", updateDisplaySize);
    return () => window.removeEventListener("resize", updateDisplaySize);
  }, [updateDisplaySize]);

  const pxPerMm = useMemo(() => {
    if (props.kind === "vehicle") {
      const length = numberOr(props.value.vehicleLengthMm, 0);
      const front = numberOr(props.value.frontX, NaN);
      const rear = numberOr(props.value.rearX, NaN);
      if (length > 0 && Number.isFinite(front) && Number.isFinite(rear)) {
        return Math.abs(rear - front) / length;
      }
      return props.value.pxPerMm;
    }

    const diameter = numberOr(props.value.wheelDiameterMm, 0);
    const radius = numberOr(props.value.wheelRadiusPx, NaN);
    if (diameter > 0 && Number.isFinite(radius)) {
      return (radius * 2) / diameter;
    }
    return props.value.pxPerMm;
  }, [props]);

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (!img) return;
    updateDisplaySize();
    const nextWidth = img.naturalWidth;
    const nextHeight = img.naturalHeight;

    if (props.kind === "vehicle") {
      const defaults = vehicleDefaults(nextWidth, nextHeight);
      props.onChange({
        ...defaults,
        ...props.value,
        imageWidthPx: nextWidth,
        imageHeightPx: nextHeight,
      });
    } else {
      const defaults = wheelDefaults(nextWidth, nextHeight);
      props.onChange({
        ...defaults,
        ...props.value,
        imageWidthPx: nextWidth,
        imageHeightPx: nextHeight,
      });
    }
  };

  const getPointFromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || displayScale <= 0) return null;
    return {
      x: clamp((event.clientX - rect.left) / displayScale, 0, width),
      y: clamp((event.clientY - rect.top) / displayScale, 0, height),
    };
  };

  const applyDrag = (key: VehicleAnchorKey | WheelAnchorKey, x: number, y: number) => {
    if (props.kind === "vehicle") {
      const current = props.value;
      const next: VehicleRigDraft = { ...current };
      if (key === "frontX") next.frontX = x;
      if (key === "rearX") next.rearX = x;
      if (key === "frontAxle") {
        next.frontAxleX = x;
        next.frontAxleY = y;
      }
      if (key === "rearAxle") {
        next.rearAxleX = x;
        next.rearAxleY = y;
      }
      if (key === "groundY") next.groundY = y;
      props.onChange(next);
      return;
    }

    const current = props.value;
    const centerX = numberOr(current.wheelCenterX, width / 2);
    const centerY = numberOr(current.wheelCenterY, height / 2);
    if (key === "wheelCenter") {
      props.onChange({ ...current, wheelCenterX: x, wheelCenterY: y });
      return;
    }
    const radius = Math.max(4, Math.hypot(x - centerX, y - centerY));
    props.onChange({ ...current, wheelRadiusPx: radius });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    key: VehicleAnchorKey | WheelAnchorKey,
  ) => {
    event.preventDefault();
    frameRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, key };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = getPointFromEvent(event);
    if (!point) return;
    applyDrag(drag.key, point.x, point.y);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const pointStyle = (x: number, y: number) => ({
    left: x * displayScale,
    top: y * displayScale,
  });

  const renderPoint = (
    key: VehicleAnchorKey | WheelAnchorKey,
    x: number,
    y: number,
    label: string,
    tone: "blue" | "amber" | "emerald" = "blue",
  ) => (
    <button
      type="button"
      className={cn(
        "absolute z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-black shadow-lg",
        tone === "blue" && "border-sky-400",
        tone === "amber" && "border-amber-400",
        tone === "emerald" && "border-emerald-400",
      )}
      style={pointStyle(x, y)}
      title={label}
      onPointerDown={(event) => handlePointerDown(event, key)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </button>
  );

  const renderVehicleOverlay = () => {
    if (props.kind !== "vehicle") return null;
    const value = props.value;
    const frontX = numberOr(value.frontX, width * 0.08);
    const rearX = numberOr(value.rearX, width * 0.92);
    const frontAxleX = numberOr(value.frontAxleX, width * 0.28);
    const frontAxleY = numberOr(value.frontAxleY, height * 0.72);
    const rearAxleX = numberOr(value.rearAxleX, width * 0.72);
    const rearAxleY = numberOr(value.rearAxleY, height * 0.72);
    const groundY = numberOr(value.groundY, height * 0.82);

    return (
      <>
        <div
          className="absolute z-10 border-l border-dashed border-sky-400/80"
          style={{ left: frontX * displayScale, top: 0, height: displayHeight }}
        />
        <div
          className="absolute z-10 border-l border-dashed border-sky-400/80"
          style={{ left: rearX * displayScale, top: 0, height: displayHeight }}
        />
        <div
          className="absolute z-10 border-t border-dashed border-emerald-400/80"
          style={{ left: 0, top: groundY * displayScale, width: displayWidth }}
        />
        <div
          className="absolute z-10 border-t border-amber-300/80"
          style={{
            left: Math.min(frontAxleX, rearAxleX) * displayScale,
            top: ((frontAxleY + rearAxleY) / 2) * displayScale,
            width: Math.abs(rearAxleX - frontAxleX) * displayScale,
          }}
        />
        {renderPoint("frontX", frontX, groundY, "Front bumper bound")}
        {renderPoint("rearX", rearX, groundY, "Rear bumper bound")}
        {renderPoint("frontAxle", frontAxleX, frontAxleY, "Front axle", "amber")}
        {renderPoint("rearAxle", rearAxleX, rearAxleY, "Rear axle", "amber")}
        {renderPoint("groundY", (frontX + rearX) / 2, groundY, "Ground line", "emerald")}
      </>
    );
  };

  const renderWheelOverlay = () => {
    if (props.kind !== "wheel") return null;
    const value = props.value;
    const centerX = numberOr(value.wheelCenterX, width / 2);
    const centerY = numberOr(value.wheelCenterY, height / 2);
    const radius = numberOr(value.wheelRadiusPx, Math.min(width, height) * 0.36);
    return (
      <>
        <div
          className="absolute z-10 rounded-full border border-dashed border-sky-300/80"
          style={{
            left: (centerX - radius) * displayScale,
            top: (centerY - radius) * displayScale,
            width: radius * 2 * displayScale,
            height: radius * 2 * displayScale,
          }}
        />
        {renderPoint("wheelCenter", centerX, centerY, "Wheel center", "amber")}
        {renderPoint("wheelRadius", centerX + radius, centerY, "Wheel radius")}
      </>
    );
  };

  if (!props.imageUrl) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
        Select or upload an image to start calibrating.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", props.className)}>
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-lg border border-border bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          ref={imageRef}
          src={props.imageUrl}
          alt="Measured configurator asset"
          className="block w-full select-none object-contain"
          draggable={false}
          onLoad={handleImageLoad}
        />
        {renderVehicleOverlay()}
        {renderWheelOverlay()}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
          <Crosshair className="h-3.5 w-3.5" />
          {Math.round(width)} x {Math.round(height)} px
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
          <Ruler className="h-3.5 w-3.5" />
          {pxPerMm ? `${pxPerMm.toFixed(4)} px/mm` : "Scale unset"}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => {
            if (props.kind === "vehicle") {
              props.onChange({
                ...vehicleDefaults(width, height),
                vehicleLengthMm: props.value.vehicleLengthMm,
                wheelbaseMm: props.value.wheelbaseMm,
                pxPerMm: props.value.pxPerMm,
              });
            } else {
              props.onChange({
                ...wheelDefaults(width, height),
                wheelDiameterMm: props.value.wheelDiameterMm,
                pxPerMm: props.value.pxPerMm,
              });
            }
          }}
        >
          Reset anchors
        </Button>
      </div>
    </div>
  );
}
