import { useState, useEffect } from "react";


export const useImageLoader = (imagelink?: string | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imagelink) {
      // If it's already a full URL, use it directly
      if (imagelink.startsWith('http')) {
        setImageUrl(imagelink);
      } else {
        // Otherwise, get the public URL from Supabase storage
        const { data } = supabase.storage
          .from('brand-images')
          .getPublicUrl(imagelink);
        setImageUrl(data.publicUrl);
      }
    }
  }, [imagelink]);

  const handleImageError = () => {
    setImageUrl(null);
  };

  return { imageUrl, handleImageError };
};
