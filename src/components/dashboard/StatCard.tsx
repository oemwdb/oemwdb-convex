
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const statCardVariants = cva("bg-card rounded-lg border p-4 shadow-sm", {
  variants: {
    trend: {
      positive: "border-l-4 border-l-emerald-500",
      negative: "border-l-4 border-l-rose-500",
      neutral: "border-l-4 border-l-muted-foreground",
    },
  },
  defaultVariants: {
    trend: "neutral",
  },
});

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
}

const StatCard = ({
  className,
  title,
  value,
  change,
  icon,
  trend,
  ...props
}: StatCardProps) => {
  // If change is provided, calculate trend based on its value
  const actualTrend = trend || (change && change > 0 ? "positive" : change && change < 0 ? "negative" : "neutral");
  
  return (
    <div className={cn(statCardVariants({ trend: actualTrend }), className)} {...props}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-foreground">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-2 text-sm">
              {change > 0 ? (
                <>
                  <TrendingUp size={16} className="text-emerald-500 mr-1" />
                  <span className="text-emerald-500">{Math.abs(change)}%</span>
                </>
              ) : change < 0 ? (
                <>
                  <TrendingDown size={16} className="text-rose-500 mr-1" />
                  <span className="text-rose-500">{Math.abs(change)}%</span>
                </>
              ) : (
                <span className="text-muted-foreground">0%</span>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          )}
        </div>
        
        {icon && <div className="p-2 bg-muted rounded-md">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
