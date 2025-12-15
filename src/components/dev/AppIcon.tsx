import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface AppIconProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  external?: boolean;
}

const AppIcon = ({ to, icon: Icon, label, description, className, disabled = false, external = false }: AppIconProps) => {
  const content = (
    <Card className={cn(
      "group relative flex flex-col items-center justify-center",
      "h-24 sm:h-28",
      "transition-all duration-200",
      disabled ? [
        "opacity-50 cursor-not-allowed"
      ] : [
        "cursor-pointer",
        "hover:shadow-md",
        "hover:border-primary/30"
      ],
      className
    )}>
      <Icon className={cn(
        "h-8 w-8 mb-2",
        "transition-colors duration-200",
        disabled ? "text-muted-foreground" : "text-foreground"
      )} />
      
      <span className={cn(
        "text-sm font-medium text-center",
        disabled ? "text-muted-foreground" : "text-foreground"
      )}>
        {label}
      </span>
      
      {/* Disabled badge */}
      {disabled && (
        <div className="absolute top-2 right-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5">
          <span className="text-[10px] font-medium">SOON</span>
        </div>
      )}
    </Card>
  );

  if (disabled) {
    return content;
  }

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className="block">
      {content}
    </Link>
  );
};

export default AppIcon;