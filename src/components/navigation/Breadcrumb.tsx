import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, X, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const { history, removeFromHistory, clearHistory } = useNavigation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Determine how many items to show based on history length
  const MAX_VISIBLE_ITEMS = 6;
  const COLLAPSED_VISIBLE = 3;
  
  const shouldCollapse = history.length > MAX_VISIBLE_ITEMS;
  const collapsedItems = shouldCollapse 
    ? history.slice(COLLAPSED_VISIBLE, history.length - COLLAPSED_VISIBLE)
    : [];
  
  const visibleItems = shouldCollapse
    ? [
        ...history.slice(0, COLLAPSED_VISIBLE),
        null, // Placeholder for collapsed items
        ...history.slice(history.length - COLLAPSED_VISIBLE)
      ]
    : history;
  
  if (history.length === 0) {
    return null;
  }
  
  const handleItemClick = (item: any, index: number) => {
    // Navigate to the clicked item
    navigate(item.path);
    
    // Remove all items after this one from history
    const actualIndex = history.findIndex(h => h.timestamp === item.timestamp);
    if (actualIndex < history.length - 1) {
      // Remove items after the clicked one
      for (let i = history.length - 1; i > actualIndex; i--) {
        removeFromHistory(i);
      }
    }
  };
  
  return (
    <nav className="flex items-center space-x-1 text-xs transition-all duration-300">
      {visibleItems.map((item, index) => {
        // Handle collapsed items placeholder
        if (item === null) {
          return (
            <React.Fragment key="collapsed">
              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="ml-1 text-xs">{collapsedItems.length} more</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="space-y-1">
                     {collapsedItems.map((collapsedItem) => {
                      const Icon = collapsedItem.icon;
                      const actualIdx = history.findIndex(h => h.timestamp === collapsedItem.timestamp);
                      return (
                        <button
                          key={collapsedItem.timestamp}
                          onClick={() => handleItemClick(collapsedItem, actualIdx)}
                          className="flex items-center w-full px-2 py-1.5 text-xs rounded-md hover:bg-muted transition-colors"
                        >
                          <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{collapsedItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </React.Fragment>
          );
        }
        
        const actualIndex = history.findIndex(h => h.timestamp === item.timestamp);
        const isLast = actualIndex === history.length - 1;
        const Icon = item.icon;
        const isHovered = hoveredIndex === actualIndex;
        
        return (
          <React.Fragment key={item.timestamp}>
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
            
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredIndex(actualIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isLast ? (
                // Last item - always expanded with special styling
                <span 
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md font-medium whitespace-nowrap",
                    "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  <Icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </span>
              ) : (
                // Previous items - show as icon, expand on hover
                <button
                  onClick={() => handleItemClick(item, actualIndex)}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md font-medium whitespace-nowrap",
                    "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                    "border border-border hover:border-border/80",
                    "transition-all duration-200"
                  )}
                >
                  <Icon className="h-3 w-3 flex-shrink-0" />
                  <span className={cn(
                    "ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-500",
                    isHovered ? "max-w-[200px]" : "max-w-0"
                  )}>
                    {item.label}
                  </span>
                </button>
              )}
              
              {/* Remove button on hover */}
              {hoveredIndex === actualIndex && !isLast && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(actualIndex, navigate);
                  }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors animate-in fade-in zoom-in duration-200"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          </React.Fragment>
        );
      })}
      
      {/* Clear all button when there are many items */}
      {history.length > 3 && (
        <>
          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            Clear
          </Button>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;