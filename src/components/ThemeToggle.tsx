import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && <Sun size={14} className="text-muted-foreground" />}
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="h-4 w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
      />
      {!compact && <Moon size={14} className="text-muted-foreground" />}
    </div>
  );
};

export default ThemeToggle;
