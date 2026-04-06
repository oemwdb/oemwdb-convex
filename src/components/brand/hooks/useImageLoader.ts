import { useState, useEffect, useMemo } from "react";
import { getMediaUrlCandidates } from "@/lib/mediaUrls";


export const useImageLoader = (imagelink?: string | null) => {
  const candidates = useMemo(() => getMediaUrlCandidates(imagelink), [imagelink]);
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
  };

  return { imageUrl, handleImageError };
};
