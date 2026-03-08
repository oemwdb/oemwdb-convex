import { useState, useEffect } from "react";


export const useImageLoader = (imagelink?: string | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imagelink) {
      // If it's already a full URL, use it directly
      if (imagelink.startsWith('http')) {
        setImageUrl(imagelink);
      } else {
        // Relative path: use as-is (e.g. Convex storage URL or relative path)
        setImageUrl(imagelink);
      }
    }
  }, [imagelink]);

  const handleImageError = () => {
    setImageUrl(null);
  };

  return { imageUrl, handleImageError };
};
