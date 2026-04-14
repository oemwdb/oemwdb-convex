import type { ReactNode } from "react";

import { AdminEditableBrandDescription } from "@/components/brand/AdminEditableBrandDescription";
import { AdminEditableItemTitle } from "@/components/item-page/AdminEditableItemTitle";
import { SaveButton } from "@/components/SaveButton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BrandHeaderCount {
  label: string;
  value: number | string;
}

interface BrandHeaderCardProps {
  title: string;
  description?: string | null;
  counts: BrandHeaderCount[];
  media?: ReactNode;
  itemId?: string;
  convexId?: string;
}

export default function BrandHeaderCard({
  title,
  description,
  counts,
  media,
  itemId,
  convexId,
}: BrandHeaderCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px]">
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <AdminEditableItemTitle
                title={title}
                itemType="brand"
                convexId={convexId}
                className="text-2xl font-bold leading-tight md:text-3xl"
                inputClassName="h-11 rounded-xl border-white/15 bg-black/30 text-2xl font-bold leading-tight md:text-3xl"
                placeholder="Untitled brand"
              />
              {itemId && convexId ? (
                <SaveButton
                  itemId={itemId}
                  itemType="brand"
                  convexId={convexId}
                  iconStyle="heart"
                  className="mt-1 h-8 w-8 p-0 text-muted-foreground hover:!bg-transparent hover:text-foreground"
                />
              ) : null}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)] lg:items-start">
              <div className="rounded-2xl border border-border/60 bg-black/20 px-4 py-4 text-sm leading-7 text-muted-foreground">
                <AdminEditableBrandDescription
                  value={description}
                  convexId={convexId}
                  className="min-h-[140px] text-sm leading-7 text-muted-foreground"
                />
              </div>

              <div className="space-y-0 text-sm">
                {counts.map((count) => (
                  <div
                    key={count.label}
                    className={cn(
                      "flex items-start justify-between gap-3 border-b border-border/60 pb-3 pt-1"
                    )}
                  >
                    <span className="min-w-[110px] font-medium text-muted-foreground">
                      {count.label}:
                    </span>
                    <span className="inline-flex h-7 min-w-[44px] items-center justify-center rounded-full border border-border/70 bg-black/25 px-3 py-0 text-[13px] font-semibold text-foreground">
                      {count.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="relative overflow-hidden rounded-[24px] border border-border/60 bg-muted">
              <div className="aspect-square w-full">{media}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
