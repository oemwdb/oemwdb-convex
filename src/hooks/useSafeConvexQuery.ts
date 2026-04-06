import { useMemo } from "react";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";

interface SafeConvexQueryState<TData> {
  data: TData | undefined;
  error: Error | null;
  isLoading: boolean;
}

export function useSafeConvexQuery<TData>(
  queryRef: unknown,
  args: Record<string, unknown> | "skip"
): SafeConvexQueryState<TData> {
  const queryKey = useMemo(
    () => [
      "safe-convex-query",
      queryRef,
      args === "skip" ? "skip" : JSON.stringify(args),
    ],
    [args, queryRef]
  );
  const resource = useConvexResourceQuery<TData>({
    queryKey,
    queryRef,
    args,
  });

  return {
    data: resource.data,
    error: resource.error,
    isLoading:
      resource.status === "initial_loading" ||
      resource.status === "refreshing",
  };
}
