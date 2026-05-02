import { useConvexAuth } from "convex/react";
import { useAuth } from "@/contexts/AuthContext";

export type ConvexAdminAccessStatus =
  | "hidden"
  | "signed_out"
  | "loading"
  | "ready"
  | "token_not_accepted";

interface ConvexAuthDiagnostics {
  status: ConvexAdminAccessStatus;
  title: string;
  description: string;
  details: string[];
  userId: string | null;
  isConvexAuthenticated: boolean;
}

export function useConvexAuthDiagnostics(): ConvexAuthDiagnostics {
  const { actualIsAuthenticated, actualUser, isAdmin } = useAuth();
  const {
    isLoading: isConvexLoading,
    isAuthenticated: isConvexAuthenticated,
  } = useConvexAuth();

  if (!isAdmin) {
    return {
      status: "hidden",
      title: "Convex admin auth is not required here",
      description: "This view does not need Convex admin access.",
      details: [],
      userId: null,
      isConvexAuthenticated,
    };
  }

  if (!actualIsAuthenticated) {
    return {
      status: "signed_out",
      title: "Sign in required",
      description: "Sign in with the local Convex account before using admin tools.",
      details: [],
      userId: null,
      isConvexAuthenticated,
    };
  }

  if (isConvexLoading) {
    return {
      status: "loading",
      title: "Checking Convex admin auth",
      description: "Waiting for Convex Auth to finish the local session handshake.",
      details: [],
      userId: actualUser?.id ?? null,
      isConvexAuthenticated,
    };
  }

  if (isConvexAuthenticated) {
    return {
      status: "ready",
      title: "Convex admin auth is ready",
      description: "The local Convex Auth session is active.",
      details: [],
      userId: actualUser?.id ?? null,
      isConvexAuthenticated,
    };
  }

  return {
    status: "token_not_accepted",
    title: "Convex did not accept the local session",
    description: "The app is signed in, but Convex is not treating this request as authenticated yet.",
    details: [
      "Confirm the local deployment has the Convex Auth schema and HTTP routes.",
      "Confirm JWT_PRIVATE_KEY, JWKS, and CONVEX_SITE_URL are configured for the local Convex backend.",
    ],
    userId: actualUser?.id ?? null,
    isConvexAuthenticated,
  };
}
