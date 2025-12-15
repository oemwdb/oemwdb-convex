
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!className?.includes("justify-center") && (
        <span className="text-sm font-medium text-foreground transition-colors">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      
      <Switch 
        checked={isDark} 
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="transition-colors"
      />
      
      {theme === 'light' ? (
        <Sun size={18} className="text-muted-foreground transition-all" />
      ) : (
        <Moon size={18} className="text-muted-foreground transition-all" />
      )}
    </div>
  );
};

export default ThemeToggle;
