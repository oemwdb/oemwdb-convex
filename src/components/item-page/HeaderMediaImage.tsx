import { useEffect, useMemo, useState, type ReactNode } from "react";

import { getMediaUrlCandidates } from "@/lib/mediaUrls";
import { cn } from "@/lib/utils";

interface HeaderMediaSource {
  value?: string | null;
  bucketHint?: string | null;
  fitMode?: "cover" | "contain";
  imageClassName?: string;
}

interface HeaderMediaImageProps {
  alt: string;
  sources: HeaderMediaSource[];
  fallback?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function HeaderMediaImage({
  alt,
  sources,
  fallback,
  className = "h-full w-full",
  containerClassName = "flex h-full w-full items-center justify-center",
}: HeaderMediaImageProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const candidates = useMemo(
    () =>
      sources
        .flatMap((source) =>
          getMediaUrlCandidates(source.value, source.bucketHint).map((candidate) => ({
            url: candidate,
            fitMode: source.fitMode ?? "cover",
            imageClassName: source.imageClassName,
          })),
        )
        .filter(
          (candidate, index, all) =>
            all.findIndex((item) => item.url === candidate.url) === index,
        ),
    [sources],
  );

  useEffect(() => {
    setCandidateIndex(0);
    setImageError(false);
  }, [candidates]);

  const activeCandidate = !imageError ? candidates[candidateIndex] ?? null : null;

  if (!activeCandidate) {
    return (
      <>
        {fallback ?? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="px-2 text-center text-xs text-muted-foreground">
              No image available
            </span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={containerClassName}>
      <img
        src={activeCandidate.url}
        alt={alt}
        className={cn(
          className,
          activeCandidate.fitMode === "contain" ? "object-contain" : "object-cover",
          activeCandidate.imageClassName,
        )}
        onError={() => {
          const nextIndex = candidateIndex + 1;
          if (nextIndex < candidates.length) {
            setCandidateIndex(nextIndex);
            setImageError(false);
            return;
          }
          setImageError(true);
        }}
      />
    </div>
  );
}
