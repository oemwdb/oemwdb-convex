import { useState, useEffect, useMemo } from "react";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";

type WheelImageSource =
  | string
  | null
  | undefined
  | {
      value?: string | null;
      bucketHint?: string | null;
    };

export const useWheelImageLoader = (
  source?: WheelImageSource | WheelImageSource[],
  bucketHint?: string | null
) => {
  const candidates = useMemo(() => {
    if (Array.isArray(source)) {
      return [
        ...new Set(
          source.flatMap((entry) => {
            if (typeof entry === "string" || entry == null) {
              return getMediaUrlCandidates(entry, bucketHint);
            }

            return getMediaUrlCandidates(entry.value, entry.bucketHint);
          })
        ),
      ];
    }

    if (typeof source === "string" || source == null) {
      return getMediaUrlCandidates(source, bucketHint);
    }

    return getMediaUrlCandidates(source.value, source.bucketHint);
  }, [source, bucketHint]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(candidates[0] ?? null);

  useEffect(() => {
    setCandidateIndex(0);
    setImageUrl(candidates[0] ?? null);
  }, [candidates]);

  const handleImageError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      setImageUrl(candidates[nextIndex] ?? null);
      return;
    }

    setImageUrl(null);
    console.warn("Wheel image failed to load:", imageUrl);
  };

  return { imageUrl, handleImageError };
};
