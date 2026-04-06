import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemPageAdSlot({ label = "Advertising slot" }: { label?: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-border bg-background/40 px-5 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ItemPageRichText({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  if (!title && !body) return null;

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        {title ? <h2 className="text-lg font-semibold text-foreground">{title}</h2> : null}
        {body ? <p className="text-sm leading-7 text-muted-foreground">{body}</p> : null}
      </CardContent>
    </Card>
  );
}

export function ItemPageEmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
        {icon}
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          {description ? <p className="max-w-xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ItemPageGrid({
  children,
  columnsClassName = "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}: {
  children: ReactNode;
  columnsClassName?: string;
}) {
  return <div className={`grid gap-4 ${columnsClassName}`}>{children}</div>;
}

export function ItemPagePanel({
  title,
  children,
  badge,
}: {
  title?: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      {title ? (
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{title}</CardTitle>
          {badge}
        </CardHeader>
      ) : null}
      <CardContent className={title ? "" : "pt-4"}>{children}</CardContent>
    </Card>
  );
}
