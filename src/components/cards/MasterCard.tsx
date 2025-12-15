import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCw, Heart } from "lucide-react";
import { CardBackSlot } from "@/components/cards/CardBackSlot";

interface MasterCardProps {
  data: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string | null;
    specs?: string[];
    metadata?: string;
  };
  isFlipped: boolean;
  onFlip: (id: string) => void;
  dataMapping?: Array<{
    id: string;
    field: string;
    value: string;
    location: string;
    order: number;
    label?: string;
  }>;
}

const MasterCard = ({ data, isFlipped, onFlip, dataMapping }: MasterCardProps) => {
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
    
    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkOverflow, 50);
    });
    
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
  }, [data.title]);

  const handleFlip = () => {
    onFlip(data.id);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className={cn(
        "relative w-full h-[240px] transition-transform duration-500 transform-style-3d",
        isFlipped ? "rotate-y-180" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Front of card */}
      <Card className="absolute inset-0 w-full h-full backface-hidden hover:shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-[188px] w-full bg-gradient-to-b from-muted to-muted/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-2 sm:right-3 h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:!bg-transparent z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFlip();
              }}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span className="sr-only">Flip card</span>
            </Button>
            
            <div className="w-full h-full flex items-center justify-center p-4">
              {data.imageUrl ? (
                <div className="relative w-32 h-32">
                  <img 
                    src={data.imageUrl} 
                    alt={data.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-muted rounded-t-lg">
                    <span className="text-muted-foreground text-sm text-center px-2">
                      No image available
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg">
                  <span className="text-muted-foreground text-sm text-center px-2">
                    No image available
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-card/90 p-3 border-t border-primary/10 flex items-center justify-between h-[52px]">
            <div className="relative overflow-hidden flex-1">
              <p 
                ref={textRef}
                className={cn(
                  "text-foreground text-sm font-medium whitespace-nowrap",
                  isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                )}
              >
                {data.title}
                {isTextOverflowing && isHovering && (
                  <span className="pl-4 inline-block">{data.title}</span>
                )}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-7 w-7 p-0 flex-shrink-0 hover:!bg-transparent",
                isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
            >
              <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back of card */}
      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 hover:shadow-md overflow-hidden bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-full w-full bg-gradient-to-b from-muted to-muted/50 flex flex-col">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-2 sm:right-3 h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:!bg-transparent z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFlip();
              }}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span className="sr-only">Flip card</span>
            </Button>
            
            {/* Content section - takes remaining space */}
            <div className="flex-1 flex flex-col">
              <div className="px-4 pt-4 pb-2">
                <h4 className="font-medium text-foreground text-sm">Information</h4>
              </div>
              <div className="flex-1 overflow-y-auto">
                {dataMapping && dataMapping.length > 0 ? (
                  // Use dataMapping if provided
                  dataMapping
                    .filter(item => item.location === 'back')
                    .sort((a, b) => a.order - b.order)
                    .map((mapping, idx, arr) => {
                      // Use the label from mapping if available
                      const label = mapping.label || mapping.field.replace(/([A-Z])/g, ' $1').trim()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      
                      // Always display the label in brackets
                      const displayValue = `[${label}]`;
                      
                      return (
                        <div
                          key={mapping.id}
                          className={cn(
                            "h-8 flex items-center px-4 border-b border-border/50",
                            idx === arr.length - 1 && "border-b-0"
                          )}
                        >
                          <span className="text-xs truncate">
                            {displayValue}
                          </span>
                        </div>
                      );
                    })
                ) : (
                  // Fallback to default specs display
                  <>
                    {data.description && (
                      <div className="h-8 flex items-center px-4 border-b border-border/50">
                        <span className="text-xs truncate">{data.description}</span>
                      </div>
                    )}
                    {data.specs && data.specs.map((spec, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "h-8 flex items-center px-4 border-b border-border/50",
                          idx === data.specs!.length - 1 && !data.metadata && "border-b-0"
                        )}
                      >
                        <span className="text-xs truncate">{spec}</span>
                      </div>
                    ))}
                    {data.metadata && (
                      <div className="h-8 flex items-center px-4 border-b-0">
                        <span className="text-xs truncate">{data.metadata}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-card/90 p-3 border-t border-accent/10 flex items-center justify-between flex-shrink-0 h-[52px]">
              <div className="relative overflow-hidden flex-1">
                <p 
                  ref={backTextRef}
                  className={cn(
                    "text-foreground text-sm font-medium whitespace-nowrap",
                    isTextOverflowing && isHovering ? "animate-text-scroll" : ""
                  )}
                >
                  {data.title}
                  {isTextOverflowing && isHovering && (
                    <span className="pl-4 inline-block">{data.title}</span>
                  )}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-7 w-7 p-0 flex-shrink-0 hover:!bg-transparent",
                  isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite();
                }}
              >
                <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
                <span className="sr-only">Favorite</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterCard;