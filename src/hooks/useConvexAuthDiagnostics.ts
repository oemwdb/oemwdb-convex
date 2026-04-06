import { useAuth as useClerkAuth } from "@clerk/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";

export type ConvexAdminAccessStatus =
  | "hidden"
  | "signed_out"
  | "loading"
  | "ready"
  | "missing_clerk_token"
  | "missing_backend_issuer"
  | "issuer_mismatch"
  | "token_not_accepted"
  | "probe_unavailable";

interface SessionProbeResult {
  authenticated: boolean;
  subject: string | null;
  tokenIdentifier: string | null;
  email: string | null;
  expectedIssuerDomain: string | null;
  applicationID: "convex";
}

interface ConvexAuthDiagnostics {
  status: ConvexAdminAccessStatus;
  title: string;
  description: string;
  details: string[];
  expectedIssuerDomain: string | null;
  clerkIssuerDomain: string | null;
  hasConvexTemplateToken: boolean | null;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof globalThis.atob === "function") {
    return globalThis.atob(padded);
  }

  return null;
}

function parseClerkIssuerDomainFromPublishableKey(value?: string) {
  const publishableKey = value?.trim();
  if (!publishableKey) return null;

  const payload = publishableKey.replace(/^pk_(test|live)_/, "");
  const decoded = decodeBase64Url(payload);
  if (!decoded) return null;

  const host = decoded.replace(/\$$/, "").trim();
  return host ? `https://${host}` : null;
}

export function useConvexAuthDiagnostics(): ConvexAuthDiagnostics {
  const { actualIsAuthenticated, isAdmin } = useAuth();
  const { isLoaded: isClerkLoaded, getToken } = useClerkAuth();
  const {
    isLoading: isConvexLoading,
    isAuthenticated: isConvexAuthenticated,
  } = useConvexAuth();
  const [hasConvexTemplateToken, setHasConvexTemplateToken] = useState<boolean | null>(null);

  const clerkIssuerDomain = useMemo(
    () =>
      parseClerkIssuerDomainFromPublishableKey(
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;

    if (!isAdmin || !actualIsAuthenticated || !isClerkLoaded) {
      setHasConvexTemplateToken(null);
      return;
    }

    setHasConvexTemplateToken(null);

    void getToken({ template: "convex" })
      .then((token) => {
        if (cancelled) return;
        setHasConvexTemplateToken(Boolean(token));
      })
      .catch(() => {
        if (cancelled) return;
        setHasConvexTemplateToken(false);
      });

    return () => {
      cancelled = true;
    };
  }, [actualIsAuthenticated, getToken, isAdmin, isClerkLoaded]);

  const sessionProbe = useConvexResourceQuery<SessionProbeResult>({
    queryKey: ["convex-auth-session-probe"],
    queryRef: api.auth.sessionProbe,
    args: isAdmin ? {} : "skip",
    staleTime: 60_000,
  });

  if (!isAdmin) {
    return {
      status: "hidden",
      title: "Convex admin auth is not required here",
      description: "This view does not need Convex admin access.",
      details: [],
      expectedIssuerDomain: null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (!actualIsAuthenticated) {
    return {
      status: "signed_out",
      title: "Sign in required",
      description: "Clerk is not signed in yet, so Convex cannot establish an admin session.",
      details: [],
      expectedIssuerDomain: sessionProbe.data?.expectedIssuerDomain ?? null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (!isClerkLoaded || isConvexLoading || hasConvexTemplateToken === null) {
    return {
      status: "loading",
      title: "Checking Convex admin auth",
      description: "Waiting for Clerk and Convex to finish the admin session handshake.",
      details: [],
      expectedIssuerDomain: sessionProbe.data?.expectedIssuerDomain ?? null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (isConvexAuthenticated) {
    return {
      status: "ready",
      title: "Convex admin auth is ready",
      description: "The authenticated Clerk session is reaching Convex.",
      details: [],
      expectedIssuerDomain: sessionProbe.data?.expectedIssuerDomain ?? null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (sessionProbe.isBackendUnavailable) {
    return {
      status: "probe_unavailable",
      title: "Convex auth diagnostics are not deployed on cloud dev",
      description: "The auth probe query is missing from the cloud dev deployment, so we cannot inspect the backend auth config yet.",
      details: sessionProbe.errorMessage ? [sessionProbe.errorMessage] : [],
      expectedIssuerDomain: null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (!hasConvexTemplateToken) {
    return {
      status: "missing_clerk_token",
      title: "Clerk is not issuing the Convex token",
      description: "Clerk is signed in, but `getToken({ template: \"convex\" })` returned no token.",
      details: [
        "Create or enable the Clerk JWT template named `convex`.",
        "Make sure the template uses the same Clerk instance as the current publishable key.",
      ],
      expectedIssuerDomain: sessionProbe.data?.expectedIssuerDomain ?? null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (!sessionProbe.data?.expectedIssuerDomain) {
    return {
      status: "missing_backend_issuer",
      title: "Convex is missing the Clerk issuer configuration",
      description: "The cloud dev backend is not advertising a `CLERK_JWT_ISSUER_DOMAIN` value yet.",
      details: clerkIssuerDomain
        ? [`Expected issuer from the current Clerk publishable key: ${clerkIssuerDomain}`]
        : [],
      expectedIssuerDomain: null,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  if (
    clerkIssuerDomain &&
    sessionProbe.data.expectedIssuerDomain !== clerkIssuerDomain
  ) {
    return {
      status: "issuer_mismatch",
      title: "Clerk and Convex are pointing at different issuers",
      description: "Clerk can mint a `convex` token, but the cloud dev backend is expecting a different issuer.",
      details: [
        `Clerk publishable key issuer: ${clerkIssuerDomain}`,
        `Convex backend issuer: ${sessionProbe.data.expectedIssuerDomain}`,
      ],
      expectedIssuerDomain: sessionProbe.data.expectedIssuerDomain,
      clerkIssuerDomain,
      hasConvexTemplateToken,
    };
  }

  return {
    status: "token_not_accepted",
    title: "Convex still is not accepting the Clerk token",
    description: "Clerk is issuing a `convex` token, but Convex still has no authenticated identity for this session.",
    details: [
      "Re-sync the cloud dev deployment after updating Clerk auth settings.",
      "If this keeps failing, inspect the deployment auth config and JWT template claims together.",
    ],
    expectedIssuerDomain: sessionProbe.data?.expectedIssuerDomain ?? null,
    clerkIssuerDomain,
    hasConvexTemplateToken,
  };
}
