import React, { useRef, useState } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WheelRecogniserTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

interface WheelRecogniserViewportProps {
  imageUrl?: string | null;
  transform: WheelRecogniserTransform;
  onTransformChange: (next: WheelRecogniserTransform) => void;
  onImageSelect: (file: File) => void;
  interactive?: boolean;
  className?: string;
  title?: string;
  helperText?: string;
}

export default function WheelRecogniserViewport({
  imageUrl,
  transform,
  onTransformChange,
  onImageSelect,
  interactive = true,
  className,
  title = "Alignment stage",
  helperText = "Drop a wheel photo here, then drag it until the rim sits inside the guide.",
}: WheelRecogniserViewportProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragStartRef = useRef<{ pointerId: number; startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onImageSelect(file);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !imageUrl) return;
    event.preventDefault();
    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: transform.x,
      baseY: transform.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStartRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || !interactive) return;
    const nextX = dragState.baseX + (event.clientX - dragState.startX);
    const nextY = dragState.baseY + (event.clientY - dragState.startY);
    onTransformChange({ ...transform, x: nextX, y: nextY });
  };

  const clearDrag = (pointerId?: number) => {
    if (!dragStartRef.current) return;
    if (pointerId !== undefined && dragStartRef.current.pointerId !== pointerId) return;
    dragStartRef.current = null;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-[28px] border border-border/60 bg-[#111111]",
          interactive && imageUrl ? "cursor-grab active:cursor-grabbing" : "",
          isDraggingOver ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""
        )}
        onDragOver={(event) => {
          if (!interactive) return;
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(event) => {
          if (!interactive) return;
          event.preventDefault();
          setIsDraggingOver(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="absolute inset-5 rounded-full border border-white/15 bg-[#1b1b1b]" />
        <div className="absolute inset-8 rounded-full border border-white/8" />
        <div
          className="absolute inset-5 overflow-hidden rounded-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => clearDrag(event.pointerId)}
          onPointerCancel={(event) => clearDrag(event.pointerId)}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded wheel"
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
                transformOrigin: "center center",
                width: "auto",
                height: "115%",
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/5">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{helperText}</p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-[17%] rounded-full border border-dashed border-white/25" />
          <div className="pointer-events-none absolute inset-[34%] rounded-full border border-white/10" />
        </div>

        {interactive && (
          <div className="absolute left-4 top-4 z-10">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full border-white/10 bg-black/70 text-foreground hover:bg-black/85"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {imageUrl ? "Replace" : "Upload"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>
        )}
      </div>
      {interactive && (
        <p className="text-xs text-muted-foreground">
          The image stays in the browser for v1. We only use your chosen metadata for matching.
        </p>
      )}
    </div>
  );
}
