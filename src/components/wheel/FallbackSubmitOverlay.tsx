import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK_SUBMIT_DIAMETER_RATIO = 0.5;

type FallbackSubmitOverlayProps = {
  visible: boolean;
  imageRef?: React.RefObject<HTMLImageElement | null>;
};

const FallbackSubmitOverlay = ({ visible, imageRef }: FallbackSubmitOverlayProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = React.useState({
    centerXPx: 0,
    centerYPx: 0,
    sizePx: 0,
  });

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const image = imageRef?.current;
    if (!container || !image) return;

    const updateGeometry = () => {
      const containerBounds = container.getBoundingClientRect();
      const imageBounds = image.getBoundingClientRect();

      if (containerBounds.width <= 0 || containerBounds.height <= 0 || imageBounds.width <= 0 || imageBounds.height <= 0) {
        return;
      }

      setGeometry({
        centerXPx: imageBounds.left - containerBounds.left + imageBounds.width / 2,
        centerYPx: imageBounds.top - containerBounds.top + imageBounds.height / 2,
        sizePx: Math.min(imageBounds.width, imageBounds.height) * FALLBACK_SUBMIT_DIAMETER_RATIO,
      });
    };

    updateGeometry();
    const frame = window.requestAnimationFrame(updateGeometry);
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(container);
    observer.observe(image);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [imageRef]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-10">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
        style={{
          left: geometry.centerXPx || undefined,
          top: geometry.centerYPx || undefined,
          width: geometry.sizePx || undefined,
          height: geometry.sizePx || undefined,
        }}
      >
        <button
          type="button"
          aria-label="Submit picture"
          className={cn(
            "pointer-events-auto flex h-full w-full items-center justify-center rounded-full",
            "border border-white/30 bg-black/45 text-white/95 shadow-[0_0_18px_rgba(255,255,255,0.14)]",
            "transition-all duration-200 hover:border-white/55 hover:shadow-[0_0_28px_rgba(255,255,255,0.34)]"
          )}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <Plus className="h-[35%] w-[35%]" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
};

export default FallbackSubmitOverlay;
