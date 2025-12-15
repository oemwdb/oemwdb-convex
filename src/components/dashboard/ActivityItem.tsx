
import React from "react";
import { cn } from "@/lib/utils";

export interface ActivityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

const ActivityItem = ({
  className,
  title,
  description,
  timestamp,
  icon,
  iconColor = "bg-muted text-muted-foreground",
  ...props
}: ActivityItemProps) => {
  return (
    <div className={cn("flex gap-3 py-3", className)} {...props}>
      {icon && (
        <div className={cn("mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0", iconColor)}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
