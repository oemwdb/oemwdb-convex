import React from "react";
import { PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDoodle } from "@/contexts/DoodleContext";
import { cn } from "@/lib/utils";

interface DoodleTriggerProps {
  buttonClassName?: string;
}

export function DoodleTrigger({ buttonClassName }: DoodleTriggerProps) {
  const {
    canUseDoodle,
    isDoodlePanelOpen,
    closeAllDoodle,
    openDoodlePanel,
  } = useDoodle();

  if (!canUseDoodle) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full border border-border bg-sidebar hover:bg-white/10",
        isDoodlePanelOpen && "border-white/20 bg-white/[0.08]",
        buttonClassName
      )}
      title={isDoodlePanelOpen ? "Close doodle panel" : "Open doodle panel"}
      onClick={() => {
        if (isDoodlePanelOpen) {
          closeAllDoodle();
          return;
        }
        openDoodlePanel();
      }}
    >
      <PencilLine
        className={cn("h-4 w-4 text-white", isDoodlePanelOpen && "text-white")}
      />
    </Button>
  );
}
