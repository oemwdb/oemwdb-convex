import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCw, Heart, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ModifiedVehicleRecord } from "@/data/modifiedVehicles";

interface ModifiedVehicleCardProps {
  build: ModifiedVehicleRecord;
  isFlipped: boolean;
  onFlip: (slug: string) => void;
  height?: string;
}

export default function ModifiedVehicleCard({
  build,
  isFlipped,
  onFlip,
  height = "h-[240px]",
}: ModifiedVehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSourceExpanded, setIsSourceExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isFlipped) setIsSourceExpanded(false);
  }, [isFlipped]);

  useEffect(() => {
    const checkOverflow = () => {
      const parent = textRef.current?.parentElement;
      if (!textRef.current || !parent) return;
      setIsTextOverflowing(textRef.current.scrollWidth > parent.clientWidth);
    };
    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [build.title]);

  return (
    <Link to={`/builds/${build.slug}`} className={cn("group relative block w-full perspective-1000", height)}>
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : "",
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Card className="absolute inset-0 w-full h-full backface-hidden overflow-hidden">
          <CardContent className="p-0 flex h-full flex-col">
            <div className="flex-1 overflow-hidden bg-muted">
              {build.image ? (
                <img src={build.image} alt={build.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            <div className="border-t border-border bg-card p-3 flex items-center justify-between gap-2">
              <div className="relative overflow-hidden flex-1">
                <p
                  ref={textRef}
                  className={cn(
                    "text-foreground text-sm font-medium whitespace-nowrap",
                    isTextOverflowing && isHovering ? "animate-text-scroll" : "",
                  )}
                >
                  {build.title}
                  {isTextOverflowing && isHovering ? <span className="pl-4 inline-block">{build.title}</span> : null}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 w-7 p-0 hover:!bg-transparent flex-shrink-0",
                  isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsFavorite((current) => !current);
                }}
              >
                <Heart className={cn("h-3.5 w-3.5", isFavorite ? "fill-current" : "")} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 overflow-hidden">
          <CardContent className="flex h-full flex-col p-0">
            <div className="px-4 pt-4 pb-2">
              <h4 className="text-sm font-medium text-foreground">{build.builder}</h4>
              <p className="text-xs text-muted-foreground">{build.baseVehicle}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2">
              {[
                { label: "Style", values: [build.style] },
                { label: "Era", values: [build.era] },
                { label: "Features", values: build.featureTags },
              ].map((row) => (
                <div key={row.label} className="border-b border-border/50 py-2 last:border-b-0">
                  <div className="flex flex-wrap gap-1">
                    {row.values.map((value) => (
                      <Badge key={`${row.label}-${value}`} variant="secondary" className="text-xs px-2 py-0.5">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-card p-3 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground truncate">{build.brand}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onFlip(build.slug);
                }}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div
          className={cn(
            "absolute top-2 h-8 rounded-full border border-transparent transition-[left,right,width,background-color,border-color] duration-300 ease-out flex items-center overflow-hidden z-10",
            isSourceExpanded && "bg-background/80 backdrop-blur-sm border-border/50",
            isSourceExpanded ? "left-2 right-12 pr-3" : "w-8 left-2",
            !isFlipped ? "opacity-100" : "opacity-0 -translate-y-2 pointer-events-none",
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-transparent pointer-events-auto"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsSourceExpanded((current) => !current);
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
          {isSourceExpanded ? (
            <div className="flex-1 overflow-hidden pl-1 pointer-events-auto">
              <div className="animate-marquee whitespace-nowrap text-xs text-muted-foreground">
                {build.baseVehicle} | {build.builder} | build features pending normalized source
              </div>
            </div>
          ) : null}
        </div>

        <div className="absolute top-2 right-2 h-8 w-8 rounded-full border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto z-30">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFlip(build.slug);
            }}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
