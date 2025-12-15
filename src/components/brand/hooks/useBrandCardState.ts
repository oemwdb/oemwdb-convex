
import { useState, useRef, useEffect } from "react";

export const useBrandCardState = (brandName: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const backTextRef = useRef<HTMLParagraphElement>(null);

  // Check if text is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      // Check front text
      if (textRef.current) {
        const parent = textRef.current.parentElement;
        if (parent) {
          const isOverflowing = textRef.current.scrollWidth > parent.clientWidth;
          setIsTextOverflowing(isOverflowing);
        }
      }
      // Check back text
      if (backTextRef.current) {
        const parent = backTextRef.current.parentElement;
        if (parent) {
          const isOverflowing = backTextRef.current.scrollWidth > parent.clientWidth;
          setIsTextOverflowing(prev => prev || isOverflowing);
        }
      }
    };
    
    // Delay initial check to ensure layout is complete
    const timeoutId = setTimeout(checkOverflow, 100);
    
    // Re-check on window resize
    window.addEventListener('resize', checkOverflow);
    
    // Use ResizeObserver to detect when card size changes (e.g., sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkOverflow, 50);
    });
    
    // Observe both text elements and their containers
    if (textRef.current?.parentElement) {
      resizeObserver.observe(textRef.current.parentElement);
    }
    if (backTextRef.current?.parentElement) {
      resizeObserver.observe(backTextRef.current.parentElement);
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
      resizeObserver.disconnect();
    };
  }, [brandName]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return {
    isFavorite,
    isTextOverflowing,
    isHovering,
    textRef,
    backTextRef,
    setIsHovering,
    toggleFavorite
  };
};
