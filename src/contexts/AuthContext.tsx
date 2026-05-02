import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import {
  ADMIN_EMAILS,
  PERSPECTIVE_STORAGE_KEY,
  readStoredPerspective,
  type ViewerPerspective,
} from "@/lib/perspective";

interface AuthContextType {
  user: any | null;
  actualUser: any | null;
  session: any | null;
  role: "admin" | "user" | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  actualIsAuthenticated: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  perspective: ViewerPerspective;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CLERK_AUTH_REDIRECT_URL = "/";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function clerkProfile(user: any | null) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0],
    display_name: user.fullName || user.username,
    avatar_url: user.imageUrl,
    member_since: user.createdAt,
    created_at: user.createdAt,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn, openSignUp } = useClerk();
  const [storedPerspective, setStoredPerspective] = useState<ViewerPerspective>(() => readStoredPerspective());
  const previousAuthRef = useRef(false);
  const previousAdminRef = useRef(false);

  const isLoading = !isLoaded;
  const actualIsAuthenticated = !!isSignedIn;

  useEffect(() => {
    const syncPerspective = () => {
      setStoredPerspective(readStoredPerspective());
    };

    window.addEventListener("storage", syncPerspective);
    window.addEventListener("viewer-perspective-change", syncPerspective);

    return () => {
      window.removeEventListener("storage", syncPerspective);
      window.removeEventListener("viewer-perspective-change", syncPerspective);
    };
  }, []);

  const signIn = async (_email: string, _password: string) => {
    openSignIn({
      fallbackRedirectUrl: CLERK_AUTH_REDIRECT_URL,
      forceRedirectUrl: CLERK_AUTH_REDIRECT_URL,
    });
  };

  const signUp = async (_email: string, _password: string, _username: string) => {
    openSignUp({
      fallbackRedirectUrl: CLERK_AUTH_REDIRECT_URL,
      forceRedirectUrl: CLERK_AUTH_REDIRECT_URL,
    });
  };

  const signOut = async () => {
    await clerkSignOut();
  };

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
    null;
  const isAdmin = !!primaryEmail && ADMIN_EMAILS.has(primaryEmail);

  useEffect(() => {
    if (isLoading) return;

    const wasAuthenticated = previousAuthRef.current;
    const wasAdmin = previousAdminRef.current;
    const justSignedIn = !wasAuthenticated && actualIsAuthenticated;
    const justBecameAdmin = !wasAdmin && isAdmin;

    const syncPerspective = (nextPerspective: ViewerPerspective) => {
      if (storedPerspective === nextPerspective) return;
      window.localStorage.setItem(PERSPECTIVE_STORAGE_KEY, nextPerspective);
      window.dispatchEvent(new Event("viewer-perspective-change"));
      setStoredPerspective(nextPerspective);
    };

    if (!actualIsAuthenticated) {
      syncPerspective("basic");
    } else if (!isAdmin) {
      syncPerspective("user");
    } else if (justSignedIn || justBecameAdmin) {
      syncPerspective("dev");
    }

    previousAuthRef.current = actualIsAuthenticated;
    previousAdminRef.current = isAdmin;
  }, [actualIsAuthenticated, isAdmin, isLoading, storedPerspective]);

  const perspective: ViewerPerspective = isLoading
    ? storedPerspective
    : !actualIsAuthenticated
      ? "basic"
      : isAdmin
        ? storedPerspective
        : "user";
  const effectiveUser = perspective === "basic" ? null : (user ?? null);
  const isAuthenticated = !!effectiveUser;
  const role: "admin" | "user" | null = perspective === "dev" && isAdmin
    ? "admin"
    : effectiveUser
      ? "user"
      : null;
  const profile = useMemo(() => clerkProfile(user ?? null), [user]);

  const contextValue = useMemo(() => ({
    user: effectiveUser,
    actualUser: user ?? null,
    session: null,
    role,
    profile,
    signIn,
    signUp,
    signOut,
    isLoading,
    actualIsAuthenticated,
    isAuthenticated,
    isAdmin,
    perspective,
  }), [
    actualIsAuthenticated,
    effectiveUser,
    isAdmin,
    isAuthenticated,
    isLoading,
    perspective,
    profile,
    role,
    user,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
