/**
 * Stats Widget Component
 *
 * Description: A statistics card displaying an icon, metric value, label, and trend indicator
 *
 * Usage:
 * <StatsWidget
 *   icon={<TrendingUp className="h-4 w-4" />}
 *   value="12,345"
 *   label="Total Users"
 *   trend="+12.5%"
 *   trendDirection="up"
 * />
 *
 * Props:
 * - icon: ReactNode (required) - Icon to display
 * - value: string | number (required) - Main metric value
 * - label: string (required) - Metric label/description
 * - trend: string (optional) - Trend percentage or change
 * - trendDirection: 'up' | 'down' | 'neutral' (optional) - Trend direction for coloring
 * - variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' (optional) - Color variant
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsWidgetProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

export const StatsWidget = ({
  icon,
  value,
  label,
  trend,
  trendDirection = 'neutral',
  variant = 'default'
}: StatsWidgetProps) => {
  const variantStyles = {
    default: 'bg-primary/10 text-primary',
    accent: 'bg-accent text-accent-foreground',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  };

  const TrendIcon = trendIcons[trendDirection];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
            {icon}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <TrendIcon className={cn("h-3 w-3", trendColors[trendDirection])} />
                <span className={cn("text-xs font-medium", trendColors[trendDirection])}>
                  {trend}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;
