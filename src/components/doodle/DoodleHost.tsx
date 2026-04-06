import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Circle,
  Eraser,
  Lock,
  LockOpen,
  PencilLine,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDoodle } from "@/contexts/DoodleContext";

type DoodlePoint = { x: number; y: number };
type DoodleTool = "pen" | "rect" | "ellipse";

type DoodleStrokeAnnotation = {
  id: string;
  kind: "pen";
  color: string;
  size: number;
  label: string;
  points: DoodlePoint[];
};

type DoodleShapeAnnotation = {
  id: string;
  kind: "rect" | "ellipse";
  color: string;
  size: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type DoodleAnnotation = DoodleStrokeAnnotation | DoodleShapeAnnotation;

type DoodleSurfaceState = {
  annotations: DoodleAnnotation[];
  color: string;
  brushSize: number;
  tool: DoodleTool;
};

const DOODLE_COLORS = ["#ff7d7d", "#ffd166", "#8ec5ff", "#69f0d1", "#ffffff"] as const;
const DOODLE_BRUSHES = [2, 4, 8] as const;

function createDefaultSurfaceState(
  overrides?: Partial<Omit<DoodleSurfaceState, "annotations">>,
): DoodleSurfaceState {
  return {
    annotations: [],
    color: overrides?.color ?? "#ff7d7d",
    brushSize: overrides?.brushSize ?? 2,
    tool: overrides?.tool ?? "pen",
  };
}

function createAnnotationId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultLabel(kind: DoodleTool, count: number) {
  if (kind === "rect") return `Box ${count + 1}`;
  if (kind === "ellipse") return `Circle ${count + 1}`;
  return `Mark ${count + 1}`;
}

function pointsToPath(points: DoodlePoint[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const [point] = points;
    return `M ${point.x} ${point.y} L ${point.x} ${point.y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, "");
}

function normalizeBox(start: DoodlePoint, current: DoodlePoint) {
  return {
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y),
  };
}

function getAnnotationBounds(annotation: DoodleAnnotation) {
  if (annotation.kind !== "pen") {
    return {
      x: annotation.x,
      y: annotation.y,
      width: annotation.width,
      height: annotation.height,
    };
  }

  const xs = annotation.points.map((point) => point.x);
  const ys = annotation.points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function renderAnnotation(annotation: DoodleAnnotation) {
  if (annotation.kind === "pen") {
    return (
      <path
        d={pointsToPath(annotation.points)}
        fill="none"
        stroke={annotation.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={annotation.size}
      />
    );
  }

  if (annotation.kind === "rect") {
    return (
      <rect
        x={annotation.x}
        y={annotation.y}
        width={annotation.width}
        height={annotation.height}
        fill="none"
        rx={12}
        stroke={annotation.color}
        strokeWidth={annotation.size}
      />
    );
  }

  return (
    <ellipse
      cx={annotation.x + annotation.width / 2}
      cy={annotation.y + annotation.height / 2}
      rx={annotation.width / 2}
      ry={annotation.height / 2}
      fill="none"
      stroke={annotation.color}
      strokeWidth={annotation.size}
    />
  );
}

function DoodleOverlay({
  state,
  setState,
  interactive,
}: {
  state: DoodleSurfaceState;
  setState: React.Dispatch<React.SetStateAction<DoodleSurfaceState>>;
  interactive: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [draftAnnotation, setDraftAnnotation] = useState<DoodleAnnotation | null>(null);
  const [draftOrigin, setDraftOrigin] = useState<DoodlePoint | null>(null);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const updateLabel = useCallback((annotationId: string, nextLabel: string) => {
    setState((current) => ({
      ...current,
      annotations: current.annotations.map((annotation) =>
        annotation.id === annotationId
          ? { ...annotation, label: nextLabel.trim() || annotation.label }
          : annotation,
      ),
    }));
  }, [setState]);

  const openLabelEditor = useCallback((annotation: DoodleAnnotation) => {
    setEditingAnnotationId(annotation.id);
    setEditingLabel(annotation.label);
  }, []);

  const closeLabelEditor = useCallback(() => {
    setEditingAnnotationId(null);
    setEditingLabel("");
  }, []);

  const getLocalPoint = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }, []);

  const beginAnnotation = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("[data-doodle-label]")) return;

    closeLabelEditor();

    const origin = getLocalPoint(event);
    const nextId = createAnnotationId();
    const nextLabel = createDefaultLabel(state.tool, state.annotations.length);

    if (state.tool === "pen") {
      setDraftAnnotation({
        id: nextId,
        kind: "pen",
        color: state.color,
        size: state.brushSize,
        label: nextLabel,
        points: [origin],
      });
    } else {
      setDraftOrigin(origin);
      setDraftAnnotation({
        id: nextId,
        kind: state.tool,
        color: state.color,
        size: state.brushSize,
        label: nextLabel,
        x: origin.x,
        y: origin.y,
        width: 0,
        height: 0,
      });
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  }, [closeLabelEditor, getLocalPoint, interactive, state.annotations.length, state.brushSize, state.color, state.tool]);

  const extendAnnotation = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !draftAnnotation) return;

    const point = getLocalPoint(event);

    setDraftAnnotation((current) => {
      if (!current) return current;

      if (current.kind === "pen") {
        return {
          ...current,
          points: [...current.points, point],
        };
      }

      if (!draftOrigin) return current;

      const box = normalizeBox(draftOrigin, point);
      return {
        ...current,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      };
    });
  }, [draftAnnotation, draftOrigin, getLocalPoint, interactive]);

  const endAnnotation = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !draftAnnotation) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const finalized = draftAnnotation;
    setDraftAnnotation(null);
    setDraftOrigin(null);

    if (
      finalized.kind !== "pen" &&
      finalized.width < 6 &&
      finalized.height < 6
    ) {
      return;
    }

    setState((current) => ({
      ...current,
      annotations: [...current.annotations, finalized],
    }));
    openLabelEditor(finalized);
  }, [draftAnnotation, interactive, openLabelEditor, setState]);

  const allAnnotations = draftAnnotation
    ? [...state.annotations, draftAnnotation]
    : state.annotations;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60]",
        interactive ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        ref={overlayRef}
        className={cn(
          "absolute inset-0 touch-none",
          interactive ? "cursor-crosshair bg-black/18 backdrop-blur-[1px]" : "",
        )}
        onPointerDown={beginAnnotation}
        onPointerMove={extendAnnotation}
        onPointerUp={endAnnotation}
        onPointerCancel={endAnnotation}
      >
        <svg className="absolute inset-0 h-full w-full">
          {allAnnotations.map((annotation) => (
            <g key={annotation.id}>{renderAnnotation(annotation)}</g>
          ))}
        </svg>

        {state.annotations.map((annotation) => {
          const bounds = getAnnotationBounds(annotation);
          const labelLeft = Math.max(10, bounds.x);
          const labelTop = Math.max(10, bounds.y - 34);
          const isEditing = editingAnnotationId === annotation.id;

          return (
            <div
              key={`${annotation.id}-label`}
              data-doodle-label
              className="absolute"
              style={{ left: labelLeft, top: labelTop }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={editingLabel}
                  onChange={(event) => setEditingLabel(event.target.value)}
                  onBlur={() => {
                    updateLabel(annotation.id, editingLabel);
                    closeLabelEditor();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      updateLabel(annotation.id, editingLabel);
                      closeLabelEditor();
                    } else if (event.key === "Escape") {
                      closeLabelEditor();
                    }
                  }}
                  className="h-8 min-w-[128px] rounded-full border border-white/20 bg-[#1c1816]/95 px-3 text-sm font-medium text-white outline-none focus:border-white/35"
                />
              ) : (
                <button
                  type="button"
                  className="rounded-full border border-white/15 bg-[#1c1816]/92 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#26211f]"
                  onClick={(event) => {
                    event.stopPropagation();
                    openLabelEditor(annotation);
                  }}
                >
                  {annotation.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DoodlePanelControls({
  state,
  setState,
  isPageMarkupActive,
  onTogglePageMarkup,
}: {
  state: DoodleSurfaceState;
  setState: React.Dispatch<React.SetStateAction<DoodleSurfaceState>>;
  isPageMarkupActive: boolean;
  onTogglePageMarkup: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/60 p-3">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-10 w-full justify-start rounded-full border border-border/70 bg-black px-4 text-sm text-white hover:bg-black/80",
            isPageMarkupActive &&
              "border-[#ff7d7d]/70 bg-[#ff7d7d]/15 text-white shadow-[0_0_0_1px_rgba(255,125,125,0.18),0_0_18px_rgba(255,125,125,0.16)]",
          )}
          onClick={onTogglePageMarkup}
        >
          {isPageMarkupActive ? (
            <Lock className="mr-2 h-4 w-4" />
          ) : (
            <LockOpen className="mr-2 h-4 w-4" />
          )}
          {isPageMarkupActive ? "Unfreeze page" : "Freeze page"}
        </Button>
        <p className="mt-2 text-xs text-white/50">
          {isPageMarkupActive
            ? "Page is frozen. Everything outside this panel is blocked so you can mark up the layout."
            : "Freeze the page under this panel so you can draw over the layout without triggering the page."}
        </p>
      </div>

      <div className="border-b border-border/50 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Tools
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {([
            { id: "pen", label: "Pen", icon: PencilLine },
            { id: "rect", label: "Box", icon: Square },
            { id: "ellipse", label: "Circle", icon: Circle },
          ] as const).map((tool) => {
            const Icon = tool.icon;
            const active = state.tool === tool.id;
            return (
              <Button
                key={tool.id}
                type="button"
                variant="ghost"
                className={cn(
                  "h-12 flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] text-xs text-white/70 hover:bg-white/[0.08] hover:text-white",
                  active && "border-white/20 bg-white/[0.1] text-white",
                )}
                onClick={() =>
                  setState((current) => ({
                    ...current,
                    tool: tool.id,
                  }))
                }
              >
                <Icon className="h-4 w-4" />
                {tool.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-border/50 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Color
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {DOODLE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setState((current) => ({ ...current, color }))}
              className={cn(
                "h-8 w-8 rounded-full border transition-transform hover:scale-105",
                state.color === color
                  ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
                  : "border-white/10",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="border-b border-border/50 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Stroke
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {DOODLE_BRUSHES.map((size) => (
            <Button
              key={size}
              type="button"
              variant="ghost"
              className={cn(
                "h-9 rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs text-white/70 hover:bg-white/[0.08] hover:text-white",
                state.brushSize === size && "border-white/20 bg-white/[0.1] text-white",
              )}
              onClick={() => setState((current) => ({ ...current, brushSize: size }))}
            >
              {size}px
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Labels
          </div>
          <p className="mt-2 text-sm text-white/65">
            Click any label on the page to rename it so we can talk about exact marks.
          </p>
          <div className="mt-3 text-xs text-white/40">
            {state.annotations.length} annotation{state.annotations.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-full justify-start rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white"
          onClick={() => setState((current) => ({ ...current, annotations: [] }))}
        >
          <Eraser className="mr-2 h-4 w-4" />
          Clear all
        </Button>
      </div>
    </div>
  );
}

export function DoodleHost() {
  const {
    canUseDoodle,
    closeAllDoodle,
    closeQuickDoodle,
    isDoodlePanelOpen,
    isQuickDoodleOpen,
    openQuickDoodle,
  } = useDoodle();

  const [surface, setSurface] = useState<DoodleSurfaceState>(() =>
    createDefaultSurfaceState({ color: "#ff7d7d", brushSize: 2, tool: "pen" }),
  );
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    if (!(isQuickDoodleOpen || isDoodlePanelOpen)) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllDoodle();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAllDoodle, isDoodlePanelOpen, isQuickDoodleOpen]);

  useEffect(() => {
    if (!canUseDoodle) {
      setSurface(createDefaultSurfaceState({ color: "#ff7d7d", brushSize: 2, tool: "pen" }));
    }
  }, [canUseDoodle]);

  useEffect(() => {
    if (!isQuickDoodleOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isQuickDoodleOpen]);

  useEffect(() => {
    if (!isDoodlePanelOpen) return;

    const boundary = document.querySelector('[data-doodle-boundary="true"]') as HTMLElement | null;
    if (!boundary) {
      setPanelStyle(null);
      return;
    }

    let frameId = 0;
    const updatePanelStyle = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const rect = boundary.getBoundingClientRect();
        setPanelStyle({
          top: rect.top + 8,
          right: window.innerWidth - rect.right + 8,
          bottom: window.innerHeight - rect.bottom + 4,
          width: 320,
        });
      });
    };

    updatePanelStyle();

    const resizeObserver = new ResizeObserver(updatePanelStyle);
    resizeObserver.observe(boundary);
    window.addEventListener("resize", updatePanelStyle);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePanelStyle);
    };
  }, [isDoodlePanelOpen]);

  if (!canUseDoodle) return null;

  return (
    <>
      {isDoodlePanelOpen ? (
        <DoodleOverlay
          state={surface}
          setState={setSurface}
          interactive={isQuickDoodleOpen}
        />
      ) : null}

      {isDoodlePanelOpen ? (
        <aside
          className="fixed z-[65] flex animate-in zoom-in-95 fade-in-0 slide-in-from-right-2 duration-200 flex-col rounded-2xl border border-border bg-sidebar shadow-2xl"
          style={
            panelStyle ?? {
              top: 8,
              right: 8,
              bottom: 4,
              width: 320,
            }
          }
        >
          <div className="h-11 shrink-0 rounded-t-2xl border-b border-border px-3">
            <div className="flex h-full items-center justify-between gap-2">
              <div className="flex-1">
                <div className="flex h-8 w-full items-center rounded-full border border-border/70 bg-black px-2 text-xs text-muted-foreground">
                  <PencilLine className="mr-2 h-3.5 w-3.5 opacity-70" />
                  <span className="truncate">
                    {isQuickDoodleOpen ? "Drawing on page" : "Doodle markup"}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-border/60 bg-black hover:bg-black/80"
                onClick={closeAllDoodle}
                title="Close doodle"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto rounded-b-2xl">
            <DoodlePanelControls
              state={surface}
              setState={setSurface}
              isPageMarkupActive={isQuickDoodleOpen}
              onTogglePageMarkup={() => {
                if (isQuickDoodleOpen) {
                  closeQuickDoodle();
                } else {
                  openQuickDoodle();
                }
              }}
            />
          </div>
        </aside>
      ) : null}
    </>
  );
}
