import { useConvex } from "convex/react";
import { useMemo } from "react";
import { useQuery as useReactQuery, type QueryKey } from "@tanstack/react-query";
import {
  getConvexErrorMessage,
  isConvexBackendUnavailableError,
  toError,
} from "@/lib/convexErrors";

export type ConvexResourceStatus =
  | "idle"
  | "initial_loading"
  | "refreshing"
  | "ready"
  | "backend_unavailable"
  | "error";

interface UseConvexResourceQueryOptions {
  queryKey: QueryKey;
  queryRef: unknown;
  args: Record<string, unknown> | "skip";
  enabled?: boolean;
  staleTime?: number;
}

interface ConvexResourceState<TData> {
  status: ConvexResourceStatus;
  data: TData | undefined;
  error: Error | null;
  isIdle: boolean;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isReady: boolean;
  isBackendUnavailable: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => Promise<void>;
}

export function useConvexResourceQuery<TData>({
  queryKey,
  queryRef,
  args,
  enabled = true,
  staleTime = 30_000,
}: UseConvexResourceQueryOptions): ConvexResourceState<TData> {
  const convex = useConvex();
  const isSkipped = !enabled || args === "skip";
  const serializedArgs = useMemo(
    () => (isSkipped ? "skip" : JSON.stringify(args)),
    [args, isSkipped]
  );
  const parsedArgs = useMemo(
    () =>
      serializedArgs === "skip"
        ? null
        : (JSON.parse(serializedArgs) as Record<string, unknown>),
    [serializedArgs]
  );

  const query = useReactQuery({
    queryKey: [...queryKey, serializedArgs],
    enabled: !isSkipped,
    staleTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) =>
      !isConvexBackendUnavailableError(error) && failureCount < 1,
    queryFn: async () =>
      (await Promise.resolve(
        convex.query(queryRef as never, parsedArgs as never)
      )) as TData,
  });

  const error = query.error ? toError(query.error) : null;

  const status: ConvexResourceStatus = useMemo(() => {
    if (isSkipped) return "idle";
    if (error) {
      return isConvexBackendUnavailableError(error)
        ? "backend_unavailable"
        : "error";
    }
    if ((query.isPending || query.fetchStatus === "fetching") && query.data === undefined) {
      return "initial_loading";
    }
    if (query.isFetching && query.data !== undefined) {
      return "refreshing";
    }
    return "ready";
  }, [error, isSkipped, query.data, query.fetchStatus, query.isFetching, query.isPending]);

  return {
    status,
    data: query.data as TData | undefined,
    error,
    isIdle: status === "idle",
    isInitialLoading: status === "initial_loading",
    isRefreshing: status === "refreshing",
    isReady: status === "ready",
    isBackendUnavailable: status === "backend_unavailable",
    isError: status === "error",
    errorMessage: error ? getConvexErrorMessage(error) : null,
    refetch: async () => {
      await query.refetch();
    },
  };
}
