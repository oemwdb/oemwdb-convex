import React from "react";
import { cn } from "@/lib/utils";

/** Full-width ad bar height — compact banner so it doesn’t dominate the layout. */
const AD_BAR_HEIGHT = 144;

interface AdBarProps {
  className?: string;
}

export function AdBar({ className }: AdBarProps) {
  return (
    <div
      role="banner"
      aria-label="Advertisement"
      className={cn(
        "w-full rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0",
        className
      )}
      style={{ minHeight: AD_BAR_HEIGHT, height: AD_BAR_HEIGHT }}
    >
      <span className="text-xs text-muted-foreground">Ad</span>
    </div>
  );
}

export { AD_BAR_HEIGHT };
