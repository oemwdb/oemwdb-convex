import { useMemo, useState } from "react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LinkTargetSearchResult } from "@/components/market/types";
import { ConvexResourceStatusBadge } from "@/components/convex/ConvexResourceStatusBadge";
import { isMissingConvexFunctionError } from "@/lib/convexErrors";

interface MarketTargetPickerProps {
  label: string;
  targetType: "brand" | "vehicle" | "wheel" | "wheel_variant";
  value: LinkTargetSearchResult | null;
  onChange: (value: LinkTargetSearchResult | null) => void;
}

export function MarketTargetPicker({
  label,
  targetType,
  value,
  onChange,
}: MarketTargetPickerProps) {
  const [searchValue, setSearchValue] = useState("");
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const searchResource = useConvexResourceQuery<LinkTargetSearchResult[]>({
    queryKey: ["market", "link-target-search", targetType, searchValue.trim()],
    queryRef: api.market.marketLinkTargetsSearch,
    args: isConvexAuthenticated
      ? {
          targetType,
          ...(searchValue.trim() ? { query: searchValue.trim() } : {}),
        }
      : "skip",
    staleTime: 15_000,
  });
  const resolvedResults = searchResource.data ?? [];

  const visibleResults = useMemo(
    () => resolvedResults.filter((result) => result.id !== value?.id).slice(0, 8),
    [resolvedResults, value?.id]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{value.label}</div>
            {value.subtitle ? (
              <div className="truncate text-xs text-muted-foreground">{value.subtitle}</div>
            ) : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Clear
          </Button>
        </div>
      ) : null}

      <Input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
      />

      {searchValue.trim() ? (
        <ConvexResourceStatusBadge
          status={searchResource.status}
          label={`Refreshing ${label.toLowerCase()} search`}
        />
      ) : null}

      {visibleResults.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-card p-2">
          {visibleResults.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => {
                onChange(result);
                setSearchValue("");
              }}
              className="rounded-lg border border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/40"
            >
              <div className="text-sm font-medium">{result.label}</div>
              {result.subtitle ? (
                <div className="text-xs text-muted-foreground">{result.subtitle}</div>
              ) : null}
            </button>
          ))}
        </div>
      ) : searchValue.trim() && searchResource.error ? (
        <Badge variant="outline">
          {isMissingConvexFunctionError(searchResource.error)
            ? "Search unavailable on this deployment"
            : "Search failed"}
        </Badge>
      ) : searchValue.trim() && !isConvexAuthenticated ? (
        <Badge variant="outline">Convex auth required</Badge>
      ) : searchValue.trim() ? (
        <Badge variant="outline">No matches</Badge>
      ) : null}
    </div>
  );
}
