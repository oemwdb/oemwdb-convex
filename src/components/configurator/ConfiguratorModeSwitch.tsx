import { CarFront, Disc3 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConfiguratorMode } from "./configuratorModes";

type ConfiguratorModeSwitchProps = {
  value: ConfiguratorMode;
  onChange: (mode: ConfiguratorMode) => void;
};

const MODES: Array<{
  value: ConfiguratorMode;
  label: string;
  icon: typeof CarFront;
}> = [
  { value: "vehicleCombo", label: "Vehicle combo", icon: CarFront },
  { value: "wheelTire", label: "Wheel + tire", icon: Disc3 },
];

export default function ConfiguratorModeSwitch({ value, onChange }: ConfiguratorModeSwitchProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-black p-1">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const active = mode.value === value;

        return (
          <button
            key={mode.value}
            type="button"
            className={cn(
              "group flex h-8 w-8 items-center justify-start overflow-hidden rounded-full border border-transparent px-2 text-sm font-semibold transition-all duration-200 hover:w-36 hover:border-orange-500/60 hover:bg-orange-500/10 hover:text-orange-300 focus-visible:w-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70",
              active && "w-36 border-orange-500/70 bg-orange-500/15 text-orange-300",
            )}
            onClick={() => onChange(mode.value)}
            aria-pressed={active}
            title={mode.label}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "ml-2 max-w-0 whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-28 group-hover:opacity-100 group-focus-visible:max-w-28 group-focus-visible:opacity-100",
                active && "max-w-28 opacity-100",
              )}
            >
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
