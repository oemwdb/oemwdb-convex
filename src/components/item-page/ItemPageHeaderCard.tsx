import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { AdminEditableItemTitle } from "@/components/item-page/AdminEditableItemTitle";
import { SaveButton } from "@/components/SaveButton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ItemPageHeaderValue {
  label: string;
  href?: string;
  muted?: boolean;
}

interface ItemPageHeaderRow {
  label: string;
  values: ItemPageHeaderValue[];
  span?: "single" | "full";
}

interface ItemPageHeaderCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  rows: ItemPageHeaderRow[];
  media?: ReactNode;
  mediaRatio?: number;
  itemId?: string;
  itemType?: "wheel" | "vehicle" | "brand";
  convexId?: string;
  editableTitleType?: "wheel" | "vehicle" | "brand" | "engine" | "color";
}

function renderHeaderValue(value: ItemPageHeaderValue, key: string) {
  const badge = (
    <Badge
      variant="outline"
      className="h-7 rounded-full px-2.5 py-0 text-[11px] transition-colors hover:border-white/90"
    >
      {value.label}
    </Badge>
  );

  if (value.href) {
    return (
      <Link key={key} to={value.href}>
        {badge}
      </Link>
    );
  }

  return (
    <span key={key}>
      {value.muted ? (
        <Badge
          variant="outline"
          className="h-7 rounded-full px-2.5 py-0 text-[11px] opacity-50 transition-colors hover:border-white/70"
        >
          {value.label}
        </Badge>
      ) : (
        badge
      )}
    </span>
  );
}

export default function ItemPageHeaderCard({
  title,
  subtitle,
  description,
  rows,
  media,
  mediaRatio = 1,
  itemId,
  itemType,
  convexId,
  editableTitleType,
}: ItemPageHeaderCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px]">
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-5">
              <div className="flex items-start gap-2">
                {editableTitleType ? (
                  <AdminEditableItemTitle
                    title={title}
                    itemType={editableTitleType}
                    convexId={convexId}
                    className="text-2xl font-bold leading-tight md:text-3xl"
                    inputClassName="h-11 rounded-xl border-white/15 bg-black/30 text-2xl font-bold leading-tight md:text-3xl"
                    placeholder="Untitled item"
                  />
                ) : (
                  <h1 className="text-2xl font-bold leading-tight md:text-3xl">
                    {title}
                  </h1>
                )}
                {itemId && itemType && convexId ? (
                  <SaveButton
                    itemId={itemId}
                    itemType={itemType}
                    convexId={convexId}
                    iconStyle="heart"
                    className="mt-1 h-8 w-8 p-0 text-muted-foreground hover:!bg-transparent hover:text-foreground"
                  />
                ) : null}
              </div>
              {subtitle ? (
                <p className="mt-1 text-base text-muted-foreground">{subtitle}</p>
              ) : null}
              {description ? (
                <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {rows.map((row) => {
                const values =
                  row.values.length > 0
                    ? row.values
                    : [{ label: "N/A", muted: true }];

                return (
                  <div
                    key={row.label}
                    className={row.span === "full" ? "sm:col-span-2" : undefined}
                  >
                    <div className="flex items-start gap-2 border-b border-border/60 pb-3">
                      <span className="min-w-[110px] font-medium text-muted-foreground">
                        {row.label}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {values.map((value, index) =>
                          renderHeaderValue(value, `${row.label}-${value.label}-${index}`),
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full">
            <AspectRatio
              ratio={mediaRatio}
              className="relative overflow-hidden rounded-[24px] border border-border/60 bg-muted"
            >
              {media}
            </AspectRatio>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
