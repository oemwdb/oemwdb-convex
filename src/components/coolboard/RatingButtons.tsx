import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";
import { ThumbsDown, Frown, Meh, ThumbsUp, Heart } from "lucide-react";

interface RatingButtonsProps {
  itemType: 'brand' | 'vehicle' | 'wheel';
  itemId: number;
  userId?: string;
  onRatingChange?: (rating: number) => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({ 
  itemType, 
  itemId, 
  userId,
  onRatingChange 
}) => {
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ratings = [
    { value: 1, label: "V Uncool", icon: ThumbsDown, gradient: "from-red-500 to-red-600" },
    { value: 2, label: "Uncool", icon: Frown, gradient: "from-orange-500 to-orange-600" },
    { value: 3, label: "Meh", icon: Meh, gradient: "from-gray-500 to-gray-600" },
    { value: 4, label: "Cool", icon: ThumbsUp, gradient: "from-blue-500 to-blue-600" },
    { value: 5, label: "V Cool", icon: Heart, gradient: "from-green-500 to-green-600" }
  ];

  useEffect(() => {
    if (userId && itemId) {
      fetchUserRating();
    }
  }, [userId, itemId, itemType]);

  const fetchUserRating = async () => {
    // TODO: use Convex query for cool_ratings when wired
    void userId; void itemType; void itemId;
    setCurrentRating(0);
  };

  const handleRating = async (rating: number) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate items",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: use Convex mutation for cool_ratings when wired
      void userId; void itemType; void itemId; void rating;

      setCurrentRating(rating);
      onRatingChange?.(rating);
      
      // Add celebration animation
      const button = document.querySelector(`[data-rating="${rating}"]`);
      button?.classList.add('animate-scale-in');
      setTimeout(() => {
        button?.classList.remove('animate-scale-in');
      }, 300);

      toast({
        title: "Rating saved!",
        description: `You rated this ${itemType} as ${ratings[rating - 1].label}`,
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error",
        description: "Failed to save rating",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-2 w-full max-w-full">
      {ratings.map((rating) => {
        const Icon = rating.icon;
        const isActive = currentRating === rating.value;
        
        return (
          <Button
            key={rating.value}
            data-rating={rating.value}
            onClick={() => handleRating(rating.value)}
            disabled={isLoading}
            className={cn(
              "relative group transition-all duration-200 flex-1 h-16",
              "hover:scale-105 active:scale-95",
              isActive ? `bg-gradient-to-r ${rating.gradient} text-white border-2 border-white/20` : ""
            )}
            variant={isActive ? "default" : "outline"}
          >
            <span className={cn(
              "absolute inset-0 rounded-md bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity",
              rating.gradient,
              isActive ? "opacity-30" : ""
            )} />
            <span className="relative flex items-center justify-center gap-2">
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{rating.label}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default RatingButtons;