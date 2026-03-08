import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { ADMIN_EMAILS, readStoredPerspective, type ViewerPerspective } from '@/lib/perspective';

interface AuthContextType {
  user: any | null;
  actualUser: any | null;
  session: any | null;
  role: 'admin' | 'user' | null;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn, openSignUp } = useClerk();
  const [storedPerspective, setStoredPerspective] = useState<ViewerPerspective>(() => readStoredPerspective());

  const isLoading = !isLoaded;
  const actualIsAuthenticated = !!isSignedIn;

  useEffect(() => {
    const syncPerspective = () => {
      setStoredPerspective(readStoredPerspective());
    };

    window.addEventListener('storage', syncPerspective);
    window.addEventListener('viewer-perspective-change', syncPerspective);

    return () => {
      window.removeEventListener('storage', syncPerspective);
      window.removeEventListener('viewer-perspective-change', syncPerspective);
    };
  }, []);

  // These open Clerk's modal — the actual form UI is handled by Clerk components
  const signIn = async (_email: string, _password: string) => {
    openSignIn();
  };

  const signUp = async (_email: string, _password: string, _username: string) => {
    openSignUp();
  };

  const signOut = async () => {
    await clerkSignOut();
  };

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
    null;
  const isAdmin = !!primaryEmail && ADMIN_EMAILS.has(primaryEmail);
  const perspective: ViewerPerspective = !actualIsAuthenticated
    ? 'basic'
    : isAdmin
      ? storedPerspective
      : 'user';
  const effectiveUser = perspective === 'basic' ? null : (user ?? null);
  const isAuthenticated = !!effectiveUser;
  const role: 'admin' | 'user' | null = perspective === 'dev' && isAdmin
    ? 'admin'
    : effectiveUser
      ? 'user'
      : null;

  const contextValue = useMemo(() => ({
    user: effectiveUser,
    actualUser: user ?? null,
    session: null,
    role,
    profile: null,
    signIn,
    signUp,
    signOut,
    isLoading,
    actualIsAuthenticated,
    isAuthenticated,
    isAdmin,
    perspective,
  }), [actualIsAuthenticated, effectiveUser, isAdmin, isAuthenticated, isLoading, perspective, role, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};