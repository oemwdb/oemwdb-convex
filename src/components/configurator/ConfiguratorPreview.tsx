import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  calculateWheelPlacement,
  rigImageUrl,
  type VehicleRigLike,
  type WheelRigLike,
} from "@/lib/configuratorMath";
import { cn } from "@/lib/utils";

type ConfiguratorPreviewProps = {
  vehicleRig?: (VehicleRigLike & {
    source_asset_url?: string | null;
    cutout_asset_url?: string | null;
  }) | null;
  wheelRig?: (WheelRigLike & {
    source_asset_url?: string | null;
    cutout_asset_url?: string | null;
  }) | null;
  tireSize?: string | null;
  className?: string;
};

export default function ConfiguratorPreview({
  vehicleRig,
  wheelRig,
  tireSize,
  className,
}: ConfiguratorPreviewProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [displayWidth, setDisplayWidth] = useState(0);
  const vehicleImageUrl = rigImageUrl(vehicleRig);
  const wheelImageUrl = rigImageUrl(wheelRig);
  const vehicleWidth = vehicleRig?.image_width_px || imageRef.current?.naturalWidth || 1;
  const vehicleHeight = vehicleRig?.image_height_px || imageRef.current?.naturalHeight || 1;
  const displayScale = displayWidth > 0 && vehicleWidth > 0 ? displayWidth / vehicleWidth : 1;

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

  const placements = useMemo(() => {
    if (!vehicleRig || !wheelRig) return null;
    return {
      front: calculateWheelPlacement(vehicleRig, wheelRig, "front", displayScale, tireSize),
      rear: calculateWheelPlacement(vehicleRig, wheelRig, "rear", displayScale, tireSize),
    };
  }, [vehicleRig, wheelRig, displayScale, tireSize]);

  const canRenderWheels = Boolean(wheelImageUrl && placements?.front && placements?.rear);

  if (!vehicleImageUrl) {
    return (
      <div className={cn("flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground", className)}>
        Select an approved vehicle rig to preview.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="relative overflow-hidden rounded-lg border border-border bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:56px_56px]"
        style={{ minHeight: Math.min(560, Math.max(300, vehicleHeight * displayScale || 360)) }}
      >
        <img
          ref={imageRef}
          src={vehicleImageUrl}
          alt="Configured vehicle"
          className="block w-full select-none object-contain"
          draggable={false}
          onLoad={updateDisplaySize}
        />
        {canRenderWheels
          ? (["front", "rear"] as const).map((axle) => {
              const placement = placements?.[axle];
              if (!placement) return null;
              return (
                <img
                  key={axle}
                  src={wheelImageUrl}
                  alt={`${axle} configured wheel`}
                  className="pointer-events-none absolute z-10 max-w-none select-none object-contain"
                  draggable={false}
                  style={{
                    left: placement.left,
                    top: placement.top,
                    width: placement.width,
                    height: placement.height,
                  }}
                />
              );
            })
          : null}
        {vehicleRig?.ground_y ? (
          <div
            className="pointer-events-none absolute left-0 z-20 border-t border-dashed border-emerald-400/60"
            style={{
              top: vehicleRig.ground_y * displayScale,
              width: displayWidth,
            }}
          />
        ) : null}
      </div>
      {!canRenderWheels ? (
        <p className="text-xs text-muted-foreground">
          Visual preview needs approved vehicle and wheel rigs with axle, center, radius, and scale anchors.
        </p>
      ) : null}
    </div>
  );
}
