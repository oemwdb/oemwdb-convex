import { useState, useEffect } from "react";

export const useWheelImageLoader = (imagelink?: string | null) => {
  // Initialize with the actual URL to prevent flash of no content
  const [imageUrl, setImageUrl] = useState<string | null>(
    imagelink && imagelink.startsWith('http') ? imagelink : null
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when imagelink changes
    setHasError(false);
    
    if (imagelink && imagelink.startsWith('http')) {
      // Valid URL - use it directly
      setImageUrl(imagelink);
    } else {
      // Not a valid URL
      setImageUrl(null);
    }
  }, [imagelink]);

  const handleImageError = () => {
    // Don't null out the URL - just track that there was an error
    // This allows the browser to retry and prevents permanent failure
    setHasError(true);
    console.warn('Wheel image failed to load:', imageUrl);
  };

  return { imageUrl, handleImageError };
};
