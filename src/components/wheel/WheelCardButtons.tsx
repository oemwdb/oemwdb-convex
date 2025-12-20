import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCw, Info } from "lucide-react";

interface WheelCardButtonsProps {
    isFlipped: boolean;
    isSourceExpanded: boolean;
    imageSource?: string | null;
    onFlip: () => void;
    onToggleSource: () => void;
}

const WheelCardButtons = ({
    isFlipped,
    isSourceExpanded,
    imageSource,
    onFlip,
    onToggleSource,
}: WheelCardButtonsProps) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            {/* Info button - top left, invisible when flipped */}
            <div
                className={cn(
                    "absolute top-2 h-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-[left,right,width,background-color,border-color] duration-300 ease-out flex items-center overflow-hidden z-10",
                    isSourceExpanded && "bg-background/80 backdrop-blur-sm border-border/50",
                    isSourceExpanded ? "left-2 right-2 pr-10" : "w-8 left-2",
                    !isFlipped
                        ? "opacity-100 translate-y-0 transition-[opacity,transform] duration-300 delay-200 ease-out"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                )}
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-transparent pointer-events-auto flex items-center justify-center"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleSource();
                    }}
                >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Image source</span>
                </Button>

                {isSourceExpanded && (
                    <div className="flex-1 flex items-center gap-2 overflow-hidden animate-in fade-in duration-300 pl-1 pointer-events-auto">
                        <div className="flex-1 overflow-hidden">
                            <div className="animate-marquee whitespace-nowrap">
                                <span className="text-xs text-muted-foreground">
                                    {imageSource || "img source"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Flip button - top right, always visible */}
            <div className="absolute top-2 right-2 h-8 w-8 border border-transparent hover:bg-background/80 hover:backdrop-blur-sm hover:border-border/50 rounded-full transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto z-30">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFlip();
                    }}
                >
                    <RotateCw className="h-4 w-4" />
                    <span className="sr-only">Flip card</span>
                </Button>
            </div>
        </div>
    );
};

export default WheelCardButtons;
